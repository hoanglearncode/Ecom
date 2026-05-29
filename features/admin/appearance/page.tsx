"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Paintbrush, Sparkles } from "lucide-react";

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
import { getAdminAppearance } from "../api";

export default function AdminAppearanceFeaturePage() {
  const { data } = useQuery({
    queryKey: ["admin-appearance"],
    queryFn: getAdminAppearance,
  });

  return (
    <FeatureShell>
      <div className="space-y-6">
        <FeatureHeader
          title="Appearance"
          description="Theme tokens, branding, and layout preferences belong here as small reusable sections."
          actions={
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              Theme editor
            </Badge>
          }
        />

        <AdminStatGrid metrics={data?.metrics ?? []} />

        <Card>
          <CardHeader>
            <CardDescription>Theme settings</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Paintbrush className="h-5 w-5 text-primary" />
              Brand system
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {data?.settings?.map((setting) => (
              <div
                key={setting.name}
                className="rounded-2xl border border-border bg-background/80 p-4"
              >
                <div className="text-sm font-medium">{setting.name}</div>
                <div className="mt-2 text-lg font-semibold">
                  {setting.value}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {setting.note}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <AdminActions
          title="Preview flow"
          description="Actions"
          icon={Sparkles}
          actions={data?.actions ?? []}
        />
      </div>
    </FeatureShell>
  );
}
