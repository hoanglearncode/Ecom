import { apiGet, apiPatch, apiPost } from "./client";
import type { MockOrder } from "./mock-store/types";

export type OrderStatus = MockOrder["status"];

// Get orders list
export async function getOrders(): Promise<MockOrder[]> {
  return apiGet<MockOrder[]>("/api/orders");
}

// Get single order
export async function getOrder(id: string): Promise<MockOrder> {
  return apiGet<MockOrder>(`/api/orders/${id}`);
}

// Update order status
export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<MockOrder> {
  return apiPatch<MockOrder>(`/api/orders/${id}/status`, { status });
}

// Fulfill order (mark as shipped)
export async function fulfillOrder(
  id: string,
  trackingNumber?: string,
): Promise<MockOrder> {
  return apiPost<MockOrder>(`/api/orders/${id}/fulfill`, { trackingNumber });
}

// Refund order
export async function refundOrder(id: string): Promise<MockOrder> {
  return apiPost<MockOrder>(`/api/orders/${id}/refund`, {});
}

// Add tracking number
export async function addTrackingNumber(
  id: string,
  trackingNumber: string,
): Promise<MockOrder> {
  return apiPatch<MockOrder>(`/api/orders/${id}`, { trackingNumber });
}
