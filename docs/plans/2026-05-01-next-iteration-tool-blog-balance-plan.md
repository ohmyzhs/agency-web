# Next Iteration Plan: Tool UX Upgrade + Blog/Guide Architecture Balance

> **For Claude Code / Hermes:** Implement this plan task-by-task on `restructure/adsense-tools-hub`. Do not push. Make focused commits per phase. Keep `npm run lint` and `npm run build` green after every phase.

**Goal:** Address Gabriel's QA feedback by making the tools genuinely useful, reducing the over-emphasis on “tools only” in the site narrative, and restructuring guides into a scalable blog/knowledge architecture.

**Architecture:** Keep the current Next.js App Router + static tool registry. Refactor the tool registry so hidden/removed tools do not appear in navigation, sitemap, or related links. Upgrade high-priority tools with richer controls, live data where appropriate, and cross-tool navigation. Reframe the homepage and guide/blog IA so `ohmyzhs.com` reads as a balanced information blog + practical tools hub, not a pure utility directory or generic agency site.

**Tech Stack:** Next.js 16.2.2, React 19.2.4, TypeScript, Tailwind v4 CSS tokens, browser-local tools, static routes, minimal server route for exchange-rate proxy if needed.

---

## 0. Non-negotiable user feedback to preserve

### Tool changes
1. Pyeong converter:
   - Replace English `pyeong` UI copy with Korean `평`.
   - Provide clickable apartment size badges: `59㎡`, `75㎡`, `84㎡`, `99㎡`.
   - Do not use free text input; use numeric stepper / numeric up-down control.
2. KST timezone converter:
   - Add realtime toggle, default ON.
   - Show seconds and auto-increment every second while realtime is ON.
   - Replace flat multi-time list with analog clock blocks.
   - Remove Seoul row from comparison output.
   - Add country/city list selector to include more clocks.
3. Korean shoe size converter:
   - Use numeric up-down control, not text input.
   - Step by 5mm.
   - Allow changing conversion direction / input-output basis.
4. KRW currency calculator:
   - Pull current exchange rates from an open/public API.
   - User should not have to manually type rates.
   - Use Naver exchange calculator as UX reference, not as data source unless legally/technically appropriate.
5. Unit converter:
   - Replace ConversionType select box with badge/tab switching.
6. LLM cost calculator:
   - Remove. User says it is not useful.
7. Cron explainer:
   - Reverse input/output. User configures schedule; tool outputs cron expression.
8. JSON/YAML/XML:
   - Add beautify support, including XML.
9. Automation ROI calculator:
   - Remove. User says it is not needed.
10. Markdown table generator:
   - Add markdown preview.
11. Color contrast checker:
   - Add color pickers for foreground/background.

### Guide/blog changes
1. Blog will be integrated into this site.
2. A single `/guides` one-page list is not scalable.
3. Need structural improvement for information content + tool content.

### Site-level impressions
1. Current site puts “tools” too aggressively in the hero.
2. Information blog and tool offering should be balanced more evenly.
3. Tool pages need a top quick-slot/quick switcher to jump to other tools.
4. More complex and genuinely useful tools should be added later; current set is too simple.

---

## 1. Implementation phases and priority

### Phase A — Registry cleanup and navigation safety

**Objective:** Remove useless tools cleanly and prevent dead related links/sitemap entries.

