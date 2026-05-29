import { createCrudApi } from "@/lib/api/crud";
import { Customer } from "./types";

const customersApi = createCrudApi<Customer[], Customer>("/api/customers");

export const getCustomers = customersApi.list;
