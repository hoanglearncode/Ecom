import type { MockCustomer } from "../api/mock-store/types";

// ── Seed helpers ────────────────────────────────────────────────────────────
function dr(seed: number, min: number, max: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return min + Math.floor((x - Math.floor(x)) * (max - min + 1));
}

function pick<T>(arr: readonly T[], seed: number): T {
  return arr[dr(seed, 0, arr.length - 1)];
}

// ── Name pools ──────────────────────────────────────────────────────────────
const LAST = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý", "Đinh", "Trịnh", "Lưu", "Đào"] as const;
const MALE_FIRST = ["Minh", "Hoàng", "Quốc", "Thanh", "Đức", "Tuấn", "Hùng", "Long", "Nam", "Hải", "Phúc", "Bình", "Tiến", "Thành", "Khoa", "Cường", "Dũng", "Kiệt", "Lâm", "Khang", "Trung", "Phong", "Việt", "Tú", "Quân"] as const;
const FEMALE_FIRST = ["Thúy", "Thu", "Mai", "Lan", "Hương", "Linh", "Hà", "Ngọc", "Yến", "Phương", "Trang", "Thảo", "Xuân", "Oanh", "Nga", "Nhung", "Bích", "Kim", "Lệ", "Anh", "Vân", "Nhi", "Ly", "My", "Vy"] as const;
const MIDDLE = ["Thị", "Văn", "Thị", "Minh", "Thị", "Xuân", "Thị", "Quốc", "Thị", "Phú"] as const;

const STREETS = [
  "Nguyễn Huệ", "Lê Lợi", "Trần Hưng Đạo", "Đinh Tiên Hoàng", "Hai Bà Trưng",
  "Lê Duẩn", "Nguyễn Thị Minh Khai", "Phạm Ngũ Lão", "Bùi Thị Xuân", "Lý Thường Kiệt",
  "Cách Mạng Tháng 8", "Pasteur", "Điện Biên Phủ", "Võ Thị Sáu", "Tôn Đức Thắng",
  "Nam Kỳ Khởi Nghĩa", "Lê Thánh Tôn", "Ngô Quyền", "Bạch Đằng", "Trần Phú",
] as const;

const WARDS = [
  "Phường 1", "Phường 3", "Phường 5", "Phường 7", "Phường 10",
  "Bến Nghé", "Bến Thành", "Tân Định", "Đa Kao", "Phường 2",
] as const;

const DISTRICTS = ["Quận 1", "Quận 3", "Quận 5", "Quận 7", "Quận 10", "Bình Thạnh", "Tân Phú", "Gò Vấp", "Phú Nhuận", "Bình Chánh"] as const;
const CITIES = ["TP.HCM", "Hà Nội", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Biên Hòa", "Nha Trang", "Huế", "Vũng Tàu", "Đà Lạt"] as const;
const TIERS = ["bronze", "silver", "gold", "platinum"] as const;

function tierFromSpent(spent: number): typeof TIERS[number] {
  if (spent >= 5000) return "platinum";
  if (spent >= 2000) return "gold";
  if (spent >= 500) return "silver";
  return "bronze";
}

function genPhone(seed: number): string {
  const prefixes = ["090", "091", "092", "093", "094", "096", "097", "098", "032", "033"];
  return `${pick(prefixes, seed)}${String(dr(seed + 1, 1000000, 9999999))}`;
}

function genDate(seed: number): string {
  const year = dr(seed, 2019, 2024);
  const month = String(dr(seed + 1, 1, 12)).padStart(2, "0");
  const day = String(dr(seed + 2, 1, 28)).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ── Generate 100 users ───────────────────────────────────────────────────────
export const dbUsers: MockCustomer[] = Array.from({ length: 100 }, (_, i) => {
  const idx = i + 1;
  const seed = idx * 6271;
  const isFemale = dr(seed, 0, 1) === 0;
  const lastName = pick(LAST, seed + 1);
  const middle = isFemale ? pick(["Thị", ""], seed + 2) : pick(["Văn", "Quốc", ""], seed + 2);
  const firstName = isFemale ? pick(FEMALE_FIRST, seed + 3) : pick(MALE_FIRST, seed + 3);
  const fullName = [lastName, middle, firstName].filter(Boolean).join(" ");
  const city = pick(CITIES, seed + 4);
  const totalOrders = dr(seed + 5, 0, 50);
  const totalSpent = totalOrders * dr(seed + 6, 20, 500);
  const streetNum = dr(seed + 7, 1, 999);
  const street = pick(STREETS, seed + 8);
  const ward = pick(WARDS, seed + 9);
  const district = pick(DISTRICTS, seed + 10);

  return {
    id: `user_${String(idx).padStart(3, "0")}`,
    name: fullName,
    email: `${firstName.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d")}${idx}@example.com`,
    phone: genPhone(seed + 11),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
    address: `${streetNum} ${street}, ${ward}, ${district}, ${city}`,
    city,
    status: dr(seed + 12, 0, 9) < 9 ? "active" : "inactive",
    totalOrders,
    totalSpent,
    tier: tierFromSpent(totalSpent),
    createdAt: genDate(seed + 13),
  };
});
