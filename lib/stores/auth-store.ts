import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserTier = "basic" | "silver" | "gold" | "diamond";
export type UserRole = "buyer" | "seller";

export interface MockUser {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatar?: string;
  tier: UserTier;
  points: number;
  roles: UserRole[];
  activeRole: UserRole;
  bio?: string;
  location?: string;
  joinedAt: string;
}

const MOCK_USER: MockUser = {
  id: "user_001",
  name: "Nguyễn Thị Lan",
  username: "nguyenthilan",
  email: "lan.nguyen@gmail.com",
  phone: "0912 345 678",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lan",
  tier: "diamond",
  points: 12840,
  roles: ["buyer", "seller"],
  activeRole: "buyer",
  bio: "Yêu thích mua sắm online, đặc biệt giày dép và skincare 🛍️",
  location: "Hà Nội, Việt Nam",
  joinedAt: "2021-01-15",
};

interface AuthState {
  user: MockUser | null;
  isAuthenticated: boolean;
  login: (user?: MockUser) => void;
  logout: () => void;
  updateUser: (updates: Partial<MockUser>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: MOCK_USER,
      isAuthenticated: true,

      login: (user = MOCK_USER) => set({ user, isAuthenticated: true }),

      logout: () => set({ user: null, isAuthenticated: false }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const useCurrentUser = () => useAuthStore((s) => s.user);
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
