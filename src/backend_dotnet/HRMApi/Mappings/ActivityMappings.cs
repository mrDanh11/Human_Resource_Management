using AutoMapper;
using HRMApi.DTOs;
using HRMApi.Models;

namespace HRMApi.Mappings;

public class ActivityMappingProfile : Profile
{
    public ActivityMappingProfile()
    {
        // Activity -> ActivityListDto
        CreateMap<Activity, ActivityListDto>()
            .ForMember(dest => dest.CurrentParticipants, 
                opt => opt.MapFrom(src => src.Participations.Count(p => 
                    p.Status == "registered" || p.Status == "attended")))
            .ForMember(dest => dest.CreatedByName, 
                opt => opt.MapFrom(src => src.CreatedByNavigation != null 
                    ? src.CreatedByNavigation.Fullname 
                    : null));

        // Activity -> ActivityDetailDto
        CreateMap<Activity, ActivityDetailDto>()
            .ForMember(dest => dest.CurrentParticipants, 
                opt => opt.MapFrom(src => src.Participations.Count(p => 
                    p.Status == "registered" || p.Status == "attended")))
            .ForMember(dest => dest.CreatedByName, 
                opt => opt.MapFrom(src => src.CreatedByNavigation != null 
                    ? src.CreatedByNavigation.Fullname 
                    : null))
            .ForMember(dest => dest.Participations, 
                opt => opt.MapFrom(src => src.Participations));

        // Participation -> ParticipationDto
        CreateMap<Participation, ParticipationDto>()
            .ForMember(dest => dest.EmployeeName, 
                opt => opt.MapFrom(src => src.Employee.Fullname))
            .ForMember(dest => dest.EmployeeEmail, 
                opt => opt.MapFrom(src => src.Employee.Email))
            .ForMember(dest => dest.ActivityName, 
                opt => opt.MapFrom(src => src.Activity != null ? src.Activity.Name : null))
            .ForMember(dest => dest.StatusDisplay, 
                opt => opt.MapFrom(src => GetStatusDisplay(src.Status)))
            .ForMember(dest => dest.ResultDisplay, 
                opt => opt.MapFrom(src => GetResultDisplay(src.Result)));
    }

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