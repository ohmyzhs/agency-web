import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-6 py-32 text-center">
      <div className="text-8xl font-bold text-primary">404</div>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">
        Page Not Found
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-dark"
        >
          Go Home
        </Link>
        <Link
          href="/contact"
          className="rounded-lg border border-border px-6 py-3 font-medium transition-colors hover:bg-card"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
