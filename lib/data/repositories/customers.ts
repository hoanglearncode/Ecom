/**
 * Customers Repository
 *
 * Repository layer cho customers data
 * Abstracts API calls và cung cấp methods rõ ràng
 */

import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/api/client";
import type {
  CustomerListParams,
  CreateCustomerInput,
  UpdateCustomerInput,
  CustomerListResponse,
  CustomerResponse,
  CustomerStatsResponse,
} from "@/lib/api/endpoints/customers";

// ─── Repository Interface ───────────────────────────────────────────────────────

export interface CustomersRepository {
  list(params?: CustomerListParams): Promise<CustomerResponse[]>;
  getPaginated(params?: CustomerListParams): Promise<CustomerListResponse>;
  getById(id: string): Promise<CustomerResponse>;
  getByEmail(email: string): Promise<CustomerResponse>;
  create(data: CreateCustomerInput): Promise<CustomerResponse>;
  update(data: UpdateCustomerInput): Promise<CustomerResponse>;
  patch(id: string, data: Partial<UpdateCustomerInput>): Promise<CustomerResponse>;
  delete(id: string): Promise<void>;
  getStats(customerId: string, params?: { dateFrom?: string; dateTo?: string }): Promise<CustomerStatsResponse>;
  getOrders(customerId: string, params?: { page?: number; limit?: number }): Promise<unknown[]>;
  addTag(customerId: string, tag: string): Promise<void>;
  removeTag(customerId: string, tag: string): Promise<void>;
  updateSegment(customerId: string, segment: "new" | "regular" | "vip"): Promise<CustomerResponse>;
}

// ─── Implementation ──────────────────────────────────────────────────────────────

class CustomersRepositoryImpl implements CustomersRepository {
  /**
   * List customers
   */
  async list(params?: CustomerListParams): Promise<CustomerResponse[]> {
    return apiGet<CustomerResponse[]>("/api/customers", { params });
  }

  /**
   * List customers with pagination
   */
  async getPaginated(params?: CustomerListParams): Promise<CustomerListResponse> {
    return apiGet<CustomerListResponse>("/api/customers/paginated", { params });
  }

  /**
   * Get single customer by ID
   */
  async getById(id: string): Promise<CustomerResponse> {
    return apiGet<CustomerResponse>(`/api/customers/${id}`);
  }

  /**
   * Get customer by email
   */
  async getByEmail(email: string): Promise<CustomerResponse> {
    return apiGet<CustomerResponse>("/api/customers/by-email", { params: { email } });
  }

  /**
   * Create new customer
   */
  async create(data: CreateCustomerInput): Promise<CustomerResponse> {
    return apiPost<CustomerResponse, CreateCustomerInput>("/api/customers", data);
  }

  /**
   * Update customer (full)
   */
  async update(data: UpdateCustomerInput): Promise<CustomerResponse> {
    const { id, ...body } = data;
    return apiPut<CustomerResponse, Omit<UpdateCustomerInput, "id">>(
      `/api/customers/${id}`,
      body
    );
  }

  /**
   * Partial update
   */
  async patch(id: string, data: Partial<UpdateCustomerInput>): Promise<CustomerResponse> {
    return apiPatch<CustomerResponse, Partial<UpdateCustomerInput>>(
      `/api/customers/${id}`,
      data
    );
  }

  /**
   * Delete customer (soft delete)
   */
  async delete(id: string): Promise<void> {
    await apiDelete(`/api/customers/${id}`);
  }

  /**
   * Get customer stats
   */
  async getStats(
    customerId: string,
    params?: { dateFrom?: string; dateTo?: string }
  ): Promise<CustomerStatsResponse> {
    return apiGet<CustomerStatsResponse>(`/api/customers/${customerId}/stats`, { params });
  }

  /**
   * Get customer orders
   */
  async getOrders(
    customerId: string,
    params?: { page?: number; limit?: number }
  ): Promise<unknown[]> {
    return apiGet<unknown[]>(`/api/customers/${customerId}/orders`, { params });
  }

  /**
   * Add tag to customer
   */
  async addTag(customerId: string, tag: string): Promise<void> {
    await apiPost(`/api/customers/${customerId}/tags`, { tag });
  }

  /**
   * Remove tag from customer
   */
  async removeTag(customerId: string, tag: string): Promise<void> {
    await apiDelete(`/api/customers/${customerId}/tags/${tag}`);
  }

  /**
   * Update customer segment
   */
  async updateSegment(
    customerId: string,
    segment: "new" | "regular" | "vip"
  ): Promise<CustomerResponse> {
    return apiPatch<CustomerResponse, { segment: string }>(
      `/api/customers/${customerId}/segment`,
      { segment }
    );
  }
}

// ─── Export singleton ───────────────────────────────────────────────────────────

export const customersRepository = new CustomersRepositoryImpl();

// ─── Type exports ───────────────────────────────────────────────────────────────

// export type { CustomersRepository };
