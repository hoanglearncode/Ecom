import { createCrudApi } from "@/lib/api/crud";

import type { Category } from "./types";

const categoriesApi = createCrudApi<Category[], Category>("/api/categories");

export const getCategories = categoriesApi.list;
export const getCategory = categoriesApi.get;
