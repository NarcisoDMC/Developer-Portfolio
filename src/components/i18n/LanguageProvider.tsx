"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { portfolioDataByLocale } from "@/data/portfolio";
import type { Locale, PortfolioData } from "@/types/portfolio";

const STORAGE_KEY = "portfolio-locale";
const DEFAULT_LOCALE: Locale = "es";

let currentLocale: Locale | null = null;
const listeners = new Set<() => void>();

function readStoredLocale(): Locale {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }
  if (currentLocale) {
    return currentLocale;
  }
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "es" || saved === "en") {
      currentLocale = saved;
      return saved;
    }
  } catch {
    // Ignore storage read errors in restricted environments
  }
  currentLocale = DEFAULT_LOCALE;
  return currentLocale;
}

function writeStoredLocale(next: Locale) {
  currentLocale = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage write errors
    }
  }
  for (const listener of listeners) {
    listener();
  }
}

function subscribeLocale(listener: () => void): () => void {
  listeners.add(listener);

  const handleStorage = (event: StorageEvent) => {
    if (
      event.key === STORAGE_KEY &&
      (event.newValue === "es" || event.newValue === "en")
    ) {
      currentLocale = event.newValue;
      listener();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }

  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

function getServerLocaleSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

export interface LanguageContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
  data: PortfolioData;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  toggleLocale: () => {},
  data: portfolioDataByLocale[DEFAULT_LOCALE],
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeLocale,
    readStoredLocale,
    getServerLocaleSnapshot,
  );

  const setLocale = useCallback((next: Locale) => {
    writeStoredLocale(next);
  }, []);

  const toggleLocale = useCallback(() => {
    const next: Locale = readStoredLocale() === "es" ? "en" : "es";
    writeStoredLocale(next);
  }, []);

  const data = portfolioDataByLocale[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = data.ui.pageTitle;
  }, [locale, data.ui.pageTitle]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      data,
    }),
    [locale, setLocale, toggleLocale, data],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
