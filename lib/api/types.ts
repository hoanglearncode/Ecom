/**
 * Shared API Types
 *
 * Type definitions dùng chung cho cả Mock và Real API
 */

/**
 * Standard API Response format
 */
export type ApiResponse<T> = {
  data: T
  message?: string
  meta?: ApiMeta
}

/**
 * API Meta information (pagination, etc)
 */
export type ApiMeta = {
  page?: number
  limit?: number
  total?: number
  totalPages?: number
  hasMore?: boolean
  [key: string]: unknown
}

/**
 * API Error format
 */
export type ApiError = {
  message?: string
  error?: string
  statusCode?: number
  code?: string
  details?: unknown
}

/**
 * Query parameters cho list requests
 */
export type ListQueryParams = {
  page?: number
  limit?: number
  search?: string
  sort?: string
  order?: "asc" | "desc"
  [key: string]: unknown
}

/**
 * Query parameters cho filter requests
 */
export type FilterQueryParams = ListQueryParams & {
  filters?: Record<string, unknown>
}

/**
 * Response format cho list requests
 */
export type ListResponse<T> = {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Mutation result (create, update, delete)
 */
export type MutationResult<T> = {
  success: boolean
  data?: T
  error?: string
}

/**
 * Batch operation result
 */
export type BatchResult<T> = {
  success: number
  failed: number
  results: Array<{
    item: T
    success: boolean
    error?: string
  }>
}
