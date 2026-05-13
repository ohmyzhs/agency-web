# Posts Publish API

`POST /api/posts/publish` 엔드포인트는 외부 시스템에서 블로그 글 초안을 안전하게 생성하기 위한 파일 기반 게시 API입니다.

## 개요

- 메서드: `POST`
- 경로: `/api/posts/publish`
- 런타임: `nodejs`
- 인증: `Authorization: Bearer <token>`
- 저장 위치: `content/posts/<slug>.md`
- 중복 슬러그: `409 Conflict`

## 인증

서버 환경변수에 아래 값을 설정해야 합니다.

```env
POST_PUBLISH_BEARER_TOKEN=your-secret-token
```

요청 헤더:

```http
Authorization: Bearer your-secret-token
Content-Type: application/json
```

인증 규칙:

- 환경변수가 없으면 `500 POST_PUBLISH_BEARER_TOKEN is not configured`
- 헤더가 없으면 `401 missing authorization header`
- Bearer 형식이 아니면 `401 expected Bearer token`
- 토큰이 다르면 `401 unauthorized`

## 요청 바디 스키마

```json
{
  "title": "필수, 문자열",
  "slug": "선택, 문자열",
  "summary": "선택, 문자열",
  "content": "선택, 문자열",
  "markdown": "선택, 문자열",
  "tags": ["선택", "문자열 배열"],
  "status": "선택, draft | published",
  "publishedAt": "선택, ISO datetime string"
}
```

## 필드 규칙

### `title`
- 필수
- 문자열만 허용
- angle bracket(`<`, `>`) 제거 후 trim
- 최대 200자

### `slug`
- 선택
- 없으면 `title`로부터 자동 생성
- angle bracket 제거 후 slugify
- slugify 규칙:
  - 소문자 변환
  - Unicode NFKD 정규화
  - 결합 악센트 제거
  - 영문자/숫자가 아닌 문자는 `-`로 치환
  - 중복 `-` 축약
  - 앞뒤 `-` 제거
- 결과가 비면 `400 slug is required`

예시:
- `Hello World!` → `hello-world`
- `Café launch notes` → `cafe-launch-notes`

### `summary`
- 선택
- 문자열만 허용
- angle bracket 제거 후 trim
- 최대 500자까지 저장
- 비어 있으면 `null`로 처리

### `content` / `markdown`
- 둘 중 하나는 반드시 필요
- `content`가 있으면 우선 사용
- 없으면 `markdown` 사용
- CRLF는 LF로 정규화
- trim 후 비어 있으면 `400 content or markdown is required`
- 최대 200,000자

### `tags`
- 선택
- 문자열 배열만 허용
- 최대 20개
- 각 태그는:
  - angle bracket 제거
  - 소문자 변환
  - 빈 값 제거
  - 최대 40자
- 중복 태그는 제거

### `status`
- 선택
- 허용값: `draft`, `published`
- 미지정 시 기본값: `draft`
- 그 외 값은 `400 status must be draft or published`

### `publishedAt`
- 선택
- ISO datetime string 이어야 함
- 지정 시 `Date.parse()` 가능한 값만 허용
- 저장 시 `toISOString()`으로 정규화
- `status: "published"`인데 값이 없으면 서버 시각으로 자동 설정
- `draft`면 기본값은 `null`

## 저장 포맷

생성되는 파일은 아래 형태의 frontmatter + 본문 마크다운입니다.

```md
---
title: "게시글 제목"
slug: "post-slug"
status: "draft"
summary: "요약"
tags: ["tag1", "tag2"]
publishedAt: null
---

본문 내용...
```

## 성공 응답

상태 코드: `200 OK`

```json
{
  "ok": true,
  "slug": "my-post",
  "path": "/absolute/path/to/content/posts/my-post.md",
  "sha256": "<written-markdown-sha256>"
}
```

응답 필드:
- `slug`: 최종 저장된 슬러그
- `path`: 실제 저장 절대경로
- `sha256`: 저장된 마크다운 전체 내용의 SHA-256

## 오류 응답

### 400 Bad Request
```text
invalid json
```
또는
```text
title is required
```
등의 검증 메시지

대표 검증 오류:
- `payload must be an object`
- `title is required`
- `title length must be <= 200`
- `content or markdown is required`
- `content length must be <= 200000`
- `tags must be an array of strings`
- `tags must contain at most 20 items`
- `tag length must be <= 40`
- `status must be draft or published`
- `publishedAt must be an ISO string`
- `publishedAt must be a valid ISO date`

### 401 Unauthorized
```text
missing authorization header
```
```text
expected Bearer token
```
```text
unauthorized
```

### 409 Conflict
```text
slug already exists
```

