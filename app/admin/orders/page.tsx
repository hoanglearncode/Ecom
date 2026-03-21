'use client'

import { useState } from 'react'
import { Eye, Download, Filter } from 'lucide-react'
import AdminSidebar from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'

interface Order {
  id: string
  customer: string
  amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  date: string
  items: number
}

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState('all')

  const orders: Order[] = [
    { id: 'ORD-001', customer: 'John Doe', amount: 829.96, status: 'delivered', date: '2024-01-20', items: 3 },
    { id: 'ORD-002', customer: 'Jane Smith', amount: 299.99, status: 'shipped', date: '2024-01-19', items: 1 },
    { id: 'ORD-003', customer: 'Bob Johnson', amount: 149.98, status: 'processing', date: '2024-01-18', items: 2 },
    { id: 'ORD-004', customer: 'Alice Williams', amount: 499.99, status: 'pending', date: '2024-01-17', items: 1 },
    { id: 'ORD-005', customer: 'Charlie Brown', amount: 349.99, status: 'delivered', date: '2024-01-16', items: 2 },
  ]

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar currentPath="/admin/orders" />

      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Orders</h1>
            <p className="text-muted-foreground mt-1">View and manage customer orders</p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-3">
            {['all', 'pending', 'processing', 'shipped', 'delivered'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                  filter === status
                    ? 'bg-primary text-white'
                    : 'bg-card border border-border text-foreground hover:bg-background-secondary'
                }`}
              >
                {status}
              </button>
            ))}
            <Button variant="outline" className="ml-auto flex items-center gap-2">
              <Filter size={18} />
              More Filters
            </Button>
          </div>

          {/* Orders Table */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-background-secondary">
                    <th className="px-6 py-4 text-left font-semibold text-foreground">Order ID</th>
                    <th className="px-6 py-4 text-left font-semibold text-foreground">Customer</th>
                    <th className="px-6 py-4 text-left font-semibold text-foreground">Amount</th>
                    <th className="px-6 py-4 text-left font-semibold text-foreground">Items</th>
                    <th className="px-6 py-4 text-left font-semibold text-foreground">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-foreground">Date</th>
                    <th className="px-6 py-4 text-left font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-background-secondary transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{order.id}</td>
                      <td className="px-6 py-4 text-foreground">{order.customer}</td>
                      <td className="px-6 py-4 font-semibold text-primary">${order.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-foreground">{order.items}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-700'
                            : order.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-background-secondary rounded transition-colors text-foreground">
                            <Eye size={16} />
                          </button>
                          <button className="p-2 hover:bg-background-secondary rounded transition-colors text-foreground">
                            <Download size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Orders</p>
              <p className="text-2xl font-bold text-foreground">{orders.length}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'pending').length}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">Shipped</p>
              <p className="text-2xl font-bold text-blue-600">{orders.filter(o => o.status === 'shipped').length}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Revenue</p>
              <p className="text-2xl font-bold text-primary">
                ${orders.reduce((sum, o) => sum + o.amount, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
