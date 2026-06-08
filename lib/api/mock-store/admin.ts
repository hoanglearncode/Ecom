import type {
  AdminAnalyticsData,
  AdminDashboardData,
  AdminOrdersData,
  AdminReviewsData,
  AdminInventoryData,
  AdminBrandsData,
  AdminCategoriesData,
  AdminCustomersData,
  AdminPromotionsData,
  AdminReportsData,
  AdminSupportData,
  AdminAppearanceData,
  AdminCampaignsData,
  AdminCouponsData,
} from "@/features/admin/types";
import { mockBrands } from "./brands";
import { mockCategories } from "./categories";
import { mockInventory } from "./inventory";
import { mockOrders, getOrderStats } from "./orders-enhanced";
import { mockProducts } from "./products";
import { mockCustomers } from "./customers";
import { mockAdminReports as mockAdminReportsFull } from "./mock-admin-reports";

// ─── Derived values ─────────────────────────────────────────────────────────

const lowStockCount = mockInventory.filter(
  (item) => item.alert === "Low" || item.alert === "Out",
).length;
const healthyCoverage = Math.round(
  (mockInventory.filter((item) => item.alert === "Healthy").length /
    mockInventory.length) *
    100,
);
const featuredCategoryCount = mockCategories.filter(
  (category) => category.featured,
).length;

const adminCategoryRows = mockCategories.map((category) => ({
  name: category.name,
  items: category.productCount,
  status: category.featured
    ? "Featured"
    : category.productCount >= 10
      ? "Core"
      : "Curated",
}));

// Create nested category structure with children
const createCategoryTree = () => {
  const topLevelCategories = mockCategories.slice(0, 8); // Take first 8 as top-level

  return topLevelCategories.map((cat, index) => {
    const statusValue: "active" | "draft" | "inactive" =
      cat.productCount >= 10 ? "active" : "draft";

    const baseCategory = {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      items: cat.productCount,
      status: statusValue,
      featured: cat.featured,
      parentId: null as string | null,
      description: cat.description,
      productCount: cat.productCount,
      tone: cat.tone,
    };

    // Add children for some categories to create tree structure
    if (index === 0) {
      // Audio - add subcategories
      baseCategory.status = "active";
      return {
        ...baseCategory,
        children: [
          {
            id: "cat-audio-headphones",
            name: "Headphones",
            slug: "headphones",
            items: 28,
            status: "active" as const,
            featured: true,
            parentId: cat.id,
            description: "Over-ear and in-ear audio.",
            productCount: 28,
            tone: "from-blue-500/20 via-sky-500/10 to-transparent",
          },
          {
            id: "cat-audio-speakers",
            name: "Speakers",
            slug: "speakers",
            items: 20,
            status: "inactive" as const,
            featured: false,
            parentId: cat.id,
            description: "Portable and home speakers.",
            productCount: 20,
            tone: "from-blue-500/20 via-sky-500/10 to-transparent",
          },
        ],
      };
    }

    if (index === 4) {
      // Laptops - add subcategories
      baseCategory.status = "active";
      baseCategory.featured = true;
      return {
        ...baseCategory,
        children: [
          {
            id: "cat-laptops-ultrabooks",
            name: "Ultrabooks",
            slug: "ultrabooks",
            items: 32,
            status: "active" as const,
            featured: true,
            parentId: cat.id,
            description: "Thin and light laptops.",
            productCount: 32,
            tone: "from-blue-500/20 via-indigo-500/10 to-transparent",
          },
          {
            id: "cat-laptops-gaming",
            name: "Gaming Laptops",
            slug: "gaming-laptops",
            items: 18,
            status: "active" as const,
            featured: false,
            parentId: cat.id,
            description: "High-performance gaming machines.",
            productCount: 18,
            tone: "from-blue-500/20 via-indigo-500/10 to-transparent",
          },
        ],
      };
    }

    if (index === 5) {
      // Phones - add subcategories
      baseCategory.status = "active";
      baseCategory.featured = true;
      return {
        ...baseCategory,
        children: [
          {
            id: "cat-phones-flagship",
            name: "Flagship",
            slug: "flagship",
            items: 45,
            status: "active" as const,
            featured: true,
            parentId: cat.id,
            description: "Premium flagship smartphones.",
            productCount: 45,
            tone: "from-purple-500/20 via-pink-500/10 to-transparent",
          },
          {
            id: "cat-phones-midrange",
            name: "Mid-range",
            slug: "midrange",
            items: 35,
            status: "active" as const,
            featured: false,
            parentId: cat.id,
            description: "Affordable midrange phones.",
            productCount: 35,
            tone: "from-purple-500/20 via-pink-500/10 to-transparent",
          },
        ],
      };
    }

    if (index === 3) {
      // Peripherals - add nested subcategories
      baseCategory.status = "active";
      return {
        ...baseCategory,
        children: [
          {
            id: "cat-peripherals-keyboards",
            name: "Keyboards",
            slug: "keyboards",
            items: 24,
            status: "active" as const,
            featured: false,
            parentId: cat.id,
            description: "Mechanical and wireless keyboards.",
            productCount: 24,
            tone: "from-amber-500/20 via-orange-500/10 to-transparent",
            children: [
              {
                id: "cat-peripherals-keyboards-mechanical",
                name: "Mechanical",
                slug: "mechanical-keyboards",
                items: 15,
                status: "active" as const,
                featured: true,
                parentId: "cat-peripherals-keyboards",
                description: "Mechanical switch keyboards.",
                productCount: 15,
                tone: "from-amber-500/20 via-orange-500/10 to-transparent",
              },
              {
                id: "cat-peripherals-keyboards-wireless",
                name: "Wireless",
                slug: "wireless-keyboards",
                items: 9,
                status: "inactive" as const,
                featured: false,
                parentId: "cat-peripherals-keyboards",
                description: "Wireless and bluetooth keyboards.",
                productCount: 9,
                tone: "from-amber-500/20 via-orange-500/10 to-transparent",
              },
            ],
          },
          {
            id: "cat-peripherals-mice",
            name: "Mice",
            slug: "mice",
            items: 18,
            status: "active" as const,
            featured: false,
            parentId: cat.id,
            description: "Ergonomic and gaming mice.",
            productCount: 18,
            tone: "from-amber-500/20 via-orange-500/10 to-transparent",
          },
        ],
      };
    }

    return baseCategory;
  });
};

