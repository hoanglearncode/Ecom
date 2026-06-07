"use client";

import { useState, useMemo } from "react";
import {
  Search, Star, Heart, Share2, CheckCircle2, MapPin,
  Globe, ChevronRight, ShoppingCart, SlidersHorizontal,
  ArrowUpDown, Package, ThumbsUp, MessageSquare, BadgePercent,
  Truck, ShieldCheck, RotateCcw, ChevronDown, ChevronUp,
  Filter, Grid2x2, List, Phone, Mail, Clock, Award, Flame,
  Zap, TrendingUp, Users, Eye, Plus, Minus, X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductPagination, useProductPagination, paginateProducts } from "@/components/shared/ProductPagination";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProductCategory = "all" | "sneaker" | "sandal" | "dep" | "phukien";
type SortKey = "popular" | "newest" | "price_asc" | "price_desc" | "rating";
type ViewMode = "grid" | "list";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  category: ProductCategory;
  rating: number;
  reviewCount: number;
  soldCount: number;
  isNew: boolean;
  isHot: boolean;
  isSale: boolean;
  inStock: boolean;
  platform: ("shopee" | "lazada" | "tiki" | "sendo")[];
  colors: string[];
  description: string;
}

interface Review {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  productName: string;
  helpful: number;
  images: number;
  verified: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const BRAND = {
  name: "Biti's Hunter",
  slogan: "Nâng niu bàn chân Việt",
  logo: "BH",
  emoji: "👟",
  coverEmoji: "🌊",
  category: "Giày dép & Phụ kiện",
  verifiedSince: "2021",
  followers: 242000,
  products: 148,
  rating: 4.9,
  reviewCount: 48200,
  responseRate: 96,
  responseTime: "trong vài phút",
  location: "TP. Hồ Chí Minh",
  website: "bitis.com.vn",
  description:
    "Biti's Hunter – thương hiệu giày dép Việt Nam uy tín hàng đầu với hơn 40 năm kinh nghiệm. Chúng tôi mang đến những đôi giày chất lượng cao, thiết kế hiện đại và thoải mái cho mọi hoạt động.",
  platforms: ["shopee", "lazada", "tiki", "sendo"] as const,
  stats: [
    { label: "Người theo dõi",  value: "242K" },
    { label: "Sản phẩm",        value: "148" },
    { label: "Đánh giá",        value: "48.2K" },
    { label: "Tỉ lệ hài lòng",  value: "98%" },
  ],
};

const PRODUCTS: Product[] = [
  {
    id: "P001",
    name: "Biti's Hunter X Street 2026 – Phiên Bản Hè",
    image: "👟",
    price: 749000,
    originalPrice: 990000,
    category: "sneaker",
    rating: 4.9,
    reviewCount: 12400,
    soldCount: 38400,
    isNew: false,
    isHot: true,
    isSale: true,
    inStock: true,
    platform: ["shopee", "lazada", "tiki"],
    colors: ["#1a1a2e", "#f97316", "#ffffff"],
    description: "Thiết kế năng động, đế cushion siêu êm, phù hợp cho đường phố và gym.",
  },
  {
    id: "P002",
    name: "Dép Biti's Nữ Quai Ngang Premium Pastel",
    image: "🩴",
    price: 299000,
    originalPrice: 299000,
    category: "dep",
    rating: 4.7,
    reviewCount: 8100,
    soldCount: 21000,
    isNew: true,
    isHot: false,
    isSale: false,
    inStock: true,
    platform: ["shopee", "tiki"],
    colors: ["#fce7f3", "#dbeafe", "#d1fae5"],
    description: "Chất liệu cao su tự nhiên, quai mềm, thiết kế tối giản cho ngày hè.",
  },
  {
    id: "P003",
    name: "Biti's Hunter Lite Go – Siêu Nhẹ 188g",
    image: "🏃",
    price: 549000,
    originalPrice: 649000,
    category: "sneaker",
    rating: 4.8,
    reviewCount: 6300,
    soldCount: 16500,
    isNew: false,
    isHot: true,
    isSale: true,
    inStock: true,
    platform: ["shopee", "lazada", "tiki", "sendo"],
    colors: ["#e0f2fe", "#1a1a2e", "#f0fdf4"],
    description: "Chỉ 188g, công nghệ FlexFoam, lý tưởng cho chạy bộ buổi sáng.",
  },
  {
    id: "P004",
    name: "Sandal Nam Biti's Comfort Pro Active",
    image: "👡",
    price: 399000,
    originalPrice: 499000,
    category: "sandal",
    rating: 4.6,
    reviewCount: 3200,
    soldCount: 8200,
    isNew: false,
    isHot: false,
    isSale: true,
    inStock: true,
    platform: ["shopee", "lazada"],
    colors: ["#1a1a2e", "#78350f"],
    description: "Đế EVA chống sốc, quai điều chỉnh được, phù hợp outdoor và đi làm.",
  },
  {
    id: "P005",
    name: "Biti's Hunter X Collab – Nghệ Sĩ Trẻ",
    image: "🎨",
    price: 899000,
    originalPrice: 899000,
    category: "sneaker",
    rating: 4.9,
    reviewCount: 2100,
    soldCount: 4800,
    isNew: true,
    isHot: true,
    isSale: false,
    inStock: true,
    platform: ["shopee", "tiki"],
    colors: ["#7c3aed", "#f97316", "#10b981"],
    description: "Phiên bản giới hạn kết hợp cùng nghệ sĩ trẻ Việt. Số lượng có hạn.",
  },
  {
    id: "P006",
    name: "Dép Bitis Nam Thể Thao Sport Slide",
    image: "🩴",
    price: 249000,
    originalPrice: 299000,
    category: "dep",
    rating: 4.5,
    reviewCount: 4400,
    soldCount: 11000,
    isNew: false,
    isHot: false,
    isSale: true,
    inStock: true,
    platform: ["shopee", "lazada", "sendo"],
    colors: ["#1a1a2e", "#ef4444", "#3b82f6"],
    description: "Thiết kế thoáng khí, dễ vệ sinh, lý tưởng sau khi tập gym.",
  },
  {
    id: "P007",
    name: "Biti's Hunter Street – Phong Cách Monochrome",
    image: "👟",
    price: 629000,
    originalPrice: 749000,
    category: "sneaker",
    rating: 4.7,
    reviewCount: 1800,
    soldCount: 5600,
    isNew: true,
    isHot: false,
    isSale: true,
    inStock: false,
    platform: ["shopee"],
    colors: ["#1a1a2e", "#6b7280"],
    description: "All-black và All-white edition, dễ phối đồ, phù hợp mọi outfit.",
  },
  {
    id: "P008",
    name: "Phụ kiện – Túi Bảo Vệ Giày Biti's",
    image: "👜",
    price: 79000,
    originalPrice: 99000,
    category: "phukien",
    rating: 4.4,
    reviewCount: 920,
    soldCount: 6800,
    isNew: false,
    isHot: false,
    isSale: true,
    inStock: true,
    platform: ["shopee", "lazada", "tiki"],
    colors: ["#1a1a2e"],
    description: "Túi vải cao cấp, giữ giày sạch khi di chuyển, có khóa kéo chống bụi.",
  },
];

const REVIEWS: Review[] = [
  {
    id: 1, user: "Nguyễn Thị Lan", avatar: "NL",
    rating: 5, comment: "Giày cực kỳ thoải mái, đi cả ngày không đau chân. Form đẹp, đúng size. Sẽ mua thêm!",
    date: "2 giờ trước", productName: "Hunter X Street 2026", helpful: 48, images: 3, verified: true,
  },
  {
    id: 2, user: "Trần Minh Khoa", avatar: "TK",
    rating: 5, comment: "Giao hàng siêu nhanh, đóng gói cẩn thận. Giày nhẹ hơn tưởng, đế êm. Mua lần này là lần thứ 3 rồi!",
    date: "5 giờ trước", productName: "Hunter Lite Go", helpful: 31, images: 2, verified: true,
  },
  {
    id: 3, user: "Lê Thị Hoa", avatar: "LH",
    rating: 4, comment: "Dép xinh, màu sắc đẹp như hình. Chỉ hơi tiếc là chất liệu quai cứng ban đầu, đi 1-2 tuần mới mềm.",
    date: "1 ngày trước", productName: "Dép Nữ Quai Ngang", helpful: 22, images: 5, verified: true,
  },
  {
    id: 4, user: "Hoàng Văn Long", avatar: "HL",
    rating: 5, comment: "Collab edition quá đỉnh, thiết kế độc đáo không thấy ở đâu cả. Xứng đáng giá tiền.",
    date: "2 ngày trước", productName: "Hunter X Collab", helpful: 67, images: 4, verified: false,
  },
];

const CATEGORIES = [
  { key: "all"      as ProductCategory, label: "Tất cả" },
  { key: "sneaker"  as ProductCategory, label: "Giày thể thao" },
  { key: "sandal"   as ProductCategory, label: "Sandal" },
  { key: "dep"      as ProductCategory, label: "Dép" },
  { key: "phukien"  as ProductCategory, label: "Phụ kiện" },
];

const SORTS: { key: SortKey; label: string }[] = [
  { key: "popular",    label: "Phổ biến nhất" },
  { key: "newest",     label: "Mới nhất" },
  { key: "price_asc",  label: "Giá tăng dần" },
  { key: "price_desc", label: "Giá giảm dần" },
  { key: "rating",     label: "Đánh giá cao" },
];

const PLATFORM_CFG = {
  shopee: { label: "Shopee", cls: "bg-orange-50 text-orange-700 border-orange-200" },
  lazada: { label: "Lazada", cls: "bg-pink-50 text-pink-700 border-pink-200" },
  tiki:   { label: "Tiki",   cls: "bg-blue-50 text-blue-700 border-blue-200" },
  sendo:  { label: "Sendo",  cls: "bg-green-50 text-green-700 border-green-200" },
};

const AVATAR_COLORS: Record<string, string> = {
  NL: "bg-pink-100 text-pink-800",
  TK: "bg-blue-100 text-blue-800",
  LH: "bg-emerald-100 text-emerald-800",
  HL: "bg-orange-100 text-orange-800",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtPrice(n: number) {
  return new Intl.NumberFormat("vi-VN").format(n) + "₫";
}
function fmtSold(n: number) {
  return n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n);
}
function discountPct(orig: number, sale: number) {
  return Math.round(((orig - sale) / orig) * 100);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRow({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={size}
          className={s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
      ))}
    </span>
  );
}

