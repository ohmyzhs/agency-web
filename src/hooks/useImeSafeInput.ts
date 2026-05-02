'use client';
/**
 * IME 조합 중 상태를 정확히 추적하는 훅.
 * compositionstart/end 이벤트를 기반으로 isComposing 플래그를 관리한다.
 * onValueChange는 compositionend 이후 확정된 값으로만 호출된다.
 */
import { useCallback, useRef } from 'react';

type Options = {
  onValueChange: (value: string) => void;
  onCompositionChange?: (composing: boolean) => void;
};

export function useImeSafeInput({ onValueChange, onCompositionChange }: Options) {
  const composingRef = useRef(false);

  const handleCompositionStart = useCallback(() => {
    composingRef.current = true;
    onCompositionChange?.(true);
  }, [onCompositionChange]);

  const handleCompositionEnd = useCallback(
    (e: React.CompositionEvent<HTMLTextAreaElement>) => {
      composingRef.current = false;
      onCompositionChange?.(false);
      // compositionend fires before input; use the textarea value directly
      onValueChange((e.currentTarget as HTMLTextAreaElement).value);
    },
    [onValueChange, onCompositionChange],
  );

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLTextAreaElement>) => {
      if (composingRef.current) return;
      onValueChange((e.currentTarget as HTMLTextAreaElement).value);
    },
    [onValueChange],
  );

  return { handleCompositionStart, handleCompositionEnd, handleInput, composingRef };
}