같은 slug의 파일이 이미 `content/posts/<slug>.md`에 존재하면 덮어쓰지 않습니다.

### 500 Internal Server Error
```text
POST_PUBLISH_BEARER_TOKEN is not configured
```
또는
```text
failed to publish
```

예외 발생 시 서버는 내부적으로 `posts/publish failed`를 로그로 남깁니다.

## 요청 예시

### cURL

```bash
curl -X POST http://localhost:3000/api/posts/publish \
  -H 'Authorization: Bearer your-secret-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "First API Draft",
    "summary": "외부 시스템에서 생성한 첫 글입니다.",
    "content": "# First API Draft\n\n본문입니다.",
    "tags": ["api", "draft"],
    "status": "draft"
  }'
```

### published 상태 예시

```json
{
  "title": "Shipping Notes",
  "slug": "shipping-notes",
  "markdown": "# Shipping Notes\n\nReady to publish.",
  "tags": ["release", "ops"],
  "status": "published",
  "publishedAt": "2026-05-13T12:00:00Z"
}
```

## 동작 요약

1. Bearer 토큰 검증
2. JSON 파싱
3. 입력값 정규화 및 검증
4. `content/posts` 디렉토리 생성 보장
5. slug 중복 검사
6. frontmatter 포함 마크다운 렌더링
7. `content/posts/<slug>.md` 파일 저장
8. SHA-256 계산 후 JSON 응답 반환

## 구현 위치

- API 라우트: `src/app/api/posts/publish/route.ts`
- 인증 유틸: `src/lib/post-auth.ts`
- 게시 유틸: `src/lib/posts.ts`

## Implemented content intake endpoints

The production publishing path is Git-backed. Runtime writes to the deployed filesystem are not used for durable publishing.

### Endpoints

- `POST /api/webhooks/content-intake` — generic intake endpoint for trusted automation tools.
- `POST /api/posts/publish` — compatibility alias for blog-post publishing. It calls the same service.

### Required authentication

Send a bearer token:

```http
Authorization: Bearer [REDACTED]
```

The server accepts `CONTENT_WEBHOOK_BEARER_TOKEN` first and falls back to `POST_PUBLISH_BEARER_TOKEN`.

If `CONTENT_WEBHOOK_HMAC_SECRET` is configured, also send:

```http
X-ZHS-Signature: sha256=<hex hmac over raw request body>
```

### Environment variables

```env
CONTENT_WEBHOOK_BEARER_TOKEN=[REDACTED]
POST_PUBLISH_BEARER_TOKEN=[REDACTED]
CONTENT_WEBHOOK_HMAC_SECRET=[REDACTED]
GITHUB_CONTENT_TOKEN=[REDACTED]
POST_PUBLISH_REPO=ohmyzhs/agency-web
POST_PUBLISH_BASE_BRANCH=main
POST_PUBLISH_DEFAULT_MODE=draft-pr
POST_PUBLISH_ALLOW_LOCAL_DRAFTS=false
```

### Publish modes

- `draft-pr` — creates a content branch, writes the Markdown artifact through the GitHub Contents API, then opens a draft PR.
- `direct-main` — writes the Markdown artifact directly to the base branch through the GitHub Contents API.
- `local-draft` — writes to the local checkout only. This is forbidden in production unless `POST_PUBLISH_ALLOW_LOCAL_DRAFTS=true`.

### Example request

```bash
curl -X POST https://oh-my-zhs.com/api/webhooks/content-intake \
  -H 'Authorization: Bearer [REDACTED]' \
  -H 'Content-Type: application/json' \
  -d '{
    "contentType": "post",
    "sourceApp": "manus-social-app",
    "idempotencyKey": "external-run-2026-05-13-001",
    "title": "AI 검색 변화가 콘텐츠 운영에 주는 의미",
    "description": "AI 검색 결과와 콘텐츠 운영 전략의 변화를 해설합니다.",
    "markdown": "본문 Markdown...",
    "category": "ai-insight",
    "kind": "news-explainer",
    "tags": ["ai", "search"],
    "sourceLinks": [{ "label": "Source", "url": "https://example.com/article" }],
    "status": "draft",
    "publishMode": "draft-pr"
  }'
```

### Validation notes

- Allowed categories: `ai-insight`, `practical-guide`, `comparison-recommendation`, `work-productivity`, `digital-trends`.
- Allowed kinds: `guide`, `news-explainer`, `comparison`, `workflow`, `trend-note`, `retrospective`, `experiment`, `site-note`, `release-note`.
- `news-explainer`, `trend-note`, and `comparison` require at least one source link.
- Posts are rendered to `content/posts/auto/<slug>.md`; updates are rendered to `content/updates/<slug>.md`.

