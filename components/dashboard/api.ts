import type {
  AnalyticsSummary,
  RevenuePoint,
  CategoryPoint,
  TopProduct,
  RecentOrder,
  CustomerSegment,
  DailyTraffic,
  MetricCard,
  TimeRange,
} from "./types";

// ─── Revenue data by time range ───────────────────────────────────────────────

const revenueByRange: Record<TimeRange, RevenuePoint[]> = {
  "7d": [
    { month: "Mon", revenue: 8500000, orders: 22, customers: 18 },
    { month: "Tue", revenue: 11200000, orders: 31, customers: 27 },
    { month: "Wed", revenue: 9800000, orders: 27, customers: 22 },
    { month: "Thu", revenue: 14300000, orders: 39, customers: 34 },
    { month: "Fri", revenue: 18700000, orders: 52, customers: 45 },
    { month: "Sat", revenue: 22100000, orders: 61, customers: 53 },
    { month: "Sun", revenue: 16400000, orders: 46, customers: 40 },
  ],
  "30d": [
    { month: "May 1", revenue: 42000000, orders: 118, customers: 95 },
    { month: "May 8", revenue: 51000000, orders: 143, customers: 118 },
    { month: "May 15", revenue: 47500000, orders: 132, customers: 107 },
    { month: "May 22", revenue: 63000000, orders: 177, customers: 142 },
    { month: "May 29", revenue: 58000000, orders: 163, customers: 131 },
  ],
  "90d": [
    { month: "Mar", revenue: 185000000, orders: 512, customers: 387 },
    { month: "Apr", revenue: 214000000, orders: 598, customers: 451 },
    { month: "May", revenue: 261500000, orders: 733, customers: 553 },
  ],
  "1y": [
    { month: "Jun '24", revenue: 142000000, orders: 398, customers: 301 },
    { month: "Jul", revenue: 168000000, orders: 471, customers: 356 },
    { month: "Aug", revenue: 155000000, orders: 435, customers: 329 },
    { month: "Sep", revenue: 183000000, orders: 513, customers: 388 },
    { month: "Oct", revenue: 201000000, orders: 564, customers: 426 },
    { month: "Nov", revenue: 248000000, orders: 696, customers: 526 },
    { month: "Dec", revenue: 312000000, orders: 875, customers: 661 },
    { month: "Jan '25", revenue: 187000000, orders: 524, customers: 396 },
    { month: "Feb", revenue: 196000000, orders: 550, customers: 415 },
    { month: "Mar", revenue: 185000000, orders: 519, customers: 392 },
    { month: "Apr", revenue: 214000000, orders: 600, customers: 453 },
    { month: "May", revenue: 261500000, orders: 733, customers: 554 },
  ],
};

// ─── Category distribution ────────────────────────────────────────────────────

export const categoryData: CategoryPoint[] = [
  { name: "Electronics", value: 38, color: "#3B82F6" },
  { name: "Fashion", value: 24, color: "#E40F2A" },
  { name: "Home & Living", value: 17, color: "#10B981" },
  { name: "Beauty", value: 13, color: "#F59E0B" },
  { name: "Others", value: 8, color: "#8B5CF6" },
];

// ─── Top products ─────────────────────────────────────────────────────────────

export const topProducts: TopProduct[] = [
  { name: "iPhone 15 Pro Max", sales: 312, revenue: 374000000, growth: 18.4 },
  { name: "MacBook Air M3", sales: 198, revenue: 396000000, growth: 12.1 },
  {
    name: "Samsung Galaxy S24 Ultra",
    sales: 245,
    revenue: 220500000,
    growth: 9.7,
  },
  { name: "Sony WH-1000XM5", sales: 187, revenue: 65450000, growth: 22.3 },
  { name: "iPad Air 5", sales: 163, revenue: 114100000, growth: -3.2 },
  { name: "AirPods Pro 2", sales: 289, revenue: 72250000, growth: 14.8 },
  { name: "Dell XPS 15", sales: 94, revenue: 141000000, growth: 6.5 },
];

// ─── Recent orders ─────────────────────────────────────────────────────────────

export const recentOrders: RecentOrder[] = [
  {
    id: "SH-84303",
    customer: "Nguyễn Minh Tuấn",
    total: 2990000,
    status: "completed",
    date: "Today, 09:14",
  },
  {
    id: "SH-84302",
    customer: "Trần Thúy Vân",
    total: 1850000,
    status: "processing",
    date: "Today, 08:47",
  },
  {
    id: "SH-84301",
    customer: "Lê Hoàng Giang",
    total: 5200000,
    status: "shipped",
    date: "Yesterday, 16:32",
  },
  {
    id: "SH-84300",
    customer: "Phạm Minh Anh",
    total: 970000,
    status: "completed",
    date: "Yesterday, 14:05",
  },
  {
    id: "SH-84299",
    customer: "Hoàng Thu Hà",
    total: 7400000,
    status: "pending",
    date: "Yesterday, 11:22",
  },
  {
    id: "SH-84298",
    customer: "Huỳnh Thanh Bình",
    total: 3150000,
    status: "shipped",
    date: "May 30, 18:41",
  },
];

// ─── Customer segments ────────────────────────────────────────────────────────

