/**
 * Mock Cart Data Store
 *
 * Centralized mock data cho shopping cart
 */

import { mockProducts } from "./products";

// ─── Types ───────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  quantity: number;
  price?: number;
}

export interface Coupon {
  code: string;
  discount: number;
}

export interface MockCart {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
  coupon?: Coupon;
  updatedAt: string;
}

// ─── Sample Cart ─────────────────────────────────────────────────────────────────

export const mockCart: MockCart = {
  id: "cart1",
  items: [
    {
      productId: "p1",
      quantity: 1,
      price: 34990000,
    },
    {
      productId: "p6",
      quantity: 2,
      price: 6990000,
    },
  ],
  subtotal: 48970000,
  shipping: 0,
  discount: 0,
  tax: 0,
  total: 48970000,
  coupon: undefined,
  updatedAt: new Date().toISOString(),
};

// ─── Helper Functions ───────────────────────────────────────────────────────────

/**
 * Get cart by ID
 */
export function getCartById(id: string): MockCart | undefined {
  if (id === "cart1") return mockCart;
  return undefined;
}

/**
 * Get current cart (singleton for demo)
 */
export function getCurrentCart(): MockCart {
  return mockCart;
}

/**
 * Calculate cart total from items
 */
export function calculateCartTotal(items: MockCart["items"]): number {
  return items.reduce((sum, item) => {
    const product = mockProducts.find((p) => p.id === item.productId);
    const price = item.price || product?.price || 0;
    return sum + price * item.quantity;
  }, 0);
}

/**
 * Get cart items with product details
 */
export function getCartItemsWithDetails(items: MockCart["items"]): Array<{
  productId: string;
  quantity: number;
  price: number;
  total: number;
  name: string;
  image?: string;
}> {
  return items.map((item) => {
    const product = mockProducts.find((p) => p.id === item.productId);
    return {
      productId: item.productId,
      quantity: item.quantity,
      price: item.price || product?.price || 0,
      total: (item.price || product?.price || 0) * item.quantity,
      name: product?.name || "Unknown Product",
      image: product?.images?.[0],
    };
  });
}

/**
 * Add item to cart
 */
export function addCartItem(productId: string, quantity = 1): MockCart {
  const existingItem = mockCart.items.find((i) => i.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    const product = mockProducts.find((p) => p.id === productId);
    mockCart.items.push({
      productId,
      quantity,
      price: product?.price || 0,
    });
  }

  mockCart.total = calculateCartTotal(mockCart.items);
  mockCart.subtotal = mockCart.total;
  mockCart.updatedAt = new Date().toISOString();

  return mockCart;
}

/**
 * Update cart item quantity
 */
export function updateCartItemQuantity(productId: string, quantity: number): MockCart {
  const itemIndex = mockCart.items.findIndex((i) => i.productId === productId);

  if (itemIndex >= 0) {
    if (quantity <= 0) {
      mockCart.items.splice(itemIndex, 1);
    } else {
      mockCart.items[itemIndex].quantity = quantity;
    }
  }

  mockCart.total = calculateCartTotal(mockCart.items);
  mockCart.subtotal = mockCart.total;
  mockCart.updatedAt = new Date().toISOString();

  return mockCart;
}

/**
 * Remove item from cart
 */
export function removeCartItem(productId: string): MockCart {
  mockCart.items = mockCart.items.filter((i) => i.productId !== productId);

  mockCart.total = calculateCartTotal(mockCart.items);
  mockCart.subtotal = mockCart.total;
  mockCart.updatedAt = new Date().toISOString();

  return mockCart;
}

/**
 * Clear cart
 */
export function clearCart(): MockCart {
  mockCart.items = [];
  mockCart.total = 0;
  mockCart.subtotal = 0;
  mockCart.shipping = 0;
  mockCart.discount = 0;
  mockCart.tax = 0;
  mockCart.coupon = undefined;
  mockCart.updatedAt = new Date().toISOString();

  return mockCart;
}

/**
 * Apply coupon to cart
 */
export function applyCoupon(code: string, discount = 0): MockCart {
  mockCart.coupon = {
    code,
    discount,
  };
  mockCart.discount = discount;
  mockCart.total = mockCart.subtotal - discount + mockCart.tax + mockCart.shipping;
  mockCart.updatedAt = new Date().toISOString();

  return mockCart;
}

/**
 * Remove coupon from cart
 */
export function removeCoupon(): MockCart {
  mockCart.coupon = undefined;
  mockCart.discount = 0;
  mockCart.total = mockCart.subtotal + mockCart.tax + mockCart.shipping;
  mockCart.updatedAt = new Date().toISOString();

  return mockCart;
}
