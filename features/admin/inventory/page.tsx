"use client";

import React from "react";
import { Warehouse } from "lucide-react";
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
import { getAdminInventory } from "../api";

export default function AdminInventoryFeaturePage() {
  const { data } = useQuery({
    queryKey: ["admin-inventory"],
    queryFn: getAdminInventory,
  });
  return (
    <FeatureShell>
      <div className="space-y-6">
        <FeatureHeader
          title="Inventory"
          description="A warehouse-style inventory workspace with low-stock visibility and SKU rows."
          actions={
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              {data?.inventory?.length ?? 0} SKUs
            </Badge>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{data?.metrics[0]?.value ?? "0"}</CardTitle>
              <CardDescription>Total SKUs</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{data?.metrics[1]?.value ?? "0"}</CardTitle>
              <CardDescription>Low stock</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{data?.metrics[2]?.value ?? "0"}</CardTitle>
              <CardDescription>Coverage</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardDescription>Warehouse rows</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Warehouse className="h-5 w-5 text-primary" />
              Stock overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.inventory?.map((row) => (
              <div
                key={row.sku}
                className="rounded-2xl border border-border bg-background/80 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{row.sku}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {row.stock} units in stock
                    </div>
                  </div>
                  <Badge
                    variant={row.alert === "Low" ? "destructive" : "outline"}
                    className="rounded-full"
                  >
                    {row.alert}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </FeatureShell>
  );
}