**Files:**
- Modify: `src/lib/tools.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `src/components/tools-catalog.tsx`
- Modify: `src/components/tool-page-shell.tsx`
- Modify: `src/app/tools/[slug]/page.tsx` if registry helper names change
- Delete or orphan later: `src/components/tools/LlmCostCalculator.tsx`
- Delete or orphan later: `src/components/tools/AutomationRoiCalculator.tsx`

**Tasks:**
1. Add a registry helper:
   - `visibleTools = tools.filter((tool) => tool.status !== "removed")` or physically remove entries.
   - Preferred now: physically remove LLM cost and Automation ROI from public registry to avoid thin/useless pages.
2. Remove `llm-cost-calculator` and `automation-roi-calculator` entries from `tools`.
3. Remove any `relatedToolSlugs` references to those slugs.
4. Update sitemap to derive only from visible/public tools.
5. Ensure `/tools/llm-cost-calculator` and `/tools/automation-roi-calculator` return 404 if removed.
6. Keep component files only if future reuse is likely; otherwise delete in cleanup commit.

**Acceptance criteria:**
- `/tools` no longer shows LLM cost or Automation ROI.
- Sitemap no longer includes those slugs.
- `npm run lint && npm run build` passes.
- No related link points to removed tools.

**Commit:**
```bash
git add src/lib/tools.ts src/app/sitemap.ts src/components src/app/tools
 git commit -m "chore: remove low-value public tools"
```

---

### Phase B — Shared tool UX primitives

**Objective:** Avoid one-off control implementations and standardize the better tool interactions.

**Files to create:**
- `src/components/tools/shared/NumberStepper.tsx`
- `src/components/tools/shared/SegmentedTabs.tsx`
- `src/components/tools/shared/QuickToolSlots.tsx`
- `src/components/tools/shared/CopyButton.tsx` if missing

**Implementation details:**
1. `NumberStepper`:
   - Props: `value`, `onChange`, `min`, `max`, `step`, `suffix`, `ariaLabel`, `formatValue?`.
   - Render `-` button, `input type="number"`, `+` button.
   - Clamp value to min/max.
   - Preserve keyboard edit but reject NaN; no arbitrary text parsing.
2. `SegmentedTabs`:
   - Props: options with `{value,label,description?}`.
   - Use buttons, not select.
   - Accessible `aria-pressed` or tablist semantics.
3. `QuickToolSlots`:
   - Render at top of every tool page, below back link or in the tool shell header.
   - Show 6-8 most relevant tools, not all 15+ if too crowded.
   - Include current tool disabled/active state.
   - Desktop: horizontal slots. Mobile: horizontally scrollable chips.

**Acceptance criteria:**
- Controls match ZHS visual system.
- Keyboard operable.
- No console warnings.
- `npm run lint && npm run build` passes.

**Commit:**
```bash
git add src/components/tools/shared src/components/tool-page-shell.tsx
 git commit -m "feat: add shared tool interaction primitives"
