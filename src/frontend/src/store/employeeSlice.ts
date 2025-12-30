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

interface EmployeeState {
  employees: EmployeeListItem[];
  selectedEmployee: EmployeeDetailData | null;
  loading: boolean;
  detailLoading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  error: string | null;
  detailError: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  selectedEmployee: null,
  loading: false,
  detailLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  error: null,
  detailError: null,
  createError: null,
  updateError: null,
  deleteError: null,
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

// Async thunk để cập nhật thông tin nhân viên
export const updateEmployeeWorkingInfo = createAsyncThunk<EmployeeDetailData, { id: number, data: UpdateEmployeeWorkingInfoData }, { rejectValue: string }>(
  'employee/updateEmployeeWorkingInfo',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await employeeService.updateEmployee(id, data);
      return res as EmployeeDetailData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data ?? String(error.message));
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
      // Update employee working info
      .addCase(updateEmployeeWorkingInfo.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateEmployeeWorkingInfo.fulfilled, (state, action) => {
        state.updateLoading = false;
        // Treat payload as a partial update and merge into selectedEmployee to satisfy types
        const payload = action.payload as Partial<EmployeeDetailData>;

        if (state.selectedEmployee) {
          state.selectedEmployee = { ...state.selectedEmployee, ...payload } as EmployeeDetailData;
        } else {
          // Build a full EmployeeDetailData from payload with safe defaults
          state.selectedEmployee = {
            id: payload.id ?? 0,
            fullname: payload.fullname ?? '',
            cccd: payload.cccd ?? '',
            taxCode: payload.taxCode ?? '',
            phone: payload.phone ?? '',
            address: payload.address ?? '',
            bankAccount: payload.bankAccount ?? '',
            joinDate: payload.joinDate ?? '',
            status: payload.status ?? '',
            birthday: payload.birthday ?? '',
            gender: payload.gender ?? '',
            email: payload.email ?? '',
            roleId: payload.roleId ?? 0,
            roleName: payload.roleName ?? '',
            departmentId: payload.departmentId ?? 0,
            departmentName: payload.departmentName ?? '',
            createdAt: payload.createdAt ?? '',
            updatedAt: payload.updatedAt ?? '',
          } as EmployeeDetailData;
        }

        // Update list entry if present (only fields that exist on the list)
        const idToFind = payload.id ?? state.selectedEmployee.id;
        const index = state.employees.findIndex(emp => emp.id === idToFind);
        if (index !== -1) {
          state.employees[index] = {
            ...state.employees[index],
            status: payload.status ?? state.employees[index].status,
            departmentName: payload.departmentName ?? state.employees[index].departmentName,
            fullname: payload.fullname ?? state.employees[index].fullname,
            email: payload.email ?? state.employees[index].email,
            phone: payload.phone ?? state.employees[index].phone,
            roleName: payload.roleName ?? state.employees[index].roleName,
            joinDate: payload.joinDate ?? state.employees[index].joinDate,
          };
        }
      })
      .addCase(updateEmployeeWorkingInfo.rejected, (state, action) => {
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
      });
  },
});

export const { clearError, clearDetailError, clearCreateError, clearDeleteError, clearSelectedEmployee } = employeeSlice.actions;

export default employeeSlice.reducer;