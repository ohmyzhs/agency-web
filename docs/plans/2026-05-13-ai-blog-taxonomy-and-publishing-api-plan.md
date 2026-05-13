# agency-web AI-operated blog taxonomy and publishing API plan

Updated: 2026-05-13
Status: design-ready
Target repo: `/Users/gabriel.k/Documents/Workspace/ohmyzhs/agency-web`
Canonical public host: `https://oh-my-zhs.com`

## 1. Decision summary

agency-web should become a blog-style knowledge hub plus practical tools site, not a generic agency portfolio and not a loose archive of site notes.

Public readers should see five clear blog categories:

1. AI 인사이트
2. 실용 가이드
3. 비교·추천
4. 업무 생산성
5. 디지털 트렌드

Existing internal categories/kinds should not remain as equally visible public categories. They should be mapped into the five public categories or treated as internal content types/tags.

Publishing should stay Markdown-first for now, but the current draft `POST /api/posts/publish` design must be changed before implementation. A runtime API that writes directly to `content/posts/*.md` is acceptable only for local development or a self-hosted server. On Vercel/static deploys, it will not reliably persist or redeploy content.

Recommended publishing path:

- AI generation pipeline creates a validated Markdown artifact.
- The artifact is committed to the GitHub repo under `content/posts/<public-category>/<slug>.md`.
- Git push triggers normal deployment.
- The public site renders only `status: published` posts.

## 2. Public taxonomy

### 2.1 Public categories

Use these as reader-facing categories and URL/filter labels.

#### `ai-insight` — AI 인사이트
Purpose:
- AI model/tool/company updates
- AI news explainers
- AI adoption, AI search, AI agents, AI risks/regulation

Good post patterns:
- “이번 변화가 실무에 미치는 영향”
- “새 AI 도구가 기존 방식과 다른 점”
- “AI 검색/에이전트 흐름 정리”

Avoid:
- Thin translated news rewrites
- Unverified rumors
- Formulaic “왜 지금 중요한가” sections repeated in every post

#### `practical-guide` — 실용 가이드
Purpose:
- How-to, setup, checklist, usage guide, step-by-step explanation
- Tool-adjacent guides
- General practical information that is low policy-risk

Good post patterns:
- “사용법”
- “체크리스트”
- “실수 방지”
- “입문자 순서”

#### `comparison-recommendation` — 비교·추천
Purpose:
- Tool/app/service/product comparison
- Selection criteria
- Recommendation lists

Good post patterns:
- “A와 B 차이”
- “상황별 추천”
- “선택 기준”
- “무료/유료 비교”

Rules:
- Make criteria explicit.
- Do not invent hands-on experience.
- If not actually tested, label as desk research / feature comparison.

#### `work-productivity` — 업무 생산성
Purpose:
- Workflow, automation, documents, meetings, collaboration, operations
- Non-AI and AI-assisted work practices

Good post patterns:
- “반복 업무 줄이기”
- “회의/보고/문서화 개선”
- “작은 팀 운영 방식”
- “자동화 설계”

#### `digital-trends` — 디지털 트렌드
Purpose:
- Broader digital/web/platform/search/content/marketing trends
- IT news that is not strictly AI
- Search, SEO, web publishing, privacy, creator tools

Good post patterns:
- “검색 환경 변화”
- “웹/플랫폼 정책 변화”
- “콘텐츠 운영 변화”

### 2.2 Internal post kinds

Keep `kind` separate from public category.

Recommended internal `kind` values:

- `guide`: durable how-to or tool guide
- `news-explainer`: current event explained with sources
- `comparison`: comparison/recommendation article
- `workflow`: work/productivity/process article
- `trend-note`: broader digital trend note
- `retrospective`: site/build/product retrospective
- `experiment`: lab/experiment note
- `site-note`: operational update

Public UI should not expose all kinds as top-level categories. Kinds can power badges and filters.

### 2.3 Existing category migration map

Current/legacy frontmatter category values should map as follows:

- `ai` -> `ai-insight`
- `it-news` -> `digital-trends`
- `automation` -> `work-productivity`
- `developer` -> usually `work-productivity` or `practical-guide`, depending on article intent
- `korea-living` -> `practical-guide` unless the site later intentionally opens a Korea living vertical
- `culture` -> no longer a main category; either `digital-trends` if digital-culture related, or archive
- `daily` -> not a main category; convert to `site-note`/`retrospective` or archive
- `experiments` -> not a main category; expose under Labs/Experiments only
- `site-notes` -> not a main category; expose under Updates/Site Notes only

