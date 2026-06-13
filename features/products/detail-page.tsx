"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProduct, getProducts } from "@/features/products/api";
import type { Product as APIProduct } from "@/features/products/types";
import {
  Star, Heart, ShoppingCart, Share2, ChevronRight, Shield,
  Truck, RotateCcw, Zap, Flame, CheckCircle2, Plus, Minus,
  ThumbsUp, MessageSquare, ImageIcon, ChevronDown, ChevronUp,
  Home, Package, Tag, Gift, Clock, Eye, TrendingDown, Copy,
  BadgePercent, Users, MapPin, Phone, AlertTriangle, X,
  ArrowRight, Layers, ShoppingBag, Sparkles, ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Platform = "shopee" | "lazada" | "tiki" | "sendo";

interface ProductVariant {
  id: string;
  label: string;
  colorHex?: string;
  stock: number;
  priceAdjust: number; // added to base price
}

interface ProductSpec {
  label: string;
  value: string;
}

interface Review {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  variant: string;
  comment: string;
  helpful: number;
  images: number;
  verified: boolean;
  brandReply?: string;
}

interface RelatedProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  rating: number;
  soldCount: number;
  brand: string;
}

// ─── Mock Product ─────────────────────────────────────────────────────────────

const PRODUCT = {
  id: "P001",
  name: "Biti's Hunter X Street 2026 – Phiên Bản Hè",
  brand: "Biti's Hunter",
  brandEmoji: "👟",
  brandSlug: "bitis-hunter",
  category: "Giày thể thao",
  categorySlug: "giay-the-thao",
  sku: "BHX-2026-SUMMER",
  price: 449000,
  originalPrice: 749000,
  platform: "shopee" as Platform,
  rating: 4.9,
  reviewCount: 12400,
  soldCount: 38400,
  viewCount: 142000,
  isAuthentic: true,
  isFreeShip: true,
  isFlash: true,
  flashEndMins: 47,
  isHot: true,
  warranty: "6 tháng",
  origin: "Việt Nam",
  material: "Mesh thoáng khí + TPU",
  description: `
Biti's Hunter X Street 2026 – Phiên Bản Hè là sự kết hợp hoàn hảo giữa phong cách đường phố và hiệu năng thể thao. 
Được thiết kế dành riêng cho giới trẻ năng động, đôi giày mang màu sắc tươi sáng của mùa hè cùng công nghệ đế mới nhất.

**Công nghệ nổi bật:**
- Đế CushionLite thế hệ mới, êm hơn 30% so với phiên bản trước
- Phần upper sử dụng vải mesh 3D thoáng khí, chống bám bẩn
- Lót giày kháng khuẩn, khử mùi tự nhiên
- Đế ngoài cao su non chống trơn trượt mọi địa hình

**Phù hợp cho:**
- Đi học, đi làm, dạo phố
- Tập gym nhẹ, đi bộ
- Các hoạt động ngoài trời
  `.trim(),
  images: ["👟", "👟", "👟", "🔍", "📐"],
  specs: [
    { label: "Thương hiệu",   value: "Biti's Hunter" },
    { label: "Xuất xứ",       value: "Việt Nam" },
    { label: "Chất liệu upper",value: "Mesh 3D + TPU" },
    { label: "Chất liệu đế",  value: "CushionLite + Cao su non" },
    { label: "Trọng lượng",   value: "~220g / chiếc" },
    { label: "Màu sắc",       value: "Xanh Navy, Cam Neon, Trắng" },
    { label: "Kích thước",    value: "35 – 45" },
    { label: "Bảo hành",      value: "6 tháng – đế + khâu" },
    { label: "SKU",           value: "BHX-2026-SUMMER" },
    { label: "Phong cách",    value: "Streetwear / Casual Sport" },
  ] as ProductSpec[],
  colorVariants: [
    { id: "v1", label: "Xanh Navy",  colorHex: "#1a1a2e", stock: 12, priceAdjust: 0    },
    { id: "v2", label: "Cam Neon",   colorHex: "#f97316", stock: 34, priceAdjust: 0    },
    { id: "v3", label: "Trắng Kem",  colorHex: "#f8f8f0", stock: 0,  priceAdjust: 0    },
    { id: "v4", label: "Xanh Lá",   colorHex: "#22c55e", stock: 8,  priceAdjust: 20000},
  ] as ProductVariant[],
  sizeVariants: [
    { id: "s35", label: "35", stock: 5,  priceAdjust: 0 },
    { id: "s36", label: "36", stock: 12, priceAdjust: 0 },
    { id: "s37", label: "37", stock: 20, priceAdjust: 0 },
    { id: "s38", label: "38", stock: 18, priceAdjust: 0 },
    { id: "s39", label: "39", stock: 25, priceAdjust: 0 },
    { id: "s40", label: "40", stock: 15, priceAdjust: 0 },
    { id: "s41", label: "41", stock: 8,  priceAdjust: 0 },
    { id: "s42", label: "42", stock: 3,  priceAdjust: 0 },
    { id: "s43", label: "43", stock: 0,  priceAdjust: 0 },
    { id: "s44", label: "44", stock: 2,  priceAdjust: 0 },
  ] as ProductVariant[],
  vouchers: [
    { code: "SUMMER40", label: "Giảm 40%",   expiry: "Hết hôm nay", cls: "bg-red-50 border-red-200 text-red-800" },
    { code: "SHIP0",    label: "Free ship",  expiry: "Còn 2 ngày",  cls: "bg-emerald-50 border-emerald-200 text-emerald-800" },
  ],
  storeInfo: {
    name: "Biti's Hunter Official",
    avatar: "BH",
    followers: 128000,
    rating: 4.9,
    responseRate: 96,
    responseTime: "trong vài phút",
    products: 148,
    verified: true,
  },
};

