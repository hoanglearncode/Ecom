'use client'

import {
  ShoppingBag, Heart, User, Search, X, ChevronDown,
  Menu, Zap, LogOut, Package, Bell,
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useCartTotalItems } from '@/lib/stores/cart-store'
import { useWishlistTotalItems } from '@/lib/stores/wishlist-store'
import { useCurrentUser, useIsAuthenticated, useAuthStore } from '@/lib/stores/auth-store'
import { cn } from '@/lib/utils'

// ─── Nav config ──────────────────────────────────────────────────────────────

const NAV = [
  {
    label: 'Hàng Mới',
    href: '/new',
    sub: [
      { label: 'Vừa Về', href: '/new' },
      { label: 'Trending', href: '/products?sort=popular' },
    ],
  },
  {
    label: 'Sản Phẩm',
    href: '/products',
    sub: [
      { label: 'Tất Cả Sản Phẩm', href: '/products' },
      { label: 'Bán Chạy Nhất', href: '/products?sort=popular' },
      { label: 'Thương Hiệu', href: '/brands' },
    ],
  },
  {
    label: 'Danh Mục',
    href: '/categories',
    sub: [
      { label: 'Tất Cả Danh Mục', href: '/categories' },
      { label: 'Điện Tử', href: '/categories?parent=dien-tu' },
      { label: 'Thời Trang', href: '/categories?parent=thoi-trang' },
      { label: 'Nhà & Sống', href: '/categories?parent=nha-cua' },
      { label: 'Làm Đẹp', href: '/categories?parent=lam-dep' },
    ],
  },
  { label: 'Flash Sale', href: '/sale', highlight: true },
]

const ANNOUNCEMENTS = [
  '✦ Miễn phí vận chuyển cho đơn hàng trên 500.000₫',
  '✦ Hàng mới về mỗi thứ Hai – Đừng bỏ lỡ',
  '✦ Mua trước trả sau với 0% lãi suất',
]

