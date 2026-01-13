/**
 * wfhService.ts - Service for WFH request management
 * Handles API calls for WFH creation, validation, and quota management
 */

import { apiSpring } from "./api";
import type {
  WfhRequest,
  CreateWfhRequestDto,
  WfhQuota,
  WfhValidation,
  TimesheetPreview,
} from "../types/wfh";

/**
 * Create new WFH request
 */
export async function createWfhRequest(
  data: CreateWfhRequestDto
): Promise<WfhRequest> {
  try {
    const formData = new FormData();
    formData.append("employeeId", data.employeeId.toString());
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);
    formData.append("reason", data.reason);

    if (data.attachment) {
      formData.append("attachment", data.attachment);
    }

    const response = await apiSpring.post<WfhRequest>(
      "/wfh-requests",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating WFH request:", error);
    throw error;
  }
}

/**
 * Get WFH requests for employee
 */
export async function getEmployeeWfhRequests(
  employeeId: number,
  status?: string
): Promise<WfhRequest[]> {
  try {
    const params = new URLSearchParams();
    if (status) params.append("status", status);

    const response = await apiSpring.get<WfhRequest[]>(
      `/wfh-requests/employees/${employeeId}/wfh-requests?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching WFH requests:", error);
    throw error;
  }
}

/**
 * Get WFH quota for employee in current month
 */
export async function getWfhQuota(employeeId: number): Promise<WfhQuota> {
  try {
    const response = await apiSpring.get<WfhQuota>(
      `/wfh-requests/employees/${employeeId}/wfh-quota`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching WFH quota:", error);
    // Return default quota if API fails
    return {
      monthlyLimit: 10,
      usedDays: 0,
      remainingDays: 10,
      currentMonth: new Date().toISOString().substring(0, 7),
    };
  }
}

/**
 * Validate WFH request dates before submission
 */
export async function validateWfhDates(
  employeeId: number,
  startDate: string,
  endDate: string
): Promise<WfhValidation> {
  try {
    const response = await apiSpring.post<WfhValidation>(
      "/wfh-requests/validate",
      {
        employeeId,
        startDate,
        endDate,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error validating WFH dates:", error);
    return {
      isValid: false,
      errors: ["Không thể kiểm tra tính hợp lệ. Vui lòng thử lại."],
      warnings: [],
      affectedDates: [],
    };
  }
}

/**
 * Get timesheet preview for WFH dates
 */
export async function getTimesheetPreview(
  employeeId: number,
  startDate: string,
  endDate: string
): Promise<TimesheetPreview[]> {
  try {
    const response = await apiSpring.get<TimesheetPreview[]>(
      `/api/v1/employees/${employeeId}/timesheet-preview`,
      {
        params: { startDate, endDate, workType: "WFH" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching timesheet preview:", error);
    return [];
  }
}

/**
 * Cancel WFH request (only pending requests)
 */
export async function cancelWfhRequest(requestId: number): Promise<void> {
  try {
    await apiSpring.patch(`/wfh-requests/${requestId}/cancel`);
  } catch (error) {
    console.error("Error cancelling WFH request:", error);
    throw error;
  }
}

/**
 * Get WFH request by ID
 */
export async function getWfhRequestById(
  requestId: number
): Promise<WfhRequest> {
  try {
    const response = await apiSpring.get<WfhRequest>(
      `/wfh-requests/${requestId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching WFH request:", error);
    throw error;
  }
}
