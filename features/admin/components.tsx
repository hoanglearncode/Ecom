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

import type { AdminMetric } from "./types";

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

export function AdminStatGrid({ metrics }: AdminStatGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <div className="mt-2 text-3xl font-semibold tracking-tight">
              {metric.value}
            </div>
            {metric.change ? (
              <div className="mt-3 text-sm text-emerald-500">
                {metric.change}
              </div>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

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
      <CardHeader>
        {description ? <CardDescription>{description}</CardDescription> : null}
        <CardTitle className="flex items-center gap-2 text-xl">
          {Icon ? <Icon className="h-5 w-5 text-primary" /> : null}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={columnsClassName}>
        {items.map((item, index) => (
          <React.Fragment key={index}>{renderItem(item)}</React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
}

export function AdminActions({
  title,
  description,
  icon: Icon,
  actions,
}: AdminActionsProps) {
  return (
    <Card>
      <CardHeader>
        {description ? <CardDescription>{description}</CardDescription> : null}
        <CardTitle className="flex items-center gap-2 text-xl">
          {Icon ? <Icon className="h-5 w-5 text-primary" /> : null}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <Button
            key={action}
            variant="outline"
            className="w-full justify-between"
          >
            {action}
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