export const customerSegments: CustomerSegment[] = [
  { segment: "VIP", count: 87, revenue: 1240000000, color: "#E40F2A" },
  { segment: "Regular", count: 342, revenue: 890000000, color: "#3B82F6" },
  { segment: "New", count: 427, revenue: 370000000, color: "#10B981" },
];

// ─── Daily traffic ────────────────────────────────────────────────────────────

export const dailyTraffic: DailyTraffic[] = [
  { day: "Mon", visits: 1840, conversions: 92 },
  { day: "Tue", visits: 2210, conversions: 124 },
  { day: "Wed", visits: 1975, conversions: 108 },
  { day: "Thu", visits: 2540, conversions: 148 },
  { day: "Fri", visits: 3120, conversions: 201 },
  { day: "Sat", visits: 3680, conversions: 237 },
  { day: "Sun", visits: 2890, conversions: 178 },
];

// ─── Metrics by time range ────────────────────────────────────────────────────

const metricsByRange: Record<TimeRange, MetricCard[]> = {
  "7d": [
    {
      title: "Total Revenue",
      value: "₫101M",
      rawValue: 101000000,
      change: "+9.3%",
      changeValue: 9.3,
      trend: "up",
      icon: "DollarSign",
      sub: "vs prev 7 days",
    },
    {
      title: "Total Orders",
      value: "278",
      rawValue: 278,
      change: "+6.1%",
      changeValue: 6.1,
      trend: "up",
      icon: "ShoppingCart",
      sub: "vs prev 7 days",
    },
    {
      title: "New Customers",
      value: "239",
      rawValue: 239,
      change: "+4.8%",
      changeValue: 4.8,
      trend: "up",
      icon: "Users",
      sub: "vs prev 7 days",
    },
    {
      title: "Products Sold",
      value: "614",
      rawValue: 614,
      change: "-1.2%",
      changeValue: -1.2,
      trend: "down",
      icon: "Package",
      sub: "vs prev 7 days",
    },
  ],
  "30d": [
    {
      title: "Total Revenue",
      value: "₫261.5M",
      rawValue: 261500000,
      change: "+12.5%",
      changeValue: 12.5,
      trend: "up",
      icon: "DollarSign",
      sub: "vs prev 30 days",
    },
    {
      title: "Total Orders",
      value: "1,234",
      rawValue: 1234,
      change: "+8.2%",
      changeValue: 8.2,
      trend: "up",
      icon: "ShoppingCart",
      sub: "vs prev 30 days",
    },
    {
      title: "Total Customers",
      value: "856",
      rawValue: 856,
      change: "+5.1%",
      changeValue: 5.1,
      trend: "up",
      icon: "Users",
      sub: "vs prev 30 days",
    },
    {
      title: "Products Sold",
      value: "3,456",
      rawValue: 3456,
      change: "-2.3%",
      changeValue: -2.3,
      trend: "down",
      icon: "Package",
      sub: "vs prev 30 days",
    },
  ],
  "90d": [
    {
      title: "Total Revenue",
      value: "₫660.5M",
      rawValue: 660500000,
      change: "+18.7%",
      changeValue: 18.7,
      trend: "up",
      icon: "DollarSign",
      sub: "vs prev 90 days",
    },
    {
      title: "Total Orders",
      value: "3,871",
      rawValue: 3871,
      change: "+14.3%",
      changeValue: 14.3,
      trend: "up",
      icon: "ShoppingCart",
      sub: "vs prev 90 days",
    },
    {
      title: "Total Customers",
      value: "2,431",
      rawValue: 2431,
      change: "+9.6%",
      changeValue: 9.6,
      trend: "up",
      icon: "Users",
      sub: "vs prev 90 days",
    },
    {
      title: "Products Sold",
      value: "9,218",
      rawValue: 9218,
      change: "+3.1%",
      changeValue: 3.1,
      trend: "up",
      icon: "Package",
      sub: "vs prev 90 days",
    },
  ],
  "1y": [
    {
      title: "Total Revenue",
      value: "₫2.45B",
      rawValue: 2450000000,
      change: "+23.4%",
      changeValue: 23.4,
      trend: "up",
      icon: "DollarSign",
      sub: "vs prev year",
    },
    {
      title: "Total Orders",
      value: "6,877",
      rawValue: 6877,
      change: "+19.2%",
      changeValue: 19.2,
      trend: "up",
      icon: "ShoppingCart",
      sub: "vs prev year",
    },
    {
      title: "Total Customers",
      value: "4,197",
      rawValue: 4197,
      change: "+31.5%",
      changeValue: 31.5,
      trend: "up",
      icon: "Users",
      sub: "vs prev year",
    },
    {
      title: "Products Sold",
      value: "16,441",
      rawValue: 16441,
      change: "+11.8%",
      changeValue: 11.8,
      trend: "up",
      icon: "Package",
      sub: "vs prev year",
    },
  ],
};

// ─── Main data getter ─────────────────────────────────────────────────────────

export function getAnalyticsSummary(
  range: TimeRange = "30d",
): AnalyticsSummary {
  return {
    metrics: metricsByRange[range],
    revenueData: revenueByRange[range],
    categoryData,
    topProducts,
    recentOrders,
    customerSegments,
    dailyTraffic,
    conversionRate: 6.4,
    avgOrderValue: 2120000,
    returnRate: 3.8,
  };
}

export async function fetchAnalytics(
  range: TimeRange = "30d",
): Promise<AnalyticsSummary> {
  return getAnalyticsSummary(range);
}
