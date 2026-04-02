"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { type Locale, type Dictionary, getDictionary, defaultLocale } from "@/lib/i18n";

type Theme = "light" | "dark" | "system";

interface AppContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
}

const AppContext = createContext<AppContextValue | null>(null);

const fallbackDictionary = getDictionary(defaultLocale);
const fallbackContext: AppContextValue = {
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "light",
  locale: defaultLocale,
  setLocale: () => {},
  t: fallbackDictionary,
};

export function useApp() {
  const ctx = useContext(AppContext);
  return ctx ?? fallbackContext;
}

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useApp();
  return { theme, setTheme, resolvedTheme };
}

export function useLocale() {
  const { locale, setLocale, t } = useApp();
  return { locale, setLocale, t };
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const savedLocale = localStorage.getItem("locale") as Locale | null;
    if (savedTheme) setThemeState(savedTheme);
    if (savedLocale) setLocaleState(savedLocale);
    setMounted(true);
  }, []);

  useEffect(() => {
    const resolved = theme === "system" ? getSystemTheme() : theme;
    setResolvedTheme(resolved);
    document.documentElement.classList.toggle("dark", resolved === "dark");
    document.documentElement.classList.toggle("light", resolved === "light");
  }, [theme]);

  useEffect(() => {
    if (!mounted) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") {
        const resolved = getSystemTheme();
        setResolvedTheme(resolved);
        document.documentElement.classList.toggle("dark", resolved === "dark");
        document.documentElement.classList.toggle("light", resolved === "light");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme, mounted]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem("theme", t);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
    document.documentElement.lang = l;
  }, []);

  const t = getDictionary(locale);

  if (!mounted) {
    return (
      <div className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{ theme, setTheme, resolvedTheme, locale, setLocale, t }}
    >
      {children}
    </AppContext.Provider>
  );
}
