/**
 * Customer Data Hooks
 *
 * Centralized hooks cho fetching và manipulating customer data
 */

import { useApiQuery } from "../use-api-query"
import { useApiMutation as useMutation } from "../use-api-mutation"
import type { MockCustomer } from "@/lib/api/mock-store/types"
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/client"

/**
 * Hook để lấy danh sách tất cả customers (Admin only)
 */
export function useCustomers() {
  return useApiQuery<MockCustomer[]>({
    queryKey: ["customers"],
    queryFn: () => apiGet<MockCustomer[]>("/api/customers"),
  })
}

/**
 * Hook để lấy customers với pagination
 */
export function useCustomersPaginated(params: { page?: number; limit?: number }) {
  return useApiQuery<{
    items: MockCustomer[]
    total: number
    page: number
    limit: number
  }>({
    queryKey: ["customers", "paginated", params],
    queryFn: () => apiGet("/api/customers/paginated", { params }),
  })
}

/**
 * Hook để lấy chi tiết một customer
 */
export function useCustomer(id: string) {
  return useApiQuery<MockCustomer>({
    queryKey: ["customer", id],
    queryFn: () => apiGet<MockCustomer>(`/api/customers/${id}`),
    enabled: !!id,
  })
}

/**
 * Hook để search customers
 */
export function useCustomerSearch(search: string) {
  return useApiQuery<MockCustomer[]>({
    queryKey: ["customers", "search", search],
    queryFn: () => apiGet<MockCustomer[]>("/api/customers", { params: { search } }),
    enabled: search.length > 2,
  })
}

/**
 * Hook để tạo customer mới (Admin only)
 */
export function useCreateCustomer() {
  return useMutation<MockCustomer, Error, Omit<MockCustomer, "id">>({
    mutationFn: (data) => apiPost<MockCustomer, Omit<MockCustomer, "id">>("/api/customers", data),
    invalidateQueries: [["customers"], ["customer"]],
  })
}

/**
 * Hook để update customer (Admin only)
 */
export function useUpdateCustomer() {
  return useMutation<MockCustomer, Error, { id: string; data: Partial<MockCustomer> }>({
    mutationFn: ({ id, data }) => apiPut<MockCustomer, Partial<MockCustomer>>(`/api/customers/${id}`, data),
    invalidateQueries: [["customers"], ["customer"]],
  })
}

/**
 * Hook để xóa customer (Admin only)
 */
export function useDeleteCustomer() {
  return useMutation<MockCustomer, Error, string>({
    mutationFn: (id) => apiDelete<MockCustomer>(`/api/customers/${id}`),
    invalidateQueries: [["customers"]],
  })
}

/**
 * Hook để get customer orders
 */
export function useCustomerOrders(customerId: string) {
  return useApiQuery<any[]>({
    queryKey: ["customer", customerId, "orders"],
    queryFn: () => apiGet<any[]>(`/api/customers/${customerId}/orders`),
    enabled: !!customerId,
  })
}

/**
 * Hook để get customer statistics (Admin)
 */
export function useCustomerStats() {
  return useApiQuery<{
    total: number
    active: number
    new: number // within 30 days
  }>({
    queryKey: ["customers", "stats"],
    queryFn: () => apiGet("/api/customers/stats"),
  })
}

/**
 * Hook để get current logged-in customer profile
 */
export function useMyProfile() {
  return useApiQuery<MockCustomer>({
    queryKey: ["customer", "me"],
    queryFn: () => apiGet<MockCustomer>("/api/customers/me"),
  })
}

/**
 * Hook để update own profile
 */
export function useUpdateMyProfile() {
  return useMutation<MockCustomer, Error, Partial<MockCustomer>>({
    mutationFn: (data) => apiPut<MockCustomer, Partial<MockCustomer>>("/api/customers/me", data),
    invalidateQueries: [["customer", "me"]],
  })
}
