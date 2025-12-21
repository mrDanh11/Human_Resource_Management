using HRMApi.Data;
using HRMApi.Models;
using Microsoft.EntityFrameworkCore;

namespace HRMApi.Repositories;

public class ParticipationRepository : IParticipationRepository
{
    private readonly HrmDbContext _context;

    public ParticipationRepository(HrmDbContext context)
    {
        _context = context;
    }

    //Paticipation queries
    public async Task<IEnumerable<Participation?>> GetByEmployeeIdAsync(int employeeId)
    {
        return await _context.Participations
            .Include(p => p.Activity)
            .Include(p => p.Employee)
            .Where(p => p.EmployeeId == employeeId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Participation?>> GetByActivityIdAsync(int activityId)
    {
        return await _context.Participations
            .Include(p => p.Activity)
            .Include(p => p.Employee)
            .Where(p => p.ActivityId == activityId)
            .ToListAsync();
    }

    public async Task<Participation?> GetByActivityIdEmployeeIdAsync(int activityId, int employeeId)
    {
        return await _context.Participations
            .Include(p => p.Activity)
            .Include(p => p.Employee)
            .Where(p => p.ActivityId == activityId && p.EmployeeId == employeeId)
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<Participation>> GetAllAsync()
    {
        return await _context.Participations
            .Include(p => p.Activity)
            .Include(p => p.Employee)
            .ToListAsync();
    }

    public async Task<(IEnumerable<Participation> items, int totalCount)> GetPagedAsync(
        int pageNumber,
        int pageSize,
        string? searchTerm = null)
    {
        var query = _context.Participations
            .Include(p => p.Activity)
            .Include(p => p.Employee)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            searchTerm = searchTerm.ToLower();
            query = query.Where(p =>
                p.Employee.Fullname.Contains(searchTerm, StringComparison.CurrentCultureIgnoreCase) ||
                p.Activity.Name.Contains(searchTerm, StringComparison.CurrentCultureIgnoreCase));
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }
}