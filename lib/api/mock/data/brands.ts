/**
 * Mock Brand Data Store
 *
 * Centralized mock data cho brands
 */

// ─── Types ───────────────────────────────────────────────────────────────────────

export interface MockBrand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  banner?: string;
  description?: string;
  website?: string;
  isActive: boolean;
  displayOrder: number;
  productCount: number;
}

// ─── Sample Brands ───────────────────────────────────────────────────────────────

export const mockBrands: MockBrand[] = [
  {
    id: "brand1",
    name: "Apple",
    slug: "apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    banner: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1200&q=80",
    description: "Think Different - Innovative technology products",
    website: "https://www.apple.com",
    isActive: true,
    displayOrder: 1,
    productCount: 45,
  },
  {
    id: "brand2",
    name: "Samsung",
    slug: "samsung",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
    description: "Inspire the World, Create the Future",
    website: "https://www.samsung.com",
    isActive: true,
    displayOrder: 2,
    productCount: 78,
  },
  {
    id: "brand3",
    name: "Sony",
    slug: "sony",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg",
    description: "Like No Other - Premium electronics",
    website: "https://www.sony.com",
    isActive: true,
    displayOrder: 3,
    productCount: 34,
  },
  {
    id: "brand4",
    name: "Dell",
    slug: "dell",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg",
    description: "Powering Possibilities",
    website: "https://www.dell.com",
    isActive: true,
    displayOrder: 4,
    productCount: 56,
  },
  {
    id: "brand5",
    name: "Nike",
    slug: "nike",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/NIKE_logo.svg",
    description: "Just Do It",
    website: "https://www.nike.com",
    isActive: true,
    displayOrder: 5,
    productCount: 123,
  },
  {
    id: "brand6",
    name: "Adidas",
    slug: "adidas",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Adidas_logo.svg",
    description: "Impossible is Nothing",
    website: "https://www.adidas.com",
    isActive: true,
    displayOrder: 6,
    productCount: 98,
  },
  {
    id: "brand7",
    name: "LG",
    slug: "lg",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/16/LG_logo.svg",
    description: "Life's Good",
    website: "https://www.lg.com",
    isActive: true,
    displayOrder: 7,
    productCount: 67,
  },
];

// ─── Helper Functions ───────────────────────────────────────────────────────────

/**
 * Get brand by ID
 */
export function getBrandById(id: string): MockBrand | undefined {
  return mockBrands.find((b) => b.id === id || b.id === `brand${id}`);
}

/**
 * Get brand by slug
 */
export function getBrandBySlug(slug: string): MockBrand | undefined {
  return mockBrands.find((b) => b.slug === slug);
}

/**
 * Get active brands
 */
export function getActiveBrands(): MockBrand[] {
  return mockBrands.filter((b) => b.isActive);
}

/**
 * Search brands
 */
export function searchBrands(query: string): MockBrand[] {
  const q = query.toLowerCase();
  return mockBrands.filter(
    (b) =>
      b.name.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q)
  );
}

// ─── Store Management ───────────────────────────────────────────────────────────

/**
 * Add new brand
 */
export function addBrand(brand: Omit<MockBrand, "id">): MockBrand {
  const newBrand: MockBrand = {
    ...brand,
    id: `brand${Date.now()}`,
    productCount: 0,
  };
  mockBrands.push(newBrand);
  return newBrand;
}

/**
 * Update brand
 */
export function updateBrand(id: string, updates: Partial<MockBrand>): MockBrand | undefined {
  const index = mockBrands.findIndex((b) => b.id === id);
  if (index === -1) return undefined;

  mockBrands[index] = {
    ...mockBrands[index],
    ...updates,
    id: mockBrands[index].id,
  };
  return mockBrands[index];
}

/**
 * Delete brand
 */
export function deleteBrand(id: string): MockBrand | undefined {
  const index = mockBrands.findIndex((b) => b.id === id);
  if (index === -1) return undefined;

  return mockBrands.splice(index, 1)[0];
}
