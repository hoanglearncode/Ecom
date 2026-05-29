"use client";
import React from "react";
import FeatureShell from "@/components/feature-shell";
import { useQuery } from "@tanstack/react-query";
import { getInventory } from "./api";
import InventoryList from "./components/InventoryList";

export default function InventoryFeaturePage() {
  const { data: items = [] } = useQuery({
    queryKey: ["inventory"],
    queryFn: getInventory,
  });

  return (
    <FeatureShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-sm text-muted-foreground">
            Overview of stock levels and SKUs.
          </p>
        </div>

        <InventoryList items={items} />
      </div>
    </FeatureShell>
  );
}
