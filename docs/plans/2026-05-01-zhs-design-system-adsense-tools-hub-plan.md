# ZHS Design System + AdSense Tools Hub Implementation Plan

> **For Claude Code:** Implement this plan task-by-task. Use the design system files as source material, keep the target repo grounded, do not push, and commit focused checkpoints.

**Goal:** Apply the Claude Design ZHS design system to `oh-my-zhs.com` and finish the AdSense-oriented transition from agency/portfolio site to practical tools + knowledge hub.

**Architecture:** Keep the existing Next.js App Router structure and 17-tool registry, but replace the generic blue agency skin with the ZHS token system, monogram assets, mono-first components, and tools-first information architecture. Treat every public tool as both a usable UI and an indexable content page with explanations, examples, FAQ, related links, and trust/policy support.

**Tech Stack:** Next.js `16.2.2`, React `19.2.4`, Tailwind CSS v4 via `@theme inline`, TypeScript, local CSS variables, static routes.

---

## 0. Source of truth and scope

### Target repo
- Writable repo: `/Users/gabriel.k/Documents/Workspace/ohmyzhs/agency-web`
- Target domain: `https://ohmyzhs.com`
- Current branch: `restructure/adsense-tools-hub`
- Current baseline commit: `a6caeda feat: restructure site around practical tools hub`

### Design system source
- Read-only source directory: `/Users/gabriel.k/Documents/Workspace/ohmyzhs/Oh My Zsh Design System`
- Key files:
  - `README.md`
  - `SKILL.md`
  - `tokens.css`
  - `assets/monogram.svg`
  - `assets/monogram-mark.svg`
  - `assets/wordmark.svg`
  - `assets/favicon.svg`
  - `ui_kits/studio_site/index.html`
  - `ui_kits/tool_index/index.html`
  - `ui_kits/tool_index/ToolIndex.jsx`

### Brand direction from the design system
- Brand: `Zero Human Studio` / `ZHS`
- Site: an AI-built tools studio, not a client-service agency.
- Positioning: practical utilities, automation helpers, Korean-friendly converters, and small experiments that are useful now.
- Voice: plain technical copy, slightly strange but trustworthy.
- Visuals: one orange accent `#ff5b1f`, ink/paper neutrals, mono-first UI, Inter/Pretendard for prose, no gradients, no stock images, no fake metrics.
- Anti-patterns:
  - Do not use AI-purple/pink gradients.
  - Do not use robot/brain/sparkle icons or emoji decoration.
  - Do not claim fake users, fake revenue, fake downloads, fake satisfaction, fake delivery speed.
  - Do not keep fake agency portfolio or generic service claims.

### AdSense strategy
- Approval target shape: tools + useful explanations + trust pages.
- Avoid thin pages. Each tool page needs: working tool, method/assumptions, examples, FAQ, related tools/guides, clear privacy note when browser-local.
- Ads must not be placed near primary action buttons, inputs, copy buttons, result panels, downloads, or other high-click controls.

---

## 1. Pre-flight grounding

### Task 1: Verify repo, branch, and clean baseline

**Objective:** Ensure all edits happen in the correct repo/branch and the baseline is known.

**Files:** none

**Steps:**
1. Run:
   ```bash
   pwd
   git rev-parse --show-toplevel
   git status --short --branch
   git log --oneline -5 --decorate
   git remote -v
   ```
2. Expected:
   - top-level is `/Users/gabriel.k/Documents/Workspace/ohmyzhs/agency-web`
   - branch is `restructure/adsense-tools-hub`
   - latest commit includes `a6caeda feat: restructure site around practical tools hub`
3. If uncommitted changes exist before starting, inspect them and stop unless they are this plan file only.

### Task 2: Re-read project and Next.js rules

**Objective:** Avoid coding against outdated Next.js assumptions.

**Files:**
- Read: `AGENTS.md`
- Read: `CLAUDE.md`
- Inspect docs under `node_modules/next/dist/docs/` only if changing Next-specific APIs.

