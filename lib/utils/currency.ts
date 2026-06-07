import { Currency } from "../stores/ui-store";

// Currency configurations
export const currencyConfigs: Record<
  Currency,
  { symbol: string; position: "before" | "after"; decimals: number; locale: string }
> = {
  VND: {
    symbol: "₫",
    position: "after",
    decimals: 0,
    locale: "vi-VN",
  },
  USD: {
    symbol: "$",
    position: "before",
    decimals: 2,
    locale: "en-US",
  },
  EUR: {
    symbol: "€",
    position: "before",
    decimals: 2,
    locale: "de-DE",
  },
};

/**
 * Format currency amount
 */
export function formatCurrency(
  amount: number,
  currency: Currency = "VND",
  locale?: string,
): string {
  const config = currencyConfigs[currency];
  const formatterLocale = locale ?? config.locale;

  // Use Intl for proper formatting
  const formatter = new Intl.NumberFormat(formatterLocale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  });

  return formatter.format(amount);
}

/**
 * Format currency amount with custom symbol position
 */
export function formatCurrencyCustom(
  amount: number,
  currency: Currency = "VND",
): string {
  const config = currencyConfigs[currency];

  // Format number with proper thousand separators and decimals
  const formattedNumber = amount.toLocaleString(config.locale, {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  });

  if (config.position === "before") {
    return `${config.symbol}${formattedNumber}`;
  }

  return `${formattedNumber}${config.symbol}`;
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string, currency: Currency = "VND"): number {
  const config = currencyConfigs[currency];

  // Remove currency symbol and non-numeric characters except decimal point
  let cleaned = value.trim();

  // Remove symbol if present
  if (config.position === "before" && cleaned.startsWith(config.symbol)) {
    cleaned = cleaned.slice(config.symbol.length);
  } else if (config.position === "after" && cleaned.endsWith(config.symbol)) {
    cleaned = cleaned.slice(0, -config.symbol.length);
  }

  // Remove thousand separators
  cleaned = cleaned.replace(/,/g, "");

  // Parse as float
  return parseFloat(cleaned) || 0;
}

/**
 * Format number with locale-specific thousand separators
 */
export function formatNumber(value: number, locale: string = "vi-VN"): string {
  return value.toLocaleString(locale);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Convert currency (placeholder for real conversion rates)
 */
export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency,
  rates?: Record<string, number>,
): number {
  if (from === to) return amount;

  // Default rates (in production, fetch from API)
  const defaultRates: Record<string, number> = {
    USD: 1,
    VND: 25_000,
    EUR: 0.92,
  };

  const exchangeRates = rates ?? defaultRates;

  // Convert to USD first, then to target currency
  const inUSD = amount / (exchangeRates[from] ?? 1);
  return inUSD * (exchangeRates[to] ?? 1);
}

/**
 * Format price range (e.g., "₫100.000 - ₫500.000")
 */
export function formatPriceRange(
  min: number,
  max: number,
  currency: Currency = "VND",
): string {
  return `${formatCurrencyCustom(min, currency)} - ${formatCurrencyCustom(max, currency)}`;
}

/**
 * Format discount percentage
 */
export function formatDiscount(originalPrice: number, salePrice: number): string {
  const discount = ((originalPrice - salePrice) / originalPrice) * 100;
  return `-${formatPercentage(discount, 0)}`;
}
