'use client'

import { ArrowRight, Clock, Star, Truck, RefreshCw, ShieldCheck, Headphones } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useRef, useCallback } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import ProductCard, { type ProductCardProps } from '@/components/product-card'

/* ─────────────────────── DATA ─────────────────────── */

const HERO_PRODUCTS = [
  {
    id: 'h1',
    label: "Editor's Pick",
    title: 'Premium Wireless Headphones',
    sub: 'Studio-quality sound, all-day comfort. The ultimate listening experience.',
    price: '$229',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
    badge: 'Bestseller',
    href: '/products/1',
  },
  {
    id: 'h2',
    label: 'New Arrival',
    title: 'Smart Watch Pro Series X',
    sub: 'Track everything. Do more. Sleep better. Your health, redefined.',
    price: '$349',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
    badge: 'New',
    href: '/products/2',
  },
  {
    id: 'h3',
    label: 'Limited Edition',
    title: 'Mechanical Gaming Keyboard',
    sub: 'Tactile precision, RGB mastery. Built for winners.',
    price: '$179',
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&h=600&fit=crop',
    badge: 'Limited',
    href: '/products/3',
  },
]

const CATEGORIES = [
  { name: 'Electronics', icon: '⚡', count: '1,234', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop' },
  { name: 'Fashion', icon: '✦', count: '2,456', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop' },
  { name: 'Home & Living', icon: '⌂', count: '876', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop' },
  { name: 'Sports', icon: '◎', count: '543', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop' },
]

const FEATURED: ProductCardProps[] = [
  { id: '1', title: 'Premium Wireless Headphones', brand: 'SoundMax', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', price: 229.99, originalPrice: 299.99, rating: 4.8, reviews: 324, badge: 'Hot' },
  { id: '2', title: 'Smart Watch Pro Series', brand: 'TechBand', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', price: 349.99, originalPrice: 449.99, rating: 4.6, reviews: 218, badge: 'New' },
  { id: '3', title: '4K Ultra Webcam', brand: 'VisionPro', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop', price: 199.99, rating: 4.7, reviews: 156 },
  { id: '4', title: 'Gaming Mouse Extreme Edition', brand: 'ClickMaster', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop', price: 89.99, originalPrice: 120.00, rating: 4.9, reviews: 512, badge: 'Sale' },
]

const NEW_ARRIVALS: ProductCardProps[] = [
  { id: '5', title: 'Mechanical Keyboard TKL', brand: 'KeyPro', image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop', price: 179.99, rating: 4.7, reviews: 89, badge: 'New' },
  { id: '6', title: 'Portable SSD 2TB', brand: 'StorageX', image: 'https://images.unsplash.com/photo-1531492898419-3a9aa15ebbd0?w=400&h=400&fit=crop', price: 149.99, originalPrice: 199.99, rating: 4.8, reviews: 203 },
  { id: '7', title: 'Noise-Cancelling Earbuds', brand: 'SoundMax', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop', price: 129.99, rating: 4.5, reviews: 447 },
  { id: '8', title: 'LED Ring Light Pro', brand: 'StudioKit', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop', price: 59.99, originalPrice: 79.99, rating: 4.6, reviews: 312, badge: 'Sale' },
]

const USP = [
  { icon: Truck, title: 'Free Delivery', desc: 'On all orders over $50, delivered in 2-5 days.' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '30-day hassle-free return policy, no questions asked.' },
  { icon: ShieldCheck, title: 'Secure Checkout', desc: 'SSL encrypted payments. Your data stays safe.' },
  { icon: Headphones, title: '24/7 Support', desc: 'Expert help available around the clock.' },
]

/* ─────────────────────── COUNTDOWN ─────────────────────── */

function useCountdown(targetMs: number) {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 })
  useEffect(() => {
    const tick = () => {
      const rem = Math.max(0, targetMs - Date.now())
      setTime({ h: Math.floor(rem / 3600000), m: Math.floor((rem % 3600000) / 60000), s: Math.floor((rem % 60000) / 1000) })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetMs])
  return time
}

function pad(n: number) { return String(n).padStart(2, '0') }

/* ─────────────────────── SCROLL 3D HOOK ─────────────────────── */

/**
 * useScroll3D — attaches a global scroll listener and returns a normalised
 * [0, 1] progress value for the element relative to the viewport.
 * progress = 0 → element just entered bottom of screen
 * progress = 1 → element just exited top of screen
 */
function useScroll3D(ref: React.RefObject<HTMLElement>) {
  const [progress, setProgress] = useState(0)

  const onScroll = useCallback(() => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const vh = window.innerHeight
    // fraction of how far through the viewport the element has traveled
    const p = 1 - (rect.bottom / (vh + rect.height))
    setProgress(Math.min(1, Math.max(0, p)))
  }, [ref])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  return progress
}

/* ─────────────────────── SCROLL-REVEAL HOOK ─────────────────────── */

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = '1';
            (e.target as HTMLElement).style.transform = 'none'
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/* ─────────────────────── 3D VIEWER SECTION ─────────────────────── */

function ProductViewer3D() {
  const sectionRef = useRef<HTMLElement>(null!)
  const iframeWrapRef = useRef<HTMLDivElement>(null!)
  const textRef = useRef<HTMLDivElement>(null!)
  const floatRef1 = useRef<HTMLDivElement>(null!)
  const floatRef2 = useRef<HTMLDivElement>(null!)
  const progress = useScroll3D(sectionRef)

  useEffect(() => {
    if (!iframeWrapRef.current) return

    // Iframe: subtle rotate + scale as you scroll into it
    const rotY = (0.5 - progress) * 18          // ±9 deg
    const rotX = (progress - 0.3) * 8           // slight tilt
    const scl = 0.92 + progress * 0.12          // 0.92 → 1.04
    const tz = -60 + progress * 80              // translateZ

    iframeWrapRef.current.style.transform =
      `perspective(1200px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${scl}) translateZ(${tz}px)`

    // Text parallax
    if (textRef.current) {
      const ty = (0.5 - progress) * 50
      textRef.current.style.transform = `translateY(${ty}px)`
    }

    // Floating badges parallax (different speeds)
    if (floatRef1.current) {
      const ty = (progress - 0.4) * -70
      const tx = (0.5 - progress) * 30
      floatRef1.current.style.transform = `translateY(${ty}px) translateX(${tx}px)`
    }
    if (floatRef2.current) {
      const ty = (progress - 0.4) * 50
      const tx = (progress - 0.5) * 40
      floatRef2.current.style.transform = `translateY(${ty}px) translateX(${tx}px)`
    }
  }, [progress])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#080a0f] py-24 sm:py-32"
      style={{ perspective: '1800px' }}
    >
      {/* ── Atmospheric background grid ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      {/* Radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-violet-600/8 blur-[80px]" />
      <div className="pointer-events-none absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-sky-500/8 blur-[80px]" />

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6">

        {/* ── Section header ── */}
        <div
          ref={textRef}
          className="text-center mb-14 transition-transform duration-75"
          data-reveal
          style={{ opacity: 0, transform: 'translateY(40px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}
        >
          <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-orange-400 mb-4">
            <span className="h-px w-8 bg-orange-400/60" />
            3D Showcase
            <span className="h-px w-8 bg-orange-400/60" />
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.0] tracking-tight">
            Experience it in
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-violet-400 bg-clip-text text-transparent">
              full dimension
            </span>
          </h2>
          <p className="mt-5 text-white/40 text-base max-w-lg mx-auto leading-relaxed">
            Rotate, zoom, inspect. This is how shopping was meant to be.
          </p>
        </div>

        {/* ── Main 3-column layout ── */}
        <div className="grid lg:grid-cols-[1fr_2fr_1fr] gap-6 items-center">

          {/* Left info panel */}
          <div
            className="hidden lg:flex flex-col gap-5"
            data-reveal
            style={{ opacity: 0, transform: 'translateX(-60px)', transition: 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s' }}
          >
            {[
              { label: 'Colorway', value: 'Chicago Red / White' },
              { label: 'Material', value: 'Full-grain leather' },
              { label: 'Sole', value: 'Vulcanized rubber' },
              { label: 'Release', value: 'OG 1985 · Retro 2024' },
            ].map(({ label, value }) => (
              <div key={label} className="border border-white/8 rounded-2xl p-4 bg-white/3 backdrop-blur-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">{label}</p>
                <p className="text-sm font-semibold text-white/80">{value}</p>
              </div>
            ))}
          </div>

          {/* ── CENTER: Sketchfab 3D viewer with scroll-driven 3D transform ── */}
          <div className="relative">
            {/* Floating badge 1 */}
            <div
              ref={floatRef1}
              className="absolute -top-6 -right-4 z-20 bg-orange-500 text-white rounded-2xl px-4 py-2.5 shadow-xl shadow-orange-500/30 transition-transform duration-75"
            >
              <p className="text-[10px] font-black uppercase tracking-widest">Interactive 3D</p>
              <p className="text-xs font-medium opacity-80">Drag to rotate</p>
            </div>

            {/* Floating badge 2 */}
            <div
              ref={floatRef2}
              className="absolute -bottom-5 -left-4 z-20 bg-card border border-white/10 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 transition-transform duration-75"
            >
              <div className="w-8 h-8 rounded-xl bg-orange-500/15 flex items-center justify-center">
                <Star size={14} className="fill-orange-400 text-orange-400" />
              </div>
              <div>
                <p className="text-xs font-black text-white">Nike Air Jordan I</p>
                <p className="text-[10px] text-white/40">$189 — $349</p>
              </div>
            </div>

            {/* 3D viewer wrapper */}
            <div
              ref={iframeWrapRef}
              className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60 transition-transform duration-75"
              style={{
                transform: 'perspective(1200px) rotateY(9deg) rotateX(-2deg) scale(0.92) translateZ(-60px)',
                willChange: 'transform',
              }}
            >
              {/* Gradient ring accent */}
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/5 z-10 pointer-events-none" />
              <div
                className="absolute -inset-[1px] rounded-3xl z-0 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(251,146,60,0.3), rgba(167,139,250,0.15), transparent 60%)' }}
              />

              <div className="sketchfab-embed-wrapper relative" style={{ aspectRatio: '16/10' }}>
                <iframe
                  title="Nike Air Jordan"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  src="https://sketchfab.com/models/c00345fd64414c4e8895c6aaa262e4d5/embed?autospin=0.2&autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=0&ui_watermark_link=0"
                  className="w-full h-full absolute inset-0"
                />
              </div>

              {/* Bottom attribution strip */}
              <div className="relative z-10 bg-black/60 backdrop-blur-md px-4 py-2.5 flex items-center justify-between border-t border-white/8">
                <p className="text-[10px] text-white/40">
                  Model by{' '}
                  <a
                    href="https://sketchfab.com/MikhailKadilnikov"
                    target="_blank"
                    rel="nofollow noreferrer"
                    className="text-sky-400 hover:text-sky-300 font-semibold transition-colors"
                  >
                    Mikhail Kadilnikov
                  </a>{' '}
                  on{' '}
                  <a
                    href="https://sketchfab.com"
                    target="_blank"
                    rel="nofollow noreferrer"
                    className="text-sky-400 hover:text-sky-300 font-semibold transition-colors"
                  >
                    Sketchfab
                  </a>
                </p>
                <span className="text-[10px] text-white/20 font-mono">3D · WebGL</span>
              </div>
            </div>
          </div>

          {/* Right CTA panel */}
          <div
            className="hidden lg:flex flex-col gap-5 items-start"
            data-reveal
            style={{ opacity: 0, transform: 'translateX(60px)', transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s' }}
          >
            <div className="border border-white/8 rounded-2xl p-5 bg-white/3 backdrop-blur-sm w-full">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Price Range</p>
              <p className="text-3xl font-black text-white">$189</p>
              <p className="text-white/30 text-xs mt-0.5">Starting from</p>
              <div className="mt-4 w-full bg-white/8 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-orange-400 to-rose-400 h-1.5 rounded-full w-3/5" />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-white/25">$189</span>
                <span className="text-[10px] text-white/25">$349</span>
              </div>
            </div>

            <Link
              href="/products/air-jordan"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:from-orange-400 hover:to-rose-400 active:scale-[0.97] transition-all shadow-lg shadow-orange-500/25"
            >
              Shop This Style
              <ArrowRight size={15} />
            </Link>

            <Link
              href="/products?category=footwear"
              className="w-full inline-flex items-center justify-center gap-2 border border-white/10 bg-white/3 text-white/70 px-6 py-3 rounded-2xl font-semibold text-sm hover:bg-white/8 hover:text-white transition-all"
            >
              Browse All Footwear
            </Link>

            <div className="flex items-center gap-2 mt-1">
              {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}
              <span className="text-xs text-white/40 ml-1">4.9 · 8.2K reviews</span>
            </div>
          </div>
        </div>

        {/* ── Mobile bottom info ── */}
        <div className="lg:hidden mt-8 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Colorway', value: 'Chicago Red / White' },
              { label: 'Material', value: 'Full-grain leather' },
            ].map(({ label, value }) => (
              <div key={label} className="border border-white/8 rounded-2xl p-4 bg-white/3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">{label}</p>
                <p className="text-sm font-semibold text-white/80">{value}</p>
              </div>
            ))}
          </div>
          <Link
            href="/products/air-jordan"
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-orange-500/25"
          >
            Shop This Style
            <ArrowRight size={15} />
          </Link>
        </div>

      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <div className="w-5 h-8 rounded-full border border-white/40 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-white rounded-full animate-bounce" />
        </div>
        <span className="text-[9px] font-bold uppercase tracking-widest text-white">Scroll</span>
      </div>
    </section>
  )
}

/* ─────────────────────── PARALLAX HERO WRAPPER ─────────────────────── */

function ParallaxHero({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null!)
  const bgRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current || !bgRef.current) return
      const scrolled = window.scrollY
      // Subtle parallax on the background
      bgRef.current.style.transform = `translateY(${scrolled * 0.35}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={ref} className="relative overflow-hidden">
      <div ref={bgRef} className="absolute inset-0 scale-110 pointer-events-none" style={{ willChange: 'transform' }} />
      {children}
    </div>
  )
}

/* ─────────────────────── PAGE ─────────────────────── */

export default function Home() {
  const [heroIdx, setHeroIdx] = useState(0)
  const hero = HERO_PRODUCTS[heroIdx]

  // Flash sale ends 6 hours from page load
  const [saleEnd] = useState(() => Date.now() + 6 * 3600 * 1000)
  const { h, m, s } = useCountdown(saleEnd)

  useScrollReveal()

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_PRODUCTS.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header cartCount={3} wishlistCount={2} />

      <main className="flex-1 pb-16 sm:pb-0">

        {/* ══════════════ HERO ══════════════ */}
        <ParallaxHero>
          <section className="relative overflow-hidden bg-secondary min-h-[480px] sm:min-h-[580px] lg:min-h-[640px]">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20 h-full">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[400px] lg:min-h-[500px]">

                {/* Text */}
                <div className="order-2 lg:order-1 z-10">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary mb-4">
                    <span className="w-4 h-px bg-primary" />
                    {hero.label}
                  </span>
                  <h1 key={hero.id + 't'} className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-[1.05] tracking-tight mb-5">
                    {hero.title}
                  </h1>
                  <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8 max-w-md">
                    {hero.sub}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mb-10">
                    <Link href={hero.href} className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-xl font-bold text-sm hover:bg-foreground/85 active:scale-[0.97] transition-all shadow-lg shadow-black/10">
                      Shop Now — {hero.price}
                      <ArrowRight size={16} />
                    </Link>
                    <span className="text-xs text-muted-foreground bg-secondary border border-border px-3 py-1.5 rounded-lg font-medium">{hero.badge}</span>
                  </div>

                  {/* Dots */}
                  <div className="flex gap-2">
                    {HERO_PRODUCTS.map((_, i) => (
                      <button key={i} onClick={() => setHeroIdx(i)} className={`h-1.5 rounded-full transition-all ${i === heroIdx ? 'w-8 bg-primary' : 'w-3 bg-border hover:bg-muted-foreground'}`} />
                    ))}
                  </div>
                </div>

                {/* Image */}
                <div className="order-1 lg:order-2 relative">
                  <div className="relative mx-auto w-full max-w-sm lg:max-w-none aspect-square rounded-3xl overflow-hidden bg-card border border-border shadow-2xl shadow-black/8">
                    <Image key={hero.id} src={hero.image} alt={hero.title} fill className="object-cover" sizes="(max-width: 1024px) 80vw, 45vw" priority />
                  </div>
                  {/* Floating badge */}
                  <div className="absolute -bottom-4 -left-2 sm:bottom-6 sm:left-6 bg-card border border-border rounded-2xl px-4 py-3 shadow-xl shadow-black/8 flex items-center gap-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => <Star key={i} size={11} className="fill-amber-400 text-amber-400" />)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">4.9/5.0</p>
                      <p className="text-[10px] text-muted-foreground">12K+ reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ParallaxHero>

        {/* ══════════════ TICKER ══════════════ */}
        <div className="bg-primary overflow-hidden py-2.5">
          <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="inline-flex items-center gap-8 text-white text-xs font-semibold tracking-wider px-8">
                <span>✦ FREE SHIPPING OVER $50</span>
                <span>✦ 30-DAY RETURNS</span>
                <span>✦ SECURE CHECKOUT</span>
                <span>✦ NEW ARRIVALS WEEKLY</span>
                <span>✦ EXCLUSIVE MEMBERS DEALS</span>
              </span>
            ))}
          </div>
        </div>

        {/* ══════════════ CATEGORIES ══════════════ */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="flex items-end justify-between mb-6 sm:mb-10">
            <div
              data-reveal
              style={{ opacity: 0, transform: 'translateY(30px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">Shop by</p>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Categories</h2>
            </div>
            <Link href="/categories" className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat.name}
                href={`/products?category=${cat.name.toLowerCase()}`}
                data-reveal
                style={{
                  opacity: 0,
                  transform: 'translateY(40px) scale(0.96)',
                  transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`,
                }}
                className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-secondary border border-border hover:border-transparent hover:shadow-xl hover:shadow-black/10 transition-all duration-500 ${i === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}
              >
                <div className={`relative w-full ${i === 0 ? 'aspect-[4/3] lg:aspect-auto lg:h-full min-h-[200px]' : 'aspect-[4/3]'}`}>
                  <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 640px) 50vw, 25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 sm:p-5">
                    <p className="text-white/70 text-[10px] font-medium mb-0.5">{cat.count} items</p>
                    <h3 className="text-white font-black text-base sm:text-lg">{cat.name}</h3>
                    <span className="inline-flex items-center gap-1 text-white/80 text-xs mt-1.5 group-hover:gap-2 transition-all">
                      Shop now <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ══════════════ FEATURED PRODUCTS ══════════════ */}
        <section className="bg-secondary/40 border-y border-border py-12 sm:py-20">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-6 sm:mb-10">
              <div
                data-reveal
                style={{ opacity: 0, transform: 'translateY(30px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
              >
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">Hand-picked</p>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Featured Products</h2>
              </div>
              <Link href="/products" className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {FEATURED.map((p, i) => (
                <div
                  key={p.id}
                  data-reveal
                  style={{
                    opacity: 0,
                    transform: 'translateY(50px)',
                    transition: `opacity 0.7s ease ${i * 0.12}s, transform 0.7s ease ${i * 0.12}s`,
                  }}
                >
                  <ProductCard {...p} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ 3D PRODUCT VIEWER ══════════════ */}
        <ProductViewer3D />

        {/* ══════════════ FLASH SALE ══════════════ */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div
            className="relative overflow-hidden bg-foreground rounded-3xl p-6 sm:p-10 lg:p-14"
            data-reveal
            style={{ opacity: 0, transform: 'translateY(60px) scale(0.97)', transition: 'opacity 0.8s ease, transform 0.8s ease' }}
          >
            {/* BG decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-2xl translate-y-1/2 pointer-events-none" />

            <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary-lighter text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  Flash Sale — Live Now
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-4">
                  Up to 60% Off<br />
                  <span className="text-primary">Selected Items</span>
                </h2>
                <p className="text-white/50 mb-8 text-sm sm:text-base leading-relaxed">
                  Limited stock available. Prices this low won't last — grab yours before they're gone.
                </p>
                <Link href="/sale" className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-xl font-bold hover:bg-primary/90 active:scale-[0.97] transition-all shadow-lg shadow-primary/30">
                  Shop the Sale
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Countdown */}
              <div>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Clock size={13} /> Sale ends in
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[{ v: h, l: 'Hours' }, { v: m, l: 'Minutes' }, { v: s, l: 'Seconds' }].map(({ v, l }) => (
                    <div key={l} className="bg-white/8 border border-white/10 rounded-2xl p-4 text-center">
                      <p className="text-4xl sm:text-5xl font-black text-white tabular-nums leading-none">{pad(v)}</p>
                      <p className="text-white/40 text-[11px] font-medium mt-2 uppercase tracking-widest">{l}</p>
                    </div>
                  ))}
                </div>

                {/* Sale product previews */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {FEATURED.filter(p => p.originalPrice).slice(0, 2).map(p => (
                    <Link key={p.id} href={`/products/${p.id}`} className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 transition-colors">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-white/10">
                        <Image src={p.image} alt={p.title} fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-xs font-semibold truncate">{p.title.split(' ').slice(0, 3).join(' ')}</p>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="text-primary-lighter text-xs font-black">${p.price.toFixed(0)}</span>
                          <span className="text-white/30 text-[10px] line-through">${p.originalPrice?.toFixed(0)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ NEW ARRIVALS ══════════════ */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 pb-12 sm:pb-20">
          <div className="flex items-end justify-between mb-6 sm:mb-10">
            <div
              data-reveal
              style={{ opacity: 0, transform: 'translateY(30px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">Just dropped</p>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">New Arrivals</h2>
            </div>
            <Link href="/new" className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {NEW_ARRIVALS.map((p, i) => (
              <div
                key={p.id}
                data-reveal
                style={{
                  opacity: 0,
                  transform: 'translateY(50px)',
                  transition: `opacity 0.7s ease ${i * 0.1}s, transform 0.7s ease ${i * 0.1}s`,
                }}
              >
                <ProductCard {...p} />
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════ USP / TRUST STRIP ══════════════ */}
        <section className="border-t border-border bg-secondary/30 py-12 sm:py-16">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {USP.map(({ icon: Icon, title, desc }, i) => (
                <div
                  key={title}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  data-reveal
                  style={{
                    opacity: 0,
                    transform: 'translateY(30px)',
                    transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`,
                  }}
                >
                  <div className="p-3 bg-primary/10 rounded-2xl shrink-0">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm mb-0.5">{title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ BRAND STORY BANNER ══════════════ */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div
            className="grid lg:grid-cols-2 gap-8 items-center bg-card border border-border rounded-3xl overflow-hidden"
            data-reveal
            style={{ opacity: 0, transform: 'translateY(50px)', transition: 'opacity 0.8s ease, transform 0.8s ease' }}
          >
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[280px]">
              <Image src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop" alt="Our story" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>
            <div className="p-6 sm:p-10 lg:p-12">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Our Promise</p>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-snug mb-5">
                Quality you can feel.<br />Prices you'll love.
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
                We believe great products shouldn't cost a fortune. That's why we work directly with manufacturers to bring you premium items at prices that make sense.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[['50K+', 'Products'], ['2M+', 'Customers'], ['4.9★', 'Rating']].map(([n, l]) => (
                  <div key={l}>
                    <p className="text-2xl font-black text-primary">{n}</p>
                    <p className="text-xs text-muted-foreground">{l}</p>
                  </div>
                ))}
              </div>
              <Link href="/about" className="inline-flex items-center gap-2 font-bold text-sm text-foreground border border-border px-5 py-2.5 rounded-xl hover:bg-secondary hover:border-foreground/20 active:scale-[0.97] transition-all">
                Learn more <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />

      {/* Marquee keyframes */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0) }
          to { transform: translateX(-50%) }
        }
      `}</style>
    </div>
  )
}