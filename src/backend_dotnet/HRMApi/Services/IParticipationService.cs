using HRMApi.DTOs;

namespace HRMApi.Services;

public interface IParticipationService
{
    // Point queries
    Task<ApiResponse<IEnumerable<ParticipationDto>>> GetActivityParticipationAsync(int employeeId);
    Task<ApiResponse<IEnumerable<ParticipationDto>>> GetEmployeeParticipationAsync(int activityId);

    Task<ApiResponse<ParticipationDto>> GetParticipationAsync(int activityId, int employeeId);
    Task<PagedResult<ParticipationDto>> GetAllParticipationsAsync(
        int pageNumber,
        int pageSize,
        string? searchTerm = null);
}