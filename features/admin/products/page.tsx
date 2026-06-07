"use client";

import { useQuery } from "@tanstack/react-query";

import FeatureShell from "@/components/feature-shell";
import { FeatureHeader } from "@/components/feature-page";
import { Badge } from "@/components/ui/badge";

import ProductsTable from "@/components/products/products-table";
import { getProducts } from "@/features/products/api";
export default function AdminCouponsFeaturePage() {
  const { data } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: getProducts,
  });

  return (
    <FeatureShell>
      <div className="space-y-6">
        <FeatureHeader
          title="Coupons"
          description="A coupon studio that keeps the richer admin layout visible while the data still comes through the FE API layer."
          actions={
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              API data source
            </Badge>
          }
        />

        <ProductsTable products={data ?? []} />
      </div>
    </FeatureShell>
  );
}
