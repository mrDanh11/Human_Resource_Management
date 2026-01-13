/**
 * request.ts - Định nghĩa types cho các yêu cầu của nhân viên
 * Bao gồm: nghỉ phép, cập nhật timesheet, check-in/out, work from home
 */

export type RequestType = 'leave' | 'timesheet_update' | 'checkin' | 'checkout' | 'wfh';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface BaseRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: RequestType;
  status: RequestStatus;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNote?: string;
}

// Yêu cầu nghỉ phép
export interface LeaveRequest extends BaseRequest {
  type: 'leave';
  startDate: Date;
  endDate: Date;
  leaveType: 'annual' | 'sick' | 'personal' | 'maternity' | 'emergency';
  totalDays: number;
}

// Yêu cầu cập nhật timesheet
export interface TimesheetUpdateRequest extends BaseRequest {
  type: 'timesheet_update';
  workDate: Date;
  checkInTime: string;
  checkOutTime: string;
  workHours: number;
  overtimeHours?: number;
}

// Yêu cầu check-in/out
export interface CheckInOutRequest extends BaseRequest {
  type: 'checkin' | 'checkout';
  timestamp: Date;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

// Yêu cầu work from home
export interface WFHRequest extends BaseRequest {
  type: 'wfh';
  workDate: Date;
  taskDescription: string;
  expectedOutput: string;
}

// New type request interface

//Response interface
export interface ApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// Chi tiết yêu cầu
export interface DetailRequest {
  id: number;
  employeeName: string;
  employeeId: string;
  type: 'leave' | 'wfh' | 'checkin' | 'checkout';
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  leaveMode?: 'annual' | 'sick' | 'personal' | 'maternity' | 'emergency';
  session?: 'morning' | 'afternoon' | 'full_day';
  attachment?: string;
  startTime?: string;
  endTime?: string;
  managerNote?: string;
  managerActionStatus?: 'approved' | 'rejected' | null;
  actionDate?: string;
}

//Danh sách yêu cầu
export interface ListRequests {
    id: number;
    employeeName: string;
    type: 'leave' | 'wfh' | 'checkin' | 'checkout';
    status: 'pending' | 'approved' | 'rejected';
    createdDate: string;
    startTime: string;
    endTime: string;
} 

//Tao yeu cau moi
export interface CreateRequestFormData {
  employeeId: number;
  description: string;
  startDate: string;
  endDate: string;
  type: "wfh" | "leave" | "overtime" | "attendance_correction" | "equipment" | "other";
  leaveMode?: "annual" | "sick" | "personal" | "maternity" | "emergency";
  session?: "morning" | "afternoon" | "full_day";
  attachment?: File | null;
}

export type EmployeeRequest = LeaveRequest | TimesheetUpdateRequest | CheckInOutRequest | WFHRequest;
