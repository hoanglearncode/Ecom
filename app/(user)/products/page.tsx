'use client'

import {
  SlidersHorizontal, X, ChevronDown, ChevronRight,
  Grid2x2, LayoutList, Star, Search, Check,
  ArrowUpDown, Package
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import ProductCard, { type ProductCardProps } from '@/components/product-card'

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */

const CATEGORY_TREE = [
  {
    id: 'electronics', label: 'Electronics', count: 342, icon: '⚡',
    children: [
      { id: 'headphones', label: 'Headphones & Earbuds', count: 78 },
      { id: 'wearables', label: 'Wearables', count: 54 },
      { id: 'cameras', label: 'Cameras & Lenses', count: 43 },
      { id: 'monitors', label: 'Monitors & Displays', count: 39 },
      { id: 'keyboards', label: 'Keyboards & Mice', count: 67 },
      { id: 'storage', label: 'Storage & Drives', count: 61 },
    ],
  },
  {
    id: 'fashion', label: 'Fashion', count: 891, icon: '✦',
    children: [
      { id: 'mens', label: "Men's Clothing", count: 234 },
      { id: 'womens', label: "Women's Clothing", count: 312 },
      { id: 'shoes', label: 'Shoes & Footwear', count: 189 },
      { id: 'bags', label: 'Bags & Accessories', count: 156 },
    ],
  },
  {
    id: 'home', label: 'Home & Living', count: 456, icon: '⌂',
    children: [
      { id: 'furniture', label: 'Furniture', count: 123 },
      { id: 'kitchen', label: 'Kitchen & Dining', count: 198 },
      { id: 'decor', label: 'Décor & Art', count: 135 },
    ],
  },
  {
    id: 'sports', label: 'Sports & Outdoors', count: 287, icon: '◎',
    children: [
      { id: 'fitness', label: 'Fitness Equipment', count: 89 },
      { id: 'outdoor', label: 'Outdoor & Camping', count: 112 },
      { id: 'cycling', label: 'Cycling', count: 86 },
    ],
  },
  {
    id: 'gaming', label: 'Gaming', count: 198, icon: '◈',
    children: [
      { id: 'consoles', label: 'Consoles', count: 24 },
      { id: 'peripherals', label: 'Peripherals', count: 98 },
      { id: 'games', label: 'Games & DLC', count: 76 },
    ],
  },
  {
    id: 'books', label: 'Books & Media', count: 673, icon: '◻',
    children: [
      { id: 'fiction', label: 'Fiction', count: 245 },
      { id: 'nonfiction', label: 'Non-Fiction', count: 198 },
      { id: 'tech-books', label: 'Technology', count: 230 },
    ],
  },
]

const BRANDS = ['Apple', 'Samsung', 'Sony', 'LG', 'Bose', 'Nike', 'Adidas', 'Logitech', 'Razer', 'ASUS']

const COLORS = [
  { id: 'black', label: 'Black', hex: '#1a1a1a' },
  { id: 'white', label: 'White', hex: '#f5f5f5' },
  { id: 'silver', label: 'Silver', hex: '#c0c0c0' },
  { id: 'red', label: 'Red', hex: '#E40F2A' },
  { id: 'blue', label: 'Blue', hex: '#3b82f6' },
  { id: 'green', label: 'Green', hex: '#22c55e' },
  { id: 'gold', label: 'Gold', hex: '#f59e0b' },
  { id: 'purple', label: 'Purple', hex: '#a855f7' },
]

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
]