## 3. Public URL and navigation structure

### 3.1 Canonical routes

Keep:

- `/posts`
- `/posts/[slug]`
- `/tools`
- `/tools/[slug]`

Add a lightweight release/update surface for product changes:

- `/updates` — public update archive for site 기능추가, 개선, 운영 공지, 릴리즈 노티스
- `/updates/[slug]` — optional later if update notes need standalone detail pages

Do not use GitHub Releases as the only release note surface. GitHub Releases are useful for developers and changelog provenance, but most site visitors will not browse GitHub. The public site should have a concise Updates/Release Notes archive that can link back to GitHub commits/releases when useful.

Add or refine filtered category URLs through query params or route aliases:

- `/posts?category=ai-insight`
- `/posts?category=practical-guide`
- `/posts?category=comparison-recommendation`
- `/posts?category=work-productivity`
- `/posts?category=digital-trends`

Optional later, if SEO category landing pages become useful:

- `/posts/category/ai-insight`
- `/posts/category/practical-guide`
- `/posts/category/comparison-recommendation`
- `/posts/category/work-productivity`
- `/posts/category/digital-trends`

For now, query-filtered `/posts` is enough unless category landing pages need custom intro copy and static sitemap entries.

### 3.2 Top nav

Recommended top-level nav:

- Home
- Posts
- Tools
- Typing
- Updates
- About
- Contact

If the header becomes crowded on mobile, put Updates under Posts or footer first. For desktop, Updates can be a small nav item because it builds product trust and gives repeat visitors a reason to check what changed.

No top-level `Guides` item. Guides are a post kind/filter and can be linked from tools.

### 3.3 Posts index UX

The `/posts` page should feel like a real blog archive:

- Search box
- Category chips for the five public categories
- Content-type chips: All, Guides, News/Explainers, Comparisons, Workflows, Trends, Retrospectives/Labs
- Sort: newest, updated, reading time
- Featured/latest section
- Right-side or top quick navigation for latest posts / recommended categories
- Empty state that explains filters, not “no content”

### 3.4 Auxiliary sections

Do not mix these into the five main categories:

- Labs / Experiments
- Site Notes / Updates
- Build Retrospectives

They may appear as labels or filtered views, but not primary blog categories.

## 4. Frontmatter standard

Every published Markdown post should use a stricter schema.

```yaml
---
title: "게시글 제목"
slug: "stable-url-slug"
status: "draft" # draft | review | published | archived
locale: "ko"
authoring_mode: "ai-edited" # ai-edited | ai-curated | human-directed
category: "ai-insight" # public category
kind: "news-explainer" # internal kind
description: "검색 결과와 카드에 쓰일 120~160자 설명"
publishedAt: "2026-05-13"
updatedAt: "2026-05-13"
readingMinutes: 7
tags:
  - ai
  - search
sourceLinks:
  - label: "Source name"
    url: "https://example.com/source"
related_tools: []
quality_gate: "ready" # draft | needs-source-check | ready | published
canonical: "https://oh-my-zhs.com/posts/stable-url-slug"
---
```

Important rules:

- `category` is the public category.
- `kind` is the article format.
- `status: published` is the only state exposed publicly.
- Current/news/trend claims require `sourceLinks`.
- Comparison/recommendation posts must state criteria.
- AI-authored posts must not claim direct personal use unless the pipeline actually performed a test and saved evidence.

## 5. AI writing/editorial stance

The site should be positioned as an AI-assisted editorial system, not a fake human diary.

### Allowed voice

- Analytical
- Curated
- Practical
- Source-aware
- “AI가 정리한 관찰/해설” tone

### Avoid

- Fake first-person experience
- Fake hands-on testing
- Fake usage metrics/testimonials
- Overconfident medical/financial/legal advice
- Thin news rewrites
- Repeated formulaic headings

### Suggested disclosure style

A short About/editorial-standards section can say:

> ZHS posts are produced through an AI-assisted editorial workflow. The system prioritizes source links, practical structure, and clear limitations over personal storytelling.

Do not put a distracting AI disclaimer in every article unless policy or article type needs it.

## 6. Publishing API decision

### 6.1 Current API doc status

`docs/posts-publish-api.md` describes `POST /api/posts/publish`, but the implementation files referenced there are not currently present:

- `src/app/api/posts/publish/route.ts` is missing
- `src/lib/post-auth.ts` is missing
- the current `src/lib/posts.ts` is a read/parse loader, not a publish utility

