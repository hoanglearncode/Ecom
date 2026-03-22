'use client'

import {
  Package, Search, Plus, Download, MoreHorizontal, X, Check,
  Eye, Edit2, Copy, Trash2, Archive, Tag,
  TrendingDown, ArrowUp, ArrowDown, ChevronLeft,
  ChevronRight, List, LayoutGrid,
  AlertCircle, CheckCircle2, DollarSign,
  ShoppingCart, RefreshCw, Upload,
  ChevronDown, Globe, EyeOff,
  Percent, Box, ExternalLink,
  LucideIcon,
} from 'lucide-react'
import { useState, useRef, useEffect, useMemo, CSSProperties, FC, MouseEvent } from 'react'

/* ═══════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════ */

type ProductStatus = 'active' | 'draft' | 'archived'
type SortField = 'revenue' | 'price' | 'stock' | 'sold' | 'rating' | 'name'
type SortDir = 'asc' | 'desc'
type StatusFilterValue = 'all' | ProductStatus | 'out' | 'low'
type ViewMode = 'list' | 'grid'

interface Variant {
  name: string
  stock: number
  price: number
}

interface Product {
  id: string
  name: string
  sku: string
  category: string
  status: ProductStatus
  price: number
  comparePrice: number | null
  cost: number
  stock: number
  lowStockThreshold: number
  sold: number
  revenue: number
  rating: number | null
  reviews: number
  tags: string[]
  emoji: string
  variants: number
  images: number
  description: string
  sales: number[]
  weight: string
  dimensions: string
  vendor: string
  barcode: string
  collections: string[]
  variantList: Variant[]
}

interface StatusMeta {
  label: string
  color: string
  bg: string
  border: string
}

interface StatCard {
  label: string
  val: string | number
  icon: LucideIcon
  color: string
  bg: string
  spark: number[]
}

/* ═══════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════ */

const CATEGORIES = ['All', 'Audio', 'Peripherals', 'Displays', 'Accessories', 'Networking', 'Storage', 'Lighting'] as const

const CAT_COLORS: Record<string, string> = {
  Audio: '#8b5cf6', Peripherals: '#3b82f6', Displays: '#06b6d4',
  Accessories: '#f59e0b', Networking: '#22c55e', Storage: '#ef4444',
  Lighting: '#f97316', Uncategorized: '#94a3b8',
}

const STATUS_META: Record<string, StatusMeta> = {
  active:   { label: 'Active',    color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)' },
  draft:    { label: 'Draft',     color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.25)' },
  archived: { label: 'Archived',  color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)' },
  low:      { label: 'Low Stock', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)' },
}

const SORT_OPTIONS: { value: `${SortField}-${SortDir}`; label: string }[] = [
  { value: 'revenue-desc', label: 'Revenue ↓' },
  { value: 'revenue-asc',  label: 'Revenue ↑' },
  { value: 'price-desc',   label: 'Price ↓' },
  { value: 'price-asc',    label: 'Price ↑' },
  { value: 'stock-asc',    label: 'Stock Low–High' },
  { value: 'stock-desc',   label: 'Stock High–Low' },
  { value: 'sold-desc',    label: 'Most Sold' },
  { value: 'name-asc',     label: 'Name A–Z' },
]

const STATUS_FILTERS: { val: StatusFilterValue; label: string }[] = [
  { val: 'all',     label: 'All' },
  { val: 'active',  label: 'Active' },
  { val: 'draft',   label: 'Draft' },
  { val: 'out',     label: '🚫 Out of Stock' },
  { val: 'low',     label: '⚠️ Low Stock' },
]

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */

