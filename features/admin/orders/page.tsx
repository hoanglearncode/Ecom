"use client";

import React from "react";
import { Package2, ShoppingBag, Truck, Wrench } from "lucide-react";
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

import { getAdminOrders } from "../api";

export default function AdminOrdersFeaturePage() {
  const { data } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: getAdminOrders,
  });

  return (
    <FeatureShell>
      <div className="space-y-6">
        <FeatureHeader
          title="Orders"
          description="Order rows, fulfillment state, and quick workflow controls presented as a live admin queue."
          actions={
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              3 orders
            </Badge>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Open</CardDescription>
              <CardTitle className="text-3xl">
                {data?.metrics[0]?.value ?? "0"}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Shipping</CardDescription>
              <CardTitle className="text-3xl">
                {data?.metrics[1]?.value ?? "0"}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-3xl">
                {data?.metrics[2]?.value ?? "0"}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardDescription>Queue</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Order management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.orders?.map((order) => (
              <div
                key={order.number}
                className="rounded-2xl border border-border bg-background/80 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{order.number}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {order.total}
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-full">
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Workflow</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Truck className="h-5 w-5 text-primary" />
              Fulfillment controls
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Keep this page aligned with the order API and add drawers for
            refunds, edits, and shipping updates later.
          </CardContent>
        </Card>
      </div>
    </FeatureShell>
  );
}
