/**
 * attendanceService.ts - Service cho quản lý chấm công
 * Các API calls: xem timesheet, attendance CRUD, bulk import, correction requests
 */

import { apiDotNet } from './api';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface AttendanceResponseDto {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeEmail: string | null;
  date: string; // DateOnly format: "2026-01-15"
  checkinTime: string | null; // ISO 8601: "2026-01-15T08:30:00Z"
  checkoutTime: string | null;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'wfh';
  attachment: string | null;
  workHours: number | null;
  overtimeHours: number | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  isLate: boolean;
  isEarlyLeave: boolean;
  lateMinutes: string | null; // TimeSpan format
  earlyLeaveMinutes: string | null;
}

export interface TimesheetSummaryDto {
  employeeId: number;
  employeeName: string;
  fromDate: string;
  toDate: string;
  totalWorkingDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  halfDays: number;
  wfhDays: number;
  totalWorkHours: number;
  totalOvertimeHours: number;
  averageWorkHoursPerDay: number;
  attendances: AttendanceResponseDto[];
}

export interface AttendanceStatisticsDto {
  employeeId: number;
  employeeName: string;
  year: number;
  month: number;
  totalWorkingDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  wfhDays: number;
  totalWorkHours: number;
  totalOvertimeHours: number;
  attendanceRate: number;
  totalLateMinutes: number;
  averageLateMinutes: number;
}

export interface CreateAttendanceDto {
  employeeId: number;
  date: string; // "2026-01-15"
  checkinTime?: string | null; // "2026-01-15T08:30:00Z"
  checkoutTime?: string | null;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'wfh';
  attachment?: string | null;
  workHours?: number | null;
  overtimeHours?: number | null;
  note?: string | null;
}

export interface UpdateAttendanceDto {
  checkinTime?: string | null;
  checkoutTime?: string | null;
  status?: 'present' | 'absent' | 'late' | 'half_day' | 'wfh';
  attachment?: string | null;
  workHours?: number | null;
  overtimeHours?: number | null;
  note?: string | null;
}

export interface CreateAttendanceCorrectionRequestDto {
  date: string; // "2026-01-15"
  requestedCheckinTime?: string | null;
  requestedCheckoutTime?: string | null;
  reason: string;
  attachment?: string | null;
}

export interface BulkCreateAttendanceDto {
  attendances: CreateAttendanceDto[];
}

export interface BulkCreateAttendanceResultDto {
  totalRecords: number;
  successCount: number;
  failedCount: number;
  errors: string[];
  createdAttendances: AttendanceResponseDto[];
}

export interface AttendanceFilterParams {
  employeeId?: number;
  fromDate?: string;
  toDate?: string;
  status?: 'present' | 'absent' | 'late' | 'half_day' | 'wfh';
  pageNumber?: number;
  pageSize?: number;
}

export interface SyncAttendanceFromDeviceDto {
  employeeId: number;
  date: string;
  checkinTime: string;
  checkoutTime?: string | null;
  deviceId?: string | null;
}

// ============================================
// SERVICE FUNCTIONS
// ============================================

