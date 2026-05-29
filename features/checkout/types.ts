export type PaymentMethod = "card" | "cod" | "transfer";

export type CheckoutPayload = {
  cartId: string;
  addressId: string;
  paymentMethod: PaymentMethod;
};
