import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "./client";
import type { MockProduct } from "./mock-store/types";

export type ProductListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  brand?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type PaginatedProductsResponse = {
  products: MockProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// Get products list
export async function getProducts(
  params?: ProductListParams,
): Promise<MockProduct[]> {
  return apiGet<MockProduct[]>("/api/products", { params });
}

// Get single product
export async function getProduct(id: string): Promise<MockProduct> {
  return apiGet<MockProduct>(`/api/products/${id}`);
}

// Create product
export async function createProduct(
  data: Omit<MockProduct, "id">,
): Promise<MockProduct> {
  return apiPost<MockProduct, Omit<MockProduct, "id">>("/api/products", data);
}

// Update product
export async function updateProduct(
  id: string,
  data: Partial<MockProduct>,
): Promise<MockProduct> {
  return apiPut<MockProduct, Partial<MockProduct>>(
    `/api/products/${id}`,
    data,
  );
}

// Patch product (partial update)
export async function patchProduct(
  id: string,
  data: Partial<MockProduct>,
): Promise<MockProduct> {
  return apiPatch<MockProduct, Partial<MockProduct>>(
    `/api/products/${id}`,
    data,
  );
}

// Delete product
export async function deleteProduct(id: string): Promise<MockProduct> {
  return apiDelete<MockProduct>(`/api/products/${id}`);
}

// Bulk delete products
export async function bulkDeleteProducts(ids: string[]): Promise<{ deletedCount: number }> {
  return apiDelete<{ deletedCount: number }>("/api/products", { data: { ids } });
}

// Upload product image
export async function uploadProductImage(
  productId: string,
  file: File,
): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("file", file);

  // In real app, this would upload to server
  // For mock, create object URL
  const url = URL.createObjectURL(file);
  return Promise.resolve({ url });
}
