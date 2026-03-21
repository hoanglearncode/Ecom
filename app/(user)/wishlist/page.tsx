'use client'

import {
  Heart, ShoppingBag, Trash2, Share2, Plus, Grid2x2,
  LayoutList, ArrowRight, ChevronRight, Star, Tag,
  Zap, Lock, Edit2, Check, X, Copy, Link2,
  SlidersHorizontal, ChevronDown, Gift, Bell, Package,
  MoreHorizontal, FolderPlus, MoveRight, Eye, EyeOff
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useMemo, useRef, useEffect } from 'react'
import ProductCard, { type ProductCardProps } from '@/components/product-card'

/* ═══════════════════════════════════════════════════════
   TYPES & DATA
═══════════════════════════════════════════════════════ */

type WishItem = {
  id: string
  productId: string
  name: string
  brand: string
  image: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  color: string
  colorHex: string
  badge?: string
  inStock: boolean
  stockLeft?: number
  addedDate: string
  collection: string
  priceDropped?: boolean
  prevPrice?: number
}

type Collection = { id: string; name: string; emoji: string; isPrivate: boolean }

const COLLECTIONS: Collection[] = [
  { id: 'all', name: 'All Items', emoji: '❤️', isPrivate: false },
  { id: 'tech', name: 'Tech Wishlist', emoji: '⚡', isPrivate: false },
  { id: 'fashion', name: 'Style Picks', emoji: '✦', isPrivate: true },
  { id: 'home', name: 'Home Goals', emoji: '⌂', isPrivate: false },
]