const PRODUCTS: Product[] = [
  {
    id: 'PRD-001', name: 'Wireless Noise-Cancelling Headphones Pro', sku: 'WNC-PRO-BLK', category: 'Audio',
    status: 'active', price: 189.00, comparePrice: 229.00, cost: 82.00,
    stock: 142, lowStockThreshold: 20, sold: 1284, revenue: 242676,
    rating: 4.8, reviews: 342, tags: ['bestseller', 'wireless', 'featured'],
    emoji: '🎧', variants: 3, images: 6,
    description: 'Premium ANC headphones with 40hr battery, multipoint connect, and studio-quality sound.',
    sales: [38, 45, 41, 52, 48, 61, 55, 67, 72, 65, 80, 74],
    weight: '280g', dimensions: '18×16×8cm', vendor: 'SoundCore', barcode: '4719512001842',
    collections: ['Best Sellers', 'Featured', 'New Arrivals'],
    variantList: [
      { name: 'Black', stock: 88, price: 189.00 },
      { name: 'White', stock: 34, price: 189.00 },
      { name: 'Midnight Blue', stock: 20, price: 199.00 },
    ],
  },
  {
    id: 'PRD-002', name: 'Mechanical Keyboard TKL RGB', sku: 'MK-TKL-WHT', category: 'Peripherals',
    status: 'active', price: 144.00, comparePrice: 169.00, cost: 58.00,
    stock: 87, lowStockThreshold: 15, sold: 876, revenue: 126144,
    rating: 4.6, reviews: 218, tags: ['rgb', 'mechanical'],
    emoji: '⌨️', variants: 4, images: 5,
    description: 'Tenkeyless form factor with hot-swap sockets, per-key RGB, and aluminum top case.',
    sales: [22, 28, 25, 31, 29, 34, 38, 32, 41, 37, 45, 42],
    weight: '750g', dimensions: '36×13×4cm', vendor: 'KeyCraft', barcode: '4719512002819',
    collections: ['Featured', 'PC Setup'],
    variantList: [
      { name: 'Red Switch', stock: 24, price: 144.00 },
      { name: 'Blue Switch', stock: 31, price: 144.00 },
      { name: 'Brown Switch', stock: 20, price: 144.00 },
      { name: 'Silent Red', stock: 12, price: 149.00 },
    ],
  },
  {
    id: 'PRD-003', name: 'Gaming Monitor 27" IPS 144Hz', sku: 'GM-27-144', category: 'Displays',
    status: 'active', price: 380.00, comparePrice: null, cost: 198.00,
    stock: 28, lowStockThreshold: 10, sold: 412, revenue: 156560,
    rating: 4.9, reviews: 156, tags: ['gaming', '144hz', 'ips'],
    emoji: '🖥️', variants: 2, images: 8,
    description: '27" IPS panel, 1ms GTG, G-Sync compatible, HDR400, USB-C 65W charging.',
    sales: [12, 14, 11, 16, 18, 15, 21, 19, 24, 22, 28, 25],
    weight: '4.8kg', dimensions: '62×47×22cm', vendor: 'ViewTech', barcode: '4719512003846',
    collections: ['Gaming', 'Best Sellers'],
    variantList: [
      { name: '27" Standard', stock: 18, price: 380.00 },
      { name: '27" VESA Bundle', stock: 10, price: 430.00 },
    ],
  },
  {
    id: 'PRD-004', name: 'USB-C Hub 7-in-1 Slim', sku: 'USB-HUB-7C', category: 'Accessories',
    status: 'active', price: 45.00, comparePrice: 59.00, cost: 14.00,
    stock: 8, lowStockThreshold: 20, sold: 2140, revenue: 96300,
    rating: 4.4, reviews: 534, tags: ['usb-c', 'hub', 'bestseller'],
    emoji: '🔌', variants: 1, images: 4,
    description: '4K HDMI, 100W PD, 3× USB-A 3.0, SD/TF card reader in aluminum housing.',
    sales: [62, 71, 68, 85, 79, 94, 88, 102, 95, 110, 104, 118],
    weight: '95g', dimensions: '12×5×1.2cm', vendor: 'ConnectPro', barcode: '4719512004873',
    collections: ['Best Sellers', 'Work From Home'],
    variantList: [{ name: 'Space Gray', stock: 8, price: 45.00 }],
  },
  {
    id: 'PRD-005', name: 'Logitech MX Master 3S Mouse', sku: 'MX-M3S-GRY', category: 'Peripherals',
    status: 'active', price: 99.00, comparePrice: null, cost: 44.00,
    stock: 54, lowStockThreshold: 15, sold: 689, revenue: 68211,
    rating: 4.7, reviews: 289, tags: ['wireless', 'ergonomic'],
    emoji: '🖱️', variants: 2, images: 5,
    description: 'Ultrafast MagSpeed scroll, 8K DPI sensor, works on any surface including glass.',
    sales: [19, 22, 20, 26, 24, 29, 27, 33, 30, 36, 34, 38],
    weight: '141g', dimensions: '12×8×5cm', vendor: 'Logitech', barcode: '5099206097087',
    collections: ['Work From Home', 'PC Setup'],
    variantList: [
      { name: 'Graphite', stock: 32, price: 99.00 },
      { name: 'Pale Gray', stock: 22, price: 99.00 },
    ],
  },
  {
    id: 'PRD-006', name: 'Smart LED Strip 5m RGBIC', sku: 'LED-5M-RGB', category: 'Lighting',
    status: 'active', price: 84.00, comparePrice: 99.00, cost: 28.00,
    stock: 0, lowStockThreshold: 25, sold: 1820, revenue: 152880,
    rating: 4.3, reviews: 461, tags: ['smart', 'rgbic', 'alexa'],
    emoji: '💡', variants: 2, images: 7,
    description: 'RGBIC individual segment control, music sync, app + voice control, IP65 rated.',
    sales: [44, 52, 48, 58, 55, 66, 60, 74, 68, 80, 75, 88],
    weight: '320g', dimensions: '5m roll', vendor: 'GlowTech', barcode: '4719512005900',
    collections: ['Smart Home', 'Featured'],
    variantList: [
      { name: '5m', stock: 0, price: 84.00 },
      { name: '10m', stock: 0, price: 149.00 },
    ],
  },
  {
    id: 'PRD-007', name: '4K Webcam 60fps AutoFocus', sku: 'CAM-4K-60', category: 'Peripherals',
    status: 'draft', price: 149.00, comparePrice: null, cost: 68.00,
    stock: 45, lowStockThreshold: 10, sold: 0, revenue: 0,
    rating: null, reviews: 0, tags: ['4k', 'webcam', 'streaming'],
    emoji: '📷', variants: 1, images: 3,
    description: 'Sony sensor, f/1.8 aperture, dual noise-cancelling mics, plug & play USB-C.',
    sales: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    weight: '180g', dimensions: '9×5×5cm', vendor: 'OptiCam', barcode: '4719512006927',
    collections: ['Work From Home'],
    variantList: [{ name: 'Standard', stock: 45, price: 149.00 }],
  },
  {
    id: 'PRD-008', name: 'Portable SSD 1TB USB 3.2', sku: 'SSD-1TB-BLK', category: 'Storage',
    status: 'active', price: 118.00, comparePrice: 139.00, cost: 52.00,
    stock: 63, lowStockThreshold: 20, sold: 934, revenue: 110212,
    rating: 4.5, reviews: 198, tags: ['ssd', 'portable', 'fast'],
    emoji: '💾', variants: 3, images: 4,
    description: '1050MB/s read, 1000MB/s write, military-grade drop & shock protection, 2m drop tested.',
    sales: [28, 31, 29, 34, 32, 38, 36, 41, 39, 45, 42, 48],
    weight: '46g', dimensions: '9.8×5.2×0.9cm', vendor: 'SpeedDrive', barcode: '4719512007954',
    collections: ['Best Sellers'],
    variantList: [
      { name: '500GB', stock: 28, price: 72.00 },
      { name: '1TB', stock: 22, price: 118.00 },
      { name: '2TB', stock: 13, price: 198.00 },
    ],
  },
  {
    id: 'PRD-009', name: 'WiFi 6 Router AX3000', sku: 'RT-AX3000', category: 'Networking',
    status: 'active', price: 159.00, comparePrice: null, cost: 78.00,
    stock: 19, lowStockThreshold: 15, sold: 378, revenue: 60102,
    rating: 4.6, reviews: 142, tags: ['wifi6', 'router', 'gaming'],
    emoji: '📡', variants: 1, images: 5,
    description: 'AX3000 dual-band, OFDMA + MU-MIMO, 4× Gigabit LAN, covers up to 2500 sq ft.',
    sales: [8, 10, 9, 12, 11, 14, 13, 16, 14, 18, 16, 20],
    weight: '540g', dimensions: '28×18×4cm', vendor: 'NetCore', barcode: '4719512008981',
    collections: ['Networking', 'Work From Home'],
    variantList: [{ name: 'Black', stock: 19, price: 159.00 }],
  },
  {
    id: 'PRD-010', name: 'MacBook Stand Aluminum Adjustable', sku: 'MBP-STAND-SLV', category: 'Accessories',
    status: 'archived', price: 65.00, comparePrice: 89.00, cost: 18.00,
    stock: 12, lowStockThreshold: 10, sold: 2841, revenue: 184665,
    rating: 4.2, reviews: 712, tags: ['macbook', 'stand', 'aluminum'],
    emoji: '💻', variants: 2, images: 4,
    description: 'Height & angle adjustable, compatible with all laptops 11"–17", non-slip base.',
    sales: [82, 90, 86, 95, 91, 98, 94, 100, 97, 88, 75, 62],
    weight: '620g', dimensions: '25×20×12cm', vendor: 'DeskMate', barcode: '4719512009108',
    collections: ['Work From Home', 'Best Sellers'],
    variantList: [
      { name: 'Silver', stock: 8, price: 65.00 },
      { name: 'Space Gray', stock: 4, price: 65.00 },
    ],
  },
]

/* ═══════════════════════════════════════════════════════
   FORMATTERS
═══════════════════════════════════════════════════════ */

