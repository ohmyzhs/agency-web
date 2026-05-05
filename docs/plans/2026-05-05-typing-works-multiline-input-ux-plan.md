# typing.works 벤치마크 기반 다중 라인 타자 입력 UX 변경 플랜

## 1. 목표

현재 우리 타자연습의 `TargetText`는 낱말/단문/장문 지문을 **현재 줄 + 다음 줄 수준의 2라인 윈도우**로 보여준다. 사용자가 요청한 방향은 typing.works처럼 지문을 더 넓은 문단형 영역에 배치해 낱말연습, 단문연습, 장문연습에서 **여러 줄의 흐름을 한 번에 보고 입력**할 수 있게 만드는 것이다.

핵심 목표는 다음과 같다.

- 실제 입력 화면은 간결하게 유지한다.
- 낱말/단문/장문은 3~5줄 정도의 지문 컨텍스트를 보여준다.
- 완료/현재/미입력/오타 상태가 지문 위에서 바로 보이게 한다.
- 한글 IME 조합 중 오타 판정이 튀지 않게 한다.
- 기존 타수/정확도/DB 저장 구조는 최대한 유지한다.
- typing.works를 그대로 복제하지 않고, 우리 서비스 톤에 맞는 “집중형 문단 입력면”으로 적용한다.

## 2. typing.works 벤치마크 결과

직접 접속해 확인한 입력 UX 특징이다.

### 2.1 레이아웃

- 중앙에 넓은 문단형 타자 영역이 있다.
- 지문은 `.print` 영역 안에서 `display: flex; flex-wrap: wrap` 형태로 단어 단위 span이 이어진다.
- 영역 폭 기준으로 자동 줄바꿈된다.
- 확인 당시 약 3줄 정도가 한 화면에 보였다.
- 별도의 큰 textarea 입력 박스는 눈에 띄지 않고, 실제 textarea는 크기 0/투명에 가깝게 숨겨 입력만 받는다.

### 2.2 렌더링 단위

- 최상위 지문 토큰은 단어 단위 span에 가깝다.
- 줄바꿈 위치에는 빈 `div`가 들어가 줄 단위를 강제로 분리하는 구조가 보였다.
- 각 단어 span 내부는 글자 단위 span으로 다시 나뉘어 상태를 표시한다.
- DOM 예시 관찰:
  - 첫 단어: `span[name="now"]` / text `지금 `
  - 이후 단어: `span` / text `내 `, `옆에 `, `있는 ` 등
  - 줄바꿈: `div` width 100%, height 0

### 2.3 상태 표현

- 미입력 텍스트: 회색 `rgb(136, 136, 136)`
- 현재 입력 대상 단어: 흰색 `rgb(255, 255, 255)` + `name="now"`
- 오타: CSS `[name="wrong"] { color: rgb(254, 113, 118) !important; }`
- 완료된 글자/단어는 입력 진행에 따라 더 옅거나 완료 상태로 바뀌는 구조로 추정된다.

### 2.4 입력 방식

- 화면상 입력창은 숨겨져 있고, 사용자는 문단 위에서 바로 타이핑하는 느낌을 받는다.
- focus가 input에 있다는 느낌보다 “문단 자체를 치는” 느낌이 강하다.
- 타자 영역이 여러 줄이라 다음 단어/다음 문장의 예측이 쉽다.

### 2.5 우리가 가져올 점

가져올 것:

- 문단형 multi-line target renderer
- 숨김 또는 축소된 입력창
- 현재 단어/현재 글자 강조
- 3~5줄 컨텍스트 표시
- 라인 단위 스크롤/슬라이드

그대로 가져오지 않을 것:

- 완전 검은 배경/흰색 위주 스타일
- typing.works의 구체적인 색/DOM/브랜딩
- 단어 단위 현재 강조만으로 끝내는 방식 — 우리는 한글 IME와 자모 힌트를 고려해 글자 단위 cursor도 유지해야 함

## 3. 우리 현재 구조 분석

