"use client";
import React from "react";
import FeatureShell from "@/components/feature-shell";

export default function ProductDetailFeaturePage() {
  return (
    <FeatureShell>
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">Product Detail</h1>
        <p className="text-sm text-muted-foreground">
          Product detail feature module scaffold for the dynamic slug route.
        </p>
      </div>
    </FeatureShell>
  );
}
