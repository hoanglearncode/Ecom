"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AttributeGroup, ProductFormValues } from "../types";
import { buildVariants, generateId } from "../helpers";

interface Props {
  form: ProductFormValues;
  onChange: <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) => void;
}

const VARIANT_STATUS_OPTIONS = [
  { value: "active", label: "Đang bán" },
  { value: "out_of_stock", label: "Hết hàng" },
  { value: "hidden", label: "Ẩn" },
];

function AttributeGroupRow({
  group,
  onUpdate,
  onRemove,
}: {
  group: AttributeGroup;
  onUpdate: (updated: AttributeGroup) => void;
  onRemove: () => void;
}) {
  const [inputValue, setInputValue] = useState("");

  const addValue = () => {
    const value = inputValue.trim();
    if (!value || group.values.includes(value)) return;
    onUpdate({ ...group, values: [...group.values, value] });
    setInputValue("");
  };

  const removeValue = (value: string) =>
    onUpdate({
      ...group,
      values: group.values.filter((item) => item !== value),
    });

  return (
    <div className="rounded-md border p-3 space-y-2.5 bg-muted/20">
      <div className="flex items-center gap-2">
        <Input
          value={group.name}
          onChange={(event) => onUpdate({ ...group, name: event.target.value })}
          placeholder="Tên thuộc tính (vd: Màu sắc)"
          className="flex-1 h-8 text-sm"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5 min-h-[28px]">
        {group.values.map((value) => (
          <Badge
            key={value}
            variant="secondary"
            className="gap-1 cursor-default pr-1"
          >
            {value}
            <button
              type="button"
              className="hover:text-destructive ml-0.5 leading-none"
              onClick={() => removeValue(value)}
            >
              ×
            </button>
          </Badge>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addValue();
            }
          }}
          placeholder="Thêm giá trị, nhấn Enter..."
          className="h-8 text-sm"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 shrink-0"
          onClick={addValue}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function SectionVariants({ form, onChange }: Props) {
  const [showAllVariants, setShowAllVariants] = useState(false);

  const updateGroups = (groups: AttributeGroup[]) => {
    const variants = buildVariants(groups, form.variants);
    onChange("attributeGroups", groups);
    onChange("variants", variants);
  };

  const addGroup = () => {
    updateGroups([
      ...form.attributeGroups,
      { id: generateId(), name: "", values: [] },
    ]);
  };

  const updateGroup = (index: number, updated: AttributeGroup) => {
    const next = [...form.attributeGroups];
    next[index] = updated;
    updateGroups(next);
  };

  const removeGroup = (index: number) => {
    updateGroups(form.attributeGroups.filter((_, idx) => idx !== index));
  };

  const displayedVariants = showAllVariants
    ? form.variants
    : form.variants.slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-sm font-medium">
            Sản phẩm có nhiều biến thể?
          </Label>
          <p className="text-xs text-muted-foreground">
            Bật nếu sản phẩm có màu sắc, kích thước, v.v.
          </p>
        </div>
        <Switch
          checked={form.hasVariants}
          onCheckedChange={(value) => onChange("hasVariants", value)}
        />
      </div>

      {form.hasVariants && (
        <>
          <div className="space-y-2">
            <Label className="text-sm">Nhóm thuộc tính</Label>
            {form.attributeGroups.map((group, index) => (
              <AttributeGroupRow
                key={group.id}
                group={group}
                onUpdate={(updated) => updateGroup(index, updated)}
                onRemove={() => removeGroup(index)}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={addGroup}
            >
              <Plus className="h-3.5 w-3.5" />
              Thêm thuộc tính
            </Button>
          </div>

          {form.variants.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">
                  Bảng biến thể{" "}
                  <span className="text-muted-foreground font-normal">
                    ({form.variants.length} biến thể)
                  </span>
                </Label>
              </div>

              <div className="rounded-md border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="text-left px-3 py-2 font-medium text-muted-foreground text-xs whitespace-nowrap">
                        Biến thể
                      </th>
                      <th className="text-left px-3 py-2 font-medium text-muted-foreground text-xs">
                        SKU
                      </th>
                      <th className="text-left px-3 py-2 font-medium text-muted-foreground text-xs">
                        Giá (₫)
                      </th>
                      <th className="text-left px-3 py-2 font-medium text-muted-foreground text-xs">
                        Tồn kho
                      </th>
                      <th className="text-left px-3 py-2 font-medium text-muted-foreground text-xs">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedVariants.map((variant, index) => (
                      <tr key={variant.id} className="border-b last:border-0">
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {Object.values(variant.combination).map((value) => (
                              <Badge
                                key={value}
                                variant="outline"
                                className="text-xs py-0"
                              >
                                {value}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            value={variant.sku}
                            onChange={(event) => {
                              const next = [...form.variants];
                              next[index] = {
                                ...next[index],
                                sku: event.target.value,
                              };
                              onChange("variants", next);
                            }}
                            className="h-7 text-xs w-28"
                            placeholder="SKU"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            type="number"
                            min={0}
                            value={variant.price || ""}
                            onChange={(event) => {
                              const next = [...form.variants];
                              next[index] = {
                                ...next[index],
                                price: Number(event.target.value),
                              };
                              onChange("variants", next);
                            }}
                            className="h-7 text-xs w-24"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            type="number"
                            min={0}
                            value={variant.stock || ""}
                            onChange={(event) => {
                              const next = [...form.variants];
                              next[index] = {
                                ...next[index],
                                stock: Number(event.target.value),
                              };
                              onChange("variants", next);
                            }}
                            className="h-7 text-xs w-16"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Select
                            value={variant.status}
                            onValueChange={(value) => {
                              const next = [...form.variants];
                              next[index] = {
                                ...next[index],
                                status: value as typeof variant.status,
                              };
                              onChange("variants", next);
                            }}
                          >
                            <SelectTrigger className="h-7 text-xs w-28">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {VARIANT_STATUS_OPTIONS.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                  className="text-xs"
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {form.variants.length > 5 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs w-full"
                  onClick={() => setShowAllVariants((value) => !value)}
                >
                  {showAllVariants ? (
                    <>
                      <ChevronUp className="h-3.5 w-3.5 mr-1" />
                      Thu gọn
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3.5 w-3.5 mr-1" />
                      Xem tất cả {form.variants.length} biến thể
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
