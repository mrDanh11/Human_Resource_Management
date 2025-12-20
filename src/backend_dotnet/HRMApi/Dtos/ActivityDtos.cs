using System.ComponentModel.DataAnnotations;

namespace HRMApi.DTOs;

// DTO cho danh sách hoạt động
public class ActivityListDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime RegisterDeadline { get; set; }
    public int? MaxParticipants { get; set; }
    public int CurrentParticipants { get; set; }
    public string? Status { get; set; }
    public string? CreatedByName { get; set; }
    public DateTime? CreatedAt { get; set; }
}

// DTO cho chi tiết hoạt động
public class ActivityDetailDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime RegisterDeadline { get; set; }
    public int? MaxParticipants { get; set; }
    public int CurrentParticipants { get; set; }
    public string? Status { get; set; }
    public int? CreatedBy { get; set; }
    public string? CreatedByName { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<ParticipationDto> Participations { get; set; } = new();
}

// DTO cho tạo hoạt động
public class CreateActivityDto
{
    [Required(ErrorMessage = "Tên hoạt động là bắt buộc")]
    [StringLength(200, ErrorMessage = "Tên hoạt động không được vượt quá 200 ký tự")]
    public string Name { get; set; } = null!;

    [StringLength(1000, ErrorMessage = "Mô tả không được vượt quá 1000 ký tự")]
    public string? Description { get; set; }

    [Required(ErrorMessage = "Ngày bắt đầu là bắt buộc")]
    public DateTime StartDate { get; set; }

    [Required(ErrorMessage = "Ngày kết thúc là bắt buộc")]
    public DateTime EndDate { get; set; }

    [Required(ErrorMessage = "Hạn đăng ký là bắt buộc")]
    public DateTime RegisterDeadline { get; set; }

    [Range(1, 10000, ErrorMessage = "Số lượng tham gia phải từ 1 đến 10000")]
    public int? MaxParticipants { get; set; }

    public int? CreatedBy { get; set; }
}

// DTO cho cập nhật hoạt động
public class UpdateActivityDto
{
    [Required(ErrorMessage = "Tên hoạt động là bắt buộc")]
    [StringLength(200, ErrorMessage = "Tên hoạt động không được vượt quá 200 ký tự")]
    public string Name { get; set; } = null!;

    [StringLength(1000, ErrorMessage = "Mô tả không được vượt quá 1000 ký tự")]
    public string? Description { get; set; }

    [Required(ErrorMessage = "Ngày bắt đầu là bắt buộc")]
    public DateTime StartDate { get; set; }

    [Required(ErrorMessage = "Ngày kết thúc là bắt buộc")]
    public DateTime EndDate { get; set; }

    [Required(ErrorMessage = "Hạn đăng ký là bắt buộc")]
    public DateTime RegisterDeadline { get; set; }

    [Range(1, 10000, ErrorMessage = "Số lượng tham gia phải từ 1 đến 10000")]
    public int? MaxParticipants { get; set; }

    [RegularExpression(@"^(upcoming|ongoing|completed|cancelled)$", 
        ErrorMessage = "Trạng thái phải là: upcoming, ongoing, completed, hoặc cancelled")]
    public string? Status { get; set; }
}

// DTO cho tham gia hoạt động
public class ParticipationDto
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = null!;
    public string EmployeeEmail { get; set; } = null!;
    public int ActivityId { get; set; }
    public string? ActivityName { get; set; }
    public DateTime? RegisterDate { get; set; }
    public DateTime? CancelDate { get; set; }
    public string? Status { get; set; }
    public string? StatusDisplay { get; set; }
    public string? Result { get; set; }
    public string? ResultDisplay { get; set; }
    public DateTime? CreatedAt { get; set; }
}

// DTO cho cập nhật kết quả tham gia
public class UpdateParticipationResultDto
{
    [Required(ErrorMessage = "Kết quả là bắt buộc")]
    [RegularExpression(@"^(excellent|good|average|poor|absent)$", 
        ErrorMessage = "Kết quả phải là: excellent (xuất sắc), good (tốt), average (trung bình), poor (kém), hoặc absent (vắng mặt)")]
    public string Result { get; set; } = null!;

    [StringLength(500, ErrorMessage = "Ghi chú không được vượt quá 500 ký tự")]
    public string? Note { get; set; }
}

// DTO cho thống kê hoạt động
public class ActivityStatisticsDto
{
    public int TotalActivities { get; set; }
    public int UpcomingActivities { get; set; }
    public int OngoingActivities { get; set; }
    public int CompletedActivities { get; set; }
    public int CancelledActivities { get; set; }
    public int TotalParticipations { get; set; }
    public double AverageParticipantsPerActivity { get; set; }
}