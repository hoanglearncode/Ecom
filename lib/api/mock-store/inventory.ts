import { mockProducts } from "./products";
import type { MockInventoryItem } from "./types";

const warehouses = ["US-EAST-01", "US-WEST-02", "EU-CENTRAL-01", "SG-SOUTH-01"];

function toAlert(stock: number, reorderPoint: number): MockInventoryItem["alert"] {
  if (stock <= 0) return "Out";
  if (stock <= Math.ceil(reorderPoint * 0.55)) return "Low";
  if (stock <= reorderPoint) return "Watch";
  return "Healthy";
}

export const mockInventory: MockInventoryItem[] = mockProducts.map(
  (product, index) => {
    const reorderPoint = 10 + (index % 5) * 4;
    const reserved = index % 7 === 0 ? 6 : index % 4;
    const incoming = product.stock && product.stock < reorderPoint ? 24 + (index % 3) * 12 : index % 6 === 0 ? 12 : 0;

    return {
      productId: product.id,
      sku: product.sku,
      stock: product.stock ?? 0,
      productName: product.name,
      category: product.categoryName,
      warehouse: warehouses[index % warehouses.length],
      reorderPoint,
      incoming,
      reserved,
      alert: toAlert(product.stock ?? 0, reorderPoint),
    };
  },
);
