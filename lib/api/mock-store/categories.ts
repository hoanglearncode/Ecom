import { mockCatalogCategories } from "./catalog";
import type { MockCategory } from "./types";

export const mockCategories: MockCategory[] = mockCatalogCategories.map(
  (category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    productCount: category.products.length,
    featured: category.featured,
    tone: category.tone,
  }),
);
