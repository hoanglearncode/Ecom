/**
 * Admin API Endpoints
 *
 * Định nghĩa tất cả endpoints cho admin dashboard
 * Các endpoints này sẽ được dùng bởi admin features
 */

import type { ListQueryParams } from "../types";

// ─── Common Admin Types ─────────────────────────────────────────────────────────

export interface AdminListParams extends ListQueryParams {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ─── Dashboard Endpoints ─────────────────────────────────────────────────────────

export interface AdminDashboardResponse {
  stats: {
    revenue: { current: number; previous: number; change: number };
    orders: { current: number; previous: number; change: number };
    customers: { current: number; previous: number; change: number };
    products: { current: number; previous: number; change: number };
  };
  recentOrders: Array<{
    id: string;
    number: string;
    customer: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    detail: string;
    createdAt: string;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
}

// ─── Categories Management ───────────────────────────────────────────────────────

export interface AdminCategoriesResponse {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    productCount: number;
    isActive: boolean;
    displayOrder: number;
  }>;
  total: number;
}

// ─── Brands Management ────────────────────────────────────────────────────────────

export interface AdminBrandsResponse {
  brands: Array<{
    id: string;
    name: string;
    slug: string;
    logo?: string;
    productCount: number;
    isActive: boolean;
  }>;
  total: number;
}

// ─── Customers Management ─────────────────────────────────────────────────────────

export interface AdminCustomersResponse {
  customers: Array<{
    id: string;
    name: string;
    email: string;
    phone?: string;
    totalOrders: number;
    totalSpent: number;
    status: string;
    segment: string;
    createdAt: string;
  }>;
  total: number;
}

// ─── Orders Management ───────────────────────────────────────────────────────────

export interface AdminOrdersResponse {
  orders: Array<{
    id: string;
    number: string;
    customer: string;
    items: number;
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
  }>;
  total: number;
  stats: {
    pending: number;
    processing: number;
    shipped: number;
    completed: number;
    cancelled: number;
  };
}

// ─── Inventory Management ───────────────────────────────────────────────────────

export interface AdminInventoryResponse {
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    sku?: string;
    stock: number;
    reserved: number;
    available: number;
    lowStock: boolean;
    lastUpdated: string;
  }>;
  total: number;
  lowStockCount: number;
  outOfStockCount: number;
}

// ─── Reviews Management ─────────────────────────────────────────────────────────

export interface AdminReviewsResponse {
  reviews: Array<{
    id: string;
    product: string;
    customer: string;
    rating: number;
    comment: string;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
  }>;
  total: number;
  pendingCount: number;
}

// ─── Coupons Management ─────────────────────────────────────────────────────────

export interface AdminCouponsResponse {
  coupons: Array<{
    id: string;
    code: string;
    type: "percentage" | "fixed" | "shipping";
    value: number;
    minPurchase?: number;
    usageLimit?: number;
    usedCount: number;
    isActive: boolean;
    validFrom: string;
    validUntil?: string;
  }>;
  total: number;
  activeCount: number;
}

// ─── Campaigns Management ────────────────────────────────────────────────────────

export interface AdminCampaignsResponse {
  campaigns: Array<{
    id: string;
    name: string;
    type: string;
    status: "draft" | "active" | "paused" | "completed";
    budget: number;
    spent: number;
    impressions: number;
    clicks: number;
    conversions: number;
    startDate: string;
    endDate?: string;
  }>;
  total: number;
  activeCount: number;
}

// ─── Appearance Management ───────────────────────────────────────────────────────

export interface AdminAppearanceResponse {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    darkMode?: boolean;
  };
  logo?: {
    url: string;
    width: number;
    height: number;
  };
  favicon?: string;
  banner?: {
    url: string;
    link?: string;
  };
}

// ─── Reports Endpoints ───────────────────────────────────────────────────────────

export interface AdminReportsResponse {
  reports: Array<{
    id: string;
    name: string;
    type: string;
    status: "generating" | "ready" | "failed";
    fileUrl?: string;
    createdAt: string;
  }>;
}

export interface AdminReportsGenerateInput {
  type: "sales" | "inventory" | "customers" | "products";
  dateFrom: string;
  dateTo: string;
  format?: "pdf" | "excel" | "csv";
}

// ─── Support/Helpdesk ────────────────────────────────────────────────────────────

export interface AdminSupportResponse {
  tickets: Array<{
    id: string;
    customer: string;
    subject: string;
    status: "open" | "pending" | "resolved" | "closed";
    priority: "low" | "medium" | "high" | "urgent";
    assignedTo?: string;
    createdAt: string;
  }>;
  total: number;
  openCount: number;
}

// ─── Endpoint Definitions ─────────────────────────────────────────────────────────

export const ADMIN_ENDPOINTS = {
  // Dashboard
  getDashboard: () => ({
    url: "/api/admin/dashboard" as const,
    method: "GET" as const,
  }),

  // Analytics (alias for dashboard analytics)
  getAnalytics: (params?: { range?: "7d" | "30d" | "90d" | "1y" }) => ({
    url: "/api/admin/analytics" as const,
    method: "GET" as const,
    query: params,
  }),

  // Quick stats
  getQuickStats: () => ({
    url: "/api/admin/quick-stats" as const,
    method: "GET" as const,
  }),

  // Recent activity
  getRecentActivity: (limit = 10) => ({
    url: "/api/admin/recent-activity" as const,
    method: "GET" as const,
    query: { limit },
  }),

  // Categories
  getCategories: (params?: AdminListParams) => ({
    url: "/api/admin/categories" as const,
    method: "GET" as const,
    query: params,
  }),

  // Brands
  getBrands: (params?: AdminListParams) => ({
    url: "/api/admin/brands" as const,
    method: "GET" as const,
    query: params,
  }),

  // Customers
  getCustomers: (params?: AdminListParams) => ({
    url: "/api/admin/customers" as const,
    method: "GET" as const,
    query: params,
  }),

  // Orders
  getOrders: (params?: AdminListParams) => ({
    url: "/api/admin/orders" as const,
    method: "GET" as const,
    query: params,
  }),

  // Inventory
  getInventory: (params?: AdminListParams) => ({
    url: "/api/admin/inventory" as const,
    method: "GET" as const,
    query: params,
  }),

  // Reviews
  getReviews: (params?: AdminListParams) => ({
    url: "/api/admin/reviews" as const,
    method: "GET" as const,
    query: params,
  }),

  // Coupons
  getCoupons: (params?: AdminListParams) => ({
    url: "/api/admin/coupons" as const,
    method: "GET" as const,
    query: params,
  }),

  // Campaigns
  getCampaigns: (params?: AdminListParams) => ({
    url: "/api/admin/campaigns" as const,
    method: "GET" as const,
    query: params,
  }),

  // Appearance
  getAppearance: () => ({
    url: "/api/admin/appearance" as const,
    method: "GET" as const,
  }),

  updateAppearance: (data: Partial<AdminAppearanceResponse>) => ({
    url: "/api/admin/appearance" as const,
    method: "PUT" as const,
    body: data,
  }),

  // Reports
  getReports: (params?: AdminListParams) => ({
    url: "/api/admin/reports" as const,
    method: "GET" as const,
    query: params,
  }),

  generateReport: (data: AdminReportsGenerateInput) => ({
    url: "/api/admin/reports/generate" as const,
    method: "POST" as const,
    body: data,
  }),

  // Support
  getSupport: (params?: AdminListParams) => ({
    url: "/api/admin/support" as const,
    method: "GET" as const,
    query: params,
  }),
} as const;

export type AdminEndpoint = typeof ADMIN_ENDPOINTS;
