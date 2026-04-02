import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="text-lg font-bold tracking-tight">
              AIT<span className="text-primary">.</span>
            </Link>
            <p className="mt-2 text-sm text-muted">
              Professional IT agency. We build fast, ship faster.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/services"
                  className="text-sm text-muted hover:text-foreground"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="https://lotionz.tistory.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted hover:text-foreground"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Connect
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
          &copy; {new Date().getFullYear()} AIT Agency. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
