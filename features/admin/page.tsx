"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Layers,
  Star,
  MoreHorizontal,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { getAdminDashboard } from "@/features/admin/api";
import { getProducts } from "@/features/products/api";
import { mockAdminDashboard } from "@/lib/api/mock-store/admin";
import { mockProducts } from "@/lib/api/mock-store/products";
import type { AdminDashboardData, AdminMetric } from "@/features/admin/types";
import type { Product } from "@/features/products/types";

// ─── Types ─────────────────────────────────────────────────────────────────────

type StockStatus = "Healthy" | "Low stock" | "Out of stock";
type ProductStatus = "Active" | "Low stock" | "Draft" | "Archived";

// ─── Config ───────────────────────────────────────────────────────────────────

const METRIC_ICONS: Record<string, LucideIcon> = {
  Revenue: DollarSign,
  Orders: ShoppingCart,
  Customers: Users,
  "Stock items": Package,
};

const STOCK_STATUS_CONFIG: Record<
  StockStatus,
  { label: string; icon: LucideIcon; className: string }
> = {
  Healthy: {
    label: "Healthy",
    icon: CheckCircle2,
    className:
      "text-emerald-700 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800 dark:bg-emerald-950",
  },
  "Low stock": {
    label: "Low stock",
    icon: AlertTriangle,
    className:
      "text-amber-700 border-amber-200 bg-amber-50 dark:text-amber-400 dark:border-amber-800 dark:bg-amber-950",
  },
  "Out of stock": {
    label: "Out of stock",
    icon: XCircle,
    className:
      "text-red-700 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-950",
  },
};

const PRODUCT_STATUS_CONFIG: Record<ProductStatus, { className: string }> = {
  Active: {
    className:
      "text-emerald-700 border-emerald-200 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800 dark:bg-emerald-950",
  },
  "Low stock": {
    className:
      "text-amber-700 border-amber-200 bg-amber-50 dark:text-amber-400 dark:border-amber-800 dark:bg-amber-950",
  },
  Draft: {
    className: "text-muted-foreground border-border bg-muted",
  },
  Archived: {
    className:
      "text-red-700 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-950",
  },
};

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

// ─── Chart data builder ────────────────────────────────────────────────────────

function buildChartData(products: Product[]) {
  const activeProducts = products.filter((p) => p.status !== "archived");
  const totalStock = activeProducts.reduce((sum, p) => sum + (p.stock ?? 0), 0);
  const lowStockCount = activeProducts.filter(
    (p) => (p.stock ?? 0) <= 12,
  ).length;
  const averageRating =
    activeProducts.reduce((sum, p) => sum + (p.rating ?? 0), 0) /
    Math.max(activeProducts.length, 1);

  const today = new Date();
  const baseDesktop = Math.round(totalStock * 0.72 + averageRating * 38);
  const baseMobile = Math.round(totalStock * 0.48 + averageRating * 30);

  return Array.from({ length: 90 }, (_, index) => {
    const pointDate = new Date(today);
    pointDate.setDate(today.getDate() - (89 - index));
    const weekday = pointDate.getDay();
    const weeklyWave = Math.sin(index / 3.4) * 26;
    const monthlyWave = Math.cos(index / 11.5) * 34;
    const campaignPulse =
      index > 14 && index < 24
        ? 58
        : index > 39 && index < 48
          ? 92
          : index > 66 && index < 76
            ? 74
            : 0;
    const weekendLift = weekday === 0 || weekday === 6 ? -18 : 0;
    const trend = index * 4.2;
    const stockPressure = lowStockCount * 3.5;

    return {
      date: pointDate.toISOString().slice(0, 10),
      desktop: Math.max(
        120,
        Math.round(
          baseDesktop +
            trend +
            weeklyWave +
            monthlyWave +
            campaignPulse +
            weekendLift -
            stockPressure,
        ),
      ),
      mobile: Math.max(
        80,
        Math.round(
          baseMobile +
            trend * 0.82 +
            weeklyWave * 0.78 +
            monthlyWave * 0.9 +
            campaignPulse * 0.72 +
            weekendLift * 0.7 -
            stockPressure * 0.65,
        ),
      ),
    };
  });
}

// ─── Derived product row ───────────────────────────────────────────────────────

function toProductStatus(product: Product): ProductStatus {
  if (product.status === "draft") return "Draft";
  if (product.status === "archived") return "Archived";
  if ((product.stock ?? 0) === 0) return "Low stock";
  if ((product.stock ?? 0) <= 12) return "Low stock";
  return "Active";
}

