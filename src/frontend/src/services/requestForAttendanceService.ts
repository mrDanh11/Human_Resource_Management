/**
 * - Service cho quản lý yêu cầu & phê duyệt
 * Các API calls: xem requests, approve/reject, batch processing
 */

import { apiDotNet } from './api';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface RequestResponseDto {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeEmail: string;
  departmentName: string | null;
  description: string;
  startTime: string | null;
  endTime: string | null;
  type: 'wfh' | 'leave' | 'overtime' | 'attendance_correction' | 'equipment' | 'other';
  typeDisplay: string;
  attachment: string | null;
  status: 'pending' | 'approved' | 'rejected';
  statusDisplay: string;
  createdAt: string;
  updatedAt: string;
  approvalHistories: ApprovalHistoryDto[];
  attendanceDetail: AttendanceCorrectionDetailDto | null;
}

export interface ApprovalHistoryDto {
  id: number;
  approverId: number;
  approverName: string;
  status: 'approved' | 'rejected';
  statusDisplay: string;
  note: string | null;
  createdAt: string;
}

export interface AttendanceCorrectionDetailDto {
  date: string; // "2026-01-15"
  currentCheckinTime: string | null;
  currentCheckoutTime: string | null;
  currentWorkHours: number | null;
  currentStatus: string | null;
  requestedCheckinTime: string | null;
  requestedCheckoutTime: string | null;
}

export interface ProcessRequestDto {
  status: 'approved' | 'rejected';
  note?: string | null;
  autoUpdateAttendance?: boolean; // Default: true
}

export interface BatchProcessRequestDto {
  requestIds: number[];
  status: 'approved' | 'rejected';
  note?: string | null;
  autoUpdateAttendance?: boolean; // Default: true
}

export interface BatchProcessResultDto {
  totalRequests: number;
  successCount: number;
  failedCount: number;
  errors: string[];
}

export interface RequestStatisticsDto {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  requestsByType: Record<string, number>;
  requestsByStatus: Record<string, number>;
}

export interface RequestFilterParams {
  employeeId?: number;
  type?: 'wfh' | 'leave' | 'overtime' | 'attendance_correction' | 'equipment' | 'other';
  status?: 'pending' | 'approved' | 'rejected';
  fromDate?: string;
  toDate?: string;
  pageNumber?: number;
  pageSize?: number;
}

// ============================================
// SERVICE FUNCTIONS
// ============================================

