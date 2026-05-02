# /typing 한컴타자급 재설계 — Phase 1.5 구현 계획

> 자산 프롬프트 모음은 별도 파일 [`typing-asset-prompts.md`](./typing-asset-prompts.md) 참조.

## Context — 왜 다시 짜는가

현재 `/typing`은 기능은 동작하지만 사용자 체감 품질이 한컴타자(tt.hancomtaja.com) 대비 수십 배 부족하다. 단순 코드 보강이 아니라 **단위·저장소·그래픽**을 재정의해야 한다. 본 플랜은 다음 세 가지 근본적 변경을 포함한다.

1. **단위 변경**: CPM/WPM 폐기 → 한국 표준 **"타"**(분당 자모 수). 한컴타자가 2024-04-24 음절→자소 단위로 공식 변경한 것을 따른다(출처: support.hancomtaja.com 공지). 도전단계 100/200/.../1200은 분당 목표 타수의 의미.
2. **저장소 변경**: localStorage → **wa-sqlite + IndexedDB VFS** (OPFS 가능 시 폴백). SQL 스키마로 도전단계별·자모별 통계 정규화.
3. **그래픽/게임 변경**: SVG-만 접근 폐기 → **Phaser 3 + 전면 생성형 AI 자산** (Recraft V3, Flux 1.1 Pro, Scenario, ElevenLabs, Suno). 모든 프롬프트는 Part B 참조.

모드별 색상 테마/스킨꾸미기는 제외(사용자 거부 유지).

### 사용자 체감 격차 Top 10
1. 카운트다운(3초) 부재 (치명) 2. 도전단계 100~1200 시스템 부재 (치명) 3. 단계별 컨텐츠 풀 분리 부재 (치명) 4. 장문 컨텐츠 3개뿐 (치명) 5. 다중 줄/단락 라이브 렌더러 부재 (높음) 6. 자동 다음 지문 부재 (높음) 7. 실시간 "최고 X타" 라이브 비교 부재 (높음) 8. 결과 화면 비교 UI 부재 (높음) 9. 키 누름/손 오버레이 애니메이션 부재 (중) 10. 도전단계별 최고 기록 저장 구조 부재 (높음)

---

## 핵심 결정 (척추)

| 영역 | 결정 | 근거 |
|---|---|---|
| **속도 단위** | "타/분" (자모 기반) — `타 = 입력한 총 자모 수`, `분당 타수 = 자모 / 분` | 한컴타자 표준 |
| **정확도** | `정확도(%) = 정타 자모 / 전체 입력 자모 × 100` | 한국 표준 |
| **WPM/CPM** | UI에서 완전 제거. 영문 모드도 "타" 통일(1타=1알파벳) | 인지 일관성 |
| **저장소** | wa-sqlite + IndexedDB VFS + Web Worker (Comlink) | 사용자 지시 |
| **저장소 백업** | localStorage v1에서 1회 마이그레이션, export/import 메뉴 | 데이터 보존 |
| **라우팅** | 다중 라우트 + Intercepting 결과 모달 | "장소 전환" 심리 |
| **게임 엔진** | **Phaser 3** (공식 Next.js 템플릿) | 학습곡선·문서·SSR 호환·자산 생태계 |
| **자산 조달** | **전면 생성형 AI** (프롬프트는 Part B) | 비용 0, 일관 스타일 |
| **상태 관리** | Zustand 4 슬라이스 | smart-todo-ait 일관성 |
| **모션** | Framer Motion + reduced-motion 폴백 | spring/layout |
| **한글 처리** | es-hangul + 자체 자모 카운터 | 정확 분해 |
| **폰트** | UI: Pretendard variable / 게임: 물마루(CC0) / 모노: JetBrains Mono | 한글 가독성 |
| **모바일** | 데스크톱 우선, ≤768px 키보드/손 자동 숨김 | 한컴타자 동일 |

---

## A. 정보 구조 / 라우팅

```
src/app/typing/
├── layout.tsx                       # 글로벌 단축키, 사운드 컨텍스트, DB Provider
├── page.tsx                         # StageMap (Server shell + Client island)
├── @result/
│   ├── default.tsx
│   └── (.)result/page.tsx           # intercepted 결과 모달
├── zone/
│   ├── page.tsx                     # 8서브 허브
│   └── [lessonId]/page.tsx
├── word/page.tsx
├── sentence/page.tsx
├── longform/
│   ├── page.tsx                     # 카테고리 허브
│   └── [category]/page.tsx
└── game/
    ├── page.tsx
    └── word-defense/page.tsx        # dynamic(ssr:false), Phaser 호스트
```

