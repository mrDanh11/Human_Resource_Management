using AutoMapper;
using HRMApi.Data;
using HRMApi.DTOs.Request;
using HRMApi.Models;
using HRMApi.Repositories;
using Microsoft.EntityFrameworkCore;

namespace HRMApi.Services;

// ============================================
// INTERFACE
// ============================================

public interface IRequestService
{
    // Employee - Xem requests của mình
    Task<List<RequestResponseDto>> GetMyRequestsAsync(int employeeId);
    Task<RequestResponseDto?> GetRequestByIdAsync(int id);
    
    // HR/Manager - Quản lý requests
    Task<List<RequestResponseDto>> GetAllRequestsAsync(RequestFilterDto filter);
    Task<List<RequestResponseDto>> GetPendingRequestsAsync();
    
    // HR/Manager - Phê duyệt requests
    Task<RequestResponseDto> ProcessRequestAsync(int requestId, ProcessRequestDto dto, int approverId);
    Task<BatchProcessResultDto> BatchProcessRequestsAsync(BatchProcessRequestDto dto, int approverId);
    
    // Statistics
    Task<RequestStatisticsDto> GetRequestStatisticsAsync();
    
    // Delete
    Task<bool> DeleteRequestAsync(int id);
}

// ============================================
// IMPLEMENTATION
// ============================================

