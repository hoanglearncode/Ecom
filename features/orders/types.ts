export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled";

export interface MockOrder {
  id: string;
  number: string;
  status: OrderStatus;
  total: number;
  items: string;
  date: string;
  customer: string;
  customerId?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  paymentMethod?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt?: string;
}