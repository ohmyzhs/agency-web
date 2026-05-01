# Typing Practice Killer Content Phase 2 Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task after Phase 1 typing engine is stable.

**Goal:** Elevate `/typing` from a useful practice page into the core content/product of oh-my-zhs.com: a Korean-first typing platform with lightweight login, trustworthy public leaderboards, adaptive training, and repeat-visit loops that can compete with Hancom Taja by being more practical, transparent, and modern.

**Architecture:** Keep Phase 1 local-first for instant use, then add an optional server layer for identity, score submission, leaderboards, challenges, and synced progress. Public pages remain crawlable; authenticated features progressively enhance the experience instead of hiding the core tool behind login.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, server actions/route handlers, provider-backed auth, PostgreSQL-compatible DB or managed BaaS, signed/validated score submissions, localStorage fallback, SEO content pages under `/typing/*` and `/posts`.

---

## Executive decision

타자연습기는 더 이상 보조 도구가 아니라 `oh-my-zhs.com`의 핵심 컨텐츠로 격상한다.

기존 도구 허브 전략은 유지하되, 사이트의 반복 방문/체류/브랜드 차별화는 `/typing`이 담당한다. 한컴타자는 국민적 인지도와 게임/랭킹/학습 구조가 강점이지만, 우리가 이길 수 있는 지점은 다음이다.

1. **로그인 없이 바로 시작**하고, 원하면 간편로그인으로 기록만 올리는 구조.
2. **한글 IME와 2벌식 학습에 진심인 UX**: 조합 중 오타 깜빡임 방지, 자모/키/문장 단위 분석.
3. **투명한 랭킹**: 어떤 모드/시간/정확도/오타 규칙인지 명확히 표시하고, 의심 기록은 검증 대기 처리.
4. **약점 기반 훈련**: 단순 속도 경쟁이 아니라 “내가 틀리는 키/글자/패턴”을 자동으로 연습시킴.
5. **실생활/개발자/학생/취업 타자팩**: 한컴보다 더 실용적인 문장팩과 커리큘럼.
6. **콘텐츠+제품 결합**: 타자 속도 계산법, 한글 입력 팁, 키보드 습관, 문장팩 소개 글이 검색 유입을 만든다.

## Product north star

**“한국어 입력을 가장 빠르게 개선하는 웹 타자연습기”**

Primary user loops:
- 1분 테스트 → 내 순위 확인 → 약점 훈련 추천 → 재도전
- 오늘의 문장팩 → streak 유지 → 주간 랭킹 확인
- 친구/반/팀 챌린지 링크 공유 → 같은 지문으로 경쟁
- 로그인 전 로컬 기록 → 로그인 후 대표 기록 업로드

## Login and leaderboard strategy

### Recommended identity model

Use optional 간편로그인, not mandatory login.

- Anonymous user:
  - Can use all practice modes.
  - Records stored locally.
  - Can see public leaderboard.
  - Cannot submit public score.
- Signed-in user:
  - Can choose public nickname.
  - Can submit eligible results to leaderboard.
  - Can sync best scores and streak across devices.
  - Can join friend/class/team challenges.

### Login providers

Phase 2A minimal providers:
- Google OAuth: broadest, simplest global option.
- Kakao OAuth: important for Korean users.

Later:
- Naver OAuth if Korean adoption justifies it.
- Apple login only if mobile/iOS user demand is high.

Implementation options:
- **Auth.js / NextAuth** if we want provider flexibility inside Next.js.
- **Supabase Auth** if we want auth + PostgreSQL + row-level security + storage from one platform.
- **Clerk** if speed matters more than vendor dependency/cost.

Recommended for this project unless hosting constraints say otherwise:
- **Supabase Auth + Postgres** for fastest reliable leaderboard backend and easy SQL-based ranking.
- Keep an adapter layer so we can swap later.

### Privacy and trust requirements

- Public leaderboard shows nickname, score, mode, duration, accuracy, date, optional avatar initial only.
- Never expose email.
- Nickname can be changed, but preserve score ownership.
- Provide “delete my records” action.
- Privacy page must mention score submissions, login provider, localStorage, and public leaderboard data.

## Ranking design

### Ranking dimensions

Do not use one global “best typist” list. It becomes unfair and easy to game.

Create separate leaderboards:

