import type { ProductCardProps } from "@/components/product-card";
import type { LucideIcon } from "lucide-react";

export type HomeHeroProduct = {
  id: string;
  label: string;
  title: string;
  sub: string;
  price: string;
  image: string;
  badge: string;
  href: string;
};

export type HomeCategory = {
  name: string;
  icon: string;
  count: string;
  image: string;
};

export type HomePageData = {
  heroProducts: HomeHeroProduct[];
  categories: HomeCategory[];
  featured: ProductCardProps[];
  newArrivals: ProductCardProps[];
  usp: Array<{ icon: LucideIcon; title: string; desc: string }>;
};

export type WishlistItem = {
  name: string;
  price: string;
  status: string;
};

export type WishlistPageData = {
  metrics: Array<{ label: string; value: string }>;
  items: WishlistItem[];
};

export type SaleOffer = {
  title: string;
  note: string;
  tag: string;
};

export type SalePageData = {
  metrics: Array<{ label: string; value: string }>;
  offers: SaleOffer[];
  actions: string[];
};

export type NewArrivalItem = {
  title: string;
  note: string;
  badge: string;
};

export type NewPageData = {
  metrics: Array<{ label: string; value: string }>;
  arrivals: NewArrivalItem[];
};

export type ProfileSection = {
  title: string;
  note: string;
  icon: LucideIcon;
};

export type ProfilePageData = {
  sections: ProfileSection[];
};
