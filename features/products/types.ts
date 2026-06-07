export type Product = {
  id: string;
  name: string;
  sku?: string;
  price: number;
  currency?: string;
  thumbnail?: string;
  description?: string;
  brand?: string;
  categoryId?: string;
  categorySlug?: string;
  categoryName?: string;
  compareAtPrice?: number;
  cost?: number;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  status?: "active" | "draft" | "archived";
  tags?: string[];
  color?: string;
  material?: string;
  warranty?: string;
  releaseDate?: string;
  weight?: string;
  dimensions?: string;
};

// ─── Dashboard row type (built from Product in the page) ─────────────────────

export type DashboardTableRow = {
  id: number;
  header: string;
  type: string;
  status: "Active" | "Low stock" | "Draft" | "Archived";
  target: string;
  limit: string;
  reviewer: string;
};

// ─── Admin dashboard types ────────────────────────────────────────────────────

export type AdminMetric = {
  label: string;
  value: string;
  change?: string;
};

export type AdminDashboardData = {
  metrics: AdminMetric[];
  activity: Array<{ title: string; detail: string; time: string }>;
  actions: string[];
};