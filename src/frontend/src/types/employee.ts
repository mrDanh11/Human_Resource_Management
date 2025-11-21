/**
 * employee.ts - Định nghĩa types cho thông tin nhân viên
 * Chứa các interface cho quản lý profile nhân viên
 */

import { USER_ROLES } from '../constants/app';

// ===========================================
// INTERFACE CHO THÔNG TIN NHÂN VIÊN
// ===========================================
export interface Employee {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string;
  citizenId: string; // Căn cước công dân
  taxCode: string; // Mã số thuế
  address: string;
  bankAccount: {
    accountNumber: string;
    bankName: string;
    accountHolder: string;
  };
  department: string;
  position: string;
  joinDate: Date;
  avatar?: string;
  status: 'active' | 'inactive' | 'terminated';
  role: typeof USER_ROLES[keyof typeof USER_ROLES];
  currentPoints: number;
  totalPoints: number;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ===========================================
// INTERFACE CHO THỐNG KÊ DASHBOARD
// ===========================================
export interface DashboardStats {
  totalEmployees?: number;
  pendingRequests?: number;
  activeCompetitions?: number;
  totalPoints?: number;
  currentPoints?: number;
  teamMembers?: number;
  monthlyGoal?: number;
  completedGoal?: number;
}

export interface CreateEmployeeRequest {
  fullName: string;
  email: string;
  phone: string;
  citizenId: string;
  taxCode: string;
  address: string;
  bankAccount: {
    accountNumber: string;
    bankName: string;
    accountHolder: string;
  };
  department: string;
  position: string;
  joinDate: Date;
}

export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {
  id: string;
}
