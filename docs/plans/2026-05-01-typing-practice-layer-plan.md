# Typing Practice Layer Plan

Date: 2026-05-01
Repo: `/Users/gabriel.k/Documents/Workspace/ohmyzhs/agency-web`
Target route: `/typing`
Status: planned — upgraded after benchmark review

## Product decision

Build `/typing` as a real standalone Korean-first typing practice product, not a decorative mini tool.

The first draft was too generic: it referenced Korean/English sentences, WPM/CPM, localStorage, and IME safety, but it did not explicitly benchmark the core Korean typing-practice experience. The implementation must now be based on Hancom Taja-style structured learning plus modern typing-site mechanics from Monkeytype, keybr, 10FastFingers, Typing.com/Ratatype, and TypeRacer.

## Phase 2 flagship escalation

Phase 1 remains the local-first typing engine: Korean IME-safe practice, keyboard drills, word/sentence/longform modes, speed test, and local records.

Phase 2 escalates `/typing` into the flagship product layer with optional 간편로그인, public leaderboards, daily challenge, ghost race, Weakness Coach, challenge links, and privacy-safe score submission. See `docs/plans/2026-05-01-typing-killer-content-phase-2-plan.md`.

Primary goal:
- Help a Korean user actually improve typing accuracy and speed over repeated sessions.
- Make it useful without sign-in.
- Keep all personal stats local-first.
- Avoid copying copyrighted texts, UI art, game names, brand assets, or exact interactions from reference services.

## Benchmarks and reference lessons

### 1. 한컴타자 / Hancom Taja

Observed features to learn from:
- Main IA includes `타자 연습`, `타자 학습`, `필사`, `오락실`, `랭킹`, `상점`, `학교 소모임`.
- Practice modes include `자리연습`, `낱말 연습`, `단문 연습`, `장문 연습`.
- 자리연습 is split into real keyboard zones:
  - 기본자리
  - 왼손 윗자리
  - 왼손 아랫자리
  - 가운데자리
  - 오른손 윗자리
  - 오른손 아랫자리
  - 전체자리
  - 숫자자리
- Games and retention features include examples like 산성비/판뒤집기-style arcade modes, rankings, points, badges, attendance, profile, keyboard settings.
- The product is not just “type a random sentence”; it gives a progression from key positions to words, short text, long text, games, ranking, and events.

What to adopt:
- Korean-first curriculum ladder: 자리 → 낱말 → 단문 → 장문 → 필사/집중 → 챌린지.
- Keyboard-zone drills before speed tests.
- Korean labels and Korean learning mental model.
- Progress/achievement hooks, but local-first in MVP.

What not to copy:
- Do not copy Hancom character art, game names, exact visual style, text, content, ranking data, points/store mechanics, or brand assets.
- Do not implement fake global rankings. Local records are acceptable; public rankings require real backend and anti-cheat later.

### 2. Monkeytype

Observed features:
- Minimal, fast typing surface.
- Mode controls: punctuation, numbers, time, words, quote, zen, custom.
- Durations like 15/30/60/120 seconds.
- Language selector.
- Keyboard shortcuts: restart, command palette.

What to adopt:
- Clean distraction-free typing test mode.
- Fast mode switches: time/words/quote/custom, punctuation/numbers toggles.
- Keyboard shortcuts for restart and next exercise.
- Custom text mode in later phase.

### 3. keybr

Observed features:
- Adaptive practice focused on weak/current keys.
- Displays all keys, current key, speed, accuracy, score, daily goal.
- Shows an on-screen keyboard and guided tour/settings.
- Supports many languages including Korean.

What to adopt:
- Weak-key tracking from local history.
- Adaptive drills that favor low-accuracy jamo/keys.
- On-screen Korean 2-set keyboard with active key/finger hints.
- Daily goal and progress meter.

### 4. 10FastFingers

Observed features:
- 1-minute word-based tests.
- Normal/Advanced modes.
- Korean language mode with word stream.
- WPM rankings and number of tests taken.

What to adopt:
- Simple 60-second Korean word test as a recognizable quick benchmark.
- Normal/Advanced word pools.
- Clear result screen with WPM/accuracy/errors.

What not to copy:
- Do not fake community stats or rankings.

### 5. Typing.com / TypingClub-style lesson systems