const fmt = (n: number): string =>
  '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const fmtK = (n: number): string =>
  n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`

/* ═══════════════════════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════════════════════ */

interface StockBarProps {
  stock: number
  threshold: number
  total?: number | null
}

const StockBar: FC<StockBarProps> = ({ stock, threshold, total = null }) => {
  const max = total ?? Math.max(stock, threshold * 3, 50)
  const pct = Math.min((stock / max) * 100, 100)
  const color = stock === 0 ? '#ef4444' : stock <= threshold ? '#f59e0b' : '#22c55e'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 5, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.4s ease' }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color, minWidth: 28, textAlign: 'right' }}>{stock}</span>
    </div>
  )
}

interface SparklineProps {
  data: number[]
  color: string
  height?: number
  width?: number
}

const Sparkline: FC<SparklineProps> = ({ data, color, height = 32, width = 80 }) => {
  if (!data || data.every(v => v === 0)) {
    return (
      <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 10, color: '#ccc' }}>No sales</span>
      </div>
    )
  }
  const max = Math.max(...data, 1)
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - 4) + 2
    const y = height - 4 - ((v / max) * (height - 8))
    return `${x},${y}`
  })
  const areaPath = `M${pts.join('L')}L${width - 2},${height - 2}L2,${height - 2}Z`
  const linePath = `M${pts.join('L')}`
  const lastPt = pts[pts.length - 1].split(',')
  const lx = lastPt[0]
  const ly = lastPt[1]

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" style={{ overflow: 'visible' }}>
      <path d={areaPath} fill={color} fillOpacity={0.08} />
      <path d={linePath} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={lx} cy={ly} r={2.5} fill={color} />
    </svg>
  )
}

interface RatingStarsProps {
  rating: number | null
  size?: number
}

const RatingStars: FC<RatingStarsProps> = ({ rating, size = 11 }) => {
  if (!rating) return <span style={{ fontSize: size, color: '#ccc' }}>No reviews</span>
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 12 12" fill={i <= Math.round(rating) ? '#f59e0b' : '#e5e7eb'}>
          <path d="M6 1l1.3 2.6 2.9.4-2.1 2 .5 2.9L6 7.5 3.4 8.9l.5-2.9-2.1-2 2.9-.4z" />
        </svg>
      ))}
      <span style={{ fontSize: size, fontWeight: 700, color: '#888', marginLeft: 2 }}>{rating}</span>
    </div>
  )
}

interface StatusBadgeProps {
  status: ProductStatus
  stock: number
  threshold: number
}

const StatusBadge: FC<StatusBadgeProps> = ({ status, stock, threshold }) => {
  const isOutOfStock = stock === 0 && status === 'active'
  const isLowStock = stock > 0 && stock <= threshold && status === 'active'
  const key = isOutOfStock ? 'low' : status
  const display = STATUS_META[key] ?? STATUS_META.draft
  const label = isOutOfStock ? 'Out of Stock' : display.label

  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
      border: `1px solid ${display.border}`, background: display.bg, color: display.color,
      whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 5,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: display.color, display: 'inline-block' }} />
      {label}
    </span>
  )
}

interface CategoryPillProps {
  category: string
}

const CategoryPill: FC<CategoryPillProps> = ({ category }) => {
  const color = CAT_COLORS[category] ?? '#94a3b8'
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
      background: `${color}15`, color, textTransform: 'uppercase', letterSpacing: '0.06em',
    }}>
      {category}
    </span>
  )
}

interface MiniBarChartProps {
  values: number[]
  color: string
}

const MiniBarChart: FC<MiniBarChartProps> = ({ values, color }) => {
  const max = Math.max(...values, 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 28 }}>
      {values.slice(-8).map((v, i, arr) => (
        <div key={i} style={{
          flex: 1, borderRadius: 2, minHeight: 2,
          height: `${(v / max) * 100}%`,
          background: i === arr.length - 1 ? color : `${color}40`,
          transition: 'height 0.3s',
        }} />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   PRODUCT DETAIL PANEL
═══════════════════════════════════════════════════════ */

type PanelTab = 'overview' | 'variants' | 'analytics'

interface ProductPanelProps {
  product: Product
  onClose: () => void
  onStatusChange: (id: string, status: ProductStatus) => void
}

const ProductPanel: FC<ProductPanelProps> = ({ product, onClose, onStatusChange }) => {
  const [tab, setTab] = useState<PanelTab>('overview')
  const [editingStock, setEditingStock] = useState(false)
  const catColor = CAT_COLORS[product.category] ?? '#94a3b8'
  const margin = ((product.price - product.cost) / product.price * 100).toFixed(0)
  const roi = ((product.price - product.cost) / product.cost * 100).toFixed(0)

  const MONTHS = ['A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D', 'J', 'F', 'M'] as const

  const panelTabs: { value: PanelTab; label: string }[] = [
    { value: 'overview',  label: 'Overview' },
    { value: 'variants',  label: `Variants (${product.variantList.length})` },
    { value: 'analytics', label: 'Analytics' },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(3px)' }} onClick={onClose} />
      <div style={{ position: 'relative', marginLeft: 'auto', width: '100%', maxWidth: 500, height: '100%', background: 'white', display: 'flex', flexDirection: 'column', boxShadow: '0 0 60px rgba(0,0,0,0.15)' }}>

        {/* Accent strip */}
        <div style={{ height: 3, background: catColor, flexShrink: 0 }} />

        {/* Header */}
        <div style={{ padding: '16px 20px 0', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 12, flex: 1, minWidth: 0 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${catColor}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
                {product.emoji}
              </div>
              <div style={{ minWidth: 0 }}>
                <h2 style={{ fontSize: 15, fontWeight: 900, color: '#1a1a1a', lineHeight: 1.2, margin: '0 0 6px' }}>{product.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <code style={{ fontSize: 10, color: '#aaa', fontFamily: 'monospace' }}>{product.sku}</code>
                  <CategoryPill category={product.category} />
                  <StatusBadge status={product.status} stock={product.stock} threshold={product.lowStockThreshold} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 8 }}>
              <button style={{ padding: '7px 12px', borderRadius: 10, background: '#f5f5f5', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#555', display: 'flex', alignItems: 'center', gap: 5 }}>
                <ExternalLink size={11} /> View
              </button>
              <button style={{ padding: '7px 12px', borderRadius: 10, background: '#1a1a1a', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Edit2 size={11} /> Edit
              </button>
              <button onClick={onClose} style={{ padding: '7px', borderRadius: 10, background: '#f5f5f5', border: 'none', cursor: 'pointer', color: '#888', display: 'flex' }}>
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 2 }}>
            {panelTabs.map(({ value, label }) => (
              <button key={value} onClick={() => setTab(value)}
                style={{
                  padding: '8px 14px', borderRadius: '10px 10px 0 0', border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 700, background: 'transparent',
                  color: tab === value ? '#1a1a1a' : '#aaa',
                  borderBottom: `2px solid ${tab === value ? '#E40F2A' : 'transparent'}`,
                  transition: 'all 0.15s', marginBottom: -1,
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Price trio */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {([
                  { label: 'Sell Price', val: fmt(product.price), sub: product.comparePrice ? `Was ${fmt(product.comparePrice)}` : null, accent: '#1a1a1a' },
                  { label: 'Cost',       val: fmt(product.cost),  sub: null, accent: '#64748b' },
                  { label: 'Margin',     val: `${margin}%`, sub: `ROI ${roi}%`, accent: Number(margin) >= 50 ? '#22c55e' : Number(margin) >= 30 ? '#f59e0b' : '#ef4444' },
                ] as const).map(({ label, val, sub, accent }) => (
                  <div key={label} style={{ padding: 14, background: '#fafafa', borderRadius: 14, border: '1px solid #f0f0f0' }}>
                    <p style={{ fontSize: 10, color: '#bbb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</p>
                    <p style={{ fontSize: 18, fontWeight: 900, color: accent, lineHeight: 1 }}>{val}</p>
                    {sub && <p style={{ fontSize: 10, color: '#bbb', marginTop: 3 }}>{sub}</p>}
                  </div>
                ))}
              </div>

              {/* Inventory */}
              <div style={{
                padding: 16,
                background: product.stock === 0 ? 'rgba(239,68,68,0.05)' : product.stock <= product.lowStockThreshold ? 'rgba(245,158,11,0.05)' : '#fafafa',
                borderRadius: 16,
                border: `1px solid ${product.stock === 0 ? 'rgba(239,68,68,0.15)' : product.stock <= product.lowStockThreshold ? 'rgba(245,158,11,0.15)' : '#f0f0f0'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Box size={14} style={{ color: product.stock === 0 ? '#ef4444' : product.stock <= product.lowStockThreshold ? '#f59e0b' : '#22c55e' }} />
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#1a1a1a' }}>Inventory</span>
                  </div>
                  <button
                    onClick={() => setEditingStock(v => !v)}
                    style={{ padding: '4px 10px', borderRadius: 8, background: 'white', border: '1px solid #eee', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#555', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Edit2 size={10} /> Adjust
                  </button>
                </div>
                <StockBar stock={product.stock} threshold={product.lowStockThreshold} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ fontSize: 11, color: '#aaa' }}>Alert at {product.lowStockThreshold} units</span>
                  <span style={{ fontSize: 11, color: '#aaa' }}>{product.sold.toLocaleString()} sold total</span>
                </div>
                {editingStock && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <input
                      type="number"
                      defaultValue={product.stock}
                      style={{ flex: 1, padding: '8px 12px', background: 'white', border: '1px solid #ddd', borderRadius: 10, fontSize: 13, outline: 'none', color: '#1a1a1a' }}
                    />
                    <button
                      style={{ padding: '8px 14px', background: '#1a1a1a', border: 'none', borderRadius: 10, cursor: 'pointer', color: 'white', fontSize: 12, fontWeight: 700 }}
                      onClick={() => setEditingStock(false)}>
                      Save
                    </button>
                    <button
                      style={{ padding: '8px 10px', background: '#f5f5f5', border: 'none', borderRadius: 10, cursor: 'pointer', color: '#888' }}
                      onClick={() => setEditingStock(false)}>
                      <X size={13} />
                    </button>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#bbb', marginBottom: 8 }}>Description</p>
                <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>{product.description}</p>
              </div>

              {/* Details grid */}
              <div>
                <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#bbb', marginBottom: 10 }}>Details</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {([
                    { label: 'Vendor',     val: product.vendor },
                    { label: 'Barcode',    val: product.barcode },
                    { label: 'Weight',     val: product.weight },
                    { label: 'Dimensions', val: product.dimensions },
                    { label: 'Variants',   val: `${product.variants} options` },
                    { label: 'Images',     val: `${product.images} photos` },
                  ] as const).map(({ label, val }) => (
                    <div key={label} style={{ padding: 12, background: '#fafafa', borderRadius: 12, border: '1px solid #f0f0f0' }}>
                      <p style={{ fontSize: 10, color: '#bbb', fontWeight: 600, marginBottom: 3 }}>{label}</p>
                      <p style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a' }}>{val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags & Collections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#bbb', marginBottom: 8 }}>Tags</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {product.tags.map(t => (
                      <span key={t} style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', background: 'rgba(228,15,42,0.07)', color: '#E40F2A', borderRadius: 8, border: '1px solid rgba(228,15,42,0.15)' }}>
                        #{t}
                      </span>
                    ))}
                    <button style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', background: '#f5f5f5', color: '#aaa', borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Plus size={10} /> Add
                    </button>
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#bbb', marginBottom: 8 }}>Collections</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {product.collections.map(c => (
                      <span key={c} style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', background: '#f5f5f5', color: '#555', borderRadius: 8 }}>{c}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
                {product.status === 'draft' && (
                  <button
                    onClick={() => onStatusChange(product.id, 'active')}
                    style={{ width: '100%', padding: 14, borderRadius: 16, background: '#22c55e', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <Globe size={15} /> Publish Product
                  </button>
                )}
                {product.status === 'active' && (
                  <button
                    onClick={() => onStatusChange(product.id, 'draft')}
                    style={{ width: '100%', padding: 14, borderRadius: 16, background: '#1a1a1a', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <EyeOff size={15} /> Unpublish
                  </button>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ flex: 1, padding: 11, borderRadius: 14, background: '#fafafa', border: '1px solid #eee', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Copy size={12} /> Duplicate
                  </button>
                  <button
                    onClick={() => onStatusChange(product.id, 'archived')}
                    style={{ flex: 1, padding: 11, borderRadius: 14, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Archive size={12} /> Archive
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── VARIANTS ── */}
          {tab === 'variants' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <p style={{ fontSize: 13, color: '#555' }}>
                  {product.variantList.length} variant{product.variantList.length !== 1 ? 's' : ''} across {product.variants} option{product.variants > 1 ? 's' : ''}
                </p>
                <button style={{ padding: '6px 12px', borderRadius: 10, background: '#1a1a1a', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Plus size={11} /> Add Variant
                </button>
              </div>
              {product.variantList.map((v, i) => (
                <div key={i} style={{ padding: 14, background: '#fafafa', borderRadius: 14, border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${catColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    {product.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>{v.name}</p>
                    <StockBar stock={v.stock} threshold={product.lowStockThreshold} total={product.stock + 10} />
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 900, color: '#1a1a1a' }}>{fmt(v.price)}</p>
                    <p style={{ fontSize: 10, color: v.stock === 0 ? '#ef4444' : '#aaa', fontWeight: 700 }}>
                      {v.stock === 0 ? 'Out of stock' : `${v.stock} left`}
                    </p>
                  </div>
                  <button
                    style={{ padding: 6, borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#bbb' }}
                    onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.color = '#1a1a1a')}
                    onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.color = '#bbb')}>
                    <Edit2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {tab === 'analytics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* KPI cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {([
                  { label: 'Total Revenue', val: fmtK(product.revenue), icon: DollarSign,  color: '#22c55e', trend: '+12%', sub: undefined },
                  { label: 'Units Sold',    val: product.sold.toLocaleString(), icon: ShoppingCart, color: '#3b82f6', trend: '+8%', sub: undefined },
                  { label: 'Rating',        val: product.rating ? `${product.rating}/5` : 'N/A', icon: ChevronDown, color: '#f59e0b', trend: undefined, sub: `${product.reviews} reviews` },
                  { label: 'Margin',        val: `${margin}%`, icon: Percent, color: Number(margin) >= 50 ? '#22c55e' : '#f59e0b', trend: undefined, sub: `Cost: ${fmt(product.cost)}` },
                ] as { label: string; val: string; icon: LucideIcon; color: string; trend?: string; sub?: string }[]).map(({ label, val, icon: Icon, color, trend, sub }) => (
                  <div key={label} style={{ padding: 14, background: '#fafafa', borderRadius: 14, border: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 9, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={13} style={{ color }} />
                      </div>
                      {trend && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '2px 7px', borderRadius: 6 }}>
                          {trend}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 20, fontWeight: 900, color: '#1a1a1a', lineHeight: 1, marginBottom: 2 }}>{val}</p>
                    <p style={{ fontSize: 10, color: '#bbb', fontWeight: 600 }}>{sub ?? label}</p>
                  </div>
                ))}
              </div>

              {/* Sales chart */}
              <div style={{ padding: 16, background: '#fafafa', borderRadius: 16, border: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: '#1a1a1a' }}>Monthly Sales</p>
                  <span style={{ fontSize: 11, color: '#aaa' }}>Last 12 months</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
                  {product.sales.map((v, i) => {
                    const maxVal = Math.max(...product.sales, 1)
                    const isLast = i === product.sales.length - 1
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{
                          width: '100%', borderRadius: '4px 4px 0 0',
                          background: isLast ? catColor : `${catColor}40`,
                          height: `${(v / maxVal) * 64}px`,
                          minHeight: v > 0 ? 4 : 0,
                          transition: 'height 0.4s ease',
                        }} />
                        <span style={{ fontSize: 8, color: '#ccc', fontWeight: 600 }}>{MONTHS[i]}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Conversion funnel */}
              <div style={{ padding: 16, background: '#fafafa', borderRadius: 16, border: '1px solid #f0f0f0' }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: '#1a1a1a', marginBottom: 14 }}>Conversion Funnel</p>
                {([
                  { label: 'Views',       val: product.sold * 18, pct: 100, color: '#3b82f6' },
                  { label: 'Add to Cart', val: product.sold * 4,  pct: 22,  color: '#8b5cf6' },
                  { label: 'Checkout',    val: product.sold * 2,  pct: 11,  color: '#f59e0b' },
                  { label: 'Purchased',   val: product.sold,      pct: 6,   color: '#22c55e' },
                ] as const).map(({ label, val, pct, color }) => (
                  <div key={label} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: '#555', fontWeight: 600 }}>{label}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#1a1a1a' }}>
                        {val.toLocaleString()} <span style={{ color: '#aaa', fontWeight: 600 }}>({pct}%)</span>
                      </span>
                    </div>
                    <div style={{ height: 6, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   PRODUCT ROW
═══════════════════════════════════════════════════════ */

interface ProductRowProps {
  product: Product
  selected: boolean
  onSelect: (id: string) => void
  onView: (product: Product) => void
  idx: number
}

const ProductRow: FC<ProductRowProps> = ({ product, selected, onSelect, onView, idx }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const catColor = CAT_COLORS[product.category] ?? '#94a3b8'

  useEffect(() => {
    const handler = (e: Event) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const menuItems = [
    { icon: Eye,         label: 'View details',   fn: () => { onView(product); setMenuOpen(false) }, danger: false },
    { icon: Edit2,       label: 'Edit product',   fn: () => setMenuOpen(false), danger: false },
    { icon: Copy,        label: 'Duplicate',      fn: () => setMenuOpen(false), danger: false },
    { icon: ExternalLink,label: 'View in store',  fn: () => setMenuOpen(false), danger: false },
    { icon: Archive,     label: 'Archive',        fn: () => setMenuOpen(false), danger: true },
    { icon: Trash2,      label: 'Delete',         fn: () => setMenuOpen(false), danger: true },
  ]

  return (
    <div
      className="product-row group"
      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', borderBottom: '1px solid #f5f5f5', transition: 'background 0.1s', animationDelay: `${idx * 25}ms`, position: 'relative', background: selected ? 'rgba(228,15,42,0.02)' : 'white' }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = '#fafafa' }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'white' }}>

      {/* Category bar */}
      <div className="cat-bar" style={{ position: 'absolute', left: 0, top: 6, bottom: 6, width: 3, borderRadius: '0 2px 2px 0', background: catColor, opacity: 0, transition: 'opacity 0.15s' }} />

      {/* Checkbox */}
      <button
        onClick={() => onSelect(product.id)}
        style={{ width: 18, height: 18, borderRadius: 5, border: selected ? '2px solid #E40F2A' : '1px solid #ddd', background: selected ? '#E40F2A' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s' }}>
        {selected && <Check size={10} color="white" strokeWidth={3} />}
      </button>

      {/* Emoji + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: `${catColor}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
          {product.emoji}
        </div>
        <div style={{ minWidth: 0 }}>
          <button
            onClick={() => onView(product)}
            style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%', lineHeight: 1.3 }}
            onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.color = '#E40F2A')}
            onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.color = '#1a1a1a')}>
            {product.name}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
            <code style={{ fontSize: 10, color: '#bbb' }}>{product.sku}</code>
            <CategoryPill category={product.category} />
          </div>
        </div>
      </div>

      {/* Status */}
      <div style={{ minWidth: 96, flexShrink: 0 }}>
        <StatusBadge status={product.status} stock={product.stock} threshold={product.lowStockThreshold} />
      </div>

      {/* Stock */}
      <div style={{ minWidth: 110, flexShrink: 0 }}>
        <StockBar stock={product.stock} threshold={product.lowStockThreshold} />
      </div>

      {/* Price */}
      <div style={{ minWidth: 76, textAlign: 'right', flexShrink: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 900, color: '#1a1a1a' }}>{fmt(product.price)}</p>
        {product.comparePrice !== null && (
          <p style={{ fontSize: 10, color: '#bbb', textDecoration: 'line-through' }}>{fmt(product.comparePrice)}</p>
        )}
      </div>

      {/* Sparkline */}
      <div className="xl-show" style={{ minWidth: 110, display: 'none', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
        <Sparkline data={product.sales} color={catColor} width={80} height={28} />
        <p style={{ fontSize: 10, color: '#aaa', fontFamily: 'monospace' }}>{fmtK(product.revenue)}</p>
      </div>

      {/* Rating */}
      <div className="lg-show" style={{ minWidth: 80, flexShrink: 0, display: 'none' }}>
        <RatingStars rating={product.rating} size={10} />
        {product.reviews > 0 && <p style={{ fontSize: 10, color: '#bbb', marginTop: 2 }}>{product.reviews} reviews</p>}
      </div>

      {/* Actions */}
      <div className="row-actions" style={{ display: 'flex', gap: 4, flexShrink: 0, opacity: 0, transition: 'opacity 0.15s' }}>
        <button
          onClick={() => onView(product)}
          style={{ padding: '6px 10px', borderRadius: 9, background: '#1a1a1a', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: 'white' }}>
          <Eye size={11} />
        </button>
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            style={{ padding: '6px 8px', borderRadius: 9, background: '#f5f5f5', border: 'none', cursor: 'pointer', color: '#888', display: 'flex' }}>
            <MoreHorizontal size={13} />
          </button>
          {menuOpen && (
            <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 4px)', width: 172, background: 'white', border: '1px solid #eee', borderRadius: 16, boxShadow: '0 8px 30px rgba(0,0,0,0.1)', padding: '6px 0', zIndex: 30 }}>
              {menuItems.map(({ icon: Icon, label, fn, danger }) => (
                <button
                  key={label} onClick={fn}
                  style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '9px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: danger ? '#ef4444' : '#374151', textAlign: 'left' }}
                  onMouseEnter={e => (e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.06)' : '#f9fafb')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
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
   PRODUCT CARD
═══════════════════════════════════════════════════════ */

interface ProductCardProps {
  product: Product
  selected: boolean
  onSelect: (id: string) => void
  onView: (product: Product) => void
  idx: number
}

const ProductCard: FC<ProductCardProps> = ({ product, selected, onSelect, onView, idx }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const catColor = CAT_COLORS[product.category] ?? '#94a3b8'
  const margin = ((product.price - product.cost) / product.price * 100).toFixed(0)

  useEffect(() => {
    const handler = (e: Event) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const cardMenuItems = [
    { icon: Eye,     label: 'View',      fn: () => { onView(product); setMenuOpen(false) }, danger: false },
    { icon: Edit2,   label: 'Edit',      fn: () => setMenuOpen(false), danger: false },
    { icon: Copy,    label: 'Duplicate', fn: () => setMenuOpen(false), danger: false },
    { icon: Archive, label: 'Archive',   fn: () => setMenuOpen(false), danger: true },
  ]

  return (
    <div
      className="product-card group"
      style={{ background: 'white', border: selected ? '2px solid #E40F2A' : '1px solid #ebebeb', borderRadius: 20, overflow: 'hidden', transition: 'all 0.25s', cursor: 'default', animationDelay: `${idx * 40}ms`, position: 'relative' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = selected ? '#E40F2A' : '#ddd' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = selected ? '#E40F2A' : '#ebebeb' }}>

      {/* Top stripe */}
      <div style={{ height: 3, background: catColor }} />

      {/* Image area */}
      <div style={{ padding: '16px 16px 8px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <button
            onClick={() => onSelect(product.id)}
            style={{ width: 18, height: 18, borderRadius: 5, border: selected ? '2px solid #E40F2A' : '1px solid #ddd', background: selected ? '#E40F2A' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s', zIndex: 2 }}>
            {selected && <Check size={10} color="white" strokeWidth={3} />}
          </button>

          {/* Emoji */}
          <div style={{ width: 64, height: 64, borderRadius: 18, background: `${catColor}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, margin: '0 auto', position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 12 }}>
            {product.emoji}
          </div>

          {/* Menu */}
          <div style={{ position: 'relative', zIndex: 2 }} ref={menuRef}>
            <button
              className="card-menu-btn"
              onClick={() => setMenuOpen(v => !v)}
              style={{ padding: 5, borderRadius: 8, background: '#f5f5f5', border: 'none', cursor: 'pointer', color: '#bbb', display: 'flex', opacity: 0, transition: 'opacity 0.15s' }}>
              <MoreHorizontal size={13} />
            </button>
            {menuOpen && (
              <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 4px)', width: 160, background: 'white', border: '1px solid #eee', borderRadius: 14, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: '5px 0', zIndex: 30 }}>
                {cardMenuItems.map(({ icon: Icon, label, fn, danger }) => (
                  <button
                    key={label} onClick={fn}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: danger ? '#ef4444' : '#374151' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                    <Icon size={11} />{label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div style={{ height: 48 }} />
      </div>

      {/* Content */}
      <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <button
            onClick={() => onView(product)}
            style={{ fontSize: 13, fontWeight: 800, color: '#1a1a1a', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', lineHeight: 1.3, width: '100%' }}
            onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.color = '#E40F2A')}
            onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.color = '#1a1a1a')}>
            {product.name}
          </button>
          <p style={{ fontSize: 10, color: '#bbb', marginTop: 2, fontFamily: 'monospace' }}>{product.sku}</p>
        </div>

        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          <StatusBadge status={product.status} stock={product.stock} threshold={product.lowStockThreshold} />
          <CategoryPill category={product.category} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 900, color: '#1a1a1a', lineHeight: 1 }}>{fmt(product.price)}</p>
            {product.comparePrice !== null && (
              <p style={{ fontSize: 10, color: '#bbb', textDecoration: 'line-through' }}>{fmt(product.comparePrice)}</p>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: Number(margin) >= 50 ? '#22c55e' : '#f59e0b' }}>{margin}%</p>
            <p style={{ fontSize: 10, color: '#bbb' }}>margin</p>
          </div>
        </div>

        <StockBar stock={product.stock} threshold={product.lowStockThreshold} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#555' }}>{product.sold.toLocaleString()} sold</p>
            <p style={{ fontSize: 10, color: '#bbb' }}>{fmtK(product.revenue)} revenue</p>
          </div>
          <Sparkline data={product.sales} color={catColor} width={70} height={28} />
        </div>

        <div style={{ paddingTop: 6, borderTop: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <RatingStars rating={product.rating} size={11} />
          <span style={{ fontSize: 10, color: '#bbb' }}>{product.variants} var · {product.images} imgs</span>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS)
  const [view, setView] = useState<ViewMode>('list')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [sortField, setSortField] = useState<SortField>('revenue')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)

  const PER_PAGE = view === 'grid' ? 9 : 8

  useEffect(() => {
    document.body.style.overflow = selectedProduct ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedProduct])

  const handleStatusChange = (id: string, newStatus: ProductStatus) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p))
    setSelectedProduct(prev => prev?.id === id ? { ...prev, status: newStatus } : prev)
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    setSelectedIds(
      selectedIds.size === filtered.length
        ? new Set()
        : new Set(filtered.map(p => p.id))
    )
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const filtered = useMemo<Product[]>(() => {
    let list = products
    if (activeCategory !== 'All') list = list.filter(p => p.category === activeCategory)
    if (statusFilter !== 'all') {
      list = list.filter(p => {
        if (statusFilter === 'out') return p.stock === 0
        if (statusFilter === 'low') return p.stock > 0 && p.stock <= p.lowStockThreshold
        return p.status === statusFilter
      })
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      )
    }
    return [...list].sort((a, b) => {
      const av: string | number = sortField === 'name' ? a.name : (a[sortField] ?? 0)
      const bv: string | number = sortField === 'name' ? b.name : (b[sortField] ?? 0)
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
    })
  }, [products, activeCategory, statusFilter, search, sortField, sortDir])

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  const counts = useMemo(() => ({
    total:        products.length,
    active:       products.filter(p => p.status === 'active').length,
    draft:        products.filter(p => p.status === 'draft').length,
    archived:     products.filter(p => p.status === 'archived').length,
    outOfStock:   products.filter(p => p.stock === 0).length,
    lowStock:     products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length,
    totalRevenue: products.reduce((s, p) => s + p.revenue, 0),
    totalSold:    products.reduce((s, p) => s + p.sold, 0),
  }), [products])

  const SortIcon: FC<{ field: SortField }> = ({ field }) => {
    if (sortField !== field) return <ArrowUp size={9} style={{ color: '#ccc' }} />
    return sortDir === 'asc'
      ? <ArrowUp   size={9} style={{ color: '#E40F2A' }} />
      : <ArrowDown size={9} style={{ color: '#E40F2A' }} />
  }

  const statCards: StatCard[] = [
    { label: 'Total Products', val: counts.total,                    icon: Package,      color: '#64748b', bg: '#f1f5f9',                   spark: [8,8,9,9,9,10,10,10,10,10,10,counts.total] },
    { label: 'Total Revenue',  val: fmtK(counts.totalRevenue),       icon: DollarSign,   color: '#22c55e', bg: 'rgba(34,197,94,0.1)',        spark: [60,72,68,82,78,90,85,98,92,108,102,115] },
    { label: 'Units Sold',     val: counts.totalSold.toLocaleString(), icon: ShoppingCart, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',       spark: [420,510,480,570,540,630,590,680,640,740,700,790] },
    { label: 'Active',         val: counts.active,                   icon: CheckCircle2, color: '#22c55e', bg: 'rgba(34,197,94,0.08)',       spark: [7,7,8,8,8,9,8,9,9,9,9,counts.active] },
    { label: 'Out of Stock',   val: counts.outOfStock,               icon: AlertCircle,  color: '#ef4444', bg: 'rgba(239,68,68,0.08)',       spark: [3,2,3,2,3,1,2,3,2,2,1,counts.outOfStock] },
    { label: 'Low Stock',      val: counts.lowStock,                 icon: TrendingDown, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',      spark: [2,3,2,4,3,2,4,3,3,2,3,counts.lowStock] },
  ]

  const bulkActions = [
    { icon: Globe,    label: 'Publish',   color: '#22c55e' },
    { icon: EyeOff,   label: 'Unpublish', color: '#94a3b8' },
    { icon: Tag,      label: 'Add Tags',  color: '#3b82f6' },
    { icon: Download, label: 'Export',    color: '#555' },
    { icon: Archive,  label: 'Archive',   color: '#ef4444' },
    { icon: Trash2,   label: 'Delete',    color: '#ef4444' },
  ] as { icon: LucideIcon; label: string; color: string }[]

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: '#f7f7f7', minHeight: '100vh' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
        .product-row  { animation: fadeUp 0.2s  ease both; }
        .product-card { animation: fadeUp 0.25s ease both; }
        .group:hover .row-actions   { opacity: 1 !important; }
        .group:hover .cat-bar       { opacity: 1 !important; }
        .group:hover .card-menu-btn { opacity: 1 !important; }
        @media (min-width: 1024px) { .lg-show { display: block !important; } }
        @media (min-width: 1280px) { .xl-show { display: flex  !important; } }
        ::-webkit-scrollbar       { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 99px; }
      `}</style>

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '28px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── HEADER ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: '#E40F2A', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(228,15,42,0.3)' }}>
                <Package size={16} color="white" />
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.6px', margin: 0 }}>Products</h1>
              <span style={{ padding: '3px 10px', background: '#f0f0f0', borderRadius: 8, fontSize: 12, fontWeight: 700, color: '#888' }}>{filtered.length}</span>
            </div>
            <p style={{ fontSize: 13, color: '#aaa', margin: 0, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ color: '#22c55e', fontWeight: 700 }}>{counts.active} active</span>
              {counts.draft > 0 && <span style={{ color: '#94a3b8', fontWeight: 700 }}>{counts.draft} draft</span>}
              {counts.outOfStock > 0 && <span style={{ color: '#ef4444', fontWeight: 700 }}>{counts.outOfStock} out of stock</span>}
              {counts.lowStock > 0 && <span style={{ color: '#f59e0b', fontWeight: 700 }}>{counts.lowStock} low stock</span>}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { icon: Upload,   label: 'Import' },
              { icon: Download, label: 'Export' },
            ].map(({ icon: Icon, label }) => (
              <button key={label} style={{ padding: '9px 16px', borderRadius: 12, background: 'white', border: '1px solid #eee', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#555', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <Icon size={13} style={{ color: '#aaa' }} /> {label}
              </button>
            ))}
            <button
              style={{ padding: '9px 18px', borderRadius: 12, background: '#E40F2A', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 14px rgba(228,15,42,0.28)' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#c40d24')}
              onMouseLeave={e => (e.currentTarget.style.background = '#E40F2A')}>
              <Plus size={13} /> Add Product
            </button>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: 12 }}>
          {statCards.map(({ label, val, icon: Icon, color, bg, spark }) => (
            <div
              key={label}
              style={{ background: 'white', border: '1px solid #ebebeb', borderRadius: 18, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'all 0.2s', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={15} style={{ color }} />
                </div>
                <MiniBarChart values={spark} color={color} />
              </div>
              <div>
                <p style={{ fontSize: 22, fontWeight: 900, color: '#1a1a1a', lineHeight: 1, marginBottom: 3 }}>{val}</p>
                <p style={{ fontSize: 11, color: '#bbb', fontWeight: 600 }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── CATEGORY TABS ── */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 2 }}>
          {CATEGORIES.map(cat => {
            const active = activeCategory === cat
            const color = CAT_COLORS[cat]
            const count = cat === 'All' ? products.length : products.filter(p => p.category === cat).length
            return (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setPage(1) }}
                style={{
                  padding: '8px 16px', borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  whiteSpace: 'nowrap', transition: 'all 0.15s', flexShrink: 0,
                  display: 'flex', alignItems: 'center', gap: 7,
                  border: active ? `1px solid ${(color ?? '#1a1a1a')}40` : '1px solid #eee',
                  background: active ? (color ?? '#1a1a1a') : 'white',
                  color: active ? 'white' : '#777',
                  boxShadow: active ? `0 3px 10px ${(color ?? '#1a1a1a')}30` : 'none',
                }}>
                {cat}
                <span style={{ fontSize: 10, background: active ? 'rgba(255,255,255,0.25)' : '#f0f0f0', color: active ? 'white' : '#aaa', padding: '1px 7px', borderRadius: 99, fontWeight: 800 }}>{count}</span>
              </button>
            )
          })}
        </div>

        {/* ── TOOLBAR ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 300 }}>
            <Search size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#bbb', pointerEvents: 'none' }} />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search products, SKUs…"
              style={{ width: '100%', paddingLeft: 38, paddingRight: search ? 34 : 16, paddingTop: 10, paddingBottom: 10, background: 'white', border: '1px solid #eee', borderRadius: 12, fontSize: 13, color: '#1a1a1a', outline: 'none', boxSizing: 'border-box', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
              onFocus={e => (e.target.style.borderColor = '#E40F2A')}
              onBlur={e  => (e.target.style.borderColor = '#eee')}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', display: 'flex' }}>
                <X size={13} />
              </button>
            )}
          </div>

          {/* Status filters */}
          <div style={{ display: 'flex', gap: 4 }}>
            {STATUS_FILTERS.map(({ val, label }) => (
              <button
                key={val}
                onClick={() => { setStatusFilter(val); setPage(1) }}
                style={{
                  padding: '7px 12px', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
                  border: '1px solid', borderColor: statusFilter === val ? 'rgba(26,26,26,0.25)' : '#eee',
                  background: statusFilter === val ? '#1a1a1a' : 'white',
                  color: statusFilter === val ? 'white' : '#888',
                }}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ flex: 1 }} />

          {/* Sort */}
          <select
            value={`${sortField}-${sortDir}`}
            onChange={e => {
              const [f, d] = e.target.value.split('-') as [SortField, SortDir]
              setSortField(f); setSortDir(d)
            }}
            style={{ padding: '9px 14px', background: 'white', border: '1px solid #eee', borderRadius: 12, fontSize: 12, color: '#555', outline: 'none', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* View toggle */}
          <div style={{ display: 'flex', border: '1px solid #eee', borderRadius: 12, overflow: 'hidden', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            {([['list', List], ['grid', LayoutGrid]] as [ViewMode, LucideIcon][]).map(([v, Icon]) => (
              <button
                key={v}
                onClick={() => { setView(v); setPage(1) }}
                style={{ padding: '9px 13px', border: 'none', cursor: 'pointer', transition: 'all 0.15s', background: view === v ? '#1a1a1a' : 'transparent', color: view === v ? 'white' : '#bbb', display: 'flex', alignItems: 'center' }}>
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>

        {/* ── BULK ACTION BAR ── */}
        {selectedIds.size > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: 'rgba(228,15,42,0.04)', border: '1px solid rgba(228,15,42,0.15)', borderRadius: 14, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#E40F2A' }}>{selectedIds.size} selected</span>
            <div style={{ width: 1, height: 16, background: 'rgba(228,15,42,0.2)' }} />
            {bulkActions.map(({ icon: Icon, label, color }) => (
              <button
                key={label}
                style={{ padding: '6px 12px', borderRadius: 9, background: 'white', border: '1px solid #eee', cursor: 'pointer', fontSize: 11, fontWeight: 700, color, display: 'flex', alignItems: 'center', gap: 5 }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
                onMouseLeave={e => (e.currentTarget.style.background = 'white')}>
                <Icon size={11} />{label}
              </button>
            ))}
            <button
              onClick={() => setSelectedIds(new Set())}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: 11, fontWeight: 600, padding: '5px 8px', borderRadius: 8 }}>
              Clear
            </button>
          </div>
        )}

        {/* ── PRODUCT TABLE / GRID ── */}
        {view === 'list' ? (
          <div style={{ background: 'white', border: '1px solid #ebebeb', borderRadius: 20, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            {/* Table header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '11px 20px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
              <button
                onClick={toggleAll}
                style={{ width: 18, height: 18, borderRadius: 5, border: selectedIds.size === filtered.length && filtered.length > 0 ? '2px solid #E40F2A' : '1px solid #ddd', background: selectedIds.size === filtered.length && filtered.length > 0 ? '#E40F2A' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                {selectedIds.size === filtered.length && filtered.length > 0 && <Check size={10} color="white" strokeWidth={3} />}
              </button>
              <span style={{ flex: 1, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bbb' }}>Product</span>
              <span style={{ minWidth: 96,  fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bbb' }}>Status</span>
              <span style={{ minWidth: 110, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bbb' }}>Stock</span>
              <button
                onClick={() => handleSort('price')}
                style={{ minWidth: 76, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bbb', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                Price <SortIcon field="price" />
              </button>
              <span className="xl-show" style={{ minWidth: 110, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bbb', textAlign: 'right', display: 'none' }}>Sales</span>
              <span className="lg-show" style={{ minWidth: 80,  fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bbb', display: 'none' }}>Rating</span>
              <span style={{ minWidth: 64 }} />
            </div>

            {paginated.length === 0 ? (
              <div style={{ padding: '64px 20px', textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, background: '#f5f5f5', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <Package size={22} style={{ color: '#ccc' }} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: '#1a1a1a', marginBottom: 6 }}>No products found</h3>
                <p style={{ fontSize: 13, color: '#aaa' }}>{search ? `No results for "${search}"` : 'Try adjusting your filters.'}</p>
              </div>
            ) : (
              paginated.map((product, i) => (
                <div key={product.id} className="product-row" style={{ animationDelay: `${i * 25}ms` }}>
                  <ProductRow
                    product={product}
                    selected={selectedIds.has(product.id)}
                    onSelect={toggleSelect}
                    onView={setSelectedProduct}
                    idx={i}
                  />
                </div>
              ))
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {paginated.map((product, i) => (
              <div key={product.id} className="product-card" style={{ animationDelay: `${i * 35}ms` }}>
                <ProductCard
                  product={product}
                  selected={selectedIds.has(product.id)}
                  onSelect={toggleSelect}
                  onView={setSelectedProduct}
                  idx={i}
                />
              </div>
            ))}
          </div>
        )}

        {/* ── PAGINATION ── */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
            <span style={{ fontSize: 12, color: '#aaa' }}>
              Showing {((page - 1) * PER_PAGE) + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} products
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ padding: '7px 12px', borderRadius: 10, background: page === 1 ? '#f5f5f5' : 'white', border: '1px solid #eee', cursor: page === 1 ? 'default' : 'pointer', color: page === 1 ? '#ccc' : '#555', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <ChevronLeft size={13} /> Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p} onClick={() => setPage(p)}
                  style={{ width: 34, height: 34, borderRadius: 10, border: p === page ? '2px solid #E40F2A' : '1px solid #eee', background: p === page ? '#E40F2A' : 'white', cursor: 'pointer', fontSize: 12, fontWeight: 800, color: p === page ? 'white' : '#555' }}>
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                style={{ padding: '7px 12px', borderRadius: 10, background: page === totalPages ? '#f5f5f5' : 'white', border: '1px solid #eee', cursor: page === totalPages ? 'default' : 'pointer', color: page === totalPages ? '#ccc' : '#555', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                Next <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── DETAIL PANEL ── */}
      {selectedProduct && (
        <ProductPanel
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}