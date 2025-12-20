using HRMApi.Models;

namespace HRMApi.Repositories;

public interface IActivityRepository
{
    // Activity CRUD
    Task<Activity?> GetByIdAsync(int id);
    Task<Activity?> GetByIdWithDetailsAsync(int id);
    Task<IEnumerable<Activity>> GetAllAsync();
    Task<(IEnumerable<Activity> items, int totalCount)> GetPagedAsync(
        int pageNumber,
        int pageSize,
        string? searchTerm = null,
        string? status = null,
        DateTime? fromDate = null,
        DateTime? toDate = null);
    Task<Activity> AddAsync(Activity activity);
    Task UpdateAsync(Activity activity);
    Task DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
    
    // Participation CRUD
    Task<Participation?> GetParticipationByIdAsync(int id);
    Task<Participation?> GetParticipationWithDetailsAsync(int id);
    Task<IEnumerable<Participation>> GetParticipationsByActivityIdAsync(int activityId);
    Task<IEnumerable<Participation>> GetParticipationsByEmployeeIdAsync(int employeeId);
    Task<(IEnumerable<Participation> items, int totalCount)> GetParticipationsPagedAsync(
        int pageNumber,
        int pageSize,
        int? activityId = null,
        int? employeeId = null,
        string? status = null,
        string? result = null);
    Task<Participation> AddParticipationAsync(Participation participation);
    Task UpdateParticipationAsync(Participation participation);
    Task<bool> ParticipationExistsAsync(int employeeId, int activityId);
    Task<int> GetParticipantCountAsync(int activityId);
    
    // Statistics
    Task<int> GetTotalActivitiesCountAsync();
    Task<Dictionary<string, int>> GetActivitiesByStatusAsync();
    Task<int> GetTotalParticipationsCountAsync();
}