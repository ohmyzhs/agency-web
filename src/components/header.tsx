"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "./providers";
import { ThemeToggle } from "./theme-toggle";
import { LocaleToggle } from "./locale-toggle";
import { BrandLockup } from "./zhs/brand-lockup";

export function Header() {
  const { t } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/typing", label: t.nav.typing },
    { href: "/posts", label: t.nav.posts },
    { href: "/tools", label: t.nav.tools },
    { href: "/about", label: t.nav.about },
  ];

  return (
    <header className="sticky top-0 z-[100] w-full">
      <div className="zhs-glass border-b border-border/40 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" aria-label="Zero Human Studio home" className="group">
            <BrandLockup suffix="studio" size="sm" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-10 md:flex">
            <ul className="flex items-center gap-8 font-mono text-[13px] font-bold uppercase tracking-widest">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted/60 transition-colors hover:text-primary active:scale-95 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="h-4 w-px bg-border/60" />

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <LocaleToggle />
                <ThemeToggle />
              </div>
              <Link
                href="/contact"
                className="rounded-xl bg-primary px-5 py-2 font-mono text-[11px] font-black uppercase tracking-[0.1em] text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark hover:scale-105 active:scale-95"
              >
                {t.nav.contact}
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <LocaleToggle />
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-xl border border-border bg-card/50 p-2 text-muted transition-all hover:border-primary hover:text-primary"
              aria-label="Toggle menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {menuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="17" x2="20" y2="17" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute inset-x-0 top-full z-[99] border-b border-border bg-background/95 p-6 backdrop-blur-2xl md:hidden animate-fade-in-up">
          <ul className="space-y-4 font-mono text-lg font-black uppercase tracking-wider">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-muted/60 transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-4">
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="block rounded-2xl bg-primary px-4 py-4 text-center text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20"
              >
                {t.nav.contact}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
