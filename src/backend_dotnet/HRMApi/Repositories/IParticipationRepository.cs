using HRMApi.Models;

namespace HRMApi.Repositories;

public interface IParticipationRepository
{
    //Paticipation queries
    Task<IEnumerable<Participation?>> GetByEmployeeIdAsync(int employeeId);
    Task<IEnumerable<Participation?>> GetByActivityIdAsync(int activityId);
    Task<Participation?> GetByActivityIdEmployeeIdAsync(int activityId, int employeeId);

    Task<IEnumerable<Participation>> GetAllAsync();
    Task<(IEnumerable<Participation> items, int totalCount)> GetPagedAsync(
        int pageNumber,
        int pageSize,
        string? searchTerm = null);
}