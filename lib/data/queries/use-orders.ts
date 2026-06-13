/**
 * Order Data Hooks
 *
 * Centralized hooks cho fetching và manipulating order data
 */

import { useApiQuery } from "../use-api-query"
import { useApiMutation as useMutation } from "../use-api-mutation"
import type { MockOrder } from "@/lib/api/mock-store/types"
import type { OrderStatus } from "@/lib/api/orders"
import { apiGet, apiPatch, apiPost } from "@/lib/api/client"
import { getOrderStats } from "@/lib/api/mock-store/orders-enhanced"

/**
 * Hook để lấy danh sách tất cả orders
 */
export function useOrders() {
  return useApiQuery<MockOrder[]>({
    queryKey: ["orders"],
    queryFn: () => apiGet<MockOrder[]>("/api/orders"),
  })
}

/**
 * Hook để lấy orders với filter
 */
export function useOrdersFilter(params: { status?: OrderStatus; search?: string }) {
  return useApiQuery<MockOrder[]>({
    queryKey: ["orders", "filter", params],
    queryFn: () => apiGet<MockOrder[]>("/api/orders", { params }),
  })
}

/**
 * Hook để lấy chi tiết một order
 */
export function useOrder(id: string) {
  return useApiQuery<MockOrder>({
    queryKey: ["order", id],
    queryFn: () => apiGet<MockOrder>(`/api/orders/${id}`),
    enabled: !!id,
  })
}

/**
 * Hook để lấy order statistics
 * Returns: pending, paid, processing, shipped, completed counts
 */
export function useOrderStats() {
  return useApiQuery<ReturnType<typeof getOrderStats>>({
    queryKey: ["orders", "stats"],
    queryFn: () => Promise.resolve(getOrderStats()),
  })
}

/**
 * Hook để lấy orders của customer hiện tại
 */
export function useMyOrders() {
  return useApiQuery<MockOrder[]>({
    queryKey: ["orders", "mine"],
    queryFn: () => apiGet<MockOrder[]>("/api/orders/me"),
  })
}

/**
 * Hook để update order status (Admin only)
 */
export function useUpdateOrderStatus() {
  return useMutation<MockOrder, Error, { id: string; status: OrderStatus }>({
    mutationFn: ({ id, status }) => apiPatch<MockOrder>(`/api/orders/${id}/status`, { status }),
    invalidateQueries: [["orders"], ["order"], ["orders", "stats"]],
  })
}

/**
 * Hook để fulfill order - mark as shipped (Admin only)
 */
export function useFulfillOrder() {
  return useMutation<MockOrder, Error, { id: string; trackingNumber?: string }>({
    mutationFn: ({ id, trackingNumber }) => apiPost<MockOrder>(`/api/orders/${id}/fulfill`, { trackingNumber }),
    invalidateQueries: [["orders"], ["order"]],
  })
}

/**
 * Hook để refund order (Admin only)
 */
export function useRefundOrder() {
  return useMutation<MockOrder, Error, string>({
    mutationFn: (id) => apiPost<MockOrder>(`/api/orders/${id}/refund`, {}),
    invalidateQueries: [["orders"], ["order"]],
  })
}

/**
 * Hook để add tracking number (Admin only)
 */
export function useAddTrackingNumber() {
  return useMutation<MockOrder, Error, { id: string; trackingNumber: string }>({
    mutationFn: ({ id, trackingNumber }) => apiPatch<MockOrder>(`/api/orders/${id}`, { trackingNumber }),
    invalidateQueries: [["orders"], ["order"]],
  })
}

/**
 * Hook để cancel order (Customer)
 */
export function useCancelOrder() {
  return useMutation<MockOrder, Error, string>({
    mutationFn: (id) => apiPost<MockOrder>(`/api/orders/${id}/cancel`, {}),
    invalidateQueries: [["orders"], ["order"]],
  })
}

/**
 * Hook để tạo order mới (Checkout)
 */
export function useCreateOrder() {
  return useMutation<MockOrder, Error, { items: Array<{ productId: string; quantity: number }> }>({
    mutationFn: (data) => apiPost<MockOrder, typeof data>("/api/orders", data),
    invalidateQueries: [["orders"], ["orders", "mine"], ["cart"]],
  })
}

/**
 * Hook để get orders by status (Admin)
 */
export function useOrdersByStatus(status: OrderStatus) {
  return useApiQuery<MockOrder[]>({
    queryKey: ["orders", "status", status],
    queryFn: () => apiGet<MockOrder[]>("/api/orders", { params: { status } }),
    enabled: !!status,
  })
}

/**
 * Hook để search orders
 */
export function useOrderSearch(search: string) {
  return useApiQuery<MockOrder[]>({
    queryKey: ["orders", "search", search],
    queryFn: () => apiGet<MockOrder[]>("/api/orders", { params: { search } }),
    enabled: search.length > 2,
  })
}

/**
 * Hook để get open orders (not completed)
 */
export function useOpenOrders() {
  return useApiQuery<MockOrder[]>({
    queryKey: ["orders", "open"],
    queryFn: () => apiGet<MockOrder[]>("/api/orders/open"),
  })
}
