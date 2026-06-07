"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PaginationState {
  page: number;
  pageSize: number;
}

export interface PaginationProps {
  /** Current pagination state */
  state: PaginationState;
  /** Callback when pagination state changes */
  onStateChange: (state: PaginationState) => void;
  /** Total number of items (for calculating total pages) */
  totalItems: number;
  /** Page size options */
  pageSizeOptions?: number[];
  /** Label for items being displayed (e.g., "khách hàng", "sản phẩm") */
  itemsLabel?: string;
  /** Show "Hiển thị X / Y items" text */
  showInfo?: boolean;
  /** Compact mode for smaller screens */
  compact?: boolean;
  /** Custom className for the container */
  className?: string;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50];

// ─── Component ───────────────────────────────────────────────────────────────────

export function AdminPagination({
  state,
  onStateChange,
  totalItems,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  itemsLabel = "bản ghi",
  showInfo = true,
  compact = false,
  className,
}: PaginationProps) {
  const { page, pageSize } = state;
  const [openPageBox, setOpenPageBox] = React.useState(false);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  // Auto-reset page if it exceeds total pages (e.g., after filter changes)
  React.useEffect(() => {
    if (page > totalPages) {
      onStateChange({ page: totalPages, pageSize });
    }
  }, [page, totalPages, pageSize, onStateChange]);

  const handlePageChange = (newPage: number) => {
    onStateChange({ page: newPage, pageSize });
  };

  const handlePageSizeChange = (newPageSize: string) => {
    onStateChange({ page: 1, pageSize: Number(newPageSize) });
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t",
        className
      )}
    >
      {/* Info section */}
      {showInfo && (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>Hiển thị</span>
          <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>
            / {totalItems} {itemsLabel}
          </span>
          {!compact && (
            <span className="hidden sm:inline text-xs text-muted-foreground">
              ({startItem}-{endItem})
            </span>
          )}
        </div>
      )}

      {/* Page navigation */}
      <div className="flex items-center gap-2">
        {/* First page */}
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => handlePageChange(1)}
          disabled={page === 1}
          title="Trang đầu"
        >
          <ChevronsLeft className="size-4" />
        </Button>

        {/* Previous page */}
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => handlePageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          title="Trang trước"
        >
          <ChevronLeft className="size-4" />
        </Button>

        {/* Page selector combobox */}
        <Popover open={openPageBox} onOpenChange={setOpenPageBox}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="min-w-[130px] justify-between"
            >
              <span>
                Trang {page} / {totalPages}
              </span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[220px] p-0">
            <Command>
              <CommandInput placeholder="Tìm trang..." />
              <CommandList>
                <CommandEmpty>Không tìm thấy trang.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-auto">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <CommandItem
                        key={p}
                        value={`Trang ${p}`}
                        onSelect={() => {
                          handlePageChange(p);
                          setOpenPageBox(false);
                        }}
                      >
                        <span
                          className={cn(
                            "mr-2 h-4 w-4",
                            page === p ? "opacity-100" : "opacity-0"
                          )}
                        >
                          ✓
                        </span>
                        Trang {p}
                      </CommandItem>
                    )
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Next page */}
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          title="Trang sau"
        >
          <ChevronRight className="size-4" />
        </Button>

        {/* Last page */}
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          onClick={() => handlePageChange(totalPages)}
          disabled={page === totalPages}
          title="Trang cuối"
        >
          <ChevronsRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

// ─── Hook for managing pagination state ─────────────────────────────────────────

export function usePagination(initialState?: Partial<PaginationState>) {
  // Store initial pageSize for reset
  const initialPageSize = initialState?.pageSize ?? 10;

  const [state, setState] = React.useState<PaginationState>({
    page: 1,
    pageSize: initialPageSize,
    ...initialState,
  });

  const onStateChange = React.useCallback((newState: PaginationState) => {
    setState(newState);
  }, []);

  // Reset to page 1, keep current pageSize
  const reset = React.useCallback(() => {
    setState((prev) => ({ page: 1, pageSize: prev.pageSize }));
  }, []);

  return { state, onStateChange, reset };
}

// ─── Helper for paginating data arrays ───────────────────────────────────────────

export function paginateData<T>(
  data: T[],
  page: number,
  pageSize: number
): T[] {
  const start = (page - 1) * pageSize;
  return data.slice(start, start + pageSize);
}
