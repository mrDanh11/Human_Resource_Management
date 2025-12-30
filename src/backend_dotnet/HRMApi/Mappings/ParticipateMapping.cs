using AutoMapper;
using HRMApi.DTOs;
using HRMApi.Models;

namespace HRMApi.Mappings;

public class ParticipationMappingProfile : Profile
{
    public ParticipationMappingProfile()
    {
        CreateMap<Participation, ParticipationDto>()
            .ForMember(dest => dest.ActivityName, opt => opt.MapFrom(src => src.Activity.Name))
            .ForMember(dest => dest.EmployeeName, opt => opt.MapFrom(src => src.Employee.Fullname))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Activity.Description))
            .ForMember(dest => dest.imgPath, opt => opt.MapFrom(src => src.Activity.ImgActivity));
    }

    private static string GetStatusDisplay(string? status)
    {
        return status?.ToLower() switch
        {
            "registed" => "Đã đăng ký",
            "attended" => "Đã tham gia",
            _ => status ?? "Không xác định"
        };
    }
}