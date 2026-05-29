"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Zap } from "lucide-react";
import { ProductCardProps } from "@/components/shared/ProductCard";

interface FlashSaleProps {
  saleEndMs: number;
  saleProducts: ProductCardProps[];
}

function useCountdown(targetMs: number) {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const rem = Math.max(0, targetMs - Date.now());
      setTime({
        h: Math.floor(rem / 3600000),
        m: Math.floor((rem % 3600000) / 60000),
        s: Math.floor((rem % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);
  return time;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function FlashSale({ saleEndMs, saleProducts }: FlashSaleProps) {
  const { h, m, s } = useCountdown(saleEndMs);

  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div
        className="relative overflow-hidden bg-foreground rounded-3xl p-6 sm:p-10 lg:p-14"
        data-reveal
        style={{
          opacity: 0,
          transform: "translateY(60px) scale(0.97)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        {/* Background accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-primary/8 rounded-full blur-2xl translate-y-1/2 pointer-events-none" />
        {/* Grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-6">
              <Zap size={10} className="fill-current" />
              Flash Sale — Live Now
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.08] tracking-tight mb-4">
              Up to 60% Off
              <br />
              <span className="text-primary">Selected Items</span>
            </h2>
            <p className="text-white/45 mb-8 text-sm sm:text-base leading-relaxed max-w-sm">
              Limited stock available. Prices this low won't last — grab yours before they're gone.
            </p>
            <Link
              href="/sale"
              className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-primary/90 active:scale-[0.97] transition-all shadow-lg shadow-primary/30"
            >
              Shop the Sale <ArrowRight size={15} />
            </Link>
          </div>

          {/* Right: countdown + products */}
          <div>
            <p className="text-white/35 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Clock size={12} /> Sale ends in
            </p>

            {/* Countdown */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { v: h, l: "Hours" },
                { v: m, l: "Minutes" },
                { v: s, l: "Seconds" },
              ].map(({ v, l }) => (
                <div
                  key={l}
                  className="bg-white/6 border border-white/10 rounded-2xl p-4 sm:p-5 text-center"
                >
                  <p className="text-4xl sm:text-5xl font-black text-white tabular-nums leading-none">
                    {pad(v)}
                  </p>
                  <p className="text-white/35 text-[10px] font-bold mt-2 uppercase tracking-[0.15em]">
                    {l}
                  </p>
                </div>
              ))}
            </div>

            {/* Discounted product teasers */}
            <div className="grid grid-cols-2 gap-3">
              {saleProducts
                .filter((p) => p.originalPrice)
                .slice(0, 2)
                .map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 transition-colors"
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-white/10">
                      <Image src={p.image} alt={p.title} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-xs font-semibold truncate leading-snug">
                        {p.title.split(" ").slice(0, 3).join(" ")}
                      </p>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-primary text-xs font-black">${p.price.toFixed(0)}</span>
                        {p.originalPrice && (
                          <span className="text-white/30 text-[10px] line-through">
                            ${p.originalPrice.toFixed(0)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}