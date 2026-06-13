/**
 * Analytics API Endpoints
 *
 * Định nghĩa tất cả endpoints liên quan đến analytics/dashboard
 * Sẽ được dùng bởi cả mock và real API
 */

import type { TimeRange } from "@/components/dashboard/types";

// ─── Request Types ───────────────────────────────────────────────────────────────

export interface AnalyticsQuery {
  range?: TimeRange;
  startDate?: string;
  endDate?: string;
}

// ─── Response Types ──────────────────────────────────────────────────────────────

export interface AnalyticsMetricsResponse {
  metrics: Array<{
    title: string;
    value: string;
    rawValue: number;
    change: string;
    changeValue: number;
    trend: "up" | "down" | "neutral";
    icon: string;
    sub: string;
  }>;
  revenueData: Array<{
    month: string;
    revenue: number;
    orders: number;
    customers: number;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  topProducts: Array<{
    name: string;
    image?: string;
    sales: number;
    revenue: number;
    growth: number;
  }>;
  recentOrders: Array<{
    id: string;
    customer: string;
    total: number;
    status: "completed" | "processing" | "shipped" | "pending" | "cancelled";
    date: string;
  }>;
  customerSegments: Array<{
    segment: string;
    count: number;
    revenue: number;
    color: string;
  }>;
  dailyTraffic: Array<{
    day: string;
    visits: number;
    conversions: number;
  }>;
  conversionRate: number;
  avgOrderValue: number;
  returnRate: number;
}

// ─── Endpoint Definitions ─────────────────────────────────────────────────────────

export const ANALYTICS_ENDPOINTS = {
  // Get full analytics summary
  getAnalytics: (query: AnalyticsQuery = {}) => ({
    url: "/api/analytics" as const,
    method: "GET" as const,
    query,
  }),

  // Get quick stats for dashboard
  getQuickStats: () => ({
    url: "/api/analytics/quick-stats" as const,
    method: "GET" as const,
  }),

  // Get recent activity
  getRecentActivity: (limit = 10) => ({
    url: "/api/analytics/recent-activity" as const,
    method: "GET" as const,
    query: { limit },
  }),

  // Export analytics data
  exportAnalytics: (query: AnalyticsQuery) => ({
    url: "/api/analytics/export" as const,
    method: "POST" as const,
    body: query,
  }),
} as const;

// ─── Type Exports ─────────────────────────────────────────────────────────────────

export type AnalyticsEndpoint = typeof ANALYTICS_ENDPOINTS;
