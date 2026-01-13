using HRMApi.Models;

namespace HRMApi.Repositories;

public interface IAttendanceRepository
{
    // Basic CRUD
    Task<Attendance?> GetByIdAsync(int id);
    Task<Attendance?> GetByEmployeeAndDateAsync(int employeeId, DateOnly date);
    Task<List<Attendance>> GetByEmployeeIdAsync(int employeeId, DateOnly? fromDate = null, DateOnly? toDate = null);
    Task<Attendance> AddAsync(Attendance attendance);
    Task UpdateAsync(Attendance attendance);
    Task DeleteAsync(int id);
    
    // Queries with filters and paging
    Task<(List<Attendance> items, int totalCount)> GetPagedAsync(
        int pageNumber,
        int pageSize,
        int? employeeId = null,
        DateOnly? fromDate = null,
        DateOnly? toDate = null,
        string? status = null);
    
    // Check existence
    Task<bool> ExistsAsync(int employeeId, DateOnly date);
    Task<bool> ExistsByIdAsync(int id);
    
    // Statistics
    Task<int> GetTotalAttendanceCountAsync(int employeeId, int year, int month);
    Task<int> GetPresentDaysCountAsync(int employeeId, int year, int month);
    Task<int> GetAbsentDaysCountAsync(int employeeId, int year, int month);
    Task<int> GetLateDaysCountAsync(int employeeId, int year, int month);
    Task<decimal> GetTotalWorkHoursAsync(int employeeId, int year, int month);
    Task<decimal> GetTotalOvertimeHoursAsync(int employeeId, int year, int month);
}