/**
 * Products API Endpoints
 *
 * Định nghĩa tất cả endpoints liên quan đến products
 * Sẽ được dùng bởi cả mock và real API
 */

import type { ListQueryParams } from "../types";

// ─── Request Types ───────────────────────────────────────────────────────────────

export interface ProductListParams extends ListQueryParams {
  category?: string;
  brand?: string;
  search?: string;
  status?: "active" | "draft" | "archived";
  priceMin?: number;
  priceMax?: number;
  sort?: "createdAt" | "name" | "price" | "sales" | "stock";
}

export interface CreateProductInput {
  name: string;
  slug?: string;
  description: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  stock: number;
  images: string[];
  categoryId: string;
  brandId?: string;
  status?: "active" | "draft" | "archived";
  tags?: string[];
  attributes?: Record<string, string | number | boolean>;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
}

export interface ProductImageInput {
  productId: string;
  file: File;
  alt?: string;
  position?: number;
}

// ─── Response Types ──────────────────────────────────────────────────────────────

export interface ProductListResponse {
  items: ProductResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  stock: number;
  images: string[];
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  brandId?: string;
  brand?: {
    id: string;
    name: string;
    slug: string;
  };
  status: "active" | "draft" | "archived";
  tags?: string[];
  attributes?: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
  salesCount?: number;
  revenue?: number;
}

// ─── Endpoint Definitions ─────────────────────────────────────────────────────────

export const PRODUCTS_ENDPOINTS = {
  // List products with filtering/pagination
  list: (params?: ProductListParams) => ({
    url: "/api/products" as const,
    method: "GET" as const,
    query: params,
  }),

  // Get single product by ID
  getById: (id: string) => ({
    url: `/api/products/${id}` as const,
    method: "GET" as const,
  }),

  // Get product by slug
  getBySlug: (slug: string) => ({
    url: `/api/products/slug/${slug}` as const,
    method: "GET" as const,
  }),

  // Create new product
  create: (data: CreateProductInput) => ({
    url: "/api/products" as const,
    method: "POST" as const,
    body: data,
  }),

  // Update product
  update: ({ id, ...data }: UpdateProductInput) => ({
    url: `/api/products/${id}` as const,
    method: "PUT" as const,
    body: data,
  }),

  // Partial update
  patch: ({ id, ...data }: Partial<UpdateProductInput>) => ({
    url: `/api/products/${id}` as const,
    method: "PATCH" as const,
    body: data,
  }),

  // Delete product
  delete: (id: string) => ({
    url: `/api/products/${id}` as const,
    method: "DELETE" as const,
  }),

  // Bulk delete
  bulkDelete: (ids: string[]) => ({
    url: "/api/products/bulk" as const,
    method: "DELETE" as const,
    body: { ids },
  }),

  // Get featured products
  featured: (limit = 8) => ({
    url: "/api/products/featured" as const,
    method: "GET" as const,
    query: { limit },
  }),

  // Get related products
  related: (productId: string, limit = 4) => ({
    url: `/api/products/${productId}/related` as const,
    method: "GET" as const,
    query: { limit },
  }),

  // Search products
  search: (query: string, params?: Omit<ProductListParams, "search">) => ({
    url: "/api/products/search" as const,
    method: "GET" as const,
    query: { q: query, ...params },
  }),

  // Upload product image
  uploadImage: (data: ProductImageInput) => ({
    url: `/api/products/${data.productId}/images` as const,
    method: "POST" as const,
    body: data,
    isFormData: true,
  }),

  // Update stock
  updateStock: (productId: string, quantity: number, operation: "set" | "add" | "subtract") => ({
    url: `/api/products/${productId}/stock` as const,
    method: "PATCH" as const,
    body: { quantity, operation },
  }),
} as const;

// ─── Type Exports ─────────────────────────────────────────────────────────────────

export type ProductsEndpoint = typeof PRODUCTS_ENDPOINTS;