function ProductCard({ product, wishlist, onWishlist, viewMode }: {
  product: Product;
  wishlist: Set<string>;
  onWishlist: (id: string) => void;
  viewMode: ViewMode;
}) {
  const [qty, setQty] = useState(0);
  const liked = wishlist.has(product.id);
  const disc = product.isSale ? discountPct(product.originalPrice, product.price) : 0;

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-3.5 flex items-center gap-4 hover:border-gray-200 transition-all cursor-pointer">
        <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-3xl shrink-0">
          {product.image}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <p className="text-[14px] font-medium text-gray-900 line-clamp-1">{product.name}</p>
            <div className="flex gap-1 shrink-0">
              {product.isHot  && <span className="text-[10px] bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded font-medium">🔥 Hot</span>}
              {product.isNew  && <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-medium">Mới</span>}
              {!product.inStock && <span className="text-[10px] bg-gray-100 text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded font-medium">Hết hàng</span>}
            </div>
          </div>
          <p className="text-[12px] text-gray-400 line-clamp-1 mb-1.5">{product.description}</p>
          <div className="flex items-center gap-3 text-[11px] text-gray-400">
            <span className="flex items-center gap-1"><StarRow rating={product.rating} size={10} /> {product.rating}</span>
            <span>({product.reviewCount.toLocaleString()})</span>
            <span>Đã bán {fmtSold(product.soldCount)}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="flex items-baseline gap-1.5 justify-end mb-1">
            <span className="text-[16px] font-semibold text-red-600">{fmtPrice(product.price)}</span>
            {product.isSale && <span className="text-[12px] text-gray-400 line-through">{fmtPrice(product.originalPrice)}</span>}
          </div>
          {disc > 0 && <span className="text-[10px] bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded font-medium">-{disc}%</span>}
        </div>
        <div className="flex flex-col gap-1.5 shrink-0">
          <button
            onClick={() => onWishlist(product.id)}
            className={cn("w-8 h-8 rounded-lg border flex items-center justify-center transition-all",
              liked ? "border-red-200 bg-red-50 text-red-500" : "border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400")}>
            <Heart size={14} className={liked ? "fill-red-500" : ""} />
          </button>
          <Button size="sm" disabled={!product.inStock}
            className="h-8 w-8 p-0 bg-[#1a1a2e] hover:bg-[#2d2d4a] text-white disabled:opacity-40">
            <ShoppingCart size={13} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer group overflow-hidden">
      <div className="relative bg-gray-50 h-44 flex items-center justify-center text-5xl">
        {product.image}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {disc > 0 && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-md font-medium">-{disc}%</span>}
          {product.isNew  && <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-md font-medium">Mới</span>}
          {product.isHot  && <span className="text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded-md font-medium flex items-center gap-0.5"><Flame size={8} />Hot</span>}
        </div>
        <button
          onClick={e => { e.stopPropagation(); onWishlist(product.id); }}
          className={cn("absolute top-2 right-2 w-7 h-7 rounded-full border flex items-center justify-center transition-all",
            wishlist.has(product.id) ? "border-red-200 bg-red-50 text-red-500" : "border-gray-200 bg-white text-gray-400 hover:text-red-400")}>
          <Heart size={12} className={wishlist.has(product.id) ? "fill-red-500" : ""} />
        </button>
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-[12px] font-medium text-gray-500 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full">Hết hàng</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-[13px] font-medium text-gray-900 line-clamp-2 mb-1.5 leading-tight">{product.name}</p>
        <div className="flex items-center gap-1.5 mb-2">
          <StarRow rating={product.rating} size={11} />
          <span className="text-[11px] text-gray-400">({product.reviewCount.toLocaleString()})</span>
          <span className="text-[11px] text-gray-400 ml-auto">Đã bán {fmtSold(product.soldCount)}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
          {product.colors.slice(0, 4).map(c => (
            <span key={c} style={{ background: c, width: 12, height: 12, borderRadius: "50%", border: "1.5px solid #e5e7eb", display: "inline-block" }} />
          ))}
          {product.colors.length > 4 && <span className="text-[10px] text-gray-400">+{product.colors.length - 4}</span>}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[15px] font-semibold text-red-600 leading-none">{fmtPrice(product.price)}</p>
            {product.isSale && <p className="text-[11px] text-gray-400 line-through mt-0.5">{fmtPrice(product.originalPrice)}</p>}
          </div>
          {qty === 0 ? (
            <Button size="sm" disabled={!product.inStock}
              onClick={e => { e.stopPropagation(); setQty(1); }}
              className="h-8 bg-[#1a1a2e] hover:bg-[#2d2d4a] text-white text-[12px] disabled:opacity-40 gap-1">
              <ShoppingCart size={12} /> Thêm
            </Button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button onClick={e => { e.stopPropagation(); setQty(Math.max(0, qty - 1)); }}
                className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                <Minus size={10} />
              </button>
              <span className="text-[13px] font-medium w-5 text-center">{qty}</span>
              <button onClick={e => { e.stopPropagation(); setQty(qty + 1); }}
                className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                <Plus size={10} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BrandStorePage() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("all");
  const [sortKey, setSortKey]               = useState<SortKey>("popular");
  const [viewMode, setViewMode]             = useState<ViewMode>("grid");
  const [search, setSearch]                 = useState("");
  const [wishlist, setWishlist]             = useState<Set<string>>(new Set());
  const [followed, setFollowed]             = useState(false);
  const [showAllDesc, setShowAllDesc]       = useState(false);
  const [activeTab, setActiveTab]           = useState<"products" | "reviews" | "info">("products");

  function toggleWishlist(id: string) {
    setWishlist(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const filtered = PRODUCTS
    .filter(p => activeCategory === "all" || p.category === activeCategory)
    .filter(p => search === "" || p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortKey === "price_asc")  return a.price - b.price;
      if (sortKey === "price_desc") return b.price - a.price;
      if (sortKey === "rating")     return b.rating - a.rating;
      if (sortKey === "newest")     return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return b.soldCount - a.soldCount;
    });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Store header / cover ── */}
      <div className="bg-[#1a1a2e] text-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-start gap-6">

            {/* Logo */}
            <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center text-[#1a1a2e] text-2xl font-bold shrink-0 border-2 border-white/20">
              {BRAND.logo}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 mb-1">
                <h1 className="text-xl font-semibold text-white">{BRAND.name}</h1>
                <CheckCircle2 size={16} className="text-blue-400 shrink-0" />
                <span className="text-[11px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-medium">
                  ⭐ Gold Partner
                </span>
              </div>
              <p className="text-white/60 text-[13px] mb-3 italic">"{BRAND.slogan}"</p>
              <div className="flex items-center gap-4 flex-wrap">
                {BRAND.stats.map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <p className="text-[16px] font-semibold text-white">{value}</p>
                    <p className="text-[11px] text-white/50">{label}</p>
                  </div>
                ))}
                <div className="h-8 w-px bg-white/10" />
                <div className="flex items-center gap-1.5 text-[12px] text-white/60">
                  <MapPin size={12} />
                  {BRAND.location}
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-white/60">
                  <Clock size={12} />
                  Phản hồi {BRAND.responseTime}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setFollowed(!followed)}
                className={cn(
                  "flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-lg border transition-all",
                  followed
                    ? "bg-white/10 border-white/20 text-white"
                    : "bg-white text-[#1a1a2e] border-white hover:bg-white/90"
                )}
              >
                {followed ? <CheckCircle2 size={14} /> : <Plus size={14} />}
                {followed ? "Đã theo dõi" : "Theo dõi"}
              </button>
              <button className="w-9 h-9 rounded-lg border border-white/20 bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <Share2 size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Platform badges row */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center gap-2">
            <span className="text-[12px] text-white/40 mr-1">Có mặt trên:</span>
            {BRAND.platforms.map(p => (
              <a key={p} href="#" className={cn("text-[11px] font-medium px-2.5 py-1 rounded border transition-opacity hover:opacity-80", PLATFORM_CFG[p].cls)}>
                {PLATFORM_CFG[p].label}
              </a>
            ))}
            <div className="ml-auto flex items-center gap-3 text-[12px] text-white/50">
              <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-emerald-400" /> Đã xác minh</span>
              <span className="flex items-center gap-1"><Award size={12} className="text-amber-400" /> Thành viên từ {BRAND.verifiedSince}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Trust badges ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6 overflow-x-auto">
          {[
            { icon: Truck,      label: "Giao hàng toàn quốc",  sub: "2–4 ngày" },
            { icon: RotateCcw,  label: "Đổi trả 30 ngày",      sub: "Không cần lý do" },
            { icon: ShieldCheck,label: "Hàng chính hãng 100%", sub: "Có tem xác nhận" },
            { icon: BadgePercent,label: "Ưu đãi thành viên",   sub: "Tích điểm mỗi đơn" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Icon size={15} className="text-blue-600" />
              </div>
              <div>
                <p className="text-[12px] font-medium text-gray-800">{label}</p>
                <p className="text-[11px] text-gray-400">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-5">

        {/* ── Tabs ── */}
        <div className="flex border-b border-gray-200 mb-5">
          {[
            { key: "products" as const, label: "Sản phẩm", count: PRODUCTS.length },
            { key: "reviews"  as const, label: "Đánh giá",  count: REVIEWS.length  },
            { key: "info"     as const, label: "Thông tin thương hiệu" },
          ].map(({ key, label, count }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-3 text-[13px] border-b-2 transition-colors -mb-px",
                activeTab === key ? "border-[#1a1a2e] text-gray-900 font-medium" : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              {label}
              {count !== undefined && (
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                  activeTab === key ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500")}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Products tab ── */}
        {activeTab === "products" && (
          <div className="space-y-4">

            {/* Filters row */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 max-w-xs">
                <Search size={13} className="text-gray-400" />
                <input
                  className="bg-transparent text-[13px] text-gray-700 outline-none placeholder:text-gray-400 flex-1"
                  placeholder="Tìm trong gian hàng..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Category chips */}
              <div className="flex gap-1.5 flex-wrap">
                {CATEGORIES.map(({ key, label }) => (
                  <button key={key} onClick={() => setActiveCategory(key)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-[12px] border transition-all whitespace-nowrap",
                      activeCategory === key ? "bg-[#1a1a2e] text-white border-[#1a1a2e]" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                    )}>
                    {label}
                  </button>
                ))}
              </div>

              <div className="ml-auto flex items-center gap-2">
                <select
                  value={sortKey}
                  onChange={e => setSortKey(e.target.value as SortKey)}
                  className="text-[12px] text-gray-600 border border-gray-200 rounded-lg px-2.5 py-2 bg-white outline-none cursor-pointer"
                >
                  {SORTS.map(({ key, label }) => <option key={key} value={key}>{label}</option>)}
                </select>
                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  {([["grid", Grid2x2], ["list", List]] as [ViewMode, any][]).map(([mode, Icon]) => (
                    <button key={mode} onClick={() => setViewMode(mode)}
                      className={cn("w-8 h-8 flex items-center justify-center transition-colors",
                        viewMode === mode ? "bg-[#1a1a2e] text-white" : "bg-white text-gray-400 hover:bg-gray-50")}>
                      <Icon size={14} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Result count */}
            <p className="text-[12px] text-gray-400">
              Hiển thị <span className="font-medium text-gray-700">{filtered.length}</span> sản phẩm
              {search && <> cho "<span className="font-medium text-gray-700">{search}</span>"</>}
            </p>

            {/* Product grid/list */}
            <div className={cn(
              viewMode === "grid"
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                : "flex flex-col gap-2"
            )}>
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} wishlist={wishlist} onWishlist={toggleWishlist} viewMode={viewMode} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="py-20 text-center bg-white rounded-xl border border-gray-100">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-gray-500 text-[14px]">Không tìm thấy sản phẩm phù hợp.</p>
                <button onClick={() => { setSearch(""); setActiveCategory("all"); }}
                  className="mt-3 text-[13px] text-blue-600 hover:underline">
                  Xem tất cả sản phẩm →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Reviews tab ── */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-start gap-8">
                <div className="text-center shrink-0">
                  <p className="text-5xl font-bold text-gray-900">{BRAND.rating}</p>
                  <StarRow rating={BRAND.rating} size={16} />
                  <p className="text-[12px] text-gray-400 mt-1">{BRAND.reviewCount.toLocaleString()} đánh giá</p>
                </div>
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map(s => {
                    const pct = s === 5 ? 78 : s === 4 ? 14 : s === 3 ? 5 : s === 2 ? 2 : 1;
                    return (
                      <div key={s} className="flex items-center gap-2">
                        <span className="text-[12px] text-gray-500 w-6 shrink-0">{s}</span>
                        <Star size={10} className="fill-amber-400 text-amber-400 shrink-0" />
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full", s >= 4 ? "bg-emerald-400" : s === 3 ? "bg-amber-400" : "bg-red-400")}
                            style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[11px] text-gray-400 w-8 text-right">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
                <div className="text-center shrink-0 space-y-2">
                  <div className="p-3 bg-emerald-50 rounded-xl">
                    <p className="text-lg font-bold text-emerald-700">{BRAND.responseRate}%</p>
                    <p className="text-[11px] text-emerald-600">Tỉ lệ phản hồi</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <p className="text-lg font-bold text-blue-700">98%</p>
                    <p className="text-[11px] text-blue-600">Hài lòng</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Review list */}
            <div className="space-y-3">
              {REVIEWS.map(r => {
                const ac = AVATAR_COLORS[r.avatar] ?? "bg-gray-100 text-gray-600";
                return (
                  <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-start gap-3">
                      <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-medium shrink-0", ac)}>
                        {r.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[13px] font-medium text-gray-900">{r.user}</p>
                          {r.verified && (
                            <span className="flex items-center gap-0.5 text-[10px] text-emerald-600">
                              <CheckCircle2 size={10} /> Đã mua
                            </span>
                          )}
                          <span className="text-[11px] text-gray-400 ml-auto">{r.date}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <StarRow rating={r.rating} size={12} />
                          <span className="text-[11px] text-gray-400">| {r.productName}</span>
                        </div>
                        <p className="text-[13px] text-gray-700 leading-relaxed mb-2">{r.comment}</p>
                        <div className="flex items-center gap-3 text-[11px] text-gray-400">
                          {r.images > 0 && (
                            <span className="flex items-center gap-1">
                              <Eye size={11} /> {r.images} ảnh
                            </span>
                          )}
                          <button className="flex items-center gap-1 hover:text-gray-600 transition-colors">
                            <ThumbsUp size={11} /> Hữu ích ({r.helpful})
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Info tab ── */}
        {activeTab === "info" && (
          <div className="grid grid-cols-[1fr_300px] gap-5">
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-[15px] font-semibold text-gray-900 mb-3">Giới thiệu thương hiệu</h3>
                <p className={cn("text-[13px] text-gray-600 leading-relaxed", !showAllDesc && "line-clamp-3")}>
                  {BRAND.description} Với phương châm "Nâng niu bàn chân Việt", Biti's Hunter không ngừng nghiên cứu và phát triển các công nghệ đế giày tiên tiến như FlexFoam, CushionLite và HeatShield để mang đến trải nghiệm thoải mái nhất cho người dùng Việt Nam trong mọi điều kiện thời tiết và hoạt động.
                </p>
                <button
                  onClick={() => setShowAllDesc(!showAllDesc)}
                  className="mt-2 text-[12px] text-blue-600 flex items-center gap-1 hover:underline">
                  {showAllDesc ? <><ChevronUp size={12} /> Thu gọn</> : <><ChevronDown size={12} /> Xem thêm</>}
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-[15px] font-semibold text-gray-900 mb-3">Chính sách mua hàng</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Truck,       title: "Vận chuyển",    desc: "Giao toàn quốc 2–4 ngày làm việc. Miễn phí ship đơn từ 300k." },
                    { icon: RotateCcw,   title: "Đổi trả",       desc: "Đổi trả trong 30 ngày. Không cần lý do với sản phẩm lỗi." },
                    { icon: ShieldCheck, title: "Bảo hành",      desc: "Bảo hành đế giày 6 tháng. Bảo hành mũi giày 3 tháng." },
                    { icon: BadgePercent,title: "Ưu đãi",         desc: "Tích điểm 1% mỗi đơn. Đổi quà khi đủ 500 điểm." },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                          <Icon size={13} className="text-gray-600" />
                        </div>
                        <p className="text-[13px] font-medium text-gray-900">{title}</p>
                      </div>
                      <p className="text-[12px] text-gray-500 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact card */}
            <div className="space-y-3">
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="text-[14px] font-semibold text-gray-900 mb-3">Liên hệ</h3>
                <div className="space-y-2.5">
                  {[
                    { icon: Globe,  label: "Website",    value: BRAND.website     },
                    { icon: MapPin, label: "Địa chỉ",    value: BRAND.location    },
                    { icon: Clock,  label: "Phản hồi",   value: "Trong vài phút"  },
                    { icon: MessageSquare, label: "Chat",value: "Chat với shop"   },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                        <Icon size={12} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">{label}</p>
                        <p className="text-[12px] font-medium text-gray-800">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-3 bg-[#1a1a2e] hover:bg-[#2d2d4a] text-white h-9 text-[13px] gap-1.5">
                  <MessageSquare size={13} /> Nhắn tin cho shop
                </Button>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="text-[14px] font-semibold text-gray-900 mb-3">Gian hàng trên sàn</h3>
                <div className="space-y-2">
                  {BRAND.platforms.map(p => (
                    <a key={p} href="#"
                      className={cn("flex items-center justify-between px-3 py-2 rounded-lg border transition-all hover:opacity-80", PLATFORM_CFG[p].cls)}>
                      <span className="text-[13px] font-medium">{PLATFORM_CFG[p].label}</span>
                      <ChevronRight size={14} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}