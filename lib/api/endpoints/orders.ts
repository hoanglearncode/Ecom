/**
 * Orders API Endpoints
 *
 * Định nghĩa tất cả endpoints liên quan đến orders
 * Sẽ được dùng bởi cả mock và real API
 */

import type { ListQueryParams } from "../types";

// ─── Request Types ───────────────────────────────────────────────────────────────

export interface OrderListParams extends ListQueryParams {
  status?: "pending" | "processing" | "shipped" | "completed" | "cancelled";
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface CreateOrderInput {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  customerId?: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    country?: string;
    postalCode?: string;
  };
  paymentMethod: "card" | "bank" | "cod" | "wallet";
  couponCode?: string;
  note?: string;
}

export interface UpdateOrderStatusInput {
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled";
  note?: string;
}

export interface FulfillOrderInput {
  trackingNumber?: string;
  carrier?: string;
  location?: string;
}

// ─── Response Types ──────────────────────────────────────────────────────────────

export interface OrderListResponse {
  items: OrderResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderResponse {
  id: string;
  number: string;
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled";
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    productImage?: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
  customer: {
    id?: string;
    name: string;
    email?: string;
    phone?: string;
  };
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    country?: string;
    postalCode?: string;
  };
  payment: {
    method: "card" | "bank" | "cod" | "wallet";
    status: "pending" | "paid" | "failed" | "refunded";
    transactionId?: string;
  };
  coupon?: {
    code: string;
    discount: number;
  };
  note?: string;
  createdAt: string;
  updatedAt: string;
  fulfilledAt?: string;
  tracking?: Array<{
    number: string;
    carrier: string;
    location?: string;
    createdAt: string;
  }>;
}

export interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  completed: number;
  cancelled: number;
  totalRevenue: number;
  avgOrderValue: number;
}

// ─── Endpoint Definitions ─────────────────────────────────────────────────────────

export const ORDERS_ENDPOINTS = {
  // List orders with filtering/pagination
  list: (params?: OrderListParams) => ({
    url: "/api/orders" as const,
    method: "GET" as const,
    query: params,
  }),

  // Get single order by ID
  getById: (id: string) => ({
    url: `/api/orders/${id}` as const,
    method: "GET" as const,
  }),

  // Get order by number
  getByNumber: (number: string) => ({
    url: `/api/orders/number/${number}` as const,
    method: "GET" as const,
  }),

  // Create new order
  create: (data: CreateOrderInput) => ({
    url: "/api/orders" as const,
    method: "POST" as const,
    body: data,
  }),

  // Update order status
  updateStatus: (id: string, data: UpdateOrderStatusInput) => ({
    url: `/api/orders/${id}/status` as const,
    method: "PATCH" as const,
    body: data,
  }),

  // Fulfill order (add tracking)
  fulfill: (id: string, data: FulfillOrderInput) => ({
    url: `/api/orders/${id}/fulfill` as const,
    method: "POST" as const,
    body: data,
  }),

  // Refund order
  refund: (id: string, reason?: string) => ({
    url: `/api/orders/${id}/refund` as const,
    method: "POST" as const,
    body: { reason },
  }),

  // Cancel order
  cancel: (id: string, reason?: string) => ({
    url: `/api/orders/${id}/cancel` as const,
    method: "POST" as const,
    body: { reason },
  }),

  // Get order stats
  getStats: (params?: { dateFrom?: string; dateTo?: string }) => ({
    url: "/api/orders/stats" as const,
    method: "GET" as const,
    query: params,
  }),

  // Get customer orders
  getByCustomer: (customerId: string, params?: Omit<OrderListParams, "customerId">) => ({
    url: `/api/customers/${customerId}/orders` as const,
    method: "GET" as const,
    query: params,
  }),
} as const;

// ─── Type Exports ─────────────────────────────────────────────────────────────────

export type OrdersEndpoint = typeof ORDERS_ENDPOINTS;
