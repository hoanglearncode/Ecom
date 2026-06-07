import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "vi" | "en";
export type Currency = "VND" | "USD" | "EUR";
export type Theme = "light" | "dark" | "system";

interface UIState {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // Locale & Currency
  locale: Locale;
  currency: Currency;
  setLocale: (locale: Locale) => void;
  setCurrency: (currency: Currency) => void;

  // Sidebar (Admin)
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Mobile menu
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;

  // Loading states
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;

  // Toast notifications
  toasts: Array<{ id: string; message: string; type: "success" | "error" | "info"; duration?: number }>;
  addToast: (message: string, type?: "success" | "error" | "info", duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: "system",
      locale: "vi",
      currency: "VND",
      sidebarCollapsed: false,
      mobileMenuOpen: false,
      globalLoading: false,
      toasts: [],

      // Theme actions
      setTheme: (theme) => set({ theme }),

      // Locale & Currency actions
      setLocale: (locale) => set({ locale }),
      setCurrency: (currency) => set({ currency }),

      // Sidebar actions
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // Mobile menu actions
      toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      closeMobileMenu: () => set({ mobileMenuOpen: false }),

      // Loading actions
      setGlobalLoading: (loading) => set({ globalLoading: loading }),

      // Toast actions
      addToast: (message, type = "info", duration = 3000) => {
        const id = Math.random().toString(36).substring(7);
        set((state) => ({
          toasts: [...state.toasts, { id, message, type, duration }],
        }));

        // Auto-remove after duration
        setTimeout(() => {
          get().removeToast(id);
        }, duration);
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      },
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({
        theme: state.theme,
        locale: state.locale,
        currency: state.currency,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);

// Selector hooks
export const useTheme = () => useUIStore((state) => state.theme);
export const useLocale = () => useUIStore((state) => state.locale);
export const useCurrency = () => useUIStore((state) => state.currency);
export const useSidebarCollapsed = () => useUIStore((state) => state.sidebarCollapsed);
