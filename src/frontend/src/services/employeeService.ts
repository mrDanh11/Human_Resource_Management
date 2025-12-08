import { apiDotNet, apiSpring } from './api';
import type { PaginationParams } from '../types/pagination';
import type { EmployeeListItem, EmployeeDetailData, CreateEmployeeData } from '../store/employeeSlice';

export const employeeService = {
  // Lấy danh sách nhân viên với pagination
  getEmployees: async (params: PaginationParams): Promise<EmployeeListItem[]> => {
    const response = await apiDotNet.get<{ items: EmployeeListItem[] }>('/Employee', {
      params: {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 1000,
      },
    });
    return response.data.items;
  },

  // Lấy thông tin chi tiết nhân viên
  getEmployeeById: async (id: number): Promise<EmployeeDetailData> => {
    const response = await apiDotNet.get(`/Employee/${id}`);

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data || 'Something went wrong while fetching employee details');
    }
  },

  // Tạo nhân viên mới
  createEmployee: async (data: CreateEmployeeData) => {
    const response = await apiSpring.post('/v1/employee', data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    return response.data;
  },

  // Cập nhật thông tin nhân viên
  updateEmployee: async (id: number, data: Partial<CreateEmployeeData>): Promise<EmployeeDetailData> => {
    const response = await apiDotNet.put(`/Employee/${id}`, data);

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data || 'Something went wrong while updating employee');
    }
  },

  // Xóa nhân viên
  deleteEmployee: async (id: number): Promise<void> => {
    const response = await apiDotNet.delete(`/Employee/${id}`);

    if (!response.data.success) {
      throw new Error(response.data || 'Something went wrong while deleting employee');
    }
  },
};
