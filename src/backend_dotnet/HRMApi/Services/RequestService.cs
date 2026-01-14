using AutoMapper;
using HRMApi.Data;
using HRMApi.DTOs.Request;
using HRMApi.Models;
using HRMApi.Repositories;
using Microsoft.EntityFrameworkCore;

namespace HRMApi.Services;

public class RequestService : IRequestService
{
    private readonly IRequestRepository _requestRepository;
    private readonly IAttendanceRepository _attendanceRepository;
    private readonly HrmDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<RequestService> _logger;

    // Company policy - PHẢI GIỐNG AttendanceService
    private readonly TimeSpan _standardCheckinTime = new TimeSpan(8, 30, 0);
    private readonly TimeSpan _standardCheckoutTime = new TimeSpan(17, 30, 0);
    private readonly int _lateThresholdMinutes = 15;

    public RequestService(
        IRequestRepository requestRepository,
        IAttendanceRepository attendanceRepository,
        HrmDbContext context,
        IMapper mapper,
        ILogger<RequestService> logger)
    {
        _requestRepository = requestRepository;
        _attendanceRepository = attendanceRepository;
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    // ============================================
    // EMPLOYEE METHODS
    // ============================================

    public async Task<List<RequestResponseDto>> GetMyRequestsAsync(int employeeId)
    {
        var requests = await _requestRepository.GetByEmployeeIdAsync(employeeId);
        return requests.Select(MapToResponseDto).ToList();
    }

    public async Task<RequestResponseDto?> GetRequestByIdAsync(int id)
    {
        var request = await _requestRepository.GetByIdWithDetailsAsync(id);
        
        if (request == null)
            return null;

        return MapToResponseDto(request);
    }

    // ============================================
    // HR/MANAGER METHODS
    // ============================================

    public async Task<List<RequestResponseDto>> GetAllRequestsAsync(RequestFilterDto filter)
    {
        var (requests, _) = await _requestRepository.GetPagedAsync(
            filter.PageNumber,
            filter.PageSize,
            filter.EmployeeId,
            filter.Type,
            filter.Status,
            filter.FromDate,
            filter.ToDate
        );

        return requests.Select(MapToResponseDto).ToList();
    }

    public async Task<List<RequestResponseDto>> GetPendingRequestsAsync()
    {
        var requests = await _requestRepository.GetPendingRequestsAsync();
        return requests.Select(MapToResponseDto).ToList();
    }

    public async Task<bool> CancelRequestAsync(int requestId, int employeeId)
    {
        var request = await _requestRepository.GetByIdAsync(requestId);

        if (request == null)
        {
            throw new KeyNotFoundException("Không tìm thấy yêu cầu này.");
        }

        if (request.EmployeeId != employeeId)
        {
            throw new UnauthorizedAccessException("Bạn không có quyền hủy yêu cầu này.");
        }

        if (request.Status != "pending")
        {
            throw new InvalidOperationException($"Không thể hủy yêu cầu đang ở trạng thái '{request.Status}'. Chỉ có thể hủy khi đang chờ duyệt.");
        }

        request.Status = "cancelled";
        request.UpdatedAt = DateTime.UtcNow;

        await _requestRepository.UpdateAsync(request);

        _logger.LogInformation("Request {RequestId} cancelled by employee {EmployeeId}", requestId, employeeId);

        return true;
    }

    public async Task<RequestResponseDto> ProcessRequestAsync(
        int requestId, 
        ProcessRequestDto dto, 
        int approverId)
    {
        var request = await _requestRepository.GetByIdWithDetailsAsync(requestId);
        
        if (request == null)
            throw new KeyNotFoundException("Request not found");

        if (request.Status != "pending")
            throw new InvalidOperationException($"Request is already {request.Status}");

        await using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            // 1. Tạo approval history
            var approvalHistory = new ApprovalHistory
            {
                RequestId = requestId,
                ApproverId = approverId,
                Status = dto.Status,
                Note = dto.Note,
                CreatedAt = DateTime.UtcNow
            };

            _context.ApprovalHistories.Add(approvalHistory);

            // 2. Cập nhật request status
            request.Status = dto.Status;
            request.UpdatedAt = DateTime.UtcNow;
            await _requestRepository.UpdateAsync(request);

            // 3. Nếu là attendance correction và được approve
            if (dto.Status == "approved" 
                && request.Type == "attendance_correction" 
                && dto.AutoUpdateAttendance)
            {
                await UpdateAttendanceFromRequest(request);
            }

            await transaction.CommitAsync();

            _logger.LogInformation(
                "Request processed. RequestId: {RequestId}, Status: {Status}, ApproverId: {ApproverId}",
                requestId, dto.Status, approverId);

            request = await _requestRepository.GetByIdWithDetailsAsync(requestId);
            return MapToResponseDto(request!);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error processing request {RequestId}", requestId);
            throw;
        }
    }

