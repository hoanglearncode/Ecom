"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal } from "lucide-react";

import FeatureShell from "@/components/feature-shell";
import { FeatureHeader } from "@/components/feature-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { getProducts } from "@/features/products/api";
import type { Product } from "@/features/products/types";

export default function AdminProductsFeaturePage() {
  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: getProducts,
  });
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const haystack =
          `${product.name} ${product.sku ?? ""} ${product.description ?? ""}`.toLowerCase();
        return haystack.includes(query.toLowerCase());
      }),
    [products, query],
  );

  return (
    <FeatureShell>
      <div className="space-y-6">
        <FeatureHeader
          title="Products"
          description="A management-oriented product page with search, metrics, and catalog rows instead of a text-only scaffold."
          actions={
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              {products.length} items
            </Badge>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Products</CardDescription>
              <CardTitle className="text-3xl">{products.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Filtered</CardDescription>
              <CardTitle className="text-3xl">
                {filteredProducts.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Mock feed</CardDescription>
              <CardTitle className="text-3xl">On</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardDescription>Catalog controls</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              Search and filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-5 max-w-xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, SKU, or description..."
                className="pl-9"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                          {product.sku ?? product.id}
                        </div>
                        <h3 className="mt-2 text-lg font-semibold">
                          {product.name}
                        </h3>
                      </div>
                      <Badge variant="outline" className="rounded-full">
                        ${product.price.toFixed(2)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description ?? "Catalog item"}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {product.currency ?? "USD"}
                      </span>
                      <Button size="sm" variant="outline">
                        Edit product
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </FeatureShell>
  );
}
