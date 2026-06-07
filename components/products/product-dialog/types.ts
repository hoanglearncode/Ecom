export type ProductStatus = "active" | "draft" | "archived" | "out_of_stock";

export type VariantStatus = "active" | "out_of_stock" | "hidden";

export type ProductVariant = {
  id: string;
  combination: Record<string, string>;
  sku: string;
  price: number;
  stock: number;
  status: VariantStatus;
};

export type AttributeGroup = {
  id: string;
  name: string;
  values: string[];
};

export type CategoryOption = {
  value: string;
  label: string;
  parentValue?: string;
};

export type BrandOption = {
  value: string;
  label: string;
};

export type SupplierOption = {
  value: string;
  label: string;
};

export type ProductImage = {
  id: string;
  url: string;
  file?: File;
  isPrimary: boolean;
};

export type ProductFormValues = {
  // Basic info
  name: string;
  sku: string;
  barcode: string;
  shortDescription: string;
  description: string;

  // Media
  images: ProductImage[];

  // Pricing & Inventory
  price: number;
  compareAtPrice: number;
  costPrice: number;
  stock: number;
  lowStockAlert: number;
  vatRate: number;
  unit: string;

  // Variants
  hasVariants: boolean;
  attributeGroups: AttributeGroup[];
  variants: ProductVariant[];

  // Shipping
  weight: number;
  length: number;
  width: number;
  height: number;
  shippingFeeType: "buyer_pays" | "free" | "custom";
  shippingMethods: string[];

  // SEO
  seoTitle: string;
  seoSlug: string;
  seoDescription: string;
  tags: string[];

  // Categorization
  categoryKey: string;
  brandKey: string;
  supplierKey: string;
  origin: string;

  // Status & Policy
  status: ProductStatus;
  publishAt?: string;
  returnPolicy: string;
  warranty: string;
  isAuthentic: boolean;
  isNew: boolean;
};
