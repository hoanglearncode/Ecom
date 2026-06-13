/**
 * Mock Product Data Store
 *
 * Centralized mock data cho products
 * Dễ modify và maintain
 */

// ─── Types ───────────────────────────────────────────────────────────────────────

export interface MockProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  stock: number;
  images: string[];
  categoryId: string;
  brandId?: string;
  status: "active" | "draft" | "archived";
  tags?: string[];
  attributes?: Record<string, string | number | boolean>;
  releaseDate?: string;
}

// ─── Sample Products ─────────────────────────────────────────────────────────────

export const mockProducts: MockProduct[] = [
  {
    id: "p1",
    name: "iPhone 15 Pro Max",
    slug: "iphone-15-pro-max",
    description: "The ultimate iPhone. Titanium design. A17 Pro chip. 48MP Main camera.",
    price: 34990000,
    comparePrice: 36990000,
    costPrice: 28000000,
    sku: "APL-IP15PM-256",
    barcode: "194253782456",
    stock: 45,
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80",
      "https://images.unsplash.com/photo-1592286927505-2e5739464c51?w=500&q=80",
    ],
    categoryId: "cat1",
    brandId: "brand1",
    status: "active",
    tags: ["smartphone", "apple", "5g"],
    attributes: {
      screen: "6.7 inch",
      storage: "256GB",
      color: "Titanium Blue",
    },
    releaseDate: "2023-09-15",
  },
  {
    id: "p2",
    name: "MacBook Air M3",
    slug: "macbook-air-m3",
    description: "Supercharged by M3. Impossibly thin. Incredibly powerful.",
    price: 26990000,
    comparePrice: 28990000,
    costPrice: 21000000,
    sku: "APL-MBA-M3-13",
    barcode: "194253782457",
    stock: 28,
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
    ],
    categoryId: "cat1",
    brandId: "brand1",
    status: "active",
    tags: ["laptop", "apple", "m3"],
    attributes: {
      screen: "13.6 inch",
      processor: "M3",
      ram: "8GB",
      storage: "256GB SSD",
    },
    releaseDate: "2024-03-04",
  },
  {
    id: "p3",
    name: "Samsung Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    description: "Galaxy AI is here. Search like never before. Icons look like real life.",
    price: 28990000,
    comparePrice: 31990000,
    costPrice: 23000000,
    sku: "SAM-GS24U-512",
    barcode: "8806094456789",
    stock: 52,
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80",
    ],
    categoryId: "cat1",
    brandId: "brand2",
    status: "active",
    tags: ["smartphone", "samsung", "5g", "ai"],
    attributes: {
      screen: "6.8 inch",
      storage: "512GB",
      color: "Titanium Gray",
      camera: "200MP",
    },
    releaseDate: "2024-01-17",
  },
  {
    id: "p4",
    name: "Sony WH-1000XM5",
    slug: "sony-wh-1000xm5",
    description: "Industry-leading noise cancellation with Auto NC Optimizer.",
    price: 7990000,
    comparePrice: 8990000,
    costPrice: 5800000,
    sku: "SNY-WH1000XM5",
    barcode: "4548736037882",
    stock: 87,
    images: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80",
    ],
    categoryId: "cat1",
    brandId: "brand3",
    status: "active",
    tags: ["audio", "headphones", "noise-cancelling"],
    attributes: {
      type: "Over-ear",
      battery: "30 hours",
      features: "Noise Cancelling",
    },
    releaseDate: "2023-05-12",
  },
  {
    id: "p5",
    name: "iPad Air 5",
    slug: "ipad-air-5",
    description: "M1 chip. 23% faster CPU. 2x faster storage. Fast Wi-Fi 6.",
    price: 16990000,
    comparePrice: 18990000,
    costPrice: 13000000,
    sku: "APL-IPA5-M1-64",
    barcode: "194253782458",
    stock: 35,
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80",
    ],
    categoryId: "cat1",
    brandId: "brand1",
    status: "active",
    tags: ["tablet", "apple", "m1"],
    attributes: {
      screen: "10.9 inch",
      storage: "64GB",
      color: "Space Gray",
    },
    releaseDate: "2022-03-18",
  },
  {
    id: "p6",
    name: "AirPods Pro 2",
    slug: "airpods-pro-2",
    description: "Adaptive Audio. Active Noise Cancellation. Transparency mode.",
    price: 6990000,
    comparePrice: 7990000,
    costPrice: 4800000,
    sku: "APL-APP2-USB",
    barcode: "194253782459",
    stock: 120,
    images: [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&q=80",
    ],
    categoryId: "cat1",
    brandId: "brand1",
    status: "active",
    tags: ["audio", "earbuds", "apple"],
    attributes: {
      type: "In-ear",
      features: "Active Noise Cancellation",
      battery: "6 hours",
    },
    releaseDate: "2022-09-23",
  },
  {
    id: "p7",
    name: "Dell XPS 15",
    slug: "dell-xps-15",
    description: "Stunning OLED display. Incredible power. Dell's smallest 15-inch laptop.",
    price: 42990000,
    comparePrice: 46990000,
    costPrice: 35000000,
    sku: "DEL-XPS15-I7",
    barcode: "884116319455",
    stock: 18,
    images: [
      "https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=500&q=80",
    ],
    categoryId: "cat1",
    brandId: "brand4",
    status: "active",
    tags: ["laptop", "dell", "gaming"],
    attributes: {
      screen: "15.6 inch OLED",
      processor: "Intel Core i7",
      ram: "16GB",
      storage: "512GB SSD",
      gpu: "NVIDIA RTX 4050",
    },
    releaseDate: "2023-10-15",
  },
  {
    id: "p8",
    name: "Nike Air Max 270",
    slug: "nike-air-max-270",
    description: "First-ever Air Max unit designed specifically for women.",
    price: 4990000,
    comparePrice: 5490000,
    costPrice: 2800000,
    sku: "NK-AM270-WHT",
    barcode: "19485538256",
    stock: 150,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    ],
    categoryId: "cat2",
    brandId: "brand5",
    status: "active",
    tags: ["fashion", "shoes", "nike"],
    attributes: {
      size: "EU 36-45",
      color: "White/Black",
      material: "Synthetic",
    },
    releaseDate: "2023-06-01",
  },
];

