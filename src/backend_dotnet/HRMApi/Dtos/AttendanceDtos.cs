using System.ComponentModel.DataAnnotations;

namespace HRMApi.DTOs;

// DTO cho danh sách attendance
public class AttendanceListDto
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = null!;
    public DateOnly Date { get; set; }
    public DateTime? CheckinTime { get; set; }
    public DateTime? CheckoutTime { get; set; }
    public string? Status { get; set; }
    public decimal? WorkHours { get; set; }
    public decimal? OvertimeHours { get; set; }
    public string? Note { get; set; }
}

// DTO cho chi tiết attendance
public class AttendanceDetailDto
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = null!;
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
}

// DTO cho tạo attendance
public class CreateAttendanceDto
{
    [Required(ErrorMessage = "ID nhân viên là bắt buộc")]
    public int EmployeeId { get; set; }

    [Required(ErrorMessage = "Ngày làm việc là bắt buộc")]
    public DateOnly Date { get; set; }

    public DateTime? CheckinTime { get; set; }

    public DateTime? CheckoutTime { get; set; }

    [Required(ErrorMessage = "Trạng thái là bắt buộc")]
    [RegularExpression(@"^(present|absent|late|half_day|wfh)$", 
        ErrorMessage = "Trạng thái phải là một trong: present, absent, late, half_day, wfh")]
    public string Status { get; set; } = null!;

    public string? Attachment { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Giờ làm thêm phải >= 0")]
    public decimal? OvertimeHours { get; set; }

    [StringLength(500, ErrorMessage = "Ghi chú không được vượt quá 500 ký tự")]
    public string? Note { get; set; }
}

// DTO cho cập nhật attendance
public class UpdateAttendanceDto
{
    public DateTime? CheckinTime { get; set; }

    public DateTime? CheckoutTime { get; set; }

    [RegularExpression(@"^(present|absent|late|half_day|wfh)$", 
        ErrorMessage = "Trạng thái phải là một trong: present, absent, late, half_day, wfh")]
    public string? Status { get; set; }

    public string? Attachment { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Giờ làm thêm phải >= 0")]
    public decimal? OvertimeHours { get; set; }

    [StringLength(500, ErrorMessage = "Ghi chú không được vượt quá 500 ký tự")]
    public string? Note { get; set; }
}
