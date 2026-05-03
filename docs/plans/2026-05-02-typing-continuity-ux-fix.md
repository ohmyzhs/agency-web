# 타자연습 입력 연속성/UX 수정 플랜

## 목표
사용자가 타자 입력을 시작한 뒤 명시적으로 종료/다음/재시작을 의도하기 전까지 입력 포커스와 페이지 스크롤이 절대 다른 곳으로 이동하지 않게 한다. 지문/키보드/도전단계/자리연습 UI를 실제 연습 흐름 중심으로 재배치한다.

## 핵심 요구사항
1. 입력 연속성
   - 지문 1개 완료 후에도 textarea는 disabled 되지 않는다.
   - 완료 직후 Space/Enter가 페이지 스크롤, 버튼 포커스, 다른 요소 활성화를 일으키면 안 된다.
   - 완료/다음 지문 전환 중 `document.activeElement`는 입력란이어야 한다.
   - `window.scrollY`는 완료 전후 임의로 바뀌면 안 된다.
   - 포커스 복구 시 `focus({ preventScroll: true })`를 사용한다.

2. 입력란 강조
   - 페이지 진입 시 사용자 타이핑 입력란을 즉시 포커스한다.
   - 입력란은 시각적으로 가장 중요한 영역처럼 보이도록 카드/링/라벨을 강화한다.
   - 사용자의 명시적 버튼 클릭 외에는 포커스가 빠지면 다시 입력란으로 돌아온다.

3. 지문 UX
   - 지문 맨 앞의 주황색 세로 커서 라인을 제거한다.
   - 낱말연습/속도측정은 지문란 내부 스크롤이 없어야 한다.
   - 지문은 최대 2줄만 보이게 한다.
   - 1줄: 지금 타이핑할 라인, 짙고 굵게 표시.
   - 2줄: 다음 라인 미리보기, 옅게 표시.
   - 현재 라인을 완료하면 두 줄이 위로 시프트되는 느낌으로 다음 라인을 이어서 표시한다.

4. 도전단계
   - 현재 상단 ChallengeBar는 과도하므로 크기를 줄인다.
   - 위치를 입력/키보드 아래, 메인 연습 영역 하단으로 이동한다.

5. 가상 키보드
   - 실제 키보드 배치처럼 가운데 정렬 기준으로 맞춘다.
   - 숫자열/윗줄/홈줄/아랫줄/스페이스 바가 시각적으로 균형 있게 보이도록 폭과 들여쓰기를 조정한다.

6. 자리연습 단계 이동
   - 자리연습 메뉴 안에서 1~8단계/레슨을 직접 이동 가능하게 한다.
   - route-locked `/typing/zone` 상태에서도 레슨 선택 UI가 보여야 한다.

7. 자리연습 전용 지문 UI
   - 일반 지문 UI와 다르게, 현재 눌러야 할 키 하나만 크게 하이라이트한다.
   - 나머지 키들은 좌→우로 작게 이어지고, 입력이 진행되면 시프트되는 형태로 표시한다.
   - 첨부 이미지와 비슷하게 “입력할 자리” 카드 + 주변 preview 형태.

## 권장 구현 순서
1. ModeShell completion flow 수정
   - `doFinish(completedTyped?)`로 변경해 stale typed 문제 제거.
   - 비 speed-test 완료 후 `finishSession()`로 finished/disabled 상태에 들어가지 않고, 결과 기록 후 즉시 다음 target으로 전환한다.
   - DB 기록은 비동기 fire-and-forget로 처리하고 UI 연속성은 즉시 유지한다.
   - `focusTypingInput()` helper를 만들고 `preventScroll` 적용.
   - Space/Enter 기본 동작 차단은 textarea capture에서 처리한다.

2. TargetText 재설계
   - 일반 2라인 표시 컴포넌트와 keyboard-zone 전용 컴포넌트 분리.
   - cursor border 제거.
   - `overflow-y-auto` 제거.

3. Layout 조정
   - ChallengeBar를 하단으로 이동하고 compact variant를 추가하거나 class를 축소.
   - TypingInput 디자인 강조.

4. KoreanKeyboard 정렬 개선
   - numberRow 포함 여부 검토.
   - rows는 `justify-center`, 실제 키보드별 width/indent 사용.

5. Zone lesson selector 추가
   - `zoneLessons`를 사용해 자리연습일 때 1~8단계 선택 버튼 노출.
   - 필요하면 packs.ts에 8개 레슨으로 확장.

## 검증 체크리스트
- `npm run lint`
- `npm run build`
- 로컬 `next start` 후 브라우저 QA
- `/typing/word`: 긴 지문에 내부 스크롤이 없고 2줄만 표시되는지
- `/typing/sentence`: 입력 완료 후 textarea focus 유지, scrollY 불변
- `/typing/zone`: 1~8단계 선택 가능, 현재 키만 하이라이트
- 완료 직후 Space/Enter를 눌러도 페이지가 스크롤되지 않는지
