export type MockProduct = {
  id: string;
  name: string;
  sku?: string;
  price: number;
  currency?: string;
  thumbnail?: string;
  description?: string;
  brand?: string;
  categoryId?: string;
  categorySlug?: string;
  categoryName?: string;
  compareAtPrice?: number;
  cost?: number;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  status?: "active" | "draft" | "archived";
  tags?: string[];
  color?: string;
  material?: string;
  warranty?: string;
  releaseDate?: string;
  weight?: string;
  dimensions?: string;
};

export type MockBrand = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  productCount: number;
  featured: boolean;
  accent: string;
};

export type MockCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  featured: boolean;
  tone: string;
};

export type MockCartItem = {
  productId: string;
  quantity: number;
};

export type MockCart = {
  id: string;
  items: MockCartItem[];
  total: number;
};

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

export type MockCustomer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
};

export type MockInventoryItem = {
  productId: string;
  sku?: string;
  stock: number;
  productName?: string;
  category?: string;
  warehouse?: string;
  reorderPoint?: number;
  incoming?: number;
  reserved?: number;
  alert?: "Healthy" | "Watch" | "Low" | "Out";
};

export type MockCheckoutPayload = {
  cartId: string;
  addressId: string;
  paymentMethod: "card" | "cod" | "transfer";
};

export type MockAdminMetric = {
  label: string;
  value: string;
  change?: string;
};

export type MockAdminActivity = {
  title: string;
  detail: string;
  time: string;
};

export type MockAdminChannel = {
  name: string;
  value: string;
  share: string;
};

export type MockAdminPromotion = {
  name: string;
  audience: string;
  schedule: string;
  status: string;
};

export type MockAdminReport = {
  title: string;
  note: string;
  status: string;
};

export type MockAdminTicket = {
  id: string;
  subject: string;
  priority: string;
  status: string;
};

export type MockAdminDashboardData = {
  metrics: MockAdminMetric[];
  activity: MockAdminActivity[];
  actions: string[];
};

export type MockAdminAnalyticsData = {
  metrics: MockAdminMetric[];
  channels: MockAdminChannel[];
  actions: string[];
};

export type MockAdminPromotionsData = {
  metrics: MockAdminMetric[];
  promotions: MockAdminPromotion[];
  actions: string[];
};

export type MockAdminReportsData = {
  metrics: MockAdminMetric[];
  reports: MockAdminReport[];
  actions: string[];
};

export type MockAdminSupportData = {
  metrics: MockAdminMetric[];
  tickets: MockAdminTicket[];
  actions: string[];
};

export type MockDatabase = {
  products: MockProduct[];
  brands: MockBrand[];
  categories: MockCategory[];
  cart: MockCart;
  orders: MockOrder[];
  customers: MockCustomer[];
  inventory: MockInventoryItem[];
};
