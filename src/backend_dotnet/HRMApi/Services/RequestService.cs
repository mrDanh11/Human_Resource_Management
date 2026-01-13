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

        // Bắt đầu transaction
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

            // Reload with details
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

        // Parse date from StartTime
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

        // Update attendance
        attendance.CheckinTime = request.StartTime;
        attendance.CheckoutTime = request.EndTime;
        
        // Recalculate work hours
        if (attendance.CheckinTime.HasValue && attendance.CheckoutTime.HasValue)
        {
            var duration = attendance.CheckoutTime.Value - attendance.CheckinTime.Value;
            if (duration.TotalHours > 4)
                duration = duration.Subtract(TimeSpan.FromHours(1)); // Lunch break
            
            attendance.WorkHours = (decimal)Math.Max(0, duration.TotalHours);
        }

        // Update status
        if (attendance.CheckinTime.HasValue)
        {
            var checkinTime = attendance.CheckinTime.Value.TimeOfDay;
            var standardTime = new TimeSpan(8, 30, 0);
            attendance.Status = checkinTime > standardTime.Add(TimeSpan.FromMinutes(15)) 
                ? "late" 
                : "present";
        }

        attendance.UpdatedAt = DateTime.UtcNow;
        attendance.Note = $"Updated from correction request #{request.Id}";

        await _attendanceRepository.UpdateAsync(attendance);

        _logger.LogInformation(
            "Attendance updated from request. AttendanceId: {AttendanceId}, RequestId: {RequestId}",
            attendance.Id, request.Id);
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

            // Try to get current attendance values
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