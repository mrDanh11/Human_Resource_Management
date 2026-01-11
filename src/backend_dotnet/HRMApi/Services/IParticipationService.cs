using HRMApi.DTOs;

namespace HRMApi.Services;

public interface IParticipationService
{
    // Existing
    Task<ApiResponse<IEnumerable<ParticipationDto>>> GetActivityParticipationAsync(int employeeId);
    Task<ApiResponse<IEnumerable<ParticipationDto>>> GetEmployeeParticipationAsync(int activityId);
    Task<ApiResponse<ParticipationDto>> GetParticipationAsync(int activityId, int employeeId);
    Task<PagedResult<ParticipationDto>> GetAllParticipationsAsync(
        int pageNumber, int pageSize, string? searchTerm = null);
    
    // JSONB Support
    Task<ApiResponse<ParticipationDto>> UpdateParticipationResultAsync(
        int activityId, int employeeId, UpdateParticipationResultDto dto);
    Task<ApiResponse<List<ParticipationDto>>> GetResultsByActivityTypeAsync(string activityType);
    Task<ApiResponse<List<ParticipationDto>>> GetTopPerformersAsync(
        string activityType, string sortKey, int limit = 10);
    Task<ApiResponse<List<ParticipationDto>>> GetAllWithResultsAsync();
    Task<ApiResponse<List<ParticipationDto>>> GetCertifiedEmployeesAsync();
    Task<ApiResponse<Dictionary<int, double>>> GetVolunteerHoursStatsAsync();
    Task<ApiResponse<Dictionary<string, int>>> GetResultStatsByActivityTypeAsync(string activityType);
    Task<ApiResponse<List<ParticipationDto>>> GetRunningResultsUnderTimeAsync(string maxTime);
    Task<ApiResponse<List<ParticipationDto>>> GetTrainingResultsAboveScoreAsync(int minScore);
    Task<ApiResponse<List<ParticipationDto>>> SearchInResultsAsync(string searchTerm);
    Task<ApiResponse<List<ParticipationDto>>> GetByResultKeyAsync(string key);
    Task<ApiResponse<List<ParticipationDto>>> GetByResultValueAsync(string key, object value);

    // Attendance
    Task<ApiResponse<ParticipationDto>> UpdateAttendanceStatusAsync(
        int activityId, 
        int employeeId, 
        UpdateAttendanceStatusDto dto);

    // NEW: Performance methods
    Task<ApiResponse<ParticipationDto>> UpdatePerformanceAsync(
        int activityId,
        int employeeId,
        UpdatePerformanceDto dto);
    
    Task<ApiResponse<List<ParticipationDto>>> GetByPerformanceAsync(string performance);
    
    Task<ApiResponse<Dictionary<string, int>>> GetPerformanceStatsAsync();
    
    Task<ApiResponse<Dictionary<string, int>>> GetPerformanceStatsByActivityTypeAsync(string activityType);
}