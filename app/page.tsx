'use client'

import { ArrowRight, Truck, Shield, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Header from '@/components/header'
import Footer from '@/components/footer'
import ProductCard from '@/components/product-card'
import Image from 'next/image'

// Mock Featured Products
const featuredProducts = [
  {
    id: '1',
    title: 'Premium Wireless Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    price: 299.99,
    rating: 4.8,
    reviews: 324,
  },
  {
    id: '2',
    title: 'Smart Watch Pro',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
    price: 449.99,
    rating: 4.6,
    reviews: 218,
  },
  {
    id: '3',
    title: '4K Webcam Ultra',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop',
    price: 199.99,
    rating: 4.7,
    reviews: 156,
  },
  {
    id: '4',
    title: 'Gaming Mouse Extreme',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop',
    price: 89.99,
    rating: 4.9,
    reviews: 512,
  },
]

// Categories
const categories = [
  { name: 'Electronics', icon: '📱', count: '1,234' },
  { name: 'Fashion', icon: '👗', count: '2,456' },
  { name: 'Home & Garden', icon: '🏠', count: '876' },
  { name: 'Sports', icon: '⚽', count: '543' },
  { name: 'Books', icon: '📚', count: '2,123' },
  { name: 'Toys & Games', icon: '🎮', count: '1,654' },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header cartCount={3} wishlistCount={2} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary via-primary-light to-primary-lighter py-20 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  Shop the Latest Trends
                </h1>
                <p className="text-lg text-white/90 mb-8">
                  Discover exclusive products, unbeatable prices, and fast shipping. Your favorite brands, all in one place.
                </p>
                <div className="flex gap-4">
                  <Button
                    asChild
                    className="bg-white text-primary hover:bg-white/90 font-semibold"
                  >
                    <Link href="/products" className="flex items-center gap-2">
                      Shop Now
                      <ArrowRight size={18} />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="border-white text-white hover:bg-white/10"
                  >
                    <Link href="/categories">Browse Categories</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden md:block h-96 bg-white/10 rounded-lg border border-white/20"></div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="bg-card border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-lighter rounded-lg">
                  <Truck className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Free Shipping</h3>
                  <p className="text-sm text-muted-foreground">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-lighter rounded-lg">
                  <Shield className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Secure Payment</h3>
                  <p className="text-sm text-muted-foreground">100% safe transactions</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-lighter rounded-lg">
                  <Clock className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">24/7 Support</h3>
                  <p className="text-sm text-muted-foreground">Dedicated assistance</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/products?category=${cat.name.toLowerCase()}`}
                className="group flex flex-col items-center justify-center p-6 bg-card rounded-lg border border-border hover:border-primary hover:shadow-lg transition-all duration-300"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="font-semibold text-foreground text-center text-sm">
                  {cat.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">{cat.count}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">Featured Products</h2>
            <Link
              href="/products"
              className="text-primary font-semibold hover:underline flex items-center gap-2"
            >
              View All
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-primary text-white mx-auto max-w-7xl my-16 rounded-lg overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-md">
              <h2 className="text-3xl font-bold mb-2">Stay Updated</h2>
              <p className="text-white/80 mb-6">
                Subscribe to our newsletter and get exclusive deals delivered to your inbox.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-white/20 placeholder:text-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white"
                />
                <Button className="bg-white text-primary hover:bg-white/90 font-semibold">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