const adminCategories = createCategoryTree();

const adminInventoryRows = mockInventory.map((item) => {
  const product = mockProducts.find((p) => p.id === item.productId);
  return {
    sku: item.sku ?? item.productId,
    stock: item.stock,
    alert: item.alert ?? "Healthy",
    productName: product?.name ?? item.productId,
    brand: product?.brand ?? "Unknown",
    categoryName: product?.categoryName ?? "Unknown",
  };
});

const orderStats = getOrderStats();
const openOrderCount =
  orderStats.pending + orderStats.paid + orderStats.processing;

// ─── Dashboard ─────────────────────────────────────────────────────────────

export const mockAdminDashboard: AdminDashboardData = {
  metrics: [
    { label: "Revenue", value: "$128.4k", change: "+12.4%" },
    { label: "Orders", value: "842", change: "+8.1%" },
    { label: "Customers", value: "4,281", change: "+4.7%" },
    {
      label: "Stock items",
      value: `${mockProducts.length}`,
      change: `${healthyCoverage}% healthy`,
    },
  ],
  activity: [
    {
      title: "New order #SH-84303 received",
      detail: `${mockProducts[0]?.name ?? "Featured product"} + accessories`,
      time: "2m ago",
    },
    {
      title: "Review spike detected",
      detail: `${mockProducts[1]?.name ?? "Product"} has 3 new low-star reviews waiting for reply`,
      time: "18m ago",
    },
    {
      title: "Warehouse sync completed",
      detail: `${mockProducts.length} product SKUs refreshed successfully`,
      time: "1h ago",
    },
    {
      title: "Coupon campaign scheduled",
      detail: "FREESHIP starts Friday 10:00 AM",
      time: "3h ago",
    },
  ],
  actions: [
    "Create product",
    "Review orders",
    "Adjust inventory",
    "Launch coupon",
  ],
};

