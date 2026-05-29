import React from "react";
import { InventoryItem as ItemType } from "../types";

export default function InventoryItem({ item }: { item: ItemType }) {
  return (
    <div className="p-3 border rounded-md shadow-sm flex items-center justify-between">
      <div>
        <div className="font-medium">{item.productId}</div>
        <div className="text-sm text-muted-foreground">
          SKU: {item.sku ?? "—"}
        </div>
      </div>
      <div className="font-mono">{item.stock}</div>
    </div>
  );
}