**Steps:**
1. Read `AGENTS.md` and `CLAUDE.md`.
2. Before changing App Router APIs, metadata, sitemap, route handlers, or font handling, inspect relevant local Next docs.

---

## 2. Design system integration

### Task 3: Copy ZHS brand assets into public assets

**Objective:** Make monogram/wordmark/favicon available to the Next app without depending on a sibling directory.

**Files:**
- Create/overwrite: `public/brand/monogram.svg`
- Create/overwrite: `public/brand/monogram-mark.svg`
- Create/overwrite: `public/brand/wordmark.svg`
- Create/overwrite: `public/favicon.svg`

**Steps:**
1. Copy assets from `/Users/gabriel.k/Documents/Workspace/ohmyzhs/Oh My Zsh Design System/assets/`.
2. Keep original SVGs intact unless an import path issue requires minor cleanup.
3. Do not delete existing default SVG assets yet unless unused after final QA.
4. Verify:
   ```bash
   test -f public/brand/monogram.svg
   test -f public/brand/wordmark.svg
   test -f public/favicon.svg
   ```

### Task 4: Replace global tokens with ZHS semantic tokens

**Objective:** Map ZHS tokens to the current Tailwind v4 theme variables so existing classes keep working while the visual system changes.

**Files:**
- Modify: `src/app/globals.css`

**Required changes:**
1. Import fonts or configure CSS font stacks:
   ```css
   @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap');
   ```
2. Replace current blue/purple variables with ZHS tokens from `tokens.css`:
   - `--zhs-accent: #ff5b1f`
   - `--zhs-accent-deep: #d8430b`
   - `--zhs-ink: #0e0e0f`
   - `--zhs-paper: #fafaf8`
   - warm neutral grays
   - `--bg`, `--bg-soft`, `--bg-card`, `--bg-inset`, `--fg`, `--fg-2`, `--fg-3`, `--line`, `--line-soft`
3. Map existing app names:
   ```css
   --background: var(--bg);
   --foreground: var(--fg);
   --primary: var(--zhs-accent);
   --primary-dark: var(--zhs-accent-deep);
   --muted: var(--fg-2);
   --border: var(--line);
   --card: var(--bg-card);
   --accent: var(--zhs-accent-soft);
   ```
4. Keep `html.dark` and system dark-mode behavior compatible with `ThemeToggle`. Mirror ZHS dark tokens under both `html.dark` and `html:not(.light)` in the media query.
5. Update `@theme inline` fonts:
   ```css
   --font-sans: var(--font-sans-zhs);
   --font-mono: var(--font-mono-zhs);
   ```
   Use distinct CSS variable names if needed to avoid self-reference.
6. Remove `.text-gradient` gradient behavior. Replace with flat accent:
   ```css
   .text-gradient { color: var(--zhs-accent); background: none; -webkit-text-fill-color: currentColor; }
   ```
7. Reduce hover motion from `translateY(-2px)` to ZHS style: `translateY(-1px)` or no lift.

**Verification:**
```bash
npm run lint
npm run build
```
Expected: both pass.

### Task 5: Add reusable ZHS primitives only where they reduce duplication

**Objective:** Avoid one-off visual hacks by introducing small primitives for brand lockup, buttons, cards, and section labels.

**Files:**
- Create: `src/components/zhs/monogram.tsx`
- Create: `src/components/zhs/brand-lockup.tsx`
- Create: `src/components/zhs/section-label.tsx`
- Optional create: `src/components/zhs/button-link.tsx`

**Implementation guidance:**
- `Monogram` should render the strict-path SVG inline or via `/brand/monogram.svg`.
- `BrandLockup` should display monogram + `zero human studio` and optional suffix such as `/ tools`.
- Use mono typography and no emoji decoration.
- Keep components server-compatible unless interactivity is required.

**Verification:**
```bash
npm run lint
npm run build
```

---

## 3. Branding and information architecture

### Branding director output
Use this as the governing content direction for all copy changes:

