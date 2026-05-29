import { Headphones, RefreshCw, ShieldCheck, Truck } from "lucide-react";

import type {
  HomePageData,
  NewPageData,
  ProfilePageData,
  SalePageData,
  WishlistPageData,
} from "@/features/storefront/types";

export const mockHomePageData: HomePageData = {
  heroProducts: [
    {
      id: "h1",
      label: "Editor's Pick",
      title: "Premium Wireless Headphones",
      sub: "Studio-quality sound, all-day comfort. The ultimate listening experience.",
      price: "$229",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
      badge: "Bestseller",
      href: "/products/1",
    },
    {
      id: "h2",
      label: "New Arrival",
      title: "Smart Watch Pro Series X",
      sub: "Track everything. Do more. Sleep better. Your health, redefined.",
      price: "$349",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
      badge: "New",
      href: "/products/2",
    },
    {
      id: "h3",
      label: "Limited Edition",
      title: "Mechanical Gaming Keyboard",
      sub: "Tactile precision, RGB mastery. Built for winners.",
      price: "$179",
      image:
        "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&h=600&fit=crop",
      badge: "Limited",
      href: "/products/3",
    },
  ],
  categories: [
    {
      name: "Electronics",
      icon: "⚡",
      count: "1,234",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
    },
    {
      name: "Fashion",
      icon: "✦",
      count: "2,456",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop",
    },
    {
      name: "Home & Living",
      icon: "⌂",
      count: "876",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
    },
    {
      name: "Sports",
      icon: "◎",
      count: "543",
      image:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop",
    },
  ],
  featured: [
    {
      id: "1",
      title: "Premium Wireless Headphones",
      brand: "SoundMax",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      price: 229.99,
      originalPrice: 299.99,
      rating: 4.8,
      reviews: 324,
      badge: "Hot",
    },
    {
      id: "2",
      title: "Smart Watch Pro Series",
      brand: "TechBand",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      price: 349.99,
      originalPrice: 449.99,
      rating: 4.6,
      reviews: 218,
      badge: "New",
    },
    {
      id: "3",
      title: "4K Ultra Webcam",
      brand: "VisionPro",
      image:
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
      price: 199.99,
      rating: 4.7,
      reviews: 156,
    },
    {
      id: "4",
      title: "Gaming Mouse Extreme Edition",
      brand: "ClickMaster",
      image:
        "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop",
      price: 89.99,
      originalPrice: 120.0,
      rating: 4.9,
      reviews: 512,
      badge: "Sale",
    },
  ],
  newArrivals: [
    {
      id: "5",
      title: "Mechanical Keyboard TKL",
      brand: "KeyPro",
      image:
        "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop",
      price: 179.99,
      rating: 4.7,
      reviews: 89,
      badge: "New",
    },
    {
      id: "6",
      title: "Portable SSD 2TB",
      brand: "StorageX",
      image:
        "https://images.unsplash.com/photo-1531492898419-3a9aa15ebbd0?w=400&h=400&fit=crop",
      price: 149.99,
      originalPrice: 199.99,
      rating: 4.8,
      reviews: 203,
    },
    {
      id: "7",
      title: "Noise-Cancelling Earbuds",
      brand: "SoundMax",
      image:
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
      price: 129.99,
      rating: 4.5,
      reviews: 447,
    },
    {
      id: "8",
      title: "LED Ring Light Pro",
      brand: "StudioKit",
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
      price: 59.99,
      originalPrice: 79.99,
      rating: 4.6,
      reviews: 312,
      badge: "Sale",
    },
  ],
  usp: [
    {
      icon: Truck,
      title: "Free Delivery",
      desc: "On all orders over $50, delivered in 2-5 days.",
    },
    {
      icon: RefreshCw,
      title: "Easy Returns",
      desc: "30-day hassle-free return policy, no questions asked.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Checkout",
      desc: "SSL encrypted payments. Your data stays safe.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      desc: "Expert help available around the clock.",
    },
  ],
};

export const mockWishlistPageData: WishlistPageData = {
  metrics: [
    { label: "Saved items", value: "3" },
    { label: "Price drops", value: "1" },
    { label: "Ready to buy", value: "2" },
  ],
  items: [
    { name: "Premium Wireless Headphones", price: "$229", status: "Saved" },
    { name: "Smart Watch Pro Series X", price: "$349", status: "Price drop" },
    {
      name: "Gaming Mouse Extreme Edition",
      price: "$89",
      status: "Back in stock",
    },
  ],
};

export const mockSalePageData: SalePageData = {
  metrics: [
    { label: "Active campaigns", value: "8" },
    { label: "Ends today", value: "2" },
    { label: "Avg discount", value: "34%" },
  ],
  offers: [
    { title: "Up to 60% off", note: "Selected electronics", tag: "Live now" },
    { title: "Bundle & save", note: "Accessory sets", tag: "Ends tonight" },
    {
      title: "Free shipping weekend",
      note: "All orders over $50",
      tag: "Starts Friday",
    },
  ],
  actions: ["Browse sale", "View bundles"],
};

export const mockNewPageData: NewPageData = {
  metrics: [
    { label: "Fresh items", value: "18" },
    { label: "Trending", value: "6" },
    { label: "Launches this week", value: "3" },
  ],
  arrivals: [
    {
      title: "Mechanical Keyboard TKL",
      note: "Creator desk setup",
      badge: "New",
    },
    {
      title: "Portable SSD 2TB",
      note: "Fast storage for creators",
      badge: "Fresh",
    },
    {
      title: "LED Ring Light Pro",
      note: "Content capture gear",
      badge: "Trending",
    },
  ],
};

export const mockProfilePageData: ProfilePageData = {
  sections: [
    {
      title: "Account",
      note: "Personal details and contact info",
      icon: Truck,
    },
    {
      title: "Security",
      note: "Password and sign-in controls",
      icon: ShieldCheck,
    },
    {
      title: "Addresses",
      note: "Shipping and billing addresses",
      icon: RefreshCw,
    },
    {
      title: "Privacy",
      note: "Permissions and safety settings",
      icon: Headphones,
    },
  ],
};
