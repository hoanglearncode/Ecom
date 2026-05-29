import React from "react";
import { CartItem as CI } from "../types";
import CartItem from "./CartItem";

export default function CartList({ items }: { items: CI[] }) {
  if (!items || items.length === 0)
    return <div className="text-muted-foreground">Your cart is empty.</div>;

  return (
    <div className="space-y-3">
      {items.map((it, idx) => (
        <CartItem key={`${it.productId}-${idx}`} item={it} />
      ))}
    </div>
  );
}
