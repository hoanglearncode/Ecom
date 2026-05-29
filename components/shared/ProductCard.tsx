"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ShoppingBag } from "lucide-react";
import { useState } from "react";

export interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  badge?: string;
}

export default function ProductCard({
  id,
  title,
  price,
  originalPrice,
  image,
  rating = 4.8,
  reviewCount,
  isNew,
  badge,
}: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  return (
    <Link
      href={`/products/${id}`}
      className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/20 hover:shadow-xl hover:shadow-black/6 transition-all duration-400"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isNew && (
            <span className="bg-foreground text-background text-[9px] font-black uppercase tracking-[0.15em] px-2 py-1 rounded-lg">
              New
            </span>
          )}
          {discount && (
            <span className="bg-primary text-white text-[9px] font-black uppercase tracking-[0.1em] px-2 py-1 rounded-lg">
              -{discount}%
            </span>
          )}
          {badge && !discount && !isNew && (
            <span className="bg-foreground/80 text-background text-[9px] font-black uppercase tracking-[0.1em] px-2 py-1 rounded-lg">
              {badge}
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setWishlisted(!wishlisted);
          }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm border border-border opacity-0 group-hover:opacity-100 hover:bg-background transition-all duration-200"
          aria-label="Add to wishlist"
        >
          <Heart
            size={14}
            className={wishlisted ? "fill-rose-500 text-rose-500" : "text-foreground"}
          />
        </button>

        {/* Quick add CTA */}
        <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={(e) => e.preventDefault()}
            className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-3 text-xs font-bold uppercase tracking-wider hover:bg-foreground/90 transition-colors"
          >
            <ShoppingBag size={13} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4 flex flex-col gap-1.5">
        <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Rating */}
        {reviewCount && (
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className={
                    i < Math.floor(rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-border text-border"
                  }
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">({reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-base font-black text-foreground">${price.toFixed(0)}</span>
          {originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              ${originalPrice.toFixed(0)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}