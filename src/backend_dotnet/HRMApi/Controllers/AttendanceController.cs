using HRMApi.DTOs;
using HRMApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace HRMApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AttendanceController : ControllerBase
{
    private readonly IAttendanceService _attendanceService;
    private readonly ILogger<AttendanceController> _logger;

    public AttendanceController(
        IAttendanceService attendanceService,
        ILogger<AttendanceController> logger)
    {
        _attendanceService = attendanceService;
        _logger = logger;
    }

    /// <summary>
    /// Tạo bản ghi chấm công mới
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<AttendanceDetailDto>), 201)]
    [ProducesResponseType(400)]
    public async Task<ActionResult<ApiResponse<AttendanceDetailDto>>> CreateAttendance(
        [FromBody] CreateAttendanceDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(ApiResponse<object>.ErrorResponse(
                    "Dữ liệu không hợp lệ",
                    errors));
            }

            var result = await _attendanceService.CreateAttendanceAsync(dto);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Created($"/api/v1/attendance/{result.Data!.Id}", result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating attendance");
            return StatusCode(500, ApiResponse<object>.ErrorResponse(
                "Lỗi khi tạo bản ghi chấm công",
                new List<string> { ex.Message }));
        }
    }
}
