"use client";

import { useState, useEffect } from "react";
import {
  Search, Star, Heart, ShoppingCart, Zap, Clock, Flame,
  ChevronRight, Tag, Truck, Shield, RotateCcw, Gift,
  Filter, X, Plus, Minus, CheckCircle2, TrendingUp,
  Bell, Share2, ChevronDown, Percent, BadgePercent,
  Package, ArrowRight, Timer, Sparkles, Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type SaleCategory = "all" | "sneaker" | "fashion" | "beauty" | "electronics" | "food" | "furniture";
type SortKey      = "discount" | "price_asc" | "price_desc" | "popular" | "ending_soon";

interface SaleProduct {
  id: string;
  name: string;
  image: string;
  brand: string;
  brandEmoji: string;
  price: number;
  originalPrice: number;
  category: SaleCategory;
  rating: number;
  reviewCount: number;
  soldCount: number;
  stock: number;
  maxStock: number;
  isFlash: boolean;
  isNew: boolean;
  endTime?: number; // minutes remaining for flash sale
  platform: "shopee" | "lazada" | "tiki" | "sendo";
  tags: string[];
  colors: string[];
}

interface FlashSaleSession {
  label: string;
  start: string;
  end: string;
  isActive: boolean;
  isUpcoming: boolean;
}

interface Voucher {
  code: string;
  label: string;
  desc: string;
  type: "percent" | "fixed" | "freeship";
  value: string;
  minOrder: string;
  expiry: string;
  cls: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const FLASH_SESSIONS: FlashSaleSession[] = [
  { label: "09:00",  start: "09:00", end: "11:00", isActive: false, isUpcoming: false },
  { label: "12:00",  start: "12:00", end: "14:00", isActive: true,  isUpcoming: false },
  { label: "17:00",  start: "17:00", end: "19:00", isActive: false, isUpcoming: true  },
  { label: "21:00",  start: "21:00", end: "23:00", isActive: false, isUpcoming: true  },
];

const VOUCHERS: Voucher[] = [
  { code: "SALE40",    label: "Giảm 40%",         desc: "Đơn từ 300k",   type: "percent",  value: "40%",   minOrder: "300k", expiry: "Hết hôm nay", cls: "bg-red-50 border-red-200 text-red-800" },
  { code: "SHIP0",     label: "Free ship",         desc: "Mọi đơn hàng",  type: "freeship", value: "0đ",    minOrder: "0đ",   expiry: "Còn 2 ngày",  cls: "bg-emerald-50 border-emerald-200 text-emerald-800" },
  { code: "SAVE150K",  label: "Giảm 150k",         desc: "Đơn từ 1.5tr",  type: "fixed",    value: "150k",  minOrder: "1.5tr",expiry: "Còn 3 ngày",  cls: "bg-blue-50 border-blue-200 text-blue-800" },
  { code: "NEWUSER30", label: "Khách mới -30%",    desc: "Lần đầu mua",   type: "percent",  value: "30%",   minOrder: "200k", expiry: "Không hạn",   cls: "bg-violet-50 border-violet-200 text-violet-800" },
];

const PRODUCTS: SaleProduct[] = [
  {
    id: "S001", name: "Biti's Hunter X Street 2026 – Hè", image: "👟",
    brand: "Biti's Hunter", brandEmoji: "👟", price: 449000, originalPrice: 749000,
    category: "sneaker", rating: 4.9, reviewCount: 12400, soldCount: 38400,
    stock: 48, maxStock: 200, isFlash: true, isNew: false, endTime: 47,
    platform: "shopee", tags: ["Bán chạy", "Flash sale"], colors: ["#1a1a2e","#f97316"],
  },
  {
    id: "S002", name: "Samsung Galaxy S24 FE – 128GB", image: "📱",
    brand: "Samsung VN", brandEmoji: "📱", price: 8490000, originalPrice: 12990000,
    category: "electronics", rating: 4.8, reviewCount: 6200, soldCount: 4100,
    stock: 15, maxStock: 50, isFlash: true, isNew: false, endTime: 47,
    platform: "lazada", tags: ["Hot deal", "Flash sale"], colors: ["#1a1a2e","#e5e7eb","#7c3aed"],
  },
  {
    id: "S003", name: "Shiseido Vital Perfection Cream 50ml", image: "💆",
    brand: "Shiseido VN", brandEmoji: "💄", price: 620000, originalPrice: 980000,
    category: "beauty", rating: 4.7, reviewCount: 3400, soldCount: 8900,
    stock: 87, maxStock: 150, isFlash: true, isNew: false, endTime: 47,
    platform: "tiki", tags: ["Authentic"], colors: ["#fce7f3","#fff"],
  },
  {
    id: "S004", name: "Canifa Áo Len Oversize Premium", image: "🧥",
    brand: "Canifa", brandEmoji: "👕", price: 299000, originalPrice: 499000,
    category: "fashion", rating: 4.6, reviewCount: 2100, soldCount: 5600,
    stock: 120, maxStock: 300, isFlash: false, isNew: true,
    platform: "shopee", tags: ["Mới về"], colors: ["#6b7280","#1a1a2e","#fce7f3"],
  },
  {
    id: "S005", name: "Nike Air Max 270 Nam – Chính Hãng", image: "👟",
    brand: "Nike VN", brandEmoji: "🏃", price: 2190000, originalPrice: 3490000,
    category: "sneaker", rating: 4.9, reviewCount: 8800, soldCount: 12300,
    stock: 32, maxStock: 100, isFlash: false, isNew: false,
    platform: "lazada", tags: ["Chính hãng", "Hot"], colors: ["#f97316","#1a1a2e","#3b82f6"],
  },
  {
    id: "S006", name: "G7 Cà Phê Hoà Tan 3in1 – Hộp 100 Gói", image: "☕",
    brand: "Trung Nguyên", brandEmoji: "🍵", price: 79000, originalPrice: 129000,
    category: "food", rating: 4.8, reviewCount: 14200, soldCount: 48000,
    stock: 340, maxStock: 500, isFlash: false, isNew: false,
    platform: "shopee", tags: ["Bán chạy nhất"], colors: ["#78350f"],
  },
  {
    id: "S007", name: "Ghế Văn Phòng JYSK Ergonomic Pro", image: "🪑",
    brand: "JYSK", brandEmoji: "🛋️", price: 2890000, originalPrice: 4990000,
    category: "furniture", rating: 4.5, reviewCount: 980, soldCount: 2300,
    stock: 24, maxStock: 60, isFlash: false, isNew: false,
    platform: "tiki", tags: ["Clearance"], colors: ["#1a1a2e","#6b7280"],
  },
  {
    id: "S008", name: "Vitamin C DHG 1000mg – Hộp 100 Viên", image: "💊",
    brand: "DHG Pharma", brandEmoji: "💊", price: 89000, originalPrice: 149000,
    category: "food", rating: 4.7, reviewCount: 5500, soldCount: 32000,
    stock: 210, maxStock: 400, isFlash: true, isNew: false, endTime: 47,
    platform: "sendo", tags: ["Flash sale", "Sức khoẻ"], colors: ["#fef9c3"],
  },
  {
    id: "S009", name: "Biti's Hunter Lite Go 188g", image: "🏃",
    brand: "Biti's Hunter", brandEmoji: "👟", price: 379000, originalPrice: 549000,
    category: "sneaker", rating: 4.8, reviewCount: 6300, soldCount: 16500,
    stock: 65, maxStock: 200, isFlash: false, isNew: false,
    platform: "tiki", tags: ["Siêu nhẹ"], colors: ["#e0f2fe","#1a1a2e"],
  },
  {
    id: "S010", name: "Shiseido SPF50 Sunscreen Mist 150ml", image: "🌿",
    brand: "Shiseido VN", brandEmoji: "💄", price: 380000, originalPrice: 580000,
    category: "beauty", rating: 4.9, reviewCount: 4100, soldCount: 9800,
    stock: 93, maxStock: 200, isFlash: false, isNew: true,
    platform: "lazada", tags: ["Mới về", "Trending"], colors: ["#f0fdf4"],
  },
  {
    id: "S011", name: "Canifa Quần Jean Slim Fit Cao Cấp", image: "👖",
    brand: "Canifa", brandEmoji: "👕", price: 399000, originalPrice: 649000,
    category: "fashion", rating: 4.5, reviewCount: 1800, soldCount: 4200,
    stock: 88, maxStock: 200, isFlash: false, isNew: false,
    platform: "sendo", tags: ["Sale 38%"], colors: ["#1e40af","#1a1a2e"],
  },
  {
    id: "S012", name: "Samsung Galaxy Tab A9 – WiFi 128GB", image: "📟",
    brand: "Samsung VN", brandEmoji: "📱", price: 5290000, originalPrice: 7490000,
    category: "electronics", rating: 4.6, reviewCount: 2900, soldCount: 3400,
    stock: 40, maxStock: 80, isFlash: false, isNew: false,
    platform: "shopee", tags: ["Deal hot"], colors: ["#e5e7eb","#1a1a2e"],
  },
];

const CATEGORIES_CFG: { key: SaleCategory; label: string; emoji: string }[] = [
  { key: "all",         label: "Tất cả",        emoji: "🛍️" },
  { key: "sneaker",     label: "Giày dép",       emoji: "👟" },
  { key: "fashion",     label: "Thời trang",     emoji: "👕" },
  { key: "beauty",      label: "Mỹ phẩm",        emoji: "💄" },
  { key: "electronics", label: "Điện tử",        emoji: "📱" },
  { key: "food",        label: "Thực phẩm",      emoji: "🍵" },
  { key: "furniture",   label: "Nội thất",       emoji: "🛋️" },
];

const PLATFORM_CFG = {
  shopee: { label: "Shopee", cls: "bg-orange-50 text-orange-700 border-orange-200" },
  lazada: { label: "Lazada", cls: "bg-pink-50 text-pink-700 border-pink-200" },
  tiki:   { label: "Tiki",   cls: "bg-blue-50 text-blue-700 border-blue-200" },
  sendo:  { label: "Sendo",  cls: "bg-green-50 text-green-700 border-green-200" },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtPrice(n: number) {
  return new Intl.NumberFormat("vi-VN").format(n) + "₫";
}
function fmtSold(n: number) {
  return n >= 1000 ? (n / 1000).toFixed(0) + "K" : String(n);
}
function discPct(orig: number, sale: number) {
  return Math.round(((orig - sale) / orig) * 100);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRow({ rating, size = 11 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size}
          className={s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
      ))}
    </span>
  );
}

function Countdown({ minutes }: { minutes: number }) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const s = 47;
  return (
    <div className="flex items-center gap-1">
      {[h, m, s].map((v, i) => (
        <span key={i} className="flex items-center gap-0.5">
          <span className="bg-[#1a1a2e] text-white text-[11px] font-mono font-medium px-1.5 py-0.5 rounded-md min-w-[22px] text-center">
            {String(v).padStart(2, "0")}
          </span>
          {i < 2 && <span className="text-[10px] font-bold text-gray-400">:</span>}
        </span>
      ))}
    </div>
  );
}

