using HRMApi.Data;
using HRMApi.Models;
using Microsoft.EntityFrameworkCore;

namespace HRMApi.Repositories;

public class ActivityRepository : IActivityRepository
{
    private readonly HrmDbContext _context;

    public ActivityRepository(HrmDbContext context)
    {
        _context = context;
    }

    // ============================================
    // ACTIVITY CRUD
    // ============================================
    
    public async Task<Activity?> GetByIdAsync(int id)
    {
        return await _context.Activities.FindAsync(id);
    }

    public async Task<Activity?> GetByIdWithDetailsAsync(int id)
    {
        return await _context.Activities
            .Include(a => a.CreatedByNavigation)
            .Include(a => a.Participations)
                .ThenInclude(p => p.Employee)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<IEnumerable<Activity>> GetAllAsync()
    {
        return await _context.Activities
            .Include(a => a.CreatedByNavigation)
            .Include(a => a.Participations)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<(IEnumerable<Activity> items, int totalCount)> GetPagedAsync(
        int pageNumber,
        int pageSize,
        string? searchTerm = null,
        string? status = null,
        DateTime? fromDate = null,
        DateTime? toDate = null)
    {
        var query = _context.Activities
            .Include(a => a.CreatedByNavigation)
            .Include(a => a.Participations)
            .AsQueryable();

        // Apply filters
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            searchTerm = searchTerm.ToLower();
            query = query.Where(a =>
                a.Name.ToLower().Contains(searchTerm) ||
                (a.Description != null && a.Description.ToLower().Contains(searchTerm)));
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(a => a.Status == status);
        }

        if (fromDate.HasValue)
        {
            query = query.Where(a => a.StartDate >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            query = query.Where(a => a.EndDate <= toDate.Value);
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<Activity> AddAsync(Activity activity)
    {
        await _context.Activities.AddAsync(activity);
        await _context.SaveChangesAsync();
        return activity;
    }

    public async Task UpdateAsync(Activity activity)
    {
        _context.Activities.Update(activity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var activity = await GetByIdAsync(id);
        if (activity != null)
        {
            _context.Activities.Remove(activity);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Activities.AnyAsync(a => a.Id == id);
    }

    // ============================================
    // PARTICIPATION CRUD
    // ============================================
    
    public async Task<Participation?> GetParticipationByIdAsync(int id)
    {
        return await _context.Participations.FindAsync(id);
    }

    public async Task<Participation?> GetParticipationWithDetailsAsync(int id)
    {
        return await _context.Participations
            .Include(p => p.Employee)
                .ThenInclude(e => e.Role)
            .Include(p => p.Employee)
                .ThenInclude(e => e.Department)
            .Include(p => p.Activity)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IEnumerable<Participation>> GetParticipationsByActivityIdAsync(int activityId)
    {
        return await _context.Participations
            .Include(p => p.Employee)
            .Where(p => p.ActivityId == activityId)
            .OrderBy(p => p.RegisterDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Participation>> GetParticipationsByEmployeeIdAsync(int employeeId)
    {
        return await _context.Participations
            .Include(p => p.Activity)
            .Where(p => p.EmployeeId == employeeId)
            .OrderByDescending(p => p.RegisterDate)
            .ToListAsync();
    }

    public async Task<(IEnumerable<Participation> items, int totalCount)> GetParticipationsPagedAsync(
        int pageNumber,
        int pageSize,
        int? activityId = null,
        int? employeeId = null,
        string? status = null,
        string? result = null)
    {
        var query = _context.Participations
            .Include(p => p.Employee)
                .ThenInclude(e => e.Role)
            .Include(p => p.Activity)
            .AsQueryable();

        if (activityId.HasValue)
        {
            query = query.Where(p => p.ActivityId == activityId.Value);
        }

        if (employeeId.HasValue)
        {
            query = query.Where(p => p.EmployeeId == employeeId.Value);
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(p => p.Status == status);
        }

        if (!string.IsNullOrWhiteSpace(result))
        {
            query = query.Where(p => p.Result == result);
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(p => p.RegisterDate)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<Participation> AddParticipationAsync(Participation participation)
    {
        await _context.Participations.AddAsync(participation);
        await _context.SaveChangesAsync();
        return participation;
    }

    public async Task UpdateParticipationAsync(Participation participation)
    {
        _context.Participations.Update(participation);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> ParticipationExistsAsync(int employeeId, int activityId)
    {
        return await _context.Participations
            .AnyAsync(p => p.EmployeeId == employeeId && p.ActivityId == activityId);
    }

    public async Task<int> GetParticipantCountAsync(int activityId)
    {
        return await _context.Participations
            .CountAsync(p => p.ActivityId == activityId && 
                           (p.Status == "registered" || p.Status == "attended"));
    }

    // ============================================
    // STATISTICS
    // ============================================
    
    public async Task<int> GetTotalActivitiesCountAsync()
    {
        return await _context.Activities.CountAsync();
    }

    public async Task<Dictionary<string, int>> GetActivitiesByStatusAsync()
    {
        return await _context.Activities
            .GroupBy(a => a.Status ?? "unknown")
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.Status, x => x.Count);
    }

    public async Task<int> GetTotalParticipationsCountAsync()
    {
        return await _context.Participations.CountAsync();
    }
}