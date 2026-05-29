"use client";
import React from "react";
import FeatureShell from "@/components/feature-shell";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "./api";
import CartList from "./components/CartList";

export default function CartFeaturePage() {
  const { data: cart } = useQuery({ queryKey: ["cart"], queryFn: getCart });

  return (
    <FeatureShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Cart</h1>
          <p className="text-sm text-muted-foreground">Your shopping cart.</p>
        </div>

        <CartList items={cart?.items ?? []} />
      </div>
    </FeatureShell>
  );
}
