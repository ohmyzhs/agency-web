import { Monogram } from "./monogram";

type BrandLockupProps = {
  suffix?: string;
  size?: "sm" | "md";
  variant?: "full" | "mark";
};

export function BrandLockup({ suffix, size = "md", variant = "full" }: BrandLockupProps) {
  const monoSize = size === "sm" ? 22 : 26;
  const labelSize = size === "sm" ? "text-[13px]" : "text-sm";

  return (
    <span className="inline-flex items-center gap-2 font-mono tracking-tight text-foreground">
      <Monogram size={monoSize} className="shrink-0" />
      {variant === "full" ? (
        <span className={`${labelSize} leading-none whitespace-nowrap`}>
          <span className="font-semibold">zero human studio</span>
          {suffix ? <span className="text-muted"> / {suffix}</span> : null}
        </span>
      ) : null}
    </span>
  );
}
