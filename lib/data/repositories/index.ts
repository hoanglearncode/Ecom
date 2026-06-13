/**
 * Data Repositories Index
 *
 * Central export của tất cả repositories
 * Repository layer abstracts API calls và cung cấp interface rõ ràng
 *
 * Usage:
 * ```ts
 * import { analyticsRepository } from "@/lib/data/repositories"
 *
 * const analytics = await analyticsRepository.getAnalytics({ range: "30d" })
 * ```
 */

export * from "./analytics";
export * from "./products";
export * from "./orders";
export * from "./categories";
export * from "./customers";
export * from "./cart";
export * from "./brands";
export * from "./admin";

// ─── Default export (single object) ───────────────────────────────────────────────

import {
  analyticsRepository,
  productsRepository,
  ordersRepository,
  categoriesRepository,
  customersRepository,
  cartRepository,
  brandsRepository,
  adminRepository,
} from "./";

export const repositories = {
  analytics: analyticsRepository,
  products: productsRepository,
  orders: ordersRepository,
  categories: categoriesRepository,
  customers: customersRepository,
  cart: cartRepository,
  brands: brandsRepository,
  admin: adminRepository,
} as const;

export default repositories;
