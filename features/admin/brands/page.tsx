"use client";

import { useState } from "react";
import {
  Bell,
  RefreshCw,
  Plus,
  Search,
  Store,
  Package,
  ShoppingCart,
  BarChart2,
  Star,
  Users,
  FileText,
  Settings,
  MoreHorizontal,
  Eye,
  Pencil,
  MoreVertical,
  Filter,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

type BrandStatus = "active" | "pending" | "inactive";
type PlatformKey = "shopee" | "lazada" | "tiki" | "sendo";
type TabKey = "all" | BrandStatus;

interface Brand {
  id: number;
  emoji: string;
  name: string;
  category: string;
  platforms: PlatformKey[];
  products: number;
  revenue: string;
  score: number;
  status: BrandStatus;
  updatedAt: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const BRANDS: Brand[] = [
  {
    id: 1,
    emoji: "👟",
    name: "Biti's Hunter",
    category: "Giày dép",
    platforms: ["shopee", "lazada", "tiki"],
    products: 1240,
    revenue: "823 tr",
    score: 92,
    status: "active",
    updatedAt: "2 giờ trước",
  },
  {
    id: 2,
    emoji: "💄",
    name: "Shiseido Vietnam",
    category: "Mỹ phẩm",
    platforms: ["shopee", "lazada"],
    products: 340,
    revenue: "641 tr",
    score: 88,
    status: "active",
    updatedAt: "4 giờ trước",
  },
  {
    id: 3,
    emoji: "📱",
    name: "Samsung Electronics",
    category: "Điện tử",
    platforms: ["shopee", "lazada", "tiki", "sendo"],
    products: 890,
    revenue: "1.2 tỷ",
    score: 95,
    status: "active",
    updatedAt: "1 giờ trước",
  },
  {
    id: 4,
    emoji: "👕",
    name: "Canifa Fashion",
    category: "Thời trang",
    platforms: ["shopee", "tiki"],
    products: 2100,
    revenue: "390 tr",
    score: 79,
    status: "active",
    updatedAt: "6 giờ trước",
  },
  {
    id: 5,
    emoji: "🍵",
    name: "Trung Nguyên Legend",
    category: "Thực phẩm",
    platforms: ["shopee", "lazada"],
    products: 156,
    revenue: "210 tr",
    score: 83,
    status: "pending",
    updatedAt: "1 ngày trước",
  },
  {
    id: 6,
    emoji: "🏃",
    name: "Nike Vietnam",
    category: "Thể thao",
    platforms: ["shopee", "tiki"],
    products: 780,
    revenue: "540 tr",
    score: 91,
    status: "active",
    updatedAt: "3 giờ trước",
  },
  {
    id: 7,
    emoji: "🛋️",
    name: "JYSK Furniture",
    category: "Nội thất",
    platforms: ["tiki", "sendo"],
    products: 430,
    revenue: "175 tr",
    score: 71,
    status: "pending",
    updatedAt: "2 ngày trước",
  },
  {
    id: 8,
    emoji: "💊",
    name: "Dược Hậu Giang",
    category: "Dược phẩm",
    platforms: ["shopee", "lazada", "tiki"],
    products: 95,
    revenue: "88 tr",
    score: 62,
    status: "inactive",
    updatedAt: "5 ngày trước",
  },
];

const CHART_DATA = {
  days: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
  shopee: [320, 410, 370, 520, 480, 610, 540],
  lazada: [210, 270, 240, 330, 300, 390, 360],
  tiki: [150, 180, 160, 250, 220, 280, 260],
};

const TOP_BRANDS = [
  { emoji: "👟", name: "Biti's Hunter", category: "Giày dép", revenue: "823tr", pct: "+11%", up: true },
  { emoji: "💄", name: "Shiseido VN", category: "Mỹ phẩm", revenue: "641tr", pct: "+7%", up: true },
  { emoji: "📱", name: "Samsung VN", category: "Điện tử", revenue: "1.2 tỷ", pct: "+15%", up: true },
  { emoji: "👕", name: "Canifa", category: "Thời trang", revenue: "390tr", pct: "-2%", up: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<BrandStatus, { label: string; className: string }> = {
  active: { label: "Hoạt động", className: "bg-green-50 text-green-800 border-green-200" },
  pending: { label: "Chờ duyệt", className: "bg-amber-50 text-amber-800 border-amber-200" },
  inactive: { label: "Tạm dừng", className: "bg-gray-100 text-gray-600 border-gray-200" },
};

const PLATFORM_CONFIG: Record<PlatformKey, { label: string; className: string }> = {
  shopee: { label: "Shopee", className: "bg-orange-50 text-orange-700 border-orange-200" },
  lazada: { label: "Lazada", className: "bg-pink-50 text-pink-700 border-pink-200" },
  tiki: { label: "Tiki", className: "bg-blue-50 text-blue-700 border-blue-200" },
  sendo: { label: "Sendo", className: "bg-green-50 text-green-700 border-green-200" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 85 ? "bg-emerald-500" : score >= 70 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-gray-100 overflow-hidden">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs text-muted-foreground w-6">{score}</span>
    </div>
  );
}

function BarChart() {
  const max = Math.max(...CHART_DATA.shopee, ...CHART_DATA.lazada, ...CHART_DATA.tiki);
  return (
    <div>
      <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-orange-500" />
          Shopee
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-pink-500" />
          Lazada
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-blue-500" />
          Tiki
        </span>
      </div>
      <div className="flex items-end gap-2 h-24">
        {CHART_DATA.days.map((day, i) => (
          <div key={day} className="flex flex-col items-center gap-1 flex-1">
            <div className="flex items-end gap-0.5 w-full h-20">
              {(
                [
                  { val: CHART_DATA.shopee[i], color: "bg-orange-500" },
                  { val: CHART_DATA.lazada[i], color: "bg-pink-500" },
                  { val: CHART_DATA.tiki[i], color: "bg-blue-500" },
                ] as const
              ).map(({ val, color }, j) => (
                <div
                  key={j}
                  className={cn("flex-1 rounded-t-sm transition-opacity hover:opacity-70", color)}
                  style={{ height: `${Math.round((val / max) * 76)}px` }}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BrandManagementPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [activePlatform, setActivePlatform] = useState<PlatformKey | "all">("all");
  const [search, setSearch] = useState("");

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: "all", label: "Tất cả", count: BRANDS.length },
    { key: "active", label: "Đang hoạt động", count: BRANDS.filter((b) => b.status === "active").length },
    { key: "pending", label: "Chờ duyệt", count: BRANDS.filter((b) => b.status === "pending").length },
    { key: "inactive", label: "Tạm dừng", count: BRANDS.filter((b) => b.status === "inactive").length },
  ];

  const platforms: { key: PlatformKey | "all"; label: string }[] = [
    { key: "all", label: "Tất cả sàn" },
    { key: "shopee", label: "Shopee" },
    { key: "lazada", label: "Lazada" },
    { key: "tiki", label: "Tiki" },
    { key: "sendo", label: "Sendo" },
  ];

  const filteredBrands = BRANDS.filter((b) => {
    const matchTab = activeTab === "all" || b.status === activeTab;
    const matchPlatform = activePlatform === "all" || b.platforms.includes(activePlatform as PlatformKey);
    const matchSearch =
      search === "" ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchPlatform && matchSearch;
  });

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-sm overflow-hidden">
      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 h-[52px] px-6 flex items-center gap-4 shrink-0">
          <h1 className="text-base font-medium text-gray-900 flex-1">Quản lý thương hiệu</h1>
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 w-56">
            <Search size={13} className="text-gray-400" />
            <input
              className="bg-transparent text-[13px] text-gray-700 outline-none placeholder:text-gray-400 flex-1"
              placeholder="Tìm thương hiệu, sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <button className="relative w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 border border-white" />
            </button>
            <button className="w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
              <RefreshCw size={14} />
            </button>
            <Button size="sm" className="bg-[#1a1a2e] hover:bg-[#2d2d4a] text-white h-8 text-[13px] gap-1.5">
              <Plus size={14} />
              Thêm thương hiệu
            </Button>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Metrics */}
          <div className="grid grid-cols-4 gap-3">
            {[
              {
                label: "Tổng thương hiệu",
                value: "248",
                change: "+12%",
                up: true,
                sub: "so với tháng trước",
                icon: Store,
                iconBg: "bg-blue-50",
                iconColor: "text-blue-600",
              },
              {
                label: "Doanh thu tháng",
                value: "4.7 tỷ",
                change: "+8.3%",
                up: true,
                sub: "so với tháng trước",
                icon: DollarSign,
                iconBg: "bg-emerald-50",
                iconColor: "text-emerald-600",
              },
              {
                label: "Đơn hàng chờ",
                value: "1,430",
                change: "+3.1%",
                up: false,
                sub: "tăng so với hôm qua",
                icon: Clock,
                iconBg: "bg-amber-50",
                iconColor: "text-amber-600",
              },
              {
                label: "Vi phạm chính sách",
                value: "14",
                change: "+2",
                up: false,
                sub: "cần xử lý ngay",
                icon: AlertTriangle,
                iconBg: "bg-red-50",
                iconColor: "text-red-500",
              },
            ].map(({ label, value, change, up, sub, icon: Icon, iconBg, iconColor }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs text-gray-500">{label}</span>
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", iconBg)}>
                    <Icon size={14} className={iconColor} />
                  </div>
                </div>
                <p className="text-2xl font-medium text-gray-900 leading-none mb-1.5">{value}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded font-medium",
                      up
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-600"
                    )}
                  >
                    {up ? <TrendingUp size={9} className="inline mr-0.5" /> : <TrendingDown size={9} className="inline mr-0.5" />}
                    {change}
                  </span>
                  {sub}
                </div>
              </div>
            ))}
          </div>

          {/* Chart + Top brands */}
          <div className="grid grid-cols-[1fr_300px] gap-3">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[14px] font-medium text-gray-900">Doanh thu theo sàn (7 ngày)</h2>
                <button className="text-xs text-blue-600 hover:underline">Chi tiết →</button>
              </div>
              <BarChart />
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[14px] font-medium text-gray-900">Top thương hiệu</h2>
                <button className="text-xs text-blue-600 hover:underline">Xem tất cả</button>
              </div>
              <div className="space-y-0.5">
                {TOP_BRANDS.map((b) => (
                  <div
                    key={b.name}
                    className="flex items-center gap-2.5 py-2 px-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-base shrink-0">
                      {b.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-gray-900 truncate">{b.name}</p>
                      <p className="text-[11px] text-gray-400">{b.category}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[13px] font-medium text-gray-900">{b.revenue}</p>
                      <span
                        className={cn(
                          "text-[10px] font-medium px-1.5 py-0.5 rounded",
                          b.up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                        )}
                      >
                        {b.pct}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table panel */}
          <div className="bg-white rounded-xl border border-gray-100">
            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-4">
              {tabs.map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-3 text-[13px] border-b-2 transition-colors -mb-px",
                    activeTab === key
                      ? "border-[#1a1a2e] text-gray-900 font-medium"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                >
                  {label}
                  {count !== undefined && (
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                        activeTab === key
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-500"
                      )}
                    >
                      {count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Platform filters */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
              {platforms.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActivePlatform(key as PlatformKey | "all")}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[12px] border transition-all",
                    activePlatform === key
                      ? "bg-[#1a1a2e] text-white border-[#1a1a2e]"
                      : "text-gray-500 border-gray-200 hover:bg-gray-50"
                  )}
                >
                  {label}
                </button>
              ))}
              <div className="ml-auto flex gap-2">
                <button className="flex items-center gap-1.5 text-[12px] text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
                  <Filter size={12} />
                  Lọc
                </button>
                <button className="flex items-center gap-1.5 text-[12px] text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
                  <ArrowUpDown size={12} />
                  Sắp xếp
                </button>
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-gray-100">
                  <TableHead className="text-[11px] font-medium text-gray-400 uppercase tracking-wider py-2.5">
                    Thương hiệu
                  </TableHead>
                  <TableHead className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Sàn</TableHead>
                  <TableHead className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Sản phẩm</TableHead>
                  <TableHead className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Doanh thu</TableHead>
                  <TableHead className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                    Điểm uy tín
                  </TableHead>
                  <TableHead className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                    Trạng thái
                  </TableHead>
                  <TableHead className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                    Cập nhật
                  </TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrands.map((brand) => {
                  const st = STATUS_CONFIG[brand.status];
                  return (
                    <TableRow
                      key={brand.id}
                      className="cursor-pointer hover:bg-gray-50/60 border-gray-100 transition-colors"
                    >
                      {/* Brand */}
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-base shrink-0">
                            {brand.emoji}
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-gray-900">{brand.name}</p>
                            <p className="text-[11px] text-gray-400">{brand.category}</p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Platforms */}
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {brand.platforms.map((p) => {
                            const cfg = PLATFORM_CONFIG[p];
                            return (
                              <span
                                key={p}
                                className={cn(
                                  "text-[10px] px-1.5 py-0.5 rounded border font-medium",
                                  cfg.className
                                )}
                              >
                                {cfg.label}
                              </span>
                            );
                          })}
                        </div>
                      </TableCell>

                      {/* Products */}
                      <TableCell className="text-[13px] text-gray-500">
                        {brand.products.toLocaleString()}
                      </TableCell>

                      {/* Revenue */}
                      <TableCell className="text-[13px] font-medium text-gray-900">
                        {brand.revenue}
                      </TableCell>

                      {/* Score */}
                      <TableCell>
                        <ScoreBar score={brand.score} />
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("text-[11px] font-medium border gap-1", st.className)}
                        >
                          <span
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              brand.status === "active"
                                ? "bg-emerald-500"
                                : brand.status === "pending"
                                ? "bg-amber-500"
                                : "bg-gray-400"
                            )}
                          />
                          {st.label}
                        </Badge>
                      </TableCell>

                      {/* Updated */}
                      <TableCell className="text-[12px] text-gray-400">{brand.updatedAt}</TableCell>

                      {/* Actions */}
                      <TableCell>
                        <div className="flex gap-1 justify-end">
                          {[Eye, Pencil, MoreVertical].map((Icon, i) => (
                            <button
                              key={i}
                              className="w-6 h-6 rounded-md border border-gray-150 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                            >
                              <Icon size={12} />
                            </button>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {filteredBrands.length === 0 && (
              <div className="py-16 text-center text-gray-400 text-sm">
                Không có thương hiệu nào phù hợp.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}