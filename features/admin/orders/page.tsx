"use client";

import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  Truck,
  Package,
  Clock,
  CircleCheck,
  CircleX,
  Loader,
  MapPin,
  ReceiptText,
  Pencil,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import FeatureShell from "@/components/feature-shell";
import { FeatureHeader } from "@/components/feature-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { getAdminOrders } from "../api";
import { AdminPagination, usePagination, paginateData } from "@/components/admin";
import {
  OrderDetailDrawer,
  type EnrichedOrder,
} from "@/components/admin/orders/OrderDetailDrawer";
import {
  updateOrderStatus,
  fulfillOrder,
  refundOrder,
  addTrackingNumber,
} from "@/lib/api/orders";

import type { OrderStatus, MockOrder } from "@/features/orders/types";

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    Icon: LucideIcon;
    iconClass: string;
    iconBg: string;
    badgeClass: string;
  }
> = {
  pending: {
    label: "Pending",
    Icon: Clock,
    iconClass: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-50 dark:bg-amber-950",
    badgeClass:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  },
  shipped: {
    label: "Shipped",
    Icon: Package,
    iconClass: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-50 dark:bg-blue-950",
    badgeClass:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  },
  paid: {
    label: "Open",
    Icon: Clock,
    iconClass: "text-green-600 dark:text-green-400",
    iconBg: "bg-green-50 dark:bg-green-950",
    badgeClass:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
  },
  completed: {
    label: "Completed",
    Icon: CircleCheck,
    iconClass: "text-muted-foreground",
    iconBg: "bg-muted",
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
  cancelled: {
    label: "Cancelled",
    Icon: CircleX,
    iconClass: "text-red-600 dark:text-red-400",
    iconBg: "bg-red-50 dark:bg-red-950",
    badgeClass:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  },
  processing: {
    label: "Processing",
    Icon: Loader,
    iconClass: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-50 dark:bg-amber-950",
    badgeClass:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  },
};

const FILTER_OPTIONS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Open", value: "paid" },
  { label: "Shipping", value: "shipped" },
  { label: "Completed", value: "completed" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function enrichOrder(order: MockOrder): EnrichedOrder {
  const timeline: NonNullable<EnrichedOrder["timeline"]> = [
    { status: "pending", label: "Đơn hàng được tạo", time: order.date },
    { status: "paid", label: "Đã thanh toán", time: order.date },
  ];

  if (order.status === "shipped" || order.status === "completed") {
    timeline.push({
      status: "shipped",
      label: "Đã giao vận",
      time: order.date,
    });
  }

  if (order.status === "completed") {
    timeline.push({
      status: "completed",
      label: "Hoàn thành",
      time: order.date,
    });
  }

  if (order.status === "cancelled") {
    timeline.push({
      status: "cancelled",
      label: "Đã hủy",
      time: order.date,
    });
  }

  // Prefer structured lineItems; fall back to summary string as single row
  const enrichedItems = order.lineItems?.map((li) => ({
    productId: li.productId,
    name: li.name,
    quantity: li.quantity,
    price: li.price,
    thumbnail: li.thumbnail,
  })) ?? [{ productId: order.id, name: order.items, quantity: 1, price: order.total }];

  return {
    ...order,
    items: enrichedItems,
    customerInfo: {
      id: order.customerId ?? order.id,
      name: order.customer,
      email: order.customerEmail,
      phone: order.customerPhone,
    },
    shippingAddress: order.shippingAddress
      ? {
          name: order.customer,
          phone: order.customerPhone ?? "",
          address: order.shippingAddress,
          city: "TP.HCM",
          country: "Vietnam",
        }
      : undefined,
    timeline,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminOrdersFeaturePage() {
  const [activeFilter, setActiveFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<EnrichedOrder | null>(
    null,
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const { state: pagination, onStateChange: setPagination, reset: resetPagination } = usePagination({ pageSize: 10 });

  const { data, refetch } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: getAdminOrders,
  });

  const filteredOrders: MockOrder[] = useMemo(() => {
    return activeFilter === "all"
      ? (data?.orders ?? [])
      : (data?.orders ?? []).filter((o) => o.status === activeFilter);
  }, [data?.orders, activeFilter]);

  const paginatedOrders = useMemo(
    () => paginateData(filteredOrders, pagination.page, pagination.pageSize),
    [filteredOrders, pagination.page, pagination.pageSize]
  );

  // Reset page when filter changes
  const handleFilterChange = (value: OrderStatus | "all") => {
    setActiveFilter(value);
    resetPagination();
  };

  const handleOrderClick = (order: MockOrder) => {
    setSelectedOrder(enrichOrder(order));
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    setIsUpdating(true);
    try {
      await updateOrderStatus(orderId, status);
      await refetch();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => prev && { ...prev, status });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddTracking = async (orderId: string, trackingNumber: string) => {
    setIsUpdating(true);
    try {
      await addTrackingNumber(orderId, trackingNumber);
      await refetch();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => prev && { ...prev, trackingNumber });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRefund = async (orderId: string) => {
    setIsUpdating(true);
    try {
      await refundOrder(orderId);
      await refetch();
      setSelectedOrder(null);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <FeatureShell>
      <div className="space-y-6">
        {/* Header */}
        <FeatureHeader
          title="Orders"
          description="Live admin queue — fulfillment state, order rows, and workflow controls."
          actions={
            <Badge
              variant="secondary"
              className="gap-1.5 rounded-full px-3 py-1"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              {data?.orders?.length ?? 0} active orders
            </Badge>
          }
        />

        {/* Metrics */}
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { label: "Open", index: 0, sub: "awaiting fulfillment" },
            { label: "Shipping", index: 1, sub: "in transit" },
            { label: "Completed", index: 2, sub: "this week" },
          ].map(({ label, index, sub }) => (
            <Card key={label} className="bg-muted/50">
              <CardHeader className="pb-1">
                <CardDescription className="text-xs font-medium uppercase tracking-wider">
                  {label}
                </CardDescription>
                <CardTitle className="text-3xl">
                  {data?.metrics[index]?.value ?? "0"}
                </CardTitle>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Order Queue */}
        <Card>
          <CardHeader className="border-b pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                Order queue
              </CardTitle>
              <span className="text-xs text-muted-foreground">
                sorted by newest
              </span>
            </div>

            {/* Filters */}
            <div className="flex gap-1.5 pt-2">
              {FILTER_OPTIONS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => handleFilterChange(value)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    activeFilter === value
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-transparent text-muted-foreground hover:bg-muted",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {paginatedOrders.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                No orders in this category
              </p>
            ) : (
              paginatedOrders.map((order) => {
                const cfg = STATUS_CONFIG[order.status];
                const Icon = cfg.Icon;

                return (
                  <div
                    key={order.id}
                    onClick={() => handleOrderClick(order)}
                    className="flex cursor-pointer items-center gap-3 border-b px-5 py-3.5 transition-colors last:border-0 hover:bg-muted/50"
                  >
                    {/* Status icon */}
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        cfg?.iconBg,
                      )}
                    >
                      <Icon className={cn("h-4 w-4", cfg?.iconClass)} />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-sm font-medium">
                        #{order.number}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {order.customer} · {order.items}
                      </p>
                    </div>

                    {/* Right */}
                    <div className="flex shrink-0 items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          ${order.total.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.date}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn("rounded-full text-xs", cfg?.badgeClass)}
                      >
                        {cfg?.label}
                      </Badge>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>

          {/* Pagination */}
          <AdminPagination
            state={pagination}
            onStateChange={setPagination}
            totalItems={filteredOrders.length}
            itemsLabel="đơn hàng"
            className="px-5"
          />
        </Card>

        {/* Order Detail Drawer */}
        {selectedOrder && (
          <OrderDetailDrawer
            open={!!selectedOrder}
            onClose={() => setSelectedOrder(null)}
            order={selectedOrder}
            onUpdateStatus={handleUpdateStatus}
            onAddTracking={handleAddTracking}
            onRefund={handleRefund}
            isUpdating={isUpdating}
          />
        )}
      </div>
    </FeatureShell>
  );
}
