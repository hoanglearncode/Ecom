'use client'

import {
  Layers, Search, Plus, Download, Upload, MoreHorizontal,
  X, Check, ArrowUp, ArrowDown, ChevronLeft, ChevronRight,
  Edit2, Trash2, Archive, Eye, EyeOff, Globe, Copy,
  Package, ShoppingCart, DollarSign, TrendingUp,
  ArrowUpRight, ArrowDownRight, BarChart3, List,
  Zap, AlertCircle, Folder, Tag, ImageIcon,
} from 'lucide-react'
import { useState, useMemo, useEffect, useRef, FC, MouseEvent } from 'react'

/* ═══════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════ */

type CategoryStatus = 'active' | 'draft' | 'archived'
type SortField      = 'name' | 'products' | 'revenue' | 'orders' | 'updatedAt'
type SortDir        = 'asc' | 'desc'
type ViewMode       = 'list' | 'grid'
type PanelTab       = 'overview' | 'products' | 'seo'

interface CategoryStats {
  products: number; revenue: number; orders: number
  avgPrice: number; inStock: number; lowStock: number
}

interface Category {
  id: string; name: string; slug: string; description: string
  emoji: string; color: string; status: CategoryStatus
  parentId: string | null; children: string[]
  stats: CategoryStats; sales12m: number[]; featured: boolean
  seoTitle: string; seoDesc: string; imageCount: number
  createdAt: string; updatedAt: string
}

/* ═══════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════ */

const STATUS_META: Record<CategoryStatus, { label: string; color: string; bg: string; border: string; dot: string }> = {
  active:   { label: 'Active',   color: '#15803d', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.2)',   dot: '#22c55e' },
  draft:    { label: 'Draft',    color: '#64748b', bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.2)', dot: '#94a3b8' },
  archived: { label: 'Archived', color: '#b91c1c', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.2)',   dot: '#ef4444' },
}

const SORT_OPTIONS: { value: `${SortField}-${SortDir}`; label: string }[] = [
  { value: 'products-desc', label: 'Most Products'    },
  { value: 'revenue-desc',  label: 'Highest Revenue'  },
  { value: 'orders-desc',   label: 'Most Orders'      },
  { value: 'name-asc',      label: 'Name A–Z'         },
  { value: 'name-desc',     label: 'Name Z–A'         },
  { value: 'updatedAt-desc',label: 'Recently Updated' },
]

const PRESET_COLORS = [
  '#E40F2A','#ef4444','#f97316','#f59e0b','#22c55e',
  '#06b6d4','#3b82f6','#8b5cf6','#ec4899','#64748b',
]

const STATUS_FILTERS: { val: CategoryStatus | 'all'; label: string }[] = [
  { val: 'all',      label: 'All'      },
  { val: 'active',   label: 'Active'   },
  { val: 'draft',    label: 'Draft'    },
  { val: 'archived', label: 'Archived' },
]

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */

const CATEGORIES: Category[] = [
  {
    id: 'CAT-001', name: 'Audio', slug: 'audio',
    description: 'Headphones, earbuds, speakers and all audio equipment for studio and consumer use.',
    emoji: '🎧', color: '#8b5cf6', status: 'active', parentId: null, children: [],
    stats: { products: 18, revenue: 412800, orders: 2184, avgPrice: 164, inStock: 15, lowStock: 3 },
    sales12m: [38,45,41,52,48,61,55,67,72,65,80,74],
    featured: true, imageCount: 42, createdAt: 'Jan 12, 2025', updatedAt: 'Mar 18, 2026',
    seoTitle: 'Premium Audio Equipment | ShopHub', seoDesc: 'Discover our range of professional and consumer audio products.',
  },
  {
    id: 'CAT-002', name: 'Peripherals', slug: 'peripherals',
    description: 'Keyboards, mice, webcams and all computer peripherals for work and gaming.',
    emoji: '⌨️', color: '#3b82f6', status: 'active', parentId: null, children: [],
    stats: { products: 32, revenue: 318400, orders: 3421, avgPrice: 98, inStock: 28, lowStock: 4 },
    sales12m: [55,62,58,71,67,78,72,85,80,92,88,96],
    featured: true, imageCount: 78, createdAt: 'Jan 12, 2025', updatedAt: 'Mar 20, 2026',
    seoTitle: 'Computer Peripherals | ShopHub', seoDesc: 'Keyboards, mice, and peripherals for every workspace.',
  },
  {
    id: 'CAT-003', name: 'Displays', slug: 'displays',
    description: 'Monitors and display solutions for gaming, professional design and productivity.',
    emoji: '🖥️', color: '#06b6d4', status: 'active', parentId: null, children: [],
    stats: { products: 12, revenue: 524600, orders: 1380, avgPrice: 342, inStock: 10, lowStock: 2 },
    sales12m: [12,14,11,16,18,15,21,19,24,22,28,25],
    featured: true, imageCount: 34, createdAt: 'Feb 3, 2025', updatedAt: 'Mar 15, 2026',
    seoTitle: 'Monitors & Displays | ShopHub', seoDesc: 'High-refresh-rate and professional monitors for every need.',
  },
  {
    id: 'CAT-004', name: 'Accessories', slug: 'accessories',
    description: 'Hubs, stands, cables and desk accessories to complete your setup.',
    emoji: '🔌', color: '#f59e0b', status: 'active', parentId: null, children: [],
    stats: { products: 54, revenue: 187200, orders: 4158, avgPrice: 52, inStock: 46, lowStock: 8 },
    sales12m: [82,90,86,95,91,98,94,108,102,115,110,124],
    featured: false, imageCount: 118, createdAt: 'Jan 12, 2025', updatedAt: 'Mar 21, 2026',
    seoTitle: 'Desk Accessories & Cables | ShopHub', seoDesc: 'Cable management, hubs, and desk accessories.',
  },
  {
    id: 'CAT-005', name: 'Networking', slug: 'networking',
    description: 'Routers, switches, access points and networking gear for home and office.',
    emoji: '📡', color: '#22c55e', status: 'active', parentId: null, children: [],
    stats: { products: 9, revenue: 94800, orders: 596, avgPrice: 142, inStock: 8, lowStock: 1 },
    sales12m: [8,10,9,12,11,14,13,16,14,18,16,20],
    featured: false, imageCount: 22, createdAt: 'Mar 5, 2025', updatedAt: 'Feb 28, 2026',
    seoTitle: 'Networking Equipment | ShopHub', seoDesc: 'Routers, switches and networking solutions.',
  },
  {
    id: 'CAT-006', name: 'Storage', slug: 'storage',
    description: 'SSDs, hard drives and memory cards for fast and reliable data storage.',
    emoji: '💾', color: '#ef4444', status: 'active', parentId: null, children: [],
    stats: { products: 15, revenue: 218400, orders: 1851, avgPrice: 118, inStock: 13, lowStock: 2 },
    sales12m: [28,31,29,34,32,38,36,41,39,45,42,48],
    featured: false, imageCount: 38, createdAt: 'Feb 14, 2025', updatedAt: 'Mar 10, 2026',
    seoTitle: 'Storage Solutions | ShopHub', seoDesc: 'Fast SSDs and reliable storage for every use case.',
  },
  {
    id: 'CAT-007', name: 'Lighting', slug: 'lighting',
    description: 'Smart LED strips, desk lamps and ambient lighting to transform your space.',
    emoji: '💡', color: '#f97316', status: 'active', parentId: null, children: [],
    stats: { products: 21, revenue: 298200, orders: 3550, avgPrice: 76, inStock: 17, lowStock: 4 },
    sales12m: [44,52,48,58,55,66,60,74,68,80,75,88],
    featured: true, imageCount: 56, createdAt: 'Jan 22, 2025', updatedAt: 'Mar 19, 2026',
    seoTitle: 'Smart Lighting | ShopHub', seoDesc: 'LED strips, smart bulbs and ambient lighting solutions.',
  },
  {
    id: 'CAT-008', name: 'Gaming', slug: 'gaming',
    description: 'Gaming chairs, controllers, headsets and accessories for serious gamers.',
    emoji: '🎮', color: '#E40F2A', status: 'draft', parentId: null, children: [],
    stats: { products: 7, revenue: 0, orders: 0, avgPrice: 89, inStock: 7, lowStock: 0 },
    sales12m: [0,0,0,0,0,0,0,0,0,0,0,0],
    featured: false, imageCount: 14, createdAt: 'Mar 10, 2026', updatedAt: 'Mar 10, 2026',
    seoTitle: 'Gaming Accessories | ShopHub', seoDesc: 'Everything a gamer needs.',
  },
  {
    id: 'CAT-009', name: 'Workspace', slug: 'workspace',
    description: 'Ergonomic furniture, monitor arms and work-from-home essentials.',
    emoji: '🪑', color: '#64748b', status: 'archived', parentId: null, children: [],
    stats: { products: 6, revenue: 42800, orders: 284, avgPrice: 128, inStock: 4, lowStock: 2 },
    sales12m: [14,16,12,10,8,6,4,2,1,0,0,0],
    featured: false, imageCount: 16, createdAt: 'Jan 12, 2025', updatedAt: 'Jan 8, 2026',
    seoTitle: 'Workspace Solutions | ShopHub', seoDesc: 'Ergonomic and productive workspace setups.',
  },
  {
    id: 'CAT-010', name: 'Smart Home', slug: 'smart-home',
    description: 'Smart plugs, hubs, sensors and home automation devices.',
    emoji: '🏠', color: '#0891b2', status: 'active', parentId: null, children: [],
    stats: { products: 11, revenue: 156800, orders: 1965, avgPrice: 72, inStock: 9, lowStock: 2 },
    sales12m: [22,26,24,30,28,34,31,37,35,41,38,44],
    featured: false, imageCount: 28, createdAt: 'Apr 8, 2025', updatedAt: 'Mar 12, 2026',
    seoTitle: 'Smart Home Devices | ShopHub', seoDesc: 'Automate and control your home with smart devices.',
  },
]

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */

