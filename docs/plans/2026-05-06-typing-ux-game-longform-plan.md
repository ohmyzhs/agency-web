# Typing UX, Word Defense, Longform Content Implementation Plan

> **For Hermes:** Use subagent-driven-development skill and Claude Code to implement this plan task-by-task. Target repository is `/Users/gabriel.k/Documents/Workspace/ohmyzhs/agency-web` on branch `redesign/typing-multiline-surface` unless a newer continuation branch is created from it.

**Goal:** Finish the typing product UX iteration: typing.works-like Hangul composition overlay, corrected metric sections, no countdown/helper copy, richer longform/passages, randomized zone drills, improved zone input behavior, and Word Defense input/ship-follow UX with provided assets.

**Architecture:** Keep the typing practice modes in the existing Next.js/App Router + React component structure. Keep `keyboard-zone` specialized for jamo-key drills, while `word`, `sentence`, `longform`, and `speed-test` use the unified paragraph-style surface. Word Defense remains Phaser-hosted under React, with React controlling the small input overlay and Phaser emitting target-word position events.

**Tech Stack:** Next.js, React, TypeScript, Tailwind, Phaser 3, es-hangul, local assets under `public/typing/illustrations`.

---

## User-provided reference observations

The attached sequential screenshots show the desired Hangul composition effect in the paragraph overlay:

1. Before typing the syllable `상`, the cursor/current position is immediately before `상` in the target text.
2. After pressing `ㅅ`, the target syllable position displays partial jamo `ㅅ` in bright/typed color, while the remaining target text stays gray.
3. After pressing `ㅏ`, the same target syllable position displays partial composition `사`; the following target text remains gray.
4. After pressing `ㅇ`, the syllable becomes `상` and the typed/bright range advances to include the complete syllable.

Acceptance: for syllable-level modes, the overlay must not simply reveal whole target characters only after the IME commits. It should render the partial composed value at the current syllable cell as keystrokes arrive: `ㅅ → 사 → 상`.

---

## Current repo state at plan creation

- Repo: `/Users/gabriel.k/Documents/Workspace/ohmyzhs/agency-web`
- Branch: `redesign/typing-multiline-surface`
- Existing dirty work from previous iteration includes:
  - `src/components/typing/TypingInput.tsx`
  - `src/components/typing/MultilineTypingSurface.tsx`
  - `src/components/typing/organisms/ModeShell.tsx`
  - `src/hooks/useStageContent.ts`
  - `src/lib/typing/packs-staged.ts`
  - `docs/plans/2026-05-05-typing-works-multiline-input-ux-plan.md`
- User-added assets already present and untracked:
  - `public/typing/illustrations/explosion.jpeg`
  - `public/typing/illustrations/game-static-sheet.jpeg`
  - `public/typing/illustrations/hands-reference.png`
  - `public/typing/illustrations/space-bg.png`
  - `public/typing/illustrations/ui_sub.jpeg`

---

## Required acceptance criteria

### A. Paragraph typing surface / Hangul composition

- Replace the current whole-character reveal behavior with partial syllable composition rendering.
- While typing `상`, show the same position as `ㅅ`, then `사`, then `상`.
- The caret/current highlight should remain visually at the active composition point.
- Works in sentence, longform/필사, word, and speed-test modes where composed Hangul syllables are expected.
- Do not apply this model to `keyboard-zone`; it remains jamo/stroke based.

### B. Metrics sections

For 단문연습:

- Top section label: `현재 지문 결과`
- Top section fields: `타/분`, `순간최고타수`, `정타수`, `오타수`, `정확도`, `시간`
- Top section must not show continuous/overall best as if it were the current sentence’s result.

- Bottom section label: `이번 연습 결과`
- Bottom section fields: `문장수`, `평균타수`, `최고타수`, `최저타수`, `정타수`, `오타수`, `정확도`, `시간`
- Replace labels like `연속 최고`, `연속 최저`, `연속 평균`, `연속 완료`.

For 장문/필사, 자리연습, 낱말연습 top aggregation:

- Use the same top current-passage section model:
  - `현재 지문 결과 | 타/분, 순간최고타수, 정타수, 오타수, 정확도, 시간`
- Do not mix current-passage metrics with session/continuous metrics in the same row.

### C. Countdown/helper text removal

