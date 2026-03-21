'use client'

import { useState } from 'react'
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  image: string
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: '1',
      title: 'Premium Wireless Headphones',
      price: 299.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    },
    {
      id: '2',
      title: 'Smart Watch Pro',
      price: 449.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
    },
    {
      id: '8',
      title: 'Portable Charger 20000mAh',
      price: 79.99,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop',
    },
  ])

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems(items.map(item => item.id === id ? { ...item, quantity } : item))
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 10
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header cartCount={items.length} wishlistCount={2} />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-8">
            <Link href="/" className="text-primary hover:underline">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-semibold">Shopping Cart</span>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-lg border border-border overflow-hidden">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className={`flex gap-4 p-6 ${index !== items.length - 1 ? 'border-b border-border' : ''}`}
                    >
                      {/* Product Image */}
                      <div className="h-24 w-24 bg-background-secondary rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                        <p className="text-lg font-bold text-primary">${item.price.toFixed(2)}</p>

                        {/* Quantity Control */}
                        <div className="flex items-center gap-3 mt-4">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 border border-border rounded hover:bg-background-secondary transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-semibold text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 border border-border rounded hover:bg-background-secondary transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Price & Remove */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-background-secondary rounded transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                        <p className="font-bold text-foreground">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <div className="mt-6">
                  <Link
                    href="/products"
                    className="text-primary font-semibold hover:underline flex items-center gap-2"
                  >
                    Continue Shopping
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

                  <div className="space-y-3 mb-6 pb-6 border-b border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-foreground font-medium">
                        {shipping === 0 ? (
                          <span className="text-green-600 font-bold">FREE</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="text-foreground font-medium">${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between mb-6">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                  </div>

                  <Button className="w-full bg-primary text-white hover:bg-primary/90 font-semibold py-3 mb-3">
                    Proceed to Checkout
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <Link href="/products">Continue Shopping</Link>
                  </Button>

                  {/* Info Box */}
                  <div className="mt-6 p-4 bg-primary-lighter/30 rounded-lg border border-primary-lighter">
                    <p className="text-xs text-foreground">
                      <span className="font-semibold">Free Shipping:</span> Orders over $50 qualify for free shipping
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-background-secondary rounded-full">
                  <span className="text-4xl">🛒</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Cart is Empty</h2>
              <p className="text-muted-foreground mb-8">Add some products to get started!</p>
              <Button
                asChild
                className="bg-primary text-white hover:bg-primary/90"
              >
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
