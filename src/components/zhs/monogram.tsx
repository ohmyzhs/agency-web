import type { SVGProps } from "react";

type MonogramProps = SVGProps<SVGSVGElement> & {
  size?: number;
  withBackground?: boolean;
};

export function Monogram({
  size = 28,
  withBackground = false,
  className,
  ...rest
}: MonogramProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {withBackground && (
        <rect width="64" height="64" rx="16" fill="var(--zhs-ink)" />
      )}
      <g
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* Precise Studio Monogram */}
        <path d="M16 16 H48 L16 48 H48" className="opacity-90" />
        {/* Core Intelligent Point */}
        <circle cx="32" cy="32" r="3.5" fill="var(--primary)" stroke="none" />
      </g>
      {/* Decorative corners for "Studio" feel */}
      <path d="M8 24 V8 H24" stroke="currentColor" strokeWidth={1} fill="none" className="opacity-20" />
      <path d="M40 56 H56 V40" stroke="currentColor" strokeWidth={1} fill="none" className="opacity-20" />
    </svg>
  );
}
