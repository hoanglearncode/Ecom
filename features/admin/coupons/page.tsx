"use client";

import React, { useState } from "react";
import {
  Bell, RefreshCw, Plus, Search, Store, Package, ShoppingCart,
  BarChart2, Star, Users, FileText, Settings, MoreHorizontal,
  Eye, Pencil, Trash2, MoreVertical, Filter, ArrowUpDown,
  TrendingUp, TrendingDown, Ticket, Copy, CheckCircle2, XCircle,
  Clock, CalendarDays, Percent, Tag, BadgePercent, Gift, Zap,
  Megaphone, Headphones, Flame, Target, Users2, ShoppingBag,
  ToggleLeft, ToggleRight, RefreshCcw, CircleDollarSign,
  Hash, Lock, Unlock, AlertTriangle, QrCode, Download, Send,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { AdminPagination, usePagination, paginateData } from "@/components/admin";

// ─── Types ────────────────────────────────────────────────────────────────────

type CouponStatus   = "active" | "scheduled" | "expired" | "draft" | "paused";
type DiscountType   = "percent" | "fixed" | "freeship" | "gift";
type AudienceType   = "all" | "new" | "vip" | "returning" | "brand";
type TabKey         = "all" | CouponStatus;
type TypeFilter     = "all" | DiscountType;

interface Coupon {
  id: string;
  code: string;
  name: string;
  status: CouponStatus;
  discountType: DiscountType;
  discountValue: string;
  minOrder: string;
  maxDiscount: string;
  audience: AudienceType;
  brandName: string;
  brandEmoji: string;
  platform: ("shopee" | "lazada" | "tiki" | "sendo")[];
  usageCount: number;
  usageLimit: number;
  budget: string;
  budgetUsed: number;
  revenue: string;
  orders: number;
  conversionRate: number;
  isHot: boolean;
  isPrivate: boolean;
  startDate: string;
  endDate: string;
  createdBy: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const COUPONS: Coupon[] = [
  {
    id: "CPN-8821",
    code: "SUMMER40",
    name: "Flash giảm 40% Hè 2026",
    status: "active",
    discountType: "percent",
    discountValue: "40%",
    minOrder: "300k",
    maxDiscount: "200k",
    audience: "all",
    brandName: "Biti's Hunter",
    brandEmoji: "👟",
    platform: ["shopee", "lazada", "tiki"],
    usageCount: 6840,
    usageLimit: 10000,
    budget: "100 tr",
    budgetUsed: 68,
    revenue: "68 tr",
    orders: 6840,
    conversionRate: 18.4,
    isHot: true,
    isPrivate: false,
    startDate: "01/06/2026",
    endDate: "30/06/2026",
    createdBy: "Minh Anh",
  },
  {
    id: "CPN-8820",
    code: "SAMS150K",
    name: "Giảm 150k cho điện tử",
    status: "active",
    discountType: "fixed",
    discountValue: "150k",
    minOrder: "1.5 tr",
    maxDiscount: "150k",
    audience: "all",
    brandName: "Samsung Electronics",
    brandEmoji: "📱",
    platform: ["shopee", "lazada"],
    usageCount: 2140,
    usageLimit: 5000,
    budget: "120 tr",
    budgetUsed: 43,
    revenue: "321 tr",
    orders: 2140,
    conversionRate: 12.7,
    isHot: false,
    isPrivate: false,
    startDate: "15/05/2026",
    endDate: "15/07/2026",
    createdBy: "Quốc Bảo",
  },
  {
    id: "CPN-8819",
    code: "VIPSHIP",
    name: "Free ship toàn quốc VIP",
    status: "active",
    discountType: "freeship",
    discountValue: "Free ship",
    minOrder: "500k",
    maxDiscount: "50k",
    audience: "vip",
    brandName: "Shiseido Vietnam",
    brandEmoji: "💄",
    platform: ["lazada", "tiki"],
    usageCount: 3920,
    usageLimit: 8000,
    budget: "40 tr",
    budgetUsed: 49,
    revenue: "78 tr",
    orders: 3920,
    conversionRate: 22.1,
    isHot: false,
    isPrivate: false,
    startDate: "01/06/2026",
    endDate: "31/07/2026",
    createdBy: "Thanh Tú",
  },
  {
    id: "CPN-8818",
    code: "NEWJOIN30",
    name: "Chào khách mới – giảm 30%",
    status: "active",
    discountType: "percent",
    discountValue: "30%",
    minOrder: "200k",
    maxDiscount: "100k",
    audience: "new",
    brandName: "Nike Vietnam",
    brandEmoji: "🏃",
    platform: ["shopee", "tiki"],
    usageCount: 1280,
    usageLimit: 99999,
    budget: "Không giới hạn",
    budgetUsed: 0,
    revenue: "38.4 tr",
    orders: 1280,
    conversionRate: 31.0,
    isHot: false,
    isPrivate: false,
    startDate: "01/01/2026",
    endDate: "31/12/2026",
    createdBy: "Minh Anh",
  },
  {
    id: "CPN-8817",
    code: "CANIFA25",
    name: "Sale thời trang 25%",
    status: "paused",
    discountType: "percent",
    discountValue: "25%",
    minOrder: "250k",
    maxDiscount: "150k",
    audience: "all",
    brandName: "Canifa Fashion",
    brandEmoji: "👕",
    platform: ["shopee", "lazada", "tiki", "sendo"],
    usageCount: 4100,
    usageLimit: 6000,
    budget: "60 tr",
    budgetUsed: 68,
    revenue: "41 tr",
    orders: 4100,
    conversionRate: 14.2,
    isHot: false,
    isPrivate: false,
    startDate: "01/05/2026",
    endDate: "31/05/2026",
    createdBy: "Hồng Nhung",
  },
  {
    id: "CPN-8816",
    code: "G7COFFEE",
    name: "Cà phê giảm 20k đơn đầu",
    status: "active",
    discountType: "fixed",
    discountValue: "20k",
    minOrder: "100k",
    maxDiscount: "20k",
    audience: "returning",
    brandName: "Trung Nguyên Legend",
    brandEmoji: "🍵",
    platform: ["shopee"],
    usageCount: 9200,
    usageLimit: 10000,
    budget: "18.4 tr",
    budgetUsed: 92,
    revenue: "92 tr",
    orders: 9200,
    conversionRate: 28.3,
    isHot: true,
    isPrivate: false,
    startDate: "01/06/2026",
    endDate: "10/06/2026",
    createdBy: "Quốc Bảo",
  },
  {
    id: "CPN-8815",
    code: "VIPGIFT",
    name: "Tặng quà Diamond Member",
    status: "active",
    discountType: "gift",
    discountValue: "Tặng quà",
    minOrder: "2 tr",
    maxDiscount: "—",
    audience: "vip",
    brandName: "Biti's Hunter",
    brandEmoji: "👟",
    platform: ["shopee", "lazada"],
    usageCount: 340,
    usageLimit: 500,
    budget: "30 tr",
    budgetUsed: 68,
    revenue: "86 tr",
    orders: 340,
    conversionRate: 41.5,
    isHot: false,
    isPrivate: true,
    startDate: "01/06/2026",
    endDate: "30/06/2026",
    createdBy: "Minh Anh",
  },
  {
    id: "CPN-8814",
    code: "BACKSCH20",
    name: "Back to School 20%",
    status: "scheduled",
    discountType: "percent",
    discountValue: "20%",
    minOrder: "400k",
    maxDiscount: "120k",
    audience: "all",
    brandName: "Nike Vietnam",
    brandEmoji: "🏃",
    platform: ["shopee", "lazada", "tiki"],
    usageCount: 0,
    usageLimit: 8000,
    budget: "80 tr",
    budgetUsed: 0,
    revenue: "0",
    orders: 0,
    conversionRate: 0,
    isHot: false,
    isPrivate: false,
    startDate: "01/08/2026",
    endDate: "15/09/2026",
    createdBy: "Thanh Tú",
  },
  {
    id: "CPN-8813",
    code: "DHG10",
    name: "Dược phẩm giảm 10%",
    status: "expired",
    discountType: "percent",
    discountValue: "10%",
    minOrder: "200k",
    maxDiscount: "50k",
    audience: "all",
    brandName: "Dược Hậu Giang",
    brandEmoji: "💊",
    platform: ["shopee", "lazada", "tiki"],
    usageCount: 5500,
    usageLimit: 5500,
    budget: "27.5 tr",
    budgetUsed: 100,
    revenue: "55 tr",
    orders: 5500,
    conversionRate: 16.8,
    isHot: false,
    isPrivate: false,
    startDate: "01/05/2026",
    endDate: "31/05/2026",
    createdBy: "Quốc Bảo",
  },
  {
    id: "CPN-8812",
    code: "JYSK200K",
    name: "Nội thất giảm 200k",
    status: "draft",
    discountType: "fixed",
    discountValue: "200k",
    minOrder: "3 tr",
    maxDiscount: "200k",
    audience: "brand",
    brandName: "JYSK Furniture",
    brandEmoji: "🛋️",
    platform: ["tiki", "sendo"],
    usageCount: 0,
    usageLimit: 2000,
    budget: "40 tr",
    budgetUsed: 0,
    revenue: "0",
    orders: 0,
    conversionRate: 0,
    isHot: false,
    isPrivate: true,
    startDate: "Chưa lên lịch",
    endDate: "Chưa lên lịch",
    createdBy: "Hồng Nhung",
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<CouponStatus, { label: string; dot: string; cls: string }> = {
  active:    { label: "Đang hoạt động", dot: "bg-emerald-500", cls: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  scheduled: { label: "Sắp kích hoạt",  dot: "bg-blue-500",    cls: "bg-blue-50 text-blue-700 border-blue-200" },
  paused:    { label: "Tạm dừng",       dot: "bg-amber-400",   cls: "bg-amber-50 text-amber-700 border-amber-200" },
  expired:   { label: "Hết hạn",        dot: "bg-gray-400",    cls: "bg-gray-100 text-gray-600 border-gray-200" },
  draft:     { label: "Bản nháp",       dot: "bg-violet-400",  cls: "bg-violet-50 text-violet-700 border-violet-200" },
};

const DTYPE_CFG: Record<DiscountType, { label: string; emoji: string; cls: string; icon: React.ElementType }> = {
  percent:  { label: "Phần trăm",   emoji: "🏷️", cls: "bg-violet-50 text-violet-700 border-violet-200",  icon: Percent },
  fixed:    { label: "Số tiền cố định", emoji: "💵", cls: "bg-blue-50 text-blue-700 border-blue-200",    icon: Tag },
  freeship: { label: "Free ship",   emoji: "🚚", cls: "bg-teal-50 text-teal-700 border-teal-200",        icon: ShoppingBag },
  gift:     { label: "Tặng quà",    emoji: "🎁", cls: "bg-rose-50 text-rose-700 border-rose-200",        icon: Gift },
};

const AUDIENCE_CFG: Record<AudienceType, { label: string; cls: string }> = {
  all:       { label: "Tất cả",       cls: "bg-gray-100 text-gray-600 border-gray-200" },
  new:       { label: "Khách mới",    cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  vip:       { label: "VIP",          cls: "bg-amber-50 text-amber-700 border-amber-200" },
  returning: { label: "Khách cũ",     cls: "bg-blue-50 text-blue-700 border-blue-200" },
  brand:     { label: "Brand riêng",  cls: "bg-violet-50 text-violet-700 border-violet-200" },
};

const PLATFORM_CFG = {
  shopee: { label: "Shopee", cls: "bg-orange-50 text-orange-700 border-orange-200" },
  lazada: { label: "Lazada", cls: "bg-pink-50 text-pink-700 border-pink-200" },
  tiki:   { label: "Tiki",   cls: "bg-blue-50 text-blue-700 border-blue-200" },
  sendo:  { label: "Sendo",  cls: "bg-green-50 text-green-700 border-green-200" },
};

const AVATAR_COLORS: Record<string, string> = {
  "Minh Anh":   "bg-violet-100 text-violet-700",
  "Quốc Bảo":   "bg-blue-100 text-blue-700",
  "Thanh Tú":   "bg-teal-100 text-teal-700",
  "Hồng Nhung": "bg-pink-100 text-pink-700",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values); const min = Math.min(...values); const range = max - min || 1;
  const W = 72; const H = 26;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * W},${H - ((v - min) / range) * (H - 2) - 1}`);
  return (
    <svg width={W} height={H}>
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UsageBar({ used, limit, status }: { used: number; limit: number; status: CouponStatus }) {
  const pct = limit >= 99999 ? 0 : Math.round((used / limit) * 100);
  const color = pct >= 90 ? "bg-red-400" : pct >= 70 ? "bg-amber-400" : status === "active" ? "bg-emerald-400" : "bg-gray-300";
  if (limit >= 99999) return <span className="text-[10px] text-gray-400">Không giới hạn</span>;
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-1.5">
        <div className="h-1.5 w-14 rounded-full bg-gray-100 overflow-hidden">
          <div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[10px] text-gray-500">{pct}%</span>
      </div>
      <p className="text-[10px] text-gray-400">
        {used.toLocaleString()} / {limit.toLocaleString()}
      </p>
    </div>
  );
}

function CodeBadge({ code, isPrivate }: { code: string; isPrivate: boolean }) {
  const [copied, setCopied] = useState(false);
  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <div className="flex items-center gap-1">
      <span className={cn(
        "flex items-center gap-1 font-mono text-[11px] font-medium px-2 py-0.5 rounded border",
        isPrivate ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-violet-50 text-violet-800 border-violet-200"
      )}>
        {isPrivate ? <Lock size={8} /> : <Hash size={8} />}
        {code}
      </span>
      <button
        onClick={handleCopy}
        className="w-5 h-5 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        title="Sao chép mã"
      >
        {copied ? <CheckCircle2 size={10} className="text-emerald-500" /> : <Copy size={9} />}
      </button>
    </div>
  );
}

function MiniDonut({ pct, color }: { pct: number; color: string }) {
  const r = 13; const c = 2 * Math.PI * r;
  return (
    <svg width="34" height="34" viewBox="0 0 34 34">
      <circle cx="17" cy="17" r={r} fill="none" stroke="#f3f4f6" strokeWidth="4" />
      <circle cx="17" cy="17" r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={`${(pct / 100) * c} ${c}`} strokeLinecap="round"
        transform="rotate(-90 17 17)" />
      <text x="17" y="21" textAnchor="middle" fontSize="7.5" fontWeight="500" fill="#374151">{pct}%</text>
    </svg>
  );
}

function AvatarPill({ name }: { name: string }) {
  const initials = name.split(" ").map(w => w[0]).slice(-2).join("");
  const color = AVATAR_COLORS[name] ?? "bg-gray-100 text-gray-600";
  return (
    <div className="flex items-center gap-1.5">
      <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-medium shrink-0", color)}>{initials}</div>
      <span className="text-[12px] text-gray-600 whitespace-nowrap">{name}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CouponsManagementPage() {
  const [activeTab, setActiveTab]       = useState<TabKey>("all");
  const [typeFilter, setTypeFilter]     = useState<TypeFilter>("all");
  const [search, setSearch]             = useState("");
  const [selected, setSelected]         = useState<Coupon | null>(null);
  const { state: pagination, onStateChange: setPagination, reset: resetPagination } = usePagination({ pageSize: 10 });

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all",       label: "Tất cả" },
    { key: "active",    label: "Đang hoạt động" },
    { key: "scheduled", label: "Sắp kích hoạt" },
    { key: "paused",    label: "Tạm dừng" },
    { key: "draft",     label: "Bản nháp" },
    { key: "expired",   label: "Hết hạn" },
  ];

  const tabCounts: Record<TabKey, number> = {
    all:       COUPONS.length,
    active:    COUPONS.filter(c => c.status === "active").length,
    scheduled: COUPONS.filter(c => c.status === "scheduled").length,
    paused:    COUPONS.filter(c => c.status === "paused").length,
    draft:     COUPONS.filter(c => c.status === "draft").length,
    expired:   COUPONS.filter(c => c.status === "expired").length,
  };

  const typeFilters: { key: TypeFilter; label: string }[] = [
    { key: "all",      label: "Tất cả loại" },
    { key: "percent",  label: "🏷️ Phần trăm" },
    { key: "fixed",    label: "💵 Số tiền" },
    { key: "freeship", label: "🚚 Free ship" },
    { key: "gift",     label: "🎁 Tặng quà" },
  ];

  const filtered = COUPONS.filter(c => {
    const matchTab  = activeTab === "all" || c.status === activeTab;
    const matchType = typeFilter === "all" || c.discountType === typeFilter;
    const matchQ    = search === "" ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.brandName.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchType && matchQ;
  });

  const paginatedCoupons = paginateData(filtered, pagination.page, pagination.pageSize);

  // Reset pagination when filters change
  React.useEffect(() => {
    resetPagination();
  }, [activeTab, typeFilter, resetPagination]);

  const active   = COUPONS.filter(c => c.status === "active");
  const totalRev = active.reduce((s, c) => s + parseFloat(c.revenue.replace(/[^0-9.]/g, "") || "0"), 0);
  const totalOrd = COUPONS.reduce((s, c) => s + c.orders, 0);
  const totalUse = COUPONS.reduce((s, c) => s + c.usageCount, 0);
  const avgCVR   = (COUPONS.filter(c => c.conversionRate > 0).reduce((s, c) => s + c.conversionRate, 0) /
                    COUPONS.filter(c => c.conversionRate > 0).length).toFixed(1);

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-sm overflow-hidden">
      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 h-[52px] px-6 flex items-center gap-4 shrink-0">
          <h1 className="text-base font-medium text-gray-900 flex-1">Mã giảm giá (Coupons)</h1>
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 w-60">
            <Search size={13} className="text-gray-400" />
            <input
              className="bg-transparent text-[13px] text-gray-700 outline-none placeholder:text-gray-400 flex-1"
              placeholder="Tìm mã, tên, thương hiệu..."
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
              <RefreshCcw size={13} /> Tạo hàng loạt
            </Button>
            <Button size="sm" className="bg-[#1a1a2e] hover:bg-[#2d2d4a] text-white h-8 text-[13px] gap-1.5">
              <Plus size={14} /> Tạo mã mới
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* ── KPI cards ── */}
          <div className="grid grid-cols-4 gap-3">
            {[
              {
                label: "Tổng doanh thu từ mã",
                value: `${totalRev.toFixed(0)} tr`,
                change: "+23.1%", up: true,
                sub: "so với tháng trước",
                icon: CircleDollarSign, iconBg: "bg-emerald-50", iconColor: "text-emerald-600",
                spark: [280, 310, 340, 360, 390, 420, totalRev], sparkColor: "#10b981",
              },
              {
                label: "Mã đang hoạt động",
                value: String(tabCounts.active),
                change: "+1", up: true,
                sub: "so với tuần trước",
                icon: Ticket, iconBg: "bg-violet-50", iconColor: "text-violet-600",
                spark: [5, 6, 5, 7, 6, 6, tabCounts.active], sparkColor: "#7c3aed",
              },
              {
                label: "Tổng lượt sử dụng",
                value: (totalUse / 1000).toFixed(1) + "K",
                change: "+31.4%", up: true,
                sub: "tháng này",
                icon: Users2, iconBg: "bg-blue-50", iconColor: "text-blue-600",
                spark: [18, 22, 25, 28, 30, 33, totalUse / 1000], sparkColor: "#2563eb",
              },
              {
                label: "Tỉ lệ chuyển đổi TB",
                value: `${avgCVR}%`,
                change: "+3.2%", up: true,
                sub: "so với tháng trước",
                icon: Target, iconBg: "bg-orange-50", iconColor: "text-orange-500",
                spark: [14, 16, 17.5, 18, 19.5, 21, parseFloat(avgCVR)], sparkColor: "#f97316",
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

          {/* ── Analysis row ── */}
          <div className="grid grid-cols-[1fr_1fr_1fr_220px] gap-3">

            {/* Discount type breakdown */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="text-[14px] font-medium text-gray-900 mb-3">Phân loại mã giảm giá</h3>
              <div className="space-y-2.5">
                {(["percent","fixed","freeship","gift"] as DiscountType[]).map(dt => {
                  const cfg   = DTYPE_CFG[dt];
                  const count = COUPONS.filter(c => c.discountType === dt).length;
                  const pct   = Math.round((count / COUPONS.length) * 100);
                  const barCls: Record<DiscountType, string> = {
                    percent: "bg-violet-400", fixed: "bg-blue-400",
                    freeship: "bg-teal-400",  gift: "bg-rose-400",
                  };
                  return (
                    <div key={dt}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] text-gray-600 flex items-center gap-1.5">
                          <span>{cfg.emoji}</span>{cfg.label}
                        </span>
                        <span className="text-[11px] font-medium text-gray-700">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", barCls[dt])} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-center">
                <div>
                  <p className="text-base font-medium text-gray-900">{COUPONS.filter(c => c.isPrivate).length}</p>
                  <p className="text-[11px] text-gray-400">Mã riêng tư</p>
                </div>
                <div>
                  <p className="text-base font-medium text-gray-900">{COUPONS.filter(c => !c.isPrivate).length}</p>
                  <p className="text-[11px] text-gray-400">Mã công khai</p>
                </div>
              </div>
            </div>

            {/* Audience breakdown */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="text-[14px] font-medium text-gray-900 mb-3">Đối tượng áp dụng</h3>
              <div className="space-y-2.5">
                {(["all","new","vip","returning","brand"] as AudienceType[]).map(aud => {
                  const cfg   = AUDIENCE_CFG[aud];
                  const emojis: Record<AudienceType, string> = { all: "🌐", new: "🌱", vip: "👑", returning: "🔄", brand: "🏷️" };
                  const count = COUPONS.filter(c => c.audience === aud).length;
                  const pct   = Math.round((count / COUPONS.length) * 100);
                  const barCls: Record<AudienceType, string> = {
                    all: "bg-gray-400", new: "bg-emerald-400",
                    vip: "bg-amber-400", returning: "bg-blue-400", brand: "bg-violet-400",
                  };
                  return (
                    <div key={aud} className="flex items-center gap-3">
                      <span className="w-5 text-base shrink-0">{emojis[aud]}</span>
                      <span className="text-[12px] text-gray-600 w-20 shrink-0">{cfg.label}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", barCls[aud])} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[11px] font-medium text-gray-700 w-4 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Usage + budget overview */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="text-[14px] font-medium text-gray-900 mb-3">Sử dụng & Ngân sách</h3>
              <div className="space-y-3">
                {COUPONS.filter(c => c.status === "active").slice(0, 4).map(c => {
                  const pct = c.usageLimit >= 99999 ? 0 : Math.round((c.usageCount / c.usageLimit) * 100);
                  return (
                    <div key={c.id} className="flex items-center gap-3">
                      <MiniDonut
                        pct={pct}
                        color={pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "#10b981"}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-gray-800 truncate">{c.name}</p>
                        <div className="flex items-center gap-1">
                          <CodeBadge code={c.code} isPrivate={c.isPrivate} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top performing */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-medium text-gray-900">Hiệu quả nhất</h3>
                <Flame size={14} className="text-orange-500" />
              </div>
              <div className="space-y-0.5">
                {[...COUPONS]
                  .filter(c => c.conversionRate > 0)
                  .sort((a, b) => b.conversionRate - a.conversionRate)
                  .slice(0, 5)
                  .map((c, i) => (
                    <div key={c.id}
                      className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <span className={cn("text-[11px] font-medium w-4 shrink-0", i === 0 ? "text-amber-500" : "text-gray-400")}>{i + 1}</span>
                      <span className="text-base shrink-0">{DTYPE_CFG[c.discountType].emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-gray-900 truncate">{c.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{c.code}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[12px] font-medium text-emerald-600">{c.conversionRate}%</p>
                        <p className="text-[9px] text-gray-400">CVR</p>
                      </div>
                    </div>
                  ))}
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
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                    activeTab === key ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500")}>
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
                <button className="flex items-center gap-1.5 text-[12px] text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
                  <Download size={12} /> Xuất CSV
                </button>
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-gray-100">
                  {["Mã coupon","Loại ưu đãi","Thương hiệu","Giá trị","Đối tượng","Sàn","Lượt dùng","Doanh thu","CVR","Ngân sách","Phụ trách","Thời gian","Trạng thái",""].map(h => (
                    <TableHead key={h} className="text-[11px] font-medium text-gray-400 uppercase tracking-wider py-2.5 whitespace-nowrap">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCoupons.map(coupon => {
                  const st   = STATUS_CFG[coupon.status];
                  const dt   = DTYPE_CFG[coupon.discountType];
                  const aud  = AUDIENCE_CFG[coupon.audience];
                  const isSel = selected?.id === coupon.id;
                  const nearExpiry = coupon.status === "active" && coupon.usageLimit < 99999 &&
                    (coupon.usageCount / coupon.usageLimit) >= 0.9;
                  return (
                    <TableRow key={coupon.id}
                      onClick={() => setSelected(isSel ? null : coupon)}
                      className={cn(
                        "border-gray-100 transition-colors cursor-pointer",
                        coupon.isHot ? "bg-orange-50/20 hover:bg-orange-50/40" :
                        nearExpiry ? "bg-red-50/20 hover:bg-red-50/40" :
                        "hover:bg-gray-50/60",
                        isSel ? "bg-violet-50/40" : ""
                      )}
                    >
                      {/* Code */}
                      <TableCell className="py-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            {coupon.isHot && <Flame size={11} className="text-orange-500 shrink-0" />}
                            {nearExpiry && <AlertTriangle size={11} className="text-red-500 shrink-0" />}
                            <CodeBadge code={coupon.code} isPrivate={coupon.isPrivate} />
                          </div>
                          <p className="text-[11px] text-gray-500 line-clamp-1 max-w-[140px]">{coupon.name}</p>
                          <p className="text-[10px] font-mono text-gray-400">{coupon.id}</p>
                        </div>
                      </TableCell>

                      {/* Type */}
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[10px] font-medium border gap-1 whitespace-nowrap", dt.cls)}>
                          {dt.emoji} {dt.label}
                        </Badge>
                      </TableCell>

                      {/* Brand */}
                      <TableCell>
                        <span className="text-[12px] text-gray-600 whitespace-nowrap">
                          {coupon.brandEmoji} {coupon.brandName}
                        </span>
                      </TableCell>

                      {/* Value */}
                      <TableCell>
                        <p className="text-[13px] font-medium text-gray-900">{coupon.discountValue}</p>
                        <p className="text-[10px] text-gray-400">
                          Min {coupon.minOrder} · Max {coupon.maxDiscount}
                        </p>
                      </TableCell>

                      {/* Audience */}
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[10px] font-medium border whitespace-nowrap", aud.cls)}>
                          {coupon.audience === "vip" ? "👑" :
                           coupon.audience === "new" ? "🌱" :
                           coupon.audience === "returning" ? "🔄" :
                           coupon.audience === "brand" ? "🏷️" : "🌐"}
                          {" "}{aud.label}
                        </Badge>
                      </TableCell>

                      {/* Platforms */}
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {coupon.platform.map(p => (
                            <span key={p} className={cn("text-[9px] px-1.5 py-0.5 rounded border font-medium", PLATFORM_CFG[p].cls)}>
                              {PLATFORM_CFG[p].label}
                            </span>
                          ))}
                        </div>
                      </TableCell>

                      {/* Usage */}
                      <TableCell>
                        <UsageBar used={coupon.usageCount} limit={coupon.usageLimit} status={coupon.status} />
                      </TableCell>

                      {/* Revenue */}
                      <TableCell>
                        <p className="text-[13px] font-medium text-gray-900">
                          {coupon.revenue !== "0" ? coupon.revenue : "—"}
                        </p>
                        {coupon.orders > 0 && (
                          <p className="text-[10px] text-gray-400">{coupon.orders.toLocaleString()} đơn</p>
                        )}
                      </TableCell>

                      {/* CVR */}
                      <TableCell>
                        {coupon.conversionRate > 0 ? (
                          <span className={cn("text-[12px] font-medium",
                            coupon.conversionRate >= 25 ? "text-emerald-600" :
                            coupon.conversionRate >= 15 ? "text-blue-600" : "text-gray-600")}>
                            {coupon.conversionRate}%
                          </span>
                        ) : <span className="text-[12px] text-gray-400">—</span>}
                      </TableCell>

                      {/* Budget */}
                      <TableCell>
                        <p className="text-[12px] font-medium text-gray-800">{coupon.budget}</p>
                        {coupon.budget !== "Không giới hạn" && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="h-1.5 w-12 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className={cn("h-full rounded-full",
                                  coupon.budgetUsed >= 90 ? "bg-red-400" :
                                  coupon.budgetUsed >= 70 ? "bg-amber-400" : "bg-emerald-400")}
                                style={{ width: `${coupon.budgetUsed}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-gray-400">{coupon.budgetUsed}%</span>
                          </div>
                        )}
                      </TableCell>

                      {/* Assignee */}
                      <TableCell><AvatarPill name={coupon.createdBy} /></TableCell>

                      {/* Time */}
                      <TableCell className="min-w-[120px]">
                        <div className="text-[11px] space-y-0.5">
                          <div className="flex items-center gap-1 text-gray-500">
                            <CalendarDays size={10} /> {coupon.startDate}
                          </div>
                          <div className="flex items-center gap-1 text-gray-400">
                            <Clock size={10} /> {coupon.endDate}
                          </div>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[10px] font-medium border gap-1 whitespace-nowrap", st.cls)}>
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
                          {coupon.status === "active" ? (
                            <button className="w-6 h-6 rounded-md border border-amber-200 flex items-center justify-center text-amber-500 hover:bg-amber-50 transition-colors" title="Tạm dừng">
                              <ToggleRight size={11} />
                            </button>
                          ) : coupon.status === "paused" || coupon.status === "draft" ? (
                            <button className="w-6 h-6 rounded-md border border-emerald-200 flex items-center justify-center text-emerald-500 hover:bg-emerald-50 transition-colors" title="Kích hoạt">
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
              <div className="py-16 text-center text-gray-400 text-sm">
                Không tìm thấy mã giảm giá nào phù hợp.
              </div>
            )}

            {/* Pagination */}
            <AdminPagination
              state={pagination}
              onStateChange={setPagination}
              totalItems={filtered.length}
              itemsLabel="mã giảm giá"
            />
          </div>

          {/* ── Detail panel ── */}
          {selected && (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{DTYPE_CFG[selected.discountType].emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      {selected.isHot && <Flame size={13} className="text-orange-500" />}
                      <h3 className="text-[14px] font-medium text-gray-900">{selected.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <CodeBadge code={selected.code} isPrivate={selected.isPrivate} />
                      <Badge variant="outline" className={cn("text-[10px] border gap-1", STATUS_CFG[selected.status].cls)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", STATUS_CFG[selected.status].dot)} />
                        {STATUS_CFG[selected.status].label}
                      </Badge>
                      <Badge variant="outline" className={cn("text-[10px] border", DTYPE_CFG[selected.discountType].cls)}>
                        {DTYPE_CFG[selected.discountType].emoji} {DTYPE_CFG[selected.discountType].label}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selected.status === "active" ? (
                    <Button size="sm" className="h-7 text-[12px] bg-amber-500 hover:bg-amber-600 text-white gap-1.5">
                      <ToggleRight size={12} /> Tạm dừng
                    </Button>
                  ) : (selected.status === "paused" || selected.status === "draft") ? (
                    <Button size="sm" className="h-7 text-[12px] bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
                      <ToggleLeft size={12} /> Kích hoạt
                    </Button>
                  ) : null}
                  <Button size="sm" variant="outline" className="h-7 text-[12px] border-gray-200 text-gray-600 gap-1.5">
                    <Copy size={12} /> Nhân bản
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-[12px] border-gray-200 text-gray-600 gap-1.5">
                    <Pencil size={12} /> Chỉnh sửa
                  </Button>
                  <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                    <XCircle size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 divide-x divide-gray-100">

                {/* Performance */}
                <div className="p-5">
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-3">Hiệu quả</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { label: "Lượt dùng",   value: selected.usageCount.toLocaleString(), color: "text-blue-600",    bg: "bg-blue-50",    icon: Users2 },
                      { label: "Đơn hàng",    value: selected.orders.toLocaleString(),     color: "text-violet-600", bg: "bg-violet-50",  icon: ShoppingBag },
                      { label: "Doanh thu",   value: selected.revenue !== "0" ? selected.revenue : "—", color: "text-emerald-600", bg: "bg-emerald-50", icon: CircleDollarSign },
                      { label: "CVR",         value: selected.conversionRate > 0 ? `${selected.conversionRate}%` : "—", color: "text-orange-600", bg: "bg-orange-50", icon: Target },
                    ].map(({ label, value, color, bg, icon: Icon }) => (
                      <div key={label} className="p-2.5 bg-gray-50 rounded-lg">
                        <div className={cn("w-6 h-6 rounded flex items-center justify-center mb-1.5", bg)}>
                          <Icon size={12} className={color} />
                        </div>
                        <p className="text-[14px] font-medium text-gray-900">{value}</p>
                        <p className="text-[10px] text-gray-400">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-[11px] text-gray-400 mb-1.5">Tiến độ sử dụng</p>
                    <UsageBar used={selected.usageCount} limit={selected.usageLimit} status={selected.status} />
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-3">Thông tin</p>
                  <div className="space-y-2">
                    {[
                      { label: "Thương hiệu",  value: `${selected.brandEmoji} ${selected.brandName}` },
                      { label: "Giá trị",      value: selected.discountValue },
                      { label: "Đơn tối thiểu",value: selected.minOrder === "0" ? "Không" : selected.minOrder },
                      { label: "Giảm tối đa",  value: selected.maxDiscount },
                      { label: "Đối tượng",    value: AUDIENCE_CFG[selected.audience].label },
                      { label: "Quyền riêng tư", value: selected.isPrivate ? "🔒 Riêng tư" : "🌐 Công khai" },
                      { label: "Phụ trách",    value: selected.createdBy },
                      { label: "Sàn",          value: selected.platform.map(p => PLATFORM_CFG[p].label).join(", ") },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-start justify-between gap-2">
                        <span className="text-[11px] text-gray-400 shrink-0">{label}</span>
                        <span className="text-[12px] font-medium text-gray-700 text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget & Time */}
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">Ngân sách</p>
                    <div className="flex items-center gap-3">
                      {selected.budget !== "Không giới hạn" && (
                        <MiniDonut
                          pct={selected.budgetUsed}
                          color={selected.budgetUsed >= 90 ? "#ef4444" : selected.budgetUsed >= 70 ? "#f59e0b" : "#10b981"}
                        />
                      )}
                      <div>
                        <p className="text-lg font-medium text-gray-900">{selected.budget}</p>
                        <p className="text-[11px] text-gray-400">Tổng ngân sách</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">Thời gian</p>
                    <div className="space-y-2">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-[10px] text-gray-400 flex items-center gap-1 mb-0.5"><CalendarDays size={9} /> Bắt đầu</p>
                        <p className="text-[12px] font-medium text-gray-800">{selected.startDate}</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-[10px] text-gray-400 flex items-center gap-1 mb-0.5"><Clock size={9} /> Kết thúc</p>
                        <p className="text-[12px] font-medium text-gray-800">{selected.endDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="p-5">
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-3">Hành động</p>
                  <div className="space-y-2">
                    {[
                      { label: "Xem QR code",              icon: QrCode,       cls: "text-gray-700 border-gray-200 bg-gray-50 hover:bg-gray-100" },
                      { label: "Xuất danh sách lượt dùng", icon: Download,     cls: "text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100" },
                      { label: "Gửi mã cho khách hàng",    icon: Send,         cls: "text-violet-600 border-violet-200 bg-violet-50 hover:bg-violet-100" },
                      { label: "Nhân bản mã coupon",       icon: Copy,         cls: "text-teal-600 border-teal-200 bg-teal-50 hover:bg-teal-100" },
                      { label: "Tạo hàng loạt mã",        icon: RefreshCcw,   cls: "text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100" },
                      { label: "Gắn vào chiến dịch",       icon: Megaphone,    cls: "text-gray-600 border-gray-200 bg-gray-50 hover:bg-gray-100" },
                    ].map(({ label, icon: Icon, cls }) => (
                      <button key={label} className={cn("w-full text-[12px] border rounded-lg py-1.5 px-3 transition-colors font-medium flex items-center gap-2", cls)}>
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