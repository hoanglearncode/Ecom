"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUIStore, useLocale, useCurrency } from "@/lib/stores/ui-store";
import { localeNames, localeFlags, type Locale } from "@/lib/i18n/config";
import { Globe, DollarSign, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const CURRENCIES: Record<
  string,
  { symbol: string; flag: string; name: string }
> = {
  VND: { symbol: "₫", flag: "🇻🇳", name: "Vietnamese Dong" },
  USD: { symbol: "$", flag: "🇺🇸", name: "US Dollar" },
  EUR: { symbol: "€", flag: "🇪🇺", name: "Euro" },
};

interface LocaleCurrencySwitcherProps {
  variant?: "button" | "select" | "combined";
  className?: string;
}

export function LocaleCurrencySwitcher({
  variant = "combined",
  className,
}: LocaleCurrencySwitcherProps) {
  const locale = useLocale();
  const currency = useCurrency();
  const setLocale = useUIStore((state) => state.setLocale);
  const setCurrency = useUIStore((state) => state.setCurrency);
  const [open, setOpen] = useState(false);

  if (variant === "button") {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn("gap-2", className)}
          >
            <Globe className="h-4 w-4" />
            <span className="hidden md:inline">
              {localeFlags[locale]} {localeNames[locale]}
            </span>
            <span className="md:hidden">{localeFlags[locale]}</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="end">
          <div className="space-y-1">
            {(Object.keys(localeNames) as Locale[]).map((loc) => (
              <button
                key={loc}
                onClick={() => {
                  setLocale(loc);
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm w-full hover:bg-muted transition-colors",
                  locale === loc && "bg-muted font-medium",
                )}
              >
                <span className="text-base">{localeFlags[loc]}</span>
                <span>{localeNames[loc]}</span>
              </button>
            ))}
          </div>
          <div className="border-t mt-2 pt-2">
            <div className="space-y-1">
              {(Object.keys(CURRENCIES) as Array<keyof typeof CURRENCIES>).map(
                (curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm w-full hover:bg-muted transition-colors",
                      currency === curr && "bg-muted font-medium",
                    )}
                  >
                    <span className="text-base">{CURRENCIES[curr].flag}</span>
                    <span>{curr}</span>
                    <span className="text-muted-foreground">
                      {CURRENCIES[curr].name}
                    </span>
                  </button>
                ),
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  if (variant === "select") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {/* Language Selector */}
        <Select value={locale} onValueChange={(v) => setLocale(v as Locale)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(localeNames) as Locale[]).map((loc) => (
              <SelectItem key={loc} value={loc}>
                <span className="flex items-center gap-2">
                  <span>{localeFlags[loc]}</span>
                  <span>{localeNames[loc]}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Currency Selector */}
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(CURRENCIES) as Array<keyof typeof CURRENCIES>).map(
              (curr) => (
                <SelectItem key={curr} value={curr}>
                  <span className="flex items-center gap-2">
                    <span>{CURRENCIES[curr].flag}</span>
                    <span>{curr}</span>
                  </span>
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Combined variant - compact switcher
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("gap-1.5 h-8", className)}
        >
          <Globe className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{localeFlags[locale]}</span>
          <span className="text-xs">{locale.toUpperCase()}</span>
          <span className="text-muted-foreground">|</span>
          <span className="hidden sm:inline">{CURRENCIES[currency].flag}</span>
          <span className="text-xs">{currency}</span>
          <ChevronDown className="h-3 w-3.5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="end">
        {/* Language Section */}
        <div className="p-2 border-b">
          <p className="text-xs font-medium text-muted-foreground px-2 mb-1">
            Language / Ngôn ngữ
          </p>
          <div className="space-y-0.5">
            {(Object.keys(localeNames) as Locale[]).map((loc) => (
              <button
                key={loc}
                onClick={() => setLocale(loc)}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm w-full hover:bg-muted transition-colors",
                  locale === loc && "bg-muted",
                )}
              >
                <span className="text-base">{localeFlags[loc]}</span>
                <span>{localeNames[loc]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Currency Section */}
        <div className="p-2">
          <p className="text-xs font-medium text-muted-foreground px-2 mb-1">
            Currency / Tiền tệ
          </p>
          <div className="space-y-0.5">
            {(Object.keys(CURRENCIES) as Array<keyof typeof CURRENCIES>).map(
              (curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm w-full hover:bg-muted transition-colors",
                    currency === curr && "bg-muted",
                  )}
                >
                  <span className="text-base">{CURRENCIES[curr].flag}</span>
                  <span>{curr}</span>
                  <span className="text-muted-foreground text-xs">
                    {CURRENCIES[curr].symbol}
                  </span>
                </button>
              ),
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Compact version for mobile/navbar
export function CompactLocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const setLocale = useUIStore((state) => state.setLocale);
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", className)}
        >
          <Globe className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="end">
        <div className="space-y-1">
          {(Object.keys(localeNames) as Locale[]).map((loc) => (
            <button
              key={loc}
              onClick={() => {
                setLocale(loc);
                setOpen(false);
              }}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm w-full hover:bg-muted transition-colors",
                locale === loc && "bg-muted font-medium",
              )}
            >
              <span className="text-base">{localeFlags[loc]}</span>
              <span>{localeNames[loc]}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
