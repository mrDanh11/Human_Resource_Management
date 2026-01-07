using HRMApi.DTOs;

namespace HRMApi.Services;

public interface IAttendanceService
{
    Task<PagedResult<AttendanceListDto>> GetAttendancesAsync(
        int pageNumber,
        int pageSize,
        int? employeeId = null,
        DateOnly? startDate = null,
        DateOnly? endDate = null,
        string? status = null);
    
    Task<AttendanceDetailDto?> GetAttendanceByIdAsync(int id);
    Task<ApiResponse<AttendanceDetailDto>> CreateAttendanceAsync(CreateAttendanceDto dto);
    Task<ApiResponse<AttendanceDetailDto>> UpdateAttendanceAsync(int id, UpdateAttendanceDto dto);
    Task<ApiResponse<bool>> DeleteAttendanceAsync(int id);
}
