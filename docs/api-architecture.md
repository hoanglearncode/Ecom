# API Architecture - Hệ thống Data Layer Thống Nhất

## Overview

Hệ thống data layer mới được thiết kế để:
1. **Mock data có cấu trúc giống y hệt real API** - Dễ chuyển đổi
2. **Data không bị phân tán** - Tất cả đi qua repository layer
3. **Type-safe** - Endpoints, repositories, và hooks đều có types
4. **Dễ maintain** - Route-based mock handlers thay vì giant switch-case

## Cấu trúc

```
lib/
├── api/
│   ├── client.ts           # API client (giữ nguyên)
│   ├── config.ts           # API configuration (giữ nguyên)
│   ├── types.ts            # Shared API types (giữ nguyên)
│   ├── endpoints/          # ✨ NEW - Endpoint definitions
│   │   ├── index.ts
│   │   ├── analytics.ts
│   │   ├── products.ts
│   │   ├── orders.ts
│   │   ├── categories.ts
│   │   ├── customers.ts
│   │   ├── cart.ts
│   │   ├── brands.ts
│   │   └── admin.ts
│   └── mock/               # ✨ NEW - Mock handler system
│       ├── index.ts        # Main mock entry point
│       ├── router.ts       # Route-based handler router
│       ├── utils.ts        # Mock utilities
│       ├── handlers/       # Mock handlers by domain
│       │   ├── analytics.ts
│       │   └── ...
│       └── data/           # ✨ NEW - Centralized mock data
│           ├── index.ts
│           ├── products.ts
│           ├── categories.ts
│           ├── brands.ts
│           ├── orders.ts
│           ├── customers.ts
│           └── cart.ts
└── data/
    ├── use-api-query.ts    # Base query hook (giữ nguyên)
    ├── use-api-mutation.ts # Base mutation hook (giữ nguyên)
    ├── repositories/       # ✨ NEW - Repository layer
    │   ├── index.ts
    │   ├── analytics.ts
    │   ├── products.ts
    │   ├── orders.ts
    │   ├── categories.ts
    │   ├── customers.ts
    │   ├── cart.ts
    │   ├── brands.ts
    │   └── admin.ts
    └── queries/            # React hooks (updated to use repositories)
        ├── use-analytics.ts  # ✨ NEW
        ├── use-products.ts
        ├── use-orders.ts
        └── ...
```

## Flow Data

```
Component
    ↓
Hook (lib/data/queries/*.ts)
    ↓
Repository (lib/data/repositories/*.ts)
    ↓
API Client (lib/api/client.ts)
    ↓
┌─────────────────┬─────────────────┐
│  Mock Handler   │  Real API Call  │
│  (lib/api/mock) │  (HTTP Request) │
└─────────────────┴─────────────────┘
```

## Usage Examples

### 1. Component sử dụng hook

```tsx
import { useAnalytics } from "@/lib/data/queries/use-analytics";

function Dashboard() {
  const { data, isLoading } = useAnalytics({ range: "30d" });

  if (isLoading) return <Loading />;
  return <Analytics data={data} />;
}
```

### 2. Hook sử dụng repository

```ts
// lib/data/queries/use-analytics.ts
import { analyticsRepository } from "../repositories/analytics";

export function useAnalytics(params?: { range?: TimeRange }) {
  return useApiQuery({
    queryKey: ["analytics", params?.range],
    queryFn: () => analyticsRepository.getAnalytics(params),
  });
}
```

### 3. Repository gọi API client

```ts
// lib/data/repositories/analytics.ts
import { apiGet } from "@/lib/api/client";

class AnalyticsRepositoryImpl {
  async getAnalytics(query: AnalyticsQuery = {}) {
    return apiGet<AnalyticsMetricsResponse>("/api/analytics", { params: query });
  }
}
```

### 4. API client tự động chuyển mock/real

```ts
// lib/api/client.ts
import { mockApiResponse } from "./mock"; // ✨ Updated

export async function apiRequest<T>(config: AxiosRequestConfig) {
  if (isMockApi) {
    const response = await mockApiResponse<T>(config); // ✨ New mock system
    return applyResponse({ data: response } as AxiosResponse<ApiResponse<T>>);
  }
  const response = await apiClient.request<ApiResponse<T>>(config);
  return applyResponse(response);
}
```

