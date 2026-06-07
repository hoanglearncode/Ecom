"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductFormValues } from "../types";
import { UNIT_OPTIONS, VAT_OPTIONS } from "../constants";

interface Props {
  form: ProductFormValues;
  onChange: <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) => void;
}

function NumberInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  suffix,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  required?: boolean;
  suffix?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type="number"
          min={0}
          value={value || ""}
          onChange={(event) => onChange(Number(event.target.value))}
          placeholder={placeholder ?? "0"}
          className={suffix ? "pr-10" : ""}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export function SectionPricing({ form, onChange }: Props) {
  const discount =
    form.compareAtPrice > 0 && form.price > 0
      ? Math.round(
          ((form.compareAtPrice - form.price) / form.compareAtPrice) * 100,
        )
      : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <NumberInput
          id="pf-price"
          label="Giá bán"
          value={form.price}
          onChange={(value) => onChange("price", value)}
          suffix="₫"
          required
        />
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="pf-compare">Giá gốc</Label>
            {discount > 0 && (
              <span className="text-xs text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded">
                -{discount}%
              </span>
            )}
          </div>
          <div className="relative">
            <Input
              id="pf-compare"
              type="number"
              min={0}
              value={form.compareAtPrice || ""}
              onChange={(event) =>
                onChange("compareAtPrice", Number(event.target.value))
              }
              placeholder="0"
              className="pr-7"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
              ₫
            </span>
          </div>
        </div>
        <NumberInput
          id="pf-cost"
          label="Giá nhập"
          value={form.costPrice}
          onChange={(value) => onChange("costPrice", value)}
          suffix="₫"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <NumberInput
          id="pf-stock"
          label="Số lượng tồn kho"
          value={form.stock}
          onChange={(value) => onChange("stock", value)}
          required
        />
        <NumberInput
          id="pf-lowstock"
          label="Cảnh báo tồn kho thấp"
          value={form.lowStockAlert}
          onChange={(value) => onChange("lowStockAlert", value)}
          placeholder="5"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Thuế VAT</Label>
          <Select
            value={String(form.vatRate)}
            onValueChange={(value) => onChange("vatRate", Number(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VAT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Đơn vị tính</Label>
          <Select
            value={form.unit}
            onValueChange={(value) => onChange("unit", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {UNIT_OPTIONS.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {form.costPrice > 0 && form.price > 0 && (
        <div className="rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground flex gap-4">
          <span>
            Lợi nhuận:{" "}
            <span className="font-medium text-foreground">
              {(form.price - form.costPrice).toLocaleString("vi-VN")}₫
            </span>
          </span>
          <span>
            Biên lợi nhuận:{" "}
            <span className="font-medium text-foreground">
              {Math.round(((form.price - form.costPrice) / form.price) * 100)}%
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
