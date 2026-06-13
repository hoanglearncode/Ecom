/**
 * Categories Repository
 *
 * Repository layer cho categories data
 * Abstracts API calls và cung cấp methods rõ ràng
 */

import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/api/client";
import type {
  CategoryListParams,
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryListResponse,
  CategoryResponse,
  CategoryTreeResponse,
} from "@/lib/api/endpoints/categories";

// ─── Repository Interface ───────────────────────────────────────────────────────

export interface CategoriesRepository {
  list(params?: CategoryListParams): Promise<CategoryResponse[]>;
  getTree(): Promise<CategoryTreeResponse[]>;
  getById(id: string): Promise<CategoryResponse>;
  getBySlug(slug: string): Promise<CategoryResponse>;
  create(data: CreateCategoryInput): Promise<CategoryResponse>;
  update(data: UpdateCategoryInput): Promise<CategoryResponse>;
  patch(id: string, data: Partial<UpdateCategoryInput>): Promise<CategoryResponse>;
  delete(id: string): Promise<void>;
  reorder(orders: Array<{ id: string; displayOrder: number }>): Promise<void>;
}

// ─── Implementation ──────────────────────────────────────────────────────────────

class CategoriesRepositoryImpl implements CategoriesRepository {
  /**
   * List categories
   */
  async list(params?: CategoryListParams): Promise<CategoryResponse[]> {
    return apiGet<CategoryResponse[]>("/api/categories", { params });
  }

  /**
   * Get category tree (hierarchical)
   */
  async getTree(): Promise<CategoryTreeResponse[]> {
    return apiGet<CategoryTreeResponse[]>("/api/categories/tree");
  }

  /**
   * Get single category by ID
   */
  async getById(id: string): Promise<CategoryResponse> {
    return apiGet<CategoryResponse>(`/api/categories/${id}`);
  }

  /**
   * Get category by slug
   */
  async getBySlug(slug: string): Promise<CategoryResponse> {
    return apiGet<CategoryResponse>(`/api/categories/slug/${slug}`);
  }

  /**
   * Create new category
   */
  async create(data: CreateCategoryInput): Promise<CategoryResponse> {
    return apiPost<CategoryResponse, CreateCategoryInput>("/api/categories", data);
  }

  /**
   * Update category (full)
   */
  async update(data: UpdateCategoryInput): Promise<CategoryResponse> {
    const { id, ...body } = data;
    return apiPut<CategoryResponse, Omit<UpdateCategoryInput, "id">>(
      `/api/categories/${id}`,
      body
    );
  }

  /**
   * Partial update
   */
  async patch(id: string, data: Partial<UpdateCategoryInput>): Promise<CategoryResponse> {
    return apiPatch<CategoryResponse, Partial<UpdateCategoryInput>>(
      `/api/categories/${id}`,
      data
    );
  }

  /**
   * Delete category
   */
  async delete(id: string): Promise<void> {
    await apiDelete(`/api/categories/${id}`);
  }

  /**
   * Reorder categories
   */
  async reorder(orders: Array<{ id: string; displayOrder: number }>): Promise<void> {
    await apiPost("/api/categories/reorder", { orders });
  }
}

// ─── Export singleton ───────────────────────────────────────────────────────────

export const categoriesRepository = new CategoriesRepositoryImpl();

// ─── Type exports ───────────────────────────────────────────────────────────────

// export type { CategoriesRepository };
