/**
 * Admin Repository
 *
 * Repository layer cho admin dashboard data
 * Abstracts API calls và cung cấp methods rõ ràng
 */

import { apiGet, apiPost, apiPut } from "@/lib/api/client";
import type {
  AdminDashboardResponse,
  AdminCategoriesResponse,
  AdminBrandsResponse,
  AdminCustomersResponse,
  AdminOrdersResponse,
  AdminInventoryResponse,
  AdminReviewsResponse,
  AdminCouponsResponse,
  AdminCampaignsResponse,
  AdminAppearanceResponse,
  AdminReportsResponse,
  AdminReportsGenerateInput,
  AdminSupportResponse,
  AdminListParams,
} from "@/lib/api/endpoints/admin";

// ─── Repository Interface ───────────────────────────────────────────────────────

export interface AdminRepository {
  // Dashboard
  getDashboard(): Promise<AdminDashboardResponse>;
  getAnalytics(params?: { range?: "7d" | "30d" | "90d" | "1y" }): Promise<AdminDashboardResponse>;
  getQuickStats(): Promise<{
    revenue: string;
    orders: string;
    customers: string;
    products: string;
  }>;
  getRecentActivity(limit?: number): Promise<
    Array<{
      id: string;
      type: string;
      title: string;
      detail: string;
      time: string;
    }>
  >;

  // Categories
  getCategories(params?: AdminListParams): Promise<AdminCategoriesResponse>;

  // Brands
  getBrands(params?: AdminListParams): Promise<AdminBrandsResponse>;

  // Customers
  getCustomers(params?: AdminListParams): Promise<AdminCustomersResponse>;

  // Orders
  getOrders(params?: AdminListParams): Promise<AdminOrdersResponse>;

  // Inventory
  getInventory(params?: AdminListParams): Promise<AdminInventoryResponse>;

  // Reviews
  getReviews(params?: AdminListParams): Promise<AdminReviewsResponse>;

  // Coupons
  getCoupons(params?: AdminListParams): Promise<AdminCouponsResponse>;

  // Campaigns
  getCampaigns(params?: AdminListParams): Promise<AdminCampaignsResponse>;

  // Appearance
  getAppearance(): Promise<AdminAppearanceResponse>;
  updateAppearance(data: Partial<AdminAppearanceResponse>): Promise<AdminAppearanceResponse>;

  // Reports
  getReports(params?: AdminListParams): Promise<AdminReportsResponse>;
  generateReport(data: AdminReportsGenerateInput): Promise<{ reportId: string }>;

  // Support
  getSupport(params?: AdminListParams): Promise<AdminSupportResponse>;
}

// ─── Implementation ──────────────────────────────────────────────────────────────

class AdminRepositoryImpl implements AdminRepository {
  // ── Dashboard ────────────────────────────────────────────────────────────────

  async getDashboard(): Promise<AdminDashboardResponse> {
    return apiGet<AdminDashboardResponse>("/api/admin/dashboard");
  }

  async getAnalytics(params?: { range?: "7d" | "30d" | "90d" | "1y" }): Promise<AdminDashboardResponse> {
    return apiGet<AdminDashboardResponse>("/api/admin/analytics", { params });
  }

  async getQuickStats(): Promise<{
    revenue: string;
    orders: string;
    customers: string;
    products: string;
  }> {
    return apiGet("/api/admin/quick-stats");
  }

  async getRecentActivity(limit = 10): Promise<
    Array<{
      id: string;
      type: string;
      title: string;
      detail: string;
      time: string;
    }>
  > {
    return apiGet("/api/admin/recent-activity", { params: { limit } });
  }

  // ── Categories ────────────────────────────────────────────────────────────────

  async getCategories(params?: AdminListParams): Promise<AdminCategoriesResponse> {
    return apiGet<AdminCategoriesResponse>("/api/admin/categories", { params });
  }

  // ── Brands ─────────────────────────────────────────────────────────────────────

  async getBrands(params?: AdminListParams): Promise<AdminBrandsResponse> {
    return apiGet<AdminBrandsResponse>("/api/admin/brands", { params });
  }

  // ── Customers ───────────────────────────────────────────────────────────────────

  async getCustomers(params?: AdminListParams): Promise<AdminCustomersResponse> {
    return apiGet<AdminCustomersResponse>("/api/admin/customers", { params });
  }

  // ── Orders ─────────────────────────────────────────────────────────────────────

  async getOrders(params?: AdminListParams): Promise<AdminOrdersResponse> {
    return apiGet<AdminOrdersResponse>("/api/admin/orders", { params });
  }

  // ── Inventory ──────────────────────────────────────────────────────────────────

  async getInventory(params?: AdminListParams): Promise<AdminInventoryResponse> {
    return apiGet<AdminInventoryResponse>("/api/admin/inventory", { params });
  }

  // ── Reviews ───────────────────────────────────────────────────────────────────

  async getReviews(params?: AdminListParams): Promise<AdminReviewsResponse> {
    return apiGet<AdminReviewsResponse>("/api/admin/reviews", { params });
  }

  // ── Coupons ────────────────────────────────────────────────────────────────────

  async getCoupons(params?: AdminListParams): Promise<AdminCouponsResponse> {
    return apiGet<AdminCouponsResponse>("/api/admin/coupons", { params });
  }

  // ── Campaigns ───────────────────────────────────────────────────────────────────

  async getCampaigns(params?: AdminListParams): Promise<AdminCampaignsResponse> {
    return apiGet<AdminCampaignsResponse>("/api/admin/campaigns", { params });
  }

  // ── Appearance ─────────────────────────────────────────────────────────────────

  async getAppearance(): Promise<AdminAppearanceResponse> {
    return apiGet<AdminAppearanceResponse>("/api/admin/appearance");
  }

  async updateAppearance(data: Partial<AdminAppearanceResponse>): Promise<AdminAppearanceResponse> {
    return apiPut<AdminAppearanceResponse, Partial<AdminAppearanceResponse>>(
      "/api/admin/appearance",
      data
    );
  }

  // ── Reports ───────────────────────────────────────────────────────────────────

  async getReports(params?: AdminListParams): Promise<AdminReportsResponse> {
    return apiGet<AdminReportsResponse>("/api/admin/reports", { params });
  }

  async generateReport(data: AdminReportsGenerateInput): Promise<{ reportId: string }> {
    return apiPost<{ reportId: string }, AdminReportsGenerateInput>(
      "/api/admin/reports/generate",
      data
    );
  }

  // ── Support ────────────────────────────────────────────────────────────────────

  async getSupport(params?: AdminListParams): Promise<AdminSupportResponse> {
    return apiGet<AdminSupportResponse>("/api/admin/support", { params });
  }
}

// ─── Export singleton ───────────────────────────────────────────────────────────

export const adminRepository = new AdminRepositoryImpl();
