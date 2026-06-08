import React from "react";
// import { Order } from "../types";
import OrderItem from "./OrderItem";

export default function OrderList({ orders }: { orders: any[] }) {
  if (!orders || orders.length === 0)
    return <div className="text-muted-foreground">No orders yet.</div>;

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <OrderItem key={o.id} order={o} />
      ))}
    </div>
  );
}
