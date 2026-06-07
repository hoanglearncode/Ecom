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
import { mockCustomers, mockOrders } from "./mock-store/orders-enhanced";
import { mockInventory } from "./mock-store/inventory";
import {
  mockHomePageData,
  mockNewPageData,
  mockProfilePageData,
  mockSalePageData,
  mockWishlistPageData,
} from "./mock-store/storefront";
import { mockProductBySlug, mockProducts } from "./mock-store/products";
import {
  getOrderStats,
  getDashboardStats,
  getRevenueData,
  getCategorySales,
} from "./mock-store/enhanced";
import type {
  MockCart,
  MockCheckoutPayload,
  MockDatabase,
  MockProduct,
  MockCategory,
  MockOrder,
  MockCustomer,
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
    // Use enhanced data for realistic analytics
    const stats = getOrderStats();
    const dashboardStats = getDashboardStats();
    const revenueData = getRevenueData(30);
    const categorySales = getCategorySales();

    const analyticsResponse = {
      metrics: [
        {
          label: "Total Revenue",
          value: `₫${(stats.totalRevenue / 1000000).toFixed(1)}M`,
          change: "+12.5%",
        },
        { label: "Total Orders", value: String(stats.total), change: "+8.2%" },
        {
          label: "Total Customers",
          value: String(dashboardStats.customers.total),
          change: "+5.1%",
        },
        {
          label: "Products Sold",
          value: String(dashboardStats.products.total),
          change: "+2.3%",
        },
      ],
      channels: categorySales.slice(0, 5).map((cat, i) => ({
        name: cat.name,
        value: String(Math.floor(cat.value / 1000000)),
        share: String(Math.round((cat.value / stats.totalRevenue) * 100)) + "%",
      })),
      actions: mockAdminAnalytics.actions,
      revenueData,
    };
    return makeResponse(
      clone(analyticsResponse) as T,
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
      mockDatabase.products.find(
        (item) => item.id === id || item.id === `p${id}`,
      ) ??
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
    const cartItems = mockDatabase.cart.items ?? [];
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const itemNames = cartItems
      .map((item) => {
        const product = mockDatabase.products.find(
          (p) => p.id === item.productId,
        );
        return product?.name ?? item.productId;
      })
      .filter(Boolean);
    const itemsLabel =
      itemCount === 0
        ? "No items"
        : `${itemCount} item${itemCount === 1 ? "" : "s"} — ${itemNames
            .slice(0, 2)
            .join(", ")}${
            itemNames.length > 2 ? `, +${itemNames.length - 2} more` : ""
          }`;
    const order = {
      id: checkoutId,
      number: orderNumber,
      status: "pending" as const,
      total: mockDatabase.cart.total,
      items: itemsLabel,
      date: new Date().toISOString(),
      customer: "Guest",
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

  // ─── Products CRUD ─────────────────────────────────────────────────────────────

  // Create Product
  if (method === "POST" && path === "/api/products") {
    const newProduct = body as MockProduct;
    const { id: _ignoredId, ...productPayload } = newProduct;
    const product = {
      id: `p${Date.now()}`,
      ...productPayload,
      status: productPayload?.status ?? "active",
      releaseDate: new Date().toISOString(),
    };
    mockDatabase.products.push(product);
    return makeResponse(clone(product) as T, "Product created successfully");
  }

  // Update Product
  if (method === "PUT" && path.startsWith("/api/products/")) {
    const id = getIdFromPath(path, "/api/products/");
    const index = mockDatabase.products.findIndex(
      (p) => p.id === id || p.id === `p${id}`,
    );
    if (index === -1) {
      throw new Error(`Product ${id} not found`);
    }
    const updates = body as Partial<MockProduct>;
    mockDatabase.products[index] = {
      ...mockDatabase.products[index],
      ...updates,
      id: mockDatabase.products[index].id, // Preserve ID
    };
    return makeResponse(
      clone(mockDatabase.products[index]) as T,
      "Product updated successfully",
    );
  }

  // Patch Product (partial update)
  if (method === "PATCH" && path.startsWith("/api/products/")) {
    const id = getIdFromPath(path, "/api/products/");
    const index = mockDatabase.products.findIndex(
      (p) => p.id === id || p.id === `p${id}`,
    );
    if (index === -1) {
      throw new Error(`Product ${id} not found`);
    }
    const updates = body as Partial<MockProduct>;
    mockDatabase.products[index] = {
      ...mockDatabase.products[index],
      ...updates,
    };
    return makeResponse(
      clone(mockDatabase.products[index]) as T,
      "Product patched successfully",
    );
  }

  // Delete Product
  if (method === "DELETE" && path.startsWith("/api/products/")) {
    const id = getIdFromPath(path, "/api/products/");
    const index = mockDatabase.products.findIndex(
      (p) => p.id === id || p.id === `p${id}`,
    );
    if (index === -1) {
      throw new Error(`Product ${id} not found`);
    }
    const deleted = mockDatabase.products.splice(index, 1)[0];
    return makeResponse(clone(deleted) as T, "Product deleted successfully");
  }

  // Bulk Delete Products
  if (method === "DELETE" && path === "/api/products") {
    const { ids } = body as { ids: string[] };
    const initialLength = mockDatabase.products.length;
    mockDatabase.products = mockDatabase.products.filter(
      (p) => !ids.includes(p.id) && !ids.includes(p.id.replace("p", "")),
    );
    const deletedCount = initialLength - mockDatabase.products.length;
    return makeResponse(
      { deletedCount } as T,
      `${deletedCount} product(s) deleted successfully`,
    );
  }

  // ─── Categories CRUD ───────────────────────────────────────────────────────────

  // Create Category
  if (method === "POST" && path === "/api/categories") {
    const newCategory = body as Omit<MockCategory, "id">;
    const category: MockCategory = {
      id: `cat${Date.now()}`,
      ...newCategory,
      productCount: 0,
    };
    mockDatabase.categories.push(category);
    return makeResponse(clone(category) as T, "Category created successfully");
  }

  // Update Category
  if (method === "PUT" && path.startsWith("/api/categories/")) {
    const id = getIdFromPath(path, "/api/categories/");
    const index = mockDatabase.categories.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Category ${id} not found`);
    }
    const updates = body as Partial<MockCategory>;
    mockDatabase.categories[index] = {
      ...mockDatabase.categories[index],
      ...updates,
      id: mockDatabase.categories[index].id,
    };
    return makeResponse(
      clone(mockDatabase.categories[index]) as T,
      "Category updated successfully",
    );
  }

  // Delete Category
  if (method === "DELETE" && path.startsWith("/api/categories/")) {
    const id = getIdFromPath(path, "/api/categories/");
    const index = mockDatabase.categories.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Category ${id} not found`);
    }
    const deleted = mockDatabase.categories.splice(index, 1)[0];
    return makeResponse(clone(deleted) as T, "Category deleted successfully");
  }

  // ─── Orders CRUD ───────────────────────────────────────────────────────────────

  // Update Order Status
  if (method === "PATCH" && path.match(/\/api\/orders\/[^/]+\/status/)) {
    const orderId = path.split("/")[3];
    const { status } = body as { status: MockOrder["status"] };
    const index = mockDatabase.orders.findIndex(
      (o) => o.id === orderId || o.number === orderId,
    );
    if (index === -1) {
      throw new Error(`Order ${orderId} not found`);
    }
    mockDatabase.orders[index].status = status;
    return makeResponse(
      clone(mockDatabase.orders[index]) as T,
      "Order status updated successfully",
    );
  }

  // Fulfill Order
  if (method === "POST" && path.match(/\/api\/orders\/[^/]+\/fulfill/)) {
    const orderId = path.split("/")[3];
    const { trackingNumber } = body as { trackingNumber?: string };
    const index = mockDatabase.orders.findIndex(
      (o) => o.id === orderId || o.number === orderId,
    );
    if (index === -1) {
      throw new Error(`Order ${orderId} not found`);
    }
    mockDatabase.orders[index].status = "shipped";
    return makeResponse(
      clone(mockDatabase.orders[index]) as T,
      "Order fulfilled successfully",
    );
  }

  // Refund Order
  if (method === "POST" && path.match(/\/api\/orders\/[^/]+\/refund/)) {
    const orderId = path.split("/")[3];
    const index = mockDatabase.orders.findIndex(
      (o) => o.id === orderId || o.number === orderId,
    );
    if (index === -1) {
      throw new Error(`Order ${orderId} not found`);
    }
    mockDatabase.orders[index].status = "cancelled";
    return makeResponse(
      clone(mockDatabase.orders[index]) as T,
      "Order refunded successfully",
    );
  }

  // ─── Customers CRUD ────────────────────────────────────────────────────────────

  // Update Customer
  if (method === "PUT" && path.startsWith("/api/customers/")) {
    const id = getIdFromPath(path, "/api/customers/");
    const index = mockDatabase.customers.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Customer ${id} not found`);
    }
    const updates = body as Partial<MockCustomer>;
    mockDatabase.customers[index] = {
      ...mockDatabase.customers[index],
      ...updates,
      id: mockDatabase.customers[index].id,
    };
    return makeResponse(
      clone(mockDatabase.customers[index]) as T,
      "Customer updated successfully",
    );
  }

  // ─── Inventory ──────────────────────────────────────────────────────────────────

  // Update Stock
  if (method === "PATCH" && path.match(/\/api\/inventory\/[^/]+\/stock/)) {
    const productId = path.split("/")[3];
    const { quantity, operation } = body as {
      quantity: number;
      operation: "set" | "add" | "subtract";
    };
    const index = mockDatabase.inventory.findIndex(
      (i) => i.productId === productId,
    );
    if (index !== -1) {
      if (operation === "set") {
        mockDatabase.inventory[index].stock = quantity;
      } else if (operation === "add") {
        mockDatabase.inventory[index].stock += quantity;
      } else if (operation === "subtract") {
        mockDatabase.inventory[index].stock = Math.max(
          0,
          mockDatabase.inventory[index].stock - quantity,
        );
      }
      // Also update product stock
      const productIndex = mockDatabase.products.findIndex(
        (p) => p.id === productId,
      );
      if (productIndex !== -1) {
        mockDatabase.products[productIndex].stock =
          mockDatabase.inventory[index].stock;
      }
      return makeResponse(
        clone(mockDatabase.inventory[index]) as T,
        "Stock updated successfully",
      );
    }
    throw new Error(`Product ${productId} not found in inventory`);
  }

  throw new Error(`No mock handler registered for ${method} ${path}`);
}
