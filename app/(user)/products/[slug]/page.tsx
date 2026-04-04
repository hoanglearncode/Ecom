'use client'

import {
  Star, Heart, ShoppingBag, Share2, Shield,
  Truck, RefreshCw, ChevronRight, ChevronLeft,
  Check, Minus, Plus, ZoomIn, ArrowRight,
  Award, Package, Clock, ThumbsUp, Camera,
  ChevronDown, Zap, Box, ImageIcon, Rotate3D,
  Sparkles, BadgeCheck, TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect, useCallback } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import ProductCard, { type ProductCardProps } from '@/components/product-card'

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */

const PRODUCT = {
  id: 'sony-wh1000xm5',
  name: 'Sony WH-1000XM5',
  subtitle: 'Wireless Noise-Cancelling Headphones',
  brand: 'Sony',
  brandLogo: '🎧',
  sku: 'SNY-WH1K-XM5-BLK',
  price: 279.99,
  originalPrice: 349.99,
  rating: 4.9,
  reviewCount: 2341,
  soldCount: 18400,
  inStock: true,
  stockLeft: 8,
  badge: 'Bestseller',
  category: 'Headphones & Earbuds',
  tags: ['Wireless', 'Noise Cancelling', 'Premium Audio', 'Travel'],
  description: `The WH-1000XM5 redefines what a wireless headphone can be. With our most advanced processor and eight microphones for industry-leading noise cancellation, these are the headphones that silence the world — so all that's left is the music.\n\nDesigned to wear all day with ultra-light materials and a new, softer fit, they fold flat so you can take them anywhere. And when the music stops, Speak-to-Chat and Quick Attention modes mean you never have to take them off.`,
  images: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop',
  ],
  sketchfabId: 'c00345fd64414c4e8895c6aaa262e4d5',
  sketchfabTitle: 'Nike Air Jordan',
  colors: [
    { id: 'black', label: 'Midnight Black', hex: '#1a1a1a', available: true },
    { id: 'silver', label: 'Platinum Silver', hex: '#c0c0c0', available: true },
    { id: 'blue', label: 'Midnight Blue', hex: '#1e3a5f', available: true },
    { id: 'sand', label: 'Natural Sand', hex: '#d4b896', available: false },
  ],
  highlights: [
    'Industry-leading noise cancellation with dual noise sensor technology',
    '30-hour battery life with quick charging (3 min = 3 hours)',
    'Crystal clear hands-free calling with 8 microphones',
    'Multipoint connection — pair with 2 devices simultaneously',
    'Adaptive Sound Control adjusts to your situation automatically',
    'Foldable design for easy portability',
  ],
  specs: {
    'Driver Unit': '30mm, dome type',
    'Frequency Response': '4 Hz – 40,000 Hz',
    'Noise Cancellation': 'Active (Dual Noise Sensor)',
    'Battery Life': '30 hours (NC on), 40 hours (NC off)',
    'Charging Time': '3.5 hours (USB-C)',
    'Quick Charge': '3 min → 3 hours playback',
    'Bluetooth Version': '5.2',
    'Codecs': 'SBC, AAC, LDAC',
    'Weight': '250g',
    'Microphones': '8 (4 for NC, 4 for calls)',
    'Connection Range': '10m',
    'Foldable': 'Yes',
  },
}

