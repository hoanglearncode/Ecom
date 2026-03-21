'use client'

import { ArrowRight, SlidersHorizontal, X, ChevronDown, Grid2x2, LayoutList, Flame, Clock, TrendingUp, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import ProductCard, { type ProductCardProps } from '@/components/product-card'

/* ─────────────────────── DATA ─────────────────────── */

const TABS = [
  { id: 'all', label: 'All New', icon: Flame },
  { id: 'this-week', label: 'This Week', icon: Clock },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'top-rated', label: 'Top Rated', icon: Star },
]

const FILTERS = {
  category: ['Electronics', 'Fashion', 'Home & Living', 'Sports', 'Books', 'Gaming'],
  price: ['Under $50', '$50 – $100', '$100 – $250', '$250 – $500', 'Over $500'],
  rating: ['4.5 & up', '4.0 & up', '3.5 & up'],
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
]

const SPOTLIGHT = {
  id: 's1',
  label: 'Drop of the Week',
  title: 'Sony WH-1000XM6',
  sub: "The world's best noise cancellation just got better. Adaptive silence, 40-hour battery, and sound that disappears into music.",
  price: '$349.99',
  originalPrice: '$399.99',
  badge: 'Just Dropped',
  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&h=700&fit=crop',
  rating: 4.9,
  reviews: 128,
}

