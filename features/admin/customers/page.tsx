"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  RefreshCw,
  Plus,
  Search,
  Eye,
  Pencil,
  MoreVertical,
  Filter,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  UserCheck,
  UserX,
  Crown,
  Gift,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  ShoppingBag,
  Wallet,
  Users,
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
import { cn } from "@/lib/utils";
import { AdminPagination, usePagination, paginateData } from "@/components/admin";
import { getAdminCustomers } from "../api";
import type { AdminCustomer } from "../types";

// ─── Types ────────────────────────────────────────────────────────────────────

type CustomerStatus = "active" | "inactive" | "blocked";
type CustomerTier = "diamond" | "gold" | "silver" | "basic";
type TabKey = "all" | CustomerStatus;
type SegmentKey = "all" | CustomerTier;

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  tier: CustomerTier;
  status: CustomerStatus;
  totalOrders: number;
  totalSpent: string;
  lastOrder: string;
  joinDate: string;
  avatar: string;
}

// ─── Data adapters ────────────────────────────────────────────────────────────

const TIER_MAP: Record<AdminCustomer["tier"], CustomerTier> = {
  platinum: "diamond",
  gold: "gold",
  silver: "silver",
  bronze: "basic",
};

const TODAY = new Date("2026-06-13");

function formatSpent(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)} tr`;
  if (amount >= 1_000) return `${Math.round(amount / 1_000)} k`;
  return `${amount} đ`;
}

function formatRelativeDate(dateStr?: string): string {
  if (!dateStr) return "Chưa có";
  const diff = Math.floor((TODAY.getTime() - new Date(dateStr).getTime()) / 86_400_000);
  if (diff <= 0) return "Hôm nay";
  if (diff === 1) return "Hôm qua";
  if (diff < 7) return `${diff} ngày trước`;
  if (diff < 30) return `${Math.floor(diff / 7)} tuần trước`;
  if (diff < 365) return `${Math.floor(diff / 30)} tháng trước`;
  return `${Math.floor(diff / 365)} năm trước`;
}

function formatJoinDate(dateStr: string): string {
  const [year, month] = dateStr.split("-");
  return `Th${parseInt(month)}/${year}`;
}

function getInitials(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

function getAvatarColor(initials: string): string {
  const palette = [
    "bg-pink-100 text-pink-700",
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-orange-100 text-orange-700",
    "bg-purple-100 text-purple-700",
    "bg-teal-100 text-teal-700",
    "bg-indigo-100 text-indigo-700",
    "bg-yellow-100 text-yellow-700",
    "bg-red-100 text-red-600",
    "bg-sky-100 text-sky-700",
    "bg-violet-100 text-violet-700",
    "bg-amber-100 text-amber-700",
  ];
  const hash = [...initials].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return palette[hash % palette.length];
}

function adaptCustomer(c: AdminCustomer, idx: number): Customer {
  const initials = getInitials(c.name);
  return {
    id: idx + 1,
    name: c.name,
    email: c.email,
    phone: c.phone,
    city: c.city,
    tier: TIER_MAP[c.tier] ?? "basic",
    status: c.status,
    totalOrders: c.totalOrders,
    totalSpent: formatSpent(c.totalSpent),
    lastOrder: formatRelativeDate(c.lastOrderAt),
    joinDate: c.createdAt ? formatJoinDate(c.createdAt) : "–",
    avatar: initials,
  };
}

// ─── Static chart data (illustrative) ────────────────────────────────────────

const CHART_DATA = {
  months: ["Th7", "Th8", "Th9", "Th10", "Th11", "Th12", "Th1"],
  new: [124, 148, 139, 167, 182, 210, 195],
  returning: [380, 410, 395, 430, 460, 490, 475],
};

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<CustomerStatus, { label: string; dot: string; className: string }> = {
  active: { label: "Hoạt động", dot: "bg-emerald-500", className: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  inactive: { label: "Không hoạt động", dot: "bg-gray-400", className: "bg-gray-100 text-gray-600 border-gray-200" },
  blocked: { label: "Bị chặn", dot: "bg-red-500", className: "bg-red-50 text-red-700 border-red-200" },
};

const TIER_CONFIG: Record<CustomerTier, { label: string; icon: string; className: string; badge: string }> = {
  diamond: { label: "Diamond", icon: "💎", className: "text-sky-700 bg-sky-50 border-sky-200", badge: "bg-sky-100 text-sky-800" },
  gold: { label: "Gold", icon: "🥇", className: "text-amber-700 bg-amber-50 border-amber-200", badge: "bg-amber-100 text-amber-800" },
  silver: { label: "Silver", icon: "🥈", className: "text-gray-600 bg-gray-50 border-gray-200", badge: "bg-gray-100 text-gray-700" },
  basic: { label: "Basic", icon: "🔵", className: "text-blue-600 bg-blue-50 border-blue-200", badge: "bg-blue-50 text-blue-700" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function CustomerAvatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" }) {
  const color = getAvatarColor(initials);
  const dim = size === "sm" ? "w-7 h-7 text-[11px]" : "w-8 h-8 text-[12px]";
  return (
    <div className={cn("rounded-full flex items-center justify-center font-medium shrink-0", dim, color)}>
      {initials}
    </div>
  );
}

function MiniBarChart() {
  const maxVal = Math.max(...CHART_DATA.new, ...CHART_DATA.returning);
  return (
    <div>
      <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-violet-500" />
          Khách mới
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-500" />
          Quay lại
        </span>
      </div>
      <div className="flex items-end gap-2 h-24">
        {CHART_DATA.months.map((m, i) => (
          <div key={m} className="flex flex-col items-center gap-1 flex-1">
            <div className="flex items-end gap-0.5 w-full h-20">
              <div
                className="flex-1 rounded-t-sm bg-violet-400 hover:opacity-70 transition-opacity cursor-pointer"
                style={{ height: `${Math.round((CHART_DATA.new[i] / maxVal) * 76)}px` }}
              />
              <div
                className="flex-1 rounded-t-sm bg-emerald-400 hover:opacity-70 transition-opacity cursor-pointer"
                style={{ height: `${Math.round((CHART_DATA.returning[i] / maxVal) * 76)}px` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">{m}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TierDistribution({ customers }: { customers: Customer[] }) {
  const total = customers.length;
  const counts: Record<CustomerTier, number> = { diamond: 0, gold: 0, silver: 0, basic: 0 };
  customers.forEach((c) => counts[c.tier]++);
  const tiers: CustomerTier[] = ["diamond", "gold", "silver", "basic"];
  const barColors: Record<CustomerTier, string> = {
    diamond: "bg-sky-400",
    gold: "bg-amber-400",
    silver: "bg-gray-400",
    basic: "bg-blue-400",
  };
  return (
    <div className="space-y-2.5">
      {tiers.map((tier) => {
        const cfg = TIER_CONFIG[tier];
        const pct = Math.round((counts[tier] / total) * 100);
        return (
          <div key={tier} className="flex items-center gap-3">
            <span className="text-[12px] w-16 text-gray-600 shrink-0">
              {cfg.icon} {cfg.label}
            </span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full", barColors[tier])}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-[12px] font-medium text-gray-700 w-6 text-right">{counts[tier]}</span>
            <span className="text-[11px] text-gray-400 w-8 text-right">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CustomerManagementPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [activeSegment, setActiveSegment] = useState<SegmentKey>("all");
  const [search, setSearch] = useState("");
  const { state: pagination, onStateChange: setPagination, reset: resetPagination } = usePagination({ pageSize: 10 });

  const { data, refetch } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: getAdminCustomers,
  });

  // Adapt API data → page Customer shape
  const customers = useMemo<Customer[]>(
    () => (data?.customers ?? []).map(adaptCustomer),
    [data]
  );

  // Top 4 by totalSpent
  const topCustomers = useMemo(
    () =>
      [...(data?.customers ?? [])]
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 4)
        .map((c, i) => ({
          name: c.name,
          city: c.city,
          spent: formatSpent(c.totalSpent),
          orders: c.totalOrders,
          avatar: getInitials(c.name),
          tier: (TIER_MAP[c.tier] ?? "basic") as CustomerTier,
        })),
    [data]
  );

  // Metrics derived from real data
  const activeCount = useMemo(() => customers.filter((c) => c.status === "active").length, [customers]);
  const blockedCount = useMemo(() => customers.filter((c) => c.status === "blocked").length, [customers]);
  const newThisMonth = useMemo(
    () => (data?.customers ?? []).filter((c) => c.createdAt >= "2026-05-13").length,
    [data]
  );

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "Tất cả" },
    { key: "active", label: "Hoạt động" },
    { key: "inactive", label: "Không hoạt động" },
    { key: "blocked", label: "Bị chặn" },
  ];

  React.useEffect(() => {
    resetPagination();
  }, [activeTab, activeSegment, resetPagination]);

  const segments: { key: SegmentKey; label: string }[] = [
    { key: "all", label: "Tất cả hạng" },
    { key: "diamond", label: "💎 Diamond" },
    { key: "gold", label: "🥇 Gold" },
    { key: "silver", label: "🥈 Silver" },
    { key: "basic", label: "🔵 Basic" },
  ];

  const filtered = customers.filter((c) => {
    const matchTab = activeTab === "all" || c.status === activeTab;
    const matchSeg = activeSegment === "all" || c.tier === activeSegment;
    const matchSearch =
      search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSeg && matchSearch;
  });

  const paginatedCustomers = paginateData(filtered, pagination.page, pagination.pageSize);

  const tabCounts: Record<TabKey, number> = {
    all: customers.length,
    active: customers.filter((c) => c.status === "active").length,
    inactive: customers.filter((c) => c.status === "inactive").length,
    blocked: customers.filter((c) => c.status === "blocked").length,
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-sm overflow-hidden">

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 h-[52px] px-6 flex items-center gap-4 shrink-0">
          <h1 className="text-base font-medium text-gray-900 flex-1">Quản lý khách hàng</h1>
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 w-56">
            <Search size={13} className="text-gray-400" />
            <input
              className="bg-transparent text-[13px] text-gray-700 outline-none placeholder:text-gray-400 flex-1"
              placeholder="Tìm tên, email, thành phố..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <button className="relative w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 border border-white" />
            </button>
            <button
              onClick={() => refetch()}
              className="w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={14} />
            </button>
            <Button size="sm" className="bg-[#1a1a2e] hover:bg-[#2d2d4a] text-white h-8 text-[13px] gap-1.5">
              <Plus size={14} />
              Thêm khách hàng
            </Button>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Metrics */}
          <div className="grid grid-cols-4 gap-3">
            {[
              {
                label: "Tổng khách hàng",
                value: customers.length.toLocaleString(),
                change: "+9.4%",
                up: true,
                sub: "so với tháng trước",
                icon: Users,
                iconBg: "bg-violet-50",
                iconColor: "text-violet-600",
              },
              {
                label: "Khách hoạt động",
                value: activeCount.toLocaleString(),
                change: "+5.2%",
                up: true,
                sub: "trong 30 ngày qua",
                icon: UserCheck,
                iconBg: "bg-emerald-50",
                iconColor: "text-emerald-600",
              },
              {
                label: "Khách mới tháng này",
                value: newThisMonth.toLocaleString(),
                change: "-7.1%",
                up: false,
                sub: "so với tháng trước",
                icon: Gift,
                iconBg: "bg-amber-50",
                iconColor: "text-amber-600",
              },
              {
                label: "Tài khoản bị chặn",
                value: blockedCount.toLocaleString(),
                change: "+3",
                up: false,
                sub: "cần xem xét",
                icon: UserX,
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
                      up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                    )}
                  >
                    {up ? (
                      <TrendingUp size={9} className="inline mr-0.5" />
                    ) : (
                      <TrendingDown size={9} className="inline mr-0.5" />
                    )}
                    {change}
                  </span>
                  {sub}
                </div>
              </div>
            ))}
          </div>

          {/* Chart + Tier distribution + Top customers */}
          <div className="grid grid-cols-[1fr_240px_260px] gap-3">
            {/* Bar chart */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[14px] font-medium text-gray-900">Khách hàng mới & quay lại (7 tháng)</h2>
                <button className="text-xs text-blue-600 hover:underline">Chi tiết →</button>
              </div>
              <MiniBarChart />
            </div>

            {/* Tier distribution */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[14px] font-medium text-gray-900">Phân hạng</h2>
                <Crown size={14} className="text-amber-500" />
              </div>
              <TierDistribution customers={customers} />
              <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-900">74%</p>
                  <p className="text-[11px] text-gray-400">Tỉ lệ giữ chân</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-900">4.2</p>
                  <p className="text-[11px] text-gray-400">Đánh giá TB</p>
                </div>
              </div>
            </div>

            {/* Top customers */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[14px] font-medium text-gray-900">Khách VIP</h2>
                <button className="text-xs text-blue-600 hover:underline">Xem tất cả</button>
              </div>
              <div className="space-y-0.5">
                {topCustomers.map((c) => {
                  const tierCfg = TIER_CONFIG[c.tier];
                  return (
                    <div
                      key={c.name}
                      className="flex items-center gap-2.5 py-2 px-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <CustomerAvatar initials={c.avatar} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-gray-900 truncate">{c.name}</p>
                        <p className="text-[11px] text-gray-400">{c.city} · {c.orders} đơn</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[13px] font-medium text-gray-900">{c.spent}</p>
                        <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded border", tierCfg.className)}>
                          {tierCfg.icon} {tierCfg.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Table panel */}
          <div className="bg-white rounded-xl border border-gray-100">
            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-4">
              {tabs.map(({ key, label }) => (
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
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                      activeTab === key ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"
                    )}
                  >
                    {tabCounts[key]}
                  </span>
                </button>
              ))}
            </div>

            {/* Segment filters */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
              {segments.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveSegment(key as SegmentKey)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[12px] border transition-all",
                    activeSegment === key
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
                  {[
                    "Khách hàng",
                    "Liên hệ",
                    "Hạng thành viên",
                    "Đơn hàng",
                    "Chi tiêu",
                    "Đơn gần nhất",
                    "Ngày tham gia",
                    "Trạng thái",
                    "",
                  ].map((h) => (
                    <TableHead
                      key={h}
                      className="text-[11px] font-medium text-gray-400 uppercase tracking-wider py-2.5"
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCustomers.map((customer) => {
                  const st = STATUS_CONFIG[customer.status];
                  const tier = TIER_CONFIG[customer.tier];
                  return (
                    <TableRow
                      key={customer.id}
                      className="cursor-pointer hover:bg-gray-50/60 border-gray-100 transition-colors"
                    >
                      {/* Customer */}
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2.5">
                          <CustomerAvatar initials={customer.avatar} />
                          <div>
                            <p className="text-[13px] font-medium text-gray-900">{customer.name}</p>
                            <p className="text-[11px] text-gray-400 flex items-center gap-1">
                              <MapPin size={9} />
                              {customer.city}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Contact */}
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="text-[12px] text-gray-600 flex items-center gap-1">
                            <Mail size={10} className="text-gray-400" />
                            {customer.email}
                          </p>
                          <p className="text-[12px] text-gray-500 flex items-center gap-1">
                            <Phone size={10} className="text-gray-400" />
                            {customer.phone}
                          </p>
                        </div>
                      </TableCell>

                      {/* Tier */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("text-[11px] font-medium border gap-1", tier.className)}
                        >
                          {tier.icon} {tier.label}
                        </Badge>
                      </TableCell>

                      {/* Orders */}
                      <TableCell>
                        <div className="flex items-center gap-1 text-[13px] text-gray-600">
                          <ShoppingBag size={12} className="text-gray-400" />
                          {customer.totalOrders}
                        </div>
                      </TableCell>

                      {/* Spent */}
                      <TableCell>
                        <div className="flex items-center gap-1 text-[13px] font-medium text-gray-900">
                          <Wallet size={12} className="text-gray-400" />
                          {customer.totalSpent}
                        </div>
                      </TableCell>

                      {/* Last order */}
                      <TableCell className="text-[12px] text-gray-500">{customer.lastOrder}</TableCell>

                      {/* Join date */}
                      <TableCell>
                        <div className="flex items-center gap-1 text-[12px] text-gray-400">
                          <CalendarDays size={11} />
                          {customer.joinDate}
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("text-[11px] font-medium border gap-1", st.className)}
                        >
                          <span className={cn("w-1.5 h-1.5 rounded-full", st.dot)} />
                          {st.label}
                        </Badge>
                      </TableCell>

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

            {filtered.length === 0 && (
              <div className="py-16 text-center text-gray-400 text-sm">
                Không có khách hàng nào phù hợp.
              </div>
            )}

            {/* Pagination */}
            <AdminPagination
              state={pagination}
              onStateChange={setPagination}
              totalItems={filtered.length}
              itemsLabel="khách hàng"
            />
          </div>
        </div>
      </div>
    </div>
  );
}