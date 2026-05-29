"use client";

import React from "react";
import { Lock, MapPin, ShieldCheck, UserCircle2 } from "lucide-react";
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

import { getProfilePageData } from "@/features/storefront/api";

export default function ProfileFeaturePage() {
  const { data } = useQuery({
    queryKey: ["profile-page"],
    queryFn: getProfilePageData,
  });

  return (
    <FeatureShell>
      <div className="space-y-6">
        <FeatureHeader
          title="Profile"
          description="A structured profile center with real settings sections instead of a single placeholder panel."
          actions={
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              Account settings
            </Badge>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {data?.sections?.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.title}>
                <CardContent className="p-5">
                  {/* {Icon && <Icon className="h-5 w-5 text-primary" />} */}
                  <div className="mt-3 font-medium">{section.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {section.note}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardDescription>Profile summary</CardDescription>
            <CardTitle>Account management</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Keep this surface aligned with auth, addresses, and payment settings
            as the product evolves.
          </CardContent>
        </Card>
      </div>
    </FeatureShell>
  );
}