### 3.1 핵심 파일

- `src/components/typing/TargetText.tsx`
  - 낱말/단문/장문/속도 지문 렌더러.
  - `StandardTargetText`가 현재 지문 표시를 담당.
  - 현재 `windowRef` 높이를 line-height × 2로 강제하고, cursor line에 맞춰 `innerRef`를 translateY한다.
  - 즉, 구조적으로 “항상 2줄만 보이게 하는” 설계가 이미 들어가 있다.

- `src/components/typing/TypingInput.tsx`
  - 실제 입력 textarea.
  - 현재는 화면에 보이는 큰 입력 박스다.
  - `rows={3}`, border, padding, font-mono text-xl.

- `src/components/typing/organisms/ModeShell.tsx`
  - `<TargetText ... />` 바로 아래에 `<TypingInput ... />`을 렌더링한다.
  - `handleValueChange`에서 typed 값을 관리한다.
  - `mode !== speed-test`면 `target.length`까지만 입력을 clip한다.
  - 목표 길이에 도달하면 `doFinish()` 후 다음 target으로 자동 전환한다.

- `src/hooks/useStageContent.ts`
  - 모드별 지문 공급.
  - word는 `buildWordStreamFromStage(stage, 25~35)`로 이미 여러 단어 스트림을 만든다.
  - sentence는 단계별 문장 1개씩 공급한다.
  - longform은 passage 1개씩 공급한다.

- `src/stores/useTypingSession.ts`
  - `currentLineIdx`, `totalLines` 필드가 이미 있지만 현재 실사용은 거의 없는 상태.
  - 다중 라인 UX로 확장하기 좋은 여지가 있다.

### 3.2 현재 2라인 제한 원인

`TargetText.tsx`의 `StandardTargetText` 내부:

- `win.style.height = `${lh * 2}px`;`
- wrapper class: `overflow-hidden`
- cursor line 기준으로 `inner.style.transform = translateY(-offset)`

이 때문에 target 자체가 길어도 사용자에게는 현재 줄 주변 2줄만 보인다.

### 3.3 적용 가능성

적용 가능하다. 큰 변경 없이 1차 적용이 가능하다.

- 입력 판정/메트릭/DB는 `target`과 `typed` 문자열 기반이므로 유지 가능.
- 지문 렌더러만 다중 라인 viewport로 바꾸면 UX 체감이 크게 달라진다.
- 실제 textarea를 숨김/컴팩트 처리해 typing.works처럼 “지문에 직접 입력”하는 느낌을 줄 수 있다.

주의할 점:

- 한글 IME composition 중 마지막 글자 오타 표시를 보류해야 한다. 현재 `statusFor(..., isComposing)`가 이미 pending 상태를 제공한다.
- textarea를 완전히 0 크기로 만들면 모바일/접근성/IME 후보창 위치 문제가 생길 수 있다.
- 따라서 1차는 `sr-only` 완전 숨김보다 “시각적으로 작고 투명하지만 focus/IME 안정성을 유지하는 hidden input layer”가 안전하다.

## 4. 권장 UX 방향

### 4.1 이름

새 입력면 이름: `MultilineTypingSurface`

역할:

- target text 렌더링
- typed status overlay
- 숨김/컴팩트 textarea 포함
- 클릭 시 textarea focus
- 현재 글자/단어가 보이도록 line window 유지

### 4.2 모드별 표시 줄 수

- 낱말연습: 3줄 기본
  - 단어 스트림이 길기 때문에 3줄만 보여도 충분하다.
  - focus는 현재 단어와 다음 단어 흐름.

- 단문연습: 3~4줄 기본
  - 현재는 문장 1개가 짧으면 1~2줄로 끝난다.
  - 개선안: 단문 모드에서는 “문장 묶음”을 target으로 공급해 3~5문장이 이어지게 한다.

- 장문연습: 5줄 기본
  - 문단 필사 느낌을 살린다.
  - 현재 줄이 3번째 줄 근처에 오도록 scroll window를 이동한다.