```

---

### Phase C — Upgrade Tier 1 Korea-life tools

#### Task C1: Pyeong converter UX upgrade

**Files:**
- Modify: `src/components/tools/PyeongConverter.tsx`
- Modify: `src/lib/tools.ts`

**Changes:**
1. Replace all user-facing `Pyeong`/`pyeong` labels in Korean UI with `평`.
2. Use `NumberStepper` for numeric entry.
3. Keep direction toggle: `평 → ㎡`, `㎡ → 평`.
4. Add apartment badges:
   - `59㎡`, `75㎡`, `84㎡`, `99㎡`
   - On click: set direction to `㎡ → 평`, set value accordingly.
5. Display marketing-note outputs:
   - 59㎡: commonly around 24평 marketing class
   - 75㎡: commonly around 30평 class depending on supply area
   - 84㎡: commonly around 34평 marketing class
   - 99㎡: commonly around 39-40평 class depending on supply area
   - Keep disclaimer: legal 기준은 전용/공급/계약면적 공식 서류.

**Acceptance criteria:**
- No free text parsing UI.
- Badges fill value instantly.
- Invalid state impossible or clearly clamped.
- Korean copy uses `평`, not `pyeong`, except English locale where “pyeong” may remain.

#### Task C2: KST timezone converter upgrade

**Files:**
- Modify: `src/components/tools/KstTimezoneConverter.tsx`
- Modify if needed: `src/lib/tools.ts`

**Changes:**
1. Add realtime toggle:
   - Default ON.
   - While ON: source KST time updates every second.
   - Show seconds everywhere.
   - While OFF: user can adjust date/time manually.
2. Remove Seoul from comparison cards because source is already KST.
3. Replace list output with analog clock blocks:
   - Each city card contains city/country, date, digital time with seconds, analog clock face.
   - Analog clock can be simple CSS/SVG with hour/min/sec hands.
4. Add city selector:
   - Default selected: New York, Los Angeles, London, Tokyo, Singapore, Sydney, UTC.
   - Available list: New York, Los Angeles, San Francisco, London, Paris, Berlin, Tokyo, Singapore, Sydney, Dubai, UTC.
   - User can add/remove visible city blocks.
5. DST note remains visible for cities with DST.

**Acceptance criteria:**
- Realtime ON increments seconds every second.
- Toggle OFF freezes and allows manual adjustment.
- Seoul is not duplicated in result blocks.
- City add/remove works without page reload.
- `npm run lint && npm run build` passes.

#### Task C3: Shoe size converter upgrade

**Files:**
- Modify: `src/components/tools/KoreanShoeSizeConverter.tsx`

**Changes:**
1. Replace text input with `NumberStepper`.
2. Step: 5mm.
3. Range: reasonable, e.g. 150-320mm.
4. Add input basis switch:
   - KR mm → US/UK/EU/JP
   - US Men → KR mm/UK/EU/JP
   - US Women → KR mm/UK/EU/JP
   - EU → KR mm/US/UK/JP
5. Keep gender/category selector if current conversion table needs it.
6. Make outputs explicit approximate values with brand-fit disclaimer.

**Acceptance criteria:**
- 5mm step enforced for KR mm mode.
- Direction changes update available fields and outputs.
- No free text UI.

#### Task C4: KRW currency calculator live-rate upgrade

**Files:**
- Modify: `src/components/tools/KrwCurrencyCalculator.tsx`
- Create optional route: `src/app/api/exchange-rates/route.ts`
- Modify: `src/lib/tools.ts`
- Modify: `.env.example` only if API key needed. Prefer keyless API first.

**Recommended data approach:**
1. Prefer a keyless or public API with acceptable CORS/server usage:
   - `https://open.er-api.com/v6/latest/KRW` or similar keyless endpoint.
   - Alternative: exchangerate.host if keyless availability confirmed.
2. Use server route proxy if browser CORS or data consistency is an issue.
3. Cache route response using Next route caching/revalidate if supported by local Next docs.
4. UI similar to Naver exchange calculator:
   - amount input
   - from currency
   - to currency
   - swap button
   - latest rate timestamp
   - manual refresh
   - fee/spread optional percentage
5. Do not scrape Naver unless explicitly approved; use it only as UX reference.

**Acceptance criteria:**
- Default converts major currencies to/from KRW using fetched rates.
- Shows timestamp/source and fallback state.
- If API fails, show clear error and optional manual rate fallback.
- User no longer has to type exchange rate for normal use.

**Commit for Phase C:**
```bash
git add src/components/tools src/lib/tools.ts src/app/api
 git commit -m "feat: upgrade korea-focused tool interactions"
```

---

### Phase D — Upgrade remaining utility tools

#### Task D1: Unit converter tabs

**Files:**
- Modify: `src/components/tools/UnitConverter.tsx`

**Changes:**
- Replace conversion type select box with `SegmentedTabs` / badge tabs.
- Tabs: length, weight, temperature, area, volume.
- Keep unit dropdowns inside selected type if needed.

**Acceptance criteria:**
- Conversion type switches in one click.
- Mobile layout does not overflow.

#### Task D2: Cron expression generator

**Files:**
- Modify: `src/components/tools/CronExplainer.tsx`
- Modify: `src/lib/tools.ts` copy/title if needed. Consider renaming title to `Cron Generator` / `크론 생성기` while keeping slug `cron-explainer` for URL stability.

**Changes:**
1. Reverse flow:
   - User chooses schedule pattern.
   - Tool outputs cron expression.
2. Supported patterns:
   - Every N minutes
   - Hourly at minute
   - Daily at HH:mm
   - Weekdays at HH:mm
   - Weekly on day at HH:mm
   - Monthly on day at HH:mm
