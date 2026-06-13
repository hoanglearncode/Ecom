"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/features/products/api";
import type { Product as APIProduct } from "@/features/products/types";
import {
  Heart, ShoppingCart, Trash2, Share2, Bell, Search,
  Star, X, Plus, Minus, ChevronRight, Tag, Truck,
  ArrowUpDown, Filter, CheckCircle2, Gift, Zap,
  SlidersHorizontal, Grid2x2, List, Package,
  BadgePercent, ExternalLink, MoreHorizontal,
  ShoppingBag, Sparkles, Flame, TrendingDown,
  FolderPlus, FolderOpen, Clock, AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

function ProductImg({ src, alt, cls }: { src: string; alt: string; cls?: string }) {
  if (src.startsWith("http") || src.startsWith("/")) {
    return <img src={src} alt={alt} className={cn("object-cover w-full h-full", cls)} />;
  }
  return <span>{src}</span>;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type WishlistFilter = "all" | "on_sale" | "low_stock" | "new";
type SortKey = "added_date" | "price_asc" | "price_desc" | "discount" | "name";
type ViewMode = "grid" | "list";

interface WishlistItem {
  id: string;
  name: string;
  image: string;
  brand: string;
  brandEmoji: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  stock: number;
  inStock: boolean;
  isOnSale: boolean;
  isNew: boolean;
  isFlash: boolean;
  addedDate: string;
  addedDaysAgo: number;
  platform: "shopee" | "lazada" | "tiki" | "sendo";
  colors: string[];
  collection: string;
  priceDropped: boolean;
  priceDrop: number;
}

interface WishlistCollection {
  id: string;
  name: string;
  emoji: string;
  count: number;
  isDefault: boolean;
}

// ─── Adapter ─────────────────────────────────────────────────────────────────

function adaptWishlistItem(p: APIProduct, idx: number): WishlistItem {
  const compareAt = p.compareAtPrice ?? p.price;
  const isOnSale = !!p.compareAtPrice && p.compareAtPrice > p.price;
  const priceDrop = isOnSale ? Math.round(((compareAt - p.price) / compareAt) * 100) : 0;
  const dates = ["Hôm nay","Hôm qua","2 ngày trước","3 ngày trước","4 ngày trước","5 ngày trước","1 tuần trước","2 tuần trước","1 tháng trước"];
  return {
    id: p.id,
    name: p.name,
    image: p.thumbnail ?? "📦",
    brand: p.brand ?? "—",
    brandEmoji: "🏷️",
    price: p.price,
    originalPrice: compareAt,
    rating: p.rating ?? 4.5,
    reviewCount: p.reviewCount ?? 0,
    soldCount: 0,
    stock: p.stock ?? 0,
    inStock: (p.stock ?? 0) > 0,
    isOnSale,
    isNew: false,
    isFlash: false,
    addedDate: dates[Math.min(idx, dates.length - 1)],
    addedDaysAgo: idx,
    platform: "shopee",
    colors: p.color ? [p.color] : [],
    collection: "all",
    priceDropped: priceDrop >= 10,
    priceDrop,
  };
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const COLLECTIONS: WishlistCollection[] = [
  { id: "all",       name: "Tất cả",           emoji: "❤️",  count: 12, isDefault: true  },
  { id: "sneaker",   name: "Giày yêu thích",   emoji: "👟",  count: 4,  isDefault: false },
  { id: "fashion",   name: "Thời trang hè",    emoji: "👕",  count: 3,  isDefault: false },
  { id: "beauty",    name: "Skincare routine",  emoji: "💄",  count: 3,  isDefault: false },
  { id: "tech",      name: "Tech wishlist",     emoji: "📱",  count: 2,  isDefault: false },
];

const STATIC_ITEMS: WishlistItem[] = [
  {
    id: "W001", name: "Biti's Hunter X Street 2026 – Phiên Bản Hè",
    image: "👟", brand: "Biti's Hunter", brandEmoji: "👟",
    price: 449000, originalPrice: 749000,
    rating: 4.9, reviewCount: 12400, soldCount: 38400,
    stock: 12, inStock: true, isOnSale: true, isNew: false, isFlash: true,
    addedDate: "Hôm nay", addedDaysAgo: 0,
    platform: "shopee", colors: ["#1a1a2e", "#f97316", "#ffffff"],
    collection: "sneaker", priceDropped: true, priceDrop: 40,
  },
  {
    id: "W002", name: "Nike Air Max 270 Nam – Chính Hãng",
    image: "🏃", brand: "Nike VN", brandEmoji: "🏃",
    price: 2190000, originalPrice: 3490000,
    rating: 4.9, reviewCount: 8800, soldCount: 12300,
    stock: 32, inStock: true, isOnSale: true, isNew: false, isFlash: false,
    addedDate: "Hôm qua", addedDaysAgo: 1,
    platform: "lazada", colors: ["#f97316", "#1a1a2e", "#3b82f6"],
    collection: "sneaker", priceDropped: false, priceDrop: 0,
  },
  {
    id: "W003", name: "Shiseido Vital Perfection Cream 50ml",
    image: "💆", brand: "Shiseido VN", brandEmoji: "💄",
    price: 620000, originalPrice: 980000,
    rating: 4.7, reviewCount: 3400, soldCount: 8900,
    stock: 87, inStock: true, isOnSale: true, isNew: false, isFlash: false,
    addedDate: "2 ngày trước", addedDaysAgo: 2,
    platform: "tiki", colors: ["#fce7f3"],
    collection: "beauty", priceDropped: true, priceDrop: 15,
  },
  {
    id: "W004", name: "Canifa Áo Len Oversize Premium – Thu Đông",
    image: "🧥", brand: "Canifa", brandEmoji: "👕",
    price: 499000, originalPrice: 499000,
    rating: 4.6, reviewCount: 2100, soldCount: 5600,
    stock: 0, inStock: false, isOnSale: false, isNew: true, isFlash: false,
    addedDate: "3 ngày trước", addedDaysAgo: 3,
    platform: "shopee", colors: ["#6b7280", "#1a1a2e", "#fce7f3"],
    collection: "fashion", priceDropped: false, priceDrop: 0,
  },
  {
    id: "W005", name: "Samsung Galaxy S24 FE – 128GB Tím",
    image: "📱", brand: "Samsung VN", brandEmoji: "📱",
    price: 8490000, originalPrice: 12990000,
    rating: 4.8, reviewCount: 6200, soldCount: 4100,
    stock: 5, inStock: true, isOnSale: true, isNew: false, isFlash: true,
    addedDate: "4 ngày trước", addedDaysAgo: 4,
    platform: "lazada", colors: ["#7c3aed", "#1a1a2e", "#e5e7eb"],
    collection: "tech", priceDropped: true, priceDrop: 35,
  },
  {
    id: "W006", name: "Biti's Hunter Lite Go – Siêu Nhẹ 188g",
    image: "🏃", brand: "Biti's Hunter", brandEmoji: "👟",
    price: 379000, originalPrice: 549000,
    rating: 4.8, reviewCount: 6300, soldCount: 16500,
    stock: 65, inStock: true, isOnSale: true, isNew: false, isFlash: false,
    addedDate: "5 ngày trước", addedDaysAgo: 5,
    platform: "tiki", colors: ["#e0f2fe", "#1a1a2e"],
    collection: "sneaker", priceDropped: false, priceDrop: 0,
  },
  {
    id: "W007", name: "Shiseido SPF50 Sunscreen Mist 150ml",
    image: "🌿", brand: "Shiseido VN", brandEmoji: "💄",
    price: 380000, originalPrice: 580000,
    rating: 4.9, reviewCount: 4100, soldCount: 9800,
    stock: 93, inStock: true, isOnSale: true, isNew: true, isFlash: false,
    addedDate: "1 tuần trước", addedDaysAgo: 7,
    platform: "lazada", colors: ["#f0fdf4"],
    collection: "beauty", priceDropped: false, priceDrop: 0,
  },
  {
    id: "W008", name: "Canifa Quần Jean Slim Fit Cao Cấp",
    image: "👖", brand: "Canifa", brandEmoji: "👕",
    price: 399000, originalPrice: 649000,
    rating: 4.5, reviewCount: 1800, soldCount: 4200,
    stock: 88, inStock: true, isOnSale: true, isNew: false, isFlash: false,
    addedDate: "1 tuần trước", addedDaysAgo: 7,
    platform: "sendo", colors: ["#1e40af", "#1a1a2e"],
    collection: "fashion", priceDropped: false, priceDrop: 0,
  },
  {
    id: "W009", name: "Samsung Galaxy Tab A9 – WiFi 128GB",
    image: "📟", brand: "Samsung VN", brandEmoji: "📱",
    price: 5290000, originalPrice: 7490000,
    rating: 4.6, reviewCount: 2900, soldCount: 3400,
    stock: 40, inStock: true, isOnSale: true, isNew: false, isFlash: false,
    addedDate: "2 tuần trước", addedDaysAgo: 14,
    platform: "shopee", colors: ["#e5e7eb", "#1a1a2e"],
    collection: "tech", priceDropped: true, priceDrop: 20,
  },
  {
    id: "W010", name: "Dép Biti's Nữ Quai Ngang Premium Pastel",
    image: "🩴", brand: "Biti's Hunter", brandEmoji: "👟",
    price: 299000, originalPrice: 299000,
    rating: 4.7, reviewCount: 8100, soldCount: 21000,
    stock: 0, inStock: false, isOnSale: false, isNew: true, isFlash: false,
    addedDate: "2 tuần trước", addedDaysAgo: 14,
    platform: "shopee", colors: ["#fce7f3", "#dbeafe", "#d1fae5"],
    collection: "sneaker", priceDropped: false, priceDrop: 0,
  },
  {
    id: "W011", name: "Vitamin C DHG 1000mg – Hộp 100 Viên",
    image: "💊", brand: "DHG Pharma", brandEmoji: "💊",
    price: 89000, originalPrice: 149000,
    rating: 4.7, reviewCount: 5500, soldCount: 32000,
    stock: 210, inStock: true, isOnSale: true, isNew: false, isFlash: false,
    addedDate: "3 tuần trước", addedDaysAgo: 21,
    platform: "sendo", colors: ["#fef9c3"],
    collection: "beauty", priceDropped: false, priceDrop: 0,
  },
  {
    id: "W012", name: "Biti's Hunter X Collab – Nghệ Sĩ Trẻ",
    image: "🎨", brand: "Biti's Hunter", brandEmoji: "👟",
    price: 899000, originalPrice: 899000,
    rating: 4.9, reviewCount: 2100, soldCount: 4800,
    stock: 8, inStock: true, isOnSale: false, isNew: true, isFlash: false,
    addedDate: "1 tháng trước", addedDaysAgo: 30,
    platform: "shopee", colors: ["#7c3aed", "#f97316", "#10b981"],
    collection: "fashion", priceDropped: false, priceDrop: 0,
  },
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

function GridCard({
  item, selected, onSelect, onRemove, onCart,
}: {
  item: WishlistItem;
  selected: Set<string>;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onCart: (id: string) => void;
}) {
  const [qty, setQty] = useState(0);
  const disc = discPct(item.originalPrice, item.price);
  const plt  = PLATFORM_CFG[item.platform];
  const isSel = selected.has(item.id);

  return (
    <div className={cn(
      "bg-white rounded-2xl border transition-all cursor-pointer overflow-hidden group flex flex-col",
      isSel ? "border-[#1a1a2e] ring-2 ring-[#1a1a2e]/10" : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
    )}>
      {/* Image */}
      <Link href={`/products/${item.id}`} className="relative bg-gray-50 h-40 flex items-center justify-center text-5xl shrink-0 overflow-hidden block">
        <ProductImg src={item.image} alt={item.name} />

        {/* Select checkbox */}
        <button
          onClick={e => { e.stopPropagation(); onSelect(item.id); }}
          className={cn(
            "absolute top-2 left-2 w-5 h-5 rounded border flex items-center justify-center transition-all",
            isSel ? "bg-[#1a1a2e] border-[#1a1a2e]" : "bg-white border-gray-300 opacity-0 group-hover:opacity-100"
          )}>
          {isSel && <CheckCircle2 size={12} className="text-white" />}
        </button>

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {disc > 0 && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-md font-semibold">-{disc}%</span>}
          {item.isFlash && <span className="text-[10px] bg-[#1a1a2e] text-white px-1.5 py-0.5 rounded-md flex items-center gap-0.5 font-medium"><Zap size={8} className="fill-yellow-400 text-yellow-400" />Flash</span>}
          {item.isNew  && <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-md font-medium">Mới</span>}
          {item.priceDropped && <span className="text-[10px] bg-violet-500 text-white px-1.5 py-0.5 rounded-md font-medium flex items-center gap-0.5"><TrendingDown size={8} />Giảm</span>}
        </div>

        {/* Out of stock overlay */}
        {!item.inStock && (
          <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
            <span className="text-[12px] font-medium text-gray-500 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full">Hết hàng</span>
          </div>
        )}

        {/* Remove btn */}
        <button
          onClick={e => { e.stopPropagation(); onRemove(item.id); }}
          className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 opacity-0 group-hover:opacity-100 transition-all"
          title="Xoá khỏi danh sách">
          <Trash2 size={12} />
        </button>
      </Link>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-0.5">
          <span className="text-[10px] text-gray-400">{item.brandEmoji} {item.brand}</span>
          <span className={cn("ml-auto text-[9px] px-1.5 py-0.5 rounded border font-medium", plt.cls)}>{plt.label}</span>
        </div>
        <p className="text-[13px] font-medium text-gray-900 line-clamp-2 leading-tight mb-1.5 flex-1">{item.name}</p>

        <div className="flex items-center gap-1.5 mb-2">
          <StarRow rating={item.rating} />
          <span className="text-[10px] text-gray-400">({item.reviewCount.toLocaleString()})</span>
        </div>

        {/* Color swatches */}
        <div className="flex items-center gap-1 mb-2.5">
          {item.colors.slice(0, 4).map((c, i) => (
            <span key={i} style={{ background: c, width: 11, height: 11, borderRadius: "50%", border: "1.5px solid #e5e7eb", display: "inline-block", flexShrink: 0 }} />
          ))}
          {item.colors.length > 4 && <span className="text-[10px] text-gray-400">+{item.colors.length - 4}</span>}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="text-[15px] font-bold text-red-600">{fmtPrice(item.price)}</span>
          {item.isOnSale && <span className="text-[11px] text-gray-400 line-through">{fmtPrice(item.originalPrice)}</span>}
        </div>
        {item.priceDropped && (
          <p className="text-[10px] text-violet-600 flex items-center gap-0.5 mb-2">
            <TrendingDown size={10} /> Giảm {item.priceDrop}% từ lần xem trước
          </p>
        )}

        <p className="text-[10px] text-gray-400 mb-2.5 flex items-center gap-1">
          <Clock size={9} /> Đã lưu {item.addedDate}
        </p>

        {/* Low stock warning */}
        {item.inStock && item.stock <= 15 && (
          <p className="text-[10px] text-red-600 flex items-center gap-1 mb-2">
            <AlertTriangle size={9} /> Còn {item.stock} sản phẩm
          </p>
        )}

        {/* CTA */}
        {qty === 0 ? (
          <Button size="sm"
            disabled={!item.inStock}
            onClick={e => { e.stopPropagation(); onCart(item.id); setQty(1); }}
            className="w-full h-8 bg-[#1a1a2e] hover:bg-[#2d2d4a] text-white text-[12px] gap-1.5 disabled:opacity-40">
            <ShoppingCart size={12} />
            {item.inStock ? "Thêm vào giỏ" : "Hết hàng"}
          </Button>
        ) : (
          <div className="flex items-center justify-between bg-gray-50 rounded-lg px-2 py-1.5">
            <button onClick={e => { e.stopPropagation(); setQty(Math.max(0, qty - 1)); }}
              className="w-6 h-6 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-100">
              <Minus size={10} />
            </button>
            <span className="text-[13px] font-semibold text-gray-900">{qty}</span>
            <button onClick={e => { e.stopPropagation(); setQty(qty + 1); }}
              className="w-6 h-6 rounded-md bg-[#1a1a2e] flex items-center justify-center text-white hover:bg-[#2d2d4a]">
              <Plus size={10} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ListRow({
  item, selected, onSelect, onRemove, onCart,
}: {
  item: WishlistItem;
  selected: Set<string>;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onCart: (id: string) => void;
}) {
  const disc  = discPct(item.originalPrice, item.price);
  const plt   = PLATFORM_CFG[item.platform];
  const isSel = selected.has(item.id);

  return (
    <div className={cn(
      "bg-white rounded-xl border flex items-center gap-4 p-3.5 transition-all group",
      isSel ? "border-[#1a1a2e] ring-2 ring-[#1a1a2e]/10" : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
    )}>
      {/* Checkbox */}
      <button
        onClick={() => onSelect(item.id)}
        className={cn(
          "w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0",
          isSel ? "bg-[#1a1a2e] border-[#1a1a2e]" : "bg-white border-gray-300 hover:border-gray-400"
        )}>
        {isSel && <CheckCircle2 size={12} className="text-white" />}
      </button>

      {/* Image */}
      <Link href={`/products/${item.id}`} className="relative w-16 h-16 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-3xl shrink-0 overflow-hidden block">
        <ProductImg src={item.image} alt={item.name} />
        {!item.inStock && (
          <div className="absolute inset-0 bg-white/70 rounded-xl flex items-center justify-center">
            <span className="text-[9px] text-gray-500 font-medium">Hết</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[11px] text-gray-400">{item.brandEmoji} {item.brand}</span>
          {item.isFlash && <span className="text-[9px] bg-[#1a1a2e] text-white px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5"><Zap size={7} className="fill-yellow-400 text-yellow-400" />Flash</span>}
          {item.isNew   && <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-medium">Mới</span>}
        </div>
        <p className="text-[13px] font-medium text-gray-900 truncate mb-1">{item.name}</p>
        <div className="flex items-center gap-2">
          <StarRow rating={item.rating} size={10} />
          <span className="text-[10px] text-gray-400">({item.reviewCount.toLocaleString()})</span>
          <span className="text-[10px] text-gray-300">·</span>
          <span className={cn("text-[9px] px-1.5 py-0.5 rounded border font-medium", plt.cls)}>{plt.label}</span>
          <span className="text-[10px] text-gray-400 flex items-center gap-0.5 ml-1"><Clock size={9} />{item.addedDate}</span>
        </div>
        {item.inStock && item.stock <= 15 && (
          <p className="text-[10px] text-red-600 flex items-center gap-1 mt-0.5">
            <AlertTriangle size={9} /> Còn {item.stock} sản phẩm
          </p>
        )}
      </div>

      {/* Price */}
      <div className="text-right shrink-0 min-w-[120px]">
        <div className="flex items-baseline gap-1.5 justify-end mb-0.5">
          <span className="text-[15px] font-bold text-red-600">{fmtPrice(item.price)}</span>
          {disc > 0 && <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded font-medium">-{disc}%</span>}
        </div>
        {item.isOnSale && <p className="text-[11px] text-gray-400 line-through">{fmtPrice(item.originalPrice)}</p>}
        {item.priceDropped && (
          <p className="text-[10px] text-violet-600 flex items-center gap-0.5 justify-end mt-0.5">
            <TrendingDown size={9} /> Giảm {item.priceDrop}%
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Button size="sm" disabled={!item.inStock}
          onClick={() => onCart(item.id)}
          className="h-8 bg-[#1a1a2e] hover:bg-[#2d2d4a] text-white text-[12px] gap-1.5 disabled:opacity-40">
          <ShoppingCart size={12} />
          {item.inStock ? "Thêm giỏ" : "Hết hàng"}
        </Button>
        <button
          onClick={() => onRemove(item.id)}
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WishlistPage() {
  const { data: rawProducts } = useQuery({ queryKey: ["products"], queryFn: getProducts });
  const apiItems = useMemo(
    () => rawProducts ? rawProducts.map((p, i) => adaptWishlistItem(p, i)) : null,
    [rawProducts]
  );
  const seeded = useRef(false);
  const [items, setItems] = useState<WishlistItem[]>(STATIC_ITEMS);
  useEffect(() => {
    if (!seeded.current && apiItems && apiItems.length > 0) {
      setItems(apiItems);
      seeded.current = true;
    }
  }, [apiItems]);
  const [activeCol, setActiveCol]   = useState("all");
  const [filter, setFilter]         = useState<WishlistFilter>("all");
  const [sortKey, setSortKey]       = useState<SortKey>("added_date");
  const [viewMode, setViewMode]     = useState<ViewMode>("grid");
  const [search, setSearch]         = useState("");
  const [selected, setSelected]     = useState<Set<string>>(new Set());
  const [cartAdded, setCartAdded]   = useState<Set<string>>(new Set());
  const [toast, setToast]           = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
    showToast("Đã xoá khỏi danh sách yêu thích");
  }

  function addToCart(id: string) {
    setCartAdded(prev => new Set(prev).add(id));
    showToast("Đã thêm vào giỏ hàng ✓");
  }

  function toggleSelect(id: string) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function selectAll() {
    setSelected(filtered.length === selected.size ? new Set() : new Set(filtered.map(i => i.id)));
  }

  function removeSelected() {
    setItems(prev => prev.filter(i => !selected.has(i.id)));
    setSelected(new Set());
    showToast(`Đã xoá ${selected.size} sản phẩm`);
  }

  function addAllToCart() {
    const toAdd = filtered.filter(i => i.inStock && selected.has(i.id));
    setCartAdded(prev => { const n = new Set(prev); toAdd.forEach(i => n.add(i.id)); return n; });
    showToast(`Đã thêm ${toAdd.length} sản phẩm vào giỏ`);
  }

  const filtered = items
    .filter(i => {
      if (activeCol !== "all" && i.collection !== activeCol) return false;
      if (filter === "on_sale"   && !i.isOnSale)       return false;
      if (filter === "low_stock" && (i.stock > 15 || !i.inStock)) return false;
      if (filter === "new"       && !i.isNew)           return false;
      if (search && !i.name.toLowerCase().includes(search.toLowerCase()) &&
          !i.brand.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortKey === "added_date") return a.addedDaysAgo - b.addedDaysAgo;
      if (sortKey === "price_asc")  return a.price - b.price;
      if (sortKey === "price_desc") return b.price - a.price;
      if (sortKey === "discount")   return discPct(b.originalPrice, b.price) - discPct(a.originalPrice, a.price);
      if (sortKey === "name")       return a.name.localeCompare(b.name);
      return 0;
    });

  const onSaleCount   = items.filter(i => i.isOnSale).length;
  const lowStockCount = items.filter(i => i.inStock && i.stock <= 15).length;
  const pricedropCount = items.filter(i => i.priceDropped).length;
  const totalSaved    = items.filter(i => i.isOnSale).reduce((s, i) => s + (i.originalPrice - i.price), 0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-[#1a1a2e] text-white text-[13px] font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg">
          <CheckCircle2 size={14} className="text-emerald-400" /> {toast}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-5 space-y-5">

        {/* ── Summary cards ── */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Sản phẩm đã lưu",   value: items.length,     unit: "sp",  icon: Heart,        color: "text-red-500",    bg: "bg-red-50"    },
            { label: "Đang giảm giá",      value: onSaleCount,      unit: "sp",  icon: BadgePercent, color: "text-violet-600", bg: "bg-violet-50" },
            { label: "Sắp hết hàng",       value: lowStockCount,    unit: "sp",  icon: AlertTriangle,color: "text-amber-600",  bg: "bg-amber-50"  },
            { label: "Tổng tiết kiệm được",value: Math.round(totalSaved / 1000), unit: "k₫", icon: Tag, color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map(({ label, value, unit, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", bg)}>
                <Icon size={16} className={color} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-xl font-semibold text-gray-900 leading-tight">
                  {value}<span className="text-[13px] font-normal text-gray-400 ml-0.5">{unit}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Price drop alert ── */}
        {pricedropCount > 0 && (
          <div className="flex items-center gap-3 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3">
            <TrendingDown size={16} className="text-violet-600 shrink-0" />
            <p className="text-[13px] text-violet-800 flex-1">
              <span className="font-semibold">{pricedropCount} sản phẩm</span> trong danh sách của bạn vừa giảm giá!
            </p>
            <button
              onClick={() => setFilter("on_sale")}
              className="text-[12px] font-medium text-violet-700 bg-white border border-violet-200 px-3 py-1.5 rounded-lg hover:bg-violet-100 transition-colors whitespace-nowrap">
              Xem ngay →
            </button>
          </div>
        )}

        <div className="flex gap-5">

          {/* ── Left: Collections sidebar ── */}
          <div className="w-52 shrink-0 space-y-2">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-3 py-2.5 border-b border-gray-100">
                <p className="text-[12px] font-semibold text-gray-700">Bộ sưu tập</p>
              </div>
              {COLLECTIONS.map(col => (
                <button key={col.id} onClick={() => setActiveCol(col.id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2.5 transition-colors text-left border-b border-gray-50 last:border-0",
                    activeCol === col.id ? "bg-[#1a1a2e]/5 text-[#1a1a2e]" : "text-gray-600 hover:bg-gray-50"
                  )}>
                  <span className="text-base shrink-0">{col.emoji}</span>
                  <span className="text-[13px] flex-1 truncate">{col.name}</span>
                  <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                    activeCol === col.id ? "bg-[#1a1a2e] text-white" : "bg-gray-100 text-gray-500")}>
                    {col.id === "all" ? items.length : items.filter(i => i.collection === col.id).length}
                  </span>
                </button>
              ))}
            </div>

            <button className="w-full flex items-center gap-2 text-[12px] text-gray-500 border border-dashed border-gray-300 rounded-xl px-3 py-2.5 hover:border-gray-400 hover:text-gray-700 transition-colors">
              <FolderPlus size={14} /> Tạo bộ sưu tập mới
            </button>

            {/* Filter shortcuts */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-3 py-2.5 border-b border-gray-100">
                <p className="text-[12px] font-semibold text-gray-700">Lọc nhanh</p>
              </div>
              {[
                { key: "all"        as WishlistFilter, label: "Tất cả",        emoji: "🛍️", count: items.length },
                { key: "on_sale"    as WishlistFilter, label: "Đang giảm giá", emoji: "🏷️", count: onSaleCount },
                { key: "low_stock"  as WishlistFilter, label: "Sắp hết hàng",  emoji: "⚠️", count: lowStockCount },
                { key: "new"        as WishlistFilter, label: "Hàng mới về",   emoji: "✨", count: items.filter(i => i.isNew).length },
              ].map(({ key, label, emoji, count }) => (
                <button key={key} onClick={() => setFilter(key)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2.5 transition-colors text-left border-b border-gray-50 last:border-0",
                    filter === key ? "bg-[#1a1a2e]/5 text-[#1a1a2e]" : "text-gray-600 hover:bg-gray-50"
                  )}>
                  <span className="text-sm shrink-0">{emoji}</span>
                  <span className="text-[12px] flex-1">{label}</span>
                  <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                    filter === key ? "bg-[#1a1a2e] text-white" : "bg-gray-100 text-gray-500")}>
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Product list ── */}
          <div className="flex-1 min-w-0 space-y-3">

            {/* Toolbar */}
            <div className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3 flex-wrap">
              {/* Select all */}
              <button onClick={selectAll}
                className={cn(
                  "flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg border transition-all",
                  selected.size > 0 ? "bg-[#1a1a2e] text-white border-[#1a1a2e]" : "text-gray-500 border-gray-200 hover:border-gray-300"
                )}>
                <CheckCircle2 size={12} />
                {selected.size > 0 ? `Đã chọn ${selected.size}` : "Chọn tất cả"}
              </button>

              {/* Bulk actions — visible when items selected */}
              {selected.size > 0 && (
                <>
                  <button onClick={addAllToCart}
                    className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors">
                    <ShoppingCart size={12} /> Thêm vào giỏ
                  </button>
                  <button onClick={removeSelected}
                    className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                    <Trash2 size={12} /> Xoá đã chọn
                  </button>
                  <button
                    className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors">
                    <FolderOpen size={12} /> Di chuyển
                  </button>
                </>
              )}

              <div className="ml-auto flex items-center gap-2">
                <select value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)}
                  className="text-[12px] text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white outline-none cursor-pointer">
                  <option value="added_date">Mới thêm nhất</option>
                  <option value="discount">Giảm giá nhiều nhất</option>
                  <option value="price_asc">Giá thấp đến cao</option>
                  <option value="price_desc">Giá cao đến thấp</option>
                  <option value="name">Tên A → Z</option>
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
            <p className="text-[12px] text-gray-400 px-0.5">
              Hiển thị <span className="font-medium text-gray-700">{filtered.length}</span> / {items.length} sản phẩm
            </p>

            {/* Product grid / list */}
            {filtered.length > 0 ? (
              <div className={cn(
                viewMode === "grid" ? "grid grid-cols-2 lg:grid-cols-3 gap-3" : "flex flex-col gap-2"
              )}>
                {filtered.map(item =>
                  viewMode === "grid" ? (
                    <GridCard key={item.id} item={item} selected={selected}
                      onSelect={toggleSelect} onRemove={removeItem} onCart={addToCart} />
                  ) : (
                    <ListRow key={item.id} item={item} selected={selected}
                      onSelect={toggleSelect} onRemove={removeItem} onCart={addToCart} />
                  )
                )}
              </div>
            ) : (
              <div className="py-24 text-center bg-white rounded-2xl border border-gray-100">
                <Heart size={40} className="mx-auto text-gray-200 mb-3" />
                <p className="text-gray-500 text-[14px] font-medium mb-1">
                  {items.length === 0 ? "Danh sách yêu thích trống" : "Không có sản phẩm phù hợp"}
                </p>
                <p className="text-gray-400 text-[12px] mb-4">
                  {items.length === 0 ? "Thêm sản phẩm yêu thích để lưu lại nhé!" : "Thử thay đổi bộ lọc hoặc bộ sưu tập"}
                </p>
                {items.length === 0 ? (
                  <Button className="bg-[#1a1a2e] hover:bg-[#2d2d4a] text-white gap-1.5 h-9 text-[13px]">
                    <Sparkles size={14} /> Khám phá sản phẩm
                  </Button>
                ) : (
                  <button onClick={() => { setFilter("all"); setActiveCol("all"); setSearch(""); }}
                    className="text-[13px] text-blue-600 hover:underline">
                    Xem tất cả sản phẩm →
                  </button>
                )}
              </div>
            )}

            {/* Recommendations strip */}
            {filtered.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-4 mt-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[14px] font-semibold text-gray-900 flex items-center gap-2">
                    <Sparkles size={14} className="text-violet-500" />
                    Có thể bạn cũng thích
                  </h3>
                  <button className="text-[12px] text-blue-600 hover:underline flex items-center gap-1">
                    Xem thêm <ChevronRight size={12} />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { name: "Sandal Nam Comfort Pro",   image: "👡", price: "399k", brand: "Biti's" },
                    { name: "Galaxy Tab S9 WiFi",       image: "📲", price: "8.9tr", brand: "Samsung" },
                    { name: "Áo phông Unisex Canifa",   image: "👚", price: "249k", brand: "Canifa"  },
                    { name: "Kem dưỡng Ultimune SPF30", image: "🧴", price: "720k", brand: "Shiseido"},
                  ].map((p, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/60 cursor-pointer transition-all group">
                      <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-xl shrink-0 overflow-hidden"><ProductImg src={p.image} alt={p.name} /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-gray-800 truncate">{p.name}</p>
                        <p className="text-[10px] text-gray-400">{p.brand}</p>
                        <p className="text-[12px] font-semibold text-red-600">{p.price}</p>
                      </div>
                      <button className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-400 hover:border-red-200 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                        <Heart size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}