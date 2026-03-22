'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import {
  Package, Search, Plus, Download, Upload, MoreHorizontal,
  X, Check, AlertTriangle, TrendingDown, TrendingUp,
  RefreshCw, Filter, ArrowUp, ArrowDown, ChevronLeft,
  ChevronRight, Edit2, Trash2, Archive, Eye, History,
  Warehouse, BarChart3, Truck, RotateCcw, Bell, BellOff,
  ChevronDown, SlidersHorizontal, Boxes, ShieldAlert,
  CircleDot, Minus, ArrowUpRight, ArrowDownRight,
  ClipboardList, Zap, Hash, Tag, Move,
  LucideIcon,
} from 'lucide-react'

import { Badge }          from '@/components/ui/badge'
import { Button }         from '@/components/ui/button'
import { Input }          from '@/components/ui/input'
import { Progress }       from '@/components/ui/progress'
import { Separator }      from '@/components/ui/separator'
import { ScrollArea }     from '@/components/ui/scroll-area'
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet'
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from '@/components/ui/tooltip'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

/* ═══════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════ */

type StockStatus  = 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock'
type MovementType = 'in' | 'out' | 'adjustment' | 'transfer' | 'return'
type SortField    = 'name' | 'sku' | 'stock' | 'value' | 'sold30d' | 'reorderAt'
type SortDir      = 'asc' | 'desc'
type CategoryKey  = 'All' | 'Audio' | 'Peripherals' | 'Displays' | 'Accessories' | 'Networking' | 'Storage' | 'Lighting'

interface StockMovement {
  id: string
  type: MovementType
  qty: number
  note: string
  date: string
  by: string
}

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  emoji: string
  stock: number
  reserved: number
  reorderAt: number
  reorderQty: number
  maxStock: number
  cost: number
  value: number
  warehouse: string
  location: string
  sold30d: number
  velocity: number          // units/day avg
  daysRemaining: number
  lastMovement: string
  supplier: string
  barcode: string
  alertEnabled: boolean
  movements: StockMovement[]
}

interface StatCardData {
  label: string
  value: string | number
  sub: string
  icon: LucideIcon
  trend: number | null
  accent: string
}

/* ═══════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════ */

const CATEGORIES: CategoryKey[] = [
  'All', 'Audio', 'Peripherals', 'Displays',
  'Accessories', 'Networking', 'Storage', 'Lighting',
]

const CAT_COLOR: Record<string, string> = {
  Audio: 'hsl(258 90% 66%)', Peripherals: 'hsl(217 91% 60%)',
  Displays: 'hsl(189 94% 43%)', Accessories: 'hsl(43 96% 56%)',
  Networking: 'hsl(142 71% 45%)', Storage: 'hsl(0 84% 60%)',
  Lighting: 'hsl(25 95% 53%)', Uncategorized: 'hsl(215 16% 47%)',
}

const STOCK_STATUS: Record<StockStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; dot: string }> = {
  in_stock:    { label: 'In Stock',    variant: 'default',     dot: 'bg-green-500' },
  low_stock:   { label: 'Low Stock',   variant: 'outline',     dot: 'bg-amber-500' },
  out_of_stock:{ label: 'Out of Stock',variant: 'destructive', dot: 'bg-destructive' },
  overstock:   { label: 'Overstock',   variant: 'secondary',   dot: 'bg-blue-500' },
}

const MOVEMENT_META: Record<MovementType, { label: string; icon: LucideIcon; color: string }> = {
  in:         { label: 'Stock In',    icon: ArrowUpRight,   color: 'text-green-600' },
  out:        { label: 'Stock Out',   icon: ArrowDownRight, color: 'text-destructive' },
  adjustment: { label: 'Adjustment',  icon: Edit2,          color: 'text-amber-600' },
  transfer:   { label: 'Transfer',    icon: Move,           color: 'text-blue-600' },
  return:     { label: 'Return',      icon: RotateCcw,      color: 'text-purple-600' },
}

const WAREHOUSES = ['All Warehouses', 'Hanoi WH-1', 'HCMC WH-2', 'Da Nang WH-3']

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */

const INVENTORY: InventoryItem[] = [
  {
    id: 'INV-001', name: 'Wireless Noise-Cancelling Headphones Pro', sku: 'WNC-PRO-BLK',
    category: 'Audio', emoji: '🎧', stock: 142, reserved: 12, reorderAt: 30, reorderQty: 100,
    maxStock: 300, cost: 82, value: 11644, warehouse: 'Hanoi WH-1', location: 'A-12-3',
    sold30d: 74, velocity: 2.5, daysRemaining: 57, lastMovement: '2h ago',
    supplier: 'SoundCore Ltd.', barcode: '4719512001842', alertEnabled: true,
    movements: [
      { id: 'm1', type: 'in',  qty: 100, note: 'PO-4821 received',    date: 'Mar 20', by: 'Admin' },
      { id: 'm2', type: 'out', qty: 28,  note: 'Orders fulfillment',  date: 'Mar 21', by: 'System' },
      { id: 'm3', type: 'out', qty: 14,  note: 'Orders fulfillment',  date: 'Mar 22', by: 'System' },
    ],
  },
  {
    id: 'INV-002', name: 'Mechanical Keyboard TKL RGB', sku: 'MK-TKL-WHT',
    category: 'Peripherals', emoji: '⌨️', stock: 87, reserved: 8, reorderAt: 20, reorderQty: 80,
    maxStock: 200, cost: 58, value: 5046, warehouse: 'Hanoi WH-1', location: 'B-04-1',
    sold30d: 42, velocity: 1.4, daysRemaining: 62, lastMovement: '5h ago',
    supplier: 'KeyCraft Co.', barcode: '4719512002819', alertEnabled: true,
    movements: [
      { id: 'm4', type: 'in',         qty: 80,  note: 'PO-4798 received',   date: 'Mar 15', by: 'Admin' },
      { id: 'm5', type: 'adjustment', qty: -3,   note: 'Damage write-off',   date: 'Mar 18', by: 'Warehouse' },
      { id: 'm6', type: 'out',        qty: 25,  note: 'Orders fulfillment',  date: 'Mar 21', by: 'System' },
    ],
  },
  {
    id: 'INV-003', name: 'Gaming Monitor 27" IPS 144Hz', sku: 'GM-27-144',
    category: 'Displays', emoji: '🖥️', stock: 28, reserved: 4, reorderAt: 15, reorderQty: 30,
    maxStock: 80, cost: 198, value: 5544, warehouse: 'HCMC WH-2', location: 'C-01-2',
    sold30d: 25, velocity: 0.8, daysRemaining: 35, lastMovement: '1d ago',
    supplier: 'ViewTech Inc.', barcode: '4719512003846', alertEnabled: true,
    movements: [
      { id: 'm7', type: 'in',  qty: 30, note: 'PO-4810 received',   date: 'Mar 10', by: 'Admin' },
      { id: 'm8', type: 'out', qty: 12, note: 'Orders fulfillment', date: 'Mar 18', by: 'System' },
      { id: 'm9', type: 'out', qty: 8,  note: 'Orders fulfillment', date: 'Mar 21', by: 'System' },
    ],
  },
  {
    id: 'INV-004', name: 'USB-C Hub 7-in-1 Slim', sku: 'USB-HUB-7C',
    category: 'Accessories', emoji: '🔌', stock: 8, reserved: 3, reorderAt: 25, reorderQty: 150,
    maxStock: 400, cost: 14, value: 112, warehouse: 'Hanoi WH-1', location: 'A-08-5',
    sold30d: 118, velocity: 3.9, daysRemaining: 2, lastMovement: '30m ago',
    supplier: 'ConnectPro', barcode: '4719512004873', alertEnabled: true,
    movements: [
      { id: 'm10', type: 'in',      qty: 150, note: 'PO-4830 received',  date: 'Mar 5',  by: 'Admin' },
      { id: 'm11', type: 'out',     qty: 88,  note: 'Orders fulfillment',date: 'Mar 15', by: 'System' },
      { id: 'm12', type: 'out',     qty: 62,  note: 'Orders fulfillment',date: 'Mar 21', by: 'System' },
      { id: 'm13', type: 'return',  qty: 8,   note: 'Customer return',   date: 'Mar 22', by: 'System' },
    ],
  },
  {
    id: 'INV-005', name: 'Logitech MX Master 3S Mouse', sku: 'MX-M3S-GRY',
    category: 'Peripherals', emoji: '🖱️', stock: 54, reserved: 6, reorderAt: 20, reorderQty: 60,
    maxStock: 150, cost: 44, value: 2376, warehouse: 'Hanoi WH-1', location: 'B-07-2',
    sold30d: 38, velocity: 1.3, daysRemaining: 42, lastMovement: '3h ago',
    supplier: 'Logitech SEA', barcode: '5099206097087', alertEnabled: false,
    movements: [
      { id: 'm14', type: 'in',  qty: 60, note: 'PO-4815 received',   date: 'Mar 12', by: 'Admin' },
      { id: 'm15', type: 'out', qty: 22, note: 'Orders fulfillment', date: 'Mar 19', by: 'System' },
    ],
  },
  {
    id: 'INV-006', name: 'Smart LED Strip 5m RGBIC', sku: 'LED-5M-RGB',
    category: 'Lighting', emoji: '💡', stock: 0, reserved: 0, reorderAt: 30, reorderQty: 200,
    maxStock: 500, cost: 28, value: 0, warehouse: 'HCMC WH-2', location: 'D-03-1',
    sold30d: 88, velocity: 2.9, daysRemaining: 0, lastMovement: '2d ago',
    supplier: 'GlowTech VN', barcode: '4719512005900', alertEnabled: true,
    movements: [
      { id: 'm16', type: 'in',  qty: 200, note: 'PO-4780 received',  date: 'Feb 28', by: 'Admin' },
      { id: 'm17', type: 'out', qty: 200, note: 'Orders fulfillment',date: 'Mar 20', by: 'System' },
    ],
  },
  {
    id: 'INV-007', name: '4K Webcam 60fps AutoFocus', sku: 'CAM-4K-60',
    category: 'Peripherals', emoji: '📷', stock: 45, reserved: 0, reorderAt: 15, reorderQty: 50,
    maxStock: 120, cost: 68, value: 3060, warehouse: 'Da Nang WH-3', location: 'A-02-4',
    sold30d: 0, velocity: 0, daysRemaining: 999, lastMovement: '7d ago',
    supplier: 'OptiCam Ltd.', barcode: '4719512006927', alertEnabled: false,
    movements: [
      { id: 'm18', type: 'in', qty: 45, note: 'Initial stock',     date: 'Mar 15', by: 'Admin' },
    ],
  },
  {
    id: 'INV-008', name: 'Portable SSD 1TB USB 3.2', sku: 'SSD-1TB-BLK',
    category: 'Storage', emoji: '💾', stock: 63, reserved: 7, reorderAt: 25, reorderQty: 80,
    maxStock: 200, cost: 52, value: 3276, warehouse: 'Hanoi WH-1', location: 'C-05-3',
    sold30d: 48, velocity: 1.6, daysRemaining: 39, lastMovement: '4h ago',
    supplier: 'SpeedDrive Co.', barcode: '4719512007954', alertEnabled: true,
    movements: [
      { id: 'm19', type: 'in',      qty: 80,  note: 'PO-4820 received',  date: 'Mar 14', by: 'Admin' },
      { id: 'm20', type: 'out',     qty: 35,  note: 'Orders fulfillment',date: 'Mar 20', by: 'System' },
      { id: 'm21', type: 'transfer',qty: 20,  note: 'To HCMC WH-2',      date: 'Mar 21', by: 'Warehouse' },
    ],
  },
  {
    id: 'INV-009', name: 'WiFi 6 Router AX3000', sku: 'RT-AX3000',
    category: 'Networking', emoji: '📡', stock: 19, reserved: 2, reorderAt: 15, reorderQty: 40,
    maxStock: 100, cost: 78, value: 1482, warehouse: 'HCMC WH-2', location: 'B-09-1',
    sold30d: 20, velocity: 0.7, daysRemaining: 27, lastMovement: '6h ago',
    supplier: 'NetCore Asia', barcode: '4719512008981', alertEnabled: true,
    movements: [
      { id: 'm22', type: 'in',  qty: 40, note: 'PO-4801 received',   date: 'Mar 8',  by: 'Admin' },
      { id: 'm23', type: 'out', qty: 18, note: 'Orders fulfillment', date: 'Mar 18', by: 'System' },
    ],
  },
  {
    id: 'INV-010', name: 'MacBook Stand Aluminum Adjustable', sku: 'MBP-STAND-SLV',
    category: 'Accessories', emoji: '💻', stock: 12, reserved: 1, reorderAt: 15, reorderQty: 60,
    maxStock: 150, cost: 18, value: 216, warehouse: 'Hanoi WH-1', location: 'A-15-2',
    sold30d: 22, velocity: 0.7, daysRemaining: 17, lastMovement: '1d ago',
    supplier: 'DeskMate VN', barcode: '4719512009108', alertEnabled: true,
    movements: [
      { id: 'm24', type: 'in',  qty: 60, note: 'PO-4765 received',   date: 'Feb 20', by: 'Admin' },
      { id: 'm25', type: 'out', qty: 48, note: 'Orders fulfillment', date: 'Mar 15', by: 'System' },
    ],
  },
]

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */

const fmt  = (n: number): string => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const fmtK = (n: number): string => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`

function getStockStatus(item: InventoryItem): StockStatus {
  if (item.stock === 0)               return 'out_of_stock'
  if (item.stock <= item.reorderAt)   return 'low_stock'
  if (item.stock >= item.maxStock * 0.9) return 'overstock'
  return 'in_stock'
}

function getStockPct(item: InventoryItem): number {
  return Math.min((item.stock / item.maxStock) * 100, 100)
}

/* ═══════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════ */

// Stock progress bar using shadcn Progress + colour override
interface StockProgressProps { item: InventoryItem }

function StockProgress({ item }: StockProgressProps) {
  const status = getStockStatus(item)
  const pct    = getStockPct(item)
  const color  =
    status === 'out_of_stock' ? 'bg-destructive' :
    status === 'low_stock'    ? 'bg-amber-500'   :
    status === 'overstock'    ? 'bg-blue-500'     :
    'bg-green-500'

  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{
        color: status === 'out_of_stock' ? 'var(--destructive)' :
               status === 'low_stock'    ? '#d97706' :
               status === 'overstock'    ? '#2563eb' : '#16a34a',
        minWidth: 28, textAlign: 'right',
      }}>
        {item.stock}
      </span>
    </div>
  )
}

// Mini sparkline (pure SVG, no dep)
interface MiniSparkProps { vals: number[]; color: string; w?: number; h?: number }

function MiniSpark({ vals, color, w = 60, h = 24 }: MiniSparkProps) {
  if (vals.every(v => v === 0)) return <span className="text-[10px] text-muted-foreground">—</span>
  const max = Math.max(...vals, 1)
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * (w - 4) + 2
    const y = h - 2 - ((v / max) * (h - 6))
    return `${x},${y}`
  })
  const last = pts[pts.length - 1].split(',')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <path d={`M${pts.join('L')}L${w - 2},${h}L2,${h}Z`} fill={color} fillOpacity={0.12} />
      <path d={`M${pts.join('L')}`} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r={2.5} fill={color} />
    </svg>
  )
}

// Velocity badge
function VelocityBadge({ v }: { v: number }) {
  if (v === 0) return <span className="text-xs text-muted-foreground">—</span>
  const color = v >= 3 ? 'text-destructive' : v >= 1.5 ? 'text-amber-600' : 'text-green-600'
  return (
    <span className={`text-xs font-bold ${color}`}>
      {v.toFixed(1)}<span className="font-normal text-muted-foreground">/day</span>
    </span>
  )
}

// Days remaining pill
function DaysPill({ days }: { days: number }) {
  if (days >= 999) return <span className="text-xs text-muted-foreground">∞</span>
  const urgent = days <= 7
  const warn   = days <= 21
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
      urgent ? 'bg-destructive/10 text-destructive' :
      warn   ? 'bg-amber-500/10 text-amber-600'     :
               'bg-green-500/10 text-green-700'
    }`}>
      {days}d
    </span>
  )
}