const PRODUCTS: (ProductCardProps & { category: string; brand: string; color: string })[] = [
  { id: 'p1', title: 'Sony WH-1000XM5 Wireless Headphones', brand: 'Sony', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', price: 279.99, originalPrice: 349.99, rating: 4.9, reviews: 2341, badge: 'Bestseller', category: 'headphones', color: 'black' },
  { id: 'p2', title: 'Apple Watch Series 9 GPS 45mm', brand: 'Apple', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', price: 399.99, rating: 4.8, reviews: 1876, badge: 'New', category: 'wearables', color: 'silver' },
  { id: 'p3', title: 'LG UltraWide 34" Curved Monitor', brand: 'LG', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop', price: 549.99, originalPrice: 699.99, rating: 4.7, reviews: 834, category: 'monitors', color: 'black' },
  { id: 'p4', title: 'Logitech MX Master 3S Mouse', brand: 'Logitech', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop', price: 99.99, originalPrice: 119.99, rating: 4.8, reviews: 3210, badge: 'Hot', category: 'keyboards', color: 'black' },
  { id: 'p5', title: 'Samsung T7 Portable SSD 2TB', brand: 'Samsung', image: 'https://images.unsplash.com/photo-1531492898419-3a9aa15ebbd0?w=400&h=400&fit=crop', price: 179.99, rating: 4.7, reviews: 1654, category: 'storage', color: 'blue' },
  { id: 'p6', title: 'Razer BlackWidow V4 Mechanical', brand: 'Razer', image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop', price: 139.99, originalPrice: 169.99, rating: 4.6, reviews: 987, category: 'keyboards', color: 'black' },
  { id: 'p7', title: 'Bose QuietComfort Earbuds II', brand: 'Bose', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop', price: 229.99, rating: 4.7, reviews: 1432, badge: 'New', category: 'headphones', color: 'white' },
  { id: 'p8', title: 'ASUS ROG Swift 27" 4K Gaming Monitor', brand: 'ASUS', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop', price: 799.99, originalPrice: 999.99, rating: 4.8, reviews: 456, badge: 'Hot', category: 'monitors', color: 'black' },
  { id: 'p9', title: 'Nike Air Max 270 Running Shoes', brand: 'Nike', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', price: 149.99, originalPrice: 180.00, rating: 4.5, reviews: 2876, category: 'shoes', color: 'red' },
  { id: 'p10', title: 'Samsung Galaxy Buds2 Pro', brand: 'Samsung', image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop', price: 169.99, originalPrice: 229.99, rating: 4.4, reviews: 1109, badge: 'Sale', category: 'headphones', color: 'purple' },
  { id: 'p11', title: 'Adidas Ultraboost 23 Sneakers', brand: 'Adidas', image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop', price: 189.99, rating: 4.6, reviews: 1543, badge: 'New', category: 'shoes', color: 'white' },
  { id: 'p12', title: 'Apple iPad Pro 12.9" M2 WiFi', brand: 'Apple', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop', price: 1099.99, rating: 4.9, reviews: 892, category: 'wearables', color: 'silver' },
  { id: 'p13', title: 'Sony A7 IV Full Frame Mirrorless', brand: 'Sony', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop', price: 2499.99, rating: 4.9, reviews: 345, badge: 'Hot', category: 'cameras', color: 'black' },
  { id: 'p14', title: 'Ergonomic Mesh Office Chair', brand: 'Logitech', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=400&fit=crop', price: 449.99, originalPrice: 599.99, rating: 4.7, reviews: 789, category: 'furniture', color: 'black' },
  { id: 'p15', title: 'Portable Bluetooth Speaker JBL', brand: 'ASUS', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', price: 129.99, rating: 4.5, reviews: 2100, badge: 'Sale', category: 'headphones', color: 'blue' },
  { id: 'p16', title: 'Mechanical Gaming Keyboard RGB', brand: 'Razer', image: 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=400&h=400&fit=crop', price: 79.99, rating: 4.3, reviews: 1234, category: 'keyboards', color: 'black' },
]

const PRICE_RANGES = [
  { id: 'u50', label: 'Under $50', min: 0, max: 50 },
  { id: '50-100', label: '$50 – $100', min: 50, max: 100 },
  { id: '100-250', label: '$100 – $250', min: 100, max: 250 },
  { id: '250-500', label: '$250 – $500', min: 250, max: 500 },
  { id: '500plus', label: 'Over $500', min: 500, max: Infinity },
]

type Filters = {
  categories: string[]
  brands: string[]
  colors: string[]
  priceRange: string | null
  rating: number | null
  inStockOnly: boolean
  onSaleOnly: boolean
}

const EMPTY_FILTERS: Filters = {
  categories: [], brands: [], colors: [],
  priceRange: null, rating: null,
  inStockOnly: false, onSaleOnly: false,
}

/* ═══════════════════════════════════════════════════════
   SIDEBAR SECTION COMPONENT
═══════════════════════════════════════════════════════ */
function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center justify-between w-full py-4 text-sm font-bold text-foreground hover:text-primary transition-colors"
      >
        {title}
        <ChevronDown size={15} className={`text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
export default function ProductsPage() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [sort, setSort] = useState('featured')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [sortOpen, setSortOpen] = useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>('electronics')
  const [searchBrand, setSearchBrand] = useState('')
  const [priceInputs, setPriceInputs] = useState({ min: '', max: '' })
  const sortRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  // Prevent body scroll when mobile filter open
  useEffect(() => {
    document.body.style.overflow = mobileFilterOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileFilterOpen])

  const toggle = useCallback(<K extends keyof Filters>(key: K, value: string) => {
    setFilters(prev => {
      const arr = prev[key] as string[]
      return { ...prev, [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] }
    })
  }, [])

  const setFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS)
    setPriceInputs({ min: '', max: '' })
  }, [])

  const activeCount = useMemo(() =>
    filters.categories.length + filters.brands.length + filters.colors.length +
    (filters.priceRange ? 1 : 0) + (filters.rating ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) + (filters.onSaleOnly ? 1 : 0),
    [filters]
  )

  const filtered = useMemo(() => {
    let list = [...PRODUCTS]
    if (filters.categories.length) list = list.filter(p => filters.categories.includes(p.category))
    if (filters.brands.length) list = list.filter(p => filters.brands.includes(p.brand))
    if (filters.colors.length) list = list.filter(p => filters.colors.includes(p.color))
    if (filters.priceRange) {
      const range = PRICE_RANGES.find(r => r.id === filters.priceRange)
      if (range) list = list.filter(p => p.price >= range.min && p.price <= range.max)
    }
    if (filters.rating) list = list.filter(p => p.rating >= filters.rating!)
    if (filters.onSaleOnly) list = list.filter(p => p.originalPrice)
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    else if (sort === 'newest') list.sort((a, b) => b.reviews - a.reviews)
    return list
  }, [filters, sort])

  const filteredBrands = useMemo(() => BRANDS.filter(b => b.toLowerCase().includes(searchBrand.toLowerCase())), [searchBrand])

  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label ?? 'Featured'

  /* ── SIDEBAR FILTERS (shared between sidebar + mobile drawer) ── */
  const SidebarContent = () => (
    <div>
      {/* ── Category Tree ── */}
      <FilterSection title="Category">
        <div className="flex flex-col gap-0.5">
          {CATEGORY_TREE.map(cat => (
            <div key={cat.id}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronRight size={13} className={`transition-transform duration-150 ${expandedCategory === cat.id ? 'rotate-90' : ''}`} />
                </button>
                <button
                  onClick={() => {
                    const allChildIds = cat.children.map(c => c.id)
                    const allSelected = allChildIds.every(id => filters.categories.includes(id))
                    if (allSelected) {
                      setFilters(prev => ({ ...prev, categories: prev.categories.filter(id => !allChildIds.includes(id)) }))
                    } else {
                      setFilters(prev => ({ ...prev, categories: [...new Set([...prev.categories, ...allChildIds])] }))
                    }
                    setExpandedCategory(cat.id)
                  }}
                  className="flex items-center justify-between flex-1 py-1.5 text-sm text-foreground/80 hover:text-foreground transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base leading-none">{cat.icon}</span>
                    <span className="font-semibold">{cat.label}</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground">{cat.count}</span>
                </button>
              </div>

              {/* Children */}
              {expandedCategory === cat.id && (
                <div className="ml-6 mt-0.5 flex flex-col gap-0.5 border-l border-border pl-3">
                  {cat.children.map(child => {
                    const active = filters.categories.includes(child.id)
                    return (
                      <button
                        key={child.id}
                        onClick={() => toggle('categories', child.id)}
                        className={`flex items-center justify-between py-1.5 px-2 rounded-lg text-sm transition-all text-left ${active ? 'bg-primary/8 text-primary font-semibold' : 'text-foreground/70 hover:text-foreground hover:bg-secondary'}`}
                      >
                        <span>{child.label}</span>
                        <span className="text-[10px] text-muted-foreground">{child.count}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </FilterSection>

      {/* ── Price Range ── */}
      <FilterSection title="Price Range">
        <div className="flex flex-col gap-1.5 mb-4">
          {PRICE_RANGES.map(r => {
            const active = filters.priceRange === r.id
            return (
              <button
                key={r.id}
                onClick={() => setFilter('priceRange', active ? null : r.id)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm border transition-all ${active ? 'bg-foreground text-background border-foreground' : 'border-border text-foreground/70 hover:border-foreground/30 hover:text-foreground'}`}
              >
                {r.label}
                {active && <Check size={13} />}
              </button>
            )
          })}
        </div>
        {/* Custom range inputs */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Custom range</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceInputs.min}
            onChange={e => setPriceInputs(p => ({ ...p, min: e.target.value }))}
            className="flex-1 min-w-0 bg-secondary border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground"
          />
          <span className="text-muted-foreground text-xs">–</span>
          <input
            type="number"
            placeholder="Max"
            value={priceInputs.max}
            onChange={e => setPriceInputs(p => ({ ...p, max: e.target.value }))}
            className="flex-1 min-w-0 bg-secondary border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground"
          />
          <button
            onClick={() => {
              if (priceInputs.min || priceInputs.max) setFilter('priceRange', null)
            }}
            className="px-3 py-2 bg-foreground text-background text-xs font-bold rounded-xl hover:bg-foreground/85 transition-all active:scale-[0.97]"
          >
            Go
          </button>
        </div>
      </FilterSection>

      {/* ── Brands ── */}
      <FilterSection title="Brand">
        <div className="relative mb-3">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search brands…"
            value={searchBrand}
            onChange={e => setSearchBrand(e.target.value)}
            className="w-full bg-secondary border border-transparent rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex flex-col gap-1">
          {filteredBrands.map(brand => {
            const active = filters.brands.includes(brand)
            const count = PRODUCTS.filter(p => p.brand === brand).length
            return (
              <button
                key={brand}
                onClick={() => toggle('brands', brand)}
                className={`flex items-center gap-2.5 py-2 px-2 rounded-xl text-sm transition-all text-left ${active ? 'text-primary' : 'text-foreground/70 hover:text-foreground hover:bg-secondary'}`}
              >
                <span className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${active ? 'bg-primary border-primary' : 'border-border'}`}>
                  {active && <Check size={10} className="text-white" />}
                </span>
                <span className="flex-1">{brand}</span>
                <span className="text-[10px] text-muted-foreground">{count}</span>
              </button>
            )
          })}
        </div>
      </FilterSection>

      {/* ── Color ── */}
      <FilterSection title="Color">
        <div className="flex flex-wrap gap-2.5">
          {COLORS.map(c => {
            const active = filters.colors.includes(c.id)
            return (
              <button
                key={c.id}
                onClick={() => toggle('colors', c.id)}
                title={c.label}
                className={`group flex flex-col items-center gap-1.5 transition-all`}
              >
                <span
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${active ? 'border-primary scale-110 shadow-md shadow-primary/20' : 'border-transparent hover:border-border hover:scale-105'}`}
                  style={{ backgroundColor: c.hex }}
                >
                  {active && <Check size={12} className={c.id === 'white' || c.id === 'silver' ? 'text-foreground' : 'text-white'} />}
                </span>
                <span className="text-[9px] text-muted-foreground">{c.label}</span>
              </button>
            )
          })}
        </div>
      </FilterSection>

      {/* ── Rating ── */}
      <FilterSection title="Customer Rating">
        <div className="flex flex-col gap-1.5">
          {[4.5, 4.0, 3.5, 3.0].map(r => {
            const active = filters.rating === r
            return (
              <button
                key={r}
                onClick={() => setFilter('rating', active ? null : r)}
                className={`flex items-center gap-2.5 py-2 px-2 rounded-xl transition-all text-left ${active ? 'bg-primary/8 text-primary' : 'text-foreground/70 hover:bg-secondary hover:text-foreground'}`}
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} className={i < Math.floor(r) ? 'fill-amber-400 text-amber-400' : i < r ? 'fill-amber-200 text-amber-200' : active ? 'fill-primary/20 text-primary/20' : 'fill-muted text-muted'} />
                  ))}
                </div>
                <span className="text-sm">{r} & up</span>
              </button>
            )
          })}
        </div>
      </FilterSection>

      {/* ── Availability ── */}
      <FilterSection title="Availability" defaultOpen={false}>
        <div className="flex flex-col gap-2">
          {[
            { key: 'inStockOnly' as const, label: 'In Stock Only' },
            { key: 'onSaleOnly' as const, label: 'On Sale' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key, !filters[key])}
              className={`flex items-center gap-2.5 py-2 px-2 rounded-xl text-sm transition-all text-left ${filters[key] ? 'text-primary' : 'text-foreground/70 hover:text-foreground hover:bg-secondary'}`}
            >
              <span className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${filters[key] ? 'bg-primary border-primary' : 'border-border'}`}>
                {filters[key] && <Check size={10} className="text-white" />}
              </span>
              {label}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pb-20 sm:pb-0">
        {/* ══ LAYOUT: SIDEBAR + GRID ══ */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex gap-8">

            {/* ── DESKTOP SIDEBAR ── */}
            <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
              <div className="sticky top-24 bg-card border border-border rounded-2xl overflow-hidden">
                {/* Sidebar header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={16} className="text-primary" />
                    <span className="font-bold text-sm text-foreground">Filters</span>
                    {activeCount > 0 && (
                      <span className="bg-primary text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">{activeCount}</span>
                    )}
                  </div>
                  {activeCount > 0 && (
                    <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
                      Clear all
                    </button>
                  )}
                </div>
                <div className="px-5 max-h-[calc(100vh-180px)] overflow-y-auto scrollbar-thin">
                  <SidebarContent />
                </div>
              </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <div className="flex-1 min-w-0">

              {/* Toolbar */}
              <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  {/* Mobile filter button */}
                  <button
                    onClick={() => setMobileFilterOpen(true)}
                    className={`lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold border transition-colors ${activeCount > 0 ? 'bg-foreground text-background border-foreground' : 'border-border text-foreground hover:bg-secondary'}`}
                  >
                    <SlidersHorizontal size={15} />
                    Filters
                    {activeCount > 0 && <span className="bg-primary text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">{activeCount}</span>}
                  </button>
                  <p className="hidden sm:block text-sm text-muted-foreground">{filtered.length} products</p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Sort */}
                  <div className="relative" ref={sortRef}>
                    <button
                      onClick={() => setSortOpen(v => !v)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border border-border hover:bg-secondary transition-colors"
                    >
                      <ArrowUpDown size={13} className="text-muted-foreground" />
                      <span className="hidden sm:inline">{currentSortLabel}</span>
                      <span className="sm:hidden">Sort</span>
                      <ChevronDown size={13} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {sortOpen && (
                      <div className="absolute right-0 top-full mt-1.5 w-52 bg-card border border-border rounded-2xl shadow-xl py-1.5 z-50">
                        {SORT_OPTIONS.map(o => (
                          <button
                            key={o.value}
                            onClick={() => { setSort(o.value); setSortOpen(false) }}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${sort === o.value ? 'text-primary font-semibold' : 'text-foreground/75 hover:bg-secondary hover:text-foreground'}`}
                          >
                            {o.label}
                            {sort === o.value && <Check size={13} className="text-primary" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* View toggle */}
                  <div className="hidden sm:flex border border-border rounded-xl overflow-hidden">
                    <button onClick={() => setView('grid')} className={`p-2 transition-colors ${view === 'grid' ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-secondary'}`}>
                      <Grid2x2 size={16} />
                    </button>
                    <button onClick={() => setView('list')} className={`p-2 transition-colors ${view === 'list' ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-secondary'}`}>
                      <LayoutList size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile active chips */}
              {activeCount > 0 && (
                <div className="flex lg:hidden items-center gap-2 flex-wrap mb-4">
                  {filters.categories.map(c => {
                    const label = CATEGORY_TREE.flatMap(cat => cat.children).find(ch => ch.id === c)?.label ?? c
                    return (
                      <button key={c} onClick={() => toggle('categories', c)} className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-foreground text-background rounded-lg">
                        {label} <X size={11} />
                      </button>
                    )
                  })}
                  {filters.priceRange && (
                    <button onClick={() => setFilter('priceRange', null)} className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-foreground text-background rounded-lg">
                      {PRICE_RANGES.find(r => r.id === filters.priceRange)?.label} <X size={11} />
                    </button>
                  )}
                  <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-primary underline">Clear all</button>
                </div>
              )}

              {/* Products */}
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-4">
                    <Package size={28} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">No products found</h3>
                  <p className="text-sm text-muted-foreground mb-5">Try adjusting your filters to see more results.</p>
                  <button onClick={clearFilters} className="px-5 py-2.5 bg-foreground text-background text-sm font-bold rounded-xl hover:bg-foreground/85 transition-all">
                    Clear all filters
                  </button>
                </div>
              ) : view === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                  {filtered.map(p => <ProductCard key={p.id} {...p} />)}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filtered.map(p => (
                    <Link key={p.id} href={`/products/${p.id}`} className="group flex items-center gap-4 p-4 bg-card border border-border/60 rounded-2xl hover:border-border hover:shadow-md hover:shadow-black/4 transition-all duration-200">
                      <div className="relative w-20 h-20 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-secondary">
                        <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="112px" />
                        {p.badge && (
                          <span className={`absolute top-1.5 left-1.5 text-[9px] font-black px-1.5 py-0.5 rounded-md ${p.badge === 'Sale' ? 'bg-primary text-white' : 'bg-foreground text-background'}`}>{p.badge}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">{p.brand}</p>
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm sm:text-base mb-1.5 line-clamp-2">{p.title}</h3>
                        <div className="flex items-center gap-1.5">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={11} className={i < Math.round(p.rating) ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'} />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">({p.reviews.toLocaleString()})</span>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-base sm:text-xl font-black text-foreground">${p.price.toFixed(2)}</p>
                        {p.originalPrice && <p className="text-xs text-muted-foreground line-through">${p.originalPrice.toFixed(2)}</p>}
                        <button className="mt-2.5 px-3.5 py-2 bg-foreground text-background text-xs font-bold rounded-xl hover:bg-foreground/85 active:scale-[0.97] transition-all">
                          Add to Bag
                        </button>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {filtered.length > 0 && (
                <div className="flex items-center justify-between mt-10 pt-8 border-t border-border">
                  <p className="text-sm text-muted-foreground">Page 1 of 3</p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, '...', 8].map((p, i) => (
                      <button
                        key={i}
                        className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${p === 1 ? 'bg-foreground text-background' : 'text-foreground/60 hover:bg-secondary hover:text-foreground'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>


      {/* ══ MOBILE FILTER DRAWER ══ */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />

          {/* Drawer */}
          <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl max-h-[92dvh] flex flex-col shadow-2xl">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-border rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-primary" />
                <span className="font-bold text-foreground">Filters</span>
                {activeCount > 0 && <span className="bg-primary text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">{activeCount}</span>}
              </div>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 px-5">
              <SidebarContent />
            </div>

            {/* Footer actions */}
            <div className="flex gap-3 p-5 border-t border-border shrink-0 bg-background">
              <button
                onClick={clearFilters}
                className="flex-1 py-3 border border-border rounded-2xl text-sm font-bold text-foreground hover:bg-secondary transition-all active:scale-[0.97]"
              >
                Clear All {activeCount > 0 ? `(${activeCount})` : ''}
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-2 flex-grow-[2] py-3 bg-foreground text-background rounded-2xl text-sm font-bold hover:bg-foreground/85 transition-all active:scale-[0.97]"
              >
                Show {filtered.length} Products
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}