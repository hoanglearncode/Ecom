import React from "react";
import { Customer } from "../types";

export default function CustomerItem({ customer }: { customer: Customer }) {
  return (
    <div className="p-3 border rounded-md shadow-sm flex items-center justify-between">
      <div>
        <div className="font-medium">{customer.name}</div>
        <div className="text-sm text-muted-foreground">{customer.email}</div>
      </div>
      <div className="text-sm text-muted-foreground">{customer.id}</div>
    </div>
  );
}
