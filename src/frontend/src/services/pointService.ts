/**
 * pointService.ts - Service cho quản lý điểm thưởng
 * API calls: xem điểm, lịch sử giao dịch, quy đổi điểm
 */

import { apiDotNet } from './api';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface EmployeePointDto {
  id: number;
  employeeId: number;
  employeeName: string;
  email: string;
  pointTotal: number;
  lastUpdate: string;
}

export interface PointTransactionDto {
  id: number;
  employeeId: number;
  employeeName: string;
  value: number;
  type: string;
  typeDisplay: string;
  actorId: number | null;
  actorName: string | null;
  description: string | null;
  createdAt: string;
}

export interface PointConversionRuleDto {
  id: number;
  pointValue: number;
  moneyValue: number;
  updatedBy: number | null;
  updatedByName: string | null;
  updatedAt: string;
  isActive: boolean;
}

export interface PointToMoneyHistoryDto {
  id: number;
  employeeId: number;
  employeeName: string;
  email: string;
  pointRequested: number;
  moneyReceived: number;
  status: string;
  statusDisplay: string;
  createdAt: string;
  processedAt: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// ============================================
// SERVICE FUNCTIONS
// ============================================

export const pointService = {
  /**
   * Lấy thông tin điểm thưởng của nhân viên
   * GET /api/Point/employee/{employeeId}
   */
  getEmployeePoint: async (employeeId: number): Promise<EmployeePointDto> => {
    const response = await apiDotNet.get<ApiResponse<EmployeePointDto>>(
      `/Point/employee/${employeeId}`
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Lỗi khi lấy thông tin điểm');
  },

  /**
   * Lấy lịch sử giao dịch điểm của nhân viên
   * GET /api/Point/transactions/employee/{employeeId}
   */
  getEmployeeTransactionHistory: async (
    employeeId: number,
    limit?: number
  ): Promise<PointTransactionDto[]> => {
    const response = await apiDotNet.get<ApiResponse<PointTransactionDto[]>>(
      `/Point/transactions/employee/${employeeId}`,
      { params: { limit } }
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Lỗi khi lấy lịch sử giao dịch');
  },

  /**
   * Lấy lịch sử giao dịch điểm với phân trang
   * GET /api/Point/transactions
   */
  getPointTransactions: async (
    pageNumber: number = 1,
    pageSize: number = 10,
    employeeId?: number,
    type?: string,
    fromDate?: string,
    toDate?: string
  ): Promise<PagedResult<PointTransactionDto>> => {
    const response = await apiDotNet.get<PagedResult<PointTransactionDto>>(
      '/Point/transactions',
      {
        params: {
          pageNumber,
          pageSize,
          employeeId,
          type,
          fromDate,
          toDate,
        },
      }
    );

    return response.data;
  },

  /**
   * Lấy quy tắc quy đổi điểm đang hoạt động
   * GET /api/Point/conversion-rules/active
   */
  getActiveConversionRule: async (): Promise<PointConversionRuleDto> => {
    const response = await apiDotNet.get<ApiResponse<PointConversionRuleDto>>(
      '/Point/conversion-rules/active'
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Không tìm thấy quy tắc quy đổi');
  },

  /**
   * Lấy toàn bộ quy tắc quy đổi điểm
   * GET /api/Point/conversion-rules
   */
  getAllConversionRule: async (): Promise<PointConversionRuleDto[]> => {
    const response = await apiDotNet.get<ApiResponse<PointConversionRuleDto[]>>(
      '/Point/conversion-rules'
    )

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Không tìm thấy bất kì quy tắc quy đổi');
  },

  /**
   * Gửi yêu cầu quy đổi điểm sang tiền
   * POST /api/Point/employee/{employeeId}/convert
   */
  requestPointToMoneyConversion: async (
    employeeId: number,
    pointRequested: number
  ): Promise<PointToMoneyHistoryDto> => {
    const response = await apiDotNet.post<ApiResponse<PointToMoneyHistoryDto>>(
      `/Point/employee/${employeeId}/convert`,
      { PointRequested: pointRequested }  // Backend .NET expects PascalCase
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Lỗi khi gửi yêu cầu quy đổi');
  },

  /**
   * Lấy lịch sử quy đổi điểm sang tiền
   * GET /api/Point/conversion-history
   */
  getPointToMoneyHistory: async (
    pageNumber: number = 1,
    pageSize: number = 10,
    employeeId?: number,
    status?: string
  ): Promise<PagedResult<PointToMoneyHistoryDto>> => {
    const response = await apiDotNet.get<PagedResult<PointToMoneyHistoryDto>>(
      '/Point/conversion-history',
      {
        params: {
          pageNumber,
          pageSize,
          employeeId,
          status,
        },
      }
    );

    return response.data;
  },

  /**
   * Lấy thống kê điểm thưởng
   * GET /api/Point/statistics
   */
  getPointStatistics: async (): Promise<any> => {
    const response = await apiDotNet.get<ApiResponse<any>>('/Point/statistics');

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || 'Lỗi khi lấy thống kê');
  },

  /**
   * Lấy danh sách điểm của tất cả nhân viên
   * GET /api/Point/employees
   */
  getAllEmployeePoints: async (
    pageNumber: number = 1,
    pageSize: number = 100
  ): Promise<PagedResult<EmployeePointDto>> => {
    const response = await apiDotNet.get<PagedResult<EmployeePointDto>>(
      '/Point',
      {
        params: {
          pageNumber,
          pageSize,
        },
      }
    );

    return response.data;
  },
};