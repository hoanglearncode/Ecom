import type { Product } from "@/features/products/types"
import { Badge } from "@/components/ui/badge"

type ProductStatus = NonNullable<Product["status"]> | "out_of_stock"

const statusConfig: Record<ProductStatus, { label: string; className: string }> = {
  active: { label: "Đang bán", className: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" },
  draft: { label: "Nháp", className: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800" },
  archived: { label: "Lưu trữ", className: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700" },
  out_of_stock: { label: "Hết hàng", className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800" },
}

export default function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const config = statusConfig[status]
  return <Badge className={config.className}>{config.label}</Badge>
}