1. `60초 한글 단어` — default flagship board.
2. `60초 영어 단어` — secondary.
3. `15초 스프린트` — short-form repeat challenge.
4. `장문 정확도` — long-form focus, ranked by accuracy first then CPM.
5. `오늘의 문장` — daily rotating challenge.
6. `주간 랭킹` — resets weekly for freshness.
7. `친구 챌린지` — private link board.
8. Later: `학교/팀 리그` — class/team code.

### Score formula

Public leaderboard score should not be raw WPM only.

Recommended score:

```text
eligible = duration >= 15s
        && typedChars >= minimumCharsByDuration
        && accuracy >= 90%
        && uncorrectedErrors <= allowedErrorsByMode

score = round(
  correctedCPM
  * accuracyMultiplier
  * durationWeight
  * strictModeBonus
)

accuracyMultiplier = clamp(accuracyPercent / 100, 0.90, 1.00)
durationWeight = 1.00 for 60s, 0.95 for 30s, 0.90 for 15s, 1.05 for 120s
strictModeBonus = 1.02 if strict mode, else 1.00
```

Display WPM/CPM/accuracy separately. Use `score` only for ranking consistency.

### Submission eligibility rules

Reject or mark unverified if:
- Test duration is too short for the selected board.
- Accuracy below board threshold.
- Input event count is implausibly low for typed length.
- Timestamps are impossible or too uniform.
- Paste event occurred in ranked mode.
- Window lost focus too many times in ranked mode.
- Composition/input event stream does not match final text length reasonably.
- Same account submits too many top scores in a short period.

Do not claim cheat-proof. Label as:
- `verified`: passed basic client/server checks.
- `review`: suspicious but retained privately.
- `rejected`: not eligible.

### Anti-abuse reality

Browser typing tests cannot be perfectly cheat-proof. The goal is to make casual cheating unappealing and protect visible leaderboards.

Use layered checks:
1. Client event trace hash.
2. Server-side metric recomputation.
3. Rate limiting per user/IP/session.
4. Paste/focus/composition anomaly flags.
5. Top-score cooldown and review queue.
6. Daily challenge text delivered from server shortly before start.

## Killer content concepts beyond Hancom

### 1. Weakness Coach / 약점 코치

After each session:
- “ㄹ/ㅅ 받침에서 오타가 많아요”
- “오른손 윗자리 ㅛ/ㅕ 전환이 느려요”
- “띄어쓰기 직후 첫 글자 오타가 많아요”

Then generate an adaptive mini drill from the weak keys/patterns.

Why it can beat Hancom:
- Hancom teaches modes; this gives personal diagnosis.

### 2. Daily Korean Typing Challenge / 오늘의 한글 챌린지

- Same text for everyone per day.
- Public daily and weekly rankings.
- No login needed to practice; login required to submit.
- Text categories rotate: 일상, 개발, 뉴스요약, 속담형 문장, 긴글 집중.

Why it can beat Hancom:
- Repeat visit loop without heavy game assets.

### 3. Ghost Race / 내 기록과 대결

- Replay your previous best as a ghost progress line.
- Compare current progress vs previous best at each second.
- No multiplayer backend required initially.

Why it can beat Hancom:
- 경쟁감은 주되 부담이 낮음.

### 4. Korean IME Lab / 한글 입력 실험실

Educational + interactive layer:
- 두벌식 자판 지도.
- 자모가 음절로 조합되는 과정 시각화.
- 왜 조합 중 오타 표시가 불편한지 설명.
- 키보드별 한글 입력 팁.

Why it can beat Hancom:
- 검색 유입과 교육 가치를 동시에 만든다.

### 5. Practical Text Packs / 실전 문장팩

Packs that feel useful:
- 초등/중등 맞춤법 문장팩.
- 직장인 이메일 문장팩.
- 개발자 명령어/JSON/API 문장팩.
- 블로그 글쓰기 문장팩.
- TOPIK/Korean learner pack later.

Why it can beat Hancom:
- “게임”보다 “실제로 빨라지는 연습”에 초점.

### 6. Friend/Class Challenge / 링크 챌린지

- Create challenge link with one text pack/duration.
- Participants choose nickname or login.
- Private leaderboard for that link.
- Useful for 학교, 스터디, 회사 이벤트.

Why it can beat Hancom:
- 공유성과 커뮤니티 유입.

## Data model draft

### Tables

