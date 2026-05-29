"use client";
import React from "react";
import FeatureShell from "@/components/feature-shell";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "./api";
import OrderList from "./components/OrderList";

export default function OrdersFeaturePage() {
  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  return (
    <FeatureShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground">
            Recent orders and statuses.
          </p>
        </div>

        <OrderList orders={orders} />
      </div>
    </FeatureShell>
  );
}
