using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HRMApi.DTOs.Attendance;

// ============================================
// REQUEST DTOs
// ============================================

/// <summary>
/// DTO để lọc và tìm kiếm attendance
/// </summary>
public class AttendanceFilterDto
{
    public int? EmployeeId { get; set; }
    public DateOnly? FromDate { get; set; }
    public DateOnly? ToDate { get; set; }
    public string? Status { get; set; } // present, absent, late, half_day, wfh
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

/// <summary>
/// DTO để tạo/cập nhật attendance thủ công (HR)
/// </summary>
public class CreateAttendanceDto
{
    [Required(ErrorMessage = "Employee ID is required")]
    public int EmployeeId { get; set; }

    [Required(ErrorMessage = "Date is required")]
    public DateOnly Date { get; set; }

    public DateTime? CheckinTime { get; set; }

    public DateTime? CheckoutTime { get; set; }

    [Required(ErrorMessage = "Status is required")]
    [RegularExpression("^(present|absent|late|half_day|wfh)$", 
        ErrorMessage = "Status must be: present, absent, late, half_day, or wfh")]
    public string Status { get; set; } = null!;

    public string? Attachment { get; set; }

    public decimal? WorkHours { get; set; }

    public decimal? OvertimeHours { get; set; }

    public string? Note { get; set; }
}

/// <summary>
/// DTO để cập nhật attendance (HR chỉnh sửa)
/// </summary>
public class UpdateAttendanceDto
{
    public DateTime? CheckinTime { get; set; }

    public DateTime? CheckoutTime { get; set; }

    [RegularExpression("^(present|absent|late|half_day|wfh)$", 
        ErrorMessage = "Status must be: present, absent, late, half_day, or wfh")]
    public string? Status { get; set; }

    public string? Attachment { get; set; }

    public decimal? WorkHours { get; set; }

    public decimal? OvertimeHours { get; set; }

    public string? Note { get; set; }
}

/// <summary>
/// DTO để nhập nhiều attendance cùng lúc (bulk import)
/// </summary>
public class BulkCreateAttendanceDto
{
    [Required]
    [MinLength(1, ErrorMessage = "At least one attendance record is required")]
    public List<CreateAttendanceDto> Attendances { get; set; } = new();
}

/// <summary>
/// DTO để tạo request chỉnh sửa attendance (employee)
/// </summary>
public class CreateAttendanceCorrectionRequestDto
{
    [Required(ErrorMessage = "Date is required")]
    public DateOnly Date { get; set; }

    public DateTime? RequestedCheckinTime { get; set; }

    public DateTime? RequestedCheckoutTime { get; set; }

    [Required(ErrorMessage = "Reason is required")]
    [StringLength(500, MinimumLength = 10, 
        ErrorMessage = "Reason must be between 10 and 500 characters")]
    public string Reason { get; set; } = null!;

    public string? Attachment { get; set; }
}

/// <summary>
/// DTO để đồng bộ từ máy chấm công
/// </summary>
public class SyncAttendanceFromDeviceDto
{
    [Required]
    public int EmployeeId { get; set; }

    [Required]
    public DateOnly Date { get; set; }

    [Required]
    public DateTime CheckinTime { get; set; }

    public DateTime? CheckoutTime { get; set; }

    public string? DeviceId { get; set; }
}

// ============================================
// RESPONSE DTOs
// ============================================

/// <summary>
/// DTO response cho attendance detail
/// </summary>
public class AttendanceResponseDto
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = null!;
    public string? EmployeeEmail { get; set; }
    public DateOnly Date { get; set; }
    public DateTime? CheckinTime { get; set; }
    public DateTime? CheckoutTime { get; set; }
    public string? Status { get; set; }
    public string? Attachment { get; set; }
    public decimal? WorkHours { get; set; }
    public decimal? OvertimeHours { get; set; }
    public string? Note { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    // Computed fields
    public bool IsLate { get; set; }
    public bool IsEarlyLeave { get; set; }
    public TimeSpan? LateMinutes { get; set; }
    public TimeSpan? EarlyLeaveMinutes { get; set; }
}

/// <summary>
/// DTO response cho timesheet summary
/// </summary>
public class TimesheetSummaryDto
{
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = null!;
    public DateOnly FromDate { get; set; }
    public DateOnly ToDate { get; set; }
    
    public int TotalWorkingDays { get; set; }
    public int PresentDays { get; set; }
    public int AbsentDays { get; set; }
    public int LateDays { get; set; }
    public int HalfDays { get; set; }
    public int WfhDays { get; set; }
    
    public decimal TotalWorkHours { get; set; }
    public decimal TotalOvertimeHours { get; set; }
    public decimal AverageWorkHoursPerDay { get; set; }
    
    public List<AttendanceResponseDto> Attendances { get; set; } = new();
}

/// <summary>
/// DTO response cho bulk import result
/// </summary>
public class BulkCreateAttendanceResultDto
{
    public int TotalRecords { get; set; }
    public int SuccessCount { get; set; }
    public int FailedCount { get; set; }
    public List<string> Errors { get; set; } = new();
    public List<AttendanceResponseDto> CreatedAttendances { get; set; } = new();
}

/// <summary>
/// DTO response cho attendance statistics
/// </summary>
public class AttendanceStatisticsDto
{
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = null!;
    public int Year { get; set; }
    public int Month { get; set; }
    
    public int TotalWorkingDays { get; set; }
    public int PresentDays { get; set; }
    public int AbsentDays { get; set; }
    public int LateDays { get; set; }
    public int WfhDays { get; set; }
    
    public decimal TotalWorkHours { get; set; }
    public decimal TotalOvertimeHours { get; set; }
    public decimal AttendanceRate { get; set; }
    
    public int TotalLateMinutes { get; set; }
    public int AverageLateMinutes { get; set; }
}