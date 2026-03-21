'use client'

import { useState } from 'react'
import { Mail, Phone, Search, MessageSquare, MoreVertical } from 'lucide-react'
import AdminSidebar from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  joinDate: string
  status: 'active' | 'inactive'
}

export default function AdminCustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const customers: Customer[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+1 (555) 123-4567', totalOrders: 5, totalSpent: 2499.95, joinDate: '2023-01-15', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+1 (555) 234-5678', totalOrders: 3, totalSpent: 849.97, joinDate: '2023-03-20', status: 'active' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', phone: '+1 (555) 345-6789', totalOrders: 8, totalSpent: 3999.92, joinDate: '2022-11-10', status: 'active' },
    { id: '4', name: 'Alice Williams', email: 'alice@example.com', phone: '+1 (555) 456-7890', totalOrders: 2, totalSpent: 549.98, joinDate: '2023-08-05', status: 'inactive' },
    { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', phone: '+1 (555) 567-8901', totalOrders: 6, totalSpent: 1899.94, joinDate: '2023-02-14', status: 'active' },
  ]

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar currentPath="/admin/customers" />

      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Customers</h1>
            <p className="text-muted-foreground mt-1">Manage and view customer information</p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Customers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg">{customer.name}</h3>
                    <p className="text-sm text-muted-foreground">Joined {new Date(customer.joinDate).toLocaleDateString()}</p>
                  </div>
                  <button className="p-2 hover:bg-background-secondary rounded transition-colors">
                    <MoreVertical size={16} className="text-muted-foreground" />
                  </button>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-6 pb-6 border-b border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail size={16} className="text-primary" />
                    <a href={`mailto:${customer.email}`} className="hover:text-primary transition-colors">
                      {customer.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone size={16} className="text-primary" />
                    <a href={`tel:${customer.phone}`} className="hover:text-primary transition-colors">
                      {customer.phone}
                    </a>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Orders</p>
                    <p className="text-2xl font-bold text-foreground">{customer.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Spent</p>
                    <p className="text-2xl font-bold text-primary">${customer.totalSpent.toFixed(2)}</p>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex gap-2">
                  <span className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold text-center capitalize ${
                    customer.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {customer.status}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <MessageSquare size={16} />
                    Contact
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Customers</p>
              <p className="text-3xl font-bold text-foreground">{customers.length}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">Active Customers</p>
              <p className="text-3xl font-bold text-green-600">{customers.filter(c => c.status === 'active').length}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Orders</p>
              <p className="text-3xl font-bold text-blue-600">{customers.reduce((sum, c) => sum + c.totalOrders, 0)}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">Revenue</p>
              <p className="text-3xl font-bold text-primary">
                ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
