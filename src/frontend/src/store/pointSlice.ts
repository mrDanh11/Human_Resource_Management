import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { EmployeePointDto } from '../services/pointService';
import { pointService } from '../services/pointService';

// State interface
export interface PointState {
  employees: EmployeePointDto[];
  totalCount: number;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: PointState = {
  employees: [],
  totalCount: 0,
  loading: false,
  error: null,
};

// Async thunks
export const fetchAllEmployeePoints = createAsyncThunk(
  'point/fetchAllEmployeePoints',
  async ({ pageNumber = 1, pageSize = 100 }: { pageNumber?: number; pageSize?: number }) => {
    const response = await pointService.getAllEmployeePoints(pageNumber, pageSize);
    return response;
  }
);

// Slice
const pointSlice = createSlice({
  name: 'point',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all employee points
      .addCase(fetchAllEmployeePoints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEmployeePoints.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.items;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchAllEmployeePoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Không thể tải danh sách nhân viên';
      });
  },
});

export const { clearError } = pointSlice.actions;
export default pointSlice.reducer;
