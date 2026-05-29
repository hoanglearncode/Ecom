"use client";

import React from "react";
import { BadgeCheck, Mail, Phone, Users } from "lucide-react";
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

import { getAdminCustomers } from "../api";

export default function AdminCustomersFeaturePage() {
  const { data } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: getAdminCustomers,
  });

  return (
    <FeatureShell>
      <div className="space-y-6">
        <FeatureHeader
          title="Customers"
          description="Customer segments, contact details, and loyalty status rendered as a real admin workspace."
          actions={
            <Badge className="rounded-full px-3 py-1" variant="secondary">
              3 contacts
            </Badge>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Total customers</CardDescription>
              <CardTitle className="text-3xl">
                {data?.metrics[0]?.value ?? "0"}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>VIP</CardDescription>
              <CardTitle className="text-3xl">
                {data?.metrics[1]?.value ?? "0"}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>At risk</CardDescription>
              <CardTitle className="text-3xl">
                {data?.metrics[2]?.value ?? "0"}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardDescription>Directory</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Users className="h-5 w-5 text-primary" />
              Customer list
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.customers?.map((customer) => (
              <div
                key={customer.email}
                className="rounded-2xl border border-border bg-background/80 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {customer.email}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {customer.phone}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="rounded-full">
                    {customer.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </FeatureShell>
  );
}