const REVIEWS = [
  { id: 1, author: 'Alex M.', avatar: 'AM', rating: 5, date: 'Mar 12, 2026', verified: true, helpful: 234, title: "Best headphones I've ever owned", body: 'The noise cancellation on these is absolutely incredible. I travel frequently and these have made long flights completely bearable. The sound quality is phenomenal — rich bass without muddiness, crystal clear mids and highs. Battery life exceeds expectations.', images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&h=120&fit=crop'] },
  { id: 2, author: 'Sarah K.', avatar: 'SK', rating: 5, date: 'Mar 8, 2026', verified: true, helpful: 187, title: 'Worth every penny', body: "I was hesitant about the price but these are worth it. The comfort is unreal — I can wear them for 8+ hours without any discomfort. The speak-to-chat feature is a game changer. Highly recommend.", images: [] },
  { id: 3, author: 'James L.', avatar: 'JL', rating: 4, date: 'Feb 28, 2026', verified: true, helpful: 112, title: 'Amazing ANC, slightly large', body: "The noise cancellation and sound quality are unmatched. My only minor complaint is they're a bit large for my head when wearing glasses for extended periods. Otherwise, perfect headphones.", images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=120&h=120&fit=crop'] },
  { id: 4, author: 'Maria C.', avatar: 'MC', rating: 5, date: 'Feb 19, 2026', verified: true, helpful: 98, title: 'Perfect for WFH', body: 'Working from home these are essential. The multipoint connection means I can seamlessly switch between my laptop and phone. Call quality is exceptional — colleagues say I sound clearer than ever.', images: [] },
]

const RATING_DIST = [
  { stars: 5, pct: 78 },
  { stars: 4, pct: 14 },
  { stars: 3, pct: 5 },
  { stars: 2, pct: 2 },
  { stars: 1, pct: 1 },
]

const RELATED: ProductCardProps[] = [
  { id: 'r1', title: 'Sony WF-1000XM5 True Wireless Earbuds', brand: 'Sony', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop', price: 229.99, originalPrice: 299.99, rating: 4.8, reviews: 1543, badge: 'New' },
  { id: 'r2', title: 'Bose QuietComfort 45 Headphones', brand: 'Bose', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop', price: 249.99, originalPrice: 329.99, rating: 4.7, reviews: 876 },
  { id: 'r3', title: 'Apple AirPods Max Silver', brand: 'Apple', image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=400&fit=crop', price: 449.99, rating: 4.6, reviews: 2341, badge: 'Hot' },
  { id: 'r4', title: 'Samsung Galaxy Buds2 Pro', brand: 'Samsung', image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop', price: 169.99, originalPrice: 229.99, rating: 4.5, reviews: 1109, badge: 'Sale' },
]

const TABS = ['Overview', 'Specifications', 'Reviews', 'In the Box']

const IN_THE_BOX = [
  'WH-1000XM5 Wireless Headphones',
  'USB-C Charging Cable',
  '3.5mm Audio Cable',
  'Premium Carrying Case',
  'Airline Adapter',
  'Quick Start Guide',
]

/* ═══════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════ */

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement
          el.style.opacity = '1'
          el.style.transform = 'none'
          io.unobserve(el)
        }
      }),
      { threshold: 0.1 }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function useScroll3D(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0)
  const onScroll = useCallback(() => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const p = 1 - rect.bottom / (window.innerHeight + rect.height)
    setProgress(Math.min(1, Math.max(0, p)))
  }, [ref])
  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])
  return progress
}

/* ═══════════════════════════════════════════════════════
   3D GALLERY COMPONENT
═══════════════════════════════════════════════════════ */

type GalleryMode = 'photos' | '3d'

