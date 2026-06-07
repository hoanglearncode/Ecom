"use client";

import React, { useState } from "react";
import {
  Bell, RefreshCw, Plus, Search, Store, Package, ShoppingCart,
  BarChart2, Star, Users, FileText, Settings, MoreHorizontal,
  Eye, Pencil, Trash2, MoreVertical, Filter, ArrowUpDown,
  TrendingUp, TrendingDown, Megaphone, Target, MousePointerClick,
  Layers, CalendarDays, Clock, XCircle, Flame, Zap, Copy,
  Headphones, BadgePercent, PlayCircle, PauseCircle, CheckCircle2,
  ImageIcon, Video, Mail, Smartphone, Globe, Users2, DollarSign,
  ChevronRight, BarChart, PieChart, Activity, Send, ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { AdminPagination, usePagination, paginateData } from "@/components/admin";

// ─── Types ───────────────────────────────────────────────────────────────────

type CampaignStatus = "active" | "scheduled" | "ended" | "draft" | "paused";
type CampaignGoal   = "awareness" | "conversion" | "retention" | "launch";
type CampaignChannel = "social" | "email" | "push" | "banner" | "video" | "search";
type TabKey = "all" | CampaignStatus;

interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  goal: CampaignGoal;
  channels: CampaignChannel[];
  brandName: string;
  brandEmoji: string;
  platform: ("shopee" | "lazada" | "tiki" | "sendo")[];
  budget: string;
  budgetUsed: number;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  revenue: string;
  roas: number;
  startDate: string;
  endDate: string;
  assignee: string;
  isHot: boolean;
  thumbnail: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CAMPAIGNS: Campaign[] = [
  {
    id: "CAM-2041",
    name: "Summer Sale 2026 – Bứt Phá Hè",
    status: "active",
    goal: "conversion",
    channels: ["social", "banner", "push"],
    brandName: "Biti's Hunter",
    brandEmoji: "👟",
    platform: ["shopee", "lazada", "tiki"],
    budget: "200 tr",
    budgetUsed: 62,
    impressions: 4820000,
    clicks: 96400,
    ctr: 2.0,
    conversions: 8210,
    revenue: "124 tr",
    roas: 3.1,
    startDate: "01/06/2026",
    endDate: "30/06/2026",
    assignee: "Minh Anh",
    isHot: true,
    thumbnail: "🌊",
  },
  {
    id: "CAM-2040",
    name: "Ra Mắt Galaxy S25 Series",
    status: "active",
    goal: "launch",
    channels: ["video", "social", "email", "banner"],
    brandName: "Samsung Electronics",
    brandEmoji: "📱",
    platform: ["shopee", "lazada"],
    budget: "500 tr",
    budgetUsed: 44,
    impressions: 12400000,
    clicks: 248000,
    ctr: 2.0,
    conversions: 18700,
    revenue: "312 tr",
    roas: 2.8,
    startDate: "15/05/2026",
    endDate: "15/07/2026",
    assignee: "Quốc Bảo",
    isHot: true,
    thumbnail: "🚀",
  },
  {
    id: "CAM-2039",
    name: "Chăm Sóc Da Mùa Hè – Shiseido",
    status: "active",
    goal: "awareness",
    channels: ["social", "video", "email"],
    brandName: "Shiseido Vietnam",
    brandEmoji: "💄",
    platform: ["lazada", "tiki"],
    budget: "120 tr",
    budgetUsed: 71,
    impressions: 2100000,
    clicks: 37800,
    ctr: 1.8,
    conversions: 3240,
    revenue: "58 tr",
    roas: 2.4,
    startDate: "01/06/2026",
    endDate: "31/07/2026",
    assignee: "Thanh Tú",
    isHot: false,
    thumbnail: "🌸",
  },
  {
    id: "CAM-2038",
    name: "Back to School – Nike Kids",
    status: "scheduled",
    goal: "conversion",
    channels: ["social", "push", "email"],
    brandName: "Nike Vietnam",
    brandEmoji: "🏃",
    platform: ["shopee", "tiki"],
    budget: "180 tr",
    budgetUsed: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    conversions: 0,
    revenue: "0",
    roas: 0,
    startDate: "01/08/2026",
    endDate: "15/09/2026",
    assignee: "Minh Anh",
    isHot: false,
    thumbnail: "🎒",
  },
  {
    id: "CAM-2037",
    name: "Canifa Thu Đông 2026",
    status: "draft",
    goal: "launch",
    channels: ["social", "banner"],
    brandName: "Canifa Fashion",
    brandEmoji: "👕",
    platform: ["shopee", "lazada", "tiki", "sendo"],
    budget: "150 tr",
    budgetUsed: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    conversions: 0,
    revenue: "0",
    roas: 0,
    startDate: "Chưa lên lịch",
    endDate: "Chưa lên lịch",
    assignee: "Hồng Nhung",
    isHot: false,
    thumbnail: "🍂",
  },
  {
    id: "CAM-2036",
    name: "G7 Cà Phê Việt – Tự Hào",
    status: "paused",
    goal: "awareness",
    channels: ["video", "social"],
    brandName: "Trung Nguyên Legend",
    brandEmoji: "🍵",
    platform: ["shopee", "lazada"],
    budget: "80 tr",
    budgetUsed: 38,
    impressions: 980000,
    clicks: 14700,
    ctr: 1.5,
    conversions: 1120,
    revenue: "22 tr",
    roas: 1.7,
    startDate: "10/05/2026",
    endDate: "10/06/2026",
    assignee: "Quốc Bảo",
    isHot: false,
    thumbnail: "☕",
  },
  {
    id: "CAM-2035",
    name: "Vitamin C – Sức Đề Kháng Vàng",
    status: "ended",
    goal: "conversion",
    channels: ["banner", "push", "email"],
    brandName: "Dược Hậu Giang",
    brandEmoji: "💊",
    platform: ["shopee"],
    budget: "60 tr",
    budgetUsed: 100,
    impressions: 1540000,
    clicks: 30800,
    ctr: 2.0,
    conversions: 4620,
    revenue: "64 tr",
    roas: 3.2,
    startDate: "01/04/2026",
    endDate: "30/04/2026",
    assignee: "Thanh Tú",
    isHot: false,
    thumbnail: "🍋",
  },
  {
    id: "CAM-2034",
    name: "JYSK Nhà Đẹp Mỗi Ngày",
    status: "active",
    goal: "retention",
    channels: ["email", "push", "social"],
    brandName: "JYSK Furniture",
    brandEmoji: "🛋️",
    platform: ["tiki", "sendo"],
    budget: "90 tr",
    budgetUsed: 54,
    impressions: 870000,
    clicks: 13050,
    ctr: 1.5,
    conversions: 980,
    revenue: "34 tr",
    roas: 2.1,
    startDate: "01/05/2026",
    endDate: "31/07/2026",
    assignee: "Hồng Nhung",
    isHot: false,
    thumbnail: "🏠",
  },
  {
    id: "CAM-2033",
    name: "Biti's Hunter Street Culture",
    status: "scheduled",
    goal: "awareness",
    channels: ["video", "social"],
    brandName: "Biti's Hunter",
    brandEmoji: "👟",
    platform: ["shopee", "tiki"],
    budget: "250 tr",
    budgetUsed: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    conversions: 0,
    revenue: "0",
    roas: 0,
    startDate: "15/07/2026",
    endDate: "30/09/2026",
    assignee: "Minh Anh",
    isHot: false,
    thumbnail: "🎨",
  },
  {
    id: "CAM-2032",
    name: "Nike Loyalty – Khách Hàng Thân Thiết",
    status: "active",
    goal: "retention",
    channels: ["email", "push"],
    brandName: "Nike Vietnam",
    brandEmoji: "🏃",
    platform: ["shopee", "lazada"],
    budget: "70 tr",
    budgetUsed: 29,
    impressions: 560000,
    clicks: 11200,
    ctr: 2.0,
    conversions: 2240,
    revenue: "41 tr",
    roas: 3.5,
    startDate: "01/01/2026",
    endDate: "31/12/2026",
    assignee: "Quốc Bảo",
    isHot: false,
    thumbnail: "💎",
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<CampaignStatus, { label: string; dot: string; cls: string }> = {
  active:    { label: "Đang chạy",    dot: "bg-emerald-500", cls: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  scheduled: { label: "Sắp diễn ra",  dot: "bg-blue-500",    cls: "bg-blue-50 text-blue-700 border-blue-200" },
  paused:    { label: "Tạm dừng",     dot: "bg-amber-400",   cls: "bg-amber-50 text-amber-700 border-amber-200" },
  ended:     { label: "Đã kết thúc",  dot: "bg-gray-400",    cls: "bg-gray-100 text-gray-600 border-gray-200" },
  draft:     { label: "Bản nháp",     dot: "bg-violet-400",  cls: "bg-violet-50 text-violet-700 border-violet-200" },
};

const GOAL_CFG: Record<CampaignGoal, { label: string; emoji: string; cls: string }> = {
  awareness:  { label: "Nhận diện",   emoji: "📣", cls: "bg-sky-50 text-sky-700 border-sky-200" },
  conversion: { label: "Chuyển đổi",  emoji: "🎯", cls: "bg-violet-50 text-violet-700 border-violet-200" },
  retention:  { label: "Giữ chân",    emoji: "💎", cls: "bg-teal-50 text-teal-700 border-teal-200" },
  launch:     { label: "Ra mắt",      emoji: "🚀", cls: "bg-orange-50 text-orange-700 border-orange-200" },
};

const CHANNEL_CFG: Record<CampaignChannel, { label: string; icon: React.ElementType; cls: string }> = {
  social:  { label: "Social",  icon: Users2,          cls: "bg-blue-50 text-blue-600 border-blue-200" },
  email:   { label: "Email",   icon: Mail,            cls: "bg-amber-50 text-amber-700 border-amber-200" },
  push:    { label: "Push",    icon: Smartphone,      cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  banner:  { label: "Banner",  icon: ImageIcon,       cls: "bg-pink-50 text-pink-700 border-pink-200" },
  video:   { label: "Video",   icon: Video,           cls: "bg-red-50 text-red-700 border-red-200" },
  search:  { label: "Search",  icon: Globe,           cls: "bg-violet-50 text-violet-700 border-violet-200" },
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(0) + "K";
  return String(n);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values); const min = Math.min(...values); const range = max - min || 1;
  const W = 80; const H = 28;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * W},${H - ((v - min) / range) * (H - 2) - 1}`);
  return (
    <svg width={W} height={H}>
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BudgetBar({ pct, status }: { pct: number; status: CampaignStatus }) {
  const color = pct >= 90 ? "bg-red-400" : pct >= 70 ? "bg-amber-400" : status === "active" ? "bg-emerald-400" : "bg-gray-300";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-gray-100 overflow-hidden">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] text-gray-500 w-7">{pct}%</span>
    </div>
  );
}

function ChannelIcons({ channels }: { channels: CampaignChannel[] }) {
  return (
    <div className="flex gap-1 flex-wrap">
      {channels.map(ch => {
        const cfg = CHANNEL_CFG[ch];
        const Icon : any = cfg.icon;
        return (
          <span key={ch} title={cfg.label}
            className={cn("w-5 h-5 rounded flex items-center justify-center border", cfg.cls)}>
            <Icon size={10} />
          </span>
        );
      })}
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

export default function CampaignsManagementPage() {
  const [activeTab, setActiveTab]     = useState<TabKey>("all");
  const [goalFilter, setGoalFilter]   = useState<CampaignGoal | "all">("all");
  const [search, setSearch]           = useState("");
  const [selected, setSelected]       = useState<Campaign | null>(null);
  const { state: pagination, onStateChange: setPagination, reset: resetPagination } = usePagination({ pageSize: 10 });

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all",       label: "Tất cả" },
    { key: "active",    label: "Đang chạy" },
    { key: "scheduled", label: "Sắp diễn ra" },
    { key: "paused",    label: "Tạm dừng" },
    { key: "draft",     label: "Bản nháp" },
    { key: "ended",     label: "Đã kết thúc" },
  ];

  const tabCounts: Record<TabKey, number> = {
    all:       CAMPAIGNS.length,
    active:    CAMPAIGNS.filter(c => c.status === "active").length,
    scheduled: CAMPAIGNS.filter(c => c.status === "scheduled").length,
    paused:    CAMPAIGNS.filter(c => c.status === "paused").length,
    draft:     CAMPAIGNS.filter(c => c.status === "draft").length,
    ended:     CAMPAIGNS.filter(c => c.status === "ended").length,
  };

  const goalFilters: { key: CampaignGoal | "all"; label: string }[] = [
    { key: "all",        label: "Tất cả mục tiêu" },
    { key: "awareness",  label: "📣 Nhận diện" },
    { key: "conversion", label: "🎯 Chuyển đổi" },
    { key: "retention",  label: "💎 Giữ chân" },
    { key: "launch",     label: "🚀 Ra mắt" },
  ];

  const filtered = CAMPAIGNS.filter(c => {
    const matchTab  = activeTab === "all" || c.status === activeTab;
    const matchGoal = goalFilter === "all" || c.goal === goalFilter;
    const matchQ    = search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.brandName.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchGoal && matchQ;
  });

  const paginatedCampaigns = paginateData(filtered, pagination.page, pagination.pageSize);

  // Reset pagination when filters change
  React.useEffect(() => {
    resetPagination();
  }, [activeTab, goalFilter, resetPagination]);

  const activeOnes  = CAMPAIGNS.filter(c => c.status === "active");
  const totalImpr   = activeOnes.reduce((s, c) => s + c.impressions, 0);
  const totalClicks = activeOnes.reduce((s, c) => s + c.clicks, 0);
  const avgCTR      = totalImpr > 0 ? ((totalClicks / totalImpr) * 100).toFixed(2) : "0";
  const totalRev    = "659 tr";
  const avgROAS     = (CAMPAIGNS.filter(c => c.roas > 0).reduce((s, c) => s + c.roas, 0) /
                       CAMPAIGNS.filter(c => c.roas > 0).length).toFixed(1);

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-sm overflow-hidden">

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 h-[52px] px-6 flex items-center gap-4 shrink-0">
          <h1 className="text-base font-medium text-gray-900 flex-1">Chiến dịch marketing</h1>
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 w-60">
            <Search size={13} className="text-gray-400" />
            <input
              className="bg-transparent text-[13px] text-gray-700 outline-none placeholder:text-gray-400 flex-1"
              placeholder="Tìm tên, thương hiệu, ID..."
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
              <Plus size={14} /> Tạo chiến dịch
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* ── KPI cards ── */}
          <div className="grid grid-cols-4 gap-3">
            {[
              {
                label: "Tổng doanh thu",
                value: totalRev,
                change: "+28.4%", up: true,
                sub: "so với tháng trước",
                icon: DollarSign, iconBg: "bg-emerald-50", iconColor: "text-emerald-600",
                spark: [420, 460, 490, 510, 580, 620, 659], sparkColor: "#10b981",
              },
              {
                label: "Tổng lượt hiển thị",
                value: fmtNum(totalImpr),
                change: "+11.2%", up: true,
                sub: "chiến dịch đang chạy",
                icon: Activity, iconBg: "bg-blue-50", iconColor: "text-blue-600",
                spark: [18, 19.2, 20, 21.5, 22, 22.8, totalImpr / 1_000_000],
                sparkColor: "#2563eb",
              },
              {
                label: "CTR trung bình",
                value: `${avgCTR}%`,
                change: "+0.3%", up: true,
                sub: "so với tuần trước",
                icon: MousePointerClick, iconBg: "bg-violet-50", iconColor: "text-violet-600",
                spark: [1.5, 1.6, 1.7, 1.8, 1.9, 1.95, parseFloat(avgCTR)],
                sparkColor: "#7c3aed",
              },
              {
                label: "ROAS trung bình",
                value: `${avgROAS}x`,
                change: "+0.4x", up: true,
                sub: "so với tháng trước",
                icon: Target, iconBg: "bg-orange-50", iconColor: "text-orange-500",
                spark: [2.1, 2.3, 2.5, 2.4, 2.7, 2.8, parseFloat(avgROAS)],
                sparkColor: "#f97316",
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
          <div className="grid grid-cols-[1fr_1fr_1fr_240px] gap-3">

            {/* Funnel */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-medium text-gray-900">Phễu chuyển đổi</h3>
                <BarChart size={14} className="text-gray-400" />
              </div>
              <div className="space-y-2">
                {[
                  { label: "Hiển thị",       value: fmtNum(totalImpr),   pct: 100, color: "bg-blue-400",    width: "100%" },
                  { label: "Nhấp chuột",     value: fmtNum(totalClicks), pct: Math.round((totalClicks / totalImpr) * 100) || 2, color: "bg-violet-400", width: "52%" },
                  { label: "Trang sản phẩm", value: fmtNum(Math.round(totalClicks * 0.68)), pct: Math.round((totalClicks * 0.68 / totalImpr) * 100) || 1, color: "bg-teal-400", width: "34%" },
                  { label: "Chuyển đổi",     value: fmtNum(activeOnes.reduce((s, c) => s + c.conversions, 0)), pct: 0, color: "bg-emerald-400", width: "18%" },
                ].map(({ label, value, pct, color, width }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between text-[11px] text-gray-500 mb-0.5">
                      <span>{label}</span>
                      <span className="font-medium text-gray-700">{value}</span>
                    </div>
                    <div className="h-4 bg-gray-50 rounded overflow-hidden">
                      <div className={cn("h-full rounded flex items-center px-2", color)} style={{ width }}>
                        {pct > 0 && <span className="text-[9px] text-white font-medium">{pct}%</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-center">
                <div>
                  <p className="text-base font-medium text-gray-900">{avgCTR}%</p>
                  <p className="text-[11px] text-gray-400">CTR trung bình</p>
                </div>
                <div>
                  <p className="text-base font-medium text-gray-900">{avgROAS}x</p>
                  <p className="text-[11px] text-gray-400">ROAS trung bình</p>
                </div>
              </div>
            </div>

            {/* Goal breakdown */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-medium text-gray-900">Phân bổ mục tiêu</h3>
                <PieChart size={14} className="text-gray-400" />
              </div>
              <div className="space-y-2.5">
                {(["awareness","conversion","retention","launch"] as CampaignGoal[]).map(goal => {
                  const cfg   = GOAL_CFG[goal];
                  const count = CAMPAIGNS.filter(c => c.goal === goal).length;
                  const pct   = Math.round((count / CAMPAIGNS.length) * 100);
                  const barCls: Record<CampaignGoal, string> = {
                    awareness: "bg-sky-400", conversion: "bg-violet-400",
                    retention: "bg-teal-400", launch: "bg-orange-400",
                  };
                  return (
                    <div key={goal}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] text-gray-600 flex items-center gap-1.5">
                          <span>{cfg.emoji}</span>{cfg.label}
                        </span>
                        <span className="text-[11px] font-medium text-gray-700">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", barCls[goal])} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-gray-500">Tổng ngân sách</span>
                  <span className="font-medium text-gray-800">1.7 tỷ</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-gray-500">Đã giải ngân</span>
                  <span className="font-medium text-emerald-700">588 tr (35%)</span>
                </div>
              </div>
            </div>

            {/* Channel performance */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-medium text-gray-900">Hiệu quả kênh</h3>
                <Layers size={14} className="text-gray-400" />
              </div>
              <div className="space-y-2">
                {([
                  { ch: "social" as CampaignChannel,  ctr: "2.4%", conv: "12.1K", roas: "3.2x", bar: 78 },
                  { ch: "video"  as CampaignChannel,  ctr: "1.8%", conv: "8.4K",  roas: "2.7x", bar: 58 },
                  { ch: "email"  as CampaignChannel,  ctr: "3.1%", conv: "6.2K",  roas: "4.1x", bar: 44 },
                  { ch: "push"   as CampaignChannel,  ctr: "2.9%", conv: "5.8K",  roas: "3.8x", bar: 40 },
                  { ch: "banner" as CampaignChannel,  ctr: "1.2%", conv: "3.1K",  roas: "1.9x", bar: 22 },
                ]).map(({ ch, ctr, conv, roas, bar }) => {
                  const cfg = CHANNEL_CFG[ch];
                  const Icon : any = cfg.icon;
                  const barCls: Record<CampaignChannel, string> = {
                    social: "bg-blue-400", email: "bg-amber-400", push: "bg-emerald-400",
                    banner: "bg-pink-400", video: "bg-red-400", search: "bg-violet-400",
                  };
                  return (
                    <div key={ch} className="flex items-center gap-2">
                      <span className={cn("w-6 h-6 rounded flex items-center justify-center border shrink-0", cfg.cls)}>
                        <Icon size={11} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-[11px] mb-0.5">
                          <span className="text-gray-600 font-medium">{cfg.label}</span>
                          <div className="flex gap-2">
                            <span className="text-gray-400">CTR {ctr}</span>
                            <span className="text-emerald-600 font-medium">{roas}</span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full", barCls[ch])} style={{ width: `${bar}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top campaigns */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-medium text-gray-900">Nổi bật nhất</h3>
                <Flame size={14} className="text-orange-500" />
              </div>
              <div className="space-y-1">
                {[...CAMPAIGNS]
                  .filter(c => c.roas > 0)
                  .sort((a, b) => b.roas - a.roas)
                  .slice(0, 5)
                  .map((c, i) => (
                    <div key={c.id}
                      className="flex items-center gap-2 py-2 px-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <span className={cn("text-[11px] font-medium w-4 shrink-0", i === 0 ? "text-amber-500" : "text-gray-400")}>
                        {i + 1}
                      </span>
                      <span className="text-base shrink-0">{c.thumbnail}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-gray-900 truncate">{c.name}</p>
                        <p className="text-[10px] text-gray-400">{c.brandEmoji} {c.brandName}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[12px] font-medium text-emerald-600">{c.roas}x</p>
                        <p className="text-[9px] text-gray-400">ROAS</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* ── Campaign table ── */}
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

            {/* Goal filter */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
              {goalFilters.map(({ key, label }) => (
                <button key={key} onClick={() => setGoalFilter(key as CampaignGoal | "all")}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[12px] border transition-all whitespace-nowrap",
                    goalFilter === key ? "bg-[#1a1a2e] text-white border-[#1a1a2e]" : "text-gray-500 border-gray-200 hover:bg-gray-50"
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
                  {["Chiến dịch","Thương hiệu","Mục tiêu","Kênh","Sàn","Ngân sách","Hiển thị","Clicks / CTR","Chuyển đổi","ROAS","Phụ trách","Thời gian","Trạng thái",""].map(h => (
                    <TableHead key={h} className="text-[11px] font-medium text-gray-400 uppercase tracking-wider py-2.5 whitespace-nowrap">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCampaigns.map(cam => {
                  const st    = STATUS_CFG[cam.status];
                  const goal  = GOAL_CFG[cam.goal];
                  const isSel = selected?.id === cam.id;
                  return (
                    <TableRow key={cam.id}
                      onClick={() => setSelected(isSel ? null : cam)}
                      className={cn(
                        "border-gray-100 transition-colors cursor-pointer",
                        cam.isHot ? "bg-orange-50/20 hover:bg-orange-50/40" : "hover:bg-gray-50/60",
                        isSel ? "bg-violet-50/40" : ""
                      )}
                    >
                      {/* Name */}
                      <TableCell className="py-3 min-w-[180px]">
                        <div className="flex items-center gap-2">
                          <span className="text-xl shrink-0">{cam.thumbnail}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              {cam.isHot && <Flame size={11} className="text-orange-500 shrink-0" />}
                              <p className="text-[13px] font-medium text-gray-900 line-clamp-1">{cam.name}</p>
                            </div>
                            <p className="text-[10px] font-mono text-gray-400 mt-0.5">{cam.id}</p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Brand */}
                      <TableCell>
                        <span className="text-[12px] text-gray-600 whitespace-nowrap">{cam.brandEmoji} {cam.brandName}</span>
                      </TableCell>

                      {/* Goal */}
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[10px] font-medium border whitespace-nowrap", goal.cls)}>
                          {goal.emoji} {goal.label}
                        </Badge>
                      </TableCell>

                      {/* Channels */}
                      <TableCell><ChannelIcons channels={cam.channels} /></TableCell>

                      {/* Platforms */}
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {cam.platform.map(p => (
                            <span key={p} className={cn("text-[9px] px-1.5 py-0.5 rounded border font-medium", PLATFORM_CFG[p].cls)}>
                              {PLATFORM_CFG[p].label}
                            </span>
                          ))}
                        </div>
                      </TableCell>

                      {/* Budget */}
                      <TableCell>
                        <p className="text-[12px] font-medium text-gray-800 mb-0.5">{cam.budget}</p>
                        <BudgetBar pct={cam.budgetUsed} status={cam.status} />
                      </TableCell>

                      {/* Impressions */}
                      <TableCell>
                        <p className="text-[13px] font-medium text-gray-900">
                          {cam.impressions > 0 ? fmtNum(cam.impressions) : "—"}
                        </p>
                      </TableCell>

                      {/* Clicks / CTR */}
                      <TableCell>
                        {cam.clicks > 0 ? (
                          <div>
                            <p className="text-[12px] font-medium text-gray-800">{fmtNum(cam.clicks)}</p>
                            <p className="text-[10px] text-blue-600">{cam.ctr}% CTR</p>
                          </div>
                        ) : <span className="text-[12px] text-gray-400">—</span>}
                      </TableCell>

                      {/* Conversions */}
                      <TableCell>
                        {cam.conversions > 0 ? (
                          <div>
                            <p className="text-[12px] font-medium text-gray-800">{fmtNum(cam.conversions)}</p>
                            <p className="text-[10px] text-gray-400">{cam.revenue}</p>
                          </div>
                        ) : <span className="text-[12px] text-gray-400">—</span>}
                      </TableCell>

                      {/* ROAS */}
                      <TableCell>
                        {cam.roas > 0 ? (
                          <span className={cn("text-[13px] font-medium",
                            cam.roas >= 3 ? "text-emerald-600" : cam.roas >= 2 ? "text-blue-600" : "text-amber-600")}>
                            {cam.roas}x
                          </span>
                        ) : <span className="text-[12px] text-gray-400">—</span>}
                      </TableCell>

                      {/* Assignee */}
                      <TableCell><AvatarPill name={cam.assignee} /></TableCell>

                      {/* Time */}
                      <TableCell className="min-w-[120px]">
                        <div className="text-[11px] space-y-0.5">
                          <div className="flex items-center gap-1 text-gray-500">
                            <CalendarDays size={10} /> {cam.startDate}
                          </div>
                          <div className="flex items-center gap-1 text-gray-400">
                            <Clock size={10} /> {cam.endDate}
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
                          <button className="w-6 h-6 rounded-md border border-gray-150 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                            <Eye size={11} />
                          </button>
                          <button className="w-6 h-6 rounded-md border border-gray-150 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                            <Pencil size={11} />
                          </button>
                          {cam.status === "active" ? (
                            <button className="w-6 h-6 rounded-md border border-amber-200 flex items-center justify-center text-amber-500 hover:bg-amber-50 transition-colors" title="Tạm dừng">
                              <PauseCircle size={11} />
                            </button>
                          ) : cam.status === "paused" || cam.status === "draft" ? (
                            <button className="w-6 h-6 rounded-md border border-emerald-200 flex items-center justify-center text-emerald-500 hover:bg-emerald-50 transition-colors" title="Chạy">
                              <PlayCircle size={11} />
                            </button>
                          ) : null}
                          <button className="w-6 h-6 rounded-md border border-gray-150 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors">
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
              <div className="py-16 text-center text-gray-400 text-sm">Không tìm thấy chiến dịch nào phù hợp.</div>
            )}

            {/* Pagination */}
            <AdminPagination
              state={pagination}
              onStateChange={setPagination}
              totalItems={filtered.length}
              itemsLabel="chiến dịch"
            />
          </div>

          {/* ── Detail panel ── */}
          {selected && (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selected.thumbnail}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      {selected.isHot && <Flame size={13} className="text-orange-500" />}
                      <h3 className="text-[14px] font-medium text-gray-900">{selected.name}</h3>
                      <span className="font-mono text-[11px] text-gray-400">{selected.id}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className={cn("text-[10px] border gap-1", STATUS_CFG[selected.status].cls)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", STATUS_CFG[selected.status].dot)} />
                        {STATUS_CFG[selected.status].label}
                      </Badge>
                      <Badge variant="outline" className={cn("text-[10px] border", GOAL_CFG[selected.goal].cls)}>
                        {GOAL_CFG[selected.goal].emoji} {GOAL_CFG[selected.goal].label}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selected.status === "active" ? (
                    <Button size="sm" className="h-7 text-[12px] bg-amber-500 hover:bg-amber-600 text-white gap-1.5">
                      <PauseCircle size={12} /> Tạm dừng
                    </Button>
                  ) : (selected.status === "paused" || selected.status === "draft") ? (
                    <Button size="sm" className="h-7 text-[12px] bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
                      <PlayCircle size={12} /> Kích hoạt
                    </Button>
                  ) : null}
                  <Button size="sm" variant="outline" className="h-7 text-[12px] border-gray-200 text-gray-600 gap-1.5">
                    <Pencil size={12} /> Chỉnh sửa
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-[12px] border-gray-200 text-gray-600 gap-1.5">
                    <Copy size={12} /> Nhân bản
                  </Button>
                  <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                    <XCircle size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-5 divide-x divide-gray-100">

                {/* Performance metrics */}
                <div className="p-5 col-span-2">
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-3">Hiệu quả chiến dịch</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Lượt hiển thị", value: fmtNum(selected.impressions), icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
                      { label: "Nhấp chuột",     value: fmtNum(selected.clicks),      icon: MousePointerClick, color: "text-violet-600", bg: "bg-violet-50" },
                      { label: "CTR",            value: selected.ctr > 0 ? `${selected.ctr}%` : "—", icon: Target,   color: "text-teal-600",   bg: "bg-teal-50" },
                      { label: "Chuyển đổi",     value: fmtNum(selected.conversions), icon: CheckCircle2,     color: "text-emerald-600", bg: "bg-emerald-50" },
                      { label: "Doanh thu",      value: selected.revenue !== "0" ? selected.revenue : "—", icon: DollarSign, color: "text-amber-600", bg: "bg-amber-50" },
                      { label: "ROAS",           value: selected.roas > 0 ? `${selected.roas}x` : "—", icon: Zap,   color: "text-orange-600", bg: "bg-orange-50" },
                    ].map(({ label, value, icon: Icon, color, bg }) => (
                      <div key={label} className="p-2.5 bg-gray-50 rounded-lg">
                        <div className={cn("w-6 h-6 rounded flex items-center justify-center mb-1.5", bg)}>
                          <Icon size={12} className={color} />
                        </div>
                        <p className="text-[14px] font-medium text-gray-900">{value || "—"}</p>
                        <p className="text-[10px] text-gray-400">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-3">Thông tin</p>
                  <div className="space-y-2">
                    {[
                      { label: "Thương hiệu",  value: `${selected.brandEmoji} ${selected.brandName}` },
                      { label: "Phụ trách",    value: selected.assignee },
                      { label: "Sàn",          value: selected.platform.map(p => PLATFORM_CFG[p].label).join(", ") },
                      { label: "Ngân sách",    value: selected.budget },
                      { label: "Đã dùng",      value: `${selected.budgetUsed}%` },
                      { label: "Bắt đầu",      value: selected.startDate },
                      { label: "Kết thúc",     value: selected.endDate },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-start justify-between gap-2">
                        <span className="text-[11px] text-gray-400 shrink-0">{label}</span>
                        <span className="text-[12px] font-medium text-gray-700 text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget donut */}
                <div className="p-5">
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-3">Ngân sách</p>
                  <div className="flex items-center gap-3 mb-3">
                    <MiniDonut
                      pct={selected.budgetUsed}
                      color={selected.budgetUsed >= 90 ? "#ef4444" : selected.budgetUsed >= 70 ? "#f59e0b" : "#10b981"}
                    />
                    <div>
                      <p className="text-lg font-medium text-gray-900">{selected.budget}</p>
                      <p className="text-[11px] text-gray-400">Tổng ngân sách</p>
                    </div>
                  </div>
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mt-3 mb-2">Kênh phân phối</p>
                  <ChannelIcons channels={selected.channels} />
                  <div className="mt-2 space-y-1">
                    {selected.channels.map(ch => {
                      const cfg = CHANNEL_CFG[ch];
                      const Icon : any = cfg.icon;
                      return (
                        <div key={ch} className="flex items-center gap-1.5 text-[11px] text-gray-600">
                          <Icon size={10} className="text-gray-400" /> {cfg.label}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="p-5">
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-3">Hành động</p>
                  <div className="space-y-2">
                    {[
                      { label: "Xem báo cáo chi tiết",     icon: BarChart,      cls: "text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100" },
                      { label: "Nhân bản chiến dịch",      icon: Copy,          cls: "text-violet-600 border-violet-200 bg-violet-50 hover:bg-violet-100" },
                      { label: "Gửi thông báo nội bộ",     icon: Send,          cls: "text-teal-600 border-teal-200 bg-teal-50 hover:bg-teal-100" },
                      { label: "Gắn vào khuyến mãi",       icon: BadgePercent,  cls: "text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100" },
                      { label: "Mở rộng sang sàn khác",    icon: ArrowRight,    cls: "text-gray-600 border-gray-200 bg-gray-50 hover:bg-gray-100" },
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