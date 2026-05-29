import React from "react";
import { Customer } from "../types";
import CustomerItem from "./CustomerItem";

export default function CustomerList({ customers }: { customers: Customer[] }) {
  if (!customers || customers.length === 0)
    return <div className="text-muted-foreground">No customers yet.</div>;

  return (
    <div className="space-y-3">
      {customers.map((c) => (
        <CustomerItem key={c.id} customer={c} />
      ))}
    </div>
  );
}
