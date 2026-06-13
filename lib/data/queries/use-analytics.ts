/**
 * Analytics Data Hooks (Updated)
 *
 * Sử dụng repository pattern thay vì gọi API trực tiếp
 * Tất cả data flow đi qua repository layer
 */

import { useApiQuery } from "../use-api-query"
import { analyticsRepository } from "../repositories/analytics"
import type { TimeRange } from "@/components/dashboard/types"

/**
 * Hook để lấy full analytics summary
 *
 * @example
 * ```ts
 * const { data, isLoading } = useAnalytics({ range: "30d" })
 * ```
 */
export function useAnalytics(params?: { range?: TimeRange }) {
  return useApiQuery({
    queryKey: ["analytics", params?.range],
    queryFn: () => analyticsRepository.getAnalytics(params),
    staleTime: 60_000, // 1 minute
  })
}

/**
 * Hook để lấy quick stats cho dashboard
 */
export function useQuickStats() {
  return useApiQuery({
    queryKey: ["analytics", "quick-stats"],
    queryFn: () => analyticsRepository.getQuickStats(),
    staleTime: 60_000,
  })
}

/**
 * Hook để lấy recent activity
 */
export function useRecentActivity(limit = 10) {
  return useApiQuery({
    queryKey: ["analytics", "recent-activity", limit],
    queryFn: () => analyticsRepository.getRecentActivity(limit),
    staleTime: 30_000, // 30 seconds
  })
}

/**
 * Hook để lấy metrics theo time range
 */
export function useAnalyticsByTimeRange(range: TimeRange = "30d") {
  return useApiQuery({
    queryKey: ["analytics", "metrics", range],
    queryFn: () => analyticsRepository.getAnalytics({ range }),
    staleTime: 60_000,
  })
}
