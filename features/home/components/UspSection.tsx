import { Truck, RefreshCw, ShieldCheck, Headphones, type LucideIcon } from "lucide-react";

export interface UspItem {
  title: string;
  desc: string;
}

interface UspSectionProps {
  items: UspItem[];
}

const USP_ICON_BY_TITLE: Record<string, LucideIcon> = {
  "Free Delivery": Truck,
  "Easy Returns": RefreshCw,
  "Secure Checkout": ShieldCheck,
  "24/7 Support": Headphones,
};

export default function UspSection({ items }: UspSectionProps) {
  return (
    <section className="border-t border-border bg-secondary/30 py-12 sm:py-14">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {items.map(({ title, desc }, i) => {
            const Icon = USP_ICON_BY_TITLE[title] ?? ShieldCheck;
            return (
              <div
                key={title}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
                data-reveal
                style={{
                  opacity: 0,
                  transform: "translateY(30px)",
                  transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`,
                }}
              >
                <div className="p-3 bg-primary/10 rounded-2xl shrink-0">
                  <Icon size={22} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm mb-0.5">{title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}