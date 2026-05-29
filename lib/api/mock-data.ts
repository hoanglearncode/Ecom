import type { AxiosRequestConfig } from "axios";

import type { ApiResponse } from "./client";
import {
  mockAdminAppearance,
  mockAdminBrands,
  mockAdminCampaigns,
  mockAdminCategories,
  mockAdminCoupons,
  mockAdminAnalytics,
  mockAdminDashboard,
  mockAdminCustomers,
  mockAdminInventory,
  mockAdminOrders,
  mockAdminPromotions,
  mockAdminReports,
  mockAdminReviews,
  mockAdminSupport,
} from "./mock-store/admin";
import { mockCart } from "./mock-store/cart";
import { mockBrands } from "./mock-store/brands";
import { mockCategories } from "./mock-store/categories";
import { mockCustomers } from "./mock-store/customers";
import { mockInventory } from "./mock-store/inventory";
import { mockOrders } from "./mock-store/orders";
import {
  mockHomePageData,
  mockNewPageData,
  mockProfilePageData,
  mockSalePageData,
  mockWishlistPageData,
} from "./mock-store/storefront";
import { mockProductBySlug, mockProducts } from "./mock-store/products";
import type {
  MockCart,
  MockCheckoutPayload,
  MockDatabase,
} from "./mock-store/types";

