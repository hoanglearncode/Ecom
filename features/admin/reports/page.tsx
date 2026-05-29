"use client";

import React from "react";
import { FileText, PieChart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import FeatureShell from "@/components/feature-shell";
import { FeatureHeader } from "@/components/feature-page";
import { Badge } from "@/components/ui/badge";

import { AdminActions, AdminBoard, AdminStatGrid } from "../components";
import { getAdminReports } from "../api";

export default function AdminReportsFeaturePage() {
  const { data } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: getAdminReports,
  });

  return (
    <FeatureShell>
      <div className="space-y-6">
        <FeatureHeader
          title="Reports"
          description="Report cards with export actions and summary metadata so the page feels like a real reporting hub."
          actions={
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              4 reports
            </Badge>
          }
        />

        <AdminStatGrid metrics={data?.metrics ?? []} />

        <AdminBoard
          title="Report library"
          description="Saved reports"
          icon={FileText}
          items={data?.reports ?? []}
          columnsClassName="grid gap-4 md:grid-cols-2"
          renderItem={(report) => (
            <div className="rounded-2xl border border-border bg-background/80 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{report.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {report.note}
                  </div>
                </div>
                <Badge variant="outline" className="rounded-full">
                  {report.status}
                </Badge>
              </div>
            </div>
          )}
        />

        <AdminActions
          title="Export and compare"
          description="Actions"
          icon={PieChart}
          actions={data?.actions ?? []}
        />
      </div>
    </FeatureShell>
  );
}
