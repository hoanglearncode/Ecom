"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export interface HeroProduct {
  id: string;
  label: string;
  title: string;
  sub: string;
  price: string;
  badge: string;
  href: string;
  image: string;
}

interface HeroBannerProps {
  heroProducts: HeroProduct[];
}

function ParallaxWrapper({ children }: { children: React.ReactNode }) {
  const bgRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const onScroll = () => {
      if (!bgRef.current) return;
      bgRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative overflow-hidden">
      <div ref={bgRef} className="absolute inset-0 scale-110 pointer-events-none" style={{ willChange: "transform" }} />
      {children}
    </div>
  );
}

export default function HeroBanner({ heroProducts }: HeroBannerProps) {
  const [heroIdx, setHeroIdx] = useState(0);
  const hero = heroProducts[heroIdx] ?? heroProducts[0];

  useEffect(() => {
    if (heroProducts.length === 0) return;
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % heroProducts.length), 5000);
    return () => clearInterval(t);
  }, [heroProducts.length]);

  useEffect(() => {
    if (heroIdx >= heroProducts.length) setHeroIdx(0);
  }, [heroIdx, heroProducts.length]);

  if (!hero) {
    return (
      <ParallaxWrapper>
        <section className="bg-secondary min-h-[480px] sm:min-h-[580px] lg:min-h-[640px]">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[400px]">
              <div className="order-2 lg:order-1 space-y-4">
                <div className="h-4 w-32 rounded-full bg-muted animate-pulse" />
                <div className="h-14 max-w-md rounded-xl bg-muted animate-pulse" />
                <div className="h-20 max-w-md rounded-xl bg-muted animate-pulse" />
                <div className="h-12 w-44 rounded-xl bg-muted animate-pulse" />
              </div>
              <div className="order-1 lg:order-2">
                <div className="aspect-square rounded-3xl bg-muted animate-pulse" />
              </div>
            </div>
          </div>
        </section>
      </ParallaxWrapper>
    );
  }

  return (
    <ParallaxWrapper>
      <section className="relative overflow-hidden bg-secondary min-h-[480px] sm:min-h-[580px] lg:min-h-[640px]">
        {/* Subtle background accent */}
        <div className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-primary/4 blur-2xl" />

        <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20 h-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[400px] lg:min-h-[500px]">
            {/* Text */}
            <div className="order-2 lg:order-1 z-10">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.2em] text-primary mb-5">
                <span className="w-5 h-px bg-primary" />
                {hero.label}
              </span>
              <h1
                key={hero.id + "-title"}
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-[1.04] tracking-tight mb-5 animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                {hero.title}
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                {hero.sub}
              </p>
              <div className="flex flex-wrap items-center gap-3 mb-10">
                <Link
                  href={hero.href}
                  className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-foreground/85 active:scale-[0.97] transition-all shadow-lg shadow-black/10"
                >
                  Shop Now — {hero.price}
                  <ArrowRight size={15} />
                </Link>
                <span className="text-xs text-muted-foreground bg-background border border-border px-3 py-2 rounded-lg font-medium">
                  {hero.badge}
                </span>
              </div>

              {/* Dot indicators */}
              <div className="flex gap-2">
                {heroProducts.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroIdx(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === heroIdx ? "w-8 bg-primary" : "w-3 bg-border hover:bg-muted-foreground"}`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="order-1 lg:order-2 relative">
              <div className="relative mx-auto w-full max-w-sm lg:max-w-none aspect-square rounded-3xl overflow-hidden bg-card border border-border shadow-2xl shadow-black/8">
                <Image
                  key={hero.id}
                  src={hero.image}
                  alt={hero.title}
                  fill
                  className="object-cover animate-in fade-in zoom-in-95 duration-500"
                  sizes="(max-width: 1024px) 80vw, 45vw"
                  priority
                />
              </div>

              {/* Floating review badge */}
              <div className="absolute -bottom-4 -left-2 sm:bottom-6 sm:left-6 bg-background border border-border rounded-2xl px-4 py-3 shadow-xl shadow-black/8 flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">4.9/5.0</p>
                  <p className="text-[10px] text-muted-foreground">12K+ reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ParallaxWrapper>
  );
}