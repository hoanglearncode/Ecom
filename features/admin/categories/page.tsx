"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Layers3,
  Tags,
  Plus,
  Search,
  Star,
  PackageOpen,
  Filter,
  X,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import FeatureShell from "@/components/feature-shell";
import { FeatureHeader } from "@/components/feature-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TooltipProvider } from "@/components/ui/tooltip";
import { toast } from "sonner";

import { getAdminCategories } from "../api";
import { Category, CategoryFormData } from "@/features/categories/types";
import { CategoryFormDialog } from "@/components/category/CategoryFormDialog";
import { CategoryTreeNode } from "@/components/category/CategoryTree";
import { DeleteDialog } from "@/components/category/DeleteDialog";
import { MetricCard } from "@/components/category/MetricCard";
import { AdminPagination, usePagination, paginateData } from "@/components/admin";

const demoCategories: Category[] = [
  {
    id: "cat-electronics",
    name: "Electronics",
    slug: "electronics",
    items: 180,
    status: "active",
    featured: true,
    parentId: null,
    description: "Devices and accessories for work, travel, and home.",
    productCount: 180,
    tone: "from-sky-500/20 via-cyan-500/10 to-transparent",
    children: [
      {
        id: "cat-audio",
        name: "Audio",
        slug: "audio",
        items: 48,
        status: "active",
        featured: true,
        parentId: "cat-electronics",
        description: "Headphones, speakers, and microphones.",
        productCount: 48,
        tone: "from-blue-500/20 via-sky-500/10 to-transparent",
        children: [
          {
            id: "cat-audio-headphones",
            name: "Headphones",
            slug: "headphones",
            items: 28,
            status: "active",
            featured: true,
            parentId: "cat-audio",
            description: "Over-ear and in-ear audio.",
            productCount: 28,
            tone: "from-blue-500/20 via-sky-500/10 to-transparent",
          },
          {
            id: "cat-audio-speakers",
            name: "Speakers",
            slug: "speakers",
            items: 20,
            status: "inactive",
            featured: false,
            parentId: "cat-audio",
            description: "Portable and home speakers.",
            productCount: 20,
            tone: "from-blue-500/20 via-sky-500/10 to-transparent",
          },
        ],
      },
      {
        id: "cat-mobile",
        name: "Mobile",
        slug: "mobile",
        items: 60,
        status: "active",
        featured: false,
        parentId: "cat-electronics",
        description: "Smartphones and essentials.",
        productCount: 60,
        tone: "from-indigo-500/20 via-blue-500/10 to-transparent",
        children: [
          {
            id: "cat-mobile-smartphones",
            name: "Smartphones",
            slug: "smartphones",
            items: 42,
            status: "active",
            featured: true,
            parentId: "cat-mobile",
            description: "Flagship and midrange phones.",
            productCount: 42,
            tone: "from-indigo-500/20 via-blue-500/10 to-transparent",
          },
          {
            id: "cat-mobile-accessories",
            name: "Mobile accessories",
            slug: "mobile-accessories",
            items: 18,
            status: "inactive",
            featured: false,
            parentId: "cat-mobile",
            description: "Cases, chargers, and mounts.",
            productCount: 18,
            tone: "from-indigo-500/20 via-blue-500/10 to-transparent",
          },
        ],
      },
      {
        id: "cat-wearables",
        name: "Wearables",
        slug: "wearables",
        items: 26,
        status: "draft",
        featured: false,
        parentId: "cat-electronics",
        description: "Watches, bands, and health trackers.",
        productCount: 26,
        tone: "from-emerald-500/20 via-lime-500/10 to-transparent",
      },
      {
        id: "cat-cameras",
        name: "Cameras",
        slug: "cameras",
        items: 22,
        status: "inactive",
        featured: false,
        parentId: "cat-electronics",
        description: "Mirrorless and action gear.",
        productCount: 22,
        tone: "from-red-500/20 via-orange-500/10 to-transparent",
      },
    ],
  },
  {
    id: "cat-home",
    name: "Home & living",
    slug: "home-living",
    items: 95,
    status: "active",
    featured: false,
    parentId: null,
    description: "Spaces that support focus, comfort, and hosting.",
    productCount: 95,
    tone: "from-stone-500/20 via-zinc-500/10 to-transparent",
    children: [
      {
        id: "cat-kitchen",
        name: "Kitchen",
        slug: "kitchen",
        items: 35,
        status: "active",
        featured: false,
        parentId: "cat-home",
        description: "Appliances and prep tools.",
        productCount: 35,
        tone: "from-rose-500/20 via-red-500/10 to-transparent",
      },
      {
        id: "cat-home-office",
        name: "Home office",
        slug: "home-office",
        items: 28,
        status: "inactive",
        featured: false,
        parentId: "cat-home",
        description: "Ergonomic furniture and desk gear.",
        productCount: 28,
        tone: "from-slate-500/20 via-gray-500/10 to-transparent",
        children: [
          {
            id: "cat-home-office-desks",
            name: "Desks",
            slug: "desks",
            items: 12,
            status: "active",
            featured: false,
            parentId: "cat-home-office",
            description: "Standing and modular desks.",
            productCount: 12,
            tone: "from-slate-500/20 via-gray-500/10 to-transparent",
          },
          {
            id: "cat-home-office-seating",
            name: "Seating",
            slug: "seating",
            items: 16,
            status: "inactive",
            featured: false,
            parentId: "cat-home-office",
            description: "Chairs and stools.",
            productCount: 16,
            tone: "from-slate-500/20 via-gray-500/10 to-transparent",
          },
        ],
      },
      {
        id: "cat-smart-home",
        name: "Smart home",
        slug: "smart-home",
        items: 32,
        status: "draft",
        featured: false,
        parentId: "cat-home",
        description: "Connected lighting and automation.",
        productCount: 32,
        tone: "from-yellow-500/20 via-lime-500/10 to-transparent",
      },
    ],
  },
  {
    id: "cat-gaming",
    name: "Gaming",
    slug: "gaming",
    items: 70,
    status: "active",
    featured: false,
    parentId: null,
    description: "Consoles, controllers, and streaming gear.",
    productCount: 70,
    tone: "from-green-500/20 via-teal-500/10 to-transparent",
    children: [
      {
        id: "cat-gaming-console",
        name: "Console",
        slug: "console",
        items: 28,
        status: "active",
        featured: false,
        parentId: "cat-gaming",
        description: "Play at home or on the go.",
        productCount: 28,
        tone: "from-green-500/20 via-teal-500/10 to-transparent",
      },
      {
        id: "cat-gaming-pc",
        name: "PC gear",
        slug: "pc-gear",
        items: 24,
        status: "active",
        featured: true,
        parentId: "cat-gaming",
        description: "Keyboards, mice, and headsets.",
        productCount: 24,
        tone: "from-green-500/20 via-teal-500/10 to-transparent",
      },
      {
        id: "cat-gaming-handheld",
        name: "Handheld",
        slug: "handheld",
        items: 18,
        status: "draft",
        featured: false,
        parentId: "cat-gaming",
        description: "Portable consoles and grips.",
        productCount: 18,
        tone: "from-green-500/20 via-teal-500/10 to-transparent",
      },
    ],
  },
  {
    id: "cat-beauty",
    name: "Beauty",
    slug: "beauty",
    items: 55,
    status: "active",
    featured: false,
    parentId: null,
    description: "Skincare, haircare, and self-care devices.",
    productCount: 55,
    tone: "from-pink-500/20 via-fuchsia-500/10 to-transparent",
    children: [
      {
        id: "cat-beauty-skincare",
        name: "Skincare",
        slug: "skincare",
        items: 26,
        status: "active",
        featured: true,
        parentId: "cat-beauty",
        description: "Cleansers, serums, and moisturizers.",
        productCount: 26,
        tone: "from-pink-500/20 via-fuchsia-500/10 to-transparent",
      },
      {
        id: "cat-beauty-haircare",
        name: "Haircare",
        slug: "haircare",
        items: 18,
        status: "inactive",
        featured: false,
        parentId: "cat-beauty",
        description: "Styling tools and treatments.",
        productCount: 18,
        tone: "from-pink-500/20 via-fuchsia-500/10 to-transparent",
      },
      {
        id: "cat-beauty-wellness",
        name: "Wellness",
        slug: "wellness",
        items: 11,
        status: "draft",
        featured: false,
        parentId: "cat-beauty",
        description: "Relaxation and recovery essentials.",
        productCount: 11,
        tone: "from-pink-500/20 via-fuchsia-500/10 to-transparent",
      },
    ],
  },
  {
    id: "cat-travel",
    name: "Travel",
    slug: "travel",
    items: 41,
    status: "inactive",
    featured: false,
    parentId: null,
    description: "Luggage, packs, and power on the move.",
    productCount: 41,
    tone: "from-amber-500/20 via-orange-500/10 to-transparent",
    children: [
      {
        id: "cat-travel-luggage",
        name: "Luggage",
        slug: "luggage",
        items: 17,
        status: "active",
        featured: false,
        parentId: "cat-travel",
        description: "Carry-on and checked bags.",
        productCount: 17,
        tone: "from-amber-500/20 via-orange-500/10 to-transparent",
      },
      {
        id: "cat-travel-everyday",
        name: "Everyday carry",
        slug: "everyday-carry",
        items: 14,
        status: "active",
        featured: false,
        parentId: "cat-travel",
        description: "Pouches, slings, and organizers.",
        productCount: 14,
        tone: "from-amber-500/20 via-orange-500/10 to-transparent",
      },
      {
        id: "cat-travel-adapters",
        name: "Adapters",
        slug: "adapters",
        items: 10,
        status: "draft",
        featured: false,
        parentId: "cat-travel",
        description: "Power, SIM, and charging essentials.",
        productCount: 10,
        tone: "from-amber-500/20 via-orange-500/10 to-transparent",
      },
    ],
  },
  {
    id: "cat-fitness",
    name: "Fitness",
    slug: "fitness",
    items: 64,
    status: "active",
    featured: false,
    parentId: null,
    description: "Training gear and recovery essentials.",
    productCount: 64,
    tone: "from-emerald-500/20 via-teal-500/10 to-transparent",
    children: [
      {
        id: "cat-fitness-training",
        name: "Training",
        slug: "training",
        items: 24,
        status: "active",
        featured: false,
        parentId: "cat-fitness",
        description: "Weights, mats, and cardio.",
        productCount: 24,
        tone: "from-emerald-500/20 via-teal-500/10 to-transparent",
      },
      {
        id: "cat-fitness-recovery",
        name: "Recovery",
        slug: "recovery",
        items: 20,
        status: "inactive",
        featured: false,
        parentId: "cat-fitness",
        description: "Massage and mobility tools.",
        productCount: 20,
        tone: "from-emerald-500/20 via-teal-500/10 to-transparent",
      },
      {
        id: "cat-fitness-nutrition",
        name: "Nutrition",
        slug: "nutrition",
        items: 20,
        status: "draft",
        featured: false,
        parentId: "cat-fitness",
        description: "Supplements and prep tools.",
        productCount: 20,
        tone: "from-emerald-500/20 via-teal-500/10 to-transparent",
      },
    ],
  },
  {
    id: "cat-photography",
    name: "Photography",
    slug: "photography",
    items: 38,
    status: "active",
    featured: false,
    parentId: null,
    description: "Creator accessories and studio gear.",
    productCount: 38,
    tone: "from-rose-500/20 via-orange-500/10 to-transparent",
    children: [
      {
        id: "cat-photography-lenses",
        name: "Lenses",
        slug: "lenses",
        items: 20,
        status: "active",
        featured: false,
        parentId: "cat-photography",
        description: "Prime and zoom lenses.",
        productCount: 20,
        tone: "from-rose-500/20 via-orange-500/10 to-transparent",
      },
      {
        id: "cat-photography-tripods",
        name: "Tripods",
        slug: "tripods",
        items: 8,
        status: "inactive",
        featured: false,
        parentId: "cat-photography",
        description: "Stands and supports.",
        productCount: 8,
        tone: "from-rose-500/20 via-orange-500/10 to-transparent",
      },
      {
        id: "cat-photography-lighting",
        name: "Lighting",
        slug: "lighting",
        items: 10,
        status: "draft",
        featured: false,
        parentId: "cat-photography",
        description: "Panels, rings, and modifiers.",
        productCount: 10,
        tone: "from-rose-500/20 via-orange-500/10 to-transparent",
      },
    ],
  },
  {
    id: "cat-outdoors",
    name: "Outdoors",
    slug: "outdoors",
    items: 45,
    status: "active",
    featured: false,
    parentId: null,
    description: "Camping, cycling, and trail gear.",
    productCount: 45,
    tone: "from-lime-500/20 via-emerald-500/10 to-transparent",
    children: [
      {
        id: "cat-outdoors-camping",
        name: "Camping",
        slug: "camping",
        items: 25,
        status: "active",
        featured: false,
        parentId: "cat-outdoors",
        description: "Tents, lights, and cookware.",
        productCount: 25,
        tone: "from-lime-500/20 via-emerald-500/10 to-transparent",
      },
      {
        id: "cat-outdoors-hiking",
        name: "Hiking",
        slug: "hiking",
        items: 12,
        status: "inactive",
        featured: false,
        parentId: "cat-outdoors",
        description: "Backpacks and footwear.",
        productCount: 12,
        tone: "from-lime-500/20 via-emerald-500/10 to-transparent",
      },
      {
        id: "cat-outdoors-cycling",
        name: "Cycling",
        slug: "cycling",
        items: 8,
        status: "draft",
        featured: false,
        parentId: "cat-outdoors",
        description: "Accessories and safety.",
        productCount: 8,
        tone: "from-lime-500/20 via-emerald-500/10 to-transparent",
      },
    ],
  },
  {
    id: "cat-kids",
    name: "Kids",
    slug: "kids",
    items: 22,
    status: "draft",
    featured: false,
    parentId: null,
    description: "Learning and play essentials.",
    productCount: 22,
    tone: "from-violet-500/20 via-fuchsia-500/10 to-transparent",
    children: [
      {
        id: "cat-kids-learning",
        name: "Learning",
        slug: "learning",
        items: 10,
        status: "active",
        featured: false,
        parentId: "cat-kids",
        description: "STEM kits and puzzles.",
        productCount: 10,
        tone: "from-violet-500/20 via-fuchsia-500/10 to-transparent",
      },
      {
        id: "cat-kids-play",
        name: "Play",
        slug: "play",
        items: 12,
        status: "draft",
        featured: false,
        parentId: "cat-kids",
        description: "Games and creative toys.",
        productCount: 12,
        tone: "from-violet-500/20 via-fuchsia-500/10 to-transparent",
      },
    ],
  },
];

