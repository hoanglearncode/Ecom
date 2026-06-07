"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type CategoryOption = {
  label: string;
  value: string;
};

type Props = {
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  categoryOptions: CategoryOption[];
  setPage?: (page: number) => void;
  includeAllOption?: boolean;
};

export function CategoryCombobox({
  categoryFilter,
  setCategoryFilter,
  setPage,
  categoryOptions,
  includeAllOption = true,
}: Props) {
  const [open, setOpen] = React.useState(false);

  const allOptions = includeAllOption
    ? [
        {
          label: "Tất cả danh mục",
          value: "all",
        },
        ...categoryOptions,
      ]
    : categoryOptions;

  const selectedOption = allOptions.find(
    (option) => option.value === categoryFilter,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[220px] justify-between"
        >
          {selectedOption?.label || "Chọn danh mục"}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[220px] p-0">
        <Command>
          <CommandInput placeholder="Tìm danh mục..." />

          <CommandList>
            <CommandEmpty>Không tìm thấy danh mục.</CommandEmpty>

            <CommandGroup>
              {allOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    setCategoryFilter(option.value);
                    setPage?.(1);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      categoryFilter === option.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />

                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
