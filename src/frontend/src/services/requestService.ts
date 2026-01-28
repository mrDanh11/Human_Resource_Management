/**
 * requestService.ts - Service cho quản lý yêu cầu nhân viên
 * Các API calls: tạo yêu cầu, approve/reject, lấy danh sách yêu cầu
 */

// API tạo yêu cầu nghỉ phép
// API tạo yêu cầu WFH
// API tạo yêu cầu check-in/out
// API approve/reject yêu cầu (dành cho manager)
// API lấy danh sách yêu cầu theo nhân viên/trạng thái

import { apiSpring } from './api';
import type { PaginationRequestParams } from '../types/pagination';
import type { CreateLeaveRequestFormData, DetailRequest, LeaveSummary } from '../types/request';
import type { ListRequests, PageResponse, ApiResponse } from '../types/request';
import type { CreateRequestFormData } from '../types/request';

export const requestService = {
  // Lấy danh sách yêu cầu
  getListrequests: async (params: PaginationRequestParams): Promise<PageResponse<ListRequests>> => {
    const response = await apiSpring.get<ApiResponse<PageResponse<ListRequests>>>('/requests', {
      params: {
        ...params,
      }
    });
    if (response.data) {
      console.log("Response Data:", response.data);
      return response.data.data;
    } else {
      throw new Error('Failed to fetch requests list');
    }
  },

  //Lấy chi tiết yêu cầu
  getDetailRequest: async (id: number): Promise<DetailRequest> => { 
    const response = await apiSpring.get<ApiResponse<DetailRequest>>(`/requests/${id}`);
    if (response.data) {
      console.log("Response Data:", response.data);
      return response.data.data;
    } else {
      throw new Error('Failed to fetch request detail');
    }
  },

  //Tạo yêu cầu xin nghỉ phép mới - moved to createRequest function below
  createLeaveRequest: async (data: CreateLeaveRequestFormData): Promise<DetailRequest> => {
    const formData = new FormData();

      formData.append('mode', data.mode);
      if (data.mode === 'DAY' && data.startDate && data.endDate) {
        formData.append('fromDate', data.startDate);  
        formData.append('toDate', data.endDate);
      } else if (data.mode === 'HALF_DAY' && data.startDate) {
        formData.append('date', data.startDate);
      } else if (data.mode === 'SHORT_HOUR' && data.startDate) {
        formData.append('date', data.startDate);
      }
      if (data.fromTime)
        formData.append('fromTime', data.fromTime);
      if (data.toTime)
        formData.append('toTime', data.toTime);

      formData.append('reason', data.description);

      if (data.leaveMode)
        formData.append('leaveType', data.leaveMode);

      if (data.session)
        formData.append('session', data.session);

      if (data.attachment)
        formData.append('attachment', data.attachment);

      console.log("Form Data:", Array.from(formData.entries()));

      const response = await apiSpring.post<ApiResponse<DetailRequest>>('/requests', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

    
    //const response = await apiSpring.post<ApiResponse<DetailRequest>>('/requests', data);
    if (response.data) {
      return response.data.data;
    } else {
      throw new Error('Failed to create leave request');
    }
  },

  //Tính tổng số ngày nghỉ phép năm đã sử dụng
  getTotalAnnualLeaveUsed: async (employeeId: number): Promise<LeaveSummary> => {
    const response = await apiSpring.get<ApiResponse<LeaveSummary>>(`/requests/annual-leave/count`, {
      params: { employeeId }
    });
    if (response.data) {
      console.log("Response Data:", response.data);
      return response.data.data;
    } else {
      throw new Error('Failed to fetch total annual leave used');
    }
  },
}

export interface CreateRequestDto {
  employeeId: number;
  description: string;
  startTime: string;
  endTime: string;
  type: "wfh" | "leave" | "overtime" | "attendance_correction" | "equipment" | "other";
  attachment?: string;
}

export interface RequestResponse {
  id: number;
  employeeId?: number;
  employeeName?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  type: string;
  attachment?: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  createdAt?: string;
  createdDate?: string; // Backend uses this field name
  updatedAt?: string;
}

/**
 * Tạo yêu cầu mới
 */
export async function createRequest(data: CreateRequestDto): Promise<RequestResponse> {
  try {
    const response = await apiSpring.post<RequestResponse>("/api/v1/requests", data);
    return response.data;
  } catch (error) {
    console.error("Error creating request:", error);
    throw error;
  }
}

/**
 * Lấy danh sách yêu cầu của nhân viên
 */
export async function getEmployeeRequests(
  employeeId: number,
  status?: string
): Promise<RequestResponse[]> {
  try {
    const params = status ? { status } : {};
    const response = await apiSpring.get<RequestResponse[]>(
      `requests/employee/${employeeId}`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching employee requests:", error);
    throw error;
  }
}

/**
 * Lấy chi tiết một yêu cầu
 */
export async function getRequestById(id: number): Promise<RequestResponse> {
  try {
    const response = await apiSpring.get<RequestResponse>(`/requests/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching request:", error);
    throw error;
  }
}

/**
 * Phê duyệt yêu cầu (dành cho manager)
 */
export async function approveRequest(id: number, note?: string): Promise<void> {
  try {
    await apiSpring.post(`/requests/${id}/approve`, { note });
  } catch (error) {
    console.error("Error approving request:", error);
    throw error;
  }
}

/**
 * Từ chối yêu cầu (dành cho manager)
 */
export async function rejectRequest(id: number, note?: string): Promise<void> {
  try {
    await apiSpring.post(`/requests/${id}/reject`, { note });
  } catch (error) {
    console.error("Error rejecting request:", error);
    throw error;
  }
}

/**
 * Hủy yêu cầu (dành cho employee - chỉ hủy được pending request)
 */
export async function cancelRequest(id: number, reason: string): Promise<void> {
  try {
    await apiSpring.put(`/requests/${id}/cancel`, { reason });
  } catch (error) {
    console.error("Error canceling request:", error);
    throw error;
  }
}

export interface RequestFilterParams {
  employeeId: number;
  status?: "pending" | "approved" | "rejected" | "cancelled";
  type?: string;
  fromDate?: string; // yyyy-MM-dd
  toDate?: string; // yyyy-MM-dd
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface RequestListResponse {
  items: RequestResponse[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/**
 * Lấy danh sách yêu cầu của nhân viên với filter và pagination
 */
export async function getMyRequests(
  params: any
): Promise<RequestListResponse> {
  try {
    console.log("getMyRequests called with params:", params);
    const response = await apiSpring.get<any>(
      `/requests/my-requests`,
      { params }
    );
    console.log("getMyRequests raw response:", response.data);
    
    // Backend trả về ApiResponse wrapper, cần extract data
    const pageData = response.data.data;
    console.log("Extracted page data:", pageData);
    
    // Transform Spring Page to our format
    const result: RequestListResponse = {
      items: pageData.content || [],
      totalCount: pageData.totalElements || 0,
      pageNumber: (pageData.number || 0) + 1, // Spring uses 0-based index
      pageSize: pageData.size || 10,
      totalPages: pageData.totalPages || 0,
      hasPreviousPage: !pageData.first,
      hasNextPage: !pageData.last
    };
    
    console.log("Transformed result:", result);
    return result;
  } catch (error) {
    console.error("Error fetching my requests:", error);
    throw error;
  }
}
