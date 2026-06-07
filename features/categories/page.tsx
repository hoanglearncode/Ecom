"use client";

import { useState, useMemo } from "react";
import {
  Search, ChevronRight, ChevronDown, Grid2x2, List,
  SlidersHorizontal, X, Sparkles, TrendingUp, Flame,
  Star, Package, Heart, ShoppingCart, ArrowRight,
  LayoutGrid, Layers, Tag, Filter, Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Type (as provided) ───────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  items: number;
  status: "active" | "inactive" | "draft";
  featured: boolean;
  parentId: string | null;
  children?: Category[];
  description?: string;
  productCount: number;
  tone: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  {
    id: "cat-1", name: "Giày dép & Thể thao", slug: "giay-dep", items: 1240,
    status: "active", featured: true, parentId: null, productCount: 1240,
    tone: "energetic", description: "Giày thể thao, sandal, dép thời trang từ các thương hiệu hàng đầu",
    children: [
      { id: "cat-1-1", name: "Giày thể thao",     slug: "giay-the-thao",    items: 480, status: "active", featured: true,  parentId: "cat-1", productCount: 480,  tone: "bold",   description: "Running, training, lifestyle sneakers" },
      { id: "cat-1-2", name: "Sandal & Dép",       slug: "sandal-dep",       items: 320, status: "active", featured: false, parentId: "cat-1", productCount: 320,  tone: "casual", description: "Dép thời trang, sandal đi biển, quai ngang" },
      { id: "cat-1-3", name: "Giày công sở",       slug: "giay-cong-so",     items: 210, status: "active", featured: false, parentId: "cat-1", productCount: 210,  tone: "formal", description: "Oxford, loafer, giày da lịch sự" },
      { id: "cat-1-4", name: "Phụ kiện giày",      slug: "phu-kien-giay",    items: 230, status: "active", featured: false, parentId: "cat-1", productCount: 230,  tone: "utility" },
    ],
  },
  {
    id: "cat-2", name: "Thời trang nam", slug: "thoi-trang-nam", items: 2140,
    status: "active", featured: true, parentId: null, productCount: 2140,
    tone: "urban", description: "Áo, quần, phụ kiện thời trang nam từ cơ bản đến cao cấp",
    children: [
      { id: "cat-2-1", name: "Áo T-shirt & Polo",  slug: "ao-tshirt",        items: 680, status: "active", featured: true,  parentId: "cat-2", productCount: 680,  tone: "casual" },
      { id: "cat-2-2", name: "Quần jeans & Chino",  slug: "quan-jeans",       items: 540, status: "active", featured: false, parentId: "cat-2", productCount: 540,  tone: "urban"  },
      { id: "cat-2-3", name: "Áo khoác & Jacket",   slug: "ao-khoac",         items: 380, status: "active", featured: true,  parentId: "cat-2", productCount: 380,  tone: "bold"   },
      { id: "cat-2-4", name: "Đồ thể thao nam",     slug: "do-the-thao-nam",  items: 290, status: "active", featured: false, parentId: "cat-2", productCount: 290,  tone: "sport"  },
      { id: "cat-2-5", name: "Phụ kiện nam",        slug: "phu-kien-nam",     items: 250, status: "active", featured: false, parentId: "cat-2", productCount: 250,  tone: "minimal"},
    ],
  },
  {
    id: "cat-3", name: "Thời trang nữ", slug: "thoi-trang-nu", items: 3820,
    status: "active", featured: true, parentId: null, productCount: 3820,
    tone: "feminine", description: "Đầm, áo, quần váy và phụ kiện nữ tính mọi phong cách",
    children: [
      { id: "cat-3-1", name: "Đầm & Váy",           slug: "dam-vay",          items: 920, status: "active", featured: true,  parentId: "cat-3", productCount: 920,  tone: "elegant" },
      { id: "cat-3-2", name: "Áo nữ",               slug: "ao-nu",            items: 840, status: "active", featured: false, parentId: "cat-3", productCount: 840,  tone: "feminine"},
      { id: "cat-3-3", name: "Quần nữ",             slug: "quan-nu",          items: 610, status: "active", featured: false, parentId: "cat-3", productCount: 610,  tone: "casual" },
      { id: "cat-3-4", name: "Đồ bộ & Pyjama",      slug: "do-bo",            items: 480, status: "active", featured: false, parentId: "cat-3", productCount: 480,  tone: "soft"   },
      { id: "cat-3-5", name: "Phụ kiện nữ",         slug: "phu-kien-nu",      items: 970, status: "active", featured: true,  parentId: "cat-3", productCount: 970,  tone: "glam"   },
    ],
  },
  {
    id: "cat-4", name: "Điện tử & Công nghệ", slug: "dien-tu", items: 1680,
    status: "active", featured: true, parentId: null, productCount: 1680,
    tone: "tech", description: "Điện thoại, laptop, tai nghe, phụ kiện công nghệ chính hãng",
    children: [
      { id: "cat-4-1", name: "Điện thoại",          slug: "dien-thoai",       items: 420, status: "active", featured: true,  parentId: "cat-4", productCount: 420,  tone: "premium"},
      { id: "cat-4-2", name: "Laptop & Máy tính",   slug: "laptop",           items: 280, status: "active", featured: false, parentId: "cat-4", productCount: 280,  tone: "pro"    },
      { id: "cat-4-3", name: "Tai nghe & Loa",      slug: "tai-nghe",         items: 360, status: "active", featured: true,  parentId: "cat-4", productCount: 360,  tone: "audio"  },
      { id: "cat-4-4", name: "Màn hình & TV",       slug: "man-hinh",         items: 180, status: "active", featured: false, parentId: "cat-4", productCount: 180,  tone: "visual" },
      { id: "cat-4-5", name: "Phụ kiện công nghệ",  slug: "phu-kien-cong-nghe",items: 440,status: "active", featured: false, parentId: "cat-4", productCount: 440,  tone: "utility"},
    ],
  },
  {
    id: "cat-5", name: "Sức khoẻ & Làm đẹp", slug: "suc-khoe-lam-dep", items: 2310,
    status: "active", featured: true, parentId: null, productCount: 2310,
    tone: "wellness", description: "Mỹ phẩm, chăm sóc da, sức khoẻ và wellness",
    children: [
      { id: "cat-5-1", name: "Chăm sóc da mặt",    slug: "cham-soc-da",      items: 680, status: "active", featured: true,  parentId: "cat-5", productCount: 680,  tone: "glow"   },
      { id: "cat-5-2", name: "Trang điểm",          slug: "trang-diem",       items: 520, status: "active", featured: false, parentId: "cat-5", productCount: 520,  tone: "glam"   },
      { id: "cat-5-3", name: "Thực phẩm chức năng", slug: "thuc-pham-chuc-nang",items: 390,status:"active", featured: false, parentId: "cat-5", productCount: 390,  tone: "health" },
      { id: "cat-5-4", name: "Chăm sóc tóc",        slug: "cham-soc-toc",     items: 310, status: "active", featured: false, parentId: "cat-5", productCount: 310,  tone: "natural"},
      { id: "cat-5-5", name: "Nước hoa",             slug: "nuoc-hoa",         items: 410, status: "active", featured: true,  parentId: "cat-5", productCount: 410,  tone: "luxury" },
    ],
  },
  {
    id: "cat-6", name: "Thực phẩm & Đồ uống", slug: "thuc-pham", items: 1890,
    status: "active", featured: false, parentId: null, productCount: 1890,
    tone: "fresh", description: "Thực phẩm sạch, đồ uống, bánh kẹo và ẩm thực Việt",
    children: [
      { id: "cat-6-1", name: "Cà phê & Trà",        slug: "ca-phe-tra",       items: 480, status: "active", featured: true,  parentId: "cat-6", productCount: 480,  tone: "warm"   },
      { id: "cat-6-2", name: "Bánh kẹo & Snack",    slug: "banh-keo",         items: 560, status: "active", featured: false, parentId: "cat-6", productCount: 560,  tone: "sweet"  },
      { id: "cat-6-3", name: "Thực phẩm sạch",      slug: "thuc-pham-sach",   items: 390, status: "active", featured: false, parentId: "cat-6", productCount: 390,  tone: "organic"},
      { id: "cat-6-4", name: "Đồ uống đóng chai",   slug: "do-uong",          items: 460, status: "active", featured: false, parentId: "cat-6", productCount: 460,  tone: "cool"   },
    ],
  },
  {
    id: "cat-7", name: "Nhà cửa & Nội thất", slug: "nha-cua", items: 1420,
    status: "active", featured: false, parentId: null, productCount: 1420,
    tone: "cozy", description: "Nội thất, trang trí nhà cửa, dụng cụ nhà bếp",
    children: [
      { id: "cat-7-1", name: "Phòng ngủ",           slug: "phong-ngu",        items: 380, status: "active", featured: false, parentId: "cat-7", productCount: 380,  tone: "cozy"   },
      { id: "cat-7-2", name: "Phòng khách",          slug: "phong-khach",      items: 420, status: "active", featured: false, parentId: "cat-7", productCount: 420,  tone: "modern" },
      { id: "cat-7-3", name: "Nhà bếp",              slug: "nha-bep",          items: 310, status: "active", featured: true,  parentId: "cat-7", productCount: 310,  tone: "functional"},
      { id: "cat-7-4", name: "Trang trí",            slug: "trang-tri",        items: 310, status: "active", featured: false, parentId: "cat-7", productCount: 310,  tone: "decor"  },
    ],
  },
  {
    id: "cat-8", name: "Thể thao & Dã ngoại", slug: "the-thao", items: 980,
    status: "active", featured: false, parentId: null, productCount: 980,
    tone: "active", description: "Dụng cụ thể thao, thiết bị gym, đồ dã ngoại camping",
    children: [
      { id: "cat-8-1", name: "Gym & Fitness",       slug: "gym-fitness",      items: 310, status: "active", featured: true,  parentId: "cat-8", productCount: 310,  tone: "power"  },
      { id: "cat-8-2", name: "Outdoor & Camping",   slug: "outdoor-camping",  items: 280, status: "active", featured: false, parentId: "cat-8", productCount: 280,  tone: "rugged" },
      { id: "cat-8-3", name: "Bơi lội & Biển",      slug: "boi-loi",          items: 390, status: "active", featured: false, parentId: "cat-8", productCount: 390,  tone: "surf"   },
    ],
  },
];

