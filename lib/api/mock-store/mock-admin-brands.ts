import type { AdminBrandsData } from "@/features/admin/types";
import { mockProducts } from "./products";

// ─── Extended types ───────────────────────────────────────────────────────────

export type BrandTier = "Hero" | "Featured" | "Core" | "Growth";

export interface BrandItem {
  name: string;
  category: string;
  status: BrandTier;
  productCount: number;
  totalStock: number;
  avgRating: number;
  totalReviews: number;
  revenue: number;
  tags: string[];
  since: string;
  website: string;
  topProduct: string;
}

export interface AdminBrandsDataExtended extends AdminBrandsData {
  brands: BrandItem[];
}

// ─── Derive from mockProducts ─────────────────────────────────────────────────

const BRAND_META: Record<
  string,
  {
    status: BrandTier;
    category: string;
    tags: string[];
    since: string;
    website: string;
  }
> = {
  Apple: {
    status: "Hero",
    category: "Consumer Electronics",
    tags: ["premium", "ecosystem", "flagship"],
    since: "2018",
    website: "apple.com",
  },
  Samsung: {
    status: "Featured",
    category: "Consumer Electronics",
    tags: ["android", "flagship", "200mp"],
    since: "2019",
    website: "samsung.com",
  },
  Sony: {
    status: "Featured",
    category: "Audio & Electronics",
    tags: ["anc", "premium", "pro-audio"],
    since: "2020",
    website: "sony.com",
  },
  Logitech: {
    status: "Core",
    category: "Peripherals",
    tags: ["ergonomic", "productivity", "wireless"],
    since: "2019",
    website: "logitech.com",
  },
  Dell: {
    status: "Core",
    category: "Laptops",
    tags: ["business", "creator", "oled"],
    since: "2020",
    website: "dell.com",
  },
  Nintendo: {
    status: "Core",
    category: "Gaming",
    tags: ["handheld", "family", "exclusive"],
    since: "2021",
    website: "nintendo.com",
  },
  GoPro: {
    status: "Growth",
    category: "Cameras",
    tags: ["action", "waterproof", "4k"],
    since: "2022",
    website: "gopro.com",
  },
  Keychron: {
    status: "Growth",
    category: "Peripherals",
    tags: ["mechanical", "qmk", "wireless"],
    since: "2022",
    website: "keychron.com",
  },
  Anker: {
    status: "Growth",
    category: "Accessories",
    tags: ["charging", "hub", "budget"],
    since: "2023",
    website: "anker.com",
  },
};

function buildBrands(): BrandItem[] {
  // Group products by brand
  const map: Record<string, typeof mockProducts> = {};
  mockProducts.forEach((p) => {
    if (!p.brand) return;
    if (!map[p.brand]) map[p.brand] = [];
    map[p.brand].push(p);
  });

  return Object.entries(map)
    .map(([name, products]) => {
      const meta = BRAND_META[name] ?? {
        status: "Core" as BrandTier,
        category: products[0]?.categoryName ?? "Other",
        tags: [],
        since: "2021",
        website: `${name.toLowerCase()}.com`,
      };

      const totalStock = products.reduce((s, p) => s + (p.stock ?? 0), 0);
      const avgRating =
        products.reduce((s, p) => s + (p.rating ?? 0), 0) / products.length;
      const totalReviews = products.reduce(
        (s, p) => s + (p.reviewCount ?? 0),
        0
      );
      const revenue = products.reduce(
        (s, p) => s + p.price * (p.stock ?? 0),
        0
      );
      const topProduct = [...products].sort(
        (a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0)
      )[0]?.name ?? "";

      return {
        name,
        category: meta.category,
        status: meta.status,
        productCount: products.length,
        totalStock,
        avgRating: Math.round(avgRating * 10) / 10,
        totalReviews,
        revenue,
        tags: meta.tags,
        since: meta.since,
        website: meta.website,
        topProduct,
      };
    })
    .sort((a, b) => {
      const tierOrder: BrandTier[] = ["Hero", "Featured", "Core", "Growth"];
      return tierOrder.indexOf(a.status) - tierOrder.indexOf(b.status);
    });
}

export const mockBrands: BrandItem[] = buildBrands();

// ─── AdminBrandsData (matches existing API shape) ─────────────────────────────

const featuredCount = mockBrands.filter(
  (b) => b.status === "Hero" || b.status === "Featured"
).length;

const totalProductsMapped = mockBrands.reduce(
  (s, b) => s + b.productCount,
  0
);

export const mockAdminBrands: AdminBrandsDataExtended = {
  metrics: [
    { label: "Brands", value: String(mockBrands.length) },
    { label: "Featured", value: String(featuredCount) },
    { label: "Products mapped", value: String(totalProductsMapped) },
  ],
  brands: mockBrands,
};