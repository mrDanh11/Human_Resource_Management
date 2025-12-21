using AutoMapper;
using HRMApi.Data;
using HRMApi.DTOs;
using HRMApi.Models;
using HRMApi.Repositories;
using Microsoft.EntityFrameworkCore;

namespace HRMApi.Services;

public class ParticipationService : IParticipationService
{
    private readonly IParticipationRepository _participationRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly HrmDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<ParticipationService> _logger;

    public ParticipationService(
        IParticipationRepository participationRepository,
        IEmployeeRepository employeeRepository,
        HrmDbContext context,
        IMapper mapper,
        ILogger<ParticipationService> logger)
    {
        _participationRepository = participationRepository;
        _employeeRepository = employeeRepository;
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }


    public async Task<ApiResponse<IEnumerable<ParticipationDto>>> GetActivityParticipationAsync(int employeeId)
    {
        try
        {
            var employeeExists = await _employeeRepository.ExistsAsync(employeeId);
            if (!employeeExists)
            {
                return ApiResponse<IEnumerable<ParticipationDto>>.ErrorResponse(
                    "Không tìm thấy nhân viên",
                    new List<string> { $"Nhân viên với ID {employeeId} không tồn tại" });
            }

            var participation = await _participationRepository.GetByEmployeeIdAsync(employeeId);

            if (participation == null)
            {
                return ApiResponse<IEnumerable<ParticipationDto>>.ErrorResponse(
                    "Không tìm thấy thông tin điểm",
                    new List<string> { "Nhân viên chưa tham gia hoạt động nào" });
            }

            var dto = _mapper.Map<IEnumerable<ParticipationDto>>(participation);

            return ApiResponse<IEnumerable<ParticipationDto>>.SuccessResponse(
                dto,
                "Lấy thông tin tham gia thành công");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting employee participation infomation of {EmployeeId}", employeeId);
            throw;
        }
    }

    public async Task<ApiResponse<IEnumerable<ParticipationDto>>> GetEmployeeParticipationAsync(int activityId)
    {
        try
        {

            var participation = await _participationRepository.GetByActivityIdAsync(activityId);

            if (participation == null)
            {
                return ApiResponse<IEnumerable<ParticipationDto>>.ErrorResponse(
                    "Không tìm thấy người tham gia",
                    new List<string> { "Chưa có nhân viên nào tham gia hoạt động" });
            }

            var dto = _mapper.Map<IEnumerable<ParticipationDto>>(participation);

            return ApiResponse<IEnumerable<ParticipationDto>>.SuccessResponse(
                dto,
                "Lấy thông tin tham gia thành công");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting employee participated the activity");
            throw;
        }
    }

    public async Task<ApiResponse<ParticipationDto>> GetParticipationAsync(int activityId, int employeeId)
    {
        try
        {
            var employeeExists = await _employeeRepository.ExistsAsync(employeeId);
            if (!employeeExists)
            {
                return ApiResponse<ParticipationDto>.ErrorResponse(
                    "Không tìm thấy nhân viên",
                    new List<string> { $"Nhân viên với ID {employeeId} không tồn tại" });
            }

            var participation = await _participationRepository.GetByActivityIdEmployeeIdAsync(activityId, employeeId);

            if (participation == null)
            {
                return ApiResponse<ParticipationDto>.ErrorResponse(
                    "Không tìm thấy thông tin điểm",
                    new List<string> { "Nhân viên chưa tham gia hoạt động nào" });
            }

            var dto = _mapper.Map<ParticipationDto>(participation);

            return ApiResponse<ParticipationDto>.SuccessResponse(
                dto,
                "Lấy thông tin tham gia thành công");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting employee participation infomation of {EmployeeId}", employeeId);
            throw;
        }
    }

    public async Task<PagedResult<ParticipationDto>> GetAllParticipationsAsync(
        int pageNumber,
        int pageSize,
        string? searchTerm = null)
    {
        try
        {
            var items = await _participationRepository.GetPagedAsync(
                pageNumber, pageSize, searchTerm);

            var dtos = _mapper.Map<List<ParticipationDto>>(items);

            return new PagedResult<ParticipationDto>
            {
                Items = dtos,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all employee participations");
            throw;
        }
    }
}