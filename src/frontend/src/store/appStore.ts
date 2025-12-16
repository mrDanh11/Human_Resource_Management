/**
 * appStore.ts - Redux Store Configuration
 * Centralized state management với Redux Toolkit
 */

import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from './employeeSlice';
import pointReducer from './pointSlice';
import conversionRuleReducer from './conversionRuleSlice';

export const store = configureStore({
  reducer: {
    employee: employeeReducer,
    point: pointReducer,
    conversionRule: conversionRuleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
