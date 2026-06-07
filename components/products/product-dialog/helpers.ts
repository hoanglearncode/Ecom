import type { AttributeGroup, ProductVariant } from "./types";

export const toSlug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const generateId = () => Math.random().toString(36).slice(2, 9);

export function generateVariantCombinations(
  groups: AttributeGroup[],
): Record<string, string>[] {
  const filled = groups.filter(
    (group) => group.name && group.values.length > 0,
  );
  if (filled.length === 0) return [];
  return filled.reduce<Record<string, string>[]>((acc, group) => {
    if (acc.length === 0) {
      return group.values.map((value) => ({ [group.name]: value }));
    }
    return acc.flatMap((combo) =>
      group.values.map((value) => ({ ...combo, [group.name]: value })),
    );
  }, []);
}

export function buildVariants(
  groups: AttributeGroup[],
  existing: ProductVariant[],
): ProductVariant[] {
  const combos = generateVariantCombinations(groups);
  return combos.map((combo) => {
    const key = Object.values(combo).join("-");
    const found = existing.find(
      (variant) => Object.values(variant.combination).join("-") === key,
    );
    return (
      found ?? {
        id: generateId(),
        combination: combo,
        sku: "",
        price: 0,
        stock: 0,
        status: "active" as const,
      }
    );
  });
}
