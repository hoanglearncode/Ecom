"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ProductFormValues } from "../types";

interface Props {
  form: ProductFormValues;
  onChange: <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) => void;
}

export function SectionBasicInfo({ form, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="pf-name">
          Tên sản phẩm <span className="text-red-500">*</span>
        </Label>
        <Input
          id="pf-name"
          value={form.name}
          onChange={(event) => onChange("name", event.target.value)}
          placeholder="Vd: Áo thun unisex basic cotton 100%"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="pf-sku">
            Mã SKU <span className="text-red-500">*</span>
          </Label>
          <Input
            id="pf-sku"
            value={form.sku}
            onChange={(event) => onChange("sku", event.target.value)}
            placeholder="VD: APPL-IP15-256"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pf-barcode">Mã vạch (Barcode)</Label>
          <Input
            id="pf-barcode"
            value={form.barcode}
            onChange={(event) => onChange("barcode", event.target.value)}
            placeholder="ISBN, UPC, GTIN..."
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="pf-short">Mô tả ngắn</Label>
          <span className="text-xs text-muted-foreground">
            {form.shortDescription.length}/160
          </span>
        </div>
        <Input
          id="pf-short"
          value={form.shortDescription}
          onChange={(event) =>
            onChange("shortDescription", event.target.value.slice(0, 160))
          }
          placeholder="Hiển thị ở kết quả tìm kiếm (≤160 ký tự)"
          maxLength={160}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pf-desc">Mô tả chi tiết</Label>
        <Textarea
          id="pf-desc"
          value={form.description}
          onChange={(event) => onChange("description", event.target.value)}
          placeholder="Mô tả đầy đủ tính năng, chất liệu, hướng dẫn sử dụng..."
          className="min-h-[120px] resize-y"
        />
      </div>
    </div>
  );
}
