'use client'

import {
  FileText, Download, Plus, Calendar, Clock, Filter,
  ChevronDown, ChevronRight, Search, MoreHorizontal,
  RefreshCw, Check, X, Play, Pause, Trash2, Edit2,
  Eye, Share2, Mail, Copy, Star, StarOff, Archive,
  BarChart3, ShoppingBag, Users, Package, DollarSign,
  TrendingUp, Tag, Truck, RotateCcw, ArrowUpRight,
  ArrowDownRight, Zap, Globe, Target, AlertCircle,
  CheckCircle2, FileSpreadsheet, FileJson, FilePieChart,
  Table, List, Layers, SlidersHorizontal, Send, Bell,
  Lock, Sparkles, ChevronUp, LucideIcon
} from 'lucide-react'
import { useState, useRef, useEffect, useMemo } from 'react'

/* ═══════════════════════════════════════════════════════
   TYPES & INTERFACES
═══════════════════════════════════════════════════════ */

type ReportStatus = 'ready' | 'generating' | 'scheduled' | 'failed'
type ReportFormat = 'pdf' | 'csv' | 'xlsx' | 'json'
type ReportFrequency = 'once' | 'daily' | 'weekly' | 'monthly'
type ViewMode = 'list' | 'grid'
type CategoryName =
  | 'All'
  | 'Revenue'
  | 'Sales'
  | 'Customers'
  | 'Products'
  | 'Marketing'
  | 'Inventory'
  | 'Returns'
  | 'Finance'

interface Report {
  id: string
  name: string
  category: Exclude<CategoryName, 'All'>
  description: string
  status: ReportStatus
  format: ReportFormat
  frequency: ReportFrequency
  lastRun: string
  nextRun?: string
  rows?: number
  size?: string
  starred: boolean
  shared: boolean
  createdBy: string
  recipients?: string[]
  trend?: string | null
  trendUp?: boolean
  progress?: number
}

interface Template {
  id: string
  icon: LucideIcon
  label: string
  desc: string
  accent: string
}

interface StatusMeta {
  label: string
  dot: string
  text: string
  bg: string
  border: string
}

interface FormatMeta {
  icon: LucideIcon
  color: string
  bg: string
  label: string
}

interface FreqStyle {
  color: string
  bg: string
}

interface ActivityItem {
  icon: LucideIcon
  text: string
  time: string
  color: string
}

interface ScheduledItem {
  freq: string
  count: number
  next: string
  color: string
}

interface ReportCounts {
  total: number
  ready: number
  scheduled: number
  generating: number
  failed: number
  starred: number
}

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */

const REPORTS: Report[] = [
  { id: 'r1', name: 'Monthly Revenue Summary', category: 'Revenue', description: 'Total revenue, AOV, and growth vs previous month broken down by category and channel.', status: 'ready', format: 'pdf', frequency: 'monthly', lastRun: 'Mar 1, 2026', nextRun: 'Apr 1, 2026', rows: 1284, size: '2.4 MB', starred: true, shared: true, createdBy: 'Admin', recipients: ['ceo@shophub.com', 'finance@shophub.com'], trend: '+18.2%', trendUp: true },
  { id: 'r2', name: 'Weekly Sales Performance', category: 'Sales', description: 'Day-by-day sales breakdown with product-level detail, discount analysis, and fulfilment rate.', status: 'ready', format: 'xlsx', frequency: 'weekly', lastRun: 'Mar 18, 2026', nextRun: 'Mar 25, 2026', rows: 4284, size: '5.1 MB', starred: true, shared: false, createdBy: 'Admin', trend: '+5.3%', trendUp: true },
  { id: 'r3', name: 'Customer Acquisition Report', category: 'Customers', description: 'New vs returning customers, acquisition channels, LTV cohort analysis, and churn metrics.', status: 'generating', format: 'pdf', frequency: 'monthly', lastRun: '—', progress: 62, starred: false, shared: false, createdBy: 'Admin', trend: null },
  { id: 'r4', name: 'Inventory Stock Alert', category: 'Inventory', description: 'Products below threshold with reorder suggestions, supplier info, and velocity analysis.', status: 'ready', format: 'csv', frequency: 'daily', lastRun: 'Today, 6:00 AM', nextRun: 'Tomorrow, 6:00 AM', rows: 34, size: '128 KB', starred: false, shared: true, createdBy: 'System', recipients: ['ops@shophub.com'], trend: '-3 items', trendUp: false },
  { id: 'r5', name: 'Product Performance Deep Dive', category: 'Products', description: 'SKU-level analysis: views, add-to-cart rates, conversion, revenue contribution, and review scores.', status: 'scheduled', format: 'xlsx', frequency: 'weekly', lastRun: 'Mar 11, 2026', nextRun: 'Mar 25, 2026', rows: 892, size: '—', starred: true, shared: false, createdBy: 'Admin', trend: null },
  { id: 'r6', name: 'Returns & Refunds Analysis', category: 'Returns', description: 'Return rates by product, reason codes, financial impact, and resolution time metrics.', status: 'ready', format: 'pdf', frequency: 'monthly', lastRun: 'Mar 1, 2026', nextRun: 'Apr 1, 2026', rows: 421, size: '1.8 MB', starred: false, shared: false, createdBy: 'Admin', trend: '-2.1%', trendUp: true },
  { id: 'r7', name: 'Traffic & Conversion Funnel', category: 'Marketing', description: 'Sessions by source, device breakdown, funnel drop-off, and page-level conversion data.', status: 'failed', format: 'pdf', frequency: 'weekly', lastRun: 'Mar 14, 2026', rows: undefined, starred: false, shared: false, createdBy: 'Admin', trend: null },
  { id: 'r8', name: 'Tax & Compliance Summary', category: 'Finance', description: 'Tax collected by region, applicable rates, compliance status, and export for accounting.', status: 'ready', format: 'xlsx', frequency: 'monthly', lastRun: 'Mar 1, 2026', nextRun: 'Apr 1, 2026', rows: 2841, size: '3.2 MB', starred: false, shared: true, createdBy: 'System', recipients: ['accounting@shophub.com'], trend: null },
]

