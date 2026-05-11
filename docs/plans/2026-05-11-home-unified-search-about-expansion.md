# Home Unified Search and About Expansion Implementation Plan

> **For Claude Code:** Implement this plan in the verified `agency-web` repository. Follow the repo’s existing Next.js/App Router patterns and keep the change focused.

**Goal:** Add a unified homepage search surface that searches both public tools and published posts from the main page, and expand `/about` with stronger trust/editorial/operation content for AdSense readiness.

**Architecture:** Keep `src/app/page.tsx` as the server data loader. Pass `allTools` and `allPosts` or serializable search items into `HomeClient`. Implement the actual unified search as a small client component or a section inside `HomeClient`, using the same localized tool/post data already used by the tools catalog and posts index. Expand `AboutClient` copy and visible sections without inventing fake metrics.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, existing `useLocale`, `getToolContent`, `getPostContent`, `getAllTools`, `getAllPosts`.

---

## Acceptance Criteria

- Homepage has a visible integrated search near the hero/above first catalog section.
- Search results include both tools and posts in one UI.
- Results link to `/tools/<slug>` and `/posts/<slug>`.
- Search matches Korean and English/localized fields where available:
  - Tools: title, shortTitle, description, slug, category, examples.
  - Posts: title, description, slug, category, kind, tags, related tool slugs.
- Empty query shows useful suggested results or a concise “try searching” state, not a broken blank panel.
- The homepage search does not replace `/tools` and `/posts` page filters; it is a front-door discovery surface.
- About page visibly expands the site story with at least these themes: operator/maintainer responsibility, mission, build process, content/tool quality standards, privacy/data handling, update policy, feedback loop, and limitations.
- About copy stays truthful: no fake traffic, user counts, rankings, unverified claims, or direct “AdSense approval” framing in public copy.
- Lint and production build pass.

## Current Repo Grounding

Verified repo:

- Path: `/Users/gabriel.k/Documents/Workspace/ohmyzhs/agency-web`
- Remote: `https://github.com/ohmyzhs/agency-web.git`
- Current branch before plan: `main...origin/main [ahead 1]`
- Relevant files:
  - `src/app/page.tsx`
  - `src/components/pages/HomeClient.tsx`
  - `src/app/about/page.tsx`
  - `src/components/pages/AboutClient.tsx`
  - `src/lib/tools.ts`
  - `src/lib/posts.ts`
  - `src/lib/post-types.ts`
  - `src/components/tools-catalog.tsx`
  - `src/components/posts/posts-index.tsx`

## Implementation Tasks

### Task 1: Re-ground and create a feature branch

**Objective:** Ensure Claude is editing the intended repo and isolate the work.

**Commands:**

```bash
pwd
git rev-parse --show-toplevel
git status --short --branch
git remote -v
```

Expected: root is `/Users/gabriel.k/Documents/Workspace/ohmyzhs/agency-web`, remote is `ohmyzhs/agency-web`.

If still on `main`, create a branch:

```bash
git switch -c feat/home-unified-search-about
```

If branch already exists, switch to it.

### Task 2: Add homepage search data plumbing

**Objective:** Make the homepage client receive enough data to search tools and posts.

**Files:**

- Modify: `src/app/page.tsx`
- Modify: `src/components/pages/HomeClient.tsx`

**Implementation notes:**

1. In `src/app/page.tsx`, `allTools` and `latestPosts` already exist. Also derive `allPosts = getAllPosts()` once.
2. Continue passing latest posts separately for the existing “Latest Knowledge Hub” section.
3. Add props to `HomeClient`:

```ts
type HomeClientProps = {
  latestPosts: Post[];
  allPosts: Post[];
  featuredTools: Tool[];
  allTools: Tool[];
  totalToolCount: number;
};
```

4. Pass `allPosts={allPosts}` and `allTools={allTools}`.

### Task 3: Implement the integrated homepage search UI

**Objective:** Add one unified search surface that returns both tools and posts.

**Files:**

- Prefer create: `src/components/home/UnifiedSearch.tsx`
- Modify: `src/components/pages/HomeClient.tsx`

**Component shape:**

```tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLocale } from "@/components/providers";
import { getPostContent, type Post } from "@/lib/post-types";
import { getToolContent, type Tool } from "@/lib/tools";

type UnifiedSearchProps = {
  tools: Tool[];
  posts: Post[];
};
```

**Behavior:**

- Use `useLocale()`.
- Use `query` state.
- Build normalized searchable item arrays with `useMemo`.
- Result type:

```ts
type SearchResult = {
  type: "tool" | "post";
  title: string;
  description: string;
  href: string;
  meta: string;
  haystack: string;
};
```

