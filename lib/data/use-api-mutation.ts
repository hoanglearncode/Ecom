/**
 * Base API Mutation Hook
 *
 * Wrapper quanh TanStack Query useMutation với integrated error handling
 */

import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query"
import { normalizeApiError } from "@/lib/api/client"

/**
 * Options cho useApiMutation
 * Mở rộng từ UseMutationOptions của TanStack Query
 */
export interface UseApiMutationOptions<TData, TError, TVariables>
  extends Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn"> {
  /**
   * Mutation function gọi API
   */
  mutationFn: (variables: TVariables) => Promise<TData>
  /**
   * Key để invalidate related queries sau mutation
   */
  invalidateQueries?: string[][]
}

/**
 * Hook wrapper cho useMutation với error handling chuẩn hóa
 * và tự động invalidate related queries
 *
 * @example
 * ```ts
 * const { mutate, isLoading } = useApiMutation({
 *   mutationFn: (data) => apiPost("/api/products", data),
 *   invalidateQueries: [["products"]]
 * })
 * ```
 */
export function useApiMutation<TData, TError = Error, TVariables = void>({
  mutationFn,
  invalidateQueries,
  onSuccess,
  ...options
}: UseApiMutationOptions<TData, TError, TVariables>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      try {
        return await mutationFn(variables)
      } catch (err) {
        throw normalizeApiError(err)
      }
    },
    onSuccess: (...args) => {
      const [data, variables, context] = args

      // Invalidate related queries
      if (invalidateQueries) {
        invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey })
        })
      }

      // Call original onSuccess with all arguments
      if (onSuccess) {
        onSuccess(data, variables, context, args[3] as any)
      }
    },
    ...options,
  })
}

export default useApiMutation