// ─── Analytics ─────────────────────────────────────────────────────────────

export const mockAdminAnalytics: AdminAnalyticsData = {
  metrics: [
    { label: "Total revenue", value: "$128.4k", change: "+12.4%" },
    { label: "Total orders", value: "842", change: "+8.1%" },
    { label: "New customers", value: "214", change: "+4.7%" },
    { label: "Avg order", value: "$152", change: "+2.3%" },
  ],
  channels: [
    { name: "Search", value: "42", share: "42%" },
    { name: "Social", value: "28", share: "28%" },
    { name: "Email", value: "18", share: "18%" },
    { name: "Direct", value: "12", share: "12%" },
  ],
  actions: ["View funnel", "Export report", "Add KPI"],
};

// ─── Promotions ─────────────────────────────────────────────────────────────

export const mockAdminPromotions: AdminPromotionsData = {
  metrics: [
    { label: "Active", value: "4" },
    { label: "Scheduled", value: "3" },
    { label: "Paused", value: "1" },
  ],
  promotions: [
    {
      name: "Spring Launch",
      audience: "All shoppers",
      schedule: "May 1 - May 15",
      status: "Active",
    },
    {
      name: "VIP Early Access",
      audience: "VIP",
      schedule: "May 16 - May 20",
      status: "Scheduled",
    },
    {
      name: "Clearance",
      audience: "All shoppers",
      schedule: "May 21 - May 31",
      status: "Active",
    },
  ],
  actions: ["Create promotion", "Review segments", "Schedule send"],
};

// ─── Reports ────────────────────────────────────────────────────────────────

export const mockAdminReports = mockAdminReportsFull;

// ─── Support ────────────────────────────────────────────────────────────────

export const mockAdminSupport: AdminSupportData = {
  metrics: [
    { label: "Open", value: "12" },
    { label: "Pending", value: "6" },
    { label: "Resolved", value: "94" },
  ],
  tickets: [
    {
      id: "SUP-1001",
      subject: "Refund request",
      priority: "High",
      status: "Open",
    },
    {
      id: "SUP-1002",
      subject: "Delivery delay",
      priority: "Medium",
      status: "Pending",
    },
    {
      id: "SUP-1003",
      subject: "Account access",
      priority: "Low",
      status: "Resolved",
    },
  ],
  actions: ["Assign tickets", "Create macro", "Escalate"],
};

// ─── Categories ─────────────────────────────────────────────────────────────

export const mockAdminCategories: AdminCategoriesData = {
  metrics: [
    { label: "Total categories", value: `${mockCategories.length}` },
    { label: "Featured", value: `${featuredCategoryCount}` },
    { label: "Low stock", value: `${lowStockCount}` },
  ],
  categories: adminCategories,
};

// ─── Brands ─────────────────────────────────────────────────────────────────

export const mockAdminBrands: AdminBrandsData = {
  metrics: [
    { label: "Total brands", value: `${mockBrands.length}` },
    {
      label: "Featured",
      value: `${mockBrands.filter((b) => b.featured).length}`,
    },
    {
      label: "Avg products",
      value: `${Math.round(mockBrands.reduce((sum, b) => sum + b.productCount, 0) / Math.max(mockBrands.length, 1))}`,
    },
  ],
  brands: mockBrands.map((brand) => ({
    name: brand.name,
    category: brand.category,
    status: brand.featured ? "Featured" : "Active",
  })),
};

// ─── Customers ─────────────────────────────────────────────────────────────

const customerStatuses = ["VIP", "Active", "At risk"] as const;

