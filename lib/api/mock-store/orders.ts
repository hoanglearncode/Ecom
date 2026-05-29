import type { MockOrder } from "./types";

export const mockOrders: MockOrder[] = [
  { id: "ord_1", number: "SH-84291", status: "shipped", total: 339.1 },
  { id: "ord_2", number: "SH-84290", status: "paid", total: 149.99 },
  { id: "ord_3", number: "SH-84289", status: "completed", total: 549.98 },
];
