using HRMApi.DTOs;

namespace HRMApi.Services;

public interface IActivityService
{
    // Activity CRUD
    Task<PagedResult<ActivityListDto>> GetActivitiesAsync(
        int pageNumber,
        int pageSize,
        string? searchTerm = null,
        string? status = null,
        DateTime? fromDate = null,
        DateTime? toDate = null);
    Task<ActivityDetailDto?> GetActivityByIdAsync(int id);
    Task<ApiResponse<ActivityDetailDto>> CreateActivityAsync(CreateActivityDto dto);
    Task<ApiResponse<ActivityDetailDto>> UpdateActivityAsync(int id, UpdateActivityDto dto);
    Task<ApiResponse<bool>> CancelActivityAsync(int id, string? reason = null);
    Task<bool> ActivityExistsAsync(int id);
    
    // Participation Management
    Task<PagedResult<ParticipationDto>> GetParticipationsAsync(
        int pageNumber,
        int pageSize,
        int? activityId = null,
        int? employeeId = null,
        string? status = null,
        string? result = null);
    Task<ParticipationDto?> GetParticipationByIdAsync(int id);
    Task<ApiResponse<ParticipationDto>> UpdateParticipationResultAsync(
        int participationId, 
        UpdateParticipationResultDto dto);
    
    // Statistics
    Task<ActivityStatisticsDto> GetStatisticsAsync();
}