- 속도측정: 3줄 또는 4줄
  - 기존 speed-test는 긴 word stream이므로 다중 라인과 잘 맞는다.

- 자리연습: 기존 `ZoneTargetText` 유지
  - 자리연습은 한 키/자모 집중 UI가 더 적합하다.

### 4.3 textarea 처리

1차 구현에서는 두 가지 옵션을 제공한다.

- 기본: “집중 입력”
  - 문단 surface 안쪽 하단에 1px~2px 높이 또는 투명 textarea 배치.
  - 사용자는 지문을 클릭하거나 바로 타이핑.
  - placeholder는 surface 내부 안내 문구로 대체.

- fallback: “입력창 보이기”
  - 설정 drawer에 `입력창 표시` 토글 추가 가능.
  - 모바일/접근성/IME 문제가 있으면 즉시 되돌릴 수 있다.

초기 배포는 토글 없이 hidden-like textarea로 가되, QA에서 IME 문제가 보이면 토글을 추가한다.

## 5. 구현 플랜

### Phase 0 — 브랜치/기준 정리

- 현재 브랜치 `redesign/typing-lobby-focus` 위에서 이어갈지, 별도 브랜치 `redesign/typing-multiline-surface`를 새로 딸지 결정.
- 권장: 별도 브랜치 생성.
  - 이전 로비 재구성 변경과 입력면 변경을 분리해 리뷰하기 좋다.

### Phase 1 — 렌더러 컴포넌트 분리

신규 파일:

- `src/components/typing/MultilineTypingSurface.tsx`

Props 초안:

```ts
type MultilineTypingSurfaceProps = {
  target: string;
  typed: string;
  isComposing: boolean;
  mode: TypingMode;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onValueChange: (value: string) => void;
  onCompositionChange: (composing: boolean) => void;
  onKeyDownCapture?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  placeholder?: string;
};
```

내부 책임:

- `statusFor(target, typed, isComposing)` 사용.
- `Array.from(target)` 기반 char status 렌더링.
- 단어 단위 grouping 유틸로 토큰화.
- 현재 cursor index가 포함된 token에 `current word` class 적용.
- 각 글자에는 correct/incorrect/pending/untyped class 적용.
- line-height 측정 후 viewport 높이를 `visibleLines * lineHeight`로 설정.
- cursor line이 viewport 중간에 오도록 `translateY` 조정.
- textarea는 surface 내부에 absolute 배치.

### Phase 2 — 토큰화/라인 처리 유틸

신규 유틸 후보:

- `src/lib/typing/render-tokens.ts`

기능:

```ts
type TextToken = {
  text: string;
  start: number;
  end: number;
  kind: 'word' | 'space' | 'newline';
};

export function tokenizeForTypingSurface(target: string): TextToken[];
export function tokenIndexForCursor(tokens: TextToken[], cursorIndex: number): number;
```

처음에는 줄 계산을 JS로 직접 하지 않고 CSS flex-wrap에 맡긴다. 실제 line index는 cursor span의 `offsetTop / lineHeight`로 계산한다.

### Phase 3 — TargetText 교체 방식 결정

선택지 A: `TargetText` 내부를 확장

- `TargetText`에 `variant="compact-window" | "multiline-surface"` 추가.
- `ModeShell`은 그대로 `<TargetText />`와 `<TypingInput />`를 따로 유지.
- 리스크 낮지만 typing.works 같은 “문단에 직접 입력” 느낌은 약하다.

선택지 B: `ModeShell`에서 TargetText + TypingInput을 `MultilineTypingSurface`로 통합

- `ModeShell`의 `TargetText`/`TypingInput` 부분을 mode별로 분기.
- `keyboard-zone`은 기존 TargetText + TypingInput 유지.
- `word/sentence/longform/speed-test`는 `MultilineTypingSurface` 사용.
- typing.works와 가장 유사하고 UX 개선 폭이 크다.