- Remove the common input helper copy: `바로 입력하세요. 첫 타부터 기록합니다` from all typing surfaces.
- Remove or disable the 3-second countdown flow entirely. First keystroke starts timing immediately.
- Ensure there is no countdown overlay after the user already starts typing.

### D. Sentence input sizing

- If 단문연습 renders only one line of text, reduce the input/surface height accordingly.
- Sentence mode should not show an oversized multi-line box for a short one-line prompt.
- Longform remains taller.

### E. Longform/필사 content and selection UX

- Existing non-`AI단편` longform passages around ~100 chars are too short.
- For every retained category, prepare/select passages around 1000 Korean characters.
- If a category cannot realistically support useful ~1000-char content, remove it from the public category list rather than shipping thin content.
- Add UX so the user can choose the desired passage within a category, not just category-level random/automatic selection.
- Prefer public-domain or original/self-authored text. Keep `source` accurate.
- Verify `LONGFORM_CATEGORIES`, route UI, and content selection all agree.

### F. Keyboard-zone / 자리연습 randomization and input display

- Current target key sequence is too monotonous: left-to-right/right-to-left repeated ordering.
- Generate randomized target order for the selected home/key row/stage, while still covering the required keys sufficiently.
- On entering 자리연습, typed jamo keys must not accumulate visibly in the large input.
- Add a small focused input box under/near the `입력할 자리` area.
- This small box should show only the current key press briefly; when the next target advances, reset it so it is almost always empty.
- Keep keyboard/finger guide working from expected key metadata.

### G. Word Defense game UX

- Current word-defense input characters are not visible in the lower input.
- Replace full-width bottom input with a small text box roughly max 5 Hangul characters wide.
- Position this small input box at the bottom of the spaceship by default.
- When the user starts typing a word, identify the target meteor/word being matched and move the spaceship + text box to the center-bottom of that target word.
- The text box should show the currently typed characters for that target word.
- When the word is destroyed, input resets and ship/text box returns or retargets naturally.
- Use the user-provided assets under `public/typing/illustrations` where appropriate; inventory dimensions and do not claim missing assets.

---

## Implementation Tasks

### Task 0: Ground repo and preserve current work

**Objective:** Verify target repo/branch, inspect dirty state, and avoid losing user/current work.

**Files:** none expected.

**Steps:**
1. Run:
   ```bash
   cd /Users/gabriel.k/Documents/Workspace/ohmyzhs/agency-web
   pwd
   git rev-parse --show-toplevel
   git status --short --branch
   git remote -v
   ```
2. Confirm branch is `redesign/typing-multiline-surface` or create a continuation branch if Claude decides broad changes require isolation:
   ```bash
   git checkout -b redesign/typing-ux-game-longform-polish
   ```
   Only create the branch if not already on a safe feature branch.
3. Do not stash or delete the existing uncommitted work.

**Verification:** Report repo path, branch, and changed-file list.

---

### Task 1: Inspect typing flow and metric state model

**Objective:** Identify exact structures in `ModeShell.tsx`, `MultilineTypingSurface.tsx`, and metric helpers before editing.

**Files:**
- Read: `src/components/typing/organisms/ModeShell.tsx`
- Read: `src/components/typing/MultilineTypingSurface.tsx`
- Read: `src/components/typing/TypingInput.tsx`
- Read: `src/lib/typing/metrics-jamo.ts`
- Read: `src/hooks/useStageContent.ts`

**Steps:**
1. Find existing live metrics, last result, continuous stats, countdown/start phase, and surface selection code.
2. Identify how `typed`, `target`, `phase`, `startedAt`, `bestTpm`/peak speed, correct/incorrect counts, and completed counts are computed.
3. Write a short implementation note in Claude’s final output before applying changes.

**Verification:** No code changes unless necessary; output the relevant file/line map.

---

### Task 2: Implement partial Hangul composition rendering in MultilineTypingSurface

**Objective:** Render the active syllable with partial jamo/composed value (`ㅅ → 사 → 상`) while preserving target alignment.

**Files:**
- Modify: `src/components/typing/MultilineTypingSurface.tsx`
- Possibly modify/create helper in `src/lib/typing/` if reusable.

