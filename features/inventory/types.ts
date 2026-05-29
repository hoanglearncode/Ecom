export type InventoryItem = {
  productId: string;
  sku?: string;
  stock: number;
  productName?: string;
  category?: string;
  warehouse?: string;
  reorderPoint?: number;
  incoming?: number;
  reserved?: number;
  alert?: "Healthy" | "Watch" | "Low" | "Out";
};
