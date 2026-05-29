import React from "react";
import { Product } from "../types";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products || products.length === 0)
    return (
      <div className="text-muted-foreground">
        No products — feature scaffold.
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
