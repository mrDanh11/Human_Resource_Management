using AutoMapper;
using HRMApi.Data;
using HRMApi.DTOs.Attendance;
using HRMApi.Models;
using HRMApi.Repositories;
using Microsoft.EntityFrameworkCore;

namespace HRMApi.Services;

public class AttendanceService : IAttendanceService
{
    private readonly IAttendanceRepository _attendanceRepository;
    private readonly HrmDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<AttendanceService> _logger;

    // Company policy settings (có thể move vào config)
    private readonly TimeSpan _standardCheckinTime = new TimeSpan(8, 30, 0); // 8:30 AM
    private readonly TimeSpan _standardCheckoutTime = new TimeSpan(17, 30, 0); // 5:30 PM
    private readonly int _lateThresholdMinutes = 15; // Muộn > 15 phút
    private readonly int _earlyLeaveThresholdMinutes = 15; // Về sớm > 15 phút

    public AttendanceService(
        IAttendanceRepository attendanceRepository,
        HrmDbContext context,
        IMapper mapper,
        ILogger<AttendanceService> logger)
    {
        _attendanceRepository = attendanceRepository;
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    // ============================================
    // EMPLOYEE METHODS
    // ============================================

    public async Task<TimesheetSummaryDto> GetMyTimesheetAsync(int employeeId, DateOnly? fromDate, DateOnly? toDate)
    {
        var employee = await _context.Employees
            .FirstOrDefaultAsync(e => e.Id == employeeId);

        if (employee == null)
            throw new KeyNotFoundException("Employee not found");

        var attendances = await _attendanceRepository.GetByEmployeeIdAsync(employeeId, fromDate, toDate);

        var attendanceResponses = attendances.Select(a => MapToResponseDto(a, employee)).ToList();

        var summary = new TimesheetSummaryDto
        {
            EmployeeId = employeeId,
            EmployeeName = employee.Fullname,
            FromDate = fromDate ?? DateOnly.MinValue,
            ToDate = toDate ?? DateOnly.MaxValue,
            TotalWorkingDays = attendances.Count,
            PresentDays = attendances.Count(a => a.Status == "present"),
            AbsentDays = attendances.Count(a => a.Status == "absent"),
            LateDays = attendances.Count(a => a.Status == "late"),
            HalfDays = attendances.Count(a => a.Status == "half_day"),
            WfhDays = attendances.Count(a => a.Status == "wfh"),
            TotalWorkHours = attendances.Sum(a => a.WorkHours ?? 0),
            TotalOvertimeHours = attendances.Sum(a => a.OvertimeHours ?? 0),
            Attendances = attendanceResponses
        };

        if (summary.TotalWorkingDays > 0)
        {
            summary.AverageWorkHoursPerDay = summary.TotalWorkHours / summary.TotalWorkingDays;
        }

        return summary;
    }

    public async Task<AttendanceResponseDto?> GetAttendanceByDateAsync(int employeeId, DateOnly date)
    {
        var attendance = await _attendanceRepository.GetByEmployeeAndDateAsync(employeeId, date);

        if (attendance == null)
            return null;

        return MapToResponseDto(attendance, attendance.Employee);
    }

    public async Task<List<AttendanceResponseDto>> GetMyAttendanceHistoryAsync(int employeeId, DateOnly? fromDate, DateOnly? toDate)
    {
        var employee = await _context.Employees
            .FirstOrDefaultAsync(e => e.Id == employeeId);

        if (employee == null)
            throw new KeyNotFoundException("Employee not found");

        var attendances = await _attendanceRepository.GetByEmployeeIdAsync(employeeId, fromDate, toDate);

        return attendances.Select(a => MapToResponseDto(a, employee)).ToList();
    }

    public async Task<AttendanceStatisticsDto> GetMyAttendanceStatisticsAsync(int employeeId, int year, int month)
    {
        var employee = await _context.Employees
            .FirstOrDefaultAsync(e => e.Id == employeeId);

        if (employee == null)
            throw new KeyNotFoundException("Employee not found");

        var fromDate = new DateOnly(year, month, 1);
        var toDate = fromDate.AddMonths(1).AddDays(-1);

        var attendances = await _attendanceRepository.GetByEmployeeIdAsync(employeeId, fromDate, toDate);

        var totalLateMinutes = 0;
        var lateDaysCount = 0;

        foreach (var attendance in attendances)
        {
            if (attendance.CheckinTime.HasValue)
            {
                var checkinTimeOnly = attendance.CheckinTime.Value.TimeOfDay;
                if (checkinTimeOnly > _standardCheckinTime)
                {
                    var lateMinutes = (int)(checkinTimeOnly - _standardCheckinTime).TotalMinutes;
                    if (lateMinutes > _lateThresholdMinutes)
                    {
                        totalLateMinutes += lateMinutes;
                        lateDaysCount++;
                    }
                }
            }
        }

        var presentDays = attendances.Count(a => a.Status == "present" || a.Status == "late");

        return new AttendanceStatisticsDto
        {
            EmployeeId = employeeId,
            EmployeeName = employee.Fullname,
            Year = year,
            Month = month,
            TotalWorkingDays = attendances.Count,
            PresentDays = presentDays,
            AbsentDays = attendances.Count(a => a.Status == "absent"),
            LateDays = attendances.Count(a => a.Status == "late"),
            WfhDays = attendances.Count(a => a.Status == "wfh"),
            TotalWorkHours = attendances.Sum(a => a.WorkHours ?? 0),
            TotalOvertimeHours = attendances.Sum(a => a.OvertimeHours ?? 0),
            AttendanceRate = presentDays > 0 ? (decimal)presentDays / attendances.Count * 100 : 0,
            TotalLateMinutes = totalLateMinutes,
            AverageLateMinutes = lateDaysCount > 0 ? totalLateMinutes / lateDaysCount : 0
        };
    }

    public async Task<int> CreateAttendanceCorrectionRequestAsync(
        int employeeId, 
        CreateAttendanceCorrectionRequestDto dto)
    {
        var existingAttendance = await _attendanceRepository.GetByEmployeeAndDateAsync(employeeId, dto.Date);

        if (existingAttendance == null)
            throw new InvalidOperationException("Attendance record not found for this date");

        var request = new Request
        {
            EmployeeId = employeeId,
            Type = "attendance_correction",
            Description = $"Correction request for {dto.Date}: {dto.Reason}",
            StartTime = dto.RequestedCheckinTime,
            EndTime = dto.RequestedCheckoutTime,
            Attachment = dto.Attachment,
            Status = "pending",
            CreatedAt = DateTime.UtcNow
        };

        _context.Requests.Add(request);
        await _context.SaveChangesAsync();

        _logger.LogInformation(
            "Attendance correction request created. RequestId: {RequestId}, EmployeeId: {EmployeeId}, Date: {Date}",
            request.Id, employeeId, dto.Date);

        return request.Id;
    }

    // ============================================
    // HR METHODS
    // ============================================

    public async Task<List<AttendanceResponseDto>> GetAllAttendancesAsync(AttendanceFilterDto filter)
    {
        var (attendances, _) = await _attendanceRepository.GetPagedAsync(
            filter.PageNumber,
            filter.PageSize,
            filter.EmployeeId,
            filter.FromDate,
            filter.ToDate,
            filter.Status
        );

        return attendances.Select(a => MapToResponseDto(a, a.Employee)).ToList();
    }

    public async Task<AttendanceResponseDto?> GetAttendanceByIdAsync(int id)
    {
        var attendance = await _attendanceRepository.GetByIdAsync(id);

        return attendance == null ? null : MapToResponseDto(attendance, attendance.Employee);
    }

    public async Task<AttendanceResponseDto> CreateAttendanceAsync(CreateAttendanceDto dto, int createdBy)
    {
        var exists = await _attendanceRepository.ExistsAsync(dto.EmployeeId, dto.Date);
        if (exists)
            throw new InvalidOperationException($"Attendance already exists for employee {dto.EmployeeId} on {dto.Date}");

        var employee = await _context.Employees.FindAsync(dto.EmployeeId);
        if (employee == null)
            throw new KeyNotFoundException("Employee not found");

        var attendance = _mapper.Map<Attendance>(dto);
        
        // Tự động tính toán WorkHours và Overtime nếu có Checkin/Checkout và user không nhập tay
        if (attendance.CheckinTime.HasValue && attendance.CheckoutTime.HasValue)
        {
            if (!dto.WorkHours.HasValue) 
            {
                var metrics = CalculateAttendanceMetrics(attendance.CheckinTime, attendance.CheckoutTime);
                attendance.WorkHours = metrics.WorkHours;
                attendance.OvertimeHours = metrics.OvertimeHours;
            }
        }

        var created = await _attendanceRepository.AddAsync(attendance);

        _logger.LogInformation(
            "Attendance created manually. Id: {Id}, EmployeeId: {EmployeeId}, Date: {Date}, CreatedBy: {CreatedBy}",
            created.Id, dto.EmployeeId, dto.Date, createdBy);

        return MapToResponseDto(created, employee);
    }

    public async Task<AttendanceResponseDto> UpdateAttendanceAsync(int id, UpdateAttendanceDto dto, int updatedBy)
    {
        var attendance = await _attendanceRepository.GetByIdAsync(id);

        if (attendance == null)
            throw new KeyNotFoundException("Attendance not found");

        _mapper.Map(dto, attendance);

        // Tính lại WorkHours và Overtime nếu thời gian thay đổi VÀ không nhập cứng WorkHours
        if ((dto.CheckinTime.HasValue || dto.CheckoutTime.HasValue) && !dto.WorkHours.HasValue)
        {
            if (attendance.CheckinTime.HasValue && attendance.CheckoutTime.HasValue)
            {
                var metrics = CalculateAttendanceMetrics(attendance.CheckinTime, attendance.CheckoutTime);
                attendance.WorkHours = metrics.WorkHours;
                attendance.OvertimeHours = metrics.OvertimeHours;
            }
            else 
            {
                // Nếu thiếu 1 trong 2 đầu thì reset về 0
                attendance.WorkHours = 0;
                attendance.OvertimeHours = 0;
            }
        }

        attendance.UpdatedAt = DateTime.UtcNow;

        await _attendanceRepository.UpdateAsync(attendance);

        _logger.LogInformation(
            "Attendance updated. Id: {Id}, EmployeeId: {EmployeeId}, UpdatedBy: {UpdatedBy}",
            id, attendance.EmployeeId, updatedBy);

        return MapToResponseDto(attendance, attendance.Employee);
    }

    public async Task<bool> DeleteAttendanceAsync(int id)
    {
        var exists = await _attendanceRepository.ExistsByIdAsync(id);
        if (!exists)
            return false;

        await _attendanceRepository.DeleteAsync(id);

        _logger.LogInformation("Attendance deleted. Id: {Id}", id);

        return true;
    }

    public async Task<BulkCreateAttendanceResultDto> BulkCreateAttendancesAsync(
        List<CreateAttendanceDto> dtos, 
        int createdBy)
    {
        var result = new BulkCreateAttendanceResultDto
        {
            TotalRecords = dtos.Count
        };

        foreach (var dto in dtos)
        {
            try
            {
                var exists = await CheckAttendanceExistsAsync(dto.EmployeeId, dto.Date);
                if (exists)
                {
                    result.FailedCount++;
                    result.Errors.Add($"Employee {dto.EmployeeId} - {dto.Date}: Already exists");
                    continue;
                }

                var created = await CreateAttendanceAsync(dto, createdBy);
                result.CreatedAttendances.Add(created);
                result.SuccessCount++;
            }
            catch (Exception ex)
            {
                result.FailedCount++;
                result.Errors.Add($"Employee {dto.EmployeeId} - {dto.Date}: {ex.Message}");
                _logger.LogError(ex, "Failed to create attendance for employee {EmployeeId} on {Date}", 
                    dto.EmployeeId, dto.Date);
            }
        }

        _logger.LogInformation(
            "Bulk attendance creation completed. Total: {Total}, Success: {Success}, Failed: {Failed}",
            result.TotalRecords, result.SuccessCount, result.FailedCount);

        return result;
    }

    // ============================================
    // SYSTEM METHODS
    // ============================================

    public async Task<AttendanceResponseDto> SyncFromDeviceAsync(SyncAttendanceFromDeviceDto dto)
    {
        var employee = await _context.Employees.FindAsync(dto.EmployeeId);
        if (employee == null)
            throw new KeyNotFoundException("Employee not found");

        var existingAttendance = await _attendanceRepository.GetByEmployeeAndDateAsync(dto.EmployeeId, dto.Date);

        // Tính toán Metrics (CalculateAttendanceMetrics đã được update để nhận nullable)
        var metrics = CalculateAttendanceMetrics(dto.CheckinTime, dto.CheckoutTime);

        if (existingAttendance != null)
        {
            existingAttendance.CheckinTime = dto.CheckinTime;
            existingAttendance.CheckoutTime = dto.CheckoutTime;
            
            // Cập nhật cả 2 trường
            existingAttendance.WorkHours = metrics.WorkHours;
            existingAttendance.OvertimeHours = metrics.OvertimeHours;
            
            existingAttendance.Status = DetermineStatus(dto.CheckinTime);
            existingAttendance.UpdatedAt = DateTime.UtcNow;
            
            await _attendanceRepository.UpdateAsync(existingAttendance);

            _logger.LogInformation(
                "Attendance synced from device. Id: {Id}, EmployeeId: {EmployeeId}, DeviceId: {DeviceId}",
                existingAttendance.Id, dto.EmployeeId, dto.DeviceId);

            return MapToResponseDto(existingAttendance, employee);
        }

        var attendance = _mapper.Map<Attendance>(dto);
        
        // Set cả 2 trường
        attendance.WorkHours = metrics.WorkHours;
        attendance.OvertimeHours = metrics.OvertimeHours;
        
        attendance.Status = DetermineStatus(dto.CheckinTime);

        var created = await _attendanceRepository.AddAsync(attendance);

        _logger.LogInformation(
            "New attendance synced from device. Id: {Id}, EmployeeId: {EmployeeId}, DeviceId: {DeviceId}",
            created.Id, dto.EmployeeId, dto.DeviceId);

        return MapToResponseDto(created, employee);
    }

    // ============================================
    // UTILITY METHODS
    // ============================================

    public async Task<bool> CheckAttendanceExistsAsync(int employeeId, DateOnly date)
    {
        return await _attendanceRepository.ExistsAsync(employeeId, date);
    }

    private AttendanceResponseDto MapToResponseDto(Attendance attendance, Employee employee)
    {
        var isLate = false;
        var isEarlyLeave = false;
        TimeSpan? lateMinutes = null;
        TimeSpan? earlyLeaveMinutes = null;

        if (attendance.CheckinTime.HasValue)
        {
            var checkinTimeOnly = attendance.CheckinTime.Value.TimeOfDay;
            if (checkinTimeOnly > _standardCheckinTime)
            {
                var lateDuration = checkinTimeOnly - _standardCheckinTime;
                if (lateDuration.TotalMinutes > _lateThresholdMinutes)
                {
                    isLate = true;
                    lateMinutes = lateDuration;
                }
            }
        }

        if (attendance.CheckoutTime.HasValue)
        {
            var checkoutTimeOnly = attendance.CheckoutTime.Value.TimeOfDay;
            if (checkoutTimeOnly < _standardCheckoutTime)
            {
                var earlyDuration = _standardCheckoutTime - checkoutTimeOnly;
                if (earlyDuration.TotalMinutes > _earlyLeaveThresholdMinutes)
                {
                    isEarlyLeave = true;
                    earlyLeaveMinutes = earlyDuration;
                }
            }
        }

        return new AttendanceResponseDto
        {
            Id = attendance.Id,
            EmployeeId = attendance.EmployeeId,
            EmployeeName = employee.Fullname,
            EmployeeEmail = employee.Email,
            Date = attendance.Date,
            CheckinTime = attendance.CheckinTime,
            CheckoutTime = attendance.CheckoutTime,
            Status = attendance.Status,
            Attachment = attendance.Attachment,
            WorkHours = attendance.WorkHours,
            OvertimeHours = attendance.OvertimeHours,
            Note = attendance.Note,
            CreatedAt = attendance.CreatedAt,
            UpdatedAt = attendance.UpdatedAt,
            IsLate = isLate,
            IsEarlyLeave = isEarlyLeave,
            LateMinutes = lateMinutes,
            EarlyLeaveMinutes = earlyLeaveMinutes
        };
    }

    /// <summary>
    /// Tính WorkHours và OvertimeHours.
    /// Update: Chấp nhận nullable DateTime để tương thích với dữ liệu từ thiết bị.
    /// </summary>
    private (decimal WorkHours, decimal OvertimeHours) CalculateAttendanceMetrics(DateTime? checkin, DateTime? checkout)
    {
        // Nếu thiếu 1 trong 2 thì trả về 0
        if (!checkin.HasValue || !checkout.HasValue)
        {
            return (0, 0);
        }

        var checkinVal = checkin.Value;
        var checkoutVal = checkout.Value;
        var date = checkinVal.Date;

        var standardStart = date.Add(_standardCheckinTime); // 08:30
        var standardEnd = date.Add(_standardCheckoutTime);   // 17:30

        // 1. TÍNH WORK HOURS (Cắt đầu cắt đuôi theo giờ hành chính)
        var effectiveStart = checkinVal < standardStart ? standardStart : checkinVal;
        var effectiveEnd = checkoutVal > standardEnd ? standardEnd : checkoutVal;

        double workHours = 0;
        
        if (effectiveEnd > effectiveStart)
        {
            var duration = effectiveEnd - effectiveStart;
            
            // Trừ 1h nghỉ trưa nếu làm > 4h
            if (duration.TotalHours > 4)
            {
                duration = duration.Subtract(TimeSpan.FromHours(1));
            }
            
            workHours = Math.Max(0, duration.TotalHours);
        }

        // 2. TÍNH OVERTIME (Chỉ phần dư ra sau 17:30)
        double overtimeHours = 0;
        if (checkoutVal > standardEnd)
        {
            var otDuration = checkoutVal - standardEnd;
            overtimeHours = otDuration.TotalHours;
        }

        return ((decimal)Math.Round(workHours, 2), (decimal)Math.Round(overtimeHours, 2));
    }

    private string DetermineStatus(DateTime checkinTime)
    {
        var checkinTimeOnly = checkinTime.TimeOfDay;
        
        if (checkinTimeOnly > _standardCheckinTime.Add(TimeSpan.FromMinutes(_lateThresholdMinutes)))
        {
            return "late";
        }

        return "present";
    }
}