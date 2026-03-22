'use client'

import {
  Palette, Sun, Moon, Monitor, Type, Layout, Sliders,
  Check, RotateCcw, Save, Eye, ChevronRight, Sparkles,
  Bell, ShoppingBag, BarChart3, Package, Users, Settings,
  Star, TrendingUp, ArrowUpRight, Search, Plus, Download,
  Zap, Circle, Grid3X3, Rows3, AlignJustify, Maximize2,
  Minimize2, Contrast, Paintbrush, Layers, Globe, Hash,
  SlidersHorizontal, RefreshCw, CheckCircle2, X, Dot
} from 'lucide-react'
import { useState, useCallback } from 'react'

/* ═══════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════ */

type ThemeMode    = 'light' | 'dark' | 'system'
type DensityMode  = 'compact' | 'default' | 'comfortable'
type RadiusMode   = 'sharp' | 'soft' | 'round'
type SidebarStyle = 'full' | 'icons' | 'mini'
type FontPair     = 'default' | 'mono' | 'editorial' | 'humanist'

interface AccentColor {
  name: string
  value: string
}

interface AppearanceSettings {
  theme: ThemeMode
  accent: string
  density: DensityMode
  radius: RadiusMode
  sidebar: SidebarStyle
  font: FontPair
  animations: boolean
  compactTables: boolean
  showAvatars: boolean
}

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */

const ACCENT_COLORS: AccentColor[] = [
  { name: 'Crimson',   value: '#E40F2A' },
  { name: 'Cobalt',    value: '#2563eb' },
  { name: 'Violet',    value: '#7c3aed' },
  { name: 'Emerald',   value: '#059669' },
  { name: 'Amber',     value: '#d97706' },
  { name: 'Cyan',      value: '#0891b2' },
  { name: 'Rose',      value: '#e11d48' },
  { name: 'Slate',     value: '#475569' },
]

