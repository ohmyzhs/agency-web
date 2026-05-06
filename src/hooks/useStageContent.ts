'use client';
/**
 * 현재 mode + stage 기준으로 연습 콘텐츠를 순차 공급한다.
 * 랜덤 1개 반환 방식은 같은 지문 반복/리셋 체감을 만들기 쉬워서,
 * 모드·단계·언어별 풀을 섞은 뒤 커서로 다음 항목을 꺼낸다.
 */
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  buildWordStreamFromStage,
  getSentencesForStage,
  getPassagesForCategory,
  pickRandom,
  LONGFORM_CATEGORIES,
} from '@/lib/typing/packs-staged';
import { buildWordStream, englishPassages, englishSentences, getCombinedZoneDrill, koreanPassages, zoneLessons } from '@/lib/typing/packs';
import type { TypingMode, StageLevel, LongformCategory } from '@/lib/typing/types';
import type { ZoneLessonId } from '@/lib/typing/packs';

type Options = {
  mode: TypingMode;
  stage: StageLevel;
  language: 'ko' | 'en';
  lessonId?: string;
  category?: LongformCategory;
};

function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededShuffle<T>(items: T[], seedText: string): T[] {
  const arr = [...items];
  let seed = hashString(seedText) || 1;
  for (let i = arr.length - 1; i > 0; i -= 1) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function useStageContent(opts: Options) {
  const key = `${opts.mode}:${opts.stage}:${opts.language}:${opts.lessonId ?? ''}:${opts.category ?? ''}`;
  const cursorByKey = useRef<Record<string, number>>({});
  const [sessionSeed] = useState(() => `${Date.now()}:${Math.random()}`);
  const shuffleSeed = `${key}:${sessionSeed}`;

  const sequence = useMemo((): string[] => {
    const { mode, stage, language, lessonId, category } = opts;

    if (mode === 'keyboard-zone') {
      const lesson =
        zoneLessons.find(l => l.id === (lessonId as ZoneLessonId)) ?? zoneLessons[0];
      return [getCombinedZoneDrill(lesson, shuffleSeed)];
    }

    if (language === 'en') {
      if (mode === 'word') return Array.from({ length: 12 }, () => buildWordStream('en', 25));
      if (mode === 'sentence') return seededShuffle(englishSentences, key);
      if (mode === 'speed-test') return Array.from({ length: 12 }, () => buildWordStream('en', 80));
      if (mode === 'longform') {
        const requested = category as LongformCategory | undefined;
        const cat = requested && LONGFORM_CATEGORIES.includes(requested) ? requested : undefined;
        const passages = cat ? getPassagesForCategory(cat, 'en').map(p => p.text) : englishPassages;
        return seededShuffle(passages.length ? passages : englishPassages, key);
      }
      return seededShuffle(englishPassages, key);
    }

    if (mode === 'word') return Array.from({ length: 12 }, (_, idx) => buildWordStreamFromStage(stage, 25 + (idx % 3) * 5));
    if (mode === 'sentence') return seededShuffle(getSentencesForStage(stage), shuffleSeed);
    if (mode === 'speed-test') return Array.from({ length: 12 }, (_, idx) => buildWordStreamFromStage(stage, 80 + (idx % 3) * 10));

    if (mode === 'longform') {
      const requested = category as LongformCategory | undefined;
      const cat = requested && LONGFORM_CATEGORIES.includes(requested)
        ? requested
        : pickRandom(LONGFORM_CATEGORIES);
      const passages = getPassagesForCategory(cat, language).map(p => p.text);
      return seededShuffle(passages, key);
    }

    return seededShuffle(koreanPassages, key);
  }, [key, opts, shuffleSeed]);

  const next = useCallback((): string => {
    if (!sequence.length) return '';
    const cursor = cursorByKey.current[key] ?? 0;
    const value = sequence[cursor % sequence.length];
    cursorByKey.current[key] = cursor + 1;
    return value;
  }, [key, sequence]);

  return { next };
}
