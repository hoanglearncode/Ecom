"use client";

import React from "react";
import { Sparkles, Timer } from "lucide-react";
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

import { getNewPageData } from "@/features/storefront/api";

export default function NewArrivalsFeaturePage() {
  const { data } = useQuery({
    queryKey: ["new-page"],
    queryFn: getNewPageData,
  });

  return (
    <FeatureShell>
      <div className="space-y-6">
        <FeatureHeader
          title="New Arrivals"
          description="A new arrivals feed with cards, timing signals, and product freshness instead of a blank placeholder."
          actions={
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              New this week
            </Badge>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Fresh items</CardDescription>
              <CardTitle className="text-3xl">
                {data?.metrics[0]?.value ?? "0"}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Trending</CardDescription>
              <CardTitle className="text-3xl">
                {data?.metrics[1]?.value ?? "0"}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Launches this week</CardDescription>
              <CardTitle className="text-3xl">
                {data?.metrics[2]?.value ?? "0"}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardDescription>Fresh drops</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-primary" />
              Latest arrivals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.arrivals?.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-background/80 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {item.note}
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-full">
                    {item.badge}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Timing</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Timer className="h-5 w-5 text-primary" />
              Launch cadence
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Keep this page synced to the product feed and use it for weekly
            launch drops.
          </CardContent>
        </Card>
      </div>
    </FeatureShell>
  );
}
