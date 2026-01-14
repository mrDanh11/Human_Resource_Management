using HRMApi.Data;
using HRMApi.Models;
using Microsoft.EntityFrameworkCore;

namespace HRMApi.Repositories;

// ============================================
// INTERFACE
// ============================================

public interface IRequestRepository
{
    // Basic CRUD
    Task<Request?> GetByIdAsync(int id);
    Task<Request?> GetByIdWithDetailsAsync(int id);
    Task<List<Request>> GetByEmployeeIdAsync(int employeeId);
    Task<Request> AddAsync(Request request);
    Task UpdateAsync(Request request);
    Task DeleteAsync(int id);
    
    // Queries with filters and paging
    Task<(List<Request> items, int totalCount)> GetPagedAsync(
        int pageNumber,
        int pageSize,
        int? employeeId = null,
        string? type = null,
        string? status = null,
        DateTime? fromDate = null,
        DateTime? toDate = null);
    
    // Check existence
    Task<bool> ExistsByIdAsync(int id);
    
    // Get by status
    Task<List<Request>> GetPendingRequestsAsync();
    Task<List<Request>> GetRequestsByStatusAsync(string status);
    
    // Statistics
    Task<int> GetTotalRequestsCountAsync();
    Task<int> GetPendingRequestsCountAsync();
    Task<Dictionary<string, int>> GetRequestCountsByTypeAsync();
    Task<Dictionary<string, int>> GetRequestCountsByStatusAsync();
}

