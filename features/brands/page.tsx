"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, Search, Sparkles } from "lucide-react";

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
import { isMockApiEnabled } from "@/lib/api/client";

import { getBrands } from "./api";
import type { Brand } from "./types";

function BrandCard({
  brand,
  selected,
  onSelect,
}: {
  brand: Brand;
  selected: boolean;
  onSelect: (brand: Brand) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(brand)}
      className={`relative overflow-hidden rounded-2xl border text-left transition-all ${
        selected
          ? "border-primary/60 bg-card shadow-lg shadow-primary/10"
          : "border-border bg-card/70 hover:border-primary/30 hover:shadow-md"
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${brand.accent}`} />
      <div className="relative flex h-full min-h-[220px] flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              {brand.category}
            </div>
            <h3 className="mt-2 text-xl font-semibold">{brand.name}</h3>
          </div>
          {brand.featured ? (
            <Badge
              className="rounded-full bg-background/90 text-foreground shadow-sm"
              variant="secondary"
            >
              Featured
            </Badge>
          ) : null}
        </div>

        <p className="max-w-xs text-sm leading-6 text-muted-foreground">
          {brand.description}
        </p>

        <div className="flex items-end justify-between gap-4 pt-4">
          <div>
            <div className="text-2xl font-semibold">{brand.productCount}</div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              products
            </div>
          </div>
          <div className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            {selected ? "Active brand" : "Open brand"}
          </div>
        </div>
      </div>
    </button>
  );
}

export default function BrandsFeaturePage() {
  const { data: brands = [] } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });
  const [query, setQuery] = useState("");
  const [activeBrandId, setActiveBrandId] = useState<string | null>(null);

  const filteredBrands = useMemo(
    () =>
      brands.filter((brand) => {
        const haystack =
          `${brand.name} ${brand.category} ${brand.description}`.toLowerCase();
        return haystack.includes(query.toLowerCase());
      }),
    [brands, query],
  );

  const activeBrand =
    filteredBrands.find((brand) => brand.id === activeBrandId) ??
    filteredBrands[0];

  const featuredCount = brands.filter((brand) => brand.featured).length;
  const totalProducts = brands.reduce(
    (sum, brand) => sum + brand.productCount,
    0,
  );

  return (
    <FeatureShell>
      <div className="space-y-6">
        <FeatureHeader
          title="Brands"
          description="A mock-backed brand explorer with search, spotlight, and product coverage so the page still feels designed in mock mode."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={isMockApiEnabled() ? "default" : "outline"}
                className="rounded-full px-3 py-1"
              >
                {isMockApiEnabled() ? "Mock data enabled" : "Live API enabled"}
              </Badge>
              <Button
                type="button"
                variant="outline"
                onClick={() => setQuery("")}
              >
                Reset
              </Button>
            </div>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Brands</CardDescription>
              <CardTitle className="text-3xl">{brands.length}</CardTitle>
            </CardHeader>
            <CardContent className="pb-6 text-sm text-muted-foreground">
              curated manufacturer roster
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Featured</CardDescription>
              <CardTitle className="text-3xl">{featuredCount}</CardTitle>
            </CardHeader>
            <CardContent className="pb-6 text-sm text-muted-foreground">
              hero brands on the storefront
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Products covered</CardDescription>
              <CardTitle className="text-3xl">{totalProducts}</CardTitle>
            </CardHeader>
            <CardContent className="pb-6 text-sm text-muted-foreground">
              total catalog mapped to brands
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
          <Card className="overflow-hidden border-primary/10">
            <CardHeader>
              <CardDescription>Search brands</CardDescription>
              <CardTitle className="mt-2 flex items-center gap-2 text-2xl">
                <Search className="h-5 w-5 text-primary" />
                Brand directory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-5">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search brands, categories, descriptions..."
                  className="pl-9"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {filteredBrands.map((brand) => (
                  <BrandCard
                    key={brand.id}
                    brand={brand}
                    selected={brand.id === activeBrand?.id}
                    onSelect={(selectedBrand) =>
                      setActiveBrandId(selectedBrand.id)
                    }
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Spotlight brand</CardDescription>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5 text-primary" />
                {activeBrand?.name ?? "Select a brand"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                {activeBrand?.description ??
                  "Choose a brand card to preview the mock-driven layout."}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-background/80 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <BadgeCheck className="h-4 w-4 text-emerald-500" />
                    Mock path
                  </div>
                  <div className="mt-2 text-xs">
                    Data comes from the FE mock store.
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-background/80 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Sparkles className="h-4 w-4 text-violet-500" />
                    Catalog view
                  </div>
                  <div className="mt-2 text-xs">
                    Counts and accents stay visible.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </FeatureShell>
  );
}