const ALL_PRODUCTS: (ProductCardProps & { week?: boolean; trending?: boolean })[] = [
  { id: 'n1', title: 'Mechanical Keyboard TKL Pro', brand: 'KeyPro', image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop', price: 179.99, rating: 4.7, reviews: 89, badge: 'New', week: true, trending: true },
  { id: 'n2', title: 'Portable SSD 2TB Extreme', brand: 'StorageX', image: 'https://images.unsplash.com/photo-1531492898419-3a9aa15ebbd0?w=400&h=400&fit=crop', price: 149.99, originalPrice: 199.99, rating: 4.8, reviews: 203, week: true },
  { id: 'n3', title: 'Noise-Cancelling Earbuds Pro', brand: 'SoundMax', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop', price: 129.99, rating: 4.5, reviews: 447, week: true, trending: true },
  { id: 'n4', title: 'LED Ring Light Studio Kit', brand: 'StudioKit', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop', price: 59.99, originalPrice: 79.99, rating: 4.6, reviews: 312, badge: 'Sale', week: true },
  { id: 'n5', title: 'Smart Fitness Tracker Band', brand: 'FitPulse', image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=400&h=400&fit=crop', price: 89.99, rating: 4.4, reviews: 561, trending: true },
  { id: 'n6', title: 'Ultrawide Monitor 34"', brand: 'ViewMax', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop', price: 649.99, originalPrice: 799.99, rating: 4.9, reviews: 74, badge: 'Hot' },
  { id: 'n7', title: 'Wireless Charging Pad Duo', brand: 'ChargeFast', image: 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=400&h=400&fit=crop', price: 49.99, rating: 4.3, reviews: 892, week: true },
  { id: 'n8', title: 'Ergonomic Office Chair', brand: 'ErgoSeat', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=400&fit=crop', price: 399.99, originalPrice: 549.99, rating: 4.7, reviews: 156 },
  { id: 'n9', title: 'Smart Home Hub Mini', brand: 'HomeTech', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', price: 79.99, rating: 4.2, reviews: 334, week: true, trending: true },
  { id: 'n10', title: 'Carbon Fiber Laptop Sleeve', brand: 'CarryPro', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', price: 39.99, rating: 4.6, reviews: 728, badge: 'New' },
  { id: 'n11', title: 'Gaming Headset Surround', brand: 'SoundMax', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop', price: 119.99, originalPrice: 149.99, rating: 4.5, reviews: 215, trending: true },
  { id: 'n12', title: 'Compact Travel Tripod', brand: 'ShootPro', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop', price: 69.99, rating: 4.4, reviews: 189, week: true },
]

const DROP_DATES = [
  { date: 'Today', count: 4 },
  { date: 'Yesterday', count: 7 },
  { date: 'This Week', count: 23 },
  { date: 'Last Week', count: 41 },
]

/* ─────────────────────── PAGE ─────────────────────── */

export default function NewPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [sort, setSort] = useState('newest')
  const [sortOpen, setSortOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({ category: [], price: [], rating: [] })
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [expandedFilter, setExpandedFilter] = useState<string | null>('category')
  const sortRef = useRef<HTMLDivElement>(null)

  // Close sort dropdown on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const toggleFilter = (group: string, value: string) => {
    setSelectedFilters(prev => {
      const arr = prev[group]
      return { ...prev, [group]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] }
    })
  }

  const activeFilterCount = Object.values(selectedFilters).flat().length
  const clearFilters = () => setSelectedFilters({ category: [], price: [], rating: [] })

  const filteredProducts = ALL_PRODUCTS.filter(p => {
    if (activeTab === 'this-week') return p.week
    if (activeTab === 'trending') return p.trending
    if (activeTab === 'top-rated') return p.rating >= 4.6
    return true
  })

  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label ?? 'Sort'

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pb-20 sm:pb-0">

        {/* ══ PAGE HEADER ══ */}
        <div className="border-b border-border bg-background">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-5">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <span className="text-foreground font-medium">New In</span>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Fresh drops</p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-none">
                  New In
                </h1>
                <p className="text-muted-foreground mt-3 text-sm sm:text-base max-w-md">
                  Discover what just landed — new products added every week from your favourite brands.
                </p>
              </div>

              {/* Drop schedule pill */}
              <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                {DROP_DATES.map(d => (
                  <div key={d.date} className="shrink-0 flex flex-col items-center bg-secondary border border-border rounded-xl px-4 py-2.5 text-center">
                    <span className="text-lg font-black text-foreground">{d.count}</span>
                    <span className="text-[10px] text-muted-foreground font-medium">{d.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══ SPOTLIGHT DROP ══ */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="relative overflow-hidden rounded-3xl bg-secondary border border-border">
            <div className="grid lg:grid-cols-2 items-center">

              {/* Image side */}
              <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[240px] lg:min-h-[420px] bg-muted order-1 lg:order-2">
                <Image src={SPOTLIGHT.image} alt={SPOTLIGHT.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:hidden" />
                {/* Badge */}
                <div className="absolute top-4 left-4 bg-foreground text-background text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest">
                  {SPOTLIGHT.badge}
                </div>
              </div>

              {/* Text side */}
              <div className="p-7 sm:p-10 lg:p-14 order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-5">
                  <span className="w-4 h-px bg-primary" />
                  {SPOTLIGHT.label}
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight leading-tight mb-4">
                  {SPOTLIGHT.title}
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6 max-w-sm">
                  {SPOTLIGHT.sub}
                </p>

                {/* Stars */}
                <div className="flex items-center gap-2 mb-7">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={i < Math.floor(SPOTLIGHT.rating) ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'} />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-foreground">{SPOTLIGHT.rating}</span>
                  <span className="text-sm text-muted-foreground">({SPOTLIGHT.reviews} reviews)</span>
                </div>

                <div className="flex items-baseline gap-3 mb-7">
                  <span className="text-3xl font-black text-foreground">{SPOTLIGHT.price}</span>
                  <span className="text-base text-muted-foreground line-through">{SPOTLIGHT.originalPrice}</span>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    Save ${(parseFloat(SPOTLIGHT.originalPrice.slice(1)) - parseFloat(SPOTLIGHT.price.slice(1))).toFixed(0)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link href={`/products/${SPOTLIGHT.id}`} className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-xl font-bold text-sm hover:bg-foreground/85 active:scale-[0.97] transition-all">
                    Shop Now <ArrowRight size={15} />
                  </Link>
                  <button className="px-5 py-3 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-secondary active:scale-[0.97] transition-all">
                    Save to Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ TABS + TOOLBAR ══ */}
        <div className="sticky top-14 sm:top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">

            {/* Tabs — horizontal scroll on mobile */}
            <div className="flex gap-0 overflow-x-auto scrollbar-none border-b border-border">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 shrink-0 px-4 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
                    activeTab === id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === id ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                    {id === 'all' ? ALL_PRODUCTS.length : id === 'this-week' ? ALL_PRODUCTS.filter(p => p.week).length : id === 'trending' ? ALL_PRODUCTS.filter(p => p.trending).length : ALL_PRODUCTS.filter(p => p.rating >= 4.6).length}
                  </span>
                </button>
              ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-center gap-2">
                {/* Filter toggle */}
                <button
                  onClick={() => setFilterOpen(v => !v)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold border transition-colors ${filterOpen ? 'bg-foreground text-background border-foreground' : 'border-border text-foreground hover:bg-secondary'}`}
                >
                  <SlidersHorizontal size={15} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-primary text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">{activeFilterCount}</span>
                  )}
                </button>

                {/* Active filter chips */}
                <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto">
                  {Object.entries(selectedFilters).flatMap(([group, vals]) =>
                    vals.map(val => (
                      <button
                        key={group + val}
                        onClick={() => toggleFilter(group, val)}
                        className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/15 transition-colors"
                      >
                        {val} <X size={11} />
                      </button>
                    ))
                  )}
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground underline ml-1">Clear all</button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:block text-xs text-muted-foreground">{filteredProducts.length} products</span>

                {/* Sort */}
                <div className="relative" ref={sortRef}>
                  <button
                    onClick={() => setSortOpen(v => !v)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold border border-border hover:bg-secondary transition-colors"
                  >
                    {currentSortLabel}
                    <ChevronDown size={14} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {sortOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-52 bg-card border border-border rounded-2xl shadow-xl py-1.5 z-50">
                      {SORT_OPTIONS.map(o => (
                        <button
                          key={o.value}
                          onClick={() => { setSort(o.value); setSortOpen(false) }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors rounded-xl mx-0 ${sort === o.value ? 'text-primary font-semibold bg-primary/5' : 'text-foreground/75 hover:bg-secondary hover:text-foreground'}`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* View toggle — desktop only */}
                <div className="hidden sm:flex border border-border rounded-xl overflow-hidden">
                  <button onClick={() => setView('grid')} className={`p-2 ${view === 'grid' ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-secondary'} transition-colors`}>
                    <Grid2x2 size={16} />
                  </button>
                  <button onClick={() => setView('list')} className={`p-2 ${view === 'list' ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-secondary'} transition-colors`}>
                    <LayoutList size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ FILTER PANEL ══ */}
        {filterOpen && (
          <div className="border-b border-border bg-secondary/30">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {Object.entries(FILTERS).map(([group, options]) => (
                  <div key={group}>
                    <button
                      onClick={() => setExpandedFilter(expandedFilter === group ? null : group)}
                      className="flex items-center justify-between w-full mb-3"
                    >
                      <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">{group}</h3>
                      <ChevronDown size={14} className={`text-muted-foreground transition-transform ${expandedFilter === group ? 'rotate-180' : ''}`} />
                    </button>
                    {(expandedFilter === group || window.innerWidth >= 640) && (
                      <div className="flex flex-wrap gap-2">
                        {options.map(opt => {
                          const active = selectedFilters[group]?.includes(opt)
                          return (
                            <button
                              key={opt}
                              onClick={() => toggleFilter(group, opt)}
                              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                                active
                                  ? 'bg-foreground text-background border-foreground'
                                  : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                              }`}
                            >
                              {opt}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {activeFilterCount > 0 && (
                <div className="flex items-center justify-between mt-5 pt-5 border-t border-border">
                  <span className="text-sm text-muted-foreground">{activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied</span>
                  <button onClick={clearFilters} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">Clear all</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ PRODUCT GRID ══ */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

          {view === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {filteredProducts.map((p, i) => (
                <div key={p.id}>
                  {/* Weekly divider every 4 items (on desktop) */}
                  {i === 4 && (
                    <div className="col-span-2 sm:col-span-3 lg:col-span-4 py-2">
                      <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2">Added Earlier This Week</span>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                    </div>
                  )}
                  <ProductCard {...p} />
                </div>
              ))}
            </div>
          ) : (
            /* List view */
            <div className="flex flex-col gap-4">
              {filteredProducts.map(p => (
                <Link key={p.id} href={`/products/${p.id}`} className="group flex items-center gap-5 p-4 bg-card border border-border/60 rounded-2xl hover:border-border hover:shadow-md hover:shadow-black/4 transition-all duration-200">
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-secondary">
                    <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="128px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{p.brand}</p>
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-1">{p.title}</h3>
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={11} className={i < Math.round(p.rating) ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'} />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">({p.reviews.toLocaleString()})</span>
                    </div>
                    {p.badge && <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-md mr-2">{p.badge}</span>}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xl font-black text-foreground">${p.price.toFixed(2)}</p>
                    {p.originalPrice && <p className="text-sm text-muted-foreground line-through">${p.originalPrice.toFixed(2)}</p>}
                    <button className="mt-3 px-4 py-2 bg-foreground text-background text-xs font-bold rounded-xl hover:bg-foreground/85 active:scale-[0.97] transition-all">
                      Add to Bag
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Load more */}
          <div className="flex flex-col items-center mt-12 gap-3">
            <div className="w-full max-w-xs bg-border rounded-full h-1 overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: `${(filteredProducts.length / ALL_PRODUCTS.length) * 100}%` }} />
            </div>
            <p className="text-xs text-muted-foreground">Showing {filteredProducts.length} of {ALL_PRODUCTS.length} products</p>
            <button className="mt-2 px-8 py-3 border border-border rounded-xl text-sm font-bold text-foreground hover:bg-secondary hover:border-foreground/20 active:scale-[0.97] transition-all">
              Load More Products
            </button>
          </div>
        </section>

        {/* ══ RECENTLY DROPPED EDITORIAL ══ */}
        <section className="border-t border-border bg-secondary/30 py-12 sm:py-16">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">Don't miss</p>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Coming Next Week</h2>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Sony WF-1000XM5', brand: 'Sony Audio', teaser: 'Next-gen ANC earbuds. Pre-register now.', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=300&fit=crop', date: 'Mar 28' },
                { title: 'LG OLED Flex 42"', brand: 'LG Display', teaser: 'Bend it your way. The future of gaming monitors.', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop', date: 'Mar 30' },
                { title: 'DJI Mini 4 Pro', brand: 'DJI', teaser: 'Lighter. Smarter. Ready to fly.', image: 'https://images.unsplash.com/photo-1547558902-c0e053edd6d4?w=400&h=300&fit=crop', date: 'Apr 1' },
              ].map(item => (
                <div key={item.title} className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:shadow-lg hover:shadow-black/6 transition-all duration-300 hover:-translate-y-0.5">
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-80" sizes="(max-width: 640px) 100vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute top-3 right-3 bg-foreground text-background text-[10px] font-black px-2 py-1 rounded-lg">{item.date}</span>
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{item.brand}</p>
                    <h3 className="font-black text-foreground text-base mb-1.5">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{item.teaser}</p>
                    <button className="flex items-center gap-1.5 text-xs font-bold text-primary hover:gap-2.5 transition-all">
                      Notify me <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}