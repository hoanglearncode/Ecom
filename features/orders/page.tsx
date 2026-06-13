"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { MockOrder } from "@/lib/api/mock-store/types";
import {
  Package, Search, ChevronRight, ChevronDown, ChevronUp,
  Star, MessageSquare, RotateCcw, Truck, CheckCircle2,
  Clock, XCircle, AlertTriangle, Copy, Eye, Heart,
  ShoppingCart, ArrowRight, Zap, MapPin, Phone,
  CalendarDays, Receipt, BadgePercent, Gift, Filter,
  X, ArrowUpDown, Home, Layers, ExternalLink,
  RefreshCw, TrendingUp, ShoppingBag, Tag, Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderStatus  = "processing" | "confirmed" | "picking" | "shipped" | "delivered" | "cancelled" | "refunding" | "refunded";
type TabKey       = "all" | OrderStatus;
type Platform     = "shopee" | "lazada" | "tiki" | "sendo";
type SortKey      = "newest" | "oldest" | "price_high" | "price_low";

interface OrderItem {
  id: string;
  name: string;
  image: string;
  brand: string;
  variant: string;
  price: number;
  originalPrice: number;
  qty: number;
  rating?: number;    // user's rating, null if not rated
  reviewed: boolean;
}

interface TrackingEvent {
  time: string;
  label: string;
  desc: string;
  done: boolean;
  active: boolean;
}

interface Order {
  id: string;
  status: OrderStatus;
  platform: Platform;
  placedAt: string;
  deliveredAt?: string;
  address: string;
  total: number;
  shippingFee: number;
  discount: number;
  voucherCode?: string;
  paymentMethod: string;
  trackingCode?: string;
  carrier?: string;
  items: OrderItem[];
  tracking: TrackingEvent[];
  canReorder: boolean;
  canReturn: boolean;
  earnedPoints: number;
}

// ─── Adapter ─────────────────────────────────────────────────────────────────

const ORDER_STATUS_MAP: Record<string, OrderStatus> = {
  pending: "processing",
  paid: "confirmed",
  processing: "processing",
  shipped: "shipped",
  completed: "delivered",
  cancelled: "cancelled",
};

function fmtOrderDate(s: string): string {
  try {
    const d = new Date(s);
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).replace(",", "");
  } catch { return s; }
}

function buildOrderTracking(status: OrderStatus, date: string): TrackingEvent[] {
  const base = fmtOrderDate(date);
  const steps: [string, string, string][] = [
    [base, "Đơn hàng được đặt", "Đơn hàng đã được xác nhận"],
    ["—",  "Shop xác nhận",     "Shop đang chuẩn bị hàng"],
    ["—",  "Lấy hàng",          "Đơn vị vận chuyển đã lấy hàng"],
    ["—",  "Đang vận chuyển",   "Hàng đang trên đường đến bạn"],
    ["—",  "Giao hàng thành công", "Hàng đã được giao đến bạn"],
  ];
  const doneIdx: Record<OrderStatus, number> = {
    processing: 0, confirmed: 1, picking: 2, shipped: 3,
    delivered: 4, cancelled: 0, refunding: 4, refunded: 4,
  };
  const done = doneIdx[status] ?? 0;
  return steps.map((s, i) => ({
    time: s[0], label: s[1], desc: s[2],
    done: i <= done,
    active: i === done,
  }));
}

function adaptOrder(o: MockOrder): Order {
  const status = ORDER_STATUS_MAP[o.status] ?? "processing";
  const lineItems = o.lineItems ?? [];
  const items: OrderItem[] = lineItems.length
    ? lineItems.map(li => ({
        id: li.productId, name: li.name,
        image: li.thumbnail ?? "📦", brand: "—", variant: "—",
        price: li.price, originalPrice: li.price,
        qty: li.quantity, reviewed: false,
      }))
    : [{ id: o.id, name: o.items, image: "📦", brand: "—", variant: "—",
         price: o.total, originalPrice: o.total, qty: 1, reviewed: false }];
  return {
    id: o.number ?? o.id,
    status,
    platform: "shopee",
    placedAt: fmtOrderDate(o.date),
    deliveredAt: status === "delivered" ? fmtOrderDate(o.date) : undefined,
    address: o.shippingAddress ?? "—",
    total: o.total,
    shippingFee: 0,
    discount: 0,
    paymentMethod: o.paymentMethod ?? "—",
    trackingCode: o.trackingNumber,
    carrier: o.trackingNumber ? "Express" : undefined,
    items,
    tracking: buildOrderTracking(status, o.date),
    canReorder: ["delivered", "cancelled"].includes(status),
    canReturn: status === "delivered",
    earnedPoints: Math.floor(o.total / 10000),
  };
}

// ─── Static fallback data (used until API loads) ──────────────────────────────

