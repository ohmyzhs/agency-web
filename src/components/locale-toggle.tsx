"use client";

import { useLocale } from "./providers";

export function LocaleToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <button
      onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
      className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-card hover:text-foreground"
      aria-label={`Switch to ${locale === "ko" ? "English" : "한국어"}`}
    >
      {locale === "ko" ? "EN" : "KR"}
    </button>
  );
}
