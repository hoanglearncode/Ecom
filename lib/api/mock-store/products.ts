import { mockCatalogCategories } from "./catalog";
import type { MockProduct } from "./types";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/['.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const stockLevels = [18, 8, 24, 12, 36, 5, 62, 14, 0, 47];
const statuses: Array<NonNullable<MockProduct["status"]>> = [
  "active",
  "active",
  "active",
  "active",
  "draft",
  "active",
  "active",
  "active",
  "archived",
  "active",
];

export const mockProducts: MockProduct[] = mockCatalogCategories.flatMap(
  (category, categoryIndex) =>
    category.products.map((item, productIndex) => {
      const globalIndex = categoryIndex * 10 + productIndex + 1;
      const brand = category.brands[productIndex % category.brands.length];
      const stock =
        stockLevels[(categoryIndex + productIndex) % stockLevels.length] +
        (categoryIndex % 4) * 3;
      const compareAtPrice =
        productIndex % 3 === 0
          ? Number((item.price * 1.16).toFixed(2))
          : productIndex % 5 === 0
            ? Number((item.price * 1.08).toFixed(2))
            : undefined;

      return {
        id: `p${globalIndex}`,
        name: item.name,
        sku: `${brand.slice(0, 4).toUpperCase().replace(/[^A-Z0-9]/g, "")}-${category.slug
          .slice(0, 4)
          .toUpperCase()}-${String(productIndex + 1).padStart(2, "0")}`,
        price: item.price,
        currency: "USD",
        thumbnail: category.image,
        description: `${item.name} from ${brand}, selected for ${category.name.toLowerCase()} shoppers who want reliable quality, practical specs, and a polished everyday experience.`,
        brand,
        categoryId: category.id,
        categorySlug: category.slug,
        categoryName: category.name,
        compareAtPrice,
        cost: Number((item.price * (0.52 + (productIndex % 4) * 0.04)).toFixed(2)),
        rating: Number((4.15 + ((categoryIndex + productIndex) % 8) * 0.1).toFixed(1)),
        reviewCount: 34 + categoryIndex * 17 + productIndex * 23,
        stock,
        status: statuses[(categoryIndex + productIndex) % statuses.length],
        tags: [
          ...category.tags.slice(0, 3),
          brand.toLowerCase().replace(/\s+/g, "-"),
          productIndex % 2 === 0 ? "best-seller" : "new-arrival",
        ],
        color: item.color,
        material: item.material,
        warranty: productIndex % 4 === 0 ? "2-year limited warranty" : "1-year limited warranty",
        releaseDate: `202${3 + (categoryIndex % 3)}-${String((productIndex % 12) + 1).padStart(2, "0")}-15`,
        weight: item.weight,
        dimensions: item.dimensions,
      };
    }),
);

export const mockProductBySlug = new Map(
  mockProducts.map((product) => [slugify(product.name), product]),
);
