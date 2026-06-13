/**
 * Products Repository
 *
 * Repository layer cho products data
 * Abstracts API calls và cungfern methods rõ ràng
 */

import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/api/client";
import type {
  ProductListParams,
  CreateProductInput,
  UpdateProductInput,
  ProductListResponse,
  ProductResponse,
} from "@/lib/api/endpoints/products";

// ─── Repository Interface ───────────────────────────────────────────────────────

export interface ProductsRepository {
  list(params?: ProductListParams): Promise<ProductResponse[]>;
  getPaginated(params?: ProductListParams): Promise<ProductListResponse>;
  getById(id: string): Promise<ProductResponse>;
  getBySlug(slug: string): Promise<ProductResponse>;
  create(data: CreateProductInput): Promise<ProductResponse>;
  update(data: UpdateProductInput): Promise<ProductResponse>;
  patch(id: string, data: Partial<UpdateProductInput>): Promise<ProductResponse>;
  delete(id: string): Promise<void>;
  bulkDelete(ids: string[]): Promise<{ deletedCount: number }>;
  featured(limit?: number): Promise<ProductResponse[]>;
  related(productId: string, limit?: number): Promise<ProductResponse[]>;
  search(query: string, params?: Omit<ProductListParams, "search">): Promise<ProductResponse[]>;
  updateStock(productId: string, quantity: number, operation: "set" | "add" | "subtract"): Promise<ProductResponse>;
}

// ─── Implementation ──────────────────────────────────────────────────────────────

class ProductsRepositoryImpl implements ProductsRepository {
  /**
   * List products (without pagination metadata)
   */
  async list(params?: ProductListParams): Promise<ProductResponse[]> {
    return apiGet<ProductResponse[]>("/api/products", { params });
  }

  /**
   * List products with pagination
   */
  async getPaginated(params?: ProductListParams): Promise<ProductListResponse> {
    return apiGet<ProductListResponse>("/api/products/paginated", { params });
  }

  /**
   * Get single product by ID
   */
  async getById(id: string): Promise<ProductResponse> {
    return apiGet<ProductResponse>(`/api/products/${id}`);
  }

  /**
   * Get product by slug
   */
  async getBySlug(slug: string): Promise<ProductResponse> {
    return apiGet<ProductResponse>(`/api/products/slug/${slug}`);
  }

  /**
   * Create new product
   */
  async create(data: CreateProductInput): Promise<ProductResponse> {
    return apiPost<ProductResponse, CreateProductInput>("/api/products", data);
  }

  /**
   * Update product (full)
   */
  async update(data: UpdateProductInput): Promise<ProductResponse> {
    const { id, ...body } = data;
    return apiPut<ProductResponse, Omit<UpdateProductInput, "id">>(`/api/products/${id}`, body);
  }

  /**
   * Partial update
   */
  async patch(id: string, data: Partial<UpdateProductInput>): Promise<ProductResponse> {
    return apiPatch<ProductResponse, Partial<UpdateProductInput>>(`/api/products/${id}`, data);
  }

  /**
   * Delete product
   */
  async delete(id: string): Promise<void> {
    await apiDelete(`/api/products/${id}`);
  }

  /**
   * Bulk delete products
   */
  async bulkDelete(ids: string[]): Promise<{ deletedCount: number }> {
    return apiDelete<{ deletedCount: number }>("/api/products", {
      data: { ids },
    });
  }

  /**
   * Get featured products
   */
  async featured(limit = 8): Promise<ProductResponse[]> {
    return apiGet<ProductResponse[]>("/api/products/featured", { params: { limit } });
  }

  /**
   * Get related products
   */
  async related(productId: string, limit = 4): Promise<ProductResponse[]> {
    return apiGet<ProductResponse[]>(`/api/products/${productId}/related`, {
      params: { limit },
    });
  }

  /**
   * Search products
   */
  async search(
    query: string,
    params?: Omit<ProductListParams, "search">
  ): Promise<ProductResponse[]> {
    return apiGet<ProductResponse[]>("/api/products/search", {
      params: { q: query, ...params },
    });
  }

  /**
   * Update product stock
   */
  async updateStock(
    productId: string,
    quantity: number,
    operation: "set" | "add" | "subtract"
  ): Promise<ProductResponse> {
    return apiPatch<ProductResponse, { quantity: number; operation: string }>(
      `/api/products/${productId}/stock`,
      { quantity, operation }
    );
  }
}

// ─── Export singleton ───────────────────────────────────────────────────────────

export const productsRepository = new ProductsRepositoryImpl();

// ─── Type exports ───────────────────────────────────────────────────────────────

// export type { ProductsRepository };
