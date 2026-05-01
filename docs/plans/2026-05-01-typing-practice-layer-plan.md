# Typing Practice Layer Plan

Date: 2026-05-01
Repo: `/Users/gabriel.k/Documents/Workspace/ohmyzhs/agency-web`
Target route: `/typing`
Status: planned

## Decision

Build the typing practice feature as a standalone product layer at `/typing`, not as a small `/tools/*` utility.

Rationale:
- It can drive repeat visits and longer sessions than one-off converters.
- It needs its own interaction model, sentence packs, progress state, and result history.
- It can connect to posts/guides without diluting the practical-tools IA.
- It should remain separate from future entertainment/experiment layers such as tarot or saju.

## AdSense / trust positioning

Keep the first release practical and learning-focused:
- Korean/English typing practice, no gambling/fortune framing.
- Clear privacy note: practice text and local stats stay in browser localStorage.
- Avoid ad slots near typing input, active test area, restart button, or result actions.
- Add explanatory content below the interactive area: how WPM/accuracy are calculated, how to improve typing, and limitations.

## MVP scope

### Route and IA
- Add `src/app/typing/page.tsx`.
- Add reusable components under `src/components/typing/`.
- Add sentence-pack data under `src/lib/typing.ts` or `content/typing/*.json`.
- Header/footer nav: add only if the page feels production-ready after QA; otherwise feature from home/posts first.

### Practice modes
1. Korean short sentences
2. English short sentences
3. Mixed developer snippets (optional in MVP if time allows)
4. Timed mode backlog: 30s / 60s / 120s

### Core interaction
- Display target text as character spans.
- Text input or hidden textarea captures typing.
- Show current character, correct/incorrect states, and remaining progress.
- Restart button.
- Next sentence button.
- Mobile-friendly input focus behavior.

### Metrics
- Accuracy: correct characters / typed characters.
- WPM: standard 5-character word unit per minute.
- CPM: correct characters per minute.
- Error count.
- Elapsed time.
- Best score per mode stored in localStorage.

### UX details
- Start timer on first keystroke, not page load.
- Do not penalize idle time before first input.
- Backspace should update current error state naturally.
- Preserve Hangul composition behavior; test with Korean IME.
- Avoid overly aggressive per-key validation during IME composition events.

## Component design

Suggested files:
- `src/app/typing/page.tsx`: metadata + page shell.
- `src/components/typing/TypingPractice.tsx`: client component orchestrating state.
- `src/components/typing/TypingText.tsx`: target text character rendering.
- `src/components/typing/TypingStats.tsx`: WPM/accuracy/time cards.
- `src/components/typing/TypingModeTabs.tsx`: language/sentence-pack selector.
- `src/lib/typing.ts`: sentence packs and pure metric helpers.

## State model

```ts
type TypingMode = "ko-short" | "en-short" | "developer";

type TypingSession = {
  mode: TypingMode;
  target: string;
  input: string;
  startedAt: number | null;
  finishedAt: number | null;
  isComposing: boolean;
};
```

Derived values:
- `typedLength`
- `correctChars`
- `errors`
- `accuracy`
- `elapsedSeconds`
- `wpm`
- `cpm`
- `progress`

## IME / Korean input risk

Korean typing has composition events. A naive `onChange`-only implementation may mark partial Hangul composition as wrong while the syllable is still being assembled.

Implementation rules:
- Track `onCompositionStart` / `onCompositionEnd`.
- During composition, avoid final error flash for the current composing character.
- Compute final correctness from the textarea value after composition end.
- QA with Korean 2-set keyboard on macOS and mobile.

## Content strategy

Initial sentence packs:
- Korean practical sentences about travel, tools, schedules, apartments, and daily notes.
- English short sentences about meetings, automation, JSON, timezones, and writing.
- Avoid copyrighted literature in seed content.

Future packs:
- KST/global work phrases.
- Developer command snippets.
- Korean beginner syllable drills.
- User-created custom text mode.

## Internal links

From `/typing`:
- Link to posts explaining typing practice and keyboard habits.
- Link to relevant developer utilities only if natural; do not force tool cross-links.

From posts:
- `typing-practice-layer-idea` can become the launch note after MVP.

## Phased implementation

### Phase 1 — MVP page
- Add `/typing` route and client practice component.
- Korean/English sentence packs.
- WPM, CPM, accuracy, elapsed time.
- Restart/next sentence.
- localStorage best score.
- Lint/build.

### Phase 2 — Product polish
- Timed mode.
- Daily challenge sentence.
- Result share card.
- Better mobile keyboard/focus handling.
- Accessibility pass: labels, aria-live for result, color contrast.

### Phase 3 — Content layer
- Publish an explanatory post: “설치 없이 쓰는 타자연습기에서 WPM과 정확도를 보는 법”.
- Add sentence packs as content files.
- Add `/typing/stats` only if there is enough local-only history to show.

## Verification checklist

- `npm run lint`
- `npm run build`
- Manual QA:
  - Korean IME composition does not flicker badly.
  - English typing metrics are stable.
  - Restart resets timer and input.
  - Next sentence changes text and clears state.
  - localStorage failure does not break page.
  - Mobile width does not hide active input or stats.

## Recommended commit sequence

1. `docs: plan typing practice layer`
2. `feat: add typing practice mvp`
3. `feat: add typing sentence packs and launch note`
