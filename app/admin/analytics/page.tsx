'use client'

import {
  TrendingUp, TrendingDown, Users, ShoppingBag, DollarSign,
  ArrowUpRight, ArrowDownRight, BarChart3, Calendar,
  Download, Filter, ChevronDown, RefreshCw, Globe,
  Repeat, Target, MousePointer, Eye, Clock, Zap,
  ShoppingCart, Package, Star, ArrowRight, ChevronRight,
  Activity, Layers, MoreHorizontal, Info
} from 'lucide-react'
import Link from 'next/link'
import { useState, useMemo, useRef, useEffect } from 'react'

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */

const DATE_RANGES = ['Today', 'Yesterday', 'Last 7 days', 'Last 30 days', 'Last 90 days', 'This year', 'Custom']

const OVERVIEW_KPIS = [
  { id: 'revenue', label: 'Total Revenue', value: 284291, fmt: 'currency', change: +18.2, sparkColor: '#22c55e', spark: [38, 52, 45, 68, 62, 78, 84, 90, 85, 95, 88, 100] },
  { id: 'orders', label: 'Total Orders', value: 4284, fmt: 'number', change: +12.5, sparkColor: '#3b82f6', spark: [28, 40, 35, 55, 50, 62, 65, 70, 68, 75, 72, 80] },
  { id: 'aov', label: 'Avg Order Value', value: 66.38, fmt: 'currency', change: +5.3, sparkColor: '#8b5cf6', spark: [55, 58, 60, 62, 59, 64, 65, 67, 63, 68, 66, 70] },
  { id: 'conversion', label: 'Conversion Rate', value: 3.24, fmt: 'pct', change: -0.3, sparkColor: '#f59e0b', spark: [3.5, 3.2, 3.4, 3.1, 3.3, 3.6, 3.2, 3.5, 3.3, 3.1, 3.4, 3.2] },
  { id: 'sessions', label: 'Sessions', value: 132400, fmt: 'number', change: +9.1, sparkColor: '#06b6d4', spark: [82, 90, 85, 100, 95, 110, 105, 115, 108, 120, 115, 125] },
  { id: 'bounce', label: 'Bounce Rate', value: 38.2, fmt: 'pct', change: -2.1, sparkColor: '#ef4444', spark: [44, 42, 40, 41, 39, 38, 40, 37, 39, 38, 37, 36] },
  { id: 'ltv', label: 'Customer LTV', value: 248, fmt: 'currency', change: +7.8, sparkColor: '#10b981', spark: [200, 210, 215, 220, 218, 225, 230, 235, 232, 238, 242, 248] },
  { id: 'repeat', label: 'Repeat Rate', value: 34.8, fmt: 'pct', change: +3.2, sparkColor: '#e40f2a', spark: [28, 29, 30, 32, 31, 33, 32, 34, 33, 35, 34, 35] },
]

const REVENUE_MONTHLY = [
  { month: 'Apr', revenue: 42000, orders: 618, target: 40000 },
  { month: 'May', revenue: 48500, orders: 712, target: 45000 },
  { month: 'Jun', revenue: 44200, orders: 650, target: 46000 },
  { month: 'Jul', revenue: 56800, orders: 834, target: 52000 },
  { month: 'Aug', revenue: 61200, orders: 897, target: 58000 },
  { month: 'Sep', revenue: 58400, orders: 856, target: 60000 },
  { month: 'Oct', revenue: 67500, orders: 980, target: 64000 },
  { month: 'Nov', revenue: 82100, orders: 1201, target: 75000 },
  { month: 'Dec', revenue: 95400, orders: 1402, target: 88000 },
  { month: 'Jan', revenue: 71200, orders: 1044, target: 72000 },
  { month: 'Feb', revenue: 78900, orders: 1156, target: 76000 },
  { month: 'Mar', revenue: 84291, orders: 1234, target: 82000 },
]

