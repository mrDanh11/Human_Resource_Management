using HRMApi.DTOs.Attendance;

namespace HRMApi.Services;

public interface IAttendanceService
{
    // ============================================
    // EMPLOYEE METHODS
    // ============================================
    
    /// <summary>
    /// Lấy timesheet của nhân viên trong khoảng thời gian
    /// </summary>
    Task<TimesheetSummaryDto> GetMyTimesheetAsync(int employeeId, DateOnly? fromDate, DateOnly? toDate);
    
    /// <summary>
    /// Lấy attendance của nhân viên theo ngày cụ thể
    /// </summary>
    Task<AttendanceResponseDto?> GetAttendanceByDateAsync(int employeeId, DateOnly date);
    
    /// <summary>
    /// Lấy thống kê chấm công của nhân viên theo tháng
    /// </summary>
    Task<AttendanceStatisticsDto> GetMyAttendanceStatisticsAsync(int employeeId, int year, int month);
    
    /// <summary>
    /// Tạo request chỉnh sửa attendance
    /// </summary>
    Task<int> CreateAttendanceCorrectionRequestAsync(int employeeId, CreateAttendanceCorrectionRequestDto dto);
    
    // ============================================
    // HR METHODS
    // ============================================
    
    /// <summary>
    /// Lấy danh sách attendance với filter và phân trang
    /// </summary>
    Task<List<AttendanceResponseDto>> GetAllAttendancesAsync(AttendanceFilterDto filter);
    
    /// <summary>
    /// Lấy attendance theo ID
    /// </summary>
    Task<AttendanceResponseDto?> GetAttendanceByIdAsync(int id);
    
    /// <summary>
    /// Tạo attendance thủ công (HR)
    /// </summary>
    Task<AttendanceResponseDto> CreateAttendanceAsync(CreateAttendanceDto dto, int createdBy);
    
    /// <summary>
    /// Cập nhật attendance (HR chỉnh sửa khi máy chấm công sai)
    /// </summary>
    Task<AttendanceResponseDto> UpdateAttendanceAsync(int id, UpdateAttendanceDto dto, int updatedBy);
    
    /// <summary>
    /// Xóa attendance
    /// </summary>
    Task<bool> DeleteAttendanceAsync(int id);
    
    /// <summary>
    /// Nhập nhiều attendance cùng lúc (bulk import)
    /// </summary>
    Task<BulkCreateAttendanceResultDto> BulkCreateAttendancesAsync(List<CreateAttendanceDto> dtos, int createdBy);
    
    // ============================================
    // SYSTEM METHODS
    // ============================================
    
    /// <summary>
    /// Đồng bộ attendance từ máy chấm công
    /// </summary>
    Task<AttendanceResponseDto> SyncFromDeviceAsync(SyncAttendanceFromDeviceDto dto);
    
    // ============================================
    // UTILITY METHODS
    // ============================================
    
    /// <summary>
    /// Kiểm tra attendance có tồn tại không
    /// </summary>
    Task<bool> CheckAttendanceExistsAsync(int employeeId, DateOnly date);

    /// <summary>
    /// Lấy lịch sử chấm công của nhân viên (không truyền ngày sẽ lấy tất cả)
    /// </summary>
    Task<List<AttendanceResponseDto>> GetMyAttendanceHistoryAsync(int employeeId, DateOnly? fromDate, DateOnly? toDate);
}