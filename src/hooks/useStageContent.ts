'use client';
/**
 * 현재 mode + stage 기준으로 연습 콘텐츠를 가져온다.
 * next() 호출 시 다음 콘텐츠(랜덤)를 반환한다.
 */
import { useCallback, useRef } from 'react';
import {
  buildWordStreamFromStage,
  getSentencesForStage,
  getPassagesForCategory,
  getWordsForStage,
  pickRandom,
  LONGFORM_CATEGORIES,
} from '@/lib/typing/packs-staged';
import { zoneLessons } from '@/lib/typing/packs';
import type { TypingMode, StageLevel, LongformCategory } from '@/lib/typing/types';
import type { ZoneLessonId } from '@/lib/typing/packs';

type Options = {
  mode: TypingMode;
  stage: StageLevel;
  language: 'ko' | 'en';
  lessonId?: string;
  category?: LongformCategory;
};

export function useStageContent(opts: Options) {
  const optsRef = useRef(opts);
  optsRef.current = opts;

  const next = useCallback((): string => {
    const { mode, stage, language, lessonId, category } = optsRef.current;

    if (mode === 'keyboard-zone') {
      const lesson =
        zoneLessons.find(l => l.id === (lessonId as ZoneLessonId)) ?? zoneLessons[0];
      return lesson.drill;
    }

    if (language === 'en') {
      // 영문은 기존 packs 사용
      const { buildWordStream, englishSentences, englishPassages } = require('@/lib/typing/packs') as typeof import('@/lib/typing/packs');
      if (mode === 'word') return buildWordStream('en', 25);
      if (mode === 'sentence') return pickRandom(englishSentences);
      return pickRandom(englishPassages);
    }

    if (mode === 'word') return buildWordStreamFromStage(stage, 25);
    if (mode === 'sentence') return pickRandom(getSentencesForStage(stage));
    if (mode === 'speed-test') return buildWordStreamFromStage(stage, 80);

    // longform
    const cat = category ?? pickRandom(LONGFORM_CATEGORIES);
    const passages = getPassagesForCategory(cat);
    if (!passages.length) return '';
    return pickRandom(passages).text;
  }, []);

  return { next };
}
