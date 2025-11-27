/**
 * employeeService.ts - Service cho quản lý nhân viên
 * Các API calls: CRUD nhân viên, tìm kiếm, cập nhật profile
 */

import api from './api';
import type { PaginatedResponse, PaginationParams } from '../types/pagination';
import type { EmployeeListItem } from '../store/employeeSlice';
import type { Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from '../types/employee';

export const employeeService = {
  // Lấy danh sách nhân viên với pagination
  getEmployees: async (params: PaginationParams): Promise<PaginatedResponse<EmployeeListItem>> => {
    const response = await api.get<PaginatedResponse<EmployeeListItem>>('/Employee', {
      params: {
        PageNumber: params.pageNumber || 1,
        PageSize: params.pageSize || 10,
        SearchTerm: params.searchTerm || '',
        DepartmentName: params.departmentName || '',
        Status: params.status || '',
      },
    });
    return response.data;
  },

  // Lấy thông tin chi tiết nhân viên
  getEmployeeById: async (id: string): Promise<Employee> => {
    const response = await api.get<any>(`/v1/Employee/${id}`);
    // Chuyển đổi dữ liệu từ backend sang đúng interface Employee FE
    const raw = response.data?.data || response.data;
    const employee: Employee = {
      id: String(raw.id),
      employeeCode: raw.employeeCode || '',
      fullName: raw.fullname || raw.fullName || '',
      email: raw.email || '',
      phone: raw.phone || '',
      citizenId: raw.cccd || raw.citizenId || '',
      taxCode: raw.taxCode || '',
      address: raw.address || '',
      bankAccount: typeof raw.bankAccount === 'object' ? raw.bankAccount : {
        accountNumber: raw.bankAccount || '',
        bankName: '',
        accountHolder: ''
      },
      department: raw.departmentName || raw.department || '',
      position: raw.position || '',
      joinDate: raw.joinDate || '',
      birthDate: raw.birthday || raw.birthDate || '',
      gender: raw.gender || 'other',
      avatar: raw.avatar || '',
      status: raw.status || 'active',
      role: raw.roleName === 'admin' ? 'admin' : (raw.roleName === 'manager' ? 'manager' : 'employee'),
      currentPoints: raw.currentPoints || 0,
      totalPoints: raw.totalPoints || 0
    };
    return employee;
  },

  // Tạo nhân viên mới
  createEmployee: async (data: CreateEmployeeRequest): Promise<Employee> => {
    const response = await api.post<Employee>('/Employee', data);
    return response.data;
  },

  // Cập nhật thông tin nhân viên
  updateEmployee: async (id: string, data: UpdateEmployeeRequest): Promise<Employee> => {
    const response = await api.put<Employee>(`/Employee/${id}`, data);
    return response.data;
  },

  // Xóa nhân viên
  deleteEmployee: async (id: string): Promise<void> => {
    await api.delete(`/Employee/${id}`);
  },
};
