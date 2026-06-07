"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  Package,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  User,
  Calendar,
  Truck,
  CheckCircle2,
  XCircle,
  Loader2,
  Copy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MockOrder, OrderStatus } from "@/features/orders/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderLineItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  thumbnail?: string;
};

export type EnrichedOrder = Omit<MockOrder, "items" | "shippingAddress"> & {
  items?: OrderLineItem[];
  customerInfo?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  shippingAddress?: {
    name: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  };
  timeline?: Array<{
    status: OrderStatus;
    label: string;
    time: string;
    icon?: LucideIcon;
  }>;
};

interface OrderDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  order: EnrichedOrder;
  onUpdateStatus?: (orderId: string, status: OrderStatus) => Promise<void>;
  onAddTracking?: (orderId: string, trackingNumber: string) => Promise<void>;
  onRefund?: (orderId: string) => Promise<void>;
  isUpdating?: boolean;
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; icon: LucideIcon; color: string }
> = {
  pending: { label: "Chờ xử lý", icon: Clock, color: "text-yellow-600" },
  paid: { label: "Đã thanh toán", icon: CheckCircle2, color: "text-green-600" },
  processing: { label: "Đang xử lý", icon: Loader2, color: "text-amber-600" },
  shipped: { label: "Đã giao vận", icon: Truck, color: "text-blue-600" },
  completed: {
    label: "Hoàn thành",
    icon: CheckCircle2,
    color: "text-emerald-600",
  },
  cancelled: { label: "Đã hủy", icon: XCircle, color: "text-red-600" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function OrderDetailDrawer({
  open,
  onClose,
  order,
  onUpdateStatus,
  onAddTracking,
  onRefund,
  isUpdating = false,
}: OrderDetailDrawerProps) {
  const [trackingInput, setTrackingInput] = useState(
    order.trackingNumber ?? "",
  );
  const [isSavingTracking, setIsSavingTracking] = useState(false);

  const statusConfig =
    STATUS_CONFIG[order.status as OrderStatus] ?? STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;

  const handleStatusChange = async (newStatus: OrderStatus) => {
    await onUpdateStatus?.(order.id, newStatus);
  };

  const handleSaveTracking = async () => {
    if (!trackingInput.trim()) return;
    setIsSavingTracking(true);
    try {
      await onAddTracking?.(order.id, trackingInput.trim());
    } finally {
      setIsSavingTracking(false);
    }
  };

  const handleRefund = async () => {
    if (!confirm("Xác nhận hoàn tiền đơn hàng này?")) return;
    await onRefund?.(order.id);
  };

  const copy = (text: string) => navigator.clipboard.writeText(text);

  const subtotal = order.total * 0.9;
  const shipping = order.total * 0.1;

  const lineItems = order.items ?? [];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Chi tiết đơn hàng</span>
            <Badge
              variant="outline"
              className={cn("gap-1", statusConfig.color)}
            >
              <StatusIcon className="h-3 w-3" />
              {statusConfig.label}
            </Badge>
          </SheetTitle>
          <SheetDescription>Mã đơn: #{order.number}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status update */}
          {onUpdateStatus && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Cập nhật trạng thái</p>
              <Select
                value={order.status}
                onValueChange={(value) =>
                  handleStatusChange(value as OrderStatus)
                }
                disabled={isUpdating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="paid">Đã thanh toán</SelectItem>
                  <SelectItem value="processing">Đang xử lý</SelectItem>
                  <SelectItem value="shipped">Đã giao vận</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Separator />

          {/* Order info */}
          <div className="space-y-3">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Package className="h-4 w-4" />
              Thông tin đơn hàng
            </p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mã đơn hàng</span>
                <span className="flex items-center gap-1 font-mono font-medium">
                  #{order.number}
                  <Copy
                    className="h-3 w-3 cursor-pointer opacity-50 hover:opacity-100"
                    onClick={() => copy(order.number)}
                  />
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày đặt</span>
                <span className="font-medium">{order.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Thanh toán</span>
                <span className="font-medium">
                  {order.paymentMethod ?? "COD"}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Customer */}
          {order.customerInfo && (
            <>
              <div className="space-y-3">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <User className="h-4 w-4" />
                  Khách hàng
                </p>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {order.customerInfo.name
                      .split(" ")
                      .slice(-2)
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div className="text-sm leading-relaxed">
                    <p className="font-medium">{order.customerInfo.name}</p>
                    {order.customerInfo.email && (
                      <p className="flex items-center gap-1 text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {order.customerInfo.email}
                      </p>
                    )}
                    {order.customerInfo.phone && (
                      <p className="flex items-center gap-1 text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {order.customerInfo.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Shipping address */}
          {order.shippingAddress && (
            <>
              <div className="space-y-3">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <MapPin className="h-4 w-4" />
                  Địa chỉ giao hàng
                </p>
                <div className="rounded-lg bg-muted/50 px-3 py-2.5 text-sm leading-relaxed">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p className="text-muted-foreground">
                    {order.shippingAddress.address}
                  </p>
                  <p className="text-muted-foreground">
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.country}
                  </p>
                  <p className="flex items-center gap-1 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {order.shippingAddress.phone}
                  </p>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Tracking */}
          <div className="space-y-3">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Truck className="h-4 w-4" />
              Mã vận đơn
            </p>
            {order.trackingNumber ? (
              <div className="flex items-center gap-2">
                <Input
                  value={order.trackingNumber}
                  readOnly
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copy(order.trackingNumber!)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập mã vận đơn..."
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveTracking()}
                />
                <Button
                  onClick={handleSaveTracking}
                  disabled={!trackingInput.trim() || isSavingTracking}
                >
                  {isSavingTracking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Lưu"
                  )}
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Order items */}
          {lineItems.length > 0 && (
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Package className="h-4 w-4" />
                Sản phẩm ({lineItems.length})
              </p>
              <div className="divide-y">
                {lineItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-2.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="h-full w-full rounded-lg object-cover"
                        />
                      ) : (
                        <Package className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Số lượng: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      ${Number(item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-1.5 border-t pt-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Tạm tính</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Phí vận chuyển</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-base font-semibold">
                  <span>Tổng cộng</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-semibold">Ghi chú</p>
                <p className="rounded-lg border-l-2 border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                  {order.notes}
                </p>
              </div>
            </>
          )}

          {/* Timeline */}
          {order.timeline && order.timeline.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Calendar className="h-4 w-4" />
                  Lịch sử đơn hàng
                </p>
                <div>
                  {order.timeline.map((event, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted">
                          {event.icon ? (
                            <event.icon className="h-3 w-3 text-muted-foreground" />
                          ) : (
                            <CheckCircle2 className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                        {idx < order.timeline!.length - 1 && (
                          <div className="mt-1 w-px flex-1 bg-border" />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium">{event.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <Separator />
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Đóng
            </Button>
            {order.status !== "cancelled" &&
              order.status !== "completed" &&
              onRefund && (
                <Button
                  variant="destructive"
                  onClick={handleRefund}
                  disabled={isUpdating}
                >
                  Hoàn tiền
                </Button>
              )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
