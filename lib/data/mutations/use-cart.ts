/**
 * Cart Mutation Hooks
 *
 * Centralized hooks cho cart mutations (add, update, remove items)
 */

import { useApiQuery } from "../use-api-query"
import { useApiMutation } from "../use-api-mutation"
import type { MockCart, MockCartItem } from "@/lib/api/mock-store/types"
import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from "@/lib/api/client"

/**
 * Hook để lấy current cart
 */
export function useCart() {
  return useApiQuery<MockCart>({
    queryKey: ["cart"],
    queryFn: () => apiGet<MockCart>("/api/cart"),
  })
}

/**
 * Hook để add item vào cart
 */
export function useAddToCart() {
  return useApiMutation<MockCart, Error, { productId: string; quantity?: number }>({
    mutationFn: ({ productId, quantity = 1 }) =>
      apiPost<MockCart, { productId: string; quantity: number }>("/api/cart/items", { productId, quantity }),
    invalidateQueries: [["cart"]],
  })
}

/**
 * Hook để update cart item quantity
 */
export function useUpdateCartItem() {
  return useApiMutation<MockCart, Error, { productId: string; quantity: number }>({
    mutationFn: ({ productId, quantity }) =>
      apiPut<MockCart, { quantity: number }>(
        `/api/cart/items/${encodeURIComponent(productId)}`,
        { quantity },
      ),
    invalidateQueries: [["cart"]],
  })
}

/**
 * Hook để remove item khỏi cart
 */
export function useRemoveFromCart() {
  return useApiMutation<MockCart, Error, string>({
    mutationFn: (productId) => apiDelete<MockCart>(`/api/cart/items/${encodeURIComponent(productId)}`),
    invalidateQueries: [["cart"]],
  })
}

/**
 * Hook để clear toàn bộ cart
 */
export function useClearCart() {
  return useApiMutation<MockCart, Error, void>({
    mutationFn: () => apiDelete<MockCart>("/api/cart"),
    invalidateQueries: [["cart"]],
  })
}

/**
 * Hook để merge cart với server cart
 * Useful sau khi login
 */
export function useMergeCart() {
  return useApiMutation<MockCart, Error, MockCartItem[]>({
    mutationFn: (items) => apiPost<MockCart, MockCartItem[]>("/api/cart/merge", items),
    invalidateQueries: [["cart"]],
  })
}

/**
 * Hook để apply coupon code
 */
export function useApplyCoupon() {
  return useApiMutation<MockCart, Error, string>({
    mutationFn: (code) => apiPost<MockCart, { code: string }>("/api/cart/coupon", { code }),
    invalidateQueries: [["cart"]],
  })
}

/**
 * Hook để remove coupon code
 */
export function useRemoveCoupon() {
  return useApiMutation<MockCart, Error, void>({
    mutationFn: () => apiDelete<MockCart>("/api/cart/coupon"),
    invalidateQueries: [["cart"]],
  })
}

/**
 * Hook để update shipping method
 */
export function useUpdateShippingMethod() {
  return useApiMutation<MockCart, Error, string>({
    mutationFn: (method) => apiPut<MockCart, { method: string }>("/api/cart/shipping", { method }),
    invalidateQueries: [["cart"]],
  })
}

/**
 * Hook để get cart summary (totals, discount, shipping)
 */
export function useCartSummary() {
  return useApiQuery<{
    subtotal: number
    discount: number
    shipping: number
    total: number
  }>({
    queryKey: ["cart", "summary"],
    queryFn: () => apiGet("/api/cart/summary"),
  })
}

/**
 * Hook để validate cart trước checkout
 */
export function useValidateCart() {
  return useApiQuery<{
    valid: boolean
    errors: Array<{ productId: string; message: string }>
  }>({
    queryKey: ["cart", "validate"],
    queryFn: () => apiGet("/api/cart/validate"),
  })
}
