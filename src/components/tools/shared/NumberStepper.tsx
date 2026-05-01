"use client";

import { useId } from "react";

type NumberStepperProps = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  ariaLabel?: string;
  formatValue?: (value: number) => string;
  label?: string;
};

function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export default function NumberStepper({
  value,
  onChange,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  suffix,
  ariaLabel,
  formatValue,
  label,
}: NumberStepperProps) {
  const inputId = useId();
  const display = formatValue ? formatValue(value) : String(value);

  const decrement = () => onChange(clamp(value - step, min, max));
  const increment = () => onChange(clamp(value + step, min, max));

  const handleInput = (raw: string) => {
    if (raw.trim() === "") return;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return;
    onChange(clamp(parsed, min, max));
  };

  return (
    <div className="space-y-1">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium">
          {label}
        </label>
      ) : null}
      <div className="inline-flex items-stretch overflow-hidden rounded-lg border border-border bg-background">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          className="px-3 text-lg font-medium text-muted transition-colors hover:bg-card disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`Decrease ${ariaLabel ?? "value"}`}
        >
          −
        </button>
        <input
          id={inputId}
          type="number"
          inputMode="decimal"
          value={display}
          step={step}
          min={min}
          max={max}
          onChange={(e) => handleInput(e.target.value)}
          aria-label={ariaLabel}
          className="w-24 border-x border-border bg-background px-2 py-2 text-center text-sm focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          className="px-3 text-lg font-medium text-muted transition-colors hover:bg-card disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`Increase ${ariaLabel ?? "value"}`}
        >
          +
        </button>
        {suffix ? (
          <span className="flex items-center bg-card px-3 text-sm text-muted">{suffix}</span>
        ) : null}
      </div>
    </div>
  );
}
