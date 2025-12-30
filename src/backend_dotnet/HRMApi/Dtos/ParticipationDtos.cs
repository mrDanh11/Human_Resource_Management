using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using HRMApi.Models;

namespace HRMApi.DTOs;

public class ParticipationDto
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public int ActivityId { get; set; }
    public string EmployeeName { get; set; } = null!;
    public string ActivityName { get; set; } = null!;
    public string Description { get; set; } = null!;
    public DateTime? RegisterDate { get; set; }
    public DateTime? CancelDate { get; set; }
    public string Status { get; set; } = null!;
    public string Result { get; set; } = null!;
    public string imgPath { get; set; } = null!;
}