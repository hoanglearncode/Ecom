import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const STATS = [
  { value: "50K+", label: "Products" },
  { value: "2M+", label: "Customers" },
  { value: "4.9★", label: "Rating" },
];

export default function BrandStory() {
  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div
        className="grid lg:grid-cols-2 gap-0 items-stretch bg-card border border-border rounded-3xl overflow-hidden shadow-lg shadow-black/4"
        data-reveal
        style={{
          opacity: 0,
          transform: "translateY(50px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] lg:aspect-auto min-h-[280px]">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
            alt="Our story"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {/* Overlay gradient on right edge for blending */}
          <div className="hidden lg:block absolute inset-y-0 right-0 w-12 bg-gradient-to-r from-transparent to-card" />
        </div>

        {/* Copy */}
        <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-primary mb-4">
            Our Promise
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-snug mb-5">
            Quality you can feel.
            <br />
            Prices you'll love.
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8">
            We believe great products shouldn't cost a fortune. That's why we work directly with manufacturers to bring you premium items at prices that make sense.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-border">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-black text-primary">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <Link
            href="/about"
            className="inline-flex items-center gap-2 font-bold text-sm text-foreground border border-border px-5 py-2.5 rounded-xl hover:bg-secondary hover:border-foreground/20 active:scale-[0.97] transition-all w-fit"
          >
            Learn more <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}