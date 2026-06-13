/**
 * Admin Data Hooks
 *
 * Centralized hooks cho fetching admin dashboard và analytics data
 */

import { useApiQuery } from "../use-api-query"
import { apiGet } from "@/lib/api/client"
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
} from "@/features/admin/types"

/**
 * Hook để lấy Admin Dashboard data
 */
export function useAdminDashboard() {
  return useApiQuery<AdminDashboardData>({
    queryKey: ["admin", "dashboard"],
    queryFn: () => apiGet<AdminDashboardData>("/api/admin/dashboard"),
  })
}

/**
 * Hook để lấy Admin Analytics data
 */
export function useAdminAnalytics() {
  return useApiQuery<AdminAnalyticsData>({
    queryKey: ["admin", "analytics"],
    queryFn: () => apiGet<AdminAnalyticsData>("/api/admin/analytics"),
  })
}

/**
 * Hook để lấy Admin Promotions data
 */
export function useAdminPromotions() {
  return useApiQuery<AdminPromotionsData>({
    queryKey: ["admin", "promotions"],
    queryFn: () => apiGet<AdminPromotionsData>("/api/admin/promotions"),
  })
}

/**
 * Hook để lấy Admin Reports data
 */
export function useAdminReports() {
  return useApiQuery<AdminReportsData>({
    queryKey: ["admin", "reports"],
    queryFn: () => apiGet<AdminReportsData>("/api/admin/reports"),
  })
}

/**
 * Hook để lấy Admin Support data
 */
export function useAdminSupport() {
  return useApiQuery<AdminSupportData>({
    queryKey: ["admin", "support"],
    queryFn: () => apiGet<AdminSupportData>("/api/admin/support"),
  })
}

/**
 * Hook để lấy Admin Categories data
 */
export function useAdminCategories() {
  return useApiQuery<AdminCategoriesData>({
    queryKey: ["admin", "categories"],
    queryFn: () => apiGet<AdminCategoriesData>("/api/admin/categories"),
  })
}

/**
 * Hook để lấy Admin Brands data
 */
export function useAdminBrands() {
  return useApiQuery<AdminBrandsData>({
    queryKey: ["admin", "brands"],
    queryFn: () => apiGet<AdminBrandsData>("/api/admin/brands"),
  })
}

/**
 * Hook để lấy Admin Customers data
 */
export function useAdminCustomers() {
  return useApiQuery<AdminCustomersData>({
    queryKey: ["admin", "customers"],
    queryFn: () => apiGet<AdminCustomersData>("/api/admin/customers"),
  })
}

/**
 * Hook để lấy Admin Inventory data
 */
export function useAdminInventory() {
  return useApiQuery<AdminInventoryData>({
    queryKey: ["admin", "inventory"],
    queryFn: () => apiGet<AdminInventoryData>("/api/admin/inventory"),
  })
}

/**
 * Hook để lấy Admin Orders data
 */
export function useAdminOrders() {
  return useApiQuery<AdminOrdersData>({
    queryKey: ["admin", "orders"],
    queryFn: () => apiGet<AdminOrdersData>("/api/admin/orders"),
  })
}

/**
 * Hook để lấy Admin Reviews data
 */
export function useAdminReviews() {
  return useApiQuery<AdminReviewsData>({
    queryKey: ["admin", "reviews"],
    queryFn: () => apiGet<AdminReviewsData>("/api/admin/reviews"),
  })
}

/**
 * Hook để lấy Admin Coupons data
 */
export function useAdminCoupons() {
  return useApiQuery<AdminCouponsData>({
    queryKey: ["admin", "coupons"],
    queryFn: () => apiGet<AdminCouponsData>("/api/admin/coupons"),
  })
}

/**
 * Hook để lấy Admin Appearance data
 */
export function useAdminAppearance() {
  return useApiQuery<AdminAppearanceData>({
    queryKey: ["admin", "appearance"],
    queryFn: () => apiGet<AdminAppearanceData>("/api/admin/appearance"),
  })
}

/**
 * Hook để lấy Admin Campaigns data
 */
export function useAdminCampaigns() {
  return useApiQuery<AdminCampaignsData>({
    queryKey: ["admin", "campaigns"],
    queryFn: () => apiGet<AdminCampaignsData>("/api/admin/campaigns"),
  })
}

/**
 * Hook để lấy tất cả admin data trong một call
 * Useful cho initial load
 */
export function useAdminAllData() {
  const dashboard = useAdminDashboard()
  const analytics = useAdminAnalytics()
  const orders = useAdminOrders()

  return {
    dashboard,
    analytics,
    orders,
    isLoading: dashboard.isLoading || analytics.isLoading || orders.isLoading,
    error: dashboard.error || analytics.error || orders.error,
  }
}

/**
 * Hook để lấy quick stats cho dashboard
 */
export function useAdminQuickStats() {
  return useApiQuery<{
    revenue: string
    orders: string
    customers: string
    products: string
  }>({
    queryKey: ["admin", "quick-stats"],
    queryFn: () => apiGet("/api/admin/quick-stats"),
  })
}

/**
 * Hook để lấy recent activity cho dashboard
 */
export function useAdminRecentActivity(limit = 10) {
  return useApiQuery<
    Array<{
      id: string
      type: string
      title: string
      detail: string
      time: string
    }>
  >({
    queryKey: ["admin", "recent-activity", limit],
    queryFn: () => apiGet("/api/admin/recent-activity", { params: { limit } }),
  })
}
