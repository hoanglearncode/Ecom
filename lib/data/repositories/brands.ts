/**
 * Brands Repository
 *
 * Repository layer cho brands data
 * Abstracts API calls và cung cấp methods rõ ràng
 */

import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/client";
import type {
  BrandListParams,
  CreateBrandInput,
  UpdateBrandInput,
  BrandResponse,
} from "@/lib/api/endpoints/brands";

// ─── Repository Interface ───────────────────────────────────────────────────────

export interface BrandsRepository {
  list(params?: BrandListParams): Promise<BrandResponse[]>;
  getById(id: string): Promise<BrandResponse>;
  getBySlug(slug: string): Promise<BrandResponse>;
  create(data: CreateBrandInput): Promise<BrandResponse>;
  update(data: UpdateBrandInput): Promise<BrandResponse>;
  delete(id: string): Promise<void>;
}

// ─── Implementation ──────────────────────────────────────────────────────────────

class BrandsRepositoryImpl implements BrandsRepository {
  /**
   * List brands
   */
  async list(params?: BrandListParams): Promise<BrandResponse[]> {
    return apiGet<BrandResponse[]>("/api/brands", { params });
  }

  /**
   * Get single brand by ID
   */
  async getById(id: string): Promise<BrandResponse> {
    return apiGet<BrandResponse>(`/api/brands/${id}`);
  }

  /**
   * Get brand by slug
   */
  async getBySlug(slug: string): Promise<BrandResponse> {
    return apiGet<BrandResponse>(`/api/brands/slug/${slug}`);
  }

  /**
   * Create new brand
   */
  async create(data: CreateBrandInput): Promise<BrandResponse> {
    return apiPost<BrandResponse, CreateBrandInput>("/api/brands", data);
  }

  /**
   * Update brand
   */
  async update(data: UpdateBrandInput): Promise<BrandResponse> {
    const { id, ...body } = data;
    return apiPut<BrandResponse, Omit<UpdateBrandInput, "id">>(`/api/brands/${id}`, body);
  }

  /**
   * Delete brand
   */
  async delete(id: string): Promise<void> {
    await apiDelete(`/api/brands/${id}`);
  }
}

// ─── Export singleton ───────────────────────────────────────────────────────────

export const brandsRepository = new BrandsRepositoryImpl();

// ─── Type exports ───────────────────────────────────────────────────────────────

// export type { BrandsRepository };
