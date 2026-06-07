"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2,
  Activity,
  Target,
  Repeat2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/lib/utils/currency";
import { fetchAnalytics } from "./api";
import type { TimeRange, MetricCard, RecentOrder } from "./types";

// ─── Icon map (avoids dynamic component resolution) ───────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
};

// ─── Status config ─────────────────────────────────────────────────────────────

const ORDER_STATUS_CLASS: Record<RecentOrder["status"], string> = {
  completed:
    "text-emerald-700 border-emerald-300 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800 dark:bg-emerald-950",
  processing:
    "text-blue-700 border-blue-300 bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:bg-blue-950",
  shipped:
    "text-purple-700 border-purple-300 bg-purple-50 dark:text-purple-400 dark:border-purple-800 dark:bg-purple-950",
  pending:
    "text-amber-700 border-amber-300 bg-amber-50 dark:text-amber-400 dark:border-amber-800 dark:bg-amber-950",
  cancelled:
    "text-red-700 border-red-300 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-950",
};

const ORDER_STATUS_LABEL: Record<RecentOrder["status"], string> = {
  completed: "Completed",
  processing: "Processing",
  shipped: "Shipped",
  pending: "Pending",
  cancelled: "Cancelled",
};

// ─── Tooltip style ─────────────────────────────────────────────────────────────

const tooltipStyle = {
  backgroundColor: "var(--background)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  fontSize: "12px",
};

const normalizeNumber = (value: unknown): number => {
  if (Array.isArray(value)) {
    return normalizeNumber(value[0]);
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return Number(value);
  }

  return Number(value ?? 0);
};

// ─── KPI mini cards ────────────────────────────────────────────────────────────

