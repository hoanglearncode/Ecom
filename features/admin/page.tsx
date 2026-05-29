"use client";

import React from "react";
import { BarChart3, Boxes, Package, ShoppingBag, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import FeatureShell from "@/components/feature-shell";
import { FeatureHeader } from "@/components/feature-page";
import { Badge } from "@/components/ui/badge";

import { AdminActions, AdminBoard, AdminStatGrid } from "./components";
import { getAdminDashboard } from "./api";

export default function AdminDashboardFeaturePage() {
  const { data } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getAdminDashboard,
  });

  return (
    <FeatureShell>
      <div className="space-y-6">
        <FeatureHeader
          title="Admin Dashboard"
          description="A restored dashboard surface with KPI cards, activity, and action tiles instead of a bare label block."
          actions={
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              Live overview
            </Badge>
          }
        />

        <AdminStatGrid metrics={data?.metrics ?? []} />

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <AdminBoard
            title="Recent activity"
            description="Operations feed"
            icon={BarChart3}
            items={data?.activity ?? []}
            renderItem={(item) => (
              <div className="rounded-2xl border border-border bg-background/80 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {item.detail}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.time}
                  </div>
                </div>
              </div>
            )}
          />

          <AdminActions
            title="Command center"
            description="Quick actions"
            actions={data?.actions ?? []}
          />
        </div>
      </div>
    </FeatureShell>
  );
}