- One-line definition, Korean: `Zero Human Studio는 한국 생활 도구와 자동화 유틸리티를 조용히 쌓아가는 AI-built tools studio입니다.`
- One-line definition, English: `Zero Human Studio is an AI-built tools studio for Korea-aware utilities, automation helpers, and small tools that quietly work.`
- Main promise: `Paste in. Convert. Validate. Move on.` / `넣고, 변환하고, 확인하고, 다음 일로.`
- Replace client-service framing with public utility framing.
- `services` becomes `guides` or `resources`, not consulting sales.
- `work` becomes `experiments` or is removed from primary navigation until it has real, public, verifiable experiments.
- `contact` remains, but is for corrections, tool requests, and site issues — not project acquisition.
- `about` explains what the studio is, how the tools are built, what is local/browser-only, what is experimental, and that fake metrics are intentionally absent.

### Task 6: Update navigation IA

**Objective:** Make the site read as a tools hub from the first click.

**Files:**
- Modify: `src/lib/i18n.ts`
- Modify: `src/components/header.tsx`
- Modify: `src/components/footer.tsx`

**Target primary nav:**
- Home
- Tools
- Guides or Resources
- About
- Contact

**Handling current routes:**
- Prefer converting `/services` content into a guide/resource page in this iteration if low-risk.
- Remove `/work` from primary nav/footer unless it is converted into `/experiments` with real public experiments.
- Do not link to `https://lotionz.tistory.com` as the primary blog unless the user explicitly wants it. It is outside the target AdSense site and weakens site coherence.

**Korean labels:**
- 홈
- 도구
- 가이드 or 자료
- 소개
- 연락
- CTA: `도구 요청하기` or `오류 제보`

**English labels:**
- Home
- Tools
- Guides or Resources
- About
- Contact
- CTA: `Suggest a tool` or `Report an issue`

**Verification:**
- Header/footer do not show `서비스`, `포트폴리오`, `블로그` as primary site promises unless the linked page has been rewritten to match tools-first positioning.
- No fake agency/project CTA remains.

### Task 7: Rework home page to match ZHS design and tools-first positioning

**Objective:** Replace generic agency home with a concise, credible tools hub landing page.

**Files:**
- Modify: `src/app/page.tsx`
- Modify if needed: `src/lib/i18n.ts`

**Required content structure:**
1. Hero:
   - Eyebrow: `est. 2025 · seoul / global` or Korean equivalent.
   - Korean headline: `조용히 작동하는 작은 도구들.`
   - English headline: `Small tools that quietly work.`
   - Korean lead: `평 변환, KST 시간, 원화 계산, JSON 검증, LLM 비용 계산까지. 바로 쓰고, 근거를 확인하고, 다음 일로 넘어갑니다.`
   - English lead: `Pyeong conversion, KST time, KRW estimates, JSON validation, LLM cost planning. Use the tool, check the assumptions, move on.`
   - Primary CTA: Tools.
   - Secondary CTA: Guides/How tools work/About.
2. Tool catalog preview:
   - Show actual total count from `getAllTools().length`, not only Tier 1 count.
   - Make category cards link to `/tools` with query/filter only if implemented; otherwise simple `/tools` links.
   - Replace emoji icons with text labels or ZHS-style simple glyphs.
3. Trust section:
   - Explain browser-local where applicable.
   - Explain estimates/assumptions.
   - State that metrics are real or absent.
4. Final CTA:
   - `Open the tools` / `도구 열기`
   - Avoid “next project, together?” wording.

**Remove:**
- `text-gradient` as visual gradient.
- emoji category icons.
- “AI 에이전트 팀이 당신의 아이디어를 현실로” style sales copy.

### Task 8: Rewrite About as trust/about page, not agency manifesto

**Objective:** Use About to support AdSense trust and user confidence.

**Files:**
- Modify: `src/app/about/page.tsx`
- Modify: `src/lib/i18n.ts`

**Required content:**
- What ZHS is: AI-built tools studio.
- What it publishes: practical tools, automation helpers, experiments, explanatory guides.
- What it does not claim: no fake usage metrics, no fake team bios, no guaranteed financial/legal/medical advice.
- How tools handle data: many run in browser; if data leaves browser, say so on the page.
- Editorial/build principles: clear assumptions, examples, local context for Korea-aware tools.
- Contact route for corrections/tool requests.