URL 쿼리 `?stage=600&seed=abc` 보존. **Next.js 16 주의** — AGENTS.md 지시대로 `node_modules/next/dist/docs/`를 직독해 v16 async params, parallel/intercepting routes API 재확인 필수.

---

## B. "타" 메트릭

### B.1 자모 카운팅 (`src/lib/typing/jamo-count.ts`)

```ts
const HANGUL_BASE = 0xAC00;
const HANGUL_END  = 0xD7A3;

export function jamoCountOf(ch: string): number {
  const code = ch.charCodeAt(0);
  if (code >= HANGUL_BASE && code <= HANGUL_END) {
    const offset = code - HANGUL_BASE;
    const jongseong = offset % 28;
    return jongseong > 0 ? 3 : 2;       // 초성+중성+(받침)
  }
  if (code >= 0x3131 && code <= 0x318E) return 1;  // 단일 자모
  return 1;                                          // 영문/숫자/공백
}

export function jamoCountOfText(text: string): number {
  let count = 0;
  for (const ch of text) count += jamoCountOf(ch);
  return count;
}
```

### B.2 분당 타수 / 정확도 (`src/lib/typing/metrics.ts` 재작성)

```ts
export type LiveMetrics = {
  jamoTyped: number;
  jamoCorrect: number;
  jamoIncorrect: number;
  타분당: number;          // = jamoCorrect / minutes
  타분당_raw: number;      // = jamoTyped / minutes
  정확도: number;          // 0~1
  elapsedSeconds: number;
};
```

target과 typed를 자모로 분해(es-hangul) 후 자리별 비교. correct/incorrect 누적, 위 메트릭 산출.

### B.3 도전단계 ↔ 분당 타수

```ts
export const STAGE_TARGET_TPM = {
  100:{tpm:100,accuracy:0.85}, 200:{tpm:200,accuracy:0.88},
  400:{tpm:400,accuracy:0.90}, 600:{tpm:600,accuracy:0.92},
  800:{tpm:800,accuracy:0.94}, 1000:{tpm:1000,accuracy:0.95},
  1100:{tpm:1100,accuracy:0.96}, 1200:{tpm:1200,accuracy:0.97},
};
```

### B.4 UI 표기

- 모든 위치 "타/분", "타", "정확도", "오타"만 사용
- "CPM"/"WPM" 단어는 코드/UI에서 제거
- 결과 화면: "이번 580타 / 직전 542타 / 최고 712타 / 목표 600타"

### B.5 미확인 사항
- 한컴타자가 백스페이스 정정 자모를 정확도 분모에 포함하는지(추정 포함). 사용자 토글 옵션.
- 이중모음(ㅘ = ㅗ+ㅏ)은 키 모델에서 2타로 처리(키 두 번).

---

## C. 저장소 — wa-sqlite + IndexedDB VFS

### C.1 채택
- **wa-sqlite** (MIT) + **IDBBatchAtomicVFS** (IndexedDB)
- **Worker 격리**: Comlink RPC, 메인 스레드 비차단
- 번들: WASM ~570KB (gzip ~300KB), dynamic import

### C.2 스키마 (`src/lib/typing/db/schema.sql`)

```sql
PRAGMA journal_mode=MEMORY;

CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  started_at INTEGER NOT NULL, finished_at INTEGER NOT NULL,
  mode TEXT NOT NULL, language TEXT NOT NULL, stage INTEGER NOT NULL,
  lesson_id TEXT, content_seed TEXT NOT NULL,
  jamo_typed INTEGER NOT NULL, jamo_correct INTEGER NOT NULL,
  tpm REAL NOT NULL, tpm_raw REAL NOT NULL,
  accuracy REAL NOT NULL, duration_seconds REAL NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_mode_stage ON sessions(mode, stage, lesson_id);
CREATE INDEX IF NOT EXISTS idx_sessions_finished_at ON sessions(finished_at);

CREATE TABLE IF NOT EXISTS best_scores (
  config_key TEXT PRIMARY KEY,
  session_id INTEGER NOT NULL,
  tpm REAL NOT NULL, accuracy REAL NOT NULL, finished_at INTEGER NOT NULL,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

CREATE TABLE IF NOT EXISTS key_stats (
  jamo TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL DEFAULT 0,
  correct INTEGER NOT NULL DEFAULT 0,
  total_latency_ms INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS streak_days (
  date TEXT PRIMARY KEY,
  practice_seconds INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS game_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game TEXT NOT NULL, stage INTEGER NOT NULL,
  score INTEGER NOT NULL, wave INTEGER NOT NULL, combo_max INTEGER NOT NULL,
  finished_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_game_scores_game_stage ON game_scores(game, stage, score DESC);
```

