/**
 * requestService.ts - Service cho quản lý yêu cầu nhân viên
 * Các API calls: tạo yêu cầu, approve/reject, lấy danh sách yêu cầu
 */

import { apiSpring } from "./api";

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
  employeeId: number;
  description: string;
  startTime: string;
  endTime: string;
  type: string;
  attachment?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
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
      `/api/v1/requests/employee/${employeeId}`,
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
    const response = await apiSpring.get<RequestResponse>(`/api/v1/requests/${id}`);
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
    await apiSpring.post(`/api/v1/requests/${id}/approve`, { note });
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
    await apiSpring.post(`/api/v1/requests/${id}/reject`, { note });
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
    await apiSpring.post(`/api/v1/requests/${id}/cancel`, { reason });
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
  params: RequestFilterParams
): Promise<RequestListResponse> {
  try {
    const response = await apiSpring.get<RequestListResponse>(
      `/api/v1/requests/my-requests`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching my requests:", error);
    throw error;
  }
}
