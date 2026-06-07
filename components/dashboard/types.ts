export type TimeRange = "7d" | "30d" | "90d" | "1y";

export interface RevenuePoint {
  month: string;
  revenue: number;
  orders: number;
  customers: number;
}

export interface CategoryPoint {
  name: string;
  value: number;
  color: string;
}

export interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
  growth: number;
}

export interface RecentOrder {
  id: string;
  customer: string;
  total: number;
  status: "completed" | "processing" | "shipped" | "pending" | "cancelled";
  date: string;
}

export interface CustomerSegment {
  segment: string;
  count: number;
  revenue: number;
  color: string;
}

export interface DailyTraffic {
  day: string;
  visits: number;
  conversions: number;
}

export interface MetricCard {
  title: string;
  value: string;
  rawValue: number;
  change: string;
  changeValue: number;
  trend: "up" | "down" | "neutral";
  icon: string;
  sub: string;
}

export interface AnalyticsSummary {
  metrics: MetricCard[];
  revenueData: RevenuePoint[];
  categoryData: CategoryPoint[];
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
  customerSegments: CustomerSegment[];
  dailyTraffic: DailyTraffic[];
  conversionRate: number;
  avgOrderValue: number;
  returnRate: number;
}
