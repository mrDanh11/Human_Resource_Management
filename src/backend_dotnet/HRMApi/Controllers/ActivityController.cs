using HRMApi.DTOs;
using HRMApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HRMApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class ActivityController : ControllerBase
{
    private readonly IActivityService _activityService;
    private readonly ILogger<ActivityController> _logger;

    public ActivityController(
        IActivityService activityService,
        ILogger<ActivityController> logger)
    {
        _activityService = activityService;
        _logger = logger;
    }

    // ============================================
    // ACTIVITY ENDPOINTS
    // ============================================

    /// <summary>
    /// Lấy danh sách hoạt động với filter và phân trang
    /// </summary>
    [HttpGet]
    [Authorize(Policy = "activity:view")]
    [ProducesResponseType(typeof(PagedResult<ActivityListDto>), 200)]
    public async Task<ActionResult<PagedResult<ActivityListDto>>> GetActivities(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? status = null,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null)
    {
        try
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 10;

            var result = await _activityService.GetActivitiesAsync(
                pageNumber, pageSize, searchTerm, status, fromDate, toDate);

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting activities");
            return StatusCode(500, ApiResponse<object>.ErrorResponse(
                "Lỗi khi lấy danh sách hoạt động",
                new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Lấy thông tin chi tiết hoạt động theo ID
    /// </summary>
    [HttpGet("{id}")]
    [Authorize(Policy = "activity:view")]
    [ProducesResponseType(typeof(ApiResponse<ActivityDetailDto>), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<ApiResponse<ActivityDetailDto>>> GetActivity(int id)
    {
        try
        {
            var activity = await _activityService.GetActivityByIdAsync(id);

            if (activity == null)
            {
                return NotFound(ApiResponse<ActivityDetailDto>.ErrorResponse(
                    "Không tìm thấy hoạt động",
                    new List<string> { $"Hoạt động với ID {id} không tồn tại" }));
            }

            return Ok(ApiResponse<ActivityDetailDto>.SuccessResponse(
                activity,
                "Lấy thông tin hoạt động thành công"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting activity {ActivityId}", id);
            return StatusCode(500, ApiResponse<ActivityDetailDto>.ErrorResponse(
                "Lỗi khi lấy thông tin hoạt động",
                new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Tạo hoạt động mới
    /// </summary>
    [HttpPost]
    [Authorize(Policy = "activity:create")]
    [ProducesResponseType(typeof(ApiResponse<ActivityDetailDto>), 201)]
    [ProducesResponseType(400)]
    public async Task<ActionResult<ApiResponse<ActivityDetailDto>>> CreateActivity(
        [FromBody] CreateActivityDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(ApiResponse<ActivityDetailDto>.ErrorResponse(
                    "Dữ liệu không hợp lệ", errors));
            }

            var result = await _activityService.CreateActivityAsync(dto);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return CreatedAtAction(
                nameof(GetActivity),
                new { id = result.Data!.Id },
                result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating activity");
            return StatusCode(500, ApiResponse<ActivityDetailDto>.ErrorResponse(
                "Lỗi khi tạo hoạt động",
                new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Cập nhật thông tin hoạt động
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Policy = "activity:update")]
    [ProducesResponseType(typeof(ApiResponse<ActivityDetailDto>), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<ApiResponse<ActivityDetailDto>>> UpdateActivity(
        int id,
        [FromBody] UpdateActivityDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(ApiResponse<ActivityDetailDto>.ErrorResponse(
                    "Dữ liệu không hợp lệ", errors));
            }

            var result = await _activityService.UpdateActivityAsync(id, dto);

            if (!result.Success)
            {
                if (result.Message.Contains("Không tìm thấy"))
                {
                    return NotFound(result);
                }
                return BadRequest(result);
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating activity {ActivityId}", id);
            return StatusCode(500, ApiResponse<ActivityDetailDto>.ErrorResponse(
                "Lỗi khi cập nhật hoạt động",
                new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Hủy hoạt động (HR only)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Policy = "activity:delete")]
    [ProducesResponseType(typeof(ApiResponse<bool>), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<ApiResponse<bool>>> CancelActivity(
        int id,
        [FromQuery] string? reason = null)
    {
        try
        {
            var result = await _activityService.CancelActivityAsync(id, reason);

            if (!result.Success)
            {
                if (result.Message.Contains("Không tìm thấy"))
                {
                    return NotFound(result);
                }
                return BadRequest(result);
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cancelling activity {ActivityId}", id);
            return StatusCode(500, ApiResponse<bool>.ErrorResponse(
                "Lỗi khi hủy hoạt động",
                new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Lấy thống kê hoạt động
    /// </summary>
    [HttpGet("statistics")]
    [Authorize(Policy = "activity:statistics")]
    [ProducesResponseType(typeof(ApiResponse<ActivityStatisticsDto>), 200)]
    public async Task<ActionResult<ApiResponse<ActivityStatisticsDto>>> GetStatistics()
    {
        try
        {
            var statistics = await _activityService.GetStatisticsAsync();

            return Ok(ApiResponse<ActivityStatisticsDto>.SuccessResponse(
                statistics,
                "Lấy thống kê thành công"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting activity statistics");
            return StatusCode(500, ApiResponse<ActivityStatisticsDto>.ErrorResponse(
                "Lỗi khi lấy thống kê",
                new List<string> { ex.Message }));
        }
    }

    // ============================================
    // PARTICIPATION ENDPOINTS
    // ============================================

    /// <summary>
    /// Lấy danh sách tham gia với filter và phân trang
    /// </summary>
    [HttpGet("participations")]
    [Authorize(Policy = "participation:view")]
    [ProducesResponseType(typeof(PagedResult<ParticipationDto>), 200)]
    public async Task<ActionResult<PagedResult<ParticipationDto>>> GetParticipations(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] int? activityId = null,
        [FromQuery] int? employeeId = null,
        [FromQuery] string? status = null,
        [FromQuery] string? result = null)
    {
        try
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 10;

            var participations = await _activityService.GetParticipationsAsync(
                pageNumber, pageSize, activityId, employeeId, status, result);

            return Ok(participations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting participations");
            return StatusCode(500, ApiResponse<object>.ErrorResponse(
                "Lỗi khi lấy danh sách tham gia",
                new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Lấy thông tin chi tiết tham gia
    /// </summary>
    [HttpGet("participations/{id}")]
    [Authorize(Policy = "participation:view")]
    [ProducesResponseType(typeof(ApiResponse<ParticipationDto>), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<ApiResponse<ParticipationDto>>> GetParticipation(int id)
    {
        try
        {
            var participation = await _activityService.GetParticipationByIdAsync(id);

            if (participation == null)
            {
                return NotFound(ApiResponse<ParticipationDto>.ErrorResponse(
                    "Không tìm thấy thông tin tham gia",
                    new List<string> { $"Tham gia với ID {id} không tồn tại" }));
            }

            return Ok(ApiResponse<ParticipationDto>.SuccessResponse(
                participation,
                "Lấy thông tin tham gia thành công"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting participation {ParticipationId}", id);
            return StatusCode(500, ApiResponse<ParticipationDto>.ErrorResponse(
                "Lỗi khi lấy thông tin tham gia",
                new List<string> { ex.Message }));
        }
    }

    /// <summary>
    /// Cập nhật kết quả tham gia của nhân viên (HR only)
    /// </summary>
    [HttpPut("participations/{id}/result")]
    [Authorize(Policy = "participation:update")]
    [ProducesResponseType(typeof(ApiResponse<ParticipationDto>), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<ApiResponse<ParticipationDto>>> UpdateParticipationResult(
        int id,
        [FromBody] UpdateParticipationResultDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(ApiResponse<ParticipationDto>.ErrorResponse(
                    "Dữ liệu không hợp lệ", errors));
            }

            var result = await _activityService.UpdateParticipationResultAsync(id, dto);

            if (!result.Success)
            {
                if (result.Message.Contains("Không tìm thấy"))
                {
                    return NotFound(result);
                }
                return BadRequest(result);
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating participation result {ParticipationId}", id);
            return StatusCode(500, ApiResponse<ParticipationDto>.ErrorResponse(
                "Lỗi khi cập nhật kết quả tham gia",
                new List<string> { ex.Message }));
        }
    }
}