

import { Category } from "@/features/categories/types";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  active: {
    label: "Active",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  },
  inactive: {
    label: "Inactive",
    className: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
  },
  draft: {
    label: "Draft",
    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  },
} as const;

export function StatusBadge({ status }: { status: Category["status"] }) {
  const cfg = STATUS_CONFIG[status || "draft"];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        cfg?.className || "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
      )}
    >
      {cfg?.label || "Unknown"}
    </span>
  );
}