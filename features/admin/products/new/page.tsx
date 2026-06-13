"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { apiGet, apiPost } from "@/lib/api";
import { ProductFormPage } from "@/components/products/product-form-page";
import { mapFormValuesToProduct } from "@/components/products/product-dialog";
import type {
  CategoryOption,
  BrandOption,
  ProductFormValues,
} from "@/components/products/product-dialog";
import type { MockCategory, MockBrand } from "@/lib/api/mock-store/types";

export function ProductNewPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: rawCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiGet<MockCategory[]>("/api/categories"),
  });

  const { data: rawBrands } = useQuery({
    queryKey: ["brands"],
    queryFn: () => apiGet<MockBrand[]>("/api/brands"),
  });

  const categories: CategoryOption[] = (rawCategories ?? []).map((c) => ({
    value: c.slug,
    label: c.name,
    parentValue: c.parentId,
  }));

  const brands: BrandOption[] = (rawBrands ?? []).map((b) => ({
    value: b.slug,
    label: b.name,
  }));

  const handleSubmit = async (data: ProductFormValues) => {
    const payload = mapFormValuesToProduct(data, {
      categoryOptions: categories,
      brandOptions: brands,
      currency: "VND",
      now: new Date().toISOString().slice(0, 10),
    });
    await apiPost("/api/products", payload);
    // Invalidate so the products list refetches on next mount
    await queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    router.push("/admin/products");
  };

  return (
    <ProductFormPage
      categories={categories}
      brands={brands}
      onSubmit={handleSubmit}
    />
  );
}
