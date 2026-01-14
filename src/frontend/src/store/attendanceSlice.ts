/**
 * attendanceSlice.ts - Redux Slice for Attendance Management
 * Quản lý state cho chấm công với Redux Toolkit
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { attendanceService, type AttendanceResponseDto, type TimesheetSummaryDto, type AttendanceStatisticsDto, type CreateAttendanceCorrectionRequestDto } from '../services/attendanceService';

// ============================================
// STATE INTERFACE
// ============================================

export interface AttendanceState {
  // My Timesheet Data
  myTimesheet: TimesheetSummaryDto | null;
  myAttendances: AttendanceResponseDto[];
  myStatistics: AttendanceStatisticsDto | null;
  
  // HR Management Data (transformed)
  allAttendances: any[]; // Dữ liệu đã transform
  allAttendancesLoading: boolean;
  
  // Current selected data for viewing
  selectedAttendance: AttendanceResponseDto | null;
  
  // Loading states
  loading: boolean;
  timesheetLoading: boolean;
  statisticsLoading: boolean;
  
  // Error states
  error: string | null;
  
  // UI states
  selectedMonth: string; // Format: "10/2025"
  selectedYear: number;
  selectedMonthNumber: number;
}

const initialState: AttendanceState = {
  myTimesheet: null,
  myAttendances: [],
  myStatistics: null,
  allAttendances: [],
  allAttendancesLoading: false,
  selectedAttendance: null,
  loading: false,
  timesheetLoading: false,
  statisticsLoading: false,
  error: null,
  selectedMonth: 'all',
  selectedYear: new Date().getFullYear(),
  selectedMonthNumber: new Date().getMonth() + 1,
};

// ============================================
// ASYNC THUNKS - EMPLOYEE ACTIONS
// ============================================

// Helper function để transform attendance data cho employee view
const transformEmployeeAttendanceData = (attendance: AttendanceResponseDto) => {
  // Helper để format thời gian từ ISO string (2025-12-28T08:30:00Z -> 08:30)
  const formatTime = (isoTime: string | null) => {
    if (!isoTime) return '';
    if (isoTime.includes('T')) {
      return isoTime.split('T')[1].substring(0, 5); // Get HH:mm
    }
    return '';
  };

  // Helper để format ngày (2025-12-28 -> 28/12/2025)
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return dateStr.split('-').reverse().join('/');
  };

  // Map status từ API sang local status
  let status: 'Normal' | 'Late' | 'Missing' | 'Overtime' | 'Leave' = 'Normal';
  if (attendance.status === 'absent') status = 'Missing';
  else if (attendance.status === 'late' || attendance.isLate) status = 'Late';
  else if (attendance.overtimeHours && attendance.overtimeHours > 0) status = 'Overtime';
  else if (attendance.status === 'half_day') status = 'Leave';
  else if (attendance.status === 'present') status = 'Normal';

  return {
    id: attendance.id,
    date: formatDate(attendance.date),
    checkIn: formatTime(attendance.checkinTime),
    checkOut: formatTime(attendance.checkoutTime),
    totalHours: attendance.workHours || '',
    status,
    note: attendance.note || ''
  };
};

/**
 * Lấy timesheet của nhân viên hiện tại
 */
