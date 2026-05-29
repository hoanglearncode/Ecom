"use client";

import React from "react";
import { Layers3, TreePine, Tags } from "lucide-react";
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

import { getAdminCategories } from "../api";

export default function AdminCategoriesFeaturePage() {
  const { data } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: getAdminCategories,
  });

  return (
    <FeatureShell>
      <div className="space-y-6">
        <FeatureHeader
          title="Categories"
          description="A category management surface with taxonomy metrics and a visible hierarchy instead of a text-only stub."
          actions={
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              4 groups
            </Badge>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Groups</CardDescription>
              <CardTitle className="text-3xl">
                {data?.metrics[0]?.value ?? "0"}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Products mapped</CardDescription>
              <CardTitle className="text-3xl">
                {data?.metrics[1]?.value ?? "0"}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Featured</CardDescription>
              <CardTitle className="text-3xl">
                {data?.metrics[2]?.value ?? "0"}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardDescription>Hierarchy</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              <TreePine className="h-5 w-5 text-primary" />
              Category tree
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {data?.categories?.map((category) => (
              <div
                key={category.name}
                className="rounded-2xl border border-border bg-background/80 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{category.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {category.items} items
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-full">
                    {category.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Next actions</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Layers3 className="h-5 w-5 text-primary" />
              Structure and merge
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Keep the tree editable, add reorder controls, and connect these
            cards to the real category API later.
          </CardContent>
        </Card>
      </div>
    </FeatureShell>
  );
}
