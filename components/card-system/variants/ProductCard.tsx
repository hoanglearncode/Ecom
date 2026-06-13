"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, Star, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "../base/Card"
import { CardMedia } from "../base/CardMedia"
import { CardContent } from "../base/CardContent"
import { CardBadge } from "../base/CardBadge"
import { Button } from "@/components/ui/button"

export interface ProductCardProps {
  id: string
  title: string
  brand?: string
  image: string
  price: number
  originalPrice?: number
  rating?: number
  reviewCount?: number
  badge?: string
  isNew?: boolean
  size?: "sm" | "md" | "lg"
  showBadge?: boolean
  showRating?: boolean
  showQuickActions?: boolean
  showBrand?: boolean
  onWishlistToggle?: (productId: string, wishlisted: boolean) => void
  onAddToCart?: (productId: string) => void
  onCardClick?: (productId: string) => void
  href?: string
  draggable?: boolean
  className?: string
}

const sizeStyles = {
  sm: { imageSize: "aspect-square", infoPadding: "p-2.5", titleSize: "text-xs", priceSize: "text-sm" },
  md: { imageSize: "aspect-square", infoPadding: "p-3.5", titleSize: "text-sm", priceSize: "text-base" },
  lg: { imageSize: "aspect-[3/4]", infoPadding: "p-4", titleSize: "text-base", priceSize: "text-lg" },
}

export const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      id,
      title,
      brand = "ShopHub",
      image,
      price,
      originalPrice,
      rating = 4.8,
      reviewCount,
      badge,
      isNew,
      size = "md",
      showBadge = true,
      showRating = true,
      showQuickActions = true,
      showBrand = true,
      onWishlistToggle,
      onAddToCart,
      onCardClick,
      href = `/products/${id}`,
      draggable = false,
      className,
      ...props
    },
    ref
  ) => {
    const [wishlisted, setWishlisted] = React.useState(false)
    const [cartState, setCartState] = React.useState<"idle" | "adding" | "done">("idle")
    const [isHovered, setIsHovered] = React.useState(false)

    const discount = originalPrice
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null

    const handleWishlistToggle = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const newState = !wishlisted
      setWishlisted(newState)
      onWishlistToggle?.(id, newState)
    }

    const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (cartState !== "idle") return
      setCartState("adding")
      onAddToCart?.(id)
      setTimeout(() => {
        setCartState("done")
        setTimeout(() => setCartState("idle"), 1200)
      }, 600)
    }

    const handleClick = (e: React.MouseEvent) => {
      if (!onCardClick) return
      e.preventDefault()
      onCardClick(id)
    }

    const sizeStyle = sizeStyles[size]

    const cardContent = (
      <Card
        ref={ref}
        variant="outlined"
        interactive={onCardClick ? "clickable" : "hover"}
        size={size === "lg" ? "lg" : "md"}
        className={cn(
          "group overflow-hidden transition-all duration-300",
          size === "lg" && "rounded-3xl",
          isHovered && "-translate-y-0.5 shadow-lg",
          className
        )}
        {...props}
      >
        {/* Media */}
        <div
          className={cn("relative overflow-hidden bg-secondary", sizeStyle.imageSize)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 25vw"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          {showBadge && (
            <>
              {isNew && (
                <CardBadge label="New" variant="default" position="top-left" />
              )}
              {discount && (
                <CardBadge label={`-${discount}%`} variant="error" position="top-left" />
              )}
              {!isNew && !discount && badge && (
                <CardBadge label={badge} position="top-left" />
              )}
            </>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleWishlistToggle}
            className={cn(
              "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95",
              wishlisted
                ? "bg-primary text-white"
                : "bg-white/85 text-foreground/60 opacity-0 group-hover:opacity-100"
            )}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={15} className={wishlisted ? "fill-white" : ""} />
          </button>

          {/* Quick add CTA */}
          {showQuickActions && (
            <div
              className={cn(
                "absolute bottom-3 inset-x-3 transition-all duration-300",
                size === "sm" ? "translate-y-1 opacity-0" : "translate-y-2 opacity-0",
                "group-hover:translate-y-0 group-hover:opacity-100"
              )}
            >
              <button
                onClick={handleAddToCart}
                disabled={cartState !== "idle"}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 active:scale-[0.97]",
                  cartState === "done"
                    ? "bg-green-500 text-white"
                    : "bg-white/95 backdrop-blur-sm text-foreground hover:bg-white shadow-md"
                )}
              >
                <ShoppingBag size={13} />
                {cartState === "idle"
                  ? "Add to Bag"
                  : cartState === "adding"
                  ? "Adding…"
                  : "Added ✓"}
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent spacing="sm" className={sizeStyle.infoPadding}>
          {showBrand && (
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mb-1">
              {brand}
            </p>
          )}
          <h3
            className={cn(
              "font-semibold text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200",
              sizeStyle.titleSize
            )}
          >
            {title}
          </h3>

          {/* Rating */}
          {showRating && reviewCount && (
            <div className="flex items-center gap-1 mb-3">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={size === "sm" ? 9 : 10}
                    className={
                      i < Math.round(rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted-foreground/20 text-muted-foreground/20"
                    }
                  />
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground">
                ({reviewCount.toLocaleString()})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className={cn("font-bold text-foreground", sizeStyle.priceSize)}>
                ${price.toFixed(2)}
              </span>
              {originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {discount && (
              <span className="text-[10px] font-bold text-primary">{discount}% off</span>
            )}
          </div>
        </CardContent>
      </Card>
    )

    if (href && !onCardClick) {
      return (
        <Link href={href} className="block outline-none">
          {cardContent}
        </Link>
      )
    }

    return cardContent
  }
)

ProductCard.displayName = "ProductCard"

// Draggable variant wrapper
export interface DraggableProductCardProps extends ProductCardProps {
  onDragEnd?: (data: { id: string; overId?: string }) => void
}

export const DraggableProductCard = React.forwardRef<HTMLDivElement, DraggableProductCardProps>(
  (props, ref) => {
    const { onDragEnd, ...cardProps } = props

    return (
      <div ref={ref} data-draggable-card-id={cardProps.id}>
        <ProductCard {...cardProps} />
      </div>
    )
  }
)

DraggableProductCard.displayName = "DraggableProductCard"
