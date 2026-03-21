'use client'

import {
  ShoppingBag, Trash2, Plus, Minus, Tag, ChevronRight,
  Truck, Shield, RefreshCw, ArrowRight, Heart,
  Gift, Zap, Check, X, Info, Lock, Star,
  ChevronDown, Package
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useMemo } from 'react'

/* ═══════════════════════════════════════════════════════
   TYPES & DATA
═══════════════════════════════════════════════════════ */

type CartItem = {
  id: string
  productId: string
  name: string
  brand: string
  image: string
  price: number
  originalPrice?: number
  color: string
  colorHex: string
  qty: number
  maxQty: number
  badge?: string
}

const INITIAL_ITEMS: CartItem[] = [
  { id: 'ci1', productId: 'p1', name: 'Sony WH-1000XM5 Wireless Headphones', brand: 'Sony', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', price: 279.99, originalPrice: 349.99, color: 'Midnight Black', colorHex: '#1a1a1a', qty: 1, maxQty: 8, badge: 'Bestseller' },
  { id: 'ci2', productId: 'p2', name: 'Logitech MX Master 3S Mouse', brand: 'Logitech', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop', price: 99.99, originalPrice: 119.99, color: 'Graphite', colorHex: '#555555', qty: 1, maxQty: 15, badge: 'Hot' },
  { id: 'ci3', productId: 'p3', name: 'Nike Air Max 270 Running Shoes', brand: 'Nike', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', price: 149.99, originalPrice: 180.00, color: 'Black / Red', colorHex: '#E40F2A', qty: 2, maxQty: 6 },
]

const SAVED: CartItem[] = [
  { id: 'sv1', productId: 'p4', name: 'Razer BlackWidow V4 Mechanical Keyboard', brand: 'Razer', image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop', price: 139.99, originalPrice: 169.99, color: 'Black', colorHex: '#1a1a1a', qty: 1, maxQty: 20 },
  { id: 'sv2', productId: 'p5', name: 'Samsung T7 Portable SSD 2TB', brand: 'Samsung', image: 'https://images.unsplash.com/photo-1531492898419-3a9aa15ebbd0?w=400&h=400&fit=crop', price: 149.99, color: 'Deep Blue', colorHex: '#1e3a5f', qty: 1, maxQty: 12 },
]

const UPSELLS = [
  { id: 'u1', name: 'Sony Carrying Case', brand: 'Sony', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop', price: 29.99, rating: 4.7, label: 'Often bought together' },
  { id: 'u2', name: 'USB-C Cable Braided 2m', brand: 'Anker', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=200&fit=crop', price: 14.99, rating: 4.8, label: 'Customers also bought' },
  { id: 'u3', name: 'Headphone Stand Aluminium', brand: 'Satechi', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop', price: 39.99, originalPrice: 54.99, rating: 4.6, label: 'Complete your setup' },
]

const PROMO_CODES: Record<string, { type: 'pct' | 'fixed'; value: number; label: string }> = {
  'SAVE20': { type: 'pct', value: 20, label: '20% off your order' },
  'WELCOME10': { type: 'pct', value: 10, label: '10% off — welcome gift' },
  'FREESHIP': { type: 'fixed', value: 9.99, label: 'Free shipping applied' },
}

const SHIPPING_OPTIONS = [
  { id: 'free', label: 'Standard Shipping', sub: 'Arrives Wed, Mar 25 – Fri, Mar 27', price: 0 },
  { id: 'express', label: 'Express Shipping', sub: 'Arrives Tomorrow, Mar 22', price: 9.99 },
  { id: 'overnight', label: 'Overnight Shipping', sub: 'Arrives Today by 9 PM', price: 19.99 },
]

/* ═══════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS)
  const [savedItems, setSavedItems] = useState<CartItem[]>(SAVED)
  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<null | { code: string; type: 'pct' | 'fixed'; value: number; label: string }>(null)
  const [promoError, setPromoError] = useState('')
  const [promoOpen, setPromoOpen] = useState(false)
  const [shippingId, setShippingId] = useState('free')
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [upsellAdded, setUpsellAdded] = useState<Record<string, boolean>>({})
  const [giftWrap, setGiftWrap] = useState(false)
  const [noteOpen, setNoteOpen] = useState(false)
  const [note, setNote] = useState('')

  const shipping = SHIPPING_OPTIONS.find(s => s.id === shippingId)!

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items])
  const originalTotal = useMemo(() => items.reduce((s, i) => s + (i.originalPrice ?? i.price) * i.qty, 0), [items])
  const savings = originalTotal - subtotal
  const promoDiscount = appliedPromo
    ? appliedPromo.type === 'pct'
      ? subtotal * appliedPromo.value / 100
      : Math.min(appliedPromo.value, subtotal)
    : 0
  const giftWrapFee = giftWrap ? 4.99 : 0
  const tax = (subtotal - promoDiscount + shipping.price + giftWrapFee) * 0.08
  const total = subtotal - promoDiscount + shipping.price + giftWrapFee + tax

  const itemCount = items.reduce((s, i) => s + i.qty, 0)

  const updateQty = (id: string, delta: number) => {
    setItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, qty: Math.max(1, Math.min(item.maxQty, item.qty + delta)) }
        : item
    ))
  }

  const removeItem = (id: string) => {
    setRemovingId(id)
    setTimeout(() => {
      setItems(prev => prev.filter(i => i.id !== id))
      setRemovingId(null)
    }, 300)
  }

  const saveForLater = (item: CartItem) => {
    setItems(prev => prev.filter(i => i.id !== item.id))
    setSavedItems(prev => [item, ...prev])
  }

  const moveToCart = (item: CartItem) => {
    setSavedItems(prev => prev.filter(i => i.id !== item.id))
    setItems(prev => [...prev, item])
  }

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase()
    const promo = PROMO_CODES[code]
    if (promo) {
      setAppliedPromo({ code, ...promo })
      setPromoError('')
      setPromoInput('')
      setPromoOpen(false)
    } else {
      setPromoError('Invalid or expired promo code.')
    }
  }

  const addUpsell = (id: string) => {
    setUpsellAdded(prev => ({ ...prev, [id]: true }))
    setTimeout(() => setUpsellAdded(prev => ({ ...prev, [id]: false })), 2000)
  }

  const fmt = (n: number) => `$${n.toFixed(2)}`

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pb-36 sm:pb-16">

        {/* ── PAGE HEADER ── */}
        <div className="border-b border-border bg-background">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
            <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight size={12} />
              <span className="text-foreground font-medium">Shopping Bag</span>
            </nav>
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                  Shopping Bag
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  {itemCount} item{itemCount !== 1 ? 's' : ''} · {fmt(subtotal)} subtotal
                </p>
              </div>
              {items.length > 0 && (
                <button
                  onClick={() => {
                    items.forEach(i => saveForLater(i))
                  }}
                  className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  <Heart size={13} /> Save all for later
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

          {items.length === 0 ? (
            /* ── EMPTY STATE ── */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center mb-5 border border-border">
                <ShoppingBag size={32} className="text-muted-foreground" />
              </div>
              <h2 className="text-xl font-black text-foreground mb-2">Your bag is empty</h2>
              <p className="text-muted-foreground text-sm mb-7 max-w-xs">Looks like you haven't added anything yet. Start shopping to fill it up.</p>
              <Link href="/products" className="inline-flex items-center gap-2 bg-foreground text-background px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-foreground/85 active:scale-[0.97] transition-all">
                Browse Products <ArrowRight size={16} />
              </Link>
              {savedItems.length > 0 && (
                <p className="text-xs text-muted-foreground mt-6">You have {savedItems.length} item{savedItems.length > 1 ? 's' : ''} saved for later ↓</p>
              )}
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-8 xl:gap-12">

              {/* ══════ LEFT: CART ITEMS ══════ */}
              <div className="space-y-3">

                {/* Flash deal banner */}
                <div className="flex items-center gap-3 px-4 py-3 bg-primary/8 border border-primary/20 rounded-2xl">
                  <div className="p-1.5 bg-primary/15 rounded-lg shrink-0">
                    <Zap size={14} className="text-primary fill-primary/30" />
                  </div>
                  <p className="text-xs font-semibold text-foreground flex-1">
                    <span className="font-black text-primary">Free shipping</span> on your order — you qualify!
                  </p>
                  <ChevronRight size={14} className="text-muted-foreground shrink-0" />
                </div>

                {/* Cart items */}
                {items.map(item => (
                  <div
                    key={item.id}
                    className={`group bg-card border border-border/70 rounded-2xl overflow-hidden transition-all duration-300 ${removingId === item.id ? 'opacity-0 scale-[0.98] translate-y-1' : 'opacity-100'}`}
                  >
                    <div className="flex gap-4 p-4 sm:p-5">
                      {/* Image */}
                      <Link href={`/products/${item.productId}`} className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-secondary border border-border/50">
                        <Image src={item.image} alt={item.name} fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="112px" />
                        {item.badge && (
                          <span className="absolute top-1.5 left-1.5 text-[9px] font-black px-1.5 py-0.5 bg-primary text-white rounded-md">{item.badge}</span>
                        )}
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0 flex flex-col gap-2.5">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">{item.brand}</p>
                          <Link href={`/products/${item.productId}`} className="font-bold text-foreground text-sm leading-snug hover:text-primary transition-colors line-clamp-2">
                            {item.name}
                          </Link>
                        </div>

                        {/* Color */}
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full border border-border/50 shrink-0" style={{ background: item.colorHex }} />
                          <span className="text-xs text-muted-foreground">{item.color}</span>
                        </div>

                        {/* Price + qty row */}
                        <div className="flex items-center justify-between gap-3 mt-auto">
                          {/* Price */}
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-lg font-black text-foreground">{fmt(item.price * item.qty)}</span>
                              {item.originalPrice && (
                                <span className="text-xs text-muted-foreground line-through">{fmt(item.originalPrice * item.qty)}</span>
                              )}
                            </div>
                            {item.qty > 1 && <p className="text-[10px] text-muted-foreground">{fmt(item.price)} each</p>}
                          </div>

                          {/* Qty stepper */}
                          <div className="flex items-center border border-border rounded-xl overflow-hidden">
                            <button onClick={() => updateQty(item.id, -1)} disabled={item.qty <= 1} className="px-2.5 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30">
                              <Minus size={13} />
                            </button>
                            <span className="px-3 text-sm font-bold text-foreground min-w-[2rem] text-center">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)} disabled={item.qty >= item.maxQty} className="px-2.5 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30">
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Item action bar */}
                    <div className="flex items-center justify-between gap-2 px-4 sm:px-5 py-2.5 border-t border-border/50 bg-secondary/30">
                      <div className="flex items-center gap-0.5">
                        {item.originalPrice && (
                          <span className="text-[10px] font-bold text-primary bg-primary/8 px-2 py-1 rounded-md">
                            Save {fmt((item.originalPrice - item.price) * item.qty)}
                          </span>
                        )}
                        {item.qty >= item.maxQty && (
                          <span className="text-[10px] text-amber-600 font-semibold ml-2 flex items-center gap-1">
                            <Info size={10} /> Max qty
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => saveForLater(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
                        >
                          <Heart size={12} /> Save
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-primary hover:bg-primary/8 rounded-lg transition-all"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* ── FREQUENTLY ADDED TOGETHER ── */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Package size={15} className="text-primary" />
                    <h3 className="font-bold text-sm text-foreground">Complete your order</h3>
                  </div>
                  <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">
                    {UPSELLS.map(u => (
                      <div key={u.id} className="flex items-center gap-3 flex-1 bg-card border border-border rounded-2xl p-3 hover:border-border/80 hover:shadow-sm transition-all">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-secondary shrink-0">
                          <Image src={u.image} alt={u.name} fill className="object-cover" sizes="56px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] text-primary font-bold uppercase tracking-widest mb-0.5">{u.label}</p>
                          <p className="text-xs font-semibold text-foreground leading-tight line-clamp-1">{u.name}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <div className="flex gap-0.5">
                              {Array.from({length:5}).map((_,i) => <Star key={i} size={9} className={i < Math.floor(u.rating) ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'} />)}
                            </div>
                            <span className="text-xs font-bold text-foreground">{fmt(u.price)}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => addUpsell(u.id)}
                          className={`shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-[0.97] ${upsellAdded[u.id] ? 'bg-green-500 text-white' : 'bg-foreground text-background hover:bg-foreground/85'}`}
                        >
                          {upsellAdded[u.id] ? <Check size={12} /> : <Plus size={12} />}
                          {upsellAdded[u.id] ? 'Added' : 'Add'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── SAVED FOR LATER ── */}
                {savedItems.length > 0 && (
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                        <Heart size={15} className="text-muted-foreground" />
                        Saved for Later
                        <span className="text-xs font-bold text-muted-foreground bg-secondary border border-border px-1.5 py-0.5 rounded-full">{savedItems.length}</span>
                      </h3>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {savedItems.map(item => (
                        <div key={item.id} className="flex gap-3 bg-card border border-border/60 rounded-2xl p-4 hover:border-border transition-all">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-secondary shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-muted-foreground font-semibold mb-0.5">{item.brand}</p>
                            <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2 mb-2">{item.name}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-black text-foreground">{fmt(item.price)}</span>
                              <button
                                onClick={() => moveToCart(item)}
                                className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
                              >
                                Move to bag <ShoppingBag size={11} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ══════ RIGHT: ORDER SUMMARY ══════ */}
              <div className="space-y-3">
                <div className="bg-card border border-border rounded-2xl overflow-hidden sticky top-24">

                  {/* Summary header */}
                  <div className="px-6 py-5 border-b border-border">
                    <h2 className="font-black text-foreground text-base">Order Summary</h2>
                  </div>

                  <div className="px-6 py-5 space-y-5">

                    {/* Promo code */}
                    <div>
                      <button
                        onClick={() => setPromoOpen(v => !v)}
                        className="flex items-center justify-between w-full text-sm font-semibold text-foreground"
                      >
                        <span className="flex items-center gap-2">
                          <Tag size={15} className="text-primary" />
                          {appliedPromo ? (
                            <span className="text-primary">Promo: <span className="font-black">{appliedPromo.code}</span></span>
                          ) : 'Add promo code'}
                        </span>
                        {appliedPromo ? (
                          <button onClick={e => { e.stopPropagation(); setAppliedPromo(null) }} className="text-muted-foreground hover:text-primary transition-colors">
                            <X size={15} />
                          </button>
                        ) : (
                          <ChevronDown size={15} className={`text-muted-foreground transition-transform ${promoOpen ? 'rotate-180' : ''}`} />
                        )}
                      </button>

                      {appliedPromo && (
                        <div className="mt-2.5 flex items-center gap-2 text-xs text-green-600 bg-green-500/10 border border-green-500/20 px-3 py-2 rounded-xl">
                          <Check size={12} className="shrink-0" />
                          {appliedPromo.label}
                        </div>
                      )}

                      {promoOpen && !appliedPromo && (
                        <div className="mt-3">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Enter code"
                              value={promoInput}
                              onChange={e => { setPromoInput(e.target.value); setPromoError('') }}
                              onKeyDown={e => e.key === 'Enter' && applyPromo()}
                              className="flex-1 min-w-0 bg-secondary border border-transparent rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground uppercase"
                            />
                            <button
                              onClick={applyPromo}
                              className="px-4 bg-foreground text-background text-sm font-bold rounded-xl hover:bg-foreground/85 active:scale-[0.97] transition-all"
                            >
                              Apply
                            </button>
                          </div>
                          {promoError && <p className="text-xs text-primary mt-2 flex items-center gap-1"><X size={11} /> {promoError}</p>}
                          <p className="text-[11px] text-muted-foreground mt-2">Try: SAVE20 · WELCOME10 · FREESHIP</p>
                        </div>
                      )}
                    </div>

                    {/* Shipping selector */}
                    <div>
                      <p className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                        <Truck size={15} className="text-primary" /> Shipping
                      </p>
                      <div className="flex flex-col gap-2">
                        {SHIPPING_OPTIONS.map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => setShippingId(opt.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${shippingId === opt.id ? 'border-primary bg-primary/5' : 'border-border hover:border-foreground/20'}`}
                          >
                            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${shippingId === opt.id ? 'border-primary' : 'border-border'}`}>
                              {shippingId === opt.id && <span className="w-2 h-2 bg-primary rounded-full" />}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-bold ${shippingId === opt.id ? 'text-primary' : 'text-foreground'}`}>{opt.label}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{opt.sub}</p>
                            </div>
                            <span className={`text-xs font-black shrink-0 ${opt.price === 0 ? 'text-green-600' : 'text-foreground'}`}>
                              {opt.price === 0 ? 'FREE' : fmt(opt.price)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Gift wrap */}
                    <div>
                      <button
                        onClick={() => setGiftWrap(v => !v)}
                        className={`flex items-center gap-3 w-full p-3.5 rounded-xl border text-left transition-all ${giftWrap ? 'border-primary bg-primary/5' : 'border-border hover:border-foreground/20'}`}
                      >
                        <span className={`w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${giftWrap ? 'border-primary bg-primary' : 'border-border'}`}>
                          {giftWrap && <Check size={10} className="text-white" />}
                        </span>
                        <div className="flex-1">
                          <p className={`text-xs font-bold ${giftWrap ? 'text-primary' : 'text-foreground'}`}>Add gift wrapping</p>
                          <p className="text-[10px] text-muted-foreground">Premium box + personalised card</p>
                        </div>
                        <span className="text-xs font-black text-foreground">+$4.99</span>
                        <Gift size={14} className={`shrink-0 ${giftWrap ? 'text-primary' : 'text-muted-foreground'}`} />
                      </button>
                    </div>

                    {/* Order note */}
                    <div>
                      <button onClick={() => setNoteOpen(v => !v)} className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors">
                        <ChevronDown size={13} className={`transition-transform ${noteOpen ? 'rotate-180' : ''}`} />
                        {noteOpen ? 'Hide' : 'Add'} order note
                      </button>
                      {noteOpen && (
                        <textarea
                          value={note}
                          onChange={e => setNote(e.target.value)}
                          placeholder="Special instructions, gift message…"
                          rows={3}
                          className="mt-2 w-full bg-secondary border border-transparent rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 resize-none transition-all"
                        />
                      )}
                    </div>

                    {/* Price breakdown */}
                    <div className="pt-4 border-t border-border space-y-2.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                        <span className="font-semibold text-foreground">{fmt(subtotal)}</span>
                      </div>
                      {savings > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-green-600">Items discount</span>
                          <span className="font-semibold text-green-600">-{fmt(savings)}</span>
                        </div>
                      )}
                      {appliedPromo && promoDiscount > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-primary flex items-center gap-1"><Tag size={11} /> {appliedPromo.code}</span>
                          <span className="font-semibold text-primary">-{fmt(promoDiscount)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className={`font-semibold ${shipping.price === 0 ? 'text-green-600' : 'text-foreground'}`}>
                          {shipping.price === 0 ? 'FREE' : fmt(shipping.price)}
                        </span>
                      </div>
                      {giftWrap && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1"><Gift size={11} /> Gift wrap</span>
                          <span className="font-semibold text-foreground">{fmt(giftWrapFee)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Tax (8%)</span>
                        <span className="font-semibold text-foreground">{fmt(tax)}</span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="font-black text-foreground text-base">Total</span>
                      <div className="text-right">
                        <span className="font-black text-foreground text-2xl">{fmt(total)}</span>
                        {(savings + promoDiscount) > 0 && (
                          <p className="text-xs text-green-600 font-semibold mt-0.5">You're saving {fmt(savings + promoDiscount)}!</p>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="space-y-2.5 pt-1">
                      <Link
                        href="/checkout"
                        className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-white rounded-2xl font-black text-base hover:bg-primary/90 active:scale-[0.98] transition-all shadow-xl shadow-primary/25"
                      >
                        <Lock size={16} /> Checkout — {fmt(total)}
                      </Link>
                      <p className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
                        <Shield size={11} className="text-green-500" />
                        SSL encrypted · Safe & secure checkout
                      </p>
                    </div>

                    {/* Payment methods */}
                    <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
                      {['Visa', 'MC', 'Amex', 'PayPal', 'ApplePay', 'GPay'].map(m => (
                        <span key={m} className="text-[9px] font-black text-muted-foreground border border-border rounded px-1.5 py-0.5 bg-secondary">{m}</span>
                      ))}
                    </div>

                    {/* Trust items */}
                    <div className="pt-3 border-t border-border flex flex-col gap-2">
                      {[
                        { icon: Truck, text: `${shipping.label} · ${shipping.sub}` },
                        { icon: RefreshCw, text: '30-day free returns' },
                        { icon: Shield, text: 'All items verified authentic' },
                      ].map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-2.5 text-[11px] text-muted-foreground">
                          <Icon size={12} className="text-primary shrink-0" />
                          {text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Continue shopping */}
                <Link href="/products" className="flex items-center justify-center gap-2 py-3 border border-border rounded-2xl text-sm font-semibold text-foreground hover:bg-secondary active:scale-[0.97] transition-all">
                  <ArrowRight size={15} className="rotate-180" /> Continue Shopping
                </Link>
              </div>

            </div>
          )}
        </div>
      </main>

      {/* ── MOBILE STICKY CHECKOUT BAR ── */}
      {items.length > 0 && (
        <div className="sm:hidden fixed bottom-16 inset-x-0 z-40 px-4 pb-2">
          <div className="bg-card/96 backdrop-blur-xl border border-border rounded-2xl shadow-2xl shadow-black/15 overflow-hidden">
            {/* Summary row */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary/40">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShoppingBag size={13} />
                <span>{itemCount} items</span>
                {(savings + promoDiscount) > 0 && (
                  <span className="text-green-600 font-semibold">· Saving {fmt(savings + promoDiscount)}</span>
                )}
              </div>
              <span className="font-black text-foreground">{fmt(total)}</span>
            </div>
            <div className="px-4 py-3">
              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 active:scale-[0.97] transition-all"
              >
                <Lock size={14} /> Secure Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}