`users`
- `id` uuid primary key
- `provider` text
- `provider_user_id` text
- `email_hash` text nullable
- `nickname` text unique
- `avatar_url` text nullable
- `created_at` timestamptz
- `deleted_at` timestamptz nullable

`typing_profiles`
- `user_id` uuid primary key
- `public_display_name` text
- `preferred_language` text
- `keyboard_layout` text default `ko-2set`
- `public_rank_opt_in` boolean default true
- `created_at` timestamptz
- `updated_at` timestamptz

`typing_results`
- `id` uuid primary key
- `user_id` uuid nullable
- `anonymous_session_id_hash` text nullable
- `mode` text
- `language` text
- `duration_seconds` integer
- `text_pack_id` text
- `challenge_id` uuid nullable
- `typed_chars` integer
- `correct_chars` integer
- `incorrect_chars` integer
- `corrected_errors` integer
- `uncorrected_errors` integer
- `wpm` numeric
- `cpm` numeric
- `raw_cpm` numeric
- `accuracy` numeric
- `score` integer
- `client_started_at` timestamptz
- `client_finished_at` timestamptz
- `submitted_at` timestamptz
- `verification_status` text default `pending`
- `verification_flags` jsonb default `[]`
- `event_trace_hash` text

`typing_leaderboard_entries`
- `id` uuid primary key
- `result_id` uuid references `typing_results(id)`
- `user_id` uuid references `users(id)`
- `board_key` text
- `rank_period` text -- all_time / weekly / daily / challenge
- `period_start` date nullable
- `score` integer
- `wpm` numeric
- `accuracy` numeric
- `created_at` timestamptz

`typing_challenges`
- `id` uuid primary key
- `creator_user_id` uuid nullable
- `slug` text unique
- `title` text
- `mode` text
- `language` text
- `duration_seconds` integer
- `text_pack_id` text
- `target_text_id` text nullable
- `visibility` text -- public/private/unlisted
- `starts_at` timestamptz nullable
- `ends_at` timestamptz nullable
- `created_at` timestamptz

`typing_daily_challenges`
- `date` date primary key
- `challenge_id` uuid references `typing_challenges(id)`
- `seed` text
- `text_pack_id` text

`typing_weak_key_stats`
- `user_id` uuid
- `key_code` text
- `jamo` text nullable
- `attempts` integer
- `correct` integer
- `avg_reaction_ms` numeric
- `updated_at` timestamptz

## Routes and pages

Public product routes:
- `/typing` — main app and flagship landing.
- `/typing/leaderboard` — public leaderboard index.
- `/typing/leaderboard/[board]` — board detail.
- `/typing/challenge/[slug]` — challenge landing + test.
- `/typing/daily` — today’s challenge.
- `/typing/lessons` — lesson map if split from app.
- `/typing/ime` — Korean IME lab / educational page.

Auth/account routes:
- `/typing/login` — login entry, explain benefits.
- `/typing/profile` — nickname, public opt-in, delete records.
- `/typing/my-records` — synced personal history.

API/server routes:
- `POST /api/typing/results` — submit result.
- `GET /api/typing/leaderboard?board=...` — leaderboard.
- `POST /api/typing/challenges` — create challenge.
- `GET /api/typing/daily` — daily challenge payload.

## Phase 2 roadmap

### Phase 2A — Optional login + public score submission foundation

Deliver:
- Choose auth/backend provider.
- Add Google/Kakao login.
- Add nickname setup.
- Add score submission API.
- Add basic server-side score validation.
- Add public 60초 한글 board.
- Add Privacy/Terms copy updates.

Non-goals:
- No real-time multiplayer.
- No school/team league.
- No paid features.

### Phase 2B — Leaderboards that feel alive

Deliver:
- All-time, weekly, daily boards.
- Separate board keys for Korean 60s, Korean 15s, English 60s, longform accuracy.
- Profile card from leaderboard.
- Suspicious score status handling.
- Rate limiting.
- “내 순위 근처 보기” after login.

### Phase 2C — Daily challenge + ghost race

Deliver:
- Daily challenge text generated from deterministic seed and approved text packs.
- Daily leaderboard.
- Ghost line vs previous local/synced best.
- Share result card.

### Phase 2D — Weakness Coach

Deliver:
- Per-key/per-jamo stats sync.
- Problem key analysis.
- Adaptive mini-drills.
- Weekly progress summary.

### Phase 2E — Challenge links / classroom-lite

