/**
 * Categories API Endpoints
 *
 * Định nghĩa tất cả endpoints liên quan đến categories
 * Sẽ được dùng bởi cả mock và real API
 */

import type { ListQueryParams } from "../types";

// ─── Request Types ───────────────────────────────────────────────────────────────

export interface CategoryListParams extends ListQueryParams {
  parentId?: string;
  includeInactive?: boolean;
}

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string;
  parentId?: string;
  image?: string;
  icon?: string;
  displayOrder?: number;
  isActive?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  id: string;
}

// ─── Response Types ──────────────────────────────────────────────────────────────

export interface CategoryListResponse {
  items: CategoryResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  parent?: {
    id: string;
    name: string;
    slug: string;
  };
  children?: CategoryResponse[];
  image?: string;
  icon?: string;
  displayOrder: number;
  isActive: boolean;
  productCount?: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryTreeResponse {
  id: string;
  name: string;
  slug: string;
  image?: string;
  icon?: string;
  children: CategoryTreeResponse[];
  productCount?: number;
}

// ─── Endpoint Definitions ─────────────────────────────────────────────────────────

export const CATEGORIES_ENDPOINTS = {
  // List categories
  list: (params?: CategoryListParams) => ({
    url: "/api/categories" as const,
    method: "GET" as const,
    query: params,
  }),

  // Get category tree (hierarchical)
  tree: () => ({
    url: "/api/categories/tree" as const,
    method: "GET" as const,
  }),

  // Get single category by ID
  getById: (id: string) => ({
    url: `/api/categories/${id}` as const,
    method: "GET" as const,
  }),

  // Get category by slug
  getBySlug: (slug: string) => ({
    url: `/api/categories/slug/${slug}` as const,
    method: "GET" as const,
  }),

  // Create new category
  create: (data: CreateCategoryInput) => ({
    url: "/api/categories" as const,
    method: "POST" as const,
    body: data,
  }),

  // Update category
  update: ({ id, ...data }: UpdateCategoryInput) => ({
    url: `/api/categories/${id}` as const,
    method: "PUT" as const,
    body: data,
  }),

  // Partial update
  patch: ({ id, ...data }: Partial<UpdateCategoryInput>) => ({
    url: `/api/categories/${id}` as const,
    method: "PATCH" as const,
    body: data,
  }),

  // Delete category
  delete: (id: string) => ({
    url: `/api/categories/${id}` as const,
    method: "DELETE" as const,
  }),

  // Reorder categories
  reorder: (orders: Array<{ id: string; displayOrder: number }>) => ({
    url: "/api/categories/reorder" as const,
    method: "POST" as const,
    body: { orders },
  }),
} as const;

// ─── Type Exports ─────────────────────────────────────────────────────────────────

export type CategoriesEndpoint = typeof CATEGORIES_ENDPOINTS;
