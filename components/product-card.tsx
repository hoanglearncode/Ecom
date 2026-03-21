'use client'

import { Heart, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface ProductCardProps {
  id: string
  title: string
  image: string
  price: number
  rating: number
  reviews: number
  isFavorite?: boolean
  onAddToCart?: () => void
  onFavorite?: () => void
}

export default function ProductCard({
  id,
  title,
  image,
  price,
  rating,
  reviews,
  isFavorite = false,
  onAddToCart,
  onFavorite,
}: ProductCardProps) {
  const [favorite, setFavorite] = useState(isFavorite)
  const [isAdded, setIsAdded] = useState(false)

  const handleFavorite = () => {
    setFavorite(!favorite)
    onFavorite?.()
  }

  const handleAddToCart = () => {
    setIsAdded(true)
    onAddToCart?.()
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div className="group flex flex-col bg-card rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 border border-border">
      {/* Image Container */}
      <div className="relative h-48 bg-background-secondary overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={handleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            favorite ? 'bg-primary text-white' : 'bg-white/80 hover:bg-white'
          }`}
        >
          <Heart
            size={18}
            className={favorite ? 'fill-white' : ''}
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2 text-sm">
          {title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>{i < Math.floor(rating) ? '★' : '☆'}</span>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({reviews})
          </span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <span className="text-lg font-bold text-primary">
            ${price.toFixed(2)}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
            isAdded
              ? 'bg-green-500 text-white'
              : 'bg-primary text-white hover:bg-primary/90'
          }`}
        >
          <ShoppingCart size={16} />
          {isAdded ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