Deliver:
- Create private challenge link.
- Link-specific leaderboard.
- Optional nickname-only participation, with login required to persist official record.
- Abuse controls.

## Implementation tasks

### Task 1: Write backend decision record

**Objective:** Decide and document the auth/database provider before coding.

**Files:**
- Create: `docs/plans/2026-05-01-typing-auth-backend-decision.md`

**Content requirements:**
- Compare Supabase Auth+Postgres, Auth.js+Postgres, Clerk.
- Decide default provider.
- List required environment variables without real secrets.
- List hosting implications.
- List rollback path.

**Verification:**
- Decision doc explicitly says whether MVP can run without backend credentials.

### Task 2: Add typing backend schema draft

**Objective:** Add a schema plan that implementers can convert into migrations.

**Files:**
- Create: `docs/plans/typing-leaderboard-schema.sql`

**Requirements:**
- Include the tables listed in this plan.
- Include indexes for board lookups:
  - `(board_key, rank_period, period_start, score desc)`
  - `(user_id, submitted_at desc)`
  - `(challenge_id, score desc)`
- Include uniqueness rule for one visible best entry per user/board/period where appropriate.

**Verification:**
- SQL parses conceptually and contains no secrets.

### Task 3: Add score verification spec

**Objective:** Define exactly how ranked score submission is accepted or rejected.

**Files:**
- Create: `docs/plans/typing-score-verification-spec.md`

**Requirements:**
- Define `verified`, `review`, `rejected`.
- Define duration thresholds.
- Define paste/focus anomaly flags.
- Define event trace minimum fields.
- Define recomputation of WPM/CPM/accuracy/score server-side.

**Verification:**
- Spec includes at least 10 rejection/review conditions.

### Task 4: Update Phase 1 typing plan cross-reference

**Objective:** Make the existing typing plan point to this Phase 2 killer-content plan.

**Files:**
- Modify: `docs/plans/2026-05-01-typing-practice-layer-plan.md`

**Change:**
- Add a short section after “Product decision”:
  - Phase 1 is local-first engine.
  - Phase 2 is login/ranking/challenge/coach product layer.
  - Link this document.

**Verification:**
- `grep -n "Phase 2" docs/plans/2026-05-01-typing-practice-layer-plan.md` returns the cross-reference.

### Task 5: Implement public leaderboard UI shell

**Objective:** Add non-functional but real-data-ready leaderboard pages after backend decision.

**Files:**
- Create: `src/app/typing/leaderboard/page.tsx`
- Create: `src/app/typing/leaderboard/[board]/page.tsx`
- Create: `src/components/typing/leaderboard/LeaderboardShell.tsx`
- Create: `src/lib/typing/leaderboard-types.ts`

**Requirements:**
- Server pages export SEO metadata.
- Shell accepts typed leaderboard entries as props.
- Empty state must be honest: “아직 제출된 공식 기록이 없습니다.”
- No fake ranking rows.

**Verification:**
- `npm run lint && npm run build`

### Task 6: Implement auth-gated score submission API

**Objective:** Allow signed-in users to submit eligible results.

**Files:**
- Create: `src/app/api/typing/results/route.ts`
- Create: `src/lib/typing/server/score.ts`
- Create: `src/lib/typing/server/auth.ts`

**Requirements:**
- Reject unauthenticated public leaderboard submission.
- Recompute metrics server-side.
- Return status: `verified`, `review`, or `rejected`.
- Store result if backend is configured.
- If backend not configured, return a safe 503 with clear message.

**Verification:**
- Unit-test pure score helpers where test setup exists; otherwise add a documented manual curl test.
- `npm run lint && npm run build`

### Task 7: Add login/profile surfaces

**Objective:** Add user-facing login benefits and profile/nickname management.

**Files:**
- Create: `src/app/typing/login/page.tsx`
- Create: `src/app/typing/profile/page.tsx`
- Create: `src/components/typing/auth/LoginPanel.tsx`
- Create: `src/components/typing/auth/ProfilePanel.tsx`

**Requirements:**
- Login page explains optional login.
- Profile page includes nickname, public ranking opt-in, delete records CTA.
- No email exposed publicly.

**Verification:**
- `npm run lint && npm run build`

### Task 8: Add daily challenge backend/content seed

**Objective:** Make repeat visits meaningful with a daily Korean challenge.

**Files:**
- Create: `src/app/typing/daily/page.tsx`
- Create: `src/lib/typing/daily.ts`
- Modify: typing app to accept a forced challenge payload.

