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
      {withBackground ? <rect width="64" height="64" fill="var(--bg-card)" /> : null}
      <g
        stroke="currentColor"
        strokeWidth={4}
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      >
        {/* Z Path */}
        <path d="M12 12 H52 L12 52 H52" />
        {/* Core Dot (Blue) */}
        <circle cx="32" cy="32" r="5" fill="#3b82f6" stroke="none" />
      </g>
    </svg>
  );
}
