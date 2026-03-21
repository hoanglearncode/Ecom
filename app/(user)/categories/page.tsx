'use client'

import {
  ArrowRight, ChevronRight, TrendingUp, Zap, Star,
  Package, Sparkles, Crown, Tag
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import ProductCard, { type ProductCardProps } from '@/components/product-card'

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */

const MAIN_CATEGORIES = [
  {
    id: 'electronics',
    label: 'Electronics',
    icon: '⚡',
    count: 1342,
    color: 'from-blue-950 to-blue-900',
    accent: '#3b82f6',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=500&fit=crop',
    description: 'Cutting-edge tech for work and play',
    trending: ['Headphones', 'Smart Watches', '4K Monitors'],
  },
  {
    id: 'fashion',
    label: 'Fashion',
    icon: '✦',
    count: 2891,
    color: 'from-rose-950 to-rose-900',
    accent: '#f43f5e',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=500&fit=crop',
    description: 'Style that speaks for itself',
    trending: ['Sneakers', 'Minimalist Bags', 'Oversized Fits'],
  },
  {
    id: 'home',
    label: 'Home & Living',
    icon: '⌂',
    count: 876,
    color: 'from-emerald-950 to-emerald-900',
    accent: '#10b981',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=500&fit=crop',
    description: 'Make every room a statement',
    trending: ['Ergonomic Chairs', 'Smart Lighting', 'Ceramic Décor'],
  },
  {
    id: 'sports',
    label: 'Sports',
    icon: '◎',
    count: 543,
    color: 'from-orange-950 to-orange-900',
    accent: '#f97316',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=500&fit=crop',
    description: 'Gear up for every challenge',
    trending: ['Running Shoes', 'Resistance Bands', 'Yoga Mats'],
  },
  {
    id: 'gaming',
    label: 'Gaming',
    icon: '◈',
    count: 398,
    color: 'from-violet-950 to-violet-900',
    accent: '#8b5cf6',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=500&fit=crop',
    description: 'Level up your setup',
    trending: ['Mechanical Keyboards', 'Gaming Chairs', 'Headsets'],
  },
  {
    id: 'books',
    label: 'Books & Media',
    icon: '◻',
    count: 673,
    color: 'from-amber-950 to-amber-900',
    accent: '#f59e0b',
    image: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=800&h=500&fit=crop',
    description: 'Stories, knowledge, inspiration',
    trending: ['Self-Development', 'Science Fiction', 'Design Books'],
  },
]

const SUBCATEGORY_MAP: Record<string, { id: string; label: string; count: number; image: string }[]> = {
  electronics: [
    { id: 'headphones', label: 'Headphones & Earbuds', count: 78, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop' },
    { id: 'wearables', label: 'Smartwatches', count: 54, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop' },
    { id: 'monitors', label: 'Monitors', count: 39, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=300&fit=crop' },
    { id: 'keyboards', label: 'Keyboards & Mice', count: 67, image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop' },
    { id: 'cameras', label: 'Cameras', count: 43, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop' },
    { id: 'storage', label: 'Storage', count: 61, image: 'https://images.unsplash.com/photo-1531492898419-3a9aa15ebbd0?w=300&h=300&fit=crop' },
    { id: 'networking', label: 'Networking', count: 28, image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&h=300&fit=crop' },
    { id: 'phones', label: 'Smartphones', count: 92, image: 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=300&h=300&fit=crop' },
  ],
  fashion: [
    { id: 'mens', label: "Men's Clothing", count: 234, image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=300&h=300&fit=crop' },
    { id: 'womens', label: "Women's Clothing", count: 312, image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=300&fit=crop' },
    { id: 'shoes', label: 'Shoes', count: 189, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop' },
    { id: 'bags', label: 'Bags', count: 156, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop' },
    { id: 'accessories', label: 'Accessories', count: 203, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=300&h=300&fit=crop' },
    { id: 'streetwear', label: 'Streetwear', count: 98, image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=300&h=300&fit=crop' },
  ],
  home: [
    { id: 'furniture', label: 'Furniture', count: 123, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop' },
    { id: 'kitchen', label: 'Kitchen & Dining', count: 198, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
    { id: 'decor', label: 'Décor & Art', count: 135, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop' },
    { id: 'lighting', label: 'Smart Lighting', count: 67, image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=300&h=300&fit=crop' },
    { id: 'bedding', label: 'Bedding', count: 89, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&h=300&fit=crop' },
    { id: 'plants', label: 'Plants & Outdoors', count: 54, image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop' },
  ],
  sports: [
    { id: 'fitness', label: 'Fitness Equipment', count: 89, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop' },
    { id: 'outdoor', label: 'Outdoor & Camping', count: 112, image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300&h=300&fit=crop' },
    { id: 'cycling', label: 'Cycling', count: 86, image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300&h=300&fit=crop' },
    { id: 'running', label: 'Running', count: 134, image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=300&h=300&fit=crop' },
    { id: 'swimming', label: 'Swimming', count: 45, image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=300&h=300&fit=crop' },
    { id: 'yoga', label: 'Yoga & Pilates', count: 77, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop' },
  ],
  gaming: [
    { id: 'consoles', label: 'Consoles', count: 24, image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=300&fit=crop' },
    { id: 'peripherals', label: 'Peripherals', count: 98, image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop' },
    { id: 'headsets', label: 'Gaming Headsets', count: 56, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300&h=300&fit=crop' },
    { id: 'chairs', label: 'Gaming Chairs', count: 34, image: 'https://images.unsplash.com/photo-1593640408182-31c228e85eca?w=300&h=300&fit=crop' },
    { id: 'monitors-gaming', label: 'Gaming Monitors', count: 42, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=300&fit=crop' },
    { id: 'games', label: 'Games & DLC', count: 76, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=300&fit=crop' },
  ],
  books: [
    { id: 'fiction', label: 'Fiction', count: 245, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=300&fit=crop' },
    { id: 'nonfiction', label: 'Non-Fiction', count: 198, image: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=300&h=300&fit=crop' },
    { id: 'tech-books', label: 'Technology', count: 89, image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=300&h=300&fit=crop' },
    { id: 'design-books', label: 'Design & Art', count: 67, image: 'https://images.unsplash.com/photo-1541597455068-49e3562bdfa4?w=300&h=300&fit=crop' },
    { id: 'selfdev', label: 'Self-Development', count: 134, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop' },
    { id: 'kids', label: "Children's Books", count: 112, image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=300&fit=crop' },
  ],
}

const FEATURED_PRODUCTS: Record<string, ProductCardProps[]> = {
  electronics: [
    { id: 'e1', title: 'Sony WH-1000XM5', brand: 'Sony', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', price: 279.99, originalPrice: 349.99, rating: 4.9, reviews: 2341, badge: 'Bestseller' },
    { id: 'e2', title: 'Apple Watch Series 9', brand: 'Apple', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', price: 399.99, rating: 4.8, reviews: 1876, badge: 'New' },
    { id: 'e3', title: 'LG UltraWide 34"', brand: 'LG', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop', price: 549.99, originalPrice: 699.99, rating: 4.7, reviews: 834 },
    { id: 'e4', title: 'Logitech MX Master 3S', brand: 'Logitech', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop', price: 99.99, originalPrice: 119.99, rating: 4.8, reviews: 3210, badge: 'Hot' },
  ],
  fashion: [
    { id: 'f1', title: 'Nike Air Max 270', brand: 'Nike', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', price: 149.99, originalPrice: 180.00, rating: 4.5, reviews: 2876, badge: 'Hot' },
    { id: 'f2', title: 'Adidas Ultraboost 23', brand: 'Adidas', image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop', price: 189.99, rating: 4.6, reviews: 1543, badge: 'New' },
    { id: 'f3', title: 'Premium Leather Tote Bag', brand: 'Brands', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop', price: 129.99, rating: 4.7, reviews: 678 },
    { id: 'f4', title: 'Classic Chronograph Watch', brand: 'TimePro', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', price: 299.99, originalPrice: 399.99, rating: 4.8, reviews: 432, badge: 'Sale' },
  ],
  home: [
    { id: 'h1', title: 'Ergonomic Office Chair', brand: 'ErgoSeat', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=400&fit=crop', price: 449.99, originalPrice: 599.99, rating: 4.7, reviews: 789 },
    { id: 'h2', title: 'Smart LED Floor Lamp', brand: 'LightUp', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop', price: 89.99, rating: 4.4, reviews: 354, badge: 'New' },
    { id: 'h3', title: 'Minimal Ceramic Vase Set', brand: 'ArtHome', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop', price: 49.99, rating: 4.6, reviews: 231 },
    { id: 'h4', title: 'Non-Stick Cookware Set', brand: 'KitchenPro', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', price: 199.99, originalPrice: 279.99, rating: 4.8, reviews: 1102, badge: 'Hot' },
  ],
  sports: [
    { id: 's1', title: 'Adjustable Dumbbell Set', brand: 'FitPower', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop', price: 299.99, originalPrice: 399.99, rating: 4.8, reviews: 1234, badge: 'Hot' },
    { id: 's2', title: 'Premium Yoga Mat 6mm', brand: 'ZenFlow', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop', price: 59.99, rating: 4.6, reviews: 2187 },
    { id: 's3', title: 'Trail Running Shoes', brand: 'Nike', image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=400&h=400&fit=crop', price: 169.99, rating: 4.7, reviews: 891, badge: 'New' },
    { id: 's4', title: 'Carbon Fibre Road Bike', brand: 'SpeedCraft', image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=400&fit=crop', price: 1299.99, originalPrice: 1599.99, rating: 4.9, reviews: 234, badge: 'Sale' },
  ],
  gaming: [
    { id: 'g1', title: 'Razer BlackWidow V4', brand: 'Razer', image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop', price: 139.99, originalPrice: 169.99, rating: 4.6, reviews: 987 },
    { id: 'g2', title: 'ASUS ROG 27" 4K Monitor', brand: 'ASUS', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop', price: 799.99, originalPrice: 999.99, rating: 4.8, reviews: 456, badge: 'Hot' },
    { id: 'g3', title: 'HyperX Cloud III Headset', brand: 'HyperX', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop', price: 119.99, rating: 4.7, reviews: 1345, badge: 'New' },
    { id: 'g4', title: 'Gaming Chair Pro X', brand: 'SecretLab', image: 'https://images.unsplash.com/photo-1593640408182-31c228e85eca?w=400&h=400&fit=crop', price: 399.99, rating: 4.5, reviews: 678 },
  ],
  books: [
    { id: 'b1', title: 'Atomic Habits', brand: 'Non-Fiction', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop', price: 14.99, rating: 4.9, reviews: 12456, badge: 'Bestseller' },
    { id: 'b2', title: 'The Design of Everything', brand: 'Design', image: 'https://images.unsplash.com/photo-1541597455068-49e3562bdfa4?w=400&h=400&fit=crop', price: 39.99, rating: 4.7, reviews: 876 },
    { id: 'b3', title: 'Clean Code Handbook', brand: 'Technology', image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&h=400&fit=crop', price: 29.99, originalPrice: 44.99, rating: 4.8, reviews: 3421, badge: 'Hot' },
    { id: 'b4', title: 'Dune: The Complete Series', brand: 'Fiction', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop', price: 54.99, rating: 4.9, reviews: 5678 },
  ],
}

const BRANDS_BY_CAT: Record<string, { name: string; logo: string }[]> = {
  electronics: [
    { name: 'Apple', logo: '🍎' }, { name: 'Sony', logo: '🎵' }, { name: 'Samsung', logo: '🌟' },
    { name: 'LG', logo: '⚡' }, { name: 'Logitech', logo: '🖱️' }, { name: 'Bose', logo: '🎧' },
  ],
  fashion: [
    { name: 'Nike', logo: '✓' }, { name: 'Adidas', logo: '◈' }, { name: 'Zara', logo: 'Z' },
    { name: 'H&M', logo: 'H' }, { name: 'Uniqlo', logo: 'U' }, { name: "Levi's", logo: 'L' },
  ],
  home: [
    { name: 'IKEA', logo: '⌂' }, { name: 'Dyson', logo: 'D' }, { name: 'KitchenAid', logo: '🍴' },
    { name: 'Herman Miller', logo: 'H' }, { name: 'Muji', logo: '○' }, { name: 'SMEG', logo: 'S' },
  ],
  sports: [
    { name: 'Nike', logo: '✓' }, { name: 'Adidas', logo: '◈' }, { name: 'Under Armour', logo: 'U' },
    { name: 'Garmin', logo: 'G' }, { name: 'Decathlon', logo: 'D' }, { name: 'Lululemon', logo: 'L' },
  ],
  gaming: [
    { name: 'Razer', logo: '⚡' }, { name: 'ASUS ROG', logo: 'R' }, { name: 'Corsair', logo: 'C' },
    { name: 'HyperX', logo: 'H' }, { name: 'SteelSeries', logo: 'S' }, { name: 'Logitech G', logo: 'G' },
  ],
  books: [
    { name: 'Penguin', logo: '🐧' }, { name: 'HarperCollins', logo: 'H' }, { name: "O'Reilly", logo: 'O' },
    { name: 'Phaidon', logo: 'P' }, { name: 'Taschen', logo: 'T' }, { name: 'Penguin Modern', logo: 'M' },
  ],
}

const PROMO_BANNERS = [
  { label: 'Members Only', title: 'Extra 15% Off', sub: 'Sign in to unlock exclusive pricing on all categories.', cta: 'Sign In', icon: Crown, bg: 'bg-foreground', textColor: 'text-background' },
  { label: 'This Week', title: 'Flash Deals', sub: 'New deals drop every Monday at 9 AM. Set a reminder.', cta: 'Browse Deals', icon: Zap, bg: 'bg-primary', textColor: 'text-white' },
  { label: 'Free to Join', title: 'Student Discount', sub: '10% off sitewide for verified students and educators.', cta: 'Verify Now', icon: Sparkles, bg: 'bg-secondary border border-border', textColor: 'text-foreground' },
]

/* ═══════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
export default function CategoriesPage() {
  const [activeCategory, setActiveCategory] = useState('electronics')
  const active = MAIN_CATEGORIES.find(c => c.id === activeCategory)!
  const subcats = SUBCATEGORY_MAP[activeCategory] ?? []
  const featuredProds = FEATURED_PRODUCTS[activeCategory] ?? []
  const brands = BRANDS_BY_CAT[activeCategory] ?? []

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pb-20 sm:pb-0">

        {/* ═══ CATEGORY NAV TABS (sticky) ═══ */}
        <div className="sticky top-14 sm:top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="flex overflow-x-auto scrollbar-none">
              {MAIN_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 shrink-0 px-4 py-4 text-sm font-semibold border-b-2 transition-all ${
                    activeCategory === cat.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="text-base leading-none">{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold hidden sm:inline ${
                    activeCategory === cat.id ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {cat.count.toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ CATEGORY HERO ═══ */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
          <div className="relative overflow-hidden rounded-3xl min-h-[240px] sm:min-h-[320px]">
            {/* Background image */}
            <Image
              src={active.image}
              alt={active.label}
              fill
              className="object-cover transition-opacity duration-500"
              sizes="100vw"
              priority
            />
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${active.color} opacity-85`} />

            {/* Content */}
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 p-7 sm:p-10 h-full min-h-[240px] sm:min-h-[320px]">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/60 mb-3">
                  <span className="text-xl">{active.icon}</span>
                  {active.label}
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3">
                  {active.description}
                </h2>
                <p className="text-white/60 text-sm mb-5">
                  {active.count.toLocaleString()} products · Free shipping on orders over $50
                </p>
                <Link
                  href={`/products?category=${active.id}`}
                  className="inline-flex items-center gap-2 bg-white text-foreground px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-white/90 active:scale-[0.97] transition-all"
                >
                  Shop All {active.label}
                  <ArrowRight size={15} />
                </Link>
              </div>

              {/* Trending pills */}
              <div className="flex flex-col items-start sm:items-end gap-2">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <TrendingUp size={11} /> Trending now
                </p>
                {active.trending.map(t => (
                  <Link
                    key={t}
                    href={`/products?category=${active.id}&q=${t}`}
                    className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full transition-all backdrop-blur-sm"
                  >
                    {t} <ArrowRight size={11} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ SUBCATEGORIES ═══ */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">Explore</p>
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">Shop by Subcategory</h2>
            </div>
            <Link href={`/products?category=${activeCategory}`} className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {/* Scroll horizontal on mobile, wrap on desktop */}
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none sm:grid sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 sm:overflow-visible sm:pb-0">
            {subcats.map(sub => (
              <Link
                key={sub.id}
                href={`/products?category=${sub.id}`}
                className="snap-start shrink-0 w-40 sm:w-auto group"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary border border-border group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-black/8 transition-all duration-300">
                  <Image
                    src={sub.image}
                    alt={sub.label}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-108"
                    sizes="(max-width: 640px) 160px, 200px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-3">
                    <p className="text-white font-bold text-xs leading-tight">{sub.label}</p>
                    <p className="text-white/60 text-[10px] mt-0.5">{sub.count} items</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══ FEATURED PRODUCTS ═══ */}
        <section className="bg-secondary/40 border-y border-border py-10 sm:py-14">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">Top picks</p>
                <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  Best in {active.label}
                </h2>
              </div>
              <Link href={`/products?category=${activeCategory}&sort=popular`} className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {featuredProds.map(p => <ProductCard key={p.id} {...p} />)}
            </div>
          </div>
        </section>

        {/* ═══ PROMO BANNERS ═══ */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="grid sm:grid-cols-3 gap-4">
            {PROMO_BANNERS.map(({ label, title, sub, cta, icon: Icon, bg, textColor }) => (
              <div key={title} className={`${bg} rounded-2xl p-6 flex flex-col justify-between min-h-[160px]`}>
                <div>
                  <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-3 ${textColor} opacity-60`}>
                    <Icon size={11} />
                    {label}
                  </div>
                  <h3 className={`text-xl font-black leading-tight mb-1.5 ${textColor}`}>{title}</h3>
                  <p className={`text-sm leading-relaxed ${textColor} opacity-70`}>{sub}</p>
                </div>
                <button className={`mt-5 self-start flex items-center gap-1.5 text-xs font-bold ${textColor} hover:gap-3 transition-all`}>
                  {cta} <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ FEATURED BRANDS ═══ */}
        <section className="border-t border-border py-10 sm:py-14 bg-background">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">Official stores</p>
                <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">Top Brands</h2>
              </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {brands.map(b => (
                <Link
                  key={b.name}
                  href={`/products?brand=${b.name.toLowerCase()}`}
                  className="group flex flex-col items-center justify-center gap-2.5 p-4 sm:p-5 bg-card border border-border rounded-2xl hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <span className="text-3xl leading-none">{b.logo}</span>
                  <span className="text-xs font-semibold text-foreground text-center leading-tight">{b.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ ALL CATEGORIES GRID (overview) ═══ */}
        <section className="border-t border-border bg-secondary/30 py-10 sm:py-14">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1.5">Everything</p>
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">Browse All Departments</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {MAIN_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  className={`group relative overflow-hidden rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/8 border ${activeCategory === cat.id ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}
                >
                  <div className="relative aspect-[3/2] sm:aspect-square overflow-hidden bg-muted">
                    <Image src={cat.image} alt={cat.label} fill className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" sizes="(max-width: 640px) 50vw, 16vw" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-70 group-hover:opacity-80 transition-opacity`} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                      <span className="text-3xl mb-2 leading-none">{cat.icon}</span>
                      <p className="text-white font-black text-sm leading-tight">{cat.label}</p>
                      <p className="text-white/60 text-[10px] mt-1">{cat.count.toLocaleString()} items</p>
                    </div>
                    {activeCategory === cat.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-[10px] font-black">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ STATS STRIP ═══ */}
        <section className="border-t border-border bg-background py-8">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-0 sm:divide-x sm:divide-border">
              {[
                { icon: Package, num: '50K+', label: 'Products in stock' },
                { icon: Star, num: '4.8', label: 'Average rating' },
                { icon: Tag, num: '200+', label: 'Brands available' },
                { icon: TrendingUp, num: '2M+', label: 'Happy customers' },
              ].map(({ icon: Icon, num, label }) => (
                <div key={label} className="flex items-center gap-4 sm:px-8 first:sm:pl-0 last:sm:pr-0">
                  <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-foreground">{num}</p>
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