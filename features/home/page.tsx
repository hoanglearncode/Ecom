"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Footer from "@/components/footer";
import Header from "@/components/header";
import type { ProductCardProps as SharedProductCardProps } from "@/components/shared/ProductCard";
import BrandStory from "@/features/home/components/BrandStory";
import CategoryGrid from "@/features/home/components/CategoryGrid";
import FlashSale from "@/features/home/components/FlashSale";
import HeroBanner from "@/features/home/components/HeroBanner";
import MarqueeBanner from "@/features/home/components/MarqueeBanner";
import Newsletter from "@/features/home/components/Newsletter";
import ProductGrid from "@/features/home/components/ProductGrid";
import UspSection from "@/features/home/components/UspSection";
import { getHomePageData } from "@/features/storefront/api";
import type { HomePageData } from "@/features/storefront/types";

function useScrollReveal(refreshKey?: unknown) {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const target = entry.target as HTMLElement;
          target.style.opacity = "1";
          target.style.transform = "none";
          io.unobserve(target);
        });
      },
      { threshold: 0.12 },
    );

    els.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, [refreshKey]);
}

function toSharedProducts(
  products: HomePageData["featured"],
): SharedProductCardProps[] {
  return products.map(({ reviews, ...product }) => ({
    ...product,
    reviewCount: reviews,
    isNew: product.badge === "New",
  }));
}

export default function Home() {
  const { data: homeData } = useQuery({
    queryKey: ["storefront-home"],
    queryFn: getHomePageData,
  });
  const [saleEndMs] = useState(() => Date.now() + 6 * 3600 * 1000);

  useScrollReveal(homeData);

  const categories = useMemo(
    () =>
      (homeData?.categories ?? []).map(({ name, count, image }) => ({
        name,
        count,
        image,
      })),
    [homeData?.categories],
  );

  const featured = useMemo(
    () => toSharedProducts(homeData?.featured ?? []),
    [homeData?.featured],
  );

  const newArrivals = useMemo(
    () => toSharedProducts(homeData?.newArrivals ?? []),
    [homeData?.newArrivals],
  );

  const saleProducts = useMemo(
    () => [...featured, ...newArrivals].filter((product) => product.originalPrice),
    [featured, newArrivals],
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header cartCount={3} wishlistCount={2} />

      <main className="flex-1 pb-16 sm:pb-0">
        <HeroBanner heroProducts={homeData?.heroProducts ?? []} />
        <MarqueeBanner />
        <CategoryGrid categories={categories} />
        <ProductGrid
          label="Hand-picked"
          heading="Featured Products"
          viewAllHref="/products"
          products={featured}
          bgMuted
        />
        <FlashSale saleEndMs={saleEndMs} saleProducts={saleProducts} />
        <ProductGrid
          label="Just dropped"
          heading="New Arrivals"
          viewAllHref="/new"
          products={newArrivals}
        />
        <UspSection items={homeData?.usp ?? []} />
        <BrandStory />
        <Newsletter />
      </main>

      <Footer />

      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  );
}