export default function AdminCategoriesFeaturePage() {
  const queryClient = useQueryClient();

  // ── State ──
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { state: pagination, onStateChange: setPagination, reset: resetPagination } = usePagination({ pageSize: 4 });

  // ── Data ──
  const { data, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: getAdminCategories,
  });

  const categorySource = useMemo(() => {
    const apiCategories = data?.categories ?? [];
    const hasUsableShape = apiCategories.some(
      (category) =>
        typeof category.slug === "string" &&
        typeof category.items === "number" &&
        typeof category.status === "string",
    );
    if (apiCategories.length > 0 && hasUsableShape) {
      return apiCategories;
    }
    return demoCategories;
  }, [data?.categories]);

  // ── Mock mutations (wire to real API) ──
  const createMutation = useMutation({
    mutationFn: async (form: CategoryFormData) => {
      // await createCategory(form)
      return form;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Category created");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      form,
    }: {
      id: string;
      form: CategoryFormData;
    }) => {
      // await updateCategory(id, form)
      return { id, form };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Category updated");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // await deleteCategory(id)
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Category deleted");
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async (cat: Category) => {
      // await updateCategory(cat.id, { featured: !cat.featured })
      return cat;
    },
    onSuccess: (cat) => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success(
        cat.featured ? "Removed from featured" : "Marked as featured",
      );
    },
  });

  // ── Handlers ──
  const handleEdit = (cat: Category) => {
    setEditTarget(cat);
    setFormOpen(true);
  };

  const handleDelete = (cat: Category) => {
    setDeleteTarget(cat);
    setDeleteOpen(true);
  };

  const handleSave = (form: CategoryFormData) => {
    if (editTarget) {
      updateMutation.mutate({ id: editTarget.id, form });
    } else {
      createMutation.mutate(form);
    }
    setEditTarget(null);
  };

  // ── Filtered categories ──
  const flatCategories: Category[] = useMemo(() => {
    const flat: Category[] = [];
    const traverse = (cats: Category[]) => {
      cats.forEach((c) => {
        flat.push(c);
        if (c.children) traverse(c.children);
      });
    };
    traverse(categorySource);
    return flat;
  }, [categorySource]);

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery = (cat: Category) =>
      !query ||
      cat.name.toLowerCase().includes(query) ||
      cat.slug.toLowerCase().includes(query);
    const matchesStatus = (cat: Category) =>
      statusFilter === "all" || cat.status === statusFilter;
    const filterTree = (cats: Category[]): Category[] =>
      cats
        .map((cat) => {
          const children = cat.children ? filterTree(cat.children) : [];
          const include =
            (matchesQuery(cat) && matchesStatus(cat)) || children.length > 0;
          if (!include) return null;
          return {
            ...cat,
            children: children.length > 0 ? children : undefined,
          };
        })
        .filter(Boolean) as Category[];

    return filterTree(categorySource);
  }, [categorySource, searchQuery, statusFilter]);

  const featuredCount = flatCategories.filter((c) => c.featured).length;
  const metrics = useMemo(() => {
    if (data?.metrics?.length) return data.metrics;
    const leafCount = flatCategories.filter(
      (cat) => !cat.children || cat.children.length === 0,
    );
    const mappedProducts = leafCount.reduce(
      (sum, cat) => sum + (cat.items ?? 0),
      0,
    );
    return [
      { label: "Groups", value: `${categorySource.length}` },
      { label: "Products mapped", value: `${mappedProducts}` },
      { label: "Featured", value: `${featuredCount}` },
    ];
  }, [categorySource.length, data?.metrics, featuredCount, flatCategories]);
  const hasFilters = searchQuery || statusFilter !== "all";

  const paginatedCategories = useMemo(
    () => paginateData(filteredCategories, pagination.page, pagination.pageSize),
    [filteredCategories, pagination.page, pagination.pageSize]
  );

  useEffect(() => {
    resetPagination();
  }, [searchQuery, statusFilter, resetPagination]);

  return (
    <TooltipProvider>
      <FeatureShell>
        <div className="space-y-6">
          {/* ── Header ── */}
          <FeatureHeader
            title="Categories"
            description="Manage your product taxonomy — organise, nest, and feature categories to optimise discovery."
            actions={
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {isLoading ? "—" : `${flatCategories.length} categories`}
                </Badge>
                <Button
                  size="sm"
                  onClick={() => {
                    setEditTarget(null);
                    setFormOpen(true);
                  }}
                  className="text-white"
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  New category
                </Button>
              </div>
            }
          />

          {/* ── Metrics ── */}
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              label="Groups"
              value={metrics[0]?.value ?? 0}
              icon={Layers3}
              loading={isLoading}
              accent="text-blue-500"
            />
            <MetricCard
              label="Products mapped"
              value={metrics[1]?.value ?? 0}
              icon={PackageOpen}
              loading={isLoading}
              accent="text-violet-500"
            />
            <MetricCard
              label="Featured"
              value={metrics[2]?.value ?? (isLoading ? 0 : featuredCount)}
              icon={Star}
              loading={isLoading}
              accent="text-amber-500"
            />
          </div>

          <Card className="overflow-hidden border-0 shadow-sm">
            {/* Header */}
            <CardHeader className="border-b bg-muted/30 px-6 py-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Left */}
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">
                    Categories
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Manage product categories and hierarchy
                  </p>
                </div>

                {/* Right */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      placeholder="Search categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-10 w-full min-w-[260px] rounded-xl border-muted bg-background pl-10 pr-10"
                    />

                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Status Filter */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-10 w-[180px] rounded-xl">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>

                      <SelectItem value="active">Active</SelectItem>

                      <SelectItem value="inactive">Inactive</SelectItem>

                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Clear */}
                  {hasFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 rounded-xl"
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="p-0">
              {isLoading ? (
                <div className="space-y-3 p-6">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-xl" />
                  ))}
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center px-6 text-center">
                  <div className="mb-4 rounded-2xl bg-muted ">
                    <Tags className="h-10 w-10 text-muted-foreground/50" />
                  </div>

                  <h3 className="text-base font-semibold">
                    No categories found
                  </h3>

                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Try adjusting your search or filter to find what you're
                    looking for.
                  </p>

                  {hasFilters && (
                    <Button
                      variant="secondary"
                      className="mt-5 rounded-xl"
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                      }}
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              ) : (
                <div>
                  <div className="divide-y">
                    {paginatedCategories.map((category, index) => (
                      <div
                        key={category?.id ?? category?.slug ?? `cat-${index}`}
                        className="transition-colors hover:bg-muted/40"
                      >
                        <CategoryTreeNode
                          category={category}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onToggleFeatured={(cat) =>
                            toggleFeaturedMutation.mutate(cat)
                          }
                          searchQuery=""
                        />
                      </div>
                    ))}
                  </div>

                  <AdminPagination
                    state={pagination}
                    onStateChange={setPagination}
                    totalItems={filteredCategories.length}
                    itemsLabel="nhóm"
                    showInfo={false}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Dialogs ── */}
        <CategoryFormDialog
          open={formOpen}
          onOpenChange={(v) => {
            setFormOpen(v);
            if (!v) setEditTarget(null);
          }}
          initialData={editTarget}
          allCategories={categorySource}
          onSave={handleSave}
        />

        <DeleteDialog
          category={deleteTarget}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={() =>
            deleteTarget && deleteMutation.mutate(deleteTarget.id)
          }
        />
      </FeatureShell>
    </TooltipProvider>
  );
}
