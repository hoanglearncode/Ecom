import { createCrudApi } from "@/lib/api/crud";
import { Product } from "./types";

const productsApi = createCrudApi<Product[], Product>("/api/products");

export const getProducts = productsApi.list;
export const getProduct = productsApi.get;
