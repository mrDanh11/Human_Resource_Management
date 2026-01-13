using HRMApi.Data;
using HRMApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace HRMApi.Repositories;

public class ParticipationRepository : IParticipationRepository
{
    private readonly HrmDbContext _context;

    public ParticipationRepository(HrmDbContext context)
    {
        _context = context;
    }

    // ============================================
    // EXISTING METHODS (unchanged)
    // ============================================
    
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

    // ============================================
    // JSONB SUPPORT METHODS
    // ============================================

    public async Task UpdateAsync(Participation participation)
    {
        _context.Participations.Update(participation);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Participation>> GetByActivityTypeAsync(string activityType)
    {
        return await _context.Participations
            .Include(p => p.Activity)
            .Include(p => p.Employee)
            .Where(p => p.Activity.ActivityType == activityType)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Participation>> GetWithResultsAsync()
    {
        return await _context.Participations
            .Include(p => p.Activity)
            .Include(p => p.Employee)
            .Where(p => p.Result != null)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Participation>> GetByResultKeyAsync(string key)
    {
        var sql = @"
            SELECT p.* 
            FROM participation p
            INNER JOIN activity a ON p.activity_id = a.id
            INNER JOIN employee e ON p.employee_id = e.id
            WHERE p.result ? {0}
            ORDER BY p.created_at DESC";

        return await _context.Participations
            .FromSqlRaw(sql, key)
            .Include(p => p.Activity)
            .Include(p => p.Employee)
            .ToListAsync();
    }

    public async Task<IEnumerable<Participation>> GetByResultValueAsync(string key, object value)
    {
        var valueJson = JsonSerializer.Serialize(value);
        
        var sql = @"
            SELECT p.* 
            FROM participation p
            INNER JOIN activity a ON p.activity_id = a.id
            INNER JOIN employee e ON p.employee_id = e.id
            WHERE p.result->>'{0}' = {1}
            ORDER BY p.created_at DESC";

        return await _context.Participations
            .FromSqlRaw(sql, key, valueJson.Trim('"'))
            .Include(p => p.Activity)
            .Include(p => p.Employee)
            .ToListAsync();
    }

    public async Task<IEnumerable<Participation>> GetTopPerformersByActivityTypeAsync(
        string activityType, 
        string sortKey, 
        int limit = 10)
    {
        var sql = $@"
            SELECT p.* 
            FROM participation p
            INNER JOIN activity a ON p.activity_id = a.id
            INNER JOIN employee e ON p.employee_id = e.id
            WHERE a.activity_type = {{0}}
                AND p.result ? {{1}}
                AND p.status = 'attended'
            ORDER BY (p.result->>{{1}})::numeric ASC
            LIMIT {{2}}";

        return await _context.Participations
            .FromSqlRaw(sql, activityType, sortKey, limit)
            .Include(p => p.Activity)
            .Include(p => p.Employee)
            .ToListAsync();
    }

    public async Task<Dictionary<string, int>> GetResultStatsByActivityTypeAsync(string activityType)
    {
        var participations = await _context.Participations
            .Include(p => p.Activity)
            .Where(p => 
                p.Activity.ActivityType == activityType && 
                p.Result != null)
            .ToListAsync();

        var stats = new Dictionary<string, int>
        {
            { "total_with_results", participations.Count },
            { "total_attended", participations.Count(p => p.Status == "attended") }
        };

        var keysToCheck = new[] { "rank", "score", "certificate_issued", "time", "hours_contributed", "donation_amount" };
        
        foreach (var key in keysToCheck)
        {
            var count = participations.Count(p => 
                p.Result != null && 
                p.Result.RootElement.TryGetProperty(key, out _));
            
            if (count > 0)
            {
                stats[$"with_{key}"] = count;
            }
        }

        return stats;
    }

    public async Task<Participation?> GetByActivityIdEmployeeIdForAttendanceAsync(
        int activityId, 
        int employeeId)
    {
        return await _context.Participations
            .Include(p => p.Activity)
            .Include(p => p.Employee)
            .Where(p => p.ActivityId == activityId && p.EmployeeId == employeeId)
            .FirstOrDefaultAsync();
    }

    // ============================================
    // ADVANCED QUERY EXAMPLES
    // ============================================

    public async Task<IEnumerable<Participation>> GetRunningResultsUnderTimeAsync(string maxTime)
    {
        var sql = @"
            SELECT p.* 
            FROM participation p
            INNER JOIN activity a ON p.activity_id = a.id
            INNER JOIN employee e ON p.employee_id = e.id
            WHERE a.activity_type = 'sports'
                AND p.result ? 'time'
                AND p.result->>'time' < {0}
            ORDER BY p.result->>'time'";

        return await _context.Participations
            .FromSqlRaw(sql, maxTime)
            .Include(p => p.Activity)
            .Include(p => p.Employee)
            .ToListAsync();
    }

    public async Task<IEnumerable<Participation>> GetTrainingResultsAboveScoreAsync(int minScore)
    {
        var sql = @"
            SELECT p.* 
            FROM participation p
            INNER JOIN activity a ON p.activity_id = a.id
            INNER JOIN employee e ON p.employee_id = e.id
            WHERE a.activity_type = 'training'
                AND p.result ? 'quiz_score'
                AND (p.result->>'quiz_score')::int > {0}
            ORDER BY (p.result->>'quiz_score')::int DESC";

        return await _context.Participations
            .FromSqlRaw(sql, minScore)
            .Include(p => p.Activity)
            .Include(p => p.Employee)
            .ToListAsync();
    }

    public async Task<Dictionary<int, double>> GetVolunteerHoursByEmployeeAsync()
    {
        var sql = @"
            SELECT 
                p.employee_id,
                SUM((p.result->>'hours_contributed')::numeric) as total_hours
            FROM participation p
            INNER JOIN activity a ON p.activity_id = a.id
            WHERE a.activity_type = 'volunteer'
                AND p.result ? 'hours_contributed'
            GROUP BY p.employee_id
            ORDER BY total_hours DESC";

        var result = await _context.Database
            .SqlQueryRaw<VolunteerHoursSummary>(sql)
            .ToListAsync();

        return result.ToDictionary(
            x => x.EmployeeId, 
            x => (double)x.TotalHours);
    }

    public async Task<IEnumerable<Participation>> GetCertifiedEmployeesAsync()
    {
        var sql = @"
            SELECT p.* 
            FROM participation p
            INNER JOIN activity a ON p.activity_id = a.id
            INNER JOIN employee e ON p.employee_id = e.id
            WHERE p.result ? 'certificate_issued'
                AND (p.result->>'certificate_issued')::boolean = true
            ORDER BY p.created_at DESC";

        return await _context.Participations
            .FromSqlRaw(sql)
            .Include(p => p.Activity)
            .Include(p => p.Employee)
            .ToListAsync();
    }

    public async Task<IEnumerable<Participation>> SearchInResultsAsync(string searchTerm)
    {
        var sql = @"
            SELECT p.* 
            FROM participation p
            INNER JOIN activity a ON p.activity_id = a.id
            INNER JOIN employee e ON p.employee_id = e.id
            WHERE p.result::text ILIKE {0}
            ORDER BY p.created_at DESC";

        return await _context.Participations
            .FromSqlRaw(sql, $"%{searchTerm}%")
            .Include(p => p.Activity)
            .Include(p => p.Employee)
            .ToListAsync();
    }

    // ============================================
    // NEW: PERFORMANCE-RELATED METHODS
    // ============================================

    /// <summary>
    /// Get participations by performance level
    /// </summary>
    public async Task<IEnumerable<Participation>> GetByPerformanceAsync(string performance)
    {
        return await _context.Participations
            .Include(p => p.Activity)
            .Include(p => p.Employee)
            .Where(p => p.Performance == performance)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    /// <summary>
    /// Get overall performance statistics across all activities
    /// </summary>
    public async Task<Dictionary<string, int>> GetPerformanceStatsAsync()
    {
        var stats = new Dictionary<string, int>();

        // Total participations with performance ratings
        var totalWithPerformance = await _context.Participations
            .Where(p => p.Performance != null)
            .CountAsync();

        stats["total_with_performance"] = totalWithPerformance;

        // Count by each performance level
        var bad = await _context.Participations
            .Where(p => p.Performance == "bad")
            .CountAsync();
        
        var good = await _context.Participations
            .Where(p => p.Performance == "good")
            .CountAsync();
        
        var excellent = await _context.Participations
            .Where(p => p.Performance == "excellent")
            .CountAsync();

        stats["bad"] = bad;
        stats["good"] = good;
        stats["excellent"] = excellent;

        // Total attended (potential candidates for performance rating)
        var totalAttended = await _context.Participations
            .Where(p => p.Status == "attended")
            .CountAsync();
        
        stats["total_attended"] = totalAttended;
        stats["not_rated_yet"] = totalAttended - totalWithPerformance;

        return stats;
    }

    /// <summary>
    /// Get performance statistics by activity type
    /// </summary>
    public async Task<Dictionary<string, int>> GetPerformanceStatsByActivityTypeAsync(
        string activityType)
    {
        var stats = new Dictionary<string, int>();

        var query = _context.Participations
            .Include(p => p.Activity)
            .Where(p => p.Activity.ActivityType == activityType);

        // Total for this activity type
        var total = await query.CountAsync();
        stats["total"] = total;

        // Total attended
        var totalAttended = await query
            .Where(p => p.Status == "attended")
            .CountAsync();
        stats["total_attended"] = totalAttended;

        // Total with performance ratings
        var totalWithPerformance = await query
            .Where(p => p.Performance != null)
            .CountAsync();
        stats["total_with_performance"] = totalWithPerformance;

        // Count by each performance level
        var bad = await query
            .Where(p => p.Performance == "bad")
            .CountAsync();
        
        var good = await query
            .Where(p => p.Performance == "good")
            .CountAsync();
        
        var excellent = await query
            .Where(p => p.Performance == "excellent")
            .CountAsync();

        stats["bad"] = bad;
        stats["good"] = good;
        stats["excellent"] = excellent;
        stats["not_rated_yet"] = totalAttended - totalWithPerformance;

        return stats;
    }

    /// <summary>
    /// Get all employees with excellent performance
    /// </summary>
    public async Task<IEnumerable<Participation>> GetExcellentPerformersAsync()
    {
        return await _context.Participations
            .Include(p => p.Activity)
            .Include(p => p.Employee)
            .Where(p => p.Performance == "excellent")
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    /// <summary>
    /// Get participations by performance and activity type
    /// Useful for queries like "Show me all excellent performers in sports activities"
    /// </summary>
    public async Task<IEnumerable<Participation>> GetByPerformanceAndActivityTypeAsync(
        string performance, 
        string activityType)
    {
        return await _context.Participations
            .Include(p => p.Activity)
            .Include(p => p.Employee)
            .Where(p => 
                p.Performance == performance && 
                p.Activity.ActivityType == activityType)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }
}

// ============================================
// Helper class for raw SQL queries
// ============================================
public class VolunteerHoursSummary
{
    public int EmployeeId { get; set; }
    public decimal TotalHours { get; set; }
}