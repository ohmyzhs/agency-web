"use client";

import { forwardRef, useCallback } from "react";
import type { ChangeEvent, CompositionEvent, KeyboardEvent } from "react";
// CompositionEvent is only used as a type below.

type TypingInputProps = {
  value: string;
  onValueChange: (next: string) => void;
  onCompositionChange?: (composing: boolean) => void;
  onKeyDownCapture?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  ariaLabel?: string;
};

const TypingInput = forwardRef<HTMLTextAreaElement, TypingInputProps>(function TypingInput(
  {
    value,
    onValueChange,
    onCompositionChange,
    onKeyDownCapture,
    disabled,
    placeholder,
    autoFocus,
    ariaLabel,
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
      rows={3}
      className="block w-full rounded-lg border border-border bg-background px-4 py-3 font-mono text-lg focus:border-primary focus:outline-none disabled:opacity-60"
    />
  );
});

export default TypingInput;
