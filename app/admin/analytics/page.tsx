'use client'

import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, TrendingDown, Users, Zap } from 'lucide-react'
import AdminSidebar from '@/components/admin-sidebar'

// Mock analytics data
const dailyRevenue = [
  { date: '1 Jan', revenue: 2400, customers: 240, conversion: 2.4 },
  { date: '2 Jan', revenue: 1398, customers: 221, conversion: 1.8 },
  { date: '3 Jan', revenue: 9800, customers: 229, conversion: 2.9 },
  { date: '4 Jan', revenue: 3908, customers: 200, conversion: 2.1 },
  { date: '5 Jan', revenue: 4800, customers: 229, conversion: 2.4 },
  { date: '6 Jan', revenue: 3800, customers: 200, conversion: 2.2 },
  { date: '7 Jan', revenue: 4300, customers: 210, conversion: 2.3 },
]

const productPerformance = [
  { name: 'Electronics', value: 45, sales: 15420 },
  { name: 'Accessories', value: 30, sales: 8950 },
  { name: 'Audio', value: 15, sales: 4200 },
  { name: 'Furniture', value: 10, sales: 2800 },
]

const colors = ['#E40F2A', '#DA596C', '#EEA9B3', '#666666']

const trafficSources = [
  { name: 'Organic Search', value: 35, trend: '+12%' },
  { name: 'Direct', value: 25, trend: '+5%' },
  { name: 'Social Media', value: 20, trend: '+18%' },
  { name: 'Email', value: 15, trend: '+8%' },
  { name: 'Other', value: 5, trend: '-2%' },
]

export default function AdminAnalyticsPage() {
  const metrics = [
    {
      label: 'Total Revenue',
      value: '$31,098',
      change: '+12.5%',
      isPositive: true,
      icon: TrendingUp,
    },
    {
      label: 'Avg. Order Value',
      value: '$267.50',
      change: '+3.2%',
      isPositive: true,
      icon: TrendingUp,
    },
    {
      label: 'Conversion Rate',
      value: '2.35%',
      change: '-0.5%',
      isPositive: false,
      icon: TrendingDown,
    },
    {
      label: 'Avg. Customer LTV',
      value: '$845.30',
      change: '+8.1%',
      isPositive: true,
      icon: TrendingUp,
    },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar currentPath="/admin/analytics" />

      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground mt-1">Track your business performance</p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric) => {
              const Icon = metric.icon
              return (
                <div
                  key={metric.label}
                  className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-muted-foreground text-sm font-medium">{metric.label}</p>
                    <Icon className={metric.isPositive ? 'text-green-500' : 'text-red-500'} size={20} />
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-2">{metric.value}</p>
                  <p className={`text-sm font-semibold ${metric.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Trend */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-bold text-foreground mb-6">Revenue Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E7E7" />
                  <XAxis dataKey="date" stroke="#666666" />
                  <YAxis stroke="#666666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FDFDFD',
                      border: '1px solid #E8E7E7',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => `$${value}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#E40F2A"
                    dot={{ fill: '#E40F2A' }}
                    name="Revenue ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Customer Growth */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-bold text-foreground mb-6">Customer Growth</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E7E7" />
                  <XAxis dataKey="date" stroke="#666666" />
                  <YAxis stroke="#666666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FDFDFD',
                      border: '1px solid #E8E7E7',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="customers"
                    stroke="#DA596C"
                    fill="#EEA9B3"
                    name="New Customers"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Product Performance & Traffic */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Product Performance */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-bold text-foreground mb-6">Top Performing Categories</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E7E7" />
                  <XAxis dataKey="name" stroke="#666666" />
                  <YAxis stroke="#666666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FDFDFD',
                      border: '1px solid #E8E7E7',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => `$${value}`}
                  />
                  <Bar dataKey="sales" fill="#E40F2A" name="Sales ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category Distribution */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-bold text-foreground mb-6">Category Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={productPerformance}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {productPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {productPerformance.map((cat, idx) => (
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

          {/* Traffic Sources */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-lg font-bold text-foreground mb-6">Traffic Sources</h2>
            <div className="space-y-4">
              {trafficSources.map((source) => (
                <div key={source.name} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-foreground">{source.name}</p>
                      <span className="text-sm font-semibold text-green-600">{source.trend}</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${source.value}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="ml-4 font-semibold text-foreground w-12 text-right">{source.value}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
