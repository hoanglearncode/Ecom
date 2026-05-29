"use client";
import React from "react";
import FeatureShell from "@/components/feature-shell";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "./api";
import ProductGrid from "./components/ProductGrid";

export default function ProductsFeaturePage() {
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  return (
    <FeatureShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">
            Browse and manage products.
          </p>
        </div>

        <ProductGrid products={products} />
      </div>
    </FeatureShell>
  );
}