So the current API should be treated as a draft design, not a production feature.

### 6.2 Do not implement direct filesystem publishing for production

Do not rely on a Vercel/Next API route that writes to `content/posts/*.md` at runtime.

Reason:

- Deployed serverless/runtime filesystems are not a durable publishing store.
- Even if a file is written, static pages/sitemap are not regenerated automatically.
- Runtime writes can diverge from Git, making content unreviewable and hard to roll back.
- It increases security risk without providing true CMS benefits.

### 6.3 Keep a publishing API, but change its job

Recommended API role:

`POST /api/posts/publish` should become a Git-backed post intake endpoint.

Additionally, expose the same pipeline as an external automation webhook:

- `POST /api/webhooks/content-intake` — generic webhook for trusted external AI tools such as Manus-built blog/Instagram/Threads automation apps
- `POST /api/posts/publish` — optional compatibility alias for blog-post-only intake

Both routes should call the same server-side intake service so validation, taxonomy, quality gates, dedupe, Git commits/PRs, and notifications cannot drift.

The endpoint should:

1. Authenticate with bearer token.
2. Validate payload and taxonomy.
3. Normalize title, slug, category, kind, tags, source links.
4. Render Markdown with standard frontmatter.
5. Run content quality checks.
6. Create a GitHub branch or commit to a configured branch/path using GitHub Contents API or Git data API.
7. Return slug, target path, commit SHA/PR URL, and expected public URL.
8. Optionally trigger deploy through normal Git push flow.

Recommended default mode:

- `publishMode: "draft-pr"` for review/safety
- Later allow `publishMode: "direct-main"` only after the pipeline proves stable

### 6.4 API request schema v2

```json
{
  "contentType": "post",
  "channel": "site-post",
  "sourceApp": "hermes-cron | manus-social-app | other-trusted-tool",
  "idempotencyKey": "optional stable external job/run/content id",
  "title": "required",
  "slug": "optional",
  "description": "required or auto-derived",
  "markdown": "required",
  "category": "ai-insight | practical-guide | comparison-recommendation | work-productivity | digital-trends",
  "kind": "guide | news-explainer | comparison | workflow | trend-note | retrospective | experiment | site-note | release-note",
  "tags": ["string"],
  "sourceLinks": [{ "label": "Source", "url": "https://..." }],
  "relatedTools": ["tool-slug"],
  "status": "draft | review | published",
  "publishedAt": "optional ISO/date",
  "updatedAt": "optional ISO/date",
  "publishMode": "local-draft | draft-pr | direct-main",
  "deliveryTargets": ["site"],
  "social": {
    "instagramCaption": "optional, stored for cross-channel workflow but not posted by this endpoint",
    "threadsText": "optional, stored for cross-channel workflow but not posted by this endpoint"
  }
}
```

Rules:

- For the first release, accept only `contentType: "post"` and `channel: "site-post"` unless release notes are implemented too.
- `idempotencyKey` should prevent duplicate posts from retried webhook calls.
- `sourceApp` should be stored in frontmatter or an internal audit block for traceability.
- Social payload fields may be accepted for future cross-channel workflows, but this endpoint should not auto-post to Instagram/Threads unless a separate, explicit social publishing pipeline is implemented.

### 6.5 API response v2

```json
{
  "ok": true,
  "slug": "stable-url-slug",
  "path": "content/posts/ai-insight/stable-url-slug.md",
  "publicUrl": "https://oh-my-zhs.com/posts/stable-url-slug",
  "sha256": "...",
  "git": {
    "mode": "draft-pr",
    "branch": "content/2026-05-13-stable-url-slug",
    "commitSha": "...",
    "prUrl": "https://github.com/ohmyzhs/agency-web/pull/123"
  },
  "quality": {
    "status": "passed",
    "warnings": []
  }
}
```

### 6.6 Environment variables

Recommended:

```env
POST_PUBLISH_BEARER_TOKEN=...
CONTENT_WEBHOOK_BEARER_TOKEN=...
CONTENT_WEBHOOK_HMAC_SECRET=...
GITHUB_CONTENT_TOKEN=...
POST_PUBLISH_REPO=ohmyzhs/agency-web
POST_PUBLISH_BASE_BRANCH=main
POST_PUBLISH_DEFAULT_MODE=draft-pr
POST_PUBLISH_ALLOWED_CATEGORIES=ai-insight,practical-guide,comparison-recommendation,work-productivity,digital-trends
```

