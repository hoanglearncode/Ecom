"use client";
import React from "react";
import FeatureShell from "@/components/feature-shell";
import CheckoutSummary from "./components/CheckoutSummary";

export default function CheckoutFeaturePage() {
  return (
    <FeatureShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Checkout</h1>
          <p className="text-sm text-muted-foreground">
            Checkout flow scaffold (payment, shipping).
          </p>
        </div>

        <CheckoutSummary total={0} />
      </div>
    </FeatureShell>
  );
}