Observed features:
- Beginner/intermediate/advanced lesson tracks.
- Lessons, tests, games, themes, curriculum.
- Progress, XP/daily goal, average speed/accuracy, problem keys.

What to adopt:
- Lesson map with beginner/intermediate/advanced sections.
- Problem-key panel.
- Local progress, streak, daily practice minutes.
- Optional gamified achievements after the core typing engine is stable.

### 6. Ratatype

Observed features:
- Strong educational content around WPM calculation.
- Certificate thresholds like platinum/gold/silver by speed and accuracy.
- Requires fixing typo before proceeding in some tests.
- Explains that WPM uses 5-character standard word units.

What to adopt:
- Explain WPM/CPM/accuracy clearly below the tool.
- Result tiers are okay if framed as local self-check, not official certificates.
- Optional strict mode where you must fix mistakes before moving on.

### 7. TypeRacer

Observed features:
- Race framing, quote categories, friend tracks, high scores.
- Categories: books, original texts, endurance, inspirational, scientific facts, games/anime, short/easy.

What to adopt later:
- Solo “race against your ghost” mode using your previous best.
- Quote/category packs.
- Friend/public racing only if backend is added.

## Product principles

1. Korean-first, English-supported.
2. Practice must teach, not only measure.
3. The page must work well without login.
4. No fake social proof, fake global ranking, fake certification, or placeholder content.
5. All MVP stats stay in browser localStorage.
6. Hangul IME composition correctness is a release blocker.
7. Do not place ads near the active typing input, restart/next controls, or result actions.
8. Provide enough explanatory content for SEO/AdSense, but keep the active practice area focused.

## Information architecture

Initial route:
- `/typing`: unified typing practice app and landing page.

Possible later subroutes only after MVP quality is proven:
- `/typing/lessons`: structured lesson map.
- `/typing/test`: speed test mode.
- `/typing/custom`: custom text mode.
- `/typing/stats`: local-only stats dashboard.

For MVP, implement mode tabs inside `/typing` instead of many thin routes.

## MVP must-have scope

The MVP should be more than a sentence randomizer. It must include five usable modes:

### Mode A — 자리연습 / Keyboard zone drills

Purpose:
- Teach the Korean 2-set keyboard physically.

Lessons:
- 기본자리
- 왼손 윗자리
- 왼손 아랫자리
- 가운데자리
- 오른손 윗자리
- 오른손 아랫자리
- 전체자리
- 숫자/기호자리, optional in MVP if time is tight

Requirements:
- Render an on-screen keyboard.
- Highlight the next expected key.
- Show finger/hand hint text.
- Use jamo-level target sequences for drills, not only composed syllables.
- Track per-key attempts, accuracy, and reaction time locally.
- Finish condition: N correct key hits or target sequence completed.

Korean IME detail:
- For key-position drills, prefer `keydown.code`/layout mapping where possible instead of final composed text only.
- For syllable/word drills, use textarea/input value with composition events.

### Mode B — 낱말연습 / Korean word practice

Purpose:
- Bridge key positions to real vocabulary.

Requirements:
- Word packs by difficulty:
  - beginner: short common nouns/verbs/adjectives
  - daily: practical words
  - developer: JSON, API, 배포, 시간대, 자동화 등 site-relevant terms
- Show one current word plus upcoming words.
- Enter/space advances after word completion depending on setting.
- Track word accuracy and problem characters.

### Mode C — 단문연습 / Short sentence practice

Purpose:
- Practice real Korean spacing, particles, punctuation, and flow.

Requirements:
- 1~2 sentence prompts.
- Character-level visual feedback.
- IME composition-safe current-character feedback.
- Optional strict mode toggle:
  - relaxed: can continue with mistakes
  - strict: must correct current mistake before continuing

### Mode D — 장문/필사 / Long-form focus practice

Purpose:
- Long-form endurance and accuracy.

Requirements:
- Original public-domain-safe or self-authored passages only.
- 3 difficulty levels by length.
- Progress bar by paragraph.
- Pause/resume.
- Result includes WPM, CPM, accuracy, total time, error hotspots.

### Mode E — 60초 속도 측정 / Quick speed test

Purpose:
- Recognizable benchmark similar to 10FastFingers/Monkeytype, but Korean-localized.

