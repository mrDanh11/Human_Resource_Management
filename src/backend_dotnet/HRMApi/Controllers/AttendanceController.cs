using HRMApi.DTOs.Attendance;
using HRMApi.Services;
using Microsoft.AspNetCore.Authorization;
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

    // ============================================
    // EMPLOYEE ENDPOINTS
    // ============================================

    /// <summary>
    /// [EMPLOYEE] Xem timesheet của mình
    /// </summary>
    [HttpGet("my-timesheet")]
    [Authorize(Policy = "attendance:view-own")]
    [ProducesResponseType(typeof(TimesheetSummaryDto), 200)]
    public async Task<ActionResult<TimesheetSummaryDto>> GetMyTimesheet(
        [FromQuery] DateOnly fromDate,
        [FromQuery] DateOnly toDate)
    {
        try
        {
            var employeeIdClaim = User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value;
            
            if (string.IsNullOrEmpty(employeeIdClaim) || !int.TryParse(employeeIdClaim, out int employeeId))
            {
                return Unauthorized("Employee ID not found in token");
            }

            var result = await _attendanceService.GetMyTimesheetAsync(employeeId, fromDate, toDate);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting employee timesheet");
            return StatusCode(500, new { message = "Lỗi khi lấy bảng công", error = ex.Message });
        }
    }

    /// <summary>
    /// [EMPLOYEE] Xem attendance của mình theo ngày cụ thể
    /// </summary>
    [HttpGet("my-attendance/{date}")]
    [Authorize(Policy = "attendance:view-own")]
    [ProducesResponseType(typeof(AttendanceResponseDto), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<AttendanceResponseDto>> GetMyAttendanceByDate(DateOnly date)
    {
        try
        {
            var employeeIdClaim = User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value;
            
            if (string.IsNullOrEmpty(employeeIdClaim) || !int.TryParse(employeeIdClaim, out int employeeId))
            {
                return Unauthorized("Employee ID not found in token");
            }

            var result = await _attendanceService.GetAttendanceByDateAsync(employeeId, date);
            
            if (result == null)
            {
                return NotFound(new { message = "Không tìm thấy dữ liệu chấm công cho ngày này" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting attendance by date");
            return StatusCode(500, new { message = "Lỗi khi lấy dữ liệu chấm công", error = ex.Message });
        }
    }

    /// <summary>
    /// [EMPLOYEE] Xem thống kê chấm công của mình
    /// </summary>
    [HttpGet("my-statistics")]
    [Authorize(Policy = "attendance:view-own")]
    [ProducesResponseType(typeof(AttendanceStatisticsDto), 200)]
    public async Task<ActionResult<AttendanceStatisticsDto>> GetMyAttendanceStatistics(
        [FromQuery] int year,
        [FromQuery] int month)
    {
        try
        {
            var employeeIdClaim = User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value;
            
            if (string.IsNullOrEmpty(employeeIdClaim) || !int.TryParse(employeeIdClaim, out int employeeId))
            {
                return Unauthorized("Employee ID not found in token");
            }

            var result = await _attendanceService.GetMyAttendanceStatisticsAsync(employeeId, year, month);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting attendance statistics");
            return StatusCode(500, new { message = "Lỗi khi lấy thống kê chấm công", error = ex.Message });
        }
    }

    /// <summary>
    /// [EMPLOYEE] Gửi yêu cầu chỉnh sửa attendance
    /// </summary>
    [HttpPost("correction-request")]
    [Authorize(Policy = "attendance:request-correction")]
    [ProducesResponseType(typeof(int), 201)]
    [ProducesResponseType(400)]
    public async Task<ActionResult<int>> CreateAttendanceCorrectionRequest(
        [FromBody] CreateAttendanceCorrectionRequestDto dto)
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
            
            if (string.IsNullOrEmpty(employeeIdClaim) || !int.TryParse(employeeIdClaim, out int employeeId))
            {
                return Unauthorized("Employee ID not found in token");
            }

            var requestId = await _attendanceService.CreateAttendanceCorrectionRequestAsync(
                employeeId, dto);

            return CreatedAtAction(
                nameof(GetAttendanceById),
                new { id = requestId },
                new { requestId, message = "Gửi yêu cầu chỉnh sửa thành công" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating attendance correction request");
            return StatusCode(500, new { message = "Lỗi khi gửi yêu cầu", error = ex.Message });
        }
    }

    // ============================================
    // HR ENDPOINTS
    // ============================================

    /// <summary>
    /// [HR] Lấy danh sách attendance với filter và phân trang
    /// </summary>
    [HttpGet]
    [Authorize(Policy = "attendance:list")]
    [ProducesResponseType(typeof(List<AttendanceResponseDto>), 200)]
    public async Task<ActionResult<List<AttendanceResponseDto>>> GetAllAttendances(
        [FromQuery] AttendanceFilterDto filter)
    {
        try
        {
            var result = await _attendanceService.GetAllAttendancesAsync(filter);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all attendances");
            return StatusCode(500, new { message = "Lỗi khi lấy danh sách chấm công", error = ex.Message });
        }
    }

    /// <summary>
    /// [HR] Lấy attendance theo ID
    /// </summary>
    [HttpGet("{id}")]
    [Authorize(Policy = "attendance:view")]
    [ProducesResponseType(typeof(AttendanceResponseDto), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<AttendanceResponseDto>> GetAttendanceById(int id)
    {
        try
        {
            var result = await _attendanceService.GetAttendanceByIdAsync(id);
            
            if (result == null)
            {
                return NotFound(new { message = "Không tìm thấy dữ liệu chấm công" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting attendance {AttendanceId}", id);
            return StatusCode(500, new { message = "Lỗi khi lấy dữ liệu chấm công", error = ex.Message });
        }
    }

    /// <summary>
    /// [HR] Tạo attendance thủ công
    /// </summary>
    [HttpPost]
    [Authorize(Policy = "attendance:create")]
    [ProducesResponseType(typeof(AttendanceResponseDto), 201)]
    [ProducesResponseType(400)]
    public async Task<ActionResult<AttendanceResponseDto>> CreateAttendance(
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
                return BadRequest(new { message = "Dữ liệu không hợp lệ", errors });
            }

            var employeeIdClaim = User.Claims.FirstOrDefault(c => c.Type == "employeeId")?.Value;
            var createdBy = int.TryParse(employeeIdClaim, out int empId) ? empId : 0;

            var result = await _attendanceService.CreateAttendanceAsync(dto, createdBy);

            return CreatedAtAction(
                nameof(GetAttendanceById),
                new { id = result.Id },
                result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating attendance");
            return StatusCode(500, new { message = "Lỗi khi tạo dữ liệu chấm công", error = ex.Message });
        }
    }

    /// <summary>
    /// [HR] Cập nhật attendance (chỉnh sửa khi máy chấm công sai)
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Policy = "attendance:update")]
    [ProducesResponseType(typeof(AttendanceResponseDto), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<AttendanceResponseDto>> UpdateAttendance(
        int id,
        [FromBody] UpdateAttendanceDto dto)
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
            var updatedBy = int.TryParse(employeeIdClaim, out int empId) ? empId : 0;

            var result = await _attendanceService.UpdateAttendanceAsync(id, dto, updatedBy);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating attendance {AttendanceId}", id);
            return StatusCode(500, new { message = "Lỗi khi cập nhật dữ liệu chấm công", error = ex.Message });
        }
    }

    /// <summary>
    /// [HR] Xóa attendance
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Policy = "attendance:delete")]
    [ProducesResponseType(typeof(bool), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<bool>> DeleteAttendance(int id)
    {
        try
        {
            var result = await _attendanceService.DeleteAttendanceAsync(id);
            
            if (!result)
            {
                return NotFound(new { message = "Không tìm thấy dữ liệu chấm công" });
            }

            return Ok(new { success = true, message = "Xóa dữ liệu chấm công thành công" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting attendance {AttendanceId}", id);
            return StatusCode(500, new { message = "Lỗi khi xóa dữ liệu chấm công", error = ex.Message });
        }
    }

    /// <summary>
    /// [HR] Nhập nhiều attendance cùng lúc (bulk import)
    /// </summary>
    [HttpPost("bulk")]
    [Authorize(Policy = "attendance:create")]
    [ProducesResponseType(typeof(BulkCreateAttendanceResultDto), 200)]
    public async Task<ActionResult<BulkCreateAttendanceResultDto>> BulkCreateAttendances(
        [FromBody] BulkCreateAttendanceDto dto)
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
            var createdBy = int.TryParse(employeeIdClaim, out int empId) ? empId : 0;

            var result = await _attendanceService.BulkCreateAttendancesAsync(
                dto.Attendances, createdBy);

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error bulk creating attendances");
            return StatusCode(500, new { message = "Lỗi khi nhập hàng loạt", error = ex.Message });
        }
    }

    // ============================================
    // SYSTEM ENDPOINTS (Đồng bộ từ máy chấm công)
    // ============================================

    /// <summary>
    /// [SYSTEM] Đồng bộ dữ liệu từ máy chấm công
    /// </summary>
    [HttpPost("sync")]
    [Authorize(Policy = "attendance:sync")]
    [ProducesResponseType(typeof(AttendanceResponseDto), 200)]
    [ProducesResponseType(400)]
    public async Task<ActionResult<AttendanceResponseDto>> SyncFromDevice(
        [FromBody] SyncAttendanceFromDeviceDto dto)
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

            var result = await _attendanceService.SyncFromDeviceAsync(dto);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error syncing attendance from device");
            return StatusCode(500, new { message = "Lỗi khi đồng bộ dữ liệu", error = ex.Message });
        }
    }

    /// <summary>
    /// [HR] Xem timesheet của nhân viên cụ thể
    /// </summary>
    [HttpGet("employee/{employeeId}/timesheet")]
    [Authorize(Policy = "attendance:view")]
    [ProducesResponseType(typeof(TimesheetSummaryDto), 200)]
    public async Task<ActionResult<TimesheetSummaryDto>> GetEmployeeTimesheet(
        int employeeId,
        [FromQuery] DateOnly fromDate,
        [FromQuery] DateOnly toDate)
    {
        try
        {
            var result = await _attendanceService.GetMyTimesheetAsync(employeeId, fromDate, toDate);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting employee timesheet");
            return StatusCode(500, new { message = "Lỗi khi lấy bảng công", error = ex.Message });
        }
    }
}