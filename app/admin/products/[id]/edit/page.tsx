"use client";

import { useParams } from "next/navigation";
import { ProductEditPage } from "@/features/admin/products/edit/page";

export default function ProductEditRoute() {
  const { id } = useParams<{ id: string }>();
  return <ProductEditPage productId={id} />;
}
