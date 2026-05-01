# Posts Markdown + Obsidian Content Workflow Plan

> **For Claude Code / Hermes:** Implement only after Gabriel confirms the content storage direction. Current canonical URL policy is `/posts/[slug]`; `/blog` should be an alias or redirect, not the canonical path.

**Goal:** Keep `/posts` as the public article structure while making writing feel blog-like and maintainable from Obsidian.

**Architecture:** Drafts live in Obsidian under `Oh My ZHS/Posts/*`. The website can either import approved markdown files at build time or later read posts from a DB/CMS. For the next iteration, prefer a hybrid: Obsidian markdown as editorial source of truth, repo content import for approved posts, and optional DB/CMS only when publishing frequency or non-developer editing requires it.

---

## 1. Decision: MD vs DB

### Markdown build-time publishing

**How it works:** Markdown files are committed/imported into the repo and rendered by Next at build time.

**Pros:**
- Simple, fast, cheap, static, good SEO.
- Easy to write in Obsidian.
- Version-controlled content.
- No DB/admin/security surface.

**Cons:**
- Yes, a new deployment is needed for newly published or edited posts.
- Not ideal if posts must be published many times per day by non-dev users.

### DB/CMS publishing

**How it works:** Posts are stored in a database or CMS and fetched at runtime/build revalidation.

**Pros:**
- WordPress-like publishing without code deploy.
- Can support admin UI, scheduled posts, multiple authors.

**Cons:**
- Requires DB/CMS, auth, editor UI, backups, spam/security management.
- More moving parts before AdSense approval.
- Runtime failures can affect content pages.

### Recommendation now

Use **Obsidian markdown -> repo import -> static deploy** for the initial AdSense/content phase.

Reason:
- Current goal is site quality and approval readiness, not newsroom-level CMS operations.
- 10-50 evergreen/news-summary posts can be handled safely with markdown and deploys.
- Vercel/Git deployment makes publish operations simple enough.

Revisit DB/CMS when:
- publishing frequency is daily+ and deploy friction becomes real,
- multiple human authors need an admin UI,
- comments/memberships/user data become necessary,
- scheduled publishing becomes critical.

---

## 2. Content source structure

Obsidian path:

```text
~/Documents/Obsidian Vault/Oh My ZHS/Posts/
  README.md
  01-Guides/
  02-IT-News/
  03-Daily/
  04-Experiments/
```

Repo future path if imported:

```text
content/posts/
  guides/
  it-news/
  daily/
  experiments/
```

Canonical public routes:

```text
/posts
/posts/[slug]
```

Alias/redirect:

```text
/blog -> /posts
/blog/[slug] -> /posts/[slug]  # optional later
```

---

## 3. Implementation tasks for next coding phase

### Task 1: Add `/blog` alias

**Files:**
- Create: `src/app/blog/page.tsx`
- Optional create later: `src/app/blog/[slug]/page.tsx`

**Behavior:**
- `/blog` redirects to `/posts` or renders the same index with canonical pointing to `/posts`.
- Prefer redirect for SEO simplicity.

### Task 2: Add markdown loader only if approved

**Files:**
- Create: `content/posts/**.md`
- Modify: `src/lib/posts.ts`

**Important:** Do not add a heavy MDX pipeline yet unless needed. A small frontmatter parser + limited markdown renderer is enough for MVP.

### Task 3: Import approved Obsidian drafts

**Source:** `~/Documents/Obsidian Vault/Oh My ZHS/Posts/**.md`

**Target:** `content/posts/**.md` or keep TypeScript data until markdown loader exists.

### Task 4: Seed 10 posts

Initial scaffolds already created in Obsidian. Convert only approved drafts into production content.

---

## 4. Initial 10 scaffolded posts

1. 59㎡·75㎡·84㎡·99㎡ 아파트 면적이 헷갈리는 이유
2. KST 기준 해외 회의 시간 잡을 때 DST를 피하는 법
3. 환율 계산기 숫자와 실제 카드 청구액이 다른 이유
4. JSON·YAML·XML 검증과 정렬은 어떻게 다를까
5. 사람이 말하는 스케줄을 cron 표현식으로 바꾸는 법
6. AI 코딩 에이전트 도구 흐름: Claude Code, Codex, 로컬 에이전트
7. 브라우저 로컬 도구가 개인정보 측면에서 유리한 이유
8. 작은 자동화 도구 스택을 만들 때 먼저 정해야 할 것들
9. 이번 주 oh-my-zhs에 추가한 것들
10. 타자연습기를 독립 레이어로 만들면 좋은 이유

---

## 5. Definition of done

- Obsidian contains categorized draft scaffolds.
- Public URL policy remains `/posts/[slug]`.
- `/blog` alias exists or is planned.
- No DB/CMS introduced prematurely.
- If markdown loader is added, `npm run lint && npm run build` must pass.
