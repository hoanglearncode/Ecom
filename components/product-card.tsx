'use client'

import { Heart, ShoppingBag, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export interface ProductCardProps {
  id: string
  title: string
  brand?: string
  image: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  badge?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function ProductCard({
  id, title, brand = 'ShopHub', image, price, originalPrice, rating, reviews, badge, size = 'md',
}: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false)
  const [cartState, setCartState] = useState<'idle' | 'adding' | 'done'>('idle')

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (cartState !== 'idle') return
    setCartState('adding')
    setTimeout(() => { setCartState('done'); setTimeout(() => setCartState('idle'), 1200) }, 600)
  }

  return (
    <Link href={`/products/${id}`} className="group block outline-none">
      <div className={`rounded-2xl overflow-hidden bg-card border border-border/60 hover:border-border hover:shadow-lg hover:shadow-black/6 transition-all duration-300 hover:-translate-y-0.5 ${size === 'lg' ? 'rounded-3xl' : ''}`}>

        {/* Image */}
        <div className={`relative overflow-hidden bg-secondary ${size === 'lg' ? 'aspect-[3/4]' : 'aspect-square'}`}>
          <Image src={image} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 50vw, 25vw" />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {badge && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest ${badge === 'Sale' ? 'bg-primary text-white' : badge === 'New' ? 'bg-foreground text-background' : 'bg-amber-500 text-white'}`}>{badge}</span>}
            {discount && !badge && <span className="text-[10px] font-bold px-2 py-0.5 bg-primary text-white rounded-md">-{discount}%</span>}
          </div>

          {/* Wishlist */}
          <button
            onClick={e => { e.preventDefault(); setWishlisted(v => !v) }}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 ${wishlisted ? 'bg-primary text-white' : 'bg-white/85 text-foreground/60 opacity-0 group-hover:opacity-100'}`}
          >
            <Heart size={15} className={wishlisted ? 'fill-white' : ''} />
          </button>

          {/* Add to bag CTA — reveals on hover */}
          <div className="absolute bottom-3 inset-x-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={handleCart}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 active:scale-[0.97] ${
                cartState === 'done'
                  ? 'bg-green-500 text-white'
                  : 'bg-white/95 backdrop-blur-sm text-foreground hover:bg-white shadow-md'
              }`}
            >
              <ShoppingBag size={13} />
              {cartState === 'idle' ? 'Add to Bag' : cartState === 'adding' ? 'Adding…' : 'Added ✓'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3.5">
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mb-1">{brand}</p>
          <h3 className="text-sm font-semibold text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">{title}</h3>

          {/* Stars */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={10} className={i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-muted-foreground/20 text-muted-foreground/20'} />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">({reviews.toLocaleString()})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-foreground">${price.toFixed(2)}</span>
              {originalPrice && <span className="text-xs text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>}
            </div>
            {discount && <span className="text-[10px] font-bold text-primary">{discount}% off</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}