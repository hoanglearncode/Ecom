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
  AdminCouponsData
} from "@/features/admin/types";
import { mockCategories } from "./categories";
import { mockInventory } from "./inventory";
import { mockProducts } from "./products";

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
const adminInventoryRows = mockInventory.map((item) => ({
  sku: item.sku ?? item.productId,
  stock: item.stock,
  alert: item.alert ?? "Healthy",
}));

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
      title: "New order #SH-84291 received",
      detail: "Sony WH-1000XM5 + accessories",
      time: "2m ago",
    },
    {
      title: "Review spike detected",
      detail: "3 new low-star reviews waiting for reply",
      time: "18m ago",
    },
    {
      title: "Warehouse sync completed",
      detail: "Inventory counts refreshed successfully",
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

export const mockAdminAnalytics: AdminAnalyticsData = {
  metrics: [
    { label: "Sessions", value: "48.2k", change: "+16.4%" },
    { label: "Conversion", value: "3.8%", change: "+0.7pp" },
    { label: "AOV", value: "$86.40", change: "+5.2%" },
    { label: "Returning", value: "41%", change: "+3.1%" },
  ],
  channels: [
    { name: "Organic search", value: "18.4k", share: "38%" },
    { name: "Paid social", value: "11.2k", share: "23%" },
    { name: "Email", value: "8.7k", share: "18%" },
    { name: "Referral", value: "5.1k", share: "11%" },
  ],
  actions: [
    "Compare against last week",
    "Export channel report",
    "Open abandoned cart flow",
  ],
};

export const mockAdminPromotions: AdminPromotionsData = {
  metrics: [
    { label: "Active", value: "8" },
    { label: "Scheduled", value: "4" },
    { label: "Drafts", value: "2" },
  ],
  promotions: [
    {
      name: "Welcome 10",
      audience: "New customers",
      schedule: "Always on",
      status: "Active",
    },
    {
      name: "Free Ship Weekend",
      audience: "All members",
      schedule: "Fri-Sun",
      status: "Scheduled",
    },
    {
      name: "Accessory Bundle",
      audience: "Cart over $75",
      schedule: "This month",
      status: "Draft",
    },
  ],
  actions: ["Create rule", "Assign audience"],
};

export const mockAdminReports: AdminReportsData = {
  metrics: [
    { label: "Revenue", value: "$128.4k" },
    { label: "Margin", value: "34.8%" },
    { label: "Exports", value: "12" },
  ],
  reports: [
    {
      title: "Sales performance",
      note: "Revenue, units, margin",
      status: "Ready",
    },
    {
      title: "Fulfillment report",
      note: "Pick, pack, ship timings",
      status: "Updated",
    },
    {
      title: "Customer cohort",
      note: "Repeat rate and retention",
      status: "New",
    },
    {
      title: "Returns analysis",
      note: "Reasons, products, trends",
      status: "Draft",
    },
  ],
  actions: ["Export CSV", "Compare periods"],
};

export const mockAdminSupport: AdminSupportData = {
  metrics: [
    { label: "Open", value: "12" },
    { label: "Waiting", value: "5" },
    { label: "Solved today", value: "28" },
  ],
  tickets: [
    {
      id: "#2891",
      subject: "Return request not updated",
      priority: "High",
      status: "Open",
    },
    {
      id: "#2890",
      subject: "Broken product photo link",
      priority: "Medium",
      status: "Waiting",
    },
    {
      id: "#2889",
      subject: "Coupon code not applying",
      priority: "Low",
      status: "Solved",
    },
  ],
  actions: ["Escalate ticket", "Send template reply", "Create internal note"],
};

export const mockAdminCategories: AdminCategoriesData = {
  metrics: [
    { label: "Groups", value: `${mockCategories.length}` },
    { label: "Products mapped", value: `${mockProducts.length}` },
    { label: "Featured", value: `${featuredCategoryCount}` },
  ],
  categories: adminCategoryRows,
};

export const mockAdminBrands: AdminBrandsData = {
  metrics: [
    { label: "Brands", value: "4" },
    { label: "Featured", value: "2" },
    { label: "Products mapped", value: "48" },
  ],
  brands: [
    { name: "SoundMax", category: "Audio", status: "Featured" },
    { name: "TechBand", category: "Wearables", status: "Hero" },
    { name: "ClickMaster", category: "Peripherals", status: "Core" },
    { name: "StudioKit", category: "Accessories", status: "Growth" },
  ],
};

export const mockAdminCustomers: AdminCustomersData = {
  metrics: [
    { label: "Total customers", value: "4,281" },
    { label: "VIP", value: "128" },
    { label: "At risk", value: "19" },
  ],
  customers: [
    {
      name: "Alex Morgan",
      email: "alex@example.com",
      phone: "+1 (555) 000-1234",
      status: "VIP",
    },
    {
      name: "Sarah Kim",
      email: "sarah@example.com",
      phone: "+1 (555) 123-4567",
      status: "Active",
    },
    {
      name: "James Liu",
      email: "james@example.com",
      phone: "+1 (555) 987-6543",
      status: "At risk",
    },
  ],
};

export const mockAdminInventory: AdminInventoryData = {
  metrics: [
    { label: "Total SKUs", value: `${mockInventory.length}` },
    { label: "Low stock", value: `${lowStockCount}` },
    { label: "Coverage", value: `${healthyCoverage}%` },
  ],
  inventory: adminInventoryRows,
};

export const mockAdminOrders: AdminOrdersData = {
  metrics: [
    { label: "Open", value: "14" },
    { label: "Shipping", value: "6" },
    { label: "Completed", value: "328" },
  ],
  orders: [
    { number: "SH-84291", status: "Shipped", total: "$339.10" },
    { number: "SH-84290", status: "Paid", total: "$149.99" },
    { number: "SH-84289", status: "Completed", total: "$549.98" },
  ],
};

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

export const mockAdminAppearance: AdminAppearanceData = {
  metrics: [
    { label: "Theme", value: "Dark glass" },
    { label: "Brand tokens", value: "12" },
    { label: "Preview states", value: "3" },
  ],
  settings: [
    {
      name: "Primary color",
      value: "#ff7a18",
      note: "Used for CTAs and highlights",
    },
    { name: "Surface radius", value: "16px", note: "Cards and overlays" },
    { name: "Logo variant", value: "Wordmark", note: "Header and emails" },
  ],
  actions: ["Upload brand assets", "Preview theme", "Save draft"],
};

export const mockAdminCampaigns: AdminCampaignsData = {
  metrics: [
    { label: "Campaigns", value: "9" },
    { label: "Active segments", value: "4" },
    { label: "Queued launches", value: "2" },
  ],
  campaigns: [
    {
      name: "Summer launch",
      audience: "All members",
      channel: "Email + web",
      status: "Scheduled",
    },
    {
      name: "Reactivation flow",
      audience: "Dormant 90d",
      channel: "Email",
      status: "Active",
    },
    {
      name: "Accessory upsell",
      audience: "Cart over $75",
      channel: "Web",
      status: "Draft",
    },
  ],
  actions: ["Build audience", "Schedule launch", "Review creative"],
};
