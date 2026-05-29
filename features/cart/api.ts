import { createSingleResourceApi } from "@/lib/api/crud";
import { Cart } from "./types";

const cartApi = createSingleResourceApi<Cart, Partial<Cart>>("/api/cart");

export const getCart = cartApi.read;
export const updateCart = cartApi.write;
