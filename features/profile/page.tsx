"use client";

import { useState } from "react";
import {
  User, Settings, Shield, Bell, CreditCard, MapPin,
  Package, Heart, Star, MessageSquare, ChevronRight,
  Edit, Camera, CheckCircle2, Award, Crown, Zap,
  LogOut, Eye, EyeOff, Plus, Trash2, Phone, Mail,
  Globe, Calendar, Lock, Smartphone, Gift, TrendingUp,
  ShoppingBag, BarChart2, Store, Users, BadgePercent,
  Megaphone, FileText, Copy, ToggleLeft, ToggleRight,
  AlertTriangle, X, ChevronDown, Ticket, Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role        = "buyer" | "seller" | "admin";
type ActiveTab   = "overview" | "orders" | "addresses" | "payment" | "security" | "notifications" | "brand";
type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled" | "refunding";

interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

interface Order {
  id: string;
  product: string;
  image: string;
  brand: string;
  price: string;
  status: OrderStatus;
  date: string;
  platform: "shopee" | "lazada" | "tiki" | "sendo";
}

interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "momo" | "zalopay" | "banking";
  label: string;
  last4?: string;
  isDefault: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const USER = {
  name: "Nguyễn Thị Lan",
  username: "nguyenthilan",
  email: "lan.nguyen@gmail.com",
  phone: "0912 345 678",
  avatar: "NL",
  bio: "Yêu thích mua sắm online, đặc biệt giày dép và skincare 🛍️",
  dob: "15/04/1995",
  gender: "Nữ",
  location: "Hà Nội",
  joinDate: "Tháng 1, 2021",
  tier: "Diamond",
  points: 12840,
  verified: true,
  roles: ["buyer", "seller"] as Role[],
  activeRole: "buyer" as Role,
  stats: {
    buyer: { orders: 148, reviews: 92, wishlist: 34, vouchers: 8 },
    seller: { products: 48, revenue: "42.3 tr", orders: 310, rating: 4.9 },
  },
};

const ORDERS: Order[] = [
  { id: "#8821432", product: "Biti's Hunter X Street 2026",   image: "👟", brand: "Biti's", price: "449k",    status: "processing", date: "Hôm nay",       platform: "shopee" },
  { id: "#8821380", product: "Shiseido Vital Perfection 50ml",image: "💆", brand: "Shiseido",price: "620k",   status: "shipped",    date: "Hôm qua",       platform: "lazada" },
  { id: "#8821210", product: "Nike Air Max 270 Nam",           image: "🏃", brand: "Nike",   price: "2.19tr", status: "delivered",  date: "3 ngày trước",  platform: "tiki"   },
  { id: "#8821100", product: "Canifa Áo Len Oversize",         image: "🧥", brand: "Canifa", price: "299k",   status: "delivered",  date: "1 tuần trước",  platform: "shopee" },
  { id: "#8820950", product: "Samsung Galaxy Tab A9",          image: "📟", brand: "Samsung",price: "5.29tr", status: "refunding",  date: "2 tuần trước",  platform: "sendo"  },
];

const ADDRESSES: Address[] = [
  { id: "A1", label: "Nhà riêng",   name: "Nguyễn Thị Lan", phone: "0912 345 678", address: "12 Phố Huế, Hai Bà Trưng, Hà Nội",         isDefault: true  },
  { id: "A2", label: "Văn phòng",   name: "Nguyễn Thị Lan", phone: "0912 345 678", address: "Tòa nhà Viettel, 285 Cách Mạng Tháng 8, Q.10, TP.HCM", isDefault: false },
  { id: "A3", label: "Nhà bố mẹ",   name: "Nguyễn Văn An",  phone: "0902 111 222", address: "45 Trần Phú, Ba Đình, Hà Nội",               isDefault: false },
];

const PAYMENTS: PaymentMethod[] = [
  { id: "P1", type: "visa",      label: "Visa",          last4: "4242", isDefault: true  },
  { id: "P2", type: "momo",      label: "Ví MoMo",                      isDefault: false },
  { id: "P3", type: "zalopay",   label: "ZaloPay",                      isDefault: false },
  { id: "P4", type: "mastercard",label: "Mastercard",    last4: "8821", isDefault: false },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const ROLE_CFG: Record<Role, { label: string; cls: string; icon: React.ElementType }> = {
  buyer:  { label: "Người mua",        cls: "bg-blue-50 text-blue-700 border-blue-200",   icon: ShoppingBag },
  seller: { label: "Nhà bán hàng",     cls: "bg-emerald-50 text-emerald-800 border-emerald-200", icon: Store },
  admin:  { label: "Quản trị viên",    cls: "bg-red-50 text-red-700 border-red-200",      icon: Shield },
};

const TIER_CFG = {
  Diamond: { color: "text-sky-700",    bg: "bg-sky-50",    border: "border-sky-200",    emoji: "💎" },
  Gold:    { color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200",  emoji: "🥇" },
  Silver:  { color: "text-gray-600",   bg: "bg-gray-50",   border: "border-gray-200",   emoji: "🥈" },
  Basic:   { color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200",   emoji: "🔵" },
};

const ORDER_STATUS: Record<OrderStatus, { label: string; cls: string; dot: string }> = {
  processing: { label: "Đang xử lý",   cls: "bg-blue-50 text-blue-700 border-blue-200",     dot: "bg-blue-500"    },
  shipped:    { label: "Đang giao",    cls: "bg-violet-50 text-violet-700 border-violet-200",dot: "bg-violet-500"  },
  delivered:  { label: "Đã giao",      cls: "bg-emerald-50 text-emerald-800 border-emerald-200",dot:"bg-emerald-500"},
  cancelled:  { label: "Đã huỷ",       cls: "bg-gray-100 text-gray-600 border-gray-200",    dot: "bg-gray-400"    },
  refunding:  { label: "Đang hoàn",    cls: "bg-amber-50 text-amber-700 border-amber-200",  dot: "bg-amber-500"   },
};

const PLATFORM_CFG = {
  shopee: { label: "Shopee", cls: "bg-orange-50 text-orange-700 border-orange-200" },
  lazada: { label: "Lazada", cls: "bg-pink-50 text-pink-700 border-pink-200"       },
  tiki:   { label: "Tiki",   cls: "bg-blue-50 text-blue-700 border-blue-200"       },
  sendo:  { label: "Sendo",  cls: "bg-green-50 text-green-700 border-green-200"    },
};

const PAYMENT_ICONS: Record<PaymentMethod["type"], string> = {
  visa: "💳", mastercard: "💳", momo: "💜", zalopay: "💙", banking: "🏦",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ initials, size = "lg" }: { initials: string; size?: "sm" | "md" | "lg" | "xl" }) {
  const dims = { sm: "w-8 h-8 text-[12px]", md: "w-10 h-10 text-[13px]", lg: "w-14 h-14 text-[18px]", xl: "w-20 h-20 text-[24px]" };
  return (
    <div className={cn("rounded-full bg-[#1a1a2e] text-white flex items-center justify-center font-semibold shrink-0", dims[size])}>
      {initials}
    </div>
  );
}

function StarRow({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size} className={s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
      ))}
    </span>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      className={cn("w-10 h-5 rounded-full border relative transition-all", on ? "bg-[#1a1a2e] border-[#1a1a2e]" : "bg-gray-200 border-gray-300")}>
      <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all", on ? "left-5" : "left-0.5")} />
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [user, setUser]         = useState(USER);
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [editing, setEditing]   = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [notifs, setNotifs]     = useState({
    orders: true, promos: true, reviews: false, security: true, newsletter: false,
  });
  const [addresses, setAddresses] = useState(ADDRESSES);

  const tierCfg = TIER_CFG[user.tier as keyof typeof TIER_CFG] ?? TIER_CFG.Basic;

  // Nav items vary by active role
  const navItems: { key: ActiveTab; icon: any; label: string; badge?: string }[] = [
    { key: "overview",      icon: User,        label: "Hồ sơ cá nhân" },
    { key: "orders",        icon: ShoppingBag, label: "Đơn hàng",       badge: String(ORDERS.filter(o => o.status === "processing" || o.status === "shipped").length) },
    { key: "addresses",     icon: MapPin,      label: "Địa chỉ giao hàng" },
    { key: "payment",       icon: CreditCard,  label: "Phương thức thanh toán" },
    { key: "security",      icon: Shield,      label: "Bảo mật tài khoản" },
    { key: "notifications", icon: Bell,        label: "Thông báo" },
    ...(user.roles.includes("seller") ? [{ key: "brand" as ActiveTab, icon: Store, label: "Gian hàng của tôi" }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Profile hero ── */}
      <div className="bg-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-end gap-5">
            {/* Avatar with camera */}
            <div className="relative shrink-0 bg-white/10 border border-white/20 rounded-full p-0.5">
              <Avatar initials={user.avatar} size="xl" />
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-[#1a1a2e] flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Camera size={13} className="text-gray-600" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2.5 mb-1">
                <h1 className="text-xl font-semibold text-white">{user.name}</h1>
                {user.verified && <CheckCircle2 size={16} className="text-blue-400 shrink-0" />}
                <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full border", tierCfg.bg, tierCfg.color, tierCfg.border)}>
                  {tierCfg.emoji} {user.tier}
                </span>
              </div>
              <p className="text-white/50 text-[13px] mb-2.5">@{user.username} · {user.bio}</p>
              <div className="flex items-center gap-5 flex-wrap">
                {/* Role badges */}
                {user.roles.map(role => {
                  const cfg = ROLE_CFG[role];
                  const Icon : any = cfg.icon;
                  const isActive = user.activeRole === role;
                  return (
                    <button key={role}
                      onClick={() => setUser(u => ({ ...u, activeRole: role }))}
                      className={cn(
                        "flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all",
                        isActive ? "bg-white text-[#1a1a2e] border-white" : "bg-white/10 text-white/60 border-white/20 hover:bg-white/20"
                      )}>
                      <Icon size={12} />
                      {cfg.label}
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5" />}
                    </button>
                  );
                })}
                <span className="text-white/30 text-[12px] flex items-center gap-1">
                  <Calendar size={11} /> Tham gia {user.joinDate}
                </span>
                <span className="text-white/30 text-[12px] flex items-center gap-1">
                  <MapPin size={11} /> {user.location}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">

        {/* ── Sidebar nav ── */}
        <aside className="w-56 shrink-0 space-y-1">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {navItems.map(({ key, icon: Icon, label, badge }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] transition-colors text-left border-b border-gray-50 last:border-0",
                  activeTab === key ? "bg-[#1a1a2e]/5 text-[#1a1a2e] font-medium" : "text-gray-600 hover:bg-gray-50"
                )}>
                <Icon size={15} className={activeTab === key ? "text-[#1a1a2e]" : "text-gray-400"} />
                <span className="flex-1">{label}</span>
                {badge && badge !== "0" && (
                  <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-medium">{badge}</span>
                )}
                {activeTab === key && <ChevronRight size={13} className="text-gray-400" />}
              </button>
            ))}
          </div>
          <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 transition-all">
            <LogOut size={15} />
            Đăng xuất
          </button>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* ── Overview tab ── */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[15px] font-semibold text-gray-900">Thông tin cá nhân</h2>
                  <Button size="sm" variant="outline"
                    onClick={() => setEditing(!editing)}
                    className="h-8 text-[12px] border-gray-200 text-gray-600 gap-1.5">
                    <Edit size={12} /> {editing ? "Lưu thay đổi" : "Chỉnh sửa"}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Họ và tên",    value: user.name,     field: "name"    },
                    { label: "Tên hiển thị", value: user.username, field: "username"},
                    { label: "Ngày sinh",    value: user.dob,      field: "dob"     },
                    { label: "Giới tính",    value: user.gender,   field: "gender"  },
                    { label: "Địa chỉ",      value: user.location, field: "location"},
                  ].map(({ label, value, field }) => (
                    <div key={field}>
                      <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{label}</label>
                      {editing ? (
                        <input defaultValue={value}
                          className="mt-1 w-full text-[13px] text-gray-800 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#1a1a2e] transition-colors" />
                      ) : (
                        <p className="mt-1 text-[13px] text-gray-800">{value}</p>
                      )}
                    </div>
                  ))}
                  <div>
                    <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Bio</label>
                    {editing ? (
                      <textarea defaultValue={user.bio} rows={2}
                        className="mt-1 w-full text-[13px] text-gray-800 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#1a1a2e] transition-colors resize-none" />
                    ) : (
                      <p className="mt-1 text-[13px] text-gray-800">{user.bio}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact info */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h2 className="text-[15px] font-semibold text-gray-900 mb-4">Thông tin liên hệ</h2>
                <div className="space-y-3">
                  {[
                    {
                      icon: Mail, label: "Email", value: user.email,
                      show: showEmail, toggle: () => setShowEmail(v => !v), verified: true,
                    },
                    {
                      icon: Phone, label: "Số điện thoại", value: user.phone,
                      show: showPhone, toggle: () => setShowPhone(v => !v), verified: true,
                    },
                  ].map(({ icon: Icon, label, value, show, toggle, verified }) => (
                    <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                        <Icon size={14} className="text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-gray-400">{label}</p>
                        <p className="text-[13px] font-medium text-gray-800">
                          {show ? value : value.replace(/./g, (c, i) => i < 3 || i > value.length - 4 ? c : "*")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {verified && <span className="text-[10px] text-emerald-600 flex items-center gap-0.5"><CheckCircle2 size={10} />Đã xác thực</span>}
                        <button onClick={toggle} className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                          {show ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                        <button className="text-[11px] text-blue-600 hover:underline">Đổi</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tier & rewards */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[15px] font-semibold text-gray-900">Hạng thành viên & Điểm thưởng</h2>
                  <button className="text-[12px] text-blue-600 hover:underline flex items-center gap-1">
                    Chi tiết <ChevronRight size={12} />
                  </button>
                </div>
                <div className="flex items-center gap-4 p-4 bg-sky-50 border border-sky-100 rounded-xl mb-3">
                  <div className="text-4xl">{tierCfg.emoji}</div>
                  <div className="flex-1">
                    <p className="text-[14px] font-semibold text-sky-800">{user.tier} Member</p>
                    <p className="text-[12px] text-sky-600">{user.points.toLocaleString()} điểm · Hết hạn 31/12/2026</p>
                    <div className="mt-2 h-1.5 bg-sky-100 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-500 rounded-full" style={{ width: "73%" }} />
                    </div>
                    <p className="text-[10px] text-sky-500 mt-1">Còn 3,460 điểm để lên hạng tiếp theo</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Miễn phí ship",       icon: "🚚", active: true  },
                    { label: "Hoàn tiền 2%",         icon: "💰", active: true  },
                    { label: "Ưu tiên đổi trả",     icon: "🔄", active: true  },
                    { label: "Flash sale sớm 1h",   icon: "⚡", active: true  },
                    { label: "Quà sinh nhật VIP",    icon: "🎁", active: false },
                    { label: "Concierge support",    icon: "🎯", active: false },
                  ].map(({ label, icon, active }) => (
                    <div key={label} className={cn("flex items-center gap-2 p-2.5 rounded-lg border text-[11px]",
                      active ? "bg-white border-gray-100 text-gray-700" : "bg-gray-50 border-gray-100 text-gray-400")}>
                      <span className={active ? "" : "grayscale opacity-50"}>{icon}</span>
                      {label}
                      {active && <CheckCircle2 size={10} className="ml-auto text-emerald-500 shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Orders tab ── */}
          {activeTab === "orders" && (
            <div className="bg-white rounded-xl border border-gray-100">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="text-[15px] font-semibold text-gray-900">Đơn hàng của tôi</h2>
                <button className="text-[12px] text-blue-600 hover:underline">Xem tất cả</button>
              </div>
              <div className="divide-y divide-gray-100">
                {ORDERS.map(order => {
                  const st  = ORDER_STATUS[order.status];
                  const plt = PLATFORM_CFG[order.platform];
                  return (
                    <div key={order.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/60 transition-colors cursor-pointer">
                      <div className="w-11 h-11 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
                        {order.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-gray-900 truncate">{order.product}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-gray-400">{order.brand}</span>
                          <span className={cn("text-[9px] px-1.5 py-0.5 rounded border font-medium", plt.cls)}>{plt.label}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[14px] font-semibold text-gray-900">{order.price}</p>
                        <p className="text-[11px] text-gray-400">{order.date}</p>
                      </div>
                      <div className="shrink-0">
                        <Badge variant="outline" className={cn("text-[10px] font-medium border gap-1", st.cls)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", st.dot)} />
                          {st.label}
                        </Badge>
                      </div>
                      <span className="text-[11px] font-mono text-gray-400 shrink-0">{order.id}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Addresses tab ── */}
          {activeTab === "addresses" && (
            <div className="space-y-3">
              {addresses.map(addr => (
                <div key={addr.id} className={cn("bg-white rounded-xl border p-4 flex items-start gap-4",
                  addr.isDefault ? "border-[#1a1a2e]/20 bg-[#1a1a2e]/2" : "border-gray-100")}>
                  <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                    <MapPin size={15} className="text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[13px] font-semibold text-gray-900">{addr.label}</p>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-[#1a1a2e] text-white px-1.5 py-0.5 rounded font-medium">Mặc định</span>
                      )}
                    </div>
                    <p className="text-[13px] text-gray-700">{addr.name} · {addr.phone}</p>
                    <p className="text-[12px] text-gray-500 mt-0.5">{addr.address}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!addr.isDefault && (
                      <button onClick={() => setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === addr.id })))}
                        className="text-[11px] text-blue-600 hover:underline">
                        Đặt mặc định
                      </button>
                    )}
                    <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                      <Edit size={12} />
                    </button>
                    <button onClick={() => setAddresses(prev => prev.filter(a => a.id !== addr.id))}
                      className="w-7 h-7 rounded-lg border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
              <button className="w-full flex items-center justify-center gap-2 text-[13px] text-gray-500 border border-dashed border-gray-300 rounded-xl py-3.5 hover:border-gray-400 hover:text-gray-700 transition-colors">
                <Plus size={15} /> Thêm địa chỉ mới
              </button>
            </div>
          )}

          {/* ── Payment tab ── */}
          {activeTab === "payment" && (
            <div className="space-y-3">
              {PAYMENTS.map(pm => (
                <div key={pm.id} className={cn("bg-white rounded-xl border p-4 flex items-center gap-4",
                  pm.isDefault ? "border-[#1a1a2e]/20" : "border-gray-100")}>
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl shrink-0">
                    {PAYMENT_ICONS[pm.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-semibold text-gray-900">{pm.label}</p>
                      {pm.isDefault && <span className="text-[10px] bg-[#1a1a2e] text-white px-1.5 py-0.5 rounded font-medium">Mặc định</span>}
                    </div>
                    {pm.last4 && <p className="text-[12px] text-gray-500 mt-0.5">•••• •••• •••• {pm.last4}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!pm.isDefault && <button className="text-[11px] text-blue-600 hover:underline">Mặc định</button>}
                    <button className="w-7 h-7 rounded-lg border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
              <button className="w-full flex items-center justify-center gap-2 text-[13px] text-gray-500 border border-dashed border-gray-300 rounded-xl py-3.5 hover:border-gray-400 hover:text-gray-700 transition-colors">
                <Plus size={15} /> Thêm phương thức thanh toán
              </button>
            </div>
          )}

          {/* ── Security tab ── */}
          {activeTab === "security" && (
            <div className="space-y-4">
              {/* Password */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-[14px] font-semibold text-gray-900 mb-4">Mật khẩu & Đăng nhập</h3>
                <div className="space-y-3">
                  {[
                    { label: "Mật khẩu",            value: "Cập nhật lần cuối 3 tháng trước", icon: Lock,       action: "Đổi mật khẩu",    ok: true  },
                    { label: "Xác thực 2 yếu tố",   value: "Chưa bật – Bảo mật yếu",          icon: Smartphone, action: "Bật ngay",         ok: false },
                    { label: "Thiết bị đã đăng nhập",value: "3 thiết bị đang hoạt động",       icon: Globe,      action: "Quản lý",          ok: true  },
                    { label: "Đăng nhập với Google", value: "lan.nguyen@gmail.com",             icon: Mail,       action: "Huỷ liên kết",     ok: true  },
                  ].map(({ label, value, icon: Icon, action, ok }) => (
                    <div key={label} className={cn("flex items-center gap-3 p-3 rounded-xl border", ok ? "bg-gray-50 border-gray-100" : "bg-amber-50 border-amber-100")}>
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", ok ? "bg-white border border-gray-200" : "bg-amber-100 border border-amber-200")}>
                        <Icon size={14} className={ok ? "text-gray-500" : "text-amber-600"} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-gray-900">{label}</p>
                        <p className={cn("text-[11px]", ok ? "text-gray-400" : "text-amber-700")}>{value}</p>
                      </div>
                      <button className={cn("text-[12px] font-medium whitespace-nowrap", ok ? "text-blue-600 hover:underline" : "text-amber-700 underline")}>
                        {action}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danger zone */}
              <div className="bg-white rounded-xl border border-red-100 p-5">
                <h3 className="text-[14px] font-semibold text-red-700 mb-3 flex items-center gap-2">
                  <AlertTriangle size={15} /> Vùng nguy hiểm
                </h3>
                <div className="space-y-2">
                  {[
                    { label: "Tắt tài khoản tạm thời",   desc: "Có thể kích hoạt lại bất cứ lúc nào", cls: "border-gray-200 text-gray-700" },
                    { label: "Xoá vĩnh viễn tài khoản", desc: "Không thể khôi phục sau khi xoá",     cls: "border-red-200 text-red-700 bg-red-50" },
                  ].map(({ label, desc, cls }) => (
                    <div key={label} className={cn("flex items-center justify-between p-3 rounded-xl border", cls)}>
                      <div>
                        <p className="text-[13px] font-medium">{label}</p>
                        <p className="text-[11px] opacity-70">{desc}</p>
                      </div>
                      <Button size="sm" variant="outline" className="h-7 text-[12px] border-current shrink-0">
                        Thực hiện
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Notifications tab ── */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="text-[15px] font-semibold text-gray-900 mb-4">Tuỳ chỉnh thông báo</h2>
              <div className="space-y-1">
                {[
                  { key: "orders",     label: "Đơn hàng",              desc: "Cập nhật trạng thái đơn hàng, giao hàng",   icon: ShoppingBag },
                  { key: "promos",     label: "Khuyến mãi & Ưu đãi",  desc: "Flash sale, mã giảm giá, voucher mới",      icon: BadgePercent },
                  { key: "reviews",    label: "Đánh giá & Phản hồi",  desc: "Khi có người phản hồi đánh giá của bạn",    icon: Star },
                  { key: "security",   label: "Bảo mật tài khoản",    desc: "Đăng nhập lạ, thay đổi mật khẩu",          icon: Shield },
                  { key: "newsletter", label: "Bản tin & Tin tức",    desc: "Xu hướng, sản phẩm mới, tips mua sắm",      icon: FileText },
                ].map(({ key, label, desc, icon: Icon }) => (
                  <div key={key} className="flex items-center gap-4 py-3.5 border-b border-gray-50 last:border-0">
                    <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                      <Icon size={15} className="text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-gray-900">{label}</p>
                      <p className="text-[11px] text-gray-400">{desc}</p>
                    </div>
                    <Toggle
                      on={notifs[key as keyof typeof notifs]}
                      onToggle={() => setNotifs(n => ({ ...n, [key]: !n[key as keyof typeof notifs] }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Brand / Seller tab ── */}
          {activeTab === "brand" && (
            <div className="space-y-4">
              {/* Brand overview card */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#1a1a2e] flex items-center justify-center text-white text-lg font-bold shrink-0">BH</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[15px] font-semibold text-gray-900">Biti's Hunter</p>
                      <CheckCircle2 size={15} className="text-blue-500" />
                      <span className="text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">⭐ Gold Partner</span>
                    </div>
                    <p className="text-[12px] text-gray-400">Giày dép & Phụ kiện · Thành viên từ 01/2021</p>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 text-[12px] border-gray-200 text-gray-600 gap-1.5 shrink-0">
                    <ExternalLink size={12} /> Xem gian hàng
                  </Button>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Doanh thu", value: "42.3 tr", icon: TrendingUp,  color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Đơn hàng", value: "310",      icon: ShoppingBag, color: "text-blue-600",    bg: "bg-blue-50"    },
                    { label: "Sản phẩm", value: "48",       icon: Package,     color: "text-violet-600",  bg: "bg-violet-50"  },
                    { label: "Đánh giá", value: "4.9 ⭐",   icon: Star,        color: "text-amber-600",   bg: "bg-amber-50"   },
                  ].map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="p-3 bg-gray-50 rounded-xl">
                      <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center mb-2", bg)}>
                        <Icon size={13} className={color} />
                      </div>
                      <p className="text-[15px] font-semibold text-gray-900 leading-none">{value}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions for seller */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-[14px] font-semibold text-gray-900 mb-3">Quản lý gian hàng</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Package,      label: "Quản lý sản phẩm",   count: "48 sp",   cls: "text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100" },
                    { icon: ShoppingBag,  label: "Đơn hàng mới",       count: "12 đơn",  cls: "text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100" },
                    { icon: BadgePercent, label: "Khuyến mãi",          count: "3 đang chạy", cls: "text-violet-700 border-violet-200 bg-violet-50 hover:bg-violet-100" },
                    { icon: Megaphone,    label: "Chiến dịch",          count: "2 active",cls: "text-orange-700 border-orange-200 bg-orange-50 hover:bg-orange-100" },
                    { icon: Star,         label: "Đánh giá chờ",        count: "7 mới",   cls: "text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100" },
                    { icon: BarChart2,    label: "Báo cáo doanh thu",   count: "Tháng 6", cls: "text-gray-700 border-gray-200 bg-gray-50 hover:bg-gray-100" },
                  ].map(({ icon: Icon, label, count, cls }) => (
                    <button key={label} className={cn("flex items-center gap-3 p-3 rounded-xl border transition-all text-left", cls)}>
                      <Icon size={15} />
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium">{label}</p>
                        <p className="text-[11px] opacity-70">{count}</p>
                      </div>
                      <ChevronRight size={13} className="ml-auto opacity-50 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function ExternalLink({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}