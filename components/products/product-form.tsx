"use client";

import { useState, useCallback } from "react";
import { Package, ImageIcon, DollarSign, Layers, Truck, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import type { ProductFormValues, CategoryOption, BrandOption, SupplierOption } from "./product-dialog/types";
import { DEFAULT_VALUES } from "./product-dialog/defaults";
import { SectionBasicInfo } from "./product-dialog/sections/SectionBasicInfo";
import { SectionImages } from "./product-dialog/sections/SectionImages";
import { SectionPricing } from "./product-dialog/sections/SectionPricing";
import { SectionVariants } from "./product-dialog/sections/SectionVariants";
import { SectionShipping } from "./product-dialog/sections/SectionShipping";
import { SectionSeo } from "./product-dialog/sections/SectionSeo";
import { StatusCard, CategoryCard, BrandCard, PolicyCard } from "./product-dialog/sidebar/SidebarCards";

// ─── Types ────────────────────────────────────────────────────────────────────

export type { ProductFormValues };

export interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pass an existing product to edit; omit for create mode */
  product?: Partial<ProductFormValues>;
  categories?: CategoryOption[];
  brands?: BrandOption[];
  suppliers?: SupplierOption[];
  onSubmit: (data: ProductFormValues) => void | Promise<void>;
}

// ─── Section nav ─────────────────────────────────────────────────────────────

type SectionId = "basic" | "images" | "pricing" | "variants" | "shipping" | "seo";

const SECTIONS: { id: SectionId; label: string; Icon: React.ElementType }[] = [
  { id: "basic", label: "Thông tin", Icon: Package },
  { id: "images", label: "Hình ảnh", Icon: ImageIcon },
  { id: "pricing", label: "Giá & kho", Icon: DollarSign },
  { id: "variants", label: "Biến thể", Icon: Layers },
  { id: "shipping", label: "Vận chuyển", Icon: Truck },
  { id: "seo", label: "SEO", Icon: Search },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function ProductDialog({
  open,
  onOpenChange,
  product,
  categories = DEFAULT_CATEGORIES,
  brands = DEFAULT_BRANDS,
  suppliers = DEFAULT_SUPPLIERS,
  onSubmit,
}: any) {
  const [form, setForm] = useState<ProductFormValues>({
    ...DEFAULT_VALUES,
    ...product,
  });
  const [activeSection, setActiveSection] = useState<SectionId>("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!product?.name;

  const onChange = useCallback(
    <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleSubmit = async (status: ProductFormValues["status"]) => {
    setIsSubmitting(true);
    try {
      await onSubmit({ ...form, status });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionProps = { form, onChange };

  const SECTION_CONTENT: Record<SectionId, React.ReactNode> = {
    basic: <SectionBasicInfo {...sectionProps} />,
    images: <SectionImages {...sectionProps} />,
    pricing: <SectionPricing {...sectionProps} />,
    variants: <SectionVariants {...sectionProps} />,
    shipping: <SectionShipping {...sectionProps} />,
    seo: <SectionSeo {...sectionProps} />,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-5xl w-full h-[90vh] p-0 gap-0 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle className="text-base font-semibold">
            {isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="flex flex-1 min-h-0">
          {/* Left: section nav + content */}
          <div className="flex flex-col flex-1 min-w-0 border-r">
            {/* Tab nav */}
            <nav className="flex items-center gap-0.5 px-4 py-2 border-b bg-muted/30 shrink-0 overflow-x-auto">
              {SECTIONS.map(({ id, label, Icon } : { id: SectionId; label: string; Icon: any }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveSection(id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded text-sm whitespace-nowrap transition-colors",
                    activeSection === id
                      ? "bg-background border border-border text-foreground shadow-sm font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </nav>

            {/* Section content */}
            <ScrollArea className="flex-1">
              <div className="p-6 max-w-2xl">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {SECTIONS.find((s) => s.id === activeSection)?.label}
                  </h3>
                  <Separator className="mt-2" />
                </div>
                {SECTION_CONTENT[activeSection]}
              </div>
            </ScrollArea>
          </div>

          {/* Right: sidebar */}
          <ScrollArea className="w-72 shrink-0">
            <div className="p-4 space-y-5">
              <StatusCard form={form} onChange={onChange} />
              <Separator />
              <CategoryCard form={form} categories={categories} onChange={onChange} />
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
                        <span className="font-medium text-foreground">{value}</span>
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
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
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
      </DialogContent>
    </Dialog>
  );
}

// ─── Demo defaults ────────────────────────────────────────────────────────────

const DEFAULT_CATEGORIES: CategoryOption[] = [
  { value: "fashion", label: "Thời trang" },
  { value: "fashion-men-shirt", label: "Áo nam", parentValue: "fashion" },
  { value: "fashion-men-pants", label: "Quần nam", parentValue: "fashion" },
  { value: "fashion-women", label: "Thời trang nữ", parentValue: "fashion" },
  { value: "electronics", label: "Điện tử" },
  { value: "electronics-phone", label: "Điện thoại", parentValue: "electronics" },
  { value: "electronics-laptop", label: "Laptop", parentValue: "electronics" },
  { value: "home", label: "Gia dụng" },
  { value: "beauty", label: "Làm đẹp" },
  { value: "health", label: "Sức khỏe" },
  { value: "sports", label: "Thể thao" },
  { value: "books", label: "Sách & Văn phòng phẩm" },
];

const DEFAULT_BRANDS: BrandOption[] = [
  { value: "uniqlo", label: "Uniqlo" },
  { value: "zara", label: "Zara" },
  { value: "local-a", label: "Local Brand A" },
  { value: "nike", label: "Nike" },
  { value: "adidas", label: "Adidas" },
];

const DEFAULT_SUPPLIERS: SupplierOption[] = [
  { value: "ncc-hn", label: "NCC Hà Nội" },
  { value: "xuong-hcm", label: "Xưởng may TP.HCM" },
  { value: "import-cn", label: "Nhập khẩu Trung Quốc" },
];