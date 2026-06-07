import { apiGet, apiPost, apiPut, apiDelete } from "./client";
import type { MockCategory } from "./mock-store/types";

// Get categories list (with tree structure)
export async function getCategories(): Promise<MockCategory[]> {
  return apiGet<MockCategory[]>("/api/categories");
}

// Get single category
export async function getCategory(id: string): Promise<MockCategory> {
  return apiGet<MockCategory>(`/api/categories/${id}`);
}

// Create category
export async function createCategory(
  data: Omit<MockCategory, "id" | "productCount">,
): Promise<MockCategory> {
  return apiPost<MockCategory, Omit<MockCategory, "id" | "productCount">>(
    "/api/categories",
    data,
  );
}

// Update category
export async function updateCategory(
  id: string,
  data: Partial<MockCategory>,
): Promise<MockCategory> {
  return apiPut<MockCategory, Partial<MockCategory>>(
    `/api/categories/${id}`,
    data,
  );
}

// Delete category
export async function deleteCategory(id: string): Promise<MockCategory> {
  return apiDelete<MockCategory>(`/api/categories/${id}`);
}

// Move category (reorder or change parent)
export async function moveCategory(
  id: string,
  newParentId: string | null,
  newIndex: number,
): Promise<MockCategory[]> {
  return apiPost<MockCategory[], { id: string; newParentId: string | null; newIndex: number }>(
    "/api/categories/move",
    { id, newParentId, newIndex },
  );
}
