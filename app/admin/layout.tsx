'use client'

import {
  LayoutDashboard, ShoppingBag, Users, Package, Tag,
  BarChart3, Settings, Bell, Search, ChevronDown,
  Menu, X, Zap, TrendingUp, Star, MessageSquare,
  Image, Layers, Globe, Shield, LogOut, ChevronRight,
  ChevronLeft, PanelLeftClose, PanelLeftOpen, Boxes,
  Megaphone, Ticket, Truck, RotateCcw, FileText,
  Palette, Database, Webhook, HelpCircle, ExternalLink,
  Sun, Moon, SlidersHorizontal, AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, createContext, useContext, useEffect, useRef } from 'react'

/* ═══════════════════════════════════════════════════════
   CONTEXT
═══════════════════════════════════════════════════════ */

const AdminCtx = createContext<{
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
}>({ collapsed: false, setCollapsed: () => {}, mobileOpen: false, setMobileOpen: () => {} })

/* ═══════════════════════════════════════════════════════
   NAV STRUCTURE
═══════════════════════════════════════════════════════ */

const NAV = [
  {
    group: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, badge: null },
      { href: '/admin/analytics', label: 'Analytics', icon: BarChart3, badge: null },
      { href: '/admin/reports', label: 'Reports', icon: FileText, badge: null },
    ],
  },
  {
    group: 'Commerce',
    items: [
      { href: '/admin/orders', label: 'Orders', icon: ShoppingBag, badge: '12' },
      { href: '/admin/products', label: 'Products', icon: Package, badge: null },
      { href: '/admin/inventory', label: 'Inventory', icon: Boxes, badge: '3', badgeColor: 'amber' },
      { href: '/admin/categories', label: 'Categories', icon: Layers, badge: null },
      { href: '/admin/brands', label: 'Brands', icon: Star, badge: null },
    ],
  },
  {
    group: 'Customers',
    items: [
      { href: '/admin/customers', label: 'Customers', icon: Users, badge: null },
      { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare, badge: '5', badgeColor: 'amber' },
      { href: '/admin/support', label: 'Support', icon: HelpCircle, badge: '2', badgeColor: 'red' },
    ],
  },
  {
    group: 'Marketing',
    items: [
      { href: '/admin/promotions', label: 'Promotions', icon: Tag, badge: null },
      { href: '/admin/campaigns', label: 'Campaigns', icon: Megaphone, badge: null },
      { href: '/admin/coupons', label: 'Coupons', icon: Ticket, badge: null },
      { href: '/admin/banners', label: 'Banners', icon: Image, badge: null },
    ],
  },
  {
    group: 'Logistics',
    items: [
      { href: '/admin/shipping', label: 'Shipping', icon: Truck, badge: null },
      { href: '/admin/returns', label: 'Returns', icon: RotateCcw, badge: '4', badgeColor: 'red' },
    ],
  },
  {
    group: 'System',
    items: [
      { href: '/admin/settings', label: 'Settings', icon: Settings, badge: null },
      { href: '/admin/appearance', label: 'Appearance', icon: Palette, badge: null },
      { href: '/admin/integrations', label: 'Integrations', icon: Webhook, badge: null },
      { href: '/admin/database', label: 'Database', icon: Database, badge: null },
    ],
  },
]

const ALERTS = [
  { id: 1, type: 'order', text: 'New order #SH-84291 received', time: '2m ago', read: false },
  { id: 2, type: 'stock', text: 'Sony WH-1000XM5 low stock (3 left)', time: '15m ago', read: false },
  { id: 3, type: 'review', text: 'New 1-star review needs attention', time: '1h ago', read: false },
  { id: 4, type: 'return', text: 'Return request #RT-2891 pending', time: '2h ago', read: true },
  { id: 5, type: 'system', text: 'Database backup completed successfully', time: '3h ago', read: true },
]

/* ═══════════════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════════════ */

