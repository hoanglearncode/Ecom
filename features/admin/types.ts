import { Catalogue } from "@react-three/fiber";
import { Category } from "../categories/types";
import type { MockOrder } from "../orders/types";

export type AdminMetric = {
  label: string;
  value: string;
  change?: string;
};

export type AdminActivity = {
  title: string;
  detail: string;
  time: string;
};

export type AdminChannel = {
  name: string;
  value: string;
  share: string;
};

export type AdminPromotion = {
  name: string;
  audience: string;
  schedule: string;
  status: string;
};

export type AdminReport = {
  id?: string;
  title: string;
  note: string;
  status: string;
  category?: string;
  lastRun?: string;
  frequency?: string;
  rowCount?: string;
  owner?: string;
  tags?: string[];
};

export type AdminTicket = {
  id: string;
  subject: string;
  priority: string;
  status: string;
};

export type AdminDashboardData = {
  metrics: AdminMetric[];
  activity: AdminActivity[];
  actions: string[];
};

export type AdminAnalyticsData = {
  metrics: AdminMetric[];
  channels: AdminChannel[];
  actions: string[];
};

export type AdminPromotionsData = {
  metrics: AdminMetric[];
  promotions: AdminPromotion[];
  actions: string[];
};

export type AdminReportsData = {
  metrics: AdminMetric[];
  reports: AdminReport[];
  actions?: string[];
  scheduledExports?: Array<{
    name: string;
    destination: string;
    schedule: string;
    format: "CSV" | "XLSX" | "JSON" | "PDF";
    lastSent: string;
    status: "Active" | "Paused" | "Failed";
  }>;
  recentActivity?: Array<{
    title: string;
    time: string;
    type: "export" | "view" | "schedule";
  }>;
};

export type AdminSupportData = {
  metrics: AdminMetric[];
  tickets: AdminTicket[];
  actions: string[];
};

export type AdminCategory = {
  name: string;
  items: number;
  status: string;
};

export type AdminBrand = {
  name: string;
  category: string;
  status: string;
};

export type AdminCustomer = {
  name: string;
  email: string;
  phone: string;
  status: string;
};

export type AdminInventoryItem = {
  sku: string;
  stock: number;
  productName: string;
  brand: string;
  categoryName: string;
  alert: string;
};

export type AdminOrder = MockOrder;

export type AdminReview = {
  author: string;
  rating: number;
  note: string;
  status: string;
};

export type AdminCoupon = {
  code: string;
  title: string;
  discount: string;
  status: "active" | "scheduled" | "expired";
  usage: string;
  expiresAt: string;
};

export type AdminCampaign = {
  name: string;
  audience: string;
  channel: string;
  status: string;
};

export type AdminAppearanceData = {
  metrics: AdminMetric[];
  settings: Array<{ name: string; value: string; note: string }>;
  actions: string[];
};

export type AdminCampaignsData = {
  metrics: AdminMetric[];
  campaigns: AdminCampaign[];
  actions: string[];
};

export type AdminCouponsData = {
  coupons: AdminCoupon[];
};

export type AdminCategoriesData = {
  metrics: AdminMetric[];
  categories: Category[];
};

export type AdminBrandsData = {
  metrics: AdminMetric[];
  brands: AdminBrand[];
};

export type AdminCustomersData = {
  metrics: AdminMetric[];
  customers: AdminCustomer[];
};

export type AdminInventoryData = {
  metrics: AdminMetric[];
  inventory: AdminInventoryItem[];
};

export type AdminOrdersData = {
  metrics: AdminMetric[];
  orders: AdminOrder[];
};

export type AdminReviewsData = {
  metrics: AdminMetric[];
  reviews: AdminReview[];
};
