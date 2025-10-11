/**
 * employee.ts - Định nghĩa types cho thông tin nhân viên
 * Chứa các interface cho quản lý profile nhân viên
 */

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
  role: 'employee' | 'manager' | 'admin';
  currentPoints: number;
  totalPoints: number;
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
