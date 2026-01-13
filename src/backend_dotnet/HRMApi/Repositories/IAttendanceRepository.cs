using HRMApi.Models;

namespace HRMApi.Repositories;

public interface IAttendanceRepository
{
    Task<Attendance?> GetByIdAsync(int id);
    Task<Attendance?> GetByEmployeeAndDateAsync(int employeeId, DateOnly date);
    Task<IEnumerable<Attendance>> GetAllAsync();
    Task<IEnumerable<Attendance>> GetByEmployeeIdAsync(int employeeId);
    Task<IEnumerable<Attendance>> GetByDateRangeAsync(DateOnly startDate, DateOnly endDate);
    Task<(IEnumerable<Attendance> items, int totalCount)> GetPagedAsync(
        int pageNumber,
        int pageSize,
        int? employeeId = null,
        DateOnly? startDate = null,
        DateOnly? endDate = null,
        string? status = null);
    Task<Attendance> CreateAsync(Attendance attendance);
    Task<Attendance> UpdateAsync(Attendance attendance);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsAsync(int employeeId, DateOnly date);
}