function Sidebar() {
  const pathname = usePathname()
  const { collapsed, setCollapsed, setMobileOpen } = useContext(AdminCtx)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Overview', 'Commerce', 'Customers']))

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      next.has(group) ? next.delete(group) : next.add(group)
      return next
    })
  }

  return (
    <aside className={`flex flex-col h-full bg-[#0c0e14] border-r border-white/[0.06] transition-all duration-300 ease-in-out ${collapsed ? 'w-[60px]' : 'w-[240px]'} shrink-0`}>

      {/* Logo */}
      <div className={`flex items-center h-14 border-b border-white/[0.06] shrink-0 ${collapsed ? 'justify-center px-0' : 'px-5 gap-3'}`}>
        <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center shrink-0">
          <Zap size={14} className="text-white fill-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-white font-black text-sm leading-none">ShopHub</p>
            <p className="text-white/30 text-[9px] font-medium mt-0.5 tracking-widest uppercase">Admin</p>
          </div>
        )}
      </div>

      {/* Scrollable nav */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 scrollbar-none">
        {NAV.map(({ group, items }) => (
          <div key={group} className="mb-1">
            {/* Group label */}
            {!collapsed && (
              <button
                onClick={() => toggleGroup(group)}
                className="flex items-center justify-between w-full px-4 py-1.5 group"
              >
                <span className="text-[9px] font-black uppercase tracking-[0.12em] text-white/25 group-hover:text-white/40 transition-colors">{group}</span>
                <ChevronDown size={11} className={`text-white/20 group-hover:text-white/35 transition-all ${expandedGroups.has(group) ? '' : '-rotate-90'}`} />
              </button>
            )}
            {collapsed && <div className="mx-3 mb-1 h-px bg-white/[0.06]" />}

            {/* Nav items */}
            {(collapsed || expandedGroups.has(group)) && items.map(({ href, label, icon: Icon, badge, badgeColor }) => {
              const active = pathname === href || (href !== '/admin' && pathname?.startsWith(href))
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? label : undefined}
                  className={`group relative flex items-center gap-3 mx-2 rounded-xl transition-all duration-150 ${collapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5'} ${active ? 'bg-primary/15 text-primary' : 'text-white/50 hover:text-white/90 hover:bg-white/[0.06]'}`}
                >
                  {/* Active indicator */}
                  {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />}

                  <Icon size={16} className={`shrink-0 transition-colors ${active ? 'text-primary' : 'text-white/40 group-hover:text-white/70'}`} />

                  {!collapsed && (
                    <>
                      <span className={`flex-1 text-sm font-medium truncate ${active ? 'text-primary font-semibold' : ''}`}>{label}</span>
                      {badge && (
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                          badgeColor === 'red' ? 'bg-primary/20 text-primary' :
                          badgeColor === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-white/10 text-white/60'
                        }`}>{badge}</span>
                      )}
                    </>
                  )}

                  {/* Collapsed badge dot */}
                  {collapsed && badge && (
                    <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${badgeColor === 'red' ? 'bg-primary' : 'bg-amber-400'}`} />
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </div>

      {/* Bottom: user + collapse */}
      <div className="shrink-0 border-t border-white/[0.06]">
        {/* User */}
        <div className={`flex items-center gap-3 p-3 mx-2 my-2 rounded-xl hover:bg-white/[0.06] cursor-pointer transition-all group ${collapsed ? 'justify-center' : ''}`}>
          <div className="relative shrink-0">
            <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-[11px] font-black text-primary">A</div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0c0e14]" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white/80 text-xs font-semibold truncate">Admin User</p>
              <p className="text-white/30 text-[10px] truncate">admin@shophub.com</p>
            </div>
          )}
          {!collapsed && <LogOut size={14} className="text-white/20 group-hover:text-white/50 transition-colors shrink-0" />}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center gap-2 w-full px-4 py-3 text-white/25 hover:text-white/60 hover:bg-white/[0.04] transition-all border-t border-white/[0.06] ${collapsed ? 'justify-center' : ''}`}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <><PanelLeftClose size={16} /><span className="text-xs font-medium">Collapse</span></>}
        </button>
      </div>
    </aside>
  )
}

/* ═══════════════════════════════════════════════════════
   TOPBAR
═══════════════════════════════════════════════════════ */

function Topbar() {
  const pathname = usePathname()
  const { setMobileOpen } = useContext(AdminCtx)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const unread = ALERTS.filter(a => !a.read).length

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  // Breadcrumb from pathname
  const crumbs = (pathname ?? '/admin').replace('/admin', '').split('/').filter(Boolean)

  return (
    <header className="sticky top-0 z-30 h-14 bg-background/95 backdrop-blur-md border-b border-border flex items-center gap-4 px-4 sm:px-6 shrink-0">

      {/* Mobile hamburger */}
      <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 -ml-1 text-foreground/60 hover:text-foreground">
        <Menu size={20} />
      </button>

      {/* Breadcrumb */}
      <div className="hidden sm:flex items-center gap-1.5 text-sm min-w-0">
        <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors font-medium shrink-0">Admin</Link>
        {crumbs.map((crumb, i) => (
          <span key={crumb} className="flex items-center gap-1.5">
            <ChevronRight size={14} className="text-border shrink-0" />
            <span className={`capitalize font-medium ${i === crumbs.length - 1 ? 'text-foreground' : 'text-muted-foreground hover:text-foreground cursor-pointer'}`}>
              {crumb.replace(/-/g, ' ')}
            </span>
          </span>
        ))}
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className="flex items-center gap-1">
        {searchOpen ? (
          <div className="flex items-center gap-2 bg-secondary border border-border rounded-xl px-3 py-2">
            <Search size={15} className="text-muted-foreground shrink-0" />
            <input autoFocus type="text" placeholder="Search orders, products, customers…" className="bg-transparent text-sm w-48 sm:w-72 focus:outline-none placeholder:text-muted-foreground" onBlur={() => setSearchOpen(false)} />
            <kbd className="text-[10px] text-muted-foreground bg-background border border-border px-1.5 py-0.5 rounded-md font-mono">ESC</kbd>
          </div>
        ) : (
          <button onClick={() => setSearchOpen(true)} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all">
            <Search size={18} />
          </button>
        )}

        {/* Dark mode */}
        <button onClick={() => setDarkMode(v => !v)} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => setNotifOpen(v => !v)} className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all">
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-2xl shadow-2xl shadow-black/10 overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-foreground text-sm">Notifications</p>
                  {unread > 0 && <span className="bg-primary text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{unread}</span>}
                </div>
                <button className="text-xs font-bold text-primary hover:underline">Mark all read</button>
              </div>
              <div className="divide-y divide-border max-h-80 overflow-y-auto">
                {ALERTS.map(alert => (
                  <div key={alert.id} className={`flex items-start gap-3 px-4 py-3.5 hover:bg-secondary/50 cursor-pointer transition-colors ${!alert.read ? 'bg-primary/3' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!alert.read ? 'bg-primary' : 'bg-transparent border border-border'}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-snug ${!alert.read ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{alert.text}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-border">
                <Link href="/admin/notifications" className="text-xs font-bold text-primary hover:underline flex items-center gap-1" onClick={() => setNotifOpen(false)}>
                  View all notifications <ExternalLink size={11} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* View store */}
        <Link href="/" target="_blank" className="hidden sm:flex items-center gap-1.5 px-3 py-2 border border-border rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
          <Globe size={14} /> View Store
        </Link>
      </div>
    </header>
  )
}

/* ═══════════════════════════════════════════════════════
   LAYOUT
═══════════════════════════════════════════════════════ */

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <AdminCtx.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}>
      <div className="flex h-screen bg-background overflow-hidden">

        {/* Desktop sidebar */}
        <div className="hidden lg:flex flex-col h-full">
          <Sidebar />
        </div>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="relative flex flex-col h-full w-[240px] shadow-2xl">
              <Sidebar />
            </div>
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-2 text-white/60 hover:text-white bg-white/10 rounded-xl">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminCtx.Provider>
  )
}