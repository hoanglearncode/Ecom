import { apiGet } from "@/lib/api/client";

import type {
  HomePageData,
  NewPageData,
  ProfilePageData,
  SalePageData,
  WishlistPageData,
} from "./types";

export function getHomePageData() {
  return apiGet<HomePageData>("/api/storefront/home");
}

export function getWishlistPageData() {
  return apiGet<WishlistPageData>("/api/storefront/wishlist");
}

export function getSalePageData() {
  return apiGet<SalePageData>("/api/storefront/sale");
}

export function getNewPageData() {
  return apiGet<NewPageData>("/api/storefront/new");
}

export function getProfilePageData() {
  return apiGet<ProfilePageData>("/api/storefront/profile");
}
