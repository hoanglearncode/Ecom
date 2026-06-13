/**
 * Orders Repository
 *
 * Repository layer cho orders data
 * Abstracts API calls và cung cấp methods rõ ràng
 */

import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api/client";
import type {
  OrderListParams,
  CreateOrderInput,
  UpdateOrderStatusInput,
  FulfillOrderInput,
  OrderListResponse,
  OrderResponse,
  OrderStats,
} from "@/lib/api/endpoints/orders";

// ─── Repository Interface ───────────────────────────────────────────────────────

export interface OrdersRepository {
  list(params?: OrderListParams): Promise<OrderResponse[]>;
  getPaginated(params?: OrderListParams): Promise<OrderListResponse>;
  getById(id: string): Promise<OrderResponse>;
  getByNumber(number: string): Promise<OrderResponse>;
  create(data: CreateOrderInput): Promise<OrderResponse>;
  updateStatus(id: string, data: UpdateOrderStatusInput): Promise<OrderResponse>;
  fulfill(id: string, data: FulfillOrderInput): Promise<OrderResponse>;
  refund(id: string, reason?: string): Promise<OrderResponse>;
  cancel(id: string, reason?: string): Promise<OrderResponse>;
  getStats(params?: { dateFrom?: string; dateTo?: string }): Promise<OrderStats>;
  getByCustomer(customerId: string, params?: Omit<OrderListParams, "customerId">): Promise<OrderResponse[]>;
}

// ─── Implementation ──────────────────────────────────────────────────────────────

class OrdersRepositoryImpl implements OrdersRepository {
  /**
   * List orders (without pagination metadata)
   */
  async list(params?: OrderListParams): Promise<OrderResponse[]> {
    return apiGet<OrderResponse[]>("/api/orders", { params });
  }

  /**
   * List orders with pagination
   */
  async getPaginated(params?: OrderListParams): Promise<OrderListResponse> {
    return apiGet<OrderListResponse>("/api/orders/paginated", { params });
  }

  /**
   * Get single order by ID
   */
  async getById(id: string): Promise<OrderResponse> {
    return apiGet<OrderResponse>(`/api/orders/${id}`);
  }

  /**
   * Get order by number
   */
  async getByNumber(number: string): Promise<OrderResponse> {
    return apiGet<OrderResponse>(`/api/orders/number/${number}`);
  }

  /**
   * Create new order
   */
  async create(data: CreateOrderInput): Promise<OrderResponse> {
    return apiPost<OrderResponse, CreateOrderInput>("/api/orders", data);
  }

  /**
   * Update order status
   */
  async updateStatus(id: string, data: UpdateOrderStatusInput): Promise<OrderResponse> {
    return apiPatch<OrderResponse, UpdateOrderStatusInput>(
      `/api/orders/${id}/status`,
      data
    );
  }

  /**
   * Fulfill order (add tracking)
   */
  async fulfill(id: string, data: FulfillOrderInput): Promise<OrderResponse> {
    return apiPost<OrderResponse, FulfillOrderInput>(
      `/api/orders/${id}/fulfill`,
      data
    );
  }

  /**
   * Refund order
   */
  async refund(id: string, reason?: string): Promise<OrderResponse> {
    return apiPost<OrderResponse, { reason?: string }>(
      `/api/orders/${id}/refund`,
      { reason }
    );
  }

  /**
   * Cancel order
   */
  async cancel(id: string, reason?: string): Promise<OrderResponse> {
    return apiPost<OrderResponse, { reason?: string }>(
      `/api/orders/${id}/cancel`,
      { reason }
    );
  }

  /**
   * Get order stats
   */
  async getStats(params?: { dateFrom?: string; dateTo?: string }): Promise<OrderStats> {
    return apiGet<OrderStats>("/api/orders/stats", { params });
  }

  /**
   * Get customer orders
   */
  async getByCustomer(
    customerId: string,
    params?: Omit<OrderListParams, "customerId">
  ): Promise<OrderResponse[]> {
    return apiGet<OrderResponse[]>(`/api/customers/${customerId}/orders`, { params });
  }
}

// ─── Export singleton ───────────────────────────────────────────────────────────

export const ordersRepository = new OrdersRepositoryImpl();

// ─── Type exports ───────────────────────────────────────────────────────────────

// export type { OrdersRepository };
