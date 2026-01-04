/**
 * requestService.ts - Service cho quản lý yêu cầu nhân viên
 * Các API calls: tạo yêu cầu, approve/reject, lấy danh sách yêu cầu
 */

// API tạo yêu cầu nghỉ phép
// API tạo yêu cầu WFH
// API tạo yêu cầu check-in/out
// API approve/reject yêu cầu (dành cho manager)
// API lấy danh sách yêu cầu theo nhân viên/trạng thái

import { apiDotNet, apiSpring } from './api';
import type { PaginationRequestParams } from '../types/pagination';
import type { DetailRequest } from '../types/request';
import type { ListRequests, PageResponse, ApiResponse } from '../types/request';


export const requestService = {
  // Lấy danh sách yêu cầu
  getListrequests: async (params: PaginationRequestParams): Promise<PageResponse<ListRequests>> => {
    const response = await apiSpring.get<ApiResponse<PageResponse<ListRequests>>>('/manager/request', {
      params: {
        ...params,
      }
    });
    if (response.data) {
      return response.data.data;
    } else {
      throw new Error('Failed to fetch requests list');
    }
  },

  //Lấy chi tiết yêu cầu
  getDetailRequest: async (id: number): Promise<DetailRequest> => { 
    const response = await apiSpring.get<DetailRequest>(`/manager/request/${id}`);
    if (response.data) {
      return response.data;
    } else {
      throw new Error('Failed to fetch request detail');
    }
  }
}