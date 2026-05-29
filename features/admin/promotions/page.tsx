"use client";

import React from "react";
import { Megaphone, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import FeatureShell from "@/components/feature-shell";
import { FeatureHeader } from "@/components/feature-page";
import { Badge } from "@/components/ui/badge";

import { AdminActions, AdminBoard, AdminStatGrid } from "../components";
import { getAdminPromotions } from "../api";

export default function AdminPromotionsFeaturePage() {
  const { data } = useQuery({
    queryKey: ["admin-promotions"],
    queryFn: getAdminPromotions,
  });

  return (
    <FeatureShell>
      <div className="space-y-6">
        <FeatureHeader
          title="Promotions"
          description="Promotion rules, schedules, and audiences with visible campaign state for mock-driven QA."
          actions={
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              3 campaigns
            </Badge>
          }
        />

        <AdminStatGrid metrics={data?.metrics ?? []} />

        <AdminBoard
          title="Promotion workspace"
          description="Campaign board"
          icon={Megaphone}
          items={data?.promotions ?? []}
          columnsClassName="grid gap-4 md:grid-cols-3"
          renderItem={(promo) => (
            <div className="rounded-2xl border border-border bg-background/80 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{promo.name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {promo.audience}
                  </div>
                </div>
                <Badge variant="outline" className="rounded-full">
                  {promo.status}
                </Badge>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4" />
                {promo.schedule}
              </div>
            </div>
          )}
        />

        <AdminActions
          title="Launch workflow"
          description="Next steps"
          actions={data?.actions ?? []}
        />
      </div>
    </FeatureShell>
  );
}
