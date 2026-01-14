using HRMApi.Data;
using HRMApi.Models;
using Microsoft.EntityFrameworkCore;

namespace HRMApi.Repositories;
// ============================================
// IMPLEMENTATION
// ============================================

public class RequestRepository : IRequestRepository
{
    private readonly HrmDbContext _context;

    public RequestRepository(HrmDbContext context)
    {
        _context = context;
    }

    public async Task<Request?> GetByIdAsync(int id)
    {
        return await _context.Requests.FindAsync(id);
    }

    public async Task<Request?> GetByIdWithDetailsAsync(int id)
    {
        return await _context.Requests
            .Include(r => r.Employee)
                .ThenInclude(e => e.Department)
            .Include(r => r.ApprovalHistories)
                .ThenInclude(ah => ah.Approver)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<List<Request>> GetByEmployeeIdAsync(int employeeId)
    {
        return await _context.Requests
            .Include(r => r.Employee)
            .Include(r => r.ApprovalHistories)
            .Where(r => r.EmployeeId == employeeId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<Request> AddAsync(Request request)
    {
        await _context.Requests.AddAsync(request);
        await _context.SaveChangesAsync();
        return request;
    }

    public async Task UpdateAsync(Request request)
    {
        _context.Requests.Update(request);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var request = await _context.Requests.FindAsync(id);
        if (request != null)
        {
            _context.Requests.Remove(request);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<(List<Request> items, int totalCount)> GetPagedAsync(
        int pageNumber,
        int pageSize,
        int? employeeId = null,
        string? type = null,
        string? status = null,
        DateTime? fromDate = null,
        DateTime? toDate = null)
    {
        var query = _context.Requests
            .Include(r => r.Employee)
                .ThenInclude(e => e.Department)
            .Include(r => r.ApprovalHistories)
            .AsQueryable();

        // Apply filters
        if (employeeId.HasValue)
            query = query.Where(r => r.EmployeeId == employeeId.Value);

        if (!string.IsNullOrEmpty(type))
            query = query.Where(r => r.Type == type);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(r => r.Status == status);

        if (fromDate.HasValue)
            query = query.Where(r => r.CreatedAt >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(r => r.CreatedAt <= toDate.Value);

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<bool> ExistsByIdAsync(int id)
    {
        return await _context.Requests.AnyAsync(r => r.Id == id);
    }

    public async Task<List<Request>> GetPendingRequestsAsync()
    {
        return await _context.Requests
            .Include(r => r.Employee)
                .ThenInclude(e => e.Department)
            .Where(r => r.Status == "pending")
            .OrderBy(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Request>> GetRequestsByStatusAsync(string status)
    {
        return await _context.Requests
            .Include(r => r.Employee)
            .Where(r => r.Status == status)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<int> GetTotalRequestsCountAsync()
    {
        return await _context.Requests.CountAsync();
    }

    public async Task<int> GetPendingRequestsCountAsync()
    {
        return await _context.Requests.CountAsync(r => r.Status == "pending");
    }

    public async Task<Dictionary<string, int>> GetRequestCountsByTypeAsync()
    {
        return await _context.Requests
            .GroupBy(r => r.Type)
            .Select(g => new { Type = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.Type, x => x.Count);
    }

    public async Task<Dictionary<string, int>> GetRequestCountsByStatusAsync()
    {
        return await _context.Requests
            .GroupBy(r => r.Status ?? "unknown")
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.Status, x => x.Count);
    }
}