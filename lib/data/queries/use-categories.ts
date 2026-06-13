/**
 * Category Data Hooks
 *
 * Centralized hooks cho fetching và manipulating category data
 */

import { useApiQuery } from "../use-api-query"
import { useApiMutation as useMutation } from "../use-api-mutation"
import type { MockCategory } from "@/lib/api/mock-store/types"
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api/client"

/**
 * Hook để lấy danh sách tất cả categories (với tree structure)
 */
export function useCategories() {
  return useApiQuery<MockCategory[]>({
    queryKey: ["categories"],
    queryFn: () => apiGet<MockCategory[]>("/api/categories"),
  })
}

/**
 * Hook để lấy categories flat list (không có tree structure)
 */
export function useCategoriesFlat() {
  return useApiQuery<MockCategory[]>({
    queryKey: ["categories", "flat"],
    queryFn: () => apiGet<MockCategory[]>("/api/categories/flat"),
  })
}

/**
 * Hook để lấy chi tiết một category
 */
export function useCategory(id: string) {
  return useApiQuery<MockCategory>({
    queryKey: ["category", id],
    queryFn: () => apiGet<MockCategory>(`/api/categories/${id}`),
    enabled: !!id,
  })
}

/**
 * Hook để lấy category theo slug
 */
export function useCategoryBySlug(slug: string) {
  return useApiQuery<MockCategory>({
    queryKey: ["category", "slug", slug],
    queryFn: () => apiGet<MockCategory>(`/api/categories/slug/${slug}`),
    enabled: !!slug,
  })
}

/**
 * Hook để lấy top-level categories (không có parent)
 */
export function useRootCategories() {
  return useApiQuery<MockCategory[]>({
    queryKey: ["categories", "root"],
    queryFn: () => apiGet<MockCategory[]>("/api/categories/root"),
  })
}

/**
 * Hook để lấy child categories của một category
 */
export function useChildCategories(parentId: string) {
  return useApiQuery<MockCategory[]>({
    queryKey: ["categories", "children", parentId],
    queryFn: () => apiGet<MockCategory[]>(`/api/categories/${parentId}/children`),
    enabled: !!parentId,
  })
}

/**
 * Hook để lấy featured categories
 */
export function useFeaturedCategories() {
  return useApiQuery<MockCategory[]>({
    queryKey: ["categories", "featured"],
    queryFn: () => apiGet<MockCategory[]>("/api/categories/featured"),
  })
}

/**
 * Hook để tạo category mới (Admin only)
 */
export function useCreateCategory() {
  return useMutation<
    MockCategory,
    Error,
    Omit<MockCategory, "id" | "productCount">
  >({
    mutationFn: (data) =>
      apiPost<MockCategory, Omit<MockCategory, "id" | "productCount">>("/api/categories", data),
    invalidateQueries: [["categories"], ["category"]],
  })
}

/**
 * Hook để update category (Admin only)
 */
export function useUpdateCategory() {
  return useMutation<MockCategory, Error, { id: string; data: Partial<MockCategory> }>({
    mutationFn: ({ id, data }) => apiPut<MockCategory, Partial<MockCategory>>(`/api/categories/${id}`, data),
    invalidateQueries: [["categories"], ["category"]],
  })
}

/**
 * Hook để xóa category (Admin only)
 */
export function useDeleteCategory() {
  return useMutation<MockCategory, Error, string>({
    mutationFn: (id) => apiDelete<MockCategory>(`/api/categories/${id}`),
    invalidateQueries: [["categories"], ["category"]],
  })
}

/**
 * Hook để move category (reorder hoặc change parent) - Admin only
 */
export function useMoveCategory() {
  return useMutation<
    MockCategory[],
    Error,
    { id: string; newParentId: string | null; newIndex: number }
  >({
    mutationFn: ({ id, newParentId, newIndex }) =>
      apiPost<MockCategory[], { id: string; newParentId: string | null; newIndex: number }>(
        "/api/categories/move",
        { id, newParentId, newIndex },
      ),
    invalidateQueries: [["categories"], ["category"]],
  })
}

/**
 * Hook để toggle featured status của category
 */
export function useToggleCategoryFeatured() {
  return useMutation<MockCategory, Error, string>({
    mutationFn: (id) => apiPost<MockCategory>(`/api/categories/${id}/toggle-featured`, {}),
    invalidateQueries: [["categories"], ["category"], ["categories", "featured"]],
  })
}

/**
 * Hook để get category statistics (Admin)
 */
export function useCategoryStats() {
  return useApiQuery<{
    total: number
    featured: number
    withProducts: number
    empty: number
  }>({
    queryKey: ["categories", "stats"],
    queryFn: () => apiGet("/api/categories/stats"),
  })
}
