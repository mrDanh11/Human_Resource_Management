using AutoMapper;
using HRMApi.DTOs.Attendance;
using HRMApi.Models;

namespace HRMApi.Mappings;

public class AttendanceMappingProfile : Profile
{
    public AttendanceMappingProfile()
    {
        // ============================================
        // ATTENDANCE MAPPINGS
        // ============================================

        // Attendance -> AttendanceResponseDto
        CreateMap<Attendance, AttendanceResponseDto>()
            .ForMember(dest => dest.EmployeeName, opt => opt.MapFrom(src => src.Employee.Fullname))
            .ForMember(dest => dest.EmployeeEmail, opt => opt.MapFrom(src => src.Employee.Email))
            .ForMember(dest => dest.IsLate, opt => opt.Ignore()) // Calculated in service
            .ForMember(dest => dest.IsEarlyLeave, opt => opt.Ignore()) // Calculated in service
            .ForMember(dest => dest.LateMinutes, opt => opt.Ignore()) // Calculated in service
            .ForMember(dest => dest.EarlyLeaveMinutes, opt => opt.Ignore()); // Calculated in service

        // CreateAttendanceDto -> Attendance
        CreateMap<CreateAttendanceDto, Attendance>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.Employee, opt => opt.Ignore());

        // UpdateAttendanceDto -> Attendance (for updating existing)
        CreateMap<UpdateAttendanceDto, Attendance>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.EmployeeId, opt => opt.Ignore())
            .ForMember(dest => dest.Date, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.Employee, opt => opt.Ignore())
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        // SyncAttendanceFromDeviceDto -> Attendance
        CreateMap<SyncAttendanceFromDeviceDto, Attendance>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.Ignore()) // Will be calculated
            .ForMember(dest => dest.WorkHours, opt => opt.Ignore()) // Will be calculated
            .ForMember(dest => dest.OvertimeHours, opt => opt.Ignore()) // Will be calculated
            .ForMember(dest => dest.Attachment, opt => opt.Ignore())
            .ForMember(dest => dest.Note, opt => opt.MapFrom(src => $"Synced from device: {src.DeviceId}"))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.Employee, opt => opt.Ignore());

        // ============================================
        // TIMESHEET SUMMARY MAPPINGS
        // ============================================

        // This is mostly constructed manually in service, but we can map basic fields
        CreateMap<Employee, TimesheetSummaryDto>()
            .ForMember(dest => dest.EmployeeId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.EmployeeName, opt => opt.MapFrom(src => src.Fullname))
            .ForMember(dest => dest.FromDate, opt => opt.Ignore())
            .ForMember(dest => dest.ToDate, opt => opt.Ignore())
            .ForMember(dest => dest.TotalWorkingDays, opt => opt.Ignore())
            .ForMember(dest => dest.PresentDays, opt => opt.Ignore())
            .ForMember(dest => dest.AbsentDays, opt => opt.Ignore())
            .ForMember(dest => dest.LateDays, opt => opt.Ignore())
            .ForMember(dest => dest.HalfDays, opt => opt.Ignore())
            .ForMember(dest => dest.WfhDays, opt => opt.Ignore())
            .ForMember(dest => dest.TotalWorkHours, opt => opt.Ignore())
            .ForMember(dest => dest.TotalOvertimeHours, opt => opt.Ignore())
            .ForMember(dest => dest.AverageWorkHoursPerDay, opt => opt.Ignore())
            .ForMember(dest => dest.Attendances, opt => opt.Ignore());

        // ============================================
        // STATISTICS MAPPINGS
        // ============================================

        CreateMap<Employee, AttendanceStatisticsDto>()
            .ForMember(dest => dest.EmployeeId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.EmployeeName, opt => opt.MapFrom(src => src.Fullname))
            .ForMember(dest => dest.Year, opt => opt.Ignore())
            .ForMember(dest => dest.Month, opt => opt.Ignore())
            .ForMember(dest => dest.TotalWorkingDays, opt => opt.Ignore())
            .ForMember(dest => dest.PresentDays, opt => opt.Ignore())
            .ForMember(dest => dest.AbsentDays, opt => opt.Ignore())
            .ForMember(dest => dest.LateDays, opt => opt.Ignore())
            .ForMember(dest => dest.WfhDays, opt => opt.Ignore())
            .ForMember(dest => dest.TotalWorkHours, opt => opt.Ignore())
            .ForMember(dest => dest.TotalOvertimeHours, opt => opt.Ignore())
            .ForMember(dest => dest.AttendanceRate, opt => opt.Ignore())
            .ForMember(dest => dest.TotalLateMinutes, opt => opt.Ignore())
            .ForMember(dest => dest.AverageLateMinutes, opt => opt.Ignore());
    }
}