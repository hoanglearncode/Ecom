"use client";

import React from "react";
import { BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import FeatureShell from "@/components/feature-shell";
import { FeatureHeader } from "@/components/feature-page";
import { Badge } from "@/components/ui/badge";

import { AdminActions, AdminBoard, AdminStatGrid } from "../components";
import { getAdminAnalytics } from "../api";

export default function AdminAnalyticsFeaturePage() {
  const { data } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: getAdminAnalytics,
  });

  return (
    <FeatureShell>
      <div className="space-y-6">
        <FeatureHeader
          title="Analytics"
          description="A dashboard-style analytics surface with KPIs, channel breakdowns, and actions instead of a plain scaffold."
          actions={
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              Mock insights
            </Badge>
          }
        />

        <AdminStatGrid metrics={data?.metrics ?? []} />

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <AdminBoard
            title="Channel performance"
            description="Traffic mix"
            icon={BarChart3}
            items={data?.channels ?? []}
            renderItem={(channel) => (
              <div className="rounded-2xl border border-border bg-background/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">{channel.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {channel.value} visits
                    </div>
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {channel.share}
                  </div>
                </div>
              </div>
            )}
          />

          <AdminActions
            title="Insight controls"
            description="Key actions"
            actions={data?.actions ?? []}
          />
        </div>
      </div>
    </FeatureShell>
  );
}
