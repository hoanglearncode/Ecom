/**
 * Mock API Router
 *
 * Route-based mock handler system
 * Thay thế giant switch-case trong mock-data.ts
 *
 * Mỗi endpoint có handler riêng, dễ maintain
 */

import type { AxiosRequestConfig } from "axios";
import type { ApiResponse } from "../types";
import { getPath } from "./utils";

// ─── Route Handler Types ───────────────────────────────────────────────────────────

export type MockHandler<T = unknown> = (
  config: AxiosRequestConfig
) => Promise<ApiResponse<T>> | ApiResponse<T>;

export interface RouteEntry {
  pattern: RoutePattern;
  handler: MockHandler;
}

export type RoutePattern = {
  method: string;
  path: string | RegExp;
  match?: (path: string) => boolean;
};

// ─── Route Registry ──────────────────────────────────────────────────────────────

class MockRouter {
  private routes: RouteEntry[] = [];

  /**
   * Register a route handler
   */
  add<T>(method: string, path: string | RegExp, handler: MockHandler<T>): void {
    this.routes.push({
      pattern: { method, path },
      handler,
    });
  }

  /**
   * Register GET route
   */
  get<T>(path: string | RegExp, handler: MockHandler<T>): void {
    this.add("GET", path, handler);
  }

  /**
   * Register POST route
   */
  post<T>(path: string | RegExp, handler: MockHandler<T>): void {
    this.add("POST", path, handler);
  }

  /**
   * Register PUT route
   */
  put<T>(path: string | RegExp, handler: MockHandler<T>): void {
    this.add("PUT", path, handler);
  }

  /**
   * Register PATCH route
   */
  patch<T>(path: string | RegExp, handler: MockHandler<T>): void {
    this.add("PATCH", path, handler);
  }

  /**
   * Register DELETE route
   */
  delete<T>(path: string | RegExp, handler: MockHandler<T>): void {
    this.add("DELETE", path, handler);
  }

  /**
   * Match a request to a handler
   */
  match(config: AxiosRequestConfig): MockHandler<unknown> | null {
    const method = (config.method ?? "GET").toUpperCase();
    const path = getPath(config.url, config.baseURL);

    for (const { pattern, handler } of this.routes) {
      if (pattern.method !== method) continue;

      if (typeof pattern.path === "string") {
        if (pattern.path === path) return handler as MockHandler<unknown>;

        // Check for parameterized paths like /api/products/:id
        const patternParts = pattern.path.split("/");
        const pathParts = path.split("/");

        if (patternParts.length === pathParts.length) {
          let match = true;
          for (let i = 0; i < patternParts.length; i++) {
            const p = patternParts[i];
            if (p.startsWith(":")) continue; // Parameter matches anything
            if (p !== pathParts[i]) {
              match = false;
              break;
            }
          }
          if (match) return handler as MockHandler<unknown>;
        }
      } else if (pattern.path instanceof RegExp) {
        if (pattern.path.test(path)) return handler as MockHandler<unknown>;
      } else if (pattern.match) {
        if (pattern.match(path)) return handler as MockHandler<unknown>;
      }
    }

    return null;
  }

  /**
   * Handle a request
   */
  async handle<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const handler = this.match(config);

    if (!handler) {
      throw new Error(`No mock handler registered for ${config.method?.toUpperCase()} ${getPath(config.url, config.baseURL)}`);
    }

    return handler(config) as Promise<ApiResponse<T>>;
  }
}

// ─── Export singleton router ───────────────────────────────────────────────────────

export const mockRouter = new MockRouter();

// ─── Convenience function for registering routes ────────────────────────────────────

export const mockRoute = {
  get: <T>(path: string | RegExp, handler: MockHandler<T>) => mockRouter.get(path, handler),
  post: <T>(path: string | RegExp, handler: MockHandler<T>) => mockRouter.post(path, handler),
  put: <T>(path: string | RegExp, handler: MockHandler<T>) => mockRouter.put(path, handler),
  patch: <T>(path: string | RegExp, handler: MockHandler<T>) => mockRouter.patch(path, handler),
  delete: <T>(path: string | RegExp, handler: MockHandler<T>) => mockRouter.delete(path, handler),
};
