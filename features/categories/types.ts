export interface Category {
  id: string;
  name: string;
  slug: string;
  items: number;
  status: "active" | "inactive" | "draft";
  featured: boolean;
  parentId: string | null;
  children?: Category[];
  description?: string;
  productCount: number;
  tone: string;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
  status: "active" | "inactive" | "draft";
  featured: boolean;
}