import React from "react";
// import { Order } from "../types";

export default function OrderItem({ order }: { order: any }) {
  return (
    <div className="p-3 border rounded-md flex items-center justify-between">
      <div>
        <div className="font-medium">{order.number}</div>
        <div className="text-sm text-muted-foreground">{order.status}</div>
      </div>
      <div className="font-mono">{order.total}</div>
    </div>
  );
}
