/**
 * activityService.ts - Service cho quản lý hoạt động công ty
 * Các API calls: quản lý cuộc thi chạy bộ, ghi nhận kết quả, thống kê
 */

import { apiSpring } from './api';
import type { Activity, ActivityListResponse, CreateActivityRequest } from '../types/activity';

/**
 * Get all activities (for HR management and Employee view)
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
 * Get activity details by ID
 */
export const getActivityById = async (id: number): Promise<Activity> => {
  const response = await apiSpring.get<Activity>(`/activities/${id}`);
  return response.data;
};

/**
 * Create a new activity (HR/Admin only)
 */
export const createActivity = async (data: CreateActivityRequest): Promise<Activity> => {
  const response = await apiSpring.post<Activity>('/activities', data);
  return response.data;
};

/**
 * Delete an activity (HR/Admin only)
 */
export const deleteActivity = async (id: number): Promise<void> => {
  await apiSpring.delete(`/activities/${id}`);
};

import { apiDotNet } from './api';

export interface ParticipationDto {
    id: number,
    employeeId: number,
    activityId: number,
    employeeName: string,
    activityName: string,
    description: string,
    registerDate: Date,
    cancelDate: Date,
    status: string,
    result: string,
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errors: string[];
}

export interface PagedResult<T> {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}


export const participationService = {
    getActivityEmployeeAttended: async (employeeId: number): Promise<ParticipationDto[]> => {
        const response = await apiDotNet.get<ApiResponse<ParticipationDto[]>>(
            `/Participation/employee/${employeeId}`
        );

        if (response.data.success) {
            return response.data.data;
        }

        throw new Error(response.data.message || 'Lỗi khi lấy thông tin các hoạt động nhân viên tham gia');
    },

    getResultActivity: async (activityId: number, employeeId: number): Promise<ParticipationDto> => {
        const response = await apiDotNet.get<ApiResponse<ParticipationDto>>(
            `/Participation/${activityId}-${employeeId}`
        );

        if (response.data.success) {
            return response.data.data;
        }

        throw new Error(response.data.message || 'Lỗi khi lấy kết quả hoạt động nhân viên tham gia');
    }
}

/**
 * Register for an activity
 */
export const registerActivity = async (activityId: number): Promise<void> => {
  await apiSpring.post('/participations/register', { activityId });
};

/**
 * Unregister from an activity
 */
export const unregisterActivity = async (activityId: number): Promise<void> => {
  await apiSpring.delete(`/participations/cancel/${activityId}`);
};

/**
 * Get my participations
 */
export const getMyParticipations = async (): Promise<any[]> => {
  const response = await apiSpring.get<any[]>('/participations/my-participations');
  return response.data;
};
