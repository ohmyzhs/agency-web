"use client";

import { useCallback, useState } from "react";
import { ModeShell } from "@/components/typing/organisms/ModeShell";
import { getPassagesForCategory, type PassageItem } from "@/lib/typing/packs-staged";
import type { LongformCategory, TypingLanguage } from "@/lib/typing/types";

type LongformCategoryClientProps = {
  category: LongformCategory;
  passages: PassageItem[];
};

function passageId(category: LongformCategory, index: number): string {
  return `${category}::${index}`;
}

function excerpt(text: string): string {
  const compact = text.replace(/\s+/g, " ").trim();
  return compact.length > 120 ? `${compact.slice(0, 120)}…` : compact;
}

export function LongformCategoryClient({ category, passages }: LongformCategoryClientProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [language, setLanguage] = useState<TypingLanguage>("ko");
  const visiblePassages = language === "en" ? getPassagesForCategory(category, "en") : passages;
  const safeSelectedIndex = Math.min(selectedIndex, Math.max(0, visiblePassages.length - 1));
  const selected = visiblePassages[safeSelectedIndex] ?? visiblePassages[0];
  const handleLanguageChange = useCallback((nextLanguage: TypingLanguage) => {
    if (language !== nextLanguage) setSelectedIndex(0);
    setLanguage(nextLanguage);
  }, [language]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(280px,360px)_1fr]">
      <aside className="rounded-2xl border border-border bg-card p-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">{language === "en" ? "Long-form text" : "필사 글 선택"}</p>
            <h2 className="mt-1 text-lg font-semibold">{category} · {visiblePassages.length}편</h2>
          </div>
        </div>
        <div className="space-y-2">
          {visiblePassages.map((passage, index) => {
            const active = index === selectedIndex;
            return (
              <button
                key={`${passage.title}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={[
                  "w-full rounded-xl border p-3 text-left transition-colors",
                  active
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-background hover:border-primary/50 hover:bg-background/80",
                ].join(" ")}
                aria-pressed={active}
              >
                <span className="block text-sm font-semibold">{passage.title}</span>
                <span className="mt-1 block text-xs text-muted">약 {passage.text.length.toLocaleString("ko-KR")}자</span>
                <span className="mt-2 block text-xs leading-5 text-muted">{excerpt(passage.text)}</span>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="min-w-0 space-y-4">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">{language === "en" ? "Selected text" : "선택한 글"}</p>
          <h2 className="mt-1 text-xl font-bold">{selected?.title ?? category}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            {language === "en"
              ? "Switch Korean / English in the practice controls below. The passage list updates with the selected language."
              : "아래 연습 컨트롤에서 한국어/영어를 바꾸면 왼쪽 글 목록도 해당 언어로 바뀝니다."}
          </p>
        </div>
        <ModeShell
          key={`${language}:${passageId(category, safeSelectedIndex)}`}
          lockedMode="longform"
          lockedLessonId={passageId(category, safeSelectedIndex)}
          initialLanguage={language}
          onLanguageChange={handleLanguageChange}
        />
      </section>
    </div>
  );
}