// ─── Helper Functions ───────────────────────────────────────────────────────────

/**
 * Get product by ID
 */
export function getProductById(id: string): MockProduct | undefined {
  return mockProducts.find((p) => p.id === id || p.id === `p${id}`);
}

/**
 * Get product by slug
 */
export function getProductBySlug(slug: string): MockProduct | undefined {
  return mockProducts.find((p) => p.slug === slug);
}

/**
 * Get products by category
 */
export function getProductsByCategory(categoryId: string): MockProduct[] {
  return mockProducts.filter((p) => p.categoryId === categoryId);
}

/**
 * Get products by brand
 */
export function getProductsByBrand(brandId: string): MockProduct[] {
  return mockProducts.filter((p) => p.brandId === brandId);
}

/**
 * Search products
 */
export function searchProducts(query: string): MockProduct[] {
  const q = query.toLowerCase();
  return mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q))
  );
}

/**
 * Get featured products
 */
export function getFeaturedProducts(limit = 8): MockProduct[] {
  return mockProducts.slice(0, limit);
}

/**
 * Get related products
 */
export function getRelatedProducts(productId: string, limit = 4): MockProduct[] {
  const product = getProductById(productId);
  if (!product) return [];

  // Find products in same category
  const sameCategory = getProductsByCategory(product.categoryId)
    .filter((p) => p.id !== productId)
    .slice(0, limit);

  // If not enough, add from same brand
  if (sameCategory.length < limit && product.brandId) {
    const sameBrand = getProductsByBrand(product.brandId)
      .filter((p) => p.id !== productId && !sameCategory.find((sc) => sc.id === p.id))
      .slice(0, limit - sameCategory.length);

    return [...sameCategory, ...sameBrand];
  }

  return sameCategory;
}

// ─── Store Management ───────────────────────────────────────────────────────────

/**
 * Add new product
 */
export function addProduct(product: Omit<MockProduct, "id">): MockProduct {
  const newProduct: MockProduct = {
    ...product,
    id: `p${Date.now()}`,
    releaseDate: product.releaseDate || new Date().toISOString(),
  };
  mockProducts.push(newProduct);
  return newProduct;
}

/**
 * Update product
 */
export function updateProduct(id: string, updates: Partial<MockProduct>): MockProduct | undefined {
  const index = mockProducts.findIndex((p) => p.id === id || p.id === `p${id}`);
  if (index === -1) return undefined;

  mockProducts[index] = {
    ...mockProducts[index],
    ...updates,
    id: mockProducts[index].id, // Preserve ID
  };
  return mockProducts[index];
}

/**
 * Delete product
 */
export function deleteProduct(id: string): MockProduct | undefined {
  const index = mockProducts.findIndex((p) => p.id === id || p.id === `p${id}`);
  if (index === -1) return undefined;

  return mockProducts.splice(index, 1)[0];
}

/**
 * Bulk delete products
 */
export function bulkDeleteProducts(ids: string[]): number {
  const idsSet = new Set(ids.map((id) => (id.startsWith("p") ? id : `p${id}`)));
  const initialLength = mockProducts.length;

  const filtered = mockProducts.filter((p) => !idsSet.has(p.id));

  const deletedCount = initialLength - filtered.length;
  mockProducts.length = 0;
  mockProducts.push(...filtered);

  return deletedCount;
}
