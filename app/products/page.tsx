'use client'

import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import ProductCard from '@/components/product-card'

// Mock products data
const allProducts = [
  { id: '1', title: 'Premium Wireless Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop', price: 299.99, rating: 4.8, reviews: 324, category: 'Electronics' },
  { id: '2', title: 'Smart Watch Pro', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop', price: 449.99, rating: 4.6, reviews: 218, category: 'Electronics' },
  { id: '3', title: '4K Webcam Ultra', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop', price: 199.99, rating: 4.7, reviews: 156, category: 'Electronics' },
  { id: '4', title: 'Gaming Mouse Extreme', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop', price: 89.99, rating: 4.9, reviews: 512, category: 'Electronics' },
  { id: '5', title: 'Mechanical Keyboard RGB', image: 'https://images.unsplash.com/photo-1587829191301-4ce6e7c7b65f?w=300&h=300&fit=crop', price: 159.99, rating: 4.7, reviews: 289, category: 'Electronics' },
  { id: '6', title: 'USB-C Hub Adapter', image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=300&h=300&fit=crop', price: 49.99, rating: 4.5, reviews: 145, category: 'Electronics' },
  { id: '7', title: 'Premium Phone Stand', image: 'https://images.unsplash.com/photo-1586253408ff-e8da0e535e24?w=300&h=300&fit=crop', price: 29.99, rating: 4.6, reviews: 267, category: 'Accessories' },
  { id: '8', title: 'Portable Charger 20000mAh', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop', price: 79.99, rating: 4.8, reviews: 433, category: 'Accessories' },
  { id: '9', title: 'Bluetooth Speaker Pro', image: 'https://images.unsplash.com/photo-1589003077984-894e133814c9?w=300&h=300&fit=crop', price: 129.99, rating: 4.7, reviews: 321, category: 'Audio' },
  { id: '10', title: 'Wireless Charging Pad', image: 'https://images.unsplash.com/photo-1591290619521-79d59ce1a926?w=300&h=300&fit=crop', price: 39.99, rating: 4.4, reviews: 198, category: 'Accessories' },
  { id: '11', title: '27" 4K Monitor IPS', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop', price: 599.99, rating: 4.9, reviews: 287, category: 'Electronics' },
  { id: '12', title: 'Ergonomic Office Chair', image: 'https://images.unsplash.com/photo-1580480055273-228f5b1ae546?w=300&h=300&fit=crop', price: 349.99, rating: 4.7, reviews: 156, category: 'Furniture' },
]

const categories = ['All', 'Electronics', 'Accessories', 'Audio', 'Furniture']
const priceRanges = [
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $300', min: 100, max: 300 },
  { label: '$300 - $500', min: 300, max: 500 },
  { label: 'Over $500', min: 500, max: Infinity },
]

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Best Rated', value: 'rated' },
]

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPriceRange, setSelectedPriceRange] = useState<number[] | null>(null)
  const [sortBy, setSortBy] = useState('newest')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Filter and sort products
  let filteredProducts = allProducts
    .filter((p) => selectedCategory === 'All' || p.category === selectedCategory)
    .filter((p) => !selectedPriceRange || (p.price >= selectedPriceRange[0] && p.price <= selectedPriceRange[1]))

  // Sort
  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price)
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price)
  } else if (sortBy === 'rated') {
    filteredProducts.sort((a, b) => b.rating - a.rating)
  } else if (sortBy === 'popular') {
    filteredProducts.sort((a, b) => b.reviews - a.reviews)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header cartCount={3} wishlistCount={2} />

      <main className="flex-1">
        {/* Header */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Products</h1>
          <p className="text-muted-foreground">{filteredProducts.length} products found</p>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === cat
                            ? 'bg-primary text-white'
                            : 'text-foreground hover:bg-background-secondary'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border my-6"></div>

                {/* Price Range */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Price Range</h3>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => setSelectedPriceRange([range.min, range.max])}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedPriceRange && selectedPriceRange[0] === range.min
                            ? 'bg-primary text-white'
                            : 'text-foreground hover:bg-background-secondary'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Section */}
            <div className="lg:col-span-3">
              {/* Sort & View Options */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="relative w-full sm:w-48">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 border border-border bg-card rounded-lg text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 pointer-events-none text-muted-foreground" size={20} />
                </div>

                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="lg:hidden px-4 py-2 border border-border rounded-lg text-foreground hover:bg-background-secondary transition-colors w-full sm:w-auto"
                >
                  Filters
                </button>
              </div>

              {/* Mobile Filters */}
              {showMobileFilters && (
                <div className="lg:hidden bg-card rounded-lg border border-border p-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Filters</h3>
                    <button onClick={() => setShowMobileFilters(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat)
                          setShowMobileFilters(false)
                        }}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === cat
                            ? 'bg-primary text-white'
                            : 'bg-background-secondary text-foreground'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No products found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
