// Re-export từ lib/db — source of truth (100 orders, structured lineItems)
export type { OrderStatus, MockOrder, MockOrderLineItem } from "@/lib/api/mock-store/types";
export { dbOrders as mockOrders } from "@/lib/db/orders";
export {
  getOrdersByStatus,
  getOrderById,
  getRecentOrders,
  getOrderStats,
} from "@/lib/api/mock-store/orders-enhanced";
