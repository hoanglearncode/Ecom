/**
 * Mock API Index
 *
 * Main entry point cho mock API system
 * Setup all mock handlers và export main handler function
 */

import type { AxiosRequestConfig } from "axios";
import type { ApiResponse } from "../types";
import { mockRouter } from "./router";
import { simulateDelay } from "./utils";
import { registerAnalyticsHandlers } from "./handlers/analytics";
// Import other handlers when ready:
// import { registerProductsHandlers } from "./handlers/products";
// import { registerOrdersHandlers } from "./handlers/orders";
// etc.

// ─── Register All Handlers ───────────────────────────────────────────────────────

function registerAllHandlers(): void {
  // Register analytics handlers
  registerAnalyticsHandlers(mockRouter);

  // TODO: Register other handlers
  // registerProductsHandlers(mockRouter);
  // registerOrdersHandlers(mockRouter);
  // registerCategoriesHandlers(mockRouter);
  // registerCustomersHandlers(mockRouter);
  // registerCartHandlers(mockRouter);
  // registerBrandsHandlers(mockRouter);
  // registerAdminHandlers(mockRouter);

  // Legacy fallback - import from old mock-data.ts for now
  registerLegacyHandlers();
}

// ─── Legacy Fallback ───────────────────────────────────────────────────────────

function registerLegacyHandlers() {
  // For now, we'll still use the old mock-data.ts as fallback
  // This will be removed once all handlers are migrated
  const { mockApiResponse: legacyMockHandler } = require("../mock-data");

  // Register a catch-all handler that uses the legacy system
  mockRouter.get(/^\/api\/.*/, (config: AxiosRequestConfig) => {
    return legacyMockHandler(config);
  });
  mockRouter.post(/^\/api\/.*/, (config: AxiosRequestConfig) => {
    return legacyMockHandler(config);
  });
  mockRouter.put(/^\/api\/.*/, (config: AxiosRequestConfig) => {
    return legacyMockHandler(config);
  });
  mockRouter.patch(/^\/api\/.*/, (config: AxiosRequestConfig) => {
    return legacyMockHandler(config);
  });
  mockRouter.delete(/^\/api\/.*/, (config: AxiosRequestConfig) => {
    return legacyMockHandler(config);
  });
}

// ─── Initialize ─────────────────────────────────────────────────────────────────

let initialized = false;

function ensureInitialized(): void {
  if (!initialized) {
    registerAllHandlers();
    initialized = true;
  }
}

// ─── Main Mock Handler ──────────────────────────────────────────────────────────

/**
 * Main entry point cho mock API requests
 * Called by apiClient when mock mode is enabled
 */
export async function mockApiResponse<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
  await simulateDelay();
  ensureInitialized();

  try {
    return await mockRouter.handle<T>(config);
  } catch (error) {
    // If router didn't handle it, return a proper error response
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Mock API error: ${String(error)}`);
  }
}

// ─── Re-export utilities ───────────────────────────────────────────────────────

export * from "./router";
export * from "./utils";