    public async Task<BatchProcessResultDto> BatchProcessRequestsAsync(
        BatchProcessRequestDto dto, 
        int approverId)
    {
        var result = new BatchProcessResultDto
        {
            TotalRequests = dto.RequestIds.Count
        };

        foreach (var requestId in dto.RequestIds)
        {
            try
            {
                var processDto = new ProcessRequestDto
                {
                    Status = dto.Status,
                    Note = dto.Note,
                    AutoUpdateAttendance = dto.AutoUpdateAttendance
                };

                await ProcessRequestAsync(requestId, processDto, approverId);
                result.SuccessCount++;
            }
            catch (Exception ex)
            {
                result.FailedCount++;
                result.Errors.Add($"Request {requestId}: {ex.Message}");
                _logger.LogError(ex, "Failed to process request {RequestId}", requestId);
            }
        }

        _logger.LogInformation(
            "Batch process completed. Total: {Total}, Success: {Success}, Failed: {Failed}",
            result.TotalRequests, result.SuccessCount, result.FailedCount);

        return result;
    }

    // ============================================
    // STATISTICS
    // ============================================

    public async Task<RequestStatisticsDto> GetRequestStatisticsAsync()
    {
        var total = await _requestRepository.GetTotalRequestsCountAsync();
        var pending = await _requestRepository.GetPendingRequestsCountAsync();
        var byType = await _requestRepository.GetRequestCountsByTypeAsync();
        var byStatus = await _requestRepository.GetRequestCountsByStatusAsync();

        return new RequestStatisticsDto
        {
            TotalRequests = total,
            PendingRequests = pending,
            ApprovedRequests = byStatus.GetValueOrDefault("approved", 0),
            RejectedRequests = byStatus.GetValueOrDefault("rejected", 0),
            RequestsByType = byType,
            RequestsByStatus = byStatus
        };
    }

    // ============================================
    // DELETE
    // ============================================

    public async Task<bool> DeleteRequestAsync(int id)
    {
        var exists = await _requestRepository.ExistsByIdAsync(id);
        if (!exists)
            return false;

        await _requestRepository.DeleteAsync(id);
        _logger.LogInformation("Request deleted. Id: {Id}", id);
        return true;
    }

    // ============================================
    // PRIVATE HELPER METHODS
    // ============================================

    private async Task UpdateAttendanceFromRequest(Request request)
    {
        if (request.StartTime == null || request.EndTime == null)
            return;

        var date = DateOnly.FromDateTime(request.StartTime.Value);
        
        var attendance = await _attendanceRepository.GetByEmployeeAndDateAsync(
            request.EmployeeId, date);

        if (attendance == null)
        {
            _logger.LogWarning(
                "Attendance not found for correction. EmployeeId: {EmployeeId}, Date: {Date}",
                request.EmployeeId, date);
            return;
        }

        // Cập nhật check-in/out time
        attendance.CheckinTime = request.StartTime;
        attendance.CheckoutTime = request.EndTime;
        
        // Tính work_hours VÀ overtime_hours theo logic mới
        var (workHours, overtimeHours) = CalculateAttendanceMetrics(
            request.StartTime.Value, 
            request.EndTime.Value);
        
        attendance.WorkHours = workHours;
        attendance.OvertimeHours = overtimeHours;

        // Update status
        if (attendance.CheckinTime.HasValue)
        {
            var checkinTime = attendance.CheckinTime.Value.TimeOfDay;
            attendance.Status = checkinTime > _standardCheckinTime.Add(TimeSpan.FromMinutes(_lateThresholdMinutes)) 
                ? "late" 
                : "present";
        }

        attendance.UpdatedAt = DateTime.UtcNow;
        attendance.Note = $"Updated from correction request #{request.Id}";

        await _attendanceRepository.UpdateAsync(attendance);

        _logger.LogInformation(
            "Attendance updated from request. AttendanceId: {AttendanceId}, RequestId: {RequestId}, WorkHours: {WorkHours}, OvertimeHours: {OvertimeHours}",
            attendance.Id, request.Id, workHours, overtimeHours);
    }

