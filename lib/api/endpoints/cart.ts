/**
 * Cart API Endpoints
 *
 * Định nghĩa tất cả endpoints liên quan đến shopping cart
 */

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price?: number;
}

export interface CartResponse {
  id: string;
  items: Array<{
    productId: string;
    variantId?: string;
    name: string;
    image?: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
  coupon?: {
    code: string;
    discount: number;
  };
  updatedAt: string;
}

export interface UpdateCartInput {
  items?: CartItem[];
  couponCode?: string;
  clear?: boolean;
}

export const CART_ENDPOINTS = {
  // Get cart
  get: (cartId?: string) => ({
    url: cartId ? `/api/carts/${cartId}` : "/api/cart" as const,
    method: "GET" as const,
  }),

  // Update cart (add/update/remove items)
  update: (data: UpdateCartInput, cartId?: string) => ({
    url: cartId ? `/api/carts/${cartId}` : "/api/cart" as const,
    method: "POST" as const,
    body: data,
  }),

  // Clear cart
  clear: (cartId?: string) => ({
    url: cartId ? `/api/carts/${cartId}/clear` : "/api/cart/clear" as const,
    method: "POST" as const,
  }),

  // Apply coupon
  applyCoupon: (code: string, cartId?: string) => ({
    url: cartId ? `/api/carts/${cartId}/coupon` : "/api/cart/coupon" as const,
    method: "POST" as const,
    body: { code },
  }),

  // Remove coupon
  removeCoupon: (cartId?: string) => ({
    url: cartId ? `/api/carts/${cartId}/coupon` : "/api/cart/coupon" as const,
    method: "DELETE" as const,
  }),
} as const;

export type CartEndpoint = typeof CART_ENDPOINTS;
