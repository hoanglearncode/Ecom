'use client'

import {
  Package, ChevronRight, ChevronLeft, Search, Filter,
  Truck, CheckCircle2, Clock, XCircle, RotateCcw,
  Star, ArrowRight, Download, Share2, MapPin,
  MessageSquare, RefreshCw, ChevronDown, ShoppingBag,
  Eye, Zap, Tag, Shield, Check, X, AlertCircle,
  Copy, ExternalLink, Box
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useMemo, useRef, useEffect } from 'react'

/* ═══════════════════════════════════════════════════════
   TYPES & DATA
═══════════════════════════════════════════════════════ */

type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'

type OrderItem = {
  id: string
  name: string
  brand: string
  image: string
  price: number
  originalPrice?: number
  qty: number
  color: string
  reviewed?: boolean
}

type Order = {
  id: string
  date: string
  status: OrderStatus
  items: OrderItem[]
  shipping: { method: string; address: string; carrier: string; trackingNum: string }
  payment: { method: string; last4?: string; type?: string }
  subtotal: number
  discount: number
  shippingFee: number
  tax: number
  total: number
  estimatedDelivery?: string
  deliveredDate?: string
  timeline: { label: string; date: string; done: boolean; active?: boolean }[]
  promoCode?: string
}

const ORDERS: Order[] = [
  {
    id: 'SH-2026-84291',
    date: 'Mar 18, 2026',
    status: 'shipped',
    items: [
      { id: 'i1', name: 'Sony WH-1000XM5 Wireless Headphones', brand: 'Sony', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop', price: 279.99, originalPrice: 349.99, qty: 1, color: 'Midnight Black' },
      { id: 'i2', name: 'Logitech MX Master 3S Mouse', brand: 'Logitech', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=200&h=200&fit=crop', price: 99.99, originalPrice: 119.99, qty: 1, color: 'Graphite' },
    ],
    shipping: { method: 'Express Shipping', address: '123 Main Street, Apt 4B, New York, NY 10001, US', carrier: 'FedEx', trackingNum: 'FX2026031891234' },
    payment: { method: 'Visa', last4: '4242', type: 'visa' },
    subtotal: 379.98, discount: 75.99, shippingFee: 9.99, tax: 25.12, total: 339.10,
    estimatedDelivery: 'Mar 20, 2026',
    promoCode: 'SAVE20',
    timeline: [
      { label: 'Order Placed', date: 'Mar 18, 2026 · 9:41 AM', done: true },
      { label: 'Payment Confirmed', date: 'Mar 18, 2026 · 9:43 AM', done: true },
      { label: 'Packed & Ready', date: 'Mar 18, 2026 · 4:22 PM', done: true },
      { label: 'Shipped', date: 'Mar 19, 2026 · 7:15 AM', done: true, active: true },
      { label: 'Out for Delivery', date: 'Expected Mar 20', done: false },
      { label: 'Delivered', date: 'Expected Mar 20, 2026', done: false },
    ],
  },
  {
    id: 'SH-2026-79103',
    date: 'Mar 10, 2026',
    status: 'delivered',
    items: [
      { id: 'i3', name: 'Nike Air Max 270 Running Shoes', brand: 'Nike', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop', price: 149.99, originalPrice: 180.00, qty: 2, color: 'Black / Red', reviewed: true },
      { id: 'i4', name: 'Adidas Ultraboost 23 Sneakers', brand: 'Adidas', image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=200&h=200&fit=crop', price: 119.99, qty: 1, color: 'Core White' },
    ],
    shipping: { method: 'Standard Shipping', address: '123 Main Street, Apt 4B, New York, NY 10001, US', carrier: 'UPS', trackingNum: 'UPS2026031012567' },
    payment: { method: 'Mastercard', last4: '8888', type: 'mastercard' },
    subtotal: 419.97, discount: 30.01, shippingFee: 0, tax: 31.20, total: 421.16,
    deliveredDate: 'Mar 13, 2026',
    timeline: [
      { label: 'Order Placed', date: 'Mar 10, 2026 · 2:15 PM', done: true },
      { label: 'Payment Confirmed', date: 'Mar 10, 2026 · 2:17 PM', done: true },
      { label: 'Packed & Ready', date: 'Mar 11, 2026 · 9:30 AM', done: true },
      { label: 'Shipped', date: 'Mar 11, 2026 · 2:00 PM', done: true },
      { label: 'Out for Delivery', date: 'Mar 13, 2026 · 8:00 AM', done: true },
      { label: 'Delivered', date: 'Mar 13, 2026 · 2:34 PM', done: true, active: true },
    ],
  },
  {
    id: 'SH-2026-71845',
    date: 'Feb 28, 2026',
    status: 'delivered',
    items: [
      { id: 'i5', name: 'LG UltraWide 34" Curved Monitor', brand: 'LG', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&h=200&fit=crop', price: 449.99, originalPrice: 699.99, qty: 1, color: 'Black', reviewed: false },
    ],
    shipping: { method: 'Express Shipping', address: '123 Main Street, Apt 4B, New York, NY 10001, US', carrier: 'DHL', trackingNum: 'DHL2026022845890' },
    payment: { method: 'Apple Pay', type: 'applepay' },
    subtotal: 449.99, discount: 250.00, shippingFee: 9.99, tax: 16.80, total: 226.78,
    deliveredDate: 'Mar 2, 2026',
    timeline: [
      { label: 'Order Placed', date: 'Feb 28, 2026', done: true },
      { label: 'Payment Confirmed', date: 'Feb 28, 2026', done: true },
      { label: 'Packed & Ready', date: 'Mar 1, 2026', done: true },
      { label: 'Shipped', date: 'Mar 1, 2026', done: true },
      { label: 'Out for Delivery', date: 'Mar 2, 2026', done: true },
      { label: 'Delivered', date: 'Mar 2, 2026', done: true, active: true },
    ],
  },
  {
    id: 'SH-2026-65201',
    date: 'Feb 14, 2026',
    status: 'processing',
    items: [
      { id: 'i6', name: 'Samsung T7 Portable SSD 2TB', brand: 'Samsung', image: 'https://images.unsplash.com/photo-1531492898419-3a9aa15ebbd0?w=200&h=200&fit=crop', price: 149.99, originalPrice: 179.99, qty: 2, color: 'Deep Blue' },
    ],
    shipping: { method: 'Standard Shipping', address: '456 Office Park Blvd, Brooklyn, NY 11201, US', carrier: 'USPS', trackingNum: '' },
    payment: { method: 'Visa', last4: '4242', type: 'visa' },
    subtotal: 299.98, discount: 60.00, shippingFee: 0, tax: 19.20, total: 259.18,
    estimatedDelivery: 'Feb 20, 2026',
    timeline: [
      { label: 'Order Placed', date: 'Feb 14, 2026 · 11:30 AM', done: true },
      { label: 'Payment Confirmed', date: 'Feb 14, 2026 · 11:32 AM', done: true, active: true },
      { label: 'Packed & Ready', date: 'Processing…', done: false },
      { label: 'Shipped', date: 'Pending', done: false },
      { label: 'Out for Delivery', date: 'Pending', done: false },
      { label: 'Delivered', date: 'Pending', done: false },
    ],
  },
  {
    id: 'SH-2026-58740',
    date: 'Jan 30, 2026',
    status: 'cancelled',
    items: [
      { id: 'i7', name: 'ASUS ROG 27" 4K Gaming Monitor', brand: 'ASUS', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=200&fit=crop', price: 799.99, originalPrice: 999.99, qty: 1, color: 'Black' },
    ],
    shipping: { method: 'Express Shipping', address: '123 Main Street, Apt 4B, New York, NY 10001, US', carrier: '', trackingNum: '' },
    payment: { method: 'Visa', last4: '4242', type: 'visa' },
    subtotal: 799.99, discount: 200.00, shippingFee: 9.99, tax: 48.80, total: 658.78,
    timeline: [
      { label: 'Order Placed', date: 'Jan 30, 2026', done: true },
      { label: 'Cancelled', date: 'Jan 30, 2026', done: true, active: true },
    ],
  },
]

const FILTER_TABS = [
  { id: 'all', label: 'All Orders' },
  { id: 'processing', label: 'Processing' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
]

const fmt = (n: number) => `$${n.toFixed(2)}`

/* ── STATUS CONFIG ── */

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; border: string; icon: any; dot: string }> = {
  processing: { label: 'Processing', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock, dot: 'bg-amber-500' },
  shipped:    { label: 'Shipped',    color: 'text-blue-700 dark:text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   icon: Truck,           dot: 'bg-blue-500' },
  delivered:  { label: 'Delivered',  color: 'text-green-700 dark:text-green-400', bg: 'bg-green-500/10',  border: 'border-green-500/20',  icon: CheckCircle2,    dot: 'bg-green-500' },
  cancelled:  { label: 'Cancelled',  color: 'text-red-700 dark:text-red-400',     bg: 'bg-red-500/10',    border: 'border-red-500/20',    icon: XCircle,         dot: 'bg-red-500' },
  returned:   { label: 'Returned',   color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: RotateCcw,      dot: 'bg-purple-500' },
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status]
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

function CardIcon({ type }: { type?: string }) {
  if (!type) return null
  const styles: Record<string, string> = { visa: 'bg-blue-600', mastercard: 'bg-red-500', applepay: 'bg-foreground', gpay: 'bg-white border border-border' }
  const labels: Record<string, string> = { visa: 'VISA', mastercard: 'MC', applepay: '⌘ Pay', gpay: 'G Pay' }
  return <span className={`inline-flex items-center justify-center text-[9px] font-black text-white px-1.5 py-0.5 rounded ${styles[type] ?? 'bg-secondary'}`}>{labels[type] ?? type.toUpperCase()}</span>
}

/* ═══════════════════════════════════════════════════════
   ORDER DETAIL PANEL
═══════════════════════════════════════════════════════ */

function OrderDetail({ order, onClose, onReview }: { order: Order; onClose: () => void; onReview: (item: OrderItem) => void }) {
  const [trackingCopied, setTrackingCopied] = useState(false)
  const cfg = STATUS_CONFIG[order.status]

  const copyTracking = () => {
    if (order.shipping.trackingNum) {
      navigator.clipboard.writeText(order.shipping.trackingNum)
      setTrackingCopied(true)
      setTimeout(() => setTrackingCopied(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative ml-auto w-full max-w-xl bg-background h-full flex flex-col shadow-2xl overflow-hidden">

        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded-xl transition-colors text-muted-foreground hover:text-foreground">
              <ChevronLeft size={20} />
            </button>
            <div>
              <p className="font-black text-foreground text-sm">{order.id}</p>
              <p className="text-[11px] text-muted-foreground">{order.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors">
              <Share2 size={17} />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors">
              <Download size={17} />
            </button>
            <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">

          {/* Status hero */}
          <div className={`px-6 py-6 ${cfg.bg} border-b ${cfg.border}`}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <StatusBadge status={order.status} />
              <p className="text-xl font-black text-foreground">{fmt(order.total)}</p>
            </div>

            {order.status === 'shipped' && order.estimatedDelivery && (
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Estimated delivery</p>
                <p className={`font-black text-base ${cfg.color}`}>{order.estimatedDelivery}</p>
              </div>
            )}
            {order.status === 'delivered' && order.deliveredDate && (
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Delivered on</p>
                <p className={`font-black text-base ${cfg.color}`}>{order.deliveredDate}</p>
              </div>
            )}
            {order.status === 'processing' && (
              <div className="flex items-center gap-2">
                <RefreshCw size={13} className="text-amber-600 animate-spin" />
                <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold">Being prepared by our team</p>
              </div>
            )}
            {order.status === 'cancelled' && (
              <p className="text-xs text-red-600 dark:text-red-400 font-semibold flex items-center gap-1.5">
                <AlertCircle size={13} /> Full refund processed to your payment method
              </p>
            )}
          </div>

          {/* Tracking timeline */}
          <div className="px-6 py-5 border-b border-border">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5">Order Timeline</p>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border" />
              <div className="flex flex-col gap-4">
                {order.timeline.map((t, i) => (
                  <div key={i} className="flex items-start gap-4 relative">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 mt-0.5 ${t.active ? `${cfg.dot} ring-4 ring-offset-2 ring-offset-background ring-${cfg.dot.replace('bg-', '')}/20` : t.done ? 'bg-foreground' : 'bg-secondary border-2 border-border'}`}>
                      {t.done && !t.active && <Check size={11} className="text-background" />}
                      {t.active && <span className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <div className="flex-1 min-w-0 pb-1">
                      <p className={`text-sm font-bold ${t.active ? cfg.color : t.done ? 'text-foreground' : 'text-muted-foreground'}`}>{t.label}</p>
                      <p className={`text-xs mt-0.5 ${t.done ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>{t.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tracking number */}
          {order.shipping.trackingNum && (
            <div className="px-6 py-5 border-b border-border">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Tracking</p>
              <div className="flex items-center gap-3 p-4 bg-secondary/50 border border-border rounded-2xl">
                <Truck size={18} className="text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{order.shipping.carrier}</p>
                  <p className="font-mono font-bold text-foreground text-sm truncate">{order.shipping.trackingNum}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={copyTracking} className={`p-2 rounded-xl transition-all ${trackingCopied ? 'bg-green-500 text-white' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}>
                    {trackingCopied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                  <button className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Items */}
          <div className="px-6 py-5 border-b border-border">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Items ({order.items.reduce((s, i) => s + i.qty, 0)})
            </p>
            <div className="flex flex-col gap-4">
              {order.items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <Link href={`/products/${item.id}`} className="relative w-16 h-16 rounded-xl overflow-hidden bg-secondary shrink-0 border border-border/50">
                    <Image src={item.image} alt={item.name} fill className="object-cover hover:scale-105 transition-transform" sizes="64px" />
                    {item.qty > 1 && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-foreground text-background text-[9px] font-black rounded-full flex items-center justify-center border-2 border-background">{item.qty}</span>
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">{item.brand}</p>
                    <Link href={`/products/${item.id}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {item.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">{item.color} · Qty {item.qty}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-black text-foreground">{fmt(item.price * item.qty)}</span>
                        {item.originalPrice && <span className="text-[11px] text-muted-foreground line-through">{fmt(item.originalPrice * item.qty)}</span>}
                      </div>
                      {order.status === 'delivered' && (
                        <button
                          onClick={() => onReview(item)}
                          className={`flex items-center gap-1.5 text-[11px] font-bold transition-all ${item.reviewed ? 'text-green-600' : 'text-primary hover:underline'}`}
                        >
                          {item.reviewed ? <><Check size={11} /> Reviewed</> : <><Star size={11} /> Write Review</>}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery address */}
          <div className="px-6 py-5 border-b border-border">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Delivery Address</p>
            <div className="flex items-start gap-3 p-4 bg-secondary/50 border border-border rounded-2xl">
              <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">{order.shipping.method}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{order.shipping.address}</p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="px-6 py-5 border-b border-border">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Payment</p>
            <div className="flex items-center gap-3 p-4 bg-secondary/50 border border-border rounded-2xl">
              <CardIcon type={order.payment.type} />
              <p className="text-sm font-semibold text-foreground flex-1">
                {order.payment.method}{order.payment.last4 ? ` ending in ${order.payment.last4}` : ''}
              </p>
              <Shield size={14} className="text-green-500" />
            </div>
          </div>

          {/* Order summary */}
          <div className="px-6 py-5 border-b border-border">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Order Summary</p>
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">{fmt(order.subtotal)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-sm"><span className="text-green-600 flex items-center gap-1"><Tag size={11} />{order.promoCode ?? 'Discount'}</span><span className="font-semibold text-green-600">-{fmt(order.discount)}</span></div>}
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span className={`font-semibold ${order.shippingFee === 0 ? 'text-green-600' : ''}`}>{order.shippingFee === 0 ? 'FREE' : fmt(order.shippingFee)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax</span><span className="font-semibold">{fmt(order.tax)}</span></div>
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <span className="font-black text-foreground">Total</span>
                <span className="font-black text-foreground text-xl">{fmt(order.total)}</span>
              </div>
              {order.discount > 0 && <p className="text-xs text-green-600 font-semibold text-right">You saved {fmt(order.discount)}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-5">
            <div className="flex flex-col gap-2.5">
              {order.status === 'shipped' && (
                <button className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary/90 active:scale-[0.97] transition-all shadow-md shadow-primary/20">
                  <Truck size={16} /> Track Shipment
                </button>
              )}
              {order.status === 'delivered' && order.items.some(i => !i.reviewed) && (
                <button className="flex items-center justify-center gap-2 w-full py-3.5 bg-foreground text-background rounded-2xl font-bold text-sm hover:bg-foreground/85 active:scale-[0.97] transition-all">
                  <Star size={16} /> Leave a Review
                </button>
              )}
              {(order.status === 'delivered' || order.status === 'shipped') && (
                <button className="flex items-center justify-center gap-2 w-full py-3 border border-border rounded-2xl font-semibold text-sm text-foreground hover:bg-secondary active:scale-[0.97] transition-all">
                  <RotateCcw size={15} /> Return or Exchange
                </button>
              )}
              {order.status === 'processing' && (
                <button className="flex items-center justify-center gap-2 w-full py-3 border border-primary/30 text-primary rounded-2xl font-semibold text-sm bg-primary/5 hover:bg-primary/10 active:scale-[0.97] transition-all">
                  <XCircle size={15} /> Cancel Order
                </button>
              )}
              <button className="flex items-center justify-center gap-2 w-full py-3 border border-border rounded-2xl font-semibold text-sm text-foreground hover:bg-secondary active:scale-[0.97] transition-all">
                <MessageSquare size={15} /> Contact Support
              </button>
              <button className="flex items-center justify-center gap-2 w-full py-3 border border-border rounded-2xl font-semibold text-sm text-foreground hover:bg-secondary active:scale-[0.97] transition-all">
                <ShoppingBag size={15} /> Reorder All Items
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   REVIEW MODAL
═══════════════════════════════════════════════════════ */

function ReviewModal({ item, onClose }: { item: OrderItem; onClose: () => void }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (rating === 0) return
    setSubmitted(true)
    setTimeout(onClose, 2000)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-background rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl">
        {/* Handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        <div className="px-6 py-5">
          {submitted ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="w-16 h-16 bg-green-500/15 rounded-full flex items-center justify-center mb-4">
                <Check size={32} className="text-green-500" />
              </div>
              <h3 className="text-xl font-black text-foreground mb-1">Review submitted!</h3>
              <p className="text-sm text-muted-foreground">Thanks for sharing your experience.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-black text-foreground text-base">Write a Review</h3>
                <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground"><X size={18} /></button>
              </div>

              {/* Product */}
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-2xl border border-border mb-5">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-secondary shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground font-semibold">{item.brand}</p>
                  <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                </div>
              </div>

              {/* Stars */}
              <div className="text-center mb-5">
                <p className="text-sm font-bold text-foreground mb-3">How would you rate this product?</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)} className="transition-transform hover:scale-125 active:scale-95">
                      <Star size={32} className={`transition-colors ${s <= (hover || rating) ? 'fill-amber-400 text-amber-400' : 'text-border'}`} />
                    </button>
                  ))}
                </div>
                {(hover || rating) > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][(hover || rating)]}
                  </p>
                )}
              </div>

              {/* Title */}
              <div className="mb-4">
                <label className="text-xs font-bold text-foreground mb-1.5 block">Review title</label>
                <input
                  type="text"
                  placeholder="Sum it up in a sentence…"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-secondary border border-transparent rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                />
              </div>

              {/* Body */}
              <div className="mb-6">
                <label className="text-xs font-bold text-foreground mb-1.5 block">Your experience</label>
                <textarea
                  rows={4}
                  placeholder="What did you love or dislike? How does it fit, feel, perform?"
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  className="w-full bg-secondary border border-transparent rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={rating === 0}
                className="w-full py-3.5 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary/90 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Submit Review
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [reviewItem, setReviewItem] = useState<OrderItem | null>(null)
  const [sortOpen, setSortOpen] = useState(false)
  const [sort, setSort] = useState('date-desc')
  const sortRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  // Lock scroll when panel open
  useEffect(() => {
    document.body.style.overflow = selectedOrder || reviewItem ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedOrder, reviewItem])

  const filtered = useMemo(() => {
    let list = ORDERS
    if (activeFilter !== 'all') list = list.filter(o => o.status === activeFilter)
    if (search.trim()) list = list.filter(o =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some(i => i.name.toLowerCase().includes(search.toLowerCase()))
    )
    if (sort === 'total-asc') list = [...list].sort((a, b) => a.total - b.total)
    if (sort === 'total-desc') list = [...list].sort((a, b) => b.total - a.total)
    return list
  }, [activeFilter, search, sort])

  const counts = useMemo(() => ({
    all: ORDERS.length,
    processing: ORDERS.filter(o => o.status === 'processing').length,
    shipped: ORDERS.filter(o => o.status === 'shipped').length,
    delivered: ORDERS.filter(o => o.status === 'delivered').length,
    cancelled: ORDERS.filter(o => o.status === 'cancelled').length,
  }), [])

  const totalSpent = ORDERS.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)
  const pendingReviews = ORDERS.flatMap(o => o.status === 'delivered' ? o.items.filter(i => !i.reviewed) : []).length

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pb-20 sm:pb-0">

        {/* ═══ HEADER ═══ */}
        <div className="border-b border-border bg-background">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
            <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight size={12} />
              <Link href="/profile" className="hover:text-foreground transition-colors">Account</Link>
              <ChevronRight size={12} />
              <span className="text-foreground font-medium">Orders</span>
            </nav>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">My Account</p>
                <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight leading-none">Order History</h1>
                <p className="text-muted-foreground text-sm mt-2">{ORDERS.length} orders · {fmt(totalSpent)} total spent</p>
              </div>
              {/* Stats pills */}
              <div className="flex flex-wrap gap-2">
                {pendingReviews > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <Star size={14} className="text-amber-600" />
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{pendingReviews} review{pendingReviews > 1 ? 's' : ''} pending</span>
                  </div>
                )}
                <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary border border-border rounded-xl">
                  <Package size={14} className="text-primary" />
                  <span className="text-xs font-bold text-foreground">{counts.shipped} in transit</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

          {/* ── FILTER TABS ── */}
          <div className="flex overflow-x-auto scrollbar-none border-b border-border mb-6">
            {FILTER_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex items-center gap-2 shrink-0 px-4 py-3.5 text-sm font-semibold border-b-2 transition-all ${activeFilter === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                {tab.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeFilter === tab.id ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                  {counts[tab.id as keyof typeof counts]}
                </span>
              </button>
            ))}
          </div>

          {/* ── SEARCH + SORT ── */}
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by order ID or product…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-secondary border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="relative" ref={sortRef}>
              <button onClick={() => setSortOpen(v => !v)} className="flex items-center gap-1.5 px-4 py-2.5 border border-border rounded-xl text-sm font-semibold hover:bg-secondary transition-colors">
                <Filter size={14} className="text-muted-foreground" />
                <span className="hidden sm:inline">Sort</span>
                <ChevronDown size={13} className={`text-muted-foreground transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-card border border-border rounded-2xl shadow-xl py-1.5 z-10">
                  {[
                    { id: 'date-desc', label: 'Newest First' },
                    { id: 'date-asc', label: 'Oldest First' },
                    { id: 'total-desc', label: 'Highest Total' },
                    { id: 'total-asc', label: 'Lowest Total' },
                  ].map(o => (
                    <button key={o.id} onClick={() => { setSort(o.id); setSortOpen(false) }} className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${sort === o.id ? 'text-primary font-bold' : 'text-foreground/75 hover:bg-secondary'}`}>
                      {o.label} {sort === o.id && <Check size={13} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── ORDER LIST ── */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-4 border border-border">
                <Package size={28} className="text-muted-foreground" />
              </div>
              <h3 className="font-black text-foreground text-lg mb-2">No orders found</h3>
              <p className="text-sm text-muted-foreground mb-6">
                {search ? `No results for "${search}"` : `No ${activeFilter === 'all' ? '' : activeFilter} orders yet.`}
              </p>
              <Link href="/products" className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-xl font-bold text-sm hover:bg-foreground/85 transition-all">
                Start Shopping <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map(order => {
                const cfg = STATUS_CONFIG[order.status]
                const Icon = cfg.icon
                const hasUnreviewed = order.status === 'delivered' && order.items.some(i => !i.reviewed)

                return (
                  <div
                    key={order.id}
                    className="group bg-card border border-border/70 rounded-2xl overflow-hidden hover:border-border hover:shadow-lg hover:shadow-black/4 transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    {/* Order header */}
                    <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border/50 bg-secondary/20">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-xl ${cfg.bg} shrink-0`}>
                          <Icon size={16} className={cfg.color} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-black text-foreground text-sm font-mono">{order.id}</p>
                            <StatusBadge status={order.status} />
                            {hasUnreviewed && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                                <Star size={9} /> Review
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{order.date} · {order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right hidden sm:block">
                          <p className="font-black text-foreground">{fmt(order.total)}</p>
                          {order.discount > 0 && <p className="text-[10px] text-green-600 font-semibold">Saved {fmt(order.discount)}</p>}
                        </div>
                        <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>

                    {/* Items preview */}
                    <div className="px-5 py-4 flex items-center gap-4">
                      {/* Thumbnail stack */}
                      <div className="flex -space-x-3 shrink-0">
                        {order.items.slice(0, 3).map((item, i) => (
                          <div key={item.id} className="relative w-12 h-12 rounded-xl overflow-hidden bg-secondary border-2 border-card" style={{ zIndex: order.items.length - i }}>
                            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="relative w-12 h-12 rounded-xl bg-secondary border-2 border-card flex items-center justify-center z-0">
                            <span className="text-[10px] font-black text-muted-foreground">+{order.items.length - 3}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {order.items[0].name}{order.items.length > 1 ? ` + ${order.items.length - 1} more` : ''}
                        </p>
                        {/* Progress / info line */}
                        {order.status === 'shipped' && order.estimatedDelivery && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-0.5 flex items-center gap-1.5">
                            <Truck size={11} /> Expected {order.estimatedDelivery}
                          </p>
                        )}
                        {order.status === 'delivered' && order.deliveredDate && (
                          <p className="text-xs text-green-600 font-semibold mt-0.5 flex items-center gap-1.5">
                            <CheckCircle2 size={11} /> Delivered {order.deliveredDate}
                          </p>
                        )}
                        {order.status === 'processing' && (
                          <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5 flex items-center gap-1.5">
                            <RefreshCw size={11} className="animate-spin" /> Being processed
                          </p>
                        )}
                        {order.status === 'cancelled' && (
                          <p className="text-xs text-muted-foreground mt-0.5">Order cancelled · Refund processed</p>
                        )}
                      </div>

                      {/* Mobile price */}
                      <div className="sm:hidden text-right shrink-0">
                        <p className="font-black text-foreground">{fmt(order.total)}</p>
                        {order.discount > 0 && <p className="text-[10px] text-green-600 font-semibold">-{fmt(order.discount)}</p>}
                      </div>
                    </div>

                    {/* Shipped progress bar */}
                    {order.status === 'shipped' && (
                      <div className="px-5 pb-4">
                        <div className="flex items-center justify-between mb-1.5">
                          {['Ordered', 'Packed', 'Shipped', 'Delivered'].map((s, i) => (
                            <span key={s} className={`text-[10px] font-semibold ${i <= 2 ? 'text-primary' : 'text-muted-foreground/50'}`}>{s}</span>
                          ))}
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full w-3/4 relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-primary rounded-full shadow-sm" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action row */}
                    <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-border/50 bg-secondary/10">
                      <div className="flex gap-1.5">
                        <button
                          onClick={e => { e.stopPropagation(); setSelectedOrder(order) }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
                        >
                          <Eye size={12} /> View Details
                        </button>
                        {order.status !== 'cancelled' && (
                          <button
                            onClick={e => e.stopPropagation()}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
                          >
                            <ShoppingBag size={12} /> Reorder
                          </button>
                        )}
                      </div>
                      {order.status === 'shipped' && (
                        <button
                          onClick={e => { e.stopPropagation(); setSelectedOrder(order) }}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-white text-[11px] font-bold rounded-lg hover:bg-primary/90 transition-all active:scale-[0.97]"
                        >
                          <Truck size={11} /> Track
                        </button>
                      )}
                      {hasUnreviewed && (
                        <button
                          onClick={e => { e.stopPropagation(); setSelectedOrder(order) }}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 text-white text-[11px] font-bold rounded-lg hover:bg-amber-600 transition-all active:scale-[0.97]"
                        >
                          <Star size={11} /> Review
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Summary stats */}
          {ORDERS.length > 0 && (
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total Orders', val: ORDERS.length, icon: Package, color: 'text-primary' },
                { label: 'Total Spent', val: fmt(totalSpent), icon: ShoppingBag, color: 'text-foreground' },
                { label: 'Items Ordered', val: ORDERS.flatMap(o => o.items).reduce((s, i) => s + i.qty, 0), icon: Box, color: 'text-blue-600' },
                { label: 'Total Saved', val: fmt(ORDERS.reduce((s, o) => s + o.discount, 0)), icon: Tag, color: 'text-green-600' },
              ].map(({ label, val, icon: Icon, color }) => (
                <div key={label} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
                  <div className="p-2.5 bg-secondary rounded-xl shrink-0">
                    <Icon size={18} className={color} />
                  </div>
                  <div>
                    <p className="text-lg font-black text-foreground">{val}</p>
                    <p className="text-[11px] text-muted-foreground">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── ORDER DETAIL PANEL ── */}
      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onReview={(item) => { setReviewItem(item); setSelectedOrder(null) }}
        />
      )}

      {/* ── REVIEW MODAL ── */}
      {reviewItem && (
        <ReviewModal item={reviewItem} onClose={() => setReviewItem(null)} />
      )}
    </div>
  )
}