function StockBar({ stock, maxStock }: { stock: number; maxStock: number }) {
  const pct = Math.round((stock / maxStock) * 100);
  const color = pct <= 20 ? "bg-red-500" : pct <= 50 ? "bg-amber-400" : "bg-emerald-400";
  return (
    <div>
      <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden mb-0.5">
        <div className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${100 - pct}%` }} />
      </div>
      <p className={cn("text-[10px] font-medium",
        pct <= 20 ? "text-red-600" : pct <= 50 ? "text-amber-600" : "text-gray-400")}>
        {pct <= 20 ? `🔥 Sắp hết – còn ${stock} sp` : `Đã bán ${fmtSold(maxStock - stock)}/${fmtSold(maxStock)}`}
      </p>
    </div>
  );
}

function VoucherCard({ v, onCopy }: { v: Voucher; onCopy: (code: string) => void }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    setCopied(true);
    onCopy(v.code);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <div className={cn("rounded-xl border p-3 flex items-stretch gap-0 overflow-hidden", v.cls)}>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold">{v.label}</p>
        <p className="text-[11px] opacity-70">{v.desc}</p>
        <p className="text-[10px] opacity-60 mt-0.5">Tối thiểu {v.minOrder} · {v.expiry}</p>
      </div>
      <div className="flex flex-col items-end justify-between ml-2 shrink-0">
        <span className="font-mono text-[11px] font-semibold border border-dashed border-current px-1.5 py-0.5 rounded">
          {v.code}
        </span>
        <button onClick={copy}
          className="text-[11px] font-medium bg-white/70 hover:bg-white px-2 py-0.5 rounded transition-colors flex items-center gap-1">
          {copied ? <><CheckCircle2 size={10} /> Đã lưu</> : "Lưu mã"}
        </button>
      </div>
    </div>
  );
}

function ProductCard({ product, wishlist, onWishlist }: {
  product: SaleProduct;
  wishlist: Set<string>;
  onWishlist: (id: string) => void;
}) {
  const [qty, setQty] = useState(0);
  const liked = wishlist.has(product.id);
  const disc  = discPct(product.originalPrice, product.price);
  const plt   = PLATFORM_CFG[product.platform];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer group overflow-hidden flex flex-col">
      {/* Image area */}
      <div className="relative bg-gray-50 h-40 flex items-center justify-center text-5xl shrink-0">
        {product.image}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="text-[11px] bg-red-500 text-white px-2 py-0.5 rounded-md font-semibold">
            -{disc}%
          </span>
          {product.isFlash && (
            <span className="text-[10px] bg-[#1a1a2e] text-white px-1.5 py-0.5 rounded-md font-medium flex items-center gap-0.5">
              <Zap size={8} className="fill-yellow-400 text-yellow-400" /> Flash
            </span>
          )}
          {product.isNew && (
            <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-md font-medium">Mới</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={e => { e.stopPropagation(); onWishlist(product.id); }}
          className={cn("absolute top-2 right-2 w-7 h-7 rounded-full border flex items-center justify-center transition-all",
            liked ? "border-red-200 bg-red-50 text-red-500" : "border-gray-200 bg-white text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100")}>
          <Heart size={12} className={liked ? "fill-red-500" : ""} />
        </button>

        {/* Platform */}
        <span className={cn("absolute bottom-2 right-2 text-[9px] px-1.5 py-0.5 rounded border font-medium", plt.cls)}>
          {plt.label}
        </span>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-[11px] text-gray-400 mb-0.5 flex items-center gap-1">
          <span>{product.brandEmoji}</span>{product.brand}
        </p>
        <p className="text-[13px] font-medium text-gray-900 line-clamp-2 leading-tight mb-2 flex-1">{product.name}</p>

        {/* Stars + sold */}
        <div className="flex items-center gap-1.5 mb-2">
          <StarRow rating={product.rating} />
          <span className="text-[10px] text-gray-400">{product.rating}</span>
          <span className="text-[10px] text-gray-300">|</span>
          <span className="text-[10px] text-gray-400">Đã bán {fmtSold(product.soldCount)}</span>
        </div>

        {/* Stock bar for flash items */}
        {product.isFlash && <div className="mb-2"><StockBar stock={product.stock} maxStock={product.maxStock} /></div>}

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-[16px] font-bold text-red-600">{fmtPrice(product.price)}</span>
          <span className="text-[11px] text-gray-400 line-through">{fmtPrice(product.originalPrice)}</span>
        </div>

        {/* Tags */}
        <div className="flex gap-1 flex-wrap mb-3">
          {product.tags.slice(0, 2).map(t => (
            <span key={t} className="text-[9px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{t}</span>
          ))}
        </div>

        {/* CTA */}
        {qty === 0 ? (
          <Button size="sm"
            onClick={e => { e.stopPropagation(); setQty(1); }}
            className="w-full h-8 bg-[#1a1a2e] hover:bg-[#2d2d4a] text-white text-[12px] gap-1.5">
            <ShoppingCart size={13} /> Thêm vào giỏ
          </Button>
        ) : (
          <div className="flex items-center justify-between bg-gray-50 rounded-lg px-2 py-1.5">
            <button onClick={e => { e.stopPropagation(); setQty(Math.max(0, qty - 1)); }}
              className="w-7 h-7 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-100">
              <Minus size={11} />
            </button>
            <span className="text-[13px] font-semibold text-gray-900 w-6 text-center">{qty}</span>
            <button onClick={e => { e.stopPropagation(); setQty(qty + 1); }}
              className="w-7 h-7 rounded-md bg-[#1a1a2e] flex items-center justify-center text-white hover:bg-[#2d2d4a]">
              <Plus size={11} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SalePage() {
  const [category, setCategory] = useState<SaleCategory>("all");
  const [sortKey,  setSortKey]  = useState<SortKey>("discount");
  const [search,   setSearch]   = useState("");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [savedCodes, setSavedCodes] = useState<Set<string>>(new Set());
  const [activeSession, setActiveSession] = useState(1);
  const [filterFlash, setFilterFlash] = useState(false);
  const [maxPrice,  setMaxPrice]  = useState<number | null>(null);
  const [notify,   setNotify]    = useState(false);

  function toggleWishlist(id: string) {
    setWishlist(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function saveCode(code: string) {
    setSavedCodes(prev => new Set(prev).add(code));
  }

  const flashProducts = PRODUCTS.filter(p => p.isFlash);
  const filtered = PRODUCTS
    .filter(p => category === "all" || p.category === category)
    .filter(p => !filterFlash || p.isFlash)
    .filter(p => !maxPrice || p.price <= maxPrice)
    .filter(p => search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortKey === "discount")     return discPct(b.originalPrice, b.price) - discPct(a.originalPrice, a.price);
      if (sortKey === "price_asc")    return a.price - b.price;
      if (sortKey === "price_desc")   return b.price - a.price;
      if (sortKey === "popular")      return b.soldCount - a.soldCount;
      if (sortKey === "ending_soon")  return (a.endTime ?? 999) - (b.endTime ?? 999);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Hero banner ── */}
      <div className="bg-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center gap-1 text-[11px] bg-red-500 text-white px-2.5 py-1 rounded-full font-semibold">
                  <Flame size={11} /> ĐANG DIỄN RA
                </span>
                <span className="text-[11px] text-white/50">Cập nhật mỗi ngày · Số lượng có hạn</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">🔥 Siêu Sale Hè 2026</h1>
              <p className="text-white/60 text-[13px]">Hàng ngàn sản phẩm giảm đến 70% từ các thương hiệu hàng đầu</p>
              <div className="flex items-center gap-3 mt-3">
                {[
                  { icon: Tag,    v: "Đến -70%" },
                  { icon: Truck,  v: "Free ship" },
                  { icon: Gift,   v: "Quà hấp dẫn" },
                ].map(({ icon: Icon, v }) => (
                  <span key={v} className="flex items-center gap-1.5 text-[12px] text-white/70">
                    <Icon size={12} className="text-amber-400" /> {v}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[11px] text-white/40 mb-1">Flash sale kết thúc sau</p>
              <div className="flex items-center gap-2 justify-end mb-3">
                <Countdown minutes={47} />
              </div>
              <button
                onClick={() => setNotify(!notify)}
                className={cn(
                  "flex items-center gap-1.5 text-[12px] font-medium px-4 py-2 rounded-lg border transition-all",
                  notify ? "bg-white/10 border-white/20 text-white/70" : "bg-amber-400 border-amber-400 text-[#1a1a2e]"
                )}
              >
                <Bell size={13} className={notify ? "fill-white/70" : ""} />
                {notify ? "Đã bật thông báo" : "Thông báo lần sau"}
              </button>
            </div>
          </div>
        </div>

        {/* Flash sale sessions */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center gap-3">
            <span className="text-[11px] text-white/40 shrink-0 flex items-center gap-1">
              <Timer size={12} /> Khung giờ:
            </span>
            {FLASH_SESSIONS.map((s, i) => (
              <button key={s.label} onClick={() => setActiveSession(i)}
                className={cn(
                  "text-[12px] px-3 py-1.5 rounded-lg border transition-all font-medium flex items-center gap-1.5",
                  activeSession === i
                    ? "bg-white text-[#1a1a2e] border-white"
                    : s.isActive
                    ? "border-red-400/50 bg-red-400/10 text-red-300"
                    : "border-white/10 text-white/50 hover:border-white/30 hover:text-white/70"
                )}
              >
                {s.isActive && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />}
                {s.label} – {s.end}
                {s.isActive && <span className="text-[10px] bg-red-500 text-white px-1 py-0.5 rounded ml-1">LIVE</span>}
                {s.isUpcoming && <span className="text-[10px] border border-white/20 text-white/50 px-1 py-0.5 rounded ml-1">Sắp mở</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* ── Voucher strip ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-semibold text-gray-900 flex items-center gap-2">
              <BadgePercent size={16} className="text-violet-600" />
              Mã ưu đãi hôm nay
            </h2>
            <button className="text-[12px] text-blue-600 hover:underline flex items-center gap-1">
              Xem tất cả <ChevronRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {VOUCHERS.map(v => (
              <VoucherCard key={v.code} v={v} onCopy={saveCode} />
            ))}
          </div>
          {savedCodes.size > 0 && (
            <p className="text-[11px] text-emerald-600 mt-2 flex items-center gap-1">
              <CheckCircle2 size={11} /> Đã lưu {savedCodes.size} mã: {[...savedCodes].join(", ")}
            </p>
          )}
        </div>

        {/* ── Flash sale highlight ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-semibold text-gray-900 flex items-center gap-2">
                <Zap size={16} className="fill-amber-400 text-amber-400" />
                Flash Sale – Kết thúc sau
              </h2>
              <Countdown minutes={47} />
            </div>
            <button className="text-[12px] text-blue-600 hover:underline flex items-center gap-1">
              Xem tất cả <ChevronRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {flashProducts.map(p => (
              <ProductCard key={p.id} product={p} wishlist={wishlist} onWishlist={toggleWishlist} />
            ))}
          </div>
        </div>

        {/* ── All deals ── */}
        <div>
          {/* Section header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles size={16} className="text-violet-500" />
              Tất cả ưu đãi
              <span className="text-[12px] font-normal text-gray-400">({filtered.length} sản phẩm)</span>
            </h2>
          </div>

          {/* Filter & sort bar */}
          <div className="bg-white rounded-xl border border-gray-100 p-3 mb-4">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-52">
                <Search size={13} className="text-gray-400" />
                <input
                  className="bg-transparent text-[13px] text-gray-700 outline-none placeholder:text-gray-400 flex-1"
                  placeholder="Tìm sản phẩm..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && <button onClick={() => setSearch("")}><X size={11} className="text-gray-400" /></button>}
              </div>

              {/* Flash toggle */}
              <button
                onClick={() => setFilterFlash(!filterFlash)}
                className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-all",
                  filterFlash ? "bg-amber-50 border-amber-300 text-amber-700" : "border-gray-200 text-gray-500 hover:border-gray-300")}>
                <Zap size={12} className={filterFlash ? "fill-amber-400 text-amber-400" : ""} />
                Flash only
              </button>

              {/* Price presets */}
              {[
                { label: "Dưới 100k", val: 100000 },
                { label: "Dưới 500k", val: 500000 },
                { label: "Dưới 1tr",  val: 1000000 },
              ].map(({ label, val }) => (
                <button key={label}
                  onClick={() => setMaxPrice(maxPrice === val ? null : val)}
                  className={cn("px-3 py-1.5 rounded-lg border text-[12px] transition-all",
                    maxPrice === val ? "bg-blue-50 border-blue-300 text-blue-700 font-medium" : "border-gray-200 text-gray-500 hover:border-gray-300")}>
                  {label}
                </button>
              ))}

              {/* Sort */}
              <div className="ml-auto flex items-center gap-2">
                <select value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)}
                  className="text-[12px] text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white outline-none cursor-pointer">
                  <option value="discount">Giảm nhiều nhất</option>
                  <option value="popular">Phổ biến nhất</option>
                  <option value="price_asc">Giá thấp đến cao</option>
                  <option value="price_desc">Giá cao đến thấp</option>
                  <option value="ending_soon">Sắp hết giờ</option>
                </select>
              </div>
            </div>

            {/* Category chips */}
            <div className="flex gap-1.5 flex-wrap mt-3 pt-3 border-t border-gray-100">
              {CATEGORIES_CFG.map(({ key, label, emoji }) => (
                <button key={key} onClick={() => setCategory(key)}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] border transition-all whitespace-nowrap",
                    category === key ? "bg-[#1a1a2e] text-white border-[#1a1a2e]" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                  )}>
                  <span>{emoji}</span> {label}
                </button>
              ))}
              {(filterFlash || maxPrice || category !== "all") && (
                <button
                  onClick={() => { setFilterFlash(false); setMaxPrice(null); setCategory("all"); setSearch(""); }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-all">
                  <X size={11} /> Xoá bộ lọc
                </button>
              )}
            </div>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} wishlist={wishlist} onWishlist={toggleWishlist} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center bg-white rounded-2xl border border-gray-100">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-gray-500 text-[14px] mb-1">Không tìm thấy sản phẩm phù hợp.</p>
              <button onClick={() => { setCategory("all"); setSearch(""); setFilterFlash(false); setMaxPrice(null); }}
                className="text-[13px] text-blue-600 hover:underline mt-1">
                Xem tất cả ưu đãi →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}