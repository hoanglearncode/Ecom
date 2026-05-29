"use client";

import React from "react";
import { Heart, ShoppingBag, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

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

import { getWishlistPageData } from "@/features/storefront/api";

export default function WishlistFeaturePage() {
  const { data } = useQuery({
    queryKey: ["wishlist-page"],
    queryFn: getWishlistPageData,
  });

  return (
    <FeatureShell>
      <div className="space-y-6">
        <FeatureHeader
          title="Wishlist"
          description="A saved-items hub with cards, pricing cues, and action buttons instead of a placeholder block."
          actions={
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              3 saved
            </Badge>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Saved items</CardDescription>
              <CardTitle className="text-3xl">
                {data?.metrics[0]?.value ?? "0"}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Price drops</CardDescription>
              <CardTitle className="text-3xl">
                {data?.metrics[1]?.value ?? "0"}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Ready to buy</CardDescription>
              <CardTitle className="text-3xl">
                {data?.metrics[2]?.value ?? "0"}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardDescription>Saved collection</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Heart className="h-5 w-5 text-primary" />
              Wishlist items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.items?.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-border bg-background/80 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {item.price}
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-full">
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Actions</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-primary" />
              Move to cart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline">
              <ShoppingBag className="h-4 w-4" />
              Add selected to bag
            </Button>
          </CardContent>
        </Card>
      </div>
    </FeatureShell>
  );
}
