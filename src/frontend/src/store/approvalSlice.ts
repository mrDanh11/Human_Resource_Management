/**
 * approvalSlice.ts - Redux Slice for Approval Requests Management
 * Quản lý state cho các yêu cầu phê duyệt chấm công
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { requestService, type RequestResponseDto, type RequestFilterParams, type ProcessRequestDto, type BatchProcessRequestDto } from '../services/requestForAttendanceService';

interface ApprovalState {
  requests: RequestResponseDto[];
  currentRequest: RequestResponseDto | null;
  loading: boolean;
  error: string | null;
  processingIds: number[]; // Track which requests are being processed
}

const initialState: ApprovalState = {
  requests: [],
  currentRequest: null,
  loading: false,
  error: null,
  processingIds: [],
};

// ============================================
// ASYNC THUNKS
// ============================================

/**
 * Fetch all approval requests with filters
 */
export const fetchAllRequests = createAsyncThunk(
  'approval/fetchAllRequests',
  async (params: RequestFilterParams, { rejectWithValue }) => {
    try {
      const response = await requestService.getAllRequests(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch approval requests');
    }
  }
);

/**
 * Fetch pending requests only
 */
export const fetchPendingRequests = createAsyncThunk(
  'approval/fetchPendingRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await requestService.getPendingRequests();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending requests');
    }
  }
);

/**
 * Fetch request detail by ID
 */
export const fetchRequestById = createAsyncThunk(
  'approval/fetchRequestById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await requestService.getRequestById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch request detail');
    }
  }
);

/**
 * Process a single request (approve/reject)
 */
export const processRequest = createAsyncThunk(
  'approval/processRequest',
  async ({ id, data }: { id: number; data: ProcessRequestDto }, { rejectWithValue }) => {
    try {
      const response = await requestService.processRequest(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to process request');
    }
  }
);

/**
 * Batch process multiple requests
 */
export const batchProcessRequests = createAsyncThunk(
  'approval/batchProcessRequests',
  async (data: BatchProcessRequestDto, { rejectWithValue }) => {
    try {
      const response = await requestService.batchProcessRequests(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to batch process requests');
    }
  }
);

/**
 * Delete a request
 */
export const deleteRequest = createAsyncThunk(
  'approval/deleteRequest',
  async (id: number, { rejectWithValue }) => {
    try {
      await requestService.deleteRequest(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete request');
    }
  }
);

// ============================================
// SLICE
// ============================================

const approvalSlice = createSlice({
  name: 'approval',
  initialState,
  reducers: {
    resetApprovalState: (state) => {
      state.requests = [];
      state.currentRequest = null;
      state.loading = false;
      state.error = null;
      state.processingIds = [];
    },
    clearCurrentRequest: (state) => {
      state.currentRequest = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Requests
      .addCase(fetchAllRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchAllRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Pending Requests
      .addCase(fetchPendingRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchPendingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Request By ID
      .addCase(fetchRequestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequestById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRequest = action.payload;
      })
      .addCase(fetchRequestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Process Request
      .addCase(processRequest.pending, (state, action) => {
        const id = action.meta.arg.id;
        state.processingIds.push(id);
        state.error = null;
      })
      .addCase(processRequest.fulfilled, (state, action) => {
        const id = action.payload.id;
        state.processingIds = state.processingIds.filter(reqId => reqId !== id);
        
        // Update request in list
        const index = state.requests.findIndex(req => req.id === id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
        
        // Update current request if it's the same
        if (state.currentRequest?.id === id) {
          state.currentRequest = action.payload;
        }
      })
      .addCase(processRequest.rejected, (state, action) => {
        const id = action.meta.arg.id;
        state.processingIds = state.processingIds.filter(reqId => reqId !== id);
        state.error = action.payload as string;
      })

      // Batch Process Requests
      .addCase(batchProcessRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(batchProcessRequests.fulfilled, (state) => {
        state.loading = false;
        // Optionally refetch data after batch process
      })
      .addCase(batchProcessRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Request
      .addCase(deleteRequest.pending, (state, action) => {
        const id = action.meta.arg;
        state.processingIds.push(id);
        state.error = null;
      })
      .addCase(deleteRequest.fulfilled, (state, action) => {
        const id = action.payload;
        state.processingIds = state.processingIds.filter(reqId => reqId !== id);
        state.requests = state.requests.filter(req => req.id !== id);
        
        if (state.currentRequest?.id === id) {
          state.currentRequest = null;
        }
      })
      .addCase(deleteRequest.rejected, (state, action) => {
        const id = action.meta.arg;
        state.processingIds = state.processingIds.filter(reqId => reqId !== id);
        state.error = action.payload as string;
      });
  },
});

export const { resetApprovalState, clearCurrentRequest, clearError } = approvalSlice.actions;
export default approvalSlice.reducer;
