
import { Category, CategoryFormData } from "@/features/categories/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Check } from "lucide-react";
import { useMemo, useState } from "react";
import { CategoryCombobox } from "@/components/products/product-category";
export function CategoryFormDialog({
  open,
  onOpenChange,
  initialData,
  allCategories,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialData?: Category | null;
  allCategories: Category[];
  onSave: (data: CategoryFormData) => void;
}) {
  const isEdit = !!initialData;
  const [form, setForm] = useState<CategoryFormData>({
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    description: initialData?.description ?? "",
    parentId: initialData?.parentId ?? null,
    status: initialData?.status ?? "active",
    featured: initialData?.featured ?? false,
  });

  const set = <K extends keyof CategoryFormData>(k: K, v: CategoryFormData[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleNameChange = (name: string) => {
    set("name", name);
    if (!isEdit) {
      set("slug", name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
    }
  };

  const flatCategories = useMemo(() => {
    const flat: Category[] = [];
    const traverse = (cats: Category[]) => {
      cats.forEach((c) => {
        if (c.id !== initialData?.id) {
          flat.push(c);
          if (c.children) traverse(c.children);
        }
      });
    };
    traverse(allCategories);
    return flat;
  }, [allCategories, initialData]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit category" : "New category"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the category details below." : "Fill in the details for the new category."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="cat-name">Name</Label>
            <Input
              id="cat-name"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Electronics"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="cat-slug">Slug</Label>
            <Input
              id="cat-slug"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="electronics"
              className="font-mono text-sm"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="cat-desc">Description</Label>
            <Input
              id="cat-desc"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Optional description…"
            />
          </div>

          <div className="grid gap-1.5">
            <Label>Parent category</Label>
          <CategoryCombobox
            categoryFilter={form.parentId ?? "all"}
            setCategoryFilter={(v) => set("parentId", v === "all" ? null : v)}
            categoryOptions={flatCategories.map((c) => ({ label: c.name, value: c.id }))}
            includeAllOption={false}
          />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => set("status", v as CategoryFormData["status"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Featured</Label>
              <div className="flex h-10 items-center gap-2">
                <Switch
                  checked={form.featured}
                  onCheckedChange={(v) => set("featured", v)}
                />
                <span className="text-sm text-muted-foreground">
                  {form.featured ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave(form);
              onOpenChange(false);
            }}
            disabled={!form.name.trim()}
          >
            <Check className="mr-1.5 h-3.5 w-3.5" />
            {isEdit ? "Save changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}