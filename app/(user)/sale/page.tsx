'use client'

import {
  ArrowRight, ChevronRight, Clock, Zap, Tag,
  TrendingDown, Flame, Star, Timer, Gift,
  Check, Package, ShieldCheck, Truck
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'
import ProductCard, { type ProductCardProps } from '@/components/product-card'

/* ═══════════════════════════════════════════════════════
   COUNTDOWN HOOK
═══════════════════════════════════════════════════════ */

function useCountdown(targetMs: number) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 })
  useEffect(() => {
    const tick = () => {
      const rem = Math.max(0, targetMs - Date.now())
      setT({
        d: Math.floor(rem / 86400000),
        h: Math.floor((rem % 86400000) / 3600000),
        m: Math.floor((rem % 3600000) / 60000),
        s: Math.floor((rem % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetMs])
  return t
}

function pad(n: number) { return String(n).padStart(2, '0') }

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */

const SALE_TABS = [
  { id: 'all', label: 'All Deals', icon: Tag },
  { id: 'flash', label: 'Flash Sale', icon: Zap },
  { id: 'clearance', label: 'Clearance', icon: TrendingDown },
  { id: 'bundle', label: 'Bundles', icon: Gift },
  { id: 'ending', label: 'Ending Soon', icon: Timer },
]

type DealProduct = ProductCardProps & { category: string; stock: number; soldPct: number; endsMs?: number; isFlash?: boolean; isClearance?: boolean; isBundle?: boolean }

const ALL_DEALS: DealProduct[] = [
  { id: 'd1', title: 'Sony WH-1000XM5 Wireless Headphones', brand: 'Sony', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', price: 199.99, originalPrice: 349.99, rating: 4.9, reviews: 2341, badge: 'Sale', category: 'electronics', stock: 8, soldPct: 82, isFlash: true, endsMs: Date.now() + 4 * 3600000 },
  { id: 'd2', title: 'Apple Watch Series 9 GPS 45mm', brand: 'Apple', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', price: 299.99, originalPrice: 429.99, rating: 4.8, reviews: 1876, badge: 'Sale', category: 'electronics', stock: 14, soldPct: 65, isFlash: true, endsMs: Date.now() + 5.5 * 3600000 },
  { id: 'd3', title: 'Nike Air Max 270 Running Shoes', brand: 'Nike', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', price: 89.99, originalPrice: 149.99, rating: 4.5, reviews: 2876, badge: 'Sale', category: 'fashion', stock: 23, soldPct: 55, endsMs: Date.now() + 2 * 86400000 },
  { id: 'd4', title: 'LG UltraWide 34" Curved Monitor', brand: 'LG', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop', price: 449.99, originalPrice: 699.99, rating: 4.7, reviews: 834, badge: 'Sale', category: 'electronics', stock: 5, soldPct: 90, isFlash: true, endsMs: Date.now() + 2.5 * 3600000 },
  { id: 'd5', title: 'Ergonomic Mesh Office Chair', brand: 'ErgoSeat', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=400&fit=crop', price: 249.99, originalPrice: 549.99, rating: 4.7, reviews: 789, badge: 'Sale', category: 'home', stock: 11, soldPct: 71, isClearance: true },
  { id: 'd6', title: 'Razer BlackWidow V4 Keyboard', brand: 'Razer', image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop', price: 89.99, originalPrice: 169.99, rating: 4.6, reviews: 987, badge: 'Sale', category: 'gaming', stock: 31, soldPct: 38, isClearance: true },
  { id: 'd7', title: 'Samsung T7 Portable SSD 2TB', brand: 'Samsung', image: 'https://images.unsplash.com/photo-1531492898419-3a9aa15ebbd0?w=400&h=400&fit=crop', price: 99.99, originalPrice: 179.99, rating: 4.7, reviews: 1654, badge: 'Sale', category: 'electronics', stock: 19, soldPct: 44 },
  { id: 'd8', title: 'Bose QuietComfort Earbuds II', brand: 'Bose', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop', price: 169.99, originalPrice: 299.99, rating: 4.7, reviews: 1432, badge: 'Sale', category: 'electronics', stock: 7, soldPct: 86, isFlash: true, endsMs: Date.now() + 6 * 3600000 },
  { id: 'd9', title: 'Adidas Ultraboost 23 Sneakers', brand: 'Adidas', image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop', price: 119.99, originalPrice: 189.99, rating: 4.6, reviews: 1543, badge: 'Sale', category: 'fashion', stock: 28, soldPct: 42, isClearance: true },
  { id: 'd10', title: 'Smart LED Floor Lamp', brand: 'LightUp', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop', price: 49.99, originalPrice: 89.99, rating: 4.4, reviews: 354, badge: 'Sale', category: 'home', stock: 42, soldPct: 22, isClearance: true },
  { id: 'd11', title: 'GoPro Hero 12 Action Camera', brand: 'GoPro', image: 'https://images.unsplash.com/photo-1547558902-c0e053edd6d4?w=400&h=400&fit=crop', price: 299.99, originalPrice: 399.99, rating: 4.6, reviews: 876, badge: 'Sale', category: 'electronics', stock: 16, soldPct: 60, endsMs: Date.now() + 3 * 86400000 },
  { id: 'd12', title: 'Yoga Mat Premium 6mm + Block Set', brand: 'ZenFlow', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop', price: 59.99, originalPrice: 109.99, rating: 4.6, reviews: 2187, badge: 'Bundle', category: 'sports', stock: 35, soldPct: 30, isBundle: true },
  { id: 'd13', title: 'Logitech MX Master 3S + Keys Combo', brand: 'Logitech', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop', price: 149.99, originalPrice: 249.99, rating: 4.8, reviews: 3210, badge: 'Bundle', category: 'electronics', stock: 20, soldPct: 68, isBundle: true },
  { id: 'd14', title: 'Gaming Setup Bundle: Chair + Desk', brand: 'SecretLab', image: 'https://images.unsplash.com/photo-1593640408182-31c228e85eca?w=400&h=400&fit=crop', price: 599.99, originalPrice: 999.99, rating: 4.8, reviews: 345, badge: 'Bundle', category: 'gaming', stock: 9, soldPct: 75, isBundle: true },
  { id: 'd15', title: 'ASUS ROG 27" 4K Gaming Monitor', brand: 'ASUS', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop', price: 599.99, originalPrice: 999.99, rating: 4.8, reviews: 456, badge: 'Sale', category: 'gaming', stock: 4, soldPct: 92, isFlash: true, endsMs: Date.now() + 1.5 * 3600000 },
  { id: 'd16', title: 'Non-Stick Cookware 12-Piece Set', brand: 'KitchenPro', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', price: 89.99, originalPrice: 199.99, rating: 4.8, reviews: 1102, badge: 'Sale', category: 'home', stock: 25, soldPct: 48, isClearance: true },
]

const HERO_BANNERS = [
  { id: 'mega', label: 'Mega Sale', tag: 'Up to 60% Off', title: 'Season\nClearance', sub: 'Thousands of products. Prices slashed. Shop before stock runs out.', cta: 'Shop All Deals', href: '#', image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=900&h=500&fit=crop', overlay: 'from-black/80 via-black/50 to-transparent', accentMs: Date.now() + 3 * 86400000 },
]

const DEAL_OF_DAY = {
  id: 'dod',
  title: 'Sony WH-1000XM5 Wireless Headphones',
  brand: 'Sony',
  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&h=700&fit=crop',
  price: 199.99,
  originalPrice: 349.99,
  rating: 4.9,
  reviews: 2341,
  stock: 8,
  soldPct: 82,
  features: ['40h battery life', 'Industry-leading ANC', 'LDAC Hi-Res Audio', 'Multipoint connection'],
  endsMs: Date.now() + 18 * 3600000,
}

const CAT_SALES = [
  { id: 'electronics', label: 'Electronics', icon: '⚡', discount: 'Up to 55% off', count: 234, image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=200&fit=crop', color: 'from-blue-950 to-blue-900' },
  { id: 'fashion', label: 'Fashion', icon: '✦', discount: 'Up to 40% off', count: 567, image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=200&fit=crop', color: 'from-rose-950 to-rose-900' },
  { id: 'home', label: 'Home & Living', icon: '⌂', discount: 'Up to 50% off', count: 189, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=200&fit=crop', color: 'from-emerald-950 to-emerald-900' },
  { id: 'gaming', label: 'Gaming', icon: '◈', discount: 'Up to 45% off', count: 98, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop', color: 'from-violet-950 to-violet-900' },
  { id: 'sports', label: 'Sports', icon: '◎', discount: 'Up to 35% off', count: 112, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=200&fit=crop', color: 'from-orange-950 to-orange-900' },
  { id: 'books', label: 'Books', icon: '◻', discount: 'Up to 30% off', count: 234, image: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400&h=200&fit=crop', color: 'from-amber-950 to-amber-900' },
]

/* ═══════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════ */

function StockBar({ soldPct, stock }: { soldPct: number; stock: number }) {
  const low = stock <= 10
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-[10px] font-bold ${low ? 'text-primary' : 'text-muted-foreground'}`}>
          {low ? `⚡ Only ${stock} left!` : `${stock} in stock`}
        </span>
        <span className="text-[10px] text-muted-foreground">{soldPct}% sold</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${soldPct > 80 ? 'bg-primary' : soldPct > 50 ? 'bg-amber-500' : 'bg-green-500'}`}
          style={{ width: `${soldPct}%` }}
        />
      </div>
    </div>
  )
}

function FlashCountdown({ endsMs }: { endsMs: number }) {
  const { h, m, s } = useCountdown(endsMs)
  return (
    <div className="flex items-center gap-1 mt-2">
      <Clock size={11} className="text-primary shrink-0" />
      <span className="text-[10px] text-primary font-bold tabular-nums">
        {pad(h)}:{pad(m)}:{pad(s)} left
      </span>
    </div>
  )
}

function DealCard({ deal }: { deal: DealProduct }) {
  const disc = Math.round(((deal.originalPrice! - deal.price) / deal.originalPrice!) * 100)
  const [added, setAdded] = useState(false)

  return (
    <Link href={`/products/${deal.id}`} className="group block">
      <div className="bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-border hover:shadow-lg hover:shadow-black/6 hover:-translate-y-0.5 transition-all duration-300">
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <Image src={deal.image} alt={deal.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 50vw, 25vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {/* Discount badge */}
          <div className="absolute top-3 left-3 bg-primary text-white text-[11px] font-black px-2 py-1 rounded-lg shadow-lg">
            -{disc}%
          </div>
          {deal.isFlash && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded-lg">
              <Zap size={9} fill="currentColor" /> Flash
            </div>
          )}
          {deal.isBundle && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
              <Gift size={9} /> Bundle
            </div>
          )}
        </div>
        <div className="p-3.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{deal.brand}</p>
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug mb-2 group-hover:text-primary transition-colors">{deal.title}</h3>
          <div className="flex items-center gap-1 mb-2.5">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={10} className={i < Math.round(deal.rating) ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'} />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">({deal.reviews.toLocaleString()})</span>
          </div>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-lg font-black text-foreground">${deal.price.toFixed(2)}</span>
            <span className="text-xs text-muted-foreground line-through">${deal.originalPrice!.toFixed(2)}</span>
            <span className="text-[10px] font-bold text-primary ml-auto">Save ${(deal.originalPrice! - deal.price).toFixed(0)}</span>
          </div>
          {deal.endsMs && <FlashCountdown endsMs={deal.endsMs} />}
          <StockBar soldPct={deal.soldPct} stock={deal.stock} />
          <button
            onClick={e => { e.preventDefault(); setAdded(true); setTimeout(() => setAdded(false), 1500) }}
            className={`mt-3.5 w-full py-2 rounded-xl text-xs font-bold transition-all active:scale-[0.97] ${added ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary/90'}`}
          >
            {added ? '✓ Added to Bag' : 'Add to Bag'}
          </button>
        </div>
      </div>
    </Link>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
export default function SalePage() {
  const [activeTab, setActiveTab] = useState('all')
  const [saleEnd] = useState(() => Date.now() + 3 * 86400000 + 7 * 3600000)
  const [dealOfDayEnd] = useState(() => DEAL_OF_DAY.endsMs)
  const { d, h, m, s } = useCountdown(saleEnd)
  const dodCountdown = useCountdown(dealOfDayEnd)

  const filteredDeals = useMemo(() => {
    if (activeTab === 'flash') return ALL_DEALS.filter(p => p.isFlash)
    if (activeTab === 'clearance') return ALL_DEALS.filter(p => p.isClearance)
    if (activeTab === 'bundle') return ALL_DEALS.filter(p => p.isBundle)
    if (activeTab === 'ending') return ALL_DEALS.filter(p => p.endsMs && (p.endsMs - Date.now()) < 8 * 3600000)
    return ALL_DEALS
  }, [activeTab])

  const flashDeals = ALL_DEALS.filter(p => p.isFlash).slice(0, 4)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pb-20 sm:pb-0">

        {/* ═══ MEGA HERO ═══ */}
        <section className="relative overflow-hidden min-h-[420px] sm:min-h-[520px]">
          <Image
            src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1400&h=600&fit=crop"
            alt="Sale"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />

          <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 py-14 sm:py-20 flex flex-col justify-between h-full min-h-[420px] sm:min-h-[520px]">
            <nav className="flex items-center gap-2 text-xs text-white/40">
              <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
              <ChevronRight size={12} />
              <span className="text-white/70 font-medium">Sale</span>
            </nav>

            <div className="grid lg:grid-cols-2 gap-8 items-end">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  Season Sale — Live Now
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight mb-5">
                  Up to<br />
                  <span className="text-primary">60% Off</span>
                </h1>
                <p className="text-white/60 text-base sm:text-lg max-w-md leading-relaxed mb-8">
                  Thousands of products across every category. Real discounts, real savings — limited time only.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="#deals" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-primary/90 active:scale-[0.97] transition-all shadow-lg shadow-primary/30">
                    Shop All Deals <ArrowRight size={16} />
                  </Link>
                  <Link href="#flash" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-5 py-3.5 rounded-xl font-bold text-sm hover:bg-white/15 backdrop-blur-sm transition-all">
                    <Zap size={15} fill="currentColor" className="text-amber-400" /> Flash Deals
                  </Link>
                </div>
              </div>

              {/* Sale countdown */}
              <div className="flex flex-col items-start lg:items-end gap-4">
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <Clock size={13} /> Sale ends in
                </p>
                <div className="flex gap-3">
                  {[{ v: d, l: 'Days' }, { v: h, l: 'Hours' }, { v: m, l: 'Mins' }, { v: s, l: 'Secs' }].map(({ v, l }) => (
                    <div key={l} className="bg-white/8 border border-white/10 backdrop-blur-sm rounded-2xl p-3.5 sm:p-5 text-center min-w-[60px] sm:min-w-[72px]">
                      <p className="text-3xl sm:text-4xl font-black text-white tabular-nums leading-none">{pad(v)}</p>
                      <p className="text-white/40 text-[10px] font-medium mt-1.5 uppercase tracking-widest">{l}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {['No code needed', 'Free returns', 'Guaranteed authentic'].map(t => (
                    <span key={t} className="flex items-center gap-1.5 text-xs text-white/60 bg-white/8 border border-white/10 px-3 py-1.5 rounded-full">
                      <Check size={11} className="text-green-400" /> {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ TICKER ═══ */}
        <div className="bg-primary overflow-hidden py-2.5">
          <div className="flex whitespace-nowrap animate-[marquee_22s_linear_infinite]">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="inline-flex items-center gap-10 text-white text-xs font-semibold tracking-wider px-8">
                <span>🔥 UP TO 60% OFF ELECTRONICS</span>
                <span>✦ FREE SHIPPING ON ALL SALE ORDERS</span>
                <span>⚡ FLASH DEALS CHANGE EVERY 6 HOURS</span>
                <span>🎁 BUNDLE DEALS — SAVE MORE</span>
                <span>⏱ LIMITED STOCK — SHOP NOW</span>
              </span>
            ))}
          </div>
        </div>

        {/* ═══ DEAL OF THE DAY ═══ */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-primary text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
              <Flame size={12} fill="white" /> Deal of the Day
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock size={14} />
              Resets in <span className="font-bold text-foreground tabular-nums">{pad(dodCountdown.h)}:{pad(dodCountdown.m)}:{pad(dodCountdown.s)}</span>
            </div>
          </div>

          <div className="relative overflow-hidden bg-foreground rounded-3xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
            <div className="relative grid lg:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative aspect-square lg:aspect-auto lg:min-h-[440px] overflow-hidden bg-foreground/50">
                <Image src={DEAL_OF_DAY.image} alt={DEAL_OF_DAY.title} fill className="object-cover opacity-90" sizes="50vw" />
                <div className="absolute top-5 left-5 bg-primary text-white text-xl font-black px-4 py-2 rounded-2xl shadow-xl">
                  -{Math.round(((DEAL_OF_DAY.originalPrice - DEAL_OF_DAY.price) / DEAL_OF_DAY.originalPrice) * 100)}%
                </div>
              </div>
              {/* Info */}
              <div className="p-8 sm:p-10 lg:p-14 flex flex-col justify-center">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">{DEAL_OF_DAY.brand}</p>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight mb-4">{DEAL_OF_DAY.title}</h2>
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
                  </div>
                  <span className="text-white/50 text-sm">{DEAL_OF_DAY.rating} ({DEAL_OF_DAY.reviews.toLocaleString()} reviews)</span>
                </div>
                {/* Features */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {DEAL_OF_DAY.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-xs text-white/70">
                      <Check size={12} className="text-primary shrink-0" /> {f}
                    </div>
                  ))}
                </div>
                {/* Pricing */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-4xl font-black text-white">${DEAL_OF_DAY.price.toFixed(2)}</span>
                  <span className="text-lg text-white/30 line-through">${DEAL_OF_DAY.originalPrice.toFixed(2)}</span>
                  <span className="text-sm font-bold text-primary">Save ${(DEAL_OF_DAY.originalPrice - DEAL_OF_DAY.price).toFixed(0)}</span>
                </div>
                {/* Stock bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-primary font-bold">⚡ Only {DEAL_OF_DAY.stock} left!</span>
                    <span className="text-white/40">{DEAL_OF_DAY.soldPct}% sold</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${DEAL_OF_DAY.soldPct}%` }} />
                  </div>
                </div>
                <Link href={`/products/${DEAL_OF_DAY.id}`} className="inline-flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-2xl font-black text-base hover:bg-primary/90 active:scale-[0.98] transition-all shadow-xl shadow-primary/30">
                  Grab This Deal <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ CATEGORY SALE CARDS ═══ */}
        <section className="bg-secondary/30 border-y border-border py-10 sm:py-14">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">Shop by department</p>
                <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">Sale by Category</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {CAT_SALES.map(cat => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.id}&sale=true`}
                  className="group relative overflow-hidden rounded-2xl aspect-[3/4] sm:aspect-square transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/12"
                >
                  <Image src={cat.image} alt={cat.label} fill className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" sizes="(max-width: 640px) 50vw, 16vw" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-75`} />
                  <div className="absolute inset-0 flex flex-col justify-between p-4">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <p className="text-white font-black text-sm leading-tight">{cat.label}</p>
                      <p className="text-white/70 text-[11px] mt-0.5 font-semibold">{cat.discount}</p>
                      <p className="text-white/40 text-[10px] mt-0.5">{cat.count} deals</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FLASH DEALS ═══ */}
        <section id="flash" className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-2xl">
                <Zap size={20} className="text-primary fill-primary/30" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-0.5">Limited time</p>
                <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">Flash Deals</h2>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary border border-border rounded-xl px-3 py-2">
              <Clock size={13} className="text-primary" />
              Deals refresh in <span className="font-bold text-foreground ml-1">{pad(h)}:{pad(m)}:{pad(s)}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {flashDeals.map(d => <DealCard key={d.id} deal={d} />)}
          </div>
        </section>

        {/* ═══ TABS + ALL DEALS ═══ */}
        <section id="deals" className="border-t border-border">
          {/* Sticky tab bar */}
          <div className="sticky top-14 sm:top-16 z-30 bg-background/96 backdrop-blur-md border-b border-border">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
              <div className="flex overflow-x-auto scrollbar-none">
                {SALE_TABS.map(({ id, label, icon: Icon }) => {
                  const count = id === 'all' ? ALL_DEALS.length
                    : id === 'flash' ? ALL_DEALS.filter(p => p.isFlash).length
                    : id === 'clearance' ? ALL_DEALS.filter(p => p.isClearance).length
                    : id === 'bundle' ? ALL_DEALS.filter(p => p.isBundle).length
                    : ALL_DEALS.filter(p => p.endsMs && (p.endsMs - Date.now()) < 8 * 3600000).length
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`flex items-center gap-2 shrink-0 px-4 py-4 text-sm font-semibold border-b-2 transition-all ${activeTab === id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                      <Icon size={14} />
                      {label}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === id ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>{count}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">{filteredDeals.length} deals found</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck size={13} className="text-green-500" />
                All prices include VAT
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {filteredDeals.map(d => <DealCard key={d.id} deal={d} />)}
            </div>

            {/* Load more */}
            <div className="flex flex-col items-center mt-12 gap-3">
              <div className="w-full max-w-xs bg-border rounded-full h-1 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${(filteredDeals.length / ALL_DEALS.length) * 100}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">Showing {filteredDeals.length} of {ALL_DEALS.length} deals</p>
              <button className="mt-2 px-8 py-3 border border-border rounded-xl text-sm font-bold text-foreground hover:bg-secondary active:scale-[0.97] transition-all">
                Load More Deals
              </button>
            </div>
          </div>
        </section>

        {/* ═══ BUNDLE HIGHLIGHT ═══ */}
        <section className="bg-secondary/40 border-t border-border py-10 sm:py-14">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">Save more</p>
                <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">Bundle Deals</h2>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {ALL_DEALS.filter(d => d.isBundle).map(bundle => {
                const disc = Math.round(((bundle.originalPrice! - bundle.price) / bundle.originalPrice!) * 100)
                return (
                  <Link key={bundle.id} href={`/products/${bundle.id}`} className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5">
                    <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                      <Image src={bundle.image} alt={bundle.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="33vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1">
                          <Gift size={9} /> Bundle
                        </span>
                        <span className="bg-primary text-white text-[10px] font-black px-2 py-1 rounded-lg">-{disc}%</span>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{bundle.brand}</p>
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors mb-3 leading-snug">{bundle.title}</h3>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-black text-foreground">${bundle.price.toFixed(2)}</span>
                          <span className="text-sm text-muted-foreground line-through ml-2">${bundle.originalPrice!.toFixed(2)}</span>
                        </div>
                        <span className="text-xs font-bold text-primary">Save ${(bundle.originalPrice! - bundle.price).toFixed(0)}</span>
                      </div>
                      <StockBar soldPct={bundle.soldPct} stock={bundle.stock} />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* ═══ TRUST STRIP ═══ */}
        <section className="border-t border-border bg-background py-8">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-0 sm:divide-x sm:divide-border">
              {[
                { icon: ShieldCheck, title: 'Verified deals', sub: 'All prices checked daily' },
                { icon: Truck, title: 'Free shipping', sub: 'On all sale orders $50+' },
                { icon: Package, title: 'Easy returns', sub: '30-day return policy' },
                { icon: Tag, title: 'No hidden fees', sub: 'Price shown is price paid' },
              ].map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex items-center gap-3.5 sm:px-8 first:sm:pl-0 last:sm:pr-0">
                  <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{title}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0) }
          to { transform: translateX(-50%) }
        }
      `}</style>
    </div>
  )
}