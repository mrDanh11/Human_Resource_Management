import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PaginationParams } from '../types/pagination';
import api from '../services/api';

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

interface EmployeeState {
  employees: EmployeeListItem[];
  selectedEmployee: EmployeeDetailData | null;
  loading: boolean;
  detailLoading: boolean;
  error: string | null;
  detailError: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  selectedEmployee: null,
  loading: false,
  detailLoading: false,
  error: null,
  detailError: null,
};

// Async thunk để fetch danh sách nhân viên
export const fetchEmployees = createAsyncThunk(
  'employee/fetchEmployees',
  async (params: PaginationParams, { rejectWithValue }) => {
    try {
      const response = await api.get<{ items: EmployeeListItem[] }>('/Employee', {
        params: {
          PageNumber: params.pageNumber || 1,
          PageSize: params.pageSize || 1000,
        },
      });
      return response.data.items;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch employees';
      return rejectWithValue(message);
    }
  }
);

// Async thunk để fetch chi tiết nhân viên
export const fetchEmployeeDetail = createAsyncThunk(
  'employee/fetchEmployeeDetail',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get<{
        success: boolean;
        message: string;
        data: EmployeeDetailData;
        errors: string[];
      }>(`/Employee/${id}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch employee details');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch employee details';
      return rejectWithValue(message);
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
      });
  },
});

export const { clearError, clearDetailError, clearSelectedEmployee } = employeeSlice.actions;

export default employeeSlice.reducer;
