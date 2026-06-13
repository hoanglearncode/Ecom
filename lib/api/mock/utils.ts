/**
 * Mock API Utilities
 *
 * Shared utilities cho mock handlers
 */

import type { ApiResponse } from "../types";

// ─── Response Builders ───────────────────────────────────────────────────────────

export function makeResponse<T>(
  data: T,
  message?: string,
  meta?: Record<string, unknown>
): ApiResponse<T> {
  return { data, message, meta };
}

export function makeErrorResponse(
  message: string,
  statusCode = 400
): ApiResponse<never> {
  return {
    data: null as never,
    message,
    meta: { error: true, statusCode },
  };
}

// ─── Path Utilities ───────────────────────────────────────────────────────────────

export function toPath(url?: string, baseURL?: string): string {
  if (!url) return "/";

  if (/^https?:\/\//i.test(url)) {
    return new URL(url).pathname;
  }

  const joined = `${baseURL ?? ""}${url}`;
  try {
    return new URL(joined, "http://localhost").pathname;
  } catch {
    return url.startsWith("/") ? url : `/${url}`;
  }
}

export function getPath(url?: string, baseURL?: string): string {
  return toPath(url, baseURL);
}

// ─── ID Extraction ───────────────────────────────────────────────────────────────

export function getIdFromPath(pathname: string, prefix: string): string {
  const suffix = pathname.slice(prefix.length);
  return suffix.replace(/^\//, "").split("/")[0];
}

export function getParamsFromPath(pathname: string, pattern: string): Record<string, string> {
  const patternParts = pattern.split("/");
  const pathParts = pathname.split("/");

  const params: Record<string, string> = {};

  if (patternParts.length !== pathParts.length) return params;

  for (let i = 0; i < patternParts.length; i++) {
    const p = patternParts[i];
    if (p.startsWith(":")) {
      const paramName = p.slice(1);
      params[paramName] = pathParts[i];
    }
  }

  return params;
}

// ─── Deep Clone ───────────────────────────────────────────────────────────────────

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

// ─── Delay Simulation ───────────────────────────────────────────────────────────

export async function simulateDelay(): Promise<void> {
  const delayMs = Number(process.env.NEXT_PUBLIC_API_MOCK_DELAY_MS ?? 0);
  if (!delayMs) return;
  await new Promise((resolve) => setTimeout(resolve, delayMs));
}

// ─── Response Wrapper ───────────────────────────────────────────────────────────

export async function withDelay<T>(fn: () => T | Promise<T>): Promise<T> {
  await simulateDelay();
  return fn();
}