### C.3 모듈 구조

```
src/lib/typing/db/
├── schema.sql
├── worker.ts                     # wa-sqlite + Comlink expose
├── client.ts                     # 메인 스레드 RPC
├── repositories/{sessions,best-scores,key-stats,streak,game-scores}.ts
├── migrations/{001_initial.sql, from-localstorage-v1.ts}
└── provider.tsx                  # React Provider, lazy init
```

### C.4 마이그레이션 / Export / Import
- v1 키들 1회 흡수 → `settings.migrated_v1=true` 마커
- 설정 패널 "데이터 내보내기 (.sqlite)" / "가져오기" 버튼

---

## D. 그래픽 / 자산 — 전면 생성형 AI 기반

### D.1 원칙
모든 자산은 생성형 AI로 직접 생성. 비용 0. 후처리는 무료 도구만 사용(Piskel, Figma 무료, ffmpeg, Free Texture Packer, vectorizer.ai 무료 티어).

### D.2 자산 카탈로그

| 자산 | 권장 도구 | 출력 위치 |
|---|---|---|
| 스테이지맵 5개 (자리/낱말/단문/장문/게임) | Recraft V3 | `public/typing/illustrations/stage-*.svg` |
| 양손 SVG (참조 → Figma 트레이스) | Flux 1.1 Pro | `public/typing/hands.svg` |
| 게임 스프라이트 시트 (운석 3종 + 우주선 + gem) | Scenario.com 또는 PixelLab.ai | `public/typing/sprites/` |
| 우주 배경 3 layer (parallax) | Flux 1.1 Pro | `public/typing/sprites/space-bg-{1,2,3}.png` |
| 신기록 리본/메달/별 (한 장) | Recraft V3 | `public/typing/illustrations/ribbon-best.svg` |
| 효과음 ×9 (타건/오타/카운트/완료/tada/게임) | ElevenLabs Sound Effects | `public/typing/sfx/*.wav` |
| BGM 루프 | Suno v4 | `public/typing/sfx/bgm-loop.mp3` |
| 폰트 (Pretendard / 물마루 / JetBrains Mono) | next/font + 직접 다운로드 | next/font + `public/typing/fonts/mulmaru.woff2` |

총 자산 ≤ 1.5MB. 게임 자산은 게임 페이지에서만 lazy load.

### D.3 자산 파이프라인 (2.5일)

| 일정 | 작업 |
|---|---|
| **Day A1** (반나절) | Recraft V3로 스테이지맵 5개 + 신기록 리본 생성 → Figma 색상 보정 → SVG export |
| **Day A2** (반나절) | Flux 1.1 Pro로 양손 참조 → Figma에서 손가락 10개 path 분리 → SVG export |
| **Day A3** (반나절) | Scenario.com / PixelLab.ai로 게임 스프라이트 시트 → Piskel로 alpha 정리 + 분리 |
| **Day A4** (반나절) | Flux 1.1 Pro로 우주 배경 3-layer 통합 시트 → Piskel로 분리 |
| **Day A5** (반나절) | ElevenLabs SFX 9종 + Suno BGM 1곡 → ffmpeg로 정규화 (lufs −16 dB) |

### D.4 라이선스
- AI 생성 자산은 인간 큐레이션·보정 결과물로 분류
- 각 도구의 상업 사용 약관 준수 (Recraft / fal.ai-Flux / Scenario / ElevenLabs / Suno)
- `agency-web/public/typing/CREDITS.md`에 도구명·후처리 기록 명시 (AdSense 정책)

> **모든 프롬프트는 Part B 참조** (`typing-asset-prompts.md`)

---

## E. 게임 — Tier 1 "워드 디펜스" (Phaser 3)

