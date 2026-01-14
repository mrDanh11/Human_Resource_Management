using HRMApi.DTOs.Request;
using HRMApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HRMApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class RequestController : ControllerBase
{
    private readonly IRequestService _requestService;
    private readonly ILogger<RequestController> _logger;

    public RequestController(
        IRequestService requestService,
        ILogger<RequestController> logger)
    {
        _requestService = requestService;
        _logger = logger;
    }

    // ============================================
    // EMPLOYEE ENDPOINTS
    // ============================================

    /// <summary>
    /// [EMPLOYEE] Xem danh sách requests của mình
    /// </summary>
    [HttpGet("my-requests")]
    [Authorize(Policy = "request:view-own")]
    [ProducesResponseType(typeof(List<RequestResponseDto>), 200)]
    public async Task<ActionResult<List<RequestResponseDto>>> GetMyRequests()
    {
        try
        {
            var employeeIdClaim = User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value;
            
            if (string.IsNullOrEmpty(employeeIdClaim) || !int.TryParse(employeeIdClaim, out int employeeId))
            {
                return Unauthorized("Employee ID not found in token");
            }

            var requests = await _requestService.GetMyRequestsAsync(employeeId);
            return Ok(requests);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting my requests");
            return StatusCode(500, new { message = "Lỗi khi lấy danh sách yêu cầu", error = ex.Message });
        }
    }

    /// <summary>
    /// [EMPLOYEE/HR] Xem chi tiết request
    /// </summary>
    [HttpGet("{id}")]
    [Authorize(Policy = "request:view")]
    [ProducesResponseType(typeof(RequestResponseDto), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<RequestResponseDto>> GetRequestById(int id)
    {
        try
        {
            var request = await _requestService.GetRequestByIdAsync(id);
            
            if (request == null)
            {
                return NotFound(new { message = "Không tìm thấy yêu cầu" });
            }

            // Check permission: employee chỉ xem được request của mình
            var employeeIdClaim = User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value;
            var role = User.Claims.FirstOrDefault(c => c.Type == "role")?.Value;

            if (role == "employee" && employeeIdClaim != request.EmployeeId.ToString())
            {
                return Forbid();
            }

            return Ok(request);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting request {RequestId}", id);
            return StatusCode(500, new { message = "Lỗi khi lấy chi tiết yêu cầu", error = ex.Message });
        }
    }

    // ============================================
    // HR/MANAGER ENDPOINTS
    // ============================================

    /// <summary>
    /// [HR/MANAGER] Lấy danh sách tất cả requests với filter
    /// </summary>
    [HttpGet]
    [Authorize(Policy = "request:list")]
    [ProducesResponseType(typeof(List<RequestResponseDto>), 200)]
    public async Task<ActionResult<List<RequestResponseDto>>> GetAllRequests(
        [FromQuery] RequestFilterDto filter)
    {
        try
        {
            var requests = await _requestService.GetAllRequestsAsync(filter);
            return Ok(requests);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all requests");
            return StatusCode(500, new { message = "Lỗi khi lấy danh sách yêu cầu", error = ex.Message });
        }
    }

    /// <summary>
    /// [HR/MANAGER] Lấy danh sách requests đang chờ duyệt
    /// </summary>
    [HttpGet("pending")]
    [Authorize(Policy = "request:list")]
    [ProducesResponseType(typeof(List<RequestResponseDto>), 200)]
    public async Task<ActionResult<List<RequestResponseDto>>> GetPendingRequests()
    {
        try
        {
            var requests = await _requestService.GetPendingRequestsAsync();
            return Ok(requests);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting pending requests");
            return StatusCode(500, new { message = "Lỗi khi lấy danh sách yêu cầu chờ duyệt", error = ex.Message });
        }
    }

    /// <summary>
    /// [HR/MANAGER] Phê duyệt hoặc từ chối request
    /// </summary>
    [HttpPost("{id}/process")]
    [Authorize(Policy = "request:approve")]
    [ProducesResponseType(typeof(RequestResponseDto), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<RequestResponseDto>> ProcessRequest(
        int id,
        [FromBody] ProcessRequestDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return BadRequest(new { message = "Dữ liệu không hợp lệ", errors });
            }

            var employeeIdClaim = User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value;
            var approverId = int.TryParse(employeeIdClaim, out int empId) ? empId : 0;

            var result = await _requestService.ProcessRequestAsync(id, dto, approverId);
            
            return Ok(new 
            { 
                message = dto.Status == "approved" ? "Đã phê duyệt yêu cầu" : "Đã từ chối yêu cầu",
                data = result 
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing request {RequestId}", id);
            return StatusCode(500, new { message = "Lỗi khi xử lý yêu cầu", error = ex.Message });
        }
    }

    /// <summary>
    /// [HR/MANAGER] Phê duyệt hoặc từ chối nhiều requests cùng lúc
    /// </summary>
    [HttpPost("batch-process")]
    [Authorize(Policy = "request:approve")]
    [ProducesResponseType(typeof(BatchProcessResultDto), 200)]
    [ProducesResponseType(400)]
    public async Task<ActionResult<BatchProcessResultDto>> BatchProcessRequests(
        [FromBody] BatchProcessRequestDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return BadRequest(new { message = "Dữ liệu không hợp lệ", errors });
            }

            var employeeIdClaim = User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value;
            var approverId = int.TryParse(employeeIdClaim, out int empId) ? empId : 0;

            var result = await _requestService.BatchProcessRequestsAsync(dto, approverId);
            
            return Ok(new 
            { 
                message = $"Xử lý hoàn tất: {result.SuccessCount} thành công, {result.FailedCount} thất bại",
                data = result 
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error batch processing requests");
            return StatusCode(500, new { message = "Lỗi khi xử lý hàng loạt", error = ex.Message });
        }
    }

    /// <summary>
    /// [HR/MANAGER] Xóa request
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Policy = "request:delete")]
    [ProducesResponseType(typeof(bool), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<bool>> DeleteRequest(int id)
    {
        try
        {
            var result = await _requestService.DeleteRequestAsync(id);
            
            if (!result)
            {
                return NotFound(new { message = "Không tìm thấy yêu cầu" });
            }

            return Ok(new { success = true, message = "Xóa yêu cầu thành công" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting request {RequestId}", id);
            return StatusCode(500, new { message = "Lỗi khi xóa yêu cầu", error = ex.Message });
        }
    }

    // ============================================
    // STATISTICS
    // ============================================

    /// <summary>
    /// [HR/MANAGER] Xem thống kê requests
    /// </summary>
    [HttpGet("statistics")]
    [Authorize(Policy = "request:statistics")]
    [ProducesResponseType(typeof(RequestStatisticsDto), 200)]
    public async Task<ActionResult<RequestStatisticsDto>> GetStatistics()
    {
        try
        {
            var statistics = await _requestService.GetRequestStatisticsAsync();
            return Ok(statistics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting request statistics");
            return StatusCode(500, new { message = "Lỗi khi lấy thống kê", error = ex.Message });
        }
    }
}