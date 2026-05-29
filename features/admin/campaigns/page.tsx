"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Megaphone, Target, WandSparkles } from "lucide-react";

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

import { AdminActions, AdminStatGrid } from "../components";
import { getAdminCampaigns } from "../api";

export default function AdminCampaignsFeaturePage() {
  const { data } = useQuery({
    queryKey: ["admin-campaigns"],
    queryFn: getAdminCampaigns,
  });

  return (
    <FeatureShell>
      <div className="space-y-6">
        <FeatureHeader
          title="Campaigns"
          description="Campaign workflows can be split into campaign cards, audience segments, and action panels."
          actions={
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              Campaign studio
            </Badge>
          }
        />

        <AdminStatGrid metrics={data?.metrics ?? []} />

        <Card>
          <CardHeader>
            <CardDescription>Campaign board</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Megaphone className="h-5 w-5 text-primary" />
              Launch planning
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {data?.campaigns?.map((campaign) => (
              <div
                key={campaign.name}
                className="rounded-2xl border border-border bg-background/80 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{campaign.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {campaign.audience}
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-full">
                    {campaign.status}
                  </Badge>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  {campaign.channel}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <AdminActions
          title="Creative workflow"
          description="Next steps"
          icon={WandSparkles}
          actions={data?.actions ?? []}
        />
      </div>
    </FeatureShell>
  );
}