### E.1 통합
`dynamic(() => import('@/components/typing/game/WordDefenseGame'), { ssr: false })`. Phaser 인스턴스는 useEffect 1회 생성/destroy. React→Phaser는 Zustand `useTypingGame` + Phaser `events.emit`.

### E.2 메카닉 (새 기획)
1. 위에서 한국어 단어가 운석으로 떨어진다.
2. 자모 단위 누적 — `ㄷ` 누르면 매칭 단어("도시")의 첫 자모만 부서지며 색이 바뀜(es-hangul).
3. 콤보 ×1.5 → ×3.0, 오타 시 ×0.5.
4. 특수 단어: 빨강(−10HP) / 보라(슬로우모션 3s) / 금색(2× 점수). Phaser `setTint`로 동일 텍스처 색만 변경.
5. 30초 단위 7 웨이브 + 보너스 라운드(긴 문장 클리어 시 +20 HP).
6. 동시 활성 단어 첫 글자 충돌 회피.
7. 단계별 단어 풀 — 100단계는 1~2자, 1200단계는 긴 합성어.

### E.3 점수
```
score = 단어 길이 × 100 × 콤보 × (stage/200)
HP 시작 100, 통과 시 −10/−20/−30
클리어: 7 웨이브 통과 / 오버: HP ≤ 0
```

### E.4 핵심 파일
```
src/components/typing/game/word-defense/
├── WordDefenseGame.tsx          # React 컨테이너, dynamic import
├── scenes/{PreloadScene,GameScene,HudScene}.ts
├── systems/{spawner,jamo-match,scoring,waves}.ts
└── config.ts                    # 단계별 파라미터
```

---

## F. 컴포넌트 트리 (요약)

### 페이지/셸
`StageMap` · `ModeShell` · `LeftStatsRail` · `RightSettingsRail` · `ChallengeBar` · `CountdownGate` · `ResultPanel` · `LiveBestComparator`

### 모드별 스테이지
`ZoneStage` · `WordStage` · `SentenceFeed`(7줄 윈도) · `LongformReader` · `WordDefenseGame`(Phaser)

### 키보드/입력
`VirtualKeyboard`(4행+스페이스) · `KeyCap` · `HandOverlay`

### 분자/원자
`JamoCard` · `WordCard` · `LineRow` · `ParagraphBlock` · `RingProgress` · `Counter` · `StatChip`(타분당/정확도) · `StageBadge` · `CategoryChip` · `BestRibbon` · `TabPair` · `Confetti` · `IllustratedTile` · `FingerDot` · `SoundToggle`

### 헤드리스 훅
`useTypingSession` · `useCountdown` · `useNextExpectedKey` · `useImeSafeInput` · `useStageContent` · `useSoundFx` · `useReducedMotion` · `useDB`

---

## G. 상태 관리 — Zustand 4 슬라이스

| 스토어 | 책임 | 영속화 |
|---|---|---|
| `useTypingSession` | 휘발(target/typed/isComposing/startedAt/pendingKey/currentLineIdx) | 비영속, URL ↔ stage/seed |
| `useTypingProgress` | DB hydrate 캐시(최고/직전/연속일/약점자모) | wa-sqlite |
| `useTypingSettings` | 음량 3채널, 키보드/손, 자판, 카운트다운, 자동 다음 지문 | wa-sqlite settings |
| `useTypingGame` | 워드 디펜스 상태 | 종료 시 DB insert |

`useDB` 훅으로 직접 sync(트랜잭션 정합성).

---

## H. 화면별 명세 (요약)

- **카운트다운**: 320px RingProgress + 240pt 모노 숫자, framer spring, 1초마다 다른 톤 tick, Esc 스킵, reduced-motion 폴백
- **자리연습**: 큰 자모 카드(220pt) + 좌우 미리보기, 슬라이드 180ms, 키보드 펄스 + 손가락 spring 이동
- **낱말연습**: 단어 카드 카루셀 200pt, 좌측 직전 + 우측 다음 2~3, 25개 prefetch 윈도잉
- **단문연습**: 7줄 윈도, 완료=흐림+취소선, 현재=강조 박스, 줄 끝 자동 다음 줄, 7줄 완료 시 1.2s 후 다음 7줄 자동
- **장문연습**: 8 카테고리 chip(애국가/고전/속담/명언/에세이/한국사/과학/CS), 단락 단위 페이드+스크롤, 출처/저작권 항상 표기
- **가상 키보드**: 4행, 한/영 동시 라벨, 손가락 색상 L1~R5, 다음 키 펄스(1.2s), 누름 200ms scale/translate
- **손 오버레이**: SVG 양손, 손가락 path 분리, 다음키.finger → 부드러운 spring 이동, H 단축키 토글
- **결과 화면**: 4지표 비교 표(직전/이번/Δ/단계 목표) + 시간축 타분당 곡선 SVG + 약점 자모 Top 3 + 신기록 시 컨페티(60입자) + tada.wav

