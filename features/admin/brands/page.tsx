"use client";

import React from "react";
import { BadgeCheck, Sparkles, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import FeatureShell from "@/components/feature-shell";
import { FeatureHeader } from "@/components/feature-page";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getAdminBrands } from "../api";

export default function AdminBrandsFeaturePage() {
  const { data } = useQuery({
    queryKey: ["admin-brands"],
    queryFn: getAdminBrands,
  });

  return (
    <FeatureShell>
      <div className="space-y-6">
        <FeatureHeader
          title="Brands"
          description="A brand workspace with featured labels and coverage metrics so the admin route still looks designed."
          actions={
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              4 brands
            </Badge>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Brands</CardDescription>
              <CardTitle className="text-3xl">
                {data?.metrics[0]?.value ?? "0"}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Featured</CardDescription>
              <CardTitle className="text-3xl">
                {data?.metrics[1]?.value ?? "0"}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Products mapped</CardDescription>
              <CardTitle className="text-3xl">
                {data?.metrics[2]?.value ?? "0"}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardDescription>Brand roster</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Star className="h-5 w-5 text-primary" />
              Featured manufacturers
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {data?.brands?.map((brand) => (
              <div
                key={brand.name}
                className="rounded-2xl border border-border bg-background/80 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{brand.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {brand.category}
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-full">
                    {brand.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Notes</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-primary" />
              Merchandising focus
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Use these brand blocks for filters, featured brand carousels, and
            CMS sync later.
          </CardContent>
        </Card>
      </div>
    </FeatureShell>
  );
}
