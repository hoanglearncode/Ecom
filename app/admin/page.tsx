'use client'

import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Package, ShoppingCart, Users, DollarSign } from 'lucide-react'
import AdminSidebar from '@/components/admin-sidebar'

// Mock data
const salesData = [
  { month: 'Jan', sales: 4000, orders: 240 },
  { month: 'Feb', sales: 3000, orders: 221 },
  { month: 'Mar', sales: 2000, orders: 229 },
  { month: 'Apr', sales: 2780, orders: 200 },
  { month: 'May', sales: 1890, orders: 229 },
  { month: 'Jun', sales: 2390, orders: 200 },
  { month: 'Jul', sales: 3490, orders: 210 },
]

const categoryData = [
  { name: 'Electronics', value: 45 },
  { name: 'Accessories', value: 30 },
  { name: 'Audio', value: 15 },
  { name: 'Furniture', value: 10 },
]

const colors = ['#E40F2A', '#DA596C', '#EEA9B3', '#666666']

export default function AdminDashboard() {
  const stats = [
    {
      label: 'Total Revenue',
      value: '$24,890',
      change: '+12.5%',
      icon: DollarSign,
      color: 'bg-primary',
    },
    {
      label: 'Total Orders',
      value: '1,243',
      change: '+8.2%',
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Products',
      value: '487',
      change: '+4.1%',
      icon: Package,
      color: 'bg-orange-500',
    },
    {
      label: 'Total Customers',
      value: '3,421',
      change: '+6.3%',
      icon: Users,
      color: 'bg-green-500',
    },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar currentPath="/admin" />

      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome to your admin panel</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <span className="text-green-600 font-semibold text-sm">{stat.change}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
              )
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Chart */}
            <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-bold text-foreground mb-6">Sales & Orders</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E7E7" />
                  <XAxis stroke="#666666" />
                  <YAxis stroke="#666666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FDFDFD',
                      border: '1px solid #E8E7E7',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#E40F2A"
                    dot={{ fill: '#E40F2A' }}
                    name="Sales ($)"
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#DA596C"
                    dot={{ fill: '#DA596C' }}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Category Distribution */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-bold text-foreground mb-6">Category Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {categoryData.map((cat, idx) => (
                  <div key={cat.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx] }}></div>
                      <span className="text-muted-foreground">{cat.name}</span>
                    </div>
                    <span className="font-semibold text-foreground">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-bold text-foreground mb-6">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-foreground font-semibold">Order ID</th>
                    <th className="px-4 py-3 text-left text-foreground font-semibold">Customer</th>
                    <th className="px-4 py-3 text-left text-foreground font-semibold">Amount</th>
                    <th className="px-4 py-3 text-left text-foreground font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-foreground font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'ORD-001', customer: 'John Doe', amount: '$299.99', status: 'Delivered', date: '2024-01-20' },
                    { id: 'ORD-002', customer: 'Jane Smith', amount: '$449.99', status: 'Shipped', date: '2024-01-19' },
                    { id: 'ORD-003', customer: 'Bob Johnson', amount: '$149.98', status: 'Processing', date: '2024-01-18' },
                    { id: 'ORD-004', customer: 'Alice Williams', amount: '$899.96', status: 'Pending', date: '2024-01-17' },
                    { id: 'ORD-005', customer: 'Charlie Brown', amount: '$349.99', status: 'Delivered', date: '2024-01-16' },
                  ].map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-background-secondary">
                      <td className="px-4 py-3 text-foreground font-medium">{order.id}</td>
                      <td className="px-4 py-3 text-foreground">{order.customer}</td>
                      <td className="px-4 py-3 text-foreground font-semibold text-primary">{order.amount}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-700'
                            : order.status === 'Processing'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