- For tools, include localized content plus English fallback fields.
- For posts, include localized content plus slug/category/kind/tags/related tools.
- When query is empty, show a curated list: first 4 high-priority tools and first 3 latest posts.
- When query exists, filter by `haystack.includes(normalizedQuery)` and cap total results to 8 or 10.
- Add quick links/buttons to `/tools` and `/posts`.

**Suggested Korean copy:**

- Eyebrow: `UNIFIED SEARCH`
- Title: `필요한 도구와 글을 한 번에 찾기`
- Lead: `도구 페이지와 글 아카이브를 따로 열지 않아도, 홈페이지에서 바로 검색할 수 있습니다.`
- Placeholder: `예: 평수, PDF, JSON, 타자연습, 회고`
- Type badges: `도구`, `글`
- Empty: `검색 결과가 없습니다. 다른 키워드로 시도해 보세요.`

**Suggested English copy:**

- Eyebrow: `UNIFIED SEARCH`
- Title: `Find tools and posts from one place`
- Lead: `Search the public tool library and writing archive directly from the homepage.`
- Placeholder: `Try: PDF, JSON, pyeong, typing, retrospective`
- Badges: `Tool`, `Post`

**Placement:**

Insert this section after the hero section and before the existing featured tools section in `HomeClient`. Keep it visually compact enough that the useful content appears early.

### Task 4: Expand About copy and sections

**Objective:** Strengthen the About page as a trust page, not just a brand statement.

**Files:**

- Modify: `src/components/pages/AboutClient.tsx`
- Optional modify: `src/app/about/page.tsx` metadata description if the visible copy changes substantially.

**Required content additions:**

Add to the `aboutCopy` data and render visibly:

1. Maintainer / responsibility block
   - Explain that ZHS is operated as a human-directed, AI-assisted web studio.
   - Make clear final responsibility stays with the studio/maintainer.
   - Do not expose private personal details.

2. Editorial and tool quality standards block
   - Calculations and converters must disclose assumptions.
   - Browser-local processing should be stated when true.
   - Posts should be practical, source-aware, and linked to related tools where useful.
   - Tools should include examples, caveats, FAQ, and related links.

3. Update / feedback loop block
   - The site changes through issue reports, tool requests, QA checks, and small corrections.
   - Link to `/contact`, GitHub repo, and GitHub issues if possible.

4. Boundaries block
   - Results are references/estimates when appropriate.
   - No legal/medical/tax/financial advice.
   - Sensitive inputs should not be pasted into public browser tools even when local processing is used.

**Implementation suggestion:**

Add a new `standards` object in both `ko` and `en`, for example:

```ts
standardsTitle: "How we keep the site useful",
standardsLead: "...",
standards: [
  { title: "Maintained by a responsible operator", body: "..." },
  { title: "Explain assumptions before results", body: "..." },
  { title: "Privacy by default", body: "..." },
  { title: "Feedback becomes backlog", body: "..." },
]
```

Render it between the Studio Values and Operating Model sections or before the final CTA.

### Task 5: Validate locally

**Objective:** Catch TypeScript, lint, and build regressions.

**Commands:**

```bash
npm run lint
npm run build
```

Expected: both pass.

If build fails on unrelated existing content, inspect and fix only if caused by this change. Otherwise report the blocker clearly.

### Task 6: Smoke test the rendered pages

**Objective:** Verify UI markers exist in production HTML after build.

**Commands:**

```bash
npx next start -H 127.0.0.1 -p 3021
```

Then from another shell:

```bash
curl -L http://127.0.0.1:3021/ | grep -E "UNIFIED SEARCH|통합|도구와 글|Find tools"
curl -L http://127.0.0.1:3021/about | grep -E "quality|standards|책임|품질|피드백|Privacy"
```

Stop the server afterward.

### Task 7: Commit focused changes

**Objective:** Commit the implementation and plan together.

**Commands:**

```bash
git status --short
git diff --stat
git add docs/plans/2026-05-11-home-unified-search-about-expansion.md src/app/page.tsx src/components/pages/HomeClient.tsx src/components/pages/AboutClient.tsx src/components/home/UnifiedSearch.tsx src/app/about/page.tsx
git commit -m "feat: add homepage unified search and expand about"
```

If `src/components/home/UnifiedSearch.tsx` was not created because the implementation stayed inside `HomeClient`, omit that path.

## Non-goals

- Do not add backend search, Algolia, database indexing, or external search dependencies.
- Do not remove existing `/tools` or `/posts` filters.
- Do not add fake metrics, testimonials, or traffic claims.
- Do not mention AdSense approval directly in public page copy.
- Do not alter unrelated typing/game/tool behavior.

## Final Report Required

Report:

- Branch name and commit hash.
- Files changed.
- What homepage search matches and where it appears.
- What was added to About.
- `npm run lint` result.
- `npm run build` result.
- Any smoke test result and blocker.
