import type { ProductStatus } from "./types";

export const VAT_OPTIONS = [
  { value: 0, label: "0% — Miễn thuế" },
  { value: 5, label: "5%" },
  { value: 8, label: "8%" },
  { value: 10, label: "10%" },
];

export const UNIT_OPTIONS = [
  "Cái",
  "Hộp",
  "Kg",
  "Lít",
  "Bộ",
  "Đôi",
  "Gói",
  "Mét",
];

export const ORIGIN_OPTIONS = [
  "Việt Nam",
  "Trung Quốc",
  "Hàn Quốc",
  "Nhật Bản",
  "Mỹ",
  "Châu Âu",
];

export const RETURN_POLICY_OPTIONS = [
  { value: "7_days", label: "7 ngày đổi trả" },
  { value: "15_days", label: "15 ngày đổi trả" },
  { value: "30_days", label: "30 ngày đổi trả" },
  { value: "none", label: "Không áp dụng" },
];

export const WARRANTY_OPTIONS = [
  { value: "none", label: "Không bảo hành" },
  { value: "3m", label: "3 tháng" },
  { value: "6m", label: "6 tháng" },
  { value: "12m", label: "12 tháng" },
  { value: "24m", label: "24 tháng" },
];

export const SHIPPING_METHODS = [
  { id: "fast", label: "Giao hàng nhanh" },
  { id: "pickup", label: "Nhận tại cửa hàng" },
  { id: "express", label: "Giao hàng hỏa tốc" },
  { id: "international", label: "Giao hàng quốc tế" },
];

export const STATUS_OPTIONS: Array<{
  value: ProductStatus;
  label: string;
  color: string;
}> = [
  { value: "active", label: "Đang bán", color: "green" },
  { value: "draft", label: "Bản nháp", color: "gray" },
  { value: "archived", label: "Lưu trữ", color: "yellow" },
  { value: "out_of_stock", label: "Hết hàng", color: "red" },
];
