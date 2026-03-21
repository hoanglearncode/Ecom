'use client'

import { useState } from 'react'
import { Trash2, ShoppingCart, Heart, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface WishlistItem {
  id: string
  title: string
  price: number
  image: string
  rating: number
  addedDate: string
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([
    {
      id: '1',
      title: 'Premium Wireless Headphones',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      rating: 4.8,
      addedDate: '2024-01-18',
    },
    {
      id: '2',
      title: 'Smart Watch Pro',
      price: 449.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      rating: 4.6,
      addedDate: '2024-01-15',
    },
  ])

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const totalValue = items.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header cartCount={3} wishlistCount={items.length} />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-8">
            <Link href="/" className="text-primary hover:underline">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-semibold">My Wishlist</span>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">My Wishlist</h1>
          <p className="text-muted-foreground mb-8">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Wishlist Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex gap-6">
                      {/* Image */}
                      <div className="h-40 w-40 flex-shrink-0 bg-background-secondary rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={160}
                          height={160}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex text-yellow-400">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i}>{i < Math.floor(item.rating) ? '★' : '☆'}</span>
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">({item.rating})</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Added on {new Date(item.addedDate).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-end justify-between">
                          <p className="text-2xl font-bold text-primary">${item.price.toFixed(2)}</p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2"
                            >
                              <ShoppingCart size={16} />
                              Add to Cart
                            </Button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-muted-foreground hover:text-primary hover:bg-background-secondary rounded transition-colors"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div>
                <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-foreground mb-6">Wishlist Summary</h2>

                  <div className="space-y-3 mb-6 pb-6 border-b border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items</span>
                      <span className="text-foreground font-medium">{items.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Value</span>
                      <span className="text-foreground font-medium">${totalValue.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-primary text-white hover:bg-primary/90 font-semibold py-3 flex items-center justify-center gap-2 mb-3">
                    <ShoppingCart size={18} />
                    Add All to Cart
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <Link href="/products">Continue Shopping</Link>
                  </Button>

                  {/* Info */}
                  <div className="mt-6 p-4 bg-primary-lighter/30 rounded-lg border border-primary-lighter">
                    <p className="text-xs text-foreground">
                      <span className="font-semibold">Tip:</span> Wishlist items are saved to your account. You can access them from any device!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-background-secondary rounded-full">
                  <Heart size={40} className="text-muted-foreground" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Wishlist is Empty</h2>
              <p className="text-muted-foreground mb-8">Add items to your wishlist to save them for later</p>
              <Button
                asChild
                className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2 mx-auto"
              >
                <Link href="/products">
                  Start Shopping
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