Requirements:
- 15/30/60/120 second options; default 60.
- Korean word stream and English word stream.
- Optional punctuation/numbers toggles.
- WPM, CPM, raw CPM, corrected CPM, accuracy.
- Local best score by mode/duration/language.

## Metrics model

Track both test metrics and learning metrics.

### Test metrics
- elapsedSeconds
- typedChars
- correctChars
- incorrectChars
- correctedErrors
- uncorrectedErrors
- rawCPM = typedChars / minutes
- cpm = correctChars / minutes
- wpm = correctChars / 5 / minutes
- accuracy = correctChars / max(typedChars, 1)
- consistency: optional later, based on per-interval speed variance

### Learning metrics
- perKeyStats: attempts, correct, misses, averageReactionMs
- problemKeys: keys/jamo with lowest accuracy or slowest reaction
- dailyPracticeSeconds
- streakDays, local-only
- lessonCompletion by mode/lesson
- bestScores by mode/language/duration

## Data model

Suggested files:
- `src/app/typing/page.tsx`: server page, metadata, content shell.
- `src/components/typing/TypingApp.tsx`: client orchestrator.
- `src/components/typing/TypingModeTabs.tsx`: mode navigation.
- `src/components/typing/KoreanKeyboard.tsx`: on-screen Korean 2-set keyboard.
- `src/components/typing/TargetText.tsx`: character rendering.
- `src/components/typing/TypingInput.tsx`: composition-safe input.
- `src/components/typing/TypingStats.tsx`: live stats/result stats.
- `src/components/typing/LessonMap.tsx`: lessons/progress.
- `src/components/typing/ProblemKeys.tsx`: weak-key panel.
- `src/lib/typing/metrics.ts`: pure metric helpers.
- `src/lib/typing/korean-keyboard.ts`: 2-set key layout and jamo mapping.
- `src/lib/typing/packs.ts`: initial word/sentence/passage packs.
- `src/lib/typing/storage.ts`: localStorage schema helpers.

Types:

```ts
type TypingMode =
  | "keyboard-zone"
  | "word"
  | "sentence"
  | "longform"
  | "speed-test";

type TypingLanguage = "ko" | "en";

type Strictness = "relaxed" | "strict";

type TypingSession = {
  mode: TypingMode;
  language: TypingLanguage;
  lessonId: string;
  target: string;
  input: string;
  startedAt: number | null;
  finishedAt: number | null;
  isComposing: boolean;
  events: TypingEvent[];
};

type TypingEvent = {
  at: number;
  kind: "input" | "keydown" | "correction" | "composition-start" | "composition-end";
  value?: string;
  key?: string;
  code?: string;
  expected?: string;
  correct?: boolean;
};
```

## Korean IME release rules

This is non-negotiable for a Korean typing product.

Implementation rules:
- Track `compositionstart`, `compositionupdate`, and `compositionend`.
- During composition, do not mark the currently composing syllable as a final error.
- Use final textarea value after `compositionend` for syllable/word/sentence correctness.
- In key-position drills, use physical key events and Korean 2-set mapping where appropriate.
- Backspace must update visual state and metrics consistently.
- Avoid flickering red on incomplete Hangul syllables.

QA cases:
- macOS Korean 2-set IME.
- Chrome/Safari if available.
- Mobile Korean keyboard.
- Examples: `가`, `각`, `한`, `합니다`, mixed Korean/English like `JSON을 정리합니다`.

## UX requirements

Active practice area:
- Large target text.
- Current character/word highlight.
- Error highlight that is visible but not punishing/flickery.
- On-screen keyboard for 자리연습 and optional in other modes.
- Stats visible but secondary.
- Restart and next lesson controls reachable by keyboard and touch.

Keyboard shortcuts:
- `Tab + Enter` or `Cmd/Ctrl + Enter`: restart, if it does not break accessibility.
- `Esc`: blur/stop focus or reset current test after confirmation if active.
- `ArrowRight`: next lesson only when result screen is shown.

Mobile:
- Active input should not be hidden by mobile keyboard.
- Provide tap-to-focus surface.
- Avoid tiny controls in the typing area.

Accessibility:
- Input must have clear label.
- Result summary should use `aria-live` only for completion, not every keystroke.
- Color feedback must not be color-only; use underline/border/icon or text labels.

