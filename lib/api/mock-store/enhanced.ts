/**
 * Enhanced Mock Data System
 *
 * This module exports realistic, consistent mock data for development and testing.
 * All data is generated with proper relationships and Vietnamese localization.
 */

// Re-export enhanced data
export { mockCustomers, mockOrders, getOrdersByStatus, getRecentOrders, getOrderStats } from "./orders-enhanced";
export { mockProducts, mockProductBySlug } from "./products";
export { mockCategories } from "./categories";
export { mockInventory } from "./inventory";
export { mockBrands } from "./brands";

// Import customers and orders for dataAccess helpers
const { mockCustomers: customersData } = require("./orders-enhanced");
const { mockProducts: productsData } = require("./products");
const { mockCategories: categoriesData } = require("./categories");
const { mockInventory: inventoryData } = require("./inventory");
const { mockOrders: ordersData } = require("./orders-enhanced");

// Data access helpers
export const dataAccess = {
  // Products
  getProductById: (id: string) => {
    return productsData.find((p: any) => p.id === id);
  },

  getProductBySlug: (slug: string) => {
    const { mockProductBySlug } = require("./products");
    return mockProductBySlug.get(slug);
  },

  getProductsByCategory: (categoryId: string) => {
    return productsData.filter((p: any) => p.categoryId === categoryId);
  },

  getProductsByBrand: (brand: string) => {
    return productsData.filter((p: any) => p.brand === brand);
  },

  // Categories
  getCategoryById: (id: string) => {
    return categoriesData.find((c: any) => c.id === id);
  },

  getCategoryBySlug: (slug: string) => {
    return categoriesData.find((c: any) => c.slug === slug);
  },

  // Orders
  getOrderById: (id: string) => {
    return ordersData.find((o: any) => o.id === id);
  },

  getOrderByNumber: (number: string) => {
    return ordersData.find((o: any) => o.number === number);
  },

  // Customers
  getCustomerById: (id: string) => {
    return customersData.find((c: any) => c.id === id);
  },

  // Inventory
  getInventoryByProduct: (productId: string) => {
    return inventoryData.find((i: any) => i.productId === productId);
  },

  getLowStockProducts: () => {
    return inventoryData.filter((i: any) => i.alert === "Low" || i.alert === "Out");
  },

  // Search
  searchProducts: (query: string) => {
    const q = query.toLowerCase();
    return productsData.filter((p: any) =>
      p.name.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q)
    );
  },
};

// Dashboard stats generator
export function getDashboardStats() {
  const { getOrderStats } = require("./orders-enhanced");

  const orderStats = getOrderStats();

  return {
    products: {
      total: productsData.length,
      active: productsData.filter((p: any) => p.status === "active").length,
      draft: productsData.filter((p: any) => p.status === "draft").length,
      lowStock: inventoryData.filter((i: any) => i.alert === "Low").length,
      outOfStock: inventoryData.filter((i: any) => i.alert === "Out").length,
    },
    orders: {
      total: orderStats.total,
      pending: orderStats.pending,
      paid: orderStats.paid,
      processing: orderStats.processing,
      shipped: orderStats.shipped,
      completed: orderStats.completed,
      cancelled: orderStats.cancelled,
      revenue: orderStats.totalRevenue,
    },
    customers: {
      total: customersData.length,
      vip: customersData.filter((c: any) => c.segment === "VIP").length,
      new: customersData.filter((c: any) => c.segment === "New").length,
      regular: customersData.filter((c: any) => c.segment === "Regular").length,
    },
    inventory: {
      total: inventoryData.length,
      healthy: inventoryData.filter((i: any) => i.alert === "Healthy").length,
      watch: inventoryData.filter((i: any) => i.alert === "Watch").length,
      low: inventoryData.filter((i: any) => i.alert === "Low").length,
      out: inventoryData.filter((i: any) => i.alert === "Out").length,
    },
  };
}

// Revenue data for charts
export function getRevenueData(days = 30) {
  const data: Array<{ date: string; revenue: number; orders: number }> = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    // Simulate daily orders
    const dayOrders = Math.floor(Math.random() * 20) + 5;
    const dayRevenue = dayOrders * (50000 + Math.random() * 300000);

    data.push({
      date: dateStr,
      revenue: Math.floor(dayRevenue),
      orders: dayOrders,
    });
  }

  return data;
}

// Category sales data
export function getCategorySales() {
  const categorySales: Record<string, number> = {};

  ordersData.forEach((order: any) => {
    // Simulate product category assignment
    const categories = productsData.map((p: any) => p.categoryName);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    if (randomCategory) {
      categorySales[randomCategory] = (categorySales[randomCategory] || 0) + order.total;
    }
  });

  return Object.entries(categorySales)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}
