/**
 * Customers API Endpoints
 *
 * Định nghĩa tất cả endpoints liên quan đến customers
 * Sẽ được dùng bởi cả mock và real API
 */

import type { ListQueryParams } from "../types";

// ─── Request Types ───────────────────────────────────────────────────────────────

export interface CustomerListParams extends ListQueryParams {
  search?: string;
  status?: "active" | "inactive" | "vip";
  segment?: "new" | "regular" | "vip";
  dateFrom?: string;
  dateTo?: string;
}

export interface CreateCustomerInput {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  address?: {
    street: string;
    city: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  tags?: string[];
  note?: string;
}

export interface UpdateCustomerInput extends Partial<CreateCustomerInput> {
  id: string;
}

export interface CustomerStatsInput {
  customerId: string;
  dateFrom?: string;
  dateTo?: string;
}

// ─── Response Types ──────────────────────────────────────────────────────────────

export interface CustomerListResponse {
  items: CustomerResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CustomerResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: {
    street: string;
    city: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  status: "active" | "inactive" | "vip";
  segment: "new" | "regular" | "vip";
  tags?: string[];
  note?: string;
  stats: {
    totalOrders: number;
    totalSpent: number;
    avgOrderValue: number;
    lastOrderDate?: string;
  };
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface CustomerStatsResponse {
  orders: number;
  spent: number;
  avgOrderValue: number;
  frequency: number; // days between orders
  lastOrder?: string;
  lifetimeValue: number;
  segment: "new" | "regular" | "vip";
}

// ─── Endpoint Definitions ─────────────────────────────────────────────────────────

export const CUSTOMERS_ENDPOINTS = {
  // List customers
  list: (params?: CustomerListParams) => ({
    url: "/api/customers" as const,
    method: "GET" as const,
    query: params,
  }),

  // Get single customer by ID
  getById: (id: string) => ({
    url: `/api/customers/${id}` as const,
    method: "GET" as const,
  }),

  // Get customer by email
  getByEmail: (email: string) => ({
    url: "/api/customers/by-email" as const,
    method: "GET" as const,
    query: { email },
  }),

  // Create new customer
  create: (data: CreateCustomerInput) => ({
    url: "/api/customers" as const,
    method: "POST" as const,
    body: data,
  }),

  // Update customer
  update: ({ id, ...data }: UpdateCustomerInput) => ({
    url: `/api/customers/${id}` as const,
    method: "PUT" as const,
    body: data,
  }),

  // Partial update
  patch: ({ id, ...data }: Partial<UpdateCustomerInput>) => ({
    url: `/api/customers/${id}` as const,
    method: "PATCH" as const,
    body: data,
  }),

  // Delete customer (soft delete)
  delete: (id: string) => ({
    url: `/api/customers/${id}` as const,
    method: "DELETE" as const,
  }),

  // Get customer stats
  getStats: (customerId: string, params?: Omit<CustomerStatsInput, "customerId">) => ({
    url: `/api/customers/${customerId}/stats` as const,
    method: "GET" as const,
    query: params,
  }),

  // Get customer orders
  getOrders: (customerId: string, params?: ListQueryParams) => ({
    url: `/api/customers/${customerId}/orders` as const,
    method: "GET" as const,
    query: params,
  }),

  // Add tag to customer
  addTag: (customerId: string, tag: string) => ({
    url: `/api/customers/${customerId}/tags` as const,
    method: "POST" as const,
    body: { tag },
  }),

  // Remove tag from customer
  removeTag: (customerId: string, tag: string) => ({
    url: `/api/customers/${customerId}/tags/${tag}` as const,
    method: "DELETE" as const,
  }),

  // Update customer segment
  updateSegment: (customerId: string, segment: "new" | "regular" | "vip") => ({
    url: `/api/customers/${customerId}/segment` as const,
    method: "PATCH" as const,
    body: { segment },
  }),
} as const;

// ─── Type Exports ─────────────────────────────────────────────────────────────────

export type CustomersEndpoint = typeof CUSTOMERS_ENDPOINTS;