const REVIEWS: Review[] = [
  {
    id: 1, user: "Nguyễn Thị Lan", avatar: "NL", rating: 5,
    date: "2 giờ trước", variant: "Xanh Navy · Size 41",
    comment: "Giày cực kỳ thoải mái, đi cả ngày không đau chân. Form đẹp, đúng size. Giao hàng nhanh, đóng gói cẩn thận. Sẽ mua thêm!",
    helpful: 48, images: 3, verified: true,
    brandReply: "Cảm ơn bạn rất nhiều! Chúng tôi rất vui khi sản phẩm phù hợp với bạn. Hẹn gặp lại! 🙏",
  },
  {
    id: 2, user: "Trần Minh Khoa", avatar: "TK", rating: 5,
    date: "5 giờ trước", variant: "Cam Neon · Size 43",
    comment: "Màu cam cực đẹp, chụp ảnh lên mạng ai cũng hỏi mua ở đâu 😂. Chất liệu tốt hơn mình tưởng, đế êm bất ngờ.",
    helpful: 31, images: 5, verified: true,
  },
  {
    id: 3, user: "Lê Thị Hoa", avatar: "LH", rating: 4,
    date: "1 ngày trước", variant: "Trắng Kem · Size 37",
    comment: "Giày đẹp nhưng size hơi to hơn bình thường, bạn nên order nhỏ 1 size. Chất lượng ổn, xứng đáng với giá tiền.",
    helpful: 22, images: 2, verified: true,
  },
  {
    id: 4, user: "Phạm Văn Đức", avatar: "PĐ", rating: 5,
    date: "2 ngày trước", variant: "Xanh Navy · Size 42",
    comment: "Đôi thứ 3 mình mua của Biti's Hunter rồi. Lần này màu navy đẹp hơn hẳn. Công nghệ đế 2026 êm hơn phiên bản cũ nhiều.",
    helpful: 67, images: 4, verified: false,
  },
];

const RELATED: RelatedProduct[] = [
  { id: "R1", name: "Biti's Hunter Lite Go 188g",         image: "🏃", price: 379000, originalPrice: 549000, rating: 4.8, soldCount: 16500, brand: "Biti's Hunter" },
  { id: "R2", name: "Nike Air Max 270 Nam",                image: "👟", price: 2190000,originalPrice: 3490000,rating: 4.9, soldCount: 12300, brand: "Nike VN"        },
  { id: "R3", name: "Adidas Ultra Boost 23",               image: "⚡", price: 2890000,originalPrice: 4200000,rating: 4.8, soldCount: 7300,  brand: "Adidas VN"      },
  { id: "R4", name: "Vans Old Skool Classic",              image: "🖤", price: 1450000,originalPrice: 1750000,rating: 4.8, soldCount: 28000, brand: "Vans VN"        },
  { id: "R5", name: "Converse Chuck Taylor All Star",      image: "⭐", price: 1290000,originalPrice: 1590000,rating: 4.7, soldCount: 21000, brand: "Converse VN"    },
];

