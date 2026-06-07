import { Locale } from "./config";
import viTranslations from "./locales/vi.json";
import enTranslations from "./locales/en.json";

const translations = {
  vi: viTranslations,
  en: enTranslations,
} as const;

type Translations = typeof translations[vi];
type TranslationPath = string;

// Get nested value from object by path (e.g., "common.save")
function getNestedValue(obj: any, path: string): string {
  const keys = path.split(".");
  let value = obj;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = value[key];
    } else {
      return path; // Return key if not found
    }
  }

  if (typeof value === "string") {
    return value;
  }

  return path;
}

// Format translation with variables (e.g., "Min {min} characters")
function formatTemplate(template: string, variables: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return variables[key]?.toString() ?? match;
  });
}

export function t(
  locale: Locale,
  key: TranslationPath,
  variables?: Record<string, string | number>,
): string {
  const translation = translations[locale];
  const value = getNestedValue(translation, key);

  if (variables) {
    return formatTemplate(value, variables);
  }

  return value;
}

// Hook for components
export function useTranslation(locale?: Locale) {
  const uiStore = typeof window !== "undefined" ? require("../stores/ui-store").useUIStore : null;
  const currentLocale = locale ?? uiStore?.((state: any) => state.locale) ?? "vi";

  return {
    t: (key: TranslationPath, variables?: Record<string, string | number>) =>
      t(currentLocale as Locale, key, variables),
    locale: currentLocale,
  };
}

// Type-safe translation keys (optional, for better DX)
export type TranslationKey = keyof Translations;
