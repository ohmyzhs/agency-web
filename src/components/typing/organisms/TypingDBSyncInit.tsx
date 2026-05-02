'use client';
import { useTypingDBSync } from '@/hooks/useTypingDBSync';

/** DB ↔ Zustand 동기화를 트리거하는 빈 컴포넌트. layout에 마운트된다. */
export function TypingDBSyncInit() {
  useTypingDBSync();
  return null;
}