const WISH_ITEMS: WishItem[] = [
  { id: 'w1', productId: 'p1', name: 'Sony WH-1000XM5 Wireless Headphones', brand: 'Sony', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', price: 279.99, originalPrice: 349.99, rating: 4.9, reviews: 2341, color: 'Midnight Black', colorHex: '#1a1a1a', badge: 'Sale', inStock: true, stockLeft: 8, addedDate: 'Mar 18, 2026', collection: 'tech', priceDropped: true, prevPrice: 319.99 },
  { id: 'w2', productId: 'p2', name: 'Apple Watch Series 9 GPS 45mm', brand: 'Apple', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', price: 399.99, rating: 4.8, reviews: 1876, color: 'Midnight', colorHex: '#1a1a2e', badge: 'New', inStock: true, addedDate: 'Mar 15, 2026', collection: 'tech' },
  { id: 'w3', productId: 'p3', name: 'Nike Air Max 270 Running Shoes', brand: 'Nike', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', price: 149.99, originalPrice: 180.00, rating: 4.5, reviews: 2876, color: 'Black / Red', colorHex: '#E40F2A', inStock: true, addedDate: 'Mar 12, 2026', collection: 'fashion' },
  { id: 'w4', productId: 'p4', name: 'LG UltraWide 34" Curved Monitor', brand: 'LG', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop', price: 549.99, originalPrice: 699.99, rating: 4.7, reviews: 834, color: 'Black', colorHex: '#1a1a1a', badge: 'Sale', inStock: true, stockLeft: 3, addedDate: 'Mar 10, 2026', collection: 'tech', priceDropped: true, prevPrice: 599.99 },
  { id: 'w5', productId: 'p5', name: 'Ergonomic Mesh Office Chair', brand: 'ErgoSeat', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=400&fit=crop', price: 449.99, originalPrice: 599.99, rating: 4.7, reviews: 789, color: 'Black', colorHex: '#1a1a1a', inStock: false, addedDate: 'Mar 5, 2026', collection: 'home' },
  { id: 'w6', productId: 'p6', name: 'Adidas Ultraboost 23 Sneakers', brand: 'Adidas', image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop', price: 189.99, rating: 4.6, reviews: 1543, color: 'Core White', colorHex: '#f5f5f5', badge: 'New', inStock: true, addedDate: 'Mar 2, 2026', collection: 'fashion' },
  { id: 'w7', productId: 'p7', name: 'Samsung T7 Portable SSD 2TB', brand: 'Samsung', image: 'https://images.unsplash.com/photo-1531492898419-3a9aa15ebbd0?w=400&h=400&fit=crop', price: 149.99, originalPrice: 179.99, rating: 4.7, reviews: 1654, color: 'Deep Blue', colorHex: '#1e3a5f', inStock: true, addedDate: 'Feb 28, 2026', collection: 'tech' },
  { id: 'w8', productId: 'p8', name: 'Minimal Ceramic Vase Set of 3', brand: 'ArtHome', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', price: 49.99, rating: 4.6, reviews: 231, color: 'Matte White', colorHex: '#f0ede8', inStock: true, addedDate: 'Feb 25, 2026', collection: 'home' },
]

const RECOMMENDED: ProductCardProps[] = [
  { id: 'r1', title: 'Bose QuietComfort 45 Headphones', brand: 'Bose', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop', price: 249.99, originalPrice: 329.99, rating: 4.7, reviews: 876 },
  { id: 'r2', title: 'Logitech MX Master 3S Mouse', brand: 'Logitech', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop', price: 99.99, originalPrice: 119.99, rating: 4.8, reviews: 3210, badge: 'Hot' },
  { id: 'r3', title: 'AirPods Pro 2nd Generation', brand: 'Apple', image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop', price: 229.99, originalPrice: 279.99, rating: 4.8, reviews: 5432, badge: 'Sale' },
  { id: 'r4', title: 'Smart LED Floor Lamp', brand: 'LightUp', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop', price: 89.99, rating: 4.4, reviews: 354, badge: 'New' },
]

const SORT_OPTIONS = [
  { id: 'date-desc', label: 'Recently Added' },
  { id: 'date-asc', label: 'Oldest First' },
  { id: 'price-asc', label: 'Price: Low → High' },
  { id: 'price-desc', label: 'Price: High → Low' },
  { id: 'rating', label: 'Top Rated' },
  { id: 'drops', label: 'Price Drops First' },
]

const fmt = (n: number) => `$${n.toFixed(2)}`

/* ═══════════════════════════════════════════════════════
   ITEM CARD COMPONENT
═══════════════════════════════════════════════════════ */

function WishCard({
  item, view, onRemove, onAddToCart, onMove, collections,
}: {
  item: WishItem
  view: 'grid' | 'list'
  onRemove: (id: string) => void
  onAddToCart: (id: string) => void
  onMove: (itemId: string, colId: string) => void
  collections: Collection[]
}) {
  const [added, setAdded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [moveOpen, setMoveOpen] = useState(false)
  const [removing, setRemoving] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const disc = item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : null

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false); setMoveOpen(false)
      }
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const handleAddToCart = () => {
    setAdded(true)
    onAddToCart(item.id)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleRemove = () => {
    setRemoving(true)
    setTimeout(() => onRemove(item.id), 300)
  }

  if (view === 'list') return (
    <div className={`group flex gap-4 bg-card border border-border/70 rounded-2xl overflow-hidden transition-all duration-300 hover:border-border hover:shadow-md hover:shadow-black/4 ${removing ? 'opacity-0 scale-[0.98] -translate-y-1' : ''}`}>
      <Link href={`/products/${item.productId}`} className="relative w-28 sm:w-36 shrink-0 bg-secondary">
        <Image src={item.image} alt={item.name} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="144px" />
        {!item.inStock && <div className="absolute inset-0 bg-background/70 backdrop-blur-[1px] flex items-center justify-center"><span className="text-[10px] font-black text-muted-foreground bg-card px-2 py-1 rounded-lg border border-border">Out of stock</span></div>}
      </Link>

      <div className="flex-1 min-w-0 flex flex-col gap-2.5 py-4 pr-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">{item.brand}</p>
            <Link href={`/products/${item.productId}`} className="font-bold text-foreground text-sm leading-snug hover:text-primary transition-colors line-clamp-2">{item.name}</Link>
          </div>
          <div className="relative shrink-0" ref={menuRef}>
            <button onClick={() => setMenuOpen(v => !v)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all opacity-0 group-hover:opacity-100">
              <MoreHorizontal size={16} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 w-48 bg-card border border-border rounded-2xl shadow-xl py-1.5 z-20">
                <button onClick={() => { setMoveOpen(v => !v) }} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-foreground/75 hover:bg-secondary hover:text-foreground transition-colors">
                  <MoveRight size={14} /> Move to collection
                </button>
                {moveOpen && (
                  <div className="px-2 pb-2">
                    {collections.filter(c => c.id !== 'all' && c.id !== item.collection).map(col => (
                      <button key={col.id} onClick={() => { onMove(item.id, col.id); setMenuOpen(false) }} className="flex items-center gap-2 w-full px-3 py-2 text-xs text-foreground/70 hover:bg-secondary rounded-xl transition-colors">
                        {col.emoji} {col.name}
                      </button>
                    ))}
                  </div>
                )}
                <button onClick={() => { setMenuOpen(false); handleRemove() }} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-primary hover:bg-primary/8 transition-colors rounded-b-xl">
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full border border-border/50 shrink-0" style={{ background: item.colorHex }} />
          <span className="text-xs text-muted-foreground">{item.color}</span>
        </div>

        {/* Price drop alert */}
        {item.priceDropped && (
          <div className="flex items-center gap-1.5 text-[10px] text-green-600 font-bold bg-green-500/8 border border-green-500/15 px-2.5 py-1.5 rounded-lg w-fit">
            <Zap size={10} fill="currentColor" /> Price dropped from {fmt(item.prevPrice!)} → {fmt(item.price)}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-foreground">{fmt(item.price)}</span>
              {item.originalPrice && <span className="text-xs text-muted-foreground line-through">{fmt(item.originalPrice)}</span>}
              {disc && <span className="text-[10px] font-bold text-primary">-{disc}%</span>}
            </div>
            {item.stockLeft && item.stockLeft <= 5 && (
              <p className="text-[10px] text-primary font-bold mt-0.5 flex items-center gap-1"><Zap size={9} /> Only {item.stockLeft} left</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRemove}
              className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/8 rounded-xl transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={15} />
            </button>
            <button
              onClick={handleAddToCart}
              disabled={!item.inStock}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-[0.97] ${added ? 'bg-green-500 text-white' : item.inStock ? 'bg-foreground text-background hover:bg-foreground/85' : 'bg-secondary text-muted-foreground cursor-not-allowed'}`}
            >
              <ShoppingBag size={13} />
              {added ? 'Added!' : item.inStock ? 'Add to Bag' : 'Unavailable'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // GRID view
  return (
    <div className={`group relative bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-border hover:shadow-lg hover:shadow-black/6 hover:-translate-y-0.5 transition-all duration-300 ${removing ? 'opacity-0 scale-[0.97]' : ''}`}>
      {/* Image */}
      <Link href={`/products/${item.productId}`} className="relative block aspect-square overflow-hidden bg-secondary">
        <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 50vw, 25vw" />
        {!item.inStock && (
          <div className="absolute inset-0 bg-background/70 backdrop-blur-[1px] flex items-center justify-center">
            <span className="text-[10px] font-black text-foreground bg-card px-2.5 py-1.5 rounded-xl border border-border shadow-sm">Out of Stock</span>
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {item.badge && <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${item.badge === 'Sale' ? 'bg-primary text-white' : item.badge === 'New' ? 'bg-foreground text-background' : 'bg-amber-500 text-white'}`}>{item.badge}</span>}
          {disc && !item.badge && <span className="text-[9px] font-black px-2 py-0.5 bg-primary text-white rounded-md">-{disc}%</span>}
        </div>

        {/* Price drop tag */}
        {item.priceDropped && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-500 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-sm">
            <Zap size={9} fill="white" /> Drop
          </div>
        )}

        {/* Hover actions */}
        <div className="absolute bottom-3 inset-x-3 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={e => { e.preventDefault(); handleAddToCart() }}
            disabled={!item.inStock}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-[0.97] shadow-md ${added ? 'bg-green-500 text-white' : item.inStock ? 'bg-white/95 backdrop-blur-sm text-foreground hover:bg-white' : 'bg-white/60 text-muted-foreground cursor-not-allowed'}`}
          >
            <ShoppingBag size={13} />
            {added ? 'Added!' : item.inStock ? 'Add to Bag' : 'Out of Stock'}
          </button>
          <div className="relative" ref={menuRef}>
            <button
              onClick={e => { e.preventDefault(); setMenuOpen(v => !v) }}
              className="p-2.5 bg-white/95 backdrop-blur-sm rounded-xl text-foreground hover:bg-white transition-all shadow-md"
            >
              <MoreHorizontal size={15} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 bottom-11 w-48 bg-card border border-border rounded-2xl shadow-xl py-1.5 z-20">
                <button onClick={() => setMoveOpen(v => !v)} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-foreground/75 hover:bg-secondary">
                  <MoveRight size={14} /> Move to…
                </button>
                {moveOpen && collections.filter(c => c.id !== 'all' && c.id !== item.collection).map(col => (
                  <button key={col.id} onClick={() => { onMove(item.id, col.id); setMenuOpen(false) }} className="flex items-center gap-2 w-full px-4 py-2 text-xs text-foreground/70 hover:bg-secondary">
                    {col.emoji} {col.name}
                  </button>
                ))}
                <button onClick={() => { setMenuOpen(false); handleRemove() }} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-primary hover:bg-primary/8">
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-3.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{item.brand}</p>
        <Link href={`/products/${item.productId}`} className="font-semibold text-foreground text-xs leading-snug line-clamp-2 mb-2 hover:text-primary transition-colors block">{item.name}</Link>
        <div className="flex items-center gap-1 mb-2.5">
          {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={10} className={i < Math.round(item.rating) ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'} />)}
          <span className="text-[10px] text-muted-foreground">({item.reviews.toLocaleString()})</span>
        </div>
        {item.priceDropped && (
          <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold mb-1.5">
            <Zap size={9} fill="currentColor" /> Dropped {fmt(item.prevPrice!)} → {fmt(item.price)}
          </div>
        )}
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-foreground">{fmt(item.price)}</span>
            {item.originalPrice && <span className="text-xs text-muted-foreground line-through">{fmt(item.originalPrice)}</span>}
          </div>
          {item.stockLeft && item.stockLeft <= 5 && <span className="text-[10px] font-bold text-primary">Only {item.stockLeft} left!</span>}
        </div>
        <p className="text-[10px] text-muted-foreground/60 mt-1.5">Added {item.addedDate}</p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */

export default function WishlistPage() {
  const [items, setItems] = useState<WishItem[]>(WISH_ITEMS)
  const [collections, setCollections] = useState<Collection[]>(COLLECTIONS)
  const [activeCol, setActiveCol] = useState('all')
  const [sort, setSort] = useState('date-desc')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [sortOpen, setSortOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [newColOpen, setNewColOpen] = useState(false)
  const [newColName, setNewColName] = useState('')
  const [linkCopied, setLinkCopied] = useState(false)
  const [addedAll, setAddedAll] = useState(false)
  const [cartAddedIds, setCartAddedIds] = useState<Set<string>>(new Set())
  const sortRef = useRef<HTMLDivElement>(null)
  const shareRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false)
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) setShareOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id))

  const addToCart = (id: string) => {
    setCartAddedIds(prev => new Set([...prev, id]))
    setTimeout(() => setCartAddedIds(prev => { const s = new Set(prev); s.delete(id); return s }), 2000)
  }

  const moveItem = (itemId: string, colId: string) => {
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, collection: colId } : i))
  }

  const addAllToCart = () => {
    const inStock = filtered.filter(i => i.inStock)
    setAddedAll(true)
    inStock.forEach(i => addToCart(i.id))
    setTimeout(() => setAddedAll(false), 2500)
  }

  const copyLink = () => {
    navigator.clipboard.writeText('https://shophub.com/wishlist/shared/alex-morgan-2026')
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const createCollection = () => {
    if (!newColName.trim()) return
    const id = newColName.toLowerCase().replace(/\s+/g, '-')
    setCollections(prev => [...prev, { id, name: newColName, emoji: '📁', isPrivate: false }])
    setNewColName('')
    setNewColOpen(false)
  }

  const filtered = useMemo(() => {
    let list = activeCol === 'all' ? items : items.filter(i => i.collection === activeCol)
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    else if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    else if (sort === 'drops') list = [...list].sort((a, b) => (b.priceDropped ? 1 : 0) - (a.priceDropped ? 1 : 0))
    return list
  }, [items, activeCol, sort])

  const priceDropCount = items.filter(i => i.priceDropped).length
  const outOfStockCount = items.filter(i => !i.inStock).length
  const totalValue = filtered.reduce((s, i) => s + i.price, 0)
  const totalSavings = filtered.reduce((s, i) => s + ((i.originalPrice ?? i.price) - i.price), 0)
  const currentCollection = collections.find(c => c.id === activeCol)
  const currentSortLabel = SORT_OPTIONS.find(o => o.id === sort)?.label ?? 'Sort'

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pb-20 sm:pb-0">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex gap-8">

            {/* ─── SIDEBAR: COLLECTIONS ─── */}
            <aside className="hidden lg:block w-56 shrink-0">
              <div className="sticky top-24 space-y-1">
                <div className="flex items-center justify-between mb-3 px-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Collections</p>
                  <button onClick={() => setNewColOpen(v => !v)} className="p-1 text-muted-foreground hover:text-primary transition-colors">
                    <FolderPlus size={15} />
                  </button>
                </div>

                {/* New collection input */}
                {newColOpen && (
                  <div className="mb-3 p-3 bg-card border border-border rounded-xl">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Collection name…"
                      value={newColName}
                      onChange={e => setNewColName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') createCollection(); if (e.key === 'Escape') setNewColOpen(false) }}
                      className="w-full bg-secondary border border-transparent rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                    />
                    <div className="flex gap-2 mt-2">
                      <button onClick={createCollection} className="flex-1 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-all">Create</button>
                      <button onClick={() => setNewColOpen(false)} className="flex-1 py-1.5 border border-border text-xs font-bold rounded-lg hover:bg-secondary transition-all">Cancel</button>
                    </div>
                  </div>
                )}

                {collections.map(col => {
                  const count = col.id === 'all' ? items.length : items.filter(i => i.collection === col.id).length
                  return (
                    <button
                      key={col.id}
                      onClick={() => setActiveCol(col.id)}
                      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all text-left ${activeCol === col.id ? 'bg-primary/8 text-primary font-bold' : 'text-foreground/70 hover:bg-secondary hover:text-foreground'}`}
                    >
                      <span className="text-base leading-none">{col.emoji}</span>
                      <span className="flex-1 truncate">{col.name}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {col.isPrivate && <Lock size={10} className="text-muted-foreground" />}
                        <span className="text-[10px] font-bold text-muted-foreground">{count}</span>
                      </div>
                    </button>
                  )
                })}

                {/* Stats card */}
                <div className="mt-4 p-4 bg-card border border-border rounded-2xl space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Wishlist Stats</p>
                  {[
                    { label: 'Total items', val: items.length },
                    { label: 'Total value', val: fmt(items.reduce((s, i) => s + i.price, 0)) },
                    { label: 'Total savings', val: fmt(items.reduce((s, i) => s + ((i.originalPrice ?? i.price) - i.price), 0)) },
                    { label: 'Price drops', val: `${priceDropCount} items` },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <span className="text-xs font-bold text-foreground">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* ─── MAIN: ITEMS ─── */}
            <div className="flex-1 min-w-0">

              {/* Toolbar */}
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2">
                  {/* Mobile collection select */}
                  <div className="lg:hidden relative">
                    <select
                      value={activeCol}
                      onChange={e => setActiveCol(e.target.value)}
                      className="appearance-none bg-card border border-border rounded-xl pl-3 pr-8 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {collections.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>

                  <p className="hidden lg:block text-sm text-muted-foreground">
                    <span className="font-bold text-foreground">{filtered.length}</span> items
                    {activeCol !== 'all' && <span className="ml-1">in <span className="font-semibold">{currentCollection?.name}</span></span>}
                    {currentCollection?.isPrivate && <Lock size={11} className="inline ml-1.5 text-muted-foreground" />}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Sort */}
                  <div className="relative" ref={sortRef}>
                    <button onClick={() => setSortOpen(v => !v)} className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-secondary transition-colors">
                      <SlidersHorizontal size={14} className="text-muted-foreground" />
                      <span className="hidden sm:inline">{currentSortLabel}</span>
                      <ChevronDown size={13} className={`text-muted-foreground transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {sortOpen && (
                      <div className="absolute right-0 top-full mt-1.5 w-52 bg-card border border-border rounded-2xl shadow-xl py-1.5 z-20">
                        {SORT_OPTIONS.map(o => (
                          <button key={o.id} onClick={() => { setSort(o.id); setSortOpen(false) }} className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${sort === o.id ? 'text-primary font-bold' : 'text-foreground/75 hover:bg-secondary'}`}>
                            {o.label} {sort === o.id && <Check size={13} />}
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

              {/* Price drop filter chip */}
              {sort === 'drops' && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-green-500/10 text-green-600 border border-green-500/20 rounded-lg font-bold">
                    <Zap size={11} /> Price drops first
                    <button onClick={() => setSort('date-desc')}><X size={11} /></button>
                  </span>
                </div>
              )}

              {/* Empty collection state */}
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="text-5xl mb-4">{currentCollection?.emoji ?? '💔'}</div>
                  <h3 className="text-lg font-black text-foreground mb-2">
                    {activeCol === 'all' ? 'Your wishlist is empty' : `Nothing in ${currentCollection?.name}`}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                    {activeCol === 'all' ? 'Start adding items you love by tapping the heart icon on any product.' : 'Move items from other collections or start exploring.'}
                  </p>
                  <Link href="/products" className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-xl font-bold text-sm hover:bg-foreground/85 transition-all">
                    Discover Products <ArrowRight size={15} />
                  </Link>
                </div>
              ) : view === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {filtered.map(item => (
                    <WishCard key={item.id} item={item} view="grid" onRemove={removeItem} onAddToCart={addToCart} onMove={moveItem} collections={collections} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filtered.map(item => (
                    <WishCard key={item.id} item={item} view="list" onRemove={removeItem} onAddToCart={addToCart} onMove={moveItem} collections={collections} />
                  ))}
                </div>
              )}

              {/* Add all to cart — bottom */}
              {filtered.length > 2 && filtered.some(i => i.inStock) && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={addAllToCart}
                    className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold transition-all active:scale-[0.97] shadow-sm ${addedAll ? 'bg-green-500 text-white' : 'bg-foreground text-background hover:bg-foreground/85'}`}
                  >
                    <ShoppingBag size={16} />
                    {addedAll ? 'All Added to Bag!' : `Add All In-Stock to Bag (${filtered.filter(i => i.inStock).length} items)`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ═══ RECOMMENDED ═══ */}
        <section className="border-t border-border bg-secondary/30 py-12 sm:py-16">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">Just for you</p>
                <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">You Might Also Love</h2>
              </div>
              <Link href="/products" className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                Explore <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {RECOMMENDED.map(p => <ProductCard key={p.id} {...p} />)}
            </div>
          </div>
        </section>

      </main>

      {/* Mobile sticky bar */}
      {filtered.length > 0 && filtered.some(i => i.inStock) && (
        <div className="sm:hidden fixed bottom-16 inset-x-0 z-40 px-4 pb-2">
          <div className="bg-card/96 backdrop-blur-xl border border-border rounded-2xl p-3 flex items-center gap-3 shadow-2xl shadow-black/15">
            <div className="flex -space-x-2 shrink-0">
              {filtered.filter(i => i.inStock).slice(0, 3).map(i => (
                <div key={i.id} className="relative w-9 h-9 rounded-lg overflow-hidden border-2 border-card bg-secondary">
                  <Image src={i.image} alt={i.name} fill className="object-cover" sizes="36px" />
                </div>
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground">{filtered.filter(i => i.inStock).length} items in stock</p>
              <p className="text-[10px] text-muted-foreground">{fmt(filtered.filter(i => i.inStock).reduce((s, i) => s + i.price, 0))} total</p>
            </div>
            <button
              onClick={addAllToCart}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-[0.97] shrink-0 ${addedAll ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary/90'}`}
            >
              <ShoppingBag size={14} />
              {addedAll ? 'Added!' : 'Add All'}
            </button>
          </div>
        </div>
      )}

    </div>
  )
}