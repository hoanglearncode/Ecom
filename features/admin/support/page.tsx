"use client";

import { useState, useMemo } from "react";
import {
  Bell,
  RefreshCw,
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
  MoreVertical,
  Filter,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Headphones,
  Zap,
  LifeBuoy,
  RefreshCcw,
  MessageCircle,
  UserCog,
  ChevronDown,
  CircleDot,
  Flame,
  Timer,
  Send,
  Paperclip,
  ShieldAlert,
  Activity,
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

type TicketStatus = "open" | "in_progress" | "waiting" | "resolved" | "closed";
type TicketPriority = "critical" | "high" | "medium" | "low";
type TicketCategory = "order" | "payment" | "product" | "account" | "shipping" | "policy";
type TabKey = "all" | TicketStatus;

interface Ticket {
  id: string;
  subject: string;
  customerName: string;
  customerAvatar: string;
  brandName: string;
  brandEmoji: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  assignee: string | null;
  assigneeAvatar: string | null;
  messages: number;
  unread: number;
  platform: "shopee" | "lazada" | "tiki" | "sendo" | "direct";
  createdAt: string;
  updatedAt: string;
  slaDeadline: string;
  slaBreached: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TICKETS: Ticket[] = [
  {
    id: "TK-4821",
    subject: "Chưa nhận được hoàn tiền sau 10 ngày hủy đơn",
    customerName: "Nguyễn Thị Lan",
    customerAvatar: "NL",
    brandName: "Samsung Electronics",
    brandEmoji: "📱",
    category: "payment",
    status: "open",
    priority: "critical",
    assignee: null,
    assigneeAvatar: null,
    messages: 3,
    unread: 3,
    platform: "shopee",
    createdAt: "15 phút trước",
    updatedAt: "15 phút trước",
    slaDeadline: "Còn 45 phút",
    slaBreached: false,
  },
  {
    id: "TK-4820",
    subject: "Sản phẩm giao nhầm, yêu cầu đổi trả",
    customerName: "Trần Minh Khoa",
    customerAvatar: "TK",
    brandName: "Biti's Hunter",
    brandEmoji: "👟",
    category: "order",
    status: "in_progress",
    priority: "high",
    assignee: "Minh Anh",
    assigneeAvatar: "MA",
    messages: 8,
    unread: 1,
    platform: "lazada",
    createdAt: "2 giờ trước",
    updatedAt: "30 phút trước",
    slaDeadline: "Còn 2 giờ",
    slaBreached: false,
  },
  {
    id: "TK-4819",
    subject: "Không đăng nhập được tài khoản sau khi đổi SĐT",
    customerName: "Lê Thị Hoa",
    customerAvatar: "LH",
    brandName: "—",
    brandEmoji: "🔑",
    category: "account",
    status: "waiting",
    priority: "high",
    assignee: "Quốc Bảo",
    assigneeAvatar: "QB",
    messages: 5,
    unread: 0,
    platform: "direct",
    createdAt: "4 giờ trước",
    updatedAt: "1 giờ trước",
    slaDeadline: "Đã quá hạn",
    slaBreached: true,
  },
  {
    id: "TK-4818",
    subject: "Voucher giảm giá không áp dụng được khi thanh toán",
    customerName: "Phạm Văn Đức",
    customerAvatar: "PĐ",
    brandName: "Canifa Fashion",
    brandEmoji: "👕",
    category: "payment",
    status: "open",
    priority: "medium",
    assignee: null,
    assigneeAvatar: null,
    messages: 1,
    unread: 1,
    platform: "tiki",
    createdAt: "5 giờ trước",
    updatedAt: "5 giờ trước",
    slaDeadline: "Còn 3 giờ",
    slaBreached: false,
  },
  {
    id: "TK-4817",
    subject: "Yêu cầu xác minh thương hiệu chính hãng",
    customerName: "Hoàng Thị Mai",
    customerAvatar: "HM",
    brandName: "Nike Vietnam",
    brandEmoji: "🏃",
    category: "policy",
    status: "in_progress",
    priority: "medium",
    assignee: "Minh Anh",
    assigneeAvatar: "MA",
    messages: 12,
    unread: 0,
    platform: "direct",
    createdAt: "1 ngày trước",
    updatedAt: "3 giờ trước",
    slaDeadline: "Còn 5 giờ",
    slaBreached: false,
  },
  {
    id: "TK-4816",
    subject: "Hàng bị vỡ do đóng gói kém khi vận chuyển",
    customerName: "Vũ Quốc Hùng",
    customerAvatar: "VH",
    brandName: "JYSK Furniture",
    brandEmoji: "🛋️",
    category: "shipping",
    status: "waiting",
    priority: "high",
    assignee: "Thanh Tú",
    assigneeAvatar: "TT",
    messages: 7,
    unread: 2,
    platform: "sendo",
    createdAt: "1 ngày trước",
    updatedAt: "5 giờ trước",
    slaDeadline: "Đã quá hạn",
    slaBreached: true,
  },
  {
    id: "TK-4815",
    subject: "Sản phẩm không đúng mô tả, hình ảnh khác thực tế",
    customerName: "Đặng Thị Thu",
    customerAvatar: "ĐT",
    brandName: "Shiseido Vietnam",
    brandEmoji: "💄",
    category: "product",
    status: "resolved",
    priority: "low",
    assignee: "Quốc Bảo",
    assigneeAvatar: "QB",
    messages: 9,
    unread: 0,
    platform: "shopee",
    createdAt: "2 ngày trước",
    updatedAt: "1 ngày trước",
    slaDeadline: "Đúng hạn",
    slaBreached: false,
  },
  {
    id: "TK-4814",
    subject: "Yêu cầu hủy đơn khẩn vì đặt nhầm sản phẩm",
    customerName: "Ngô Thị Bích",
    customerAvatar: "NB",
    brandName: "Trung Nguyên Legend",
    brandEmoji: "🍵",
    category: "order",
    status: "closed",
    priority: "low",
    assignee: "Thanh Tú",
    assigneeAvatar: "TT",
    messages: 4,
    unread: 0,
    platform: "lazada",
    createdAt: "3 ngày trước",
    updatedAt: "2 ngày trước",
    slaDeadline: "Đúng hạn",
    slaBreached: false,
  },
  {
    id: "TK-4813",
    subject: "Lỗi hiển thị giá sản phẩm trên trang danh mục",
    customerName: "Trịnh Văn Nam",
    customerAvatar: "TN",
    brandName: "Samsung Electronics",
    brandEmoji: "📱",
    category: "product",
    status: "open",
    priority: "critical",
    assignee: null,
    assigneeAvatar: null,
    messages: 2,
    unread: 2,
    platform: "tiki",
    createdAt: "20 phút trước",
    updatedAt: "20 phút trước",
    slaDeadline: "Còn 40 phút",
    slaBreached: false,
  },
  {
    id: "TK-4812",
    subject: "Cần hỗ trợ tích hợp API cho hệ thống quản lý kho",
    customerName: "Bùi Thanh Tùng",
    customerAvatar: "BT",
    brandName: "Biti's Hunter",
    brandEmoji: "👟",
    category: "policy",
    status: "in_progress",
    priority: "medium",
    assignee: "Minh Anh",
    assigneeAvatar: "MA",
    messages: 15,
    unread: 0,
    platform: "direct",
    createdAt: "4 ngày trước",
    updatedAt: "6 giờ trước",
    slaDeadline: "Còn 1 ngày",
    slaBreached: false,
  },
];

const AGENTS = [
  { name: "Minh Anh", avatar: "MA", active: 3, color: "bg-violet-100 text-violet-700" },
  { name: "Quốc Bảo", avatar: "QB", active: 2, color: "bg-blue-100 text-blue-700" },
  { name: "Thanh Tú", avatar: "TT", active: 2, color: "bg-teal-100 text-teal-700" },
  { name: "Hồng Nhung", avatar: "HN", active: 0, color: "bg-pink-100 text-pink-700" },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<TicketStatus, { label: string; dot: string; className: string; icon: React.ElementType }> = {
  open: { label: "Mới", dot: "bg-blue-500", className: "bg-blue-50 text-blue-700 border-blue-200", icon: CircleDot },
  in_progress: { label: "Đang xử lý", dot: "bg-violet-500", className: "bg-violet-50 text-violet-700 border-violet-200", icon: Activity },
  waiting: { label: "Chờ phản hồi", dot: "bg-amber-400", className: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  resolved: { label: "Đã giải quyết", dot: "bg-emerald-500", className: "bg-emerald-50 text-emerald-800 border-emerald-200", icon: CheckCircle2 },
  closed: { label: "Đã đóng", dot: "bg-gray-400", className: "bg-gray-100 text-gray-600 border-gray-200", icon: XCircle },
};

const PRIORITY_CONFIG: Record<TicketPriority, { label: string; className: string; icon: React.ElementType }> = {
  critical: { label: "Khẩn cấp", className: "bg-red-50 text-red-700 border-red-200", icon: Flame },
  high: { label: "Cao", className: "bg-orange-50 text-orange-700 border-orange-200", icon: AlertTriangle },
  medium: { label: "Trung bình", className: "bg-amber-50 text-amber-700 border-amber-200", icon: Zap },
  low: { label: "Thấp", className: "bg-gray-100 text-gray-600 border-gray-200", icon: LifeBuoy },
};

const CATEGORY_CONFIG: Record<TicketCategory, { label: string; emoji: string }> = {
  order: { label: "Đơn hàng", emoji: "📦" },
  payment: { label: "Thanh toán", emoji: "💳" },
  product: { label: "Sản phẩm", emoji: "🛍️" },
  account: { label: "Tài khoản", emoji: "🔑" },
  shipping: { label: "Vận chuyển", emoji: "🚚" },
  policy: { label: "Chính sách", emoji: "📋" },
};

const PLATFORM_CONFIG = {
  shopee: { label: "Shopee", className: "bg-orange-50 text-orange-700 border-orange-200" },
  lazada: { label: "Lazada", className: "bg-pink-50 text-pink-700 border-pink-200" },
  tiki: { label: "Tiki", className: "bg-blue-50 text-blue-700 border-blue-200" },
  sendo: { label: "Sendo", className: "bg-green-50 text-green-700 border-green-200" },
  direct: { label: "Trực tiếp", className: "bg-gray-100 text-gray-600 border-gray-200" },
};

const AVATAR_COLORS: Record<string, string> = {
  NL: "bg-pink-100 text-pink-700",
  TK: "bg-blue-100 text-blue-700",
  LH: "bg-emerald-100 text-emerald-700",
  PĐ: "bg-orange-100 text-orange-700",
  HM: "bg-purple-100 text-purple-700",
  VH: "bg-gray-100 text-gray-600",
  ĐT: "bg-teal-100 text-teal-700",
  NB: "bg-indigo-100 text-indigo-700",
  TN: "bg-yellow-100 text-yellow-700",
  BT: "bg-red-100 text-red-600",
  MA: "bg-violet-100 text-violet-700",
  QB: "bg-blue-100 text-blue-700",
  TT: "bg-teal-100 text-teal-700",
  HN: "bg-pink-100 text-pink-700",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" }) {
  const color = AVATAR_COLORS[initials] ?? "bg-gray-100 text-gray-600";
  const dim = size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-[12px]";
  return (
    <div className={cn("rounded-full flex items-center justify-center font-medium shrink-0", dim, color)}>
      {initials}
    </div>
  );
}

function SLAChip({ deadline, breached }: { deadline: string; breached: boolean }) {
  if (breached) {
    return (
      <span className="flex items-center gap-1 text-[10px] font-medium text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
        <AlertTriangle size={9} /> {deadline}
      </span>
    );
  }
  const urgent = deadline.includes("phút") || deadline.includes("40") || deadline.includes("45");
  return (
    <span className={cn("flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border",
      urgent ? "text-amber-700 bg-amber-50 border-amber-200" : "text-gray-500 bg-gray-50 border-gray-200"
    )}>
      <Timer size={9} /> {deadline}
    </span>
  );
}

function MiniSparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const h = 28;
  const w = 80;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SupportManagementPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const { state: paginationState, onStateChange: onPaginationChange, reset: resetPagination } = usePagination({ pageSize: 10 });

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "Tất cả" },
    { key: "open", label: "Mới" },
    { key: "in_progress", label: "Đang xử lý" },
    { key: "waiting", label: "Chờ phản hồi" },
    { key: "resolved", label: "Đã giải quyết" },
    { key: "closed", label: "Đã đóng" },
  ];

  const tabCounts: Record<TabKey, number> = {
    all: TICKETS.length,
    open: TICKETS.filter((t) => t.status === "open").length,
    in_progress: TICKETS.filter((t) => t.status === "in_progress").length,
    waiting: TICKETS.filter((t) => t.status === "waiting").length,
    resolved: TICKETS.filter((t) => t.status === "resolved").length,
    closed: TICKETS.filter((t) => t.status === "closed").length,
  };

  const categories: { key: TicketCategory | "all"; label: string }[] = [
    { key: "all", label: "Tất cả loại" },
    { key: "order", label: "📦 Đơn hàng" },
    { key: "payment", label: "💳 Thanh toán" },
    { key: "product", label: "🛍️ Sản phẩm" },
    { key: "account", label: "🔑 Tài khoản" },
    { key: "shipping", label: "🚚 Vận chuyển" },
    { key: "policy", label: "📋 Chính sách" },
  ];

  // Filter tickets based on tab, category, and search
  const filtered = useMemo(() => {
    return TICKETS.filter((t) => {
      const matchTab = activeTab === "all" || t.status === activeTab;
      const matchCat = categoryFilter === "all" || t.category === categoryFilter;
      const matchSearch =
        search === "" ||
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.subject.toLowerCase().includes(search.toLowerCase()) ||
        t.customerName.toLowerCase().includes(search.toLowerCase()) ||
        t.brandName.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchCat && matchSearch;
    });
  }, [activeTab, categoryFilter, search]);

  // Reset pagination when filters change
  useMemo(() => {
    resetPagination();
  }, [activeTab, categoryFilter, search, resetPagination]);

  // Paginate filtered data
  const paginatedTickets = useMemo(() => {
    return paginateData(filtered, paginationState.page, paginationState.pageSize);
  }, [filtered, paginationState]);

  const breachedCount = TICKETS.filter((t) => t.slaBreached).length;
  const unassignedCount = TICKETS.filter((t) => !t.assignee && t.status === "open").length;
  const avgResponseTime = "3.8 giờ";

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-sm overflow-hidden">
      {/* ── Sidebar ── */}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 h-[52px] px-6 flex items-center gap-4 shrink-0">
          <h1 className="text-base font-medium text-gray-900 flex-1">Yêu cầu hỗ trợ</h1>
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 w-64">
            <Search size={13} className="text-gray-400" />
            <input
              className="bg-transparent text-[13px] text-gray-700 outline-none placeholder:text-gray-400 flex-1"
              placeholder="Tìm ticket, khách hàng, chủ đề..."
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
              <RefreshCcw size={14} />
              Tự động phân công
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Metrics */}
          <div className="grid grid-cols-4 gap-3">
            {[
              {
                label: "Tổng ticket hôm nay",
                value: "124",
                change: "+18%",
                up: false,
                sub: "so với hôm qua",
                icon: Headphones,
                iconBg: "bg-violet-50",
                iconColor: "text-violet-600",
                spark: [80, 95, 88, 110, 102, 118, 124],
                sparkColor: "#7c3aed",
              },
              {
                label: "Chưa được xử lý",
                value: String(tabCounts.open),
                change: `${unassignedCount} chưa phân công`,
                up: false,
                sub: "cần chỉ định ngay",
                icon: CircleDot,
                iconBg: "bg-blue-50",
                iconColor: "text-blue-600",
                spark: [2, 4, 3, 5, 4, 6, tabCounts.open],
                sparkColor: "#2563eb",
              },
              {
                label: "Vi phạm SLA",
                value: String(breachedCount),
                change: "+1",
                up: false,
                sub: "so với hôm qua",
                icon: AlertTriangle,
                iconBg: "bg-red-50",
                iconColor: "text-red-500",
                spark: [1, 2, 1, 3, 2, 1, breachedCount],
                sparkColor: "#ef4444",
              },
              {
                label: "Thời gian phản hồi TB",
                value: avgResponseTime,
                change: "-12%",
                up: true,
                sub: "so với tuần trước",
                icon: Timer,
                iconBg: "bg-emerald-50",
                iconColor: "text-emerald-600",
                spark: [5.2, 4.8, 5.1, 4.4, 4.2, 4.0, 3.8],
                sparkColor: "#10b981",
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
                  <MiniSparkline values={spark} color={sparkColor} />
                </div>
              </div>
            ))}
          </div>

          {/* Status overview + category breakdown + agent workload */}
          <div className="grid grid-cols-[1fr_1fr_260px] gap-3">
            {/* Status pipeline */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="text-[14px] font-medium text-gray-900 mb-3">Pipeline trạng thái</h3>
              <div className="space-y-2.5">
                {(["open", "in_progress", "waiting", "resolved", "closed"] as TicketStatus[]).map((s) => {
                  const cfg = STATUS_CONFIG[s];
                  const count = TICKETS.filter((t) => t.status === s).length;
                  const pct = Math.round((count / TICKETS.length) * 100);
                  const barColors: Record<TicketStatus, string> = {
                    open: "bg-blue-400",
                    in_progress: "bg-violet-400",
                    waiting: "bg-amber-400",
                    resolved: "bg-emerald-400",
                    closed: "bg-gray-300",
                  };
                  return (
                    <div key={s} className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 w-32 shrink-0">
                        <span className={cn("w-2 h-2 rounded-full", cfg.dot)} />
                        <span className="text-[12px] text-gray-600">{cfg.label}</span>
                      </div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", barColors[s])} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[12px] font-medium text-gray-700 w-4 text-right">{count}</span>
                      <span className="text-[11px] text-gray-400 w-8 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-base font-medium text-gray-900">{Math.round((TICKETS.filter(t => t.status === "resolved" || t.status === "closed").length / TICKETS.length) * 100)}%</p>
                  <p className="text-[11px] text-gray-400">Tỉ lệ giải quyết</p>
                </div>
                <div>
                  <p className="text-base font-medium text-gray-900">8.4h</p>
                  <p className="text-[11px] text-gray-400">Thời gian xử lý TB</p>
                </div>
                <div>
                  <p className="text-base font-medium text-gray-900">4.6</p>
                  <p className="text-[11px] text-gray-400">CSAT trung bình</p>
                </div>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="text-[14px] font-medium text-gray-900 mb-3">Phân loại yêu cầu</h3>
              <div className="space-y-2">
                {(["order", "payment", "product", "account", "shipping", "policy"] as TicketCategory[]).map((cat) => {
                  const cfg = CATEGORY_CONFIG[cat];
                  const count = TICKETS.filter((t) => t.category === cat).length;
                  const pct = Math.round((count / TICKETS.length) * 100);
                  const catColors: Record<TicketCategory, string> = {
                    order: "bg-blue-400",
                    payment: "bg-emerald-400",
                    product: "bg-violet-400",
                    account: "bg-orange-400",
                    shipping: "bg-teal-400",
                    policy: "bg-pink-400",
                  };
                  return (
                    <div key={cat} className="flex items-center gap-2.5">
                      <span className="text-base w-5 shrink-0">{cfg.emoji}</span>
                      <span className="text-[12px] text-gray-600 w-24 shrink-0">{cfg.label}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", catColors[cat])} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[11px] font-medium text-gray-700 w-4 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Agent workload */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-medium text-gray-900">Phân công nhân viên</h3>
                <button className="text-xs text-blue-600 hover:underline">Quản lý</button>
              </div>
              <div className="space-y-3">
                {AGENTS.map((agent) => {
                  const assigned = TICKETS.filter((t) => t.assignee === agent.name).length;
                  const maxLoad = 5;
                  return (
                    <div key={agent.name}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="relative">
                          <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium", agent.color)}>{agent.avatar}</div>
                          <span className={cn("absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white", agent.active > 0 ? "bg-emerald-400" : "bg-gray-300")} />
                        </div>
                        <span className="text-[13px] font-medium text-gray-800 flex-1">{agent.name}</span>
                        <span className="text-[11px] text-gray-400">{assigned}/{maxLoad}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden ml-9">
                        <div
                          className={cn("h-full rounded-full transition-all", assigned >= maxLoad ? "bg-red-400" : assigned >= 3 ? "bg-amber-400" : "bg-emerald-400")}
                          style={{ width: `${Math.min((assigned / maxLoad) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-gray-500">Chưa phân công</span>
                  <span className="font-medium text-red-600">{unassignedCount} ticket</span>
                </div>
                <Button size="sm" variant="outline" className="w-full mt-2 h-7 text-[12px] border-gray-200 text-gray-600 hover:bg-gray-50">
                  <UserCog size={12} className="mr-1.5" /> Phân công tự động
                </Button>
              </div>
            </div>
          </div>

          {/* Ticket table */}
          <div className="bg-white rounded-xl border border-gray-100">
            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-4">
              {tabs.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
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

            {/* Category filter */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 overflow-x-auto">
              {categories.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setCategoryFilter(key as TicketCategory | "all")}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[12px] border transition-all whitespace-nowrap",
                    categoryFilter === key ? "bg-[#1a1a2e] text-white border-[#1a1a2e]" : "text-gray-500 border-gray-200 hover:bg-gray-50"
                  )}
                >
                  {label}
                </button>
              ))}
              <div className="ml-auto flex gap-2 shrink-0">
                <button className="flex items-center gap-1.5 text-[12px] text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors whitespace-nowrap">
                  <Filter size={12} /> Lọc
                </button>
                <button className="flex items-center gap-1.5 text-[12px] text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors whitespace-nowrap">
                  <ArrowUpDown size={12} /> Sắp xếp
                </button>
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-gray-100">
                  {["ID & Chủ đề", "Khách hàng", "Thương hiệu", "Loại", "Ưu tiên", "SLA", "Nhân viên", "Tin nhắn", "Sàn", "Trạng thái", "Cập nhật", ""].map((h) => (
                    <TableHead key={h} className="text-[11px] font-medium text-gray-400 uppercase tracking-wider py-2.5 whitespace-nowrap">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTickets.map((ticket) => {
                  const st = STATUS_CONFIG[ticket.status];
                  const pr = PRIORITY_CONFIG[ticket.priority];
                  const cat = CATEGORY_CONFIG[ticket.category];
                  const plt = PLATFORM_CONFIG[ticket.platform];
                  const PriorityIcon : any = pr.icon;
                  // Ensure pr is correctly typed
                  const priorityClass = pr?.className || "";
                  const priorityLabel = pr?.label || "";
                  return (
                    <TableRow
                      key={ticket.id}
                      onClick={() => setSelectedTicket(selectedTicket?.id === ticket.id ? null : ticket)}
                      className={cn(
                        "border-gray-100 transition-colors cursor-pointer",
                        ticket.slaBreached ? "bg-red-50/30 hover:bg-red-50/50" : "hover:bg-gray-50/60",
                        ticket.priority === "critical" && !ticket.slaBreached ? "bg-orange-50/20 hover:bg-orange-50/40" : "",
                        selectedTicket?.id === ticket.id ? "bg-violet-50/40" : ""
                      )}
                    >
                      {/* ID & Subject */}
                      <TableCell className="py-3 min-w-[200px]">
                        <p className="text-[11px] font-mono text-gray-400 mb-0.5">{ticket.id}</p>
                        <p className="text-[13px] font-medium text-gray-900 line-clamp-1 max-w-[180px]">{ticket.subject}</p>
                      </TableCell>

                      {/* Customer */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar initials={ticket.customerAvatar} size="sm" />
                          <span className="text-[12px] text-gray-700 whitespace-nowrap">{ticket.customerName}</span>
                        </div>
                      </TableCell>

                      {/* Brand */}
                      <TableCell>
                        <span className="text-[12px] text-gray-600 flex items-center gap-1 whitespace-nowrap">
                          {ticket.brandEmoji} {ticket.brandName}
                        </span>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <span className="text-[12px] text-gray-500 flex items-center gap-1 whitespace-nowrap">
                          {cat.emoji} {cat.label}
                        </span>
                      </TableCell>

                      {/* Priority */}
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] font-medium border gap-1 whitespace-nowrap ${priorityClass}`}>
                          <PriorityIcon size={9} /> {priorityLabel}
                        </Badge>
                      </TableCell>

                      {/* SLA */}
                      <TableCell>
                        <SLAChip deadline={ticket.slaDeadline} breached={ticket.slaBreached} />
                      </TableCell>

                      {/* Assignee */}
                      <TableCell>
                        {ticket.assignee ? (
                          <div className="flex items-center gap-1.5">
                            <Avatar initials={ticket.assigneeAvatar!} size="sm" />
                            <span className="text-[12px] text-gray-600 whitespace-nowrap">{ticket.assignee}</span>
                          </div>
                        ) : (
                          <button className="flex items-center gap-1 text-[11px] text-blue-600 border border-blue-200 bg-blue-50 px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap">
                            <UserCog size={10} /> Phân công
                          </button>
                        )}
                      </TableCell>

                      {/* Messages */}
                      <TableCell>
                        <div className="flex items-center gap-1 text-[12px] text-gray-500">
                          <MessageCircle size={11} />
                          <span>{ticket.messages}</span>
                          {ticket.unread > 0 && (
                            <span className="bg-red-500 text-white text-[9px] font-medium px-1.5 py-0.5 rounded-full leading-none">
                              {ticket.unread}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Platform */}
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[10px] font-medium border whitespace-nowrap", plt.className)}>
                          {plt.label}
                        </Badge>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[10px] font-medium border gap-1 whitespace-nowrap", st.className)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", st.dot)} />
                          {st.label}
                        </Badge>
                      </TableCell>

                      {/* Updated */}
                      <TableCell className="text-[11px] text-gray-400 whitespace-nowrap">{ticket.updatedAt}</TableCell>

                      {/* Actions */}
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-1 justify-end">
                          <button className="w-6 h-6 rounded-md border border-gray-150 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors" title="Xem chi tiết">
                            <Eye size={11} />
                          </button>
                          <button className="w-6 h-6 rounded-md border border-gray-150 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors" title="Trả lời">
                            <Send size={11} />
                          </button>
                          <button className="w-6 h-6 rounded-md border border-gray-150 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
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
                Không tìm thấy yêu cầu nào phù hợp.
              </div>
            )}

            {/* Pagination */}
            <AdminPagination
              state={paginationState}
              onStateChange={onPaginationChange}
              totalItems={filtered.length}
              pageSizeOptions={[5, 10, 20, 50]}
              itemsLabel="yêu cầu"
              className="border-gray-100"
            />
          </div>

          {/* Ticket detail drawer (inline) */}
          {selectedTicket && (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[12px] text-gray-400">{selectedTicket.id}</span>
                  <h3 className="text-[14px] font-medium text-gray-900 line-clamp-1">{selectedTicket.subject}</h3>
                  <Badge variant="outline" className={cn("text-[10px] border gap-1", STATUS_CONFIG[selectedTicket.status].className)}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", STATUS_CONFIG[selectedTicket.status].dot)} />
                    {STATUS_CONFIG[selectedTicket.status].label}
                  </Badge>
                  <Badge variant="outline" className={cn("text-[10px] border gap-1", PRIORITY_CONFIG[selectedTicket.priority].className)}>
                    {PRIORITY_CONFIG[selectedTicket.priority].label}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="h-7 text-[12px] border-gray-200 text-gray-600 gap-1.5">
                    <UserCog size={12} /> Phân công
                  </Button>
                  <Button size="sm" className="h-7 text-[12px] bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
                    <CheckCircle2 size={12} /> Đánh dấu giải quyết
                  </Button>
                  <button onClick={() => setSelectedTicket(null)} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                    <XCircle size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_280px]">
                {/* Conversation */}
                <div className="p-5 border-r border-gray-100">
                  <div className="space-y-4 mb-4 max-h-52 overflow-y-auto pr-1">
                    {/* Mock messages */}
                    {[
                      { from: "customer", name: selectedTicket.customerName, avatar: selectedTicket.customerAvatar, time: selectedTicket.createdAt, msg: selectedTicket.subject },
                      { from: "agent", name: "Hệ thống", avatar: "BM", time: "Auto", msg: "Yêu cầu của bạn đã được tiếp nhận. Mã ticket: " + selectedTicket.id + ". Chúng tôi sẽ phản hồi trong vòng 2 giờ." },
                    ].map((m, i) => (
                      <div key={i} className={cn("flex gap-2.5", m.from === "agent" ? "flex-row-reverse" : "")}>
                        <Avatar initials={m.avatar} size="sm" />
                        <div className={cn("max-w-[70%]", m.from === "agent" ? "items-end" : "")}>
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-[11px] font-medium text-gray-700">{m.name}</span>
                            <span className="text-[10px] text-gray-400">{m.time}</span>
                          </div>
                          <div className={cn("px-3 py-2 rounded-xl text-[13px] leading-relaxed",
                            m.from === "agent"
                              ? "bg-[#1a1a2e] text-white rounded-tr-sm"
                              : "bg-gray-100 text-gray-800 rounded-tl-sm"
                          )}>
                            {m.msg}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reply box */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <textarea
                      className="w-full px-4 py-3 text-[13px] text-gray-700 placeholder:text-gray-400 outline-none resize-none bg-white"
                      rows={3}
                      placeholder="Nhập nội dung phản hồi..."
                    />
                    <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors">
                          <Paperclip size={14} />
                        </button>
                        <button className="flex items-center gap-1.5 text-[12px] text-gray-500 border border-gray-200 bg-white rounded-lg px-2.5 py-1 hover:bg-gray-100 transition-colors">
                          Mẫu phản hồi <ChevronDown size={11} />
                        </button>
                      </div>
                      <Button size="sm" className="h-7 text-[12px] bg-[#1a1a2e] hover:bg-[#2d2d4a] text-white gap-1.5">
                        <Send size={11} /> Gửi phản hồi
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Ticket info */}
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">Thông tin ticket</p>
                    <div className="space-y-2">
                      {[
                        { label: "Khách hàng", value: selectedTicket.customerName },
                        { label: "Thương hiệu", value: `${selectedTicket.brandEmoji} ${selectedTicket.brandName}` },
                        { label: "Loại", value: `${CATEGORY_CONFIG[selectedTicket.category].emoji} ${CATEGORY_CONFIG[selectedTicket.category].label}` },
                        { label: "Sàn", value: PLATFORM_CONFIG[selectedTicket.platform].label },
                        { label: "Tạo lúc", value: selectedTicket.createdAt },
                        { label: "SLA", value: selectedTicket.slaDeadline },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between">
                          <span className="text-[12px] text-gray-400">{label}</span>
                          <span className={cn("text-[12px] font-medium text-right", selectedTicket.slaBreached && label === "SLA" ? "text-red-600" : "text-gray-700")}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">Nhân viên phụ trách</p>
                    {selectedTicket.assignee ? (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <Avatar initials={selectedTicket.assigneeAvatar!} size="sm" />
                        <div className="flex-1">
                          <p className="text-[13px] font-medium text-gray-800">{selectedTicket.assignee}</p>
                          <p className="text-[11px] text-gray-400">Support Agent</p>
                        </div>
                        <button className="text-[11px] text-blue-600 hover:underline">Đổi</button>
                      </div>
                    ) : (
                      <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-[12px] text-amber-700 flex items-center gap-1.5">
                        <AlertTriangle size={12} /> Chưa được phân công
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Hành động nhanh</p>
                    {[
                      { label: "Đánh dấu đang xử lý", color: "text-violet-600 border-violet-200 bg-violet-50 hover:bg-violet-100" },
                      { label: "Chờ phản hồi khách", color: "text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100" },
                      { label: "Đóng ticket", color: "text-gray-600 border-gray-200 bg-gray-50 hover:bg-gray-100" },
                    ].map(({ label, color }) => (
                      <button key={label} className={cn("w-full text-[12px] border rounded-lg py-1.5 transition-colors font-medium", color)}>
                        {label}
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