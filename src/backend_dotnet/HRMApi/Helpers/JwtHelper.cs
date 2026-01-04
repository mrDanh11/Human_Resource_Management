using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace HRMApi.Helpers;

public static class JwtHelper
{
    /// <summary>
    /// Lấy Employee ID từ JWT claims (match với Java JWT format)
    /// </summary>
    public static int? GetEmployeeIdFromClaims(HttpContext httpContext)
    {
        // Thử nhiều tên claim khác nhau
        var employeeIdClaim = httpContext.User.FindFirst("employeeId")  // lowercase từ Java
                              ?? httpContext.User.FindFirst("EmployeeId")
                              ?? httpContext.User.FindFirst("employee_id");
        
        if (employeeIdClaim != null && long.TryParse(employeeIdClaim.Value, out long employeeId))
        {
            return (int)employeeId;  // Java dùng Long, C# dùng int
        }
        
        return null;
    }
    
    /// <summary>
    /// Lấy User ID từ JWT claims
    /// </summary>
    public static int? GetUserIdFromClaims(HttpContext httpContext)
    {
        var userIdClaim = httpContext.User.FindFirst("userId")
                          ?? httpContext.User.FindFirst("UserId")
                          ?? httpContext.User.FindFirst("user_id")
                          ?? httpContext.User.FindFirst(ClaimTypes.NameIdentifier);
        
        if (userIdClaim != null && long.TryParse(userIdClaim.Value, out long userId))
        {
            return (int)userId;
        }
        
        return null;
    }
    
    /// <summary>
    /// Lấy Role từ JWT claims
    /// </summary>
    public static string? GetRoleFromClaims(HttpContext httpContext)
    {
        var roleClaim = httpContext.User.FindFirst("role")
                        ?? httpContext.User.FindFirst("Role")
                        ?? httpContext.User.FindFirst(ClaimTypes.Role);
        
        return roleClaim?.Value;
    }
}