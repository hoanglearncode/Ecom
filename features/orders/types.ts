export type Order = {
  id: string;
  number: string;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  total: number;
};
