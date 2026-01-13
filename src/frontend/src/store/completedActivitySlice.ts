/**
 * completedActivitySlice.ts - Redux Slice for completed activities
 * Manages state for completed activities with excellent employee details
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCompletedActivities } from '../services/activityService';
import type { CompletedActivityData } from '../types/activity';

interface CompletedActivityState {
  activities: CompletedActivityData[];
  loading: boolean;
  error: string | null;
}

const initialState: CompletedActivityState = {
  activities: [],
  loading: false,
  error: null,
};

/**
 * Thunk: Fetch all completed activities
 */
export const fetchCompletedActivities = createAsyncThunk(
  'completedActivity/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getCompletedActivities();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải danh sách hoạt động');
    }
  }
);

const completedActivitySlice = createSlice({
  name: 'completedActivity',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch completed activities
      .addCase(fetchCompletedActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompletedActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchCompletedActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = completedActivitySlice.actions;
export default completedActivitySlice.reducer;
