'use client'

import { ShoppingBag, Heart, User, Search, X, ChevronDown, Menu, Zap } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

interface HeaderProps {
  cartCount?: number
  wishlistCount?: number
}

const NAV = [
  { label: 'New In', href: '/new', sub: ['Just Arrived', 'This Week', 'Trending Now'] },
  { label: 'Products', href: '/products', sub: ['All Products', 'Best Sellers', 'Deals & Offers'] },
  { label: 'Categories', href: '/categories', sub: ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books'] },
  { label: 'Brands', href: '/brands' },
  { label: 'Sale', href: '/sale', highlight: true },
]

const ANNOUNCEMENTS = [
  '✦ Free shipping on all orders over $50',
  '✦ New arrivals every Monday — be the first',
  '✦ Buy now, pay later with 0% interest',
]

export default function Header({ cartCount = 0, wishlistCount = 0 }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [announcementIdx, setAnnouncementIdx] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [activeNav, setActiveNav] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const navTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const t = setInterval(() => setAnnouncementIdx(i => (i + 1) % ANNOUNCEMENTS.length), 3500)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50)
  }, [searchOpen])

  const onNavEnter = (label: string) => {
    if (navTimeout.current) clearTimeout(navTimeout.current)
    setActiveNav(label)
  }
  const onNavLeave = () => { navTimeout.current = setTimeout(() => setActiveNav(null), 120) }

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-foreground text-background text-center text-xs font-medium py-2 px-4 tracking-wide">
        <span className="hidden sm:inline">{ANNOUNCEMENTS[announcementIdx]}</span>
        <span className="sm:hidden">✦ Free shipping over $50</span>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 bg-background transition-shadow duration-200 border-b border-border ${scrolled ? 'shadow-md shadow-black/4' : ''}`}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-14 sm:h-16 gap-3">

            {/* Mobile hamburger */}
            <button className="lg:hidden p-1.5 -ml-1.5 text-foreground/60 hover:text-foreground" onClick={() => setMobileOpen(v => !v)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5 shrink-0 group">
              <span className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <Zap size={14} className="text-white fill-white" />
              </span>
              <span className="font-black text-[1.1rem] tracking-tight">shop<span className="text-primary">hub</span></span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5 ml-6 flex-1">
              {NAV.map(item => (
                <div key={item.label} className="relative" onMouseEnter={() => item.sub && onNavEnter(item.label)} onMouseLeave={onNavLeave}>
                  <Link href={item.href} className={`flex items-center gap-0.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${item.highlight ? 'text-primary font-bold' : 'text-foreground/70 hover:text-foreground hover:bg-secondary'}`}>
                    {item.label}
                    {item.sub && <ChevronDown size={13} className="opacity-40 mt-0.5" />}
                  </Link>
                  {item.sub && activeNav === item.label && (
                    <div className="absolute top-full left-0 mt-1.5 w-48 bg-card border border-border rounded-2xl shadow-xl py-1.5 z-50" onMouseEnter={() => onNavEnter(item.label)} onMouseLeave={onNavLeave}>
                      {item.sub.map(s => (
                        <Link key={s} href="#" className="block px-4 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-secondary transition-colors rounded-xl mx-1">{s}</Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex-1 lg:hidden" />

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button onClick={() => setSearchOpen(v => !v)} className="p-2 text-foreground/60 hover:text-foreground hover:bg-secondary rounded-xl transition-colors">
                <Search size={20} />
              </button>
              <Link href="/wishlist" className="hidden sm:flex relative p-2 text-foreground/60 hover:text-foreground hover:bg-secondary rounded-xl transition-colors">
                <Heart size={20} />
                {wishlistCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />}
              </Link>
              <Link href="/profile" className="hidden sm:flex p-2 text-foreground/60 hover:text-foreground hover:bg-secondary rounded-xl transition-colors">
                <User size={20} />
              </Link>
              <Link href="/cart" className="relative flex items-center gap-1.5 pl-2.5 pr-3 py-2 bg-foreground text-background rounded-xl text-sm font-semibold hover:bg-foreground/85 active:scale-[0.97] transition-all ml-0.5">
                <ShoppingBag size={17} />
                <span className="hidden sm:inline text-sm">Bag</span>
                {cartCount > 0 && <span className="bg-primary text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">{cartCount}</span>}
              </Link>
            </div>
          </div>

          {/* Search panel */}
          {searchOpen && (
            <div className="pb-4 pt-1 border-t border-border/50 animate-in slide-in-from-top-1 duration-150">
              <div className="relative mt-3">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input ref={searchRef} type="text" placeholder="Search products, brands…" className="w-full bg-secondary border border-transparent rounded-xl py-3 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground" />
                <button onClick={() => setSearchOpen(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X size={16} /></button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {['Wireless Headphones', 'Smart Watch', 'Gaming Mouse', 'Laptop Bag'].map(q => (
                  <button key={q} className="text-xs px-3 py-1.5 bg-secondary hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">{q}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-0.5 animate-in slide-in-from-top-2 duration-150">
            {NAV.map(item => (
              <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)} className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${item.highlight ? 'text-primary font-bold' : 'text-foreground/75 hover:bg-secondary'}`}>{item.label}</Link>
            ))}
            <div className="mt-2 pt-3 border-t border-border flex gap-2">
              <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl text-sm text-foreground/70 hover:bg-secondary"><User size={16} />Account</Link>
              <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl text-sm text-foreground/70 hover:bg-secondary"><Heart size={16} />Wishlist</Link>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Tab Bar */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 bg-card/96 backdrop-blur-xl border-t border-border">
        <div className="grid grid-cols-4 h-16">
          {[
            { label: 'Home', href: '/', emoji: '🏠' },
            { label: 'Explore', href: '/products', emoji: '🔍' },
            { label: 'Saved', href: '/wishlist', emoji: '♡', badge: wishlistCount },
            { label: 'Account', href: '/profile', emoji: '👤' },
          ].map(t => (
            <Link key={t.label} href={t.href} className="relative flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-primary active:scale-95 transition-all">
              <span className="text-[21px] leading-none">{t.emoji}</span>
              <span className="text-[10px] font-medium">{t.label}</span>
              {t.badge && t.badge > 0 && <span className="absolute top-2 right-5 w-2 h-2 bg-primary rounded-full" />}
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}