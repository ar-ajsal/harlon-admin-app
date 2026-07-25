/**
 * Order Service
 *
 * Handles all order-related API calls.
 * Returns typed data. All errors bubble up as ApiError.
 *
 * Uses placeholder/fallback data for dashboard stats until
 * the backend stats endpoint is ready.
 */

import apiClient from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { ApiResponse, PaginatedData } from '@/types/api.types';
import { DashboardStats, Order, OrderListParams } from '@/types/order.types';

const OrderService = {
  /**
   * GET /orders
   * Returns a paginated list of orders with optional filters.
   */
  getOrders: async (params: OrderListParams = {}): Promise<PaginatedData<Order>> => {
    const response = await apiClient.get<ApiResponse<PaginatedData<Order>>>(ENDPOINTS.ORDERS.LIST, {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        ...(params.status && params.status !== 'all' ? { status: params.status } : {}),
        ...(params.search ? { search: params.search } : {}),
        ...(params.sortBy ? { sortBy: params.sortBy } : {}),
        ...(params.sortOrder ? { sortOrder: params.sortOrder } : {}),
      },
    });
    return response.data.data;
  },

  /**
   * GET /orders/:id
   * Returns full order detail including items, address, and timeline.
   */
  getOrderById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<ApiResponse<Order>>(ENDPOINTS.ORDERS.DETAIL(id));
    return response.data.data;
  },

  /**
   * GET /orders/stats
   * Returns dashboard statistics.
   * Falls back to zeroed placeholder data if the endpoint doesn't exist yet.
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await apiClient.get<ApiResponse<DashboardStats>>(ENDPOINTS.ORDERS.STATS);
      return response.data.data;
    } catch {
      // Return placeholder data while the stats endpoint is being built.
      // Remove this fallback once the backend endpoint is ready.
      return {
        todayOrders: 0,
        todayRevenue: 0,
        pendingOrders: 0,
        confirmedOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        totalOrdersAllTime: 0,
        totalRevenueAllTime: 0,
      };
    }
  },
};

export default OrderService;
