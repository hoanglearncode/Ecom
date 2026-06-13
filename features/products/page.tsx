"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/features/products/api";
import type { Product as APIProduct } from "@/features/products/types";
import {
  Search, Star, Heart, ShoppingCart, SlidersHorizontal,
  ChevronRight, ChevronDown, ChevronUp, X, Plus, Minus,
  Grid2x2, LayoutGrid, List, Filter, Zap, Flame, Sparkles,
  Tag, Truck, Shield, RotateCcw, ArrowUpDown, Eye,
  CheckCircle2, TrendingUp, Package, BadgePercent,
  MapPin, Clock, ArrowRight, Home, Layers,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type SortKey    = "popular" | "newest" | "price_asc" | "price_desc" | "discount" | "rating";
type ViewMode   = "grid4" | "grid3" | "list";
type Platform   = "shopee" | "lazada" | "tiki" | "sendo";

interface Product {
  id: string;
  name: string;
  image: string;
  brand: string;
  brandEmoji: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  stock: number;
  isNew: boolean;
  isHot: boolean;
  isSale: boolean;
  isFlash: boolean;
  isFreeShip: boolean;
  isAuthentic: boolean;
  platform: Platform;
  colors: string[];
  sizes?: string[];
  tags: string[];
  description: string;
  flashEndMins?: number;
}

interface FilterState {
  priceMin: number | null;
  priceMax: number | null;
  rating:   number | null;
  brands:   Set<string>;
  platforms: Set<Platform>;
  tags:     Set<string>;
  freeShip: boolean;
  authentic: boolean;
  onSale:   boolean;
}

// ─── Adapter ─────────────────────────────────────────────────────────────────

function adaptProduct(p: APIProduct): Product {
  const isSale = !!p.compareAtPrice && p.compareAtPrice > p.price;
  return {
    id: p.id,
    name: p.name,
    image: p.thumbnail ?? "📦",
    brand: p.brand ?? "—",
    brandEmoji: "🏷️",
    category: p.categoryName ?? p.categorySlug ?? "Khác",
    price: p.price,
    originalPrice: p.compareAtPrice ?? p.price,
    rating: p.rating ?? 4.5,
    reviewCount: p.reviewCount ?? 0,
    soldCount: 0,
    stock: p.stock ?? 0,
    isNew: false,
    isHot: (p.rating ?? 0) >= 4.8 && (p.reviewCount ?? 0) > 1000,
    isSale,
    isFlash: false,
    isFreeShip: false,
    isAuthentic: true,
    platform: "shopee",
    colors: p.color ? [p.color] : [],
    sizes: [],
    tags: p.tags ?? [],
    description: p.description ?? "",
  };
}
const PLATFORMS: Platform[] = ["shopee","lazada","tiki","sendo"];

const PLATFORM_CFG: Record<Platform,{label:string;cls:string}> = {
  shopee: { label:"Shopee", cls:"bg-orange-50 text-orange-700 border-orange-200" },
  lazada: { label:"Lazada", cls:"bg-pink-50 text-pink-700 border-pink-200"       },
  tiki:   { label:"Tiki",   cls:"bg-blue-50 text-blue-700 border-blue-200"       },
  sendo:  { label:"Sendo",  cls:"bg-green-50 text-green-700 border-green-200"    },
};

const PRICE_RANGES = [
  { label: "Dưới 300k",          min: 0,       max: 300000  },
  { label: "300k – 1 triệu",     min: 300000,  max: 1000000 },
  { label: "1 – 3 triệu",        min: 1000000, max: 3000000 },
  { label: "Trên 3 triệu",       min: 3000000, max: Infinity},
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtPrice(n:number){ return new Intl.NumberFormat("vi-VN").format(n)+"₫"; }
function fmtSold(n:number){ return n>=1000?(n/1000).toFixed(0)+"K":String(n); }
function discPct(o:number,s:number){ return Math.round(((o-s)/o)*100); }

function ProductImg({ src, alt, cls }: { src: string; alt: string; cls?: string }) {
  if (src.startsWith("http") || src.startsWith("/")) {
    return <img src={src} alt={alt} className={cn("object-cover w-full h-full", cls)} />;
  }
  return <span>{src}</span>;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRow({rating,size=11}:{rating:number;size?:number}){
  return(
    <span className="inline-flex gap-0.5">
      {[1,2,3,4,5].map(s=>(
        <Star key={s} size={size} className={s<=Math.round(rating)?"fill-amber-400 text-amber-400":"fill-gray-200 text-gray-200"}/>
      ))}
    </span>
  );
}

function FilterSection({title,open,onToggle,children}:{title:string;open:boolean;onToggle:()=>void;children:React.ReactNode}){
  return(
    <div className="border-b border-gray-100 last:border-0">
      <button onClick={onToggle} className="w-full flex items-center justify-between py-3 text-left hover:text-gray-900 transition-colors">
        <span className="text-[13px] font-semibold text-gray-800">{title}</span>
        {open?<ChevronUp size={14} className="text-gray-400"/>:<ChevronDown size={14} className="text-gray-400"/>}
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}

// Grid card (4-col / 3-col)
function ProductGridCard({product,wishlist,onWishlist}:{product:Product;wishlist:Set<string>;onWishlist:(id:string)=>void}){
  const [qty,setQty]=useState(0);
  const liked=wishlist.has(product.id);
  const disc=discPct(product.originalPrice,product.price);
  const plt=PLATFORM_CFG[product.platform];

  return(
    <Link href={`/products/${product.id}`} className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer group overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative bg-gray-50 h-44 flex items-center justify-center text-5xl shrink-0 overflow-hidden">
        <ProductImg src={product.image} alt={product.name} />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {disc>0 && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-md font-semibold">-{disc}%</span>}
          {product.isFlash && <span className="text-[10px] bg-[#1a1a2e] text-white px-1.5 py-0.5 rounded-md flex items-center gap-0.5 font-medium"><Zap size={8} className="fill-yellow-400 text-yellow-400"/>Flash</span>}
          {product.isNew   && <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-md font-medium">Mới</span>}
          {product.isHot   && !product.isFlash && <span className="text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded-md flex items-center gap-0.5 font-medium"><Flame size={8}/>Hot</span>}
        </div>
        {/* Wishlist */}
        <button onClick={e=>{e.stopPropagation();onWishlist(product.id);}}
          className={cn("absolute top-2 right-2 w-7 h-7 rounded-full border flex items-center justify-center transition-all",
            liked?"border-red-200 bg-red-50 text-red-500":"border-gray-200 bg-white text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-400")}>
          <Heart size={12} className={liked?"fill-red-500":""}/>
        </button>
        {/* Platform */}
        <span className={cn("absolute bottom-2 left-2 text-[9px] px-1.5 py-0.5 rounded border font-medium",plt.cls)}>
          {plt.label}
        </span>
        {/* Authentic */}
        {product.isAuthentic && (
          <span className="absolute bottom-2 right-2 text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200 font-medium flex items-center gap-0.5">
            <Shield size={8}/>Auth
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <p className="text-[11px] text-gray-400 mb-0.5 flex items-center gap-1">{product.brandEmoji} {product.brand}</p>
        <p className="text-[13px] font-medium text-gray-900 line-clamp-2 leading-tight mb-2 flex-1">{product.name}</p>

        {/* Stars + sold */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <StarRow rating={product.rating}/>
          <span className="text-[10px] text-gray-400">{product.rating}</span>
          <span className="text-[10px] text-gray-300">·</span>
          <span className="text-[10px] text-gray-400">Đã bán {fmtSold(product.soldCount)}</span>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-1 mb-2">
          {product.colors.slice(0,4).map((c,i)=>(
            <span key={i} style={{background:c,width:10,height:10,borderRadius:"50%",border:"1.5px solid #e5e7eb",display:"inline-block",flexShrink:0}}/>
          ))}
          {product.colors.length>4&&<span className="text-[10px] text-gray-400">+{product.colors.length-4}</span>}
        </div>

        {/* Free ship tag */}
        {product.isFreeShip && (
          <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 mb-1.5"><Truck size={9}/>Free ship</span>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-2.5">
          <span className="text-[15px] font-bold text-red-600">{fmtPrice(product.price)}</span>
          {product.isSale&&<span className="text-[11px] text-gray-400 line-through">{fmtPrice(product.originalPrice)}</span>}
        </div>

        {/* Low stock */}
        {product.stock<=15 && product.stock>0 && (
          <p className="text-[10px] text-red-600 mb-2 flex items-center gap-0.5"><Zap size={9}/>Còn {product.stock} sp</p>
        )}

        {qty===0?(
          <Button size="sm" onClick={e=>{e.stopPropagation();setQty(1);}}
            className="w-full h-8 bg-[#1a1a2e] hover:bg-[#2d2d4a] text-white text-[12px] gap-1.5 rounded-xl">
            <ShoppingCart size={12}/>Thêm vào giỏ
          </Button>
        ):(
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-2 py-1.5 border border-gray-100">
            <button onClick={e=>{e.stopPropagation();setQty(Math.max(0,qty-1));}}
              className="w-6 h-6 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-100"><Minus size={10}/></button>
            <span className="text-[13px] font-semibold text-gray-900">{qty}</span>
            <button onClick={e=>{e.stopPropagation();setQty(qty+1);}}
              className="w-6 h-6 rounded-md bg-[#1a1a2e] flex items-center justify-center text-white hover:bg-[#2d2d4a]"><Plus size={10}/></button>
          </div>
        )}
      </div>
    </Link>
  );
}

// List row
function ProductListRow({product,wishlist,onWishlist}:{product:Product;wishlist:Set<string>;onWishlist:(id:string)=>void}){
  const liked=wishlist.has(product.id);
  const disc=discPct(product.originalPrice,product.price);
  const plt=PLATFORM_CFG[product.platform];

  return(
    <Link href={`/products/${product.id}`} className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer flex items-center gap-4 p-3.5 group">
      {/* Image */}
      <div className="relative w-20 h-20 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-3xl shrink-0 overflow-hidden">
        <ProductImg src={product.image} alt={product.name} />
        {disc>0&&<span className="absolute -top-1.5 -right-1.5 text-[9px] bg-red-500 text-white px-1 py-0.5 rounded font-bold">-{disc}%</span>}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <p className="text-[13px] font-medium text-gray-900 line-clamp-1 flex-1">{product.name}</p>
          <div className="flex gap-1 shrink-0">
            {product.isFlash&&<span className="text-[9px] bg-[#1a1a2e] text-white px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5"><Zap size={7}/>Flash</span>}
            {product.isNew&&<span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-medium">Mới</span>}
          </div>
        </div>
        <p className="text-[11px] text-gray-400 mb-1.5">{product.brandEmoji} {product.brand} · {product.category}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1"><StarRow rating={product.rating} size={10}/><span className="text-[10px] text-gray-400">{product.rating} ({product.reviewCount.toLocaleString()})</span></span>
          <span className="text-[10px] text-gray-400">·</span>
          <span className="text-[10px] text-gray-400">Đã bán {fmtSold(product.soldCount)}</span>
          {product.isFreeShip&&<span className="text-[10px] text-emerald-600 flex items-center gap-0.5"><Truck size={9}/>Free ship</span>}
          {product.isAuthentic&&<span className="text-[10px] text-blue-600 flex items-center gap-0.5"><Shield size={9}/>Chính hãng</span>}
          <span className={cn("text-[9px] px-1.5 py-0.5 rounded border font-medium",plt.cls)}>{plt.label}</span>
        </div>
      </div>

      {/* Price */}
      <div className="text-right shrink-0 min-w-[110px]">
        <p className="text-[16px] font-bold text-red-600">{fmtPrice(product.price)}</p>
        {product.isSale&&<p className="text-[11px] text-gray-400 line-through">{fmtPrice(product.originalPrice)}</p>}
        {product.stock<=15&&product.stock>0&&<p className="text-[10px] text-red-600">Còn {product.stock} sp</p>}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1.5 shrink-0">
        <button onClick={e=>{e.preventDefault();onWishlist(product.id);}}
          className={cn("w-8 h-8 rounded-lg border flex items-center justify-center transition-all",
            liked?"border-red-200 bg-red-50 text-red-500":"border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400")}>
          <Heart size={14} className={liked?"fill-red-500":""}/>
        </button>
        <Button size="sm" onClick={e=>e.preventDefault()} className="h-8 w-8 p-0 bg-[#1a1a2e] hover:bg-[#2d2d4a] text-white">
          <ShoppingCart size={13}/>
        </Button>
      </div>
    </Link>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProductListPage() {
  const { data: rawProducts = [] } = useQuery({ queryKey: ["products"], queryFn: getProducts });
  const PRODUCTS = useMemo(() => rawProducts.map(adaptProduct), [rawProducts]);
  const BRANDS = useMemo(() => [...new Set(PRODUCTS.map(p => p.brand))], [PRODUCTS]);

  const [search,      setSearch]      = useState("");
  const [viewMode,    setViewMode]    = useState<ViewMode>("grid4");
  const [sortKey,     setSortKey]     = useState<SortKey>("popular");
  const [wishlist,    setWishlist]    = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["brand","price","platform","features","rating"])
  );

  const [filters, setFilters] = useState<FilterState>({
    priceMin: null, priceMax: null, rating: null,
    brands: new Set(), platforms: new Set(),
    tags: new Set(), freeShip: false, authentic: false, onSale: false,
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 24;

  function toggleWishlist(id:string){
    setWishlist(prev=>{const n=new Set(prev);n.has(id)?n.delete(id):n.add(id);return n;});
  }
  function toggleSection(key:string){
    setExpandedSections(prev=>{const n=new Set(prev);n.has(key)?n.delete(key):n.add(key);return n;});
  }
  function toggleBrand(b:string){
    setFilters(f=>{ const s=new Set(f.brands); s.has(b)?s.delete(b):s.add(b); return{...f,brands:s}; });
  }
  function togglePlatform(p:Platform){
    setFilters(f=>{ const s=new Set(f.platforms); s.has(p)?s.delete(p):s.add(p); return{...f,platforms:s}; });
  }
  function clearFilters(){
    setFilters({priceMin:null,priceMax:null,rating:null,brands:new Set(),platforms:new Set(),tags:new Set(),freeShip:false,authentic:false,onSale:false});
  }

  const hasActiveFilters = filters.brands.size>0||filters.platforms.size>0||
    filters.priceMin!==null||filters.priceMax!==null||
    filters.rating!==null||filters.freeShip||filters.authentic||filters.onSale;

  const filtered = useMemo(()=>{
    return PRODUCTS
      .filter(p=>{
        if(search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.brand.toLowerCase().includes(search.toLowerCase())) return false;
        if(filters.brands.size>0 && !filters.brands.has(p.brand)) return false;
        if(filters.platforms.size>0 && !filters.platforms.has(p.platform)) return false;
        if(filters.priceMin!==null && p.price<filters.priceMin) return false;
        if(filters.priceMax!==null && p.price>filters.priceMax) return false;
        if(filters.rating!==null && p.rating<filters.rating) return false;
        if(filters.freeShip && !p.isFreeShip) return false;
        if(filters.authentic && !p.isAuthentic) return false;
        if(filters.onSale && !p.isSale) return false;
        return true;
      })
      .sort((a,b)=>{
        if(sortKey==="price_asc")  return a.price-b.price;
        if(sortKey==="price_desc") return b.price-a.price;
        if(sortKey==="discount")   return discPct(b.originalPrice,b.price)-discPct(a.originalPrice,a.price);
        if(sortKey==="rating")     return b.rating-a.rating;
        if(sortKey==="newest")     return (b.isNew?1:0)-(a.isNew?1:0);
        return b.soldCount-a.soldCount;
      });
  },[search,filters,sortKey,PRODUCTS]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage, PAGE_SIZE]
  );

  const activeFilterCount = [
    filters.brands.size, filters.platforms.size,
    filters.priceMin!==null?1:0, filters.rating!==null?1:0,
    filters.freeShip?1:0, filters.authentic?1:0, filters.onSale?1:0,
  ].reduce((a,b)=>a+b,0);

  return(
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Page header ── */}
      <div className="bg-[#1a1a2e] text-white">
        <div className="max-w-7xl mx-auto px-6 py-5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[12px] text-white/40 mb-3">
            <Home size={11}/><ChevronRight size={10}/>
            <span>Danh mục</span><ChevronRight size={10}/>
            <span className="text-white/70">Giày dép & Thể thao</span>
          </div>
          <div className="flex items-end justify-between gap-6">
            <div>
              <h1 className="text-xl font-bold text-white mb-1">👟 Giày dép & Thể thao</h1>
              <p className="text-white/50 text-[13px]">{PRODUCTS.length} sản phẩm · Cập nhật liên tục từ các thương hiệu hàng đầu</p>
            </div>
            {/* Search */}
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 w-64">
              <Search size={14} className="text-white/50 shrink-0"/>
              <input
                value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Tìm trong danh mục..."
                className="bg-transparent text-[13px] text-white placeholder:text-white/40 outline-none flex-1"
              />
              {search&&<button onClick={()=>setSearch("")}><X size={11} className="text-white/50 hover:text-white"/></button>}
            </div>
          </div>

          {/* Feature tags row */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
            {[
              {label:"Flash Sale",icon:Zap,   cls:"bg-red-500/20 text-red-300 border-red-500/30"},
              {label:"Hàng mới",  icon:Sparkles,cls:"bg-emerald-500/20 text-emerald-300 border-emerald-500/30"},
              {label:"Best Seller",icon:TrendingUp,cls:"bg-amber-500/20 text-amber-300 border-amber-500/30"},
              {label:"Free Ship",  icon:Truck, cls:"bg-blue-500/20 text-blue-300 border-blue-500/30"},
              {label:"Chính Hãng", icon:Shield,cls:"bg-violet-500/20 text-violet-300 border-violet-500/30"},
            ].map(({label,icon:Icon,cls})=>(
              <span key={label} className={cn("flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg border whitespace-nowrap",cls)}>
                <Icon size={10}/>{label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className={cn("flex gap-5", showFilters?"":"")}>

          {/* ── Sidebar filter ── */}
          {showFilters && (
            <aside className="w-56 shrink-0 space-y-0">
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <span className="text-[13px] font-semibold text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal size={13}/> Lọc sản phẩm
                    {activeFilterCount>0&&<span className="w-5 h-5 rounded-full bg-[#1a1a2e] text-white text-[10px] flex items-center justify-center font-medium">{activeFilterCount}</span>}
                  </span>
                  {hasActiveFilters&&(
                    <button onClick={clearFilters} className="text-[11px] text-red-600 hover:underline">Xoá tất cả</button>
                  )}
                </div>

                <div className="px-4 divide-y divide-gray-50">
                  {/* Brand */}
                  <FilterSection title="Thương hiệu" open={expandedSections.has("brand")} onToggle={()=>toggleSection("brand")}>
                    <div className="space-y-1.5">
                      {BRANDS.map(b=>(
                        <label key={b} className="flex items-center gap-2.5 cursor-pointer group">
                          <div onClick={()=>toggleBrand(b)}
                            className={cn("w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0",
                              filters.brands.has(b)?"bg-[#1a1a2e] border-[#1a1a2e]":"bg-white border-gray-300 group-hover:border-gray-400")}>
                            {filters.brands.has(b)&&<Check size={10} className="text-white"/>}
                          </div>
                          <span className="text-[12px] text-gray-700 flex-1">{b}</span>
                          <span className="text-[10px] text-gray-400">{PRODUCTS.filter(p=>p.brand===b).length}</span>
                        </label>
                      ))}
                    </div>
                  </FilterSection>

                  {/* Price */}
                  <FilterSection title="Khoảng giá" open={expandedSections.has("price")} onToggle={()=>toggleSection("price")}>
                    <div className="space-y-1.5">
                      {PRICE_RANGES.map(({label,min,max})=>{
                        const active=filters.priceMin===min&&filters.priceMax===(max===Infinity?null:max);
                        return(
                          <button key={label} onClick={()=>setFilters(f=>active?{...f,priceMin:null,priceMax:null}:{...f,priceMin:min,priceMax:max===Infinity?null:max})}
                            className={cn("w-full flex items-center gap-2 text-[12px] px-2 py-1.5 rounded-lg transition-all",
                              active?"bg-[#1a1a2e] text-white":"text-gray-600 hover:bg-gray-50")}>
                            <Tag size={10}/>{label}
                          </button>
                        );
                      })}
                    </div>
                    {/* Custom range */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <input placeholder="Từ" className="flex-1 text-[11px] border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-[#1a1a2e]"/>
                      <span className="text-gray-400">–</span>
                      <input placeholder="Đến" className="flex-1 text-[11px] border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-[#1a1a2e]"/>
                    </div>
                  </FilterSection>

                  {/* Platform */}
                  <FilterSection title="Sàn thương mại" open={expandedSections.has("platform")} onToggle={()=>toggleSection("platform")}>
                    <div className="space-y-1.5">
                      {PLATFORMS.map(p=>{
                        const cfg=PLATFORM_CFG[p];
                        const active=filters.platforms.has(p);
                        return(
                          <button key={p} onClick={()=>togglePlatform(p)}
                            className={cn("w-full flex items-center gap-2 text-[12px] px-2 py-1.5 rounded-lg border transition-all",
                              active?cn(cfg.cls,"font-medium"):cn("border-gray-100 text-gray-600 hover:bg-gray-50"))}>
                            <div className={cn("w-2 h-2 rounded-full",active?"bg-current":"bg-gray-300")}/>
                            {cfg.label}
                            <span className="ml-auto text-[10px] opacity-60">{PRODUCTS.filter(pr=>pr.platform===p).length}</span>
                          </button>
                        );
                      })}
                    </div>
                  </FilterSection>

                  {/* Rating */}
                  <FilterSection title="Đánh giá" open={expandedSections.has("rating")} onToggle={()=>toggleSection("rating")}>
                    <div className="space-y-1">
                      {[5,4,3].map(r=>(
                        <button key={r} onClick={()=>setFilters(f=>({...f,rating:f.rating===r?null:r}))}
                          className={cn("w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all",
                            filters.rating===r?"bg-amber-50 border border-amber-200":"hover:bg-gray-50")}>
                          <StarRow rating={r} size={12}/>
                          <span className="text-[11px] text-gray-600">trở lên</span>
                          {filters.rating===r&&<CheckCircle2 size={11} className="ml-auto text-amber-500"/>}
                        </button>
                      ))}
                    </div>
                  </FilterSection>

                  {/* Features */}
                  <FilterSection title="Tính năng" open={expandedSections.has("features")} onToggle={()=>toggleSection("features")}>
                    <div className="space-y-1.5">
                      {[
                        {key:"freeShip",label:"Free ship",    icon:Truck    },
                        {key:"authentic",label:"Chính hãng",  icon:Shield   },
                        {key:"onSale",   label:"Đang giảm giá",icon:BadgePercent},
                      ].map(({key,label,icon:Icon})=>{
                        const active=filters[key as keyof FilterState] as boolean;
                        return(
                          <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                            <div onClick={()=>setFilters(f=>({...f,[key]:!f[key as keyof FilterState]}))}
                              className={cn("w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0",
                                active?"bg-[#1a1a2e] border-[#1a1a2e]":"bg-white border-gray-300 group-hover:border-gray-400")}>
                              {active&&<Check size={10} className="text-white"/>}
                            </div>
                            <Icon size={12} className={active?"text-[#1a1a2e]":"text-gray-400"}/>
                            <span className="text-[12px] text-gray-700">{label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </FilterSection>
                </div>
              </div>
            </aside>
          )}

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Toolbar */}
            <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-3 flex-wrap">
              {/* Toggle filter sidebar */}
              <button onClick={()=>setShowFilters(v=>!v)}
                className={cn("flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg border transition-all",
                  showFilters?"bg-[#1a1a2e] text-white border-[#1a1a2e]":"text-gray-500 border-gray-200 hover:border-gray-300")}>
                <SlidersHorizontal size={12}/> Bộ lọc
                {activeFilterCount>0&&<span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium",showFilters?"bg-white/20 text-white":"bg-red-500 text-white")}>{activeFilterCount}</span>}
              </button>

              {/* Active filter chips */}
              {filters.brands.size>0&&[...filters.brands].map(b=>(
                <span key={b} className="flex items-center gap-1 text-[11px] bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">
                  {b}<button onClick={()=>toggleBrand(b)}><X size={10} className="text-gray-400 hover:text-gray-700"/></button>
                </span>
              ))}
              {filters.freeShip&&<span className="flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-lg">Free ship<button onClick={()=>setFilters(f=>({...f,freeShip:false}))}><X size={10}/></button></span>}
              {filters.onSale&&<span className="flex items-center gap-1 text-[11px] bg-red-50 text-red-700 border border-red-200 px-2 py-1 rounded-lg">Đang giảm<button onClick={()=>setFilters(f=>({...f,onSale:false}))}><X size={10}/></button></span>}
              {hasActiveFilters&&<button onClick={clearFilters} className="text-[11px] text-red-600 hover:underline flex items-center gap-1"><X size={10}/>Xoá lọc</button>}

              {/* Sort */}
              <div className="ml-auto flex items-center gap-2">
                <span className="text-[12px] text-gray-400 hidden md:block">{filtered.length} sản phẩm</span>
                <select value={sortKey} onChange={e=>setSortKey(e.target.value as SortKey)}
                  className="text-[12px] text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white outline-none cursor-pointer">
                  <option value="popular">Phổ biến nhất</option>
                  <option value="newest">Mới nhất</option>
                  <option value="discount">Giảm nhiều nhất</option>
                  <option value="price_asc">Giá thấp → cao</option>
                  <option value="price_desc">Giá cao → thấp</option>
                  <option value="rating">Đánh giá cao</option>
                </select>
                {/* View mode */}
                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  {([
                    ["grid4",LayoutGrid],["grid3",Grid2x2],["list",List],
                  ] as [ViewMode, any][]).map(([mode,Icon])=>(
                    <button key={mode} onClick={()=>setViewMode(mode)}
                      className={cn("w-8 h-8 flex items-center justify-center transition-colors",
                        viewMode===mode?"bg-[#1a1a2e] text-white":"bg-white text-gray-400 hover:bg-gray-50")}>
                      <Icon size={14}/>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Products */}
            {filtered.length>0?(
              viewMode==="list"?(
                <div className="flex flex-col gap-2">
                  {paginated.map(p=>(
                    <ProductListRow key={p.id} product={p} wishlist={wishlist} onWishlist={toggleWishlist}/>
                  ))}
                </div>
              ):(
                <div className={cn(
                  "grid gap-3",
                  viewMode==="grid4"?"grid-cols-2 md:grid-cols-3 lg:grid-cols-4":"grid-cols-2 md:grid-cols-3"
                )}>
                  {paginated.map(p=>(
                    <ProductGridCard key={p.id} product={p} wishlist={wishlist} onWishlist={toggleWishlist}/>
                  ))}
                </div>
              )
            ):(
              <div className="py-24 text-center bg-white rounded-2xl border border-gray-100">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-gray-500 text-[14px] font-medium mb-1">Không tìm thấy sản phẩm phù hợp</p>
                <p className="text-gray-400 text-[12px] mb-4">Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm</p>
                <button onClick={()=>{clearFilters();setSearch("");}}
                  className="text-[13px] text-blue-600 hover:underline">
                  Xem tất cả sản phẩm →
                </button>
              </div>
            )}

            {/* Pagination */}
            {filtered.length>0&&(
              <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3">
                <p className="text-[12px] text-gray-400">
                  Hiển thị <span className="font-medium text-gray-700">{(currentPage-1)*PAGE_SIZE+1}–{Math.min(currentPage*PAGE_SIZE,filtered.length)}</span> / {filtered.length} sản phẩm
                </p>
                {totalPages>1&&(
                  <div className="flex gap-1">
                    <button disabled={currentPage===1} onClick={()=>setPage(p=>Math.max(1,p-1))}
                      className={cn("w-8 h-8 rounded-lg text-[12px] border transition-colors",
                        currentPage===1?"text-gray-300 border-gray-100 cursor-not-allowed":"text-gray-500 border-gray-200 hover:bg-gray-50")}>←</button>
                    {Array.from({length:Math.min(5,totalPages)},((_,i)=>{
                      let pg:number;
                      if(totalPages<=5) pg=i+1;
                      else if(currentPage<=3) pg=i+1;
                      else if(currentPage>=totalPages-2) pg=totalPages-4+i;
                      else pg=currentPage-2+i;
                      return(
                        <button key={pg} onClick={()=>setPage(pg)}
                          className={cn("w-8 h-8 rounded-lg text-[12px] border transition-colors",
                            pg===currentPage?"bg-[#1a1a2e] text-white border-[#1a1a2e]":"text-gray-500 border-gray-200 hover:bg-gray-50")}>
                          {pg}
                        </button>
                      );
                    }))}
                    <button disabled={currentPage===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}
                      className={cn("w-8 h-8 rounded-lg text-[12px] border transition-colors",
                        currentPage===totalPages?"text-gray-300 border-gray-100 cursor-not-allowed":"text-gray-500 border-gray-200 hover:bg-gray-50")}>→</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Check({size,className}:{size:number;className?:string}){
  return(
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}