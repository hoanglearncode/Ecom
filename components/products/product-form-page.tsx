"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Package,
  ImageIcon,
  DollarSign,
  Layers,
  Truck,
  Search,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import type {
  BrandOption,
  CategoryOption,
  ProductFormValues,
  SupplierOption,
} from "./product-dialog/types";
import {
  DEFAULT_BRANDS,
  DEFAULT_CATEGORIES,
  DEFAULT_SUPPLIERS,
  DEFAULT_VALUES,
} from "./product-dialog/defaults";
import { SectionBasicInfo } from "./product-dialog/sections/SectionBasicInfo";
import { SectionImages } from "./product-dialog/sections/SectionImages";
import { SectionPricing } from "./product-dialog/sections/SectionPricing";
import { SectionVariants } from "./product-dialog/sections/SectionVariants";
import { SectionShipping } from "./product-dialog/sections/SectionShipping";
import { SectionSeo } from "./product-dialog/sections/SectionSeo";
import {
  BrandCard,
  CategoryCard,
  PolicyCard,
  StatusCard,
} from "./product-dialog/sidebar/SidebarCards";

export interface ProductFormPageProps {
  product?: Partial<ProductFormValues>;
  categories?: CategoryOption[];
  brands?: BrandOption[];
  suppliers?: SupplierOption[];
  backHref?: string;
  onSubmit: (data: ProductFormValues) => void | Promise<void>;
}

type SectionId =
  | "basic"
  | "images"
  | "pricing"
  | "variants"
  | "shipping"
  | "seo";

const SECTIONS: { id: SectionId; label: string; Icon: React.ElementType }[] = [
  { id: "basic", label: "Thông tin", Icon: Package },
  { id: "images", label: "Hình ảnh", Icon: ImageIcon },
  { id: "pricing", label: "Giá & kho", Icon: DollarSign },
  { id: "variants", label: "Biến thể", Icon: Layers },
  { id: "shipping", label: "Vận chuyển", Icon: Truck },
  { id: "seo", label: "SEO", Icon: Search },
];

export function ProductFormPage({
  product,
  categories = DEFAULT_CATEGORIES,
  brands = DEFAULT_BRANDS,
  suppliers = DEFAULT_SUPPLIERS,
  backHref = "/admin/products",
  onSubmit,
}: ProductFormPageProps) {
  const [form, setForm] = useState<ProductFormValues>({
    ...DEFAULT_VALUES,
    ...product,
  });
  const [activeSection, setActiveSection] = useState<SectionId>("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!product?.name;

  useEffect(() => {
    setForm({ ...DEFAULT_VALUES, ...product });
    setActiveSection("basic");
  }, [product]);

  const onChange = useCallback(
    <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleSubmit = async (status: ProductFormValues["status"]) => {
    setIsSubmitting(true);
    try {
      await onSubmit({ ...form, status });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionProps = useMemo(() => ({ form, onChange }), [form, onChange]);

  const sectionContent: Record<SectionId, React.ReactNode> = {
    basic: <SectionBasicInfo {...sectionProps} />,
    images: <SectionImages {...sectionProps} />,
    pricing: <SectionPricing {...sectionProps} />,
    variants: <SectionVariants {...sectionProps} />,
    shipping: <SectionShipping {...sectionProps} />,
    seo: <SectionSeo {...sectionProps} />,
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b bg-background shrink-0">
        <Link
          href={backHref}
          className="flex items-center justify-center size-8 rounded-lg border border-border hover:bg-muted transition-colors"
        >
          <ChevronLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-base font-semibold leading-tight">
            {isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {isEditing
              ? "Cập nhật thông tin sản phẩm"
              : "Điền thông tin để tạo sản phẩm mới"}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Left: section nav + content */}
        <div className="flex flex-col flex-1 min-w-0 border-r">
          <nav className="flex items-center gap-0.5 px-4 py-2 border-b bg-muted/30 shrink-0 overflow-x-auto">
            {SECTIONS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveSection(id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded text-sm whitespace-nowrap transition-colors",
                  activeSection === id
                    ? "bg-background border border-border text-foreground shadow-sm font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </nav>

          <ScrollArea className="flex-1">
            <div className="p-6 max-w-5xl">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {SECTIONS.find((s) => s.id === activeSection)?.label}
                </h3>
                <Separator className="mt-2" />
              </div>
              {sectionContent[activeSection]}
            </div>
          </ScrollArea>
        </div>

        {/* Right: sidebar */}
        <ScrollArea className="w-72 shrink-0">
          <div className="p-4 space-y-5">
            <StatusCard form={form} onChange={onChange} />
            <Separator />
            <CategoryCard
              form={form}
              categories={categories}
              onChange={onChange}
            />
            <Separator />
            <BrandCard
              form={form}
              brands={brands}
              suppliers={suppliers}
              onChange={onChange}
            />
            <Separator />
            <PolicyCard form={form} onChange={onChange} />

            {isEditing && (
              <>
                <Separator />
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Thống kê
                  </p>
                  {[
                    ["Lượt xem", "—"],
                    ["Đã bán", "—"],
                    ["Ngày tạo", "—"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between text-xs text-muted-foreground py-1 border-b last:border-0"
                    >
                      <span>{label}</span>
                      <span className="font-medium text-foreground">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-3 border-t bg-muted/20 shrink-0">
        <Link href={backHref}>
          <Button type="button" variant="ghost" size="sm" disabled={isSubmitting}>
            Hủy
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSubmitting}
            onClick={() => handleSubmit("draft")}
          >
            Lưu nháp
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isSubmitting || !form.name || !form.sku}
            onClick={() => handleSubmit("active")}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isSubmitting
              ? "Đang lưu..."
              : isEditing
                ? "Cập nhật"
                : "Đăng sản phẩm"}
          </Button>
        </div>
      </div>
    </div>
  );
}
