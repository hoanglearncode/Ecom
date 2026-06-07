"use client";

import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type {
  BrandOption,
  CategoryOption,
  ProductFormValues,
  SupplierOption,
} from "../types";
import {
  ORIGIN_OPTIONS,
  RETURN_POLICY_OPTIONS,
  STATUS_OPTIONS,
  WARRANTY_OPTIONS,
} from "../constants";

const STATUS_DOT: Record<string, string> = {
  active: "bg-green-500",
  draft: "bg-gray-400",
  archived: "bg-yellow-500",
  out_of_stock: "bg-red-400",
};

const STATUS_SELECTED_STYLE: Record<string, string> = {
  active:
    "border-green-500 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200",
  draft: "border-gray-400 bg-gray-50 text-gray-700 dark:bg-gray-900",
  archived: "border-yellow-500 bg-yellow-50 text-yellow-800 dark:bg-yellow-950",
  out_of_stock: "border-red-400 bg-red-50 text-red-800 dark:bg-red-950",
};

interface StatusCardProps {
  form: ProductFormValues;
  onChange: <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) => void;
}

export function StatusCard({ form, onChange }: StatusCardProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Trạng thái xuất bản
        </Label>
        <div className="space-y-1.5">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange("status", option.value)}
              className={cn(
                "w-full flex items-center gap-2.5 rounded-md border px-3 py-2 text-sm transition-colors text-left",
                form.status === option.value
                  ? STATUS_SELECTED_STYLE[option.value]
                  : "hover:bg-muted/50",
              )}
            >
              <span
                className={cn(
                  "inline-block h-2 w-2 rounded-full shrink-0",
                  STATUS_DOT[option.value],
                )}
              />
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pf-publish" className="text-xs text-muted-foreground">
          Hẹn giờ đăng bán
        </Label>
        <Input
          id="pf-publish"
          type="datetime-local"
          value={form.publishAt}
          onChange={(event) => onChange("publishAt", event.target.value)}
          className="text-sm h-8"
        />
      </div>
    </div>
  );
}

interface CategoryCardProps {
  form: ProductFormValues;
  categories: CategoryOption[];
  onChange: <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) => void;
}

export function CategoryCard({
  form,
  categories,
  onChange,
}: CategoryCardProps) {
  const [search, setSearch] = useState("");
  const filtered = categories.filter(
    (category) =>
      !search || category.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Danh mục
      </Label>
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Tìm danh mục..."
        className="h-8 text-sm"
      />
      <div className="max-h-44 overflow-y-auto space-y-0.5 pr-1">
        {filtered.map((category) => (
          <button
            key={category.value}
            type="button"
            onClick={() => onChange("categoryKey", category.value)}
            className={cn(
              "w-full flex items-center gap-2 rounded px-2 py-1.5 text-sm text-left transition-colors",
              category.parentValue ? "pl-5" : "",
              form.categoryKey === category.value
                ? "bg-muted font-medium"
                : "hover:bg-muted/50 text-muted-foreground",
            )}
          >
            {form.categoryKey === category.value ? (
              <Check className="h-3.5 w-3.5 shrink-0 text-green-600" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            )}
            {category.label}
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-xs text-muted-foreground px-2 py-2">
            Không tìm thấy danh mục
          </p>
        )}
      </div>
    </div>
  );
}

interface BrandCardProps {
  form: ProductFormValues;
  brands: BrandOption[];
  suppliers: SupplierOption[];
  onChange: <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) => void;
}

export function BrandCard({
  form,
  brands,
  suppliers,
  onChange,
}: BrandCardProps) {
  return (
    <div className="space-y-3">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Thương hiệu & nhà cung cấp
      </Label>

      <div className="space-y-1.5">
        <Label htmlFor="pf-brand" className="text-xs">
          Thương hiệu
        </Label>
        <Select
          value={form.brandKey}
          onValueChange={(value) => onChange("brandKey", value)}
        >
          <SelectTrigger id="pf-brand" className="h-8 text-sm">
            <SelectValue placeholder="Chọn thương hiệu" />
          </SelectTrigger>
          <SelectContent>
            {brands.map((brand) => (
              <SelectItem
                key={brand.value}
                value={brand.value}
                className="text-sm"
              >
                {brand.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pf-supplier" className="text-xs">
          Nhà cung cấp
        </Label>
        <Select
          value={form.supplierKey}
          onValueChange={(value) => onChange("supplierKey", value)}
        >
          <SelectTrigger id="pf-supplier" className="h-8 text-sm">
            <SelectValue placeholder="Chọn nhà cung cấp" />
          </SelectTrigger>
          <SelectContent>
            {suppliers.map((supplier) => (
              <SelectItem
                key={supplier.value}
                value={supplier.value}
                className="text-sm"
              >
                {supplier.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pf-origin" className="text-xs">
          Xuất xứ
        </Label>
        <Select
          value={form.origin}
          onValueChange={(value) => onChange("origin", value)}
        >
          <SelectTrigger id="pf-origin" className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ORIGIN_OPTIONS.map((origin) => (
              <SelectItem key={origin} value={origin} className="text-sm">
                {origin}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

interface PolicyCardProps {
  form: ProductFormValues;
  onChange: <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) => void;
}

export function PolicyCard({ form, onChange }: PolicyCardProps) {
  return (
    <div className="space-y-3">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Chứng nhận & chính sách
      </Label>

      <div className="space-y-1.5">
        <Label htmlFor="pf-return" className="text-xs">
          Chính sách đổi trả
        </Label>
        <Select
          value={form.returnPolicy}
          onValueChange={(value) => onChange("returnPolicy", value)}
        >
          <SelectTrigger id="pf-return" className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RETURN_POLICY_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-sm"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pf-warranty" className="text-xs">
          Bảo hành
        </Label>
        <Select
          value={form.warranty}
          onValueChange={(value) => onChange("warranty", value)}
        >
          <SelectTrigger id="pf-warranty" className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {WARRANTY_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-sm"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <Checkbox
            checked={form.isAuthentic}
            onCheckedChange={(value) => onChange("isAuthentic", !!value)}
          />
          Sản phẩm chính hãng
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <Checkbox
            checked={form.isNew}
            onCheckedChange={(value) => onChange("isNew", !!value)}
          />
          Hàng mới 100%
        </label>
      </div>
    </div>
  );
}
