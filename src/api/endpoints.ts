/**
 * All API endpoint paths for the Harlon backend.
 *
 * Rules:
 *  - Static paths are plain strings
 *  - Dynamic paths are functions that accept params and return strings
 *  - No baseURL here — that lives in env.ts
 *  - No trailing slashes
 */

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
  },

  ORDERS: {
    LIST: '/orders',
    STATS: '/orders/stats',
    DETAIL: (id: string) => `/orders/${id}`,
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
  },

  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
  },
} as const;
