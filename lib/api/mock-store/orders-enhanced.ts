import type { MockCustomer, MockOrder } from "./types";

// ─── Seed data ────────────────────────────────────────────────────────────────

const customers = [
  {
    id: "cus_0001",
    name: "Nguyễn Minh Tuấn",
    email: "minh.tuan1@example.com",
    phone: "0901234567",
    address: "123 Nguyễn Huệ, Bến Nghé, Quận 1, TP.HCM",
  },
  {
    id: "cus_0002",
    name: "Trần Thúy Vân",
    email: "thuy.van2@example.com",
    phone: "0912345678",
    address: "456 Hai Bà Trưng, Phường 6, Quận 3, TP.HCM",
  },
  {
    id: "cus_0003",
    name: "Lê Hoàng Giang",
    email: "hoang.giang3@example.com",
    phone: "0923456789",
    address: "78 Lê Lai, Tân Định, Quận Tân Phú, TP.HCM",
  },
  {
    id: "cus_0004",
    name: "Phạm Minh Anh",
    email: "minh.anh4@example.com",
    phone: "0934567890",
    address: "90 Trần Phú, Phường 8, Quận 5, TP.HCM",
  },
  {
    id: "cus_0005",
    name: "Hoàng Thu Hà",
    email: "thu.ha5@example.com",
    phone: "0945678901",
    address: "234 Điện Biên Phủ, Đa Kao, Quận 1, TP.HCM",
  },
  {
    id: "cus_0006",
    name: "Huỳnh Thanh Bình",
    email: "thanh.binh6@example.com",
    phone: "0956789012",
    address: "12 Pasteur, Nguyễn Thái Bình, Quận 1, TP.HCM",
  },
  {
    id: "cus_0007",
    name: "Phan Ngọc Mai",
    email: "ngoc.mai7@example.com",
    phone: "0967890123",
    address: "67 Cách Mạng Tháng Tám, Phường 10, Quận 3, TP.HCM",
  },
  {
    id: "cus_0008",
    name: "Vũ Xuân Yến",
    email: "xuan.yen8@example.com",
    phone: "0978901234",
    address: "5 Tôn Đức Thắng, Bến Nghé, Quận 1, TP.HCM",
  },
  {
    id: "cus_0009",
    name: "Võ Quốc Khánh",
    email: "quoc.khanh9@example.com",
    phone: "0989012345",
    address: "88 Lý Tự Trọng, Bến Nghé, Quận 1, TP.HCM",
  },
  {
    id: "cus_0010",
    name: "Đặng Minh Khôi",
    email: "minh.khoi10@example.com",
    phone: "0990123456",
    address: "321 Võ Thị Sáu, Phường 7, Quận 3, TP.HCM",
  },
];

export const mockCustomers: MockCustomer[] = customers.map((customer) => ({
  id: customer.id,
  name: customer.name,
  email: customer.email,
  phone: customer.phone,
}));

const productList = [
  { name: "iPhone 15 Pro Max", price: 1199 },
  { name: "Samsung Galaxy S24 Ultra", price: 899 },
  { name: "MacBook Air M3", price: 1299 },
  { name: "AirPods Pro 2", price: 249 },
  { name: "Sony WH-1000XM5", price: 349 },
  { name: "iPad Air 5", price: 599 },
  { name: "Logitech MX Master 3S", price: 99 },
  { name: "Dell XPS 15", price: 1499 },
  { name: "Nintendo Switch OLED", price: 349 },
  { name: "GoPro Hero 12", price: 399 },
  { name: "Keychron K2 Pro", price: 89 },
  { name: "USB-C Hub 7-in-1", price: 49 },
  { name: "Wireless Headphones", price: 199 },
  { name: "Mechanical Keyboard", price: 149 },
  { name: "4K Monitor 27\"", price: 449 },
  { name: "Wireless Charger Pad", price: 39 },
];

const dateLabels = [
  "Today, 09:14",
  "Today, 11:30",
  "Today, 14:52",
  "Yesterday, 08:20",
  "Yesterday, 16:32",
  "Yesterday, 20:45",
  "May 30, 10:15",
  "May 29, 13:07",
  "May 28, 09:50",
  "May 27, 11:05",
  "May 26, 17:22",
  "May 25, 08:38",
];

const statusSequence: MockOrder["status"][] = [
  "shipped",
  "paid",
  "completed",
  "cancelled",
  "processing",
  "paid",
  "shipped",
  "paid",
  "completed",
  "shipped",
  "paid",
  "processing",
];

// ─── Generator ────────────────────────────────────────────────────────────────

function buildOrders(): MockOrder[] {
  return Array.from({ length: 12 }, (_, i) => {
    const customer = customers[i % customers.length];
    const numItems = (i % 3) + 1;

    const selectedProducts = Array.from({ length: numItems }, (__, j) =>
      productList[(i + j * 3) % productList.length]
    );

    const subtotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
    const shipping = numItems > 2 ? 0 : 15;
    const total = subtotal + shipping;

    const status = statusSequence[i];

    const itemsLabel =
      numItems === 1
        ? `1 item — ${selectedProducts[0].name}`
        : `${numItems} items — ${selectedProducts
            .slice(0, 2)
            .map((p) => p.name)
            .join(", ")}${numItems > 2 ? `, +${numItems - 2} more` : ""}`;

    const trackingNumber =
      status === "shipped" || status === "completed"
        ? `LX${String(100000000 + i * 17).slice(0, 9)}VN`
        : undefined;

    return {
      id: `ord_${String(84292 + i).padStart(5, "0")}`,
      number: `SH-${String(84292 + i).padStart(5, "0")}`,
      status,
      total,
      items: itemsLabel,
      date: dateLabels[i],
      customer: customer.name,
      customerId: customer.id,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      shippingAddress: customer.address,
      paymentMethod: i % 3 === 0 ? "Credit Card" : "COD",
      trackingNumber,
      notes: i % 4 === 0 ? "Customer requested careful packaging." : undefined,
      createdAt: dateLabels[i],
    };
  });
}

export const mockOrders: MockOrder[] = buildOrders();

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getOrdersByStatus(
  status: MockOrder["status"] | "all" = "all"
): MockOrder[] {
  if (status === "all") return mockOrders;
  return mockOrders.filter((o) => o.status === status);
}

export function getOrderById(id: string): MockOrder | undefined {
  return mockOrders.find((o) => o.id === id);
}

export function getRecentOrders(limit = 10): MockOrder[] {
  return mockOrders.slice(0, limit);
}

export function getOrderStats() {
  return {
    total: mockOrders.length,
    pending: mockOrders.filter((o) => o.status === "pending").length,
    paid: mockOrders.filter((o) => o.status === "paid").length,
    processing: mockOrders.filter((o) => o.status === "processing").length,
    shipped: mockOrders.filter((o) => o.status === "shipped").length,
    completed: mockOrders.filter((o) => o.status === "completed").length,
    cancelled: mockOrders.filter((o) => o.status === "cancelled").length,
    totalRevenue: mockOrders.reduce(
      (sum, o) => sum + (o.status !== "cancelled" ? o.total : 0),
      0
    ),
  };
}