# 워드 디펜스 asset/입력 UX 개선 플랜

## 배경

워드 디펜스 게임은 현재 Phaser scene 내부에서 배경, 운석 halo, 우주선, 파티클을 절차적으로 그린다. 사용자가 Telegram으로 전달한 생성 asset은 `public/typing/illustrations/`에 들어와 있지만 아직 게임에 연결되지 않았다. 또한 하단 입력란이 full width이고, 입력 값이 바로 보이지 않거나 게임 오브젝트와 분리되어 있어 실제 “단어를 타겟팅해서 쏜다”는 느낌이 약하다.

## 요구사항

1. 하단 입력란 UX
   - 내가 입력하는 단어 글자가 보이도록 한다.
   - full width 입력란을 제거하고, 우주선 하단에 최대 5글자 정도 들어가는 작은 텍스트 박스로 바꾼다.
   - 게임이 playing 상태일 때만 활성화하고, 시작 전/종료 후에는 게임 overlay로 안내한다.

2. 우주선/입력란 이동
   - 단어 입력을 시작하면 매칭 중인 단어의 중심부 하단으로 우주선과 텍스트박스가 이동한다.
   - 아직 타겟이 없으면 중앙 하단에 대기한다.
   - 단어를 파괴하거나 입력이 끊기면 자연스럽게 다음 타겟 또는 중앙으로 이동한다.

3. Asset 연결
   - `space-bg.png`: 게임 배경으로 사용한다.
   - `game-static-sheet.jpeg`: 스프라이트 시트로 분석/분리해서 우주선, 운석/오브젝트 후보를 사용한다.
   - `explosion.jpeg`: 폭발 스프라이트 시트로 분리해서 destroy 애니메이션으로 사용한다.
   - `ui_sub.jpeg`: UI frame/panel 요소를 분리하거나, 불가능하면 입력 박스/패널 스타일 참고 asset으로 사용한다.
   - `hands-reference.png`: 이번 워드디펜스 게임에는 직접 쓰지 않고 provenance/후속 손가락 가이드 참고 asset으로 유지한다.

4. 작업 방식
   - 구현 전 asset inventory와 crop 결과를 남긴다.
   - 가능하면 Claude Code에 코드 구현을 위임한다.
   - 완료 후 lint/build/browser QA를 수행한다.
   - Obsidian에 블로그 글감용 build log를 남긴다.

## 작업 분할

### Task A — Asset 분석/분리

- 이미지 크기 확인: `explosion.jpeg` 1024×1024, `game-static-sheet.jpeg` 1024×1024, `space-bg.png` 1536×1024.
- `game-static-sheet.jpeg`는 4×4 grid crop으로 분리한다.
- `explosion.jpeg`는 단일 4×4 grid가 아니라 mixed atlas로 처리한다.
  - 상단 256px: 8×2개의 128×128 early frames.
  - 하단 768px: 4×3개의 256×256 main/fade frames.
  - Phaser spritesheet 재생을 위해 28개 frame을 모두 256×256 canvas에 repack하여 `2048×1024` uniform sheet로 저장한다.
- JPEG magenta 배경은 artifact tolerance를 둔 chroma key로 alpha 처리한다.
- output path:
  - `public/typing/game/word-defense/sprites/static-00.jpeg` …
  - `public/typing/game/word-defense/sprites/keyed/explosion-00.png` … `explosion-27.png`
  - `public/typing/game/word-defense/sprites/keyed/explosion-sheet.png`
- 브라우저에서 직접 로딩 가능한 public path를 사용한다.

### Task B — Phaser scene asset화

- `GameScene.preload()` 추가.
- 배경: `space-bg.png`를 `TileSprite` 또는 cover image로 렌더링.
- 우주선: `game-static-sheet`에서 분리된 프레임을 Phaser texture로 로드 후 `ship` GameObject에 사용.
- 폭발: `explosion` grid frames를 animation으로 등록 후 파괴 시 재생.
- 기존 procedural texture는 fallback으로만 유지한다.

### Task C — 입력 UX / 타겟 추적

- React 외부 input은 보이는 full-width field 대신 화면 overlay의 작은 box로 변경한다.
- Phaser scene이 `aim` event로 현재 타겟 좌표/입력 문자열/활성 여부를 React에 emit한다.
- React overlay는 host container 안에서 absolute positioned input box를 렌더링한다.
- input value는 clear하지 않고 현재 composing/typed prefix가 보이도록 controlled state로 유지한다.
- jamo 입력은 기존처럼 `disassemble`해서 bus로 보내되, scene이 target prefix를 기준으로 active target을 유지한다.

### Task D — 검증

- `npm run lint`
- `npm run build`
- `/typing/game/word-defense` production start browser QA
- 확인 항목:
  - 입력란이 작은 box로 보인다.
  - 글자가 입력란에 표시된다.
  - 첫 자모 입력 후 우주선/입력란이 매칭 단어 아래로 이동한다.
  - asset 배경/스프라이트가 깨지지 않는다.

## 비목표

- public leaderboard/auth 구현은 포함하지 않는다.
- 손가락 guide/hands-reference 실제 적용은 후속 작업으로 둔다.
- asset 원본의 미세한 수작업 리터칭은 이번 범위에서 제외한다.
