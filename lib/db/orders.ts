import type { MockOrder, MockOrderLineItem, OrderStatus } from "../api/mock-store/types";
import { dbUsers } from "./users";
import { mockProducts } from "./products";

// ── Helpers ───────────────────────────────────────────────────────────────────
function dr(seed: number, min: number, max: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return min + Math.floor((x - Math.floor(x)) * (max - min + 1));
}

const STATUSES: OrderStatus[] = ["pending", "paid", "processing", "shipped", "completed", "cancelled"];
const PAY_METHODS = ["card", "cod", "transfer"] as const;
const TRACKING_CARRIERS = ["GHN", "GHTK", "ViettelPost", "JT Express", "Ninja Van"];

function genDate(seed: number, year: number): string {
  const month = String(dr(seed, 1, 12)).padStart(2, "0");
  const day = String(dr(seed + 1, 1, 28)).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function genTracking(seed: number): string {
  const carrier = TRACKING_CARRIERS[dr(seed, 0, TRACKING_CARRIERS.length - 1)];
  const code = String(dr(seed + 1, 1000000000, 9999999999));
  return `${carrier}-${code}`;
}

/** Build human-readable summary from product names */
function buildItemsSummary(names: string[]): string {
  if (names.length === 0) return "No items";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]}, ${names[1]}`;
  return `${names[0]}, ${names[1]} +${names.length - 2} more`;
}

const PRODUCT_IDS = mockProducts.map((p) => p.id);

// ── Generate 100 orders ───────────────────────────────────────────────────────
export const dbOrders: MockOrder[] = Array.from({ length: 100 }, (_, i) => {
  const idx = i + 1;
  const seed = idx * 5381;
  const user = dbUsers[dr(seed, 0, dbUsers.length - 1)];

  // 2–5 items per order
  const itemCount = dr(seed + 1, 2, 5);
  const orderItems = Array.from({ length: itemCount }, (__, j) => {
    const pid = PRODUCT_IDS[dr(seed + j + 10, 0, PRODUCT_IDS.length - 1)];
    const qty = dr(seed + j + 20, 1, 4);
    const product = mockProducts.find((p) => p.id === pid);
    return { pid, qty, price: product?.price ?? 49, product };
  });

  const total = Math.round(
    orderItems.reduce((sum, it) => sum + it.qty * it.price, 0) * 100
  ) / 100;

  const lineItems: MockOrderLineItem[] = orderItems.map((it) => ({
    productId: it.pid,
    name: it.product?.name ?? it.pid,
    thumbnail: it.product?.thumbnail,
    quantity: it.qty,
    price: it.price,
  }));

  const itemsSummary = buildItemsSummary(orderItems.map((it) => it.product?.name ?? it.pid));

  const statusIdx = dr(seed + 2, 0, STATUSES.length - 1);
  const status = STATUSES[statusIdx];
  const year = dr(seed + 3, 2023, 2025);
  const createdAt = genDate(seed + 4, year);
  const hasTracking = status === "shipped" || status === "completed";

  return {
    id: `ord_${String(idx).padStart(5, "0")}`,
    number: `#${10000 + idx}`,
    status,
    total,
    items: itemsSummary,
    lineItems,
    date: createdAt,
    customer: user.name,
    customerId: user.id,
    customerEmail: user.email,
    customerPhone: user.phone,
    shippingAddress: user.address,
    paymentMethod: PAY_METHODS[dr(seed + 5, 0, PAY_METHODS.length - 1)],
    trackingNumber: hasTracking ? genTracking(seed + 6) : undefined,
    notes: dr(seed + 7, 0, 9) > 6 ? "Giao hàng trong giờ hành chính" : undefined,
    createdAt,
  };
});
