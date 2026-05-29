import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface Category {
  name: string;
  count: string | number;
  image: string;
}

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
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
            Shop by
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Categories
          </h2>
        </div>
        <Link
          href="/categories"
          className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {categories.map((cat, i) => (
          <Link
            key={cat.name}
            href={`/products?category=${cat.name.toLowerCase()}`}
            data-reveal
            style={{
              opacity: 0,
              transform: "translateY(40px) scale(0.97)",
              transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`,
            }}
            className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-secondary border border-border hover:border-transparent hover:shadow-2xl hover:shadow-black/12 transition-all duration-500 ${i === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`}
          >
            <div
              className={`relative w-full ${i === 0 ? "aspect-[4/3] lg:aspect-auto lg:h-full min-h-[200px]" : "aspect-[4/3]"}`}
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

              {/* Hover shimmer */}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/8 transition-colors duration-500" />

              <div className="absolute bottom-0 left-0 p-4 sm:p-5">
                <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wider mb-1">
                  {cat.count} items
                </p>
                <h3 className="text-white font-black text-base sm:text-lg leading-tight">
                  {cat.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-white/70 text-xs mt-2 group-hover:gap-2 transition-all duration-300">
                  Shop now <ArrowRight size={11} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