---

## I. 디자인 토큰 확장 (`src/app/globals.css`)

```css
:root {
  --motion-fast: 140ms cubic-bezier(0.2, 0, 0, 1);
  --motion-base: 220ms cubic-bezier(0.2, 0, 0, 1);
  --motion-slow: 420ms cubic-bezier(0.2, 0, 0, 1);
  --shadow-key-rest: 0 1px 0 rgba(0,0,0,0.06);
  --shadow-key-press: 0 4px 16px rgba(255,91,31,0.25);
  --glow-accent: 0 0 80px rgba(255,91,31,0.18);
  --canvas-dark: #0c0c0e;
  --game-meteor: #c2c2c2;
  --game-meteor-special-red: #ff4040;
  --game-meteor-special-purple: #a855f7;
  --game-meteor-special-gold: #facc15;
}
```

폰트: `next/font` Pretendard variable + 정적 `mulmaru.woff2`.

---

## J. 컨텐츠

| 자산 | 단계당 | 합 | 목표 |
|---|---|---|---|
| `koreanWordsByStage` | 60~80 | ≥510 | 500+ |
| `koreanSentencesByStage` | 25~30 | ≥200 | 200+ |
| `koreanPassagesByCategory` | 카테고리당 7 | ≥56 | 50+ |

**출처**: PD(애국가, 사후 70년 경과 시인 — 한국저작권위원회 DB 확인 필요), CC-BY-SA (Wikipedia, 출처 표기), 자체 작성 + AI 보조 + 인간 검수.
**검증**: `scripts/verify-content.ts`로 단계별 자모 빈도/길이 분포 검사.

---

## K. 사운드 / 모션
- 사운드 카탈로그: 타건×4 / 오타 / 카운트×3+go / 완료 / 신기록 / 게임 hit/boom / BGM. Howler.js 풀링, settings 직결, 첫 user gesture 후 unlock.
- Framer Motion variants: `cardSwap`, `countdownNumber`, `keyPress`, `resultModal`, `lineFeedScroll`. `useReducedMotion`으로 정적 폴백.

---

## L. 의존성 추가

```jsonc
{
  "dependencies": {
    "framer-motion": "^12",
    "zustand": "^5",
    "es-hangul": "^2",
    "howler": "^2",
    "@types/howler": "^2",
    "phaser": "^3.90",
    "wa-sqlite": "^0.9",
    "comlink": "^4"
  }
}
```

번들: 메인 페이지 ~360KB gzip(framer/zustand/es-hangul/wa-sqlite). Phaser는 게임 페이지 dynamic import.

---

## M. 구현 단계

> S=반나절 / M=1~2일 / L=3~5일

| # | 단계 | 추정 |
|---|---|---|
| 0 | **본 플랜 파일을 두 개로 분리** (`agency-web/docs/typing-redesign-plan.md` + `agency-web/docs/typing-asset-prompts.md`) | S |
| 1 | Pre-flight: AGENTS.md 따라 Next 16 라우팅 docs 직독 | S |
| 2 | 의존성 설치 | S |
| 3 | 디자인 토큰 + Pretendard + 물마루 폰트 | S |
| 4 | DB 모듈 (worker + repos + schema + v1 마이그레이션) | M |
| 5 | "타" 메트릭 재작성 (jamo-count.ts + metrics.ts) + 단위 테스트 | M |
| 6 | 데이터 모델 + 컨텐츠 (단계별 풀 + 8 카테고리) | M |
| 7 | Zustand 스토어 4종 + DB sync | M |
| 8 | **자산 1차 조달 (Part B 프롬프트 사용 — Recraft V3 일러스트 5+1, Flux 손 참조, Scenario 게임 스프라이트, Flux 배경, ElevenLabs SFX 9종, Suno BGM)** | M |
| 9 | 원자/분자 컴포넌트 | M |
| 10 | organism (ModeShell/Rails/ChallengeBar/VirtualKeyboard/HandOverlay/CountdownGate/ResultPanel) | L |
| 11 | 라우팅 + 5 페이지 + intercepted 결과 | M |
| 12 | 4모드 마이그레이션 (자리→낱말→단문→장문) | L |
| 13 | 카운트다운 + 도전단계 + 결과 모달 + Live Best Comparator | M |
| 14 | 자산 2차 — Phaser preload 등록, Free Texture Packer atlas, 누락 자산 보강 | S |
| 15 | 워드 디펜스 게임 (Phaser scenes + systems) | L |
| 16 | 사운드 시스템 (Howler 래퍼, useSoundFx) | S |
| 17 | 검증/테스트 (체크리스트 + Playwright + 자모 빈도 스크립트) | M |
| 18 | 문서화 + CREDITS.md + 배포 | S |

