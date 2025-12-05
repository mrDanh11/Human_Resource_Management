import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PaginationParams } from '../types/pagination';
import { employeeService } from '../services/employeeService';

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
  fullName: string;
  birthday: string;
  phone: string;
  Cccd: string;
  taxCode?: string | null;
  address: string;
  email: string;
  joinDate: string;
  gender: string;
  departmentId: number;
  roleId: number;
  bankAccount: string;
}

interface EmployeeState {
  employees: EmployeeListItem[];
  selectedEmployee: EmployeeDetailData | null;
  loading: boolean;
  detailLoading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  error: string | null;
  detailError: string | null;
  createError: string | null;
  updateError: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  selectedEmployee: null,
  loading: false,
  detailLoading: false,
  createLoading: false,
  updateLoading: false,
  error: null,
  detailError: null,
  createError: null,
  updateError: null,
};

//Interface cho update employee
export interface UpdateEmployeeWorkingInfoData {
  fullname: string;
  phone: string;
  email: string;
  address: string;
  bankAccount: string;
  status: string;
  birthday: string;
  gender: string;
  departmentId: number;
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
export const fetchEmployeeDetail = createAsyncThunk(
  'employee/fetchEmployeeDetail',
  async (id: number, { rejectWithValue }) => {
    try {
      return await employeeService.getEmployeeById(id);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
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

// Async thunk để cập nhật thông tin nhân viên
export const updateEmployeeWorkingInfo = createAsyncThunk(
  'employee/updateEmployeeWorkingInfo',
  async ({ id, data }: { id: number, data: UpdateEmployeeWorkingInfoData }, { rejectWithValue }) => {
    try {
      return await employeeService.updateEmployee(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response.data);
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
      // Update employee working info
      .addCase(updateEmployeeWorkingInfo.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateEmployeeWorkingInfo.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.selectedEmployee = action.payload;
        // Cập nhật lại danh sách nếu employee có trong list
        const index = state.employees.findIndex(emp => emp.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = {
            ...state.employees[index],
            status: action.payload.status,
            departmentName: action.payload.departmentName || state.employees[index].departmentName,
          };
        }
      })
      .addCase(updateEmployeeWorkingInfo.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
      });
  },
});

export const { clearError, clearDetailError, clearCreateError, clearSelectedEmployee } = employeeSlice.actions;

export default employeeSlice.reducer;