import type { MockCart } from "./types";

export const mockCart: MockCart = {
  id: "cart_1",
  items: [
    { productId: "p1", quantity: 1 },
    { productId: "p4", quantity: 2 },
  ],
  total: 879.89,
};
