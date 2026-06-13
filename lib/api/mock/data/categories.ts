/**
 * Mock Category Data Store
 *
 * Centralized mock data cho categories
 */

// ─── Types ───────────────────────────────────────────────────────────────────────

export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  displayOrder: number;
  isActive: boolean;
  productCount?: number;
  metaTitle?: string;
  metaDescription?: string;
}

// ─── Sample Categories ───────────────────────────────────────────────────────────

export const mockCategories: MockCategory[] = [
  {
    id: "cat1",
    name: "Electronics",
    slug: "electronics",
    description: "Computers, phones, tablets, and accessories",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80",
    icon: "Laptop",
    displayOrder: 1,
    isActive: true,
    productCount: 156,
    metaTitle: "Best Electronics Products - Shop Now",
    metaDescription: "Discover the latest electronics at great prices.",
  },
  {
    id: "cat2",
    name: "Fashion",
    slug: "fashion",
    description: "Clothing, shoes, and accessories",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80",
    icon: "Shirt",
    displayOrder: 2,
    isActive: true,
    productCount: 243,
    metaTitle: "Fashion & Clothing - Trendy Styles",
    metaDescription: "Shop the latest fashion trends.",
  },
  {
    id: "cat3",
    name: "Home & Living",
    slug: "home-living",
    description: "Furniture, decor, and home essentials",
    image: "https://images.unsplash.com/photo-1556912960-5b0892a59126?w=500&q=80",
    icon: "Home",
    displayOrder: 3,
    isActive: true,
    productCount: 189,
    metaTitle: "Home & Living Products",
    metaDescription: "Transform your home with our products.",
  },
  {
    id: "cat4",
    name: "Beauty",
    slug: "beauty",
    description: "Skincare, makeup, and personal care",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80",
    icon: "Sparkles",
    displayOrder: 4,
    isActive: true,
    productCount: 98,
    metaTitle: "Beauty & Personal Care",
    metaDescription: "Discover beauty products for every need.",
  },
  {
    id: "cat5",
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    description: "Sports equipment, outdoor gear, and fitness",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&q=80",
    icon: "Dumbbell",
    displayOrder: 5,
    isActive: true,
    productCount: 67,
    metaTitle: "Sports & Outdoor Equipment",
    metaDescription: "Gear up for your next adventure.",
  },
  {
    id: "cat6",
    name: "Books & Stationery",
    slug: "books-stationery",
    description: "Books, notebooks, and office supplies",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80",
    icon: "BookOpen",
    displayOrder: 6,
    isActive: true,
    productCount: 234,
    metaTitle: "Books & Stationery",
    metaDescription: "Find your next great read.",
  },
];

// ─── Helper Functions ───────────────────────────────────────────────────────────

/**
 * Get category by ID
 */
export function getCategoryById(id: string): MockCategory | undefined {
  return mockCategories.find((c) => c.id === id || c.id === `cat${id}`);
}

/**
 * Get category by slug
 */
export function getCategoryBySlug(slug: string): MockCategory | undefined {
  return mockCategories.find((c) => c.slug === slug);
}

/**
 * Get active categories
 */
export function getActiveCategories(): MockCategory[] {
  return mockCategories.filter((c) => c.isActive);
}

/**
 * Get category tree (with nested children if any)
 */
export function getCategoryTree(): Array<{
  id: string;
  name: string;
  slug: string;
  image?: string;
  icon?: string;
  productCount?: number;
  children: Array<{
    id: string;
    name: string;
    slug: string;
    productCount?: number;
  }>;
}> {
  return mockCategories
    .filter((c) => c.isActive)
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
      icon: cat.icon,
      productCount: cat.productCount,
      children: [], // No nested categories in current mock data
    }))
    .sort((a, b) => {
      const aOrder = mockCategories.find((c) => c.id === a.id)?.displayOrder ?? 999;
      const bOrder = mockCategories.find((c) => c.id === b.id)?.displayOrder ?? 999;
      return aOrder - bOrder;
    });
}

// ─── Store Management ───────────────────────────────────────────────────────────

/**
 * Add new category
 */
export function addCategory(category: Omit<MockCategory, "id">): MockCategory {
  const newCategory: MockCategory = {
    ...category,
    id: `cat${Date.now()}`,
    productCount: 0,
  };
  mockCategories.push(newCategory);
  return newCategory;
}

/**
 * Update category
 */
export function updateCategory(id: string, updates: Partial<MockCategory>): MockCategory | undefined {
  const index = mockCategories.findIndex((c) => c.id === id);
  if (index === -1) return undefined;

  mockCategories[index] = {
    ...mockCategories[index],
    ...updates,
    id: mockCategories[index].id,
  };
  return mockCategories[index];
}

/**
 * Delete category
 */
export function deleteCategory(id: string): MockCategory | undefined {
  const index = mockCategories.findIndex((c) => c.id === id);
  if (index === -1) return undefined;

  return mockCategories.splice(index, 1)[0];
}

/**
 * Reorder categories
 */
export function reorderCategories(orders: Array<{ id: string; displayOrder: number }>): void {
  orders.forEach(({ id, displayOrder }) => {
    const category = mockCategories.find((c) => c.id === id);
    if (category) {
      category.displayOrder = displayOrder;
    }
  });
}