3. Output:
   - Cron expression
   - Human-readable explanation
   - Copy button
   - Common caveat: server timezone vs UTC.
4. Optional advanced mode: allow direct cron input to explain, but secondary only.

**Acceptance criteria:**
- Primary UI is schedule → cron.
- Copy button copies expression.
- Explanation updates with schedule.

#### Task D3: JSON/YAML/XML beautifier

**Files:**
- Modify: `src/components/tools/JsonYamlValidator.tsx`
- Modify: `src/lib/tools.ts`

**Changes:**
1. Add mode tabs: JSON, YAML, XML, Auto.
2. Add actions:
   - Validate
   - Beautify / Format
   - Minify for JSON/XML if easy
3. XML support:
   - Use browser `DOMParser` for validation.
   - Implement simple formatter if dependency-free; otherwise add a small vetted dependency only if necessary.
4. YAML:
   - If current YAML parser exists, continue using it.
   - If not, inspect package dependencies before adding.
5. Output panel should clearly show formatted result and errors.

**Acceptance criteria:**
- JSON beautify works.
- YAML validate/format works as much as library supports.
- XML beautify works for normal XML strings.
- Errors are human-readable.

#### Task D4: Markdown table preview

**Files:**
- Modify: `src/components/tools/MarkdownTableGenerator.tsx`

**Changes:**
- Add preview tab/panel rendering generated markdown as a table.
- Avoid unsafe raw HTML.
- Basic renderer is enough: parse generated table into rows/cells and render `<table>`.
- Keep raw markdown copy button.

**Acceptance criteria:**
- Preview updates when rows/columns/content change.
- Preview is styled and readable on mobile.

#### Task D5: Color contrast color pickers

**Files:**
- Modify: `src/components/tools/ColorContrastChecker.tsx`

**Changes:**
- Add `<input type="color">` for foreground and background.
- Keep hex text input if useful, synchronized with picker.
- Validate hex and display contrast ratio + WCAG pass/fail.

**Acceptance criteria:**
- Picker changes update ratio immediately.
- Hex input and picker remain in sync.

**Commit for Phase D:**
```bash
git add src/components/tools src/lib/tools.ts
 git commit -m "feat: improve developer utility tools"
```

---

### Phase E — Tool page cross-navigation

**Objective:** Make movement between tools easy from every tool detail page.

**Files:**
- Modify: `src/components/tool-page-shell.tsx`
- Create/modify: `src/components/tools/shared/QuickToolSlots.tsx`
- Modify: `src/lib/tools.ts` only if grouping metadata needed

**Changes:**
1. Place quick slots near top of every tool page, before/after title block.
2. Show:
   - Current category tools first.
   - Then 2-3 popular/cross-category tools.
3. UI labels:
   - KO: `다른 도구 바로가기`
   - EN: `Jump to another tool`
4. Current tool chip is active and not linked.
5. Mobile horizontal scroll, no wrapping into huge block.

**Acceptance criteria:**
- Every tool detail page has quick navigation.
- No removed tools appear.
- Keyboard and screen-reader labels are acceptable.

**Commit:**
```bash
git add src/components/tool-page-shell.tsx src/components/tools/shared src/lib/tools.ts
 git commit -m "feat: add quick navigation between tools"
```

---

## 2. Blog / content architecture restructuring

### Phase F — Reconsider `/guides/[slug]` and create scalable content model

**Objective:** Move from one-page `/guides` to a content architecture that can support tool explanations, IT news, daily posts, opinion notes, and imported blog content without forcing everything under a “guide” label.

**Updated decision after Gabriel feedback:** Do **not** lock the site into `/guides/[slug]` as the only article route. Gabriel plans to use this area like a blog, including IT news, everyday posts, and non-tool articles. “Guide” is too narrow for the full content layer.

**Recommended route model:**
- Primary article index: `/posts`
- Article detail: `/posts/[slug]`
- Keep `/guides` as a filtered landing page for evergreen/how-to/tool-explanation posts only.
- Optional future aliases:
  - `/blog` can redirect to `/posts` if users expect “blog”.
  - `/guides/[slug]` should not be the canonical route for all content.

