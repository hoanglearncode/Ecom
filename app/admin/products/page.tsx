'use client'

import { useState } from 'react'
import { Edit2, Trash2, Plus, Search } from 'lucide-react'
import AdminSidebar from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: 'active' | 'inactive'
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Premium Wireless Headphones', category: 'Electronics', price: 299.99, stock: 45, status: 'active' },
    { id: '2', name: 'Smart Watch Pro', category: 'Electronics', price: 449.99, stock: 32, status: 'active' },
    { id: '3', name: '4K Webcam Ultra', category: 'Electronics', price: 199.99, stock: 18, status: 'active' },
    { id: '4', name: 'Gaming Mouse Extreme', category: 'Accessories', price: 89.99, stock: 156, status: 'active' },
    { id: '5', name: 'Mechanical Keyboard RGB', category: 'Accessories', price: 159.99, stock: 92, status: 'inactive' },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [isAddingProduct, setIsAddingProduct] = useState(false)

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar currentPath="/admin/products" />

      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Products</h1>
              <p className="text-muted-foreground mt-1">Manage your product inventory</p>
            </div>
            <Button
              onClick={() => setIsAddingProduct(!isAddingProduct)}
              className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2"
            >
              <Plus size={18} />
              Add Product
            </Button>
          </div>

          {/* Add Product Form */}
          {isAddingProduct && (
            <div className="bg-card rounded-lg border border-border p-6 mb-8">
              <h2 className="text-lg font-bold text-foreground mb-4">Add New Product</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Select Category</option>
                  <option>Electronics</option>
                  <option>Accessories</option>
                  <option>Audio</option>
                  <option>Furniture</option>
                </select>
                <input
                  type="number"
                  placeholder="Price"
                  className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="number"
                  placeholder="Stock Quantity"
                  className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-3">
                <Button className="bg-primary text-white hover:bg-primary/90">Save Product</Button>
                <Button variant="outline" onClick={() => setIsAddingProduct(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-background-secondary">
                    <th className="px-6 py-4 text-left font-semibold text-foreground">Product Name</th>
                    <th className="px-6 py-4 text-left font-semibold text-foreground">Category</th>
                    <th className="px-6 py-4 text-left font-semibold text-foreground">Price</th>
                    <th className="px-6 py-4 text-left font-semibold text-foreground">Stock</th>
                    <th className="px-6 py-4 text-left font-semibold text-foreground">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-border hover:bg-background-secondary transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{product.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{product.category}</td>
                      <td className="px-6 py-4 font-semibold text-primary">${product.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-foreground">{product.stock} units</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {product.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-background-secondary rounded transition-colors text-foreground">
                            <Edit2 size={16} />
                          </button>
                          <button className="p-2 hover:bg-background-secondary rounded transition-colors text-primary">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products
            </p>
            <div className="flex gap-2">
              <Button variant="outline" disabled>Previous</Button>
              <Button className="bg-primary text-white">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
