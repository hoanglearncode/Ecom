import { createCrudApi } from "@/lib/api/crud";
import { InventoryItem } from "./types";

const inventoryApi = createCrudApi<InventoryItem[], InventoryItem>(
  "/api/inventory",
);

export const getInventory = inventoryApi.list;