export const mockAdminCustomers: AdminCustomersData = {
  metrics: [
    { label: "Total customers", value: `${mockCustomers.length}` },
    { label: "Active", value: `${mockCustomers.length - 1}` },
    { label: "At risk", value: "1" },
  ],
  customers: mockCustomers.map((customer, index) => ({
    name: customer.name,
    email: customer.email ?? "-",
    phone: customer.phone ?? "-",
    status: customerStatuses[index % customerStatuses.length],
  })),
};

// ─── Inventory ──────────────────────────────────────────────────────────────

export const mockAdminInventory: AdminInventoryData = {
  metrics: [
    { label: "Total SKUs", value: `${mockInventory.length}` },
    { label: "Low stock", value: `${lowStockCount}` },
    { label: "Coverage", value: `${healthyCoverage}%` },
  ],
  inventory: adminInventoryRows,
};

// ─── Orders ─────────────────────────────────────────────────────────────────

export const mockAdminOrders: AdminOrdersData = {
  metrics: [
    { label: "Open", value: String(openOrderCount) },
    { label: "Shipping", value: String(orderStats.shipped) },
    { label: "Completed", value: String(orderStats.completed) },
  ],
  orders: mockOrders,
};

// ─── Reviews ────────────────────────────────────────────────────────────────

export const mockAdminReviews: AdminReviewsData = {
  metrics: [
    { label: "Avg rating", value: "4.6" },
    { label: "Pending reply", value: "7" },
    { label: "Published", value: "1,024" },
  ],
  reviews: [
    {
      author: "Maya",
      rating: 5,
      note: "Great quality and fast shipping.",
      status: "Published",
    },
    {
      author: "Chris",
      rating: 2,
      note: "The box was damaged on arrival.",
      status: "Needs reply",
    },
    {
      author: "Noah",
      rating: 4,
      note: "Solid product, would buy again.",
      status: "Published",
    },
  ],
};

// ─── Coupons ────────────────────────────────────────────────────────────────

export const mockAdminCoupons: AdminCouponsData = {
  coupons: [
    {
      code: "WELCOME10",
      title: "First order welcome",
      discount: "10% off",
      status: "active",
      usage: "1,248 redemptions",
      expiresAt: "Dec 31, 2026",
    },
    {
      code: "FREESHIP",
      title: "Free shipping weekend",
      discount: "Free shipping",
      status: "scheduled",
      usage: "Scheduled for Friday",
      expiresAt: "Jun 5, 2026",
    },
    {
      code: "BUNDLE15",
      title: "Accessory bundle",
      discount: "$15 off",
      status: "active",
      usage: "842 redemptions",
      expiresAt: "Aug 14, 2026",
    },
    {
      code: "SPRING25",
      title: "Seasonal clearance",
      discount: "25% off",
      status: "expired",
      usage: "Retired campaign",
      expiresAt: "Apr 30, 2026",
    },
  ],
};

// ─── Appearance ─────────────────────────────────────────────────────────────

export const mockAdminAppearance: AdminAppearanceData = {
  metrics: [
    { label: "Theme", value: "Dark glass" },
    { label: "Brand tokens", value: "12" },
    { label: "Preview states", value: "3" },
  ],
  settings: [
    { name: "Header", value: "Transparent", note: "Matches hero" },
    { name: "Buttons", value: "Rounded", note: "Large" },
    { name: "Cards", value: "Glass", note: "High contrast" },
  ],
  actions: ["Preview", "Publish", "Reset"],
};

// ─── Campaigns ──────────────────────────────────────────────────────────────

export const mockAdminCampaigns: AdminCampaignsData = {
  metrics: [
    { label: "Active", value: "3" },
    { label: "Scheduled", value: "2" },
    { label: "Paused", value: "1" },
  ],
  campaigns: [
    {
      name: "Spring launch",
      audience: "All",
      channel: "Email",
      status: "Active",
    },
    {
      name: "VIP early access",
      audience: "VIP",
      channel: "SMS",
      status: "Active",
    },
    {
      name: "Abandoned cart",
      audience: "All",
      channel: "Push",
      status: "Paused",
    },
  ],
  actions: ["Create campaign", "Review segments", "Schedule send"],
};