### 5. Mock router dispatch đến handler

```ts
// lib/api/mock/router.ts
export class MockRouter {
  async handle<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const handler = this.match(config);
    if (!handler) throw new Error(`No mock handler for ${config.method} ${config.url}`);
    return handler(config);
  }
}
```

### 6. Handler sử dụng mock data store

```ts
// lib/api/mock/handlers/analytics.ts
import { makeResponse, clone } from "../utils";

export async function handleGetAnalytics(config: AxiosRequestConfig) {
  return withDelay(() => {
    const params = config.params;
    return makeResponse(
      clone(analyticsDataByRange[params?.range || "30d"]),
      "Mock analytics loaded"
    );
  });
}
```

## Chuyển đổi Mock ↔ Real API

Chỉ cần thay đổi environment variable:

```bash
# .env.local
NEXT_PUBLIC_API_MODE=mock    # Dùng mock data
NEXT_PUBLIC_API_MODE=real    # Gọi real API
```

Hoặc trong code:

```ts
import { getApiMode, isMockApiEnabled } from "@/lib/api/config";

const mode = getApiMode(); // "mock" | "real"
const isMock = isMockApiEnabled(); // boolean
```

## Thêm Endpoint Mới

### 1. Định nghĩa endpoint

```ts
// lib/api/endpoints/wishlist.ts
export const WISHLIST_ENDPOINTS = {
  list: () => ({ url: "/api/wishlist", method: "GET" }),
  add: (productId: string) => ({
    url: "/api/wishlist",
    method: "POST",
    body: { productId },
  }),
  remove: (productId: string) => ({
    url: `/api/wishlist/${productId}`,
    method: "DELETE",
  }),
} as const;
```

### 2. Tạo repository

```ts
// lib/data/repositories/wishlist.ts
export interface WishlistRepository {
  list(): Promise<string[]>;
  add(productId: string): Promise<void>;
  remove(productId: string): Promise<void>;
}

class WishlistRepositoryImpl implements WishlistRepository {
  async list() {
    return apiGet<string[]>("/api/wishlist");
  }

  async add(productId: string) {
    await apiPost("/api/wishlist", { productId });
  }

  async remove(productId: string) {
    await apiDelete(`/api/wishlist/${productId}`);
  }
}

export const wishlistRepository = new WishlistRepositoryImpl();
```

### 3. Tạo hook

```ts
// lib/data/queries/use-wishlist.ts
export function useWishlist() {
  return useApiQuery({
    queryKey: ["wishlist"],
    queryFn: () => wishlistRepository.list(),
  });
}

export function useAddToWishlist() {
  return useApiMutation({
    mutationFn: (productId: string) => wishlistRepository.add(productId),
    invalidateQueries: [["wishlist"]],
  });
}
```

### 4. Tạo mock handler (optional)

```ts
// lib/api/mock/handlers/wishlist.ts
export function registerWishlistHandlers(router) {
  router.get("/api/wishlist", handleGetWishlist);
  router.post("/api/wishlist", handleAddToWishlist);
  router.delete(/^\/api\/wishlist\/.+/, handleRemoveFromWishlist);
}
```

## Migration Checklist

Khi migrate từ system cũ sang mới:

- [x] Tạo endpoint definitions
- [x] Tạo repository layer
- [x] Tạo mock handler router
- [x] Tạo centralized mock data stores
- [x] Update hooks để sử dụng repositories
- [ ] Migrate tất cả components sang hooks mới
- [ ] Xóa các file `api.ts` cũ trong components
- [ ] Test cả mock và real mode
- [ ] Update documentation

## Notes

- **Legacy mock-data.ts** vẫn hoạt động nhờ fallback handler
- **Component-level API files** (như `components/dashboard/api.ts`) nên được xóa
- **Direct API calls** trong components nên được thay bằng hooks
- **Types** nên được export từ `lib/api/endpoints` thay vì define riêng lẻ
