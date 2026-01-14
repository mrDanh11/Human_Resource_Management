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
public class CreateAttendanceDto : IValidatableObject
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

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        // Validate CheckinTime must be on the same date
        if (CheckinTime.HasValue)
        {
            var checkinDate = DateOnly.FromDateTime(CheckinTime.Value);
            if (checkinDate != Date)
            {
                yield return new ValidationResult(
                    $"CheckinTime must be on {Date}, but got {checkinDate}",
                    new[] { nameof(CheckinTime) });
            }
        }

        // Validate CheckoutTime must be on the same date (or next day for night shift)
        if (CheckoutTime.HasValue)
        {
            var checkoutDate = DateOnly.FromDateTime(CheckoutTime.Value);
            var nextDay = Date.AddDays(1);
            
            if (checkoutDate != Date && checkoutDate != nextDay)
            {
                yield return new ValidationResult(
                    $"CheckoutTime must be on {Date} or {nextDay} (for night shift), but got {checkoutDate}",
                    new[] { nameof(CheckoutTime) });
            }
        }

        // Validate CheckoutTime must be after CheckinTime
        if (CheckinTime.HasValue && CheckoutTime.HasValue)
        {
            if (CheckoutTime.Value <= CheckinTime.Value)
            {
                yield return new ValidationResult(
                    "CheckoutTime must be after CheckinTime",
                    new[] { nameof(CheckoutTime) });
            }

            // Validate reasonable work duration (not more than 24 hours)
            var duration = CheckoutTime.Value - CheckinTime.Value;
            if (duration.TotalHours > 24)
            {
                yield return new ValidationResult(
                    "Work duration cannot exceed 24 hours",
                    new[] { nameof(CheckoutTime) });
            }
        }

        // Validate WorkHours if provided
        if (WorkHours.HasValue)
        {
            if (WorkHours.Value < 0 || WorkHours.Value > 24)
            {
                yield return new ValidationResult(
                    "WorkHours must be between 0 and 24",
                    new[] { nameof(WorkHours) });
            }
        }

        // Validate OvertimeHours if provided
        if (OvertimeHours.HasValue)
        {
            if (OvertimeHours.Value < 0 || OvertimeHours.Value > 12)
            {
                yield return new ValidationResult(
                    "OvertimeHours must be between 0 and 12",
                    new[] { nameof(OvertimeHours) });
            }
        }

        // Date cannot be in the future
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        if (Date > today)
        {
            yield return new ValidationResult(
                "Cannot create attendance for future dates",
                new[] { nameof(Date) });
        }
    }
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
public class CreateAttendanceCorrectionRequestDto : IValidatableObject
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

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        // Validate RequestedCheckinTime must be on the same date
        if (RequestedCheckinTime.HasValue)
        {
            var checkinDate = DateOnly.FromDateTime(RequestedCheckinTime.Value);
            if (checkinDate != Date)
            {
                yield return new ValidationResult(
                    $"RequestedCheckinTime must be on {Date}, but got {checkinDate}",
                    new[] { nameof(RequestedCheckinTime) });
            }
        }

        // Validate RequestedCheckoutTime must be on the same date
        if (RequestedCheckoutTime.HasValue)
        {
            var checkoutDate = DateOnly.FromDateTime(RequestedCheckoutTime.Value);
            if (checkoutDate != Date)
            {
                yield return new ValidationResult(
                    $"RequestedCheckoutTime must be on {Date}, but got {checkoutDate}",
                    new[] { nameof(RequestedCheckoutTime) });
            }
        }

        // Validate CheckoutTime must be after CheckinTime
        if (RequestedCheckinTime.HasValue && RequestedCheckoutTime.HasValue)
        {
            if (RequestedCheckoutTime.Value <= RequestedCheckinTime.Value)
            {
                yield return new ValidationResult(
                    "RequestedCheckoutTime must be after RequestedCheckinTime",
                    new[] { nameof(RequestedCheckoutTime) });
            }

            // Validate reasonable work duration (not more than 24 hours)
            var duration = RequestedCheckoutTime.Value - RequestedCheckinTime.Value;
            if (duration.TotalHours > 24)
            {
                yield return new ValidationResult(
                    "Work duration cannot exceed 24 hours",
                    new[] { nameof(RequestedCheckoutTime) });
            }

            // Validate not too short (at least 1 hour)
            if (duration.TotalHours < 1)
            {
                yield return new ValidationResult(
                    "Work duration must be at least 1 hour",
                    new[] { nameof(RequestedCheckoutTime) });
            }
        }

        // At least one time must be provided
        if (!RequestedCheckinTime.HasValue && !RequestedCheckoutTime.HasValue)
        {
            yield return new ValidationResult(
                "At least RequestedCheckinTime or RequestedCheckoutTime must be provided",
                new[] { nameof(RequestedCheckinTime), nameof(RequestedCheckoutTime) });
        }

        // Date cannot be in the future
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        if (Date > today)
        {
            yield return new ValidationResult(
                "Cannot create correction request for future dates",
                new[] { nameof(Date) });
        }

        // Date cannot be too old (e.g., more than 30 days ago)
        var thirtyDaysAgo = today.AddDays(-30);
        if (Date < thirtyDaysAgo)
        {
            yield return new ValidationResult(
                "Cannot create correction request for dates older than 30 days",
                new[] { nameof(Date) });
        }
    }
}

/// <summary>
/// DTO để đồng bộ từ máy chấm công
/// </summary>
public class SyncAttendanceFromDeviceDto : IValidatableObject
{
    [Required]
    public int EmployeeId { get; set; }

    [Required]
    public DateOnly Date { get; set; }

    [Required]
    public DateTime CheckinTime { get; set; }

    public DateTime? CheckoutTime { get; set; }

    public string? DeviceId { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        // Validate CheckinTime must be on the same date
        var checkinDate = DateOnly.FromDateTime(CheckinTime);
        if (checkinDate != Date)
        {
            yield return new ValidationResult(
                $"CheckinTime must be on {Date}, but got {checkinDate}",
                new[] { nameof(CheckinTime) });
        }

        // Validate CheckoutTime must be on the same date or next day
        if (CheckoutTime.HasValue)
        {
            var checkoutDate = DateOnly.FromDateTime(CheckoutTime.Value);
            var nextDay = Date.AddDays(1);
            
            if (checkoutDate != Date && checkoutDate != nextDay)
            {
                yield return new ValidationResult(
                    $"CheckoutTime must be on {Date} or {nextDay}, but got {checkoutDate}",
                    new[] { nameof(CheckoutTime) });
            }

            // Validate CheckoutTime must be after CheckinTime
            if (CheckoutTime.Value <= CheckinTime)
            {
                yield return new ValidationResult(
                    "CheckoutTime must be after CheckinTime",
                    new[] { nameof(CheckoutTime) });
            }
        }

        // Date cannot be in the future
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        if (Date > today)
        {
            yield return new ValidationResult(
                "Cannot sync attendance for future dates",
                new[] { nameof(Date) });
        }
    }
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