const FONT_PAIRS: Array<{ id: FontPair; label: string; display: string; sub: string; stack: string }> = [
  { id: 'default',   label: 'System Default',  display: 'Aa',  sub: 'Clean & familiar',      stack: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
  { id: 'mono',      label: 'Monospace',        display: '01',  sub: 'Technical & precise',   stack: "'JetBrains Mono', 'Fira Code', monospace" },
  { id: 'editorial', label: 'Editorial',        display: 'Ag',  sub: 'Refined & distinctive', stack: "'Playfair Display', Georgia, serif" },
  { id: 'humanist',  label: 'Humanist',         display: 'Ag',  sub: 'Warm & approachable',   stack: "'DM Sans', 'Nunito', sans-serif" },
]

const DEFAULTS: AppearanceSettings = {
  theme:         'light',
  accent:        '#E40F2A',
  density:       'default',
  radius:        'soft',
  sidebar:       'full',
  font:          'default',
  animations:    true,
  compactTables: false,
  showAvatars:   true,
}

/* ═══════════════════════════════════════════════════════
   MINI PREVIEW COMPONENTS
═══════════════════════════════════════════════════════ */

interface PreviewProps {
  settings: AppearanceSettings
}

function MiniPreview({ settings }: PreviewProps) {
  const isDark   = settings.theme === 'dark'
  const accent   = settings.accent
  const r        = settings.radius === 'sharp' ? 4 : settings.radius === 'soft' ? 10 : 18
  const pad      = settings.density === 'compact' ? 8 : settings.density === 'default' ? 12 : 16
  const sideW    = settings.sidebar === 'full' ? 96 : settings.sidebar === 'icons' ? 32 : 48

  const bg    = isDark ? '#111' : '#f7f7f7'
  const card  = isDark ? '#1e1e1e' : '#fff'
  const border= isDark ? '#2a2a2a' : '#ebebeb'
  const txt   = isDark ? '#f0f0f0' : '#1a1a1a'
  const sub   = isDark ? '#666' : '#bbb'
  const sideBg= isDark ? '#181818' : '#fff'

  const sideItems = [
    { icon: BarChart3, label: 'Dashboard' },
    { icon: ShoppingBag, label: 'Orders' },
    { icon: Package, label: 'Products' },
    { icon: Users, label: 'Customers' },
  ]

  return (
    <div style={{ width: '100%', height: '100%', background: bg, borderRadius: r, overflow: 'hidden', display: 'flex', fontFamily: 'system-ui', transition: 'all 0.3s' }}>
      {/* Sidebar */}
      <div style={{ width: sideW, background: sideBg, borderRight: `1px solid ${border}`, flexShrink: 0, padding: '10px 0', display: 'flex', flexDirection: 'column', gap: 2, transition: 'width 0.3s' }}>
        {/* Logo */}
        <div style={{ padding: '4px 10px 10px', display: 'flex', alignItems: 'center', gap: 5, borderBottom: `1px solid ${border}`, marginBottom: 4 }}>
          <div style={{ width: 18, height: 18, borderRadius: 5, background: accent, flexShrink: 0 }} />
          {settings.sidebar === 'full' && <span style={{ fontSize: 9, fontWeight: 900, color: txt, whiteSpace: 'nowrap' }}>ShopHub</span>}
        </div>
        {sideItems.map(({ icon: Icon, label }, i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: `5px ${settings.sidebar === 'icons' ? 7 : 10}px`, borderRadius: 6, margin: '0 4px', background: i === 0 ? `${accent}18` : 'transparent', cursor: 'default' }}>
            <Icon size={11} style={{ color: i === 0 ? accent : sub, flexShrink: 0 }} />
            {settings.sidebar === 'full' && <span style={{ fontSize: 9, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? txt : sub, whiteSpace: 'nowrap' }}>{label}</span>}
          </div>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Header bar */}
        <div style={{ padding: `${pad * 0.7}px ${pad}px`, borderBottom: `1px solid ${border}`, background: card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 900, color: txt }}>Dashboard</span>
          <div style={{ width: 18, height: 18, borderRadius: r * 0.6, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={9} color="white" />
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5, padding: `${pad * 0.8}px ${pad}px ${pad * 0.6}px` }}>
          {[
            { label: 'Revenue', val: '$84k', up: true },
            { label: 'Orders',  val: '1.2k', up: true },
            { label: 'Returns', val: '2.1%', up: false },
          ].map(({ label, val, up }) => (
            <div key={label} style={{ background: card, border: `1px solid ${border}`, borderRadius: r * 0.7, padding: `${pad * 0.6}px ${pad * 0.8}px` }}>
              <p style={{ fontSize: 7, color: sub, marginBottom: 2 }}>{label}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <span style={{ fontSize: 10, fontWeight: 900, color: txt }}>{val}</span>
                <ArrowUpRight size={8} style={{ color: up ? '#22c55e' : '#ef4444', transform: up ? 'none' : 'rotate(90deg)' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Table preview */}
        <div style={{ margin: `0 ${pad}px`, background: card, border: `1px solid ${border}`, borderRadius: r * 0.7, overflow: 'hidden', flex: 1 }}>
          <div style={{ padding: `${pad * 0.6}px ${pad * 0.8}px`, borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 9, fontWeight: 800, color: txt }}>Recent Orders</span>
            <span style={{ fontSize: 7, color: accent, fontWeight: 700 }}>View all</span>
          </div>
          {['ORD-9841', 'ORD-9840', 'ORD-9839'].map((id, i) => {
            const statColors = ['#22c55e', '#06b6d4', '#8b5cf6']
            const statLabels = ['Delivered', 'Shipped', 'Processing']
            return (
              <div key={id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${pad * 0.55}px ${pad * 0.8}px`, borderBottom: i < 2 ? `1px solid ${border}` : 'none', background: i % 2 === 0 ? 'transparent' : isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  {settings.showAvatars && (
                    <div style={{ width: 14, height: 14, borderRadius: r * 0.4, background: accent, opacity: 0.8 + i * 0.05, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 6, fontWeight: 900, color: 'white' }}>N</span>
                    </div>
                  )}
                  <span style={{ fontSize: 8, fontWeight: 700, color: txt, fontFamily: 'monospace' }}>{id}</span>
                </div>
                <span style={{ fontSize: 7, fontWeight: 700, color: statColors[i], background: `${statColors[i]}18`, padding: '1px 5px', borderRadius: 99 }}>{statLabels[i]}</span>
              </div>
            )
          })}
        </div>

        <div style={{ height: pad * 0.8 }} />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   SECTION WRAPPER
═══════════════════════════════════════════════════════ */

interface SectionProps {
  title: string
  subtitle?: string
  icon: React.ElementType
  accent: string
  children: React.ReactNode
  animDelay?: number
}

function Section({ title, subtitle, icon: Icon, accent, children, animDelay = 0 }: SectionProps) {
  return (
    <div
      className="appear-section"
      style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', animationDelay: `${animDelay}ms` }}
    >
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: `${accent}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {/* <Icon size={15} style={{ color: accent }} /> */}
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 800, color: '#1a1a1a', lineHeight: 1 }}>{title}</p>
          {subtitle && <p style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>{subtitle}</p>}
        </div>
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   TOGGLE
═══════════════════════════════════════════════════════ */

interface ToggleProps {
  value: boolean
  onChange: (v: boolean) => void
  accent: string
}

function Toggle({ value, onChange, accent }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{ width: 40, height: 22, borderRadius: 11, background: value ? accent : '#e5e7eb', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}
    >
      <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: value ? 21 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </button>
  )
}

/* ═══════════════════════════════════════════════════════
   SAVED TOAST
═══════════════════════════════════════════════════════ */

interface ToastProps {
  visible: boolean
  accent: string
}

function SavedToast({ visible, accent }: ToastProps) {
  return (
    <div style={{
      position: 'fixed', bottom: 28, left: '50%', transform: `translateX(-50%) translateY(${visible ? 0 : 80}px)`,
      background: '#1a1a1a', color: 'white', borderRadius: 14, padding: '10px 20px',
      display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700,
      boxShadow: '0 8px 32px rgba(0,0,0,0.22)', zIndex: 100, transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)', pointerEvents: 'none',
    }}>
      <CheckCircle2 size={15} style={{ color: '#22c55e' }} />
      Appearance saved
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════ */

export default function AppearancePage() {
  const [settings, setSettings] = useState<AppearanceSettings>(DEFAULTS)
  const [saved, setSaved] = useState<boolean>(false)
  const [previewMode, setPreviewMode] = useState<ThemeMode>('light')

  const set = useCallback(<K extends keyof AppearanceSettings>(key: K, val: AppearanceSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: val }))
  }, [])

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleReset = () => setSettings(DEFAULTS)

  const acc = settings.accent

  const previewSettings: AppearanceSettings = {
    ...settings,
    theme: previewMode,
  }

  /* ── THEME MODE OPTIONS ── */
  const themeModes: Array<{ id: ThemeMode; icon: React.ElementType; label: string; sub: string }> = [
    { id: 'light',  icon: Sun,     label: 'Light',  sub: 'Clean & bright'  },
    { id: 'dark',   icon: Moon,    label: 'Dark',   sub: 'Easy on the eyes' },
    { id: 'system', icon: Monitor, label: 'System', sub: 'Follows OS'       },
  ]

  /* ── DENSITY OPTIONS ── */
  const densityModes: Array<{ id: DensityMode; icon: React.ElementType; label: string; rows: number }> = [
    { id: 'compact',     icon: Rows3,       label: 'Compact',     rows: 4 },
    { id: 'default',     icon: AlignJustify, label: 'Default',    rows: 3 },
    { id: 'comfortable', icon: Maximize2,    label: 'Comfortable', rows: 2 },
  ]

  /* ── RADIUS OPTIONS ── */
  const radiusModes: Array<{ id: RadiusMode; label: string; r: number }> = [
    { id: 'sharp', label: 'Sharp', r: 3 },
    { id: 'soft',  label: 'Soft',  r: 10 },
    { id: 'round', label: 'Round', r: 20 },
  ]

  /* ── SIDEBAR OPTIONS ── */
  const sidebarModes: Array<{ id: SidebarStyle; label: string; sub: string }> = [
    { id: 'full',  label: 'Full',       sub: 'Labels + icons' },
    { id: 'icons', label: 'Icons only', sub: 'Minimal'        },
    { id: 'mini',  label: 'Mini',       sub: 'Compact labels' },
  ]

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: '#f7f7f7', minHeight: '100vh' }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
        .appear-section { animation: fadeUp 0.25s ease both; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 99px; }
        .option-card:hover { border-color: #ddd !important; }
        .accent-dot:hover { transform: scale(1.15) !important; }
        .preview-tab:hover { background: #f5f5f5 !important; }
      `}</style>

      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '28px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── HEADER ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', animation: 'fadeUp 0.2s ease' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: acc, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 12px ${acc}40`, transition: 'background 0.3s, box-shadow 0.3s' }}>
                <Palette size={16} color="white" />
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.6px', margin: 0 }}>Appearance</h1>
            </div>
            <p style={{ fontSize: 13, color: '#aaa', margin: 0 }}>Customize the look and feel of your workspace</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleReset}
              style={{ padding: '9px 16px', borderRadius: 12, background: 'white', border: '1px solid #eee', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#777', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'all 0.15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#ddd')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#eee')}
            >
              <RotateCcw size={13} style={{ color: '#bbb' }} /> Reset
            </button>
            <button
              onClick={handleSave}
              style={{ padding: '9px 20px', borderRadius: 12, background: acc, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: 6, boxShadow: `0 4px 14px ${acc}40`, transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88' }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
            >
              <Save size={13} /> Save changes
            </button>
          </div>
        </div>

        {/* ── BODY GRID ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, alignItems: 'start' }}>

          {/* LEFT — Settings panels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* ── THEME MODE ── */}
            <Section title="Theme Mode" subtitle="Choose light, dark, or follow your system" icon={Sun} accent={acc} animDelay={40}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {themeModes.map(({ id, icon: Icon, label, sub }) => {
                  const active = settings.theme === id
                  return (
                    <button
                      key={id}
                      onClick={() => set('theme', id)}
                      className="option-card"
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 16, borderRadius: 16, border: active ? `2px solid ${acc}` : '2px solid #eee', background: active ? `${acc}06` : 'white', cursor: 'pointer', transition: 'all 0.18s', boxShadow: active ? `0 4px 16px ${acc}18` : 'none', position: 'relative' }}
                    >
                      {/* Mini theme illustration */}
                      <div style={{ width: 56, height: 38, borderRadius: 10, overflow: 'hidden', border: '1px solid #eee', display: 'flex' }}>
                        <div style={{ width: 14, background: id === 'dark' ? '#181818' : id === 'system' ? 'linear-gradient(135deg, #fff 50%, #181818 50%)' : '#fff', borderRight: '1px solid #eee', flexShrink: 0 }} />
                        <div style={{ flex: 1, background: id === 'dark' ? '#111' : id === 'system' ? '#ddd' : '#f7f7f7', display: 'flex', flexDirection: 'column', gap: 3, padding: 5 }}>
                          <div style={{ height: 4, background: id === 'dark' ? '#2a2a2a' : '#e5e5e5', borderRadius: 3 }} />
                          <div style={{ display: 'flex', gap: 3 }}>
                            <div style={{ flex: 1, height: 14, background: id === 'dark' ? '#1e1e1e' : '#fff', borderRadius: 4 }} />
                            <div style={{ flex: 1, height: 14, background: id === 'dark' ? '#1e1e1e' : '#fff', borderRadius: 4 }} />
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: 12, fontWeight: 800, color: active ? acc : '#1a1a1a', marginBottom: 2 }}>{label}</p>
                        <p style={{ fontSize: 10, color: '#aaa' }}>{sub}</p>
                      </div>
                      {active && (
                        <div style={{ position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: '50%', background: acc, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={10} color="white" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </Section>

            {/* ── ACCENT COLOR ── */}
            <Section title="Accent Color" subtitle="Used for buttons, highlights, and indicators" icon={Paintbrush} accent={acc} animDelay={80}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                {ACCENT_COLORS.map((c) => {
                  const active = settings.accent === c.value
                  return (
                    <button
                      key={c.value}
                      onClick={() => set('accent', c.value)}
                      className="accent-dot"
                      title={c.name}
                      style={{ width: 34, height: 34, borderRadius: '50%', background: c.value, border: active ? `3px solid ${c.value}` : '3px solid transparent', outline: active ? `2px solid ${c.value}40` : 'none', outlineOffset: 2, cursor: 'pointer', transition: 'transform 0.15s', transform: active ? 'scale(1.1)' : 'scale(1)', boxShadow: active ? `0 4px 12px ${c.value}50` : '0 2px 6px rgba(0,0,0,0.12)', position: 'relative' }}
                    >
                      {active && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={13} color="white" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Custom hex input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: settings.accent, border: '1px solid #eee', flexShrink: 0, boxShadow: `0 2px 8px ${acc}30` }} />
                <div style={{ flex: 1, position: 'relative' }}>
                  <Hash size={12} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#bbb', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    maxLength={7}
                    value={settings.accent}
                    onChange={(e) => {
                      const v = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) set('accent', v)
                    }}
                    style={{ width: '100%', paddingLeft: 30, paddingRight: 14, paddingTop: 9, paddingBottom: 9, background: '#fafafa', border: '1px solid #eee', borderRadius: 12, fontSize: 13, color: '#1a1a1a', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                    onFocus={(e) => (e.target.style.borderColor = acc)}
                    onBlur={(e) => (e.target.style.borderColor = '#eee')}
                  />
                </div>
                <input
                  type="color"
                  value={settings.accent}
                  onChange={(e) => set('accent', e.target.value)}
                  style={{ width: 40, height: 38, padding: 2, borderRadius: 10, border: '1px solid #eee', cursor: 'pointer', background: 'white' }}
                  title="Color picker"
                />
              </div>
            </Section>

            {/* ── TYPOGRAPHY ── */}
            <Section title="Typography" subtitle="Font style for the entire interface" icon={Type} accent={acc} animDelay={120}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {FONT_PAIRS.map((f) => {
                  const active = settings.font === f.id
                  return (
                    <button
                      key={f.id}
                      onClick={() => set('font', f.id)}
                      className="option-card"
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, border: active ? `2px solid ${acc}` : '2px solid #eee', background: active ? `${acc}06` : 'white', cursor: 'pointer', transition: 'all 0.18s', boxShadow: active ? `0 4px 14px ${acc}15` : 'none', textAlign: 'left', position: 'relative' }}
                    >
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: active ? `${acc}12` : '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 16, fontWeight: 900, color: active ? acc : '#888', fontFamily: f.stack }}>{f.display}</span>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 800, color: active ? acc : '#1a1a1a', marginBottom: 2 }}>{f.label}</p>
                        <p style={{ fontSize: 10, color: '#aaa' }}>{f.sub}</p>
                      </div>
                      {active && (
                        <div style={{ position: 'absolute', top: 8, right: 8, width: 16, height: 16, borderRadius: '50%', background: acc, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={9} color="white" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </Section>

            {/* ── LAYOUT ROW ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

              {/* Density */}
              <Section title="Density" subtitle="Spacing between elements" icon={Rows3} accent={acc} animDelay={160}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {densityModes.map(({ id, icon: Icon, label, rows }) => {
                    const active = settings.density === id
                    return (
                      <button
                        key={id}
                        onClick={() => set('density', id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, border: active ? `1.5px solid ${acc}` : '1.5px solid #eee', background: active ? `${acc}06` : 'white', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' }}
                      >
                        {/* Visual density indicator */}
                        <div style={{ width: 28, display: 'flex', flexDirection: 'column', gap: id === 'compact' ? 1.5 : id === 'default' ? 2.5 : 4, flexShrink: 0 }}>
                          {Array.from({ length: rows }).map((_, i) => (
                            <div key={i} style={{ height: 3, borderRadius: 2, background: active ? acc : '#ddd', opacity: 1 - i * 0.15 }} />
                          ))}
                        </div>
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 700, color: active ? acc : '#333', marginBottom: 1 }}>{label}</p>
                        </div>
                        {active && <Check size={12} style={{ marginLeft: 'auto', color: acc }} />}
                      </button>
                    )
                  })}
                </div>
              </Section>

              {/* Border Radius */}
              <Section title="Border Radius" subtitle="Corner style across UI" icon={Circle} accent={acc} animDelay={190}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {radiusModes.map(({ id, label, r }) => {
                    const active = settings.radius === id
                    return (
                      <button
                        key={id}
                        onClick={() => set('radius', id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, border: active ? `1.5px solid ${acc}` : '1.5px solid #eee', background: active ? `${acc}06` : 'white', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' }}
                      >
                        {/* Radius preview box */}
                        <div style={{ width: 26, height: 20, border: `2px solid ${active ? acc : '#ccc'}`, borderRadius: r, flexShrink: 0, background: active ? `${acc}10` : 'transparent', transition: 'all 0.2s' }} />
                        <p style={{ fontSize: 12, fontWeight: 700, color: active ? acc : '#333' }}>{label}</p>
                        {active && <Check size={12} style={{ marginLeft: 'auto', color: acc }} />}
                      </button>
                    )
                  })}
                </div>
              </Section>
            </div>

            {/* ── SIDEBAR STYLE ── */}
            <Section title="Sidebar Style" subtitle="Navigation layout for the left sidebar" icon={Layers} accent={acc} animDelay={220}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {sidebarModes.map(({ id, label, sub }) => {
                  const active = settings.sidebar === id
                  const w = id === 'full' ? 40 : id === 'icons' ? 14 : 28
                  return (
                    <button
                      key={id}
                      onClick={() => set('sidebar', id)}
                      className="option-card"
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 14, borderRadius: 16, border: active ? `2px solid ${acc}` : '2px solid #eee', background: active ? `${acc}06` : 'white', cursor: 'pointer', transition: 'all 0.18s', boxShadow: active ? `0 4px 14px ${acc}15` : 'none', position: 'relative' }}
                    >
                      {/* Sidebar illustration */}
                      <div style={{ width: 58, height: 40, borderRadius: 10, border: '1px solid #eee', display: 'flex', overflow: 'hidden' }}>
                        <div style={{ width: w, background: '#f0f0f0', borderRight: '1px solid #eee', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4, padding: 5 }}>
                          <div style={{ height: 4, background: active ? acc : '#ddd', borderRadius: 2, opacity: 0.9 }} />
                          {[0.7, 0.5, 0.5].map((op, i) => (
                            <div key={i} style={{ height: 3, background: '#ddd', borderRadius: 2, opacity: op }} />
                          ))}
                        </div>
                        <div style={{ flex: 1, background: '#f9f9f9', display: 'flex', flexDirection: 'column', gap: 3, padding: 5 }}>
                          <div style={{ height: 3, background: '#eee', borderRadius: 2 }} />
                          <div style={{ display: 'flex', gap: 2, flex: 1 }}>
                            <div style={{ flex: 1, background: '#eee', borderRadius: 3 }} />
                            <div style={{ flex: 1, background: '#eee', borderRadius: 3 }} />
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: 12, fontWeight: 800, color: active ? acc : '#1a1a1a', marginBottom: 2 }}>{label}</p>
                        <p style={{ fontSize: 10, color: '#aaa' }}>{sub}</p>
                      </div>
                      {active && (
                        <div style={{ position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: '50%', background: acc, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={10} color="white" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </Section>

            {/* ── PREFERENCES ── */}
            <Section title="Preferences" subtitle="Additional interface options" icon={SlidersHorizontal} accent={acc} animDelay={260}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {([
                  { key: 'animations',    label: 'Interface animations',   sub: 'Enable transition effects and micro-interactions' },
                  { key: 'compactTables', label: 'Compact tables',         sub: 'Reduce row height in data tables' },
                  { key: 'showAvatars',   label: 'Show user avatars',      sub: 'Display avatar thumbnails in lists and tables' },
                ] as Array<{ key: keyof AppearanceSettings; label: string; sub: string }>).map(({ key, label, sub }, i, arr) => (
                  <div
                    key={key}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < arr.length - 1 ? '1px solid #f5f5f5' : 'none', gap: 16 }}
                  >
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 2 }}>{label}</p>
                      <p style={{ fontSize: 11, color: '#aaa' }}>{sub}</p>
                    </div>
                    <Toggle value={settings[key] as boolean} onChange={(v) => set(key, v)} accent={acc} />
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* RIGHT — Sticky live preview */}
          <div style={{ position: 'sticky', top: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Preview card */}
            <div
              className="appear-section"
              style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', animationDelay: '0ms' }}
            >
              {/* Header */}
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 9, background: `${acc}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Eye size={13} style={{ color: acc }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#1a1a1a' }}>Live Preview</span>
                </div>
                {/* Theme toggle for preview */}
                <div style={{ display: 'flex', background: '#f5f5f5', borderRadius: 10, padding: 3, gap: 2 }}>
                  {(['light', 'dark'] as ThemeMode[]).map((m) => {
                    const Icon = m === 'light' ? Sun : Moon
                    const active = previewMode === m
                    return (
                      <button
                        key={m}
                        onClick={() => setPreviewMode(m)}
                        className="preview-tab"
                        style={{ padding: '5px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', background: active ? 'white' : 'transparent', fontSize: 11, fontWeight: 700, color: active ? '#1a1a1a' : '#aaa', display: 'flex', alignItems: 'center', gap: 4, boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.15s' }}
                      >
                        <Icon size={10} />{m.charAt(0).toUpperCase() + m.slice(1)}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Preview area */}
              <div style={{ padding: 16, background: '#f7f7f7' }}>
                <div style={{ height: 340, borderRadius: 14, overflow: 'hidden', border: '1px solid #e5e5e5', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                  <MiniPreview settings={previewSettings} />
                </div>
              </div>

              {/* Active settings summary */}
              <div style={{ padding: '10px 18px 16px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {[
                  { label: settings.theme,   color: '#64748b' },
                  { label: settings.density, color: '#3b82f6' },
                  { label: settings.radius,  color: '#7c3aed' },
                  { label: settings.sidebar, color: '#0891b2' },
                  { label: settings.font,    color: '#d97706' },
                ].map(({ label, color }) => (
                  <span key={label} style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 99, background: `${color}12`, color, textTransform: 'capitalize' }}>
                    {label}
                  </span>
                ))}
                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 99, background: `${acc}12`, color: acc }}>
                  {settings.accent}
                </span>
              </div>
            </div>

            {/* Color swatch card */}
            <div
              className="appear-section"
              style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 20, padding: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', animationDelay: '60ms' }}
            >
              <p style={{ fontSize: 11, fontWeight: 800, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Color Palette</p>
              {/* Gradient swatch from accent */}
              <div style={{ height: 6, borderRadius: 99, background: `linear-gradient(to right, ${acc}20, ${acc}, ${acc}80)`, marginBottom: 14 }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {[
                  { label: 'Primary',    bg: acc,        text: 'white' },
                  { label: 'Light',      bg: `${acc}18`, text: acc },
                  { label: 'Success',    bg: '#dcfce7',  text: '#16a34a' },
                  { label: 'Warning',    bg: '#fef3c7',  text: '#d97706' },
                  { label: 'Error',      bg: '#fee2e2',  text: '#dc2626' },
                  { label: 'Info',       bg: '#dbeafe',  text: '#2563eb' },
                  { label: 'Neutral',    bg: '#f1f5f9',  text: '#64748b' },
                  { label: 'Dark',       bg: '#1a1a1a',  text: 'white' },
                ].map(({ label, bg, text }) => (
                  <div key={label} style={{ background: bg, borderRadius: 10, padding: '8px 6px', textAlign: 'center' }}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: text }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Save reminder */}
            <div style={{
              padding: '12px 16px', borderRadius: 16, background: `${acc}08`, border: `1px solid ${acc}20`,
              display: 'flex', alignItems: 'center', gap: 10, animation: 'fadeUp 0.25s ease 300ms both'
            }}>
              <Sparkles size={14} style={{ color: acc, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a' }}>Changes preview instantly</p>
                <p style={{ fontSize: 11, color: '#aaa' }}>Click Save to apply to your account</p>
              </div>
              <button
                onClick={handleSave}
                style={{ padding: '7px 14px', borderRadius: 10, background: acc, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 800, color: 'white', whiteSpace: 'nowrap', transition: 'opacity 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      <SavedToast visible={saved} accent={acc} />
    </div>
  )
}