**Navigation labels:**
- Korean primary nav: `글` or `블로그`
  - Recommended: `글` if the tone should stay compact/ZHS-like.
  - Alternative: `블로그` if discoverability and user expectation matter more.
- English primary nav: `Posts` or `Journal`
  - Recommended: `Posts`.
- `/guides` can appear as a subcategory/filter, not necessarily top nav.

**Content taxonomy:**
```ts
export type PostKind =
  | "guide"        // evergreen how-to / tool explanation
  | "it-news"      // IT news / overseas tech topic summary
  | "daily"        // everyday notes / light posts
  | "tool-note"    // short explanation tied to a tool
  | "experiment"   // tarot/saju/typing-practice/other layers later
  | "site-note";

export type PostCategory =
  | "korea-living"
  | "automation"
  | "developer"
  | "ai"
  | "it-news"
  | "daily"
  | "culture"
  | "experiments";

export type Post = {
  slug: string;
  title: string;
  description: string;
  kind: PostKind;
  category: PostCategory;
  locale: "ko" | "en" | "both";
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  sourceLinks?: Array<{ label: string; url: string }>;
  relatedToolSlugs?: string[];
  tags: string[];
  body: Array<...>; // typed blocks or MD/MDX later
};
```

**Files to create:**
- `src/lib/posts.ts`
- `src/app/posts/page.tsx`
- `src/app/posts/[slug]/page.tsx`
- `src/components/posts/post-card.tsx`
- `src/components/posts/post-page-shell.tsx`
- Optional compatibility route later: `src/app/blog/page.tsx` redirecting to `/posts`

**Files to modify:**
- `src/app/guides/page.tsx` — convert to a filtered guide index or redirect/alias after `/posts` exists.
- `src/components/guides-page.tsx` — replace with posts/content components or keep only for `/guides` filter.
- `src/app/sitemap.ts`
- `src/components/footer.tsx`
- `src/components/header.tsx`
- `src/app/page.tsx`

**Initial post pages to add:**
1. `/posts/pyeong-to-square-meter-korea-apartment`
   - Kind: `guide`
   - Explains 59/75/84/99㎡, 전용/공급/계약면적, why 84㎡ is marketed as 34평.
2. `/posts/kst-global-meeting-time`
   - Kind: `guide`
   - Explains KST, DST, meeting coordination, UTC storage.
3. `/posts/krw-exchange-rate-calculator`
   - Kind: `guide`
   - Explains exchange-rate source, card/bank spread, Naver-like calculator caveats.
4. `/posts/json-yaml-xml-formatting`
   - Kind: `guide`
   - Explains validation vs beautify vs minify.
5. `/posts/cron-expression-from-schedule`
   - Kind: `guide`
   - Explains schedule → cron, timezone caveats.

**Future content examples that should fit without redesign:**
- `/posts/openai-release-summary-YYYY-MM-DD` — `it-news`
- `/posts/claude-code-workflow-note` — `automation` / `developer`
- `/posts/daily-tools-i-used-this-week` — `daily`
- `/posts/tarot-product-layer-note` — `experiment`

**Acceptance criteria:**
- `/posts` is the canonical scalable content index.
- `/posts/[slug]` is the canonical article URL structure.
- `/guides` is not the only article structure; it is either a guide-filter landing page or a lightweight redirect/filter to `/posts?kind=guide` depending on implementation complexity.
- Sitemap includes `/posts` and each post detail page.
- Tool pages can link to related posts.
- Posts can link back to relevant tools.
- Structure supports IT news and daily posts without awkward “guide” naming.

**Commit:**
```bash
git add src/lib/posts.ts src/app/posts src/components/posts src/app/guides src/app/sitemap.ts src/components/header.tsx src/components/footer.tsx
 git commit -m "feat: add scalable posts architecture"
```

---

## 3. Homepage narrative rebalance