// ─── Tone → visual mapping ────────────────────────────────────────────────────

const TONE_MAP: Record<string, { emoji: string; gradient: string; accent: string; pill: string }> = {
  energetic:   { emoji: "⚡", gradient: "from-orange-50 to-amber-50",   accent: "border-orange-200",  pill: "bg-orange-100 text-orange-700" },
  urban:       { emoji: "🏙️", gradient: "from-gray-50 to-slate-50",    accent: "border-gray-200",    pill: "bg-gray-100 text-gray-700"     },
  feminine:    { emoji: "🌸", gradient: "from-pink-50 to-rose-50",      accent: "border-pink-200",    pill: "bg-pink-100 text-pink-700"     },
  tech:        { emoji: "📱", gradient: "from-blue-50 to-indigo-50",    accent: "border-blue-200",    pill: "bg-blue-100 text-blue-700"     },
  wellness:    { emoji: "✨", gradient: "from-emerald-50 to-teal-50",   accent: "border-emerald-200", pill: "bg-emerald-100 text-emerald-700"},
  fresh:       { emoji: "🌿", gradient: "from-green-50 to-lime-50",     accent: "border-green-200",   pill: "bg-green-100 text-green-700"   },
  cozy:        { emoji: "🏡", gradient: "from-amber-50 to-yellow-50",   accent: "border-amber-200",   pill: "bg-amber-100 text-amber-700"   },
  active:      { emoji: "🏃", gradient: "from-red-50 to-orange-50",     accent: "border-red-200",     pill: "bg-red-100 text-red-700"       },
  bold:        { emoji: "🔥", gradient: "from-red-50 to-rose-50",       accent: "border-red-200",     pill: "bg-red-100 text-red-700"       },
  casual:      { emoji: "👕", gradient: "from-sky-50 to-blue-50",       accent: "border-sky-200",     pill: "bg-sky-100 text-sky-700"       },
  formal:      { emoji: "👔", gradient: "from-slate-50 to-gray-50",     accent: "border-slate-200",   pill: "bg-slate-100 text-slate-700"   },
  premium:     { emoji: "💎", gradient: "from-violet-50 to-purple-50",  accent: "border-violet-200",  pill: "bg-violet-100 text-violet-700" },
  glow:        { emoji: "🌟", gradient: "from-yellow-50 to-amber-50",   accent: "border-yellow-200",  pill: "bg-yellow-100 text-yellow-700" },
  luxury:      { emoji: "💜", gradient: "from-purple-50 to-fuchsia-50", accent: "border-purple-200",  pill: "bg-purple-100 text-purple-700" },
  warm:        { emoji: "☕", gradient: "from-amber-50 to-orange-50",   accent: "border-amber-200",   pill: "bg-amber-100 text-amber-700"   },
  organic:     { emoji: "🌱", gradient: "from-lime-50 to-green-50",     accent: "border-lime-200",    pill: "bg-lime-100 text-lime-700"     },
  power:       { emoji: "💪", gradient: "from-orange-50 to-red-50",     accent: "border-orange-200",  pill: "bg-orange-100 text-orange-700" },
  default:     { emoji: "📦", gradient: "from-gray-50 to-slate-50",     accent: "border-gray-200",    pill: "bg-gray-100 text-gray-600"     },
};

