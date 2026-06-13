"use client";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/features/products/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, ChevronsUpDown } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProductStatusBadge from "@/components/products/product-status-badge";
import { CategoryCombobox } from "@/components/products/product-category";
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Package,
  TrendingUp,
  AlertTriangle,
  Archive,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

type UiProductStatus = NonNullable<Product["status"]> | "out_of_stock";

type SortKey = "name" | "category" | "price" | "stock" | "updatedAt";

type NormalizedProduct = Product & {
  categoryKey: string;
  categoryLabel: string;
  displayStatus: UiProductStatus;
  updatedAt: string;
};

const toCategoryKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function ProductsTable({
  products: initialProducts,
}: {
  products: Product[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openPageBox, setOpenPageBox] = useState(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  const router = useRouter();

  const categoryOptions = useMemo(() => {
    const map = new Map<string, string>();

    products.forEach((product) => {
      const label =
        product.categoryName ?? product.categorySlug ?? "Chưa phân loại";
      const key = product.categorySlug ?? toCategoryKey(label);
      if (!map.has(key)) map.set(key, label);
    });

    if (!map.has("uncategorized")) {
      map.set("uncategorized", "Chưa phân loại");
    }

    return Array.from(map.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  }, [products]);

  const normalizedProducts = useMemo<NormalizedProduct[]>(() => {
    return products.map((product) => {
      const categoryLabel =
        product.categoryName ?? product.categorySlug ?? "Chưa phân loại";
      const categoryKey = product.categorySlug ?? toCategoryKey(categoryLabel);
      const stock = product.stock ?? 0;
      const status = product.status ?? "active";
      const displayStatus: UiProductStatus =
        status === "archived"
          ? "archived"
          : stock === 0
            ? "out_of_stock"
            : status;
      const updatedAt = product.releaseDate ?? "";

      return {
        ...product,
        sku: product.sku ?? product.id,
        description: product.description ?? "",
        stock,
        categoryKey,
        categoryLabel,
        displayStatus,
        updatedAt,
      };
    });
  }, [products]);

  const filtered = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();
    let result = normalizedProducts;

    if (normalizedQuery) {
      result = result.filter((product) => {
        const haystack =
          `${product.name} ${product.sku ?? ""} ${product.description ?? ""} ${product.brand ?? ""} ${product.categoryLabel}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      });
    }
    if (categoryFilter !== "all") {
      result = result.filter(
        (product) => product.categoryKey === categoryFilter,
      );
    }
    if (statusFilter !== "all") {
      result = result.filter(
        (product) => product.displayStatus === statusFilter,
      );
    }

    const getSortValue = (product: NormalizedProduct) => {
      if (sortBy === "category") return product.categoryLabel;
      if (sortBy === "updatedAt") return product.updatedAt ?? "";
      return product[sortBy];
    };

    result = [...result].sort((a, b) => {
      const av = getSortValue(a);
      const bv = getSortValue(b);
      if (typeof av === "number" && typeof bv === "number") {
        return sortOrder === "asc" ? av - bv : bv - av;
      }
      return sortOrder === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return result;
  }, [
    normalizedProducts,
    search,
    categoryFilter,
    statusFilter,
    sortBy,
    sortOrder,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const stats = useMemo(
    () => ({
      total: products.length,
      active: products.filter((p) => p.status === "active").length,
      lowStock: products.filter(
        (p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) < 10,
      ).length,
      outOfStock: products.filter((p) => (p.stock ?? 0) === 0).length,
    }),
    [products],
  );

  const handleSort = (col: SortKey) => {
    if (sortBy === col) setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else {
      setSortBy(col);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortBy !== col)
      return <ArrowUpDown className="ml-1 size-3.5 text-muted-foreground" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-1 size-3.5" />
    ) : (
      <ArrowDown className="ml-1 size-3.5" />
    );
  };

  const toggleSelect = (id: string) => {
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };
  const toggleAll = () => {
    if (paginated.every((p) => selected.has(p.id)))
      setSelected((s) => {
        const n = new Set(s);
        paginated.forEach((p) => n.delete(p.id));
        return n;
      });
    else
      setSelected((s) => {
        const n = new Set(s);
        paginated.forEach((p) => n.add(p.id));
        return n;
      });
  };

  const handleDelete = (id: string) => {
    setProducts((ps) => ps.filter((p) => p.id !== id));
    setSelected((s) => {
      const n = new Set(s);
      n.delete(id);
      return n;
    });
  };

  const handleDeleteSelected = () => {
    setProducts((ps) => ps.filter((p) => !selected.has(p.id)));
    setSelected(new Set());
  };

  const formatPrice = (price: number) => {
    const currency =
      products.find((product) => product.currency)?.currency ?? "USD";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency,
    }).format(price);
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Package,
            label: "Tổng sản phẩm",
            value: stats.total,
            color: "text-blue-600",
          },
          {
            icon: TrendingUp,
            label: "Đang bán",
            value: stats.active,
            color: "text-emerald-600",
          },
          {
            icon: AlertTriangle,
            label: "Sắp hết hàng",
            value: stats.lowStock,
            color: "text-yellow-600",
          },
          {
            icon: Archive,
            label: "Hết hàng",
            value: stats.outOfStock,
            color: "text-red-600",
          },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label} className="gap-3 py-4">
            <CardContent className="px-5 flex items-center gap-3">
              <div className={cn("p-2 rounded-lg bg-muted", color)}>
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Table Card */}
      <Card className="gap-0 py-0">
        <CardHeader className="px-6 py-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Danh sách sản phẩm</h2>
              <p className="text-sm text-muted-foreground">
                {filtered.length} sản phẩm
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {selected.size > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteSelected}
                >
                  <Trash2 className="size-4" />
                  Xóa ({selected.size})
                </Button>
              )}
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => router.push("/admin/products/new")}
              >
                <Plus className="size-4" />
                Thêm sản phẩm
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên, SKU..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
            <CategoryCombobox
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              setPage={setPage}
              categoryOptions={categoryOptions}
            />
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang bán</SelectItem>
                <SelectItem value="draft">Nháp</SelectItem>
                <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                <SelectItem value="archived">Lưu trữ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10 pl-6">
                  <Checkbox
                    checked={
                      paginated.length > 0 &&
                      paginated.every((p) => selected.has(p.id))
                    }
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead>
                  <button
                    className="flex items-center font-medium hover:text-foreground transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    Sản phẩm <SortIcon col="name" />
                  </button>
                </TableHead>
                <TableHead className="hidden md:table-cell">SKU</TableHead>
                <TableHead className="hidden sm:table-cell">
                  <button
                    className="flex items-center font-medium hover:text-foreground transition-colors"
                    onClick={() => handleSort("category")}
                  >
                    Danh mục <SortIcon col="category" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    className="flex items-center font-medium hover:text-foreground transition-colors"
                    onClick={() => handleSort("price")}
                  >
                    Giá <SortIcon col="price" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    className="flex items-center font-medium hover:text-foreground transition-colors"
                    onClick={() => handleSort("stock")}
                  >
                    Tồn kho <SortIcon col="stock" />
                  </button>
                </TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="hidden lg:table-cell">
                  <button
                    className="flex items-center font-medium hover:text-foreground transition-colors"
                    onClick={() => handleSort("updatedAt")}
                  >
                    Cập nhật <SortIcon col="updatedAt" />
                  </button>
                </TableHead>
                <TableHead className="w-10 pr-4"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="py-16 text-center text-muted-foreground"
                  >
                    <Package className="size-10 mx-auto mb-2 opacity-30" />
                    Không tìm thấy sản phẩm nào
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((product) => {
                  const stock = product.stock ?? 0;

                  return (
                    <TableRow
                      key={product.id}
                      data-state={
                        selected.has(product.id) ? "selected" : undefined
                      }
                    >
                      <TableCell className="pl-6">
                        <Checkbox
                          checked={selected.has(product.id)}
                          onCheckedChange={() => toggleSelect(product.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-lg bg-muted flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
                            {product.thumbnail ? (
                              <img
                                src={product.thumbnail}
                                alt={product.name}
                                className="size-9 object-cover"
                              />
                            ) : (
                              <span className="text-xs font-semibold max-w-[1ch]">
                                {product.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm leading-tight line-clamp-1">
                              {product.name}
                            </p>
                            <p className="hidden max-w-md text-wrap text-xs text-muted-foreground line-clamp-1 sm:block">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-xs text-muted-foreground">
                        {product.sku}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline" className="text-xs">
                          {product.categoryLabel}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-sm">
                        {formatPrice(product.price)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "text-sm font-medium",
                            stock === 0
                              ? "text-red-600"
                              : stock < 10
                                ? "text-yellow-600"
                                : "text-foreground",
                          )}
                        >
                          {stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <ProductStatusBadge status={product.displayStatus} />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {product.updatedAt || "—"}
                      </TableCell>
                      <TableCell className="pr-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setViewProduct(product)}
                            >
                              <Eye className="size-4" /> Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/admin/products/${product.id}/edit`)
                              }
                            >
                              <Pencil className="size-4" /> Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 className="size-4" /> Xóa sản phẩm
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* Pagination */}
        <div className="px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>Hiển thị</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                setPageSize(Number(v));
                setPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>/ {filtered.length} sản phẩm</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              <ChevronsLeft className="size-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="size-4" />
            </Button>

            {/* PAGE COMBOBOX */}

            <Popover open={openPageBox} onOpenChange={setOpenPageBox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="min-w-[130px] justify-between"
                >
                  <span>
                    Trang {page} / {totalPages}
                  </span>

                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[220px] p-0">
                <Command>
                  <CommandInput placeholder="Tìm trang..." />

                  <CommandList>
                    <CommandEmpty>Không tìm thấy trang.</CommandEmpty>

                    <CommandGroup className="max-h-[300px] overflow-auto">
                      {Array.from(
                        { length: totalPages },
                        (_, i) => i + 1
                      ).map((p) => (
                        <CommandItem
                          key={p}
                          value={`Trang ${p}`}
                          onSelect={() => {
                            setPage(p);
                            setOpenPageBox(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              page === p
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />

                          Trang {p}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() =>
                setPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={page === totalPages}
            >
              <ChevronRight className="size-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* View Dialog */}
      <Dialog
        open={!!viewProduct}
        onOpenChange={(open) => { if (!open) setViewProduct(null); }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Chi tiết sản phẩm</DialogTitle>
          </DialogHeader>
          {viewProduct && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-xl bg-muted flex items-center justify-center text-4xl overflow-hidden">
                  {viewProduct.thumbnail ? (
                    <img
                      src={viewProduct.thumbnail}
                      alt={viewProduct.name}
                      className="size-16 object-cover"
                    />
                  ) : (
                    <span className="text-lg font-semibold">
                      {viewProduct.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{viewProduct.name}</h3>
                  <p className="text-sm text-muted-foreground font-mono">
                    {viewProduct.sku ?? viewProduct.id}
                  </p>
                  <ProductStatusBadge
                    status={
                      viewProduct.status === "archived"
                        ? "archived"
                        : (viewProduct.stock ?? 0) === 0
                          ? "out_of_stock"
                          : (viewProduct.status ?? "active")
                    }
                  />
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  [
                    "Danh mục",
                    viewProduct.categoryName ??
                      viewProduct.categorySlug ??
                      "Chưa phân loại",
                  ],
                  ["Giá bán", formatPrice(viewProduct.price)],
                  ["Tồn kho", `${viewProduct.stock ?? 0} sản phẩm`],
                  ["Mô tả", viewProduct.description ?? "—"],
                  ["Ngày tạo", viewProduct.releaseDate ?? "—"],
                  ["Cập nhật", viewProduct.releaseDate ?? "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-medium text-right">{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewProduct(null)}
                >
                  Đóng
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setViewProduct(null);
                    router.push(`/admin/products/${viewProduct.id}/edit`);
                  }}
                >
                  <Pencil className="size-3.5" /> Chỉnh sửa
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
