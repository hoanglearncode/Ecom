/**
 * Cart Repository
 *
 * Repository layer cho shopping cart data
 * Abstracts API calls và cung cấp methods rõ ràng
 */

import { apiGet, apiPost, apiDelete } from "@/lib/api/client";
import type { CartItem, CartResponse, UpdateCartInput } from "@/lib/api/endpoints/cart";

// ─── Repository Interface ───────────────────────────────────────────────────────

export interface CartRepository {
  get(cartId?: string): Promise<CartResponse>;
  update(data: UpdateCartInput, cartId?: string): Promise<CartResponse>;
  clear(cartId?: string): Promise<CartResponse>;
  applyCoupon(code: string, cartId?: string): Promise<CartResponse>;
  removeCoupon(cartId?: string): Promise<CartResponse>;
  addItem(item: CartItem, cartId?: string): Promise<CartResponse>;
  updateItem(productId: string, quantity: number, cartId?: string): Promise<CartResponse>;
  removeItem(productId: string, cartId?: string): Promise<CartResponse>;
}

// ─── Implementation ──────────────────────────────────────────────────────────────

class CartRepositoryImpl implements CartRepository {
  /**
   * Get cart
   */
  async get(cartId?: string): Promise<CartResponse> {
    const url = cartId ? `/api/carts/${cartId}` : "/api/cart";
    return apiGet<CartResponse>(url);
  }

  /**
   * Update cart (add/update/remove items)
   */
  async update(data: UpdateCartInput, cartId?: string): Promise<CartResponse> {
    const url = cartId ? `/api/carts/${cartId}` : "/api/cart";
    return apiPost<CartResponse, UpdateCartInput>(url, data);
  }

  /**
   * Clear cart
   */
  async clear(cartId?: string): Promise<CartResponse> {
    const url = cartId ? `/api/carts/${cartId}/clear` : "/api/cart/clear";
    return apiPost<CartResponse, unknown>(url, {});
  }

  /**
   * Apply coupon
   */
  async applyCoupon(code: string, cartId?: string): Promise<CartResponse> {
    const url = cartId ? `/api/carts/${cartId}/coupon` : "/api/cart/coupon";
    return apiPost<CartResponse, { code: string }>(url, { code });
  }

  /**
   * Remove coupon
   */
  async removeCoupon(cartId?: string): Promise<CartResponse> {
    const url = cartId ? `/api/carts/${cartId}/coupon` : "/api/cart/coupon";
    return apiDelete<CartResponse>(url);
  }

  /**
   * Add item to cart
   */
  async addItem(item: CartItem, cartId?: string): Promise<CartResponse> {
    return this.update({ items: [item] }, cartId);
  }

  /**
   * Update item quantity
   */
  async updateItem(productId: string, quantity: number, cartId?: string): Promise<CartResponse> {
    return this.update({ items: [{ productId, quantity }] }, cartId);
  }

  /**
   * Remove item from cart
   */
  async removeItem(productId: string, cartId?: string): Promise<CartResponse> {
    return this.update({ items: [{ productId, quantity: 0 }] }, cartId);
  }
}

// ─── Export singleton ───────────────────────────────────────────────────────────

export const cartRepository = new CartRepositoryImpl();

// ─── Type exports ───────────────────────────────────────────────────────────────

// export type { CartRepository };
