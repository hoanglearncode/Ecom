'use client'

import {
  ShoppingBag, Search, Filter, Download, Plus, MoreHorizontal,
  ChevronDown, ChevronRight, X, Check, Eye, RefreshCw,
  Truck, Package, RotateCcw, AlertCircle, CheckCircle2,
  Clock, Calendar, CreditCard, MapPin, Phone, Mail,
  User, Tag, Zap, ArrowUpRight, ArrowDownRight, Copy,
  Printer, Send, Ban, Edit2, Star, ExternalLink,
  TrendingUp, DollarSign, ShoppingCart, Users, Box,
  ChevronLeft, Circle, CircleDot, List, LayoutGrid,
  SlidersHorizontal, ArrowUp, ArrowDown, Receipt,
  Banknote, Wallet, Globe, Hash, Layers, LucideIcon
} from 'lucide-react'
import { useState, useRef, useEffect, useMemo, useCallback } from 'react'

/* ═══════════════════════════════════════════════════════
   TYPES & INTERFACES
═══════════════════════════════════════════════════════ */

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
type ChannelKey  = 'web' | 'mobile' | 'pos' | 'amazon' | 'wholesale'
type PaymentKey  = 'card' | 'paypal' | 'bank' | 'cod'
type FulfillmentStatus = 'fulfilled' | 'unfulfilled' | 'cancelled' | 'returned'
type SortField = 'id' | 'total' | 'customer' | 'date' | 'status' | 'channel' | 'items'
type SortDir   = 'asc' | 'desc'

interface StatusMeta {
  label: string
  color: string
  bg: string
  border: string
}

interface ChannelMeta {
  label: string
  color: string
  icon: LucideIcon
}

interface PaymentMeta {
  label: string
  color: string
  icon: LucideIcon
}

interface OrderItem {
  name: string
  sku: string
  qty: number
  price: number
  img: string
}

interface Customer {
  name: string
  email: string
  phone: string
  avatar: string
  location: string
  orders: number
  ltv: number
}

interface Order {
  id: string
  customer: Customer
  status: OrderStatus
  channel: ChannelKey
  payment: PaymentKey
  date: string
  time: string
  total: number
  subtotal: number
  shipping: number
  tax: number
  discount: number
  items: OrderItem[]
  tracking: string | null
  carrier: string | null
  tags: string[]
  note: string
  fulfillment: FulfillmentStatus
}

interface TimelineEvent {
  status: string
  time: string
  icon: LucideIcon
  done: boolean
}

interface OrderCounts {
  total: number
  revenue: number
  pending: number
  processing: number
  shipped: number
  cancelled: number
  avgOrder: number
}

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */

const STATUSES: Record<OrderStatus, StatusMeta> = {
  pending:    { label: 'Pending',    color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)' },
  confirmed:  { label: 'Confirmed',  color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)' },
  processing: { label: 'Processing', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.25)' },
  shipped:    { label: 'Shipped',    color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',   border: 'rgba(6,182,212,0.25)' },
  delivered:  { label: 'Delivered',  color: '#22c55e', bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.25)' },
  cancelled:  { label: 'Cancelled',  color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.25)' },
  refunded:   { label: 'Refunded',   color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.25)' },
}

const CHANNELS: Record<ChannelKey, ChannelMeta> = {
  web:       { label: 'Web',       color: '#3b82f6', icon: Globe },
  mobile:    { label: 'Mobile',    color: '#8b5cf6', icon: Phone },
  pos:       { label: 'POS',       color: '#22c55e', icon: ShoppingCart },
  amazon:    { label: 'Amazon',    color: '#f59e0b', icon: Package },
  wholesale: { label: 'Wholesale', color: '#06b6d4', icon: Layers },
}

const PAYMENT: Record<PaymentKey, PaymentMeta> = {
  card:   { label: 'Card',   color: '#3b82f6', icon: CreditCard },
  paypal: { label: 'PayPal', color: '#0070ba', icon: Wallet },
  bank:   { label: 'Bank',   color: '#22c55e', icon: Banknote },
  cod:    { label: 'COD',    color: '#f59e0b', icon: DollarSign },
}

const ORDERS_RAW: Order[] = [
  { id: 'ORD-9841', customer: { name: 'Nguyễn Thị Lan', email: 'lan.nguyen@gmail.com', phone: '+84 912 345 678', avatar: 'NL', location: 'Hà Nội, VN', orders: 12, ltv: 4280 }, status: 'delivered', channel: 'web', payment: 'card', date: 'Mar 21, 2026', time: '14:32', total: 284.50, subtotal: 265.00, shipping: 12.00, tax: 7.50, discount: 0, items: [{ name: 'Wireless Noise-Cancelling Headphones', sku: 'WNC-PRO-BLK', qty: 1, price: 189.00, img: '🎧' }, { name: 'USB-C Charging Cable 2m', sku: 'USB-C-2M', qty: 2, price: 38.00, img: '🔌' }], tracking: 'VNP-8472916384', carrier: 'VN Post', tags: ['VIP', 'Repeat'], note: '', fulfillment: 'fulfilled' },
  { id: 'ORD-9840', customer: { name: 'Trần Văn Minh', email: 'minh.tran@company.vn', phone: '+84 903 987 654', avatar: 'TM', location: 'TP.HCM, VN', orders: 3, ltv: 920 }, status: 'shipped', channel: 'mobile', payment: 'paypal', date: 'Mar 21, 2026', time: '11:15', total: 156.00, subtotal: 144.00, shipping: 8.00, tax: 4.00, discount: 10, items: [{ name: 'Mechanical Keyboard TKL', sku: 'MK-TKL-WHT', qty: 1, price: 144.00, img: '⌨️' }], tracking: 'GHN-3827461920', carrier: 'GHN Express', tags: [], note: 'Please leave at door', fulfillment: 'fulfilled' },
  { id: 'ORD-9839', customer: { name: 'Phạm Hương Giang', email: 'giang.ph@outlook.com', phone: '+84 934 112 233', avatar: 'PG', location: 'Đà Nẵng, VN', orders: 7, ltv: 2150 }, status: 'processing', channel: 'web', payment: 'card', date: 'Mar 21, 2026', time: '09:48', total: 532.00, subtotal: 500.00, shipping: 18.00, tax: 14.00, discount: 25, items: [{ name: 'Gaming Monitor 27" 144Hz', sku: 'GM-27-144', qty: 1, price: 380.00, img: '🖥️' }, { name: 'Monitor VESA Mount', sku: 'VESA-ARM', qty: 1, price: 65.00, img: '🔩' }, { name: 'HDMI 2.1 Cable', sku: 'HDMI-2M', qty: 2, price: 27.50, img: '🔌' }], tracking: null, carrier: null, tags: ['New'], note: '', fulfillment: 'unfulfilled' },
  { id: 'ORD-9838', customer: { name: 'Lê Quốc Bảo', email: 'bao.le@startup.io', phone: '+84 988 765 432', avatar: 'LB', location: 'Hà Nội, VN', orders: 1, ltv: 89 }, status: 'pending', channel: 'web', payment: 'bank', date: 'Mar 20, 2026', time: '22:07', total: 89.00, subtotal: 84.00, shipping: 5.00, tax: 0, discount: 0, items: [{ name: 'Smart LED Strip 5m', sku: 'LED-5M-RGB', qty: 1, price: 84.00, img: '💡' }], tracking: null, carrier: null, tags: ['New'], note: 'Gift wrapping please', fulfillment: 'unfulfilled' },
  { id: 'ORD-9837', customer: { name: 'Vũ Thanh Hà', email: 'ha.vu@design.co', phone: '+84 907 234 567', avatar: 'VH', location: 'TP.HCM, VN', orders: 19, ltv: 6840 }, status: 'delivered', channel: 'mobile', payment: 'card', date: 'Mar 20, 2026', time: '16:22', total: 1248.00, subtotal: 1200.00, shipping: 0, tax: 48.00, discount: 100, items: [{ name: 'MacBook Pro Stand Aluminum', sku: 'MBP-STAND', qty: 1, price: 120.00, img: '💻' }, { name: 'Logitech MX Master 3S', sku: 'MX-M3S', qty: 1, price: 99.00, img: '🖱️' }, { name: 'Keychron K2 Keyboard', sku: 'KC-K2-RGB', qty: 1, price: 110.00, img: '⌨️' }, { name: '4K Webcam 60fps', sku: 'CAM-4K-60', qty: 1, price: 149.00, img: '📷' }, { name: 'USB Hub 7-Port', sku: 'USB-7P', qty: 2, price: 45.00, img: '🔌' }, { name: 'Desk Cable Manager', sku: 'CBL-MGR', qty: 1, price: 32.00, img: '🗂️' }], tracking: 'VTP-9192837465', carrier: 'Viettel Post', tags: ['VIP', 'Bulk'], note: '', fulfillment: 'fulfilled' },
  { id: 'ORD-9836', customer: { name: 'Đặng Minh Tuấn', email: 'tuan.dang@corp.com', phone: '+84 963 456 789', avatar: 'DT', location: 'Cần Thơ, VN', orders: 5, ltv: 1340 }, status: 'cancelled', channel: 'pos', payment: 'cod', date: 'Mar 19, 2026', time: '10:14', total: 245.00, subtotal: 230.00, shipping: 15.00, tax: 0, discount: 0, items: [{ name: 'Portable Bluetooth Speaker', sku: 'SPK-BT-BLK', qty: 1, price: 230.00, img: '🔊' }], tracking: null, carrier: null, tags: [], note: 'Customer requested cancellation', fulfillment: 'cancelled' },
  { id: 'ORD-9835', customer: { name: 'Hoàng Thị Kim Anh', email: 'kimanh@mail.vn', phone: '+84 918 876 543', avatar: 'HA', location: 'Hải Phòng, VN', orders: 8, ltv: 2980 }, status: 'refunded', channel: 'web', payment: 'card', date: 'Mar 19, 2026', time: '08:55', total: 178.00, subtotal: 165.00, shipping: 8.00, tax: 5.00, discount: 0, items: [{ name: 'Smart Home Hub', sku: 'SHH-V3', qty: 1, price: 165.00, img: '🏠' }], tracking: 'VNP-7382910485', carrier: 'VN Post', tags: [], note: 'Item defective on arrival', fulfillment: 'returned' },
  { id: 'ORD-9834', customer: { name: 'Bùi Văn Long', email: 'long.bui@freelance.vn', phone: '+84 945 321 987', avatar: 'BL', location: 'Hà Nội, VN', orders: 2, ltv: 340 }, status: 'confirmed', channel: 'amazon', payment: 'card', date: 'Mar 18, 2026', time: '19:40', total: 316.00, subtotal: 298.00, shipping: 12.00, tax: 6.00, discount: 0, items: [{ name: 'Ergonomic Mouse Vertical', sku: 'MS-VERT-BLK', qty: 1, price: 68.00, img: '🖱️' }, { name: '32GB RAM DDR5 Kit', sku: 'RAM-32-DDR5', qty: 1, price: 230.00, img: '💾' }], tracking: null, carrier: null, tags: [], note: '', fulfillment: 'unfulfilled' },
  { id: 'ORD-9833', customer: { name: 'Ngô Thị Thủy', email: 'thuy.ngo@edu.vn', phone: '+84 902 654 321', avatar: 'NT', location: 'TP.HCM, VN', orders: 4, ltv: 1120 }, status: 'shipped', channel: 'mobile', payment: 'paypal', date: 'Mar 18, 2026', time: '14:28', total: 94.50, subtotal: 88.00, shipping: 5.00, tax: 1.50, discount: 5, items: [{ name: 'Laptop Stand Foldable', sku: 'LPS-FOLD', qty: 1, price: 55.00, img: '💻' }, { name: 'Phone Ring Holder', sku: 'RNG-HLD', qty: 1, price: 33.00, img: '📱' }], tracking: 'GHTK-4729103847', carrier: 'GHTK', tags: [], note: '', fulfillment: 'fulfilled' },
  { id: 'ORD-9832', customer: { name: 'Phan Anh Dũng', email: 'dung.pa@tech.vn', phone: '+84 978 012 345', avatar: 'PD', location: 'Hà Nội, VN', orders: 6, ltv: 1890 }, status: 'delivered', channel: 'wholesale', payment: 'bank', date: 'Mar 17, 2026', time: '11:02', total: 2140.00, subtotal: 2000.00, shipping: 0, tax: 140.00, discount: 200, items: [{ name: 'Dell 27" Monitor P2722H', sku: 'DELL-P27', qty: 5, price: 320.00, img: '🖥️' }, { name: 'Logitech Keyboard K380', sku: 'LG-K380', qty: 5, price: 75.00, img: '⌨️' }], tracking: 'VTP-8273649102', carrier: 'Viettel Post', tags: ['Wholesale', 'VIP'], note: 'Corporate billing address', fulfillment: 'fulfilled' },
]

const TIMELINE_EVENTS: Record<string, TimelineEvent[]> = {
  'ORD-9841': [
    { status: 'Order Placed',      time: 'Mar 21, 14:32',    icon: ShoppingBag,  done: true },
    { status: 'Payment Confirmed', time: 'Mar 21, 14:33',    icon: CreditCard,   done: true },
    { status: 'Processing',        time: 'Mar 21, 15:00',    icon: Package,      done: true },
    { status: 'Shipped',           time: 'Mar 21, 18:42',    icon: Truck,        done: true },
    { status: 'Delivered',         time: 'Mar 22, 10:15',    icon: CheckCircle2, done: true },
  ],
  'ORD-9840': [
    { status: 'Order Placed',      time: 'Mar 21, 11:15',    icon: ShoppingBag,  done: true },
    { status: 'Payment Confirmed', time: 'Mar 21, 11:16',    icon: CreditCard,   done: true },
    { status: 'Processing',        time: 'Mar 21, 12:00',    icon: Package,      done: true },
    { status: 'Shipped',           time: 'Mar 21, 16:30',    icon: Truck,        done: true },
    { status: 'Delivered',         time: 'Estimated Mar 23', icon: CheckCircle2, done: false },
  ],
  default: [
    { status: 'Order Placed',      time: 'Completed',   icon: ShoppingBag,  done: true },
    { status: 'Payment Confirmed', time: 'Completed',   icon: CreditCard,   done: true },
    { status: 'Processing',        time: 'In Progress', icon: Package,      done: false },
    { status: 'Shipped',           time: 'Pending',     icon: Truck,        done: false },
    { status: 'Delivered',         time: 'Pending',     icon: CheckCircle2, done: false },
  ],
}

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */

const fmt = (n: number): string =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/* ═══════════════════════════════════════════════════════
   AVATAR
═══════════════════════════════════════════════════════ */

interface AvatarProps {
  initials: string
  size?: number
  color?: string
}

function Avatar({ initials, size = 36, color }: AvatarProps) {
  const colors = ['#E40F2A', '#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#06b6d4', '#ec4899', '#10b981']
  const idx = initials.charCodeAt(0) % colors.length
  const bg = color ?? colors[idx]
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.3, background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, fontSize: size * 0.32, fontWeight: 900, color: 'white', letterSpacing: '-0.5px'
    }}>
      {initials}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   BADGES
