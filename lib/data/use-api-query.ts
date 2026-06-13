/**
 * Base API Query Hook
 *
 * Wrapper quanh TanStack Query useQuery với integrated error handling
 * và tự động chuyển đổi giữa Mock/Real API
 */

import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { normalizeApiError } from "@/lib/api/client"

/**
 * Options cho useApiQuery
 * Mở rộng từ UseQueryOptions của TanStack Query
 */
export interface UseApiQueryOptions<TData, TError>
  extends Omit<UseQueryOptions<TData, TError>, "queryFn"> {
  /**
   * Query function gọi API
   */
  queryFn: () => Promise<TData>
  /**
   * Key cho query cache - required
   */
  queryKey: UseQueryOptions<TData, TError>["queryKey"]
}

/**
 * Hook wrapper cho useQuery với error handling chuẩn hóa
 *
 * @example
 * ```ts
 * const { data, isLoading, error } = useApiQuery({
 *   queryKey: ["products"],
 *   queryFn: () => apiGet("/api/products")
 * })
 * ```
 */
export function useApiQuery<TData, TError = Error>({
  queryKey,
  queryFn,
  ...options
}: UseApiQueryOptions<TData, TError>) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        return await queryFn()
      } catch (err) {
        // Normalize error to ensure consistent error format
        throw normalizeApiError(err)
      }
    },
    ...options,
  })
}

/**
 * Hook useApiQuerySuspense - cho Server Components với Suspense
 */
export function useApiQuerySuspense<TData, TError = Error>({
  queryKey,
  queryFn,
  ...options
}: UseApiQueryOptions<TData, TError>) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        return await queryFn()
      } catch (err) {
        throw normalizeApiError(err)
      }
    },
    ...options,
  })
}

export default useApiQuery