    /// <summary>
    /// Tính WorkHours và OvertimeHours theo quy tắc:
    /// - WorkHours: Giao của [CheckIn, CheckOut] và [08:30, 17:30].
    /// - OvertimeHours: Phần dư sau 17:30.
    /// </summary>
    private (decimal WorkHours, decimal OvertimeHours) CalculateAttendanceMetrics(DateTime checkin, DateTime checkout)
    {
        var date = checkin.Date;
        var standardStart = date.Add(_standardCheckinTime); // 08:30
        var standardEnd = date.Add(_standardCheckoutTime);   // 17:30

        // 1. TÍNH WORK HOURS (Chỉ tính trong khung giờ hành chính)
        // Nếu checkin sớm hơn 8:30, lấy 8:30. Nếu trễ hơn, lấy giờ thực tế.
        var effectiveStart = checkin < standardStart ? standardStart : checkin;
        
        // Nếu checkout trễ hơn 17:30, chỉ tính đến 17:30 cho WorkHours.
        var effectiveEnd = checkout > standardEnd ? standardEnd : checkout;

        double workHours = 0;
        
        // Chỉ tính nếu thời gian check-out sau thời gian check-in hợp lệ
        if (effectiveEnd > effectiveStart)
        {
            var duration = effectiveEnd - effectiveStart;
            
            // Trừ giờ nghỉ trưa (1 tiếng) nếu làm việc trên 4 tiếng
            if (duration.TotalHours > 4)
            {
                duration = duration.Subtract(TimeSpan.FromHours(1));
            }
            
            workHours = Math.Max(0, duration.TotalHours);
        }

        // 2. TÍNH OVERTIME (Chỉ tính thời gian làm sau 17:30)
        double overtimeHours = 0;
        if (checkout > standardEnd)
        {
            var otDuration = checkout - standardEnd;
            overtimeHours = otDuration.TotalHours;
        }

        return ((decimal)Math.Round(workHours, 2), (decimal)Math.Round(overtimeHours, 2));
    }

    private RequestResponseDto MapToResponseDto(Request request)
    {
        var dto = new RequestResponseDto
        {
            Id = request.Id,
            EmployeeId = request.EmployeeId,
            EmployeeName = request.Employee.Fullname,
            EmployeeEmail = request.Employee.Email,
            DepartmentName = request.Employee.Department?.Name,
            Description = request.Description,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            Type = request.Type,
            TypeDisplay = GetTypeDisplay(request.Type),
            Attachment = request.Attachment,
            Status = request.Status ?? "pending",
            StatusDisplay = GetStatusDisplay(request.Status ?? "pending"),
            CreatedAt = request.CreatedAt,
            UpdatedAt = request.UpdatedAt,
            ApprovalHistories = request.ApprovalHistories
                .OrderByDescending(ah => ah.CreatedAt)
                .Select(ah => new ApprovalHistoryDto
                {
                    Id = ah.Id,
                    ApproverId = ah.ApproverId,
                    ApproverName = ah.Approver.Fullname,
                    Status = ah.Status,
                    StatusDisplay = GetStatusDisplay(ah.Status),
                    Note = ah.Note,
                    CreatedAt = ah.CreatedAt
                })
                .ToList()
        };

        // Add attendance detail for correction requests
        if (request.Type == "attendance_correction" && request.StartTime.HasValue)
        {
            dto.AttendanceDetail = new AttendanceCorrectionDetailDto
            {
                Date = DateOnly.FromDateTime(request.StartTime.Value),
                RequestedCheckinTime = request.StartTime,
                RequestedCheckoutTime = request.EndTime
            };

            var date = DateOnly.FromDateTime(request.StartTime.Value);
            var attendance = _attendanceRepository.GetByEmployeeAndDateAsync(
                request.EmployeeId, date).Result;

            if (attendance != null)
            {
                dto.AttendanceDetail.CurrentCheckinTime = attendance.CheckinTime;
                dto.AttendanceDetail.CurrentCheckoutTime = attendance.CheckoutTime;
                dto.AttendanceDetail.CurrentWorkHours = attendance.WorkHours;
                dto.AttendanceDetail.CurrentStatus = attendance.Status;
            }
        }

        return dto;
    }

    private static string GetTypeDisplay(string type)
    {
        return type?.ToLower() switch
        {
            "wfh" => "Làm từ xa",
            "leave" => "Nghỉ phép",
            "overtime" => "Làm thêm giờ",
            "attendance_correction" => "Chỉnh sửa chấm công",
            "equipment" => "Thiết bị",
            "other" => "Khác",
            _ => type ?? "Không xác định"
        };
    }

    private static string GetStatusDisplay(string status)
    {
        return status?.ToLower() switch
        {
            "pending" => "Chờ duyệt",
            "approved" => "Đã duyệt",
            "rejected" => "Đã từ chối",
            _ => status ?? "Không xác định"
        };
    }
}