/* ═══════════════════════════════════════════════════════
   ADJUST STOCK SHEET
═══════════════════════════════════════════════════════ */

interface AdjustSheetProps {
  item: InventoryItem | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onSave: (id: string, delta: number, type: MovementType, note: string) => void
}

function AdjustSheet({ item, open, onOpenChange, onSave }: AdjustSheetProps) {
  const [type, setType]   = useState<MovementType>('in')
  const [qty,  setQty]    = useState('')
  const [note, setNote]   = useState('')

  if (!item) return null

  const catColor = CAT_COLOR[item.category] ?? 'var(--primary)'
  const delta = type === 'out' || type === 'transfer' ? -Math.abs(Number(qty)) : Math.abs(Number(qty))
  const preview = item.stock + delta
  const valid = Number(qty) > 0 && (type !== 'out' || preview >= 0)

  function handleSave() {
    if (!valid) return
    // onSave(item.id, delta, type, note || `Manual ${type}`)
    setQty(''); setNote(''); onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[460px] p-0 flex flex-col gap-0">
        {/* Accent strip */}
        <div className="h-1 w-full flex-shrink-0" style={{ background: catColor }} />

        <SheetHeader className="px-6 py-5 border-b border-border">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: `color-mix(in srgb, ${catColor} 12%, transparent)` }}>
              {item.emoji}
            </div>
            <div className="min-w-0">
              <SheetTitle className="text-[15px] font-black leading-tight">{item.name}</SheetTitle>
              <p className="text-xs text-muted-foreground mt-1 font-mono">{item.sku} · {item.warehouse}</p>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="px-6 py-5 flex flex-col gap-5">

            {/* Current stock overview */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'On Hand',   val: item.stock,    accent: catColor },
                { label: 'Reserved',  val: item.reserved, accent: '#888' },
                { label: 'Available', val: item.stock - item.reserved, accent: catColor },
              ].map(({ label, val, accent }) => (
                <div key={label} className="rounded-xl p-3 bg-secondary/50 border border-border">
                  <p className="text-[10px] text-muted-foreground font-semibold mb-1">{label}</p>
                  <p className="text-xl font-black" style={{ color: accent }}>{val}</p>
                </div>
              ))}
            </div>

            {/* Movement type */}
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Movement Type</p>
              <div className="grid grid-cols-3 gap-2">
                {(['in','out','adjustment','return','transfer'] as MovementType[]).map(t => {
                  const m = MOVEMENT_META[t]
                  const Icon = m.icon
                  const active = type === t
                  return (
                    <button key={t} onClick={() => setType(t)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-bold transition-all ${active ? 'border-primary bg-primary/8 text-primary' : 'border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground'}`}>
                      <Icon size={14} className={active ? 'text-primary' : ''} />
                      {m.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Quantity</p>
              <Input
                type="number" min={1} placeholder="0"
                value={qty}
                onChange={e => setQty(e.target.value)}
                className="text-xl font-black h-12"
              />
              {qty && (
                <div className="flex items-center justify-between mt-2 px-1">
                  <span className="text-xs text-muted-foreground">New stock level</span>
                  <span className={`text-sm font-black ${preview < 0 ? 'text-destructive' : 'text-foreground'}`}>
                    {item.stock} → <span style={{ color: preview < 0 ? 'var(--destructive)' : catColor }}>{preview}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Note */}
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Note (optional)</p>
              <Input
                placeholder="e.g. PO-5001 received, damage write-off…"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>

            {/* Movement history */}
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Recent Movements</p>
              <div className="flex flex-col gap-2">
                {item.movements.slice(-4).reverse().map(mv => {
                  const m = MOVEMENT_META[mv.type]
                  const Icon = m.icon
                  const positive = mv.type === 'in' || mv.type === 'return'
                  return (
                    <div key={mv.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${positive ? 'bg-green-500/10' : mv.type === 'adjustment' ? 'bg-amber-500/10' : mv.type === 'transfer' ? 'bg-blue-500/10' : 'bg-destructive/10'}`}>
                        <Icon size={12} className={m.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{mv.note}</p>
                        <p className="text-[10px] text-muted-foreground">{mv.date} · {mv.by}</p>
                      </div>
                      <span className={`text-xs font-black flex-shrink-0 ${positive ? 'text-green-600' : 'text-destructive'}`}>
                        {positive ? '+' : ''}{mv.qty}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex gap-3 flex-shrink-0">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            className="flex-1 font-bold"
            disabled={!valid}
            onClick={handleSave}
            style={{ background: valid ? 'var(--primary)' : undefined }}>
            <Zap size={14} className="mr-1.5" />
            Apply Adjustment
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */

export default function InventoryPage() {
  const [items, setItems]               = useState<InventoryItem[]>(INVENTORY)
  const [search, setSearch]             = useState('')
  const [category, setCategory]         = useState<CategoryKey>('All')
  const [statusFilter, setStatusFilter] = useState<StockStatus | 'all'>('all')
  const [warehouse, setWarehouse]       = useState('All Warehouses')
  const [sortField, setSortField]       = useState<SortField>('stock')
  const [sortDir, setSortDir]           = useState<SortDir>('asc')
  const [selectedIds, setSelectedIds]   = useState<Set<string>>(new Set())
  const [adjustItem, setAdjustItem]     = useState<InventoryItem | null>(null)
  const [adjustOpen, setAdjustOpen]     = useState(false)
  const [page, setPage]                 = useState(1)
  const PER_PAGE = 8

  // Apply stock adjustment
  function handleAdjust(id: string, delta: number, type: MovementType, note: string) {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item
      const newStock = Math.max(0, item.stock + delta)
      return {
        ...item,
        stock: newStock,
        value: newStock * item.cost,
        lastMovement: 'Just now',
        movements: [
          ...item.movements,
          { id: `m-${Date.now()}`, type, qty: Math.abs(delta), note, date: 'Today', by: 'Admin' },
        ],
      }
    }))
  }

  function openAdjust(item: InventoryItem) {
    setAdjustItem(item)
    setAdjustOpen(true)
  }

  const toggleSelect  = (id: string) => setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const toggleAll     = () => setSelectedIds(selectedIds.size === filtered.length ? new Set() : new Set(filtered.map(i => i.id)))
  const handleSort    = (f: SortField) => { if (sortField === f) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortField(f); setSortDir('asc') } }

  const filtered = useMemo<InventoryItem[]>(() => {
    let list = items
    if (category !== 'All')          list = list.filter(i => i.category === category)
    if (warehouse !== 'All Warehouses') list = list.filter(i => i.warehouse === warehouse)
    if (statusFilter !== 'all')      list = list.filter(i => getStockStatus(i) === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(i => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q) || i.supplier.toLowerCase().includes(q))
    }
    return [...list].sort((a, b) => {
      const av = a[sortField] as number | string
      const bv = b[sortField] as number | string
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
    })
  }, [items, category, warehouse, statusFilter, search, sortField, sortDir])

  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  const stats = useMemo(() => ({
    totalSKUs:    items.length,
    totalValue:   items.reduce((s, i) => s + i.value, 0),
    outOfStock:   items.filter(i => i.stock === 0).length,
    lowStock:     items.filter(i => i.stock > 0 && i.stock <= i.reorderAt).length,
    totalUnits:   items.reduce((s, i) => s + i.stock, 0),
    alerts:       items.filter(i => i.alertEnabled && (i.stock === 0 || i.stock <= i.reorderAt)).length,
  }), [items])

  const SortBtn = ({ field, children }: { field: any; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-left font-bold uppercase tracking-wider text-[10px] text-muted-foreground hover:text-foreground transition-colors">
      {children}
      {sortField === field
        ? (sortDir === 'asc' ? <ArrowUp size={9} className="text-primary" /> : <ArrowDown size={9} className="text-primary" />)
        : <ArrowUp size={9} className="text-muted-foreground/40" />}
    </button>
  )

  const statCards: StatCardData[] = [
    { label: 'Total SKUs',    value: stats.totalSKUs,   sub: 'across all warehouses', icon: Boxes,       trend: null, accent: 'hsl(215 16% 47%)' },
    { label: 'Stock Value',   value: fmtK(stats.totalValue), sub: 'at cost price',   icon: BarChart3,   trend: 4.2,  accent: 'hsl(142 71% 45%)' },
    { label: 'Total Units',   value: stats.totalUnits,  sub: 'units on hand',         icon: Warehouse,   trend: -2.1, accent: 'hsl(217 91% 60%)' },
    { label: 'Low Stock',     value: stats.lowStock,    sub: 'need reorder soon',     icon: TrendingDown,trend: null, accent: 'hsl(43 96% 56%)' },
    { label: 'Out of Stock',  value: stats.outOfStock,  sub: 'urgent restocking',     icon: ShieldAlert, trend: null, accent: 'var(--destructive)' },
    { label: 'Active Alerts', value: stats.alerts,      sub: 'items need attention',  icon: Bell,        trend: null, accent: 'var(--primary)' },
  ]

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="max-w-[1440px] mx-auto px-5 py-7 space-y-5">

          {/* ── HEADER ── */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
                  <Boxes size={17} className="text-white" />
                </div>
                <h1 className="text-[28px] font-black tracking-tight text-foreground">Inventory</h1>
                <Badge variant="secondary" className="font-bold">{filtered.length}</Badge>
              </div>
              <p className="text-sm text-muted-foreground pl-[0.1rem]">
                {stats.outOfStock > 0 && <span className="text-destructive font-bold">{stats.outOfStock} out of stock · </span>}
                {stats.lowStock > 0   && <span className="text-amber-600  font-bold">{stats.lowStock} low stock · </span>}
                <span>{stats.totalSKUs} total SKUs</span>
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {[
                { icon: Upload,   label: 'Import' },
                { icon: Download, label: 'Export' },
              ].map(({ icon: Icon, label }) => (
                <Button key={label} variant="outline" size="sm" className="gap-2 font-semibold">
                  <Icon size={13} className="text-muted-foreground" /> {label}
                </Button>
              ))}
              <Button size="sm" className="gap-2 font-bold bg-primary hover:bg-primary/90 shadow-md shadow-primary/25">
                <Plus size={13} /> Add Item
              </Button>
            </div>
          </div>

          {/* ── STAT CARDS ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
            {statCards.map(({ label, value, sub, icon: Icon, trend, accent }) => (
              <Card key={label} className="border-border shadow-none hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: `color-mix(in srgb, ${accent} 12%, transparent)` }}>
                      <Icon size={15} style={{ color: accent }} />
                    </div>
                    {trend !== null && (
                      <span className={`text-[10px] font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${trend > 0 ? 'bg-green-500/10 text-green-700' : 'bg-destructive/10 text-destructive'}`}>
                        {trend > 0 ? <ArrowUpRight size={9} /> : <ArrowDownRight size={9} />}
                        {Math.abs(trend)}%
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-black text-foreground leading-none mb-1">{value}</p>
                  <p className="text-[11px] text-muted-foreground font-medium">{sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ── CATEGORY TABS + FILTERS ── */}
          <div className="space-y-3">
            {/* Category scroll */}
            <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {CATEGORIES.map(cat => {
                const active = category === cat
                const color  = CAT_COLOR[cat]
                const count  = cat === 'All' ? items.length : items.filter(i => i.category === cat).length
                return (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setPage(1) }}
                    className="flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap"
                    style={{
                      background: active ? (color ?? 'var(--foreground)') : 'var(--card)',
                      color:      active ? 'white' : 'var(--muted-foreground)',
                      border:     active ? `1px solid transparent` : '1px solid var(--border)',
                      boxShadow:  active ? `0 3px 10px ${(color ?? '#333')}35` : 'none',
                    }}>
                    {cat}
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                      style={{ background: active ? 'rgba(255,255,255,0.25)' : 'var(--secondary)', color: active ? 'white' : 'var(--muted-foreground)' }}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 min-w-[180px] max-w-[280px]">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1) }}
                  placeholder="Search items, SKUs, suppliers…"
                  className="pl-9 pr-9 h-9 text-sm"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Status filter */}
              <Select value={statusFilter} onValueChange={v => { setStatusFilter(v as StockStatus | 'all'); setPage(1) }}>
                <SelectTrigger className="w-auto h-9 text-xs font-semibold gap-2 pr-2">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="overstock">Overstock</SelectItem>
                </SelectContent>
              </Select>

              {/* Warehouse filter */}
              <Select value={warehouse} onValueChange={v => { setWarehouse(v); setPage(1) }}>
                <SelectTrigger className="w-auto h-9 text-xs font-semibold gap-2 pr-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WAREHOUSES.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                </SelectContent>
              </Select>

              <div className="flex-1" />

              {/* Alert: low stock quick filter */}
              {stats.alerts > 0 && (
                <Button variant="outline" size="sm"
                  className="gap-1.5 text-amber-600 border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 font-bold"
                  onClick={() => setStatusFilter('low_stock')}>
                  <Bell size={12} />
                  {stats.alerts} alerts
                </Button>
              )}
            </div>
          </div>

          {/* ── BULK ACTION BAR ── */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary/20 bg-primary/5 flex-wrap animate-in slide-in-from-top-2 duration-150">
              <span className="text-xs font-black text-primary">{selectedIds.size} selected</span>
              <Separator orientation="vertical" className="h-4 bg-primary/20" />
              {([
                { icon: RefreshCw,    label: 'Reorder',     color: 'var(--primary)' },
                { icon: Truck,        label: 'Transfer',    color: 'hsl(217 91% 60%)' },
                { icon: ClipboardList,label: 'Export',      color: 'var(--muted-foreground)' },
                { icon: Archive,      label: 'Archive',     color: 'var(--destructive)' },
              ] as { icon: LucideIcon; label: string; color: string }[]).map(({ icon: Icon, label, color }) => (
                <Button key={label} variant="outline" size="sm" className="h-7 text-xs font-bold gap-1.5" style={{ color }}>
                  <Icon size={11} />{label}
                </Button>
              ))}
              <Button variant="ghost" size="sm" className="ml-auto h-7 text-xs text-muted-foreground"
                onClick={() => setSelectedIds(new Set())}>
                Clear
              </Button>
            </div>
          )}

          {/* ── TABLE ── */}
          <Card className="border-border shadow-none overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/40 hover:bg-secondary/40">
                  <TableHead className="w-10 pl-5">
                    <Checkbox
                      checked={selectedIds.size === filtered.length && filtered.length > 0}
                      onCheckedChange={toggleAll}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </TableHead>
                  <TableHead className="min-w-[240px]">
                    <SortBtn field="name">Product</SortBtn>
                  </TableHead>
                  <TableHead><SortBtn field="stock">Stock</SortBtn></TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    <SortBtn field="reorderAt">Reorder At</SortBtn>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    <SortBtn field="velocity">Velocity</SortBtn>
                  </TableHead>
                  <TableHead className="hidden xl:table-cell">Days Left</TableHead>
                  <TableHead className="hidden xl:table-cell text-right">
                    <SortBtn field="value">Value</SortBtn>
                  </TableHead>
                  <TableHead className="hidden md:table-cell text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Last Move
                  </TableHead>
                  <TableHead className="w-10 pr-4" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="py-20 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                        <Package size={24} className="text-muted-foreground" />
                      </div>
                      <p className="font-black text-foreground text-base mb-1">No items found</p>
                      <p className="text-sm text-muted-foreground">{search ? `No results for "${search}"` : 'Adjust your filters.'}</p>
                    </TableCell>
                  </TableRow>
                ) : paginated.map((item, idx) => {
                  const status   = getStockStatus(item)
                  const sm       = STOCK_STATUS[status]
                  const catColor = CAT_COLOR[item.category] ?? '#888'
                  const spark    = item.movements
                    .filter(m => m.type === 'out')
                    .map(m => m.qty)
                    .slice(-6)

                  return (
                    <TableRow
                      key={item.id}
                      className="group relative border-border hover:bg-secondary/30 transition-colors"
                      style={{ animationDelay: `${idx * 30}ms` }}>

                      {/* Left category indicator */}
                      <TableCell className="pl-5 pr-2 w-10">
                        <div className="flex items-center gap-2">
                          {/* Category dot */}
                          <div className="w-0.5 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity absolute left-0 top-1/2 -translate-y-1/2"
                            style={{ background: catColor }} />
                          <Checkbox
                            checked={selectedIds.has(item.id)}
                            onCheckedChange={() => toggleSelect(item.id)}
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                        </div>
                      </TableCell>

                      {/* Product */}
                      <TableCell className="min-w-[240px]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                            style={{ background: `color-mix(in srgb, ${catColor} 12%, transparent)` }}>
                            {item.emoji}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-foreground truncate leading-tight">{item.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <code className="text-[10px] text-muted-foreground">{item.sku}</code>
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                                style={{ background: `color-mix(in srgb, ${catColor} 12%, transparent)`, color: catColor }}>
                                {item.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Stock + progress */}
                      <TableCell>
                        <div className="min-w-[130px]">
                          <StockProgress item={item} />
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {item.reserved > 0 ? `${item.reserved} reserved` : item.location}
                          </p>
                        </div>
                      </TableCell>

                      {/* Status badge */}
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant={sm.variant}
                          className={`text-[10px] font-bold gap-1.5 whitespace-nowrap ${
                            status === 'in_stock'    ? 'border-green-500/25 bg-green-500/10 text-green-700 dark:text-green-400' :
                            status === 'low_stock'   ? 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400' :
                            status === 'overstock'   ? 'border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-400'     :
                            'border-destructive/25 bg-destructive/10 text-destructive'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sm.dot}`} />
                          {sm.label}
                        </Badge>
                      </TableCell>

                      {/* Reorder at */}
                      <TableCell className="hidden lg:table-cell">
                        <div>
                          <p className="text-xs font-bold text-foreground">{item.reorderAt}</p>
                          <p className="text-[10px] text-muted-foreground">reorder +{item.reorderQty}</p>
                        </div>
                      </TableCell>

                      {/* Velocity */}
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-col gap-1">
                          <VelocityBadge v={item.velocity} />
                          <MiniSpark vals={spark.length ? spark : [0,0,0]} color={catColor} />
                        </div>
                      </TableCell>

                      {/* Days remaining */}
                      <TableCell className="hidden xl:table-cell">
                        <DaysPill days={item.daysRemaining} />
                      </TableCell>

                      {/* Value */}
                      <TableCell className="hidden xl:table-cell text-right">
                        <p className="text-[13px] font-black text-foreground">{fmt(item.value)}</p>
                        <p className="text-[10px] text-muted-foreground">{fmt(item.cost)} / unit</p>
                      </TableCell>

                      {/* Last movement */}
                      <TableCell className="hidden md:table-cell">
                        <p className="text-xs text-muted-foreground whitespace-nowrap">{item.lastMovement}</p>
                        <p className="text-[10px] text-muted-foreground">{item.warehouse.split(' ')[0]}</p>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="pr-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="default" size="icon"
                                className="h-7 w-7 rounded-lg bg-foreground text-background hover:bg-foreground/85"
                                onClick={() => openAdjust(item)}>
                                <Edit2 size={11} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left" className="text-xs">Adjust Stock</TooltipContent>
                          </Tooltip>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-muted-foreground">
                                <MoreHorizontal size={13} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl">
                              <DropdownMenuItem className="gap-2 text-xs cursor-pointer" onClick={() => openAdjust(item)}>
                                <Edit2 size={12} /> Adjust Stock
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
                                <History size={12} /> View History
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
                                <Truck size={12} /> Create Reorder
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
                                <Move size={12} /> Transfer Stock
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
                                {item.alertEnabled
                                  ? <><BellOff size={12} /> Disable Alert</>
                                  : <><Bell size={12} /> Enable Alert</>}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="gap-2 text-xs cursor-pointer text-destructive focus:text-destructive">
                                <Trash2 size={12} /> Remove Item
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-secondary/20">
                <span className="text-xs text-muted-foreground">
                  Showing {((page - 1) * PER_PAGE) + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-bold"
                    onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                    <ChevronLeft size={13} /> Prev
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <Button
                      key={p} size="sm"
                      variant={p === page ? 'default' : 'outline'}
                      className={`h-8 w-8 text-xs font-black p-0 ${p === page ? 'bg-primary hover:bg-primary/90' : ''}`}
                      onClick={() => setPage(p)}>
                      {p}
                    </Button>
                  ))}
                  <Button
                    variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-bold"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                    Next <ChevronRight size={13} />
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* ── ALERT PANEL (low/out of stock items) ── */}
          {(stats.outOfStock > 0 || stats.lowStock > 0) && (
            <Card className="border-amber-500/20 bg-amber-500/5 shadow-none">
              <CardHeader className="pb-2 pt-4 px-5">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={15} className="text-amber-600" />
                  <CardTitle className="text-sm font-black text-amber-700 dark:text-amber-400">
                    Reorder Alerts — {stats.alerts} item{stats.alerts !== 1 ? 's' : ''} need attention
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                  {items.filter(i => i.alertEnabled && (i.stock === 0 || i.stock <= i.reorderAt)).map(item => {
                    const outOfStock = item.stock === 0
                    return (
                      <div key={item.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-amber-500/30 transition-colors cursor-default group">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0 bg-secondary">
                          {item.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground truncate leading-tight">{item.name}</p>
                          <p className="text-[10px] font-bold mt-0.5" style={{ color: outOfStock ? 'var(--destructive)' : '#d97706' }}>
                            {outOfStock ? 'Out of stock' : `${item.stock} left (reorder at ${item.reorderAt})`}
                          </p>
                        </div>
                        <Button
                          size="sm" variant="outline"
                          className="h-7 text-[10px] font-bold flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity gap-1"
                          onClick={() => openAdjust(item)}>
                          <RefreshCw size={9} /> Reorder
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── ADJUST SHEET ── */}
        <AdjustSheet
          item={adjustItem}
          open={adjustOpen}
          onOpenChange={setAdjustOpen}
          onSave={handleAdjust}
        />
      </div>
    </TooltipProvider>
  )
}