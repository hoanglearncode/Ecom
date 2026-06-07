"use client";

import { useState } from "react";
import {
  ShoppingCart, Trash2, Plus, Minus, Tag, Truck,
  ChevronRight, CheckCircle2, AlertTriangle, Gift,
  Heart, RotateCcw, Shield, Zap, X, Star, Copy,
  BadgePercent, Clock, MapPin, ChevronDown, Package,
  CreditCard, Smartphone, Building2, Percent, Info,
  ArrowRight, Sparkles, TrendingDown, Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Platform = "shopee" | "lazada" | "tiki" | "sendo";

interface CartItem {
  id: string;
  name: string;
  image: string;
  brand: string;
  brandEmoji: string;
  variant: string;
  price: number;
  originalPrice: number;
  qty: number;
  maxQty: number;
  stock: number;
  isFlash: boolean;
  flashEndMins: number;
  platform: Platform;
  rating: number;
  reviewCount: number;
  checked: boolean;
  freeShipThreshold: number;
}

interface CartGroup {
  platform: Platform;
  items: CartItem[];
  voucher: string | null;
  shippingFee: number;
  shippingMethod: string;
}

interface Voucher {
  code: string;
  label: string;
  type: "percent" | "fixed" | "freeship";
  value: number;
  minOrder: number;
  expiry: string;
  cls: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_GROUPS: CartGroup[] = [
  {
    platform: "shopee",
    shippingFee: 0,
    shippingMethod: "Nhanh",
    voucher: "SUMMER40",
    items: [
      {
        id: "C001", name: "Biti's Hunter X Street 2026 – Phiên Bản Hè",
        image: "👟", brand: "Biti's Hunter", brandEmoji: "👟",
        variant: "Xanh Navy · Size 41",
        price: 449000, originalPrice: 749000,
        qty: 1, maxQty: 5, stock: 12,
        isFlash: true, flashEndMins: 47,
        platform: "shopee", rating: 4.9, reviewCount: 12400,
        checked: true, freeShipThreshold: 0,
      },
      {
        id: "C002", name: "Dép Biti's Nữ Quai Ngang Premium Pastel",
        image: "🩴", brand: "Biti's Hunter", brandEmoji: "👟",
        variant: "Hồng Pastel · Size 37",
        price: 299000, originalPrice: 299000,
        qty: 2, maxQty: 10, stock: 43,
        isFlash: false, flashEndMins: 0,
        platform: "shopee", rating: 4.7, reviewCount: 8100,
        checked: true, freeShipThreshold: 0,
      },
    ],
  },
  {
    platform: "lazada",
    shippingFee: 25000,
    shippingMethod: "Tiêu chuẩn",
    voucher: null,
    items: [
      {
        id: "C003", name: "Shiseido Vital Perfection White Revitalizing Cream 50ml",
        image: "💆", brand: "Shiseido Vietnam", brandEmoji: "💄",
        variant: "50ml · Hộp chính hãng",
        price: 620000, originalPrice: 980000,
        qty: 1, maxQty: 3, stock: 87,
        isFlash: false, flashEndMins: 0,
        platform: "lazada", rating: 4.7, reviewCount: 3400,
        checked: true, freeShipThreshold: 500000,
      },
      {
        id: "C004", name: "Samsung Galaxy S24 FE – 128GB Tím",
        image: "📱", brand: "Samsung Electronics", brandEmoji: "📱",
        variant: "128GB · Màu Tím Pha Lê",
        price: 8490000, originalPrice: 12990000,
        qty: 1, maxQty: 1, stock: 5,
        isFlash: true, flashEndMins: 47,
        platform: "lazada", rating: 4.8, reviewCount: 6200,
        checked: false, freeShipThreshold: 0,
      },
    ],
  },
  {
    platform: "tiki",
    shippingFee: 0,
    shippingMethod: "TikiNOW 2h",
    voucher: null,
    items: [
      {
        id: "C005", name: "Nike Air Max 270 Nam – Chính Hãng",
        image: "🏃", brand: "Nike Vietnam", brandEmoji: "🏃",
        variant: "Cam/Đen · Size 42",
        price: 2190000, originalPrice: 3490000,
        qty: 1, maxQty: 3, stock: 32,
        isFlash: false, flashEndMins: 0,
        platform: "tiki", rating: 4.9, reviewCount: 8800,
        checked: true, freeShipThreshold: 0,
      },
    ],
  },
];

const VOUCHERS: Voucher[] = [
  { code: "SUMMER40",  label: "Giảm 40%",      type: "percent",  value: 40, minOrder: 300000,  expiry: "Hết hôm nay", cls: "bg-red-50 border-red-200 text-red-800" },
  { code: "SHIP0",     label: "Free ship",      type: "freeship", value: 0,  minOrder: 0,       expiry: "Còn 2 ngày",  cls: "bg-emerald-50 border-emerald-200 text-emerald-800" },
  { code: "SAVE150K",  label: "Giảm 150k",      type: "fixed",    value: 150000, minOrder: 1500000, expiry: "Còn 3 ngày", cls: "bg-blue-50 border-blue-200 text-blue-800" },
];

const SUGGESTED = [
  { id: "S1", name: "Biti's Hunter Lite Go 188g",     image: "🏃", price: "379k", brand: "Biti's",   rating: 4.8 },
  { id: "S2", name: "Shiseido SPF50 Sunscreen 150ml", image: "🌿", price: "380k", brand: "Shiseido", rating: 4.9 },
  { id: "S3", name: "Canifa Áo Len Oversize Premium", image: "🧥", price: "299k", brand: "Canifa",   rating: 4.6 },
  { id: "S4", name: "G7 Cà Phê 3in1 Hộp 100 Gói",    image: "☕", price: "79k",  brand: "Trung Nguyên", rating: 4.8 },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const PLATFORM_CFG: Record<Platform, { label: string; cls: string; tagline: string; color: string }> = {
  shopee: { label: "Shopee",  cls: "bg-orange-50 text-orange-700 border-orange-200", tagline: "Mua sắm không lo", color: "#f97316" },
  lazada: { label: "Lazada",  cls: "bg-pink-50 text-pink-700 border-pink-200",       tagline: "Lazada xác nhận",   color: "#ec4899" },
  tiki:   { label: "Tiki",    cls: "bg-blue-50 text-blue-700 border-blue-200",       tagline: "TikiNOW siêu tốc",  color: "#3b82f6" },
  sendo:  { label: "Sendo",   cls: "bg-green-50 text-green-700 border-green-200",    tagline: "Sendo đảm bảo",     color: "#22c55e" },
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
    <span className="inline-flex gap-0.5">
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
  return (
    <span className="inline-flex items-center gap-0.5 text-[11px] font-mono font-semibold text-red-600">
      {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:47
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CartPage() {
  const [groups, setGroups]         = useState<CartGroup[]>(INITIAL_GROUPS);
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState<Voucher | null>(null);
  const [couponError, setCouponError] = useState("");
  const [showVoucherPicker, setShowVoucherPicker] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("momo");
  const [showMore, setShowMore]     = useState(false);

  // ── helpers ──────────────────────────────────────────────────────────────

  function updateQty(gIdx: number, iIdx: number, delta: number) {
    setGroups(prev => prev.map((g, gi) => gi !== gIdx ? g : {
      ...g,
      items: g.items.map((item, ii) => ii !== iIdx ? item : {
        ...item,
        qty: Math.max(1, Math.min(item.maxQty, item.qty + delta)),
      }),
    }));
  }

  function removeItem(gIdx: number, iIdx: number) {
    setGroups(prev => prev.map((g, gi) => gi !== gIdx ? g : {
      ...g,
      items: g.items.filter((_, ii) => ii !== iIdx),
    }).filter(g => g.items.length > 0));
  }

  function toggleItem(gIdx: number, iIdx: number) {
    setGroups(prev => prev.map((g, gi) => gi !== gIdx ? g : {
      ...g,
      items: g.items.map((item, ii) => ii !== iIdx ? item : { ...item, checked: !item.checked }),
    }));
  }

  function toggleGroup(gIdx: number, val: boolean) {
    setGroups(prev => prev.map((g, gi) => gi !== gIdx ? g : {
      ...g,
      items: g.items.map(item => ({ ...item, checked: val })),
    }));
  }

  function applyVoucher(code: string) {
    const v = VOUCHERS.find(v => v.code.toUpperCase() === code.toUpperCase());
    if (!v) { setCouponError("Mã không hợp lệ hoặc đã hết hạn"); setCouponApplied(null); return; }
    if (subtotal < v.minOrder) { setCouponError(`Đơn tối thiểu ${fmtPrice(v.minOrder)} để dùng mã này`); setCouponApplied(null); return; }
    setCouponApplied(v); setCouponError(""); setCouponInput("");
  }

  // ── calculations ──────────────────────────────────────────────────────────

  const allItems = groups.flatMap(g => g.items);
  const checkedItems = allItems.filter(i => i.checked);
  const allChecked   = allItems.length > 0 && allItems.every(i => i.checked);
  const subtotal     = checkedItems.reduce((s, i) => s + i.price * i.qty, 0);
  const originalTotal = checkedItems.reduce((s, i) => s + i.originalPrice * i.qty, 0);
  const totalSaved   = originalTotal - subtotal;

  let voucherDiscount = 0;
  if (couponApplied) {
    if (couponApplied.type === "percent")  voucherDiscount = Math.round(subtotal * couponApplied.value / 100);
    if (couponApplied.type === "fixed")    voucherDiscount = couponApplied.value;
    if (couponApplied.type === "freeship") voucherDiscount = groups.reduce((s, g) => s + g.shippingFee, 0);
  }

  const shippingTotal  = couponApplied?.type === "freeship"
    ? 0
    : groups.reduce((s, g) => {
        const gChecked = g.items.some(i => i.checked);
        return gChecked ? s + g.shippingFee : s;
      }, 0);

  const grandTotal = Math.max(0, subtotal + shippingTotal - (couponApplied?.type !== "freeship" ? voucherDiscount : 0));
  const totalItemCount = checkedItems.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Top bar ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-3">
          <ShoppingCart size={18} className="text-gray-700" />
          <h1 className="text-[15px] font-semibold text-gray-900">Giỏ hàng</h1>
          <span className="text-[13px] text-gray-400">({allItems.length} sản phẩm)</span>
          <div className="flex-1" />
          <button className="text-[12px] text-blue-600 hover:underline flex items-center gap-1">
            Tiếp tục mua sắm <ChevronRight size={12} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-[1fr_340px] gap-5 items-start">

          {/* ── Left: cart items ── */}
          <div className="space-y-3 min-w-0">

            {/* Select all row */}
            <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-3">
              <button
                onClick={() => setGroups(prev => prev.map(g => ({ ...g, items: g.items.map(i => ({ ...i, checked: !allChecked })) })))}
                className={cn("w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all",
                  allChecked ? "bg-[#1a1a2e] border-[#1a1a2e]" : "bg-white border-gray-300 hover:border-gray-400")}>
                {allChecked && <CheckCircle2 size={12} className="text-white" />}
              </button>
              <span className="text-[13px] font-medium text-gray-700">Chọn tất cả ({allItems.length} sản phẩm)</span>
              <div className="flex items-center gap-2 ml-auto">
                {checkedItems.length > 0 && (
                  <>
                    <button className="flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-gray-700 border border-gray-200 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                      <Heart size={12} /> Lưu để sau
                    </button>
                    <button
                      onClick={() => {
                        setGroups(prev => prev.map(g => ({ ...g, items: g.items.filter(i => !i.checked) })).filter(g => g.items.length > 0));
                      }}
                      className="flex items-center gap-1.5 text-[12px] text-red-600 hover:text-red-700 border border-red-100 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 size={12} /> Xoá đã chọn
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Cart groups */}
            {groups.map((group, gIdx) => {
              const plt       = PLATFORM_CFG[group.platform];
              const grpChecked = group.items.filter(i => i.checked).length;
              const grpAll     = group.items.length;
              const grpTotal   = group.items.filter(i => i.checked).reduce((s, i) => s + i.price * i.qty, 0);
              const freeShipRemaining = group.items[0]?.freeShipThreshold > 0
                ? Math.max(0, group.items[0].freeShipThreshold - grpTotal)
                : 0;

              return (
                <div key={group.platform} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  {/* Group header */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <button
                      onClick={() => toggleGroup(gIdx, grpChecked !== grpAll)}
                      className={cn("w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all",
                        grpChecked === grpAll ? "bg-[#1a1a2e] border-[#1a1a2e]" :
                        grpChecked > 0        ? "bg-gray-300 border-gray-300" :
                        "bg-white border-gray-300 hover:border-gray-400")}>
                      {grpChecked === grpAll && <CheckCircle2 size={12} className="text-white" />}
                    </button>
                    <span className={cn("text-[12px] font-semibold px-2 py-0.5 rounded border", plt.cls)}>
                      {plt.label}
                    </span>
                    <span className="text-[12px] text-gray-400">{plt.tagline}</span>

                    {/* Free ship progress */}
                    {freeShipRemaining > 0 && (
                      <div className="flex items-center gap-1.5 ml-2">
                        <Truck size={12} className="text-emerald-500" />
                        <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 rounded-full"
                            style={{ width: `${Math.round((1 - freeShipRemaining / group.items[0].freeShipThreshold) * 100)}%` }} />
                        </div>
                        <span className="text-[10px] text-emerald-600 font-medium">
                          Thêm {fmtPrice(freeShipRemaining)} để Free ship
                        </span>
                      </div>
                    )}
                    {group.shippingFee === 0 && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-600 ml-auto">
                        <Truck size={10} /> Free ship
                      </span>
                    )}
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-gray-50">
                    {group.items.map((item, iIdx) => {
                      const disc = discPct(item.originalPrice, item.price);
                      return (
                        <div key={item.id}
                          className={cn("flex gap-3 px-4 py-4 transition-colors",
                            !item.checked ? "opacity-60 bg-gray-50/50" : "")}>

                          {/* Checkbox */}
                          <button onClick={() => toggleItem(gIdx, iIdx)}
                            className={cn("w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-1 transition-all",
                              item.checked ? "bg-[#1a1a2e] border-[#1a1a2e]" : "bg-white border-gray-300 hover:border-gray-400")}>
                            {item.checked && <CheckCircle2 size={12} className="text-white" />}
                          </button>

                          {/* Image */}
                          <div className="relative w-16 h-16 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-3xl shrink-0">
                            {item.image}
                            {disc > 0 && (
                              <span className="absolute -top-1.5 -right-1.5 text-[9px] bg-red-500 text-white px-1 py-0.5 rounded font-semibold">
                                -{disc}%
                              </span>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 mb-1">
                              <p className="text-[13px] font-medium text-gray-900 line-clamp-2 flex-1 leading-tight">{item.name}</p>
                              <button onClick={() => removeItem(gIdx, iIdx)}
                                className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors shrink-0 mt-0.5">
                                <X size={12} />
                              </button>
                            </div>

                            {/* Variant + badges */}
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{item.variant}</span>
                              {item.isFlash && (
                                <span className="text-[10px] text-red-600 flex items-center gap-0.5 font-medium">
                                  <Zap size={9} className="fill-red-500 text-red-500" />
                                  Flash · <Countdown minutes={item.flashEndMins} />
                                </span>
                              )}
                              {item.stock <= 10 && (
                                <span className="text-[10px] text-amber-600 flex items-center gap-0.5">
                                  <AlertTriangle size={9} /> Còn {item.stock} sp
                                </span>
                              )}
                            </div>

                            {/* Star */}
                            <div className="flex items-center gap-1.5 mb-2">
                              <StarRow rating={item.rating} />
                              <span className="text-[10px] text-gray-400">({item.reviewCount.toLocaleString()})</span>
                            </div>

                            {/* Price + qty row */}
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-[15px] font-bold text-red-600">{fmtPrice(item.price)}</span>
                                {item.originalPrice > item.price && (
                                  <span className="text-[11px] text-gray-400 line-through">{fmtPrice(item.originalPrice)}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <button onClick={() => removeItem(gIdx, iIdx)}
                                  className="text-[11px] text-gray-400 hover:text-gray-600 flex items-center gap-0.5 hover:underline">
                                  <Heart size={10} /> Lưu
                                </button>
                                {/* Qty stepper */}
                                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                  <button onClick={() => updateQty(gIdx, iIdx, -1)}
                                    disabled={item.qty <= 1}
                                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors">
                                    <Minus size={11} />
                                  </button>
                                  <span className="w-8 h-7 flex items-center justify-center text-[13px] font-semibold text-gray-900 border-x border-gray-200">
                                    {item.qty}
                                  </span>
                                  <button onClick={() => updateQty(gIdx, iIdx, 1)}
                                    disabled={item.qty >= item.maxQty}
                                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors">
                                    <Plus size={11} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Group footer: voucher + shipping */}
                  <div className="px-4 pb-3 pt-2 flex items-center gap-3 border-t border-gray-50">
                    <div className="flex items-center gap-2 flex-1">
                      <Tag size={12} className="text-gray-400 shrink-0" />
                      {group.voucher ? (
                        <span className="flex items-center gap-1.5 text-[11px] text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-lg font-medium">
                          {group.voucher}
                          <button onClick={() => setGroups(prev => prev.map((g, i) => i === gIdx ? { ...g, voucher: null } : g))}>
                            <X size={9} />
                          </button>
                        </span>
                      ) : (
                        <button className="text-[11px] text-blue-600 hover:underline">Thêm mã shop</button>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                      <Truck size={11} />
                      <span>{group.shippingMethod}</span>
                      <span className={group.shippingFee === 0 ? "text-emerald-600 font-medium" : ""}>
                        {group.shippingFee === 0 ? "Miễn phí" : fmtPrice(group.shippingFee)}
                      </span>
                      <button className="text-blue-600 hover:underline ml-1">Đổi</button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Suggested products */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="text-[14px] font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-violet-500" />
                Có thể bạn cũng thích
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {SUGGESTED.map(p => (
                  <div key={p.id}
                    className="p-2.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/60 cursor-pointer transition-all group">
                    <div className="w-full h-16 bg-gray-50 rounded-lg flex items-center justify-center text-3xl mb-2">{p.image}</div>
                    <p className="text-[11px] font-medium text-gray-800 line-clamp-2 leading-tight mb-1">{p.name}</p>
                    <p className="text-[10px] text-gray-400 mb-1">{p.brand}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-bold text-red-600">{p.price}</p>
                      <button className="w-6 h-6 rounded-full bg-[#1a1a2e] flex items-center justify-center text-white hover:bg-[#2d2d4a] transition-colors">
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: order summary ── */}
          <div className="space-y-3 sticky top-20">

            {/* Voucher input */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="text-[13px] font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <BadgePercent size={14} className="text-violet-600" /> Mã giảm giá
              </h3>
              <div className="flex gap-2 mb-2">
                <input
                  value={couponInput}
                  onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                  onKeyDown={e => e.key === "Enter" && applyVoucher(couponInput)}
                  placeholder="Nhập mã giảm giá"
                  className="flex-1 text-[13px] border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#1a1a2e] transition-colors placeholder:text-gray-400"
                />
                <Button size="sm" onClick={() => applyVoucher(couponInput)}
                  className="h-9 bg-[#1a1a2e] hover:bg-[#2d2d4a] text-white text-[12px] px-4 shrink-0">
                  Áp dụng
                </Button>
              </div>
              {couponError && <p className="text-[11px] text-red-600 flex items-center gap-1"><AlertTriangle size={10} />{couponError}</p>}
              {couponApplied && (
                <div className="flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg">
                  <CheckCircle2 size={11} /> Mã <span className="font-semibold">{couponApplied.code}</span> – {couponApplied.label}
                  <button onClick={() => setCouponApplied(null)} className="ml-auto"><X size={10} /></button>
                </div>
              )}
              <button
                onClick={() => setShowVoucherPicker(v => !v)}
                className="mt-2 text-[11px] text-blue-600 hover:underline flex items-center gap-1">
                Xem mã có sẵn ({VOUCHERS.length}) {showVoucherPicker ? <ChevronDown size={11} className="rotate-180" /> : <ChevronDown size={11} />}
              </button>
              {showVoucherPicker && (
                <div className="mt-2 space-y-2">
                  {VOUCHERS.map(v => (
                    <div key={v.code} className={cn("flex items-center justify-between p-2.5 rounded-lg border text-[11px]", v.cls)}>
                      <div>
                        <p className="font-semibold">{v.label} <span className="font-mono">{v.code}</span></p>
                        <p className="opacity-70">Tối thiểu {fmtPrice(v.minOrder)} · {v.expiry}</p>
                      </div>
                      <button onClick={() => { applyVoucher(v.code); setShowVoucherPicker(false); }}
                        className="text-[10px] font-medium bg-white/70 hover:bg-white px-2 py-0.5 rounded border border-current/20 transition-colors whitespace-nowrap">
                        Dùng
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="text-[13px] font-semibold text-gray-900 mb-3">Tóm tắt đơn hàng</h3>
              <div className="space-y-2 text-[13px]">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính ({totalItemCount} sp)</span>
                  <span className="font-medium text-gray-800">{fmtPrice(subtotal)}</span>
                </div>
                {totalSaved > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="flex items-center gap-1"><TrendingDown size={12} />Giảm từ giá gốc</span>
                    <span className="font-medium">-{fmtPrice(totalSaved)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1"><Truck size={12} />Phí vận chuyển</span>
                  <span className={cn("font-medium", shippingTotal === 0 ? "text-emerald-600" : "text-gray-800")}>
                    {shippingTotal === 0 ? "Miễn phí" : fmtPrice(shippingTotal)}
                  </span>
                </div>
                {couponApplied && couponApplied.type !== "freeship" && voucherDiscount > 0 && (
                  <div className="flex justify-between text-violet-600">
                    <span className="flex items-center gap-1"><Tag size={12} />Mã {couponApplied.code}</span>
                    <span className="font-medium">-{fmtPrice(voucherDiscount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between">
                  <span className="text-[14px] font-semibold text-gray-900">Tổng cộng</span>
                  <div className="text-right">
                    <p className="text-[18px] font-bold text-red-600">{fmtPrice(grandTotal)}</p>
                    {(totalSaved + voucherDiscount) > 0 && (
                      <p className="text-[10px] text-emerald-600">Tiết kiệm {fmtPrice(totalSaved + voucherDiscount)}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Points notice */}
              <div className="mt-3 p-2.5 bg-amber-50 border border-amber-100 rounded-lg flex items-center gap-2 text-[11px] text-amber-700">
                <Gift size={12} className="shrink-0" />
                <span>Bạn sẽ nhận <span className="font-semibold">{Math.floor(grandTotal / 10000)} điểm</span> từ đơn hàng này</span>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="text-[13px] font-semibold text-gray-900 mb-3">Phương thức thanh toán</h3>
              <div className="space-y-2">
                {[
                  { key: "momo",    icon: "💜", label: "Ví MoMo",             sub: "Hoàn tiền 1%" },
                  { key: "zalopay", icon: "💙", label: "ZaloPay",             sub: "Hoàn tiền 0.5%" },
                  { key: "visa",    icon: "💳", label: "Thẻ Visa •••• 4242",  sub: "" },
                  { key: "cod",     icon: "💵", label: "Thanh toán khi nhận", sub: "Tiền mặt / Quẹt thẻ" },
                ].map(({ key, icon, label, sub }) => (
                  <button key={key} onClick={() => setSelectedPayment(key)}
                    className={cn(
                      "w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left",
                      selectedPayment === key ? "border-[#1a1a2e] bg-[#1a1a2e]/3" : "border-gray-100 hover:border-gray-200"
                    )}>
                    <span className="text-xl shrink-0">{icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-gray-900">{label}</p>
                      {sub && <p className="text-[10px] text-emerald-600">{sub}</p>}
                    </div>
                    <div className={cn("w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center",
                      selectedPayment === key ? "border-[#1a1a2e]" : "border-gray-300")}>
                      {selectedPayment === key && <div className="w-2 h-2 rounded-full bg-[#1a1a2e]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Checkout CTA */}
            <div className="space-y-2">
              <Button
                disabled={checkedItems.length === 0}
                className="w-full h-12 bg-[#1a1a2e] hover:bg-[#2d2d4a] text-white text-[14px] font-semibold gap-2 disabled:opacity-40 rounded-xl">
                Đặt hàng ngay ({totalItemCount} sp)
                <ArrowRight size={16} />
              </Button>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                <Lock size={10} /> Thanh toán được mã hoá & bảo mật
              </div>
            </div>

            {/* Trust row */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Shield,    label: "Hàng chính hãng" },
                { icon: RotateCcw, label: "Đổi trả 30 ngày" },
                { icon: Truck,     label: "Ship toàn quốc"  },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 p-2 bg-white border border-gray-100 rounded-xl text-center">
                  <Icon size={14} className="text-gray-400" />
                  <p className="text-[10px] text-gray-500 leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}