const PLATFORM_CFG: Record<Platform,{label:string;cls:string}> = {
  shopee: { label:"Shopee", cls:"bg-orange-50 text-orange-700 border-orange-200" },
  lazada: { label:"Lazada", cls:"bg-pink-50 text-pink-700 border-pink-200"       },
  tiki:   { label:"Tiki",   cls:"bg-blue-50 text-blue-700 border-blue-200"       },
  sendo:  { label:"Sendo",  cls:"bg-green-50 text-green-700 border-green-200"    },
};

const AVATAR_COLORS: Record<string,string> = {
  NL:"bg-pink-100 text-pink-800", TK:"bg-blue-100 text-blue-800",
  LH:"bg-emerald-100 text-emerald-800", PĐ:"bg-orange-100 text-orange-800",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtPrice(n:number){ return new Intl.NumberFormat("vi-VN").format(n)+"₫"; }
function fmtNum(n:number){ return n>=1000?(n/1000).toFixed(0)+"K":String(n); }
function discPct(o:number,s:number){ return Math.round(((o-s)/o)*100); }

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRow({rating,size=12}:{rating:number;size?:number}){
  return(
    <span className="inline-flex gap-0.5">
      {[1,2,3,4,5].map(s=>(
        <Star key={s} size={size} className={s<=Math.round(rating)?"fill-amber-400 text-amber-400":"fill-gray-200 text-gray-200"}/>
      ))}
    </span>
  );
}

function Countdown({mins}:{mins:number}){
  const h=Math.floor(mins/60), m=mins%60;
  return(
    <span className="inline-flex items-center gap-0.5 font-mono font-bold text-white">
      {[h,m,47].map((v,i)=>(
        <span key={i} className="flex items-center gap-0.5">
          <span className="bg-white/20 text-white text-[11px] px-1.5 py-0.5 rounded-md min-w-[22px] text-center">
            {String(v).padStart(2,"0")}
          </span>
          {i<2&&<span className="text-white/80 text-[11px]">:</span>}
        </span>
      ))}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const [activeImage,    setActiveImage]   = useState(0);
  const [selectedColor,  setSelectedColor] = useState(PRODUCT.colorVariants[0].id);
  const [selectedSize,   setSelectedSize]  = useState<string | null>(null);
  const [qty,            setQty]           = useState(1);
  const [liked,          setLiked]         = useState(false);
  const [showAllDesc,    setShowAllDesc]   = useState(false);
  const [showAllSpecs,   setShowAllSpecs]  = useState(false);
  const [copiedCode,     setCopiedCode]    = useState<string|null>(null);
  const [activeReviewTab,setReviewTab]     = useState<"all"|"5"|"4"|"3"|"photo">("all");
  const [addedToCart,    setAddedToCart]   = useState(false);
  const [toast,          setToast]         = useState<string|null>(null);

  const disc = discPct(PRODUCT.originalPrice, PRODUCT.price);
  const plt  = PLATFORM_CFG[PRODUCT.platform];
  const colorVar = PRODUCT.colorVariants.find(v=>v.id===selectedColor)!;
  const finalPrice = PRODUCT.price + (colorVar?.priceAdjust ?? 0);
  const sizeVar = PRODUCT.sizeVariants.find(v=>v.id===selectedSize);
  const canAddCart = selectedSize !== null && (sizeVar?.stock ?? 0) > 0;

  function showToast(msg:string){ setToast(msg); setTimeout(()=>setToast(null),2500); }

  function handleAddCart(){
    if(!selectedSize){ showToast("Vui lòng chọn size trước!"); return; }
    setAddedToCart(true);
    showToast("Đã thêm vào giỏ hàng ✓");
  }

  function copyCode(code:string){
    setCopiedCode(code);
    showToast(`Đã sao chép mã ${code}`);
    setTimeout(()=>setCopiedCode(null),2000);
  }

  // Rating distribution
  const ratingDist = [5,4,3,2,1].map(s=>({
    star: s,
    count: REVIEWS.filter(r=>r.rating===s).length,
    pct:   Math.round(REVIEWS.filter(r=>r.rating===s).length/REVIEWS.length*100),
  }));

  const filteredReviews = REVIEWS.filter(r=>{
    if(activeReviewTab==="all") return true;
    if(activeReviewTab==="photo") return r.images>0;
    return r.rating===parseInt(activeReviewTab);
  });

  return(
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Toast ── */}
      {toast&&(
        <div className="fixed top-5 right-5 z-50 bg-[#1a1a2e] text-white text-[13px] font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg">
          <CheckCircle2 size={14} className="text-emerald-400"/> {toast}
        </div>
      )}

      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-12 flex items-center gap-1.5 text-[12px] text-gray-400">
          <Home size={11}/><ChevronRight size={10}/>
          <span className="hover:text-gray-600 cursor-pointer">Danh mục</span><ChevronRight size={10}/>
          <span className="hover:text-gray-600 cursor-pointer">{PRODUCT.category}</span><ChevronRight size={10}/>
          <span className="hover:text-gray-600 cursor-pointer">{PRODUCT.brand}</span><ChevronRight size={10}/>
          <span className="text-gray-700 truncate max-w-[240px]">{PRODUCT.name}</span>
          <div className="flex-1"/>
          <button className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 transition-colors">
            <Share2 size={13}/> Chia sẻ
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-5">

        {/* ── Flash sale banner ── */}
        {PRODUCT.isFlash && (
          <div className="flex items-center gap-3 bg-[#1a1a2e] text-white rounded-xl px-5 py-3 mb-5">
            <Zap size={16} className="fill-yellow-400 text-yellow-400 shrink-0"/>
            <span className="text-[13px] font-semibold">Flash Sale đang diễn ra – Kết thúc sau</span>
            <Countdown mins={PRODUCT.flashEndMins}/>
            <div className="ml-auto flex items-center gap-2 text-[11px] text-white/60">
              <Eye size={11}/> {fmtNum(PRODUCT.viewCount)} người đang xem
            </div>
          </div>
        )}

        {/* ── Main product section ── */}
        <div className="grid grid-cols-[420px_1fr] gap-6 mb-6">

          {/* Left: images */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="relative bg-white rounded-2xl border border-gray-100 h-80 flex items-center justify-center text-[80px] overflow-hidden">
              {PRODUCT.images[activeImage]}
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {disc>0&&<span className="text-[11px] bg-red-500 text-white px-2 py-1 rounded-lg font-bold">-{disc}%</span>}
                {PRODUCT.isHot&&<span className="text-[11px] bg-orange-500 text-white px-2 py-1 rounded-lg flex items-center gap-1 font-medium"><Flame size={9}/>Hot</span>}
              </div>
              {/* Auth badge */}
              {PRODUCT.isAuthentic&&(
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 border border-blue-200 rounded-lg px-2.5 py-1.5 text-[10px] text-blue-700 font-medium">
                  <Shield size={11}/> Hàng chính hãng
                </div>
              )}
              {/* Wishlist */}
              <button onClick={()=>setLiked(v=>!v)}
                className={cn("absolute top-3 right-3 w-9 h-9 rounded-xl border flex items-center justify-center transition-all",
                  liked?"bg-red-50 border-red-200 text-red-500":"bg-white border-gray-200 text-gray-400 hover:text-red-400")}>
                <Heart size={16} className={liked?"fill-red-500":""}/>
              </button>
            </div>
            {/* Thumbnails */}
            <div className="flex gap-2">
              {PRODUCT.images.map((img,i)=>(
                <button key={i} onClick={()=>setActiveImage(i)}
                  className={cn("w-14 h-14 rounded-xl border flex items-center justify-center text-2xl transition-all",
                    activeImage===i?"border-[#1a1a2e] bg-[#1a1a2e]/5":"border-gray-100 bg-white hover:border-gray-200")}>
                  {img}
                </button>
              ))}
            </div>
            {/* Platform + SKU */}
            <div className="flex items-center gap-2">
              <span className={cn("text-[11px] px-2.5 py-1 rounded-lg border font-medium",plt.cls)}>
                {plt.label}
              </span>
              <span className="text-[11px] text-gray-400 font-mono">SKU: {PRODUCT.sku}</span>
              <button className="ml-auto text-[11px] text-blue-600 hover:underline flex items-center gap-1">
                <ExternalLink size={11}/> Xem trên {plt.label}
              </button>
            </div>
          </div>

          {/* Right: product info */}
          <div className="space-y-4">
            {/* Name + brand */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[12px] text-gray-500">{PRODUCT.brandEmoji} {PRODUCT.brand}</span>
                {PRODUCT.isAuthentic&&<span className="text-[10px] text-blue-600 flex items-center gap-0.5"><CheckCircle2 size={10}/>Đã xác minh</span>}
              </div>
              <h1 className="text-[18px] font-bold text-gray-900 leading-snug mb-2">{PRODUCT.name}</h1>
              {/* Stats row */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <StarRow rating={PRODUCT.rating} size={13}/>
                  <span className="text-[12px] font-semibold text-amber-600">{PRODUCT.rating}</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-[12px] text-gray-500">{PRODUCT.reviewCount.toLocaleString()} đánh giá</span>
                <span className="text-gray-300">|</span>
                <span className="text-[12px] text-gray-500">{fmtNum(PRODUCT.soldCount)} đã bán</span>
                <span className="text-gray-300">|</span>
                <span className="text-[12px] text-gray-500 flex items-center gap-1"><Eye size={11}/>{fmtNum(PRODUCT.viewCount)} lượt xem</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-baseline gap-2.5 mb-1">
                <span className="text-[28px] font-bold text-red-600 leading-none">{fmtPrice(finalPrice)}</span>
                <span className="text-[15px] text-gray-400 line-through">{fmtPrice(PRODUCT.originalPrice)}</span>
                <span className="text-[12px] font-semibold bg-red-500 text-white px-2 py-0.5 rounded-lg">-{disc}%</span>
              </div>
              <div className="flex items-center gap-3">
                {PRODUCT.isFreeShip&&<span className="text-[11px] text-emerald-600 flex items-center gap-1"><Truck size={10}/>Free ship toàn quốc</span>}
                <span className="text-[11px] text-amber-600 flex items-center gap-1"><Gift size={10}/>+{Math.floor(finalPrice/10000)} điểm thưởng</span>
              </div>
            </div>

            {/* Vouchers */}
            <div>
              <p className="text-[12px] font-semibold text-gray-700 mb-2 flex items-center gap-1.5"><Tag size={12} className="text-violet-500"/>Mã ưu đãi</p>
              <div className="flex gap-2 flex-wrap">
                {PRODUCT.vouchers.map(v=>(
                  <div key={v.code} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px]",v.cls)}>
                    <span className="font-mono font-semibold">{v.code}</span>
                    <span className="opacity-70">·</span>
                    <span>{v.label}</span>
                    <span className="opacity-50">·</span>
                    <span className="opacity-70">{v.expiry}</span>
                    <button onClick={()=>copyCode(v.code)} className="ml-0.5 hover:opacity-70 transition-opacity">
                      {copiedCode===v.code?<CheckCircle2 size={11}/>:<Copy size={10}/>}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Color selector */}
            <div>
              <p className="text-[12px] font-semibold text-gray-700 mb-2">
                Màu sắc: <span className="font-normal text-gray-500">{colorVar.label}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {PRODUCT.colorVariants.map(v=>(
                  <button key={v.id} onClick={()=>v.stock>0&&setSelectedColor(v.id)}
                    className={cn("relative w-9 h-9 rounded-xl border-2 transition-all flex items-center justify-center",
                      selectedColor===v.id?"border-[#1a1a2e] ring-2 ring-[#1a1a2e]/20":"border-gray-200 hover:border-gray-400",
                      v.stock===0?"opacity-40 cursor-not-allowed":"cursor-pointer")}
                    style={{background:v.colorHex}}
                    title={v.label}>
                    {v.stock===0&&<X size={14} className="text-white drop-shadow-sm"/>}
                  </button>
                ))}
              </div>
              {colorVar.priceAdjust>0&&(
                <p className="text-[11px] text-amber-600 mt-1">+{fmtPrice(colorVar.priceAdjust)} cho màu này</p>
              )}
            </div>

            {/* Size selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[12px] font-semibold text-gray-700">
                  Size: <span className="font-normal text-gray-500">{selectedSize?PRODUCT.sizeVariants.find(v=>v.id===selectedSize)?.label:"Chưa chọn"}</span>
                </p>
                <button className="text-[11px] text-blue-600 hover:underline flex items-center gap-1">
                  <Layers size={10}/> Hướng dẫn chọn size
                </button>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {PRODUCT.sizeVariants.map(v=>(
                  <button key={v.id} onClick={()=>v.stock>0&&setSelectedSize(v.id)}
                    className={cn(
                      "w-11 h-11 rounded-xl border text-[13px] font-medium transition-all relative",
                      selectedSize===v.id?"bg-[#1a1a2e] text-white border-[#1a1a2e]":
                      v.stock===0?"bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed":
                      "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                    )}>
                    {v.label}
                    {v.stock>0&&v.stock<=5&&(
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center font-bold">
                        {v.stock}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {!selectedSize&&<p className="text-[11px] text-amber-600 mt-1.5 flex items-center gap-1"><AlertTriangle size={10}/>Vui lòng chọn size để thêm vào giỏ</p>}
            </div>

            {/* Quantity + CTA */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={()=>setQty(q=>Math.max(1,q-1))}
                  className="w-10 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors border-r border-gray-200">
                  <Minus size={14}/>
                </button>
                <span className="w-12 h-11 flex items-center justify-center text-[14px] font-semibold text-gray-900">{qty}</span>
                <button onClick={()=>setQty(q=>q+1)}
                  className="w-10 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors border-l border-gray-200">
                  <Plus size={14}/>
                </button>
              </div>
              <Button onClick={handleAddCart}
                className={cn("flex-1 h-11 text-[13px] font-semibold gap-2 rounded-xl transition-all",
                  addedToCart?"bg-emerald-600 hover:bg-emerald-700":"bg-[#1a1a2e] hover:bg-[#2d2d4a]")}>
                <ShoppingCart size={15}/>
                {addedToCart?"Đã thêm vào giỏ":"Thêm vào giỏ hàng"}
              </Button>
              <Button className="h-11 px-5 bg-red-600 hover:bg-red-700 text-white text-[13px] font-semibold gap-2 rounded-xl">
                Mua ngay
              </Button>
            </div>

            {/* Delivery & policy quick info */}
            <div className="grid grid-cols-3 gap-2">
              {[
                {icon:Truck,    label:"Giao toàn quốc", sub:"2–4 ngày"},
                {icon:RotateCcw,label:"Đổi trả 30 ngày",sub:"Không điều kiện"},
                {icon:Shield,   label:"Bảo hành "+PRODUCT.warranty, sub:"Chính hãng"},
              ].map(({icon:Icon,label,sub})=>(
                <div key={label} className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-gray-100">
                  <Icon size={14} className="text-gray-400 shrink-0"/>
                  <div>
                    <p className="text-[11px] font-medium text-gray-800 leading-tight">{label}</p>
                    <p className="text-[10px] text-gray-400">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Store + Specs + Description ── */}
        <div className="grid grid-cols-[1fr_300px] gap-5 mb-6">

          {/* Left: description + specs */}
          <div className="space-y-4">

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="text-[15px] font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package size={15} className="text-gray-400"/> Mô tả sản phẩm
              </h2>
              <div className={cn("text-[13px] text-gray-600 leading-relaxed space-y-2 whitespace-pre-line",
                !showAllDesc&&"line-clamp-6")}>
                {PRODUCT.description}
              </div>
              <button onClick={()=>setShowAllDesc(v=>!v)}
                className="mt-2 flex items-center gap-1 text-[12px] text-blue-600 hover:underline">
                {showAllDesc?<><ChevronUp size={12}/>Thu gọn</>:<><ChevronDown size={12}/>Xem thêm mô tả</>}
              </button>
            </div>

            {/* Specs */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="text-[15px] font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Layers size={15} className="text-gray-400"/> Thông số kỹ thuật
              </h2>
              <div className="space-y-0">
                {(showAllSpecs?PRODUCT.specs:PRODUCT.specs.slice(0,6)).map((spec,i)=>(
                  <div key={spec.label} className={cn("flex items-start gap-3 py-2.5",
                    i<(showAllSpecs?PRODUCT.specs.length:6)-1?"border-b border-gray-50":"")}>
                    <span className="text-[12px] text-gray-400 w-32 shrink-0">{spec.label}</span>
                    <span className="text-[12px] font-medium text-gray-800 flex-1">{spec.value}</span>
                  </div>
                ))}
              </div>
              {PRODUCT.specs.length>6&&(
                <button onClick={()=>setShowAllSpecs(v=>!v)}
                  className="mt-2 flex items-center gap-1 text-[12px] text-blue-600 hover:underline">
                  {showAllSpecs?<><ChevronUp size={12}/>Thu gọn</>:<><ChevronDown size={12}/>Xem {PRODUCT.specs.length-6} thông số khác</>}
                </button>
              )}
            </div>
          </div>

          {/* Right: store info */}
          <div className="space-y-3">
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <h3 className="text-[13px] font-semibold text-gray-900 mb-3">Thông tin gian hàng</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-[#1a1a2e] flex items-center justify-center text-white text-[14px] font-bold shrink-0">
                  {PRODUCT.storeInfo.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[13px] font-semibold text-gray-900 truncate">{PRODUCT.storeInfo.name}</p>
                    {PRODUCT.storeInfo.verified&&<CheckCircle2 size={13} className="text-blue-500 shrink-0"/>}
                  </div>
                  <p className="text-[11px] text-gray-400">{fmtNum(PRODUCT.storeInfo.followers)} người theo dõi</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  {label:"Đánh giá",  value:PRODUCT.storeInfo.rating+"⭐"},
                  {label:"Sản phẩm",  value:PRODUCT.storeInfo.products},
                  {label:"Phản hồi",  value:PRODUCT.storeInfo.responseRate+"%"},
                  {label:"Tg phản hồi",value:PRODUCT.storeInfo.responseTime},
                ].map(({label,value})=>(
                  <div key={label} className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-[12px] font-semibold text-gray-800">{value}</p>
                    <p className="text-[10px] text-gray-400">{label}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="flex-1 h-8 text-[12px] font-medium border border-gray-200 rounded-lg flex items-center justify-center gap-1.5 text-gray-600 hover:bg-gray-50 transition-colors">
                  <MessageSquare size={12}/> Chat
                </button>
                <button className="flex-1 h-8 text-[12px] font-medium border border-gray-200 rounded-lg flex items-center justify-center gap-1.5 text-gray-600 hover:bg-gray-50 transition-colors">
                  <Package size={12}/> Xem shop
                </button>
              </div>
            </div>

            {/* Delivery estimate */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2.5">
              <h3 className="text-[13px] font-semibold text-gray-900">Thời gian giao hàng</h3>
              {[
                {icon:Truck,  label:"Nội thành HN/HCM",val:"1–2 ngày",color:"text-emerald-600"},
                {icon:MapPin, label:"Các tỉnh khác",    val:"3–5 ngày",color:"text-blue-600"},
                {icon:Clock,  label:"Giao hoả tốc",     val:"Trong ngày",color:"text-amber-600"},
              ].map(({icon:Icon,label,val,color})=>(
                <div key={label} className="flex items-center justify-between text-[12px]">
                  <span className="flex items-center gap-1.5 text-gray-600"><Icon size={12} className="text-gray-400"/>{label}</span>
                  <span className={cn("font-semibold",color)}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Reviews section ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-gray-900">Đánh giá sản phẩm</h2>
            <span className="text-[12px] text-gray-400">{PRODUCT.reviewCount.toLocaleString()} đánh giá</span>
          </div>

          {/* Rating summary */}
          <div className="flex items-start gap-8 mb-5 pb-5 border-b border-gray-100">
            <div className="text-center shrink-0">
              <p className="text-5xl font-bold text-gray-900">{PRODUCT.rating}</p>
              <StarRow rating={PRODUCT.rating} size={16}/>
              <p className="text-[11px] text-gray-400 mt-1">{PRODUCT.reviewCount.toLocaleString()} đánh giá</p>
            </div>
            <div className="flex-1 space-y-2">
              {ratingDist.map(({star,count,pct})=>(
                <div key={star} className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-500 w-3">{star}</span>
                  <Star size={10} className="fill-amber-400 text-amber-400 shrink-0"/>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full",star>=4?"bg-emerald-400":star===3?"bg-amber-400":"bg-red-400")}
                      style={{width:`${pct}%`}}/>
                  </div>
                  <span className="text-[11px] text-gray-400 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
            <div className="text-center shrink-0 space-y-2">
              <div className="p-3 bg-emerald-50 rounded-xl min-w-[90px]">
                <p className="text-[16px] font-bold text-emerald-700">98%</p>
                <p className="text-[10px] text-emerald-600">Hài lòng</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <p className="text-[16px] font-bold text-blue-700">92%</p>
                <p className="text-[10px] text-blue-600">Đúng mô tả</p>
              </div>
            </div>
          </div>

          {/* Review filter tabs */}
          <div className="flex gap-1.5 flex-wrap mb-4">
            {[
              {key:"all",   label:"Tất cả",   count:REVIEWS.length},
              {key:"5",     label:"5 ⭐",      count:REVIEWS.filter(r=>r.rating===5).length},
              {key:"4",     label:"4 ⭐",      count:REVIEWS.filter(r=>r.rating===4).length},
              {key:"3",     label:"3 ⭐",      count:REVIEWS.filter(r=>r.rating===3).length},
              {key:"photo", label:"Có hình",   count:REVIEWS.filter(r=>r.images>0).length},
            ].map(({key,label,count})=>(
              <button key={key} onClick={()=>setReviewTab(key as typeof activeReviewTab)}
                className={cn("px-3 py-1.5 rounded-full text-[12px] border transition-all",
                  activeReviewTab===key?"bg-[#1a1a2e] text-white border-[#1a1a2e]":"text-gray-500 border-gray-200 hover:border-gray-300")}>
                {label} ({count})
              </button>
            ))}
          </div>

          {/* Review list */}
          <div className="space-y-4">
            {filteredReviews.map(r=>{
              const ac=AVATAR_COLORS[r.avatar]??"bg-gray-100 text-gray-600";
              return(
                <div key={r.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0",ac)}>
                      {r.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[13px] font-semibold text-gray-900">{r.user}</p>
                        {r.verified&&<span className="text-[10px] text-emerald-600 flex items-center gap-0.5"><CheckCircle2 size={10}/>Đã mua</span>}
                        <span className="text-[11px] text-gray-400 ml-auto">{r.date}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <StarRow rating={r.rating} size={11}/>
                        <span className="text-[11px] text-gray-400">| {r.variant}</span>
                      </div>
                      <p className="text-[13px] text-gray-700 leading-relaxed mb-2">{r.comment}</p>
                      <div className="flex items-center gap-3 text-[11px] text-gray-400">
                        {r.images>0&&<span className="flex items-center gap-1 text-blue-500 cursor-pointer hover:underline"><ImageIcon size={10}/>{r.images} ảnh</span>}
                        <button className="flex items-center gap-1 hover:text-gray-600"><ThumbsUp size={10}/> Hữu ích ({r.helpful})</button>
                      </div>
                      {/* Brand reply */}
                      {r.brandReply&&(
                        <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-3">
                          <p className="text-[11px] font-semibold text-gray-700 mb-1 flex items-center gap-1">
                            {PRODUCT.brandEmoji} Phản hồi từ {PRODUCT.brand}
                          </p>
                          <p className="text-[12px] text-gray-600">{r.brandReply}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="mt-4 w-full flex items-center justify-center gap-1.5 text-[12px] font-medium border border-gray-200 rounded-xl py-3 text-gray-600 hover:bg-gray-50 transition-colors">
            Xem thêm đánh giá <ChevronDown size={13}/>
          </button>
        </div>

        {/* ── Related products ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles size={15} className="text-violet-500"/> Sản phẩm liên quan
            </h2>
            <button className="text-[12px] text-blue-600 hover:underline flex items-center gap-1">
              Xem tất cả <ChevronRight size={12}/>
            </button>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {RELATED.map(p=>{
              const d=discPct(p.originalPrice,p.price);
              return(
                <div key={p.id} className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer p-3">
                  <div className="relative h-28 bg-gray-50 rounded-lg flex items-center justify-center text-4xl mb-2">
                    {p.image}
                    {d>0&&<span className="absolute top-1.5 left-1.5 text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">-{d}%</span>}
                  </div>
                  <p className="text-[11px] text-gray-400 mb-0.5">{p.brand}</p>
                  <p className="text-[12px] font-medium text-gray-900 line-clamp-2 leading-tight mb-1.5">{p.name}</p>
                  <div className="flex items-center gap-1 mb-1.5">
                    <StarRow rating={p.rating} size={9}/>
                    <span className="text-[9px] text-gray-400">({fmtNum(p.soldCount)})</span>
                  </div>
                  <p className="text-[13px] font-bold text-red-600">{fmtPrice(p.price)}</p>
                  {d>0&&<p className="text-[10px] text-gray-400 line-through">{fmtPrice(p.originalPrice)}</p>}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── Sticky bottom bar (mobile-style) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[12px] text-gray-500 truncate">{PRODUCT.name}</p>
          <p className="text-[16px] font-bold text-red-600">{fmtPrice(finalPrice)}</p>
        </div>
        <button onClick={()=>setLiked(v=>!v)}
          className={cn("w-10 h-10 rounded-xl border flex items-center justify-center transition-all shrink-0",
            liked?"border-red-200 bg-red-50 text-red-500":"border-gray-200 text-gray-500 hover:text-red-400")}>
          <Heart size={16} className={liked?"fill-red-500":""}/>
        </button>
        <Button onClick={handleAddCart}
          className="h-10 px-5 bg-[#1a1a2e] hover:bg-[#2d2d4a] text-white text-[13px] font-semibold gap-1.5 rounded-xl shrink-0">
          <ShoppingCart size={14}/> Thêm giỏ
        </Button>
        <Button className="h-10 px-5 bg-red-600 hover:bg-red-700 text-white text-[13px] font-semibold rounded-xl shrink-0">
          Mua ngay
        </Button>
      </div>
      <div className="h-20"/>
    </div>
  );
}