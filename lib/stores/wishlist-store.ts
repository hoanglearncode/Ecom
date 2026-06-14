import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  items: string[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (productId) => {
        const { items } = get();
        if (!items.includes(productId)) {
          set({ items: [...items, productId] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((id) => id !== productId) });
      },

      toggleItem: (productId) => {
        const { items } = get();
        set({
          items: items.includes(productId)
            ? items.filter((id) => id !== productId)
            : [...items, productId],
        });
      },

      isInWishlist: (productId) => get().items.includes(productId),

      clearWishlist: () => set({ items: [] }),
    }),
    { name: "wishlist-storage" }
  )
);

export const useWishlistItems = () => useWishlistStore((s) => s.items);
export const useWishlistTotalItems = () => useWishlistStore((s) => s.items.length);
export const useIsInWishlist = (productId: string) =>
  useWishlistStore((s) => s.items.includes(productId));
