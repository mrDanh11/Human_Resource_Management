/**
 * wfh.types.ts - TypeScript interfaces for WFH functionality
 */

export interface WfhRequest {
  id: number;
  employeeId: number;
  startDate: string;
  endDate: string;
  reason: string;
  attachment?: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  approver?: string;
  approverNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWfhRequestDto {
  employeeId: number;
  startDate: string;
  endDate: string;
  reason: string;
  attachment?: File | null;
}

export interface WfhQuota {
  monthlyLimit: number;
  usedDays: number;
  remainingDays: number;
  currentMonth: string;
}

export interface WfhValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  affectedDates: string[];
}

export interface TimesheetPreview {
  date: string;
  workType: "WFH" | "OFFICE" | "LEAVE" | "BUSINESS_TRIP";
  status: string;
}
