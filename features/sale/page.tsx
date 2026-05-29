"use client";

import React from "react";
import { Flame, Rocket, Sparkles, Timer } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import FeatureShell from "@/components/feature-shell";
import { FeatureHeader } from "@/components/feature-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getSalePageData } from "@/features/storefront/api";

export default function SaleFeaturePage() {
  const { data } = useQuery({
    queryKey: ["sale-page"],
    queryFn: getSalePageData,
  });

  return (
    <FeatureShell>
      <div className="space-y-6">
        <FeatureHeader
          title="Sale"
          description="A sale landing page with live campaign cards and urgency cues to keep the storefront feeling designed."
          actions={
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              3 offers
            </Badge>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Active campaigns</CardDescription>
              <CardTitle className="text-3xl">
                {data?.metrics[0]?.value ?? "0"}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Ends today</CardDescription>
              <CardTitle className="text-3xl">
                {data?.metrics[1]?.value ?? "0"}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Avg discount</CardDescription>
              <CardTitle className="text-3xl">
                {data?.metrics[2]?.value ?? "0"}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardDescription>Campaigns</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Flame className="h-5 w-5 text-primary" />
              Sale highlights
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {data?.offers?.map((offer) => (
              <div
                key={offer.title}
                className="rounded-2xl border border-border bg-background/80 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{offer.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {offer.note}
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-full">
                    {offer.tag}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Urgency</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Timer className="h-5 w-5 text-primary" />
              Countdown-driven CTA
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            {(data?.actions ?? []).map((action) => (
              <Button key={action} variant="outline">
                <Rocket className="h-4 w-4" />
                {action}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </FeatureShell>
  );
}
