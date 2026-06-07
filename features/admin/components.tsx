"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import type { AdminMetric } from "./types";

// ─── Types ─────────────────────────────────────────────────────────────────────

type AdminStatGridProps = {
  metrics: AdminMetric[];
};

type AdminBoardProps<T> = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  columnsClassName?: string;
};

type AdminActionsProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions: string[];
};

// ─── AdminStatGrid ─────────────────────────────────────────────────────────────

export function AdminStatGrid({ metrics }: AdminStatGridProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const isUp = metric.change?.startsWith("+");
        const isDown = metric.change?.startsWith("-");

        return (
          <Card key={metric.label} className="bg-muted/40">
            <CardContent className="p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {metric.label}
              </p>
              <div className="mt-2 text-3xl font-semibold tracking-tight">
                {metric.value}
              </div>
              {metric.change && (
                <p
                  className={cn(
                    "mt-2 text-xs font-medium",
                    isUp && "text-emerald-600",
                    isDown && "text-red-500",
                    !isUp && !isDown && "text-muted-foreground"
                  )}
                >
                  {metric.change}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ─── AdminBoard ────────────────────────────────────────────────────────────────

export function AdminBoard<T>({
  title,
  description,
  icon: Icon,
  items,
  renderItem,
  columnsClassName = "space-y-3",
}: AdminBoardProps<T>) {
  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-xs">{description}</CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent className={cn("p-4", columnsClassName)}>
        {items.map((item, index) => (
          <React.Fragment key={index}>{renderItem(item)}</React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
}

// ─── AdminActions ──────────────────────────────────────────────────────────────

export function AdminActions({
  title,
  description,
  icon: Icon,
  actions,
}: AdminActionsProps) {
  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-xs">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {actions.map((action, idx) => (
          <React.Fragment key={action}>
            <button className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/50">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="flex-1 text-sm font-medium">{action}</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            {idx < actions.length - 1 && <Separator className="mx-5 w-auto" />}
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
}