**Remove:**
- Fake team roster with invented people.
- Fake stats such as satisfaction, delivery time, response time unless verified.
- “AI is CEO/CMO/PM” as literal team structure.

### Task 9: Convert Services to Guides/Resources or de-emphasize it

**Objective:** Eliminate service-agency sales positioning.

**Files:**
- Modify: `src/app/services/page.tsx` or create a replacement route if using `/guides`
- Modify: `src/lib/i18n.ts`
- Modify: `src/app/sitemap.ts` if routes change

**Recommended low-risk approach:**
- Keep `/services` for now only if route churn is risky, but rewrite the page title to `Guides` / `가이드` and copy to explain site resources.
- Better approach: create `/guides` and leave `/services` as a minimal redirect only if Next route handling is straightforward in this version.

**Guide page MVP content:**
- “How these tools work”
- “Korea-aware conversions”
- “Automation and developer utilities”
- “Assumptions and caveats”
- Link to relevant tools.

**Remove:**
- App/game/Roblox/consulting service cards.
- Project quote funnel.

### Task 10: Convert Work to Experiments or remove from nav

**Objective:** Remove fake portfolio risk.

**Files:**
- Modify: `src/app/work/page.tsx` if keeping route
- Modify: `src/lib/i18n.ts`
- Modify nav/footer to avoid linking it as primary unless rewritten.

**If keeping route:**
- Title: `Experiments` / `실험실`
- Show only public, verifiable experiments/tools. If none are ready, page should say experiments will appear when they are useful and link back to `/tools`.
- No fake download/revenue/retention/user claims.

**If not keeping route:**
- Remove links from nav/footer.
- Keep page buildable if route remains in filesystem.

### Task 11: Reframe Contact

**Objective:** Make contact a trust/support surface, not an agency lead form.

**Files:**
- Modify: `src/app/contact/page.tsx`
- Modify: `src/lib/i18n.ts`

**Target uses:**
- report an error
- suggest a tool
- request correction
- privacy/policy inquiry

**Remove:**
- “project type” service dropdown unless it is repurposed to issue/tool-request category.
- “AI team responds in 24h” unless that SLA is real.

---

## 4. Tools i18n and content depth

### Task 12: Add localized tool metadata structure

**Objective:** Fix the major QA issue where Korean locale shows English tool catalog/detail copy.

**Files:**
- Modify: `src/lib/tools.ts`
- Modify: `src/app/tools/page.tsx`
- Modify: `src/app/tools/[slug]/page.tsx`
- Modify if needed: `src/components/tool-card.tsx`
- Modify if needed: `src/components/tool-page-shell.tsx`

**Recommended data model:**
Keep current English fields as canonical and add Korean optional fields, or introduce a `localized` object.

Example minimal pattern:
```ts
export type LocalizedToolContent = {
  title: string;
  shortTitle: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  inputs: ToolField[];
  outputs: ToolField[];
  examples: ToolExample[];
  explanation: string[];
  faqs: { question: string; answer: string }[];
};

export type Tool = LocalizedToolContent & {
  slug: string;
  category: ToolCategory;
  tier: ToolTier;
  ko?: LocalizedToolContent;
  relatedToolSlugs: string[];
};

export function getToolContent(tool: Tool, locale: Locale): LocalizedToolContent {
  return locale === "ko" && tool.ko ? tool.ko : tool;
}
```

**Rules:**
- Korean locale should display Korean titles/descriptions/labels/examples/FAQ for at least Tier 1 tools in this pass.
- English locale should remain coherent.
- SEO metadata should use locale-aware content only if the current routing actually supports locale-specific URLs. If not, keep static metadata conservative.

### Task 13: Localize shared tool page UI strings

**Objective:** Translate page chrome around tool details.

**Files:**
- Modify: `src/app/tools/page.tsx`
- Modify: `src/app/tools/[slug]/page.tsx`
- Modify: `src/components/tool-page-shell.tsx`
- Modify: `src/components/tool-card.tsx`

