/**
 * appStore.ts - Redux Store Configuration
 * Centralized state management với Redux Toolkit
 */

import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from './employeeSlice';
import pointReducer from './pointSlice';
import conversionRuleReducer from './conversionRuleSlice';
import participationReducer from './participationSlice';
import completedActivityReducer from './completedActivitySlice';
import requestReducer from './requestSlice';
import attendanceReducer from './attendanceSlice';
import approvalReducer from './approvalSlice';

export const store = configureStore({
  reducer: {
    employee: employeeReducer,
    point: pointReducer,
    conversionRule: conversionRuleReducer,
    participation: participationReducer,
    completedActivity: completedActivityReducer,
    requests: requestReducer,
    attendance: attendanceReducer,
    approval: approvalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