const SEARCH_SUGGESTIONS = [
  'Tai nghe không dây',
  'Đồng hồ thông minh',
  'Chuột gaming',
  'Túi laptop',
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function Header() {
  const pathname = usePathname()
  const cartCount    = useCartTotalItems()
  const wishlistCount = useWishlistTotalItems()
  const user         = useCurrentUser()
  const isAuth       = useIsAuthenticated()
  const logout       = useAuthStore((s) => s.logout)

  const [searchOpen,      setSearchOpen]      = useState(false)
  const [announcementIdx, setAnnouncementIdx] = useState(0)
  const [scrolled,        setScrolled]        = useState(false)
  const [activeNav,       setActiveNav]       = useState<string | null>(null)
  const [mobileOpen,      setMobileOpen]      = useState(false)
  const [userMenuOpen,    setUserMenuOpen]    = useState(false)
  const [searchQuery,     setSearchQuery]     = useState('')

  const searchRef  = useRef<HTMLInputElement>(null)
  const navTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const userRef    = useRef<HTMLDivElement>(null)

  // Rotating announcements
  useEffect(() => {
    const t = setInterval(
      () => setAnnouncementIdx((i) => (i + 1) % ANNOUNCEMENTS.length),
      3500,
    )
    return () => clearInterval(t)
  }, [])

  // Scroll shadow
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Auto-focus search
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50)
  }, [searchOpen])

  // Close user menu on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node))
        setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  const onNavEnter = (label: string) => {
    if (navTimeout.current) clearTimeout(navTimeout.current)
    setActiveNav(label)
  }
  const onNavLeave = () => {
    navTimeout.current = setTimeout(() => setActiveNav(null), 120)
  }

  const isNavActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href)

  const initials = user?.name
    ? user.name.split(' ').slice(-2).map((n) => n[0]).join('').toUpperCase()
    : 'U'

  return (
    <>
      {/* ── Announcement bar ── */}
      <div className="bg-foreground text-background text-center text-xs font-medium py-2 px-4 tracking-wide">
        <span className="hidden sm:inline">{ANNOUNCEMENTS[announcementIdx]}</span>
        <span className="sm:hidden">✦ Miễn phí ship trên 500k</span>
      </div>

      {/* ── Main header ── */}
      <header
        className={cn(
          'sticky top-0 z-50 bg-background transition-shadow duration-200 border-b border-border',
          scrolled && 'shadow-md shadow-black/4',
        )}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-14 sm:h-16 gap-3">

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-1.5 -ml-1.5 text-foreground/60 hover:text-foreground"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5 shrink-0 group">
              <span className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Zap size={14} className="text-white fill-white" />
              </span>
              <span className="font-black text-[1.1rem] tracking-tight">
                shop<span className="text-primary">hub</span>
              </span>
            </Link>

            {/* ── Desktop nav ── */}
            <nav className="hidden lg:flex items-center gap-0.5 ml-6 flex-1">
              {NAV.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.sub && onNavEnter(item.label)}
                  onMouseLeave={onNavLeave}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-0.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      item.highlight
                        ? 'text-primary font-bold'
                        : isNavActive(item.href)
                          ? 'text-foreground bg-secondary font-semibold'
                          : 'text-foreground/70 hover:text-foreground hover:bg-secondary',
                    )}
                  >
                    {item.label}
                    {item.sub && <ChevronDown size={13} className="opacity-40 mt-0.5" />}
                  </Link>

                  {/* Dropdown */}
                  {item.sub && activeNav === item.label && (
                    <div
                      className="absolute top-full left-0 mt-1.5 w-52 bg-card border border-border rounded-2xl shadow-xl py-1.5 z-50"
                      onMouseEnter={() => onNavEnter(item.label)}
                      onMouseLeave={onNavLeave}
                    >
                      {item.sub.map((s) => (
                        <Link
                          key={s.label}
                          href={s.href}
                          className="block px-4 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-secondary transition-colors rounded-xl mx-1"
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex-1 lg:hidden" />

            {/* ── Action icons ── */}
            <div className="flex items-center gap-1">

              {/* Search */}
              <button
                onClick={() => setSearchOpen((v) => !v)}
                className="p-2 text-foreground/60 hover:text-foreground hover:bg-secondary rounded-xl transition-colors"
                aria-label="Tìm kiếm"
              >
                <Search size={20} />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="hidden sm:flex relative p-2 text-foreground/60 hover:text-foreground hover:bg-secondary rounded-xl transition-colors"
                aria-label="Yêu thích"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center px-0.5">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* User avatar / dropdown */}
              {isAuth && user ? (
                <div className="relative hidden sm:block" ref={userRef}>
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-1.5 p-1.5 text-foreground/60 hover:text-foreground hover:bg-secondary rounded-xl transition-colors"
                    aria-label="Tài khoản"
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center text-[11px] font-black text-primary">
                      {initials}
                    </div>
                    <ChevronDown size={13} className="opacity-50" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-2xl shadow-xl py-1.5 z-50">
                      <div className="px-4 py-2.5 border-b border-border mb-1">
                        <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        <span className="mt-1 inline-block text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full capitalize">
                          {user.tier}
                        </span>
                      </div>
                      {[
                        { label: 'Tài khoản của tôi', href: '/profile',  icon: User    },
                        { label: 'Đơn hàng',          href: '/orders',   icon: Package },
                        { label: 'Yêu thích',         href: '/wishlist', icon: Heart   },
                      ].map(({ label, href, icon: Icon }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-secondary transition-colors mx-1 rounded-xl"
                        >
                          <Icon size={15} className="shrink-0" />
                          {label}
                        </Link>
                      ))}
                      <div className="border-t border-border mt-1 pt-1">
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false) }}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors mx-1 rounded-xl w-full text-left"
                        >
                          <LogOut size={15} className="shrink-0" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-foreground/70 hover:text-foreground hover:bg-secondary rounded-xl transition-colors"
                  aria-label="Đăng nhập"
                >
                  <User size={16} />
                  <span>Đăng nhập</span>
                </Link>
              )}

              {/* Cart */}
              <Link
                href="/cart"
                className="relative flex items-center gap-1.5 pl-2.5 pr-3 py-2 bg-foreground text-background rounded-xl text-sm font-semibold hover:bg-foreground/85 active:scale-[0.97] transition-all ml-0.5"
                aria-label="Giỏ hàng"
              >
                <ShoppingBag size={17} />
                <span className="hidden sm:inline text-sm">Giỏ Hàng</span>
                {cartCount > 0 && (
                  <span className="bg-primary text-white text-[10px] font-black rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* ── Search panel ── */}
          {searchOpen && (
            <div className="pb-4 pt-1 border-t border-border/50 animate-in slide-in-from-top-1 duration-150">
              <div className="relative mt-3">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm, thương hiệu…"
                  className="w-full bg-secondary border border-transparent rounded-xl py-3 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      window.location.href = `/products?q=${encodeURIComponent(searchQuery.trim())}`
                    }
                    if (e.key === 'Escape') setSearchOpen(false)
                  }}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {SEARCH_SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => { setSearchQuery(q); searchRef.current?.focus() }}
                    className="text-xs px-3 py-1.5 bg-secondary hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Mobile nav drawer ── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-0.5 animate-in slide-in-from-top-2 duration-150">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  item.highlight
                    ? 'text-primary font-bold'
                    : isNavActive(item.href)
                      ? 'bg-secondary text-foreground font-semibold'
                      : 'text-foreground/75 hover:bg-secondary',
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 pt-3 border-t border-border">
              {isAuth && user ? (
                <div className="flex flex-col gap-0.5">
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-foreground/70 hover:bg-secondary"
                  >
                    <div className="w-6 h-6 rounded-md bg-primary/15 flex items-center justify-center text-[10px] font-black text-primary">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{user.name}</p>
                      <p className="text-[11px] text-muted-foreground capitalize">{user.tier}</p>
                    </div>
                  </Link>
                  <Link href="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-foreground/70 hover:bg-secondary">
                    <Package size={16} />Đơn hàng của tôi
                  </Link>
                  <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-foreground/70 hover:bg-secondary">
                    <Heart size={16} />Yêu thích {wishlistCount > 0 && `(${wishlistCount})`}
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileOpen(false) }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-left"
                  >
                    <LogOut size={16} />Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 flex-1 px-3 py-2.5 rounded-xl text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/15">
                    <User size={16} />Đăng nhập
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 flex-1 px-3 py-2.5 rounded-xl text-sm text-foreground/70 border border-border hover:bg-secondary">
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-card/96 backdrop-blur-xl border-t border-border">
        <div className="grid grid-cols-5 h-16">
          {[
            { label: 'Trang Chủ', href: '/',         icon: '🏠' },
            { label: 'Khám Phá',  href: '/products', icon: '🔍' },
            { label: 'Flash Sale',href: '/sale',      icon: '⚡', highlight: true },
            { label: 'Yêu Thích', href: '/wishlist',  icon: '♡', badge: wishlistCount },
            { label: 'Tài Khoản', href: '/profile',   icon: '👤' },
          ].map((t) => {
            const isActive = t.href === '/' ? pathname === '/' : pathname?.startsWith(t.href)
            return (
              <Link
                key={t.label}
                href={t.href}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary',
                  (t as { highlight?: boolean }).highlight && !isActive && 'text-orange-500',
                )}
              >
                <span className="text-[20px] leading-none">{t.icon}</span>
                <span className="text-[9px] font-medium">{t.label}</span>
                {(t as { badge?: number }).badge != null && (t as { badge?: number }).badge! > 0 && (
                  <span className="absolute top-2 right-4 w-2 h-2 bg-primary rounded-full" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