const TRAFFIC_SOURCES = [
  { source: 'Organic Search', sessions: 48200, orders: 1580, rev: 104910, pct: 36.4, change: +12, color: '#22c55e' },
  { source: 'Direct', sessions: 31800, orders: 1040, rev: 69070, pct: 24.0, change: +5, color: '#3b82f6' },
  { source: 'Social Media', sessions: 24600, orders: 805, rev: 53465, pct: 18.6, change: +28, color: '#e40f2a' },
  { source: 'Email', sessions: 16400, orders: 540, rev: 35870, pct: 12.4, change: -3, color: '#f59e0b' },
  { source: 'Paid Ads', sessions: 8200, orders: 268, rev: 17800, pct: 6.2, change: +41, color: '#8b5cf6' },
  { source: 'Referral', sessions: 3200, orders: 52, rev: 3176, pct: 2.4, change: +9, color: '#06b6d4' },
]

const GEO_DATA = [
  { country: 'United States', flag: '🇺🇸', revenue: 148200, orders: 2180, pct: 52.2, change: +14 },
  { country: 'United Kingdom', flag: '🇬🇧', revenue: 42800, orders: 628, pct: 15.1, change: +8 },
  { country: 'Germany', flag: '🇩🇪', revenue: 28400, orders: 418, pct: 10.0, change: +22 },
  { country: 'Canada', flag: '🇨🇦', revenue: 21600, orders: 318, pct: 7.6, change: +11 },
  { country: 'Australia', flag: '🇦🇺', revenue: 18200, orders: 268, pct: 6.4, change: +19 },
  { country: 'France', flag: '🇫🇷', revenue: 14200, orders: 208, pct: 5.0, change: +6 },
  { country: 'Japan', flag: '🇯🇵', revenue: 8400, orders: 124, pct: 3.0, change: +31 },
  { country: 'Singapore', flag: '🇸🇬', revenue: 2491, orders: 140, pct: 0.9, change: +45 },
]

const FUNNEL = [
  { stage: 'Sessions', value: 132400, pct: 100, color: 'bg-blue-500' },
  { stage: 'Product Views', value: 89200, pct: 67.4, color: 'bg-blue-400' },
  { stage: 'Add to Cart', value: 28100, pct: 21.2, color: 'bg-primary/80' },
  { stage: 'Checkout Started', value: 12800, pct: 9.7, color: 'bg-primary' },
  { stage: 'Orders Placed', value: 4284, pct: 3.2, color: 'bg-green-500' },
]

const CAT_PERFORMANCE = [
  { cat: 'Electronics', revenue: 119000, orders: 1748, growth: +22, aov: 68.1, color: 'bg-blue-500' },
  { cat: 'Fashion', revenue: 79600, orders: 1184, growth: +15, aov: 67.2, color: 'bg-primary' },
  { cat: 'Gaming', revenue: 45500, orders: 592, growth: +34, aov: 76.9, color: 'bg-purple-500' },
  { cat: 'Home & Living', revenue: 25400, orders: 408, growth: +11, aov: 62.3, color: 'bg-green-500' },
  { cat: 'Sports', revenue: 14791, orders: 352, growth: +8, aov: 42.0, color: 'bg-amber-500' },
]

const COHORT_DATA = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  rows: [
    { cohort: 'Aug 2025', size: 420, retention: [100, 48, 32, 24, 18, 15] },
    { cohort: 'Sep 2025', size: 385, retention: [100, 52, 35, 26, 20, null] },
    { cohort: 'Oct 2025', size: 510, retention: [100, 45, 30, 22, null, null] },
    { cohort: 'Nov 2025', size: 680, retention: [100, 55, 38, null, null, null] },
    { cohort: 'Dec 2025', size: 890, retention: [100, 50, null, null, null, null] },
    { cohort: 'Jan 2026', size: 512, retention: [100, null, null, null, null, null] },
  ],
}

const fmt = (n: number, type: string) => {
  if (type === 'currency') return n >= 1000 ? `$${(n / 1000).toFixed(1)}K` : `$${n.toFixed(2)}`
  if (type === 'pct') return `${n.toFixed(1)}%`
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString()
}

