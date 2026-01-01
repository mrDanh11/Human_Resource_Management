import { createSlice, createAsyncThunk, type Update } from '@reduxjs/toolkit';
import type { PaginationParams } from '../types/pagination';
import { employeeService } from '../services/employeeService';
import { departmentService, type DepartmentDto } from '../services/departmentService';
import { getActivityStatistics } from '../services/activityService';

// Response type từ API
export interface EmployeeListItem {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  status: string;
  joinDate: string;
  roleName: string;
  departmentName: string;
}

export interface EmployeeDetailData {
  id: number;
  fullname: string;
  cccd: string;
  taxCode: string;
  phone: string;
  address: string;
  bankAccount: string;
  joinDate: string;
  status: string;
  birthday: string;
  gender: string;
  email: string;
  roleId: number;
  roleName: string;
  departmentId: number;
  departmentName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeData {
  fullname: string;
  birthday: string;
  phone: string;
  cccd: string;
  taxCode?: string | null;
  address: string;
  email: string;
  joinDate: string;
  gender: string;
  departmentId: number;
  roleId: number;
  bankAccount: string;
}

export interface EmployeeStatistics {
  totalEmployees: number;
  roleDistribution: { roleName: string; count: number }[];
}

export interface ActivityStatistics {
  totalActivities: number;
  openRegistration: number;
  closedRegistration: number;
  statusDistribution: { status: string; count: number }[];
}

interface EmployeeState {
  employees: EmployeeListItem[];
  selectedEmployee: EmployeeDetailData | null;
  departments: DepartmentDto[];
  statistics: EmployeeStatistics | null;
  activityStatistics: ActivityStatistics | null;
  loading: boolean;
  detailLoading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  departmentsLoading: boolean;
  statisticsLoading: boolean;
  activityStatisticsLoading: boolean;
  error: string | null;
  detailError: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  departmentsError: string | null;
  statisticsError: string | null;
  activityStatisticsError: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  selectedEmployee: null,
  departments: [],
  statistics: null,
  activityStatistics: null,
  loading: false,
  detailLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  departmentsLoading: false,
  statisticsLoading: false,
  activityStatisticsLoading: false,
  error: null,
  detailError: null,
  createError: null,
  updateError: null,
  deleteError: null,
  departmentsError: null,
  statisticsError: null,
  activityStatisticsError: null,
};

//Interface cho update employee
export interface UpdateEmployeeData {
  fullname: string;
  phone: string;
  email: string;
  address: string;
  birthday: string;
  gender: string;
  bankAccount: string;
  departmentId: number;
  status: string;
}

// Async thunk để fetch danh sách nhân viên
export const fetchEmployees = createAsyncThunk(
  'employee/fetchEmployees',
  async (params: PaginationParams, { rejectWithValue }) => {
    try {
      return await employeeService.getEmployees(params);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk để fetch chi tiết nhân viên
export const fetchEmployeeDetail = createAsyncThunk<EmployeeDetailData, number, { rejectValue: string }>(
  'employee/fetchEmployeeDetail',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await employeeService.getEmployeeDetail(id);
      return res as EmployeeDetailData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data ?? String(error.message));
    }
  }
);

// Async thunk để tạo nhân viên mới
export const createEmployee = createAsyncThunk(
  'employee/createEmployee',
  async (employeeData: CreateEmployeeData, { rejectWithValue }) => {
    try {
      return await employeeService.createEmployee(employeeData);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);


// Async thunk để lấy danh sách phòng ban
export const fetchDepartments = createAsyncThunk<DepartmentDto[], void, { rejectValue: string }>(
  'employee/fetchDepartments',
  async (_, { rejectWithValue }) => {
    // try {
      return await departmentService.getAllDepartments();
    // } catch (error: any) {
    //   return rejectWithValue(error.message ?? 'Lỗi khi lấy danh sách phòng ban');
    // }
  }
);

// Async thunk để lấy thống kê nhân viên
export const fetchEmployeeStatistics = createAsyncThunk<EmployeeStatistics, void, { rejectValue: string }>(
  'employee/fetchEmployeeStatistics',
  async (_, { rejectWithValue }) => {
    try {
      return await employeeService.getEmployeeStatistics();
    } catch (error: any) {
      return rejectWithValue(error.message ?? 'Lỗi khi lấy thống kê nhân viên');
    }
  }
);

// Async thunk để cập nhật thông tin nhân viên
export const updateEmployeeInfo = createAsyncThunk<EmployeeDetailData, { id: number, data: UpdateEmployeeData }, { rejectValue: string }>(
  'employee/updateEmployeeInfo',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await employeeService.updateEmployee(id, data);
      return res as EmployeeDetailData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data ?? String(error.message));
    }
  }
);


