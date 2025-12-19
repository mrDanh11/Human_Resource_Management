import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ParticipationDto } from '../services/activityService';
import { participationService } from '../services/activityService';

export interface ParticipationState {
    participation: ParticipationDto[];
    loading: boolean;
    error: string | null;
}

export interface ResultState {
    result: ParticipationDto;
    loading: boolean;
    error: string | null;
}

const initialState: ParticipationState = {
    participation: [],
    loading: false,
    error: null,
};

export const fetchActivityEmployeeAttended = createAsyncThunk(
    'participation/fetchActivityEmployeeAttened',
    async (employeeId: number, { rejectWithValue }) => {
        try {
            return await participationService.getActivityEmployeeAttended(employeeId)
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }

)

export const fetchResultActivity = createAsyncThunk(
    'participation/fetchResultActivity',
    async ({ activityId, employeeId }: { activityId: number, employeeId: number }, { rejectWithValue }) => {
        try {
            return await participationService.getResultActivity(activityId, employeeId)
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
)

// Slice
const participationSlice = createSlice({
    name: 'participation',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all employee points
            .addCase(fetchActivityEmployeeAttended.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActivityEmployeeAttended.fulfilled, (state, action) => {
                state.loading = false;
                state.participation = action.payload;
            })
            .addCase(fetchActivityEmployeeAttended.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể tải danh sách hoạt động nhân viên tham gia';
            });
    },
});

export const { clearError } = participationSlice.actions;
export default participationSlice.reducer;