**Strings to localize:**
- `Useful calculators and utilities for everyday work.`
- `Korea-friendly practical tools`
- `Open tool →`
- `Examples`
- `How to use this result`
- `Common questions`
- `Related tools`
- category/tier labels
- `+N more`
- any empty/error states

**Korean examples:**
- `실용 계산기와 작업 유틸리티.`
- `한국 생활 도구`
- `도구 열기 →`
- `예시`
- `결과를 읽는 법`
- `자주 묻는 질문`
- `관련 도구`
- `외 N개 더`

### Task 14: Enrich Tier 1 Korea-aware tools

**Objective:** Make the strongest pages less thin and more locally useful for AdSense and search.

**Files:**
- Modify: `src/lib/tools.ts`
- Modify individual components only if tool UI needs validation/caveat improvements.

**Tier 1 pages to enrich:**
1. `pyeong-converter`
   - Korean title: `평수 변환기`
   - Add examples: `59㎡`, `84㎡`, `114㎡`, `24평`, `34평`.
   - Explain 전용면적/공급면적/계약면적 caveat.
   - Explain why `84㎡` is commonly spoken as `34평` in apartment marketing contexts.
   - Add contract/legal disclaimer: official documents win.
2. `kst-timezone-converter`
   - Explain KST is UTC+9 and no daylight saving.
   - Add examples for US Pacific/Eastern, London, Tokyo, UTC, product launch windows.
3. `korean-shoe-size-converter`
   - Explain Korean millimeter sizes and brand variance.
   - Add men/women/kids caution if supported by UI.
4. `krw-currency-calculator`
   - Explain manual rate, spread, card fees, bank rates, not live quote.
5. `cooking-measurement-converter`
   - Explain volume vs weight, ingredient density, Korean recipe spoon/cup ambiguity.
6. `unit-converter`
   - Explain common formulas and why specialized local converters remain separate.

**Acceptance:**
- Each Tier 1 page has at least 2 examples, 2 explanation paragraphs, and 2 FAQ entries in Korean.
- No advice claims beyond calculator/estimate scope.

### Task 15: Improve validation and privacy notes in tool UIs

**Objective:** Make tools feel complete and safe.

**Files:**
- Modify selected files under `src/components/tools/*.tsx`
- Modify: `src/components/tool-page-shell.tsx` if adding a generic privacy/caveat note

**Known issue:**
- `PyeongConverter` invalid input `abc` currently has weak feedback.

**Actions:**
- Add clear validation messages for invalid input in Pyeong and any obvious Tier 1 calculators.
- Add a small note on local/browser-only behavior for text/config tools such as JSON/YAML validator and webhook formatter.
- Do not put privacy notes inside result action/copy button zones.

---

## 5. Trust and policy pages

### Task 16: Rewrite Privacy Policy for web tools hub

**Objective:** Current privacy page is app-listing oriented. Make it fit `ohmyzhs.com` web tools.

**Files:**
- Modify: `src/app/privacy/page.tsx`

**Required sections:**
- What the site is.
- Browser-local tools: inputs are processed locally when true.
- Contact form data: what is collected and why.
- Analytics/hosting logs if applicable; phrase conservatively if unknown.
- Cookies/local storage/theme/locale preferences if used.
- Third-party links.
- Children’s privacy.
- Contact email.
- Last updated date.

### Task 17: Add Terms and Disclaimer

**Objective:** Complete basic trust pages for AdSense readiness.

**Files:**
- Create: `src/app/terms/page.tsx`
- Create: `src/app/disclaimer/page.tsx`
- Modify: `src/components/footer.tsx`
- Modify: `src/app/sitemap.ts`

**Terms content:**
- Use of tools as-is.
- No misuse, scraping abuse, illegal use.
- Estimates and calculations are informational.
- Intellectual property/site content.
- Contact.

**Disclaimer content:**
- Tools provide estimates/information, not legal/financial/medical/professional advice.
- Currency, area, size, cost, and ROI calculations need independent verification.
- Official documents or provider invoices override site estimates.

