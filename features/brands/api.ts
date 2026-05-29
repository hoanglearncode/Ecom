import { createCrudApi } from "@/lib/api/crud";

import type { Brand } from "./types";

const brandsApi = createCrudApi<Brand[], Brand>("/api/brands");

export const getBrands = brandsApi.list;
export const getBrand = brandsApi.get;