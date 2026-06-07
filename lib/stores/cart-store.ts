import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export type CartItem = {
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    thumbnail?: string;
    sku?: string;
    stock?: number;
  };
  quantity: number;
  variant?: {
    color?: string;
    size?: string;
  };
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  isUpdating: boolean;

  // Computed
  get totalItems(): number;
  get subtotal(): number;
  get total(): number;

  // Actions
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, variant?: CartItem["variant"]) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    variant?: CartItem["variant"],
  ) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setIsUpdating: (isUpdating: boolean) => void;

  // Helpers
  getItemQuantity: (productId: string, variant?: CartItem["variant"]) => number;
  isInCart: (productId: string) => boolean;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      isOpen: false,
      isUpdating: false,

      // Computed getters (accessed via store)
      get totalItems() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      get subtotal() {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0,
        );
      },

      get total() {
        return get().subtotal; // Add shipping/tax later
      },

      // Actions
      addItem: (item) => {
        const { items } = get();
        const quantity = item.quantity ?? 1;

        // Check if item already exists (same product + variant)
        const existingIndex = items.findIndex(
          (i) =>
            i.productId === item.productId &&
            JSON.stringify(i.variant) === JSON.stringify(item.variant),
        );

        if (existingIndex >= 0) {
          // Update quantity
          const newItems = [...items];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + quantity,
          };
          set({ items: newItems });
        } else {
          // Add new item
          set({ items: [...items, { ...item, quantity }] });
        }

        // Open cart to show user
        set({ isOpen: true });
      },

      removeItem: (productId, variant) => {
        const { items } = get();
        const newItems = items.filter(
          (i) =>
            !(
              i.productId === productId &&
              JSON.stringify(i.variant) === JSON.stringify(variant)
            ),
        );
        set({ items: newItems });
      },

      updateQuantity: (productId, quantity, variant) => {
        const { items } = get();

        if (quantity <= 0) {
          get().removeItem(productId, variant);
          return;
        }

        const newItems = items.map((item) => {
          if (
            item.productId === productId &&
            JSON.stringify(item.variant) === JSON.stringify(variant)
          ) {
            return { ...item, quantity };
          }
          return item;
        });

        set({ items: newItems });
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),

      closeCart: () => set({ isOpen: false }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      setIsUpdating: (isUpdating) => set({ isUpdating }),

      // Helpers
      getItemQuantity: (productId, variant) => {
        const { items } = get();
        const item = items.find(
          (i) =>
            i.productId === productId &&
            JSON.stringify(i.variant) === JSON.stringify(variant),
        );
        return item?.quantity ?? 0;
      },

      isInCart: (productId) => {
        const { items } = get();
        return items.some((i) => i.productId === productId);
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

// Selector hooks for optimized re-renders
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartTotalItems = () => useCartStore((state) => state.totalItems);
export const useCartTotal = () => useCartStore((state) => state.total);
export const useCartIsOpen = () => useCartStore((state) => state.isOpen);
