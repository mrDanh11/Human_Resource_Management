using HRMApi.Data;
using HRMApi.DTOs;
using HRMApi.Models;
using HRMApi.Repositories;
using Microsoft.EntityFrameworkCore;

namespace HRMApi.Services;

public class AttendanceService : IAttendanceService
{
    private readonly IAttendanceRepository _attendanceRepository;
    private readonly HrmDbContext _context;
    private readonly ILogger<AttendanceService> _logger;

    public AttendanceService(
        IAttendanceRepository attendanceRepository,
        HrmDbContext context,
        ILogger<AttendanceService> logger)
    {
        _attendanceRepository = attendanceRepository;
        _context = context;
        _logger = logger;
    }

    public async Task<PagedResult<AttendanceListDto>> GetAttendancesAsync(
        int pageNumber,
        int pageSize,
        int? employeeId = null,
        DateOnly? startDate = null,
        DateOnly? endDate = null,
        string? status = null)
    {
        try
        {
            var (items, totalCount) = await _attendanceRepository.GetPagedAsync(
                pageNumber, pageSize, employeeId, startDate, endDate, status);

            var attendanceDtos = items.Select(a => new AttendanceListDto
            {
                Id = a.Id,
                EmployeeId = a.EmployeeId,
                EmployeeName = a.Employee?.Fullname ?? "",
                Date = a.Date,
                CheckinTime = a.CheckinTime,
                CheckoutTime = a.CheckoutTime,
                Status = a.Status,
                WorkHours = a.WorkHours,
                OvertimeHours = a.OvertimeHours,
                Note = a.Note
            }).ToList();

            return new PagedResult<AttendanceListDto>
            {
                Items = attendanceDtos,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting attendances list");
            throw;
        }
    }

    public async Task<AttendanceDetailDto?> GetAttendanceByIdAsync(int id)
    {
        try
        {
            var attendance = await _attendanceRepository.GetByIdAsync(id);

            if (attendance == null)
                return null;

            return new AttendanceDetailDto
            {
                Id = attendance.Id,
                EmployeeId = attendance.EmployeeId,
                EmployeeName = attendance.Employee?.Fullname ?? "",
                Date = attendance.Date,
                CheckinTime = attendance.CheckinTime,
                CheckoutTime = attendance.CheckoutTime,
                Status = attendance.Status,
                Attachment = attendance.Attachment,
                WorkHours = attendance.WorkHours,
                OvertimeHours = attendance.OvertimeHours,
                Note = attendance.Note,
                CreatedAt = attendance.CreatedAt,
                UpdatedAt = attendance.UpdatedAt
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting attendance {AttendanceId}", id);
            throw;
        }
    }

    public async Task<ApiResponse<AttendanceDetailDto>> CreateAttendanceAsync(CreateAttendanceDto dto)
    {
        try
        {
            // Kiểm tra nhân viên tồn tại
            var employeeExists = await _context.Employees.AnyAsync(e => e.Id == dto.EmployeeId);
            if (!employeeExists)
            {
                return ApiResponse<AttendanceDetailDto>.ErrorResponse(
                    "Không tìm thấy nhân viên",
                    new List<string> { $"Nhân viên với ID {dto.EmployeeId} không tồn tại" });
            }

            // Kiểm tra trùng lặp (một nhân viên chỉ có một bản ghi attendance cho mỗi ngày)
            var exists = await _attendanceRepository.ExistsAsync(dto.EmployeeId, dto.Date);
            if (exists)
            {
                return ApiResponse<AttendanceDetailDto>.ErrorResponse(
                    "Bản ghi đã tồn tại",
                    new List<string> { $"Đã có bản ghi chấm công cho nhân viên này vào ngày {dto.Date}" });
            }

            // Tính work_hours từ checkin và checkout time
            decimal? workHours = null;
            if (dto.CheckinTime.HasValue && dto.CheckoutTime.HasValue)
            {
                if (dto.CheckoutTime.Value <= dto.CheckinTime.Value)
                {
                    return ApiResponse<AttendanceDetailDto>.ErrorResponse(
                        "Thời gian không hợp lệ",
                        new List<string> { "Thời gian checkout phải sau thời gian checkin" });
                }

                var timeSpan = dto.CheckoutTime.Value - dto.CheckinTime.Value;
                workHours = (decimal)timeSpan.TotalHours;
            }

            var attendance = new Attendance
            {
                EmployeeId = dto.EmployeeId,
                Date = dto.Date,
                CheckinTime = dto.CheckinTime,
                CheckoutTime = dto.CheckoutTime,
                Status = dto.Status,
                Attachment = dto.Attachment,
                WorkHours = workHours,
                OvertimeHours = dto.OvertimeHours ?? 0,
                Note = dto.Note
            };

            var created = await _attendanceRepository.CreateAsync(attendance);

            var resultDto = new AttendanceDetailDto
            {
                Id = created.Id,
                EmployeeId = created.EmployeeId,
                EmployeeName = created.Employee?.Fullname ?? "",
                Date = created.Date,
                CheckinTime = created.CheckinTime,
                CheckoutTime = created.CheckoutTime,
                Status = created.Status,
                Attachment = created.Attachment,
                WorkHours = created.WorkHours,
                OvertimeHours = created.OvertimeHours,
                Note = created.Note,
                CreatedAt = created.CreatedAt,
                UpdatedAt = created.UpdatedAt
            };

            return ApiResponse<AttendanceDetailDto>.SuccessResponse(
                resultDto,
                "Tạo bản ghi chấm công thành công");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating attendance");
            return ApiResponse<AttendanceDetailDto>.ErrorResponse(
                "Lỗi khi tạo bản ghi chấm công",
                new List<string> { ex.Message });
        }
    }

    public async Task<ApiResponse<AttendanceDetailDto>> UpdateAttendanceAsync(int id, UpdateAttendanceDto dto)
    {
        try
        {
            var attendance = await _attendanceRepository.GetByIdAsync(id);
            if (attendance == null)
            {
                return ApiResponse<AttendanceDetailDto>.ErrorResponse(
                    "Không tìm thấy bản ghi chấm công",
                    new List<string> { $"Bản ghi chấm công với ID {id} không tồn tại" });
            }

            // Cập nhật các trường
            if (dto.CheckinTime.HasValue)
                attendance.CheckinTime = dto.CheckinTime;

            if (dto.CheckoutTime.HasValue)
                attendance.CheckoutTime = dto.CheckoutTime;

            if (!string.IsNullOrEmpty(dto.Status))
                attendance.Status = dto.Status;

            if (dto.Attachment != null)
                attendance.Attachment = dto.Attachment;

            if (dto.OvertimeHours.HasValue)
                attendance.OvertimeHours = dto.OvertimeHours;

            if (dto.Note != null)
                attendance.Note = dto.Note;

            // Tính lại work_hours nếu có checkin và checkout
            if (attendance.CheckinTime.HasValue && attendance.CheckoutTime.HasValue)
            {
                if (attendance.CheckoutTime.Value <= attendance.CheckinTime.Value)
                {
                    return ApiResponse<AttendanceDetailDto>.ErrorResponse(
                        "Thời gian không hợp lệ",
                        new List<string> { "Thời gian checkout phải sau thời gian checkin" });
                }

                var timeSpan = attendance.CheckoutTime.Value - attendance.CheckinTime.Value;
                attendance.WorkHours = (decimal)timeSpan.TotalHours;
            }
            else
            {
                attendance.WorkHours = null;
            }

            var updated = await _attendanceRepository.UpdateAsync(attendance);

            var resultDto = new AttendanceDetailDto
            {
                Id = updated.Id,
                EmployeeId = updated.EmployeeId,
                EmployeeName = updated.Employee?.Fullname ?? "",
                Date = updated.Date,
                CheckinTime = updated.CheckinTime,
                CheckoutTime = updated.CheckoutTime,
                Status = updated.Status,
                Attachment = updated.Attachment,
                WorkHours = updated.WorkHours,
                OvertimeHours = updated.OvertimeHours,
                Note = updated.Note,
                CreatedAt = updated.CreatedAt,
                UpdatedAt = updated.UpdatedAt
            };

            return ApiResponse<AttendanceDetailDto>.SuccessResponse(
                resultDto,
                "Cập nhật bản ghi chấm công thành công");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating attendance {AttendanceId}", id);
            return ApiResponse<AttendanceDetailDto>.ErrorResponse(
                "Lỗi khi cập nhật bản ghi chấm công",
                new List<string> { ex.Message });
        }
    }

    public async Task<ApiResponse<bool>> DeleteAttendanceAsync(int id)
    {
        try
        {
            var deleted = await _attendanceRepository.DeleteAsync(id);
            if (!deleted)
            {
                return ApiResponse<bool>.ErrorResponse(
                    "Không tìm thấy bản ghi chấm công",
                    new List<string> { $"Bản ghi chấm công với ID {id} không tồn tại" });
            }

            return ApiResponse<bool>.SuccessResponse(true, "Xóa bản ghi chấm công thành công");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting attendance {AttendanceId}", id);
            return ApiResponse<bool>.ErrorResponse(
                "Lỗi khi xóa bản ghi chấm công",
                new List<string> { ex.Message });
        }
    }
}
