import type { Product } from "@/features/products/types";
import { DEFAULT_VALUES } from "./defaults";
import { toSlug } from "./helpers";
import type {
  BrandOption,
  CategoryOption,
  ProductFormValues,
  ProductStatus,
} from "./types";

const extractNumbers = (value?: string) => {
  if (!value) return [] as number[];
  const matches = value.match(/\d+(?:\.\d+)?/g);
  if (!matches) return [] as number[];
  return matches.map((match) => Number(match));
};

const normalizeWarranty = (value?: string) => {
  if (!value) return DEFAULT_VALUES.warranty;
  const normalized = value.toLowerCase();
  if (["none", "3m", "6m", "12m", "24m"].includes(normalized)) {
    return normalized;
  }
  if (normalized.includes("2-year") || normalized.includes("24")) return "24m";
  if (normalized.includes("1-year") || normalized.includes("12")) return "12m";
  if (normalized.includes("6")) return "6m";
  if (normalized.includes("3")) return "3m";
  return DEFAULT_VALUES.warranty;
};

const deriveStatus = (product?: Product): ProductStatus => {
  if (!product) return DEFAULT_VALUES.status;
  if (product.status === "archived") return "archived";
  if ((product.stock ?? 0) === 0) return "out_of_stock";
  return product.status ?? DEFAULT_VALUES.status;
};

export const mapProductToFormValues = (
  product?: any,
): ProductFormValues => {
  if (!product) return { ...DEFAULT_VALUES };

  const dimensions = extractNumbers(product.dimensions);
  const weight = extractNumbers(product.weight)[0] ?? 0;
  const images =
    product.images && product.images.length > 0
      ? product.images.map((image : any, index: number) => ({
          id: image.id ?? `${product.id}-img-${index}`,
          url: image.url,
          isPrimary: image.isPrimary ?? index === 0,
        }))
      : product.thumbnail
        ? [
            {
              id: `${product.id}-thumb`,
              url: product.thumbnail,
              isPrimary: true,
            },
          ]
        : [];

  return {
    ...DEFAULT_VALUES,
    name: product.name ?? "",
    sku: product.sku ?? "",
    barcode: product.barcode ?? "",
    shortDescription: product.shortDescription ?? "",
    description: product.description ?? "",
    images,
    price: product.price ?? 0,
    compareAtPrice: product.compareAtPrice ?? 0,
    costPrice: product.cost ?? 0,
    stock: product.stock ?? 0,
    lowStockAlert: product.lowStockAlert ?? DEFAULT_VALUES.lowStockAlert,
    vatRate: product.vatRate ?? DEFAULT_VALUES.vatRate,
    unit: product.unit ?? DEFAULT_VALUES.unit,
    hasVariants: product.hasVariants ?? DEFAULT_VALUES.hasVariants,
    attributeGroups: product.attributeGroups ?? [],
    variants: product.variants ?? [],
    weight,
    length: dimensions[0] ?? 0,
    width: dimensions[1] ?? 0,
    height: dimensions[2] ?? 0,
    shippingFeeType: product.shippingFeeType ?? DEFAULT_VALUES.shippingFeeType,
    shippingMethods: product.shippingMethods ?? [
      ...DEFAULT_VALUES.shippingMethods,
    ],
    seoTitle: product.seoTitle ?? "",
    seoSlug: product.seoSlug ?? "",
    seoDescription: product.seoDescription ?? "",
    tags: product.tags ?? [],
    categoryKey: product.categorySlug ?? DEFAULT_VALUES.categoryKey,
    brandKey: product.brandKey ?? (product.brand ? toSlug(product.brand) : ""),
    supplierKey: product.supplierKey ?? "",
    origin: product.origin ?? DEFAULT_VALUES.origin,
    status: deriveStatus(product),
    publishAt: product.publishAt ?? "",
    returnPolicy: product.returnPolicy ?? DEFAULT_VALUES.returnPolicy,
    warranty: normalizeWarranty(product.warranty),
    isAuthentic: product.isAuthentic ?? DEFAULT_VALUES.isAuthentic,
    isNew: product.isNew ?? DEFAULT_VALUES.isNew,
  };
};

export const mapFormValuesToProduct = (
  form: ProductFormValues,
  options?: {
    base?: Product;
    categoryOptions?: CategoryOption[];
    brandOptions?: BrandOption[];
    currency?: string;
    now?: string;
  },
): any => {
  const base = options?.base;
  const categoryLabel =
    options?.categoryOptions?.find(
      (option) => option.value === form.categoryKey,
    )?.label ??
    base?.categoryName ??
    "";
  const brandLabel =
    options?.brandOptions?.find((option) => option.value === form.brandKey)
      ?.label ??
    form.brandKey ??
    base?.brand ??
    "";
  const normalizedStatus =
    form.status === "out_of_stock" ? "active" : form.status;
  const normalizedStock = form.status === "out_of_stock" ? 0 : form.stock;
  const primaryImage =
    form.images.find((image) => image.isPrimary)?.url ??
    form.images[0]?.url ??
    base?.thumbnail;
  const dimensions =
    form.length || form.width || form.height
      ? `${form.length} x ${form.width} x ${form.height} cm`
      : base?.dimensions;
  const weight = form.weight ? `${form.weight} g` : base?.weight;

  return {
    ...base,
    id: base?.id ?? `p${Date.now()}`,
    name: form.name,
    sku: form.sku,
    price: form.price,
    currency: options?.currency ?? base?.currency ?? "USD",
    categorySlug: form.categoryKey || base?.categorySlug,
    categoryName: categoryLabel || base?.categoryName,
    brand: brandLabel || base?.brand,
    compareAtPrice: form.compareAtPrice > 0 ? form.compareAtPrice : undefined,
    cost: form.costPrice > 0 ? form.costPrice : undefined,
    stock: normalizedStock,
    status: normalizedStatus,
    description: form.description || form.shortDescription || base?.description,
    shortDescription: form.shortDescription,
    barcode: form.barcode,
    thumbnail: primaryImage,
    tags: form.tags,
    warranty: form.warranty,
    weight,
    dimensions,
    releaseDate: form.publishAt || base?.releaseDate || options?.now,
    images: form.images.map((image) => ({
      id: image.id,
      url: image.url,
      isPrimary: image.isPrimary,
    })),
    lowStockAlert: form.lowStockAlert,
    vatRate: form.vatRate,
    unit: form.unit,
    hasVariants: form.hasVariants,
    attributeGroups: form.attributeGroups,
    variants: form.variants,
    shippingFeeType: form.shippingFeeType,
    shippingMethods: form.shippingMethods,
    seoTitle: form.seoTitle,
    seoSlug: form.seoSlug,
    seoDescription: form.seoDescription,
    brandKey: form.brandKey,
    supplierKey: form.supplierKey,
    origin: form.origin,
    publishAt: form.publishAt,
    returnPolicy: form.returnPolicy,
    isAuthentic: form.isAuthentic,
    isNew: form.isNew,
  };
};