export const requestService = {
  // ============================================
  // EMPLOYEE METHODS
  // ============================================

  /**
   * [EMPLOYEE] Xem danh sách requests của mình
   * GET /api/v1/Request/my-requests
   */
  getMyRequests: async (): Promise<RequestResponseDto[]> => {
    const response = await apiDotNet.get<RequestResponseDto[]>(
      `/Request/my-requests`
    );
    return response.data;
  },

  /**
   * [EMPLOYEE/HR] Xem chi tiết request
   * GET /api/v1/Request/{id}
   */
  getRequestById: async (id: number): Promise<RequestResponseDto> => {
    const response = await apiDotNet.get<RequestResponseDto>(
      `/Request/${id}`
    );
    return response.data;
  },

  // ============================================
  // HR/MANAGER METHODS
  // ============================================

  /**
   * [HR/MANAGER] Lấy danh sách tất cả requests với filter
   * GET /api/v1/Request
   */
  getAllRequests: async (
    params: RequestFilterParams
  ): Promise<RequestResponseDto[]> => {
    const response = await apiDotNet.get<RequestResponseDto[]>(
      `/Request`,
      { params }
    );
    return response.data;
  },

  /**
   * [HR/MANAGER] Lấy danh sách requests đang chờ duyệt
   * GET /api/v1/Request/pending
   */
  getPendingRequests: async (): Promise<RequestResponseDto[]> => {
    const response = await apiDotNet.get<RequestResponseDto[]>(
      `/Request/pending`
    );
    return response.data;
  },

  /**
   * [HR/MANAGER] Phê duyệt hoặc từ chối request
   * POST /api/v1/Request/{id}/process
   */
  processRequest: async (
    id: number,
    data: ProcessRequestDto
  ): Promise<{ message: string; data: RequestResponseDto }> => {
    const response = await apiDotNet.post<{ message: string; data: RequestResponseDto }>(
      `/Request/${id}/process`,
      data
    );
    return response.data;
  },

  /**
   * [HR/MANAGER] Phê duyệt hoặc từ chối nhiều requests cùng lúc
   * POST /api/v1/Request/batch-process
   */
  batchProcessRequests: async (
    data: BatchProcessRequestDto
  ): Promise<{ message: string; data: BatchProcessResultDto }> => {
    const response = await apiDotNet.post<{ message: string; data: BatchProcessResultDto }>(
      `/Request/batch-process`,
      data
    );
    return response.data;
  },

  /**
   * [HR/MANAGER] Xóa request
   * DELETE /api/v1/Request/{id}
   */
  deleteRequest: async (id: number): Promise<void> => {
    await apiDotNet.delete(`/Request/${id}`);
  },

  // ============================================
  // STATISTICS
  // ============================================

  /**
   * [HR/MANAGER] Xem thống kê requests
   * GET /api/v1/Request/statistics
   */
  getStatistics: async (): Promise<RequestStatisticsDto> => {
    const response = await apiDotNet.get<RequestStatisticsDto>(
      `/Request/statistics`
    );
    return response.data;
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get request type display text
 */
export const getRequestTypeDisplay = (
  type: RequestResponseDto['type']
): string => {
  const typeMap: Record<RequestResponseDto['type'], string> = {
    wfh: 'Làm từ xa',
    leave: 'Nghỉ phép',
    overtime: 'Làm thêm giờ',
    attendance_correction: 'Chỉnh sửa chấm công',
    equipment: 'Thiết bị',
    other: 'Khác',
  };
  
  return typeMap[type] || type;
};

/**
 * Get request status display text
 */
export const getRequestStatusDisplay = (
  status: RequestResponseDto['status']
): string => {
  const statusMap: Record<RequestResponseDto['status'], string> = {
    pending: 'Chờ duyệt',
    approved: 'Đã duyệt',
    rejected: 'Đã từ chối',
  };
  
  return statusMap[status] || status;
};

/**
 * Get request status color
 */
export const getRequestStatusColor = (
  status: RequestResponseDto['status']
): string => {
  const colorMap: Record<RequestResponseDto['status'], string> = {
    pending: 'warning', // orange
    approved: 'success', // green
    rejected: 'error', // red
  };
  
  return colorMap[status] || 'default';
};

/**
 * Get request type icon
 */
export const getRequestTypeIcon = (
  type: RequestResponseDto['type']
): string => {
  const iconMap: Record<RequestResponseDto['type'], string> = {
    wfh: 'home_work',
    leave: 'event_busy',
    overtime: 'schedule',
    attendance_correction: 'edit_calendar',
    equipment: 'computer',
    other: 'help_outline',
  };
  
  return iconMap[type] || 'description';
};

/**
 * Check if request can be processed
 */
export const canProcessRequest = (request: RequestResponseDto): boolean => {
  return request.status === 'pending';
};

/**
 * Check if request is attendance correction
 */
export const isAttendanceCorrectionRequest = (request: RequestResponseDto): boolean => {
  return request.type === 'attendance_correction';
};

/**
 * Format date range for display
 */
export const formatRequestDateRange = (
  startTime: string | null,
  endTime: string | null
): string => {
  if (!startTime && !endTime) return 'N/A';
  
  const start = startTime ? new Date(startTime) : null;
  const end = endTime ? new Date(endTime) : null;
  
  if (!start && end) {
    return `Đến ${end.toLocaleDateString('vi-VN')}`;
  }
  
  if (start && !end) {
    return `Từ ${start.toLocaleDateString('vi-VN')}`;
  }
  
  if (start && end) {
    // Same day
    if (start.toDateString() === end.toDateString()) {
      return `${start.toLocaleDateString('vi-VN')} (${start.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })} - ${end.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })})`;
    }
    
    // Different days
    return `${start.toLocaleDateString('vi-VN')} - ${end.toLocaleDateString('vi-VN')}`;
  }
  
  return 'N/A';
};

/**
 * Calculate days between dates
 */
export const calculateRequestDuration = (
  startTime: string | null,
  endTime: string | null
): number => {
  if (!startTime || !endTime) return 0;
  
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};