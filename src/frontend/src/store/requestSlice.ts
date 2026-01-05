import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PaginationRequestParams } from '../types/pagination';
import type { DetailRequest } from '../types/request';
import type { ListRequests } from '../types/request';
import { requestService } from '../services/requestService';

interface RequestState {
  requestsList: ListRequests[] | null;
  requestDetail: DetailRequest | null;
  loading: boolean;
  error: string | null;
}

const initialState: RequestState = {
  requestsList: null,
  requestDetail: null,
  loading: false,
  error: null,
};

export const fetchRequestsList = createAsyncThunk(
  'requests/fetchRequestsList',
  async (params: PaginationRequestParams, { rejectWithValue }) => {
    try {
      const response = await requestService.getListrequests(params);
      return response;
    } catch (error: any) {
      return rejectWithValue('Failed to fetch requests list: ' + error.response?.data);
    }      
  }
);

export const fetchRequestDetail = createAsyncThunk(
  'requests/fetchRequestDetail',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await requestService.getDetailRequest(id);
      return response;
    } catch (error: any) {
      return rejectWithValue('Failed to fetch request detail: ' + error.response?.data);
    }
  }
);

const requestSlice = createSlice({
  name: 'requests',
  initialState,
    reducers: {
    resetRequestState: (state) => {
      state.requestsList = null;
      state.requestDetail = null;
      state.loading = false;
      state.error = null;
    },

    resetDetail: (state) => {
      state.requestDetail = null;
      state.loading = false;
      state.error = null;
    },
},
  extraReducers: (builder) => {
    builder
        .addCase(fetchRequestsList.pending, (state) => {
            state.loading = true;
            state.error = null;
        })  
        .addCase(fetchRequestsList.fulfilled, (state, action) => {
            state.loading = false;
            state.requestsList = action.payload.content;
        }
        )
        .addCase(fetchRequestsList.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        }   
        )
        .addCase(fetchRequestDetail.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchRequestDetail.fulfilled, (state, action) => {
            state.loading = false;
            state.requestDetail = action.payload;
        })
        .addCase(fetchRequestDetail.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });         
    },
});

export const { resetRequestState, resetDetail } = requestSlice.actions;
export default requestSlice.reducer;