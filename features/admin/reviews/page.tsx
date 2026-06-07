"use client";

import React, { useState } from "react";
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
  Trash2,
  MoreVertical,
  Filter,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  Flag,
  Reply,
  ShieldCheck,
  ShieldX,
  ImageIcon,
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

// ─── Types ────────────────────────────────────────────────────────────────────

type ReviewStatus = "published" | "pending" | "hidden" | "flagged";
type TabKey = "all" | ReviewStatus;
type StarFilter = "all" | "5" | "4" | "3" | "2" | "1";

interface Review {
  id: number;
  customerName: string;
  customerAvatar: string;
  brandName: string;
  brandEmoji: string;
  productName: string;
  rating: number;
  title: string;
  content: string;
  status: ReviewStatus;
  helpful: number;
  notHelpful: number;
  hasImages: boolean;
  imageCount: number;
  replied: boolean;
  createdAt: string;
  platform: "shopee" | "lazada" | "tiki" | "sendo";
  verified: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const REVIEWS: Review[] = [
  {
    id: 1,
    customerName: "Nguyễn Thị Lan",
    customerAvatar: "NL",
    brandName: "Biti's Hunter",
    brandEmoji: "👟",
    productName: "Giày Biti's Hunter X Street",
    rating: 5,
    title: "Sản phẩm tuyệt vời, đúng như mô tả",
    content: "Giày rất thoải mái, form đẹp, chất liệu tốt. Giao hàng nhanh, đóng gói cẩn thận. Sẽ ủng hộ shop lần sau!",
    status: "published",
    helpful: 48,
    notHelpful: 2,
    hasImages: true,
    imageCount: 3,
    replied: true,
    createdAt: "2 giờ trước",
    platform: "shopee",
    verified: true,
  },
  {
    id: 2,
    customerName: "Trần Minh Khoa",
    customerAvatar: "TK",
    brandName: "Shiseido Vietnam",
    brandEmoji: "💄",
    productName: "Kem dưỡng Shiseido Vital Perfection",
    rating: 4,
    title: "Sản phẩm tốt nhưng giá hơi cao",
    content: "Dùng được 2 tuần thấy da mịn hơn hẳn. Hơi tiếc là giá khá cao so với các sản phẩm cùng loại. Nhưng chất lượng thì không chê được.",
    status: "published",
    helpful: 31,
    notHelpful: 4,
    hasImages: false,
    imageCount: 0,
    replied: false,
    createdAt: "5 giờ trước",
    platform: "lazada",
    verified: true,
  },
  {
    id: 3,
    customerName: "Lê Văn Tuấn",
    customerAvatar: "LT",
    brandName: "Samsung Electronics",
    brandEmoji: "📱",
    productName: "Samsung Galaxy S24 Ultra",
    rating: 2,
    title: "Máy bị lỗi, shop giải quyết chậm",
    content: "Mua về 3 ngày thì màn hình bị lỗi. Liên hệ shop mãi mới được phản hồi sau 2 ngày. Rất thất vọng với dịch vụ sau bán hàng.",
    status: "flagged",
    helpful: 92,
    notHelpful: 5,
    hasImages: true,
    imageCount: 5,
    replied: true,
    createdAt: "1 ngày trước",
    platform: "tiki",
    verified: true,
  },
  {
    id: 4,
    customerName: "Phạm Thị Hà",
    customerAvatar: "PH",
    brandName: "Nike Vietnam",
    brandEmoji: "🏃",
    productName: "Nike Air Max 270",
    rating: 5,
    title: "Đôi giày hoàn hảo cho việc chạy bộ",
    content: "Đã dùng được 1 tháng, giày rất nhẹ và thoải mái. Đế êm, form chuẩn với size chart. Rất hài lòng!",
    status: "pending",
    helpful: 0,
    notHelpful: 0,
    hasImages: true,
    imageCount: 2,
    replied: false,
    createdAt: "30 phút trước",
    platform: "shopee",
    verified: false,
  },
  {
    id: 5,
    customerName: "Hoàng Văn Long",
    customerAvatar: "HL",
    brandName: "Canifa Fashion",
    brandEmoji: "👕",
    productName: "Áo len Canifa Premium",
    rating: 1,
    title: "Hàng không đúng màu, chất liệu kém",
    content: "Màu sắc thực tế khác xa ảnh trên web. Chất liệu cứng, không mềm như mô tả. Đã yêu cầu đổi trả nhưng chưa được giải quyết.",
    status: "flagged",
    helpful: 67,
    notHelpful: 3,
    hasImages: true,
    imageCount: 4,
    replied: false,
    createdAt: "2 ngày trước",
    platform: "lazada",
    verified: true,
  },
  {
    id: 6,
    customerName: "Vũ Thị Ngọc",
    customerAvatar: "VN",
    brandName: "Trung Nguyên Legend",
    brandEmoji: "🍵",
    productName: "Cà phê G7 3in1 hộp 100 gói",
    rating: 5,
    title: "Cà phê thơm ngon, giao nhanh",
    content: "Mua lần thứ 5 rồi, vẫn rất ngon. Shop giao hàng nhanh, đóng gói chắc chắn. Recommend cho mọi người!",
    status: "published",
    helpful: 24,
    notHelpful: 1,
    hasImages: false,
    imageCount: 0,
    replied: true,
    createdAt: "3 ngày trước",
    platform: "shopee",
    verified: true,
  },
  {
    id: 7,
    customerName: "Đặng Thị Thu",
    customerAvatar: "ĐT",
    brandName: "JYSK Furniture",
    brandEmoji: "🛋️",
    productName: "Ghế văn phòng JYSK Ergonomic",
    rating: 3,
    title: "Ghế ổn nhưng lắp ráp khó",
    content: "Chất lượng ghế khá tốt, ngồi thoải mái. Nhưng hướng dẫn lắp ráp không rõ ràng, mất gần 2 tiếng mới xong.",
    status: "published",
    helpful: 15,
    notHelpful: 2,
    hasImages: false,
    imageCount: 0,
    replied: false,
    createdAt: "4 ngày trước",
    platform: "tiki",
    verified: true,
  },
  {
    id: 8,
    customerName: "Ngô Bá Khá",
    customerAvatar: "NK",
    brandName: "Dược Hậu Giang",
    brandEmoji: "💊",
    productName: "Vitamin C 1000mg DHG",
    rating: 4,
    title: "Sản phẩm chính hãng, giá tốt",
    content: "Đã dùng 2 hộp, cảm thấy sức đề kháng tốt hơn. Giá rẻ hơn mua ở nhà thuốc. Sẽ tiếp tục ủng hộ.",
    status: "pending",
    helpful: 0,
    notHelpful: 0,
    hasImages: false,
    imageCount: 0,
    replied: false,
    createdAt: "1 giờ trước",
    platform: "sendo",
    verified: false,
  },
  {
    id: 9,
    customerName: "Bùi Thị Hương",
    customerAvatar: "BH",
    brandName: "Biti's Hunter",
    brandEmoji: "👟",
    productName: "Dép Biti's Nữ Quai Ngang",
    rating: 5,
    title: "Dép siêu cute, đi rất êm chân",
    content: "Màu sắc y như hình, chất liệu mềm mại. Đi cả ngày không đau chân. Mẫu mã rất trendy. Đặt thêm 2 đôi nữa luôn 😍",
    status: "hidden",
    helpful: 8,
    notHelpful: 0,
    hasImages: true,
    imageCount: 6,
    replied: false,
    createdAt: "5 ngày trước",
    platform: "shopee",
    verified: true,
  },
  {
    id: 10,
    customerName: "Trịnh Văn Nam",
    customerAvatar: "TN",
    brandName: "Samsung Electronics",
    brandEmoji: "📱",
    productName: "Samsung Galaxy Tab S9",
    rating: 4,
    title: "Máy tính bảng tốt cho học sinh",
    content: "Mua cho con học online. Màn hình sắc nét, pin trâu. Dùng được 3 tháng vẫn tốt. Hài lòng với sản phẩm.",
    status: "published",
    helpful: 19,
    notHelpful: 1,
    hasImages: false,
    imageCount: 0,
    replied: true,
    createdAt: "1 tuần trước",
    platform: "lazada",
    verified: true,
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ReviewStatus, { label: string; dot: string; className: string }> = {
  published: { label: "Đã đăng", dot: "bg-emerald-500", className: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  pending: { label: "Chờ duyệt", dot: "bg-amber-400", className: "bg-amber-50 text-amber-800 border-amber-200" },
  hidden: { label: "Đã ẩn", dot: "bg-gray-400", className: "bg-gray-100 text-gray-600 border-gray-200" },
  flagged: { label: "Báo cáo", dot: "bg-red-500", className: "bg-red-50 text-red-700 border-red-200" },
};

const PLATFORM_CONFIG = {
  shopee: { label: "Shopee", className: "bg-orange-50 text-orange-700 border-orange-200" },
  lazada: { label: "Lazada", className: "bg-pink-50 text-pink-700 border-pink-200" },
  tiki: { label: "Tiki", className: "bg-blue-50 text-blue-700 border-blue-200" },
  sendo: { label: "Sendo", className: "bg-green-50 text-green-700 border-green-200" },
};

const AVATAR_COLORS: Record<string, string> = {
  NL: "bg-pink-100 text-pink-700",
  TK: "bg-blue-100 text-blue-700",
  LT: "bg-orange-100 text-orange-700",
  PH: "bg-purple-100 text-purple-700",
  HL: "bg-teal-100 text-teal-700",
  VN: "bg-indigo-100 text-indigo-700",
  ĐT: "bg-emerald-100 text-emerald-700",
  NK: "bg-amber-100 text-amber-700",
  BH: "bg-rose-100 text-rose-700",
  TN: "bg-yellow-100 text-yellow-700",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function CustomerAvatar({ initials }: { initials: string }) {
  const color = AVATAR_COLORS[initials] ?? "bg-gray-100 text-gray-600";
  return (
    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-medium shrink-0", color)}>
      {initials}
    </div>
  );
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: 12, md: 14, lg: 16 };
  const px = sizes[size];
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={px}
          className={s <= rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
        />
      ))}
    </div>
  );
}

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const barColor =
    star >= 4 ? "bg-emerald-400" : star === 3 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5 shrink-0">
        <span className="text-[12px] text-gray-600 w-3 text-right">{star}</span>
        <Star size={10} className="fill-amber-400 text-amber-400" />
      </div>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full", barColor)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] text-gray-400 w-6 text-right">{count}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ReviewManagementPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [starFilter, setStarFilter] = useState<StarFilter>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { state: pagination, onStateChange: setPagination, reset: resetPagination } = usePagination({ pageSize: 10 });

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "Tất cả" },
    { key: "published", label: "Đã đăng" },
    { key: "pending", label: "Chờ duyệt" },
    { key: "flagged", label: "Báo cáo" },
    { key: "hidden", label: "Đã ẩn" },
  ];

  const tabCounts: Record<TabKey, number> = {
    all: REVIEWS.length,
    published: REVIEWS.filter((r) => r.status === "published").length,
    pending: REVIEWS.filter((r) => r.status === "pending").length,
    flagged: REVIEWS.filter((r) => r.status === "flagged").length,
    hidden: REVIEWS.filter((r) => r.status === "hidden").length,
  };

  const filtered = REVIEWS.filter((r) => {
    const matchTab = activeTab === "all" || r.status === activeTab;
    const matchStar = starFilter === "all" || r.rating === parseInt(starFilter);
    const matchSearch =
      search === "" ||
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.brandName.toLowerCase().includes(search.toLowerCase()) ||
      r.productName.toLowerCase().includes(search.toLowerCase()) ||
      r.content.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchStar && matchSearch;
  });

  const paginatedReviews = paginateData(filtered, pagination.page, pagination.pageSize);

  // Reset pagination when filters change
  React.useEffect(() => {
    resetPagination();
  }, [activeTab, starFilter, resetPagination]);

  // Rating distribution
  const totalReviews = REVIEWS.length;
  const avgRating = (REVIEWS.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1);
  const ratingCounts = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: REVIEWS.filter((r) => r.rating === s).length,
  }));

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-sm overflow-hidden">
      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 h-[52px] px-6 flex items-center gap-4 shrink-0">
          <h1 className="text-base font-medium text-gray-900 flex-1">Quản lý đánh giá</h1>
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 w-60">
            <Search size={13} className="text-gray-400" />
            <input
              className="bg-transparent text-[13px] text-gray-700 outline-none placeholder:text-gray-400 flex-1"
              placeholder="Tìm khách hàng, sản phẩm, nội dung..."
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
              Xuất báo cáo
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Metrics */}
          <div className="grid grid-cols-4 gap-3">
            {[
              {
                label: "Tổng đánh giá",
                value: "8,430",
                change: "+14.2%",
                up: true,
                sub: "so với tháng trước",
                icon: MessageSquare,
                iconBg: "bg-violet-50",
                iconColor: "text-violet-600",
              },
              {
                label: "Điểm trung bình",
                value: avgRating,
                change: "+0.3",
                up: true,
                sub: "trên thang 5 sao",
                icon: Star,
                iconBg: "bg-amber-50",
                iconColor: "text-amber-500",
              },
              {
                label: "Chờ phê duyệt",
                value: String(tabCounts.pending),
                change: "+5",
                up: false,
                sub: "cần xử lý hôm nay",
                icon: Clock,
                iconBg: "bg-blue-50",
                iconColor: "text-blue-600",
              },
              {
                label: "Bị báo cáo",
                value: String(tabCounts.flagged),
                change: "+2",
                up: false,
                sub: "cần xem xét ngay",
                icon: Flag,
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
                  <span className={cn("px-1.5 py-0.5 rounded font-medium", up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600")}>
                    {up ? <TrendingUp size={9} className="inline mr-0.5" /> : <TrendingDown size={9} className="inline mr-0.5" />}
                    {change}
                  </span>
                  {sub}
                </div>
              </div>
            ))}
          </div>

          {/* Rating overview + breakdown + sentiment */}
          <div className="grid grid-cols-[200px_1fr_1fr_1fr] gap-3">
            {/* Overall score */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col items-center justify-center text-center">
              <p className="text-[11px] text-gray-400 mb-1">Điểm tổng thể</p>
              <p className="text-5xl font-medium text-gray-900 leading-none mb-1">{avgRating}</p>
              <StarRating rating={Math.round(parseFloat(avgRating))} size="md" />
              <p className="text-[11px] text-gray-400 mt-1.5">{totalReviews} đánh giá</p>
              <div className="mt-3 w-full space-y-1.5">
                {ratingCounts.map(({ star, count }) => (
                  <RatingBar key={star} star={star} count={count} total={totalReviews} />
                ))}
              </div>
            </div>

            {/* Sentiment breakdown */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="text-[13px] font-medium text-gray-900 mb-3">Cảm xúc đánh giá</h3>
              <div className="space-y-3">
                {[
                  { label: "Tích cực (4–5 ⭐)", count: REVIEWS.filter((r) => r.rating >= 4).length, total: totalReviews, color: "bg-emerald-400", textColor: "text-emerald-700", bg: "bg-emerald-50" },
                  { label: "Trung tính (3 ⭐)", count: REVIEWS.filter((r) => r.rating === 3).length, total: totalReviews, color: "bg-amber-400", textColor: "text-amber-700", bg: "bg-amber-50" },
                  { label: "Tiêu cực (1–2 ⭐)", count: REVIEWS.filter((r) => r.rating <= 2).length, total: totalReviews, color: "bg-red-400", textColor: "text-red-700", bg: "bg-red-50" },
                ].map(({ label, count, total, color, textColor, bg }) => {
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] text-gray-600">{label}</span>
                        <span className={cn("text-[11px] font-medium px-1.5 py-0.5 rounded", bg, textColor)}>
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-3">
                <div className="text-center">
                  <p className="text-base font-medium text-gray-900">{REVIEWS.filter((r) => r.hasImages).length}</p>
                  <p className="text-[11px] text-gray-400">Có hình ảnh</p>
                </div>
                <div className="text-center">
                  <p className="text-base font-medium text-gray-900">{REVIEWS.filter((r) => r.verified).length}</p>
                  <p className="text-[11px] text-gray-400">Đã xác minh</p>
                </div>
              </div>
            </div>

            {/* Response rate */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="text-[13px] font-medium text-gray-900 mb-3">Tỉ lệ phản hồi</h3>
              <div className="flex items-center justify-center mb-3">
                <div className="relative w-24 h-24">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1a1a2e" strokeWidth="3"
                      strokeDasharray={`${Math.round((REVIEWS.filter(r => r.replied).length / totalReviews) * 100)} 100`}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-lg font-medium text-gray-900">{Math.round((REVIEWS.filter(r => r.replied).length / totalReviews) * 100)}%</p>
                    <p className="text-[10px] text-gray-400">đã trả lời</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Đã phản hồi", count: REVIEWS.filter((r) => r.replied).length, color: "bg-emerald-400" },
                  { label: "Chưa phản hồi", count: REVIEWS.filter((r) => !r.replied).length, color: "bg-gray-200" },
                ].map(({ label, count, color }) => (
                  <div key={label} className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-1.5">
                      <span className={cn("w-2 h-2 rounded-sm", color)} />
                      <span className="text-gray-600">{label}</span>
                    </div>
                    <span className="font-medium text-gray-800">{count}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-[11px] text-gray-400 mb-1">Thời gian phản hồi TB</p>
                <p className="text-base font-medium text-gray-900">4.2 giờ</p>
              </div>
            </div>

            {/* Top brands by rating */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="text-[13px] font-medium text-gray-900 mb-3">Thương hiệu nổi bật</h3>
              <div className="space-y-2">
                {[
                  { emoji: "📱", name: "Samsung Electronics", avg: 4.5, count: 1840 },
                  { emoji: "👟", name: "Biti's Hunter", avg: 4.4, count: 2310 },
                  { emoji: "🏃", name: "Nike Vietnam", avg: 4.3, count: 960 },
                  { emoji: "💄", name: "Shiseido VN", avg: 4.1, count: 730 },
                  { emoji: "🍵", name: "Trung Nguyên", avg: 4.0, count: 1120 },
                ].map((b) => (
                  <div key={b.name} className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <span className="text-base shrink-0">{b.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-gray-900 truncate">{b.name}</p>
                      <p className="text-[10px] text-gray-400">{b.count.toLocaleString()} đánh giá</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star size={10} className="fill-amber-400 text-amber-400" />
                      <span className="text-[12px] font-medium text-gray-700">{b.avg}</span>
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
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", activeTab === key ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500")}>
                    {tabCounts[key]}
                  </span>
                </button>
              ))}
            </div>

            {/* Star filters */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
              {(["all", "5", "4", "3", "2", "1"] as StarFilter[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStarFilter(s)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[12px] border transition-all flex items-center gap-1",
                    starFilter === s
                      ? "bg-[#1a1a2e] text-white border-[#1a1a2e]"
                      : "text-gray-500 border-gray-200 hover:bg-gray-50"
                  )}
                >
                  {s === "all" ? "Tất cả sao" : (
                    <><Star size={10} className={cn(starFilter === s ? "fill-white text-white" : "fill-amber-400 text-amber-400")} /> {s} sao</>
                  )}
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
                  {["Khách hàng", "Thương hiệu / Sản phẩm", "Đánh giá", "Nội dung", "Hữu ích", "Sàn", "Trạng thái", "Thời gian", ""].map((h) => (
                    <TableHead key={h} className="text-[11px] font-medium text-gray-400 uppercase tracking-wider py-2.5">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReviews.map((review) => {
                  const st = STATUS_CONFIG[review.status];
                  const plt = PLATFORM_CONFIG[review.platform];
                  const isExpanded = expandedId === review.id;
                  return (
                    <TableRow
                      key={review.id}
                      className={cn(
                        "border-gray-100 transition-colors",
                        review.status === "flagged" ? "bg-red-50/30 hover:bg-red-50/50" : "hover:bg-gray-50/60"
                      )}
                    >
                      {/* Customer */}
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <CustomerAvatar initials={review.customerAvatar} />
                          <div>
                            <p className="text-[13px] font-medium text-gray-900 whitespace-nowrap">{review.customerName}</p>
                            <div className="flex items-center gap-1">
                              {review.verified && (
                                <span className="flex items-center gap-0.5 text-[10px] text-emerald-600">
                                  <ShieldCheck size={9} /> Đã xác minh
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Brand / Product */}
                      <TableCell>
                        <div>
                          <p className="text-[12px] font-medium text-gray-700 flex items-center gap-1">
                            <span>{review.brandEmoji}</span> {review.brandName}
                          </p>
                          <p className="text-[11px] text-gray-400 max-w-[160px] truncate">{review.productName}</p>
                        </div>
                      </TableCell>

                      {/* Rating */}
                      <TableCell>
                        <div className="space-y-0.5">
                          <StarRating rating={review.rating} />
                          <p className="text-[10px] font-medium text-gray-500">{review.rating}.0 / 5</p>
                        </div>
                      </TableCell>

                      {/* Content */}
                      <TableCell className="max-w-[220px]">
                        <p className="text-[12px] font-medium text-gray-800 mb-0.5 truncate">{review.title}</p>
                        <p className={cn("text-[11px] text-gray-500 leading-relaxed", isExpanded ? "" : "line-clamp-2")}>
                          {review.content}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {review.hasImages && (
                            <span className="flex items-center gap-0.5 text-[10px] text-blue-600">
                              <ImageIcon size={9} /> {review.imageCount} ảnh
                            </span>
                          )}
                          {review.replied && (
                            <span className="flex items-center gap-0.5 text-[10px] text-emerald-600">
                              <Reply size={9} /> Đã trả lời
                            </span>
                          )}
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : review.id)}
                            className="text-[10px] text-blue-500 hover:underline"
                          >
                            {isExpanded ? "Thu gọn" : "Xem thêm"}
                          </button>
                        </div>
                      </TableCell>

                      {/* Helpful */}
                      <TableCell>
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="flex items-center gap-0.5 text-emerald-600">
                            <ThumbsUp size={10} /> {review.helpful}
                          </span>
                          <span className="flex items-center gap-0.5 text-gray-400">
                            <ThumbsDown size={10} /> {review.notHelpful}
                          </span>
                        </div>
                      </TableCell>

                      {/* Platform */}
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[10px] font-medium border", plt.className)}>
                          {plt.label}
                        </Badge>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[11px] font-medium border gap-1", st.className)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", st.dot)} />
                          {st.label}
                        </Badge>
                      </TableCell>

                      {/* Time */}
                      <TableCell className="text-[12px] text-gray-400 whitespace-nowrap">
                        {review.createdAt}
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <div className="flex gap-1 justify-end">
                          <button className="w-6 h-6 rounded-md border border-gray-150 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors" title="Xem">
                            <Eye size={12} />
                          </button>
                          {review.status === "pending" && (
                            <>
                              <button className="w-6 h-6 rounded-md border border-emerald-200 flex items-center justify-center text-emerald-500 hover:bg-emerald-50 transition-colors" title="Duyệt">
                                <CheckCircle2 size={12} />
                              </button>
                              <button className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors" title="Ẩn">
                                <ShieldX size={12} />
                              </button>
                            </>
                          )}
                          {review.status === "flagged" && (
                            <button className="w-6 h-6 rounded-md border border-red-200 flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors" title="Gỡ vi phạm">
                              <AlertCircle size={12} />
                            </button>
                          )}
                          <button className="w-6 h-6 rounded-md border border-gray-150 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors" title="Xóa">
                            <Trash2 size={12} />
                          </button>
                          <button className="w-6 h-6 rounded-md border border-gray-150 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                            <MoreVertical size={12} />
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
                Không tìm thấy đánh giá nào phù hợp.
              </div>
            )}

            {/* Pagination */}
            <AdminPagination
              state={pagination}
              onStateChange={setPagination}
              totalItems={filtered.length}
              itemsLabel="đánh giá"
            />
          </div>
        </div>
      </div>
    </div>
  );
}