"use client";

import Link from "next/link";
import { useLocale } from "./providers";
import { BrandLockup } from "./zhs/brand-lockup";

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-border bg-background pt-24 pb-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-16 lg:grid-cols-2">
          <div className="max-w-md">
            <Link href="/" aria-label="Zero Human Studio home" className="inline-block">
              <BrandLockup size="md" />
            </Link>
            <p className="mt-8 text-lg font-medium text-muted leading-relaxed">
              {t.footer.tagline}
            </p>
            <div className="mt-10 flex gap-6">
               {/* Social Icons (SVGs) */}
               <a href="https://github.com/ohmyzhs/agency-web" target="_blank" rel="noreferrer" className="h-10 w-10 rounded-xl bg-accent/50 border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-all shadow-sm" title="GitHub">
                 <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
               </a>
               <a href="https://x.com" target="_blank" rel="noreferrer" className="h-10 w-10 rounded-xl bg-accent/50 border border-border flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-all shadow-sm" title="X (Twitter)">
                 <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.933zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z"/></svg>
               </a>
               <div className="h-10 w-10 rounded-xl bg-accent/50 border border-border flex items-center justify-center text-muted/20" title="Coming Soon">
                 <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="zhs-eyebrow text-primary/60">{t.footer.site}</h3>
              <ul className="mt-6 space-y-4 font-mono text-[13px] font-bold uppercase tracking-wider text-muted/60">
                <li><Link href="/typing" className="hover:text-primary transition-colors">{t.footer.typing}</Link></li>
                <li><Link href="/posts" className="hover:text-primary transition-colors">{t.footer.posts}</Link></li>
                <li><Link href="/news" className="hover:text-primary transition-colors">{t.footer.news}</Link></li>
                <li><Link href="/tools" className="hover:text-primary transition-colors">{t.footer.tools}</Link></li>
                <li><Link href="/updates" className="hover:text-primary transition-colors">Updates</Link></li>
                <li><Link href="/about" className="hover:text-primary transition-colors">{t.footer.about}</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="zhs-eyebrow text-primary/60">{t.footer.legal}</h3>
              <ul className="mt-6 space-y-4 font-mono text-[13px] font-bold uppercase tracking-wider text-muted/60">
                <li><Link href="/privacy" className="hover:text-primary transition-colors">{t.footer.privacy}</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">{t.footer.terms}</Link></li>
                <li><Link href="/disclaimer" className="hover:text-primary transition-colors">{t.footer.disclaimer}</Link></li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="zhs-eyebrow text-primary/60">Studio</h3>
              <ul className="mt-6 space-y-4 font-mono text-[13px] font-bold uppercase tracking-wider text-muted/60">
                <li><a href="https://github.com/ohmyzhs/agency-web" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">GitHub</a></li>
                <li><a href="https://github.com/ohmyzhs/agency-web/issues" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Issues</a></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">{t.footer.contact}</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-border flex flex-col items-center justify-between gap-6 md:flex-row text-[11px] font-bold uppercase tracking-[0.2em] text-muted/40">
          <span className="font-mono">
            &copy; {new Date().getFullYear()} Zero Human Studio. {t.footer.rights}
          </span>
          <div className="flex gap-8">
            <span className="font-mono tracking-tighter italic">Precision Intelligence</span>
            <span className="font-mono">oh-my-zhs.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
