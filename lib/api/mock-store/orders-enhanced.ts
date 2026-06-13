import type { MockCustomer, MockOrder } from "./types";
import { dbUsers } from "../../db/users";
import { dbOrders } from "../../db/orders";

// Re-export as backward-compatible aliases
export const mockCustomers: MockCustomer[] = dbUsers;
export const mockOrders: MockOrder[] = dbOrders;

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getOrdersByStatus(
  status: MockOrder["status"] | "all" = "all"
): MockOrder[] {
  if (status === "all") return mockOrders;
  return mockOrders.filter((o) => o.status === status);
}

export function getOrderById(id: string): MockOrder | undefined {
  return mockOrders.find((o) => o.id === id);
}

export function getRecentOrders(limit = 10): MockOrder[] {
  return mockOrders.slice(0, limit);
}

export function getOrderStats() {
  return {
    total: mockOrders.length,
    pending: mockOrders.filter((o) => o.status === "pending").length,
    paid: mockOrders.filter((o) => o.status === "paid").length,
    processing: mockOrders.filter((o) => o.status === "processing").length,
    shipped: mockOrders.filter((o) => o.status === "shipped").length,
    completed: mockOrders.filter((o) => o.status === "completed").length,
    cancelled: mockOrders.filter((o) => o.status === "cancelled").length,
    totalRevenue: mockOrders.reduce(
      (sum, o) => sum + (o.status !== "cancelled" ? o.total : 0),
      0
    ),
  };
}
