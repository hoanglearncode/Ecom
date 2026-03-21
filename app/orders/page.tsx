'use client'

import { Package, Truck, CheckCircle, MapPin } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'

interface Order {
  id: string
  date: string
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  items: number
  estimatedDelivery: string
}

export default function OrdersPage() {
  const orders: Order[] = [
    {
      id: 'ORD-001-2024',
      date: '2024-01-15',
      total: 829.96,
      status: 'delivered',
      items: 3,
      estimatedDelivery: '2024-01-20',
    },
    {
      id: 'ORD-002-2024',
      date: '2024-01-18',
      total: 299.99,
      status: 'shipped',
      items: 1,
      estimatedDelivery: '2024-01-25',
    },
    {
      id: 'ORD-003-2024',
      date: '2024-01-19',
      total: 149.98,
      status: 'processing',
      items: 2,
      estimatedDelivery: '2024-01-28',
    },
    {
      id: 'ORD-004-2024',
      date: '2024-01-20',
      total: 499.99,
      status: 'pending',
      items: 1,
      estimatedDelivery: '2024-02-02',
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Package className="text-yellow-500" size={20} />
      case 'processing':
        return <Package className="text-blue-500" size={20} />
      case 'shipped':
        return <Truck className="text-orange-500" size={20} />
      case 'delivered':
        return <CheckCircle className="text-green-500" size={20} />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending'
      case 'processing':
        return 'Processing'
      case 'shipped':
        return 'Shipped'
      case 'delivered':
        return 'Delivered'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header cartCount={3} wishlistCount={2} />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-8">
            <Link href="/" className="text-primary hover:underline">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-semibold">My Orders</span>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">My Orders</h1>
          <p className="text-muted-foreground mb-8">Track and manage your orders</p>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                    {/* Order ID */}
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Order ID
                      </p>
                      <p className="font-semibold text-foreground">{order.id}</p>
                    </div>

                    {/* Date */}
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Order Date
                      </p>
                      <p className="text-foreground">
                        {new Date(order.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>

                    {/* Status */}
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Status
                      </p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <p className="font-medium text-foreground">
                          {getStatusLabel(order.status)}
                        </p>
                      </div>
                    </div>

                    {/* Total */}
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Total
                      </p>
                      <p className="text-lg font-bold text-primary">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>

                    {/* Action */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        asChild
                      >
                        <Link href={`/orders/${order.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                          ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status) >= 0
                            ? 'bg-green-500 text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          <Package size={16} />
                        </div>
                        <p className="text-xs text-muted-foreground text-center">Pending</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                          ['processing', 'shipped', 'delivered'].indexOf(order.status) >= 0
                            ? 'bg-green-500 text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          <Package size={16} />
                        </div>
                        <p className="text-xs text-muted-foreground text-center">Processing</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                          ['shipped', 'delivered'].indexOf(order.status) >= 0
                            ? 'bg-green-500 text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          <Truck size={16} />
                        </div>
                        <p className="text-xs text-muted-foreground text-center">Shipped</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                          order.status === 'delivered'
                            ? 'bg-green-500 text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          <CheckCircle size={16} />
                        </div>
                        <p className="text-xs text-muted-foreground text-center">Delivered</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-background-secondary rounded-full">
                  <Package size={40} className="text-muted-foreground" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">No Orders Yet</h2>
              <p className="text-muted-foreground mb-8">Start shopping to create your first order!</p>
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
