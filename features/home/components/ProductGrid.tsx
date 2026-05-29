import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard, { ProductCardProps } from "@/components/shared/ProductCard";

interface ProductGridProps {
  label: string;
  heading: string;
  viewAllHref: string;
  products: ProductCardProps[];
  bgMuted?: boolean;
}

export default function ProductGrid({
  label,
  heading,
  viewAllHref,
  products,
  bgMuted = false,
}: ProductGridProps) {
  return (
    <section className={bgMuted ? "bg-secondary/40 border-y border-border py-12 sm:py-20" : "py-12 sm:py-20"}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div
            data-reveal
            style={{
              opacity: 0,
              transform: "translateY(30px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <p className="text-xs font-black uppercase tracking-[0.25em] text-primary mb-1.5">
              {label}
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {heading}
            </h2>
          </div>
          <Link
            href={viewAllHref}
            className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {products.map((p, i) => (
            <div
              key={p.id}
              data-reveal
              style={{
                opacity: 0,
                transform: "translateY(50px)",
                transition: `opacity 0.7s ease ${i * 0.1}s, transform 0.7s ease ${i * 0.1}s`,
              }}
            >
              <ProductCard {...p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}