### Phase G — Rebalance hero and landing page

**Objective:** Stop making the site feel like only a tool directory. Present it as a knowledge/blog + practical tools site.

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/lib/i18n.ts`

**New homepage structure:**
1. Hero:
   - Do not lead with “17 tools”.
   - Lead with a broader promise: practical notes, calculators, and automation references for people working between Korea/global contexts.
   - Example KO headline: `한국과 글로벌 작업 사이의 작은 기준점.`
   - Example KO lead: `생활 단위, 시간대, 환율, 데이터 포맷, 자동화 스케줄처럼 자주 헷갈리는 문제를 글과 도구로 정리합니다.`
   - CTA 1: `최신 가이드 보기`
   - CTA 2: `도구 열기`
2. Featured guides section:
   - Show 3-5 guide cards.
3. Practical tools section:
   - Show 6-8 core tools, not every tool.
4. Editorial principles section:
   - `근거 표시`, `브라우저 로컬 처리`, `과장 없는 설명`, `업데이트 날짜`.
5. CTA:
   - `필요한 도구나 글 주제 제안하기`.

**Acceptance criteria:**
- Above-the-fold is not only “tools”.
- Blog/guide content and tools feel equally important.
- No fake metrics.
- Korean/English locale both coherent.

**Commit:**
```bash
git add src/app/page.tsx src/lib/i18n.ts
 git commit -m "feat: rebalance home around guides and tools"
