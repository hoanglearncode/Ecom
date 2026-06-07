import type { MockProduct } from "./types";
import { mockProducts } from "./products";

// ─── Type ─────────────────────────────────────────────────────────────────────

export type InventoryAlert = "Healthy" | "Low" | "Out";

export interface MockInventoryItem {
  sku: string;
  productId: string;
  productName: string;
  brand?: string;
  categoryName?: string;
  stock: number;
  alert: InventoryAlert;
  cost?: number;
  price?: number;
  status?: MockProduct["status"];
}

// ─── Derive alert from stock level ───────────────────────────────────────────

function toAlert(stock: number): InventoryAlert {
  if (stock === 0) return "Out";
  if (stock <= 12) return "Low";
  return "Healthy";
}

// ─── Derive inventory from mockProducts (single source of truth) ──────────────

export const mockInventory: MockInventoryItem[] = mockProducts.map((p) => ({
  sku: p.sku ?? p.id,
  productId: p.id,
  productName: p.name,
  brand: p.brand,
  categoryName: p.categoryName,
  stock: p.stock ?? 0,
  alert: toAlert(p.stock ?? 0),
  cost: p.cost,
  price: p.price,
  status: p.status,
}));