"use client";
import React from "react";
import FeatureShell from "@/components/feature-shell";
import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "./api";
import CustomerList from "./components/CustomerList";

export default function CustomersFeaturePage() {
  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  return (
    <FeatureShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-sm text-muted-foreground">
            Manage your customers and their contact details.
          </p>
        </div>

        <CustomerList customers={customers} />
      </div>
    </FeatureShell>
  );
}