```

---

## 4. More useful future layers and tools backlog

These should not block the immediate fix, but they address the user’s concern that current tools are too simple and that the site can grow beyond pure utilities.

### Product-layer idea: typing practice / tarot / saju

Add this to the next TODO/backlog, not the current Phase A-C implementation:

1. **Typing practice layer**
   - Potential route: `/typing` or `/tools/typing-practice` depending on whether it becomes a standalone product layer or a tool.
   - Menu consideration: if it is substantial, expose as top-level `타자연습` / `Typing`; if small, keep under tools.
   - Useful features: Korean/English typing modes, WPM/accuracy, mistake heatmap, sentence packs, daily practice, local-only stats.
   - AdSense/content angle: typing tips, keyboard layouts, Korean typing guide posts.
2. **Tarot layer**
   - Potential route: `/tarot`.
   - Should be clearly separated from utility/tool credibility if added.
   - Needs content/disclaimer layer and tasteful design so it does not weaken AdSense trust.
3. **Saju layer**
   - Potential route: `/saju`.
   - Same concern as tarot: separate entertainment/experiment positioning, clear disclaimer, no medical/financial/life-decision claims.

**IA recommendation:** Treat these as `experiments` or `layers`, not ordinary utility tools. The main nav can later become:
- `글` / `Posts`
- `도구` / `Tools`
- `타자연습` / `Typing` if typing becomes a flagship interactive feature
- `실험실` / `Experiments` for tarot/saju and other playful layers

### Benchmark-derived tool backlog update (2026-05-02)

A separate benchmark document was added after surveying `getin.kr`, `vivoldi.com/tools`, `googsu.com`, and `itool.co.kr`:

- `docs/plans/2026-05-02-tool-benchmark-distinct-backlog.md`

Use that file as the canonical distinct candidate backlog. Highest-priority additions from the benchmark are:

1. JSON/YAML/XML formatter-validator-viewer workspace.
2. Character/word/line counter.
3. Base64 encode/decode.
4. Image compression.
5. Text diff/compare.
6. URL encode/decode.
7. JWT decoder.
8. Color picker + image color extraction.
9. Markdown preview/table utilities.
10. Regex/hash/UUID/Cron developer utilities.

Keep the existing constraint that the public network tool remains only `내 IP 확인 / Check My IP` unless Gabriel explicitly reopens DNS/ping/TLS/header-check style diagnostics.

### Candidate complex tools
1. **Korean real-estate cost estimator**
   - Inputs: region, deposit/monthly rent, management fee, area, brokerage category.
   - Outputs: estimated monthly cost, brokerage fee range, conversion notes.
2. **Korea/global meeting planner**
   - More advanced than KST converter: overlap windows, working hours, multi-city scheduling.
3. **Exchange-rate travel budget planner**
   - Live rates + card fee + cash/card split + daily budget.
4. **Automation schedule builder**
   - Human schedule → cron + timezone + test next 5 run times.
5. **Structured data / JSON-LD generator**
   - For blog posts, tools, FAQ schema.
6. **AdSense readiness checker for small sites**
   - Crawl URL, check robots/sitemap/policy/contact/thin pages/broken links.

### Backlog acceptance rule
- Add only tools that solve a real workflow.
- Each new tool must have:
  - working interaction,
  - examples,
  - explanatory guide,
  - privacy/data source notes,
  - QA checklist.

---

## 5. Testing and QA checklist

Run after every phase:
```bash
npm run lint
npm run build
```

Production QA:
```bash
npm run build
npx next start -H 127.0.0.1 -p 3008
```

Browser checks:
- `/`
- `/tools`
- `/tools/pyeong-converter`
- `/tools/kst-timezone-converter`
- `/tools/korean-shoe-size-converter`
- `/tools/krw-currency-calculator`
- `/tools/unit-converter`
- `/tools/cron-explainer`
- `/tools/json-yaml-validator`
- `/tools/markdown-table-generator`
- `/tools/color-contrast-checker`
- `/guides`
- at least 2 `/guides/[slug]` pages
- `/sitemap.xml`
- `/robots.txt`

Manual interaction QA:
- Pyeong badges click and numeric stepper.
- KST realtime seconds tick and city selector.
- Shoe size 5mm stepper and direction switch.
- KRW rates fetch, refresh, fallback.
- Unit type tabs.
- Cron schedule-to-expression copy.
- JSON/YAML/XML beautify errors and success states.
- Markdown preview.
- Color picker sync.
- Quick tool slots on every tool page.

Mobile QA:
- 375px width and 430px width.
- Header no overflow.
- Quick slots horizontally scroll.
- Numeric steppers usable.
- Analog clock blocks wrap cleanly.
- Guide cards readable.

AdSense QA:
- Removed low-value tools not indexed.
- Guide pages are not thin.
- Policy/contact pages still reachable.
- No fake agency/service claims.
- No ad placeholders near inputs/results.

---

## 6. Suggested execution order for Claude

Use this exact order:
1. Phase A: Remove LLM cost and Automation ROI from public registry.
2. Phase B: Add shared tool UX primitives and quick-slot skeleton.
3. Phase C1-C3: Upgrade Pyeong, KST, Shoe Size.
4. Phase C4: KRW live rates.
5. Phase D1-D5: Upgrade remaining utility tools.
6. Phase E: Apply quick slots to all tool pages.
7. Phase F: Add scalable guide architecture.
8. Phase G: Rebalance homepage narrative.
9. Final QA and one final cleanup commit if needed.

If time is limited, do **A + B + C1 + C2 + E + F + G** first because these are the most visible issues.

---

## 7. Open questions for Gabriel, but do not block implementation

1. Should guide routes be `/guides/...` only, or should `/blog/...` also exist as an alias later?
   - Recommended now: keep `/guides/...`; add `/blog` only when importing existing blog content.
2. Which exchange-rate API source is preferred?
   - Recommended now: use a keyless public API with source/timestamp display; avoid scraping Naver.
3. Should removed tools redirect to `/tools` or 404?
   - Recommended now: 404 until they were indexed publicly; if already indexed after deployment, use redirects.

---

## 8. Final definition of done

This iteration is complete when:
- Useless tools are gone from visible UI and sitemap.
- High-priority tools feel interactive and practical, not toy-like.
- KST and KRW tools have the requested real-world behavior.
- Tool detail pages have top quick navigation.
- Guides are scalable with individual pages.
- Homepage balances information content and tools.
- `npm run lint` and `npm run build` pass.
- Production QA shows no console errors and no mobile overflow.
