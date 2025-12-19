/**
 * activityService.ts - Service cho quản lý hoạt động công ty
 * Các API calls: quản lý cuộc thi chạy bộ, ghi nhận kết quả, thống kê
 */

import { apiSpring } from './api';
import type { Campaign } from '../types/campaign';

// Response types
export interface CancelActivityRequest {
  ids: number[];
  reason: string;
}

export interface CancelActivityResponse {
  success: boolean;
  message: string;
  cancelledIds: number[];
  errors?: Array<{
    id: number;
    error: string;
  }>;
}

export interface ActivityListResponse {
  activities: Campaign[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Get all activities (for HR management)
 */
export const getAllActivities = async (params?: {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
}): Promise<ActivityListResponse> => {
  const response = await apiSpring.get<ActivityListResponse>('/activities', { params });
  return response.data;
};

/**
 * Get pending/ongoing activities that can be cancelled
 */
export const getCancellableActivities = async (): Promise<Campaign[]> => {
  const response = await apiSpring.get<Campaign[]>('/activities/cancellable');
  return response.data;
};

/**
 * Cancel a single activity by ID
 * @deprecated Use cancelActivities for consistency
 */
export const cancelActivityById = async (id: number, reason: string): Promise<void> => {
  await apiSpring.delete(`/activities/cancel/${id}`, {
    data: { reason }
  });
};

/**
 * Cancel multiple activities (bulk operation)
 * Preferred method for both single and multiple cancellations
 */
export const cancelActivities = async (request: CancelActivityRequest): Promise<CancelActivityResponse> => {
  const response = await apiSpring.post<CancelActivityResponse>('/activities/cancel', request);
  return response.data;
};

/**
 * Get activity details by ID
 */
export const getActivityById = async (id: number): Promise<Campaign> => {
  const response = await apiSpring.get<Campaign>(`/activities/${id}`);
  return response.data;
};

// API tạo cuộc thi chạy bộ mới
// API ghi nhận kết quả chạy của nhân viên
// API lấy bảng xếp hạng cuộc thi
// API lấy thống kê tổng quan cuộc thi
// API xác thực kết quả chạy
