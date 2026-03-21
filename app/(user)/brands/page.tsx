'use client'

import {
  ArrowRight, ChevronRight, Search, Star,
  TrendingUp, Shield, Award, Users, Package,
  Zap, ExternalLink, Check
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useMemo } from 'react'
import ProductCard, { type ProductCardProps } from '@/components/product-card'

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

type Brand = {
  id: string
  name: string
  logo: string
  category: string
  country: string
  founded: number
  products: number
  rating: number
  reviews: number
  featured?: boolean
  verified?: boolean
  new?: boolean
  description: string
  coverImage: string
  logoImage?: string
  accentColor: string
}

const ALL_BRANDS: Brand[] = [
  { id: 'apple', name: 'Apple', logo: '🍎', category: 'Electronics', country: 'USA', founded: 1976, products: 234, rating: 4.9, reviews: 45231, featured: true, verified: true, description: 'Think different. Premium devices that seamlessly blend hardware and software.', coverImage: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=400&fit=crop', accentColor: '#1d1d1f' },
  { id: 'adidas', name: 'Adidas', logo: '◈', category: 'Fashion & Sports', country: 'Germany', founded: 1949, products: 567, rating: 4.7, reviews: 31456, featured: true, verified: true, description: 'Impossible is nothing. Sportswear that powers performance and defines style.', coverImage: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=400&fit=crop', accentColor: '#000000' },
  { id: 'asus', name: 'ASUS ROG', logo: '🔺', category: 'Gaming', country: 'Taiwan', founded: 1989, products: 189, rating: 4.7, reviews: 12890, featured: true, verified: true, description: 'Republic of Gamers. Built to push the limits of what gaming hardware can do.', coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop', accentColor: '#cc0000' },
  { id: 'bose', name: 'Bose', logo: '🎵', category: 'Audio', country: 'USA', founded: 1964, products: 98, rating: 4.8, reviews: 18934, featured: true, verified: true, description: 'Better sound through research. Legendary audio engineering since 1964.', coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=400&fit=crop', accentColor: '#000000' },
  { id: 'canon', name: 'Canon', logo: '📷', category: 'Cameras', country: 'Japan', founded: 1937, products: 145, rating: 4.8, reviews: 9234, verified: true, description: 'Delighting you always. Professional and consumer imaging excellence.', coverImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=400&fit=crop', accentColor: '#cc0000' },
  { id: 'corsair', name: 'Corsair', logo: '⚓', category: 'Gaming', country: 'USA', founded: 1994, products: 112, rating: 4.6, reviews: 7823, verified: true, description: 'High-performance gaming gear trusted by esports pros worldwide.', coverImage: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800&h=400&fit=crop', accentColor: '#ffd700' },
  { id: 'dyson', name: 'Dyson', logo: '🌪️', category: 'Home', country: 'UK', founded: 1991, products: 67, rating: 4.7, reviews: 14521, verified: true, description: 'Pioneering engineering. Vacuums, fans, and haircare reimagined.', coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop', accentColor: '#7b2d8b' },
  { id: 'dell', name: 'Dell', logo: '💻', category: 'Electronics', country: 'USA', founded: 1984, products: 203, rating: 4.5, reviews: 22134, verified: true, description: 'Technology driving human progress. Laptops, desktops, and workstations.', coverImage: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=400&fit=crop', accentColor: '#0076ce' },
  { id: 'garmin', name: 'Garmin', logo: '🗺️', category: 'Sports & Wearables', country: 'USA', founded: 1989, products: 134, rating: 4.8, reviews: 8901, verified: true, description: 'Navigation and wearables for every adventure, sport, and journey.', coverImage: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=800&h=400&fit=crop', accentColor: '#007cc3' },
  { id: 'gopro', name: 'GoPro', logo: '🎥', category: 'Cameras', country: 'USA', founded: 2002, products: 45, rating: 4.6, reviews: 6732, new: true, verified: true, description: 'Be a hero. Rugged action cameras for every outdoor adventure.', coverImage: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=400&fit=crop', accentColor: '#0068ff' },
  { id: 'hyperx', name: 'HyperX', logo: '✕', category: 'Gaming', country: 'USA', founded: 2002, products: 87, rating: 4.7, reviews: 5421, verified: true, description: "We're all gamers. Memory, headsets, keyboards built for speed.", coverImage: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=400&fit=crop', accentColor: '#e0000e' },
  { id: 'ikea', name: 'IKEA', logo: '⌂', category: 'Home & Furniture', country: 'Sweden', founded: 1943, products: 456, rating: 4.4, reviews: 34123, verified: true, description: 'The wonderful everyday. Scandinavian design made affordable.', coverImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=400&fit=crop', accentColor: '#0058a3' },
  { id: 'jbl', name: 'JBL', logo: '🔊', category: 'Audio', country: 'USA', founded: 1946, products: 123, rating: 4.6, reviews: 19432, verified: true, description: 'Music is everything. Portable speakers and headphones for any vibe.', coverImage: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=400&fit=crop', accentColor: '#fc6011' },
  { id: 'kitchenaid', name: 'KitchenAid', logo: '🍴', category: 'Kitchen', country: 'USA', founded: 1919, products: 89, rating: 4.8, reviews: 12098, verified: true, description: 'For the love of cooking. Iconic stand mixers and kitchen appliances.', coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop', accentColor: '#c41230' },
  { id: 'lg', name: 'LG', logo: '⚡', category: 'Electronics', country: 'South Korea', founded: 1958, products: 312, rating: 4.6, reviews: 28765, verified: true, description: "Life's Good. Monitors, home appliances, and consumer electronics.", coverImage: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&h=400&fit=crop', accentColor: '#a50034' },
  { id: 'logitech', name: 'Logitech', logo: '🖱️', category: 'Peripherals', country: 'Switzerland', founded: 1981, products: 198, rating: 4.7, reviews: 41234, verified: true, description: 'Designed for creators and professionals. Mice, keyboards, webcams.', coverImage: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=400&fit=crop', accentColor: '#00b5e2' },
  { id: 'nike', name: 'Nike', logo: '✓', category: 'Fashion & Sports', country: 'USA', founded: 1964, products: 892, rating: 4.7, reviews: 87654, featured: true, verified: true, description: "Just do it. The world's #1 athletic footwear and apparel brand.", coverImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=400&fit=crop', accentColor: '#ff6900' },
  { id: 'nikon', name: 'Nikon', logo: '📸', category: 'Cameras', country: 'Japan', founded: 1917, products: 98, rating: 4.8, reviews: 7890, verified: true, description: 'At the heart of the image. Professional cameras and optics.', coverImage: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=800&h=400&fit=crop', accentColor: '#ffcc00' },
  { id: 'razer', name: 'Razer', logo: '🐍', category: 'Gaming', country: 'USA/Singapore', founded: 2005, products: 167, rating: 4.6, reviews: 23456, featured: true, verified: true, description: 'For gamers, by gamers. The leading gaming lifestyle brand worldwide.', coverImage: 'https://images.unsplash.com/photo-1593640408182-31c228e85eca?w=800&h=400&fit=crop', accentColor: '#00ff00' },
  { id: 'samsung', name: 'Samsung', logo: '🌟', category: 'Electronics', country: 'South Korea', founded: 1938, products: 567, rating: 4.7, reviews: 92341, featured: true, verified: true, description: 'Inspire the world, create the future. From phones to home appliances.', coverImage: 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=800&h=400&fit=crop', accentColor: '#1428a0' },
  { id: 'secretlab', name: 'Secretlab', logo: '👑', category: 'Gaming Furniture', country: 'Singapore', founded: 2014, products: 34, rating: 4.8, reviews: 5673, new: true, verified: true, description: 'Gaming chairs crafted for excellence. Trusted by esports athletes globally.', coverImage: 'https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?w=800&h=400&fit=crop', accentColor: '#c9aa71' },
  { id: 'sony', name: 'Sony', logo: '🎧', category: 'Electronics & Audio', country: 'Japan', founded: 1946, products: 423, rating: 4.8, reviews: 61234, featured: true, verified: true, description: 'Make believe. World-class audio, cameras, gaming, and entertainment.', coverImage: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&h=400&fit=crop', accentColor: '#003087' },
  { id: 'under-armour', name: 'Under Armour', logo: 'UA', category: 'Sports', country: 'USA', founded: 1996, products: 312, rating: 4.5, reviews: 15678, verified: true, description: "The only way is through. Athletic gear engineered for performance.", coverImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=400&fit=crop', accentColor: '#1d1d1d' },
  { id: 'uniqlo', name: 'Uniqlo', logo: 'U', category: 'Fashion', country: 'Japan', founded: 1984, products: 445, rating: 4.6, reviews: 28934, new: true, verified: true, description: 'Made for all. Simple, quality everyday essentials with Japanese craftsmanship.', coverImage: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=400&fit=crop', accentColor: '#e60012' },
  { id: 'xiaomi', name: 'Xiaomi', logo: 'Mi', category: 'Electronics', country: 'China', founded: 2010, products: 289, rating: 4.5, reviews: 34521, new: true, verified: true, description: "Innovation for everyone. Smart devices at breakthrough prices.", coverImage: 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=800&h=400&fit=crop', accentColor: '#ff6900' },
  { id: 'zendesk', name: 'Zara', logo: 'Z', category: 'Fashion', country: 'Spain', founded: 1975, products: 678, rating: 4.4, reviews: 41234, verified: true, description: 'Dressed to move. Fast fashion with European style and global reach.', coverImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=400&fit=crop', accentColor: '#000000' },
]

const CATEGORIES_FILTER = ['All', 'Electronics', 'Fashion & Sports', 'Gaming', 'Audio', 'Home', 'Cameras', 'Peripherals', 'Sports']

const BRAND_PRODUCTS: Record<string, ProductCardProps[]> = {
  sony: [
    { id: 's1', title: 'Sony WH-1000XM5 Wireless', brand: 'Sony', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', price: 279.99, originalPrice: 349.99, rating: 4.9, reviews: 2341, badge: 'Bestseller' },
    { id: 's2', title: 'Sony A7 IV Full Frame Camera', brand: 'Sony', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop', price: 2499.99, rating: 4.9, reviews: 345, badge: 'Hot' },
    { id: 's3', title: 'Sony Galaxy Buds2 Pro', brand: 'Sony', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop', price: 229.99, rating: 4.7, reviews: 1109, badge: 'New' },
    { id: 's4', title: 'Sony ZV-E10 Vlog Camera', brand: 'Sony', image: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=400&h=400&fit=crop', price: 749.99, originalPrice: 899.99, rating: 4.8, reviews: 678 },
  ],
  nike: [
    { id: 'n1', title: 'Nike Air Max 270', brand: 'Nike', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', price: 149.99, originalPrice: 180.00, rating: 4.5, reviews: 2876, badge: 'Hot' },
    { id: 'n2', title: 'Nike Dri-FIT Training Tee', brand: 'Nike', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=400&fit=crop', price: 34.99, rating: 4.3, reviews: 1234 },
    { id: 'n3', title: 'Nike Pro Compression Shorts', brand: 'Nike', image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=400&h=400&fit=crop', price: 39.99, originalPrice: 54.99, rating: 4.5, reviews: 876 },
    { id: 'n4', title: 'Nike React Infinity Run', brand: 'Nike', image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop', price: 159.99, rating: 4.7, reviews: 1567, badge: 'New' },
  ],
  apple: [
    { id: 'a1', title: 'Apple Watch Series 9 GPS', brand: 'Apple', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', price: 399.99, rating: 4.8, reviews: 1876, badge: 'New' },
    { id: 'a2', title: 'iPad Pro 12.9" M2', brand: 'Apple', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop', price: 1099.99, rating: 4.9, reviews: 892 },
    { id: 'a3', title: 'AirPods Pro 2nd Gen', brand: 'Apple', image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop', price: 229.99, originalPrice: 279.99, rating: 4.8, reviews: 5432, badge: 'Sale' },
    { id: 'a4', title: 'MacBook Air M3 13"', brand: 'Apple', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop', price: 1299.99, rating: 4.9, reviews: 2341, badge: 'Hot' },
  ],
}

/* ═══════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
export default function BrandsPage() {
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('All')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)
  const [activeBrand, setActiveBrand] = useState<Brand>(ALL_BRANDS.find(b => b.id === 'sony')!)
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)

  const featuredBrands = ALL_BRANDS.filter(b => b.featured)

  const filtered = useMemo(() => {
    let list = ALL_BRANDS
    if (activeCat !== 'All') list = list.filter(b => b.category.includes(activeCat.replace(' & Sports', '').replace('Fashion & ', '')))
    if (activeLetter) list = list.filter(b => b.name.toUpperCase().startsWith(activeLetter))
    if (showVerifiedOnly) list = list.filter(b => b.verified)
    if (search.trim()) list = list.filter(b => b.name.toLowerCase().includes(search.toLowerCase()) || b.category.toLowerCase().includes(search.toLowerCase()))
    return list
  }, [activeCat, activeLetter, search, showVerifiedOnly])

  const lettersWithBrands = useMemo(() =>
    new Set(ALL_BRANDS.map(b => b.name[0].toUpperCase())),
    []
  )

  const brandProducts = BRAND_PRODUCTS[activeBrand.id] ?? BRAND_PRODUCTS['sony']

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pb-20 sm:pb-0">

        {/* ═══ PAGE HEADER ═══ */}
        <div className="border-b border-border">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
            <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight size={12} />
              <span className="text-foreground font-medium">Brands</span>
            </nav>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Official stores</p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-none">
                  Top Brands
                </h1>
                <p className="text-muted-foreground mt-3 text-sm max-w-md">
                  {ALL_BRANDS.length}+ official brand stores. Shop direct and guaranteed authentic.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm">
                  <Shield size={14} className="text-primary" />
                  <span className="font-medium text-foreground">All brands verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ FEATURED BRANDS HERO CAROUSEL ═══ */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">Editor's choice</p>
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">Featured Brands</h2>
            </div>
          </div>

          {/* Horizontal scroll featured brand cards */}
          <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-none sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:pb-0">
            {featuredBrands.map(brand => (
              <button
                key={brand.id}
                onClick={() => setActiveBrand(brand)}
                className={`snap-start shrink-0 w-72 sm:w-auto group relative overflow-hidden rounded-2xl sm:rounded-3xl transition-all duration-300 text-left ${activeBrand.id === brand.id ? 'ring-2 ring-primary shadow-lg shadow-primary/10' : 'hover:shadow-lg hover:shadow-black/8 hover:-translate-y-0.5'}`}
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  <Image src={brand.coverImage} alt={brand.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 640px) 288px, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Brand info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {brand.verified && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
                              <Shield size={9} /> Verified
                            </span>
                          )}
                          {brand.new && (
                            <span className="text-[10px] font-bold text-primary bg-primary/20 border border-primary/30 px-2 py-0.5 rounded-full">New</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2.5 mb-1">
                          <span className="text-2xl leading-none">{brand.logo}</span>
                          <h3 className="text-white font-black text-lg">{brand.name}</h3>
                        </div>
                        <p className="text-white/50 text-xs">{brand.category} · {brand.products} products</p>
                      </div>
                      <div className="shrink-0 flex items-center gap-1 bg-white/10 backdrop-blur-sm border border-white/15 px-2.5 py-1.5 rounded-xl">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        <span className="text-white text-xs font-bold">{brand.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Active indicator */}
                  {activeBrand.id === brand.id && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                      <Check size={13} className="text-white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ═══ ACTIVE BRAND SHOWCASE ═══ */}
        <section className="bg-secondary/40 border-y border-border py-10 sm:py-14">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-5 gap-6 lg:gap-10 items-start">

              {/* Brand profile card */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-3xl overflow-hidden">
                  {/* Cover */}
                  <div className="relative aspect-[16/7] overflow-hidden bg-muted">
                    <Image src={activeBrand.coverImage} alt={activeBrand.name} fill className="object-cover" sizes="40vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-4 left-5 flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-xl border border-border/20">
                        {activeBrand.logo}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <h3 className="text-white font-black text-xl">{activeBrand.name}</h3>
                          {activeBrand.verified && <Shield size={14} className="text-primary" />}
                        </div>
                        <p className="text-white/60 text-xs">{activeBrand.category}</p>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">{activeBrand.description}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      {[
                        { num: activeBrand.products, label: 'Products' },
                        { num: `${activeBrand.rating}★`, label: 'Rating' },
                        { num: `${(activeBrand.reviews / 1000).toFixed(0)}K`, label: 'Reviews' },
                      ].map(({ num, label }) => (
                        <div key={label} className="bg-secondary rounded-xl p-3 text-center">
                          <p className="text-lg font-black text-foreground">{num}</p>
                          <p className="text-[10px] text-muted-foreground">{label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Meta */}
                    <div className="flex flex-col gap-2 mb-5 text-xs text-muted-foreground">
                      {[
                        ['🌍', activeBrand.country],
                        ['📅', `Est. ${activeBrand.founded}`],
                        ['📦', `${activeBrand.products} products on ShopHub`],
                      ].map(([icon, text]) => (
                        <span key={text} className="flex items-center gap-2">{icon} {text}</span>
                      ))}
                    </div>

                    <Link
                      href={`/products?brand=${activeBrand.id}`}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-foreground text-background font-bold text-sm rounded-xl hover:bg-foreground/85 active:scale-[0.97] transition-all"
                    >
                      Shop {activeBrand.name}
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Products from this brand */}
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Top picks</p>
                    <h2 className="text-lg sm:text-xl font-black text-foreground">Best from {activeBrand.name}</h2>
                  </div>
                  <Link href={`/products?brand=${activeBrand.id}`} className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                    View all <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {brandProducts.map(p => <ProductCard key={p.id} {...p} />)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ BRAND DIRECTORY ═══ */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex items-end justify-between mb-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">All stores</p>
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">Brand Directory</h2>
            </div>
            <span className="text-sm text-muted-foreground">{filtered.length} brands</span>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search brands…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-secondary border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground"
              />
            </div>

            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {CATEGORIES_FILTER.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`shrink-0 text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all ${activeCat === cat ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/20'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Verified toggle */}
            <button
              onClick={() => setShowVerifiedOnly(v => !v)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all shrink-0 ${showVerifiedOnly ? 'bg-primary/10 text-primary border-primary/30' : 'border-border text-muted-foreground hover:text-foreground'}`}
            >
              <Shield size={13} /> Verified only
            </button>
          </div>

          {/* Alphabet index */}
          <div className="flex flex-wrap gap-1 mb-7">
            <button
              onClick={() => setActiveLetter(null)}
              className={`w-7 h-7 rounded-lg text-[11px] font-bold transition-all ${!activeLetter ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
            >
              All
            </button>
            {ALPHABET.map(l => {
              const has = lettersWithBrands.has(l)
              return (
                <button
                  key={l}
                  onClick={() => has ? setActiveLetter(activeLetter === l ? null : l) : undefined}
                  className={`w-7 h-7 rounded-lg text-[11px] font-bold transition-all ${!has ? 'text-border cursor-default' : activeLetter === l ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
                >
                  {l}
                </button>
              )
            })}
          </div>

          {/* Brand cards grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-4 text-3xl">🔍</div>
              <h3 className="font-bold text-foreground mb-1">No brands found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {filtered.map(brand => (
                <button
                  key={brand.id}
                  onClick={() => {
                    setActiveBrand(brand)
                    document.getElementById('brand-showcase')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`group relative flex flex-col bg-card border rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-black/6 hover:-translate-y-0.5 transition-all duration-300 text-left ${activeBrand.id === brand.id ? 'border-primary ring-2 ring-primary/15' : 'border-border/60 hover:border-border'}`}
                >
                  {/* Cover thumbnail */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    <Image src={brand.coverImage} alt={brand.name} fill className="object-cover opacity-75 group-hover:opacity-90 transition-opacity group-hover:scale-105 duration-500" sizes="(max-width: 640px) 50vw, 20vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Active check */}
                    {activeBrand.id === brand.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Check size={11} className="text-white" />
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {brand.new && <span className="text-[9px] font-black text-primary bg-primary/20 border border-primary/30 px-1.5 py-0.5 rounded-md">NEW</span>}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3.5 flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl leading-none">{brand.logo}</span>
                        <div>
                          <div className="flex items-center gap-1">
                            <p className="font-bold text-foreground text-sm leading-tight">{brand.name}</p>
                            {brand.verified && <Shield size={10} className="text-primary shrink-0" />}
                          </div>
                          <p className="text-[10px] text-muted-foreground">{brand.category}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs font-semibold text-foreground">{brand.rating}</span>
                        <span className="text-[10px] text-muted-foreground">({(brand.reviews / 1000).toFixed(0)}K)</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{brand.products} items</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ═══ WHY SHOP WITH US ═══ */}
        <section className="border-t border-border bg-secondary/30 py-10 sm:py-14">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">100% Authentic</p>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Why shop brand stores?</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { icon: Shield, title: 'Guaranteed Authentic', desc: 'Every product sourced directly from official brand partners.' },
                { icon: Award, title: 'Official Warranty', desc: 'Full manufacturer warranty on every purchase, no exceptions.' },
                { icon: Package, title: 'Brand Packaging', desc: 'Delivered in original packaging exactly as intended.' },
                { icon: Users, title: 'Brand Support', desc: "Direct access to each brand's dedicated support team." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex flex-col items-center text-center p-5 bg-card border border-border rounded-2xl">
                  <div className="w-11 h-11 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground text-sm mb-2">{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ NEW BRAND ARRIVALS ═══ */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex items-center justify-between mb-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">Just joined</p>
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">New to ShopHub</h2>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {ALL_BRANDS.filter(b => b.new).map(brand => (
              <div key={brand.id} className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-primary/30 hover:shadow-md transition-all duration-300 group">
                <div className="w-14 h-14 rounded-2xl bg-secondary border border-border flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform">
                  {brand.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-foreground">{brand.name}</p>
                    <span className="text-[9px] font-black text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-md">NEW</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{brand.category} · {brand.products} products</p>
                  <div className="flex items-center gap-1">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold">{brand.rating}</span>
                  </div>
                </div>
                <Link href={`/products?brand=${brand.id}`} className="shrink-0 p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-xl transition-all">
                  <ExternalLink size={16} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ STATS STRIP ═══ */}
        <section className="border-t border-border bg-background py-8">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-0 sm:divide-x sm:divide-border">
              {[
                { icon: Award, num: `${ALL_BRANDS.length}+`, label: 'Official brand stores' },
                { icon: Shield, num: '100%', label: 'Authentic products' },
                { icon: TrendingUp, num: '50K+', label: 'Products listed' },
                { icon: Zap, num: '2-5 days', label: 'Average delivery' },
              ].map(({ icon: Icon, num, label }) => (
                <div key={label} className="flex items-center gap-4 sm:px-8 first:sm:pl-0 last:sm:pr-0">
                  <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xl font-black text-foreground">{num}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
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