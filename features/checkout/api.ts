import { createSingleResourceApi } from "@/lib/api/crud";
import { CheckoutPayload } from "./types";

const checkoutApi = createSingleResourceApi<unknown, CheckoutPayload>(
  "/api/checkout",
);

export const startCheckout = checkoutApi.write;