const mockDatabase: MockDatabase = {
  products: mockProducts,
  brands: mockBrands,
  categories: mockCategories,
  cart: mockCart,
  orders: mockOrders,
  customers: mockCustomers,
  inventory: mockInventory,
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function toPath(url?: string, baseURL?: string) {
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

function makeResponse<T>(
  data: T,
  message?: string,
  meta?: Record<string, unknown>,
): ApiResponse<T> {
  return { data, message, meta };
}

function getIdFromPath(pathname: string, prefix: string) {
  const suffix = pathname.slice(prefix.length);
  return suffix.replace(/^\//, "").split("/")[0];
}

function recalcCartTotal(cart: MockCart) {
  const priceById: Record<string, number> = mockDatabase.products.reduce(
    (acc, product) => {
      acc[product.id] = product.price;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Number(
    cart.items
      .reduce(
        (sum, item) => sum + (priceById[item.productId] ?? 0) * item.quantity,
        0,
      )
      .toFixed(2),
  );
}

async function simulateDelay() {
  const delayMs = Number(process.env.NEXT_PUBLIC_API_MOCK_DELAY_MS ?? 0);
  if (!delayMs) return;
  await new Promise((resolve) => setTimeout(resolve, delayMs));
}

export async function mockApiResponse<T>(
  config: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  await simulateDelay();

  const method = (config.method ?? "GET").toUpperCase();
  const path = toPath(config.url, config.baseURL);
  const body = config.data as unknown;

  if (method === "GET" && path === "/api/products") {
    return makeResponse(
      clone(mockDatabase.products) as T,
      "Mock products loaded",
    );
  }

  if (method === "GET" && path === "/api/storefront/home") {
    return makeResponse(clone(mockHomePageData) as T, "Mock home loaded");
  }

  if (method === "GET" && path === "/api/storefront/wishlist") {
    return makeResponse(
      clone(mockWishlistPageData) as T,
      "Mock wishlist loaded",
    );
  }

  if (method === "GET" && path === "/api/storefront/sale") {
    return makeResponse(clone(mockSalePageData) as T, "Mock sale loaded");
  }

  if (method === "GET" && path === "/api/storefront/new") {
    return makeResponse(
      clone(mockNewPageData) as T,
      "Mock new arrivals loaded",
    );
  }

  if (method === "GET" && path === "/api/storefront/profile") {
    return makeResponse(clone(mockProfilePageData) as T, "Mock profile loaded");
  }

  if (method === "GET" && path === "/api/admin/dashboard") {
    return makeResponse(
      clone(mockAdminDashboard) as T,
      "Mock admin dashboard loaded",
    );
  }

  if (method === "GET" && path === "/api/admin/analytics") {
    return makeResponse(
      clone(mockAdminAnalytics) as T,
      "Mock admin analytics loaded",
    );
  }

  if (method === "GET" && path === "/api/admin/promotions") {
    return makeResponse(
      clone(mockAdminPromotions) as T,
      "Mock admin promotions loaded",
    );
  }

  if (method === "GET" && path === "/api/admin/reports") {
    return makeResponse(
      clone(mockAdminReports) as T,
      "Mock admin reports loaded",
    );
  }

  if (method === "GET" && path === "/api/admin/support") {
    return makeResponse(
      clone(mockAdminSupport) as T,
      "Mock admin support loaded",
    );
  }

  if (method === "GET" && path === "/api/admin/categories") {
    return makeResponse(
      clone(mockAdminCategories) as T,
      "Mock admin categories loaded",
    );
  }

  if (method === "GET" && path === "/api/admin/brands") {
    return makeResponse(
      clone(mockAdminBrands) as T,
      "Mock admin brands loaded",
    );
  }

  if (method === "GET" && path === "/api/admin/customers") {
    return makeResponse(
      clone(mockAdminCustomers) as T,
      "Mock admin customers loaded",
    );
  }

  if (method === "GET" && path === "/api/admin/inventory") {
    return makeResponse(
      clone(mockAdminInventory) as T,
      "Mock admin inventory loaded",
    );
  }

  if (method === "GET" && path === "/api/admin/orders") {
    return makeResponse(
      clone(mockAdminOrders) as T,
      "Mock admin orders loaded",
    );
  }

  if (method === "GET" && path === "/api/admin/reviews") {
    return makeResponse(
      clone(mockAdminReviews) as T,
      "Mock admin reviews loaded",
    );
  }

  if (method === "GET" && path === "/api/admin/coupons") {
    return makeResponse(
      clone(mockAdminCoupons) as T,
      "Mock admin coupons loaded",
    );
  }

  if (method === "GET" && path === "/api/admin/appearance") {
    return makeResponse(
      clone(mockAdminAppearance) as T,
      "Mock admin appearance loaded",
    );
  }

  if (method === "GET" && path === "/api/admin/campaigns") {
    return makeResponse(
      clone(mockAdminCampaigns) as T,
      "Mock admin campaigns loaded",
    );
  }

  if (method === "GET" && path === "/api/categories") {
    return makeResponse(
      clone(mockDatabase.categories) as T,
      "Mock categories loaded",
    );
  }

  if (method === "GET" && path === "/api/brands") {
    return makeResponse(clone(mockDatabase.brands) as T, "Mock brands loaded");
  }

  if (method === "GET" && path.startsWith("/api/brands/")) {
    const id = getIdFromPath(path, "/api/brands/");
    const brand =
      mockDatabase.brands.find((item) => item.id === id || item.slug === id) ??
      null;
    return makeResponse(
      clone(brand) as T,
      brand ? "Mock brand loaded" : "Mock brand not found",
    );
  }

  if (method === "GET" && path.startsWith("/api/categories/")) {
    const id = getIdFromPath(path, "/api/categories/");
    const category =
      mockDatabase.categories.find(
        (item) => item.id === id || item.slug === id,
      ) ?? null;
    return makeResponse(
      clone(category) as T,
      category ? "Mock category loaded" : "Mock category not found",
    );
  }

  if (method === "GET" && path.startsWith("/api/products/")) {
    const id = getIdFromPath(path, "/api/products/");
    const product =
      mockDatabase.products.find((item) => item.id === id || item.id === `p${id}`) ??
      mockProductBySlug.get(id) ??
      null;
    return makeResponse(
      clone(product) as T,
      product ? "Mock product loaded" : "Mock product not found",
    );
  }

  if (method === "GET" && path === "/api/cart") {
    return makeResponse(clone(mockDatabase.cart) as T, "Mock cart loaded");
  }

  if (method === "POST" && path === "/api/cart") {
    const partialCart = (body ?? {}) as Partial<MockCart>;
    mockDatabase.cart = {
      ...mockDatabase.cart,
      ...partialCart,
      items: partialCart.items ?? mockDatabase.cart.items,
      total: partialCart.items
        ? recalcCartTotal({
            ...mockDatabase.cart,
            ...partialCart,
            items: partialCart.items,
          })
        : mockDatabase.cart.total,
    };

    return makeResponse(clone(mockDatabase.cart) as T, "Mock cart updated");
  }

  if (method === "GET" && path === "/api/orders") {
    return makeResponse(clone(mockDatabase.orders) as T, "Mock orders loaded");
  }

  if (method === "GET" && path.startsWith("/api/orders/")) {
    const id = getIdFromPath(path, "/api/orders/");
    const order =
      mockDatabase.orders.find(
        (item) => item.id === id || item.number === id,
      ) ?? null;
    return makeResponse(
      clone(order) as T,
      order ? "Mock order loaded" : "Mock order not found",
    );
  }

  if (method === "GET" && path === "/api/customers") {
    return makeResponse(
      clone(mockDatabase.customers) as T,
      "Mock customers loaded",
    );
  }

  if (method === "GET" && path === "/api/inventory") {
    return makeResponse(
      clone(mockDatabase.inventory) as T,
      "Mock inventory loaded",
    );
  }

  if (method === "POST" && path === "/api/checkout") {
    const payload = body as MockCheckoutPayload | undefined;
    const checkoutId = `chk_${Date.now()}`;
    const orderNumber = `SH-${String(mockDatabase.orders.length + 84292).padStart(5, "0")}`;
    const order = {
      id: checkoutId,
      number: orderNumber,
      status: "pending" as const,
      total: mockDatabase.cart.total,
    };

    mockDatabase.orders = [order, ...mockDatabase.orders];

    return makeResponse(
      {
        checkoutId,
        order,
        paymentMethod: payload?.paymentMethod ?? "card",
      } as T,
      "Mock checkout created",
    );
  }

  throw new Error(`No mock handler registered for ${method} ${path}`);
}
