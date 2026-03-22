'use client'

import {
  TrendingUp, TrendingDown, ShoppingBag, Users, DollarSign,
  Package, ArrowRight, MoreHorizontal, ChevronRight,
  RefreshCw, AlertCircle, CheckCircle2, Clock, Truck,
  Eye, Star, Zap, Download, Filter, Calendar,
  ArrowUpRight, ArrowDownRight, Activity, BarChart3
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useMemo } from 'react'

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */

const KPIS = [
  {
    label: 'Total Revenue',
    value: '$84,291',
    change: +18.2,
    sub: 'vs last month',
    icon: DollarSign,
    color: 'text-green-600',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    spark: [40, 55, 48, 70, 65, 80, 84],
  },
  {
    label: 'Total Orders',
    value: '1,284',
    change: +12.5,
    sub: 'vs last month',
    icon: ShoppingBag,
    color: 'text-blue-600',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    spark: [30, 45, 40, 60, 55, 70, 72],
  },
  {
    label: 'New Customers',
    value: '348',
    change: +8.1,
    sub: 'vs last month',
    icon: Users,
    color: 'text-purple-600',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    spark: [20, 28, 25, 40, 35, 42, 45],
  },
  {
    label: 'Avg Order Value',
    value: '$65.64',
    change: -2.4,
    sub: 'vs last month',
    icon: BarChart3,
    color: 'text-amber-600',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    spark: [70, 68, 72, 65, 68, 64, 66],
  },
]

const REVENUE_DATA = {
  week: [
    { day: 'Mon', rev: 8420, orders: 124 },
    { day: 'Tue', rev: 11200, orders: 158 },
    { day: 'Wed', rev: 9800, orders: 142 },
    { day: 'Thu', rev: 13400, orders: 189 },
    { day: 'Fri', rev: 15600, orders: 221 },
    { day: 'Sat', rev: 18200, orders: 267 },
    { day: 'Sun', rev: 12100, orders: 174 },
  ],
  month: [
    { day: 'W1', rev: 42000, orders: 618 },
    { day: 'W2', rev: 55000, orders: 782 },
    { day: 'W3', rev: 48000, orders: 695 },
    { day: 'W4', rev: 61000, orders: 871 },
  ],
}

