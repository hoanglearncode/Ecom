"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProductFormValues } from "../types";
import { toSlug } from "../helpers";

interface Props {
  form: ProductFormValues;
  onChange: <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) => void;
}

export function SectionSeo({ form, onChange }: Props) {
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (form.name && !form.seoTitle) {
      onChange("seoTitle", form.name);
    }
    if (form.name && !form.seoSlug) {
      onChange("seoSlug", toSlug(form.name));
    }
    if (form.shortDescription && !form.seoDescription) {
      onChange("seoDescription", form.shortDescription);
    }
  }, [
    form.name,
    form.seoTitle,
    form.seoSlug,
    form.shortDescription,
    form.seoDescription,
    onChange,
  ]);

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || form.tags.includes(trimmed)) return;
    onChange("tags", [...form.tags, trimmed]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    onChange(
      "tags",
      form.tags.filter((item) => item !== tag),
    );
  };

  const titleLength = form.seoTitle.length;
  const titleColor =
    titleLength === 0
      ? "text-muted-foreground"
      : titleLength <= 60
        ? "text-green-600"
        : titleLength <= 70
          ? "text-yellow-600"
          : "text-red-500";

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-muted/20 p-3 space-y-0.5">
        <p className="text-xs text-muted-foreground mb-1.5">
          Xem trước trên Google
        </p>
        <p className="text-xs text-green-700">
          shopname.com › san-pham ›{" "}
          <span>{form.seoSlug || "ten-san-pham"}</span>
        </p>
        <p className="text-sm font-medium text-blue-700 leading-snug line-clamp-1">
          {form.seoTitle || "Tiêu đề sản phẩm — Shop của bạn"}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {form.seoDescription || "Mô tả sẽ hiển thị ở đây..."}
        </p>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="pf-seotitle">Tiêu đề SEO</Label>
          <span className={`text-xs ${titleColor}`}>{titleLength}/70</span>
        </div>
        <Input
          id="pf-seotitle"
          value={form.seoTitle}
          onChange={(event) => onChange("seoTitle", event.target.value)}
          placeholder="Tên sản phẩm — Shop của bạn"
          maxLength={80}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pf-seoslug">URL thân thiện (Slug)</Label>
        <div className="flex items-center gap-0">
          <span className="text-xs text-muted-foreground bg-muted border border-r-0 rounded-l-md px-2 h-9 flex items-center shrink-0">
            /san-pham/
          </span>
          <Input
            id="pf-seoslug"
            value={form.seoSlug}
            onChange={(event) =>
              onChange("seoSlug", toSlug(event.target.value))
            }
            className="rounded-l-none"
            placeholder="ten-san-pham"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="pf-seodesc">Mô tả meta</Label>
          <span className="text-xs text-muted-foreground">
            {form.seoDescription.length}/160
          </span>
        </div>
        <Input
          id="pf-seodesc"
          value={form.seoDescription}
          onChange={(event) =>
            onChange("seoDescription", event.target.value.slice(0, 160))
          }
          placeholder="Mô tả ngắn cho công cụ tìm kiếm"
          maxLength={160}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Từ khóa / Tags</Label>
        <div
          className="flex flex-wrap gap-1.5 min-h-[40px] p-2 rounded-md border cursor-text focus-within:ring-1 focus-within:ring-ring"
          onClick={() =>
            (
              document.getElementById("pf-taginput") as HTMLInputElement
            )?.focus()
          }
        >
          {form.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 pr-1 text-xs">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-destructive"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </Badge>
          ))}
          <input
            id="pf-taginput"
            value={tagInput}
            onChange={(event) => setTagInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === ",") {
                event.preventDefault();
                addTag(tagInput);
              }
              if (
                event.key === "Backspace" &&
                !tagInput &&
                form.tags.length > 0
              ) {
                onChange("tags", form.tags.slice(0, -1));
              }
            }}
            placeholder={
              form.tags.length === 0 ? "Nhập tag, nhấn Enter..." : ""
            }
            className="flex-1 min-w-[100px] bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Nhấn Enter hoặc dấu phẩy để thêm tag
        </p>
      </div>
    </div>
  );
}
