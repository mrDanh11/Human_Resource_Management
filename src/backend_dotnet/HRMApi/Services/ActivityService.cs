using AutoMapper;
using HRMApi.Data;
using HRMApi.DTOs;
using HRMApi.Models;
using HRMApi.Repositories;

namespace HRMApi.Services;

public class ActivityService : IActivityService
{
    private readonly IActivityRepository _activityRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly HrmDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<ActivityService> _logger;

    public ActivityService(
        IActivityRepository activityRepository,
        IEmployeeRepository employeeRepository,
        HrmDbContext context,
        IMapper mapper,
        ILogger<ActivityService> logger)
    {
        _activityRepository = activityRepository;
        _employeeRepository = employeeRepository;
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    // ============================================
    // ACTIVITY CRUD
    // ============================================
    
    public async Task<PagedResult<ActivityListDto>> GetActivitiesAsync(
        int pageNumber,
        int pageSize,
        string? searchTerm = null,
        string? status = null,
        DateTime? fromDate = null,
        DateTime? toDate = null)
    {
        try
        {
            var (items, totalCount) = await _activityRepository.GetPagedAsync(
                pageNumber, pageSize, searchTerm, status, fromDate, toDate);

            var dtos = items.Select(a => new ActivityListDto
            {
                Id = a.Id,
                Name = a.Name,
                Description = a.Description,
                StartDate = a.StartDate,
                EndDate = a.EndDate,
                RegisterDeadline = a.RegisterDeadline,
                MaxParticipants = a.MaxParticipants,
                CurrentParticipants = a.Participations.Count(p => 
                    p.Status == "registered" || p.Status == "attended"),
                Status = a.Status,
                CreatedByName = a.CreatedByNavigation?.Fullname,
                CreatedAt = a.CreatedAt
            }).ToList();

            return new PagedResult<ActivityListDto>
            {
                Items = dtos,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting activities list");
            throw;
        }
    }

    public async Task<ActivityDetailDto?> GetActivityByIdAsync(int id)
    {
        try
        {
            var activity = await _activityRepository.GetByIdWithDetailsAsync(id);

            if (activity == null)
                return null;

            var participations = activity.Participations.Select(p => new ParticipationDto
            {
                Id = p.Id,
                EmployeeId = p.EmployeeId,
                EmployeeName = p.Employee.Fullname,
                EmployeeEmail = p.Employee.Email,
                ActivityId = p.ActivityId,
                RegisterDate = p.RegisterDate,
                CancelDate = p.CancelDate,
                Status = p.Status,
                StatusDisplay = GetStatusDisplay(p.Status),
                Result = p.Result,
                ResultDisplay = GetResultDisplay(p.Result),
                CreatedAt = p.CreatedAt
            }).ToList();

            return new ActivityDetailDto
            {
                Id = activity.Id,
                Name = activity.Name,
                Description = activity.Description,
                StartDate = activity.StartDate,
                EndDate = activity.EndDate,
                RegisterDeadline = activity.RegisterDeadline,
                MaxParticipants = activity.MaxParticipants,
                CurrentParticipants = activity.Participations.Count(p => 
                    p.Status == "registered" || p.Status == "attended"),
                Status = activity.Status,
                CreatedBy = activity.CreatedBy,
                CreatedByName = activity.CreatedByNavigation?.Fullname,
                CreatedAt = activity.CreatedAt,
                UpdatedAt = activity.UpdatedAt,
                Participations = participations
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting activity {ActivityId}", id);
            throw;
        }
    }

    public async Task<ApiResponse<ActivityDetailDto>> CreateActivityAsync(CreateActivityDto dto)
    {
        try
        {
            // Validate dates
            if (dto.EndDate <= dto.StartDate)
            {
                return ApiResponse<ActivityDetailDto>.ErrorResponse(
                    "Ngày kết thúc phải sau ngày bắt đầu",
                    new List<string>());
            }

            if (dto.RegisterDeadline >= dto.StartDate)
            {
                return ApiResponse<ActivityDetailDto>.ErrorResponse(
                    "Hạn đăng ký phải trước ngày bắt đầu",
                    new List<string>());
            }

            // Validate creator exists (if provided)
            if (dto.CreatedBy.HasValue)
            {
                var creatorExists = await _employeeRepository.ExistsAsync(dto.CreatedBy.Value);
                if (!creatorExists)
                {
                    return ApiResponse<ActivityDetailDto>.ErrorResponse(
                        "Người tạo không tồn tại",
                        new List<string> { $"Nhân viên với ID {dto.CreatedBy} không tồn tại" });
                }
            }

            var activity = new Activity
            {
                Name = dto.Name,
                Description = dto.Description,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                RegisterDeadline = dto.RegisterDeadline,
                MaxParticipants = dto.MaxParticipants,
                Status = "upcoming",
                CreatedBy = dto.CreatedBy,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var createdActivity = await _activityRepository.AddAsync(activity);

            var activityDetail = await GetActivityByIdAsync(createdActivity.Id);

            return ApiResponse<ActivityDetailDto>.SuccessResponse(
                activityDetail!,
                "Tạo hoạt động thành công");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating activity");
            return ApiResponse<ActivityDetailDto>.ErrorResponse(
                "Lỗi khi tạo hoạt động",
                new List<string> { ex.Message });
        }
    }

    public async Task<ApiResponse<ActivityDetailDto>> UpdateActivityAsync(
        int id, 
        UpdateActivityDto dto)
    {
        try
        {
            var activity = await _activityRepository.GetByIdAsync(id);

            if (activity == null)
            {
                return ApiResponse<ActivityDetailDto>.ErrorResponse(
                    "Không tìm thấy hoạt động",
                    new List<string> { $"Hoạt động với ID {id} không tồn tại" });
            }

            // Validate dates
            if (dto.EndDate <= dto.StartDate)
            {
                return ApiResponse<ActivityDetailDto>.ErrorResponse(
                    "Ngày kết thúc phải sau ngày bắt đầu",
                    new List<string>());
            }

            if (dto.RegisterDeadline >= dto.StartDate)
            {
                return ApiResponse<ActivityDetailDto>.ErrorResponse(
                    "Hạn đăng ký phải trước ngày bắt đầu",
                    new List<string>());
            }

            // Update fields
            activity.Name = dto.Name;
            activity.Description = dto.Description;
            activity.StartDate = dto.StartDate.ToUniversalTime();
            activity.EndDate = dto.EndDate.ToUniversalTime();
            activity.RegisterDeadline = dto.RegisterDeadline.ToUniversalTime();
            activity.MaxParticipants = dto.MaxParticipants;
            
            if (!string.IsNullOrWhiteSpace(dto.Status))
            {
                activity.Status = dto.Status;
            }
            
            activity.UpdatedAt = DateTime.UtcNow;

            await _activityRepository.UpdateAsync(activity);

            var activityDetail = await GetActivityByIdAsync(id);

            return ApiResponse<ActivityDetailDto>.SuccessResponse(
                activityDetail!,
                "Cập nhật hoạt động thành công");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating activity {ActivityId}", id);
            return ApiResponse<ActivityDetailDto>.ErrorResponse(
                "Lỗi khi cập nhật hoạt động",
                new List<string> { ex.Message });
        }
    }

    public async Task<ApiResponse<bool>> CancelActivityAsync(int id, string? reason = null)
    {
        try
        {
            var activity = await _activityRepository.GetByIdAsync(id);

            if (activity == null)
            {
                return ApiResponse<bool>.ErrorResponse(
                    "Không tìm thấy hoạt động",
                    new List<string> { $"Hoạt động với ID {id} không tồn tại" });
            }

            if (activity.Status == "cancelled")
            {
                return ApiResponse<bool>.ErrorResponse(
                    "Hoạt động đã bị hủy",
                    new List<string> { "Không thể hủy hoạt động đã bị hủy" });
            }

            if (activity.Status == "completed")
            {
                return ApiResponse<bool>.ErrorResponse(
                    "Hoạt động đã hoàn thành",
                    new List<string> { "Không thể hủy hoạt động đã hoàn thành" });
            }

            // Update activity status
            activity.Status = "cancelled";
            activity.UpdatedAt = DateTime.UtcNow;
            
            if (!string.IsNullOrWhiteSpace(reason))
            {
                activity.Description = activity.Description + 
                    $"\n\n[HỦY BỎ] Lý do: {reason}";
            }

            await _activityRepository.UpdateAsync(activity);

            // Cancel all pending participations
            var participations = await _activityRepository
                .GetParticipationsByActivityIdAsync(id);
            
            foreach (var participation in participations)
            {
                if (participation.Status == "registered")
                {
                    participation.Status = "cancelled";
                    participation.CancelDate = DateTime.UtcNow;
                    await _activityRepository.UpdateParticipationAsync(participation);
                }
            }

            return ApiResponse<bool>.SuccessResponse(
                true, 
                "Hủy hoạt động thành công");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cancelling activity {ActivityId}", id);
            return ApiResponse<bool>.ErrorResponse(
                "Lỗi khi hủy hoạt động",
                new List<string> { ex.Message });
        }
    }

    public async Task<bool> ActivityExistsAsync(int id)
    {
        return await _activityRepository.ExistsAsync(id);
    }

    // ============================================
    // PARTICIPATION MANAGEMENT
    // ============================================
    
    public async Task<PagedResult<ParticipationDto>> GetParticipationsAsync(
        int pageNumber,
        int pageSize,
        int? activityId = null,
        int? employeeId = null,
        string? status = null,
        string? result = null)
    {
        try
        {
            var (items, totalCount) = await _activityRepository.GetParticipationsPagedAsync(
                pageNumber, pageSize, activityId, employeeId, status, result);

            var dtos = items.Select(p => new ParticipationDto
            {
                Id = p.Id,
                EmployeeId = p.EmployeeId,
                EmployeeName = p.Employee.Fullname,
                EmployeeEmail = p.Employee.Email,
                ActivityId = p.ActivityId,
                ActivityName = p.Activity.Name,
                RegisterDate = p.RegisterDate,
                CancelDate = p.CancelDate,
                Status = p.Status,
                StatusDisplay = GetStatusDisplay(p.Status),
                Result = p.Result,
                ResultDisplay = GetResultDisplay(p.Result),
                CreatedAt = p.CreatedAt
            }).ToList();

            return new PagedResult<ParticipationDto>
            {
                Items = dtos,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting participations");
            throw;
        }
    }

    public async Task<ParticipationDto?> GetParticipationByIdAsync(int id)
    {
        try
        {
            var participation = await _activityRepository.GetParticipationWithDetailsAsync(id);

            if (participation == null)
                return null;

            return new ParticipationDto
            {
                Id = participation.Id,
                EmployeeId = participation.EmployeeId,
                EmployeeName = participation.Employee.Fullname,
                EmployeeEmail = participation.Employee.Email,
                ActivityId = participation.ActivityId,
                ActivityName = participation.Activity.Name,
                RegisterDate = participation.RegisterDate,
                CancelDate = participation.CancelDate,
                Status = participation.Status,
                StatusDisplay = GetStatusDisplay(participation.Status),
                Result = participation.Result,
                ResultDisplay = GetResultDisplay(participation.Result),
                CreatedAt = participation.CreatedAt
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting participation {ParticipationId}", id);
            throw;
        }
    }

    public async Task<ApiResponse<ParticipationDto>> UpdateParticipationResultAsync(
        int participationId, 
        UpdateParticipationResultDto dto)
    {
        try
        {
            var participation = await _activityRepository
                .GetParticipationWithDetailsAsync(participationId);

            if (participation == null)
            {
                return ApiResponse<ParticipationDto>.ErrorResponse(
                    "Không tìm thấy thông tin tham gia",
                    new List<string> { $"Tham gia với ID {participationId} không tồn tại" });
            }

            // Validate activity status
            if (participation.Activity.Status == "cancelled")
            {
                return ApiResponse<ParticipationDto>.ErrorResponse(
                    "Không thể cập nhật",
                    new List<string> { "Hoạt động đã bị hủy" });
            }

            // Update result
            participation.Result = dto.Result;
            
            // Auto-update status based on result
            if (dto.Result == "absent")
            {
                participation.Status = "absent";
            }
            else if (participation.Status == "registered")
            {
                participation.Status = "attended";
            }

            await _activityRepository.UpdateParticipationAsync(participation);

            var updatedParticipation = await GetParticipationByIdAsync(participationId);

            return ApiResponse<ParticipationDto>.SuccessResponse(
                updatedParticipation!,
                "Cập nhật kết quả tham gia thành công");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating participation result {ParticipationId}", participationId);
            return ApiResponse<ParticipationDto>.ErrorResponse(
                "Lỗi khi cập nhật kết quả",
                new List<string> { ex.Message });
        }
    }

    // ============================================
    // STATISTICS
    // ============================================
    
    public async Task<ActivityStatisticsDto> GetStatisticsAsync()
    {
        try
        {
            var totalActivities = await _activityRepository.GetTotalActivitiesCountAsync();
            var activitiesByStatus = await _activityRepository.GetActivitiesByStatusAsync();
            var totalParticipations = await _activityRepository.GetTotalParticipationsCountAsync();

            return new ActivityStatisticsDto
            {
                TotalActivities = totalActivities,
                UpcomingActivities = activitiesByStatus.GetValueOrDefault("upcoming", 0),
                OngoingActivities = activitiesByStatus.GetValueOrDefault("ongoing", 0),
                CompletedActivities = activitiesByStatus.GetValueOrDefault("completed", 0),
                CancelledActivities = activitiesByStatus.GetValueOrDefault("cancelled", 0),
                TotalParticipations = totalParticipations,
                AverageParticipantsPerActivity = totalActivities > 0 
                    ? (double)totalParticipations / totalActivities 
                    : 0
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting activity statistics");
            throw;
        }
    }

    // ============================================
    // HELPER METHODS
    // ============================================
    
    private static string GetStatusDisplay(string? status)
    {
        return status?.ToLower() switch
        {
            "registered" => "Đã đăng ký",
            "attended" => "Đã tham dự",
            "cancelled" => "Đã hủy",
            "absent" => "Vắng mặt",
            _ => status ?? "Không xác định"
        };
    }

    private static string GetResultDisplay(string? result)
    {
        return result?.ToLower() switch
        {
            "excellent" => "Xuất sắc",
            "good" => "Tốt",
            "average" => "Trung bình",
            "poor" => "Kém",
            "absent" => "Vắng mặt",
            _ => result ?? "Chưa đánh giá"
        };
    }
}