**Footer links:**
- Privacy Policy / 개인정보처리방침
- Terms / 이용약관
- Disclaimer / 면책 고지
- Contact / 연락

### Task 18: Sitemap and robots verification

**Objective:** Ensure all important trust/tool pages are crawlable.

**Files:**
- Modify: `src/app/sitemap.ts` if needed
- Check: `src/app/robots.ts` or route equivalent

**Verify:**
```bash
npm run build
npx next start -H 127.0.0.1 -p 3008
curl -s http://127.0.0.1:3008/sitemap.xml | head -120
curl -s http://127.0.0.1:3008/robots.txt
```
Expected:
- `/tools` and all tool URLs exist.
- `/privacy`, `/terms`, `/disclaimer`, `/about`, `/contact` exist.
- robots allows crawling and points to `https://ohmyzhs.com/sitemap.xml`.

Stop the server after verification.

---

## 6. Visual QA and mobile QA

### Task 19: Production build validation

**Objective:** Catch compile/lint/static rendering issues.

**Commands:**
```bash
npm run lint
npm run build
```
Expected: both pass.

### Task 20: Production local server QA

**Objective:** Review the actual built site, not dev-only behavior.

**Commands:**
```bash
npm run build
npx next start -H 127.0.0.1 -p 3008
```

**Pages to check:**
- `/`
- `/tools`
- `/tools/pyeong-converter`
- `/tools/json-yaml-validator`
- `/tools/llm-cost-calculator`
- `/about`
- `/contact`
- `/privacy`
- `/terms`
- `/disclaimer`

**Acceptance:**
- No browser console errors.
- No blue/purple gradient or generic agency aesthetic remains.
- Header/footer match tools-first IA.
- Korean locale does not show English body chrome on tools pages, except intentional tool names or technical terms.
- Mobile width: header menu usable, cards stack, inputs do not overflow, buttons have enough touch area.
- Tool action buttons/results are not surrounded by ad placeholders.

### Task 21: Final git commit

**Objective:** Leave a reviewable commit and no untracked accidental files.

**Steps:**
1. Inspect:
   ```bash
   git status --short
   git diff --stat
   ```
2. Exclude `.next`, logs, temp files, and generated caches.
3. Commit:
   ```bash
   git add src public docs/plans package.json package-lock.json pnpm-lock.yaml
   git commit -m "feat: apply zhs design system to tools hub"
   ```
   Adjust staged paths based on actual changed files. Do not force-add missing files.
4. Do not push.

**Final report required:**
- Branch
- Commit hash
- Files changed summary
- Design system assets applied
- Branding/IA changes
- Tool localization/content changes
- Policy/trust pages added or changed
- `npm run lint` result
- `npm run build` result
- Local QA notes and unresolved issues

---

## 7. Non-goals for this pass

- Do not implement AdSense ad units yet.
- Do not push to remote.
- Do not migrate `blog` repo or `auto-ops.lotiony.com` content.
- Do not create fake guide archives with thin placeholder posts.
- Do not invent user counts, revenue, downloads, testimonials, or case studies.
- Do not redesign the calculators so heavily that working functionality regresses.

---

## 8. Quick implementation checklist

- [ ] Correct repo/branch verified.
- [ ] ZHS assets copied to `public/brand` and favicon updated.
- [ ] Global CSS maps ZHS tokens to Tailwind theme variables.
- [ ] Header/footer use monogram/brand lockup and tools-first IA.
- [ ] Home page rewritten with ZHS voice and actual tool count.
- [ ] Services/work agency content removed, converted, or de-emphasized.
- [ ] About/contact reframed for trust/support/tool requests.
- [ ] Korean tool catalog/detail chrome localized.
- [ ] Tier 1 tool metadata enriched in Korean.
- [ ] Privacy rewritten for web tools hub.
- [ ] Terms and Disclaimer added and linked.
- [ ] Sitemap includes important pages.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Production local QA completed.
- [ ] Focused commit created; no push.