function ProductGallery({
  images,
  sketchfabId,
  productName,
}: {
  images: string[]
  sketchfabId: string
  productName: string
}) {
  const [mode, setMode] = useState<GalleryMode>('photos')
  const [activeImg, setActiveImg] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [is3DLoaded, setIs3DLoaded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Subtle tilt on mouse move
  useEffect(() => {
    if (mode === '3d') return
    const card = cardRef.current
    if (!card) return
    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg) scale(1.01)`
    }
    const onLeave = () => { card.style.transform = '' }
    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
    return () => {
      card.removeEventListener('mousemove', onMove)
      card.removeEventListener('mouseleave', onLeave)
    }
  }, [mode])

  return (
    <div className="space-y-3">

      {/* ── Mode switcher ── */}
      <div className="flex items-center gap-2 p-1 bg-secondary rounded-2xl border border-border w-fit">
        <button
          onClick={() => setMode('photos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            mode === 'photos'
              ? 'bg-background text-foreground shadow-sm border border-border'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <ImageIcon size={13} />
          Photos
        </button>
        <button
          onClick={() => setMode('3d')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            mode === '3d'
              ? 'bg-foreground text-background shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Rotate3D size={13} />
          3D View
          <span className="bg-primary text-white text-[9px] px-1.5 py-0.5 rounded-full font-black">NEW</span>
        </button>
      </div>

      {/* ── Main viewer ── */}
      <div
        ref={cardRef}
        className="relative aspect-square rounded-3xl overflow-hidden bg-secondary group border border-border/50"
        style={{ transition: 'transform 0.15s ease', willChange: 'transform' }}
      >

        {/* PHOTO MODE */}
        {mode === 'photos' && (
          <>
            <Image
              src={images[activeImg]}
              alt={productName}
              fill
              className="object-cover transition-all duration-500"
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority
            />
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <span className="bg-primary text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-md">
                -20%
              </span>
              <span className="bg-foreground text-background text-[11px] font-black px-2.5 py-1 rounded-lg shadow-md">
                Bestseller
              </span>
            </div>
            {/* Zoom */}
            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute top-4 right-4 p-2.5 bg-background/80 backdrop-blur-sm rounded-xl text-foreground hover:bg-background transition-all opacity-0 group-hover:opacity-100 shadow-sm z-10"
            >
              <ZoomIn size={18} />
            </button>
            {/* Nav arrows */}
            <button
              onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-background/80 backdrop-blur-sm rounded-xl text-foreground hover:bg-background transition-all opacity-0 group-hover:opacity-100 shadow-sm z-10"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setActiveImg(i => (i + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-background/80 backdrop-blur-sm rounded-xl text-foreground hover:bg-background transition-all opacity-0 group-hover:opacity-100 shadow-sm z-10"
            >
              <ChevronRight size={18} />
            </button>
            {/* Mobile dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:hidden z-10">
              {images.map((_, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`h-1.5 rounded-full transition-all ${i === activeImg ? 'w-5 bg-primary' : 'w-1.5 bg-white/50'}`} />
              ))}
            </div>
          </>
        )}

        {/* 3D MODE */}
        {mode === '3d' && (
          <div className="absolute inset-0 bg-[#0d0d12]">
            {/* Grid atmosphere */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
            {/* Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-80 h-80 rounded-full bg-orange-500/8 blur-[80px]" />
            </div>

            {/* Loading shimmer */}
            {!is3DLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 pointer-events-none">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-2 border-orange-500/30 animate-ping" />
                  <div className="absolute inset-2 rounded-full border-2 border-orange-400/50 animate-spin" style={{ animationDuration: '1.5s' }} />
                  <Rotate3D size={20} className="absolute inset-0 m-auto text-orange-400 animate-pulse" />
                </div>
                <p className="text-white/40 text-xs font-medium">Loading 3D model…</p>
              </div>
            )}

            <iframe
              title={PRODUCT.sketchfabTitle}
              frameBorder="0"
              allowFullScreen
              allow="autoplay; fullscreen; xr-spatial-tracking"
              src={`https://sketchfab.com/models/${sketchfabId}/embed?autospin=0.3&autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=0&ui_watermark_link=0&ui_hint=0&camera=0`}
              className="absolute inset-0 w-full h-full"
              onLoad={() => setIs3DLoaded(true)}
            />

            {/* 3D badge overlay */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
              <div className="flex items-center gap-1.5 bg-orange-500/90 backdrop-blur-sm text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg shadow-lg shadow-orange-500/30">
                <Rotate3D size={11} />
                INTERACTIVE 3D
              </div>
              <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white/70 text-[10px] font-medium px-2.5 py-1 rounded-lg">
                Drag · Pinch · Scroll
              </div>
            </div>

            {/* Attribution */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 z-10">
              <p className="text-[10px] text-white/40">
                Model by{' '}
                <a href="https://sketchfab.com/MikhailKadilnikov" target="_blank" rel="nofollow noreferrer" className="text-sky-400 hover:text-sky-300">
                  Mikhail Kadilnikov
                </a>{' '}
                on{' '}
                <a href="https://sketchfab.com" target="_blank" rel="nofollow noreferrer" className="text-sky-400 hover:text-sky-300">
                  Sketchfab
                </a>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Thumbnail strip (photos only) ── */}
      {mode === 'photos' && (
        <div className="hidden sm:flex gap-2.5 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                i === activeImg ? 'border-primary shadow-md shadow-primary/15' : 'border-border hover:border-foreground/20'
              }`}
            >
              <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" sizes="80px" />
            </button>
          ))}
          {/* 3D teaser thumb */}
          <button
            onClick={() => setMode('3d')}
            className="shrink-0 w-20 h-20 rounded-xl border-2 border-dashed border-orange-500/40 bg-[#0d0d12] flex flex-col items-center justify-center gap-1 hover:border-orange-500/70 hover:bg-[#111118] transition-all group"
          >
            <Rotate3D size={18} className="text-orange-400 group-hover:rotate-12 transition-transform" />
            <span className="text-[9px] font-bold text-orange-400/70">3D View</span>
          </button>
          {/* Add photo */}
          <button className="shrink-0 w-20 h-20 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/40 hover:text-primary transition-all">
            <Camera size={16} />
            <span className="text-[9px] font-medium">Add photo</span>
          </button>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && mode === 'photos' && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-5 right-5 p-2.5 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all">
            ✕
          </button>
          <div className="relative w-full max-w-2xl aspect-square rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <Image src={images[activeImg]} alt={productName} fill className="object-contain" sizes="100vw" />
          </div>
          <div className="absolute bottom-8 flex gap-3">
            {images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? 'border-primary' : 'border-white/20'}`}>
                <Image src={img} alt="" fill className="object-cover" sizes="56px" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   SCROLL 3D SECTIONS
═══════════════════════════════════════════════════════ */

function ScrollCard3D({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      el.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg) translateZ(6px)`
    }
    const onLeave = () => { el.style.transform = '' }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave) }
  }, [])

  return (
    <div
      ref={ref}
      data-reveal
      style={{
        opacity: 0,
        transform: 'translateY(40px)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
        willChange: 'transform',
      }}
      className={className}
    >
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */

export default function ProductDetailPage() {
  const [activeColor, setActiveColor] = useState('black')
  const [qty, setQty] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [addedToBag, setAddedToBag] = useState(false)
  const [activeTab, setActiveTab] = useState('Overview')
  const [reviewSort, setReviewSort] = useState('helpful')
  const [reviewSortOpen, setReviewSortOpen] = useState(false)
  const [expandDesc, setExpandDesc] = useState(false)
  const tabsRef = useRef<HTMLDivElement>(null)

  useScrollReveal()

  const discount = Math.round(((PRODUCT.originalPrice - PRODUCT.price) / PRODUCT.originalPrice) * 100)
  const savings = (PRODUCT.originalPrice - PRODUCT.price).toFixed(2)

  const handleAddToBag = () => {
    setAddedToBag(true)
    setTimeout(() => setAddedToBag(false), 2000)
  }

  const scrollToReviews = () => {
    setActiveTab('Reviews')
    tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pb-20 sm:pb-0">

        {/* ═══ BREADCRUMB ═══ */}
        <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight size={12} />
              <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
              <ChevronRight size={12} />
              <Link href="/categories?sub=headphones" className="hover:text-foreground transition-colors">Headphones</Link>
              <ChevronRight size={12} />
              <span className="text-foreground font-medium truncate max-w-[200px]">{PRODUCT.name}</span>
            </nav>
          </div>
        </div>

        {/* ═══ MAIN PRODUCT SECTION ═══ */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <div className="grid lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px] gap-8 xl:gap-14">

            {/* ── LEFT: 3D GALLERY ── */}
            <div
              data-reveal
              style={{ opacity: 0, transform: 'translateX(-40px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}
            >
              <ProductGallery
                images={PRODUCT.images}
                sketchfabId={PRODUCT.sketchfabId}
                productName={PRODUCT.name}
              />
            </div>

            {/* ── RIGHT: PRODUCT INFO ── */}
            <div
              className="flex flex-col gap-6"
              data-reveal
              style={{ opacity: 0, transform: 'translateX(40px)', transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s' }}
            >

              {/* Brand + Actions */}
              <div className="flex items-start justify-between gap-3">
                <Link href={`/brands/${PRODUCT.brand.toLowerCase()}`} className="flex items-center gap-2 group">
                  <span className="text-xl">{PRODUCT.brandLogo}</span>
                  <span className="text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors">{PRODUCT.brand}</span>
                  <BadgeCheck size={13} className="text-primary" />
                </Link>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setWishlisted(v => !v)}
                    className={`p-2.5 rounded-xl border transition-all active:scale-[0.95] ${wishlisted ? 'bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-500/10 dark:border-rose-500/30' : 'border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground'}`}
                  >
                    <Heart size={18} className={wishlisted ? 'fill-rose-500' : ''} />
                  </button>
                  <button className="p-2.5 rounded-xl border border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground transition-all">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-snug mb-1">
                  {PRODUCT.name}
                </h1>
                <p className="text-muted-foreground text-sm">{PRODUCT.subtitle}</p>
              </div>

              {/* Sold + Trending pill */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-600 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 px-2.5 py-1 rounded-full">
                  <TrendingUp size={11} />
                  {PRODUCT.soldCount.toLocaleString()} sold this month
                </span> */}
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary bg-primary/8 border border-primary/20 px-2.5 py-1 rounded-full">
                  <Sparkles size={11} />
                  {PRODUCT.badge}
                </span>
              </div>

              {/* Rating row */}
              <button onClick={scrollToReviews} className="flex items-center gap-3 w-fit group">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={15} className={i < Math.floor(PRODUCT.rating) ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'} />
                  ))}
                </div>
                <span className="text-sm font-bold text-foreground">{PRODUCT.rating}</span>
                <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors underline underline-offset-2">
                  {PRODUCT.reviewCount.toLocaleString()} reviews
                </span>
              </button>

              {/* Price */}
              <div className="flex items-center gap-4 py-5 border-y border-border">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-4xl font-black text-foreground">${PRODUCT.price.toFixed(2)}</span>
                    <span className="text-base text-muted-foreground line-through">${PRODUCT.originalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md">-{discount}%</span>
                    <span className="text-xs text-muted-foreground">You save <span className="font-semibold text-foreground">${savings}</span></span>
                  </div>
                </div>
                {PRODUCT.stockLeft <= 10 && (
                  <div className="ml-auto flex items-center gap-1.5 text-primary text-xs font-bold bg-primary/8 border border-primary/20 px-3 py-2 rounded-xl animate-pulse">
                    <Zap size={13} fill="currentColor" />
                    Only {PRODUCT.stockLeft} left!
                  </div>
                )}
              </div>

              {/* Color selector */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-foreground">Color</p>
                  <p className="text-sm text-muted-foreground">{PRODUCT.colors.find(c => c.id === activeColor)?.label}</p>
                </div>
                <div className="flex gap-2.5">
                  {PRODUCT.colors.map(color => (
                    <button
                      key={color.id}
                      onClick={() => color.available && setActiveColor(color.id)}
                      disabled={!color.available}
                      title={color.label}
                      className={`relative w-9 h-9 rounded-full border-2 transition-all ${
                        activeColor === color.id
                          ? 'border-primary scale-110 shadow-lg shadow-primary/20'
                          : color.available
                          ? 'border-border/40 hover:border-border hover:scale-105'
                          : 'border-border/20 opacity-35 cursor-not-allowed'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {activeColor === color.id && (
                        <Check
                          size={14}
                          className={color.hex === '#1a1a1a' || color.hex === '#1e3a5f' ? 'text-white' : 'text-foreground'}
                          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
                        />
                      )}
                      {!color.available && (
                        <div className="absolute inset-0 rounded-full flex items-center justify-center">
                          <div className="w-full h-px bg-muted-foreground/40 rotate-45" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Qty + CTA */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex items-center border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="px-3.5 py-3 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="px-4 text-sm font-bold text-foreground min-w-[2.5rem] text-center">{qty}</span>
                    <button
                      onClick={() => setQty(q => Math.min(PRODUCT.stockLeft, q + 1))}
                      className="px-3.5 py-3 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToBag}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.97] shadow-lg ${
                      addedToBag
                        ? 'bg-green-500 text-white shadow-green-500/20'
                        : 'bg-foreground text-background hover:bg-foreground/85 shadow-black/10'
                    }`}
                  >
                    <ShoppingBag size={17} />
                    {addedToBag ? 'Added to Bag ✓' : 'Add to Bag'}
                  </button>
                </div>

                <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 active:scale-[0.97] transition-all shadow-lg shadow-primary/25">
                  <Zap size={15} fill="currentColor" />
                  Buy Now — ${(PRODUCT.price * qty).toFixed(2)}
                </button>
              </div>

              {/* Delivery info */}
              <div className="flex flex-col gap-2.5 p-4 bg-secondary/50 rounded-2xl border border-border">
                {[
                  { icon: Truck, text: 'Free delivery', sub: 'Estimated Wed, Mar 25 – Fri, Mar 27' },
                  { icon: RefreshCw, text: 'Free 30-day returns', sub: 'Change of mind accepted' },
                  { icon: Shield, text: '2-year warranty', sub: 'Manufacturer warranty included' },
                ].map(({ icon: Icon, text, sub }) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="p-1.5 bg-primary/10 rounded-lg shrink-0 mt-0.5">
                      <Icon size={13} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{text}</p>
                      <p className="text-[11px] text-muted-foreground">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-muted-foreground">SKU: {PRODUCT.sku}</p>
            </div>
          </div>
        </section>

        {/* ═══ 3D FEATURE BANNER ═══ */}
        <section
          className="relative overflow-hidden bg-[#07080d] py-12 sm:py-16 border-y border-white/5"
          data-reveal
          style={{ opacity: 0, transform: 'translateY(50px)', transition: 'opacity 0.8s ease, transform 0.8s ease' }}
        >
          {/* Grid bg */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/25 text-orange-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-3">
                <Rotate3D size={11} />
                Explore in 3D
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-1.5">See every angle before you buy</h3>
              <p className="text-white/40 text-sm max-w-md">
                Rotate, zoom, and inspect this product in full 3D — the closest thing to holding it in your hands.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              {[
                { icon: '🔄', label: '360° Rotation' },
                { icon: '🔍', label: 'Zoom In/Out' },
                { icon: '💡', label: 'Lighting Control' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-xl">
                    {icon}
                  </div>
                  <span className="text-[10px] text-white/40 font-medium whitespace-nowrap">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ TABS ═══ */}
        <div
          ref={tabsRef}
          className="sticky top-[41px] sm:top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border"
        >
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="flex overflow-x-auto">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`shrink-0 px-5 py-4 text-sm font-semibold border-b-2 transition-all ${
                    activeTab === tab
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                  {tab === 'Reviews' && (
                    <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                      {PRODUCT.reviewCount.toLocaleString()}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ TAB CONTENT ═══ */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

          {/* ── OVERVIEW ── */}
          {activeTab === 'Overview' && (
            <div className="grid lg:grid-cols-[1fr_360px] gap-12">
              <div>
                {/* Description */}
                <div className="mb-10">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">About this product</p>
                  <div className={`relative ${!expandDesc ? 'max-h-32 overflow-hidden' : ''}`}>
                    {PRODUCT.description.split('\n\n').map((para, i) => (
                      <p key={i} className="text-foreground/80 leading-relaxed mb-4 text-sm sm:text-base">{para}</p>
                    ))}
                    {!expandDesc && <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />}
                  </div>
                  <button onClick={() => setExpandDesc(v => !v)} className="flex items-center gap-1.5 text-xs font-bold text-primary mt-2 hover:underline">
                    {expandDesc ? 'Show less' : 'Read more'} <ChevronDown size={14} className={`transition-transform ${expandDesc ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Highlights */}
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-5">Key highlights</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {PRODUCT.highlights.map((hl, i) => (
                    <ScrollCard3D key={i} delay={i * 0.05} className="flex items-start gap-3 p-4 bg-secondary/50 rounded-2xl border border-border hover:border-primary/20 hover:bg-secondary/70 transition-colors cursor-default">
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={11} className="text-white" />
                      </div>
                      <p className="text-sm text-foreground/80 leading-snug">{hl}</p>
                    </ScrollCard3D>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="flex flex-col gap-4">
                {/* Rating card */}
                <ScrollCard3D className="bg-card border border-border rounded-2xl p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Customer Rating</p>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="text-center">
                      <p className="text-5xl font-black text-foreground">{PRODUCT.rating}</p>
                      <div className="flex gap-0.5 justify-center mt-1">
                        {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{PRODUCT.reviewCount.toLocaleString()} reviews</p>
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5">
                      {RATING_DIST.map(({ stars, pct }) => (
                        <div key={stars} className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-4 text-right">{stars}</span>
                          <Star size={10} className="fill-amber-400 text-amber-400 shrink-0" />
                          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground w-7 text-right">{pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={scrollToReviews} className="w-full py-2.5 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-secondary transition-all">
                    See all reviews
                  </button>
                </ScrollCard3D>

                {/* Tags */}
                <ScrollCard3D delay={0.1} className="bg-card border border-border rounded-2xl p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {PRODUCT.tags.map(tag => (
                      <Link key={tag} href={`/products?tag=${tag}`} className="text-xs px-3 py-1.5 bg-secondary border border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
                        {tag}
                      </Link>
                    ))}
                  </div>
                </ScrollCard3D>
              </div>
            </div>
          )}

          {/* ── SPECIFICATIONS ── */}
          {activeTab === 'Specifications' && (
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-6">Technical Specifications</p>
              <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
                {Object.entries(PRODUCT.specs).map(([key, val], i) => (
                  <div
                    key={key}
                    data-reveal
                    style={{ opacity: 0, transform: 'translateX(-20px)', transition: `opacity 0.5s ease ${i * 0.04}s, transform 0.5s ease ${i * 0.04}s` }}
                    className={`flex items-start gap-4 px-6 py-4 ${i % 2 === 0 ? 'bg-secondary/30' : ''}`}
                  >
                    <span className="text-sm text-muted-foreground min-w-[160px] shrink-0">{key}</span>
                    <span className="text-sm font-semibold text-foreground">{val}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 p-4 bg-secondary/40 border border-border rounded-xl">
                <Award size={15} className="text-primary shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Specifications verified by ShopHub. SKU: <span className="font-mono font-semibold text-foreground">{PRODUCT.sku}</span>
                </p>
              </div>
            </div>
          )}

          {/* ── REVIEWS ── */}
          {activeTab === 'Reviews' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Customer Reviews</p>
                  <h2 className="text-xl font-black text-foreground">{PRODUCT.reviewCount.toLocaleString()} verified reviews</h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button onClick={() => setReviewSortOpen(v => !v)} className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-semibold text-foreground hover:bg-secondary transition-all">
                      {reviewSort === 'helpful' ? 'Most Helpful' : reviewSort === 'recent' ? 'Most Recent' : 'Highest Rated'}
                      <ChevronDown size={14} className={`transition-transform ${reviewSortOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {reviewSortOpen && (
                      <div className="absolute right-0 top-full mt-1.5 w-44 bg-card border border-border rounded-xl shadow-xl py-1.5 z-10">
                        {[['helpful', 'Most Helpful'], ['recent', 'Most Recent'], ['rating', 'Highest Rated']].map(([val, label]) => (
                          <button key={val} onClick={() => { setReviewSort(val); setReviewSortOpen(false) }} className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${reviewSort === val ? 'text-primary font-semibold' : 'text-foreground/75 hover:bg-secondary'}`}>
                            {label} {reviewSort === val && '✓'}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-xl text-sm font-bold hover:bg-foreground/85 transition-all active:scale-[0.97]">
                    Write Review
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                {REVIEWS.map((review, i) => (
                  <ScrollCard3D key={review.id} delay={i * 0.08} className="bg-card border border-border rounded-2xl p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-black shrink-0">
                          {review.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-foreground text-sm">{review.author}</p>
                            {review.verified && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded-md">
                                <Check size={9} /> Verified
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5 shrink-0">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} size={13} className={j < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'} />
                        ))}
                      </div>
                    </div>
                    <h3 className="font-bold text-foreground mb-2 text-sm">{review.title}</h3>
                    <p className="text-sm text-foreground/75 leading-relaxed mb-4">{review.body}</p>
                    {review.images.length > 0 && (
                      <div className="flex gap-2 mb-4">
                        {review.images.map((img, j) => (
                          <div key={j} className="relative w-16 h-16 rounded-xl overflow-hidden border border-border">
                            <Image src={img} alt="Review" fill className="object-cover" sizes="64px" />
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-4 pt-3 border-t border-border">
                      <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                        <ThumbsUp size={13} /> Helpful ({review.helpful})
                      </button>
                      <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">Report</button>
                    </div>
                  </ScrollCard3D>
                ))}
              </div>

              <div className="flex justify-center">
                <button className="px-8 py-3 border border-border rounded-xl text-sm font-bold text-foreground hover:bg-secondary active:scale-[0.97] transition-all">
                  Load more reviews
                </button>
              </div>
            </div>
          )}

          {/* ── IN THE BOX ── */}
          {activeTab === 'In the Box' && (
            <div className="max-w-lg">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-6">What's Included</p>
              <div className="flex flex-col gap-3">
                {IN_THE_BOX.map((item, i) => (
                  <div
                    key={i}
                    data-reveal
                    style={{ opacity: 0, transform: 'translateX(-30px)', transition: `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s` }}
                    className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary/20 transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <Package size={15} className="text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">{item}</span>
                    <Check size={15} className="text-green-500 ml-auto shrink-0" />
                  </div>
                ))}
              </div>
              <div className="mt-5 p-4 bg-secondary/50 border border-border rounded-2xl flex items-start gap-3">
                <Clock size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All items are quality-checked and packaged in original Sony retail box. Gift packaging available at checkout.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ═══ RELATED PRODUCTS ═══ */}
        <section className="border-t border-border bg-secondary/30 py-12 sm:py-16">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-7">
              <div
                data-reveal
                style={{ opacity: 0, transform: 'translateY(30px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
              >
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">You might also like</p>
                <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">Related Products</h2>
              </div>
              <Link href="/products?category=headphones" className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {RELATED.map((p, i) => (
                <div
                  key={p.id}
                  data-reveal
                  style={{ opacity: 0, transform: 'translateY(40px)', transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s` }}
                >
                  <ProductCard {...p} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ STICKY MOBILE BUY BAR ═══ */}
        <div className="sm:hidden fixed bottom-16 inset-x-0 z-40 px-4 pb-2">
          <div className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-3 flex items-center gap-3 shadow-2xl shadow-black/15">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-secondary shrink-0">
              <Image src={PRODUCT.images[0]} alt={PRODUCT.name} fill className="object-cover" sizes="48px" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground truncate">{PRODUCT.name}</p>
              <p className="text-base font-black text-foreground">${PRODUCT.price.toFixed(2)}</p>
            </div>
            <button
              onClick={handleAddToBag}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-[0.97] shrink-0 ${addedToBag ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary/90'}`}
            >
              <ShoppingBag size={15} />
              {addedToBag ? 'Added!' : 'Add'}
            </button>
          </div>
        </div>

      </main>
    </div>
  )
}