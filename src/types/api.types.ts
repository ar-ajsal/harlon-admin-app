/**
 * Generic API response shapes from the Harlon backend.
 * All endpoints return one of these structures.
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<PaginatedData<T>> {}

/**
 * Standardised error object thrown by the Axios interceptor.
 * All services catch ApiError — never raw AxiosError.
 */
export interface ApiError {
  message: string;
  statusCode: number;
  isNetworkError: boolean;
  isTimeout: boolean;
}

export type QueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};
