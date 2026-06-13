/**
 * Unified Data Layer
 *
 * Centralized data fetching với hooks
 * Tất cả data should come through these hooks
 */

// Base hooks
export { useApiQuery, useApiQuerySuspense } from "./use-api-query"
export { useApiMutation } from "./use-api-mutation"

// Queries
export * from "./queries/use-products"
export * from "./queries/use-orders"
export * from "./queries/use-categories"
export * from "./queries/use-customers"
export * from "./queries/use-admin"
export * from "./queries/use-analytics"

// Mutations
export * from "./mutations/use-cart"

// Repositories
export { repositories } from "./repositories"
export * from "./repositories/analytics"
export * from "./repositories/products"
export * from "./repositories/orders"
export * from "./repositories/categories"
export * from "./repositories/customers"
export * from "./repositories/cart"
export * from "./repositories/brands"
export * from "./repositories/admin"
