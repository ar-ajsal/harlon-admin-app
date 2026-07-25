/**
 * Order domain types.
 * Shaped to match a typical Harlon backend order document.
 * Update field names if they differ from your actual MongoDB schema.
 */

// ─── Enums ──────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentMethod = 'cod' | 'online' | 'card' | 'upi';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

// ─── Nested models ──────────────────────────────────────────────────────────

export interface OrderAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  sku?: string;
  size?: string;
  color?: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

// ─── Main Order ─────────────────────────────────────────────────────────────

export interface Order {
  _id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: OrderAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: number;
  shippingCharge: number;
  discount: number;
  total: number;
  timeline: OrderTimeline[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  confirmedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalOrdersAllTime: number;
  totalRevenueAllTime: number;
}

// ─── List Params ─────────────────────────────────────────────────────────────

export interface OrderListParams {
  page?: number;
  limit?: number;
  status?: OrderStatus | 'all';
  search?: string;
  sortBy?: 'createdAt' | 'total' | 'status';
  sortOrder?: 'asc' | 'desc';
}
