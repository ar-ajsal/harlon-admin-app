/**
 * useOrders hooks
 *
 * Wraps React Query for all order-related data fetching.
 * Provides: loading states, error states, caching, and background refetch for free.
 *
 * Query keys are centralised in QUERY_KEYS to prevent cache key typos.
 */

import { useQuery } from '@tanstack/react-query';

import OrderService from '@/services/order.service';
import { DashboardStats, Order, OrderListParams } from '@/types/order.types';
import { PaginatedData } from '@/types/api.types';

// ─── Query Keys ──────────────────────────────────────────────────────────────
// Centralised here so cache invalidation is reliable and refactor-safe.

export const QUERY_KEYS = {
  dashboardStats: ['dashboard', 'stats'] as const,
  ordersList: (params: OrderListParams) => ['orders', 'list', params] as const,
  orderDetail: (id: string) => ['orders', 'detail', id] as const,
};

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Dashboard statistics — cached for 2 minutes, refetches on window focus.
 */
export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: QUERY_KEYS.dashboardStats,
    queryFn: OrderService.getDashboardStats,
    staleTime: 2 * 60 * 1000,   // 2 minutes
    refetchOnWindowFocus: true,
    retry: 2,
  });
}

/**
 * Paginated order list with filter/sort params.
 * Results are cached per param combination.
 */
export function useOrdersList(params: OrderListParams = {}) {
  return useQuery<PaginatedData<Order>>({
    queryKey: QUERY_KEYS.ordersList(params),
    queryFn: () => OrderService.getOrders(params),
    staleTime: 60 * 1000,   // 1 minute
    retry: 2,
  });
}

/**
 * Single order detail — cached indefinitely until invalidated.
 * Only fetches when an id is provided.
 */
export function useOrderDetail(id: string | undefined) {
  return useQuery<Order>({
    queryKey: QUERY_KEYS.orderDetail(id ?? ''),
    queryFn: () => OrderService.getOrderById(id!),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,  // 5 minutes
    retry: 1,
  });
}
