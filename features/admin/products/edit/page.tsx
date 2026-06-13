"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { apiGet, apiPut } from "@/lib/api";
import { ProductFormPage } from "@/components/products/product-form-page";
import {
  mapProductToFormValues,
  mapFormValuesToProduct,
} from "@/components/products/product-dialog";
import type {
  CategoryOption,
  BrandOption,
  ProductFormValues,
} from "@/components/products/product-dialog";
import type { MockCategory, MockBrand } from "@/lib/api/mock-store/types";
import type { Product } from "@/features/products/types";

interface Props {
  productId: string;
}

export function ProductEditPage({ productId }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: product } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => apiGet<Product>(`/api/products/${productId}`),
  });

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
      base: product,
      categoryOptions: categories,
      brandOptions: brands,
      currency: product?.currency ?? "VND",
      now: new Date().toISOString().slice(0, 10),
    });
    await apiPut(`/api/products/${productId}`, payload);
    await queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    await queryClient.invalidateQueries({ queryKey: ["product", productId] });
    router.push("/admin/products");
  };

  if (!product) {
    return (
      <div className="flex h-[calc(100vh-56px)] items-center justify-center text-muted-foreground text-sm">
        Đang tải sản phẩm...
      </div>
    );
  }

  return (
    <ProductFormPage
      product={mapProductToFormValues(product)}
      categories={categories}
      brands={brands}
      onSubmit={handleSubmit}
    />
  );
}