**Implementation notes:**
- Use `es-hangul` decomposition/assembly helpers if available; otherwise implement a small deterministic helper.
- Compare `target` and `typed` at keystroke/jamo sequence level, but render by target character cell.
- For each target syllable, derive:
  - fully typed previous syllables: bright/correct/incorrect status
  - current syllable partial typed string: render partial composed display in current cell
  - untyped future syllables: muted gray
- For target char `상`, typed jamo prefix should display:
  - typed prefix `ㅅ` => `ㅅ`
  - typed prefix `ㅅㅏ` => `사`
  - typed prefix `ㅅㅏㅇ` => `상`
- Keep incorrect typed input visible enough to debug mistakes; do not hide errors.

**Verification:** Browser QA should reproduce the four screenshots on a phrase beginning at a syllable like `상`.

---

### Task 3: Remove countdown/helper copy and right-size sentence surface

**Objective:** Start timing on first keystroke and remove unnecessary placeholder/helper text.

**Files:**
- Modify: `src/components/typing/organisms/ModeShell.tsx`
- Modify: `src/components/typing/MultilineTypingSurface.tsx`
- Modify: `src/components/typing/TypingInput.tsx`

**Steps:**
1. Remove text `바로 입력하세요. 첫 타부터 기록합니다` from all surfaces.
2. Remove the 3-second countdown path if it exists, or force it off.
3. Ensure typing starts immediately on first input.
4. Sentence mode: if target fits one line, surface should use compact height (for example 1–2 visual lines rather than a longform box).
5. Longform mode: retain a larger viewport.

**Verification:** Browser QA on `/typing/sentence` and `/typing/longform` confirms no helper copy and no countdown.

---

### Task 4: Rework metric sections and labels

**Objective:** Align all relevant typing modes with the requested top/current and bottom/session metric model.

**Files:**
- Modify: `src/components/typing/organisms/ModeShell.tsx`
- Possibly create small presentational components if ModeShell becomes too large.

**Implementation details:**
- Top/current section label: `현재 지문 결과`.
- Top/current fields: `타/분`, `순간최고타수`, `정타수`, `오타수`, `정확도`, `시간`.
- Bottom/session section label for sentence/continuous modes: `이번 연습 결과`.
- Bottom/session fields: `문장수`, `평균타수`, `최고타수`, `최저타수`, `정타수`, `오타수`, `정확도`, `시간`.
- Update state model to accumulate correct chars, incorrect chars, and elapsed time across session, not only TPM.
- Remove confusing labels `연속 최고`, `연속 최저`, `연속 평균`, `연속 완료`.
- Apply current-section top aggregation to 장문/필사, 자리연습, 낱말연습.

**Verification:** Complete several sentence prompts and confirm top row remains current prompt, bottom row reflects the entire session.

---

### Task 5: Expand longform passages and add passage picker UX

**Objective:** Replace thin ~100-char passages with meaningful ~1000-char passages and allow choosing specific passage titles.

**Files:**
- Modify: `src/lib/typing/packs-staged.ts`
- Modify: `src/lib/typing/types.ts` if categories change.
- Modify: `src/hooks/useStageContent.ts`
- Modify: `src/components/typing/organisms/ModeShell.tsx` or longform-specific selector component.

**Implementation details:**
- Keep `AI단편` if already long enough.
- For `고전`, `에세이`, `한국사`, `과학`, `CS`, write self-authored/public-domain-friendly ~1000-char Korean passages.
- For categories like `애국가`, `속담`, `명언`, either expand into meaningful article-style passages around the theme or remove if they would be artificial/thin. User explicitly allowed removing unsuitable sections.
- Add a second-level passage selection UI: category -> title list/cards -> chosen passage.
- Persist or reset selection predictably when category changes.
- Ensure longform target comes from selected passage, not a random hidden choice.

**Verification:** `/typing/longform` shows category and passage picker, selected text is around 1000 chars, and no empty categories appear.

---

### Task 6: Randomize keyboard-zone target order and reset visible input per stroke

**Objective:** Make 자리연습 less monotonous and remove accumulating visible typed jamo.

**Files:**
- Modify: `src/hooks/useStageContent.ts`
- Modify: `src/components/typing/organisms/ModeShell.tsx`
- Possibly modify key-zone content generator in `src/lib/typing/packs-staged.ts` or related files.

