"use client";

import { useState } from "react";
import {
  ChevronRight, ChevronLeft, CheckCircle2, MapPin, Truck,
  CreditCard, Shield, Lock, Package, Tag, Gift, Zap,
  Plus, Edit, AlertTriangle, Home, Building2, Phone,
  Mail, User, Clock, Star, RotateCcw, ChevronDown,
  Copy, Smartphone, Banknote, QrCode, ArrowRight,
  Check, Sparkles, TrendingDown, Info, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step        = "address" | "shipping" | "payment" | "review" | "success";
type PayMethod   = "momo" | "zalopay" | "visa" | "mastercard" | "cod" | "banking";
type ShipMethod  = "standard" | "fast" | "express" | "tikinow";
type Platform    = "shopee" | "lazada" | "tiki" | "sendo";

interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
  type: "home" | "office" | "other";
}

interface OrderItem {
  id: string;
  name: string;
  image: string;
  brand: string;
  variant: string;
  price: number;
  originalPrice: number;
  qty: number;
  platform: Platform;
}

interface ShippingOption {
  key: ShipMethod;
  label: string;
  desc: string;
  price: number;
  eta: string;
  badge?: string;
  popular?: boolean;
}

interface PaymentOption {
  key: PayMethod;
  icon: string;
  label: string;
  sub?: string;
  cashback?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ADDRESSES: Address[] = [
  {
    id: "A1", label: "Nhà riêng", name: "Nguyễn Thị Lan", phone: "0912 345 678",
    address: "12 Phố Huế", ward: "Phường Phố Huế", district: "Hai Bà Trưng", city: "Hà Nội",
    isDefault: true, type: "home",
  },
  {
    id: "A2", label: "Văn phòng", name: "Nguyễn Thị Lan", phone: "0912 345 678",
    address: "285 Cách Mạng Tháng 8", ward: "Phường 12", district: "Quận 10", city: "TP.HCM",
    isDefault: false, type: "office",
  },
];

const ORDER_ITEMS: OrderItem[] = [
  {
    id: "OI1", name: "Biti's Hunter X Street 2026 – Phiên Bản Hè", image: "👟",
    brand: "Biti's Hunter", variant: "Xanh Navy · Size 41",
    price: 449000, originalPrice: 749000, qty: 1, platform: "shopee",
  },
  {
    id: "OI2", name: "Dép Biti's Nữ Quai Ngang Premium Pastel", image: "🩴",
    brand: "Biti's Hunter", variant: "Hồng Pastel · Size 37",
    price: 299000, originalPrice: 299000, qty: 2, platform: "shopee",
  },
  {
    id: "OI3", name: "Shiseido Vital Perfection Cream 50ml", image: "💆",
    brand: "Shiseido VN", variant: "50ml · Chính hãng",
    price: 620000, originalPrice: 980000, qty: 1, platform: "lazada",
  },
];

const SHIPPING_OPTIONS: ShippingOption[] = [
  { key: "standard", label: "Tiêu chuẩn",   desc: "Giao hàng thông thường",   price: 25000,  eta: "3–5 ngày" },
  { key: "fast",     label: "Nhanh",         desc: "Ưu tiên xử lý",            price: 35000,  eta: "1–2 ngày", popular: true },
  { key: "express",  label: "Hoả tốc",       desc: "Giao trong ngày",          price: 55000,  eta: "Trong ngày",  badge: "Nhanh nhất" },
  { key: "tikinow",  label: "TikiNOW 2h",    desc: "Giao trong 2 tiếng",       price: 79000,  eta: "2 giờ",       badge: "Siêu tốc" },
];

const PAYMENT_OPTIONS: PaymentOption[] = [
  { key: "momo",      icon: "💜", label: "Ví MoMo",              sub: "Thanh toán 1 chạm",          cashback: "Hoàn 1%" },
  { key: "zalopay",   icon: "💙", label: "ZaloPay",              sub: "Ví điện tử ZaloPay",         cashback: "Hoàn 0.5%" },
  { key: "visa",      icon: "💳", label: "Thẻ Visa •••• 4242",  sub: "Ngân hàng BIDV" },
  { key: "mastercard",icon: "💳", label: "Mastercard •••• 8821", sub: "Ngân hàng VPBank" },
  { key: "banking",   icon: "🏦", label: "Chuyển khoản ngân hàng",sub: "QR / số tài khoản" },
  { key: "cod",       icon: "💵", label: "Thanh toán khi nhận",  sub: "Tiền mặt / Quẹt thẻ tại cửa" },
];

const PLATFORM_CFG: Record<Platform, { label: string; cls: string }> = {
  shopee: { label: "Shopee", cls: "bg-orange-50 text-orange-700 border-orange-200" },
  lazada: { label: "Lazada", cls: "bg-pink-50 text-pink-700 border-pink-200"       },
  tiki:   { label: "Tiki",   cls: "bg-blue-50 text-blue-700 border-blue-200"       },
  sendo:  { label: "Sendo",  cls: "bg-green-50 text-green-700 border-green-200"    },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtPrice(n: number) {
  return new Intl.NumberFormat("vi-VN").format(n) + "₫";
}
function discPct(orig: number, sale: number) {
  return Math.round(((orig - sale) / orig) * 100);
}

// ─── Step config ─────────────────────────────────────────────────────────────

const STEPS: { key: Step; label: string; icon: React.ElementType }[] = [
  { key: "address",  label: "Địa chỉ",       icon: MapPin     },
  { key: "shipping", label: "Vận chuyển",     icon: Truck      },
  { key: "payment",  label: "Thanh toán",     icon: CreditCard },
  { key: "review",   label: "Xác nhận",       icon: CheckCircle2 },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: Step }) {
  const keys: Step[] = ["address", "shipping", "payment", "review"];
  const idx = keys.indexOf(current);
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((s, i) => {
        const done    = i < idx;
        const active  = i === idx;
        const Icon    = s.icon;
        return (
          <div key={s.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold border-2 transition-all",
                done   ? "bg-emerald-500 border-emerald-500 text-white" :
                active ? "bg-[#1a1a2e] border-[#1a1a2e] text-white" :
                         "bg-white border-gray-200 text-gray-400"
              )}>
                {done ? <Check size={14} /> : <Icon size={13} />}
              </div>
              <span className={cn("text-[10px] font-medium whitespace-nowrap",
                active ? "text-[#1a1a2e]" : done ? "text-emerald-600" : "text-gray-400")}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("h-0.5 w-12 mx-1 mb-4 rounded transition-all", done ? "bg-emerald-400" : "bg-gray-200")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderSummaryPanel({
  items, shippingFee, voucherDiscount, payMethod, compact = false,
}: {
  items: OrderItem[];
  shippingFee: number;
  voucherDiscount: number;
  payMethod: PayMethod;
  compact?: boolean;
}) {
  const subtotal     = items.reduce((s, i) => s + i.price * i.qty, 0);
  const origTotal    = items.reduce((s, i) => s + i.originalPrice * i.qty, 0);
  const totalSaved   = origTotal - subtotal;
  const grandTotal   = Math.max(0, subtotal + shippingFee - voucherDiscount);
  const earnPoints   = Math.floor(grandTotal / 10000);
  const [open, setOpen] = useState(!compact);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => compact && setOpen(v => !v)}
        className={cn("w-full flex items-center justify-between px-4 py-3.5 border-b border-gray-100",
          compact ? "cursor-pointer hover:bg-gray-50/50 transition-colors" : "cursor-default")}>
        <h3 className="text-[13px] font-semibold text-gray-900 flex items-center gap-2">
          <Package size={14} className="text-gray-400" />
          Đơn hàng ({items.reduce((s, i) => s + i.qty, 0)} sp)
        </h3>
        {compact && (
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-bold text-red-600">{fmtPrice(grandTotal)}</span>
            <ChevronDown size={14} className={cn("text-gray-400 transition-transform", open && "rotate-180")} />
          </div>
        )}
      </button>

      {open && (
        <>
          {/* Items */}
          <div className="divide-y divide-gray-50">
            {items.map(item => {
              const disc = discPct(item.originalPrice, item.price);
              const plt  = PLATFORM_CFG[item.platform];
              return (
                <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="relative w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
                    {item.image}
                    {disc > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 text-[8px] bg-red-500 text-white px-1 py-0.5 rounded font-bold">
                        -{disc}%
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-gray-900 line-clamp-1">{item.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{item.variant}</span>
                      <span className={cn("text-[9px] px-1.5 py-0.5 rounded border font-medium", plt.cls)}>{plt.label}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[13px] font-semibold text-red-600">{fmtPrice(item.price)}</p>
                    {item.originalPrice > item.price && (
                      <p className="text-[10px] text-gray-400 line-through">{fmtPrice(item.originalPrice)}</p>
                    )}
                    <p className="text-[10px] text-gray-400">x{item.qty}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="px-4 py-3 border-t border-gray-100 space-y-2">
            <div className="flex justify-between text-[12px] text-gray-600">
              <span>Tạm tính</span>
              <span className="font-medium text-gray-800">{fmtPrice(subtotal)}</span>
            </div>
            {totalSaved > 0 && (
              <div className="flex justify-between text-[12px] text-emerald-600">
                <span className="flex items-center gap-1"><TrendingDown size={11} />Tiết kiệm từ giá gốc</span>
                <span className="font-medium">-{fmtPrice(totalSaved)}</span>
              </div>
            )}
            <div className="flex justify-between text-[12px] text-gray-600">
              <span className="flex items-center gap-1"><Truck size={11} />Phí vận chuyển</span>
              <span className={cn("font-medium", shippingFee === 0 ? "text-emerald-600" : "text-gray-800")}>
                {shippingFee === 0 ? "Miễn phí" : fmtPrice(shippingFee)}
              </span>
            </div>
            {voucherDiscount > 0 && (
              <div className="flex justify-between text-[12px] text-violet-600">
                <span className="flex items-center gap-1"><Tag size={11} />Mã giảm giá</span>
                <span className="font-medium">-{fmtPrice(voucherDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-2 border-t border-gray-100">
              <span className="text-[13px] font-semibold text-gray-900">Tổng cộng</span>
              <div className="text-right">
                <p className="text-[18px] font-bold text-red-600">{fmtPrice(grandTotal)}</p>
                {(totalSaved + voucherDiscount) > 0 && (
                  <p className="text-[10px] text-emerald-600">Tiết kiệm {fmtPrice(totalSaved + voucherDiscount)}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-2">
              <Gift size={11} className="shrink-0" />
              Bạn sẽ nhận <span className="font-semibold">{earnPoints} điểm</span> từ đơn hàng này
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Step components ──────────────────────────────────────────────────────────

function StepAddress({
  addresses, selected, onSelect, onNext, onAddNew,
}: {
  addresses: Address[];
  selected: string;
  onSelect: (id: string) => void;
  onNext: () => void;
  onAddNew: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const typeIcon = { home: Home, office: Building2, other: MapPin };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-[15px] font-semibold text-gray-900">Địa chỉ giao hàng</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-[12px] text-blue-600 hover:underline">
          <Plus size={12} /> Thêm địa chỉ mới
        </button>
      </div>

      {addresses.map(addr => {
        const Icon = typeIcon[addr.type] ?? MapPin;
        const isSelected = selected === addr.id;
        return (
          <button key={addr.id} onClick={() => onSelect(addr.id)}
            className={cn(
              "w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all",
              isSelected ? "border-[#1a1a2e] bg-[#1a1a2e]/3 ring-2 ring-[#1a1a2e]/10" : "border-gray-100 bg-white hover:border-gray-200"
            )}>
            {/* Radio */}
            <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
              isSelected ? "border-[#1a1a2e]" : "border-gray-300")}>
              {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#1a1a2e]" />}
            </div>
            {/* Icon */}
            <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
              <Icon size={15} className="text-gray-500" />
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-[13px] font-semibold text-gray-900">{addr.label}</p>
                {addr.isDefault && <span className="text-[10px] bg-[#1a1a2e] text-white px-1.5 py-0.5 rounded font-medium">Mặc định</span>}
              </div>
              <p className="text-[13px] text-gray-700">{addr.name} · {addr.phone}</p>
              <p className="text-[12px] text-gray-500 mt-0.5">{addr.address}, {addr.ward}, {addr.district}, {addr.city}</p>
            </div>
            {isSelected && (
              <button className="flex items-center gap-1 text-[11px] text-blue-600 hover:underline shrink-0">
                <Edit size={11} /> Sửa
              </button>
            )}
          </button>
        );
      })}

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <h3 className="text-[13px] font-semibold text-gray-900">Thêm địa chỉ mới</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Họ và tên", placeholder: "Nhập họ tên người nhận", icon: User },
              { label: "Số điện thoại", placeholder: "0xxx xxx xxx", icon: Phone },
            ].map(({ label, placeholder, icon: Icon }) => (
              <div key={label}>
                <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">{label}</label>
                <div className="mt-1 flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:border-[#1a1a2e] transition-colors">
                  <Icon size={13} className="text-gray-400 shrink-0" />
                  <input placeholder={placeholder} className="flex-1 text-[13px] text-gray-800 outline-none placeholder:text-gray-400" />
                </div>
              </div>
            ))}
          </div>
          <div>
            <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Địa chỉ cụ thể</label>
            <input placeholder="Số nhà, tên đường, tòa nhà..."
              className="mt-1 w-full text-[13px] text-gray-800 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#1a1a2e] transition-colors placeholder:text-gray-400" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["Tỉnh/Thành phố", "Quận/Huyện", "Phường/Xã"].map(label => (
              <div key={label}>
                <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">{label}</label>
                <div className="mt-1 flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 hover:border-gray-300 cursor-pointer">
                  <span className="text-[13px] text-gray-400">Chọn...</span>
                  <ChevronDown size={13} className="text-gray-400" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-1">
            <Button size="sm" className="bg-[#1a1a2e] hover:bg-[#2d2d4a] text-white h-8 text-[12px]">Lưu địa chỉ</Button>
            <Button size="sm" variant="outline" onClick={() => setShowForm(false)} className="h-8 text-[12px] border-gray-200">Huỷ</Button>
          </div>
        </div>
      )}

      <Button onClick={onNext} className="w-full h-11 bg-[#1a1a2e] hover:bg-[#2d2d4a] text-white text-[13px] font-semibold gap-2 rounded-xl">
        Tiếp tục – Chọn vận chuyển <ArrowRight size={15} />
      </Button>
    </div>
  );
}

function StepShipping({
  options, selected, onSelect, onNext, onBack,
}: {
  options: ShippingOption[];
  selected: ShipMethod;
  onSelect: (k: ShipMethod) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-[15px] font-semibold text-gray-900 mb-1">Phương thức vận chuyển</h2>
      {options.map(opt => {
        const isSel = selected === opt.key;
        return (
          <button key={opt.key} onClick={() => onSelect(opt.key)}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
              isSel ? "border-[#1a1a2e] bg-[#1a1a2e]/3 ring-2 ring-[#1a1a2e]/10" : "border-gray-100 bg-white hover:border-gray-200"
            )}>
            <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
              isSel ? "border-[#1a1a2e]" : "border-gray-300")}>
              {isSel && <div className="w-2.5 h-2.5 rounded-full bg-[#1a1a2e]" />}
            </div>
            <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
              <Truck size={15} className="text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-semibold text-gray-900">{opt.label}</p>
                {opt.popular && <span className="text-[9px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-medium">Phổ biến</span>}
                {opt.badge && <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-medium">{opt.badge}</span>}
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">{opt.desc}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[14px] font-semibold text-gray-900">
                {opt.price === 0 ? <span className="text-emerald-600">Miễn phí</span> : fmtPrice(opt.price)}
              </p>
              <p className="text-[11px] text-gray-400 flex items-center gap-1 justify-end">
                <Clock size={10} /> {opt.eta}
              </p>
            </div>
          </button>
        );
      })}

      {/* Delivery note */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <label className="text-[12px] font-medium text-gray-700 mb-2 block">Ghi chú cho người giao hàng (tuỳ chọn)</label>
        <textarea rows={2} placeholder="Vd: Gọi trước khi giao, để trước cửa..."
          className="w-full text-[13px] border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#1a1a2e] transition-colors resize-none placeholder:text-gray-400" />
      </div>

      <div className="flex gap-2 pt-1">
        <Button onClick={onBack} variant="outline" className="h-11 px-5 border-gray-200 text-gray-600 text-[13px] gap-1.5">
          <ChevronLeft size={14} /> Quay lại
        </Button>
        <Button onClick={onNext} className="flex-1 h-11 bg-[#1a1a2e] hover:bg-[#2d2d4a] text-white text-[13px] font-semibold gap-2 rounded-xl">
          Tiếp tục – Thanh toán <ArrowRight size={15} />
        </Button>
      </div>
    </div>
  );
}

function StepPayment({
  options, selected, onSelect, voucher, onVoucher, onNext, onBack, subtotal,
}: {
  options: PaymentOption[];
  selected: PayMethod;
  onSelect: (k: PayMethod) => void;
  voucher: string;
  onVoucher: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
  subtotal: number;
}) {
  const [vInput, setVInput]   = useState("");
  const [vError, setVError]   = useState("");
  const [vOk, setVOk]         = useState(false);
  const [showBankQR, setShowBankQR] = useState(false);

  function applyVoucher() {
    if (vInput.toUpperCase() === "SUMMER40") { setVOk(true); setVError(""); onVoucher(vInput.toUpperCase()); }
    else if (vInput.toUpperCase() === "SHIP0") { setVOk(true); setVError(""); onVoucher(vInput.toUpperCase()); }
    else { setVError("Mã không hợp lệ hoặc đã hết hạn"); setVOk(false); }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-[15px] font-semibold text-gray-900 mb-1">Phương thức thanh toán</h2>

      {/* Payment options */}
      <div className="space-y-2">
        {options.map(opt => {
          const isSel = selected === opt.key;
          return (
            <button key={opt.key} onClick={() => onSelect(opt.key)}
              className={cn(
                "w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all",
                isSel ? "border-[#1a1a2e] bg-[#1a1a2e]/3 ring-2 ring-[#1a1a2e]/10" : "border-gray-100 bg-white hover:border-gray-200"
              )}>
              <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                isSel ? "border-[#1a1a2e]" : "border-gray-300")}>
                {isSel && <div className="w-2.5 h-2.5 rounded-full bg-[#1a1a2e]" />}
              </div>
              <span className="text-xl shrink-0">{opt.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-gray-900">{opt.label}</p>
                {opt.sub && <p className="text-[11px] text-gray-400">{opt.sub}</p>}
              </div>
              {opt.cashback && (
                <span className="text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-lg shrink-0">
                  {opt.cashback}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Banking QR hint */}
      {selected === "banking" && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
          <QrCode size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-[12px] font-semibold text-blue-800 mb-1">Quét QR để chuyển khoản</p>
            <p className="text-[11px] text-blue-600">Sau khi đặt hàng, mã QR và số tài khoản sẽ hiển thị. Đơn hàng sẽ được xác nhận trong vòng 15 phút sau khi nhận được thanh toán.</p>
          </div>
        </div>
      )}

      {/* Voucher */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h3 className="text-[12px] font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
          <Tag size={13} className="text-violet-500" /> Mã giảm giá
        </h3>
        <div className="flex gap-2">
          <input
            value={vInput}
            onChange={e => { setVInput(e.target.value.toUpperCase()); setVError(""); setVOk(false); }}
            onKeyDown={e => e.key === "Enter" && applyVoucher()}
            placeholder="Nhập mã voucher"
            className="flex-1 text-[13px] border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#1a1a2e] transition-colors placeholder:text-gray-400"
          />
          <Button size="sm" onClick={applyVoucher}
            className="h-9 bg-[#1a1a2e] hover:bg-[#2d2d4a] text-white text-[12px] px-4 shrink-0">
            Áp dụng
          </Button>
        </div>
        {vError && <p className="text-[11px] text-red-600 mt-1.5 flex items-center gap-1"><AlertTriangle size={10} />{vError}</p>}
        {vOk && (
          <p className="text-[11px] text-emerald-600 mt-1.5 flex items-center gap-1.5">
            <CheckCircle2 size={11} /> Mã <span className="font-semibold">{voucher}</span> đã được áp dụng!
          </p>
        )}
        <div className="mt-2.5 flex items-center gap-2">
          <span className="text-[10px] text-gray-400">Gợi ý:</span>
          {["SUMMER40", "SHIP0"].map(code => (
            <button key={code} onClick={() => { setVInput(code); }}
              className="text-[10px] font-mono font-medium text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded hover:bg-violet-100 transition-colors">
              {code}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={onBack} variant="outline" className="h-11 px-5 border-gray-200 text-gray-600 text-[13px] gap-1.5">
          <ChevronLeft size={14} /> Quay lại
        </Button>
        <Button onClick={onNext} className="flex-1 h-11 bg-[#1a1a2e] hover:bg-[#2d2d4a] text-white text-[13px] font-semibold gap-2 rounded-xl">
          Xem lại đơn hàng <ArrowRight size={15} />
        </Button>
      </div>
    </div>
  );
}

function StepReview({
  items, address, shippingOpt, payMethod, voucherCode,
  shippingFee, voucherDiscount, onBack, onConfirm, loading,
}: {
  items: OrderItem[];
  address: Address;
  shippingOpt: ShippingOption;
  payMethod: PayMethod;
  voucherCode: string;
  shippingFee: number;
  voucherDiscount: number;
  onBack: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  const pm = PAYMENT_OPTIONS.find(p => p.key === payMethod)!;
  const subtotal   = items.reduce((s, i) => s + i.price * i.qty, 0);
  const grandTotal = Math.max(0, subtotal + shippingFee - voucherDiscount);

  return (
    <div className="space-y-4">
      <h2 className="text-[15px] font-semibold text-gray-900 mb-1">Xác nhận đơn hàng</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {/* Address */}
        <div className="bg-white rounded-xl border border-gray-100 p-3.5">
          <div className="flex items-center gap-1.5 mb-2">
            <MapPin size={12} className="text-gray-400" />
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Giao đến</p>
            <button onClick={onBack} className="ml-auto text-[11px] text-blue-600 hover:underline">Sửa</button>
          </div>
          <p className="text-[13px] font-semibold text-gray-900">{address.name}</p>
          <p className="text-[12px] text-gray-500 mt-0.5">{address.phone}</p>
          <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
            {address.address}, {address.ward}, {address.district}, {address.city}
          </p>
        </div>

        {/* Shipping */}
        <div className="bg-white rounded-xl border border-gray-100 p-3.5">
          <div className="flex items-center gap-1.5 mb-2">
            <Truck size={12} className="text-gray-400" />
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Vận chuyển</p>
          </div>
          <p className="text-[13px] font-semibold text-gray-900">{shippingOpt.label}</p>
          <p className="text-[12px] text-gray-500 flex items-center gap-1 mt-0.5">
            <Clock size={11} /> {shippingOpt.eta}
          </p>
          <p className={cn("text-[12px] font-medium mt-1", shippingFee === 0 ? "text-emerald-600" : "text-gray-800")}>
            {shippingFee === 0 ? "Miễn phí" : fmtPrice(shippingFee)}
          </p>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-xl border border-gray-100 p-3.5">
          <div className="flex items-center gap-1.5 mb-2">
            <CreditCard size={12} className="text-gray-400" />
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Thanh toán</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{pm.icon}</span>
            <p className="text-[13px] font-semibold text-gray-900">{pm.label}</p>
          </div>
          {pm.cashback && (
            <span className="text-[10px] font-medium bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded mt-1 inline-block">
              {pm.cashback}
            </span>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-2.5 border-b border-gray-100">
          Sản phẩm ({items.reduce((s, i) => s + i.qty, 0)})
        </p>
        <div className="divide-y divide-gray-50">
          {items.map(item => {
            const disc = discPct(item.originalPrice, item.price);
            const plt  = PLATFORM_CFG[item.platform];
            return (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                <div className="relative w-11 h-11 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
                  {item.image}
                  {disc > 0 && (
                    <span className="absolute -top-1 -right-1 text-[8px] bg-red-500 text-white px-1 py-0.5 rounded font-bold">-{disc}%</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-gray-900 truncate">{item.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{item.variant}</span>
                    <span className={cn("text-[9px] px-1.5 py-0.5 rounded border font-medium", plt.cls)}>{plt.label}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[13px] font-semibold text-red-600">{fmtPrice(item.price * item.qty)}</p>
                  <p className="text-[10px] text-gray-400">x{item.qty}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final total */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 px-4 py-3.5 flex items-center justify-between">
        <div>
          <p className="text-[12px] text-gray-500">Tổng thanh toán</p>
          {voucherCode && <p className="text-[10px] text-violet-600 flex items-center gap-1 mt-0.5"><Tag size={9} />Mã {voucherCode} đã áp dụng</p>}
        </div>
        <p className="text-[22px] font-bold text-red-600">{fmtPrice(grandTotal)}</p>
      </div>

      {/* T&C note */}
      <p className="text-[11px] text-gray-400 text-center leading-relaxed px-2">
        Bằng cách đặt hàng, bạn đồng ý với <span className="text-blue-600 underline cursor-pointer">Điều khoản sử dụng</span> và <span className="text-blue-600 underline cursor-pointer">Chính sách bảo mật</span> của chúng tôi.
      </p>

      <div className="flex gap-2">
        <Button onClick={onBack} variant="outline" className="h-12 px-5 border-gray-200 text-gray-600 text-[13px] gap-1.5">
          <ChevronLeft size={14} /> Quay lại
        </Button>
        <Button onClick={onConfirm} disabled={loading}
          className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white text-[14px] font-bold gap-2 rounded-xl disabled:opacity-70">
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Đang xử lý...
            </span>
          ) : (
            <><Lock size={15} /> Đặt hàng ngay – {fmtPrice(grandTotal)}</>
          )}
        </Button>
      </div>
    </div>
  );
}

function StepSuccess({ orderId, grandTotal, shippingOpt, onContinue }: {
  orderId: string; grandTotal: number; shippingOpt: ShippingOption; onContinue: () => void;
}) {
  return (
    <div className="text-center py-6 space-y-5">
      {/* Animated checkmark */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-200 flex items-center justify-center">
          <CheckCircle2 size={40} className="text-emerald-500" />
        </div>
      </div>

      <div>
        <h2 className="text-[20px] font-bold text-gray-900 mb-1">Đặt hàng thành công! 🎉</h2>
        <p className="text-[13px] text-gray-500">Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đang được xử lý.</p>
      </div>

      {/* Order info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 text-left max-w-sm mx-auto">
        <div className="space-y-2.5">
          {[
            { label: "Mã đơn hàng",     value: orderId,             mono: true },
            { label: "Tổng thanh toán",  value: fmtPrice(grandTotal) },
            { label: "Phương thức ship", value: shippingOpt.label    },
            { label: "Dự kiến nhận",     value: shippingOpt.eta      },
          ].map(({ label, value, mono }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-[12px] text-gray-400">{label}</span>
              <span className={cn("text-[12px] font-semibold text-gray-900", mono && "font-mono text-[11px]")}>
                {value}
                {mono && (
                  <button className="ml-1.5 text-blue-500 hover:text-blue-700">
                    <Copy size={10} />
                  </button>
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3.5 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
            <Gift size={12} className="shrink-0" />
            <span>Bạn nhận được <span className="font-semibold">{Math.floor(grandTotal / 10000)} điểm</span> thưởng từ đơn hàng này</span>
          </div>
        </div>
      </div>

      {/* Track CTA */}
      <div className="space-y-2 max-w-xs mx-auto">
        <button className="w-full flex items-center justify-center gap-2 h-11 bg-[#1a1a2e] hover:bg-[#2d2d4a] text-white rounded-xl text-[13px] font-semibold transition-colors">
          <Package size={15} /> Theo dõi đơn hàng
        </button>
        <button onClick={onContinue}
          className="w-full flex items-center justify-center gap-2 h-11 border border-gray-200 text-gray-600 rounded-xl text-[13px] font-medium hover:bg-gray-50 transition-colors">
          <Sparkles size={14} /> Tiếp tục mua sắm
        </button>
      </div>

      {/* Trust */}
      <div className="flex items-center justify-center gap-5 pt-2">
        {[
          { icon: Shield,    label: "Hàng chính hãng" },
          { icon: RotateCcw, label: "Đổi trả 30 ngày" },
          { icon: Star,      label: "Hỗ trợ 24/7"     },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <Icon size={12} /> {label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const [step, setStep]               = useState<Step>("address");
  const [selectedAddr, setSelectedAddr] = useState("A1");
  const [selectedShip, setSelectedShip] = useState<ShipMethod>("fast");
  const [selectedPay,  setSelectedPay]  = useState<PayMethod>("momo");
  const [voucher, setVoucher]         = useState("");
  const [loading, setLoading]         = useState(false);
  const [orderId]                     = useState(`#${Math.floor(Math.random() * 9000000 + 1000000)}`);

  const address     = ADDRESSES.find(a => a.id === selectedAddr) ?? ADDRESSES[0];
  const shippingOpt = SHIPPING_OPTIONS.find(s => s.key === selectedShip) ?? SHIPPING_OPTIONS[1];
  const shippingFee = shippingOpt.price;

  const subtotal        = ORDER_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const voucherDiscount = voucher === "SUMMER40" ? Math.round(subtotal * 0.4)
                        : voucher === "SHIP0"     ? shippingFee
                        : 0;
  const grandTotal = Math.max(0, subtotal + shippingFee - voucherDiscount);

  function handleConfirm() {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("success"); }, 1800);
  }

  const isSuccess = step === "success";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Top bar ── */}
      <div className="bg-[#1a1a2e] text-white">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Lock size={14} className="text-white/50" />
            <span className="text-[14px] font-semibold">Thanh toán an toàn</span>
          </div>
          <div className="flex-1" />
          {!isSuccess && <StepIndicator current={step} />}
          <div className="flex-1" />
          <div className="flex items-center gap-1.5 text-[11px] text-white/40">
            <Shield size={11} /> Được bảo mật bởi SSL 256-bit
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {isSuccess ? (
          <div className="max-w-3xl mx-auto my-2">
            <StepSuccess
              orderId={orderId}
              grandTotal={grandTotal}
              shippingOpt={shippingOpt}
              onContinue={() => setStep("address")}
            />
          </div>
        ) : (
          <div className="grid grid-cols-[1fr_320px] gap-5 items-start">

            {/* ── Left: step content ── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">

              {step === "address" && (
                <StepAddress
                  addresses={ADDRESSES}
                  selected={selectedAddr}
                  onSelect={setSelectedAddr}
                  onNext={() => setStep("shipping")}
                  onAddNew={() => {}}
                />
              )}

              {step === "shipping" && (
                <StepShipping
                  options={SHIPPING_OPTIONS}
                  selected={selectedShip}
                  onSelect={setSelectedShip}
                  onNext={() => setStep("payment")}
                  onBack={() => setStep("address")}
                />
              )}

              {step === "payment" && (
                <StepPayment
                  options={PAYMENT_OPTIONS}
                  selected={selectedPay}
                  onSelect={setSelectedPay}
                  voucher={voucher}
                  onVoucher={setVoucher}
                  onNext={() => setStep("review")}
                  onBack={() => setStep("shipping")}
                  subtotal={subtotal}
                />
              )}

              {step === "review" && (
                <StepReview
                  items={ORDER_ITEMS}
                  address={address}
                  shippingOpt={shippingOpt}
                  payMethod={selectedPay}
                  voucherCode={voucher}
                  shippingFee={shippingFee}
                  voucherDiscount={voucherDiscount}
                  onBack={() => setStep("payment")}
                  onConfirm={handleConfirm}
                  loading={loading}
                />
              )}
            </div>

            {/* ── Right: order summary sticky ── */}
            <div className="space-y-3 sticky top-5">
              <OrderSummaryPanel
                items={ORDER_ITEMS}
                shippingFee={shippingFee}
                voucherDiscount={voucherDiscount}
                payMethod={selectedPay}
              />

              {/* Trust block */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-2.5">
                {[
                  { icon: Shield,    text: "Hàng chính hãng 100%"       },
                  { icon: RotateCcw, text: "Đổi trả miễn phí 30 ngày"   },
                  { icon: Truck,     text: "Giao hàng toàn quốc"        },
                  { icon: Lock,      text: "Thanh toán được mã hoá SSL" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-[12px] text-gray-500">
                    <Icon size={13} className="text-gray-400 shrink-0" /> {text}
                  </div>
                ))}
              </div>

              {/* Help */}
              <div className="text-center">
                <p className="text-[11px] text-gray-400">Cần hỗ trợ? <span className="text-blue-600 cursor-pointer hover:underline">Chat với chúng tôi</span></p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}