const ITEMS = [
  "✦ FREE SHIPPING OVER $50",
  "✦ 30-DAY RETURNS",
  "✦ SECURE CHECKOUT",
  "✦ NEW ARRIVALS WEEKLY",
  "✦ EXCLUSIVE MEMBERS DEALS",
];

export default function MarqueeBanner() {
  return (
    <div className="bg-primary overflow-hidden py-2.5">
      <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-8 text-white text-[11px] font-bold tracking-[0.15em] px-8"
          >
            {ITEMS.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}