const fmtFull = (n: number) => `$${n.toLocaleString('en-US')}`

/* ═══════════════════════════════════════════════════════
   MINI SPARKLINE
═══════════════════════════════════════════════════════ */

function Spark({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1
  const W = 64, H = 28
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * H}`)
  return (
    <svg width={W} height={H} className="overflow-visible shrink-0">
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <circle cx={pts[pts.length - 1].split(',')[0]} cy={pts[pts.length - 1].split(',')[1]} r="2.5" fill={color} />
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════
   BAR CHART
═══════════════════════════════════════════════════════ */

function RevenueBarChart({ data, showTarget }: { data: typeof REVENUE_MONTHLY; showTarget: boolean }) {
  const maxVal = Math.max(...data.map(d => Math.max(d.revenue, d.target)))
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="relative pt-6">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none">
        {[100, 75, 50, 25, 0].map(pct => (
          <span key={pct} className="text-[10px] text-muted-foreground/50 w-10 text-right">{pct === 0 ? '' : `$${(maxVal * pct / 100 / 1000).toFixed(0)}K`}</span>
        ))}
      </div>

      <div className="ml-12 relative">
        {/* Grid lines */}
        <div className="absolute inset-0 bottom-8 flex flex-col justify-between pointer-events-none">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="w-full border-t border-border/40" />
          ))}
        </div>

        {/* Bars */}
        <div className="flex items-end gap-1 sm:gap-2 h-48 pb-0 relative">
          {data.map((d, i) => {
            const revH = (d.revenue / maxVal) * 100
            const tgtH = (d.target / maxVal) * 100
            const isHovered = hovered === i
            return (
              <div
                key={d.month}
                className="flex-1 flex flex-col items-center gap-0.5 cursor-pointer relative group"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-foreground text-background text-[11px] font-bold px-3 py-2 rounded-xl shadow-xl z-20 whitespace-nowrap">
                    <div className="text-center font-black text-sm mb-1">{d.month}</div>
                    <div className="flex gap-3">
                      <span className="text-green-400">Rev: {fmtFull(d.revenue)}</span>
                    </div>
                    <div className="text-white/50">{d.orders.toLocaleString()} orders</div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-4 border-transparent border-t-foreground" />
                  </div>
                )}
                {/* Target line */}
                {showTarget && (
                  <div className="absolute w-full h-0.5 bg-amber-400/60" style={{ bottom: `${tgtH}%` }} />
                )}
                {/* Bar */}
                <div
                  className={`w-full rounded-t-md transition-all duration-200 ${isHovered ? 'bg-primary' : 'bg-primary/35 group-hover:bg-primary/55'}`}
                  style={{ height: `${revH}%` }}
                />
              </div>
            )
          })}
        </div>

        {/* X labels */}
        <div className="flex gap-1 sm:gap-2 mt-2">
          {data.map(d => (
            <div key={d.month} className="flex-1 text-center">
              <span className="text-[9px] sm:text-[10px] text-muted-foreground/60">{d.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   FUNNEL CHART
═══════════════════════════════════════════════════════ */

function FunnelChart() {
  return (
    <div className="flex flex-col gap-2">
      {FUNNEL.map((stage, i) => {
        const dropOff = i > 0 ? FUNNEL[i - 1].value - stage.value : 0
        const dropOffPct = i > 0 ? ((dropOff / FUNNEL[i - 1].value) * 100).toFixed(1) : null
        return (
          <div key={stage.stage}>
            {i > 0 && dropOff > 0 && (
              <div className="flex items-center gap-2 py-1 px-3">
                <div className="flex-1 h-px bg-border/50" />
                <span className="text-[10px] text-red-500/70 font-medium shrink-0">-{dropOffPct}% drop-off</span>
                <div className="flex-1 h-px bg-border/50" />
              </div>
            )}
            <div className="flex items-center gap-3 group">
              <div style={{ width: `${stage.pct}%`, minWidth: '30%' }} className="relative transition-all duration-500">
                <div className={`h-10 ${stage.color} rounded-lg flex items-center px-4 justify-between transition-all group-hover:brightness-110`}>
                  <span className="text-white text-xs font-bold truncate">{stage.stage}</span>
                  <span className="text-white/80 text-xs font-black shrink-0 ml-2">{stage.value.toLocaleString()}</span>
                </div>
              </div>
              <span className="text-[11px] text-muted-foreground font-medium shrink-0">{stage.pct.toFixed(1)}%</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   COHORT TABLE
═══════════════════════════════════════════════════════ */

function CohortTable() {
  const getColor = (v: number | null) => {
    if (v === null) return 'bg-secondary/30 text-muted-foreground/20'
    if (v === 100) return 'bg-blue-500/90 text-white'
    if (v >= 50) return 'bg-blue-400/70 text-white'
    if (v >= 35) return 'bg-blue-300/60 text-blue-900 dark:text-white'
    if (v >= 20) return 'bg-blue-200/60 text-blue-900 dark:text-blue-200'
    return 'bg-blue-100/60 text-blue-700 dark:text-blue-300'
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2.5 pr-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">Cohort</th>
            <th className="text-right py-2.5 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Users</th>
            {COHORT_DATA.months.map(m => (
              <th key={m} className="text-center py-2.5 px-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{m}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {COHORT_DATA.rows.map(row => (
            <tr key={row.cohort} className="group hover:bg-secondary/30 transition-colors">
              <td className="py-2.5 pr-4 font-semibold text-foreground whitespace-nowrap">{row.cohort}</td>
              <td className="py-2.5 px-2 text-right text-muted-foreground font-medium">{row.size}</td>
              {row.retention.map((v, i) => (
                <td key={i} className="py-2.5 px-1.5 text-center">
                  <span className={`inline-flex items-center justify-center w-10 h-7 rounded-lg text-[11px] font-bold ${getColor(v)}`}>
                    {v !== null ? `${v}%` : '—'}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[10px] text-muted-foreground mt-3">Color intensity = retention strength. Darker blue = higher retention.</p>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('Last 30 days')
  const [dateRangeOpen, setDateRangeOpen] = useState(false)
  const [showTarget, setShowTarget] = useState(true)
  const [activeMetric, setActiveMetric] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'revenue' | 'traffic' | 'geo' | 'cohort'>('revenue')
  const dateRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (dateRef.current && !dateRef.current.contains(e.target as Node)) setDateRangeOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const totRevenue = REVENUE_MONTHLY.reduce((s, d) => s + d.revenue, 0)
  const totOrders = REVENUE_MONTHLY.reduce((s, d) => s + d.orders, 0)

  return (
    <div className="p-4 sm:p-6 xl:p-8 space-y-6 max-w-[1600px] mx-auto">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Performance insights for your store</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Date range */}
          <div className="relative" ref={dateRef}>
            <button
              onClick={() => setDateRangeOpen(v => !v)}
              className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-secondary transition-all"
            >
              <Calendar size={14} className="text-muted-foreground" />
              {dateRange}
              <ChevronDown size={14} className={`text-muted-foreground transition-transform ${dateRangeOpen ? 'rotate-180' : ''}`} />
            </button>
            {dateRangeOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-card border border-border rounded-2xl shadow-xl py-1.5 z-20">
                {DATE_RANGES.map(r => (
                  <button key={r} onClick={() => { setDateRange(r); setDateRangeOpen(false) }} className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${dateRange === r ? 'text-primary font-bold' : 'text-foreground/75 hover:bg-secondary'}`}>
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-secondary transition-all">
            <Filter size={14} className="text-muted-foreground" /> Compare
          </button>

          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 active:scale-[0.97] transition-all shadow-md shadow-primary/20">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* ── KPI GRID ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        {OVERVIEW_KPIS.map(kpi => {
          const positive = kpi.change >= 0
          const isActive = activeMetric === kpi.id
          return (
            <button
              key={kpi.id}
              onClick={() => setActiveMetric(isActive ? null : kpi.id)}
              className={`flex flex-col gap-2 p-4 bg-card border rounded-2xl text-left transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/4 ${isActive ? 'border-primary ring-2 ring-primary/15 shadow-md shadow-primary/10' : 'border-border/70'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-muted-foreground truncate pr-1">{kpi.label}</span>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${positive ? 'text-green-700 bg-green-500/10' : 'text-red-700 bg-red-500/10'}`}>
                  {positive ? '+' : ''}{kpi.change}%
                </span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-foreground leading-none">{fmt(kpi.value, kpi.fmt)}</p>
              <Spark data={kpi.spark} color={kpi.sparkColor} />
            </button>
          )
        })}
      </div>

      {/* ── MAIN TABS CHART AREA ── */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-border overflow-x-auto scrollbar-none">
          {[
            { id: 'revenue', label: 'Revenue & Orders', icon: DollarSign },
            { id: 'traffic', label: 'Traffic Sources', icon: MousePointer },
            { id: 'geo', label: 'Geography', icon: Globe },
            { id: 'cohort', label: 'Cohort Retention', icon: Repeat },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 shrink-0 px-5 py-4 text-sm font-semibold border-b-2 transition-all ${activeTab === id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
          <div className="flex-1" />
          <div className="flex items-center pr-4 gap-3">
            {activeTab === 'revenue' && (
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer shrink-0">
                <input type="checkbox" checked={showTarget} onChange={e => setShowTarget(e.target.checked)} className="rounded" />
                Show target
              </label>
            )}
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all shrink-0">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Tab content */}
        <div className="p-6">

          {/* ─ Revenue & Orders ─ */}
          {activeTab === 'revenue' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">12-month total</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-foreground">${(totRevenue / 1000).toFixed(0)}K</span>
                    <span className="flex items-center gap-1 text-sm font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">
                      <ArrowUpRight size={14} /> +18.2% YoY
                    </span>
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Total Orders</p>
                    <p className="font-black text-foreground">{totOrders.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Avg Monthly Rev</p>
                    <p className="font-black text-foreground">${(totRevenue / 12 / 1000).toFixed(1)}K</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Best Month</p>
                    <p className="font-black text-foreground">Dec '25</p>
                  </div>
                </div>
              </div>
              <RevenueBarChart data={REVENUE_MONTHLY} showTarget={showTarget} />
              {showTarget && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-6 h-0.5 bg-amber-400/60 rounded" />
                  <span className="text-[11px] text-muted-foreground">Revenue target</span>
                </div>
              )}
            </div>
          )}

          {/* ─ Traffic Sources ─ */}
          {activeTab === 'traffic' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Total sessions</p>
                  <span className="text-3xl font-black text-foreground">132.4K</span>
                </div>
              </div>

              {/* Source bars */}
              <div className="flex h-4 rounded-full overflow-hidden gap-0.5 mb-6">
                {TRAFFIC_SOURCES.map(s => (
                  <div key={s.source} style={{ width: `${s.pct}%`, background: s.color }} className="transition-all hover:brightness-110 cursor-pointer" title={`${s.source}: ${s.pct}%`} />
                ))}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {['Source', 'Sessions', 'Orders', 'Revenue', 'Conv Rate', 'Change'].map(h => (
                        <th key={h} className={`py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground ${h === 'Source' ? 'text-left' : 'text-right'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {TRAFFIC_SOURCES.map(s => (
                      <tr key={s.source} className="group hover:bg-secondary/30 transition-colors">
                        <td className="py-3.5">
                          <div className="flex items-center gap-2.5">
                            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
                            <span className="font-semibold text-foreground">{s.source}</span>
                          </div>
                        </td>
                        <td className="py-3.5 text-right text-foreground/80">{(s.sessions / 1000).toFixed(1)}K</td>
                        <td className="py-3.5 text-right text-foreground/80">{s.orders.toLocaleString()}</td>
                        <td className="py-3.5 text-right font-bold text-foreground">${(s.rev / 1000).toFixed(1)}K</td>
                        <td className="py-3.5 text-right text-foreground/70">{((s.orders / s.sessions) * 100).toFixed(2)}%</td>
                        <td className="py-3.5 text-right">
                          <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${s.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {s.change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            {Math.abs(s.change)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─ Geography ─ */}
          {activeTab === 'geo' && (
            <div>
              <div className="grid xl:grid-cols-[1fr_280px] gap-8">
                {/* Country table */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Revenue by Country</p>
                    <span className="text-xs text-muted-foreground">{GEO_DATA.length} countries</span>
                  </div>
                  <div className="space-y-3">
                    {GEO_DATA.map((geo, i) => {
                      const maxRev = GEO_DATA[0].revenue
                      return (
                        <div key={geo.country} className="group">
                          <div className="flex items-center gap-3 mb-1.5">
                            <span className="text-base leading-none">{geo.flag}</span>
                            <span className="text-sm font-semibold text-foreground flex-1">{geo.country}</span>
                            <span className="text-sm font-black text-foreground">{fmtFull(geo.revenue)}</span>
                            <span className={`text-xs font-bold ml-1 ${geo.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {geo.change >= 0 ? '+' : ''}{geo.change}%
                            </span>
                          </div>
                          <div className="relative h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary/50 group-hover:bg-primary rounded-full transition-all duration-300"
                              style={{ width: `${(geo.revenue / maxRev) * 100}%` }}
                            />
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-[10px] text-muted-foreground">{geo.orders.toLocaleString()} orders</span>
                            <span className="text-[10px] text-muted-foreground">{geo.pct}% of total</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Top stats */}
                <div className="flex flex-col gap-4">
                  <div className="bg-secondary/50 rounded-2xl p-5 border border-border">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Top Markets</p>
                    <div className="flex flex-col gap-3">
                      {GEO_DATA.slice(0, 4).map((geo, i) => (
                        <div key={geo.country} className="flex items-center gap-3">
                          <span className="text-lg leading-none">{geo.flag}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground">{geo.country}</p>
                            <p className="text-[10px] text-muted-foreground">{geo.pct}% of revenue</p>
                          </div>
                          <span className={`text-xs font-bold ${geo.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>+{geo.change}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-secondary/50 rounded-2xl p-5 border border-border">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Fastest Growing</p>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🇸🇬</span>
                      <div>
                        <p className="font-black text-foreground">Singapore</p>
                        <p className="text-green-600 text-sm font-bold">+45% this month</p>
                        <p className="text-xs text-muted-foreground">140 orders · $2.5K revenue</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-primary/8 border border-primary/20 rounded-2xl p-5">
                    <p className="text-xs font-bold text-primary mb-2 flex items-center gap-1.5"><Zap size={12} /> Opportunity</p>
                    <p className="text-sm text-foreground/80 leading-relaxed">Japan showing +31% growth with only $8.4K revenue. Consider localised marketing.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─ Cohort Retention ─ */}
          {activeTab === 'cohort' && (
            <div>
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-black text-foreground text-base mb-1">Customer Retention Cohorts</h3>
                  <p className="text-xs text-muted-foreground">Percentage of customers who made repeat purchases in each subsequent month after their first order.</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[5, 20, 40, 70, 100].map(v => (
                        <div key={v} className="w-5 h-4 rounded-sm" style={{ opacity: v / 100, background: '#3b82f6' }} />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground">Low → High</span>
                  </div>
                </div>
              </div>
              <CohortTable />

              {/* Avg retention summary */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { label: 'Avg Month 1 Retention', val: '50.0%', desc: 'Half return within 30 days', good: true },
                  { label: 'Avg Month 3 Retention', val: '28.0%', desc: 'Industry avg is 25%', good: true },
                  { label: 'Avg Month 6 Retention', val: '15.0%', desc: 'Room to improve', good: false },
                ].map(({ label, val, desc, good }) => (
                  <div key={label} className={`p-4 rounded-2xl border ${good ? 'bg-green-500/5 border-green-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
                    <p className={`text-2xl font-black ${good ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>{val}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── LOWER GRID ── */}
      <div className="grid xl:grid-cols-[1fr_1fr_320px] gap-5">

        {/* Conversion Funnel */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-black text-foreground text-base">Conversion Funnel</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Session to purchase flow</p>
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-500/10 px-2.5 py-1 rounded-full">3.24% overall</span>
          </div>
          <FunnelChart />
          <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-border">
            <div className="bg-secondary/50 rounded-xl p-3">
              <p className="text-[10px] text-muted-foreground">Cart abandonment</p>
              <p className="font-black text-foreground text-lg">54.8%</p>
              <p className="text-[10px] text-red-600 font-semibold">-2.1% vs last month</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-3">
              <p className="text-[10px] text-muted-foreground">Checkout completion</p>
              <p className="font-black text-foreground text-lg">33.5%</p>
              <p className="text-[10px] text-green-600 font-semibold">+4.2% vs last month</p>
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-black text-foreground text-base">Category Performance</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Revenue breakdown by department</p>
            </div>
            <Link href="/admin/categories" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              Manage <ChevronRight size={12} />
            </Link>
          </div>

          {/* Stacked bar */}
          <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-5">
            {CAT_PERFORMANCE.map(c => (
              <div key={c.cat} style={{ width: `${(c.revenue / totRevenue) * 100}%` }} className={`${c.color} transition-all hover:brightness-110`} title={c.cat} />
            ))}
          </div>

          <div className="space-y-3">
            {CAT_PERFORMANCE.map(cat => {
              const pct = ((cat.revenue / totRevenue) * 100).toFixed(1)
              return (
                <div key={cat.cat} className="flex items-center gap-3 group">
                  <span className={`w-2.5 h-2.5 rounded-full ${cat.color} shrink-0`} />
                  <span className="text-sm text-foreground flex-1 font-medium">{cat.cat}</span>
                  <span className="text-[11px] text-muted-foreground w-8 text-right">{pct}%</span>
                  <span className="text-sm font-bold text-foreground w-16 text-right">${(cat.revenue / 1000).toFixed(0)}K</span>
                  <span className={`text-[11px] font-bold w-10 text-right ${cat.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>+{cat.growth}%</span>
                </div>
              )
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-border flex gap-3">
            <div className="flex-1 bg-secondary/50 rounded-xl p-3 text-center">
              <p className="text-[10px] text-muted-foreground">Best AOV</p>
              <p className="font-black text-foreground">Gaming $76.9</p>
            </div>
            <div className="flex-1 bg-secondary/50 rounded-xl p-3 text-center">
              <p className="text-[10px] text-muted-foreground">Fastest growth</p>
              <p className="font-black text-foreground text-green-600">Gaming +34%</p>
            </div>
          </div>
        </div>

        {/* Right sidebar: quick insights */}
        <div className="flex flex-col gap-4">

          {/* Live stats */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="font-black text-foreground text-sm">Live Right Now</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Visitors', val: '284', icon: Eye },
                { label: 'In Checkout', val: '42', icon: ShoppingCart },
                { label: 'Orders/hr', val: '8.4', icon: Package },
                { label: 'Revenue/hr', val: '$556', icon: DollarSign },
              ].map(({ label, val, icon: Icon }) => (
                <div key={label} className="bg-secondary/50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon size={12} className="text-primary" />
                    <span className="text-[10px] text-muted-foreground">{label}</span>
                  </div>
                  <p className="font-black text-foreground text-xl leading-none">{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top pages */}
          <div className="bg-card border border-border rounded-2xl p-5 flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="font-black text-foreground text-sm">Top Pages</p>
              <span className="text-[10px] text-muted-foreground">by sessions</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                { page: '/products', sessions: '24.8K', pct: 100 },
                { page: '/products/sony-wh1000xm5', sessions: '8.2K', pct: 33 },
                { page: '/categories', sessions: '7.1K', pct: 29 },
                { page: '/sale', sessions: '5.8K', pct: 23 },
                { page: '/new', sessions: '4.2K', pct: 17 },
              ].map(({ page, sessions, pct }) => (
                <div key={page}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-foreground/70 font-mono truncate flex-1 pr-2">{page}</span>
                    <span className="text-xs font-bold text-foreground shrink-0">{sessions}</span>
                  </div>
                  <div className="h-1 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary/40 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insight */}
          <div className="bg-foreground rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/15 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={14} className="text-primary" />
                <span className="text-[11px] font-black text-white/50 uppercase tracking-widest">AI Insight</span>
              </div>
              <p className="text-white/80 text-xs leading-relaxed">
                <span className="text-white font-bold">Paid Ads</span> has the highest growth rate (+41%) but only 6.2% traffic share. Increasing ad budget by 20% could yield an estimated <span className="text-primary font-bold">$12K additional monthly revenue</span>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── DEVICE BREAKDOWN + SESSION QUALITY ── */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">

        {/* Device breakdown */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-black text-foreground text-base mb-5">Device Breakdown</h2>
          <div className="flex flex-col gap-4">
            {[
              { device: 'Mobile', icon: '📱', sessions: 79440, pct: 60, orders: 2570, color: 'bg-primary' },
              { device: 'Desktop', icon: '💻', sessions: 46340, pct: 35, orders: 1500, color: 'bg-blue-500' },
              { device: 'Tablet', icon: '📟', sessions: 6620, pct: 5, orders: 214, color: 'bg-purple-500' },
            ].map(({ device, icon, sessions, pct, orders, color }) => (
              <div key={device}>
                <div className="flex items-center gap-3 mb-1.5">
                  <span>{icon}</span>
                  <span className="text-sm font-semibold text-foreground flex-1">{device}</span>
                  <span className="text-xs text-muted-foreground">{(sessions / 1000).toFixed(1)}K sessions</span>
                  <span className="text-sm font-black text-foreground">{pct}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{orders.toLocaleString()} orders · {((orders / sessions) * 100).toFixed(2)}% conv.</p>
              </div>
            ))}
          </div>
        </div>

        {/* Session quality */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-black text-foreground text-base mb-5">Session Quality</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Avg Session Duration', val: '4:32', sub: '+12s vs last month', up: true, icon: Clock },
              { label: 'Pages per Session', val: '5.8', sub: '+0.4 vs last month', up: true, icon: Eye },
              { label: 'Bounce Rate', val: '38.2%', sub: '-2.1% vs last month', up: true, icon: TrendingDown },
              { label: 'New vs Return', val: '64/36', sub: '36% returning', up: null, icon: Repeat },
            ].map(({ label, val, sub, up, icon: Icon }) => (
              <div key={label} className="bg-secondary/50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} className="text-primary" />
                  <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
                </div>
                <p className="text-2xl font-black text-foreground">{val}</p>
                <p className={`text-[10px] font-semibold mt-1 ${up === true ? 'text-green-600' : up === false ? 'text-red-600' : 'text-muted-foreground'}`}>{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Goal completions */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-black text-foreground text-base mb-5">Goal Completions</h2>
          <div className="flex flex-col gap-4">
            {[
              { label: 'Purchases', val: 4284, target: 4500, pct: 95.2, color: 'bg-green-500' },
              { label: 'Newsletter Signups', val: 1842, target: 2000, pct: 92.1, color: 'bg-blue-500' },
              { label: 'Account Creations', val: 3104, target: 3500, pct: 88.7, color: 'bg-primary' },
              { label: 'Wishlist Adds', val: 8912, target: 12000, pct: 74.3, color: 'bg-amber-500' },
              { label: 'App Downloads', val: 680, target: 1000, pct: 68.0, color: 'bg-purple-500' },
            ].map(({ label, val, target, pct, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-foreground/80 font-medium">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{val.toLocaleString()}/{target.toLocaleString()}</span>
                    <span className={`text-xs font-bold ${pct >= 90 ? 'text-green-600' : pct >= 70 ? 'text-amber-600' : 'text-red-600'}`}>{pct}%</span>
                  </div>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}