**Requirements:**
- Daily text chosen deterministically by date and seed.
- Same date returns same challenge.
- Challenge can be practiced anonymously.
- Login required only for official leaderboard submission.

**Verification:**
- Manually check two dates produce stable but different challenge ids.
- `npm run lint && npm run build`

### Task 9: Add ghost race

**Objective:** Add a killer solo competition loop without real-time multiplayer.

**Files:**
- Modify: `src/components/typing/TypingApp.tsx`
- Create: `src/components/typing/GhostProgress.tsx`
- Modify: local/synced result storage helpers.

**Requirements:**
- Compare current progress to previous best for same mode/duration/text pack.
- Show ahead/behind indicator.
- Do not distract from typing input.

**Verification:**
- Complete same challenge twice; second run shows ghost comparison.

### Task 10: Add Weakness Coach adaptive drills

**Objective:** Turn results into personalized training recommendations.

**Files:**
- Create: `src/lib/typing/weakness.ts`
- Create: `src/components/typing/WeaknessCoach.tsx`
- Modify: result screen to show recommendations.

**Requirements:**
- Identify top 3 weak keys/jamo/patterns.
- Generate a short drill from weak items.
- Explain why the drill is recommended.

**Verification:**
- Seed synthetic stats and verify recommended drills are deterministic.
- `npm run lint && npm run build`

### Task 11: Update legal and policy pages

**Objective:** Keep AdSense and privacy posture clean after login/ranking.

**Files:**
- Modify: `src/app/privacy/page.tsx` or client copy source.
- Modify: `src/app/terms/page.tsx` or client copy source.
- Modify: `src/app/disclaimer/page.tsx` if needed.

**Requirements:**
- Mention login providers.
- Mention public nickname/ranking entries.
- Mention localStorage and synced records.
- Mention deletion request/action.
- Mention no guarantee that rankings are cheat-proof.

**Verification:**
- Production HTML still has metadata after build.

### Task 12: Promote typing in site IA

**Objective:** Make `/typing` visibly the flagship product.

**Files:**
- Modify: home page/client component.
- Modify: header/nav component.
- Modify: footer component.
- Modify: sitemap if needed.

**Requirements:**
- Header includes `타자연습` as top-level item.
- Home hero or first section features typing as flagship.
- Tools remain available but no longer dominate positioning.
- Sitemap includes new public typing routes.

**Verification:**
- `npm run lint && npm run build`
- Crawl key pages to confirm links.

## Acceptance criteria for Phase 2

- A user can practice without login.
- A user can log in with at least one 간편로그인 provider.
- A logged-in user can submit an eligible 60-second Korean result.
- Public leaderboard shows real submitted entries only.
- Suspicious/ineligible results are not shown as verified rankings.
- Daily challenge creates a reason to return.
- Ghost race gives a solo competitive loop.
- Weakness Coach recommends targeted practice.
- Privacy/Terms disclose login, ranking, localStorage, and deletion.
- Header/homepage treat typing as flagship content.
- No fake ranking, fake usage count, fake certification, or copied content.
- `npm run lint && npm run build` pass.

## AdSense cautions

- Do not hide the core product behind login; public usefulness must remain visible.
- Do not place ads near active typing, submit score, login, restart, or result buttons.
- Do not encourage users to click ads to support rankings/challenges.
- Keep leaderboard pages useful even when empty: explain modes, eligibility, score calculation.
- Avoid copyrighted text packs.
- Public user-generated nicknames require moderation/filtering.

## Open decisions before implementation

1. Backend provider: Supabase vs Auth.js+Postgres vs Clerk.
2. Login providers: Google only first, or Google + Kakao from day one.
3. Hosting: current deployment target and environment variable management.
4. Whether public ranking launch should wait until Phase 1 traffic exists.
5. Nickname moderation approach: blocklist only vs manual review for reported names.
6. Whether `/typing` should replace the home hero immediately or after MVP QA.

## Recommended next action

Before coding backend, complete Task 1 decision record. Then implement in this order:

1. Phase 1 local-first typing engine.
2. Backend decision + schema + verification spec.
3. Optional login and 60초 한글 leaderboard.
4. Daily challenge.
5. Ghost race.
6. Weakness Coach.
7. Friend/class challenge links.

This order avoids building social/ranking infrastructure before the typing engine is actually good.