const STATIC_ORDERS: Order[] = [
  {
    id: "#8821432",
    status: "shipped",
    platform: "shopee",
    placedAt: "08/06/2026 10:24",
    address: "12 Phố Huế, Hai Bà Trưng, Hà Nội · Nguyễn Thị Lan · 0912 345 678",
    total: 897000,
    shippingFee: 0,
    discount: 100000,
    voucherCode: "SUMMER40",
    paymentMethod: "Ví MoMo",
    trackingCode: "SPXVN0082143218",
    carrier: "Shopee Express",
    earnedPoints: 89,
    canReorder: true,
    canReturn: false,
    items: [
      {
        id: "OI1", name: "Biti's Hunter X Street 2026 – Phiên Bản Hè",
        image: "👟", brand: "Biti's Hunter", variant: "Xanh Navy · Size 41",
        price: 449000, originalPrice: 749000, qty: 1, reviewed: false,
      },
      {
        id: "OI2", name: "Dép Biti's Nữ Quai Ngang Premium Pastel",
        image: "🩴", brand: "Biti's Hunter", variant: "Hồng Pastel · Size 37",
        price: 299000, originalPrice: 299000, qty: 2, reviewed: false,
      },
    ],
    tracking: [
      { time: "08/06 10:24", label: "Đơn hàng được đặt",       desc: "Shopee xác nhận đơn hàng của bạn",            done: true,  active: false },
      { time: "08/06 11:05", label: "Shop xác nhận",            desc: "Biti's Hunter đã xác nhận và đóng gói đơn",   done: true,  active: false },
      { time: "08/06 14:30", label: "Đã lấy hàng",              desc: "Shopee Express đã lấy hàng tại shop",         done: true,  active: false },
      { time: "08/06 18:00", label: "Đang vận chuyển",          desc: "Hàng đang trên đường đến bạn",                done: true,  active: true  },
      { time: "Dự kiến 09/06","label":"Giao hàng thành công",   desc: "Hàng sẽ được giao đến địa chỉ của bạn",       done: false, active: false },
    ],
  },
  {
    id: "#8821380",
    status: "processing",
    platform: "lazada",
    placedAt: "07/06/2026 22:15",
    address: "12 Phố Huế, Hai Bà Trưng, Hà Nội · Nguyễn Thị Lan · 0912 345 678",
    total: 620000,
    shippingFee: 25000,
    discount: 0,
    paymentMethod: "ZaloPay",
    earnedPoints: 62,
    canReorder: false,
    canReturn: false,
    items: [
      {
        id: "OI3", name: "Shiseido Vital Perfection White Revitalizing Cream 50ml",
        image: "💆", brand: "Shiseido VN", variant: "50ml · Hộp chính hãng",
        price: 620000, originalPrice: 980000, qty: 1, reviewed: false,
      },
    ],
    tracking: [
      { time: "07/06 22:15", label: "Đơn hàng được đặt",  desc: "Lazada đã nhận đơn hàng",               done: true,  active: false },
      { time: "Đang xử lý",  label: "Shop xác nhận",      desc: "Shop đang xem xét đơn hàng",            done: false, active: true  },
      { time: "—",           label: "Lấy hàng",           desc: "Đơn vị vận chuyển lấy hàng",           done: false, active: false },
      { time: "—",           label: "Đang giao",           desc: "Vận chuyển đến địa chỉ",               done: false, active: false },
      { time: "—",           label: "Đã giao",             desc: "Giao hàng thành công",                 done: false, active: false },
    ],
  },
  {
    id: "#8821210",
    status: "delivered",
    platform: "tiki",
    placedAt: "04/06/2026 09:10",
    deliveredAt: "05/06/2026 14:30",
    address: "12 Phố Huế, Hai Bà Trưng, Hà Nội · Nguyễn Thị Lan · 0912 345 678",
    total: 2190000,
    shippingFee: 0,
    discount: 200000,
    voucherCode: "SAVE200K",
    paymentMethod: "Thẻ Visa ···· 4242",
    trackingCode: "TIKINOW001234",
    carrier: "TikiNOW",
    earnedPoints: 219,
    canReorder: true,
    canReturn: true,
    items: [
      {
        id: "OI4", name: "Nike Air Max 270 Nam – Chính Hãng",
        image: "🏃", brand: "Nike VN", variant: "Cam/Đen · Size 42",
        price: 2190000, originalPrice: 3490000, qty: 1, reviewed: true, rating: 5,
      },
    ],
    tracking: [
      { time: "04/06 09:10", label: "Đặt hàng",       desc: "Tiki xác nhận đơn hàng",       done: true, active: false },
      { time: "04/06 09:35", label: "Xác nhận",        desc: "Nike VN xác nhận đơn",        done: true, active: false },
      { time: "04/06 11:00", label: "Lấy hàng",        desc: "TikiNOW lấy hàng",            done: true, active: false },
      { time: "05/06 10:15", label: "Đang giao",       desc: "Shipper đang trên đường",      done: true, active: false },
      { time: "05/06 14:30", label: "Đã giao thành công", desc: "Khách hàng đã nhận hàng", done: true, active: true  },
    ],
  },
  {
    id: "#8821100",
    status: "delivered",
    platform: "shopee",
    placedAt: "01/06/2026 16:40",
    deliveredAt: "03/06/2026 11:00",
    address: "12 Phố Huế, Hai Bà Trưng, Hà Nội · Nguyễn Thị Lan · 0912 345 678",
    total: 598000,
    shippingFee: 0,
    discount: 0,
    paymentMethod: "Ví MoMo",
    trackingCode: "SPXVN0082110045",
    carrier: "Shopee Express",
    earnedPoints: 59,
    canReorder: true,
    canReturn: true,
    items: [
      {
        id: "OI5", name: "Canifa Áo Len Oversize Premium",
        image: "🧥", brand: "Canifa", variant: "Xám · Size M",
        price: 299000, originalPrice: 499000, qty: 2, reviewed: true, rating: 4,
      },
    ],
    tracking: [
      { time: "01/06 16:40", label: "Đặt hàng",    desc: "Shopee xác nhận",              done: true, active: false },
      { time: "02/06 08:00", label: "Xác nhận",    desc: "Canifa xác nhận đơn",          done: true, active: false },
      { time: "02/06 14:00", label: "Lấy hàng",   desc: "Express lấy hàng",             done: true, active: false },
      { time: "03/06 09:30", label: "Đang giao",  desc: "Shipper đang giao",             done: true, active: false },
      { time: "03/06 11:00", label: "Đã giao",    desc: "Đã giao thành công",            done: true, active: true  },
    ],
  },
  {
    id: "#8820950",
    status: "refunding",
    platform: "sendo",
    placedAt: "28/05/2026 13:55",
    address: "12 Phố Huế, Hai Bà Trưng, Hà Nội · Nguyễn Thị Lan · 0912 345 678",
    total: 5290000,
    shippingFee: 0,
    discount: 500000,
    paymentMethod: "Chuyển khoản ngân hàng",
    earnedPoints: 0,
    canReorder: false,
    canReturn: false,
    items: [
      {
        id: "OI6", name: "Samsung Galaxy Tab A9 – WiFi 128GB",
        image: "📟", brand: "Samsung VN", variant: "128GB · Graphite",
        price: 5290000, originalPrice: 7490000, qty: 1, reviewed: false,
      },
    ],
    tracking: [
      { time: "28/05 13:55", label: "Đặt hàng",       desc: "Sendo xác nhận đơn",           done: true, active: false },
      { time: "28/05 16:00", label: "Giao hàng",       desc: "Đã nhận hàng",                done: true, active: false },
      { time: "30/05 10:00", label: "Yêu cầu hoàn",   desc: "Khách yêu cầu trả hàng",      done: true, active: false },
      { time: "Đang xử lý",  label: "Đang hoàn tiền", desc: "Sendo đang xử lý hoàn tiền",  done: false, active: true  },
    ],
  },
  {
    id: "#8820800",
    status: "cancelled",
    platform: "lazada",
    placedAt: "25/05/2026 08:20",
    address: "12 Phố Huế, Hai Bà Trưng, Hà Nội · Nguyễn Thị Lan · 0912 345 678",
    total: 1290000,
    shippingFee: 30000,
    discount: 0,
    paymentMethod: "COD",
    earnedPoints: 0,
    canReorder: true,
    canReturn: false,
    items: [
      {
        id: "OI7", name: "Converse Chuck Taylor All Star Classic",
        image: "👟", brand: "Converse VN", variant: "Đen · Size 40",
        price: 1290000, originalPrice: 1590000, qty: 1, reviewed: false,
      },
    ],
    tracking: [
      { time: "25/05 08:20", label: "Đặt hàng",   desc: "Lazada xác nhận đơn",            done: true, active: false },
      { time: "25/05 10:00", label: "Đã huỷ",     desc: "Đơn bị huỷ do yêu cầu KH",     done: true, active: true  },
    ],
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<OrderStatus,{label:string;dot:string;cls:string;icon:React.ElementType}> = {
  processing: { label:"Đang xử lý",       dot:"bg-blue-500",    cls:"bg-blue-50 text-blue-700 border-blue-200",         icon:Clock         },
  confirmed:  { label:"Đã xác nhận",      dot:"bg-sky-500",     cls:"bg-sky-50 text-sky-700 border-sky-200",            icon:CheckCircle2  },
  picking:    { label:"Đang lấy hàng",    dot:"bg-amber-400",   cls:"bg-amber-50 text-amber-700 border-amber-200",      icon:Package       },
  shipped:    { label:"Đang giao hàng",   dot:"bg-violet-500",  cls:"bg-violet-50 text-violet-700 border-violet-200",   icon:Truck         },
  delivered:  { label:"Đã giao thành công",dot:"bg-emerald-500",cls:"bg-emerald-50 text-emerald-800 border-emerald-200",icon:CheckCircle2  },
  cancelled:  { label:"Đã huỷ",           dot:"bg-gray-400",    cls:"bg-gray-100 text-gray-600 border-gray-200",        icon:XCircle       },
  refunding:  { label:"Đang hoàn tiền",   dot:"bg-orange-400",  cls:"bg-orange-50 text-orange-700 border-orange-200",   icon:RefreshCw     },
  refunded:   { label:"Đã hoàn tiền",     dot:"bg-teal-500",    cls:"bg-teal-50 text-teal-700 border-teal-200",         icon:CheckCircle2  },
};

const PLATFORM_CFG: Record<Platform,{label:string;cls:string}> = {
  shopee: { label:"Shopee", cls:"bg-orange-50 text-orange-700 border-orange-200" },
  lazada: { label:"Lazada", cls:"bg-pink-50 text-pink-700 border-pink-200"       },
  tiki:   { label:"Tiki",   cls:"bg-blue-50 text-blue-700 border-blue-200"       },
  sendo:  { label:"Sendo",  cls:"bg-green-50 text-green-700 border-green-200"    },
};

const TABS: {key:TabKey;label:string}[] = [
  {key:"all",        label:"Tất cả"},
  {key:"processing", label:"Đang xử lý"},
  {key:"shipped",    label:"Đang giao"},
  {key:"delivered",  label:"Đã nhận"},
  {key:"cancelled",  label:"Đã huỷ"},
  {key:"refunding",  label:"Hoàn tiền"},
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtPrice(n:number){ return new Intl.NumberFormat("vi-VN").format(n)+"₫"; }
function discPct(o:number,s:number){ return o>s?Math.round(((o-s)/o)*100):0; }

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRow({rating,size=12}:{rating:number;size?:number}){
  return(
    <span className="inline-flex gap-0.5">
      {[1,2,3,4,5].map(s=>(
        <Star key={s} size={size}
          className={s<=Math.round(rating)?"fill-amber-400 text-amber-400":"fill-gray-200 text-gray-200"}/>
      ))}
    </span>
  );
}

/** Vertical timeline for tracking */
function TrackingTimeline({events}:{events:TrackingEvent[]}){
  return(
    <div className="space-y-0 relative">
      {/* vertical line */}
      <div className="absolute left-[9px] top-3 bottom-3 w-0.5 bg-gray-200"/>
      {events.map((ev,i)=>(
        <div key={i} className="flex items-start gap-3 relative pb-4 last:pb-0">
          {/* dot */}
          <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 z-10",
            ev.done&&ev.active ? "bg-[#1a1a2e] border-[#1a1a2e]" :
            ev.done            ? "bg-emerald-500 border-emerald-500" :
                                 "bg-white border-gray-300")}>
            {ev.done && !ev.active && <CheckCircle2 size={10} className="text-white"/>}
            {ev.active && <div className="w-2 h-2 rounded-full bg-white"/>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <p className={cn("text-[12px] font-semibold",
                ev.active?"text-[#1a1a2e]":ev.done?"text-gray-700":"text-gray-400")}>
                {ev.label}
              </p>
              <span className="text-[10px] text-gray-400 ml-auto shrink-0">{ev.time}</span>
            </div>
            <p className={cn("text-[11px] mt-0.5",ev.done?"text-gray-500":"text-gray-400")}>{ev.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Star rating picker for review */
function RatingPicker({value,onChange}:{value:number;onChange:(n:number)=>void}){
  const [hover,setHover]=useState(0);
  return(
    <div className="flex gap-1">
      {[1,2,3,4,5].map(s=>(
        <button key={s}
          onMouseEnter={()=>setHover(s)}
          onMouseLeave={()=>setHover(0)}
          onClick={()=>onChange(s)}
          className="transition-transform hover:scale-110">
          <Star size={22} className={s<=(hover||value)?"fill-amber-400 text-amber-400":"fill-gray-200 text-gray-200"}/>
        </button>
      ))}
    </div>
  );
}

/** Individual order card */
function OrderCard({order}:{order:Order}){
  const [expanded,    setExpanded]   = useState(false);
  const [showTracking,setShowTracking]=useState(false);
  const [reviewItem,  setReviewItem] = useState<string|null>(null);
  const [reviewRating,setReviewRating]=useState(5);
  const [reviewText,  setReviewText] = useState("");
  const [copied,      setCopied]     = useState(false);

  const st   = STATUS_CFG[order.status];
  const plt  = PLATFORM_CFG[order.platform];
  const Icon = st.icon;
  const isDelivered  = order.status==="delivered";
  const isShipped    = order.status==="shipped";
  const isProcessing = order.status==="processing";
  const isCancelled  = order.status==="cancelled";
  const isRefunding  = order.status==="refunding";

  function copyTracking(){
    setCopied(true);
    setTimeout(()=>setCopied(false),1800);
  }

  return(
    <div className={cn("bg-white rounded-2xl border overflow-hidden transition-all",
      expanded?"border-gray-200 shadow-sm":"border-gray-100 hover:border-gray-200")}>

      {/* ── Card header ── */}
      <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100">
        {/* Platform + ID */}
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded border",plt.cls)}>{plt.label}</span>
            <span className="font-mono text-[12px] text-gray-600 font-semibold">{order.id}</span>
            <button onClick={copyTracking} className="text-gray-300 hover:text-gray-500 transition-colors">
              {copied?<CheckCircle2 size={11} className="text-emerald-500"/>:<Copy size={11}/>}
            </button>
          </div>
          <p className="text-[11px] text-gray-400 flex items-center gap-1">
            <CalendarDays size={10}/> {order.placedAt}
          </p>
        </div>

        {/* Status */}
        <Badge variant="outline" className={cn("text-[11px] font-medium border gap-1.5",st.cls)}>
          <span className={cn("w-1.5 h-1.5 rounded-full",st.dot)}/>
          {st.label}
        </Badge>

        {/* Price */}
        <div className="ml-auto text-right">
          <p className="text-[15px] font-bold text-gray-900">{fmtPrice(order.total)}</p>
          <p className="text-[10px] text-gray-400">{order.paymentMethod}</p>
        </div>

        {/* Expand toggle */}
        <button onClick={()=>setExpanded(v=>!v)}
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors ml-2 shrink-0">
          {expanded?<ChevronUp size={14}/>:<ChevronDown size={14}/>}
        </button>
      </div>

      {/* ── Items preview (always visible) ── */}
      <div className="px-5 py-3 flex items-center gap-3">
        {order.items.slice(0,3).map((item,i)=>(
          <div key={item.id} className="relative w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
            {item.image}
            {discPct(item.originalPrice,item.price)>0&&(
              <span className="absolute -top-1.5 -right-1.5 text-[8px] bg-red-500 text-white px-1 py-0.5 rounded font-bold">
                -{discPct(item.originalPrice,item.price)}%
              </span>
            )}
          </div>
        ))}
        {order.items.length>3&&(
          <div className="w-12 h-12 bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center justify-center text-[12px] text-gray-400 font-medium shrink-0">
            +{order.items.length-3}
          </div>
        )}
        <div className="flex-1 min-w-0 ml-1">
          <p className="text-[13px] font-medium text-gray-900 truncate">{order.items[0].name}</p>
          <p className="text-[11px] text-gray-400">{order.items[0].variant}{order.items.length>1?` + ${order.items.length-1} sp khác`:""}</p>
        </div>
        {/* Quick action */}
        <div className="flex gap-2 shrink-0">
          {isDelivered&&order.canReturn&&(
            <button className="flex items-center gap-1.5 text-[11px] text-gray-500 border border-gray-200 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              <RotateCcw size={11}/> Đổi/Trả
            </button>
          )}
          {order.canReorder&&(
            <button className="flex items-center gap-1.5 text-[11px] text-[#1a1a2e] border border-[#1a1a2e]/20 bg-[#1a1a2e]/5 px-2.5 py-1.5 rounded-lg hover:bg-[#1a1a2e]/10 transition-colors">
              <ShoppingCart size={11}/> Mua lại
            </button>
          )}
          {(isShipped||isProcessing)&&(
            <button onClick={()=>setShowTracking(v=>!v)}
              className={cn("flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg border transition-colors",
                showTracking?"bg-[#1a1a2e] text-white border-[#1a1a2e]":"text-violet-700 border-violet-200 bg-violet-50 hover:bg-violet-100")}>
              <Truck size={11}/> {showTracking?"Ẩn tracking":"Theo dõi"}
            </button>
          )}
        </div>
      </div>

      {/* ── Tracking bar (quick view) ── */}
      {(isShipped||isProcessing)&&showTracking&&!expanded&&(
        <div className="px-5 pb-4 border-t border-gray-50 pt-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {order.tracking.map((ev,i)=>(
              <div key={i} className="flex items-center gap-2 shrink-0">
                <div className="flex flex-col items-center gap-1">
                  <div className={cn("w-7 h-7 rounded-full flex items-center justify-center border-2",
                    ev.done&&ev.active?"bg-[#1a1a2e] border-[#1a1a2e]":
                    ev.done?"bg-emerald-500 border-emerald-500":
                    "bg-white border-gray-200")}>
                    {ev.done&&!ev.active&&<CheckCircle2 size={11} className="text-white"/>}
                    {ev.active&&<div className="w-2 h-2 rounded-full bg-white"/>}
                  </div>
                  <p className={cn("text-[10px] text-center max-w-[70px] leading-tight",
                    ev.active?"text-[#1a1a2e] font-semibold":ev.done?"text-gray-600":"text-gray-400")}>{ev.label}</p>
                </div>
                {i<order.tracking.length-1&&(
                  <div className={cn("h-0.5 w-10 mb-4 rounded",ev.done?"bg-emerald-300":"bg-gray-200")}/>
                )}
              </div>
            ))}
          </div>
          {order.trackingCode&&(
            <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-500">
              <span>{order.carrier}:</span>
              <span className="font-mono text-gray-700 font-medium">{order.trackingCode}</span>
              <button onClick={copyTracking} className="text-blue-500 hover:underline flex items-center gap-0.5">
                {copied?<><CheckCircle2 size={10}/>Đã sao chép</>:<><Copy size={10}/>Sao chép</>}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Expanded detail ── */}
      {expanded&&(
        <div className="px-5 pb-5 border-t border-gray-100 space-y-5 pt-4">
          <div className="grid grid-cols-[1fr_260px] gap-5">

            {/* Left: items detail + review */}
            <div className="space-y-4">
              {/* Items list */}
              <div>
                <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Sản phẩm ({order.items.length})
                </p>
                <div className="space-y-3">
                  {order.items.map(item=>(
                    <div key={item.id} className={cn("rounded-xl border p-3 transition-all",
                      reviewItem===item.id?"border-[#1a1a2e]/30 bg-[#1a1a2e]/2":"border-gray-100 bg-gray-50/30")}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="relative w-12 h-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
                          {item.image}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-gray-900 line-clamp-1">{item.name}</p>
                          <p className="text-[11px] text-gray-400">{item.variant}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[12px] font-semibold text-red-600">{fmtPrice(item.price)}</span>
                            {item.originalPrice>item.price&&(
                              <span className="text-[10px] text-gray-400 line-through">{fmtPrice(item.originalPrice)}</span>
                            )}
                            <span className="text-[11px] text-gray-400">× {item.qty}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          {item.reviewed?(
                            <div className="flex items-center gap-1">
                              <StarRow rating={item.rating??5} size={11}/>
                              <span className="text-[10px] text-gray-400">Đã đánh giá</span>
                            </div>
                          ):(
                            isDelivered&&(
                              <button onClick={()=>setReviewItem(reviewItem===item.id?null:item.id)}
                                className={cn("flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg border transition-all",
                                  reviewItem===item.id?"bg-amber-500 text-white border-amber-500":"border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100")}>
                                <Star size={11}/> Đánh giá
                              </button>
                            )
                          )}
                          <button className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-blue-600 transition-colors">
                            <Eye size={10}/> Xem SP
                          </button>
                        </div>
                      </div>

                      {/* Review form */}
                      {reviewItem===item.id&&(
                        <div className="border-t border-amber-100 pt-3 mt-1 space-y-2.5">
                          <div className="flex items-center gap-3">
                            <p className="text-[12px] font-medium text-gray-700">Đánh giá của bạn:</p>
                            <RatingPicker value={reviewRating} onChange={setReviewRating}/>
                          </div>
                          <textarea
                            value={reviewText}
                            onChange={e=>setReviewText(e.target.value)}
                            rows={3}
                            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                            className="w-full text-[13px] border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#1a1a2e] resize-none placeholder:text-gray-400 transition-colors"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" className="h-8 bg-amber-500 hover:bg-amber-600 text-white text-[12px] gap-1.5">
                              <Star size={11}/> Gửi đánh giá
                            </Button>
                            <Button size="sm" variant="outline" onClick={()=>setReviewItem(null)} className="h-8 text-[12px] border-gray-200">Huỷ</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Order financial summary */}
              <div className="bg-gray-50 rounded-xl p-3.5 space-y-1.5">
                <p className="text-[12px] font-semibold text-gray-700 mb-2">Chi tiết thanh toán</p>
                {[
                  {label:"Tạm tính",  value:fmtPrice(order.items.reduce((s,i)=>s+i.price*i.qty,0)), highlight:false},
                  {label:"Phí vận chuyển",  value:order.shippingFee===0?"Miễn phí":fmtPrice(order.shippingFee), highlight:false},
                  ...(order.discount>0?[{label:`Giảm giá (${order.voucherCode??""})`,value:"-"+fmtPrice(order.discount),highlight:true}]:[]),
                ].map(({label,value,highlight})=>(
                  <div key={label} className="flex justify-between text-[12px]">
                    <span className="text-gray-500">{label}</span>
                    <span className={cn("font-medium",highlight?"text-emerald-600":"text-gray-700")}>{value}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-1.5 border-t border-gray-200">
                  <span className="text-[13px] font-semibold text-gray-900">Tổng thanh toán</span>
                  <span className="text-[15px] font-bold text-red-600">{fmtPrice(order.total)}</span>
                </div>
                {order.earnedPoints>0&&(
                  <p className="text-[11px] text-amber-600 flex items-center gap-1 pt-0.5">
                    <Gift size={10}/>+{order.earnedPoints} điểm thưởng
                  </p>
                )}
              </div>
            </div>

            {/* Right: tracking + info */}
            <div className="space-y-4">
              {/* Full tracking timeline */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[12px] font-semibold text-gray-700">Lịch sử vận chuyển</p>
                  {order.trackingCode&&(
                    <button className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5">
                      <ExternalLink size={10}/> Tra cứu
                    </button>
                  )}
                </div>
                <TrackingTimeline events={order.tracking}/>
                {order.trackingCode&&(
                  <div className="mt-3 pt-2.5 border-t border-gray-200">
                    <p className="text-[10px] text-gray-400 mb-0.5">{order.carrier} · Mã vận đơn</p>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] text-gray-700 font-semibold">{order.trackingCode}</span>
                      <button onClick={copyTracking} className="text-blue-500 hover:text-blue-700 transition-colors">
                        {copied?<CheckCircle2 size={10} className="text-emerald-500"/>:<Copy size={10}/>}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery address */}
              <div className="bg-gray-50 rounded-xl p-3.5">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <MapPin size={10}/> Địa chỉ nhận hàng
                </p>
                <p className="text-[12px] text-gray-700 leading-relaxed">{order.address}</p>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                {isDelivered&&(
                  <>
                    <button className="w-full flex items-center gap-2 text-[12px] font-medium border border-gray-200 rounded-xl px-3 py-2.5 hover:bg-gray-50 transition-colors text-gray-700">
                      <Download size={13} className="text-gray-400"/> Tải hoá đơn PDF
                    </button>
                    {order.canReturn&&(
                      <button className="w-full flex items-center gap-2 text-[12px] font-medium border border-amber-200 bg-amber-50 rounded-xl px-3 py-2.5 hover:bg-amber-100 transition-colors text-amber-700">
                        <RotateCcw size={13}/> Yêu cầu đổi/trả hàng
                      </button>
                    )}
                  </>
                )}
                {isCancelled&&(
                  <button className="w-full flex items-center gap-2 text-[12px] font-medium bg-[#1a1a2e] text-white rounded-xl px-3 py-2.5 hover:bg-[#2d2d4a] transition-colors">
                    <ShoppingCart size={13}/> Đặt lại đơn hàng
                  </button>
                )}
                {isRefunding&&(
                  <div className="flex items-start gap-2 text-[11px] text-orange-700 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2.5">
                    <AlertTriangle size={12} className="mt-0.5 shrink-0"/>
                    <span>Đang xử lý hoàn tiền. Tiền sẽ được hoàn trong 3–7 ngày làm việc.</span>
                  </div>
                )}
                <button className="w-full flex items-center gap-2 text-[12px] font-medium border border-gray-200 rounded-xl px-3 py-2.5 hover:bg-gray-50 transition-colors text-gray-600">
                  <MessageSquare size={13} className="text-gray-400"/> Liên hệ shop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OrderHistoryPage() {
  const { data: rawOrders } = useQuery({
    queryKey: ["orders"],
    queryFn: () => apiGet<MockOrder[]>("/api/orders"),
  });
  const ORDERS = useMemo(
    () => rawOrders ? rawOrders.map(adaptOrder) : STATIC_ORDERS,
    [rawOrders]
  );

  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search,    setSearch]    = useState("");
  const [sort,      setSort]      = useState<SortKey>("newest");

  const filtered = ORDERS
    .filter(o => activeTab==="all" || o.status===activeTab)
    .filter(o => search==="" ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some(i=>i.name.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a,b)=>{
      if(sort==="oldest")    return a.placedAt.localeCompare(b.placedAt);
      if(sort==="price_high")return b.total-a.total;
      if(sort==="price_low") return a.total-b.total;
      return b.placedAt.localeCompare(a.placedAt);
    });

  const tabCounts: Record<TabKey,number> = {
    all:        ORDERS.length,
    processing: ORDERS.filter(o=>o.status==="processing").length,
    confirmed:  ORDERS.filter(o=>o.status==="confirmed").length,
    picking:    ORDERS.filter(o=>o.status==="picking").length,
    shipped:    ORDERS.filter(o=>o.status==="shipped").length,
    delivered:  ORDERS.filter(o=>o.status==="delivered").length,
    cancelled:  ORDERS.filter(o=>o.status==="cancelled").length,
    refunding:  ORDERS.filter(o=>o.status==="refunding").length,
    refunded:   ORDERS.filter(o=>o.status==="refunded").length,
  };

  // Stats
  const totalSpent   = ORDERS.filter(o=>o.status==="delivered").reduce((s,o)=>s+o.total,0);
  const totalOrders  = ORDERS.length;
  const totalPoints  = ORDERS.reduce((s,o)=>s+o.earnedPoints,0);
  const pendingCount = ORDERS.filter(o=>["processing","shipped","confirmed","picking"].includes(o.status)).length;

  return(
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Header ── */}
      <div className="bg-[#1a1a2e] text-white">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center gap-2 text-[12px] text-white/40 mb-3">
            <Home size={11}/><ChevronRight size={10}/><span>Tài khoản</span><ChevronRight size={10}/><span className="text-white/70">Đơn hàng của tôi</span>
          </div>
          <div className="flex items-end justify-between gap-6">
            <div>
              <h1 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <ShoppingBag size={20}/> Đơn hàng của tôi
              </h1>
              <p className="text-white/50 text-[13px]">Quản lý và theo dõi tất cả đơn mua hàng</p>
            </div>
            {/* Search */}
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 w-64">
              <Search size={14} className="text-white/50 shrink-0"/>
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Tìm mã đơn, tên sản phẩm..."
                className="bg-transparent text-[13px] text-white placeholder:text-white/40 outline-none flex-1"/>
              {search&&<button onClick={()=>setSearch("")}><X size={11} className="text-white/50"/></button>}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-4 gap-4 border-t border-white/10 pt-5">
            {[
              {label:"Tổng đơn hàng",      value:totalOrders,           icon:Package,   unit:"đơn"},
              {label:"Đang trên đường",     value:pendingCount,          icon:Truck,     unit:"đơn"},
              {label:"Tổng chi tiêu",       value:fmtPrice(totalSpent),  icon:Receipt,   unit:""},
              {label:"Điểm tích luỹ",       value:totalPoints,           icon:Gift,      unit:"điểm"},
            ].map(({label,value,icon:Icon,unit})=>(
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-white/70"/>
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-white leading-none">{value}{unit&&<span className="text-[11px] font-normal text-white/50 ml-1">{unit}</span>}</p>
                  <p className="text-[11px] text-white/40 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-5 space-y-4">

        {/* ── Tabs + sort ── */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center border-b border-gray-100 overflow-x-auto">
            {TABS.map(({key,label})=>(
              <button key={key} onClick={()=>setActiveTab(key)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-3.5 text-[13px] border-b-2 transition-colors whitespace-nowrap shrink-0",
                  activeTab===key?"border-[#1a1a2e] text-gray-900 font-medium":"border-transparent text-gray-500 hover:text-gray-700"
                )}>
                {label}
                {tabCounts[key]>0&&(
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                    activeTab===key?"bg-gray-900 text-white":"bg-gray-100 text-gray-500")}>
                    {tabCounts[key]}
                  </span>
                )}
              </button>
            ))}
            <div className="ml-auto px-4 shrink-0">
              <select value={sort} onChange={e=>setSort(e.target.value as SortKey)}
                className="text-[12px] text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white outline-none cursor-pointer">
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="price_high">Giá trị cao</option>
                <option value="price_low">Giá trị thấp</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Order list ── */}
        {filtered.length>0?(
          <div className="space-y-3">
            {filtered.map(order=>(
              <OrderCard key={order.id} order={order}/>
            ))}
          </div>
        ):(
          <div className="py-24 text-center bg-white rounded-2xl border border-gray-100">
            <ShoppingBag size={44} className="mx-auto text-gray-200 mb-3"/>
            <p className="text-gray-500 text-[14px] font-medium mb-1">
              {search?"Không tìm thấy đơn hàng phù hợp":"Chưa có đơn hàng nào"}
            </p>
            <p className="text-gray-400 text-[12px] mb-4">
              {search?"Thử tìm theo mã đơn hàng hoặc tên sản phẩm":"Hãy bắt đầu mua sắm để đơn hàng hiện ở đây"}
            </p>
            <Button className="bg-[#1a1a2e] hover:bg-[#2d2d4a] text-white gap-1.5 h-9 text-[13px]">
              <ShoppingCart size={14}/> Mua sắm ngay
            </Button>
          </div>
        )}

        {/* Pagination */}
        {filtered.length>0&&(
          <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3">
            <p className="text-[12px] text-gray-400">
              Hiển thị <span className="font-medium text-gray-700">{filtered.length}</span> / {ORDERS.length} đơn hàng
            </p>
            <div className="flex gap-1">
              {["←","1","2","→"].map((p,i)=>(
                <button key={i} className={cn("w-7 h-7 rounded-md text-[12px] border transition-colors",
                  p==="1"?"bg-[#1a1a2e] text-white border-[#1a1a2e]":"text-gray-500 border-gray-200 hover:bg-gray-50")}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}