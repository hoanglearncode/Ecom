"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, BarChart3, Layers3, Sparkles } from "lucide-react";

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
import { isMockApiEnabled } from "@/lib/api/client";

import { getCategories } from "./api";
import type { Category } from "./types";

function CategoryCard({
  category,
  selected,
  onSelect,
}: {
  category: Category;
  selected: boolean;
  onSelect: (category: Category) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(category)}
      className={`group relative overflow-hidden rounded-2xl border text-left transition-all ${
        selected
          ? "border-primary/60 bg-card shadow-lg shadow-primary/10"
          : "border-border bg-card/70 hover:border-primary/30 hover:shadow-md"
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${category.tone}`} />
      <div className="relative flex h-full min-h-[220px] flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              {category.slug}
            </div>
            <h3 className="mt-2 text-xl font-semibold">{category.name}</h3>
          </div>
          {category.featured ? (
            <Badge
              className="rounded-full bg-background/90 text-foreground shadow-sm"
              variant="secondary"
            >
              Featured
            </Badge>
          ) : null}
        </div>

        <p className="max-w-xs text-sm leading-6 text-muted-foreground">
          {category.description}
        </p>

        <div className="flex items-end justify-between gap-4 pt-4">
          <div>
            <div className="text-2xl font-semibold">
              {category.productCount}
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              products
            </div>
          </div>
          <div className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            {selected ? "Active view" : "Open category"}
          </div>
        </div>
      </div>
    </button>
  );
}

export default function CategoriesFeaturePage() {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeCategoryId && categories.length > 0) {
      setActiveCategoryId(categories[0].id);
    }
  }, [activeCategoryId, categories]);

  const activeCategory =
    categories.find((category) => category.id === activeCategoryId) ??
    categories[0];

  const featuredCount = categories.filter(
    (category) => category.featured,
  ).length;
  const productCount = categories.reduce(
    (sum, category) => sum + category.productCount,
    0,
  );

  return (
    <FeatureShell>
      <div className="space-y-6">
        <FeatureHeader
          title="Categories"
          description="A mock-ready category hub that keeps the richer browse experience alive while the backend is still being wired."
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
                onClick={() => window.location.reload()}
              >
                Refresh view
              </Button>
            </div>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Total categories</CardDescription>
              <CardTitle className="text-3xl">{categories.length}</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="text-sm text-muted-foreground">
                taxonomy nodes
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Featured categories</CardDescription>
              <CardTitle className="text-3xl">{featuredCount}</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="text-sm text-muted-foreground">
                highlighted on home
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Product coverage</CardDescription>
              <CardTitle className="text-3xl">{productCount}</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="text-sm text-muted-foreground">
                items mapped to categories
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
          <Card className="overflow-hidden border-primary/10">
            <CardHeader className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <CardDescription>Spotlight category</CardDescription>
                  <CardTitle className="mt-2 flex items-center gap-2 text-2xl">
                    <Sparkles className="h-5 w-5 text-primary" />
                    {activeCategory?.name ?? "Select a category"}
                  </CardTitle>
                </div>
                <Badge variant="outline" className="rounded-full">
                  {activeCategory?.productCount ?? 0} products
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                {activeCategory?.description ??
                  "Choose a category card to preview the restored mock-driven browse layout."}
              </p>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-background/80 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <BadgeCheck className="h-4 w-4 text-emerald-500" />
                    Mock flow
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Data comes from the FE mock store in development.
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-background/80 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <BarChart3 className="h-4 w-4 text-sky-500" />
                    Browse analytics
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Category counts and featured items stay visible.
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-background/80 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Layers3 className="h-4 w-4 text-violet-500" />
                    Reusable shell
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    The route stays thin while the feature owns the design.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>How to extend</CardDescription>
              <CardTitle>Replace mock data with CMS or API later</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Keep the page layer intact and swap the getCategories source to
                a real backend when ready.
              </p>
              <p>
                The same pattern can be copied to brands, coupons, and dashboard
                pages so mock mode still renders the full experience.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              selected={category.id === activeCategory?.id}
              onSelect={(selectedCategory) =>
                setActiveCategoryId(selectedCategory.id)
              }
            />
          ))}
        </div>
      </div>
    </FeatureShell>
  );
}
