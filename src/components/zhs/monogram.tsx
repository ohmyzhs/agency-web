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
        strokeWidth={3}
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      >
        <path d="M8 8 H32 L8 32 H32" />
        <path d="M32 32 V56 M32 44 H56 M56 32 V56" />
      </g>
    </svg>
  );
}