Authentication recommendation:

- Support Bearer token for simple trusted tools.
- Add optional HMAC signature verification for external apps that can sign requests, e.g. `X-ZHS-Signature: sha256=<hex>` over the raw request body.
- Require `idempotencyKey` for automation apps that may retry.
- Rate-limit by token/source app where possible.
- Never log token values or raw payloads that may include unpublished drafts or social captions.

Do not log token values.

### 6.7 Local-only fallback

A local script is still useful:

- `scripts/create_post.py` or `scripts/publish_post_local.py`
- Writes to repo filesystem during local agent sessions
- Runs quality checks
- Leaves Git commit/push to the agent or CI

This is safer than exposing a production route that writes local files.

## 7. Content directory structure

Recommended future structure:

```text
content/posts/
  ai-insight/
  practical-guide/
  comparison-recommendation/
  work-productivity/
  digital-trends/
  labs/
  site-notes/
```

Current numeric folders can be migrated gradually:

- `01-guides` -> mostly `practical-guide`
- `02-it-news` -> `digital-trends` or `ai-insight`
- `03-daily` -> `site-notes` or `work-productivity` depending on content
- `04-experiments` -> `labs` or `site-notes`

The loader already walks recursively, so folder migration should not break routes if slugs remain stable.

## 8. Implementation phases

### Phase 1 — taxonomy/UI normalization

- Extend `PostCategory` and labels to the five public categories.
- Keep backward compatibility for legacy category values through a normalization helper.
- Update post cards/index filters to show public categories first.
- Reduce or hide raw legacy categories from the public UI.
- Update `/posts` lead copy to describe a blog/knowledge hub, not only tool guides and build notes.

### Phase 2 — content migration

- Add normalized category to existing published posts.
- Keep slugs stable.
- Move files into new folders only after frontmatter is normalized.
- Consolidate typing retrospective fragments into one canonical article.
- Archive or de-emphasize old fragments.

### Phase 3 — publishing pipeline v1

- Implement local post creation script or Git-backed API.
- Add schema validation.
- Add quality checks:
  - required frontmatter
  - category/kind allowlist
  - body length minimum
  - sourceLinks required for news/trend/comparison claims
  - no fake experience phrases
  - no direct medical/financial/legal claims without disclaimer
- Return artifact path/hash.

### Phase 4 — Git-backed publish API and external content webhook

- Replace draft direct-filesystem API design with GitHub commit/PR API.
- Implement one shared `content-intake` service used by:
  - `POST /api/webhooks/content-intake`
  - `POST /api/posts/publish` compatibility route
- Keep local file-write only in development mode.
- Add authentication: bearer token plus optional HMAC signature.
- Add idempotency handling to prevent duplicate posts from retries.
- Add tests for auth, validation, taxonomy, Markdown rendering, idempotency, and GitHub body generation.

### Phase 4a — Updates / release notes surface

- Add `/updates` as a lightweight public archive.
- Use `kind: release-note` or a separate `content/updates` collection depending on implementation simplicity.
- Update notes should be shorter than blog posts and focused on user-visible changes:
  - new tools/features
  - important fixes
  - content/policy/navigation changes
  - known limitations
- Link to GitHub commits/releases when useful, but write the public note in visitor-friendly language.
- Keep GitHub Releases optional for developer/provenance use, not the only public changelog.

### Phase 5 — automation

- Scheduled AI topic discovery.
- AI draft generation.
- Source extraction and source-link verification.
- Quality gate.
- Commit/PR or direct publish depending on confidence.
- Low-noise Telegram notification with title, category, URL/PR, warnings.

## 9. Acceptance criteria

The structure is ready when:

- `/posts` exposes the five public categories.
- Existing posts are mapped or normalized without broken slugs.
- `/guides` remains redirected or filtered into `/posts`, not a competing namespace.
- Markdown loader still filters `status: published` only.
- Sitemap includes only published posts.
- Publishing API design no longer implies durable runtime filesystem writes on production.
- New AI-generated posts can be created with stable frontmatter and quality checks.
- `pnpm lint && pnpm build` passes after implementation.

## 10. Final recommendation

Use the five public categories now, but treat them as a reader-facing taxonomy, not just more labels added to the existing list. Keep Markdown publishing. Change the post publishing API from “write a file on the deployed server” to “validate and create a Git-backed Markdown artifact.” This preserves the simplicity of Markdown while making automated AI posting operationally safe and deployable.
