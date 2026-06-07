"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  Pencil,
  Trash2,
  Star,
  StarOff,
  GripVertical,
  FolderOpen,
  Folder,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { StatusBadge } from "@/components/category/StatusBadge";
import { Category } from "@/features/categories/types";

export function CategoryTreeNode({
  category,
  depth = 0,
  onEdit,
  onDelete,
  onToggleFeatured,
  searchQuery,
}: {
  category: Category;
  depth?: number;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
  onToggleFeatured: (cat: Category) => void;
  searchQuery: string;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = (category.children?.length ?? 0) > 0;

  const matchesSearch =
    !searchQuery ||
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchQuery.toLowerCase());

  const childrenMatchSearch =
    category.children?.some(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchQuery.toLowerCase()),
    ) ?? false;

  if (searchQuery && !matchesSearch && !childrenMatchSearch) return null;

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-2 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50",
          depth > 0 && "ml-6 border-l border-border",
        )}
      >
        {/* Drag handle */}
        <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100" />

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((p) => !p)}
          className={cn(
            "shrink-0 transition-opacity",
            !hasChildren && "invisible",
          )}
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </button>

        {/* Folder icon */}
        {hasChildren ? (
          <FolderOpen className="h-4 w-4 shrink-0 text-amber-500" />
        ) : (
          <Folder className="h-4 w-4 shrink-0 text-muted-foreground/60" />
        )}

        {/* Name & meta */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium">{category.name}</span>
            {category.featured && (
              <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />
            )}
          </div>
          <p className="truncate text-xs text-muted-foreground">
            /{category.slug} · {category.items} products
          </p>
        </div>

        {/* Status */}
        <StatusBadge status={category.status} />

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => onEdit(category)}>
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleFeatured(category)}>
              {category.featured ? (
                <>
                  <StarOff className="mr-2 h-3.5 w-3.5" />
                  Remove featured
                </>
              ) : (
                <>
                  <Star className="mr-2 h-3.5 w-3.5" />
                  Mark featured
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(category)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div>
          {category.children!.map((child) => (
            <CategoryTreeNode
              key={child.id}
              category={child}
              depth={depth + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleFeatured={onToggleFeatured}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
}