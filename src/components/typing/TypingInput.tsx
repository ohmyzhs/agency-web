"use client";

import { forwardRef, memo, useCallback } from "react";
import type { ChangeEvent, CompositionEvent, KeyboardEvent } from "react";

type TypingInputProps = {
  value: string;
  onValueChange: (next: string) => void;
  onCompositionChange?: (composing: boolean) => void;
  onKeyDownCapture?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  ariaLabel?: string;
  variant?: "visible" | "surface";
  rows?: number;
};

const TypingInput = memo(forwardRef<HTMLTextAreaElement, TypingInputProps>(function TypingInput(
  {
    value,
    onValueChange,
    onCompositionChange,
    onKeyDownCapture,
    disabled,
    placeholder,
    autoFocus,
    ariaLabel,
    variant = "visible",
    rows,
  },
  ref,
) {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      onValueChange(e.target.value);
    },
    [onValueChange],
  );

  const handleCompositionStart = useCallback(() => {
    onCompositionChange?.(true);
  }, [onCompositionChange]);

  const handleCompositionEnd = useCallback(
    (e: CompositionEvent<HTMLTextAreaElement>) => {
      onCompositionChange?.(false);
      // Make sure final value is reflected.
      onValueChange((e.target as HTMLTextAreaElement).value);
    },
    [onCompositionChange, onValueChange],
  );

  const className = variant === "surface"
    ? "absolute inset-0 z-10 h-full w-full resize-none rounded-2xl border-0 bg-transparent p-0 text-[16px] text-transparent caret-primary opacity-5 outline-none selection:bg-transparent focus:opacity-5 disabled:opacity-0"
    : "block w-full rounded-2xl border-2 border-primary/30 bg-background px-5 py-4 font-mono text-xl shadow-sm transition-shadow focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-60";

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={handleChange}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onKeyDown={onKeyDownCapture}
      disabled={disabled}
      placeholder={placeholder}
      autoFocus={autoFocus}
      aria-label={ariaLabel}
      spellCheck={false}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      rows={rows ?? (variant === "surface" ? 1 : 3)}
      className={className}
    />
  );
}));

export default TypingInput;