export const fetchMyTimesheet = createAsyncThunk(
  'attendance/fetchMyTimesheet',
  async (params: { fromDate?: string; toDate?: string } = {}, { rejectWithValue }) => {
    try {
      const data = await attendanceService.getMyTimesheet(params.fromDate, params.toDate);

      // Transform attendances data
      if (data.attendances && data.attendances.length > 0) {
        const transformedAttendances = data.attendances.map(transformEmployeeAttendanceData);
        return {
          ...data,
          attendances: transformedAttendances
        };
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải dữ liệu timesheet');
    }
  }
);

/**
 * Lấy lịch sử chấm công của nhân viên hiện tại
 */
export const fetchMyAttendanceHistory = createAsyncThunk(
  'attendance/fetchMyAttendanceHistory',
  async (params: { fromDate?: string; toDate?: string }, { rejectWithValue }) => {
    try {
      const data = await attendanceService.getMyAttendanceHistory(params.fromDate, params.toDate);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải lịch sử chấm công');
    }
  }
);

/**
 * Lấy thống kê chấm công của nhân viên hiện tại
 */
export const fetchMyAttendanceStatistics = createAsyncThunk(
  'attendance/fetchMyAttendanceStatistics',
  async (params: { year: number; month: number }, { rejectWithValue }) => {
    try {
      const data = await attendanceService.getMyAttendanceStatistics(params.year, params.month);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải thống kê chấm công');
    }
  }
);

/**
 * Lấy attendance theo ngày
 */
export const fetchMyAttendanceByDate = createAsyncThunk(
  'attendance/fetchMyAttendanceByDate',
  async (date: string, { rejectWithValue }) => {
    try {
      const data = await attendanceService.getMyAttendanceByDate(date);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải dữ liệu chấm công');
    }
  }
);

/**
 * Gửi yêu cầu chỉnh sửa chấm công
 */
export const createCorrectionRequest = createAsyncThunk(
  'attendance/createCorrectionRequest',
  async (data: CreateAttendanceCorrectionRequestDto, { rejectWithValue }) => {
    try {
      const result = await attendanceService.createCorrectionRequest(data);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể gửi yêu cầu chỉnh sửa');
    }
  }
);

// ============================================
// ASYNC THUNKS - HR ACTIONS
// ============================================

// Helper function để chuẩn hóa dữ liệu attendance
const transformAttendanceData = (attendance: AttendanceResponseDto) => {
  // Helper để format thời gian từ ISO string (2025-12-28T08:30:00Z -> 08:30)
  const formatTime = (isoTime: string | null) => {
    if (!isoTime) return '--:--';
    // Extract time part from ISO string
    if (isoTime.includes('T')) {
      return isoTime.split('T')[1].substring(0, 5); // Get HH:mm
    }
    return '--:--';
  };

  // Helper để format ngày (2025-12-28 -> 28/12/2025)
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return dateStr.split('-').reverse().join('/');
  };

  // Map status
  const statusMap: Record<string, { status: string; text: string }> = {
    'present': { status: 'normal', text: 'Đúng giờ' },
    'late': { status: 'late', text: 'Đi muộn' },
    'absent': { status: 'missing', text: 'Vắng mặt' },
    'half_day': { status: 'on-leave', text: 'Nửa ngày' },
    'wfh': { status: 'normal', text: 'WFH' }
  };

  const statusInfo = statusMap[attendance.status] || { status: 'normal', text: 'Đúng giờ' };

  return {
    id: attendance.id.toString(),
    employeeId: attendance.employeeId.toString(),
    employeeName: attendance.employeeName,
    department: 'N/A', // API không trả về department
    avatar: attendance.employeeName.charAt(0).toUpperCase(),
    date: formatDate(attendance.date),
    checkIn: formatTime(attendance.checkinTime),
    checkOut: formatTime(attendance.checkoutTime),
    status: statusInfo.status as 'normal' | 'late' | 'missing' | 'on-leave',
    statusText: statusInfo.text,
    _original: attendance
  };
};

/**
 * [HR] Lấy tất cả attendance records với filter
 */
export const fetchAllAttendances = createAsyncThunk(
  'attendance/fetchAllAttendances',
  async (params: {
    employeeId?: number;
    fromDate?: string;
    toDate?: string;
    status?: 'present' | 'absent' | 'late' | 'half_day' | 'wfh';
    pageNumber?: number;
    pageSize?: number;
  } = {}, { rejectWithValue }) => {
    try {
      const data = await attendanceService.getAllAttendances(params);
      // Transform data ngay sau khi nhận từ API
      const transformedData = data.map(transformAttendanceData);
      return transformedData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải danh sách chấm công');
    }
  }
);

/**
 * [HR] Cập nhật attendance record
 */
export const updateAttendanceRecord = createAsyncThunk(
  'attendance/updateAttendanceRecord',
  async (payload: {
    id: number;
    data: {
      checkinTime?: string | null;
      checkoutTime?: string | null;
      status?: 'present' | 'absent' | 'late' | 'half_day' | 'wfh';
      note?: string | null;
    };
  }, { rejectWithValue }) => {
    try {
      const result = await attendanceService.updateAttendance(payload.id, payload.data);
      // Transform result
      const transformed = transformAttendanceData(result);
      return transformed;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật chấm công');
    }
  }
);

