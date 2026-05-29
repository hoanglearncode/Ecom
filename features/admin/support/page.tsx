"use client";

import React from "react";
import { MessageSquare, ShieldAlert, Smile, Ticket } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import FeatureShell from "@/components/feature-shell";
import { FeatureHeader } from "@/components/feature-page";
import { Badge } from "@/components/ui/badge";

import { AdminActions, AdminBoard, AdminStatGrid } from "../components";
import { getAdminSupport } from "../api";

export default function AdminSupportFeaturePage() {
  const { data } = useQuery({
    queryKey: ["admin-support"],
    queryFn: getAdminSupport,
  });

  return (
    <FeatureShell>
      <div className="space-y-6">
        <FeatureHeader
          title="Support"
          description="A support queue with visible tickets, SLA state, and response actions instead of a blank scaffold."
          actions={
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              3 tickets
            </Badge>
          }
        />

        <AdminStatGrid metrics={data?.metrics ?? []} />

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <AdminBoard
            title="Support inbox"
            description="Ticket queue"
            icon={MessageSquare}
            items={data?.tickets ?? []}
            renderItem={(ticket) => (
              <div className="rounded-2xl border border-border bg-background/80 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      {ticket.id}
                    </div>
                    <div className="mt-1 font-medium">{ticket.subject}</div>
                  </div>
                  <Badge variant="outline" className="rounded-full">
                    {ticket.status}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                  <span>{ticket.priority} priority</span>
                  <span>Reply SLA 2h</span>
                </div>
              </div>
            )}
          />

          <AdminActions
            title="Escalation controls"
            description="Response tools"
            actions={data?.actions ?? []}
          />
        </div>
      </div>
    </FeatureShell>
  );
}