═══════════════════════════════════════════════════════ */

interface StatusBadgeProps {
  status: OrderStatus
}

function StatusBadge({ status }: StatusBadgeProps) {
  const s = STATUSES[status]
  return (
    <span style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}`, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
      {s.label}
    </span>
  )
}

interface ChannelBadgeProps {
  channel: ChannelKey
}

function ChannelBadge({ channel }: ChannelBadgeProps) {
  const c = CHANNELS[channel]
  const Icon = c.icon
  return (
    <span style={{ color: c.color, background: `${c.color}12`, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      <Icon size={9} />{c.label}
    </span>
  )
}

interface PayBadgeProps {
  payment: PaymentKey
}

function PayBadge({ payment }: PayBadgeProps) {
  const p = PAYMENT[payment]
  const Icon = p.icon
  return (
    <span style={{ color: p.color, fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <Icon size={12} />{p.label}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════
   MINI BAR
═══════════════════════════════════════════════════════ */

interface MiniBarProps {
  values: number[]
  color: string
}

function MiniBar({ values, color }: MiniBarProps) {
  const max = Math.max(...values)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 28 }}>
      {values.map((v, i) => (
        <div key={i} style={{
          flex: 1, borderRadius: 3,
          background: i === values.length - 1 ? color : `${color}40`,
          height: `${(v / max) * 100}%`, minHeight: 3, transition: 'height 0.3s'
        }} />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   ORDER DETAIL PANEL
═══════════════════════════════════════════════════════ */

type PanelTab = 'details' | 'timeline' | 'customer'

interface OrderPanelProps {
  order: Order
  onClose: () => void
  onStatusChange: (id: string, newStatus: OrderStatus) => void
}

function OrderPanel({ order, onClose, onStatusChange }: OrderPanelProps) {
  const [tab, setTab] = useState<PanelTab>('details')
  const [copied, setCopied] = useState<boolean>(false)
  const timeline: TimelineEvent[] = TIMELINE_EVENTS[order.id] ?? TIMELINE_EVENTS['default']
  const s = STATUSES[order.status]

  const tabLabels: Array<[PanelTab, string]> = [
    ['details',  'Details'],
    ['timeline', 'Timeline'],
    ['customer', 'Customer'],
  ]

  const totalItems: Array<{ label: string; val: number }> = [
    { label: 'Subtotal', val: order.subtotal },
    { label: 'Shipping', val: order.shipping },
    { label: 'Tax',      val: order.tax },
    ...(order.discount > 0 ? [{ label: 'Discount', val: -order.discount }] : []),
  ]

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px]" onClick={onClose} />
      <div className="relative ml-auto flex flex-col bg-white shadow-2xl" style={{ width: '100%', maxWidth: 480, height: '100%' }}>
        {/* Status accent strip */}
        <div style={{ height: 3, background: s.color, flexShrink: 0 }} />

        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={onClose} style={{ padding: 6, borderRadius: 10, background: '#f5f5f5', border: 'none', cursor: 'pointer', display: 'flex', color: '#666' }}>
                <X size={15} />
              </button>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 900, color: '#1a1a1a', fontFamily: 'monospace' }}>{order.id}</span>
                  <StatusBadge status={order.status} />
                </div>
                <p style={{ fontSize: 11, color: '#aaa', marginTop: 1 }}>{order.date} at {order.time}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={{ padding: '7px 14px', borderRadius: 10, background: '#f5f5f5', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#555', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Printer size={12} /> Print
              </button>
              <button style={{ padding: '7px 14px', borderRadius: 10, background: '#1a1a1a', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Edit2 size={12} /> Edit
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 2 }}>
            {tabLabels.map(([v, l]) => (
              <button key={v} onClick={() => setTab(v)}
                style={{ padding: '7px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, transition: 'all 0.15s', background: tab === v ? '#1a1a1a' : 'transparent', color: tab === v ? 'white' : '#aaa' }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>

          {/* ── DETAILS TAB ── */}
          {tab === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Customer snippet */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: '#fafafa', borderRadius: 16, border: '1px solid #f0f0f0' }}>
                <Avatar initials={order.customer.avatar} size={42} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: '#1a1a1a' }}>{order.customer.name}</p>
                  <p style={{ fontSize: 11, color: '#aaa', marginTop: 1 }}>{order.customer.email}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 11, color: '#aaa' }}>{order.customer.orders} orders</p>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a' }}>{fmt(order.customer.ltv)} LTV</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#bbb', marginBottom: 10 }}>
                  Items ({order.items.length})
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#fafafa', borderRadius: 14, border: '1px solid #f0f0f0' }}>
                      <div style={{ width: 40, height: 40, background: '#f0f0f0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                        {item.img}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.3, marginBottom: 2 }}>{item.name}</p>
                        <p style={{ fontSize: 10, color: '#bbb', fontFamily: 'monospace' }}>{item.sku}</p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 800, color: '#1a1a1a' }}>{fmt(item.price * item.qty)}</p>
                        <p style={{ fontSize: 10, color: '#aaa' }}>×{item.qty} @ {fmt(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div style={{ background: '#fafafa', borderRadius: 16, border: '1px solid #f0f0f0', overflow: 'hidden' }}>
                {totalItems.map(({ label, val }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ fontSize: 12, color: '#888' }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: val < 0 ? '#22c55e' : '#1a1a1a' }}>
                      {val < 0 ? '-' : ''}{fmt(Math.abs(val))}
                    </span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#f5f5f5' }}>
                  <span style={{ fontSize: 14, fontWeight: 900, color: '#1a1a1a' }}>Total</span>
                  <span style={{ fontSize: 16, fontWeight: 900, color: '#1a1a1a' }}>{fmt(order.total)}</span>
                </div>
              </div>

              {/* Payment & Channel */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  {
                    label: 'Payment',
                    content: <PayBadge payment={order.payment} />
                  },
                  {
                    label: 'Channel',
                    content: <ChannelBadge channel={order.channel} />
                  },
                  {
                    label: 'Fulfillment',
                    content: (
                      <span style={{
                        fontSize: 12, fontWeight: 700, textTransform: 'capitalize',
                        color: order.fulfillment === 'fulfilled' ? '#22c55e' : order.fulfillment === 'cancelled' ? '#ef4444' : '#f59e0b'
                      }}>
                        {order.fulfillment}
                      </span>
                    )
                  },
                  {
                    label: 'Tags',
                    content: order.tags.length > 0
                      ? (
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {order.tags.map((t) => (
                            <span key={t} style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', background: 'rgba(228,15,42,0.08)', color: '#E40F2A', borderRadius: 6 }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      )
                      : <span style={{ fontSize: 11, color: '#ccc' }}>None</span>
                  },
                ].map(({ label, content }) => (
                  <div key={label} style={{ padding: 14, background: '#fafafa', borderRadius: 14, border: '1px solid #f0f0f0' }}>
                    <p style={{ fontSize: 10, color: '#bbb', marginBottom: 5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
                    {content}
                  </div>
                ))}
              </div>

              {/* Tracking */}
              {order.tracking && (
                <div style={{ padding: 16, background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <Truck size={14} style={{ color: '#06b6d4' }} />
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#1a1a1a' }}>Tracking</span>
                    <span style={{ fontSize: 11, color: '#888' }}>{order.carrier}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <code style={{ fontSize: 13, fontWeight: 700, color: '#06b6d4', letterSpacing: '0.05em' }}>{order.tracking}</code>
                    <button
                      onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                      style={{ padding: '4px 10px', borderRadius: 8, background: copied ? '#22c55e' : '#06b6d4', border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {copied ? <><Check size={10} />Copied</> : <><Copy size={10} />Copy</>}
                    </button>
                  </div>
                </div>
              )}

              {/* Note */}
              {order.note && (
                <div style={{ padding: 14, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 14 }}>
                  <p style={{ fontSize: 10, fontWeight: 800, color: '#d97706', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Customer Note</p>
                  <p style={{ fontSize: 12, color: '#555', lineHeight: 1.5 }}>"{order.note}"</p>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
                {order.status === 'pending' && (
                  <button onClick={() => onStatusChange(order.id, 'confirmed')}
                    style={{ width: '100%', padding: 14, borderRadius: 16, background: '#1a1a1a', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <CheckCircle2 size={15} /> Confirm Order
                  </button>
                )}
                {order.status === 'confirmed' && (
                  <button onClick={() => onStatusChange(order.id, 'processing')}
                    style={{ width: '100%', padding: 14, borderRadius: 16, background: '#1a1a1a', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <Package size={15} /> Mark as Processing
                  </button>
                )}
                {order.status === 'processing' && (
                  <button onClick={() => onStatusChange(order.id, 'shipped')}
                    style={{ width: '100%', padding: 14, borderRadius: 16, background: '#06b6d4', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <Truck size={15} /> Mark as Shipped
                  </button>
                )}
                {order.status === 'shipped' && (
                  <button onClick={() => onStatusChange(order.id, 'delivered')}
                    style={{ width: '100%', padding: 14, borderRadius: 16, background: '#22c55e', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <CheckCircle2 size={15} /> Mark as Delivered
                  </button>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ flex: 1, padding: 11, borderRadius: 14, background: '#fafafa', border: '1px solid #eee', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Send size={12} /> Email Customer
                  </button>
                  {!(['cancelled', 'refunded'] as OrderStatus[]).includes(order.status) && (
                    <button onClick={() => onStatusChange(order.id, 'cancelled')}
                      style={{ flex: 1, padding: 11, borderRadius: 14, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <Ban size={12} /> Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── TIMELINE TAB ── */}
          {tab === 'timeline' && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#bbb', marginBottom: 16 }}>Order Progress</p>
              <div style={{ position: 'relative' }}>
                {/* Vertical line */}
                <div style={{ position: 'absolute', left: 15, top: 8, bottom: 8, width: 2, background: '#f0f0f0', borderRadius: 2 }} />
                <div style={{
                  position: 'absolute', left: 15, top: 8, width: 2, background: '#E40F2A', borderRadius: 2,
                  height: `${(timeline.filter((e) => e.done).length / timeline.length) * 100}%`,
                  transition: 'height 0.5s ease'
                }} />
                {timeline.map((event, i) => {
                  const Icon = event.icon
                  const doneCount = timeline.filter((e) => e.done).length
                  const isCurrentStep = event.done && i === doneCount - 1
                  return (
                    <div key={i} style={{ display: 'flex', gap: 16, marginBottom: i < timeline.length - 1 ? 28 : 0, position: 'relative' }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: event.done ? (isCurrentStep ? '#E40F2A' : '#22c55e') : '#f0f0f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, zIndex: 1, transition: 'all 0.3s',
                        boxShadow: event.done ? `0 0 0 4px ${isCurrentStep ? 'rgba(228,15,42,0.15)' : 'rgba(34,197,94,0.15)'}` : 'none'
                      }}>
                        <Icon size={13} style={{ color: event.done ? 'white' : '#ccc' }} />
                      </div>
                      <div style={{ paddingTop: 4 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: event.done ? '#1a1a1a' : '#bbb' }}>{event.status}</p>
                        <p style={{ fontSize: 11, color: event.done ? '#888' : '#ccc', marginTop: 2 }}>{event.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── CUSTOMER TAB ── */}
          {tab === 'customer' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Avatar + name */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px', background: '#fafafa', borderRadius: 20, border: '1px solid #f0f0f0', textAlign: 'center' }}>
                <Avatar initials={order.customer.avatar} size={56} />
                <h3 style={{ fontSize: 16, fontWeight: 900, color: '#1a1a1a', marginTop: 12 }}>{order.customer.name}</h3>
                <p style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{order.customer.location}</p>
                <div style={{ display: 'flex', gap: 20, marginTop: 14 }}>
                  {([
                    { label: 'Orders',         val: String(order.customer.orders) },
                    { label: 'Lifetime Value', val: fmt(order.customer.ltv) },
                  ] as const).map(({ label, val }) => (
                    <div key={label}>
                      <p style={{ fontSize: 18, fontWeight: 900, color: '#1a1a1a' }}>{val}</p>
                      <p style={{ fontSize: 10, color: '#bbb', fontWeight: 600 }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {([
                  { icon: Mail,   label: order.customer.email },
                  { icon: Phone,  label: order.customer.phone },
                  { icon: MapPin, label: order.customer.location },
                ] as Array<{ icon: LucideIcon; label: string }>).map(({ icon: Icon, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: '#fafafa', borderRadius: 14, border: '1px solid #f0f0f0' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(228,15,42,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={14} style={{ color: '#E40F2A' }} />
                    </div>
                    <span style={{ fontSize: 13, color: '#333' }}>{label}</span>
                  </div>
                ))}
              </div>

              <button style={{ width: '100%', padding: 14, borderRadius: 16, background: '#fafafa', border: '1px solid #eee', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <ExternalLink size={14} /> View Full Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   ORDER ROW
═══════════════════════════════════════════════════════ */

interface OrderRowProps {
  order: Order
  selected: boolean
  onSelect: (id: string) => void
  onView: (order: Order) => void
  idx: number
}

function OrderRow({ order, selected, onSelect, onView, idx }: OrderRowProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const menuItems: Array<{ icon: LucideIcon; label: string; fn: () => void; danger?: boolean }> = [
    { icon: Eye,     label: 'View details',   fn: () => { onView(order); setMenuOpen(false) } },
    { icon: Edit2,   label: 'Edit order',     fn: () => setMenuOpen(false) },
    { icon: Send,    label: 'Email customer', fn: () => setMenuOpen(false) },
    { icon: Printer, label: 'Print invoice',  fn: () => setMenuOpen(false) },
    { icon: Copy,    label: 'Duplicate',      fn: () => setMenuOpen(false) },
    { icon: Ban,     label: 'Cancel order',   fn: () => setMenuOpen(false), danger: true },
  ]

  return (
    <div
      className="group"
      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px', borderBottom: '1px solid #f5f5f5', transition: 'background 0.12s', background: selected ? 'rgba(228,15,42,0.03)' : 'white', animationDelay: `${idx * 25}ms` }}
      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = '#fafafa' }}
      onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = 'white' }}
    >
      {/* Checkbox */}
      <button
        onClick={() => onSelect(order.id)}
        style={{ width: 18, height: 18, borderRadius: 5, border: selected ? '2px solid #E40F2A' : '1px solid #ddd', background: selected ? '#E40F2A' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s' }}
      >
        {selected && <Check size={10} color="white" strokeWidth={3} />}
      </button>

      {/* Order ID */}
      <button
        onClick={() => onView(order)}
        style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 800, color: '#1a1a1a', minWidth: 82, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.color = '#E40F2A')}
        onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.color = '#1a1a1a')}
      >
        {order.id}
      </button>

      {/* Customer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, flex: 1, minWidth: 0 }}>
        <Avatar initials={order.customer.avatar} size={30} />
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.customer.name}</p>
          <p style={{ fontSize: 10, color: '#bbb', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.customer.email}</p>
        </div>
      </div>

      {/* Date */}
      <div style={{ display: 'none', flexDirection: 'column', minWidth: 80, flexShrink: 0 }} className="md-show">
        <p style={{ fontSize: 11, color: '#555', fontWeight: 600 }}>{order.date}</p>
        <p style={{ fontSize: 10, color: '#bbb' }}>{order.time}</p>
      </div>

      {/* Status */}
      <div style={{ minWidth: 90, flexShrink: 0 }}>
        <StatusBadge status={order.status} />
      </div>

      {/* Channel */}
      <div style={{ minWidth: 72, flexShrink: 0 }} className="lg-show">
        <ChannelBadge channel={order.channel} />
      </div>

      {/* Items */}
      <div style={{ minWidth: 40, textAlign: 'center', flexShrink: 0 }} className="xl-show">
        <span style={{ fontSize: 12, fontWeight: 700, color: '#555' }}>{order.items.length}</span>
        <p style={{ fontSize: 9, color: '#bbb', fontWeight: 600 }}>items</p>
      </div>

      {/* Total */}
      <div style={{ minWidth: 80, textAlign: 'right', flexShrink: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 900, color: '#1a1a1a' }}>{fmt(order.total)}</p>
        {order.discount > 0 && <p style={{ fontSize: 9, color: '#22c55e', fontWeight: 700 }}>-{fmt(order.discount)} off</p>}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 4, flexShrink: 0, opacity: 0, transition: 'opacity 0.15s' }} className="row-actions">
        <button
          onClick={() => onView(order)}
          style={{ padding: '6px 10px', borderRadius: 9, background: '#1a1a1a', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: 'white' }}
        >
          <Eye size={11} /> View
        </button>
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            style={{ padding: '6px 8px', borderRadius: 9, background: '#f5f5f5', border: 'none', cursor: 'pointer', color: '#888' }}
          >
            <MoreHorizontal size={13} />
          </button>
          {menuOpen && (
            <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 4px)', width: 168, background: 'white', border: '1px solid #eee', borderRadius: 16, boxShadow: '0 8px 30px rgba(0,0,0,0.1)', padding: '6px 0', zIndex: 30 }}>
              {menuItems.map(({ icon: Icon, label, fn, danger }) => (
                <button
                  key={label}
                  onClick={fn}
                  style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '9px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: danger ? '#ef4444' : '#374151', textAlign: 'left' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.06)' : '#f9fafb')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <Icon size={12} />{label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════ */

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(ORDERS_RAW)
  const [search, setSearch] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [channelFilter, setChannelFilter] = useState<ChannelKey | 'all'>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [sortField, setSortField] = useState<SortField>('id')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState<number>(1)
  const PER_PAGE = 8

  useEffect(() => {
    document.body.style.overflow = selectedOrder ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedOrder])

  const handleStatusChange = useCallback((id: string, newStatus: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)))
    setSelectedOrder((prev) => (prev?.id === id ? { ...prev, status: newStatus } : prev))
  }, [])

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }, [])

  const filtered = useMemo<Order[]>(() => {
    let list = orders
    if (statusFilter !== 'all') list = list.filter((o) => o.status === statusFilter)
    if (channelFilter !== 'all') list = list.filter((o) => o.channel === channelFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((o) =>
        o.id.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q)
      )
    }
    list = [...list].sort((a, b) => {
      let av: string | number
      let bv: string | number
      if (sortField === 'total')    { av = a.total;         bv = b.total }
      else if (sortField === 'customer') { av = a.customer.name; bv = b.customer.name }
      else                          { av = a.id;            bv = b.id }
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
    })
    return list
  }, [orders, statusFilter, channelFilter, search, sortField, sortDir])

  const toggleAll = useCallback(() => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set())
    else setSelectedIds(new Set(filtered.map((o) => o.id)))
  }, [selectedIds.size, filtered])

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortField(field); setSortDir('desc') }
  }, [sortField])

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  const counts = useMemo<OrderCounts>(() => ({
    total:      orders.length,
    revenue:    orders.filter((o) => !(['cancelled', 'refunded'] as OrderStatus[]).includes(o.status)).reduce((s, o) => s + o.total, 0),
    pending:    orders.filter((o) => o.status === 'pending').length,
    processing: orders.filter((o) => (['confirmed', 'processing'] as OrderStatus[]).includes(o.status)).length,
    shipped:    orders.filter((o) => o.status === 'shipped').length,
    cancelled:  orders.filter((o) => o.status === 'cancelled').length,
    avgOrder:   orders.length ? orders.reduce((s, o) => s + o.total, 0) / orders.length : 0,
  }), [orders])

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ArrowUp size={10} style={{ color: '#ccc' }} />
    return sortDir === 'asc'
      ? <ArrowUp  size={10} style={{ color: '#E40F2A' }} />
      : <ArrowDown size={10} style={{ color: '#E40F2A' }} />
  }

  const statCards = [
    { label: 'Total Orders', val: counts.total,            icon: ShoppingCart, color: '#64748b', bg: '#f1f5f9',               spark: [4,6,5,8,7,9,10,8,11,10,12,10] },
    { label: 'Revenue',      val: fmt(counts.revenue),     icon: DollarSign,   color: '#22c55e', bg: 'rgba(34,197,94,0.1)',    spark: [60,80,70,90,85,95,88,102,95,108,100,115] },
    { label: 'Avg Order',    val: fmt(counts.avgOrder),    icon: Receipt,      color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',   spark: [42,45,43,47,50,46,52,49,54,51,56,53] },
    { label: 'Pending',      val: counts.pending,          icon: Clock,        color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   spark: [2,3,2,4,3,5,4,3,2,3,4,counts.pending] },
    { label: 'Shipped',      val: counts.shipped,          icon: Truck,        color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',    spark: [1,2,3,2,4,3,4,5,4,5,4,counts.shipped] },
    { label: 'Cancelled',    val: counts.cancelled,        icon: Ban,          color: '#ef4444', bg: 'rgba(239,68,68,0.1)',    spark: [3,2,3,1,2,1,2,1,2,1,1,counts.cancelled] },
  ] as const

  const tableHeaders: Array<{ label: string; field: SortField; flex?: number; minWidth?: number; align?: 'right'; cls?: string }> = [
    { label: 'Order ID',  field: 'id',       minWidth: 82 },
    { label: 'Customer',  field: 'customer', flex: 1 },
    { label: 'Date',      field: 'date',     minWidth: 80, cls: 'md-show' },
    { label: 'Status',    field: 'status',   minWidth: 90 },
    { label: 'Channel',   field: 'channel',  minWidth: 72, cls: 'lg-show' },
    { label: 'Items',     field: 'items',    minWidth: 40, cls: 'xl-show' },
    { label: 'Total',     field: 'total',    minWidth: 80, align: 'right' },
  ]

  const bulkActions: Array<{ icon: LucideIcon; label: string; color: string }> = [
    { icon: CheckCircle2, label: 'Mark Confirmed', color: '#3b82f6' },
    { icon: Truck,        label: 'Mark Shipped',   color: '#06b6d4' },
    { icon: Download,     label: 'Export',         color: '#555' },
    { icon: Printer,      label: 'Print',          color: '#555' },
    { icon: Ban,          label: 'Cancel',         color: '#ef4444' },
  ]

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: '#f7f7f7', minHeight: '100vh' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .order-row { animation: fadeUp 0.2s ease both; }
        .group:hover .row-actions { opacity: 1 !important; }
        @media (min-width: 768px)  { .md-show { display: flex !important; } }
        @media (min-width: 1024px) { .lg-show { display: block !important; } }
        @media (min-width: 1280px) { .xl-show { display: block !important; } }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 99px; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.06) !important; }
        .filter-btn:hover { border-color: #ddd !important; color: #333 !important; }
      `}</style>

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '28px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── HEADER ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: '#E40F2A', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(228,15,42,0.3)' }}>
                <ShoppingBag size={16} color="white" />
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.6px', margin: 0 }}>Orders</h1>
              <span style={{ padding: '3px 10px', background: '#f0f0f0', borderRadius: 8, fontSize: 12, fontWeight: 700, color: '#888' }}>{filtered.length}</span>
            </div>
            <p style={{ fontSize: 13, color: '#aaa', margin: 0 }}>
              {counts.pending > 0    && <span style={{ color: '#f59e0b', fontWeight: 700 }}>{counts.pending} pending · </span>}
              {counts.processing > 0 && <span style={{ color: '#8b5cf6', fontWeight: 700 }}>{counts.processing} processing · </span>}
              {counts.shipped > 0    && <span style={{ color: '#06b6d4', fontWeight: 700 }}>{counts.shipped} shipped · </span>}
              <span>Revenue: <strong style={{ color: '#22c55e' }}>{fmt(counts.revenue)}</strong></span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button style={{ padding: '9px 16px', borderRadius: 12, background: 'white', border: '1px solid #eee', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#555', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <Download size={13} style={{ color: '#aaa' }} /> Export
            </button>
            <button
              style={{ padding: '9px 18px', borderRadius: 12, background: '#E40F2A', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 14px rgba(228,15,42,0.28)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#c40d24')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#E40F2A')}
            >
              <Plus size={13} /> New Order
            </button>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          {statCards.map(({ label, val, icon: Icon, color, bg, spark }) => (
            <div key={label} className="stat-card"
              style={{ background: 'white', border: '1px solid #ebebeb', borderRadius: 18, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'all 0.2s', cursor: 'default' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={15} style={{ color }} />
                </div>
                <MiniBar values={[...spark]} color={color} />
              </div>
              <div>
                <p style={{ fontSize: 22, fontWeight: 900, color: '#1a1a1a', lineHeight: 1, marginBottom: 3 }}>{val}</p>
                <p style={{ fontSize: 11, color: '#bbb', fontWeight: 600 }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── FILTER BAR ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 320 }}>
            <Search size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#bbb', pointerEvents: 'none' }} />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search orders, customers…"
              style={{ width: '100%', paddingLeft: 38, paddingRight: search ? 34 : 16, paddingTop: 10, paddingBottom: 10, background: 'white', border: '1px solid #eee', borderRadius: 12, fontSize: 13, color: '#1a1a1a', outline: 'none', boxSizing: 'border-box', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
              onFocus={(e) => (e.target.style.borderColor = '#E40F2A')}
              onBlur={(e)  => (e.target.style.borderColor = '#eee')}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', display: 'flex' }}>
                <X size={13} />
              </button>
            )}
          </div>

          {/* Status */}
          <div style={{ display: 'flex', gap: 4, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {([['all', 'All'], ...Object.entries(STATUSES).map(([k, v]) => [k, v.label])] as [string, string][]).map(([val, label]) => {
              const active = statusFilter === val
              const s = val !== 'all' ? STATUSES[val as OrderStatus] : null
              return (
                <button key={val}
                  onClick={() => { setStatusFilter(val as OrderStatus | 'all'); setPage(1) }}
                  style={{ padding: '7px 13px', borderRadius: 10, border: active ? `1px solid ${s ? s.color : '#1a1a1a'}40` : '1px solid #eee', background: active ? (s ? s.bg : '#1a1a1a') : 'white', color: active ? (s ? s.color : 'white') : '#888', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s', flexShrink: 0, boxShadow: active ? `0 2px 8px ${s ? s.color : '#1a1a1a'}20` : 'none' }}>
                  {label}
                </button>
              )
            })}
          </div>

          <div style={{ flex: 1 }} />

          {/* Channel filter */}
          <select
            value={channelFilter}
            onChange={(e) => { setChannelFilter(e.target.value as ChannelKey | 'all'); setPage(1) }}
            style={{ padding: '9px 14px', background: 'white', border: '1px solid #eee', borderRadius: 12, fontSize: 12, color: '#555', outline: 'none', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <option value="all">All Channels</option>
            {(Object.entries(CHANNELS) as [ChannelKey, ChannelMeta][]).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>

          {/* Sort */}
          <button
            onClick={() => handleSort('total')}
            style={{ padding: '9px 14px', background: 'white', border: '1px solid #eee', borderRadius: 12, fontSize: 12, color: '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <SlidersHorizontal size={13} style={{ color: '#bbb' }} />
            Sort by Total
            <SortIcon field="total" />
          </button>
        </div>

        {/* ── BULK ACTIONS ── */}
        {selectedIds.size > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'rgba(228,15,42,0.04)', border: '1px solid rgba(228,15,42,0.15)', borderRadius: 14, animation: 'fadeUp 0.15s ease' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#E40F2A' }}>{selectedIds.size} selected</span>
            <div style={{ width: 1, height: 16, background: 'rgba(228,15,42,0.2)' }} />
            {bulkActions.map(({ icon: Icon, label, color }) => (
              <button key={label}
                style={{ padding: '6px 12px', borderRadius: 9, background: 'white', border: '1px solid #eee', cursor: 'pointer', fontSize: 11, fontWeight: 700, color, display: 'flex', alignItems: 'center', gap: 5 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f9f9f9')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
              >
                <Icon size={11} />{label}
              </button>
            ))}
            <button
              onClick={() => setSelectedIds(new Set())}
              style={{ marginLeft: 'auto', padding: '5px 10px', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: 11 }}
            >
              Clear
            </button>
          </div>
        )}

        {/* ── TABLE ── */}
        <div style={{ background: 'white', border: '1px solid #ebebeb', borderRadius: 20, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          {/* Table header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '11px 20px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
            <button
              onClick={toggleAll}
              style={{ width: 18, height: 18, borderRadius: 5, border: (selectedIds.size === filtered.length && filtered.length > 0) ? '2px solid #E40F2A' : '1px solid #ddd', background: (selectedIds.size === filtered.length && filtered.length > 0) ? '#E40F2A' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s' }}
            >
              {selectedIds.size === filtered.length && filtered.length > 0 && <Check size={10} color="white" strokeWidth={3} />}
            </button>
            {tableHeaders.map(({ label, field, flex, minWidth, align, cls }) => (
              <button
                key={field}
                onClick={() => handleSort(field)}
                className={cls ?? ''}
                style={{ display: cls ? 'none' : 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bbb', background: 'none', border: 'none', cursor: 'pointer', padding: 0, flex: flex ?? undefined, minWidth, justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}
              >
                {label} <SortIcon field={field} />
              </button>
            ))}
            <div style={{ minWidth: 90, flexShrink: 0 }} />
          </div>

          {/* Rows */}
          {paginated.length === 0 ? (
            <div style={{ padding: '64px 20px', textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, background: '#f5f5f5', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <ShoppingBag size={22} style={{ color: '#ccc' }} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: '#1a1a1a', marginBottom: 6 }}>No orders found</h3>
              <p style={{ fontSize: 13, color: '#aaa' }}>{search ? `No results for "${search}"` : 'Try adjusting your filters.'}</p>
            </div>
          ) : (
            paginated.map((order, i) => (
              <div key={order.id} className="order-row" style={{ animationDelay: `${i * 30}ms` }}>
                <OrderRow order={order} selected={selectedIds.has(order.id)} onSelect={toggleSelect} onView={setSelectedOrder} idx={i} />
              </div>
            ))
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
              <span style={{ fontSize: 12, color: '#aaa' }}>
                Showing {((page - 1) * PER_PAGE) + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{ padding: '7px 12px', borderRadius: 10, background: page === 1 ? '#f5f5f5' : 'white', border: '1px solid #eee', cursor: page === 1 ? 'default' : 'pointer', color: page === 1 ? '#ccc' : '#555', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <ChevronLeft size={13} /> Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)}
                    style={{ width: 34, height: 34, borderRadius: 10, border: p === page ? '2px solid #E40F2A' : '1px solid #eee', background: p === page ? '#E40F2A' : 'white', cursor: 'pointer', fontSize: 12, fontWeight: 800, color: p === page ? 'white' : '#555' }}>
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{ padding: '7px 12px', borderRadius: 10, background: page === totalPages ? '#f5f5f5' : 'white', border: '1px solid #eee', cursor: page === totalPages ? 'default' : 'pointer', color: page === totalPages ? '#ccc' : '#555', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  Next <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ORDER PANEL */}
      {selectedOrder && (
        <OrderPanel order={selectedOrder} onClose={() => setSelectedOrder(null)} onStatusChange={handleStatusChange} />
      )}
    </div>
  )
}