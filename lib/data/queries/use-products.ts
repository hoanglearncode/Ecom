/**
 * Product Data Hooks
 *
 * Centralized hooks cho fetching và manipulating product data
 * Sử dụng cho cả Mock và Real API modes
 */

import { useApiQuery } from "../use-api-query"
import { useApiMutation as useMutation } from "../use-api-mutation"
import type { ProductListParams, PaginatedProductsResponse } from "@/lib/api/products"
import type { MockProduct } from "@/lib/api/mock-store/types"
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/api/client"

/**
 * Hook để lấy danh sách products với filter/pagination
 *
 * @example
 * ```ts
 * const { data, isLoading, error } = useProducts({
 *   page: 1,
 *   pageSize: 20,
 *   category: "electronics"
 * })
 * ```
 */
export function useProducts(params?: ProductListParams) {
  return useApiQuery<MockProduct[]>({
    queryKey: ["products", params],
    queryFn: () => apiGet<MockProduct[]>("/api/products", { params }),
  })
}

/**
 * Hook để lấy danh sách products với pagination info
 */
export function useProductsWithPagination(params?: ProductListParams) {
  return useApiQuery<PaginatedProductsResponse>({
    queryKey: ["products", "paginated", params],
    queryFn: () => apiGet<PaginatedProductsResponse>("/api/products/paginated", { params }),
  })
}

/**
 * Hook để lấy chi tiết một product
 *
 * @example
 * ```ts
 * const { data, isLoading } = useProduct("prod-123")
 * ```
 */
export function useProduct(id: string) {
  return useApiQuery<MockProduct>({
    queryKey: ["product", id],
    queryFn: () => apiGet<MockProduct>(`/api/products/${id}`),
    enabled: !!id, // Only fetch if id exists
  })
}

/**
 * Hook để lấy product theo slug
 * Useful cho product detail pages
 */
export function useProductBySlug(slug: string) {
  return useApiQuery<MockProduct>({
    queryKey: ["product", "slug", slug],
    queryFn: () => apiGet<MockProduct>(`/api/products/slug/${slug}`),
    enabled: !!slug,
  })
}

/**
 * Hook để tạo product mới (Admin only)
 */
export function useCreateProduct() {
  return useMutation<MockProduct, Error, Omit<MockProduct, "id">>({
    mutationFn: (data) => apiPost<MockProduct, Omit<MockProduct, "id">>("/api/products", data),
    invalidateQueries: [["products"]],
  })
}

/**
 * Hook để update product (Admin only)
 */
export function useUpdateProduct() {
  return useMutation<MockProduct, Error, { id: string; data: Partial<MockProduct> }>({
    mutationFn: ({ id, data }) => apiPut<MockProduct, Partial<MockProduct>>(`/api/products/${id}`, data),
    invalidateQueries: [["products"], ["product"]],
  })
}

/**
 * Hook để partial update product (Admin only)
 */
export function usePatchProduct() {
  return useMutation<MockProduct, Error, { id: string; data: Partial<MockProduct> }>({
    mutationFn: ({ id, data }) => apiPatch<MockProduct, Partial<MockProduct>>(`/api/products/${id}`, data),
    invalidateQueries: [["products"], ["product"]],
  })
}

/**
 * Hook để xóa product (Admin only)
 */
export function useDeleteProduct() {
  return useMutation<MockProduct, Error, string>({
    mutationFn: (id) => apiDelete<MockProduct>(`/api/products/${id}`),
    invalidateQueries: [["products"]],
  })
}

/**
 * Hook để xóa hàng loạt products (Admin only)
 */
export function useBulkDeleteProducts() {
  return useMutation<{ deletedCount: number }, Error, string[]>({
    mutationFn: (ids) => apiDelete<{ deletedCount: number }>("/api/products", { data: { ids } }),
    invalidateQueries: [["products"]],
  })
}

/**
 * Hook để upload product image
 */
export function useUploadProductImage() {
  return useMutation<{ url: string }, Error, { productId: string; file: File }>({
    mutationFn: async ({ productId, file }) => {
      const formData = new FormData()
      formData.append("file", file)
      // For now, return object URL - in real app would upload to server
      return { url: URL.createObjectURL(file) }
    },
    invalidateQueries: [["product"]],
  })
}

/**
 * Hook để search products với debounce
 */
export function useProductSearch(search: string, delay = 300) {
  return useApiQuery<MockProduct[]>({
    queryKey: ["products", "search", search],
    queryFn: () => apiGet<MockProduct[]>("/api/products", { params: { search } }),
    enabled: search.length > 2, // Only search when query length > 2
  })
}

/**
 * Hook để lấy featured products
 */
export function useFeaturedProducts(limit = 8) {
  return useApiQuery<MockProduct[]>({
    queryKey: ["products", "featured", limit],
    queryFn: () => apiGet<MockProduct[]>("/api/products/featured", { params: { limit } }),
  })
}

/**
 * Hook để lấy related products
 */
export function useRelatedProducts(productId: string, limit = 4) {
  return useApiQuery<MockProduct[]>({
    queryKey: ["products", "related", productId, limit],
    queryFn: () => apiGet<MockProduct[]>(`/api/products/${productId}/related`, { params: { limit } }),
    enabled: !!productId,
  })
}

/**
 * Hook để lấy products by category
 */
export function useProductsByCategory(categoryId: string, params?: Omit<ProductListParams, "category">) {
  return useApiQuery<MockProduct[]>({
    queryKey: ["products", "category", categoryId, params],
    queryFn: () => apiGet<MockProduct[]>("/api/products", { params: { category: categoryId, ...params } }),
    enabled: !!categoryId,
  })
}

/**
 * Hook để lấy products by brand
 */
export function useProductsByBrand(brandId: string, params?: Omit<ProductListParams, "brand">) {
  return useApiQuery<MockProduct[]>({
    queryKey: ["products", "brand", brandId, params],
    queryFn: () => apiGet<MockProduct[]>("/api/products", { params: { brand: brandId, ...params } }),
    enabled: !!brandId,
  })
}
