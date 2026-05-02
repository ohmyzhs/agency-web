'use client';

import { zoneLessons, type ZoneLessonId } from '@/lib/typing/packs';

type Props = {
  value: ZoneLessonId;
  onSelect: (id: ZoneLessonId) => void;
  onInteractionStart?: () => void;
};

export function ZoneLessonSelector({ value, onSelect, onInteractionStart }: Props) {
  return (
    <nav
      aria-label="자리연습 단계"
      className="rounded-xl border border-border bg-card/70 p-2"
    >
      <ul className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
        {zoneLessons.map((lesson) => {
          const active = lesson.id === value;
          return (
            <li key={lesson.id}>
              <button
                type="button"
                onMouseDown={onInteractionStart}
                onTouchStart={onInteractionStart}
                onClick={() => onSelect(lesson.id)}
                aria-current={active ? 'step' : undefined}
                className={[
                  'flex w-full flex-col items-center gap-0.5 rounded-lg border px-2 py-2 text-center transition-colors',
                  active
                    ? 'border-primary bg-primary/10 text-foreground shadow-sm'
                    : 'border-border bg-background text-muted hover:border-primary/50 hover:text-foreground',
                ].join(' ')}
              >
                <span
                  className={[
                    'text-[10px] font-semibold uppercase tracking-[0.16em]',
                    active ? 'text-primary' : 'text-muted',
                  ].join(' ')}
                >
                  {lesson.step}단계
                </span>
                <span className="text-xs font-semibold leading-tight sm:text-sm">
                  {lesson.titleKo}
                </span>
                <span className="hidden text-[10px] text-muted sm:block">
                  {lesson.subtitleKo}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