export const attendanceService = {
  // ============================================
  // EMPLOYEE METHODS
  // ============================================

  /**
   * [EMPLOYEE] Xem timesheet của mình
   * GET /api/v1/Attendance/my-timesheet
   * Params fromDate, toDate là optional. Nếu không truyền sẽ lấy tất cả (hoặc theo logic BE)
   */
  getMyTimesheet: async (fromDate?: string, toDate?: string): Promise<TimesheetSummaryDto> => {
    const params: any = {};
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;

    const response = await apiDotNet.get<TimesheetSummaryDto>(
      `/Attendance/my-timesheet`,
      { params }
    );
    return response.data;
  },

  /**
   * [EMPLOYEE] Xem lịch sử chấm công (Danh sách)
   * GET /api/v1/Attendance/my-attendance
   * Có thể lọc theo khoảng ngày hoặc lấy tất cả
   */
  getMyAttendanceHistory: async (fromDate?: string, toDate?: string): Promise<AttendanceResponseDto[]> => {
    const params: any = {};
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;

    const response = await apiDotNet.get<AttendanceResponseDto[]>(
      `/Attendance/my-attendance`,
      { params }
    );
    return response.data;
  },

  /**
   * [EMPLOYEE] Xem attendance của mình theo ngày
   * GET /api/v1/Attendance/my-attendance/{date}
   */
  getMyAttendanceByDate: async (date: string): Promise<AttendanceResponseDto> => {
    const response = await apiDotNet.get<AttendanceResponseDto>(
      `/Attendance/my-attendance/${date}`
    );
    return response.data;
  },

  /**
   * [EMPLOYEE] Xem thống kê chấm công của mình
   * GET /api/v1/Attendance/my-statistics
   */
  getMyAttendanceStatistics: async (
    year: number,
    month: number
  ): Promise<AttendanceStatisticsDto> => {
    const response = await apiDotNet.get<AttendanceStatisticsDto>(
      `/Attendance/my-statistics`,
      { params: { year, month } }
    );
    return response.data;
  },

  /**
   * [EMPLOYEE] Gửi yêu cầu chỉnh sửa attendance
   * POST /api/v1/Attendance/correction-request
   */
  createCorrectionRequest: async (
    data: CreateAttendanceCorrectionRequestDto
  ): Promise<{ requestId: number; message: string }> => {
    const response = await apiDotNet.post<{ requestId: number; message: string }>(
      `/Attendance/correction-request`,
      data
    );
    return response.data;
  },

  // ============================================
  // HR METHODS
  // ============================================

  /**
   * [HR] Lấy danh sách attendance với filter
   * GET /api/v1/Attendance
   */
  getAllAttendances: async (
    params: AttendanceFilterParams
  ): Promise<AttendanceResponseDto[]> => {
    const response = await apiDotNet.get<AttendanceResponseDto[]>(
      `/Attendance`,
      { params }
    );
    return response.data;
  },

  /**
   * [HR] Lấy attendance theo ID
   * GET /api/v1/Attendance/{id}
   */
  getAttendanceById: async (id: number): Promise<AttendanceResponseDto> => {
    const response = await apiDotNet.get<AttendanceResponseDto>(
      `/Attendance/${id}`
    );
    return response.data;
  },

  /**
   * [HR] Tạo attendance thủ công
   * POST /api/v1/Attendance
   */
  createAttendance: async (data: CreateAttendanceDto): Promise<AttendanceResponseDto> => {
    const response = await apiDotNet.post<AttendanceResponseDto>(
      `/Attendance`,
      data
    );
    return response.data;
  },

  /**
   * [HR] Cập nhật attendance
   * PUT /api/v1/Attendance/{id}
   */
  updateAttendance: async (
    id: number,
    data: UpdateAttendanceDto
  ): Promise<AttendanceResponseDto> => {
    const response = await apiDotNet.put<AttendanceResponseDto>(
      `/Attendance/${id}`,
      data
    );
    return response.data;
  },

  /**
   * [HR] Xóa attendance
   * DELETE /api/v1/Attendance/{id}
   */
  deleteAttendance: async (id: number): Promise<void> => {
    await apiDotNet.delete(`/Attendance/${id}`);
  },

  /**
   * [HR] Nhập nhiều attendance cùng lúc (bulk import)
   * POST /api/v1/Attendance/bulk
   */
  bulkCreateAttendances: async (
    data: BulkCreateAttendanceDto
  ): Promise<BulkCreateAttendanceResultDto> => {
    const response = await apiDotNet.post<BulkCreateAttendanceResultDto>(
      `/Attendance/bulk`,
      data
    );
    return response.data;
  },

  /**
   * [HR] Xem timesheet của nhân viên khác
   * GET /api/v1/Attendance/employee/{employeeId}/timesheet
   */
  getEmployeeTimesheet: async (
    employeeId: number,
    fromDate: string,
    toDate: string
  ): Promise<TimesheetSummaryDto> => {
    const response = await apiDotNet.get<TimesheetSummaryDto>(
      `/Attendance/employee/${employeeId}/timesheet`,
      { params: { fromDate, toDate } }
    );
    return response.data;
  },

  // ============================================
  // SYSTEM METHODS
  // ============================================

  /**
   * [SYSTEM] Đồng bộ dữ liệu từ máy chấm công
   * POST /api/v1/Attendance/sync
   */
  syncFromDevice: async (data: SyncAttendanceFromDeviceDto): Promise<AttendanceResponseDto> => {
    const response = await apiDotNet.post<AttendanceResponseDto>(
      `/Attendance/sync`,
      data
    );
    return response.data;
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Format date cho API (DateOnly format)
 */
export const formatDateForApi = (date: Date): string => {
  return date.toISOString().split('T')[0]; // "2026-01-15"
};

/**
 * Format datetime cho API (ISO 8601)
 */
export const formatDateTimeForApi = (date: Date): string => {
  return date.toISOString(); // "2026-01-15T08:30:00Z"
};

/**
 * Parse TimeSpan từ API (format: "00:15:00")
 */
export const parseTimeSpan = (timeSpan: string | null): number => {
  if (!timeSpan) return 0;
  
  const parts = timeSpan.split(':');
  const hours = parseInt(parts[0] || '0');
  const minutes = parseInt(parts[1] || '0');
  
  return hours * 60 + minutes; // Return total minutes
};

/**
 * Get attendance status display text
 */
export const getAttendanceStatusDisplay = (
  status: AttendanceResponseDto['status']
): string => {
  const statusMap: Record<AttendanceResponseDto['status'], string> = {
    present: 'Có mặt',
    absent: 'Vắng mặt',
    late: 'Đi muộn',
    half_day: 'Nửa ngày',
    wfh: 'Làm từ xa',
  };
  
  return statusMap[status] || status;
};

/**
 * Get attendance status color
 */
export const getAttendanceStatusColor = (
  status: AttendanceResponseDto['status']
): string => {
  const colorMap: Record<AttendanceResponseDto['status'], string> = {
    present: 'success', // green
    absent: 'error', // red
    late: 'warning', // orange
    half_day: 'info', // blue
    wfh: 'default', // gray
  };
  
  return colorMap[status] || 'default';
};