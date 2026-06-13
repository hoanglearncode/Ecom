import { Headphones, RefreshCw, ShieldCheck, Truck } from "lucide-react";

import { dbCategories } from "../../db/categories";
import { mockProducts } from "./products";
import type { ProductCardProps } from "@/components/product-card";
import type {
  HomePageData,
  NewPageData,
  ProfilePageData,
  SalePageData,
  WishlistPageData,
} from "@/features/storefront/types";

function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`;
}

function productDescription(
  productName: string,
  brand?: string,
  categoryName?: string,
) {
  const parts = [brand, categoryName].filter(Boolean).join(" · ");
  return parts
    ? `${productName} from ${parts}, tuned for the current catalog and ready for storefront use.`
    : `${productName} ready for storefront use.`;
}

function mapProductToCard(
  product: (typeof mockProducts)[number],
  badge?: string,
): ProductCardProps {
  return {
    id: product.id,
    title: product.name,
    brand: product.brand ?? product.categoryName ?? "ShopHub",
    image: product.thumbnail ?? "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80",
    price: product.price,
    originalPrice: product.compareAtPrice,
    rating: product.rating ?? 4.5,
    reviews: product.reviewCount ?? 0,
    badge,
  };
}

const activeProducts = mockProducts.filter(
  (product) => product.status !== "archived",
);

const byRating = [...activeProducts].sort((left, right) => {
  const ratingDelta = (right.rating ?? 0) - (left.rating ?? 0);
  if (ratingDelta !== 0) return ratingDelta;

  return (right.reviewCount ?? 0) - (left.reviewCount ?? 0);
});

const byReleaseDate = [...activeProducts].sort((left, right) => {
  const rightTime = right.releaseDate
    ? new Date(right.releaseDate).getTime()
    : 0;
  const leftTime = left.releaseDate ? new Date(left.releaseDate).getTime() : 0;
  return rightTime - leftTime;
});

const saleProducts = [...activeProducts]
  .filter((product) => product.compareAtPrice)
  .sort((left, right) => {
    const leftDiscount = left.compareAtPrice
      ? ((left.compareAtPrice - left.price) / left.compareAtPrice) * 100
      : 0;
    const rightDiscount = right.compareAtPrice
      ? ((right.compareAtPrice - right.price) / right.compareAtPrice) * 100
      : 0;
    return rightDiscount - leftDiscount;
  });

const heroProducts = byRating.slice(0, 3).map((product, index) => ({
  id: `hero-${product.id}`,
  label:
    index === 0
      ? "Editor's Pick"
      : index === 1
        ? "New Arrival"
        : "Limited Edition",
  title: product.name,
  sub: productDescription(product.name, product.brand, product.categoryName),
  price: formatCurrency(product.price),
  image: product.thumbnail ?? "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80",
  badge:
    index === 0
      ? "Bestseller"
      : product.compareAtPrice
        ? "Sale"
        : product.status === "draft"
          ? "Preview"
          : "New",
  href: `/products/${product.id}`,
}));

const featuredProducts = byRating
  .filter((product) => product.compareAtPrice)
  .slice(0, 4)
  .map((product) =>
    mapProductToCard(
      product,
      product.rating && product.rating >= 4.8 ? "Hot" : "Sale",
    ),
  );

const newArrivalProducts = byReleaseDate
  .slice(0, 4)
  .map((product) => mapProductToCard(product, "New"));

const homeCategories = dbCategories
  .filter((c) => c.level === 0)
  .slice(0, 4)
  .map((category, index) => ({
    name: category.name,
    icon: ["⚡", "◎", "⌂", "✦"][index] ?? "◌",
    count: String(category.productCount),
    image: category.image ?? "",
  }));

export const mockHomePageData: HomePageData = {
  heroProducts,
  categories: homeCategories,
  featured: featuredProducts,
  newArrivals: newArrivalProducts,
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

const wishlistProducts = [
  byRating[0],
  saleProducts[0] ?? byReleaseDate[0],
  byReleaseDate[1] ?? byRating[1],
].filter(Boolean) as (typeof mockProducts)[number][];

export const mockWishlistPageData: WishlistPageData = {
  metrics: [
    { label: "Saved items", value: String(wishlistProducts.length) },
    { label: "Price drops", value: String(saleProducts.length) },
    { label: "Ready to buy", value: String(featuredProducts.length) },
  ],
  items: wishlistProducts.map((product, index) => ({
    name: product.name,
    price: formatCurrency(product.price),
    status:
      index === 0
        ? "Saved"
        : product.compareAtPrice
          ? "Price drop"
          : "Back in stock",
  })),
};

const saleOffers = saleProducts.slice(0, 3).map((product, index) => {
  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100,
      )
    : 0;

  return {
    title: `Save up to ${discount}% on ${product.name}`,
    note: `${product.brand ?? product.categoryName} in ${product.categoryName?.toLowerCase() ?? "the catalog"}`,
    tag: index === 0 ? "Live now" : index === 1 ? "Ends tonight" : "Featured",
  };
});

export const mockSalePageData: SalePageData = {
  metrics: [
    { label: "Active campaigns", value: String(saleOffers.length + 5) },
    {
      label: "Ends today",
      value: String(
        Math.max(
          1,
          saleProducts.filter((product) => product.status === "active").length %
            4,
        ),
      ),
    },
    {
      label: "Avg discount",
      value:
        saleProducts.length > 0
          ? `${Math.round(
              saleProducts.reduce((sum, product) => {
                if (!product.compareAtPrice) return sum;
                return (
                  sum +
                  ((product.compareAtPrice - product.price) /
                    product.compareAtPrice) *
                    100
                );
              }, 0) / saleProducts.length,
            )}%`
          : "0%",
    },
  ],
  offers: saleOffers,
  actions: ["Browse sale", "View bundles"],
};

export const mockNewPageData: NewPageData = {
  metrics: [
    { label: "Fresh items", value: String(byReleaseDate.length) },
    { label: "Trending", value: String(byRating.slice(0, 6).length) },
    {
      label: "Launches this week",
      value: String(byReleaseDate.slice(0, 3).length),
    },
  ],
  arrivals: byReleaseDate.slice(0, 3).map((product) => ({
    title: product.name,
    note: `${product.brand ?? product.categoryName} release`,
    badge: product.compareAtPrice ? "Trending" : "New",
  })),
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