const RECENT_ORDERS = [
  { id: 'SH-84291', customer: 'Alex Morgan', avatar: 'AM', email: 'alex@example.com', items: 3, total: 339.10, status: 'shipped', date: '2m ago', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=48&h=48&fit=crop' },
  { id: 'SH-84290', customer: 'Sarah Kim', avatar: 'SK', email: 'sarah@example.com', items: 1, total: 149.99, status: 'processing', date: '8m ago', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=48&h=48&fit=crop' },
  { id: 'SH-84289', customer: 'James Liu', avatar: 'JL', email: 'james@example.com', items: 2, total: 549.98, status: 'delivered', date: '23m ago', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=48&h=48&fit=crop' },
  { id: 'SH-84288', customer: 'Maria Chen', avatar: 'MC', email: 'maria@example.com', items: 4, total: 218.45, status: 'delivered', date: '1h ago', image: 'https://images.unsplash.com/photo-1531492898419-3a9aa15ebbd0?w=48&h=48&fit=crop' },
  { id: 'SH-84287', customer: 'Tom Wilson', avatar: 'TW', email: 'tom@example.com', items: 1, total: 89.99, status: 'cancelled', date: '2h ago', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=48&h=48&fit=crop' },
  { id: 'SH-84286', customer: 'Emma Davis', avatar: 'ED', email: 'emma@example.com', items: 2, total: 429.98, status: 'shipped', date: '3h ago', image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=48&h=48&fit=crop' },
]

const TOP_PRODUCTS = [
  { id: 1, name: 'Sony WH-1000XM5', brand: 'Sony', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=48&h=48&fit=crop', revenue: 14280, sold: 51, stock: 8, rating: 4.9, trend: +12 },
  { id: 2, name: 'Apple Watch Series 9', brand: 'Apple', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=48&h=48&fit=crop', revenue: 11999, sold: 30, stock: 24, rating: 4.8, trend: +8 },
  { id: 3, name: 'Nike Air Max 270', brand: 'Nike', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=48&h=48&fit=crop', revenue: 8999, sold: 60, stock: 42, rating: 4.5, trend: +21 },
  { id: 4, name: 'Logitech MX Master 3S', brand: 'Logitech', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=48&h=48&fit=crop', revenue: 6999, sold: 70, stock: 55, rating: 4.8, trend: +5 },
  { id: 5, name: 'LG UltraWide 34"', brand: 'LG', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=48&h=48&fit=crop', revenue: 5499, sold: 10, stock: 3, rating: 4.7, trend: -3 },
]

const ACTIVITY = [
  { type: 'order', icon: ShoppingBag, color: 'text-blue-500 bg-blue-500/10', text: 'New order #SH-84291 from Alex Morgan', time: '2 min ago' },
  { type: 'stock', icon: AlertCircle, color: 'text-amber-500 bg-amber-500/10', text: 'LG UltraWide 34" stock critical — 3 remaining', time: '15 min ago' },
  { type: 'review', icon: Star, color: 'text-yellow-500 bg-yellow-500/10', text: 'New 5-star review on Sony WH-1000XM5', time: '32 min ago' },
  { type: 'delivery', icon: CheckCircle2, color: 'text-green-500 bg-green-500/10', text: 'Order #SH-84289 delivered to James Liu', time: '1h ago' },
  { type: 'refund', icon: RefreshCw, color: 'text-purple-500 bg-purple-500/10', text: 'Refund processed for order #SH-84287', time: '2h ago' },
  { type: 'customer', icon: Users, color: 'text-primary bg-primary/10', text: '12 new customers registered today', time: '3h ago' },
]

const CAT_SALES = [
  { label: 'Electronics', pct: 42, color: 'bg-blue-500', value: '$35,402' },
  { label: 'Fashion', pct: 28, color: 'bg-primary', value: '$23,601' },
  { label: 'Gaming', pct: 16, color: 'bg-purple-500', value: '$13,486' },
  { label: 'Home & Living', pct: 9, color: 'bg-green-500', value: '$7,586' },
  { label: 'Sports', pct: 5, color: 'bg-amber-500', value: '$4,214' },
]

const STATUS_CFG: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  processing: { label: 'Processing', dot: 'bg-amber-400', text: 'text-amber-700', bg: 'bg-amber-500/10' },
  shipped:    { label: 'Shipped',    dot: 'bg-blue-400',  text: 'text-blue-700',  bg: 'bg-blue-500/10' },
  delivered:  { label: 'Delivered',  dot: 'bg-green-400', text: 'text-green-700', bg: 'bg-green-500/10' },
  cancelled:  { label: 'Cancelled',  dot: 'bg-red-400',   text: 'text-red-700',   bg: 'bg-red-500/10' },
}

const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

/* ═══════════════════════════════════════════════════════
   SPARKLINE
═══════════════════════════════════════════════════════ */

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const h = 36, w = 80
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1].split(',')[0]} cy={pts[pts.length - 1].split(',')[1]} r="3" fill={color} />
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════
   REVENUE CHART
═══════════════════════════════════════════════════════ */

function RevenueChart({ data }: { data: typeof REVENUE_DATA.week }) {
  const max = Math.max(...data.map(d => d.rev))
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="relative">
      <div className="flex items-end gap-1.5 h-36">
        {data.map((d, i) => {
          const pct = (d.rev / max) * 100
          const isHovered = hovered === i
          return (
            <div
              key={d.day}
              className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-12 bg-foreground text-background text-[11px] font-bold px-2.5 py-1.5 rounded-xl shadow-lg whitespace-nowrap z-10">
                  ${(d.rev / 1000).toFixed(1)}K · {d.orders} orders
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-4 border-transparent border-t-foreground" />
                </div>
              )}
              <div
                className={`w-full rounded-t-lg transition-all duration-200 ${isHovered ? 'bg-primary' : 'bg-primary/30 hover:bg-primary/50'}`}
                style={{ height: `${pct}%` }}
              />
            </div>
          )
        })}
      </div>
      <div className="flex gap-1.5 mt-2">
        {data.map(d => (
          <div key={d.day} className="flex-1 text-center">
            <span className="text-[10px] text-muted-foreground font-medium">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */

export default function AdminDashboard() {
  const [period, setPeriod] = useState<'week' | 'month'>('week')
  const [ordersMenuOpen, setOrdersMenuOpen] = useState<string | null>(null)

  const chartData = REVENUE_DATA[period]
  const totalRev = chartData.reduce((s, d) => s + d.rev, 0)
  const totalOrders = chartData.reduce((s, d) => s + d.orders, 0)

  return (
    <div className="p-4 sm:p-6 xl:p-8 space-y-6 max-w-[1600px] mx-auto">

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
            <Activity size={13} className="text-green-500" />
            <span>Live · Updated just now</span>
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-card border border-border rounded-xl overflow-hidden p-1">
            {(['week', 'month'] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${period === p ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}>{p}</button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 active:scale-[0.97] transition-all shadow-md shadow-primary/20">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {KPIS.map(({ label, value, change, sub, icon: Icon, color, bg, border, spark }) => {
          const positive = change >= 0
          return (
            <div key={label} className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:shadow-black/4 hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${bg} ${border} border`}>
                  <Icon size={18} className={color} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${positive ? 'text-green-700 bg-green-500/10' : 'text-red-700 bg-red-500/10'}`}>
                  {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {Math.abs(change)}%
                </div>
              </div>
              <p className="text-3xl font-black text-foreground tracking-tight mb-1">{value}</p>
              <p className="text-xs text-muted-foreground mb-4">{label}</p>
              <div className="flex items-end justify-between">
                <p className={`text-[10px] font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>{positive ? '↑' : '↓'} {Math.abs(change)}% {sub}</p>
                <Sparkline data={spark} color={positive ? '#22c55e' : '#ef4444'} />
              </div>
            </div>
          )
        })}
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid xl:grid-cols-[1fr_340px] gap-5">

        {/* Revenue chart */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-start justify-between gap-3 mb-6">
            <div>
              <h2 className="font-black text-foreground text-base">Revenue Overview</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {period === 'week' ? 'Last 7 days' : 'Last 4 weeks'} · <span className="font-bold text-foreground">${(totalRev / 1000).toFixed(1)}K total</span> · <span className="font-bold text-foreground">{totalOrders.toLocaleString()} orders</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-3 h-1.5 bg-primary rounded-full inline-block" /> Revenue
              </div>
            </div>
          </div>
          <RevenueChart data={chartData} />

          {/* Summary row */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-border">
            {[
              { label: 'Total Revenue', val: `$${(totalRev / 1000).toFixed(1)}K`, change: '+18.2%', up: true },
              { label: 'Avg Daily', val: `$${((totalRev / chartData.length) / 1000).toFixed(1)}K`, change: '+5.4%', up: true },
              { label: 'Conversion', val: '3.24%', change: '-0.3%', up: false },
            ].map(({ label, val, change, up }) => (
              <div key={label}>
                <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                <p className="font-black text-foreground text-base">{val}</p>
                <p className={`text-[10px] font-bold ${up ? 'text-green-600' : 'text-red-600'}`}>{change} vs prev</p>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black text-foreground text-base">Sales by Category</h2>
            <Link href="/admin/analytics" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">Details <ChevronRight size={12} /></Link>
          </div>

          {/* Donut-style bar */}
          <div className="flex h-3 rounded-full overflow-hidden mb-5 gap-0.5">
            {CAT_SALES.map(cat => (
              <div key={cat.label} className={`${cat.color} transition-all`} style={{ width: `${cat.pct}%` }} title={cat.label} />
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {CAT_SALES.map(cat => (
              <div key={cat.label} className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${cat.color} shrink-0`} />
                <span className="text-sm text-foreground flex-1">{cat.label}</span>
                <span className="text-xs text-muted-foreground">{cat.pct}%</span>
                <span className="text-sm font-bold text-foreground min-w-[60px] text-right">{cat.value}</span>
              </div>
            ))}
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-border">
            {[
              { label: 'Best Category', val: 'Electronics', icon: '⚡' },
              { label: 'Fastest Growing', val: 'Gaming +34%', icon: '◈' },
            ].map(({ label, val, icon }) => (
              <div key={label} className="bg-secondary/50 rounded-xl p-3">
                <p className="text-[10px] text-muted-foreground mb-1">{label}</p>
                <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <span>{icon}</span>{val}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ORDERS + PRODUCTS GRID ── */}
      <div className="grid xl:grid-cols-[1fr_360px] gap-5">

        {/* Recent orders */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <h2 className="font-black text-foreground text-base">Recent Orders</h2>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </div>
            <Link href="/admin/orders" className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
              View all <ArrowRight size={13} />
            </Link>
          </div>

          {/* Table header */}
          <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 px-6 py-2.5 border-b border-border bg-secondary/30 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <span>Customer</span>
            <span>Items / Total</span>
            <span>Status</span>
            <span>Time</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="divide-y divide-border">
            {RECENT_ORDERS.map(order => {
              const cfg = STATUS_CFG[order.status]
              return (
                <div key={order.id} className="group grid grid-cols-[1fr_80px] sm:grid-cols-[2fr_1fr_1fr_1fr_80px] gap-4 items-center px-6 py-4 hover:bg-secondary/30 transition-colors">

                  {/* Customer */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-secondary shrink-0 border border-border/50">
                      <Image src={order.image} alt={order.customer} fill className="object-cover" sizes="36px" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{order.customer}</p>
                      <p className="text-[11px] text-muted-foreground truncate font-mono">{order.id}</p>
                    </div>
                  </div>

                  {/* Items / Total */}
                  <div className="hidden sm:block">
                    <p className="text-sm font-bold text-foreground">${order.total.toFixed(2)}</p>
                    <p className="text-[11px] text-muted-foreground">{order.items} item{order.items > 1 ? 's' : ''}</p>
                  </div>

                  {/* Status */}
                  <div className="hidden sm:block">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${cfg.text} ${cfg.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="hidden sm:block">
                    <p className="text-xs text-muted-foreground">{order.time}</p>
                  </div>

                  {/* Mobile: status + total */}
                  <div className="sm:hidden text-right">
                    <p className="text-sm font-bold text-foreground">${order.total.toFixed(2)}</p>
                    <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${cfg.text} ${cfg.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{cfg.label}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/orders/${order.id}`} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all opacity-0 group-hover:opacity-100">
                      <Eye size={14} />
                    </Link>
                    <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all opacity-0 group-hover:opacity-100">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right column: top products + activity */}
        <div className="flex flex-col gap-5">

          {/* Top products */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-black text-foreground text-base">Top Products</h2>
              <Link href="/admin/products" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">View all <ChevronRight size={12} /></Link>
            </div>
            <div className="divide-y divide-border">
              {TOP_PRODUCTS.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-secondary/30 transition-colors group">
                  <span className="text-xs font-black text-muted-foreground/40 w-4 shrink-0">{i + 1}</span>
                  <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-secondary shrink-0 border border-border/50">
                    <Image src={p.image} alt={p.name} fill className="object-cover" sizes="36px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{p.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted-foreground">{p.sold} sold</span>
                      {p.stock <= 5 && <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">Low stock</span>}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-black text-foreground">${(p.revenue / 1000).toFixed(1)}K</p>
                    <p className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${p.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {p.trend >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                      {Math.abs(p.trend)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity feed */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden flex-1">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-black text-foreground text-base">Activity</h2>
              <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all">
                <RefreshCw size={14} />
              </button>
            </div>
            <div className="divide-y divide-border">
              {ACTIVITY.map((a, i) => {
                const Icon = a.icon
                return (
                  <div key={i} className="flex items-start gap-3 px-5 py-3.5 hover:bg-secondary/20 transition-colors">
                    <div className={`p-2 rounded-xl ${a.color} shrink-0 mt-0.5`}>
                      <Icon size={12} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground/80 leading-snug">{a.text}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">{a.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM STATS STRIP ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Clock, label: 'Avg Fulfillment Time', val: '1.4 days', sub: '-12% vs last week', color: 'text-blue-600 bg-blue-500/10', up: true },
          { icon: Package, label: 'Items in Inventory', val: '12,481', sub: '342 low stock', color: 'text-amber-600 bg-amber-500/10', alert: true },
          { icon: Truck, label: 'Shipped Today', val: '84', sub: '12 pending dispatch', color: 'text-green-600 bg-green-500/10', up: true },
          { icon: Star, label: 'Avg Review Score', val: '4.81 / 5', sub: '+0.12 this month', color: 'text-yellow-600 bg-yellow-500/10', up: true },
        ].map(({ icon: Icon, label, val, sub, color, alert, up }) => (
          <div key={label} className="bg-card border border-border rounded-2xl p-4 flex items-start gap-4 hover:shadow-md hover:shadow-black/4 transition-all">
            <div className={`p-2.5 rounded-xl ${color} shrink-0`}>
              <Icon size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5 truncate">{label}</p>
              <p className="text-xl font-black text-foreground">{val}</p>
              <p className={`text-[10px] font-semibold mt-0.5 ${alert ? 'text-amber-600' : up ? 'text-green-600' : 'text-muted-foreground'}`}>{sub}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}