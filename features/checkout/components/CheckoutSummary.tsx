import React from "react";

export default function CheckoutSummary({ total }: { total: number }) {
  return (
    <div className="p-4 border rounded-md">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Order total</div>
        <div className="font-semibold">{total}</div>
      </div>
    </div>
  );
}