/**
 * [HR] Tạo mới attendance record
 */
export const createAttendanceRecord = createAsyncThunk(
  'attendance/createAttendanceRecord',
  async (payload: {
    employeeId: number;
    date: string;
    checkinTime?: string | null;
    checkoutTime?: string | null;
    status: 'present' | 'absent' | 'late' | 'half_day' | 'wfh';
    note?: string | null;
  }, { rejectWithValue }) => {
    try {
      const result = await attendanceService.createAttendance(payload);
      // Transform result
      const transformed = transformAttendanceData(result);
      return transformed;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tạo bản ghi chấm công');
    }
  }
);

// ============================================
// SLICE
// ============================================

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    // Set selected month/year
    setSelectedMonth: (state, action) => {
      const [month, year] = action.payload.split('/');
      state.selectedMonth = action.payload;
      state.selectedMonthNumber = parseInt(month);
      state.selectedYear = parseInt(year);
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Reset state
    resetAttendanceState: () => initialState,
  },
  extraReducers: (builder) => {
    // ============================================
    // Fetch My Timesheet
    // ============================================
    builder.addCase(fetchMyTimesheet.pending, (state) => {
      state.timesheetLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMyTimesheet.fulfilled, (state, action) => {
      state.timesheetLoading = false;
      state.myTimesheet = action.payload;
    });
    builder.addCase(fetchMyTimesheet.rejected, (state, action) => {
      state.timesheetLoading = false;
      state.error = action.payload as string;
    });

    // ============================================
    // Fetch My Attendance History
    // ============================================
    builder.addCase(fetchMyAttendanceHistory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMyAttendanceHistory.fulfilled, (state, action) => {
      state.loading = false;
      state.myAttendances = action.payload;
    });
    builder.addCase(fetchMyAttendanceHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ============================================
    // Fetch My Attendance Statistics
    // ============================================
    builder.addCase(fetchMyAttendanceStatistics.pending, (state) => {
      state.statisticsLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMyAttendanceStatistics.fulfilled, (state, action) => {
      state.statisticsLoading = false;
      state.myStatistics = action.payload;
    });
    builder.addCase(fetchMyAttendanceStatistics.rejected, (state, action) => {
      state.statisticsLoading = false;
      state.error = action.payload as string;
    });

    // ============================================
    // Fetch My Attendance By Date
    // ============================================
    builder.addCase(fetchMyAttendanceByDate.pending, (state) => {
      state.loading = true;

    // ============================================
    // Fetch All Attendances (HR)
    // ============================================
    builder.addCase(fetchAllAttendances.pending, (state) => {
      state.allAttendancesLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAllAttendances.fulfilled, (state, action) => {
      state.allAttendancesLoading = false;
      state.allAttendances = action.payload;
    });
    builder.addCase(fetchAllAttendances.rejected, (state, action) => {
      state.allAttendancesLoading = false;
      state.error = action.payload as string;
    });
      state.error = null;
    });
    builder.addCase(fetchMyAttendanceByDate.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedAttendance = action.payload;
    });
    builder.addCase(fetchMyAttendanceByDate.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ============================================
    // Create Correction Request
    // ============================================
    builder.addCase(createCorrectionRequest.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createCorrectionRequest.fulfilled, (state) => {
      state.loading = false;
      // Có thể thêm notification hoặc state khác ở đây
    });
    builder.addCase(createCorrectionRequest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ============================================
    // Fetch All Attendances (HR)
    // ============================================
    builder.addCase(fetchAllAttendances.pending, (state) => {
      state.allAttendancesLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAllAttendances.fulfilled, (state, action) => {
      state.allAttendancesLoading = false;
      state.allAttendances = action.payload;
    });
    builder.addCase(fetchAllAttendances.rejected, (state, action) => {
      state.allAttendancesLoading = false;
      state.error = action.payload as string;
    });
  },
});

// ============================================
// EXPORTS
// ============================================

export const { setSelectedMonth, clearError, resetAttendanceState } = attendanceSlice.actions;
export default attendanceSlice.reducer;
