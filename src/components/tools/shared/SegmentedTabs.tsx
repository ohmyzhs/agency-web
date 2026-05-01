"use client";

type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  description?: string;
};

type SegmentedTabsProps<T extends string> = {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (next: T) => void;
  ariaLabel?: string;
  size?: "sm" | "md";
};

export default function SegmentedTabs<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  size = "md",
}: SegmentedTabsProps<T>) {
  const padding = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex flex-wrap gap-1 rounded-lg border border-border bg-background p-1"
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            title={option.description}
            className={`rounded-md ${padding} font-medium transition-colors ${
              isActive
                ? "bg-primary text-white"
                : "text-muted hover:bg-card hover:text-foreground"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