권장: **선택지 B**.

### Phase 4 — 단문 모드 target 길이 조정

현재 단문은 문장 1개만 target으로 들어와서 다중 라인 surface를 만들어도 짧을 수 있다.

수정 위치:

- `src/hooks/useStageContent.ts`

변경안:

- `mode === 'sentence'`일 때 문장 3~5개를 묶어 하나의 target으로 반환하는 helper 추가.
- stage가 낮으면 3문장, 높으면 2~3문장만 묶어 난이도 조절.

예시:

```ts
function chunkSentences(sentences: string[], perTarget: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < sentences.length; i += perTarget) {
    out.push(sentences.slice(i, i + perTarget).join(' '));
  }
  return out;
}
```

권장 perTarget:

- 단계와 무관하게 4문장 고정.
- 타수 단계에 따라 문장 수를 바꾸면 사용자가 단계 변경 때 연습 단위가 달라져 흐름을 예측하기 어렵다.
- 난이도는 이미 단계별 문장 길이/어휘/자모 분포에서 조절하고, UX 단위는 항상 4문장으로 유지한다.

### Phase 5 — 낱말 모드 target 길이 조정

현재 word stream은 `25 + (idx % 3) * 5` 단어다. 다중 라인에서는 충분하지만 줄 수가 viewport 폭에 따라 다르다.

변경안:

- desktop: 30~40단어
- mobile: 기존 25단어 유지 또는 CSS만 3줄로 제한

최초 구현에서는 현재 word stream 유지. 필요 시 후속 튜닝.

### Phase 6 — 장문 모드 viewport 튜닝

장문은 이미 passage가 길다.

변경안:

- `visibleLines=5`
- top/bottom mask gradient는 유지하되 현재 줄 전후 문맥이 충분히 보이게 한다.
- 현재 줄이 맨 위에 붙지 않도록 `scrollOffset = max(0, lineIdx - 2) * lineHeight` 사용.

### Phase 7 — 스타일 가이드

색상은 typing.works와 달리 우리 디자인 토큰을 사용한다.

- 완료 correct: `text-zinc-400 dark:text-zinc-500`
- 오타 incorrect: `text-red-600 dark:text-red-400 underline decoration-red-500/70`
- 조합/pending: `bg-amber-200/80 dark:bg-amber-700/50 rounded-sm`
- 현재 글자 cursor: `bg-primary/15 ring-1 ring-primary/30 rounded-sm`
- 현재 단어: `text-foreground`
- 미입력: `text-muted-foreground/70`

Surface 컨테이너:

- `rounded-2xl border border-border bg-card shadow-sm`
- 내부는 큰 타자용 font:
  - word: `font-mono text-2xl sm:text-3xl leading-[1.65] tracking-[0.04em]`
  - sentence/longform: `font-sans text-xl sm:text-2xl leading-[1.75]`

### Phase 8 — 모바일/IME/접근성 QA

필수 확인:

- macOS Chrome 한글 2벌식 조합 중 pending 표시가 오타로 번쩍이지 않는지.
- Backspace 동작.
- target 끝까지 입력 시 자동 다음 지문 전환.
- 단문 target 묶음 완료 후 기록 저장이 1세션으로 저장되는지.
- textarea가 숨겨져도 IME 후보창 위치가 이상하지 않은지.
- 모바일에서 soft keyboard가 뜨고 입력 가능한지.
- 클릭/Tab focus 접근성.

접근성:

- surface에 `role="group"`, `aria-label="타자 연습 지문 및 입력 영역"`.
- 숨김 textarea에는 기존 `aria-label="타자 입력"` 유지.
- screen reader 사용자용으로 입력창 표시 fallback을 고려.

## 6. 예상 변경 파일

필수:

- `src/components/typing/MultilineTypingSurface.tsx` 신규
- `src/lib/typing/render-tokens.ts` 신규
- `src/components/typing/organisms/ModeShell.tsx` 수정
- `src/hooks/useStageContent.ts` 수정
- `src/components/typing/TypingInput.tsx` 수정 또는 variant prop 추가

