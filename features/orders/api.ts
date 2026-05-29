import { createCrudApi } from "@/lib/api/crud";
import { Order } from "./types";

const ordersApi = createCrudApi<Order[], Order>("/api/orders");

export const getOrders = ordersApi.list;
export const getOrder = ordersApi.get;