const TEMPLATES: Template[] = [
  { id: 't1', icon: DollarSign, label: 'Revenue Overview', desc: 'Revenue, AOV, order count', accent: '#16a34a' },
  { id: 't2', icon: ShoppingBag, label: 'Sales by Channel', desc: 'Channel performance & ROI', accent: '#2563eb' },
  { id: 't3', icon: Users, label: 'Customer Insights', desc: 'LTV, churn, cohorts', accent: '#7c3aed' },
  { id: 't4', icon: Package, label: 'Product Performance', desc: 'SKU-level analytics', accent: '#d97706' },
  { id: 't5', icon: TrendingUp, label: 'Marketing ROI', desc: 'Campaign attribution', accent: '#E40F2A' },
  { id: 't6', icon: Truck, label: 'Fulfilment Report', desc: 'Shipping & delivery KPIs', accent: '#0891b2' },
  { id: 't7', icon: RotateCcw, label: 'Returns Analysis', desc: 'Return rates & reasons', accent: '#ea580c' },
  { id: 't8', icon: Globe, label: 'Geographic Sales', desc: 'Revenue by country', accent: '#0d9488' },
]

const CATEGORIES: CategoryName[] = ['All', 'Revenue', 'Sales', 'Customers', 'Products', 'Marketing', 'Inventory', 'Returns', 'Finance']

const STATUS_META: Record<ReportStatus, StatusMeta> = {
  ready:      { label: 'Ready',      dot: '#22c55e', text: '#15803d', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.2)' },
  generating: { label: 'Generating', dot: '#3b82f6', text: '#1d4ed8', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.2)' },
  scheduled:  { label: 'Scheduled',  dot: '#f59e0b', text: '#b45309', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)' },
  failed:     { label: 'Failed',     dot: '#ef4444', text: '#b91c1c', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.2)' },
}

