"use client";

import { useState } from "react";
import {
  ChevronRight, Home, Package, Truck, CheckCircle2,
  Clock, XCircle, Copy, MapPin, Phone, Star, MessageSquare,
  RotateCcw, ShoppingCart, Download, Shield, Gift,
  AlertTriangle, ChevronDown, ChevronUp, RefreshCw,
  Eye, Camera, ArrowLeft, Share2, CalendarDays,
  Receipt, Tag, Zap, ExternalLink, CheckCheck,
  PackageCheck, PackageSearch, PackageX, Bike,
  Navigation, BadgeCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderStatus = "processing" | "confirmed" | "picking" | "shipped" | "out_for_delivery" | "delivered" | "cancelled" | "refunding" | "refunded";
type Platform    = "shopee" | "lazada" | "tiki" | "sendo";

interface TrackingEvent {
  id: string;
  time: string;
  label: string;
  desc: string;
  location?: string;
  done: boolean;
  active: boolean;
  isKey: boolean; // major milestone
}

interface OrderItem {
  id: string;
  name: string;
  image: string;
  brand: string;
  brandEmoji: string;
  variant: string;
  price: number;
  originalPrice: number;
  qty: number;
  reviewed: boolean;
  rating?: number;
}

// ─── Mock Order ───────────────────────────────────────────────────────────────

const ORDER = {
  id: "#8821432",
  status: "shipped" as OrderStatus,
  platform: "shopee" as Platform,
  placedAt:     "08/06/2026 10:24",
  confirmedAt:  "08/06/2026 11:05",
  shippedAt:    "08/06/2026 14:30",
  estimatedDelivery: "09/06/2026",
  trackingCode: "SPXVN0082143218",
  carrier:      "Shopee Express",
  carrierPhone: "1900 6066",
  paymentMethod:"Ví MoMo",
  paymentStatus:"Đã thanh toán",
  subtotal:     997000,
  shippingFee:  0,
  discount:     100000,
  voucherCode:  "SUMMER40",
  total:        897000,
  earnedPoints: 89,
  canCancel:    false,
  canReturn:    false,
  canReorder:   true,
  note:         "Gọi trước khi giao, để trước cửa nếu không có nhà",
  address: {
    name:    "Nguyễn Thị Lan",
    phone:   "0912 345 678",
    line1:   "12 Phố Huế",
    ward:    "Phường Phố Huế",
    district:"Hai Bà Trưng",
    city:    "Hà Nội",
  },
  items: [
    {
      id: "OI1",
      name: "Biti's Hunter X Street 2026 – Phiên Bản Hè",
      image: "👟", brand: "Biti's Hunter", brandEmoji: "👟",
      variant: "Xanh Navy · Size 41",
      price: 449000, originalPrice: 749000,
      qty: 1, reviewed: false,
    },
    {
      id: "OI2",
      name: "Dép Biti's Nữ Quai Ngang Premium Pastel",
      image: "🩴", brand: "Biti's Hunter", brandEmoji: "👟",
      variant: "Hồng Pastel · Size 37",
      price: 299000, originalPrice: 299000,
      qty: 2, reviewed: false,
    },
    {
      id: "OI3",
      name: "Phụ kiện – Túi Bảo Vệ Giày Biti's",
      image: "👜", brand: "Biti's Hunter", brandEmoji: "👟",
      variant: "Màu đen",
      price: 79000, originalPrice: 99000,
      qty: 1, reviewed: false,
    },
  ] as OrderItem[],
  tracking: [
    {
      id: "t1",
      time: "08/06 10:24", label: "Đặt hàng thành công",
      desc: "Shopee đã nhận đơn hàng và đang chờ shop xác nhận",
      done: true, active: false, isKey: true,
    },
    {
      id: "t2",
      time: "08/06 11:05", label: "Shop đã xác nhận",
      desc: "Biti's Hunter đã xác nhận và đang đóng gói đơn hàng",
      done: true, active: false, isKey: false,
    },
    {
      id: "t3",
      time: "08/06 13:45", label: "Đang chuẩn bị hàng",
      desc: "Shop đang hoàn tất đóng gói, sắp bàn giao cho vận chuyển",
      done: true, active: false, isKey: false,
    },
    {
      id: "t4",
      time: "08/06 14:30", label: "Đã lấy hàng",
      desc: "Shopee Express đã lấy hàng tại kho Biti's Hunter – HN",
      location: "Kho Biti's Hunter, Hoàng Mai, Hà Nội",
      done: true, active: false, isKey: true,
    },
    {
      id: "t5",
      time: "08/06 15:10", label: "Đang vận chuyển đến bưu cục",
      desc: "Gói hàng đang trên đường đến bưu cục trung chuyển",
      location: "Trung tâm phân loại Shopee Express, HN",
      done: true, active: false, isKey: false,
    },
    {
      id: "t6",
      time: "08/06 18:22", label: "Đến bưu cục trung chuyển",
      desc: "Hàng đã đến bưu cục và đang được phân loại",
      location: "Bưu cục Shopee Express – Hai Bà Trưng",
      done: true, active: false, isKey: false,
    },
    {
      id: "t7",
      time: "Đang giao hàng", label: "Shipper đang giao đến bạn",
      desc: "Đơn hàng đang trên đường đến địa chỉ của bạn",
      location: "Đang di chuyển đến 12 Phố Huế",
      done: true, active: true, isKey: true,
    },
    {
      id: "t8",
      time: "Dự kiến 09/06", label: "Giao hàng thành công",
      desc: "Hàng sẽ được giao đến địa chỉ của bạn",
      done: false, active: false, isKey: true,
    },
  ] as TrackingEvent[],
};

const PLATFORM_CFG: Record<Platform,{label:string;cls:string;color:string}> = {
  shopee: { label:"Shopee", cls:"bg-orange-50 text-orange-700 border-orange-200", color:"#f97316" },
  lazada: { label:"Lazada", cls:"bg-pink-50 text-pink-700 border-pink-200",       color:"#ec4899" },
  tiki:   { label:"Tiki",   cls:"bg-blue-50 text-blue-700 border-blue-200",       color:"#3b82f6" },
  sendo:  { label:"Sendo",  cls:"bg-green-50 text-green-700 border-green-200",    color:"#22c55e" },
};

const STATUS_CFG: Record<OrderStatus,{label:string;cls:string;dot:string;headline:string;sub:string}> = {
  processing:       { label:"Đang xử lý",        dot:"bg-blue-500",    cls:"bg-blue-50 text-blue-700 border-blue-200",          headline:"Đơn hàng đang được xử lý",         sub:"Shop sẽ xác nhận đơn hàng sớm" },
  confirmed:        { label:"Đã xác nhận",        dot:"bg-sky-500",     cls:"bg-sky-50 text-sky-700 border-sky-200",             headline:"Shop đã xác nhận đơn hàng",        sub:"Đơn đang được chuẩn bị" },
  picking:          { label:"Đang lấy hàng",      dot:"bg-amber-400",   cls:"bg-amber-50 text-amber-700 border-amber-200",       headline:"Đang lấy hàng từ shop",            sub:"Đơn vị vận chuyển đang đến lấy hàng" },
  shipped:          { label:"Đang vận chuyển",    dot:"bg-violet-500",  cls:"bg-violet-50 text-violet-700 border-violet-200",    headline:"Đơn hàng đang trên đường đến bạn","sub":"Dự kiến giao 09/06/2026" },
  out_for_delivery: { label:"Đang giao hàng",     dot:"bg-orange-500",  cls:"bg-orange-50 text-orange-700 border-orange-200",    headline:"Shipper đang giao hàng đến bạn",  sub:"Hãy sẵn sàng nhận hàng" },
  delivered:        { label:"Đã giao thành công", dot:"bg-emerald-500", cls:"bg-emerald-50 text-emerald-800 border-emerald-200", headline:"Đơn hàng đã được giao thành công","sub":"Cảm ơn bạn đã mua sắm!" },
  cancelled:        { label:"Đã huỷ",             dot:"bg-gray-400",    cls:"bg-gray-100 text-gray-600 border-gray-200",         headline:"Đơn hàng đã bị huỷ",              sub:"Tiền sẽ được hoàn nếu đã thanh toán" },
  refunding:        { label:"Đang hoàn tiền",     dot:"bg-orange-400",  cls:"bg-orange-50 text-orange-700 border-orange-200",    headline:"Đang xử lý hoàn tiền",            sub:"Tiền sẽ về trong 3–7 ngày làm việc" },
  refunded:         { label:"Đã hoàn tiền",       dot:"bg-teal-500",    cls:"bg-teal-50 text-teal-700 border-teal-200",          headline:"Hoàn tiền thành công",             sub:"Tiền đã về tài khoản của bạn" },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtPrice(n:number){ return new Intl.NumberFormat("vi-VN").format(n)+"₫"; }
function discPct(o:number,s:number){ return o>s?Math.round(((o-s)/o)*100):0; }

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRatingPicker({value,onChange}:{value:number;onChange:(n:number)=>void}){
  const [hover,setHover]=useState(0);
  return(
    <div className="flex gap-1.5">
      {[1,2,3,4,5].map(s=>(
        <button key={s}
          onMouseEnter={()=>setHover(s)}
          onMouseLeave={()=>setHover(0)}
          onClick={()=>onChange(s)}
          className="transition-all hover:scale-110">
          <Star size={24} className={s<=(hover||value)?"fill-amber-400 text-amber-400":"fill-gray-200 text-gray-200"}/>
        </button>
      ))}
    </div>
  );
}

function StarRow({rating,size=11}:{rating:number;size?:number}){
  return(
    <span className="inline-flex gap-0.5">
      {[1,2,3,4,5].map(s=>(
        <Star key={s} size={size}
          className={s<=Math.round(rating)?"fill-amber-400 text-amber-400":"fill-gray-200 text-gray-200"}/>
      ))}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OrderDetailPage() {
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [expandTimeline, setExpandTimeline] = useState(false);
  const [reviewingItem,  setReviewingItem]  = useState<string|null>(null);
  const [reviewRating,   setReviewRating]   = useState(5);
  const [reviewText,     setReviewText]     = useState("");
  const [reviewedItems,  setReviewedItems]  = useState<Set<string>>(new Set());
  const [toast,          setToast]          = useState<string|null>(null);
  const [showNote,       setShowNote]       = useState(false);

  const st  = STATUS_CFG[ORDER.status];
  const plt = PLATFORM_CFG[ORDER.platform];

  const doneEvents   = ORDER.tracking.filter(e=>e.done);
  const activeEvent  = ORDER.tracking.find(e=>e.active);
  const shownEvents  = expandTimeline ? ORDER.tracking : [...ORDER.tracking].slice(-4);
  const hasMore      = ORDER.tracking.length > 4;

  function showToast(msg:string){ setToast(msg); setTimeout(()=>setToast(null),2500); }

  function copyTracking(){
    setCopiedTracking(true);
    showToast("Đã sao chép mã vận đơn");
    setTimeout(()=>setCopiedTracking(false),2000);
  }

  function submitReview(itemId:string){
    setReviewedItems(prev=>new Set(prev).add(itemId));
    setReviewingItem(null);
    setReviewText("");
    setReviewRating(5);
    showToast("Đánh giá của bạn đã được gửi! ✓");
  }

  const progressPct = Math.round((doneEvents.length / ORDER.tracking.length)*100);
  const isDelivered = ORDER.status==="delivered";
  const isShipping  = ORDER.status==="shipped"||ORDER.status==="out_for_delivery";
  const isCancelled = ORDER.status==="cancelled";

  return(
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Toast */}
      {toast&&(
        <div className="fixed top-5 right-5 z-50 bg-[#1a1a2e] text-white text-[13px] font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xl">
          <CheckCircle2 size={14} className="text-emerald-400"/>{toast}
        </div>
      )}

      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 h-13 flex items-center gap-3 py-3">
          <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
            <ArrowLeft size={15}/>
          </button>
          <div className="flex items-center gap-1.5 text-[12px] text-gray-400 flex-1">
            <Home size={11}/><ChevronRight size={10}/>
            <span className="hover:text-gray-700 cursor-pointer">Đơn hàng</span>
            <ChevronRight size={10}/>
            <span className="text-gray-700 font-medium">{ORDER.id}</span>
          </div>
          <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
            <Share2 size={14}/>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-5 space-y-4">

        {/* ── Status hero card ── */}
        <div className={cn("rounded-2xl p-5 text-white overflow-hidden relative",
          isDelivered?"bg-gradient-to-br from-emerald-600 to-teal-700":
          isShipping ?"bg-gradient-to-br from-[#1a1a2e] to-[#2d2d4a]":
          isCancelled?"bg-gradient-to-br from-gray-600 to-gray-700":
          "bg-gradient-to-br from-blue-700 to-indigo-800"
        )}>
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2"/>
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2"/>

          <div className="relative">
            {/* Top row */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={cn("text-[11px] font-semibold px-2.5 py-1 rounded-full border",
                    "bg-white/15 border-white/20 text-white")}>
                    {plt.label}
                  </span>
                  <span className="font-mono text-[13px] text-white/80 font-semibold">{ORDER.id}</span>
                </div>
                <h1 className="text-[20px] font-bold text-white leading-tight">{st.headline}</h1>
                <p className="text-white/60 text-[13px] mt-0.5">{st.sub}</p>
              </div>
              {isShipping&&(
                <div className="text-right shrink-0">
                  <p className="text-[11px] text-white/50 mb-0.5">Dự kiến giao</p>
                  <p className="text-[16px] font-bold text-white">{ORDER.estimatedDelivery}</p>
                </div>
              )}
              {isDelivered&&(
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                  <PackageCheck size={28} className="text-white"/>
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-[10px] text-white/50 mb-1.5">
                <span>{doneEvents.length} / {ORDER.tracking.length} bước hoàn thành</span>
                <span>{progressPct}%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-700"
                  style={{width:`${progressPct}%`}}/>
              </div>
            </div>

            {/* Step chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                {icon:Receipt,    label:"Đặt hàng",  done:true },
                {icon:BadgeCheck, label:"Xác nhận",  done:true },
                {icon:Package,    label:"Lấy hàng",  done:true },
                {icon:Truck,      label:"Đang giao", done:true, active:true},
                {icon:CheckCheck, label:"Đã nhận",   done:false},
              ].map(({icon:Icon,label,done,active},i)=>(
                <div key={i} className="flex items-center gap-1.5 shrink-0">
                  <div className={cn("flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition-all",
                    active?"bg-white text-[#1a1a2e]":
                    done?"bg-white/20 text-white border border-white/20":
                    "bg-white/5 text-white/40 border border-white/10")}>
                    <Icon size={11}/>
                    {label}
                  </div>
                  {i<4&&<ChevronRight size={10} className="text-white/30 shrink-0"/>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Live shipper card (when out for delivery / shipped) ── */}
        {isShipping&&(
          <div className="bg-white rounded-2xl border border-violet-200 p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-violet-100 border-2 border-violet-300 flex items-center justify-center shrink-0">
              <Bike size={22} className="text-violet-600"/>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-[13px] font-semibold text-gray-900">Shipper đang giao hàng</p>
                <span className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>LIVE
                </span>
              </div>
              <p className="text-[12px] text-gray-500">Cách bạn khoảng 2.3 km · {ORDER.carrier}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button className="h-9 px-4 text-[12px] font-medium border border-violet-200 text-violet-700 bg-violet-50 rounded-xl hover:bg-violet-100 transition-colors flex items-center gap-1.5">
                <Phone size={12}/> Gọi shipper
              </button>
              <button className="h-9 px-4 text-[12px] font-medium border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                <Navigation size={12}/> Theo dõi GPS
              </button>
            </div>
          </div>
        )}

        {/* ── Main grid ── */}
        <div className="grid grid-cols-[1fr_300px] gap-4 items-start">

          {/* Left column */}
          <div className="space-y-4">

            {/* Tracking timeline */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] font-semibold text-gray-900 flex items-center gap-2">
                  <PackageSearch size={16} className="text-gray-400"/> Hành trình đơn hàng
                </h2>
                {/* Tracking code */}
                {ORDER.trackingCode&&(
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400">{ORDER.carrier}</p>
                      <p className="font-mono text-[11px] text-gray-700 font-semibold">{ORDER.trackingCode}</p>
                    </div>
                    <button onClick={copyTracking}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                      {copiedTracking?<CheckCircle2 size={12} className="text-emerald-500"/>:<Copy size={12}/>}
                    </button>
                    <a href="#" className="w-7 h-7 rounded-lg border border-blue-200 bg-blue-50 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors">
                      <ExternalLink size={11}/>
                    </a>
                  </div>
                )}
              </div>

              {/* Vertical timeline */}
              <div className="relative">
                <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gray-100"/>

                <div className="space-y-0">
                  {(expandTimeline?ORDER.tracking:ORDER.tracking.slice().reverse().slice(0,4).reverse()).map((ev,i,arr)=>(
                    <div key={ev.id} className="flex gap-4 relative pb-5 last:pb-0">
                      {/* Dot */}
                      <div className={cn(
                        "w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 mt-0.5",
                        ev.done&&ev.active  ? "bg-[#1a1a2e] border-[#1a1a2e] shadow-lg shadow-[#1a1a2e]/20" :
                        ev.done&&ev.isKey   ? "bg-emerald-500 border-emerald-500" :
                        ev.done             ? "bg-emerald-400 border-emerald-400" :
                        ev.isKey            ? "bg-white border-gray-300" :
                                              "bg-white border-gray-200"
                      )}>
                        {ev.done&&!ev.active&&ev.isKey   && <CheckCheck size={13} className="text-white"/>}
                        {ev.done&&!ev.active&&!ev.isKey  && <CheckCircle2 size={12} className="text-white"/>}
                        {ev.active                        && <Truck size={13} className="text-white"/>}
                        {!ev.done&&ev.isKey               && <Clock size={12} className="text-gray-400"/>}
                        {!ev.done&&!ev.isKey              && <div className="w-2 h-2 rounded-full bg-gray-200"/>}
                      </div>

                      {/* Content */}
                      <div className={cn("flex-1 min-w-0 pb-0",
                        i<arr.length-1?"":"")}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className={cn("text-[13px] font-semibold leading-tight",
                              ev.active?"text-[#1a1a2e]":ev.done?"text-gray-800":"text-gray-400")}>
                              {ev.label}
                            </p>
                            <p className={cn("text-[12px] mt-0.5 leading-relaxed",
                              ev.done?"text-gray-500":"text-gray-400")}>
                              {ev.desc}
                            </p>
                            {ev.location&&(
                              <p className="text-[11px] text-blue-600 flex items-center gap-1 mt-1">
                                <MapPin size={9}/> {ev.location}
                              </p>
                            )}
                          </div>
                          <span className={cn("text-[10px] whitespace-nowrap mt-0.5 shrink-0",
                            ev.active?"text-[#1a1a2e] font-semibold":ev.done?"text-gray-400":"text-gray-300")}>
                            {ev.time}
                          </span>
                        </div>
                        {/* Active pulse indicator */}
                        {ev.active&&(
                          <div className="mt-2 flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-lg px-3 py-2">
                            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse shrink-0"/>
                            <span className="text-[11px] text-violet-700 font-medium">Đang cập nhật vị trí theo thời gian thực</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Expand / collapse */}
                {hasMore&&(
                  <button onClick={()=>setExpandTimeline(v=>!v)}
                    className="mt-3 w-full flex items-center justify-center gap-1.5 text-[12px] text-blue-600 border border-blue-100 bg-blue-50 py-2 rounded-xl hover:bg-blue-100 transition-colors">
                    {expandTimeline
                      ?<><ChevronUp size={13}/> Thu gọn lịch sử</>
                      :<><ChevronDown size={13}/> Xem toàn bộ {ORDER.tracking.length} sự kiện</>
                    }
                  </button>
                )}
              </div>
            </div>

            {/* Items list + review */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="text-[15px] font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package size={15} className="text-gray-400"/>
                Sản phẩm ({ORDER.items.length})
              </h2>

              <div className="space-y-3">
                {ORDER.items.map(item=>{
                  const disc = discPct(item.originalPrice, item.price);
                  const isReviewed = reviewedItems.has(item.id) || item.reviewed;
                  const isReviewing = reviewingItem===item.id;

                  return(
                    <div key={item.id} className={cn(
                      "rounded-xl border transition-all overflow-hidden",
                      isReviewing?"border-amber-200":"border-gray-100"
                    )}>
                      <div className="flex items-center gap-4 p-3.5">
                        {/* Product image */}
                        <div className="relative w-16 h-16 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-3xl shrink-0">
                          {item.image}
                          {disc>0&&(
                            <span className="absolute -top-1.5 -right-1.5 text-[8px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">-{disc}%</span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-gray-900 line-clamp-1 mb-0.5">{item.name}</p>
                          <p className="text-[11px] text-gray-400 mb-1.5">{item.brandEmoji} {item.brand} · {item.variant}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-bold text-red-600">{fmtPrice(item.price)}</span>
                            {item.originalPrice>item.price&&(
                              <span className="text-[11px] text-gray-400 line-through">{fmtPrice(item.originalPrice)}</span>
                            )}
                            <span className="text-[11px] text-gray-400">× {item.qty}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <button className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-blue-600 transition-colors">
                            <Eye size={11}/> Xem SP
                          </button>
                          {isDelivered&&(
                            isReviewed?(
                              <div className="flex items-center gap-1 text-[10px] text-emerald-600">
                                <CheckCircle2 size={10}/> Đã đánh giá
                              </div>
                            ):(
                              <button
                                onClick={()=>setReviewingItem(isReviewing?null:item.id)}
                                className={cn(
                                  "flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg border transition-all",
                                  isReviewing
                                    ?"bg-amber-500 text-white border-amber-500"
                                    :"border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100"
                                )}>
                                <Star size={11}/> Đánh giá
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      {/* Review form */}
                      {isReviewing&&(
                        <div className="border-t border-amber-100 bg-amber-50/30 p-4 space-y-3">
                          <p className="text-[13px] font-semibold text-gray-800">
                            Đánh giá: <span className="text-gray-600 font-normal">{item.name}</span>
                          </p>

                          {/* Star picker */}
                          <div className="flex items-center gap-3">
                            <StarRatingPicker value={reviewRating} onChange={setReviewRating}/>
                            <span className="text-[13px] text-gray-500">
                              {["","Rất tệ","Tệ","Bình thường","Tốt","Xuất sắc"][reviewRating]}
                            </span>
                          </div>

                          {/* Text */}
                          <textarea
                            value={reviewText}
                            onChange={e=>setReviewText(e.target.value)}
                            rows={3}
                            placeholder={`Chia sẻ trải nghiệm về ${item.name}...`}
                            className="w-full text-[13px] border border-gray-200 bg-white rounded-xl px-3 py-2.5 outline-none focus:border-[#1a1a2e] resize-none placeholder:text-gray-400 transition-colors leading-relaxed"
                          />

                          {/* Upload photo hint */}
                          <button className="flex items-center gap-2 text-[12px] text-gray-500 border border-dashed border-gray-300 rounded-xl px-3 py-2 hover:border-gray-400 transition-colors w-full">
                            <Camera size={14} className="text-gray-400"/>
                            Thêm ảnh thực tế (tùy chọn)
                          </button>

                          {/* Submit row */}
                          <div className="flex gap-2 pt-1">
                            <Button onClick={()=>submitReview(item.id)} size="sm"
                              className="h-9 bg-amber-500 hover:bg-amber-600 text-white text-[12px] gap-1.5 flex-1">
                              <Star size={12}/> Gửi đánh giá
                            </Button>
                            <Button onClick={()=>{setReviewingItem(null);setReviewText("");}} size="sm"
                              variant="outline" className="h-9 text-[12px] border-gray-200">
                              Huỷ
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Note (if any) */}
            {ORDER.note&&(
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2.5">
                <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5"/>
                <div>
                  <p className="text-[12px] font-semibold text-amber-800 mb-0.5">Ghi chú đơn hàng</p>
                  <p className="text-[12px] text-amber-700">{ORDER.note}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-4">

            {/* Delivery address */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <h3 className="text-[13px] font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin size={14} className="text-gray-400"/> Địa chỉ nhận hàng
              </h3>
              <div className="space-y-1.5">
                <p className="text-[13px] font-semibold text-gray-900">{ORDER.address.name}</p>
                <p className="text-[12px] text-gray-500 flex items-center gap-1.5"><Phone size={11}/>{ORDER.address.phone}</p>
                <p className="text-[12px] text-gray-500 leading-relaxed">
                  {ORDER.address.line1}, {ORDER.address.ward}, {ORDER.address.district}, {ORDER.address.city}
                </p>
              </div>
            </div>

            {/* Payment & order info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
              <h3 className="text-[13px] font-semibold text-gray-900 flex items-center gap-2">
                <Receipt size={14} className="text-gray-400"/> Thông tin đơn hàng
              </h3>

              {/* Info rows */}
              <div className="space-y-2">
                {[
                  {label:"Mã đơn hàng",   value:ORDER.id,              mono:true  },
                  {label:"Đặt lúc",        value:ORDER.placedAt,        mono:false },
                  {label:"Thanh toán",     value:ORDER.paymentMethod,   mono:false },
                  {label:"Trạng thái TT",  value:ORDER.paymentStatus,   mono:false },
                  {label:"Sàn TMĐT",       value:PLATFORM_CFG[ORDER.platform].label, mono:false },
                ].map(({label,value,mono})=>(
                  <div key={label} className="flex items-center justify-between text-[12px]">
                    <span className="text-gray-400">{label}</span>
                    <span className={cn("font-medium text-gray-800", mono&&"font-mono text-[11px]")}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div className="border-t border-gray-100 pt-3 space-y-1.5">
                <div className="flex justify-between text-[12px]">
                  <span className="text-gray-500">Tạm tính ({ORDER.items.length} sp)</span>
                  <span className="text-gray-700 font-medium">{fmtPrice(ORDER.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-gray-500 flex items-center gap-1"><Truck size={10}/>Phí vận chuyển</span>
                  <span className={cn("font-medium", ORDER.shippingFee===0?"text-emerald-600":"text-gray-700")}>
                    {ORDER.shippingFee===0?"Miễn phí":fmtPrice(ORDER.shippingFee)}
                  </span>
                </div>
                {ORDER.discount>0&&(
                  <div className="flex justify-between text-[12px] text-emerald-600">
                    <span className="flex items-center gap-1"><Tag size={10}/>Giảm ({ORDER.voucherCode})</span>
                    <span className="font-medium">-{fmtPrice(ORDER.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-1.5 border-t border-gray-100">
                  <span className="text-[13px] font-semibold text-gray-900">Tổng cộng</span>
                  <span className="text-[18px] font-bold text-red-600">{fmtPrice(ORDER.total)}</span>
                </div>
                {ORDER.earnedPoints>0&&(
                  <p className="text-[11px] text-amber-600 flex items-center gap-1">
                    <Gift size={10}/>+{ORDER.earnedPoints} điểm thưởng
                  </p>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              {isDelivered&&(
                <>
                  <Button className="w-full h-10 bg-[#1a1a2e] hover:bg-[#2d2d4a] text-white text-[13px] gap-2">
                    <ShoppingCart size={14}/> Mua lại đơn hàng
                  </Button>
                  <Button variant="outline" className="w-full h-10 border-gray-200 text-gray-600 text-[13px] gap-2 hover:bg-gray-50">
                    <RotateCcw size={14}/> Yêu cầu đổi/trả hàng
                  </Button>
                </>
              )}
              {ORDER.canCancel&&(
                <Button variant="outline" className="w-full h-10 border-red-200 text-red-600 text-[13px] gap-2 hover:bg-red-50">
                  <XCircle size={14}/> Huỷ đơn hàng
                </Button>
              )}
              <Button variant="outline" className="w-full h-10 border-gray-200 text-gray-600 text-[13px] gap-2 hover:bg-gray-50">
                <Download size={14}/> Tải hoá đơn PDF
              </Button>
              <Button variant="outline" className="w-full h-10 border-gray-200 text-gray-600 text-[13px] gap-2 hover:bg-gray-50">
                <MessageSquare size={14}/> Liên hệ hỗ trợ
              </Button>
            </div>

            {/* Trust badges */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
              {[
                {icon:Shield,    text:"Hàng chính hãng được xác nhận"},
                {icon:RotateCcw, text:"Đổi trả trong 30 ngày"},
                {icon:RefreshCw, text:"Hoàn tiền nhanh nếu có vấn đề"},
              ].map(({icon:Icon,text})=>(
                <div key={text} className="flex items-center gap-2.5 text-[12px] text-gray-500">
                  <Icon size={13} className="text-gray-400 shrink-0"/>{text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}