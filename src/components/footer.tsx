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
            <div className="mt-10 flex gap-4">
               {/* Social placeholders */}
               <div className="h-10 w-10 rounded-xl bg-accent/50 border border-border" />
               <div className="h-10 w-10 rounded-xl bg-accent/50 border border-border" />
               <div className="h-10 w-10 rounded-xl bg-accent/50 border border-border" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="zhs-eyebrow text-primary/60">{t.footer.site}</h3>
              <ul className="mt-6 space-y-4 font-mono text-[13px] font-bold uppercase tracking-wider">
                <li><Link href="/typing" className="text-muted/60 hover:text-primary transition-colors">{t.footer.typing}</Link></li>
                <li><Link href="/posts" className="text-muted/60 hover:text-primary transition-colors">{t.footer.posts}</Link></li>
                <li><Link href="/tools" className="text-muted/60 hover:text-primary transition-colors">{t.footer.tools}</Link></li>
                <li><Link href="/about" className="text-muted/60 hover:text-primary transition-colors">{t.footer.about}</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="zhs-eyebrow text-primary/60">{t.footer.legal}</h3>
              <ul className="mt-6 space-y-4 font-mono text-[13px] font-bold uppercase tracking-wider">
                <li><Link href="/privacy" className="text-muted/60 hover:text-primary transition-colors">{t.footer.privacy}</Link></li>
                <li><Link href="/terms" className="text-muted/60 hover:text-primary transition-colors">{t.footer.terms}</Link></li>
                <li><Link href="/disclaimer" className="text-muted/60 hover:text-primary transition-colors">{t.footer.disclaimer}</Link></li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="zhs-eyebrow text-primary/60">Studio</h3>
              <ul className="mt-6 space-y-4 font-mono text-[13px] font-bold uppercase tracking-wider">
                <li><a href="https://github.com/ohmyzhs/agency-web" target="_blank" rel="noreferrer" className="text-muted/60 hover:text-primary transition-colors">GitHub</a></li>
                <li><a href="https://github.com/ohmyzhs/agency-web/issues" target="_blank" rel="noreferrer" className="text-muted/60 hover:text-primary transition-colors">Issues</a></li>
                <li><Link href="/contact" className="text-muted/60 hover:text-primary transition-colors">{t.footer.contact}</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-border flex flex-col items-center justify-between gap-6 md:flex-row text-[11px] font-bold uppercase tracking-[0.2em] text-muted/40">
          <span className="font-mono">
            &copy; {new Date().getFullYear()} Zero Human Studio. {t.footer.rights}
          </span>
          <div className="flex gap-8">
            <span className="font-mono tracking-tighter">Powered by Hermes Agent</span>
            <span className="font-mono">oh-my-zhs.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
