"use client";

import Link from "next/link";
import { useLocale } from "./providers";

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="text-lg font-bold tracking-tight">
              AIT<span className="text-primary">.</span>
            </Link>
            <p className="mt-2 text-sm text-muted">{t.footer.tagline}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              {t.footer.navigation}
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/services"
                  className="text-sm text-muted hover:text-foreground"
                >
                  {t.footer.services}
                </Link>
              </li>
              <li>
                <Link
                  href="/work"
                  className="text-sm text-muted hover:text-foreground"
                >
                  {t.footer.work}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted hover:text-foreground"
                >
                  {t.footer.about}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted hover:text-foreground"
                >
                  {t.footer.contact}
                </Link>
              </li>
              <li>
                <a
                  href="https://lotionz.tistory.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted hover:text-foreground"
                >
                  {t.footer.blog}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              {t.footer.connect}
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href="mailto:contact@ait.agency"
                  className="text-sm text-muted hover:text-foreground"
                >
                  contact@ait.agency
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted">
          &copy; {new Date().getFullYear()} AIT Agency. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