function toStockStatus(stock: number): StockStatus {
  if (stock === 0) return "Out of stock";
  if (stock <= 12) return "Low stock";
  return "Healthy";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({ metric, index }: { metric: AdminMetric; index: number }) {
  const Icon = METRIC_ICONS[metric.label] ?? Package;
  const hasChange =
    (metric.change && metric.change.startsWith("+")) ||
    metric.change?.startsWith("-");
  const isUp = metric.change?.startsWith("+");
  const isDown = metric.change?.startsWith("-");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {metric.label}
        </CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-2xl font-bold tracking-tight">{metric.value}</p>
        {metric.change && (
          <p
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              isUp && "text-emerald-600",
              isDown && "text-red-500",
              !hasChange && "text-muted-foreground",
            )}
          >
            {isUp && <ArrowUpRight className="h-3.5 w-3.5" />}
            {isDown && <ArrowDownRight className="h-3.5 w-3.5" />}
            {metric.change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function StockBadge({ stock }: { stock: number }) {
  const status = toStockStatus(stock);
  const cfg = STOCK_STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <Badge
      variant="outline"
      className={cn("gap-1 rounded-full text-xs", cfg.className)}
    >
      <Icon className="h-3 w-3" />
      {stock === 0 ? "Out" : stock}
    </Badge>
  );
}

// ─── Category summary ─────────────────────────────────────────────────────────

function CategoryBreakdown({ products }: { products: Product[] }) {
  const byCategory = useMemo(() => {
    const map: Record<string, { count: number; revenue: number }> = {};
    products.forEach((p) => {
      const key = p.categoryName ?? "Other";
      if (!map[key]) map[key] = { count: 0, revenue: 0 };
      map[key].count += 1;
      map[key].revenue += p.price * (p.stock ?? 0);
    });
    return Object.entries(map)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 6);
  }, [products]);

  const maxCount = Math.max(...byCategory.map(([, v]) => v.count));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Layers className="h-4 w-4 text-muted-foreground" />
          Categories
        </CardTitle>
        <CardDescription>Product distribution by category</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {byCategory.map(([name, { count }]) => (
          <div key={name} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{name}</span>
              <span className="font-medium">{count} products</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ─── Activity feed ─────────────────────────────────────────────────────────────

function ActivityFeed({
  activity,
}: {
  activity: AdminDashboardData["activity"];
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Recent activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0 p-0">
        {activity.map((item, idx) => (
          <div
            key={idx}
            className={cn(
              "flex gap-3 px-6 py-3.5",
              idx < activity.length - 1 && "border-b border-border/60",
            )}
          >
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-snug">{item.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground leading-snug">
                {item.detail}
              </p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {item.time}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ─── Product table ─────────────────────────────────────────────────────────────

function ProductTable({ products }: { products: Product[] }) {
  const rows = useMemo(
    () =>
      products.slice(0, 10).map((p) => ({
        product: p,
        status: toProductStatus(p),
        margin:
          p.cost && p.price
            ? Math.round(((p.price - p.cost) / p.price) * 100)
            : null,
      })),
    [products],
  );

  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Product catalog</CardTitle>
            <CardDescription>
              Top {rows.length} products — price, stock, and margin
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            View all
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_auto_auto] gap-3 border-b bg-muted/40 px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <span>Product</span>
          <span>Category</span>
          <span>Price</span>
          <span>Stock</span>
          <span className="w-16 text-right">Margin</span>
        </div>

        {/* Rows */}
        {rows.map(({ product: p, status, margin }, idx) => {
          const statusCfg = PRODUCT_STATUS_CONFIG[status];
          return (
            <div
              key={p.id}
              className={cn(
                "grid grid-cols-[2fr_1fr_1fr_auto_auto] items-center gap-3 px-5 py-3 text-sm transition-colors hover:bg-muted/40",
                idx < rows.length - 1 && "border-b border-border/40",
              )}
            >
              {/* Product name + brand */}
              <div className="min-w-0">
                <p className="truncate font-medium">{p.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {p.brand ?? "—"} · {p.sku ?? p.id}
                </p>
              </div>

              {/* Category */}
              <span className="truncate text-xs text-muted-foreground">
                {p.categoryName ?? "—"}
              </span>

              {/* Price */}
              <div>
                <span className="font-medium">${p.price.toFixed(2)}</span>
                {p.compareAtPrice && (
                  <span className="ml-1.5 text-xs text-muted-foreground line-through">
                    ${p.compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock badge */}
              <StockBadge stock={p.stock ?? 0} />

              {/* Margin */}
              <div className="w-16 text-right">
                {margin !== null ? (
                  <span
                    className={cn(
                      "text-xs font-medium",
                      margin >= 35
                        ? "text-emerald-600"
                        : margin >= 20
                          ? "text-amber-600"
                          : "text-red-500",
                    )}
                  >
                    {margin}%
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// ─── Chart section ─────────────────────────────────────────────────────────────

function TrafficChart({
  chartData,
}: {
  chartData: ReturnType<typeof buildChartData>;
}) {
  const [range, setRange] = useState<"7d" | "30d" | "90d">("30d");

  const sliced = useMemo(() => {
    const len = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    return chartData.slice(-len);
  }, [chartData, range]);

  const total = sliced.reduce((s, d) => s + d.desktop + d.mobile, 0);
  const avg = Math.round(total / sliced.length);

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="border-b pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-base">Traffic overview</CardTitle>
            <CardDescription>
              Desktop & mobile sessions — avg {avg.toLocaleString()} / day
            </CardDescription>
          </div>
          <div className="flex gap-1">
            {(["7d", "30d", "90d"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  range === r
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-transparent text-muted-foreground hover:bg-muted",
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={sliced}>
            <defs>
              <linearGradient id="gradDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="gradMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-muted"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              stroke="#888"
              tickFormatter={(v) => {
                const d = new Date(v);
                return `${d.getDate()}/${d.getMonth() + 1}`;
              }}
              interval={Math.floor(sliced.length / 6)}
            />
            <YAxis
              fontSize={11}
              tickLine={false}
              axisLine={false}
              stroke="#888"
              tickFormatter={(v) =>
                v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v
              }
            />
            <Tooltip
              contentStyle={tooltipStyle}
              labelFormatter={(v) => new Date(v).toLocaleDateString()}
              formatter={(value, name) => {
                const numeric = normalizeNumber(value);
                return [
                  numeric.toLocaleString(),
                  name === "desktop" ? "Desktop" : "Mobile",
                ];
              }}
            />
            <Area
              type="monotone"
              dataKey="desktop"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#gradDesktop)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="mobile"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#gradMobile)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: "hsl(var(--primary))" }}
            />
            Desktop
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500" />
            Mobile
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Top rated mini widget ─────────────────────────────────────────────────────

function TopRated({ products }: { products: Product[] }) {
  const top = useMemo(
    () =>
      [...products]
        .filter((p) => p.rating)
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        .slice(0, 5),
    [products],
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Star className="h-4 w-4 text-amber-500" />
          Top rated
        </CardTitle>
        <CardDescription>By average customer rating</CardDescription>
      </CardHeader>
      <CardContent className="space-y-0 p-0">
        {top.map((p, idx) => (
          <div
            key={p.id}
            className={cn(
              "flex items-center gap-3 px-6 py-3",
              idx < top.length - 1 && "border-b border-border/40",
            )}
          >
            <span className="w-4 shrink-0 text-xs font-bold text-muted-foreground">
              {idx + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.brand}</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-amber-600">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {p.rating?.toFixed(1)}
              <span className="text-muted-foreground">
                ({p.reviewCount?.toLocaleString()})
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function Page() {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getAdminDashboard,
  });
  const { data: productsData } = useQuery({
    queryKey: ["admin-products"],
    queryFn: getProducts,
  });

  const dashboardData = data ?? mockAdminDashboard;
  const products = productsData ?? mockProducts;
  const chartData = useMemo(() => buildChartData(products), [products]);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SidebarInset>
        <SiteHeader title="Admin Dashboard" />

        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
              {/* Page title row */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold">Overview</h1>
                  <p className="text-sm text-muted-foreground">
                    Store performance at a glance
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="gap-2"
                >
                  <RefreshCw
                    className={cn("h-3.5 w-3.5", isFetching && "animate-spin")}
                  />
                  Refresh
                </Button>
              </div>

              {/* Metric cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {dashboardData.metrics.map((m, i) => (
                  <MetricCard key={m.label} metric={m} index={i} />
                ))}
              </div>

              {/* Chart + Category breakdown */}
              <div className="grid gap-6 lg:grid-cols-3">
                <TrafficChart chartData={chartData} />
                <CategoryBreakdown products={products} />
              </div>

              {/* Activity + Top rated */}
              <div className="grid gap-6 lg:grid-cols-2">
                <ActivityFeed activity={dashboardData.activity} />
                <TopRated products={products} />
              </div>

              {/* Product table — full width */}
              <ProductTable products={products} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
