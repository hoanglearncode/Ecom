"use client";

import React, { useState, useMemo } from "react";
import {
  Warehouse,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Package,
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  TrendingDown,
  Plus,
  Minus,
  MoreHorizontal,
  Pencil,
  Trash2,
  RefreshCw,
  Download,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import FeatureShell from "@/components/feature-shell";
import { FeatureHeader } from "@/components/feature-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { getAdminInventory } from "../api";
import type { MockInventoryItem, InventoryAlert } from "@/lib/api/mock-store/inventory";
import { AdminPagination, usePagination, paginateData } from "@/components/admin";

// ─── Alert config ─────────────────────────────────────────────────────────────

const ALERT_CONFIG: Record<
  InventoryAlert,
  {
    label: string;
    Icon: React.ElementType;
    rowClass: string;
    badgeClass: string;
    iconClass: string;
  }
> = {
  Healthy: {
    label: "Healthy",
    Icon: CheckCircle2,
    rowClass: "",
    badgeClass:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
    iconClass: "text-emerald-500",
  },
  Low: {
    label: "Low",
    Icon: AlertTriangle,
    rowClass: "bg-amber-50/40 dark:bg-amber-950/20",
    badgeClass:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
    iconClass: "text-amber-500",
  },
  Out: {
    label: "Out of stock",
    Icon: XCircle,
    rowClass: "bg-red-50/40 dark:bg-red-950/20",
    badgeClass:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
    iconClass: "text-red-500",
  },
};

// ─── Sort helpers ─────────────────────────────────────────────────────────────

type SortKey = "productName" | "stock" | "alert" | "price" | "cost";
type SortDir = "asc" | "desc";

const ALERT_ORDER: Record<any, number> = { Out: 0, Low: 1, Healthy: 2 };

function sortRows(
  rows: any[],
  key: SortKey,
  dir: SortDir
): MockInventoryItem[] {
  return [...rows].sort((a, b) => {
    let cmp = 0;
    if (key === "productName") cmp = a.productName.localeCompare(b.productName);
    else if (key === "stock") cmp = a.stock - b.stock;
    else if (key === "alert") cmp = ALERT_ORDER[a.alert] - ALERT_ORDER[b.alert];
    else if (key === "price") cmp = (a.price ?? 0) - (b.price ?? 0);
    else if (key === "cost") cmp = (a.cost ?? 0) - (b.cost ?? 0);
    return dir === "asc" ? cmp : -cmp;
  });
}

// ─── Stock bar ────────────────────────────────────────────────────────────────

function StockBar({ stock, max }: { stock: number; max: number }) {
  const pct = max > 0 ? Math.round((stock / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            stock === 0
              ? "bg-red-500"
              : stock <= 12
              ? "bg-amber-500"
              : "bg-emerald-500"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className={cn(
          "min-w-[2.5rem] text-right text-sm font-medium tabular-nums",
          stock === 0
            ? "text-red-600 dark:text-red-400"
            : stock <= 12
            ? "text-amber-600 dark:text-amber-400"
            : "text-foreground"
        )}
      >
        {stock}
      </span>
    </div>
  );
}

// ─── Sort header cell ─────────────────────────────────────────────────────────

function SortTh({
  label,
  sortKey,
  current,
  dir,
  onClick,
  className,
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: SortDir;
  onClick: (k: SortKey) => void;
  className?: string;
}) {
  const active = current === sortKey;
  return (
    <th
      className={cn(
        "cursor-pointer select-none whitespace-nowrap px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground",
        className
      )}
      onClick={() => onClick(sortKey)}
    >
      <span className="flex items-center gap-1">
        {label}
        {active ? (
          dir === "asc" ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )
        ) : (
          <ChevronsUpDown className="h-3 w-3 opacity-30" />
        )}
      </span>
    </th>
  );
}

// ─── Stock Edit Drawer ────────────────────────────────────────────────────────

interface StockEditDrawerProps {
  open: boolean;
  onClose: () => void;
  item: MockInventoryItem | null;
  onSave: (sku: string, newStock: number) => void;
}

function StockEditDrawer({ open, onClose, item, onSave }: StockEditDrawerProps) {
  const [stock, setStock] = useState(item?.stock ?? 0);

  React.useEffect(() => {
    if (item) setStock(item.stock);
  }, [item]);

  const handleSave = () => {
    if (item) {
      onSave(item.sku, stock);
      onClose();
    }
  };

  const quickAdjust = (delta: number) => {
    setStock((s) => Math.max(0, s + delta));
  };

  if (!item) return null;

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <div className="mx-auto max-w-md">
          <DrawerHeader>
            <DrawerTitle>Adjust Stock Level</DrawerTitle>
            <DrawerDescription>
              Update inventory for {item.productName}
            </DrawerDescription>
          </DrawerHeader>

          <div className="space-y-4 px-4">
            {/* Product info */}
            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg",
                  item.alert === "Out"
                    ? "bg-red-50 dark:bg-red-950"
                    : item.alert === "Low"
                    ? "bg-amber-50 dark:bg-amber-950"
                    : "bg-emerald-50 dark:bg-emerald-950"
                )}
              >
                {item.alert === "Out" ? (
                  <XCircle className="h-5 w-5 text-red-500" />
                ) : item.alert === "Low" ? (
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.productName}</p>
                <p className="text-xs text-muted-foreground">{item.sku}</p>
              </div>
            </div>

            {/* Current status */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Current Stock</p>
                <p className="text-lg font-semibold">{item.stock} units</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-lg font-semibold">{item.alert}</p>
              </div>
            </div>

            {/* Stock input */}
            <div className="space-y-2">
              <Label htmlFor="stock-input">New Stock Quantity</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => quickAdjust(-10)}
                  disabled={stock <= 0}
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Decrease by 10</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => quickAdjust(-1)}
                  disabled={stock <= 0}
                >
                  <Minus className="h-3 w-3" />
                  <span className="sr-only">Decrease by 1</span>
                </Button>
                <Input
                  id="stock-input"
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(Math.max(0, parseInt(e.target.value) || 0))}
                  className="text-center text-lg font-semibold"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => quickAdjust(1)}
                >
                  <Plus className="h-3 w-3" />
                  <span className="sr-only">Increase by 1</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => quickAdjust(10)}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Increase by 10</span>
                </Button>
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStock(0)}
                className="flex-1"
              >
                Set to 0
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStock(50)}
                className="flex-1"
              >
                Restock (50)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStock(100)}
                className="flex-1"
              >
                Bulk (100)
              </Button>
            </div>
          </div>

          <DrawerFooter className="px-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminInventoryFeaturePage() {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["admin-inventory"],
    queryFn: getAdminInventory,
  });

  const [search, setSearch] = useState("");
  const [alertFilter, setAlertFilter] = useState<InventoryAlert | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("alert");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const { state: pagination, onStateChange: setPagination, reset: resetPagination } = usePagination({ pageSize: 10 });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editItem, setEditItem] = useState<MockInventoryItem | null>(null);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  const inventory = data?.inventory ?? [];

  // Stats
  const outCount = inventory.filter((i) => i.alert === "Out").length;
  const lowCount = inventory.filter((i) => i.alert === "Low").length;
  const healthyCount = inventory.filter((i) => i.alert === "Healthy").length;
  const maxStock = Math.max(...inventory.map((i) => i.stock), 1);
  const totalValue = inventory.reduce(
    (s, i: any) => s + (i.cost ?? 0) * i.stock,
    0
  );

  // Filter + sort
  const filtered = useMemo(() => {
    let rows = inventory;
    if (alertFilter !== "all") rows = rows.filter((r) => r.alert === alertFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.productName.toLowerCase().includes(q) ||
          r.sku.toLowerCase().includes(q) ||
          r.brand?.toLowerCase().includes(q) ||
          r.categoryName?.toLowerCase().includes(q)
      );
    }
    return sortRows(rows, sortKey, sortDir);
  }, [inventory, alertFilter, search, sortKey, sortDir]);

  // Pagination
  const paginated = useMemo(
    () => paginateData(filtered, pagination.page, pagination.pageSize),
    [filtered, pagination.page, pagination.pageSize]
  );

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  const handleFilterChange = (value: InventoryAlert | "all") => {
    setAlertFilter(value);
    resetPagination();
  };

  const toggleSelect = (sku: string) => {
    setSelected((s) => {
      const n = new Set(s);
      n.has(sku) ? n.delete(sku) : n.add(sku);
      return n;
    });
  };

  const toggleAll = () => {
    if (paginated.every((p) => selected.has(p.sku))) {
      setSelected((s) => {
        const n = new Set(s);
        paginated.forEach((p) => n.delete(p.sku));
        return n;
      });
    } else {
      setSelected((s) => {
        const n = new Set(s);
        paginated.forEach((p) => n.add(p.sku));
        return n;
      });
    }
  };

  const handleEditStock = (item: MockInventoryItem) => {
    setEditItem(item);
    setEditDrawerOpen(true);
  };

  const handleSaveStock = (sku: string, newStock: number) => {
    // Mock update - in real app, would call API
    queryClient.invalidateQueries({ queryKey: ["admin-inventory"] });
    toast.success(`Stock updated for ${sku}`);
  };

  const handleBulkRestock = () => {
    // Mock update
    setSelected(new Set());
    queryClient.invalidateQueries({ queryKey: ["admin-inventory"] });
    toast.success(`Restocked ${selected.size} items`);
  };

  const handleExport = () => {
    // Mock export
    toast.success("Inventory exported as CSV");
  };

  const FILTER_TABS: { label: string; value: InventoryAlert | "all"; count: number }[] = [
    { label: "All", value: "all", count: inventory.length },
    { label: "Healthy", value: "Healthy", count: healthyCount },
    { label: "Low stock", value: "Low", count: lowCount },
    { label: "Out of stock", value: "Out", count: outCount },
  ];

  return (
    <FeatureShell>
      <div className="space-y-6">
        {/* Header */}
        <FeatureHeader
          title="Inventory"
          description="Warehouse-style stock management with low-stock visibility and SKU tracking."
          actions={
            <div className="flex items-center gap-2">
              <Badge className="gap-1.5 rounded-full px-3 py-1" variant="secondary">
                <Package className="h-3 w-3" />
                {inventory.length} SKUs
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={handleExport}
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Export
              </Button>
            </div>
          }
        />

        {/* Metric cards */}
        <div className="grid gap-3 md:grid-cols-4">
          {[
            {
              label: "Total SKUs",
              value: data?.metrics[0]?.value ?? "0",
              icon: Warehouse,
              sub: "tracked items",
              iconBg: "bg-blue-50 dark:bg-blue-950",
              iconColor: "text-blue-600 dark:text-blue-400",
            },
            {
              label: "Low stock",
              value: data?.metrics[1]?.value ?? "0",
              icon: TrendingDown,
              sub: "need attention",
              iconBg: "bg-amber-50 dark:bg-amber-950",
              iconColor: "text-amber-600 dark:text-amber-400",
            },
            {
              label: "Coverage",
              value: data?.metrics[2]?.value ?? "0%",
              icon: CheckCircle2,
              sub: "healthy SKUs",
              iconBg: "bg-emerald-50 dark:bg-emerald-950",
              iconColor: "text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "Stock value",
              value: `$${(totalValue / 1000).toFixed(1)}k`,
              icon: Package,
              sub: "at cost",
              iconBg: "bg-muted",
              iconColor: "text-muted-foreground",
            },
          ].map(({ label, value, icon: Icon, sub, iconBg, iconColor }) => (
            <Card key={label} className="bg-muted/40">
              <CardHeader className="pb-1">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-xs font-medium uppercase tracking-wider">
                    {label}
                  </CardDescription>
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-lg",
                      iconBg
                    )}
                  >
                    <Icon className={cn("h-3.5 w-3.5", iconColor)} />
                  </div>
                </div>
                <CardTitle className="text-3xl">{value}</CardTitle>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Table card */}
        <Card>
          {/* Card header: title + search + filters */}
          <CardHeader className="border-b pb-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Warehouse className="h-4 w-4 text-muted-foreground" />
                Stock overview
              </CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search SKU, product, brand…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 pl-8 text-xs"
                />
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1.5 flex-wrap pt-1 items-center">
              {FILTER_TABS.map(({ label, value, count }) => (
                <button
                  key={value}
                  onClick={() => handleFilterChange(value)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    alertFilter === value
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-transparent text-muted-foreground hover:bg-muted"
                  )}
                >
                  {label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                      alertFilter === value
                        ? "bg-background/20 text-background"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-muted-foreground">
                No items match your search
              </p>
            ) : (
              <>
                {/* Bulk actions bar */}
                {selected.size > 0 && (
                  <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2">
                    <p className="text-sm text-muted-foreground">
                      {selected.size} item{selected.size > 1 ? "s" : ""} selected
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelected(new Set())}
                      >
                        Clear
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleBulkRestock}
                      >
                        <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                        Restock All
                      </Button>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead className="border-b bg-muted/40">
                      <tr>
                        <th className="w-10 px-4 py-2.5">
                          <Checkbox
                            checked={
                              paginated.length > 0 &&
                              paginated.every((p) => selected.has(p.sku))
                            }
                            onCheckedChange={toggleAll}
                          />
                        </th>
                        <SortTh
                          label="Product"
                          sortKey="productName"
                          current={sortKey}
                          dir={sortDir}
                          onClick={handleSort}
                        />
                        <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          SKU
                        </th>
                        <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Category
                        </th>
                        <SortTh
                          label="Stock"
                          sortKey="stock"
                          current={sortKey}
                          dir={sortDir}
                          onClick={handleSort}
                        />
                        <SortTh
                          label="Price"
                          sortKey="price"
                          current={sortKey}
                          dir={sortDir}
                          onClick={handleSort}
                        />
                        <SortTh
                          label="Cost"
                          sortKey="cost"
                          current={sortKey}
                          dir={sortDir}
                          onClick={handleSort}
                        />
                        <SortTh
                          label="Status"
                          sortKey="alert"
                          current={sortKey}
                          dir={sortDir}
                          onClick={handleSort}
                        />
                        <th className="w-10 pr-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((row, idx) => {
                        const cfg = ALERT_CONFIG[row.alert];
                        const Icon : any = cfg.Icon;
                        const margin =
                          row.price && row.cost
                            ? Math.round(
                                ((row.price - row.cost) / row.price) * 100
                              )
                            : null;

                        return (
                          <tr
                            key={row.sku}
                            className={cn(
                              "border-b transition-colors last:border-0 hover:bg-muted/50",
                              cfg.rowClass,
                              selected.has(row.sku) && "bg-muted/80"
                            )}
                          >
                            {/* Checkbox */}
                            <td className="px-4 py-3">
                              <Checkbox
                                checked={selected.has(row.sku)}
                                onCheckedChange={() => toggleSelect(row.sku)}
                              />
                            </td>

                            {/* Product */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={cn(
                                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                                    row.alert === "Out"
                                      ? "bg-red-50 dark:bg-red-950"
                                      : row.alert === "Low"
                                      ? "bg-amber-50 dark:bg-amber-950"
                                      : "bg-muted"
                                  )}
                                >
                                  <Icon className={cn("h-4 w-4", cfg.iconClass)} />
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate font-medium leading-snug">
                                    {row.productName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {row.brand ?? "—"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* SKU */}
                            <td className="px-4 py-3">
                              <span className="font-mono text-xs text-muted-foreground">
                                {row.sku}
                              </span>
                            </td>

                            {/* Category */}
                            <td className="px-4 py-3 text-xs text-muted-foreground">
                              {row.categoryName ?? "—"}
                            </td>

                            {/* Stock bar */}
                            <td className="px-4 py-3">
                              <StockBar stock={row.stock} max={maxStock} />
                            </td>

                            {/* Price */}
                            <td className="px-4 py-3 font-medium">
                              {row.price ? `$${row.price.toFixed(2)}` : "—"}
                            </td>

                            {/* Cost + margin */}
                            <td className="px-4 py-3">
                              <div>
                                <span className="font-medium">
                                  {row.cost ? `$${row.cost.toFixed(2)}` : "—"}
                                </span>
                                {margin !== null && (
                                  <span
                                    className={cn(
                                      "ml-1.5 text-xs",
                                      margin >= 35
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : margin >= 20
                                        ? "text-amber-600 dark:text-amber-400"
                                        : "text-red-500"
                                    )}
                                  >
                                    {margin}%
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Alert badge */}
                            <td className="px-4 py-3">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "gap-1 rounded-full text-xs",
                                  cfg.badgeClass
                                )}
                              >
                                <Icon className="h-3 w-3" />
                                {cfg.label}
                              </Badge>
                            </td>

                            {/* Actions */}
                            <td className="pr-4 py-3">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => handleEditStock(row)}
                                  >
                                    <Pencil className="mr-2 h-3.5 w-3.5" />
                                    Edit Stock
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <RefreshCw className="mr-2 h-3.5 w-3.5" />
                                    Quick Restock
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <AdminPagination
                  state={pagination}
                  onStateChange={setPagination}
                  totalItems={filtered.length}
                  itemsLabel="SKUs"
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stock Edit Drawer */}
      <StockEditDrawer
        open={editDrawerOpen}
        onClose={() => {
          setEditDrawerOpen(false);
          setEditItem(null);
        }}
        item={editItem}
        onSave={handleSaveStock}
      />
    </FeatureShell>
  );
}