**총 추정**: 약 22~28일치 (full-focus 단독).

---

## N. 핵심 파일 (Top 8)

- `src/lib/typing/metrics.ts` — "타" 단위 재작성
- `src/lib/typing/db/worker.ts` — wa-sqlite Worker
- `src/lib/typing/db/schema.sql` — DB 스키마
- `src/components/typing/shells/ModeShell.tsx` — 4모드 공통 무대
- `src/components/typing/keyboard/VirtualKeyboard.tsx` — 시그니처 비주얼
- `src/components/typing/game/word-defense/WordDefenseGame.tsx` — Phaser 진입
- `src/lib/typing/packs.ts` — 단계별 학습 곡선
- `agency-web/docs/typing-asset-prompts.md` — Part B (자산 프롬프트 모음)

---

## O. 검증

### O.1 직접 시나리오 체크리스트

**"타" 단위**
- [ ] "안녕하세요" 입력 시 11타 카운트
- [ ] 받침 있는 글자(간) = 3타, 없는 글자(가) = 2타
- [ ] 이중모음(ㅘ = ㅗ+ㅏ) = 2타
- [ ] UI 어디에도 CPM/WPM 노출 없음
- [ ] 결과 화면: "이번 580타", "직전 542타" 형식

**저장소**
- [ ] 첫 진입: WASM 로드 후 빈 DB 초기화
- [ ] v1 보유자: 마이그레이션 후 best/keystats/streak 보존
- [ ] 새로고침 후 보존
- [ ] export → import 왕복 일치
- [ ] 100세션 누적 후 응답 < 100ms

**카운트다운 / IME / 키보드·손 / 도전단계 / 자동 다음 / 결과 / 모바일 / 음량·접근성** — 표준 체크리스트

**게임**
- [ ] 자모 단위 매칭(부분 부서짐)
- [ ] 콤보 ×1.5/×3.0 정확
- [ ] 특수 단어(빨/보/금) 동작
- [ ] 7 웨이브 + 보너스
- [ ] 60fps 유지
- [ ] HP 0 게임오버 → 결과 → DB 기록

### O.2 자동
- 단위 테스트: `jamoCountOf`, decompose, 스코어, 마이그레이션
- `scripts/verify-content.ts`
- Playwright 시각 회귀: StageMap, 4 모드 첫 프레임, 카운트다운, 결과, 게임 시작

---

## P. 위험 / 미정

| 항목 | 상태 |
|---|---|
| Next.js 16 라우팅 시그니처 | 확인 필요 (docs 직독) |
| 한컴타자 백스페이스 정정 정확도 정책 | 확인 필요 |
| es-hangul ↔ 기존 decompose 동등성 | 확인 필요 |
| wa-sqlite + Next 16 SSR | 확인 필요 (DB Provider client + dynamic) |
| Phaser + Next 16 dynamic ssr:false | 통상 OK |
| 사후 70년 PD 자료 | 확인 필요 |
| AI 자산 일관성 | 반복 시도 (시드 고정, Figma 후처리) |
| Suno 무료 티어 commercial | 확인 필요, 대안 Pixabay Music CC0 |

---

## Q. Phase 2

- 게임 2종(HP 배틀)·3종(영역 점령) — 동일 Phaser 자산 재활용
- 공개 랭킹 + 로그인 — Turso(@libsql/client, 동일 SQLite 스키마 호환)
- 세벌식 최종 자판 활성
- AI 코치 (약점 자모 기반 맞춤 드릴)
- OPFS VFS 폴백
- 모바일 전용 입력 UX

---