## Content strategy

Initial content must be original/self-authored.

Korean packs:
- Keyboard-zone jamo sequences.
- Beginner words: short daily terms.
- Daily sentences: travel, schedules, apartments, writing, tools.
- Developer/site-relevant sentences: JSON, API, 배포, 시간대, 자동화, 보안.
- Long-form passages: short original paragraphs about typing habits, Korean input, productivity.

English packs:
- Basic words.
- Short productivity/developer sentences.
- Optional quote-like passages written in-house.

Avoid:
- Copyrighted literature, poems, song lyrics, novel excerpts, Hancom sample texts, or scraped text.

## SEO / AdSense content on `/typing`

Below the interactive module, include helpful content:
- “타자 속도는 어떻게 계산하나요?”
- “WPM과 CPM의 차이”
- “한글 타자에서 조합 중 오타 표시가 중요한 이유”
- “자리연습부터 장문연습까지 추천 순서”
- FAQ: 기록 저장 위치, 개인정보, 모바일 사용, 영어/한글 차이, 엄격 모드.

Ad placement rule for future:
- No ad inside active typing card.
- No ad between target text and input.
- No ad adjacent to restart/next/result buttons.
- Ads only below educational content or between non-interactive sections.

## Phased implementation

### Phase 0 — Prototype specification lock

- Keep this plan as acceptance criteria.
- Do not implement a thin version that only has short sentences and WPM.

### Phase 1 — Real MVP engine

Deliver:
- `/typing` route with SEO metadata.
- `TypingApp` with five modes: keyboard-zone, word, sentence, longform, speed-test.
- Korean 2-set on-screen keyboard for zone drills.
- Composition-safe input component.
- LocalStorage stats/best scores.
- Result screen and problem-key summary.
- Original Korean/English seed packs.
- Educational content and FAQ below.
- `npm run lint && npm run build` pass.

Suggested commit:
- `feat: add korean-first typing practice mvp`

### Phase 2 — Product polish

Deliver:
- Lesson map with completion states.
- Daily goal and local streak.
- Custom text mode.
- Better mobile polish.
- Ghost mode: race against your previous local best.
- Result share card, without exposing personal data.

Suggested commit:
- `feat: improve typing practice progression`

### Phase 3 — Retention and content

Deliver:
- Launch post under `/posts` explaining the typing practice system.
- More sentence/passage packs.
- Optional `/typing/stats` local dashboard.
- Optional local badges.

Suggested commit:
- `feat: add typing practice content packs`

### Phase 4 — Backend-only-if-needed

Only after local-first product is valuable:
- Accounts/login.
- Public rankings with anti-cheat considerations.
- Friend races.
- Cloud sync.

Do not fake these in MVP.

## Acceptance criteria for Phase 1

Functional:
- User can complete a keyboard-zone drill.
- User can complete a Korean word practice session.
- User can complete a Korean short sentence session.
- User can complete a long-form practice passage.
- User can run a 60-second speed test.
- Results show WPM/CPM/accuracy/errors/time.
- Problem keys are computed from local events.
- Local best scores persist after refresh.

Korean quality:
- Korean IME does not show premature red errors for partial syllable composition.
- Backspace/correction works naturally.
- Korean 2-set key labels match expected physical key mapping.

Product quality:
- No placeholder copy.
- No fake global rankings.
- No copied text/content/art from references.
- Mobile layout is usable.
- Page has SEO metadata and educational content.
- `npm run lint && npm run build` pass.

## Verification checklist

Automated:
- `npm run lint`
- `npm run build`

Manual QA:
- Korean IME: `가`, `각`, `한`, `합니다`, `JSON을 정리합니다`.
- English typing metrics stable.
- Restart resets timer and input.
- Next lesson changes text and clears state.
- localStorage blocked/failure does not break page.
- Mobile width keeps active input visible.
- Strict/relaxed mode behavior is clear.
- Zone drills highlight expected keys.

## Risks

- Korean IME correctness can take more time than ordinary input handling.
- Physical key mapping differs by OS/browser/layout; verify assumptions.
- A five-mode MVP is larger than a simple page, but it is the minimum to avoid “흉내만 낸” typing practice.
- Public ranking/social features require backend and anti-abuse; keep out of MVP.
