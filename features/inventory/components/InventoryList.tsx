import React from "react";
import { InventoryItem as ItemType } from "../types";
import InventoryItem from "./InventoryItem";

export default function InventoryList({ items }: { items: ItemType[] }) {
  if (!items || items.length === 0)
    return <div className="text-muted-foreground">No inventory items.</div>;

  return (
    <div className="space-y-3">
      {items.map((it) => (
        <InventoryItem key={it.productId} item={it} />
      ))}
    </div>
  );
}
