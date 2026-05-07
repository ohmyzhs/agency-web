"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { type Locale, type Dictionary, getDictionary, defaultLocale, isLocale } from "@/lib/i18n";

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

function detectInitialLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  const urlLocale = new URLSearchParams(window.location.search).get("lang");
  if (isLocale(urlLocale)) return urlLocale;
  const stored = localStorage.getItem("locale");
  if (isLocale(stored)) return stored;
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  return languages.some((lang) => lang.toLowerCase().startsWith("ko")) ? "ko" : "en";
}

const subscribeNoop = () => () => {};
const getMountedClient = () => true;
const getMountedServer = () => false;

function subscribeMedia(callback: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSystemThemeClient(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const getSystemThemeServer = (): "light" | "dark" => "light";

export function AppProvider({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(subscribeNoop, getMountedClient, getMountedServer);
  const systemTheme = useSyncExternalStore(
    subscribeMedia,
    getSystemThemeClient,
    getSystemThemeServer,
  );

  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem("theme") as Theme | null) ?? "system";
  });
  const [locale, setLocaleState] = useState<Locale>(() => detectInitialLocale());

  const resolvedTheme: "light" | "dark" = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    document.documentElement.classList.toggle("light", resolvedTheme === "light");
  }, [resolvedTheme]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

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