function getTone(tone: string) {
  return TONE_MAP[tone] ?? TONE_MAP.default;
}

function fmtCount(n: number) {
  return n >= 1000 ? (n / 1000).toFixed(1) + "K" : String(n);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Single child-category chip inside an expanded group */
function ChildChip({ cat, onNavigate }: { cat: Category; onNavigate: (c: Category) => void }) {
  const t = getTone(cat.tone);
  return (
    <button onClick={() => onNavigate(cat)}
      className="group flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50/60 transition-all text-left">
      <span className="text-base shrink-0">{t.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-gray-800 truncate">{cat.name}</p>
        <p className="text-[10px] text-gray-400">{fmtCount(cat.productCount)} sp</p>
      </div>
      <ChevronRight size={12} className="text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
    </button>
  );
}

/** Category card in grid view */
function CategoryCard({
  cat, onNavigate, onToggleExpand, expanded,
}: {
  cat: Category;
  onNavigate: (c: Category) => void;
  onToggleExpand: (id: string) => void;
  expanded: boolean;
}) {
  const t = getTone(cat.tone);
  const hasChildren = (cat.children?.filter(c => c.status === "active").length ?? 0) > 0;

  return (
    <div className={cn(
      "bg-white rounded-2xl border overflow-hidden transition-all",
      expanded ? "border-gray-200 shadow-sm" : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
    )}>
      {/* Card header */}
      <button
        onClick={() => hasChildren ? onToggleExpand(cat.id) : onNavigate(cat)}
        className={cn(
          "w-full flex items-center gap-4 p-4 text-left transition-all",
          `bg-gradient-to-br ${t.gradient}`
        )}
      >
        {/* Emoji */}
        <div className={cn("w-12 h-12 rounded-xl border flex items-center justify-center text-2xl shrink-0 bg-white", t.accent)}>
          {t.emoji}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-[14px] font-semibold text-gray-900 truncate">{cat.name}</p>
            {cat.featured && (
              <span className="text-[9px] bg-amber-400 text-white px-1.5 py-0.5 rounded font-semibold shrink-0">HOT</span>
            )}
          </div>
          {cat.description && (
            <p className="text-[11px] text-gray-500 line-clamp-1">{cat.description}</p>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", t.pill)}>
              {fmtCount(cat.productCount)} sản phẩm
            </span>
            {hasChildren && (
              <span className="text-[10px] text-gray-400">
                {cat.children!.filter(c => c.status === "active").length} danh mục con
              </span>
            )}
          </div>
        </div>

        {/* Expand / arrow */}
        {hasChildren ? (
          <div className={cn("w-7 h-7 rounded-lg border bg-white flex items-center justify-center shrink-0 transition-all", t.accent)}>
            {expanded
              ? <ChevronDown size={14} className="text-gray-500" />
              : <ChevronRight size={14} className="text-gray-500" />}
          </div>
        ) : (
          <ChevronRight size={16} className="text-gray-400 shrink-0" />
        )}
      </button>

      {/* Expanded children */}
      {expanded && hasChildren && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-1.5">
            {cat.children!.filter(c => c.status === "active").map(child => (
              <ChildChip key={child.id} cat={child} onNavigate={onNavigate} />
            ))}
          </div>
          <button onClick={() => onNavigate(cat)}
            className="mt-2.5 w-full flex items-center justify-center gap-1.5 text-[12px] font-medium text-gray-600 border border-gray-200 rounded-xl py-2 hover:bg-gray-50 transition-colors">
            Xem tất cả {cat.name} <ArrowRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

/** Category row in list view */
function CategoryRow({
  cat, onNavigate, onToggleExpand, expanded,
}: {
  cat: Category;
  onNavigate: (c: Category) => void;
  onToggleExpand: (id: string) => void;
  expanded: boolean;
}) {
  const t = getTone(cat.tone);
  const hasChildren = (cat.children?.filter(c => c.status === "active").length ?? 0) > 0;

  return (
    <div className={cn("bg-white rounded-xl border overflow-hidden transition-all",
      expanded ? "border-gray-200" : "border-gray-100 hover:border-gray-200")}>
      <button
        onClick={() => hasChildren ? onToggleExpand(cat.id) : onNavigate(cat)}
        className="w-full flex items-center gap-4 px-4 py-3.5 text-left hover:bg-gray-50/60 transition-colors">
        <div className={cn("w-9 h-9 rounded-lg border flex items-center justify-center text-lg shrink-0", t.accent, `bg-gradient-to-br ${t.gradient}`)}>
          {t.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-semibold text-gray-900">{cat.name}</p>
            {cat.featured && <span className="text-[9px] bg-amber-400 text-white px-1.5 py-0.5 rounded font-semibold">HOT</span>}
          </div>
          {cat.description && <p className="text-[11px] text-gray-400 truncate">{cat.description}</p>}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className={cn("text-[11px] font-medium px-2.5 py-1 rounded-lg", t.pill)}>
            {fmtCount(cat.productCount)} sp
          </span>
          {hasChildren && (
            <span className="text-[11px] text-gray-400 hidden md:block">
              {cat.children!.filter(c => c.status === "active").length} danh mục
            </span>
          )}
          {hasChildren
            ? expanded ? <ChevronDown size={15} className="text-gray-400" /> : <ChevronRight size={15} className="text-gray-400" />
            : <ChevronRight size={15} className="text-gray-400" />
          }
        </div>
      </button>

      {/* Expanded children list */}
      {expanded && hasChildren && (
        <div className="px-4 pb-3 pt-0 border-t border-gray-50">
          <div className="flex flex-wrap gap-1.5 pt-2.5">
            {cat.children!.filter(c => c.status === "active").map(child => {
              const tc = getTone(child.tone);
              return (
                <button key={child.id} onClick={() => onNavigate(child)}
                  className={cn("flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg border transition-all hover:opacity-80", tc.pill, tc.accent.replace("border", "border"))}>
                  {tc.emoji} {child.name}
                  <span className="opacity-60">({fmtCount(child.productCount)})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CategoryPage() {
  const [search, setSearch]       = useState("");
  const [viewMode, setViewMode]   = useState<"grid" | "list">("grid");
  const [expanded, setExpanded]   = useState<Set<string>>(new Set(["cat-1", "cat-2"]));
  const [activeFilter, setFilter] = useState<"all" | "featured" | "new">("all");
  const [breadcrumb, setBreadcrumb] = useState<Category | null>(null);

  function toggleExpand(id: string) {
    setExpanded(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  function handleNavigate(cat: Category) {
    setBreadcrumb(cat);
    // In a real app: router.push(`/category/${cat.slug}`)
  }

  const activeCategories = CATEGORIES.filter(c => c.status === "active");

  const filtered = useMemo(() => {
    return activeCategories
      .filter(c => {
        if (activeFilter === "featured") return c.featured;
        return true;
      })
      .filter(c => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          (c.description ?? "").toLowerCase().includes(q) ||
          c.children?.some(ch => ch.name.toLowerCase().includes(q))
        );
      });
  }, [search, activeFilter]);

  const totalProducts = activeCategories.reduce((s, c) => s + c.productCount, 0);
  const featuredCats  = activeCategories.filter(c => c.featured);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Hero ── */}
      <div className="bg-[#1a1a2e] text-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Layers size={16} className="text-white/50" />
                <span className="text-[12px] text-white/50 tracking-wide uppercase">Khám phá danh mục</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-1.5">
                Tất cả danh mục sản phẩm
              </h1>
              <p className="text-white/50 text-[13px]">
                {activeCategories.length} danh mục · {fmtCount(totalProducts)} sản phẩm từ hàng trăm thương hiệu uy tín
              </p>
            </div>
            {/* Search */}
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 w-72">
              <Search size={14} className="text-white/50 shrink-0" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm danh mục sản phẩm..."
                className="bg-transparent text-[13px] text-white placeholder:text-white/40 outline-none flex-1"
              />
              {search && (
                <button onClick={() => setSearch("")}><X size={12} className="text-white/50 hover:text-white" /></button>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-6 grid grid-cols-4 gap-4 border-t border-white/10 pt-5">
            {[
              { label: "Danh mục chính", value: activeCategories.length,    icon: LayoutGrid },
              { label: "Tổng sản phẩm",  value: fmtCount(totalProducts),   icon: Package    },
              { label: "Danh mục nổi bật",value: featuredCats.length,       icon: Flame      },
              { label: "Cập nhật hôm nay",value: "Mới nhất",                icon: TrendingUp },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-white/70" />
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-white leading-none">{value}</p>
                  <p className="text-[11px] text-white/40 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Featured strip ── */}
      {featuredCats.length > 0 && !search && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3 overflow-x-auto">
            <span className="text-[11px] font-medium text-gray-400 whitespace-nowrap flex items-center gap-1 shrink-0">
              <Star size={11} className="fill-amber-400 text-amber-400" /> Nổi bật:
            </span>
            {featuredCats.map(c => {
              const t = getTone(c.tone);
              return (
                <button key={c.id} onClick={() => handleNavigate(c)}
                  className={cn("flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all hover:opacity-80", t.pill, t.accent.replace("border-", "border "))}>
                  {t.emoji} {c.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">

        {/* ── Breadcrumb / navigation hint ── */}
        {breadcrumb && (
          <div className="flex items-center gap-2 text-[12px] text-gray-500 bg-white border border-gray-100 rounded-xl px-4 py-2.5">
            <button onClick={() => setBreadcrumb(null)} className="hover:text-gray-800 flex items-center gap-1">
              <Home size={12} /> Danh mục
            </button>
            <ChevronRight size={11} className="text-gray-300" />
            <span className="font-medium text-gray-800">{breadcrumb.name}</span>
            <button onClick={() => setBreadcrumb(null)} className="ml-auto w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50">
              <X size={10} />
            </button>
          </div>
        )}

        {/* ── Toolbar ── */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter chips */}
          <div className="flex gap-1.5">
            {[
              { key: "all"      as const, label: "Tất cả",    icon: LayoutGrid },
              { key: "featured" as const, label: "Nổi bật",   icon: Flame      },
            ].map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setFilter(key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] border transition-all",
                  activeFilter === key ? "bg-[#1a1a2e] text-white border-[#1a1a2e]" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                )}>
                <Icon size={12} /> {label}
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                  activeFilter === key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500")}>
                  {key === "all" ? activeCategories.length : featuredCats.length}
                </span>
              </button>
            ))}
          </div>

          {/* Search result info */}
          {search && (
            <span className="text-[12px] text-gray-500">
              Kết quả cho <span className="font-medium text-gray-800">"{search}"</span>: {filtered.length} danh mục
            </span>
          )}

          {/* Expand/Collapse all */}
          <button
            onClick={() => {
              if (expanded.size > 0) setExpanded(new Set());
              else setExpanded(new Set(filtered.map(c => c.id)));
            }}
            className="text-[12px] text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5">
            <SlidersHorizontal size={12} />
            {expanded.size > 0 ? "Thu gọn tất cả" : "Mở rộng tất cả"}
          </button>

          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-[12px] text-gray-400 mr-1">{filtered.length} danh mục</span>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              {([["grid", Grid2x2], ["list", List]] as ["grid" | "list", any][]).map(([mode, Icon]) => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  className={cn("w-8 h-8 flex items-center justify-center transition-colors",
                    viewMode === mode ? "bg-[#1a1a2e] text-white" : "bg-white text-gray-400 hover:bg-gray-50")}>
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Category list/grid ── */}
        {filtered.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map(cat => (
                <CategoryCard
                  key={cat.id}
                  cat={cat}
                  onNavigate={handleNavigate}
                  onToggleExpand={toggleExpand}
                  expanded={expanded.has(cat.id)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(cat => (
                <CategoryRow
                  key={cat.id}
                  cat={cat}
                  onNavigate={handleNavigate}
                  onToggleExpand={toggleExpand}
                  expanded={expanded.has(cat.id)}
                />
              ))}
            </div>
          )
        ) : (
          <div className="py-24 text-center bg-white rounded-2xl border border-gray-100">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-500 text-[14px] font-medium mb-1">Không tìm thấy danh mục phù hợp</p>
            <button onClick={() => setSearch("")} className="text-[13px] text-blue-600 hover:underline mt-1">
              Xem tất cả danh mục →
            </button>
          </div>
        )}

        {/* ── All child categories flat explorer ── */}
        {!search && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="text-[15px] font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Tag size={15} className="text-gray-400" />
              Khám phá theo danh mục con
            </h2>
            <div className="flex flex-wrap gap-2">
              {activeCategories
                .flatMap(c => c.children ?? [])
                .filter(c => c.status === "active")
                .map(child => {
                  const t = getTone(child.tone);
                  return (
                    <button key={child.id} onClick={() => handleNavigate(child)}
                      className={cn(
                        "flex items-center gap-1.5 text-[12px] font-medium px-3 py-2 rounded-xl border transition-all hover:opacity-80",
                        t.pill,
                        t.accent.replace("border-", "border ")
                      )}>
                      <span>{t.emoji}</span>
                      <span>{child.name}</span>
                      <span className="opacity-60 text-[10px]">({fmtCount(child.productCount)})</span>
                    </button>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}