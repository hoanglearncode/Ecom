/**
 * Central API Configuration
 *
 * Cấu hình trung tâm cho API client, hỗ trợ chuyển đổi giữa Mock và Real API
 * thông qua environment variable: NEXT_PUBLIC_API_MODE
 */

export type ApiMode = "mock" | "real"

/**
 * Lấy chế độ API từ environment variable
 * Mặc định là 'mock' nếu không có cấu hình
 */
export function getApiMode(): ApiMode {
  const mode = process.env.NEXT_PUBLIC_API_MODE
  return mode === "real" ? "real" : "mock"
}

/**
 * Kiểm tra có đang sử dụng Mock API không
 */
export function isMockApiEnabled(): boolean {
  return getApiMode() === "mock"
}

/**
 * Kiểm tra có đang sử dụng Real API không
 */
export function isRealApiEnabled(): boolean {
  return getApiMode() === "real"
}

/**
 * Lấy base URL cho API
 * Real API: sử dụng NEXT_PUBLIC_API_BASE_URL hoặc default
 * Mock API: base URL không quan trọng
 */
export function getApiBaseUrl(): string {
  if (isMockApiEnabled()) {
    return "" // Mock API không cần base URL
  }

  return process.env.NEXT_PUBLIC_API_BASE_URL || ""
}

/**
 * Lấy timeout cho request (milliseconds)
 */
export function getApiTimeout(): number {
  return Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? 15000)
}

/**
 * API Configuration object
 * Export tất cả cấu hình ở một place để dễ sử dụng
 */
export const apiConfig = {
  mode: getApiMode(),
  isMock: isMockApiEnabled(),
  isReal: isRealApiEnabled(),
  baseUrl: getApiBaseUrl(),
  timeout: getApiTimeout(),
} as const

/**
 * Helper để tạo URL đầy đủ cho endpoint
 * @param endpoint - API endpoint (ví dụ: "/api/products")
 * @returns Full URL
 */
export function getApiUrl(endpoint: string): string {
  const baseUrl = getApiBaseUrl()
  // Nếu endpoint đã có http(s):// thì return as-is
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint
  }

  // Join baseUrl và endpoint, avoid double slash
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl

  return `${cleanBaseUrl}${cleanEndpoint}`
}

/**
 * Debug helper - log API mode in development
 */
if (process.env.NODE_ENV === "development") {
  console.log(
    `[API Config] Mode: ${apiConfig.mode.toUpperCase()}, Base URL: ${apiConfig.baseUrl || "(mock)"}`
  )
}
