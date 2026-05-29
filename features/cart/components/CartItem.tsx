import React from "react";
import { CartItem as CI } from "../types";

export default function CartItem({ item }: { item: CI }) {
  return (
    <div className="p-3 border rounded-md flex items-center justify-between">
      <div>
        <div className="font-medium">{item.productId}</div>
        <div className="text-sm text-muted-foreground">
          Qty: {item.quantity}
        </div>
      </div>
      <div className="text-sm">—</div>
    </div>
  );
}