const fmtK = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`
const fmtM = (n: number) => n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : fmtK(n)

/* ═══════════════════════════════════════════════════════
   MICRO COMPONENTS
═══════════════════════════════════════════════════════ */

function Sparkline({ data, color, width = 72, height = 28 }: { data: number[]; color: string; width?: number; height?: number }) {
  if (!data || data.every(v => v === 0)) return <span className="text-[10px] text-gray-400">No data</span>
  const max = Math.max(...data, 1)
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - 4) + 2
    const y = height - 4 - ((v / max) * (height - 8))
    return `${x},${y}`
  })
  const last = pts[pts.length - 1].split(',')
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" style={{ overflow: 'visible' }}>
      <path d={`M${pts.join('L')}L${width - 2},${height - 2}L2,${height - 2}Z`} fill={color} fillOpacity={0.1} />
      <path d={`M${pts.join('L')}`} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r={2.5} fill={color} />
    </svg>
  )
}

function MiniBarChart({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values, 1)
  return (
    <div className="flex items-end gap-0.5" style={{ height: 28 }}>
      {values.slice(-8).map((v, i, arr) => (
        <div key={i} className="flex-1 rounded-sm" style={{ height: `${(v / max) * 100}%`, minHeight: 2, background: i === arr.length - 1 ? color : `${color}40` }} />
      ))}
    </div>
  )
}

function TrendChip({ vals }: { vals: number[] }) {
  if (vals.every(v => v === 0)) return null
  const last3 = vals.slice(-3).reduce((s, v) => s + v, 0)
  const prev3 = vals.slice(-6, -3).reduce((s, v) => s + v, 0)
  const pct   = prev3 === 0 ? 0 : ((last3 - prev3) / prev3) * 100
  const up    = pct >= 0
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
      style={{ background: up ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: up ? '#16a34a' : '#dc2626' }}>
      {up ? <ArrowUpRight size={9} /> : <ArrowDownRight size={9} />}
      {Math.abs(pct).toFixed(0)}%
    </span>
  )
}

function StatusBadge({ status }: { status: CategoryStatus }) {
  const m = STATUS_META[status]
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ color: m.color, background: m.bg, border: `1px solid ${m.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full inline-block shrink-0" style={{ background: m.dot }} />
      {m.label}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════
   CATEGORY DETAIL PANEL
═══════════════════════════════════════════════════════ */

function CategoryPanel({ cat, onClose, onEdit, onStatusChange }: {
  cat: Category; onClose: () => void
  onEdit: (c: Category) => void
  onStatusChange: (id: string, s: CategoryStatus) => void
}) {
  const [tab, setTab] = useState<PanelTab>('overview')
  const MONTHS = ['A','M','J','J','A','S','O','N','D','J','F','M']

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-[440px] bg-white h-full flex flex-col shadow-2xl">
        <div className="h-1.5 w-full shrink-0" style={{ background: cat.color }} />

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-[#f0f0f0] shrink-0">
          <div className="flex gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: `${cat.color}15` }}>
              {cat.emoji}
            </div>
            <div className="min-w-0">
              <h2 className="font-black text-[15px] text-[#1a1a1a] leading-tight mb-1.5">{cat.name}</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <code className="text-[10px] text-gray-400">/{cat.slug}</code>
                <StatusBadge status={cat.status} />
                {cat.featured && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                    style={{ background: 'rgba(228,15,42,0.08)', color: '#E40F2A', border: '1px solid rgba(228,15,42,0.15)' }}>
                    Featured
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2 shrink-0 ml-3">
            <button onClick={() => onEdit(cat)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white"
              style={{ background: '#1a1a1a' }}>
              <Edit2 size={11} /> Edit
            </button>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#f0f0f0] px-6 shrink-0">
          {(['overview','products','seo'] as PanelTab[]).map(v => (
            <button key={v} onClick={() => setTab(v)}
              className="px-1 pb-3 pt-3 text-xs font-bold mr-5 border-b-2 transition-all capitalize"
              style={{ borderColor: tab === v ? '#E40F2A' : 'transparent', color: tab === v ? '#1a1a1a' : '#aaa', marginBottom: -1 }}>
              {v === 'seo' ? 'SEO' : v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">

          {tab === 'overview' && (
            <div className="p-6 space-y-5">
              {/* KPIs */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Products', val: cat.stats.products,                accent: cat.color  },
                  { label: 'Orders',   val: cat.stats.orders.toLocaleString(), accent: '#3b82f6'  },
                  { label: 'Avg Price',val: fmtK(cat.stats.avgPrice),          accent: '#f59e0b'  },
                ].map(({ label, val, accent }) => (
                  <div key={label} className="rounded-2xl p-3.5 bg-[#fafafa] border border-[#f0f0f0]">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
                    <p className="text-lg font-black" style={{ color: accent }}>{val}</p>
                  </div>
                ))}
              </div>

              {/* Revenue chart */}
              <div className="rounded-2xl p-4 bg-[#fafafa] border border-[#f0f0f0]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Revenue</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-black text-[#1a1a1a]">{fmtM(cat.stats.revenue)}</p>
                      <TrendChip vals={cat.sales12m} />
                    </div>
                  </div>
                </div>
                <div className="flex items-end gap-1" style={{ height: 64 }}>
                  {cat.sales12m.map((v, i) => {
                    const maxV = Math.max(...cat.sales12m, 1)
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full rounded-t-sm" style={{
                          height: `${(v / maxV) * 52}px`, minHeight: v > 0 ? 4 : 0,
                          background: i === cat.sales12m.length - 1 ? cat.color : `${cat.color}40`,
                          transition: 'height 0.4s ease',
                        }} />
                        <span className="text-[8px] font-semibold text-gray-300">{MONTHS[i]}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Stock */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'In Stock',  val: cat.stats.inStock,  color: '#16a34a', bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.2)'  },
                  { label: 'Low Stock', val: cat.stats.lowStock, color: '#b45309', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
                ].map(({ label, val, color, bg, border }) => (
                  <div key={label} className="rounded-2xl p-3.5" style={{ background: bg, border: `1px solid ${border}` }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#888' }}>{label}</p>
                    <p className="text-xl font-black" style={{ color }}>{val}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">products</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Description</p>
                <p className="text-sm text-gray-600 leading-relaxed">{cat.description}</p>
              </div>

              {/* Details grid */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Details</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Slug',    val: `/${cat.slug}`,          mono: true },
                    { label: 'Images',  val: `${cat.imageCount} photos`, mono: false },
                    { label: 'Created', val: cat.createdAt,           mono: false },
                    { label: 'Updated', val: cat.updatedAt,           mono: false },
                  ].map(({ label, val, mono }) => (
                    <div key={label} className="rounded-xl p-3 bg-[#fafafa] border border-[#f0f0f0]">
                      <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
                      <p className={`text-xs font-bold text-[#1a1a1a] ${mono ? 'font-mono' : ''}`}>{val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                {cat.status === 'draft' && (
                  <button onClick={() => onStatusChange(cat.id, 'active')}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm text-white"
                    style={{ background: '#22c55e' }}>
                    <Globe size={15} /> Publish Category
                  </button>
                )}
                {cat.status === 'active' && (
                  <button onClick={() => onStatusChange(cat.id, 'draft')}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm text-white"
                    style={{ background: '#1a1a1a' }}>
                    <EyeOff size={15} /> Unpublish
                  </button>
                )}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl font-semibold text-sm text-gray-600 border border-[#eee] hover:bg-gray-50 transition-all">
                    <Copy size={13} /> Duplicate
                  </button>
                  <button onClick={() => onStatusChange(cat.id, 'archived')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl font-semibold text-sm border transition-all"
                    style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: '#ef4444' }}>
                    <Archive size={13} /> Archive
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'products' && (
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-gray-500">{cat.stats.products} products in this category</p>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white"
                  style={{ background: '#1a1a1a' }}>
                  <Plus size={11} /> Add Products
                </button>
              </div>
              {Array.from({ length: Math.min(cat.stats.products, 6) }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3.5 bg-[#fafafa] border border-[#f0f0f0] rounded-2xl">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: `${cat.color}15` }}>{cat.emoji}</div>
                  <div className="flex-1">
                    <div className="h-2.5 rounded bg-[#e5e5e5] mb-1.5" style={{ width: `${60 + (i * 11) % 35}%` }} />
                    <div className="h-2 rounded bg-[#f0f0f0] w-2/5" />
                  </div>
                  <div className="text-right shrink-0">
                    <div className="h-2.5 w-12 rounded bg-[#e5e5e5] mb-1" />
                    <div className="h-2 w-8 rounded bg-[#f0f0f0]" />
                  </div>
                </div>
              ))}
              {cat.stats.products > 6 && (
                <button className="w-full py-3 text-xs font-bold text-gray-500 bg-[#fafafa] border border-[#eee] rounded-2xl hover:bg-gray-100 transition-colors">
                  View all {cat.stats.products} products →
                </button>
              )}
            </div>
          )}

          {tab === 'seo' && (
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
                <AlertCircle size={14} className="shrink-0 mt-0.5" style={{ color: '#3b82f6' }} />
                <p className="text-xs text-gray-600 leading-relaxed">SEO fields override default title and description for search engines and social sharing.</p>
              </div>
              {[
                { label: 'SEO Title',        val: cat.seoTitle, mono: false },
                { label: 'Meta Description', val: cat.seoDesc,  mono: false },
                { label: 'Canonical URL',    val: `yourstore.com/categories/${cat.slug}`, mono: true },
              ].map(({ label, val, mono }) => (
                <div key={label}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">{label}</p>
                  <div className="p-3 bg-[#fafafa] border border-[#f0f0f0] rounded-xl">
                    <p className={`text-xs text-gray-600 leading-relaxed ${mono ? 'font-mono' : ''}`}>{val || <span className="text-gray-300">Not set</span>}</p>
                  </div>
                </div>
              ))}
              {/* Search preview */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Search Preview</p>
                <div className="p-4 rounded-2xl border border-[#eee] bg-white">
                  <p className="text-sm font-semibold truncate mb-1" style={{ color: '#1a0dab' }}>{cat.seoTitle || cat.name}</p>
                  <p className="text-xs font-mono mb-1.5" style={{ color: '#006621' }}>yourstore.com/categories/{cat.slug}</p>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{cat.seoDesc || cat.description}</p>
                </div>
              </div>
              <button onClick={() => onEdit(cat)}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm text-white"
                style={{ background: '#1a1a1a' }}>
                <Edit2 size={14} /> Edit SEO Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   EDIT / CREATE PANEL
═══════════════════════════════════════════════════════ */

function EditPanel({ cat, mode, onClose, onSave }: {
  cat: Category | null; mode: 'edit' | 'create'
  onClose: () => void; onSave: (data: Partial<Category>) => void
}) {
  const [name,     setName]     = useState(cat?.name        ?? '')
  const [slug,     setSlug]     = useState(cat?.slug        ?? '')
  const [desc,     setDesc]     = useState(cat?.description ?? '')
  const [emoji,    setEmoji]    = useState(cat?.emoji       ?? '📦')
  const [color,    setColor]    = useState(cat?.color       ?? '#E40F2A')
  const [status,   setStatus]   = useState<CategoryStatus>(cat?.status ?? 'active')
  const [featured, setFeatured] = useState(cat?.featured    ?? false)
  const [tab,      setTab]      = useState<'general' | 'seo'>('general')
  const [seoTitle, setSeoTitle] = useState(cat?.seoTitle    ?? '')
  const [seoDesc,  setSeoDesc]  = useState(cat?.seoDesc     ?? '')

  useEffect(() => {
    if (cat) {
      setName(cat.name); setSlug(cat.slug); setDesc(cat.description)
      setEmoji(cat.emoji); setColor(cat.color); setStatus(cat.status)
      setFeatured(cat.featured); setSeoTitle(cat.seoTitle); setSeoDesc(cat.seoDesc)
    }
  }, [cat])

  const handleName = (v: string) => {
    setName(v)
    if (mode === 'create') setSlug(v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
  }

  const isValid = name.trim().length > 0 && slug.trim().length > 0

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-[480px] bg-white h-full flex flex-col shadow-2xl">
        <div className="h-1.5 w-full shrink-0" style={{ background: color }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f0f0] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: `${color}15` }}>{emoji}</div>
            <div>
              <p className="font-black text-[15px] text-[#1a1a1a]">
                {mode === 'create' ? 'New Category' : `Edit — ${cat?.name}`}
              </p>
              <p className="text-[11px] text-gray-400 font-mono mt-0.5">/{slug || 'slug'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400">
            <X size={14} />
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-[#f0f0f0] px-6 shrink-0">
          {(['general','seo'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-1 pb-3 pt-3 text-xs font-bold mr-5 border-b-2 transition-all"
              style={{ borderColor: tab === t ? '#E40F2A' : 'transparent', color: tab === t ? '#1a1a1a' : '#aaa', marginBottom: -1 }}>
              {t === 'general' ? 'General' : 'SEO & Meta'}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {tab === 'general' && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                  Name <span style={{ color: '#E40F2A' }}>*</span>
                </label>
                <input value={name} onChange={e => handleName(e.target.value)} placeholder="e.g. Audio Equipment"
                  className="w-full px-4 py-3 bg-[#fafafa] border border-[#eee] rounded-xl text-sm font-semibold text-[#1a1a1a] focus:outline-none transition-all"
                  onFocus={e => (e.target.style.borderColor = '#E40F2A')}
                  onBlur={e  => (e.target.style.borderColor = '#eee')} />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Slug</label>
                <div className="flex">
                  <span className="px-3 py-3 bg-[#f5f5f5] border border-r-0 border-[#eee] rounded-l-xl text-xs font-mono text-gray-400 flex items-center whitespace-nowrap">
                    /categories/
                  </span>
                  <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="audio-equipment"
                    className="flex-1 px-4 py-3 bg-[#fafafa] border border-[#eee] rounded-r-xl text-xs font-mono text-[#1a1a1a] focus:outline-none transition-all"
                    onFocus={e => (e.target.style.borderColor = '#E40F2A')}
                    onBlur={e  => (e.target.style.borderColor = '#eee')} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Description</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Brief description…" rows={3}
                  className="w-full px-4 py-3 bg-[#fafafa] border border-[#eee] rounded-xl text-sm text-[#1a1a1a] resize-none focus:outline-none transition-all leading-relaxed"
                  onFocus={e => (e.target.style.borderColor = '#E40F2A')}
                  onBlur={e  => (e.target.style.borderColor = '#eee')} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Emoji</label>
                  <input value={emoji} onChange={e => setEmoji(e.target.value)} maxLength={2}
                    className="w-full py-3 bg-[#fafafa] border border-[#eee] rounded-xl text-center text-2xl font-bold text-[#1a1a1a] focus:outline-none"
                    style={{ height: 52 }} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Color</label>
                  <div className="flex gap-2 items-center">
                    <div className="w-12 h-12 rounded-xl border border-[#eee] relative overflow-hidden shrink-0" style={{ flexShrink: 0 }}>
                      <div className="absolute inset-0" style={{ background: color }} />
                      <input type="color" value={color} onChange={e => setColor(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                    </div>
                    <input value={color} onChange={e => setColor(e.target.value)}
                      className="flex-1 px-3 py-2.5 bg-[#fafafa] border border-[#eee] rounded-xl text-xs font-mono text-[#1a1a1a] focus:outline-none min-w-0" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Preset Colors</label>
                <div className="flex gap-2 flex-wrap">
                  {PRESET_COLORS.map(c => (
                    <button key={c} onClick={() => setColor(c)}
                      className="w-7 h-7 rounded-lg transition-all hover:scale-110"
                      style={{ background: c, outline: color === c ? `3px solid ${c}` : 'none', outlineOffset: 2, transform: color === c ? 'scale(1.15)' : 'scale(1)' }} />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Status</label>
                <div className="flex gap-2">
                  {(['active','draft','archived'] as CategoryStatus[]).map(s => {
                    const m = STATUS_META[s]
                    return (
                      <button key={s} onClick={() => setStatus(s)}
                        className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all"
                        style={{ border: `1px solid ${status === s ? m.border : '#eee'}`, background: status === s ? m.bg : '#fafafa', color: status === s ? m.color : '#888' }}>
                        {m.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#fafafa] border border-[#f0f0f0]">
                <div>
                  <p className="text-sm font-bold text-[#1a1a1a]">Featured Category</p>
                  <p className="text-xs text-gray-400 mt-0.5">Show on homepage and featured sections</p>
                </div>
                <button onClick={() => setFeatured(v => !v)}
                  className="relative w-11 h-6 rounded-full transition-colors"
                  style={{ background: featured ? '#E40F2A' : '#e5e7eb' }}>
                  <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all"
                    style={{ left: featured ? 24 : 2 }} />
                </button>
              </div>
            </>
          )}

          {tab === 'seo' && (
            <>
              <div className="flex items-start gap-3 p-3.5 rounded-2xl"
                style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
                <AlertCircle size={13} className="shrink-0 mt-0.5" style={{ color: '#3b82f6' }} />
                <p className="text-xs text-gray-600 leading-relaxed">These fields override the default title and description for search engines.</p>
              </div>
              {[
                { label: 'SEO Title',        val: seoTitle, set: setSeoTitle, max: 60,  ph: `${name} | Your Store` },
                { label: 'Meta Description', val: seoDesc,  set: setSeoDesc,  max: 160, ph: 'Brief description for search results…' },
              ].map(({ label, val, set, max, ph }) => (
                <div key={label}>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">{label}</label>
                  <textarea value={val} onChange={e => set(e.target.value)} placeholder={ph} rows={3}
                    className="w-full px-4 py-3 bg-[#fafafa] border border-[#eee] rounded-xl text-sm text-[#1a1a1a] resize-none focus:outline-none transition-all leading-relaxed"
                    onFocus={e => (e.target.style.borderColor = '#E40F2A')}
                    onBlur={e  => (e.target.style.borderColor = '#eee')} />
                  <p className="text-[10px] mt-1" style={{ color: val.length > max * 0.9 ? '#f59e0b' : '#bbb' }}>{val.length}/{max} chars</p>
                </div>
              ))}
              {(seoTitle || name) && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Search Preview</p>
                  <div className="p-4 rounded-2xl border border-[#eee] bg-white">
                    <p className="text-sm font-semibold truncate mb-1" style={{ color: '#1a0dab' }}>{seoTitle || name}</p>
                    <p className="text-xs font-mono mb-1.5" style={{ color: '#006621' }}>yourstore.com/categories/{slug}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{seoDesc || desc || 'No description.'}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-[#f0f0f0] shrink-0">
          <button onClick={onClose} className="flex-1 py-3 border border-[#eee] rounded-2xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
            Cancel
          </button>
          <button
            onClick={() => { if (isValid) { onSave({ name, slug, description: desc, emoji, color, status, featured, seoTitle, seoDesc }); onClose() } }}
            disabled={!isValid}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-white transition-all"
            style={{ background: isValid ? '#E40F2A' : '#e5e7eb', boxShadow: isValid ? '0 4px 12px rgba(228,15,42,0.25)' : 'none' }}
            onMouseEnter={e => { if (isValid) e.currentTarget.style.background = '#c40d24' }}
            onMouseLeave={e => { if (isValid) e.currentTarget.style.background = '#E40F2A' }}>
            <Zap size={13} /> {mode === 'create' ? 'Create Category' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   DELETE MODAL
═══════════════════════════════════════════════════════ */

function DeleteModal({ cat, onClose, onConfirm }: { cat: Category | null; onClose: () => void; onConfirm: (id: string) => void }) {
  if (!cat) return null
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-5" style={{ zIndex: 60 }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl p-7 max-w-sm w-full text-center shadow-2xl">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(239,68,68,0.1)' }}>
          <Trash2 size={22} style={{ color: '#ef4444' }} />
        </div>
        <h3 className="text-lg font-black text-[#1a1a1a] mb-2">Delete "{cat.name}"?</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          This will unassign <strong className="text-[#1a1a1a]">{cat.stats.products} products</strong> from this category.
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-[#eee] rounded-2xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
          <button onClick={() => { onConfirm(cat.id); onClose() }}
            className="flex-1 py-3 rounded-2xl text-sm font-bold text-white transition-all"
            style={{ background: '#ef4444' }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   CATEGORY GRID CARD
═══════════════════════════════════════════════════════ */

function CategoryCard({ cat, selected, idx, onSelect, onView, onEdit, onDelete }: {
  cat: Category; selected: boolean; idx: number
  onSelect: (id: string) => void; onView: (c: Category) => void
  onEdit: (c: Category) => void; onDelete: (c: Category) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: Event) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div className="group relative flex flex-col bg-white border border-[#ebebeb] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-transparent"
      style={{ animationDelay: `${idx * 40}ms`, boxShadow: selected ? `0 0 0 2px ${cat.color}` : undefined }}>
      <div className="h-1 w-full" style={{ background: cat.color }} />

      <div className="flex items-start justify-between p-4 pb-0">
        <button onClick={() => onSelect(cat.id)}
          className="w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all shrink-0 mt-0.5"
          style={{ width: 18, height: 18, borderColor: selected ? cat.color : '#ddd', background: selected ? cat.color : 'white' }}>
          {selected && <Check size={10} color="white" strokeWidth={3} />}
        </button>

        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenuOpen(v => !v)}
            className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100 text-gray-400">
            <MoreHorizontal size={13} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-7 w-44 bg-white border border-[#eee] rounded-2xl shadow-xl py-1.5 z-30">
              {[
                { icon: Eye,    label: 'View details', fn: () => { onView(cat); setMenuOpen(false) }, danger: false },
                { icon: Edit2,  label: 'Edit',         fn: () => { onEdit(cat); setMenuOpen(false) }, danger: false },
                { icon: Copy,   label: 'Duplicate',    fn: () => setMenuOpen(false), danger: false },
                { icon: Trash2, label: 'Delete',       fn: () => { onDelete(cat); setMenuOpen(false) }, danger: true },
              ].map(({ icon: Icon, label, fn, danger }) => (
                <button key={label} onClick={fn}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-left transition-colors"
                  style={{ color: danger ? '#E40F2A' : '#374151' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <Icon size={11} />{label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pb-4 flex flex-col flex-1 gap-3">
        {/* Emoji + name */}
        <div className="text-center pt-1">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3"
            style={{ background: `${cat.color}12` }}>
            {cat.emoji}
          </div>
          <button onClick={() => onView(cat)}
            className="font-bold text-[14px] text-[#1a1a1a] hover:text-[#E40F2A] transition-colors leading-tight">
            {cat.name}
          </button>
          <p className="text-[10px] text-gray-400 font-mono mt-1">/{cat.slug}</p>
          <div className="flex items-center justify-center gap-1.5 mt-2 flex-wrap">
            <StatusBadge status={cat.status} />
            {cat.featured && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                style={{ background: 'rgba(228,15,42,0.08)', color: '#E40F2A', border: '1px solid rgba(228,15,42,0.15)' }}>
                Featured
              </span>
            )}
          </div>
        </div>

        <div className="h-px bg-[#f5f5f5]" />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Products', val: cat.stats.products, icon: Package },
            { label: 'Orders',   val: cat.stats.orders.toLocaleString(), icon: ShoppingCart },
          ].map(({ label, val, icon: Icon }) => (
            <div key={label} className="p-2.5 bg-[#fafafa] rounded-xl border border-[#f0f0f0]">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Icon size={10} className="text-gray-400" />
                <span className="text-[10px] text-gray-400 font-semibold">{label}</span>
              </div>
              <p className="text-sm font-black text-[#1a1a1a]">{val}</p>
            </div>
          ))}
        </div>

        {/* Revenue row */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] text-gray-400 mb-0.5">Revenue</p>
            <div className="flex items-center gap-1.5">
              <p className="text-base font-black text-[#1a1a1a]">{fmtM(cat.stats.revenue)}</p>
              <TrendChip vals={cat.sales12m} />
            </div>
          </div>
          <Sparkline data={cat.sales12m} color={cat.color} width={64} height={26} />
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */

export default function CategoriesPage() {
  const [cats, setCats]                 = useState<Category[]>(CATEGORIES)
  const [search, setSearch]             = useState('')
  const [statusFilter, setStatusFilter] = useState<CategoryStatus | 'all'>('all')
  const [sortKey, setSortKey]           = useState<`${SortField}-${SortDir}`>('products-desc')
  const [view, setView]                 = useState<ViewMode>('list')
  const [selectedIds, setSelectedIds]   = useState<Set<string>>(new Set())
  const [viewCat, setViewCat]           = useState<Category | null>(null)
  const [editCat, setEditCat]           = useState<Category | null>(null)
  const [editMode, setEditMode]         = useState<'edit' | 'create'>('edit')
  const [editOpen, setEditOpen]         = useState(false)
  const [deleteCat, setDeleteCat]       = useState<Category | null>(null)
  const [page, setPage]                 = useState(1)
  const PER_PAGE = view === 'grid' ? 9 : 8

  useEffect(() => {
    document.body.style.overflow = (!!viewCat || editOpen || !!deleteCat) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [viewCat, editOpen, deleteCat])

  const openCreate = () => { setEditCat(null); setEditMode('create'); setEditOpen(true) }
  const openEdit   = (cat: Category) => { setEditCat(cat); setEditMode('edit'); setEditOpen(true) }

  const handleSave = (data: Partial<Category>) => {
    if (editMode === 'create') {
      const newCat: Category = {
        id: `CAT-${Date.now()}`, name: data.name ?? 'New Category', slug: data.slug ?? 'new-category',
        description: data.description ?? '', emoji: data.emoji ?? '📦', color: data.color ?? '#E40F2A',
        status: data.status ?? 'draft', parentId: null, children: [],
        stats: { products: 0, revenue: 0, orders: 0, avgPrice: 0, inStock: 0, lowStock: 0 },
        sales12m: Array(12).fill(0), featured: data.featured ?? false,
        seoTitle: data.seoTitle ?? '', seoDesc: data.seoDesc ?? '', imageCount: 0,
        createdAt: new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }),
        updatedAt: 'Just now',
      }
      setCats(prev => [newCat, ...prev])
    } else if (editCat) {
      setCats(prev => prev.map(c => c.id === editCat.id ? { ...c, ...data, updatedAt: 'Just now' } : c))
      if (viewCat?.id === editCat.id) setViewCat(prev => prev ? { ...prev, ...data } : prev)
    }
  }

  const handleDelete = (id: string) => {
    setCats(prev => prev.filter(c => c.id !== id))
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n })
    if (viewCat?.id === id) setViewCat(null)
  }

  const handleStatusChange = (id: string, status: CategoryStatus) => {
    setCats(prev => prev.map(c => c.id === id ? { ...c, status } : c))
    if (viewCat?.id === id) setViewCat(prev => prev ? { ...prev, status } : prev)
  }

  const toggleSelect = (id: string) => setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const toggleAll    = () => setSelectedIds(selectedIds.size === filtered.length ? new Set() : new Set(filtered.map(c => c.id)))

  const [sortField, sortDir] = sortKey.split('-') as [SortField, SortDir]

  const filtered = useMemo<Category[]>(() => {
    let list = cats
    if (statusFilter !== 'all') list = list.filter(c => c.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.slug.includes(q))
    }
    return [...list].sort((a, b) => {
      const av: string | number = sortField === 'name' || sortField === 'updatedAt'
        ? a[sortField] : (a.stats[sortField as keyof CategoryStats] as number)
      const bv: string | number = sortField === 'name' || sortField === 'updatedAt'
        ? b[sortField] : (b.stats[sortField as keyof CategoryStats] as number)
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
    })
  }, [cats, statusFilter, search, sortField, sortDir])

  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  const stats = useMemo(() => ({
    total:    cats.length,
    active:   cats.filter(c => c.status === 'active').length,
    draft:    cats.filter(c => c.status === 'draft').length,
    archived: cats.filter(c => c.status === 'archived').length,
    featured: cats.filter(c => c.featured).length,
    products: cats.reduce((s, c) => s + c.stats.products, 0),
    revenue:  cats.reduce((s, c) => s + c.stats.revenue, 0),
    orders:   cats.reduce((s, c) => s + c.stats.orders, 0),
  }), [cats])

  function SortBtn({ field, children }: { field: SortField; children: React.ReactNode }) {
    return (
      <button
        onClick={() => setSortKey(`${field}-${sortField === field && sortDir === 'desc' ? 'asc' : 'desc'}`)}
        className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#1a1a1a] transition-colors">
        {children}
        {sortField === field
          ? (sortDir === 'asc' ? <ArrowUp size={9} style={{ color: '#E40F2A' }} /> : <ArrowDown size={9} style={{ color: '#E40F2A' }} />)
          : <ArrowUp size={9} className="text-gray-300" />}
      </button>
    )
  }

  const statCards = [
    { label: 'Categories', val: stats.total,  icon: Layers,       color: '#64748b', accent: '#f1f5f9',                   spark: [8,8,9,9,9,10,10,10,10,10,10,stats.total] },
    { label: 'Revenue',    val: fmtM(stats.revenue),  icon: DollarSign,   color: '#16a34a', accent: 'rgba(34,197,94,0.08)',  spark: [60,72,68,82,78,90,85,98,92,108,102,115] },
    { label: 'Products',   val: stats.products, icon: Package,      color: '#2563eb', accent: 'rgba(37,99,235,0.08)',      spark: [82,88,85,92,90,96,94,100,98,104,102,stats.products] },
    { label: 'Orders',     val: stats.orders.toLocaleString(), icon: ShoppingCart, color: '#E40F2A', accent: 'rgba(228,15,42,0.08)', spark: [420,510,480,570,540,630,590,680,640,740,700,790] },
    { label: 'Featured',   val: stats.featured, icon: TrendingUp,   color: '#d97706', accent: 'rgba(245,158,11,0.08)',     spark: [2,2,3,3,3,4,4,4,4,4,4,stats.featured] },
    { label: 'Inactive',   val: stats.draft + stats.archived, icon: Folder, color: '#ea580c', accent: 'rgba(249,115,22,0.08)', spark: [3,3,3,4,4,4,3,3,3,3,3,stats.draft+stats.archived] },
  ]

  const Pagination = () => totalPages <= 1 ? null : (
    <div className="flex items-center justify-between px-5 py-3 border-t border-[#f0f0f0] bg-[#fafafa]">
      <span className="text-xs text-gray-400">
        Showing {((page - 1) * PER_PAGE) + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
      </span>
      <div className="flex items-center gap-1.5">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
          className="flex items-center gap-1 px-3 py-2 text-xs font-bold border border-[#eee] rounded-xl bg-white disabled:opacity-40 hover:bg-gray-50 transition-all">
          <ChevronLeft size={13} /> Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => setPage(p)}
            className="w-8 h-8 rounded-xl text-xs font-black border transition-all"
            style={{ background: p === page ? '#E40F2A' : 'white', color: p === page ? 'white' : '#555', borderColor: p === page ? '#E40F2A' : '#eee' }}>
            {p}
          </button>
        ))}
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
          className="flex items-center gap-1 px-3 py-2 text-xs font-bold border border-[#eee] rounded-xl bg-white disabled:opacity-40 hover:bg-gray-50 transition-all">
          Next <ChevronRight size={13} />
        </button>
      </div>
    </div>
  )

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-24 bg-white border border-[#eee] rounded-2xl text-center shadow-sm">
      <div className="w-14 h-14 bg-[#f5f5f5] rounded-2xl flex items-center justify-center mb-4">
        <Folder size={22} className="text-gray-300" />
      </div>
      <h3 className="font-black text-[#1a1a1a] text-lg mb-2">No categories found</h3>
      <p className="text-sm text-gray-400 mb-6">{search ? `No results for "${search}"` : 'Try adjusting your filters.'}</p>
      <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white" style={{ background: '#1a1a1a' }}>
        <Plus size={14} /> Create Category
      </button>
    </div>
  )

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: '#f9f9f9', minHeight: '100vh' }}>
      <style>{`
        @keyframes slideIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .cat-row  { animation: slideIn 0.2s ease both; }
        .cat-card { animation: slideIn 0.2s ease both; }
        .group:hover .row-actions { opacity:1!important; }
        .group:hover .row-bar     { opacity:1!important; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 99px; }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-5 py-7 space-y-6">

        {/* ── HEADER ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#E40F2A' }}>
                <Layers size={15} color="white" />
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.5px' }}>Categories</h1>
              <span className="px-2.5 py-1 bg-[#f0f0f0] rounded-lg text-xs font-bold text-gray-500">{filtered.length}</span>
            </div>
            <p style={{ fontSize: 13, color: '#888' }}>
              <span style={{ color: '#22c55e', fontWeight: 700 }}>{stats.active} active</span>
              {stats.draft    > 0 && <> · <span style={{ color: '#94a3b8', fontWeight: 700 }}>{stats.draft} draft</span></>}
              {stats.archived > 0 && <> · <span style={{ color: '#ef4444', fontWeight: 700 }}>{stats.archived} archived</span></>}
              {' '}· {stats.products} products total
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#eee] rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
              <Upload size={13} className="text-gray-400" /> Import
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#eee] rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
              <Download size={13} className="text-gray-400" /> Export
            </button>
            <button onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: '#E40F2A', boxShadow: '0 4px 14px rgba(228,15,42,0.25)' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#c40d24')}
              onMouseLeave={e => (e.currentTarget.style.background = '#E40F2A')}>
              <Plus size={14} /> New Category
            </button>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {statCards.map(({ label, val, icon: Icon, color, accent, spark }) => (
            <div key={label} className="bg-white border border-[#ebebeb] rounded-2xl p-4 flex items-center gap-3 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-default">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: accent }}>
                <Icon size={15} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 22, fontWeight: 900, color: '#1a1a1a', lineHeight: 1 }}>{val}</p>
                <p style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{label}</p>
              </div>
              <div className="shrink-0">
                <MiniBarChart values={spark} color={color} />
              </div>
            </div>
          ))}
        </div>

        {/* ── TOOLBAR ── */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search categories…"
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#eee] rounded-xl text-sm focus:outline-none transition-all"
              style={{ color: '#1a1a1a' }}
              onFocus={e => (e.target.style.borderColor = '#E40F2A')}
              onBlur={e  => (e.target.style.borderColor = '#eee')} />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Status filters */}
          <div className="flex gap-1.5">
            {STATUS_FILTERS.map(({ val, label }) => (
              <button key={val} onClick={() => { setStatusFilter(val); setPage(1) }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all"
                style={{
                  background:  statusFilter === val ? '#1a1a1a' : 'white',
                  color:       statusFilter === val ? 'white'   : '#666',
                  borderColor: statusFilter === val ? '#1a1a1a' : '#eee',
                }}>
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Sort */}
          <select value={sortKey} onChange={e => setSortKey(e.target.value as typeof sortKey)}
            className="px-3 py-2.5 bg-white border border-[#eee] rounded-xl text-sm text-gray-600 focus:outline-none cursor-pointer shadow-sm">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* View toggle */}
          <div className="flex border border-[#eee] rounded-xl overflow-hidden bg-white shadow-sm">
            {([['list', List], ['grid', BarChart3]] as [ViewMode, typeof List][]).map(([v, Icon]) => (
              <button key={v} onClick={() => { setView(v); setPage(1) }}
                className="p-2.5 transition-colors"
                style={{ background: view === v ? '#1a1a1a' : 'transparent', color: view === v ? 'white' : '#999' }}>
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>

        {/* ── BULK ACTION BAR ── */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border flex-wrap"
            style={{ background: 'rgba(228,15,42,0.04)', borderColor: 'rgba(228,15,42,0.15)' }}>
            <span className="text-xs font-black" style={{ color: '#E40F2A' }}>{selectedIds.size} selected</span>
            <div className="w-px h-4" style={{ background: 'rgba(228,15,42,0.2)' }} />
            {([
              { icon: Globe,    label: 'Publish',   color: '#16a34a' },
              { icon: EyeOff,   label: 'Unpublish', color: '#64748b' },
              { icon: Download, label: 'Export',    color: '#555' },
              { icon: Trash2,   label: 'Delete',    color: '#ef4444' },
            ] as { icon: typeof Globe; label: string; color: string }[]).map(({ icon: Icon, label, color }) => (
              <button key={label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-[#eee] hover:bg-gray-50 transition-all"
                style={{ color }}>
                <Icon size={11} /> {label}
              </button>
            ))}
            <button onClick={() => setSelectedIds(new Set())} className="ml-auto text-xs text-gray-400 hover:text-gray-600 font-semibold">Clear</button>
          </div>
        )}

        {/* ══════════════ LIST VIEW ══════════════ */}
        {view === 'list' && (
          <div className="bg-white border border-[#ebebeb] rounded-2xl overflow-hidden shadow-sm">
            {/* Table header */}
            <div className="hidden md:flex items-center gap-4 px-5 py-2.5 border-b border-[#f5f5f5] bg-[#fafafa]">
              <button onClick={toggleAll}
                className="w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all"
                style={{ width: 18, height: 18, borderColor: selectedIds.size === filtered.length && filtered.length > 0 ? '#E40F2A' : '#ddd', background: selectedIds.size === filtered.length && filtered.length > 0 ? '#E40F2A' : 'white' }}>
                {selectedIds.size === filtered.length && filtered.length > 0 && <Check size={10} color="white" strokeWidth={3} />}
              </button>
              <span className="flex-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</span>
              <span className="w-24 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</span>
              <span className="w-20 text-[10px] font-bold uppercase tracking-widest text-gray-400">Products</span>
              <span className="hidden lg:block w-20 text-[10px] font-bold uppercase tracking-widest text-gray-400">Orders</span>
              <span className="hidden lg:block w-24 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Revenue</span>
              <span className="hidden xl:block w-24 text-[10px] font-bold uppercase tracking-widest text-gray-400">Trend (12m)</span>
              <span className="hidden xl:block w-20 text-[10px] font-bold uppercase tracking-widest text-gray-400">Updated</span>
              <span className="w-24" />
            </div>

            {paginated.length === 0
              ? <EmptyState />
              : paginated.map((cat, i) => (
                <div key={cat.id} className="group cat-row relative flex items-center gap-4 px-5 py-3.5 border-b border-[#f5f5f5] last:border-0 transition-colors hover:bg-[#fafafa]"
                  style={{ animationDelay: `${i * 30}ms`, background: selectedIds.has(cat.id) ? 'rgba(228,15,42,0.02)' : undefined }}>
                  {/* Left color bar */}
                  <div className="row-bar absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full opacity-0 transition-all"
                    style={{ background: cat.color }} />

                  <button onClick={() => toggleSelect(cat.id)}
                    className="shrink-0 flex items-center justify-center rounded border transition-all"
                    style={{ width: 18, height: 18, borderColor: selectedIds.has(cat.id) ? '#E40F2A' : '#ddd', background: selectedIds.has(cat.id) ? '#E40F2A' : 'white' }}>
                    {selectedIds.has(cat.id) && <Check size={10} color="white" strokeWidth={3} />}
                  </button>

                  {/* Category info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ background: `${cat.color}12` }}>
                      {cat.emoji}
                    </div>
                    <div className="min-w-0">
                      <button onClick={() => setViewCat(cat)}
                        className="font-bold text-[13px] text-[#1a1a1a] hover:text-[#E40F2A] transition-colors text-left leading-tight block truncate max-w-[180px]">
                        {cat.name}
                      </button>
                      <div className="flex items-center gap-2 mt-0.5">
                        <code className="text-[10px] text-gray-400">/{cat.slug}</code>
                        {cat.featured && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded"
                            style={{ background: 'rgba(228,15,42,0.08)', color: '#E40F2A' }}>FEATURED</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-24 shrink-0"><StatusBadge status={cat.status} /></div>

                  <div className="w-20 shrink-0">
                    <p className="text-sm font-black text-[#1a1a1a]">{cat.stats.products}</p>
                    {cat.stats.lowStock > 0 && (
                      <p className="text-[10px] font-semibold" style={{ color: '#d97706' }}>{cat.stats.lowStock} low</p>
                    )}
                  </div>

                  <div className="hidden lg:block w-20 shrink-0">
                    <p className="text-sm font-bold text-[#1a1a1a]">{cat.stats.orders.toLocaleString()}</p>
                  </div>

                  <div className="hidden lg:block w-24 shrink-0 text-right">
                    <p className="text-sm font-black text-[#1a1a1a]">{fmtM(cat.stats.revenue)}</p>
                    <p className="text-[10px] text-gray-400">avg {fmtK(cat.stats.avgPrice)}</p>
                  </div>

                  <div className="hidden xl:flex w-24 shrink-0 items-center gap-2">
                    <Sparkline data={cat.sales12m} color={cat.color} width={60} height={24} />
                    <TrendChip vals={cat.sales12m} />
                  </div>

                  <div className="hidden xl:block w-20 shrink-0">
                    <p className="text-xs text-gray-400 whitespace-nowrap">{cat.updatedAt}</p>
                    <p className="text-[10px] text-gray-300">{cat.imageCount} imgs</p>
                  </div>

                  {/* Row actions */}
                  <div className="row-actions flex items-center gap-1 w-24 shrink-0 justify-end opacity-0 transition-opacity">
                    <button onClick={() => openEdit(cat)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white"
                      style={{ background: '#1a1a1a' }}>
                      <Edit2 size={11} />
                    </button>
                    <button onClick={() => setViewCat(cat)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
                      <Eye size={13} />
                    </button>
                    <button onClick={() => setDeleteCat(cat)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: '#ef4444', background: 'rgba(239,68,68,0.06)' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            }

            <Pagination />
          </div>
        )}

        {/* ══════════════ GRID VIEW ══════════════ */}
        {view === 'grid' && (
          paginated.length === 0
            ? <EmptyState />
            : (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {paginated.map((cat, i) => (
                    <div key={cat.id} className="cat-card" style={{ animationDelay: `${i * 40}ms` }}>
                      <CategoryCard cat={cat} selected={selectedIds.has(cat.id)} idx={i}
                        onSelect={toggleSelect} onView={setViewCat} onEdit={openEdit} onDelete={setDeleteCat} />
                    </div>
                  ))}
                  {/* Ghost "New" card */}
                  <button onClick={openCreate}
                    className="rounded-2xl border-2 border-dashed border-[#eee] flex flex-col items-center justify-center gap-3 py-16 text-gray-400 hover:text-[#E40F2A] hover:border-[#E40F2A] transition-all"
                    style={{ minHeight: 260 }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(228,15,42,0.02)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                    <div className="w-12 h-12 rounded-xl border-2 border-dashed border-current flex items-center justify-center">
                      <Plus size={22} />
                    </div>
                    <span className="text-sm font-bold">New Category</span>
                  </button>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Showing {((page - 1) * PER_PAGE) + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                        className="flex items-center gap-1 px-3 py-2 text-xs font-bold border border-[#eee] rounded-xl bg-white disabled:opacity-40 hover:bg-gray-50 transition-all">
                        <ChevronLeft size={13} /> Prev
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => setPage(p)}
                          className="w-8 h-8 rounded-xl text-xs font-black border transition-all"
                          style={{ background: p === page ? '#E40F2A' : 'white', color: p === page ? 'white' : '#555', borderColor: p === page ? '#E40F2A' : '#eee' }}>
                          {p}
                        </button>
                      ))}
                      <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                        className="flex items-center gap-1 px-3 py-2 text-xs font-bold border border-[#eee] rounded-xl bg-white disabled:opacity-40 hover:bg-gray-50 transition-all">
                        Next <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )
        )}
      </div>

      {viewCat  && <CategoryPanel cat={viewCat} onClose={() => setViewCat(null)} onEdit={cat => { setViewCat(null); openEdit(cat) }} onStatusChange={handleStatusChange} />}
      {editOpen && <EditPanel cat={editCat} mode={editMode} onClose={() => setEditOpen(false)} onSave={handleSave} />}
      {deleteCat && <DeleteModal cat={deleteCat} onClose={() => setDeleteCat(null)} onConfirm={handleDelete} />}
    </div>
  )
}