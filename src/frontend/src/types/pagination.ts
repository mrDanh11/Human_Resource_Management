export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  departmentName?: string;
  roleName?: string;
  status?: string;
}

export interface PaginationRequestParams {
  page: number;
  size: number;
  searchTerm?: string;
  status?: string;
  type?: string;
}
