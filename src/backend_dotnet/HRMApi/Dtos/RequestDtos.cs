using System.ComponentModel.DataAnnotations;

namespace HRMApi.DTOs.Request;

// ============================================
// REQUEST MANAGEMENT DTOs
// ============================================

/// <summary>
/// DTO để lọc và tìm kiếm requests
/// </summary>
public class RequestFilterDto
{
    public int? EmployeeId { get; set; }
    public string? Type { get; set; } // wfh, leave, overtime, attendance_correction, equipment, other
    public string? Status { get; set; } // pending, approved, rejected
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

/// <summary>
/// DTO response cho request detail
/// </summary>
public class RequestResponseDto
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = null!;
    public string EmployeeEmail { get; set; } = null!;
    public string? DepartmentName { get; set; }
    public string Description { get; set; } = null!;
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public string Type { get; set; } = null!;
    public string TypeDisplay { get; set; } = null!;
    public string? Attachment { get; set; }
    public string Status { get; set; } = null!;
    public string StatusDisplay { get; set; } = null!;
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    // Approval history
    public List<ApprovalHistoryDto> ApprovalHistories { get; set; } = new();
    
    // For attendance correction requests
    public AttendanceCorrectionDetailDto? AttendanceDetail { get; set; }
}

/// <summary>
/// DTO cho approval history
/// </summary>
public class ApprovalHistoryDto
{
    public int Id { get; set; }
    public int ApproverId { get; set; }
    public string ApproverName { get; set; } = null!;
    public string Status { get; set; } = null!;
    public string StatusDisplay { get; set; } = null!;
    public string? Note { get; set; }
    public DateTime? CreatedAt { get; set; }
}

/// <summary>
/// DTO cho attendance correction detail
/// </summary>
public class AttendanceCorrectionDetailDto
{
    public DateOnly Date { get; set; }
    
    // Current values
    public DateTime? CurrentCheckinTime { get; set; }
    public DateTime? CurrentCheckoutTime { get; set; }
    public decimal? CurrentWorkHours { get; set; }
    public string? CurrentStatus { get; set; }
    
    // Requested values
    public DateTime? RequestedCheckinTime { get; set; }
    public DateTime? RequestedCheckoutTime { get; set; }
}

/// <summary>
/// DTO để approve/reject request
/// </summary>
public class ProcessRequestDto
{
    [Required(ErrorMessage = "Status là bắt buộc")]
    [RegularExpression("^(approved|rejected)$", 
        ErrorMessage = "Status phải là: approved hoặc rejected")]
    public string Status { get; set; } = null!;
    
    [StringLength(500, ErrorMessage = "Note không được vượt quá 500 ký tự")]
    public string? Note { get; set; }
    
    /// <summary>
    /// Nếu approve attendance correction, có tự động update attendance không?
    /// </summary>
    public bool AutoUpdateAttendance { get; set; } = true;
}

/// <summary>
/// DTO cho statistics
/// </summary>
public class RequestStatisticsDto
{
    public int TotalRequests { get; set; }
    public int PendingRequests { get; set; }
    public int ApprovedRequests { get; set; }
    public int RejectedRequests { get; set; }
    
    public Dictionary<string, int> RequestsByType { get; set; } = new();
    public Dictionary<string, int> RequestsByStatus { get; set; } = new();
}

/// <summary>
/// DTO response cho batch approval
/// </summary>
public class BatchProcessResultDto
{
    public int TotalRequests { get; set; }
    public int SuccessCount { get; set; }
    public int FailedCount { get; set; }
    public List<string> Errors { get; set; } = new();
}

/// <summary>
/// DTO để batch approve/reject
/// </summary>
public class BatchProcessRequestDto
{
    [Required]
    [MinLength(1)]
    public List<int> RequestIds { get; set; } = new();
    
    [Required]
    [RegularExpression("^(approved|rejected)$")]
    public string Status { get; set; } = null!;
    
    public string? Note { get; set; }
    
    public bool AutoUpdateAttendance { get; set; } = true;
}