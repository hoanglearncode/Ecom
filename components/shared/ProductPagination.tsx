"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PaginationState {
  page: number;
  pageSize: number;
}

export interface PaginationProps {
  /** Current pagination state */
  state: PaginationState;
  /** Callback when pagination state changes */
  onPageChange: (page: number) => void;
  /** Total number of items (for calculating total pages) */
  totalItems: number;
  /** Page size options */
  pageSizeOptions?: number[];
  /** Label for items being displayed (e.g., "sản phẩm") */
  itemsLabel?: string;
  /** Show "Hiển thị X / Y items" text */
  showInfo?: boolean;
  /** Compact mode for smaller screens */
  compact?: boolean;
  /** Custom className for the container */
  className?: string;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [12, 24, 48, 96];

// ─── Component ───────────────────────────────────────────────────────────────────

export function ProductPagination({
  state,
  onPageChange,
  totalItems,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  itemsLabel = "sản phẩm",
  showInfo = true,
  compact = false,
  className,
}: PaginationProps) {
  const { page, pageSize } = state;

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = compact ? 5 : 7;

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (page > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3",
        className
      )}
    >
      {/* Info section */}
      {showInfo && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Hiển thị</span>
          <span className="font-medium text-gray-700">{startItem}-{endItem}</span>
          <span>trên</span>
          <span className="font-medium text-gray-700">{totalItems}</span>
          <span>{itemsLabel}</span>
        </div>
      )}

      {/* Page navigation */}
      <div className="flex items-center gap-2">
        {/* First page */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          title="Trang đầu"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Previous page */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          title="Trang trước"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => (
            typeof p === "number" ? (
              <Button
                key={`page-${p}-${idx}`}
                variant={page === p ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-8 w-8 p-0",
                  page === p
                    ? "bg-[#1a1a2e] hover:bg-[#2d2d4a] text-white border-[#1a1a2e]"
                    : "border-gray-200"
                )}
                onClick={() => onPageChange(p)}
              >
                {p}
              </Button>
            ) : (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 text-gray-400 text-sm"
              >
                {p}
              </span>
            )
          ))}
        </div>

        {/* Next page */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          title="Trang sau"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last page */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          title="Trang cuối"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ─── Hook for managing pagination state ─────────────────────────────────────────

export function useProductPagination(initialState?: Partial<PaginationState>) {
  const [state, setState] = React.useState<PaginationState>({
    page: 1,
    pageSize: 12,
    ...initialState,
  });

  const onPageChange = (page: number) => {
    setState(prev => ({ ...prev, page }));
  };

  // Reset to page 1
  const reset = () => {
    setState(prev => ({ ...prev, page: 1 }));
  };

  return { state, onPageChange, reset, setState };
}

// ─── Helper for paginating data arrays ───────────────────────────────────────────

export function paginateProducts<T>(
  data: T[],
  page: number,
  pageSize: number
): T[] {
  const start = (page - 1) * pageSize;
  return data.slice(start, start + pageSize);
}
