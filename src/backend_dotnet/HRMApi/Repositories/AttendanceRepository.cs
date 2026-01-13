using HRMApi.Data;
using HRMApi.Models;
using Microsoft.EntityFrameworkCore;

namespace HRMApi.Repositories;

public class AttendanceRepository : IAttendanceRepository
{
    private readonly HrmDbContext _context;

    public AttendanceRepository(HrmDbContext context)
    {
        _context = context;
    }

    // ============================================
    // BASIC CRUD
    // ============================================

    public async Task<Attendance?> GetByIdAsync(int id)
    {
        return await _context.Attendances
            .Include(a => a.Employee)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<Attendance?> GetByEmployeeAndDateAsync(int employeeId, DateOnly date)
    {
        return await _context.Attendances
            .Include(a => a.Employee)
            .FirstOrDefaultAsync(a => a.EmployeeId == employeeId && a.Date == date);
    }

    public async Task<List<Attendance>> GetByEmployeeIdAsync(
        int employeeId, 
        DateOnly? fromDate = null, 
        DateOnly? toDate = null)
    {
        var query = _context.Attendances
            .Include(a => a.Employee)
            .Where(a => a.EmployeeId == employeeId);

        if (fromDate.HasValue)
        {
            query = query.Where(a => a.Date >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            query = query.Where(a => a.Date <= toDate.Value);
        }

        return await query
            .OrderBy(a => a.Date)
            .ToListAsync();
    }

    public async Task<Attendance> AddAsync(Attendance attendance)
    {
        await _context.Attendances.AddAsync(attendance);
        await _context.SaveChangesAsync();
        
        // Reload with employee data
        return await GetByIdAsync(attendance.Id) 
            ?? throw new InvalidOperationException("Failed to retrieve created attendance");
    }

    public async Task UpdateAsync(Attendance attendance)
    {
        _context.Attendances.Update(attendance);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var attendance = await _context.Attendances.FindAsync(id);
        if (attendance != null)
        {
            _context.Attendances.Remove(attendance);
            await _context.SaveChangesAsync();
        }
    }

    // ============================================
    // QUERIES WITH FILTERS AND PAGING
    // ============================================

    public async Task<(List<Attendance> items, int totalCount)> GetPagedAsync(
        int pageNumber,
        int pageSize,
        int? employeeId = null,
        DateOnly? fromDate = null,
        DateOnly? toDate = null,
        string? status = null)
    {
        var query = _context.Attendances
            .Include(a => a.Employee)
            .AsQueryable();

        // Apply filters
        if (employeeId.HasValue)
        {
            query = query.Where(a => a.EmployeeId == employeeId.Value);
        }

        if (fromDate.HasValue)
        {
            query = query.Where(a => a.Date >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            query = query.Where(a => a.Date <= toDate.Value);
        }

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(a => a.Status == status);
        }

        // Get total count
        var totalCount = await query.CountAsync();

        // Apply paging
        var items = await query
            .OrderByDescending(a => a.Date)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    // ============================================
    // CHECK EXISTENCE
    // ============================================

    public async Task<bool> ExistsAsync(int employeeId, DateOnly date)
    {
        return await _context.Attendances
            .AnyAsync(a => a.EmployeeId == employeeId && a.Date == date);
    }

    public async Task<bool> ExistsByIdAsync(int id)
    {
        return await _context.Attendances
            .AnyAsync(a => a.Id == id);
    }

    // ============================================
    // STATISTICS
    // ============================================

    public async Task<int> GetTotalAttendanceCountAsync(int employeeId, int year, int month)
    {
        var fromDate = new DateOnly(year, month, 1);
        var toDate = fromDate.AddMonths(1).AddDays(-1);

        return await _context.Attendances
            .Where(a => a.EmployeeId == employeeId 
                && a.Date >= fromDate 
                && a.Date <= toDate)
            .CountAsync();
    }

    public async Task<int> GetPresentDaysCountAsync(int employeeId, int year, int month)
    {
        var fromDate = new DateOnly(year, month, 1);
        var toDate = fromDate.AddMonths(1).AddDays(-1);

        return await _context.Attendances
            .Where(a => a.EmployeeId == employeeId 
                && a.Date >= fromDate 
                && a.Date <= toDate
                && a.Status == "present")
            .CountAsync();
    }

    public async Task<int> GetAbsentDaysCountAsync(int employeeId, int year, int month)
    {
        var fromDate = new DateOnly(year, month, 1);
        var toDate = fromDate.AddMonths(1).AddDays(-1);

        return await _context.Attendances
            .Where(a => a.EmployeeId == employeeId 
                && a.Date >= fromDate 
                && a.Date <= toDate
                && a.Status == "absent")
            .CountAsync();
    }

    public async Task<int> GetLateDaysCountAsync(int employeeId, int year, int month)
    {
        var fromDate = new DateOnly(year, month, 1);
        var toDate = fromDate.AddMonths(1).AddDays(-1);

        return await _context.Attendances
            .Where(a => a.EmployeeId == employeeId 
                && a.Date >= fromDate 
                && a.Date <= toDate
                && a.Status == "late")
            .CountAsync();
    }

    public async Task<decimal> GetTotalWorkHoursAsync(int employeeId, int year, int month)
    {
        var fromDate = new DateOnly(year, month, 1);
        var toDate = fromDate.AddMonths(1).AddDays(-1);

        return await _context.Attendances
            .Where(a => a.EmployeeId == employeeId 
                && a.Date >= fromDate 
                && a.Date <= toDate)
            .SumAsync(a => a.WorkHours ?? 0);
    }

    public async Task<decimal> GetTotalOvertimeHoursAsync(int employeeId, int year, int month)
    {
        var fromDate = new DateOnly(year, month, 1);
        var toDate = fromDate.AddMonths(1).AddDays(-1);

        return await _context.Attendances
            .Where(a => a.EmployeeId == employeeId 
                && a.Date >= fromDate 
                && a.Date <= toDate)
            .SumAsync(a => a.OvertimeHours ?? 0);
    }
}