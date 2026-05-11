# oh-my-zhs.com AdSense approval content and IA work plan

Updated: 2026-05-11

## Current decision

The work is split into two synchronized tracks:

1. **Site structure / discovery development**
   - Keep `/tools` as the functional tool hub.
   - Keep `/posts` as the blog-style reading hub.
   - Remove the need for a top-level "Guides" mental model: tool usage articles should be surfaced as `Tool Guides` inside Posts and linked from tool pages.
   - Improve post discovery with search, type filters, category filters, related-tool filters, and sorting.

2. **Post rewriting / editorial work**
   - Rewrite ambiguous guide posts into practical tool-detail guides.
   - Consolidate typing-related improvements into one stronger retrospective instead of several fragmented posts.
   - Add new tool-detail guide topics for currently uncovered but useful tools.

## Existing posts to convert into tool-detail guides

These are already published, but should be edited from general essay style into practical "when/how/options/examples" guide style.

1. `content/posts/01-guides/schedule-to-cron-expression.md`
   - Current slug: `cron-expression-from-schedule`
   - Related tool: `cron-explainer`
   - Rewrite as: **Cron Explainer 사용법: 반복 작업 스케줄을 안전하게 확인하는 법**
   - Must cover: common cron patterns, time zone/KST vs UTC, next-run verification, weekday/month edge cases, copy checklist.

2. `content/posts/01-guides/json-yaml-xml-formatting-validation.md`
   - Current slug: `json-yaml-xml-formatting`
   - Related tools: `json-yaml-validator`, `webhook-payload-formatter`
   - Rewrite as: **JSON/YAML/XML Validator 사용법: 검증·정렬·압축을 헷갈리지 않는 법**
   - Must cover: validate vs beautify vs minify, format selection, error reading, safe copy workflow, browser-local note.

3. `content/posts/01-guides/kst-dst-global-meeting.md`
   - Current slug: `kst-global-meeting-time`
   - Related tool: `kst-timezone-converter`
   - Rewrite as: **KST Timezone Converter 사용법: 해외 회의 시간과 DST 확인하기**
   - Must cover: KST/UTC/local wall-clock distinction, DST, meeting examples, calendar copy flow.

4. `content/posts/01-guides/krw-exchange-rate-card-fee.md`
   - Current slug: `krw-exchange-rate-calculator`
   - Related tool: `krw-currency-calculator`
   - Rewrite as: **KRW Currency Calculator 사용법: 환율·카드 수수료·해외결제 금액 읽기**
   - Must cover: input exchange rate, fee/spread assumptions, card bill differences, travel/shopping examples, disclaimer.

5. `content/posts/01-guides/59-75-84-99-apartment-area.md`
   - Current slug: `pyeong-to-square-meter-korea-apartment`
   - Related tool: `pyeong-converter`
   - Rewrite as: **평수 변환기 사용법: 59㎡·84㎡ 아파트 면적을 제대로 읽는 법**
   - Must cover: 1평 ratio, exclusive/supply/contract area, common apartment examples, contract caution.

6. `content/posts/01-guides/browser-local-tools-privacy.md`
   - Current slug: `browser-local-tools-privacy`
   - Related tools: broad local-first tools
   - Rewrite as: **브라우저 로컬 도구 안내: 어떤 데이터가 서버로 가지 않는지 확인하는 법**
   - Must cover: local processing meaning, file/text examples, analytics/logging caveat, what not to paste, related local tools.

## Draft / ambiguous posts to retire or reshape

1. `content/posts/02-it-news/automation-small-tools-stack.md`
   - Current status: draft
   - Recommendation: do not publish as broad trend/news. Split into tool guides for `cron-explainer`, `utm-builder`, `timestamp-converter`, `webhook-request-simulator` if needed.

2. `content/posts/02-it-news/ai-agent-coding-tools-trend.md`
   - Current status: draft
   - Recommendation: not a priority for AdSense approval unless rewritten as a concrete site-building retrospective or a developer-tool workflow guide.

3. Typing experiment posts
   - Existing published fragments:
     - `typing-practice-upgrade-retrospective.md`
     - `typing-practice-keyboard-guide-retrospective.md`
     - `typing-practice-layer-retrospective.md`
   - Recommendation: consolidate into one canonical retrospective and either mark older fragments as historical/supporting notes or link them from the canonical article.

## Newly discovered tool-detail guide candidates

Prioritize practical guides that can link directly from tool pages and answer "when should I use this, what do the options mean, what result should I trust?"

### High priority

1. `webhook-request-simulator`
   - Title: **웹훅 요청 시뮬레이터 사용법: 배포 전 POST 요청을 안전하게 테스트하기**
   - Why: developer intent is clear, tool-specific, useful for debugging.

2. `pdf-toolkit`
   - Title: **PDF 도구 모음 사용법: 병합·분할·이미지 변환을 한 번에 처리하는 순서**
   - Why: many options; guide reduces confusion and improves long-tail SEO.