const FORMAT_META: Record<ReportFormat, FormatMeta> = {
  pdf:  { icon: FileText,        color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   label: 'PDF' },
  csv:  { icon: Table,           color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   label: 'CSV' },
  xlsx: { icon: FileSpreadsheet, color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'XLSX' },
  json: { icon: FileJson,        color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', label: 'JSON' },
}

const CATEGORY_COLORS: Partial<Record<CategoryName, string>> = {
  Revenue: '#16a34a', Sales: '#2563eb', Customers: '#7c3aed', Products: '#d97706',
  Marketing: '#E40F2A', Inventory: '#0891b2', Returns: '#ea580c', Finance: '#0d9488',
}

const FREQ_STYLE: Record<ReportFrequency, FreqStyle> = {
  once:    { color: '#64748b', bg: 'rgba(100,116,139,0.1)' },
  daily:   { color: '#2563eb', bg: 'rgba(37,99,235,0.1)' },
  weekly:  { color: '#7c3aed', bg: 'rgba(124,58,237,0.1)' },
  monthly: { color: '#d97706', bg: 'rgba(217,119,6,0.1)' },
}

const RECENT_ACTIVITY: ActivityItem[] = [
  { icon: Download, text: 'Monthly Revenue Summary downloaded', time: '5 min ago', color: '#22c55e' },
  { icon: RefreshCw, text: 'Inventory Stock Alert generated', time: '2h ago', color: '#3b82f6' },
  { icon: Send, text: 'Weekly Sales emailed to 2 recipients', time: '3h ago', color: '#E40F2A' },
  { icon: AlertCircle, text: 'Traffic & Conversion Funnel failed', time: '5h ago', color: '#ef4444' },
  { icon: CheckCircle2, text: 'Tax & Compliance Summary ready', time: '8h ago', color: '#22c55e' },
]

/* ═══════════════════════════════════════════════════════
   MINI SPARKLINE
═══════════════════════════════════════════════════════ */

interface SparklineProps {
  color: string
  up: boolean
}

function Sparkline({ color, up }: SparklineProps) {
  const pts: number[] = up
    ? [8,14,10,15,12,11,16,13,18,15,20,17,22]
    : [22,18,20,16,19,14,17,12,15,10,13,9,11]
  const min = Math.min(...pts)
  const max = Math.max(...pts)
  const norm = pts.map((p) => 28 - ((p - min) / (max - min)) * 24)
  const d = norm.map((y, i) => `${i === 0 ? 'M' : 'L'}${i * 10},${y}`).join(' ')
  return (
    <svg width={120} height={32} viewBox="0 0 120 32" fill="none">
      <path d={d} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
      <circle cx={120} cy={norm[norm.length - 1]} r={2.5} fill={color} />
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════
   BADGES
═══════════════════════════════════════════════════════ */

interface StatusBadgeProps {
  status: ReportStatus
  progress?: number
}

function StatusBadge({ status, progress }: StatusBadgeProps) {
  const m = STATUS_META[status]
  return (
    <span
      style={{ color: m.text, background: m.bg, border: `1px solid ${m.border}` }}
      className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
    >
      {status === 'generating'
        ? <RefreshCw size={9} style={{ animation: 'spin 1s linear infinite' }} />
        : <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.dot, display: 'inline-block', flexShrink: 0 }} />
      }
      {m.label}{status === 'generating' && progress !== undefined && ` ${progress}%`}
    </span>
  )
}

interface FormatBadgeProps {
  format: ReportFormat
}

function FormatBadge({ format }: FormatBadgeProps) {
  const m = FORMAT_META[format]
  const Icon = m.icon
  return (
    <span
      style={{ color: m.color, background: m.bg }}
      className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide"
    >
      <Icon size={10} />{m.label}
    </span>
  )
}

interface FreqBadgeProps {
  freq: ReportFrequency
}

function FreqBadge({ freq }: FreqBadgeProps) {
  const s = FREQ_STYLE[freq]
  return (
    <span
      style={{ color: s.color, background: s.bg }}
      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
    >
      <Clock size={9} />{freq}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════
   CATEGORY DOT
═══════════════════════════════════════════════════════ */

interface CategoryDotProps {
  cat: Exclude<CategoryName, 'All'>
}

function CategoryDot({ cat }: CategoryDotProps) {
  return (
    <span
      style={{
        width: 7, height: 7, borderRadius: '50%',
        background: CATEGORY_COLORS[cat] ?? '#999',
        display: 'inline-block', flexShrink: 0
      }}
    />
  )
}

/* ═══════════════════════════════════════════════════════
   REPORT ROW (list view)
═══════════════════════════════════════════════════════ */

interface ReportRowProps {
  report: Report
  onStar: (id: string) => void
  onDelete: (id: string) => void
  onView: (report: Report) => void
}

function ReportRow({ report, onStar, onDelete, onView }: ReportRowProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [downloading, setDownloading] = useState<boolean>(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const Icon = FORMAT_META[report.format].icon

  return (
    <div
      className="group relative flex items-center gap-4 px-5 py-4 transition-all border-b border-[#f0f0f0] last:border-0 hover:bg-[#fafafa]"
      style={{ '--hover-indicator': CATEGORY_COLORS[report.category] ?? '#E40F2A' } as React.CSSProperties}
    >
      {/* Left accent bar on hover */}
      <div
        className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full opacity-0 group-hover:opacity-100 transition-all"
        style={{ background: CATEGORY_COLORS[report.category] ?? '#E40F2A' }}
      />

      {/* Format icon */}
      <div
        className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: FORMAT_META[report.format].bg }}
      >
        <Icon size={17} style={{ color: FORMAT_META[report.format].color }} />
      </div>

      {/* Name + desc */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <button
            onClick={() => onView(report)}
            className="font-bold text-[13px] text-[#1a1a1a] hover:text-[#E40F2A] transition-colors text-left leading-tight"
          >
            {report.name}
          </button>
          {report.starred && <Star size={11} style={{ fill: '#f59e0b', color: '#f59e0b', flexShrink: 0 }} />}
          {report.shared && <Share2 size={10} className="text-gray-400 shrink-0" />}
        </div>
        <p className="text-xs text-gray-400 truncate leading-relaxed">{report.description}</p>
      </div>

      {/* Category */}
      <div className="hidden lg:flex items-center gap-1.5 shrink-0">
        <CategoryDot cat={report.category} />
        <span className="text-xs text-gray-500 font-medium">{report.category}</span>
      </div>

      {/* Status + badges */}
      <div className="hidden md:flex items-center gap-2 shrink-0">
        <StatusBadge status={report.status} progress={report.progress} />
        <FreqBadge freq={report.frequency} />
        <FormatBadge format={report.format} />
      </div>

      {/* Last run */}
      <div className="hidden xl:block shrink-0 text-right min-w-[100px]">
        <p className="text-xs text-gray-500 font-medium">{report.lastRun}</p>
        {report.nextRun && <p className="text-[10px] text-gray-400 mt-0.5">→ {report.nextRun}</p>}
      </div>

      {/* Trend */}
      {report.trend && (
        <div className="hidden xl:flex items-center gap-1 shrink-0">
          {report.trendUp
            ? <ArrowUpRight size={12} className="text-green-500" />
            : <ArrowDownRight size={12} className="text-red-500" />}
          <span className={`text-xs font-bold ${report.trendUp ? 'text-green-600' : 'text-red-500'}`}>
            {report.trend}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {report.status === 'ready' && (
          <button
            onClick={() => { setDownloading(true); setTimeout(() => setDownloading(false), 2000) }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{ background: downloading ? '#22c55e' : '#1a1a1a', color: '#fff' }}
          >
            {downloading ? <><Check size={11} /> Done</> : <><Download size={11} /> Download</>}
          </button>
        )}
        {report.status === 'failed' && (
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: 'rgba(228,15,42,0.1)', color: '#E40F2A' }}
          >
            <RefreshCw size={11} /> Retry
          </button>
        )}
        {report.status === 'scheduled' && (
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: 'rgba(37,99,235,0.1)', color: '#2563eb' }}
          >
            <Play size={11} /> Run Now
          </button>
        )}

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
          >
            <MoreHorizontal size={14} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 w-48 bg-white border border-[#eee] rounded-2xl shadow-xl py-1.5 z-30 overflow-hidden">
              {([
                { icon: Eye,    label: 'View details', fn: () => { onView(report); setMenuOpen(false) } },
                { icon: report.starred ? StarOff : Star, label: report.starred ? 'Unstar' : 'Star', fn: () => { onStar(report.id); setMenuOpen(false) } },
                { icon: Edit2,  label: 'Edit',          fn: () => setMenuOpen(false) },
                { icon: Copy,   label: 'Duplicate',     fn: () => setMenuOpen(false) },
                { icon: Send,   label: 'Email report',  fn: () => setMenuOpen(false) },
                { icon: Trash2, label: 'Delete',        fn: () => { onDelete(report.id); setMenuOpen(false) }, danger: true },
              ] as Array<{ icon: LucideIcon; label: string; fn: () => void; danger?: boolean }>).map(({ icon: I, label, fn, danger }) => (
                <button
                  key={label}
                  onClick={fn}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm transition-colors text-left"
                  style={{ color: danger ? '#E40F2A' : '#374151' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = danger ? 'rgba(228,15,42,0.06)' : '#f9fafb')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <I size={13} />{label}
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
   REPORT CARD (grid view)
═══════════════════════════════════════════════════════ */

interface ReportCardProps {
  report: Report
  onStar: (id: string) => void
  onDelete: (id: string) => void
  onView: (report: Report) => void
}

function ReportCard({ report, onStar, onDelete, onView }: ReportCardProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [downloading, setDownloading] = useState<boolean>(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const catColor = CATEGORY_COLORS[report.category] ?? '#E40F2A'
  const fmeta = FORMAT_META[report.format]
  const Icon = fmeta.icon

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  return (
    <div className="group relative flex flex-col bg-white border border-[#ebebeb] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/8 hover:border-transparent">
      {/* Top stripe */}
      <div className="h-1 w-full" style={{ background: catColor }} />

      {/* Card header */}
      <div className="flex items-start justify-between p-5 pb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: fmeta.bg }}
          >
            <Icon size={16} style={{ color: fmeta.color }} />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: catColor }}>
              {report.category}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onStar(report.id)} className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
            {report.starred
              ? <Star size={13} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
              : <StarOff size={13} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            }
          </button>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal size={13} className="text-gray-400" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-7 w-44 bg-white border border-[#eee] rounded-2xl shadow-xl py-1.5 z-30">
                {([
                  { icon: Eye,    label: 'View',      fn: () => { onView(report); setMenuOpen(false) } },
                  { icon: Edit2,  label: 'Edit',      fn: () => setMenuOpen(false) },
                  { icon: Copy,   label: 'Duplicate', fn: () => setMenuOpen(false) },
                  { icon: Trash2, label: 'Delete',    fn: () => { onDelete(report.id); setMenuOpen(false) }, danger: true },
                ] as Array<{ icon: LucideIcon; label: string; fn: () => void; danger?: boolean }>).map(({ icon: I, label, fn, danger }) => (
                  <button
                    key={label}
                    onClick={fn}
                    className="flex items-center gap-2.5 w-full px-4 py-2 text-xs transition-colors text-left"
                    style={{ color: danger ? '#E40F2A' : '#374151' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <I size={12} />{label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-bold text-[13px] text-[#1a1a1a] leading-snug mb-1.5">{report.name}</h3>
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{report.description}</p>
        </div>

        {/* Progress bar */}
        {report.status === 'generating' && report.progress !== undefined && (
          <div>
            <div className="flex justify-between text-[10px] mb-1.5">
              <span className="font-bold" style={{ color: '#2563eb' }}>Generating…</span>
              <span className="text-gray-400">{report.progress}%</span>
            </div>
            <div className="h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${report.progress}%`, background: '#3b82f6' }}
              />
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <StatusBadge status={report.status} progress={report.progress} />
          <FreqBadge freq={report.frequency} />
          <FormatBadge format={report.format} />
        </div>

        {/* Sparkline + trend if available */}
        {report.trend && report.status === 'ready' && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {report.trendUp
                ? <ArrowUpRight size={13} className="text-green-500" />
                : <ArrowDownRight size={13} className="text-red-500" />}
              <span className={`text-xs font-bold ${report.trendUp ? 'text-green-600' : 'text-red-500'}`}>
                {report.trend}
              </span>
              <span className="text-[10px] text-gray-400 ml-0.5">vs last period</span>
            </div>
            <Sparkline color={report.trendUp ? '#22c55e' : '#ef4444'} up={report.trendUp ?? false} />
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-[#f5f5f5] flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] text-gray-400">
              Last run: <span className="font-medium text-gray-600">{report.lastRun}</span>
            </p>
            {report.rows !== undefined && (
              <p className="text-[10px] text-gray-400">
                {report.rows.toLocaleString()} rows{report.size ? ` · ${report.size}` : ''}
              </p>
            )}
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => onView(report)}
              className="p-2 rounded-xl transition-colors hover:bg-gray-50 text-gray-400 hover:text-gray-700"
            >
              <Eye size={13} />
            </button>
            {report.status === 'ready' && (
              <button
                onClick={() => { setDownloading(true); setTimeout(() => setDownloading(false), 2000) }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all"
                style={{ background: downloading ? '#22c55e' : '#1a1a1a', color: '#fff' }}
              >
                {downloading ? <Check size={11} /> : <Download size={11} />}
              </button>
            )}
            {report.status === 'failed' && (
              <button
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(228,15,42,0.1)', color: '#E40F2A' }}
              >
                <RefreshCw size={11} />
              </button>
            )}
            {report.status === 'scheduled' && (
              <button
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(37,99,235,0.1)', color: '#2563eb' }}
              >
                <Play size={11} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   DETAIL PANEL
═══════════════════════════════════════════════════════ */

interface DetailPanelProps {
  report: Report
  onClose: () => void
}

function DetailPanel({ report, onClose }: DetailPanelProps) {
  const [downloading, setDownloading] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)
  const catColor = CATEGORY_COLORS[report.category] ?? '#E40F2A'
  const fmeta = FORMAT_META[report.format]
  const Icon = fmeta.icon

  const previewRows: [string, string, string, string, string][] = [
    ['Mar 2026', '$84,291', '1,234', '$68.3', '+18.2%'],
    ['Feb 2026', '$78,900', '1,156', '$68.2', '+12.1%'],
    ['Jan 2026', '$71,200', '1,044', '$68.2', '+8.4%'],
  ]

  const detailItems: Array<{ label: string; val: string }> = [
    { label: 'Category',       val: report.category },
    { label: 'Created By',     val: report.createdBy },
    { label: 'Last Generated', val: report.lastRun },
    { label: 'Next Scheduled', val: report.nextRun ?? '—' },
    { label: 'Rows',           val: report.rows?.toLocaleString() ?? '—' },
    { label: 'File Size',      val: report.size ?? '—' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-[440px] bg-white h-full flex flex-col shadow-2xl">
        {/* Colored top bar */}
        <div className="h-1.5 w-full" style={{ background: catColor }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f0f0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: fmeta.bg }}>
              <Icon size={18} style={{ color: fmeta.color }} />
            </div>
            <div>
              <p className="font-bold text-[13px] text-[#1a1a1a] leading-tight">{report.name}</p>
              <p className="text-[11px] font-semibold mt-0.5" style={{ color: catColor }}>{report.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Status */}
          <div className="px-6 py-4 border-b border-[#f5f5f5]" style={{ background: STATUS_META[report.status].bg }}>
            <div className="flex items-center justify-between">
              <StatusBadge status={report.status} progress={report.progress} />
              <div className="flex gap-2">
                <FormatBadge format={report.format} />
                <FreqBadge freq={report.frequency} />
              </div>
            </div>
            {report.status === 'generating' && report.progress !== undefined && (
              <div className="mt-3">
                <div className="h-1.5 bg-white/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${report.progress}%`, background: '#3b82f6', transition: 'width 0.5s' }}
                  />
                </div>
                <p className="text-xs mt-1.5 font-semibold" style={{ color: '#2563eb' }}>~2 minutes remaining</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="px-6 py-5 border-b border-[#f5f5f5]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Description</p>
            <p className="text-sm text-gray-600 leading-relaxed">{report.description}</p>
          </div>

          {/* Stats grid */}
          <div className="px-6 py-5 border-b border-[#f5f5f5]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Details</p>
            <div className="grid grid-cols-2 gap-2.5">
              {detailItems.map(({ label, val }) => (
                <div key={label} className="rounded-xl p-3 bg-[#fafafa] border border-[#f0f0f0]">
                  <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-[#1a1a1a]">{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recipients */}
          {(report.recipients?.length ?? 0) > 0 && (
            <div className="px-6 py-5 border-b border-[#f5f5f5]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Recipients</p>
              <div className="space-y-2">
                {report.recipients!.map((r) => (
                  <div key={r} className="flex items-center gap-3 p-3 bg-[#fafafa] border border-[#f0f0f0] rounded-xl">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white"
                      style={{ background: catColor }}
                    >
                      {r[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-700">{r}</span>
                  </div>
                ))}
                <button className="flex items-center gap-1.5 text-xs font-bold mt-1" style={{ color: '#E40F2A' }}>
                  <Plus size={11} /> Add recipient
                </button>
              </div>
            </div>
          )}

          {/* Preview */}
          {report.status === 'ready' && (
            <div className="px-6 py-5 border-b border-[#f5f5f5]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Preview</p>
              <div className="rounded-2xl overflow-hidden border border-[#eee]">
                <div className="grid grid-cols-5 gap-0 px-4 py-2.5 bg-[#f8f8f8] border-b border-[#eee]">
                  {['Date', 'Revenue', 'Orders', 'AOV', 'Growth'].map((h) => (
                    <span key={h} className="text-[10px] font-bold text-gray-500">{h}</span>
                  ))}
                </div>
                {previewRows.map((row, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-5 gap-0 px-4 py-2.5 border-b border-[#f0f0f0] last:border-0 ${i % 2 ? 'bg-[#fafafa]' : 'bg-white'}`}
                  >
                    {row.map((cell, j) => (
                      <span key={j} className={`text-xs font-mono ${j === 4 ? 'text-green-600 font-bold' : 'text-gray-700'}`}>
                        {cell}
                      </span>
                    ))}
                  </div>
                ))}
                <p className="px-4 py-2 text-[10px] text-gray-400 text-center bg-[#fafafa]">
                  Showing 3 of {report.rows?.toLocaleString()} rows
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="px-6 py-5 space-y-2.5">
            {report.status === 'ready' && (
              <>
                <button
                  onClick={() => { setDownloading(true); setTimeout(() => setDownloading(false), 2000) }}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all"
                  style={{ background: downloading ? '#22c55e' : '#1a1a1a' }}
                >
                  {downloading
                    ? <><CheckCircle2 size={16} /> Downloaded!</>
                    : <><Download size={16} /> Download {fmeta.label.toUpperCase()}</>
                  }
                </button>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-[#eee] rounded-2xl font-semibold text-sm text-gray-700 hover:bg-gray-50 transition-all">
                    <Send size={14} /> Email
                  </button>
                  <button
                    onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 border rounded-2xl font-semibold text-sm transition-all"
                    style={{
                      borderColor: copied ? '#22c55e' : '#eee',
                      color: copied ? '#16a34a' : '#374151',
                      background: copied ? 'rgba(34,197,94,0.05)' : 'transparent'
                    }}
                  >
                    {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy Link</>}
                  </button>
                </div>
              </>
            )}
            {report.status === 'failed' && (
              <button
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm text-white"
                style={{ background: '#E40F2A' }}
              >
                <RefreshCw size={16} /> Retry Generation
              </button>
            )}
            {report.status === 'scheduled' && (
              <button className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#1a1a1a] text-white rounded-2xl font-bold text-sm">
                <Play size={16} /> Run Now
              </button>
            )}
            <button className="flex items-center justify-center gap-2 py-3 w-full border border-[#eee] rounded-2xl font-semibold text-sm text-gray-600 hover:bg-gray-50 transition-all">
              <Edit2 size={14} /> Edit Schedule & Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════ */
export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(REPORTS)
  const [view, setView] = useState<ViewMode>('list')
  const [search, setSearch] = useState<string>('')
  const [activeCategory, setActiveCategory] = useState<CategoryName>('All')
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'All'>('All')
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showNewReport, setShowNewReport] = useState<boolean>(false)
  const [showStarred, setShowStarred] = useState<boolean>(false)
  const [newStep, setNewStep] = useState<1 | 2 | 3>(1)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  useEffect(() => {
    document.body.style.overflow = (selectedReport || showNewReport) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedReport, showNewReport])

  const handleStar = (id: string) =>
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, starred: !r.starred } : r)))

  const handleDelete = (id: string) =>
    setReports((prev) => prev.filter((r) => r.id !== id))

  const filtered = useMemo<Report[]>(() => {
    let list = reports
    if (showStarred) list = list.filter((r) => r.starred)
    if (activeCategory !== 'All') list = list.filter((r) => r.category === activeCategory)
    if (statusFilter !== 'All') list = list.filter((r) => r.status === statusFilter)
    if (search.trim()) {
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.description.toLowerCase().includes(search.toLowerCase())
      )
    }
    return list
  }, [reports, showStarred, activeCategory, statusFilter, search])

  const counts: ReportCounts = {
    total:      reports.length,
    ready:      reports.filter((r) => r.status === 'ready').length,
    scheduled:  reports.filter((r) => r.status === 'scheduled').length,
    generating: reports.filter((r) => r.status === 'generating').length,
    failed:     reports.filter((r) => r.status === 'failed').length,
    starred:    reports.filter((r) => r.starred).length,
  }

  const statCards = [
    { label: 'Total',      val: counts.total,      icon: FileText,      color: '#64748b', accent: '#f1f5f9' },
    { label: 'Ready',      val: counts.ready,      icon: CheckCircle2,  color: '#16a34a', accent: 'rgba(34,197,94,0.08)' },
    { label: 'Scheduled',  val: counts.scheduled,  icon: Calendar,      color: '#d97706', accent: 'rgba(245,158,11,0.08)' },
    { label: 'Generating', val: counts.generating, icon: RefreshCw,     color: '#2563eb', accent: 'rgba(59,130,246,0.08)' },
    { label: 'Failed',     val: counts.failed,     icon: AlertCircle,   color: '#dc2626', accent: 'rgba(220,38,38,0.08)' },
    { label: 'Starred',    val: counts.starred,    icon: Star,          color: '#d97706', accent: 'rgba(245,158,11,0.08)' },
  ] as const

  const scheduledItems: ScheduledItem[] = [
    { freq: 'Daily',   count: 2, next: 'Tomorrow 6:00 AM', color: '#2563eb' },
    { freq: 'Weekly',  count: 3, next: 'Mar 25, 2026',     color: '#7c3aed' },
    { freq: 'Monthly', count: 4, next: 'Apr 1, 2026',      color: '#d97706' },
  ]

  const stepLabels = ['Choose Template', 'Configure', 'Schedule'] as const

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: '#f9f9f9', minHeight: '100vh' }}>
      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .report-row { animation: slideIn 0.2s ease both; }
        .report-card { animation: slideIn 0.2s ease both; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 99px; }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-5 py-7 space-y-6">

        {/* ── HEADER ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#E40F2A' }}>
                <FileText size={15} color="white" />
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.5px' }}>Reports</h1>
            </div>
            <p style={{ fontSize: 13, color: '#888' }}>
              {counts.total} reports &middot; {counts.scheduled} scheduled &middot; {counts.starred} starred
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#eee] rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
              <Download size={13} className="text-gray-400" /> Bulk Export
            </button>
            <button
              onClick={() => setShowNewReport(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-md"
              style={{ background: '#E40F2A', boxShadow: '0 4px 14px rgba(228,15,42,0.25)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#c40d24')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#E40F2A')}
            >
              <Plus size={14} /> New Report
            </button>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {statCards.map(({ label, val, icon: Icon, color, accent }) => (
            <div key={label} className="bg-white border border-[#ebebeb] rounded-2xl p-4 flex items-center gap-3 shadow-sm">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: accent }}>
                <Icon
                  size={15}
                  style={{
                    color,
                    ...(label === 'Generating' && val > 0 ? { animation: 'spin 2s linear infinite' } : {})
                  }}
                />
              </div>
              <div>
                <p style={{ fontSize: 22, fontWeight: 900, color: '#1a1a1a', lineHeight: 1 }}>{val}</p>
                <p style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid xl:grid-cols-[1fr_300px] gap-5 items-start">

          {/* LEFT: Reports */}
          <div className="space-y-4">

            {/* Category tabs */}
            <div className="flex overflow-x-auto gap-1.5 pb-1" style={{ scrollbarWidth: 'none' }}>
              {CATEGORIES.map((cat) => {
                const active = activeCategory === cat
                const color = CATEGORY_COLORS[cat]
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: active ? (color ?? '#1a1a1a') : 'white',
                      color: active ? 'white' : '#666',
                      border: active ? `1px solid ${color ?? '#1a1a1a'}` : '1px solid #eee',
                      boxShadow: active ? `0 2px 8px ${color ?? '#1a1a1a'}30` : 'none'
                    }}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 min-w-[180px] max-w-xs">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search reports…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#eee] rounded-xl text-sm focus:outline-none transition-all placeholder:text-gray-400"
                  style={{ color: '#1a1a1a' }}
                  onFocus={(e) => (e.target.style.borderColor = '#E40F2A')}
                  onBlur={(e) => (e.target.style.borderColor = '#eee')}
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Status */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ReportStatus | 'All')}
                className="px-3 py-2.5 bg-white border border-[#eee] rounded-xl text-sm text-gray-600 focus:outline-none cursor-pointer appearance-none pr-8"
              >
                {(['All', 'ready', 'scheduled', 'generating', 'failed'] as const).map((s) => (
                  <option key={s} value={s}>
                    {s === 'All' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>

              {/* Starred */}
              <button
                onClick={() => setShowStarred((v) => !v)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all"
                style={{
                  background: showStarred ? 'rgba(245,158,11,0.1)' : 'white',
                  borderColor: showStarred ? 'rgba(245,158,11,0.3)' : '#eee',
                  color: showStarred ? '#d97706' : '#666',
                }}
              >
                <Star size={12} style={showStarred ? { fill: '#f59e0b', color: '#f59e0b' } : {}} />
                Starred {counts.starred > 0 && `(${counts.starred})`}
              </button>

              <div className="flex-1" />

              {/* View toggle */}
              <div className="flex border border-[#eee] rounded-xl overflow-hidden bg-white shadow-sm">
                {([['list', List], ['grid', Layers]] as [ViewMode, LucideIcon][]).map(([v, Icon]) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className="p-2.5 transition-colors"
                    style={{ background: view === v ? '#1a1a1a' : 'transparent', color: view === v ? 'white' : '#999' }}
                  >
                    <Icon size={14} />
                  </button>
                ))}
              </div>
            </div>

            {/* Count */}
            <p style={{ fontSize: 12, color: '#aaa' }}>
              {filtered.length} report{filtered.length !== 1 ? 's' : ''}
              {activeCategory !== 'All' && ` in ${activeCategory}`}
              {showStarred && ' · starred only'}
            </p>

            {/* Reports output */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white border border-[#eee] rounded-2xl text-center shadow-sm">
                <div className="w-14 h-14 bg-[#f5f5f5] rounded-2xl flex items-center justify-center mb-4">
                  <FileText size={22} className="text-gray-400" />
                </div>
                <h3 className="font-black text-[#1a1a1a] text-lg mb-2">No reports found</h3>
                <p className="text-sm text-gray-400 mb-6">
                  {search ? `No results for "${search}"` : 'Try adjusting your filters.'}
                </p>
                <button
                  onClick={() => setShowNewReport(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white"
                  style={{ background: '#1a1a1a' }}
                >
                  <Plus size={14} /> Create New Report
                </button>
              </div>
            ) : view === 'list' ? (
              <div className="bg-white border border-[#ebebeb] rounded-2xl overflow-hidden shadow-sm">
                {/* Header row */}
                <div
                  className="hidden md:grid px-5 py-2.5 border-b border-[#f5f5f5] bg-[#fafafa]"
                  style={{ gridTemplateColumns: '2fr 1fr 1.5fr 1fr 120px' }}
                >
                  {(['Report', 'Category', 'Status', 'Last Run', ''] as const).map((h) => (
                    <span key={h} style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bbb' }}>
                      {h}
                    </span>
                  ))}
                </div>
                {filtered.map((report, i) => (
                  <div key={report.id} className="report-row" style={{ animationDelay: `${i * 30}ms` }}>
                    <ReportRow report={report} onStar={handleStar} onDelete={handleDelete} onView={setSelectedReport} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((report, i) => (
                  <div key={report.id} className="report-card" style={{ animationDelay: `${i * 40}ms` }}>
                    <ReportCard report={report} onStar={handleStar} onDelete={handleDelete} onView={setSelectedReport} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-4">

            {/* Scheduled */}
            <div className="bg-white border border-[#ebebeb] rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#f5f5f5]">
                <div className="flex items-center gap-2">
                  <Bell size={14} style={{ color: '#E40F2A' }} />
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#1a1a1a' }}>Scheduled</span>
                </div>
                <button style={{ fontSize: 11, fontWeight: 700, color: '#E40F2A' }}>Manage</button>
              </div>
              {scheduledItems.map((s) => (
                <div key={s.freq} className="flex items-center justify-between px-5 py-3.5 border-b border-[#f8f8f8] last:border-0 hover:bg-[#fafafa] transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>{s.freq}</span>
                    </div>
                    <p style={{ fontSize: 11, color: '#aaa' }}>Next: {s.next}</p>
                  </div>
                  <span style={{ fontSize: 20, fontWeight: 900, color: '#1a1a1a' }}>{s.count}</span>
                </div>
              ))}
            </div>

            {/* Templates */}
            <div className="bg-white border border-[#ebebeb] rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#f5f5f5]">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-gray-400" />
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#1a1a1a' }}>Templates</span>
                </div>
                <button style={{ fontSize: 11, color: '#aaa' }}>See all</button>
              </div>
              <div className="p-3 grid grid-cols-3 gap-1.5">
                {TEMPLATES.slice(0, 6).map((t) => {
                  const Icon = t.icon
                  return (
                    <button
                      key={t.id}
                      onClick={() => { setSelectedTemplate(t.id); setShowNewReport(true) }}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-all hover:bg-[#f9f9f9] group"
                    >
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{ background: `${t.accent}18` }}
                      >
                        <Icon size={14} style={{ color: t.accent }} />
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 600, color: '#555', lineHeight: 1.2 }}>{t.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-[#ebebeb] rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-[#f5f5f5]">
                <span style={{ fontSize: 13, fontWeight: 800, color: '#1a1a1a' }}>Recent Activity</span>
              </div>
              {RECENT_ACTIVITY.map((a, i) => {
                const Icon = a.icon
                return (
                  <div key={i} className="flex items-start gap-3 px-5 py-3.5 border-b border-[#f8f8f8] last:border-0 hover:bg-[#fafafa] transition-colors">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `${a.color}18` }}
                    >
                      <Icon size={12} style={{ color: a.color }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 12, color: '#444', lineHeight: 1.4 }}>{a.text}</p>
                      <p style={{ fontSize: 10, color: '#bbb', marginTop: 2 }}>{a.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Storage */}
            <div className="bg-white border border-[#ebebeb] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontSize: 13, fontWeight: 800, color: '#1a1a1a' }}>Storage</span>
                <span style={{ fontSize: 11, color: '#aaa' }}>28.4 / 500 MB</span>
              </div>
              <div className="h-2 bg-[#f0f0f0] rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full" style={{ width: '5.7%', background: '#E40F2A' }} />
              </div>
              <p style={{ fontSize: 11, color: '#bbb' }}>5.7% used · 471.6 MB free</p>
            </div>
          </div>
        </div>
      </div>

      {/* DETAIL PANEL */}
      {selectedReport && <DetailPanel report={selectedReport} onClose={() => setSelectedReport(null)} />}

      {/* NEW REPORT MODAL */}
      {showNewReport && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => { setShowNewReport(false); setNewStep(1); setSelectedTemplate(null) }}
          />
          <div className="relative w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[88dvh] flex flex-col">

            {/* Red top bar */}
            <div className="h-1.5" style={{ background: '#E40F2A' }} />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f0f0]">
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 900, color: '#1a1a1a' }}>Create New Report</h2>
                <p style={{ fontSize: 12, color: '#aaa' }}>Step {newStep} of 3</p>
              </div>
              <button
                onClick={() => { setShowNewReport(false); setNewStep(1); setSelectedTemplate(null) }}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400"
              >
                <X size={16} />
              </button>
            </div>

            {/* Step tabs */}
            <div className="flex border-b border-[#f0f0f0]">
              {stepLabels.map((label, i) => {
                const step = (i + 1) as 1 | 2 | 3
                const active = step === newStep
                const done = step < newStep
                return (
                  <div
                    key={label}
                    className="flex-1 flex items-center justify-center py-3 gap-2 text-xs font-semibold border-b-2 transition-all"
                    style={{
                      borderColor: done ? '#22c55e' : active ? '#E40F2A' : 'transparent',
                      color: done ? '#16a34a' : active ? '#E40F2A' : '#bbb'
                    }}
                  >
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                      style={{
                        background: done ? '#22c55e' : active ? '#E40F2A' : '#f0f0f0',
                        color: (done || active) ? 'white' : '#aaa'
                      }}
                    >
                      {done ? <Check size={10} /> : step}
                    </span>
                    <span className="hidden sm:inline">{label}</span>
                  </div>
                )
              })}
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 p-6">
              {newStep === 1 && (
                <div>
                  <p className="text-sm text-gray-400 mb-5">Choose a template or build from scratch.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    {TEMPLATES.map((t) => {
                      const Icon = t.icon
                      const sel = selectedTemplate === t.id
                      return (
                        <button
                          key={t.id}
                          onClick={() => setSelectedTemplate(t.id)}
                          className="flex flex-col items-center gap-2.5 p-4 rounded-2xl text-center transition-all"
                          style={{
                            border: sel ? `2px solid ${t.accent}` : '2px solid #eee',
                            background: sel ? `${t.accent}08` : 'white',
                            boxShadow: sel ? `0 4px 14px ${t.accent}20` : 'none'
                          }}
                        >
                          <div className="p-3 rounded-2xl" style={{ background: `${t.accent}15` }}>
                            <Icon size={18} style={{ color: t.accent }} />
                          </div>
                          <div>
                            <p style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a' }}>{t.label}</p>
                            <p style={{ fontSize: 10, color: '#aaa' }}>{t.desc}</p>
                          </div>
                          {sel && <Check size={13} style={{ color: t.accent }} />}
                        </button>
                      )
                    })}
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-px bg-[#f0f0f0]" />
                    <span style={{ fontSize: 12, color: '#ccc' }}>or</span>
                    <div className="flex-1 h-px bg-[#f0f0f0]" />
                  </div>
                  <button className="w-full py-3 border-2 border-dashed border-[#eee] rounded-2xl text-sm font-semibold text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-all flex items-center justify-center gap-2">
                    <Plus size={14} /> Build from scratch
                  </button>
                </div>
              )}

              {newStep === 2 && (
                <div className="space-y-5">
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', display: 'block', marginBottom: 6 }}>
                      Report Name <span style={{ color: '#E40F2A' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Monthly Revenue Overview"
                      defaultValue={selectedTemplate ? (TEMPLATES.find((t) => t.id === selectedTemplate)?.label ?? '') : ''}
                      className="w-full px-4 py-3 bg-[#fafafa] border border-[#eee] rounded-xl text-sm focus:outline-none transition-all"
                      onFocus={(e) => (e.target.style.borderColor = '#E40F2A')}
                      onBlur={(e) => (e.target.style.borderColor = '#eee')}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', display: 'block', marginBottom: 6 }}>Date Range</label>
                      <select className="w-full px-4 py-3 bg-[#fafafa] border border-[#eee] rounded-xl text-sm focus:outline-none appearance-none cursor-pointer">
                        {['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 12 months', 'This year'].map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', display: 'block', marginBottom: 6 }}>Output Format</label>
                      <select className="w-full px-4 py-3 bg-[#fafafa] border border-[#eee] rounded-xl text-sm focus:outline-none appearance-none cursor-pointer">
                        {['PDF', 'Excel (.xlsx)', 'CSV', 'JSON'].map((f) => (
                          <option key={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', display: 'block', marginBottom: 6 }}>Description</label>
                    <textarea
                      rows={2}
                      placeholder="Optional description…"
                      className="w-full px-4 py-3 bg-[#fafafa] border border-[#eee] rounded-xl text-sm resize-none focus:outline-none transition-all"
                      onFocus={(e) => (e.target.style.borderColor = '#E40F2A')}
                      onBlur={(e) => (e.target.style.borderColor = '#eee')}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', display: 'block', marginBottom: 8 }}>Filters</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Category', 'Brand', 'Country', 'Channel', 'Status', 'Tags'].map((f) => (
                        <button
                          key={f}
                          className="flex items-center gap-1.5 px-3 py-2.5 bg-[#fafafa] border border-[#eee] rounded-xl text-xs font-medium text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-all"
                        >
                          <Plus size={10} /> {f}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {newStep === 3 && (
                <div className="space-y-5">
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', display: 'block', marginBottom: 8 }}>Frequency</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['once', 'daily', 'weekly', 'monthly'] as ReportFrequency[]).map((f) => (
                        <button
                          key={f}
                          className="px-4 py-3 border-2 border-[#eee] rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-all capitalize"
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', display: 'block', marginBottom: 6 }}>Start Date</label>
                      <input type="date" className="w-full px-4 py-3 bg-[#fafafa] border border-[#eee] rounded-xl text-sm focus:outline-none" />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', display: 'block', marginBottom: 6 }}>Time (UTC)</label>
                      <input type="time" defaultValue="06:00" className="w-full px-4 py-3 bg-[#fafafa] border border-[#eee] rounded-xl text-sm focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', display: 'block', marginBottom: 6 }}>Email Recipients</label>
                    <input
                      type="email"
                      placeholder="Enter email address…"
                      className="w-full px-4 py-3 bg-[#fafafa] border border-[#eee] rounded-xl text-sm focus:outline-none transition-all"
                      onFocus={(e) => (e.target.style.borderColor = '#E40F2A')}
                      onBlur={(e) => (e.target.style.borderColor = '#eee')}
                    />
                    <p style={{ fontSize: 11, color: '#bbb', marginTop: 5 }}>Separate multiple with commas</p>
                  </div>
                  <div
                    className="rounded-2xl p-4 flex items-start gap-3"
                    style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)' }}
                  >
                    <CheckCircle2 size={16} style={{ color: '#22c55e', marginTop: 1, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>Ready to generate</p>
                      <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                        Your report will run immediately and be scheduled for future periods.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-[#f0f0f0] bg-white">
              <button
                onClick={() => newStep > 1 ? setNewStep((s) => (s - 1) as 1 | 2 | 3) : setShowNewReport(false)}
                className="px-5 py-2.5 border border-[#eee] rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
              >
                {newStep > 1 ? 'Back' : 'Cancel'}
              </button>
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  {([1, 2, 3] as const).map((s) => (
                    <div
                      key={s}
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: s === newStep ? 24 : 12,
                        background: s === newStep ? '#E40F2A' : s < newStep ? '#22c55e' : '#e5e7eb'
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={() => newStep < 3 ? setNewStep((s) => (s + 1) as 1 | 2 | 3) : setShowNewReport(false)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                  style={{ background: '#E40F2A', boxShadow: '0 4px 12px rgba(228,15,42,0.25)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#c40d24')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#E40F2A')}
                >
                  {newStep === 3 ? <><Zap size={13} /> Generate Report</> : <>Continue <ChevronRight size={13} /></>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}