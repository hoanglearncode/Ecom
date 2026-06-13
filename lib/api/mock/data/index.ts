/**
 * Mock Data Index
 *
 * Central export của tất cả mock data stores
 * Tất cả dữ liệu đến từ lib/db — single source of truth
 */

import { mockProducts } from "./products";
import { mockCategories } from "./categories";
import { mockBrands } from "./brands";
import { mockOrders } from "./orders";
import { mockCustomers } from "./customers";
import { mockCart } from "./cart";

export * from "./products";
export * from "./categories";
export * from "./brands";
export * from "./orders";
export * from "./customers";
export * from "./cart";

export const mockDatabase = {
  products: mockProducts,
  categories: mockCategories,
  brands: mockBrands,
  orders: mockOrders,
  customers: mockCustomers,
  cart: mockCart,
} as const;

export default mockDatabase;
