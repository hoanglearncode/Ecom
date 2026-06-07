"use client";

import { useRef } from "react";
import { GripVertical, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductFormValues, ProductImage } from "../types";
import { generateId } from "../helpers";

interface Props {
  form: ProductFormValues;
  onChange: <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) => void;
}

export function SectionImages({ form, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newImages: ProductImage[] = Array.from(files).map((file, index) => ({
      id: generateId(),
      url: URL.createObjectURL(file),
      file,
      isPrimary: form.images.length === 0 && index === 0,
    }));
    onChange("images", [...form.images, ...newImages]);
  };

  const removeImage = (id: string) => {
    const next = form.images.filter((img) => img.id !== id);
    if (next.length > 0 && !next.some((img) => img.isPrimary)) {
      next[0].isPrimary = true;
    }
    onChange("images", next);
  };

  const setPrimary = (id: string) => {
    onChange(
      "images",
      form.images.map((img) => ({ ...img, isPrimary: img.id === id })),
    );
  };

  return (
    <div className="space-y-3">
      <div
        className="border border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-foreground/40 transition-colors bg-muted/30"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          handleFiles(event.dataTransfer.files);
        }}
      >
        <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          Kéo & thả hoặc{" "}
          <span className="font-medium text-foreground underline underline-offset-2">
            chọn ảnh
          </span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          PNG, JPG, WEBP — tối đa 10MB mỗi ảnh · Tỷ lệ 1:1 được khuyến nghị
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>

      {form.images.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {form.images.map((img) => (
            <div
              key={img.id}
              className={cn(
                "relative aspect-square rounded-md overflow-hidden border cursor-pointer group",
                img.isPrimary ? "border-2 border-red-500" : "border-border",
              )}
              onClick={() => setPrimary(img.id)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt=""
                className="w-full h-full object-cover"
              />
              {img.isPrimary && (
                <span className="absolute bottom-0 left-0 right-0 text-[10px] text-center bg-red-500 text-white py-0.5">
                  Ảnh chính
                </span>
              )}
              <button
                type="button"
                className="absolute top-1 right-1 p-0.5 rounded bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(event) => {
                  event.stopPropagation();
                  removeImage(img.id);
                }}
              >
                <X className="h-3 w-3" />
              </button>
              <GripVertical className="absolute top-1 left-1 h-3 w-3 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
          <div
            className="aspect-square rounded-md border border-dashed flex items-center justify-center cursor-pointer hover:border-foreground/40 transition-colors text-muted-foreground"
            onClick={() => inputRef.current?.click()}
          >
            <UploadCloud className="h-5 w-5" />
          </div>
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Click vào ảnh để đặt làm ảnh chính. Tối đa 10 ảnh.
      </p>
    </div>
  );
}
