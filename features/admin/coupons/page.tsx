"use client";

import React from "react";
import { Clock3, Sparkles, TicketPercent, TrendingUp } from "lucide-react";
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

import { getAdminCoupons } from "../api";

function statusTone(status: "active" | "scheduled" | "expired") {
  switch (status) {
    case "active":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
    case "scheduled":
      return "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-400";
    default:
      return "border-muted-foreground/20 bg-muted/60 text-muted-foreground";
  }
}

export default function AdminCouponsFeaturePage() {
  const { data } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: getAdminCoupons,
  });

  const coupons = data?.coupons ?? [];

  const activeCoupons = coupons.filter(
    (coupon) => coupon.status === "active",
  ).length;
  const scheduledCoupons = coupons.filter(
    (coupon) => coupon.status === "scheduled",
  ).length;

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

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Active coupons</CardDescription>
              <CardTitle className="text-3xl">{activeCoupons}</CardTitle>
            </CardHeader>
            <CardContent className="pb-6 text-sm text-muted-foreground">
              live promotions ready for checkout
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Scheduled campaigns</CardDescription>
              <CardTitle className="text-3xl">{scheduledCoupons}</CardTitle>
            </CardHeader>
            <CardContent className="pb-6 text-sm text-muted-foreground">
              timed campaigns waiting to launch
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Mock flow</CardDescription>
              <CardTitle className="text-3xl">100%</CardTitle>
            </CardHeader>
            <CardContent className="pb-6 text-sm text-muted-foreground">
              data stays visible without a backend dependency
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardDescription>Promotion library</CardDescription>
                <CardTitle className="mt-2 flex items-center gap-2 text-2xl">
                  <TicketPercent className="h-5 w-5 text-primary" />
                  Coupon catalog
                </CardTitle>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                Mock seeded examples
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
            {coupons.map((coupon) => (
              <div
                key={coupon.code}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      {coupon.code}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold">
                      {coupon.title}
                    </h3>
                  </div>
                  <Badge
                    className={`rounded-full border ${statusTone(coupon.status)}`}
                    variant="outline"
                  >
                    {coupon.status}
                  </Badge>
                </div>

                <div className="mt-4 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-2xl font-semibold">
                      {coupon.discount}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {coupon.usage}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock3 className="h-3.5 w-3.5" />
                    {coupon.expiresAt}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>What this restores</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="h-5 w-5 text-primary" />A visible admin
              surface in mock mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Keep the route thin.</p>
            <p>Keep the visual structure in the feature layer.</p>
            <p>
              Swap the mock array for a real coupon query when the backend
              arrives.
            </p>
          </CardContent>
        </Card>
      </div>
    </FeatureShell>
  );
}
