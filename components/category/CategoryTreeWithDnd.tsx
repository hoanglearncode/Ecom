"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface SortableCategory extends Category {
  parentId: string | null;
  items: Category[];
}

interface CategoryTreeWithDndProps {
  categories: Category[];
  onEdit?: (cat: Category) => void;
  onDelete?: (cat: Category) => void;
  onToggleFeatured?: (cat: Category) => void;
  onMove?: (categoryId: string, newParentId: string | null, newIndex: number) => void;
  onAddChild?: (parentId: string | null) => void;
  searchQuery?: string;
}

function SortableCategoryItem({
  category,
  depth = 0,
  onEdit,
  onDelete,
  onToggleFeatured,
  onAddChild,
  searchQuery = "",
  parentId = null,
  index = 0,
  isDragging = false,
}: {
  category: SortableCategory;
  depth?: number;
  onEdit?: (cat: Category) => void;
  onDelete?: (cat: Category) => void;
  onToggleFeatured?: (cat: Category) => void;
  onAddChild?: (parentId: string | null) => void;
  searchQuery?: string;
  parentId?: string | null;
  index?: number;
  isDragging?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: category.id,
    data: { index, parentId, category },
  });

  const [expanded, setExpanded] = useState(true);
  const hasChildren = (category.children?.length ?? 0) > 0;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

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
    <div ref={setNodeRef} style={style}>
      <div
        className={cn(
          "group flex items-center gap-2 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50",
          depth > 0 && "ml-6 border-l border-border",
          isDragging && "bg-muted/80",
        )}
      >
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

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
          <div className="flex items-center gap-2">
            <p className="truncate text-xs text-muted-foreground">
              /{category.slug}
            </p>
            <Badge variant="secondary" className="h-4 px-1.5 text-xs">
              {category.items} products
            </Badge>
          </div>
        </div>

        {/* Status */}
        <StatusBadge status={category.status} />

        {/* Add child button */}
        {onAddChild && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={() => onAddChild(category.id)}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        )}

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
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(category)}>
                <Pencil className="mr-2 h-3.5 w-3.5" />
                Edit
              </DropdownMenuItem>
            )}
            {onToggleFeatured && (
              <>
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
              </>
            )}
            {onAddChild && (
              <DropdownMenuItem onClick={() => onAddChild(category.id)}>
                <Plus className="mr-2 h-3.5 w-3.5" />
                Add subcategory
              </DropdownMenuItem>
            )}
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(category)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <SortableCategoryList
          categories={category.children!}
          parentId={category.id}
          depth={depth + 1}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFeatured={onToggleFeatured}
          onAddChild={onAddChild}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
}

function SortableCategoryList({
  categories,
  parentId = null,
  depth = 0,
  onEdit,
  onDelete,
  onToggleFeatured,
  onAddChild,
  searchQuery = "",
}: {
  categories: Category[];
  parentId?: string | null;
  depth?: number;
  onEdit?: (cat: Category) => void;
  onDelete?: (cat: Category) => void;
  onToggleFeatured?: (cat: Category) => void;
  onAddChild?: (parentId: string | null) => void;
  searchQuery?: string;
}) {
  return categories.map((category, index) => (
    <SortableCategoryItem
      key={category.id}
      category={category as SortableCategory}
      parentId={parentId}
      index={index}
      depth={depth}
      onEdit={onEdit}
      onDelete={onDelete}
      onToggleFeatured={onToggleFeatured}
      onAddChild={onAddChild}
      searchQuery={searchQuery}
    />
  ));
}

export function CategoryTreeWithDnd({
  categories,
  onEdit,
  onDelete,
  onToggleFeatured,
  onMove,
  onAddChild,
  searchQuery = "",
}: CategoryTreeWithDndProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Find the category being dragged
      const findCategory = (
        cats: Category[],
        id: string
      ): { category: Category; parentId: string | null; siblings: Category[] } | null => {
        for (const parent of cats) {
          if (parent.id === id) {
            return { category: parent, parentId: null, siblings: cats };
          }
          if (parent.children) {
            const found = findCategory(parent.children, id);
            if (found) return found;
          }
        }
        return null;
      };

      const draggedInfo = findCategory(categories, active.id as string);
      if (draggedInfo && onMove) {
        // Calculate new position based on drop target
        const newIndex = categories.findIndex((c) => c.id === over.id);
        onMove(active.id as string, draggedInfo.parentId, newIndex);
      }
    }

    setActiveId(null);
  };

  const activeCategory = activeId
    ? categories.find((c) => c.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={(event) => setActiveId(event.active.id as string)}
    >
      <SortableContext
        items={categories.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <SortableCategoryList
          categories={categories}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFeatured={onToggleFeatured}
          onAddChild={onAddChild}
          searchQuery={searchQuery}
        />
      </SortableContext>

      <DragOverlay>
        {activeCategory && (
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2.5 shadow-lg">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <FolderOpen className="h-4 w-4 text-amber-500" />
            <span className="font-medium">{activeCategory.name}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
