import React from "react";
import { Product } from "../types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border rounded-md overflow-hidden shadow-sm">
      {product.thumbnail ? (
        <img
          src={product.thumbnail}
          alt={product.name}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-muted flex items-center justify-center">
          No image
        </div>
      )}
      <div className="p-3">
        <div className="font-medium">{product.name}</div>
        <div className="text-sm text-muted-foreground">{product.sku ?? ""}</div>
        <div className="mt-2 font-semibold">
          {product.currency ?? "$"}
          {product.price}
        </div>
      </div>
    </div>
  );
}