// Async thunk để lấy thống kê hoạt động
export const fetchActivityStatistics = createAsyncThunk<ActivityStatistics, void, { rejectValue: string }>(
  'employee/fetchActivityStatistics',
  async (_, { rejectWithValue }) => {
    try {
      return await getActivityStatistics();
    } catch (error: any) {
      return rejectWithValue(error.message ?? 'Lỗi khi lấy thống kê hoạt động');
    }
  }
);

// Async thunk để xóa nhân viên
export const deleteEmployee = createAsyncThunk<number, number, { rejectValue: string }>(
  'employee/deleteEmployee',
  async (id: number, { rejectWithValue }) => {
    try {
      await employeeService.deleteEmployee(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data ?? String(error.message));
    }
  }
);

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearDetailError: (state) => {
      state.detailError = null;
    },
    clearCreateError: (state) => {
      state.createError = null;
    },
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
    clearSelectedEmployee: (state) => {
      state.selectedEmployee = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch employees list
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch employee detail
      .addCase(fetchEmployeeDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchEmployeeDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedEmployee = action.payload;
      })
      .addCase(fetchEmployeeDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload as string;
      })

      // Create employee
      .addCase(createEmployee.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createEmployee.fulfilled, (state) => {
        state.createLoading = false;
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload as string;
      })
      // Update employee info
      .addCase(updateEmployeeInfo.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateEmployeeInfo.fulfilled, (state, action) => {
        state.updateLoading = false;

        const updatedEmployee = action.payload; // EmployeeDetailData

        // 1️⃣ Update selectedEmployee (nguồn sự thật từ backend)
        state.selectedEmployee = updatedEmployee;

        // 2️⃣ Update employee trong danh sách (EmployeeListItem)
        const index = state.employees.findIndex(
          emp => emp.id === updatedEmployee.id
        );

        if (index !== -1) {
          state.employees[index] = {
            ...state.employees[index],
            fullname: updatedEmployee.fullname,
            email: updatedEmployee.email,
            phone: updatedEmployee.phone,
            status: updatedEmployee.status,
            departmentName: updatedEmployee.departmentName,
          };
        }
      })
      .addCase(updateEmployeeInfo.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
      })
      // Delete employee
      .addCase(deleteEmployee.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.deleteLoading = false;
        // Remove employee from list
        state.employees = state.employees.filter(emp => emp.id !== action.payload);
        // Clear selected employee if it was deleted
        if (state.selectedEmployee?.id === action.payload) {
          state.selectedEmployee = null;
        }
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload as string;
      })
      // Fetch departments
      .addCase(fetchDepartments.pending, (state) => {
        state.departmentsLoading = true;
        state.departmentsError = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.departmentsLoading = false;
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.departmentsLoading = false;
        state.departmentsError = action.payload as string;
      })
      // Fetch employee statistics
      .addCase(fetchEmployeeStatistics.pending, (state) => {
        state.statisticsLoading = true;
        state.statisticsError = null;
      })
      .addCase(fetchEmployeeStatistics.fulfilled, (state, action) => {
        state.statisticsLoading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchEmployeeStatistics.rejected, (state, action) => {
        state.statisticsLoading = false;
        state.statisticsError = action.payload as string;
      })
      // Fetch activity statistics
      .addCase(fetchActivityStatistics.pending, (state) => {
        state.activityStatisticsLoading = true;
        state.activityStatisticsError = null;
      })
      .addCase(fetchActivityStatistics.fulfilled, (state, action) => {
        state.activityStatisticsLoading = false;
        state.activityStatistics = action.payload;
      })
      .addCase(fetchActivityStatistics.rejected, (state, action) => {
        state.activityStatisticsLoading = false;
        state.activityStatisticsError = action.payload as string;
      });
  },
});

export const { clearError, clearDetailError, clearCreateError, clearDeleteError, clearSelectedEmployee } = employeeSlice.actions;

export default employeeSlice.reducer;