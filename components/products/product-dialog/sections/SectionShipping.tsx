"use client";

import { Globe, Store, Truck, Zap } from "lucide-react";
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
import type { ProductFormValues } from "../types";
import { SHIPPING_METHODS } from "../constants";

interface Props {
  form: ProductFormValues;
  onChange: <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) => void;
}

const SHIPPING_FEE_OPTIONS = [
  { value: "buyer_pays", label: "Người mua trả" },
  { value: "free", label: "Miễn phí vận chuyển" },
  { value: "custom", label: "Tùy chỉnh" },
];

const SHIPPING_ICONS: Record<string, React.ElementType> = {
  fast: Truck,
  pickup: Store,
  express: Zap,
  international: Globe,
};

export function SectionShipping({ form, onChange }: Props) {
  const toggleMethod = (id: string) => {
    const current = form.shippingMethods;
    onChange(
      "shippingMethods",
      current.includes(id)
        ? current.filter((method) => method !== id)
        : [...current, id],
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="pf-weight">Cân nặng (gram)</Label>
          <Input
            id="pf-weight"
            type="number"
            min={0}
            value={form.weight || ""}
            onChange={(event) => onChange("weight", Number(event.target.value))}
            placeholder="0"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Phí giao hàng</Label>
          <Select
            value={form.shippingFeeType}
            onValueChange={(value) =>
              onChange(
                "shippingFeeType",
                value as ProductFormValues["shippingFeeType"],
              )
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SHIPPING_FEE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">Kích thước đóng gói</Label>
        <div className="grid grid-cols-3 gap-3">
          {(
            [
              { key: "length", label: "Dài (cm)" },
              { key: "width", label: "Rộng (cm)" },
              { key: "height", label: "Cao (cm)" },
            ] as const
          ).map(({ key, label }) => (
            <div key={key} className="space-y-1">
              <Label
                htmlFor={`pf-${key}`}
                className="text-xs text-muted-foreground"
              >
                {label}
              </Label>
              <Input
                id={`pf-${key}`}
                type="number"
                min={0}
                value={form[key] || ""}
                onChange={(event) => onChange(key, Number(event.target.value))}
                placeholder="0"
                className="h-8 text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Phương thức vận chuyển hỗ trợ</Label>
        <div className="grid grid-cols-2 gap-2">
          {SHIPPING_METHODS.map((method) => {
            const Icon : any = SHIPPING_ICONS[method.id] ?? Truck;
            return (
              <label
                key={method.id}
                className="flex items-center gap-2.5 rounded-md border p-2.5 cursor-pointer hover:bg-muted/40 transition-colors"
              >
                <Checkbox
                  checked={form.shippingMethods.includes(method.id)}
                  onCheckedChange={() => toggleMethod(method.id)}
                />
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{method.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
