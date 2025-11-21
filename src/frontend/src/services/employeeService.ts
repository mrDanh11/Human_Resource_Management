/**
 * employeeService.ts - Service cho quản lý nhân viên
 * Các API calls: CRUD nhân viên, tìm kiếm, cập nhật profile
 */

import api from './api';
import type { Employee } from '../types/employee';

// ===========================================
// INTERFACE CHO API RESPONSES
// ===========================================
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface EmployeeListResponse {
  employees: Employee[];
  total: number;
  page: number;
  limit: number;
}

// ===========================================
// EMPLOYEE SERVICE
// ===========================================
export const employeeService = {
  
  /**
   * Lấy thông tin hồ sơ nhân viên theo ID
   * @param employeeId - ID của nhân viên 
   * @returns Promise<Employee | null>
   */
  async getProfile(employeeId: string): Promise<Employee | null> {
    try {
      const response = await api.get(`/employees/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee profile:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy hồ sơ nhân viên. Vui lòng liên hệ quản trị viên.');
      }
      
      throw new Error('Có lỗi xảy ra khi tải hồ sơ. Vui lòng thử lại.');
    }
  },

  /**
   * Cập nhật thông tin hồ sơ nhân viên
   * @param employeeId - ID của nhân viên
   * @param updateData - Dữ liệu cần cập nhật
   * @returns Promise<Employee>
   */
  async updateProfile(employeeId: string, updateData: Partial<Employee>): Promise<Employee> {
    try {
      const validatedData = this.validateProfileData(updateData);
      
      const response = await api.put(`/employees/${employeeId}`, validatedData);
      return response.data;
    } catch (error) {
      console.error('Error updating employee profile:', error);
      throw new Error('Có lỗi xảy ra khi cập nhật hồ sơ. Vui lòng thử lại.');
    }
  },

  /**
   * Lấy danh sách tất cả nhân viên (cho HR/Manager)
   * @param params - Query parameters
   * @returns Promise<EmployeeListResponse>
   */
  async getEmployeeList(params?: {
    page?: number;
    limit?: number;
    department?: string;
    status?: string;
    search?: string;
  }): Promise<EmployeeListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.department) queryParams.append('department', params.department);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.search) queryParams.append('search', params.search);
      
      const response = await api.get<ApiResponse<EmployeeListResponse>>(
        `/employees?${queryParams.toString()}`
      );
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Không thể tải danh sách nhân viên');
    } catch (error) {
      console.error('Error fetching employee list:', error);
      throw new Error('Có lỗi xảy ra khi tải danh sách nhân viên. Vui lòng thử lại.');
    }
  },

  /**
   * Tạo nhân viên mới (cho HR/Admin)
   * @param employeeData - Thông tin nhân viên mới
   * @returns Promise<Employee>
   */
  async createEmployee(employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Employee> {
    try {
      const validatedData = this.validateEmployeeData(employeeData);
      
      const response = await api.post<ApiResponse<Employee>>('/employees', validatedData);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Không thể tạo nhân viên mới');
    } catch (error) {
      console.error('Error creating employee:', error);
      throw new Error('Có lỗi xảy ra khi tạo nhân viên. Vui lòng thử lại.');
    }
  },

  /**
   * Xóa nhân viên (cho HR/Admin)
   * @param employeeId - ID của nhân viên cần xóa
   * @returns Promise<boolean>
   */
  async deleteEmployee(employeeId: string): Promise<boolean> {
    try {
      const response = await api.delete<ApiResponse<null>>(`/employees/${employeeId}`);
      
      return response.data.success;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw new Error('Có lỗi xảy ra khi xóa nhân viên. Vui lòng thử lại.');
    }
  },

  // ===========================================
  // HELPER METHODS - VALIDATION
  // ===========================================

  /**
   * Validate dữ liệu profile khi cập nhật
   */
  validateProfileData(data: Partial<Employee>): Partial<Employee> {
    const validated: Partial<Employee> = {};

    // Validate họ tên
    if (data.fullName !== undefined) {
      if (!data.fullName?.trim()) {
        throw new Error('Họ tên không được để trống');
      }
      if (data.fullName.length < 2 || data.fullName.length > 100) {
        throw new Error('Họ tên phải từ 2-100 ký tự');
      }
      validated.fullName = data.fullName.trim();
    }

    // Validate email
    if (data.email !== undefined) {
      if (!data.email?.trim()) {
        throw new Error('Email không được để trống');
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Định dạng email không hợp lệ');
      }
      validated.email = data.email.trim().toLowerCase();
    }

    // Validate số điện thoại
    if (data.phone !== undefined) {
      if (!data.phone?.trim()) {
        throw new Error('Số điện thoại không được để trống');
      }
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(data.phone.replace(/\D/g, ''))) {
        throw new Error('Số điện thoại không hợp lệ (10-11 số)');
      }
      validated.phone = data.phone.trim();
    }

    // Validate địa chỉ
    if (data.address !== undefined) {
      if (data.address && data.address.length > 500) {
        throw new Error('Địa chỉ không được quá 500 ký tự');
      }
      validated.address = data.address?.trim();
    }

    return validated;
  },

  /**
   * Validate dữ liệu nhân viên khi tạo mới
   */
  validateEmployeeData(data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): any {
    // Validation logic cho tạo nhân viên mới
    const validated = this.validateProfileData(data);
    
    // Thêm validation cho các field bắt buộc khi tạo mới
    if (!data.employeeCode?.trim()) {
      throw new Error('Mã nhân viên không được để trống');
    }
    if (!data.department?.trim()) {
      throw new Error('Phòng ban không được để trống');
    }
    if (!data.position?.trim()) {
      throw new Error('Chức vụ không được để trống');
    }

    return validated;
  }

};

// Export default
export default employeeService;
