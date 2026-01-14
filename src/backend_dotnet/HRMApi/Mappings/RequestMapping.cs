using AutoMapper;
using HRMApi.DTOs.Request;
using HRMApi.Models;

namespace HRMApi.Mappings;

public class RequestMappingProfile : Profile
{
    public RequestMappingProfile()
    {
        // Request -> RequestResponseDto (mapping cơ bản, phần còn lại map manual trong service)
        CreateMap<Request, RequestResponseDto>()
            .ForMember(dest => dest.EmployeeName, opt => opt.MapFrom(src => src.Employee.Fullname))
            .ForMember(dest => dest.EmployeeEmail, opt => opt.MapFrom(src => src.Employee.Email))
            .ForMember(dest => dest.DepartmentName, opt => opt.MapFrom(src => 
                src.Employee.Department != null ? src.Employee.Department.Name : null))
            .ForMember(dest => dest.TypeDisplay, opt => opt.Ignore()) // Set in service
            .ForMember(dest => dest.StatusDisplay, opt => opt.Ignore()) // Set in service
            .ForMember(dest => dest.ApprovalHistories, opt => opt.Ignore()) // Set in service
            .ForMember(dest => dest.AttendanceDetail, opt => opt.Ignore()); // Set in service

        // ApprovalHistory -> ApprovalHistoryDto
        CreateMap<ApprovalHistory, ApprovalHistoryDto>()
            .ForMember(dest => dest.ApproverName, opt => opt.MapFrom(src => src.Approver.Fullname))
            .ForMember(dest => dest.StatusDisplay, opt => opt.Ignore()); // Set in service
    }
}