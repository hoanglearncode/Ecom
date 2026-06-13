// Re-export từ lib/db — source of truth (100 users)
export type { MockCustomer } from "@/lib/api/mock-store/types";
export { dbUsers as mockCustomers } from "@/lib/db/users";
