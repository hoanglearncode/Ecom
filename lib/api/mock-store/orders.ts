import type { MockOrder } from "./types";

export const mockOrders: MockOrder[] = [
  {
    id: "ord_1",
    number: "SH-84291",
    status: "shipped",
    total: 339.10,
    items: "2 items — Wireless Headphones, USB-C Hub",
    date: "Today, 09:14",
    customer: "Minh Tuan",
  },
  {
    id: "ord_2",
    number: "SH-84290",
    status: "paid",
    total: 149.99,
    items: "1 item — Mechanical Keyboard",
    date: "Yesterday, 16:32",
    customer: "Lan Anh",
  },
  {
    id: "ord_3",
    number: "SH-84289",
    status: "completed",
    total: 549.98,
    items: "3 items — Monitor, Stand, HDMI Cable",
    date: "May 27, 11:05",
    customer: "Duc Khanh",
  },
];