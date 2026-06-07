import type {
  BrandOption,
  CategoryOption,
  ProductFormValues,
  SupplierOption,
} from "./types";

export const DEFAULT_CATEGORIES: CategoryOption[] = [
  { value: "fashion", label: "Thời trang" },
  { value: "fashion-men-shirt", label: "Áo nam", parentValue: "fashion" },
  { value: "fashion-men-pants", label: "Quần nam", parentValue: "fashion" },
  { value: "fashion-women", label: "Thời trang nữ", parentValue: "fashion" },
  { value: "electronics", label: "Điện tử" },
  {
    value: "electronics-phone",
    label: "Điện thoại",
    parentValue: "electronics",
  },
  { value: "electronics-laptop", label: "Laptop", parentValue: "electronics" },
  { value: "home", label: "Gia dụng" },
  { value: "beauty", label: "Làm đẹp" },
  { value: "health", label: "Sức khỏe" },
  { value: "sports", label: "Thể thao" },
  { value: "books", label: "Sách & Văn phòng phẩm" },
];

export const DEFAULT_BRANDS: BrandOption[] = [
  { value: "uniqlo", label: "Uniqlo" },
  { value: "zara", label: "Zara" },
  { value: "local-a", label: "Local Brand A" },
  { value: "nike", label: "Nike" },
  { value: "adidas", label: "Adidas" },
];

export const DEFAULT_SUPPLIERS: SupplierOption[] = [
  { value: "ncc-hn", label: "NCC Hà Nội" },
  { value: "xuong-hcm", label: "Xưởng may TP.HCM" },
  { value: "import-cn", label: "Nhập khẩu Trung Quốc" },
];

export const DEFAULT_VALUES: ProductFormValues = {
  name: "",
  sku: "",
  barcode: "",
  shortDescription: "",
  description: "",
  images: [],
  price: 0,
  compareAtPrice: 0,
  costPrice: 0,
  stock: 0,
  lowStockAlert: 5,
  vatRate: 5,
  unit: "Cái",
  hasVariants: false,
  attributeGroups: [],
  variants: [],
  weight: 0,
  length: 0,
  width: 0,
  height: 0,
  shippingFeeType: "buyer_pays",
  shippingMethods: ["fast"],
  seoTitle: "",
  seoSlug: "",
  seoDescription: "",
  tags: [],
  categoryKey: "",
  brandKey: "",
  supplierKey: "",
  origin: "Việt Nam",
  status: "draft",
  publishAt: "",
  returnPolicy: "7_days",
  warranty: "none",
  isAuthentic: false,
  isNew: true,
};
