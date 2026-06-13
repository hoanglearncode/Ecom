/**
 * Brands API Endpoints
 *
 * Định nghĩa tất cả endpoints liên quan đến brands
 */

import type { ListQueryParams } from "../types";

export interface BrandListParams extends ListQueryParams {
  search?: string;
  isActive?: boolean;
}

export interface CreateBrandInput {
  name: string;
  slug?: string;
  logo?: string;
  banner?: string;
  description?: string;
  website?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface UpdateBrandInput extends Partial<CreateBrandInput> {
  id: string;
}

export interface BrandResponse {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  banner?: string;
  description?: string;
  website?: string;
  isActive: boolean;
  displayOrder: number;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export const BRANDS_ENDPOINTS = {
  // List brands
  list: (params?: BrandListParams) => ({
    url: "/api/brands" as const,
    method: "GET" as const,
    query: params,
  }),

  // Get single brand by ID
  getById: (id: string) => ({
    url: `/api/brands/${id}` as const,
    method: "GET" as const,
  }),

  // Get brand by slug
  getBySlug: (slug: string) => ({
    url: `/api/brands/slug/${slug}` as const,
    method: "GET" as const,
  }),

  // Create new brand
  create: (data: CreateBrandInput) => ({
    url: "/api/brands" as const,
    method: "POST" as const,
    body: data,
  }),

  // Update brand
  update: ({ id, ...data }: UpdateBrandInput) => ({
    url: `/api/brands/${id}` as const,
    method: "PUT" as const,
    body: data,
  }),

  // Delete brand
  delete: (id: string) => ({
    url: `/api/brands/${id}` as const,
    method: "DELETE" as const,
  }),
} as const;

export type BrandsEndpoint = typeof BRANDS_ENDPOINTS;
