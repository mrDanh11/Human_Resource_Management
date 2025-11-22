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
  updateLoading: boolean;
  error: string | null;
  detailError: string | null;
  updateError: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  selectedEmployee: null,
  loading: false,
  detailLoading: false,
  updateLoading: false,
  error: null,
  detailError: null,
  updateError: null,
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

//Interface cho update employee
export interface UpdateEmployeeRequest {
  employeeId: number;
  fullname: string;
  phone: string;
  birthday: string;
  address: string;
  gender: string;
  bankAccount: string;
  avatar: string;
}

// Interface cho update working information
export interface UpdateWorkingInformationRequest {
  employeeId: number;
  fullname: string;
  departmentId: number;
  status: string;
}

// Async thunk để cập nhật thông tin nhân viên(chỉ departmentId và status)
export const updateEmployeeInfo = createAsyncThunk(
  'employee/updateWorkingInfo',
  async ({ employeeId, fullname, phone, birthday, address, gender, bankAccount }: UpdateEmployeeRequest, { rejectWithValue }) => {
    try {
      const detailResponse = await api.get<{
        success: boolean;
        message: string;
        data: EmployeeDetailData;
        errors: string[];
      }>(`/Employee/${employeeId}`);

      if (!detailResponse.data.success || !detailResponse.data.data) {
        return rejectWithValue('Không tìm thấy thông tin nhân viên');
      }

      const employeeData = detailResponse.data.data;

      // Tạo payload cho update - chỉ cập nhật departmentId và status
      const updatePayload: {
        fullname: string;
        phone?: string | null;
        address?: string | null;
        bankAccount?: string | null;
        status?: string | null;
        birthday?: string | null;
        gender?: string | null;
        departmentId?: number | null;
      } = {
        fullname: fullname,
        phone: phone || null,
        address: address || null,
        bankAccount: bankAccount || null,
        status: employeeData.status || null,
        birthday: birthday ? new Date(employeeData.birthday).toISOString().split('T')[0] : null,
        gender: gender || null,
        departmentId: employeeData.departmentId || null,
      };

      const response = await api.put<{
        success: boolean;
        message: string;
        data: EmployeeDetailData;
        errors: string[];
      }>(`/Employee/${employeeId}`, updatePayload);

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || 'Cập nhật thất bại');
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Cập nhật thất bại';
      return rejectWithValue(message);
    }
  }
);

// Async thunk để cập nhật thông tin làm việc (chỉ departmentId và status)
export const updateEmployeeWorkingInfo = createAsyncThunk(
  'employee/updateWorkingInfo',
  async ({ employeeId, departmentId, status }: UpdateWorkingInformationRequest, { rejectWithValue }) => {
    try {
      const detailResponse = await api.get<{
        success: boolean;
        message: string;
        data: EmployeeDetailData;
        errors: string[];
      }>(`/Employee/${employeeId}`);

      if (!detailResponse.data.success || !detailResponse.data.data) {
        return rejectWithValue('Không tìm thấy thông tin nhân viên');
      }

      const employeeData = detailResponse.data.data;

      // Map status: frontend dùng "terminated" nhưng backend dùng "suspended"
      const backendStatus = status === 'terminated' ? 'suspended' : status;

      // Tạo payload cho update - chỉ cập nhật departmentId và status
      const updatePayload: {
        fullname: string;
        phone?: string | null;
        address?: string | null;
        bankAccount?: string | null;
        status?: string | null;
        birthday?: string | null;
        gender?: string | null;
        departmentId?: number | null;
      } = {
        fullname: employeeData.fullname,
        phone: employeeData.phone || null,
        address: employeeData.address || null,
        bankAccount: employeeData.bankAccount || null,
        status: backendStatus || null,
        birthday: employeeData.birthday ? new Date(employeeData.birthday).toISOString().split('T')[0] : null,
        gender: employeeData.gender || null,
        departmentId: departmentId || null,
      };

      const response = await api.put<{
        success: boolean;
        message: string;
        data: EmployeeDetailData;
        errors: string[];
      }>(`/Employee/${employeeId}`, updatePayload);

      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || 'Cập nhật thất bại');
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Cập nhật thất bại';
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

export const { clearError, clearDetailError, clearSelectedEmployee } = employeeSlice.actions;

export default employeeSlice.reducer;