**Implementation details:**
- Generate a shuffled sequence from the lesson’s allowed keys. Avoid simple 좌→우→좌→우 patterns.
- Keep enough repetition for practice, but randomize order per session/lesson.
- Use React-safe random seed with lazy `useState`, not `Date.now()` in render or `useMemo`.
- For the zone input display, keep internal typed/progress state, but the visible small input should show only the last/current stroke and reset on advance.
- Large accumulating textarea should be hidden/minimized for zone mode.

**Verification:** `/typing/zone/all` and a specific lesson show non-monotonic target sequence. Pressing `KeyA`, `KeyS`, `KeyD`, `KeyK` works. Visible small input clears after each accepted stroke.

---

### Task 7: Inventory and wire Word Defense assets

**Objective:** Recognize and safely use the provided game assets.

**Files:**
- Read/check: `public/typing/illustrations/explosion.jpeg`
- Read/check: `public/typing/illustrations/game-static-sheet.jpeg`
- Read/check: `public/typing/illustrations/hands-reference.png`
- Read/check: `public/typing/illustrations/space-bg.png`
- Read/check: `public/typing/illustrations/ui_sub.jpeg`
- Modify: `src/components/typing/game/word-defense/scenes/GameScene.ts`

**Steps:**
1. Use Python/Pillow or file metadata to inspect dimensions.
2. Use `space-bg.png` as background if dimensions and style fit.
3. Use `game-static-sheet.jpeg`/`ui_sub.jpeg` for ship/UI only if sprite regions can be identified safely. If not, keep procedural ship but document exact blocker.
4. Use `explosion.jpeg` only if it can be animated or cropped cleanly. Otherwise keep particle explosion and leave asset for future post-processing.

**Verification:** Build succeeds and no missing asset paths occur at runtime.

---

### Task 8: Improve Word Defense input and ship-follow behavior

**Objective:** Make the typed word visible in a compact box and move ship/input under the active target word.

**Files:**
- Modify: `src/components/typing/game/word-defense/WordDefenseGame.tsx`
- Modify: `src/components/typing/game/word-defense/scenes/GameScene.ts`

**Implementation details:**
- In React, replace full-width input with a compact `input` sized around `5ch` to `7ch`, centered by default.
- Store visible typed string for current target; clear on destroy/miss/retarget.
- Phaser scene should emit active target info on hit/retarget:
  - meteor id
  - word
  - matched jamo count
  - container x/y or screen-space x/y
  - approximate width
- React overlay can position the compact input and a ship element by percentage relative to the Phaser host, or Phaser can move its ship sprite and React positions only the text box. Prefer one source of truth.
- When the first jamo matches a word, set that meteor as active target and move ship/input under its center bottom.
- Further input should prefer continuing that active meteor before matching other meteors.
- When active meteor is destroyed, clear active target; if another typed prefix exists, retarget; otherwise return to default bottom center.

**Verification:** In browser, typing a falling word shows characters in the compact box and the box/ship moves under that word.

---

### Task 9: Lint, build, browser QA, commit/push

**Objective:** Verify all changes and commit/push a coherent feature branch.

**Commands:**
```bash
cd /Users/gabriel.k/Documents/Workspace/ohmyzhs/agency-web
npm run lint
npm run build
npx next start -H 127.0.0.1 -p 3034
```

**Browser QA URLs:**
- `http://127.0.0.1:3034/typing/sentence`
- `http://127.0.0.1:3034/typing/longform`
- `http://127.0.0.1:3034/typing/zone/all`
- `http://127.0.0.1:3034/typing/word`
- `http://127.0.0.1:3034/typing/game/word-defense`

**QA checklist:**
- Sentence partial composition: `ㅅ → 사 → 상` style active syllable rendering.
- No helper copy / no countdown.
- Sentence surface not oversized for one-line prompt.
- Metrics labels/fields match requested names.
- Longform shows passage picker and substantial text.
- Zone random target order and small reset input.
- Word Defense compact visible input and active-target movement.

**Commit:**
```bash
git add docs/plans src public/typing/illustrations
git commit -m "feat: polish typing practice UX and word defense"
git push origin HEAD
```

---

## Final report requirements

Claude/Hermes final output must include:

- Branch name and commit hash.
- Files changed.
- Which requested items are fully implemented.
- Validation results: lint, build, browser QA.
- Any item deliberately deferred, with reason.
- Local preview URL if a server remains running.
