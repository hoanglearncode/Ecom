import { apiGet } from "@/lib/api/client";

import type {
  AdminAppearanceData,
  AdminBrandsData,
  AdminCampaignsData,
  AdminCategoriesData,
  AdminCouponsData,
  AdminAnalyticsData,
  AdminDashboardData,
  AdminCustomersData,
  AdminInventoryData,
  AdminOrdersData,
  AdminPromotionsData,
  AdminReportsData,
  AdminReviewsData,
  AdminSupportData,
} from "./types";

export function getAdminDashboard() {
  return apiGet<AdminDashboardData>("/api/admin/dashboard");
}

export function getAdminAnalytics() {
  return apiGet<AdminAnalyticsData>("/api/admin/analytics");
}

export function getAdminPromotions() {
  return apiGet<AdminPromotionsData>("/api/admin/promotions");
}

export function getAdminReports() {
  return apiGet<AdminReportsData>("/api/admin/reports");
}

export function getAdminSupport() {
  return apiGet<AdminSupportData>("/api/admin/support");
}

export function getAdminCategories() {
  return apiGet<AdminCategoriesData>("/api/admin/categories");
}

export function getAdminBrands() {
  return apiGet<AdminBrandsData>("/api/admin/brands");
}

export function getAdminCustomers() {
  return apiGet<AdminCustomersData>("/api/admin/customers");
}

export function getAdminInventory() {
  return apiGet<AdminInventoryData>("/api/admin/inventory");
}

export function getAdminOrders() {
  return apiGet<AdminOrdersData>("/api/admin/orders");
}

export function getAdminReviews() {
  return apiGet<AdminReviewsData>("/api/admin/reviews");
}

export function getAdminCoupons() {
  return apiGet<AdminCouponsData>("/api/admin/coupons");
}

export function getAdminAppearance() {
  return apiGet<AdminAppearanceData>("/api/admin/appearance");
}

export function getAdminCampaigns() {
  return apiGet<AdminCampaignsData>("/api/admin/campaigns");
}
