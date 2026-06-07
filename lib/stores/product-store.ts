import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export type ProductStatus = "active" | "draft" | "archived";

export type ProductFilter = {
  search: string;
  category: string | null;
  brand: string | null;
  status: ProductStatus | null;
  priceRange: [number | null, number | null];
  stockLevel: "all" | "in_stock" | "low_stock" | "out_of_stock";
};

export type SortOption = {
  field: "name" | "price" | "stock" | "createdAt" | "updatedAt";
  order: "asc" | "desc";
};

export type PaginationState = {
  page: number;
  pageSize: number;
  total: number;
};

interface ProductState {
  // Products data
  products: any[];
  selectedProducts: Set<string>;
  selectedProduct: any | null;

  // Filter state
  filters: ProductFilter;
  sort: SortOption;
  pagination: PaginationState;

  // UI state
  viewMode: "grid" | "list";
  isFilterPanelOpen: boolean;

  // Actions
  setProducts: (products: any[]) => void;
  setSelectedProducts: (ids: Set<string>) => void;
  toggleProductSelection: (id: string) => void;
  selectAllProducts: () => void;
  clearSelection: () => void;
  setSelectedProduct: (product: any | null) => void;

  // Filter actions
  setFilters: (filters: Partial<ProductFilter>) => void;
  resetFilters: () => void;
  setSort: (sort: SortOption) => void;

  // Pagination actions
  setPagination: (pagination: Partial<PaginationState>) => void;
  nextPage: () => void;
  prevPage: () => void;

  // UI actions
  setViewMode: (mode: "grid" | "list") => void;
  toggleFilterPanel: () => void;
}

const defaultFilters: ProductFilter = {
  search: "",
  category: null,
  brand: null,
  status: null,
  priceRange: [null, null],
  stockLevel: "all",
};

const defaultPagination: PaginationState = {
  page: 1,
  pageSize: 12,
  total: 0,
};

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      // Initial state
      products: [],
      selectedProducts: new Set(),
      selectedProduct: null,
      filters: defaultFilters,
      sort: { field: "createdAt", order: "desc" },
      pagination: defaultPagination,
      viewMode: "grid",
      isFilterPanelOpen: true,

      // Products actions
      setProducts: (products) => set({ products }),

      setSelectedProducts: (ids) => set({ selectedProducts: ids }),

      toggleProductSelection: (id) => {
        const selectedProducts = new Set(get().selectedProducts);
        if (selectedProducts.has(id)) {
          selectedProducts.delete(id);
        } else {
          selectedProducts.add(id);
        }
        set({ selectedProducts });
      },

      selectAllProducts: () => {
        const ids = new Set(get().products.map((p) => p.id));
        set({ selectedProducts: ids });
      },

      clearSelection: () => set({ selectedProducts: new Set() }),

      setSelectedProduct: (product) => set({ selectedProduct: product }),

      // Filter actions
      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
          pagination: { ...state.pagination, page: 1 },
        }));
      },

      resetFilters: () =>
        set({
          filters: defaultFilters,
          pagination: { ...get().pagination, page: 1 },
        }),

      setSort: (sort) => set({ sort }),

      // Pagination actions
      setPagination: (newPagination) => {
        set((state) => ({
          pagination: { ...state.pagination, ...newPagination },
        }));
      },

      nextPage: () => {
        const { pagination } = get();
        const maxPage = Math.ceil(pagination.total / pagination.pageSize);
        set({
          pagination: {
            ...pagination,
            page: Math.min(pagination.page + 1, maxPage),
          },
        });
      },

      prevPage: () => {
        const { pagination } = get();
        set({
          pagination: {
            ...pagination,
            page: Math.max(pagination.page - 1, 1),
          },
        });
      },

      // UI actions
      setViewMode: (viewMode) => set({ viewMode }),

      toggleFilterPanel: () =>
        set((state) => ({
          isFilterPanelOpen: !state.isFilterPanelOpen,
        })),
    }),
    {
      name: "product-storage",
      partialize: (state) => ({
        viewMode: state.viewMode,
        isFilterPanelOpen: state.isFilterPanelOpen,
      }),
    },
  ),
);
