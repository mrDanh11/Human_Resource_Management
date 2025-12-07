import axios from 'axios';

import api from './api';
import type { PaginationParams } from '../types/pagination';
import type { EmployeeListItem, EmployeeDetailData, CreateEmployeeData } from '../store/employeeSlice';

export const employeeService = {
  // Lấy danh sách nhân viên với pagination
  getEmployees: async (params: PaginationParams): Promise<EmployeeListItem[]> => {
    const response = await api.get<{ items: EmployeeListItem[] }>('/Employee', {
      params: {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 1000,
      },
    });
    return response.data.items;
  },

  // Lấy thông tin chi tiết nhân viên
  getEmployeeById: async (id: number): Promise<EmployeeDetailData> => {
    const response = await api.get(`/Employee/${id}`);

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data || 'Something went wrong while fetching employee details');
    }
  },

  // Tạo nhân viên mới
  createEmployee: async (data: CreateEmployeeData) => {
    const API_PORT_SPRING = import.meta.env.VITE_API_PORT_SPRING || '8080';
    const response = await axios.post(
      `http://localhost:${API_PORT_SPRING}/api/v1/employee`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );
    return response.data; // Trả về object { employee, account, initialPassword }
  },

  // Cập nhật thông tin nhân viên
  updateEmployee: async (id: number, data: Partial<CreateEmployeeData>): Promise<EmployeeDetailData> => {
    const response = await api.put(`/Employee/${id}`, data);

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data || 'Something went wrong while updating employee');
    }
  },

  // Xóa nhân viên
  deleteEmployee: async (id: number): Promise<void> => {
    const response = await api.delete(`/Employee/${id}`);

    if (!response.data.success) {
      throw new Error(response.data || 'Something went wrong while deleting employee');
    }
  },
};