3. `og-image-generator`
   - Title: **OG 이미지 생성기 사용법: 블로그와 SNS 썸네일을 1200×630으로 만드는 법**
   - Why: directly supports blog publishing workflow and internal content operations.

4. `image-format-converter`
   - Title: **이미지 포맷 컨버터 사용법: PNG·JPG·WebP·AVIF를 언제 선택할까**
   - Why: frequent practical search intent; options need explanation.

5. `icon-favicon-generator`
   - Title: **파비콘 생성기 사용법: favicon, Apple touch icon, PWA 아이콘 세트 만들기**
   - Why: concrete webmaster problem; strong internal linking with OG/image tools.

6. `timestamp-converter`
   - Title: **타임스탬프 변환기 사용법: 로그 시간과 UTC/KST를 빠르게 맞추는 법**
   - Why: strong developer utility; pairs with cron/timezone posts.

### Medium priority

7. `developer-text-toolkit`
   - Title: **개발자 텍스트 도구 모음 사용법: Base64·URL·JWT·해시·정규식을 한 곳에서 확인하기**

8. `webhook-payload-formatter`
   - Title: **웹훅 Payload Formatter 사용법: JSON 본문과 헤더를 읽기 좋게 정리하기**

9. `slug-generator`
   - Title: **슬러그 생성기 사용법: 글 제목을 SEO 친화 URL로 바꾸는 법**

10. `utm-builder`
    - Title: **UTM Builder 사용법: 캠페인 링크를 실수 없이 만드는 법**

11. `color-contrast-checker`
    - Title: **색 대비 체크 도구 사용법: 버튼과 본문 글자가 읽히는지 확인하기**

12. `qr-barcode-generator`
    - Title: **QR/Barcode 생성기 사용법: Wi-Fi, 링크, vCard QR을 만들고 검증하는 법**

### Later / cluster guides

13. `life-calculator-suite`
14. `unit-converter`
15. `cooking-measurement-converter`
16. `korean-shoe-size-converter`
17. `image-to-ascii-art`
18. `markdown-table-generator`
19. `text-case-converter`
20. `two-factor-code-generator` — useful but sensitive; publish only with a strong security disclaimer.

## Posts / category page redesign draft

### Top navigation

Recommended top-level nav:

- Home
- Typing
- Posts
- Tools
- About
- Contact

No separate top-level Guides menu. `Guides` becomes a post type/filter label, not a navigation destination.

### Posts page IA

Posts should be a blog-style discovery page with:

- Search box for title, description, tags, category, and related tool slugs.
- Type filter chips:
  - All
  - Tool Guides
  - Retrospectives
  - Experiments
  - News / Notes
- Category filter chips:
  - All categories
  - Korea living
  - Automation
  - Developer
  - AI
  - Daily
  - Experiments
  - Site notes
- Related tool filter dropdown/list when posts have `relatedToolSlugs`.
- Sort options:
  - Newest
  - Oldest
  - Reading time
- Featured section at top:
  - tool guides first, then site notes/retrospectives.
- Result count and empty-state copy.

### Post card metadata

Cards should show:

- Post type label, not raw internal kind.
- Category label.
- Date.
- Reading time.
- Related tool chips when present.
- Tags when space allows.

### Tool page linking

Each tool page should eventually show:

- "Detailed guide" links to posts whose frontmatter `related_tools` includes that tool slug.
- This makes tool pages not only functional workspaces but also entry points to practical explanations.

## Development tasks

1. Extend post taxonomy to include a `tool-guide` display label while preserving existing frontmatter compatibility.
2. Replace the current Posts index with a client-side searchable/filterable/sortable blog index.
3. Normalize category label handling, including currently used `site-notes` frontmatter.
4. Show related tool chips on post cards/index rows.
5. Add guide links to `ToolPageShell` by resolving posts related to the current tool.
6. Decide what to do with `/guides`: redirect to `/posts?type=tool-guides` or keep a thin compatibility page linking into Posts.

## Editorial tasks

1. Rewrite the six published guide posts into tool-detail guides.
2. Draft the first three new tool guides:
   - Webhook Request Simulator
   - PDF Toolkit
   - OG Image Generator
3. Consolidate typing-related retrospective fragments into one canonical article.
4. Add frontmatter consistently:
   - `kind: guide` for guide posts for now, while UI displays them as Tool Guides when `related_tools` is present.
   - `category` matching current allowed categories or normalize code to include `site-notes`.
   - `related_tools` for every tool guide.

## Acceptance checklist

- `/posts` can find a specific article without scrolling through all posts.
- Tool-related posts are visually distinguishable from retrospectives/news.
- Existing published URLs keep working.
- Guide-style content links to its actual tool.
- Tool pages link back to detailed guides where available.
- Build and lint pass.