function KpiRow({
  conversionRate,
  avgOrderValue,
  returnRate,
}: {
  conversionRate: number;
  avgOrderValue: number;
  returnRate: number;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {[
        {
          icon: Target,
          label: "Conversion rate",
          value: `${conversionRate}%`,
          sub: "visits → orders",
          positive: true,
        },
        {
          icon: BarChart2,
          label: "Avg. order value",
          value: formatCurrency(avgOrderValue, "VND"),
          sub: "per transaction",
          positive: true,
        },
        {
          icon: Repeat2,
          label: "Return rate",
          value: `${returnRate}%`,
          sub: "of fulfilled orders",
          positive: false,
        },
      ].map(({ icon: Icon, label, value, sub, positive }) => (
        <Card key={label} className="bg-muted/40">
          <CardContent className="flex items-center gap-3 p-4">
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                positive
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                  : "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-base font-semibold leading-snug">{value}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["analytics", timeRange],
    queryFn: () => fetchAnalytics(timeRange),
    staleTime: 60_000,
  });

  const handleRefresh = () => refetch();

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const {
    metrics,
    revenueData,
    categoryData,
    topProducts,
    recentOrders,
    customerSegments,
    dailyTraffic,
    conversionRate,
    avgOrderValue,
    returnRate,
  } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Track your store performance and insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={timeRange}
            onValueChange={(v) => setTimeRange(v as TimeRange)}
          >
            <SelectTrigger className="w-[148px]">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isFetching}
          >
            <RefreshCw
              className={cn("h-4 w-4", isFetching && "animate-spin")}
            />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric: MetricCard) => {
          const Icon = ICON_MAP[metric.icon] ?? DollarSign;
          const isUp = metric.trend === "up";
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold">{metric.value}</span>
                  <span
                    className={cn(
                      "flex items-center gap-0.5 text-xs font-medium",
                      isUp ? "text-emerald-600" : "text-red-500",
                    )}
                  >
                    {isUp ? (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    )}
                    {metric.change}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{metric.sub}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* KPI row */}
      <KpiRow
        conversionRate={conversionRate}
        avgOrderValue={avgOrderValue}
        returnRate={returnRate}
      />

      {/* Revenue + Category */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue area chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Revenue and order volume over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={revenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E40F2A" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#E40F2A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="rev"
                  orientation="left"
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) =>
                    v >= 1000000000
                      ? `${(v / 1000000000).toFixed(1)}B`
                      : `${(v / 1000000).toFixed(0)}M`
                  }
                />
                <YAxis
                  yAxisId="ord"
                  orientation="right"
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value, name) => {
                    const numeric = normalizeNumber(value);
                    return name === "revenue"
                      ? [formatCurrency(numeric, "VND"), "Revenue"]
                      : [formatNumber(numeric), "Orders"];
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area
                  yAxisId="rev"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#E40F2A"
                  strokeWidth={2}
                  fill="url(#revGrad)"
                  dot={{ fill: "#E40F2A", r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Bar
                  yAxisId="ord"
                  dataKey="orders"
                  fill="#3B82F6"
                  opacity={0.7}
                  radius={[3, 3, 0, 0]}
                  barSize={14}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category pie */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Distribution this period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={82}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => {
                    const numeric = normalizeNumber(value);
                    return [`${numeric}%`, "Share"];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 space-y-2">
              {categoryData.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ background: c.color }}
                    />
                    <span className="text-muted-foreground">{c.name}</span>
                  </div>
                  <span className="font-medium">{c.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic + Customer segments */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily traffic */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Traffic</CardTitle>
            <CardDescription>Visits and conversions this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={dailyTraffic} barGap={4}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value, name) => {
                    const numeric = normalizeNumber(value);
                    return [
                      formatNumber(numeric),
                      name === "visits" ? "Visits" : "Conversions",
                    ];
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar
                  dataKey="visits"
                  fill="#3B82F6"
                  opacity={0.8}
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="conversions"
                  fill="#E40F2A"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customer segments */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
            <CardDescription>Revenue breakdown by tier</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {customerSegments.map((seg) => {
              const totalRevenue = customerSegments.reduce(
                (s, c) => s + c.revenue,
                0,
              );
              const pct = Math.round((seg.revenue / totalRevenue) * 100);
              return (
                <div key={seg.segment} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ background: seg.color }}
                      />
                      <span className="font-medium">{seg.segment}</span>
                      <span className="text-muted-foreground">
                        {formatNumber(seg.count)} customers
                      </span>
                    </div>
                    <span className="text-xs font-medium">
                      {formatCurrency(seg.revenue, "VND")}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: seg.color }}
                    />
                  </div>
                  <p className="text-right text-xs text-muted-foreground">
                    {pct}% of revenue
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Top products + Recent orders */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Ranked by revenue this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      index < 3
                        ? "bg-[#E40F2A] text-white"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(product.sales)} sold
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatCurrency(product.revenue, "VND")}
                    </p>
                    <p
                      className={cn(
                        "flex items-center justify-end gap-0.5 text-xs font-medium",
                        product.growth >= 0
                          ? "text-emerald-600"
                          : "text-red-500",
                      )}
                    >
                      {product.growth >= 0 ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {Math.abs(product.growth)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Latest transactions across the store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {recentOrders.map((order, idx) => (
                <div
                  key={order.id}
                  className={cn(
                    "flex items-center justify-between py-3",
                    idx < recentOrders.length - 1 &&
                      "border-b border-border/60",
                  )}
                >
                  <div>
                    <p className="font-mono text-sm font-medium">#{order.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.customer} · {order.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatCurrency(order.total, "VND")}
                    </p>
                    <Badge
                      variant="outline"
                      className={cn(
                        "mt-0.5 rounded-full text-xs",
                        ORDER_STATUS_CLASS[order.status],
                      )}
                    >
                      {ORDER_STATUS_LABEL[order.status]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders trend bar chart — full width */}
      <Card>
        <CardHeader>
          <CardTitle>Orders Trend</CardTitle>
          <CardDescription>
            Order volume and customer acquisition over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={revenueData}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="left"
                stroke="#888888"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#888888"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name) => {
                  const numeric = normalizeNumber(value);
                  return [
                    formatNumber(numeric),
                    name === "orders" ? "Orders" : "Customers",
                  ];
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                yAxisId="left"
                dataKey="orders"
                fill="#E40F2A"
                radius={[4, 4, 0, 0]}
                opacity={0.85}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="customers"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: "#3B82F6", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
