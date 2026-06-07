"use client";

import { useState, useMemo } from "react";
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
  Trash2,
  MoreVertical,
  Filter,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Tag,
  Ticket,
  Percent,
  Gift,
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  Flame,
  Zap,
  Target,
  BadgePercent,
  Copy,
  Headphones,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  ShoppingBag,
  Users2,
  CircleDollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminPagination, usePagination, paginateData } from "@/components/admin/AdminPagination";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type PromoStatus = "active" | "scheduled" | "ended" | "draft" | "paused";
type PromoType = "discount" | "voucher" | "flash_sale" | "bundle" | "gift";
type TabKey = "all" | PromoStatus;
type TypeFilter = "all" | PromoType;

interface Promotion {
  id: string;
  name: string;
  type: PromoType;
  status: PromoStatus;
  brandName: string;
  brandEmoji: string;
  platform: ("shopee" | "lazada" | "tiki" | "sendo")[];
  discountValue: string;
  discountType: "percent" | "fixed";
  minOrder: string;
  budget: string;
  budgetUsed: number; // percent
  usageCount: number;
  usageLimit: number;
  startDate: string;
  endDate: string;
  revenue: string;
  orders: number;
  conversionRate: number;
  isHot: boolean;
  code?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PROMOTIONS: Promotion[] = [
  {
    id: "PRO-1041",
    name: "Flash Sale Cuối Tuần",
    type: "flash_sale",
    status: "active",
    brandName: "Samsung Electronics",
    brandEmoji: "📱",
    platform: ["shopee", "lazada"],
    discountValue: "40%",
    discountType: "percent",
    minOrder: "500k",
    budget: "120 tr",
    budgetUsed: 68,
    usageCount: 1840,
    usageLimit: 3000,
    startDate: "Hôm nay 00:00",
    endDate: "CN 23:59",
    revenue: "82 tr",
    orders: 1840,
    conversionRate: 14.2,
    isHot: true,
    code: undefined,
  },
  {
    id: "PRO-1040",
    name: "Voucher Mã BITIS50",
    type: "voucher",
    status: "active",
    brandName: "Biti's Hunter",
    brandEmoji: "👟",
    platform: ["shopee"],
    discountValue: "50k",
    discountType: "fixed",
    minOrder: "299k",
    budget: "50 tr",
    budgetUsed: 42,
    usageCount: 4200,
    usageLimit: 10000,
    startDate: "01/06/2026",
    endDate: "30/06/2026",
    revenue: "21 tr",
    orders: 4200,
    conversionRate: 9.8,
    isHot: false,
    code: "BITIS50",
  },
  {
    id: "PRO-1039",
    name: "Combo Dưỡng Da Mùa Hè",
    type: "bundle",
    status: "active",
    brandName: "Shiseido Vietnam",
    brandEmoji: "💄",
    platform: ["lazada", "tiki"],
    discountValue: "25%",
    discountType: "percent",
    minOrder: "800k",
    budget: "80 tr",
    budgetUsed: 55,
    usageCount: 980,
    usageLimit: 2000,
    startDate: "15/05/2026",
    endDate: "15/07/2026",
    revenue: "44 tr",
    orders: 980,
    conversionRate: 11.4,
    isHot: false,
    code: undefined,
  },
  {
    id: "PRO-1038",
    name: "Tặng Quà Sinh Nhật",
    type: "gift",
    status: "scheduled",
    brandName: "Nike Vietnam",
    brandEmoji: "🏃",
    platform: ["shopee", "tiki"],
    discountValue: "Tặng quà",
    discountType: "percent",
    minOrder: "1.2 tr",
    budget: "60 tr",
    budgetUsed: 0,
    usageCount: 0,
    usageLimit: 500,
    startDate: "10/07/2026",
    endDate: "10/08/2026",
    revenue: "0",
    orders: 0,
    conversionRate: 0,
    isHot: false,
    code: undefined,
  },
  {
    id: "PRO-1037",
    name: "Giảm 30% Toàn Bộ Áo",
    type: "discount",
    status: "active",
    brandName: "Canifa Fashion",
    brandEmoji: "👕",
    platform: ["shopee", "lazada", "tiki", "sendo"],
    discountValue: "30%",
    discountType: "percent",
    minOrder: "200k",
    budget: "40 tr",
    budgetUsed: 81,
    usageCount: 6500,
    usageLimit: 8000,
    startDate: "01/06/2026",
    endDate: "20/06/2026",
    revenue: "32.4 tr",
    orders: 6500,
    conversionRate: 18.7,
    isHot: true,
    code: undefined,
  },
  {
    id: "PRO-1036",
    name: "Sale Hè NEON50",
    type: "voucher",
    status: "paused",
    brandName: "Nike Vietnam",
    brandEmoji: "🏃",
    platform: ["tiki"],
    discountValue: "50k",
    discountType: "fixed",
    minOrder: "500k",
    budget: "25 tr",
    budgetUsed: 30,
    usageCount: 1500,
    usageLimit: 5000,
    startDate: "01/06/2026",
    endDate: "30/06/2026",
    revenue: "7.5 tr",
    orders: 1500,
    conversionRate: 6.2,
    isHot: false,
    code: "NEON50",
  },
  {
    id: "PRO-1035",
    name: "Flash Sale 11/6",
    type: "flash_sale",
    status: "scheduled",
    brandName: "Trung Nguyên Legend",
    brandEmoji: "🍵",
    platform: ["shopee", "lazada"],
    discountValue: "35%",
    discountType: "percent",
    minOrder: "150k",
    budget: "30 tr",
    budgetUsed: 0,
    usageCount: 0,
    usageLimit: 2000,
    startDate: "11/06/2026 00:00",
    endDate: "11/06/2026 23:59",
    revenue: "0",
    orders: 0,
    conversionRate: 0,
    isHot: false,
    code: undefined,
  },
  {
    id: "PRO-1034",
    name: "Mua 2 Tặng 1 Vitamin",
    type: "bundle",
    status: "ended",
    brandName: "Dược Hậu Giang",
    brandEmoji: "💊",
    platform: ["shopee"],
    discountValue: "33%",
    discountType: "percent",
    minOrder: "200k",
    budget: "20 tr",
    budgetUsed: 100,
    usageCount: 3200,
    usageLimit: 3200,
    startDate: "01/05/2026",
    endDate: "31/05/2026",
    revenue: "20 tr",
    orders: 3200,
    conversionRate: 22.1,
    isHot: false,
    code: undefined,
  },
  {
    id: "PRO-1033",
    name: "Siêu Ưu Đãi 6/6",
    type: "flash_sale",
    status: "draft",
    brandName: "JYSK Furniture",
    brandEmoji: "🛋️",
    platform: ["tiki", "sendo"],
    discountValue: "45%",
    discountType: "percent",
    minOrder: "2 tr",
    budget: "100 tr",
    budgetUsed: 0,
    usageCount: 0,
    usageLimit: 1000,
    startDate: "Chưa lên lịch",
    endDate: "Chưa lên lịch",
    revenue: "0",
    orders: 0,
    conversionRate: 0,
    isHot: false,
    code: undefined,
  },
  {
    id: "PRO-1032",
    name: "Khuyến Mãi Thành Viên VIP",
    type: "discount",
    status: "active",
    brandName: "Biti's Hunter",
    brandEmoji: "👟",
    platform: ["shopee", "lazada"],
    discountValue: "20%",
    discountType: "percent",
    minOrder: "0",
    budget: "150 tr",
    budgetUsed: 24,
    usageCount: 8900,
    usageLimit: 50000,
    startDate: "01/01/2026",
    endDate: "31/12/2026",
    revenue: "36 tr",
    orders: 8900,
    conversionRate: 7.3,
    isHot: false,
    code: undefined,
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<PromoStatus, { label: string; dot: string; className: string }> = {
  active:    { label: "Đang chạy",   dot: "bg-emerald-500", className: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  scheduled: { label: "Sắp diễn ra", dot: "bg-blue-500",    className: "bg-blue-50 text-blue-700 border-blue-200" },
  paused:    { label: "Tạm dừng",    dot: "bg-amber-400",   className: "bg-amber-50 text-amber-700 border-amber-200" },
  ended:     { label: "Đã kết thúc", dot: "bg-gray-400",    className: "bg-gray-100 text-gray-600 border-gray-200" },
  draft:     { label: "Bản nháp",    dot: "bg-violet-400",  className: "bg-violet-50 text-violet-700 border-violet-200" },
};

const TYPE_CONFIG: Record<PromoType, { label: string; emoji: string; className: string; icon: React.ElementType }> = {
  flash_sale: { label: "Flash Sale",    emoji: "⚡",  className: "bg-orange-50 text-orange-700 border-orange-200", icon: Zap },
  voucher:    { label: "Voucher",       emoji: "🎟️", className: "bg-pink-50 text-pink-700 border-pink-200",       icon: Ticket },
  discount:   { label: "Giảm giá",     emoji: "🏷️", className: "bg-blue-50 text-blue-700 border-blue-200",       icon: Tag },
  bundle:     { label: "Combo",        emoji: "📦", className: "bg-teal-50 text-teal-700 border-teal-200",        icon: Package },
  gift:       { label: "Tặng quà",     emoji: "🎁", className: "bg-rose-50 text-rose-700 border-rose-200",       icon: Gift },
};

const PLATFORM_CONFIG = {
  shopee: { label: "Shopee", className: "bg-orange-50 text-orange-700 border-orange-200" },
  lazada: { label: "Lazada", className: "bg-pink-50 text-pink-700 border-pink-200" },
  tiki:   { label: "Tiki",   className: "bg-blue-50 text-blue-700 border-blue-200" },
  sendo:  { label: "Sendo",  className: "bg-green-50 text-green-700 border-green-200" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function BudgetBar({ used, status }: { used: number; status: PromoStatus }) {
  const color =
    used >= 90 ? "bg-red-400" :
    used >= 70 ? "bg-amber-400" :
    status === "active" ? "bg-emerald-400" : "bg-gray-300";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-gray-100 overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${used}%` }} />
      </div>
      <span className="text-[11px] text-gray-500 w-7">{used}%</span>
    </div>
  );
}

function MiniDonut({ pct, color }: { pct: number; color: string }) {
  const r = 14; const c = 2 * Math.PI * r;
  return (
    <svg width="36" height="36" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r={r} fill="none" stroke="#f3f4f6" strokeWidth="4" />
      <circle cx="18" cy="18" r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={`${(pct / 100) * c} ${c}`}
        strokeLinecap="round" transform="rotate(-90 18 18)" />
      <text x="18" y="22" textAnchor="middle" fontSize="8" fontWeight="500" fill="#374151">{pct}%</text>
    </svg>
  );
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values); const min = Math.min(...values); const range = max - min || 1;
  const W = 80; const H = 28;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * W},${H - ((v - min) / range) * H}`);
  return (
    <svg width={W} height={H}>
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PromotionsManagementPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Promotion | null>(null);
  const { state: paginationState, onStateChange: onPaginationChange, reset: resetPagination } = usePagination({ pageSize: 10 });

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all",       label: "Tất cả" },
    { key: "active",    label: "Đang chạy" },
    { key: "scheduled", label: "Sắp diễn ra" },
    { key: "paused",    label: "Tạm dừng" },
    { key: "draft",     label: "Bản nháp" },
    { key: "ended",     label: "Đã kết thúc" },
  ];

  const tabCounts: Record<TabKey, number> = {
    all:       PROMOTIONS.length,
    active:    PROMOTIONS.filter(p => p.status === "active").length,
    scheduled: PROMOTIONS.filter(p => p.status === "scheduled").length,
    paused:    PROMOTIONS.filter(p => p.status === "paused").length,
    draft:     PROMOTIONS.filter(p => p.status === "draft").length,
    ended:     PROMOTIONS.filter(p => p.status === "ended").length,
  };

  const typeFilters: { key: TypeFilter; label: string }[] = [
    { key: "all",        label: "Tất cả loại" },
    { key: "flash_sale", label: "⚡ Flash Sale" },
    { key: "voucher",    label: "🎟️ Voucher" },
    { key: "discount",   label: "🏷️ Giảm giá" },
    { key: "bundle",     label: "📦 Combo" },
    { key: "gift",       label: "🎁 Tặng quà" },
  ];

  // Filter promotions based on tab, type, and search
  const filtered = useMemo(() => {
    return PROMOTIONS.filter(p => {
      const matchTab  = activeTab === "all" || p.status === activeTab;
      const matchType = typeFilter === "all" || p.type === typeFilter;
      const matchSearch =
        search === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brandName.toLowerCase().includes(search.toLowerCase()) ||
        (p.code ?? "").toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchType && matchSearch;
    });
  }, [activeTab, typeFilter, search]);

  // Reset pagination when filters change
  useMemo(() => {
    resetPagination();
  }, [activeTab, typeFilter, search, resetPagination]);

  // Paginate filtered data
  const paginatedPromotions = useMemo(() => {
    return paginateData(filtered, paginationState.page, paginationState.pageSize);
  }, [filtered, paginationState]);

  const totalRevenue = "215.9 tr";
  const totalOrders = PROMOTIONS.reduce((s, p) => s + p.orders, 0);
  const activeCount = tabCounts.active;
  const avgConversion = (PROMOTIONS.filter(p => p.conversionRate > 0).reduce((s, p) => s + p.conversionRate, 0) / PROMOTIONS.filter(p => p.conversionRate > 0).length).toFixed(1);

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-sm overflow-hidden">
      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 h-[52px] px-6 flex items-center gap-4 shrink-0">
          <h1 className="text-base font-medium text-gray-900 flex-1">Khuyến mãi & Ưu đãi</h1>
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 w-60">
            <Search size={13} className="text-gray-400" />
            <input
              className="bg-transparent text-[13px] text-gray-700 outline-none placeholder:text-gray-400 flex-1"
              placeholder="Tìm tên, mã, thương hiệu..."
              value={search}
              onChange={e => setSearch(e.target.value)}
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
            <Button size="sm" variant="outline" className="h-8 text-[13px] border-gray-200 text-gray-600 gap-1.5">
              <Copy size={13} /> Nhân bản
            </Button>
            <Button size="sm" className="bg-[#1a1a2e] hover:bg-[#2d2d4a] text-white h-8 text-[13px] gap-1.5">
              <Plus size={14} /> Tạo chương trình
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* ── KPI cards ── */}
          <div className="grid grid-cols-4 gap-3">
            {[
              {
                label: "Tổng doanh thu từ KM",
                value: totalRevenue,
                change: "+21.4%",
                up: true,
                sub: "so với tháng trước",
                icon: CircleDollarSign,
                iconBg: "bg-emerald-50",
                iconColor: "text-emerald-600",
                spark: [140, 158, 172, 165, 188, 201, 216],
                sparkColor: "#10b981",
              },
              {
                label: "Chương trình đang chạy",
                value: String(activeCount),
                change: "+2",
                up: true,
                sub: "so với tuần trước",
                icon: Zap,
                iconBg: "bg-orange-50",
                iconColor: "text-orange-500",
                spark: [3, 4, 3, 5, 4, 4, activeCount],
                sparkColor: "#f97316",
              },
              {
                label: "Tổng đơn từ khuyến mãi",
                value: totalOrders.toLocaleString(),
                change: "+18.3%",
                up: true,
                sub: "so với tháng trước",
                icon: ShoppingBag,
                iconBg: "bg-violet-50",
                iconColor: "text-violet-600",
                spark: [20000, 22000, 21000, 25000, 24000, 28000, totalOrders],
                sparkColor: "#7c3aed",
              },
              {
                label: "Tỉ lệ chuyển đổi TB",
                value: `${avgConversion}%`,
                change: "+2.1%",
                up: true,
                sub: "so với tháng trước",
                icon: Target,
                iconBg: "bg-blue-50",
                iconColor: "text-blue-600",
                spark: [8, 9.2, 8.8, 10.1, 10.5, 11.2, parseFloat(avgConversion)],
                sparkColor: "#2563eb",
              },
            ].map(({ label, value, change, up, sub, icon: Icon, iconBg, iconColor, spark, sparkColor }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">{label}</span>
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", iconBg)}>
                    <Icon size={14} className={iconColor} />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-medium text-gray-900 leading-none mb-1.5">{value}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                      <span className={cn("px-1.5 py-0.5 rounded font-medium", up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600")}>
                        {up ? <TrendingUp size={9} className="inline mr-0.5" /> : <TrendingDown size={9} className="inline mr-0.5" />}
                        {change}
                      </span>
                      <span className="hidden xl:inline">{sub}</span>
                    </div>
                  </div>
                  <Sparkline values={spark} color={sparkColor} />
                </div>
              </div>
            ))}
          </div>

          {/* ── Analysis panels ── */}
          <div className="grid grid-cols-[1fr_1fr_1fr_220px] gap-3">

            {/* Type breakdown */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="text-[14px] font-medium text-gray-900 mb-3">Phân loại chương trình</h3>
              <div className="space-y-2.5">
                {(["flash_sale","voucher","discount","bundle","gift"] as PromoType[]).map(type => {
                  const cfg = TYPE_CONFIG[type];
                  const count = PROMOTIONS.filter(p => p.type === type).length;
                  const pct = Math.round((count / PROMOTIONS.length) * 100);
                  const barColors: Record<PromoType, string> = {
                    flash_sale: "bg-orange-400",
                    voucher:    "bg-pink-400",
                    discount:   "bg-blue-400",
                    bundle:     "bg-teal-400",
                    gift:       "bg-rose-400",
                  };
                  return (
                    <div key={type} className="flex items-center gap-3">
                      <span className="w-5 text-base shrink-0">{cfg.emoji}</span>
                      <span className="text-[12px] text-gray-600 w-20 shrink-0">{cfg.label}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", barColors[type])} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[11px] font-medium text-gray-700 w-4 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Platform coverage */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="text-[14px] font-medium text-gray-900 mb-3">Phân bổ theo sàn</h3>
              <div className="space-y-2.5">
                {(["shopee","lazada","tiki","sendo"] as const).map(plt => {
                  const cfg = PLATFORM_CONFIG[plt];
                  const count = PROMOTIONS.filter(p => p.platform.includes(plt)).length;
                  const pct = Math.round((count / PROMOTIONS.length) * 100);
                  const barColors = { shopee:"bg-orange-400", lazada:"bg-pink-400", tiki:"bg-blue-400", sendo:"bg-green-400" };
                  const revenue = { shopee:"96 tr", lazada:"71 tr", tiki:"38 tr", sendo:"11 tr" };
                  return (
                    <div key={plt}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] text-gray-600">{cfg.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-gray-400">{revenue[plt]}</span>
                          <span className="text-[11px] font-medium text-gray-700">{count} CT</span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", barColors[plt])} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-center">
                <div>
                  <p className="text-base font-medium text-gray-900">62%</p>
                  <p className="text-[11px] text-gray-400">Shopee chiếm</p>
                </div>
                <div>
                  <p className="text-base font-medium text-gray-900">3.2x</p>
                  <p className="text-[11px] text-gray-400">ROI trung bình</p>
                </div>
              </div>
            </div>

            {/* Top performing */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-medium text-gray-900">Hiệu quả nhất</h3>
                <Flame size={14} className="text-orange-500" />
              </div>
              <div className="space-y-1">
                {[...PROMOTIONS]
                  .filter(p => p.conversionRate > 0)
                  .sort((a, b) => b.conversionRate - a.conversionRate)
                  .slice(0, 5)
                  .map((p, i) => {
                    const typeCfg = TYPE_CONFIG[p.type];
                    return (
                      <div key={p.id} className="flex items-center gap-2.5 py-2 px-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <span className={cn("text-[11px] font-medium w-4 text-right shrink-0", i === 0 ? "text-amber-500" : "text-gray-400")}>
                          {i + 1}
                        </span>
                        <span className="text-base shrink-0">{typeCfg.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-medium text-gray-900 truncate">{p.name}</p>
                          <p className="text-[11px] text-gray-400">{p.brandEmoji} {p.brandName}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[13px] font-medium text-emerald-600">{p.conversionRate}%</p>
                          <p className="text-[10px] text-gray-400">chuyển đổi</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Budget overview donuts */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="text-[14px] font-medium text-gray-900 mb-3">Ngân sách</h3>
              <div className="space-y-3">
                {PROMOTIONS.filter(p => p.status === "active").slice(0, 4).map(p => (
                  <div key={p.id} className="flex items-center gap-3">
                    <MiniDonut
                      pct={p.budgetUsed}
                      color={p.budgetUsed >= 90 ? "#ef4444" : p.budgetUsed >= 70 ? "#f59e0b" : "#10b981"}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-gray-800 truncate">{p.name}</p>
                      <p className="text-[10px] text-gray-400">{p.budget} ngân sách</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between text-[12px]">
                  <span className="text-gray-500">Tổng ngân sách</span>
                  <span className="font-medium text-gray-800">675 tr</span>
                </div>
                <div className="flex justify-between text-[12px] mt-1">
                  <span className="text-gray-500">Đã sử dụng</span>
                  <span className="font-medium text-emerald-700">246 tr (36%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Table ── */}
          <div className="bg-white rounded-xl border border-gray-100">

            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-4">
              {tabs.map(({ key, label }) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-3 text-[13px] border-b-2 transition-colors -mb-px whitespace-nowrap",
                    activeTab === key ? "border-[#1a1a2e] text-gray-900 font-medium" : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                >
                  {label}
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", activeTab === key ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500")}>
                    {tabCounts[key]}
                  </span>
                </button>
              ))}
            </div>

            {/* Type filter */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
              {typeFilters.map(({ key, label }) => (
                <button key={key} onClick={() => setTypeFilter(key as TypeFilter)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[12px] border transition-all whitespace-nowrap",
                    typeFilter === key ? "bg-[#1a1a2e] text-white border-[#1a1a2e]" : "text-gray-500 border-gray-200 hover:bg-gray-50"
                  )}
                >
                  {label}
                </button>
              ))}
              <div className="ml-auto flex gap-2">
                <button className="flex items-center gap-1.5 text-[12px] text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
                  <Filter size={12} /> Lọc
                </button>
                <button className="flex items-center gap-1.5 text-[12px] text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
                  <ArrowUpDown size={12} /> Sắp xếp
                </button>
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-gray-100">
                  {["Chương trình", "Thương hiệu", "Loại", "Ưu đãi", "Sàn", "Ngân sách", "Sử dụng", "Doanh thu", "Chuyển đổi", "Thời gian", "Trạng thái", ""].map(h => (
                    <TableHead key={h} className="text-[11px] font-medium text-gray-400 uppercase tracking-wider py-2.5 whitespace-nowrap">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPromotions.map(promo => {
                  const st  = STATUS_CONFIG[promo.status];
                  const typ = TYPE_CONFIG[promo.type];
                  const isSelected = selected?.id === promo.id;
                  return (
                    <TableRow key={promo.id}
                      onClick={() => setSelected(isSelected ? null : promo)}
                      className={cn(
                        "border-gray-100 transition-colors cursor-pointer",
                        promo.isHot ? "bg-orange-50/20 hover:bg-orange-50/40" : "hover:bg-gray-50/60",
                        isSelected ? "bg-violet-50/40" : ""
                      )}
                    >
                      {/* Name */}
                      <TableCell className="py-3 min-w-[180px]">
                        <div className="flex items-center gap-2">
                          {promo.isHot && <Flame size={12} className="text-orange-500 shrink-0" />}
                          <div>
                            <p className="text-[13px] font-medium text-gray-900 line-clamp-1">{promo.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono text-[10px] text-gray-400">{promo.id}</span>
                              {promo.code && (
                                <span className="flex items-center gap-0.5 text-[10px] text-violet-600 bg-violet-50 border border-violet-200 px-1.5 py-0.5 rounded font-mono">
                                  {promo.code}
                                  <Copy size={8} className="ml-0.5 cursor-pointer" />
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Brand */}
                      <TableCell>
                        <span className="text-[12px] text-gray-600 flex items-center gap-1 whitespace-nowrap">
                          {promo.brandEmoji} {promo.brandName}
                        </span>
                      </TableCell>

                      {/* Type */}
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[10px] font-medium border gap-1 whitespace-nowrap", typ.className)}>
                          {typ.emoji} {typ.label}
                        </Badge>
                      </TableCell>

                      {/* Discount */}
                      <TableCell>
                        <div>
                          <p className="text-[13px] font-medium text-gray-900 flex items-center gap-1">
                            {promo.discountType === "percent" ? <Percent size={11} className="text-gray-400" /> : <Tag size={11} className="text-gray-400" />}
                            {promo.discountValue}
                          </p>
                          <p className="text-[10px] text-gray-400">Tối thiểu {promo.minOrder}</p>
                        </div>
                      </TableCell>

                      {/* Platforms */}
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {promo.platform.map(p => (
                            <span key={p} className={cn("text-[9px] px-1.5 py-0.5 rounded border font-medium", PLATFORM_CONFIG[p].className)}>
                              {PLATFORM_CONFIG[p].label}
                            </span>
                          ))}
                        </div>
                      </TableCell>

                      {/* Budget */}
                      <TableCell>
                        <div>
                          <p className="text-[12px] font-medium text-gray-800">{promo.budget}</p>
                          <BudgetBar used={promo.budgetUsed} status={promo.status} />
                        </div>
                      </TableCell>

                      {/* Usage */}
                      <TableCell>
                        <p className="text-[12px] font-medium text-gray-800">
                          {promo.usageCount.toLocaleString()}
                          <span className="text-gray-400 font-normal">/{promo.usageLimit.toLocaleString()}</span>
                        </p>
                        <div className="h-1 w-14 bg-gray-100 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-violet-400"
                            style={{ width: `${Math.min((promo.usageCount / promo.usageLimit) * 100, 100)}%` }}
                          />
                        </div>
                      </TableCell>

                      {/* Revenue */}
                      <TableCell>
                        <p className="text-[13px] font-medium text-gray-900">{promo.revenue !== "0" ? promo.revenue : "—"}</p>
                        {promo.orders > 0 && <p className="text-[10px] text-gray-400">{promo.orders.toLocaleString()} đơn</p>}
                      </TableCell>

                      {/* Conversion */}
                      <TableCell>
                        {promo.conversionRate > 0 ? (
                          <span className={cn("text-[12px] font-medium",
                            promo.conversionRate >= 15 ? "text-emerald-600" :
                            promo.conversionRate >= 8  ? "text-blue-600" : "text-gray-600"
                          )}>
                            {promo.conversionRate}%
                          </span>
                        ) : <span className="text-[12px] text-gray-400">—</span>}
                      </TableCell>

                      {/* Time */}
                      <TableCell className="min-w-[120px]">
                        <div className="text-[11px] space-y-0.5">
                          <div className="flex items-center gap-1 text-gray-500">
                            <CalendarDays size={10} /> {promo.startDate}
                          </div>
                          <div className="flex items-center gap-1 text-gray-400">
                            <Clock size={10} /> {promo.endDate}
                          </div>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[10px] font-medium border gap-1 whitespace-nowrap", st.className)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", st.dot)} />
                          {st.label}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell onClick={e => e.stopPropagation()}>
                        <div className="flex gap-1 justify-end">
                          <button className="w-6 h-6 rounded-md border border-gray-150 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors" title="Xem">
                            <Eye size={11} />
                          </button>
                          <button className="w-6 h-6 rounded-md border border-gray-150 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors" title="Sửa">
                            <Pencil size={11} />
                          </button>
                          {promo.status === "active" ? (
                            <button className="w-6 h-6 rounded-md border border-amber-200 flex items-center justify-center text-amber-500 hover:bg-amber-50 transition-colors" title="Tạm dừng">
                              <ToggleRight size={11} />
                            </button>
                          ) : promo.status === "paused" ? (
                            <button className="w-6 h-6 rounded-md border border-emerald-200 flex items-center justify-center text-emerald-500 hover:bg-emerald-50 transition-colors" title="Kích hoạt lại">
                              <ToggleLeft size={11} />
                            </button>
                          ) : null}
                          <button className="w-6 h-6 rounded-md border border-gray-150 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors" title="Xóa">
                            <Trash2 size={11} />
                          </button>
                          <button className="w-6 h-6 rounded-md border border-gray-150 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                            <MoreVertical size={11} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {filtered.length === 0 && (
              <div className="py-16 text-center text-gray-400 text-sm">Không tìm thấy chương trình nào phù hợp.</div>
            )}

            {/* Pagination */}
            <AdminPagination
              state={paginationState}
              onStateChange={onPaginationChange}
              totalItems={filtered.length}
              pageSizeOptions={[5, 10, 20, 50]}
              itemsLabel="chương trình"
              className="border-gray-100"
            />
          </div>

          {/* ── Detail panel ── */}
          {selected && (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{TYPE_CONFIG[selected.type].emoji}</span>
                  <h3 className="text-[14px] font-medium text-gray-900">{selected.name}</h3>
                  <span className="font-mono text-[11px] text-gray-400">{selected.id}</span>
                  <Badge variant="outline" className={cn("text-[10px] border gap-1", STATUS_CONFIG[selected.status].className)}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", STATUS_CONFIG[selected.status].dot)} />
                    {STATUS_CONFIG[selected.status].label}
                  </Badge>
                  {selected.isHot && (
                    <Badge variant="outline" className="text-[10px] border gap-1 bg-orange-50 text-orange-700 border-orange-200">
                      <Flame size={9} /> Hot
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="h-7 text-[12px] border-gray-200 text-gray-600 gap-1.5">
                    <Copy size={12} /> Nhân bản
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-[12px] border-gray-200 text-gray-600 gap-1.5">
                    <Pencil size={12} /> Chỉnh sửa
                  </Button>
                  {selected.status === "active" && (
                    <Button size="sm" className="h-7 text-[12px] bg-amber-500 hover:bg-amber-600 text-white gap-1.5">
                      <ToggleRight size={12} /> Tạm dừng
                    </Button>
                  )}
                  <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                    <XCircle size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-0 divide-x divide-gray-100">
                {/* Overview */}
                <div className="p-5 space-y-3">
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Thông tin chung</p>
                  {[
                    { label: "Thương hiệu",   value: `${selected.brandEmoji} ${selected.brandName}` },
                    { label: "Loại",          value: `${TYPE_CONFIG[selected.type].emoji} ${TYPE_CONFIG[selected.type].label}` },
                    { label: "Giá trị ưu đãi",value: selected.discountValue },
                    { label: "Đơn tối thiểu", value: selected.minOrder === "0" ? "Không giới hạn" : selected.minOrder },
                    { label: "Sàn áp dụng",   value: selected.platform.map(p => PLATFORM_CONFIG[p].label).join(", ") },
                    ...(selected.code ? [{ label: "Mã voucher", value: selected.code }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-start justify-between gap-2">
                      <span className="text-[12px] text-gray-400 shrink-0">{label}</span>
                      <span className="text-[12px] font-medium text-gray-700 text-right">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Time */}
                <div className="p-5 space-y-3">
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Thời gian</p>
                  <div className="space-y-2">
                    {[
                      { label: "Bắt đầu", value: selected.startDate, icon: CalendarDays },
                      { label: "Kết thúc", value: selected.endDate, icon: Clock },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="p-2.5 bg-gray-50 rounded-lg">
                        <p className="text-[10px] text-gray-400 mb-0.5 flex items-center gap-1"><Icon size={10} />{label}</p>
                        <p className="text-[13px] font-medium text-gray-800">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-gray-100 space-y-1.5">
                    <div className="flex justify-between text-[12px]">
                      <span className="text-gray-400">Lượt dùng</span>
                      <span className="font-medium text-gray-700">{selected.usageCount.toLocaleString()} / {selected.usageLimit.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-violet-400" style={{ width: `${Math.min((selected.usageCount / selected.usageLimit) * 100, 100)}%` }} />
                    </div>
                  </div>
                </div>

                {/* Budget */}
                <div className="p-5 space-y-3">
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Ngân sách</p>
                  <div className="flex items-center gap-3">
                    <MiniDonut
                      pct={selected.budgetUsed}
                      color={selected.budgetUsed >= 90 ? "#ef4444" : selected.budgetUsed >= 70 ? "#f59e0b" : "#10b981"}
                    />
                    <div>
                      <p className="text-lg font-medium text-gray-900">{selected.budget}</p>
                      <p className="text-[11px] text-gray-400">Tổng ngân sách</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-[12px]">
                    {[
                      { label: "Đã dùng",       value: `${selected.budgetUsed}%` },
                      { label: "Doanh thu",       value: selected.revenue !== "0" ? selected.revenue : "—" },
                      { label: "Số đơn hàng",    value: selected.orders > 0 ? selected.orders.toLocaleString() : "—" },
                      { label: "Tỉ lệ chuyển đổi", value: selected.conversionRate > 0 ? `${selected.conversionRate}%` : "—" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-gray-400">{label}</span>
                        <span className="font-medium text-gray-700">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="p-5 space-y-3">
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Hành động</p>
                  <div className="space-y-2">
                    {[
                      { label: "Xem báo cáo chi tiết", color: "text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100", icon: BarChart2 },
                      { label: "Nhân bản chương trình", color: "text-violet-600 border-violet-200 bg-violet-50 hover:bg-violet-100", icon: Copy },
                      { label: "Áp dụng sang sàn khác", color: "text-teal-600 border-teal-200 bg-teal-50 hover:bg-teal-100", icon: ChevronRight },
                      { label: "Thêm sản phẩm áp dụng", color: "text-gray-600 border-gray-200 bg-gray-50 hover:bg-gray-100", icon: Package },
                      { label: "Thông báo cho khách hàng", color: "text-gray-600 border-gray-200 bg-gray-50 hover:bg-gray-100", icon: Users2 },
                    ].map(({ label, color, icon: Icon }) => (
                      <button key={label} className={cn("w-full text-[12px] border rounded-lg py-1.5 px-3 transition-colors font-medium flex items-center gap-2", color)}>
                        <Icon size={12} /> {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}