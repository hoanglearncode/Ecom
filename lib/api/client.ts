import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { mockApiResponse } from "./mock-data";

export type ApiResponse<T> = {
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
};

export type ApiErrorBody = {
  message?: string;
  error?: string;
  statusCode?: number;
  details?: unknown;
};

export class ApiRequestError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status = 0, code?: string, details?: unknown) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const isMockApi =  true// process.env.NEXT_PUBLIC_USE_MOCK_API === "true";
const requestTimeout = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? 15000);

let inMemoryToken: string | null = null;

function canUseBrowserStorage() {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

function readStoredToken() {
  if (!canUseBrowserStorage()) return null;
  return window.localStorage.getItem("access_token");
}

function writeStoredToken(token: string | null) {
  if (!canUseBrowserStorage()) return;
  if (token) {
    window.localStorage.setItem("access_token", token);
  } else {
    window.localStorage.removeItem("access_token");
  }
}

function resolveAuthToken() {
  return inMemoryToken ?? readStoredToken();
}

function normalizeApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorBody>;
    const status = axiosError.response?.status ?? 0;
    const body = axiosError.response?.data;
    const message =
      body?.message || body?.error || axiosError.message || "Request failed";

    return new ApiRequestError(
      message,
      status,
      axiosError.code,
      body?.details ?? body,
    );
  }

  if (error instanceof Error) {
    return new ApiRequestError(error.message);
  }

  return new ApiRequestError("Unknown API error");
}

function applyResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
  const payload = response.data;
  return (payload?.data ?? payload) as T;
}

const headers = isMockApi ? { "x-api-mode": "mock" } : undefined;

const apiClient: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: requestTimeout,
  headers,
  withCredentials: true,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = resolveAuthToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (isMockApi) {
    config.headers = config.headers ?? {};
    config.headers["x-use-mock"] = "true";
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeApiError(error)),
);

export function setApiAuthToken(token: string | null) {
  inMemoryToken = token;
  writeStoredToken(token);
}

export function getApiAuthToken() {
  return resolveAuthToken();
}

export function clearApiAuthToken() {
  setApiAuthToken(null);
}

export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    if (isMockApi) {
      const response = await mockApiResponse<T>(config);
      return applyResponse({ data: response } as AxiosResponse<ApiResponse<T>>);
    }

    const response = await apiClient.request<ApiResponse<T>>(config);
    return applyResponse(response);
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function apiGet<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  return apiRequest<T>({ ...config, method: "GET", url });
}

export async function apiPost<T, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig,
): Promise<T> {
  return apiRequest<T>({ ...config, method: "POST", url, data: body });
}

export async function apiPut<T, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig,
): Promise<T> {
  return apiRequest<T>({ ...config, method: "PUT", url, data: body });
}

export async function apiPatch<T, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig,
): Promise<T> {
  return apiRequest<T>({ ...config, method: "PATCH", url, data: body });
}

export async function apiDelete<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  return apiRequest<T>({ ...config, method: "DELETE", url });
}

export function isMockApiEnabled() {
  return isMockApi;
}

export function getApiBaseUrl() {
  return apiBaseUrl;
}

export default apiClient;
