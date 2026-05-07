"use client";

import Link from "next/link";
import { useLocale } from "./providers";
import { BrandLockup } from "./zhs/brand-lockup";

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link href="/" aria-label="Zero Human Studio home" className="inline-flex items-center">
              <BrandLockup size="sm" />
            </Link>
            <p className="mt-3 text-sm text-muted">{t.footer.tagline}</p>
          </div>

          <div>
            <h3 className="zhs-eyebrow">{t.footer.site}</h3>
            <ul className="mt-3 space-y-2 font-mono text-[13px]">
              <li>
                <Link href="/typing" className="text-muted hover:text-foreground">
                  {t.footer.typing}
                </Link>
              </li>
              <li>
                <Link href="/posts" className="text-muted hover:text-foreground">
                  {t.footer.posts}
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-muted hover:text-foreground">
                  {t.footer.tools}
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-muted hover:text-foreground">
                  {t.footer.guides}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted hover:text-foreground">
                  {t.footer.about}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted hover:text-foreground">
                  {t.footer.contact}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="zhs-eyebrow">{t.footer.legal}</h3>
            <ul className="mt-3 space-y-2 font-mono text-[13px]">
              <li>
                <Link href="/privacy" className="text-muted hover:text-foreground">
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted hover:text-foreground">
                  {t.footer.terms}
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-muted hover:text-foreground">
                  {t.footer.disclaimer}
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/ohmyzhs/agency-web"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted hover:text-foreground"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/ohmyzhs/agency-web/issues"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted hover:text-foreground"
                >
                  Issues
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-muted md:flex-row">
          <span className="font-mono">
            &copy; {new Date().getFullYear()} Zero Human Studio. {t.footer.rights}
          </span>
          <span className="font-mono text-fg-3">ohmyzhs.com</span>
        </div>
      </div>
    </footer>
  );
}
