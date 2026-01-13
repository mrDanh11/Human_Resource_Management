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

    public async Task<IEnumerable<Attendance>> GetAllAsync()
    {
        return await _context.Attendances
            .Include(a => a.Employee)
            .OrderByDescending(a => a.Date)
            .ToListAsync();
    }

    public async Task<IEnumerable<Attendance>> GetByEmployeeIdAsync(int employeeId)
    {
        return await _context.Attendances
            .Include(a => a.Employee)
            .Where(a => a.EmployeeId == employeeId)
            .OrderByDescending(a => a.Date)
            .ToListAsync();
    }

    public async Task<IEnumerable<Attendance>> GetByDateRangeAsync(DateOnly startDate, DateOnly endDate)
    {
        return await _context.Attendances
            .Include(a => a.Employee)
            .Where(a => a.Date >= startDate && a.Date <= endDate)
            .OrderByDescending(a => a.Date)
            .ToListAsync();
    }

    public async Task<(IEnumerable<Attendance> items, int totalCount)> GetPagedAsync(
        int pageNumber,
        int pageSize,
        int? employeeId = null,
        DateOnly? startDate = null,
        DateOnly? endDate = null,
        string? status = null)
    {
        var query = _context.Attendances
            .Include(a => a.Employee)
            .AsQueryable();

        // Apply filters
        if (employeeId.HasValue)
            query = query.Where(a => a.EmployeeId == employeeId.Value);

        if (startDate.HasValue)
            query = query.Where(a => a.Date >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(a => a.Date <= endDate.Value);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(a => a.Status == status);

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(a => a.Date)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<Attendance> CreateAsync(Attendance attendance)
    {
        _context.Attendances.Add(attendance);
        await _context.SaveChangesAsync();
        
        // Reload with employee data
        await _context.Entry(attendance)
            .Reference(a => a.Employee)
            .LoadAsync();
        
        return attendance;
    }

    public async Task<Attendance> UpdateAsync(Attendance attendance)
    {
        _context.Attendances.Update(attendance);
        await _context.SaveChangesAsync();
        
        // Reload with employee data
        await _context.Entry(attendance)
            .Reference(a => a.Employee)
            .LoadAsync();
        
        return attendance;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var attendance = await _context.Attendances.FindAsync(id);
        if (attendance == null)
            return false;

        _context.Attendances.Remove(attendance);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsAsync(int employeeId, DateOnly date)
    {
        return await _context.Attendances
            .AnyAsync(a => a.EmployeeId == employeeId && a.Date == date);
    }
}
