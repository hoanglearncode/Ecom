/**
 * Analytics Repository
 *
 * Repository layer cho analytics/dashboard data
 * Abstracts API calls và cung cấp methods rõ ràng
 */

import { apiGet, apiPost } from "@/lib/api/client";
import type { TimeRange } from "@/components/dashboard/types";
import type {
  AnalyticsQuery,
  AnalyticsMetricsResponse,
} from "@/lib/api/endpoints/analytics";

// ─── Repository Interface ───────────────────────────────────────────────────────

export interface AnalyticsRepository {
  getAnalytics(query?: AnalyticsQuery): Promise<AnalyticsMetricsResponse>;
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
}

// ─── Implementation ──────────────────────────────────────────────────────────────

class AnalyticsRepositoryImpl implements AnalyticsRepository {
  /**
   * Get full analytics summary
   */
  async getAnalytics(query: AnalyticsQuery = {}): Promise<AnalyticsMetricsResponse> {
    const params: Record<string, string> = {};
    if (query.range) params.range = query.range;
    if (query.startDate) params.startDate = query.startDate;
    if (query.endDate) params.endDate = query.endDate;

    return apiGet<AnalyticsMetricsResponse>("/api/analytics", { params });
  }

  /**
   * Get quick stats for dashboard
   */
  async getQuickStats(): Promise<{
    revenue: string;
    orders: string;
    customers: string;
    products: string;
  }> {
    return apiGet("/api/analytics/quick-stats");
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(limit = 10): Promise<
    Array<{
      id: string;
      type: string;
      title: string;
      detail: string;
      time: string;
    }>
  > {
    return apiGet("/api/analytics/recent-activity", { params: { limit } });
  }
}

// ─── Export singleton ───────────────────────────────────────────────────────────

export const analyticsRepository = new AnalyticsRepositoryImpl();