선택:

- `src/components/typing/TargetText.tsx` 일부 유지/정리
- `src/stores/useTypingSettings.ts`에 `showInputBox` 또는 `typingSurfaceStyle` 설정 추가
- `src/components/typing/organisms/RightSettingsRail.tsx`에 입력창 표시 토글 추가

## 7. 구현 순서

1. `redesign/typing-multiline-surface` 브랜치 생성.
2. `render-tokens.ts` 작성 및 간단 테스트 가능한 순수 함수로 구현.
3. `MultilineTypingSurface.tsx` 작성.
4. `ModeShell`에서 `keyboard-zone` 외 모드는 새 surface 사용하도록 분기.
5. `TypingInput`에 `variant="visible" | "surface-hidden"` 또는 className prop 추가.
6. `useStageContent`의 sentence 공급을 문장 묶음으로 변경.
7. lint/build 실행.
8. 로컬 production 서버에서 `/typing/word`, `/typing/sentence`, `/typing/longform`, `/typing/result` smoke.
9. 브라우저 QA:
   - 지문 3~5줄 표시 확인.
   - typing.works처럼 현재 단어/글자 진행 확인.
   - console error 0 확인.
10. 커밋/푸시 후 리뷰 URL 제공.

## 8. 리스크와 대응

### 리스크 1 — textarea 숨김으로 IME 후보창 위치 이상

대응:

- textarea를 완전히 `display:none`/`visibility:hidden` 하지 않는다.
- surface 내부 현재 줄 근처에 opacity 0, width/height 최소값으로 배치한다.
- 문제가 있으면 `입력창 표시` 설정을 추가한다.

### 리스크 2 — 단문 묶음으로 세션 길이가 길어져 초보자 부담

대응:

- stage별 묶음 개수를 다르게 한다.
- 낮은 단계는 짧은 문장 여러 개, 높은 단계는 긴 문장 2개 정도.
- 완료 후 자동 다음 지문 흐름은 유지한다.

### 리스크 3 — 긴 target에서 char span이 많아져 렌더 비용 증가

대응:

- 장문 passage가 아주 길면 visible window 주변만 렌더링하는 virtualization을 2차로 고려.
- 1차는 현 passage 길이 기준으로 전체 span 렌더링도 허용 가능할 가능성이 높다.

### 리스크 4 — 오타/정확도 계산과 표시 불일치

대응:

- 기존 `statusFor`, `computeLiveMetricsJamo`를 그대로 사용한다.
- 렌더러만 바꾸고 입력 판정 로직은 건드리지 않는다.

## 9. 완료 기준

- `/typing/word`: 3줄 이상의 낱말 스트림이 보이고 현재 단어/글자가 강조된다.
- `/typing/sentence`: 단문이 1문장 단위가 아니라 여러 문장 묶음으로 보여 3~4줄 컨텍스트가 생긴다.
- `/typing/longform`: 5줄 문단 필사 surface가 보이고 현재 줄을 따라 부드럽게 이동한다.
- 사용자는 별도 큰 입력창이 아니라 지문 자체에 입력하는 느낌을 받는다.
- 한글 IME 조합, Backspace, 자동 다음 지문, 타수/정확도 저장이 깨지지 않는다.
- `npm run lint`와 `npm run build` 통과.
- 브라우저 console error 0.

## 10. 권장 결론

적용 가능하며, 우선순위는 높다. 이전 작업에서 `/typing`을 로비/SEO 페이지로 분리하고 실제 연습 화면을 간결화했기 때문에, 이번 변경은 그 다음 단계로 잘 맞는다.

가장 좋은 방향은 기존 2라인 `TargetText + 큰 TypingInput` 구조를 낱말/단문/장문/속도 모드에서 `MultilineTypingSurface`로 통합하는 것이다. 자리연습은 기존 단일 키 집중 UI가 더 적합하므로 유지한다.
