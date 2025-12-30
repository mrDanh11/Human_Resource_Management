import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PointConversionRuleDto } from '../services/pointService';
import { pointService } from '../services/pointService';

export interface RuleState {
    rules: PointConversionRuleDto[],
    loading: boolean;
    error: string | null;
}

const initialState: RuleState = {
    rules: [],
    loading: false,
    error: null,
};

export const fetchAllConversionRules = createAsyncThunk(
    'conversionRules/fetchAllConversionRules',
    async () => {
        const response = await pointService.getAllConversionRule();
        return response;
    }
)

// Slice
const ruleSlice = createSlice({
    name: 'conversionRules',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all employee points
            .addCase(fetchAllConversionRules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllConversionRules.fulfilled, (state, action) => {
                state.loading = false;
                state.rules = action.payload;
            })
            .addCase(fetchAllConversionRules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Không thể tải quy tắc đổi điểm';
            });
    },
});

export const { clearError } = ruleSlice.actions;
export default ruleSlice.reducer;
