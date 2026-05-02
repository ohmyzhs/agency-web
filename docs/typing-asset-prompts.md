# /typing 자산 프롬프트 모음

> 구현 계획은 [`typing-redesign-plan.md`](./typing-redesign-plan.md) 참조.

> 각 프롬프트는 **자체 완결형 한 덩어리**. 한 번에 하나씩 복사해서 해당 도구에 붙여넣으면 됩니다.
> 모든 이미지 자산에는 **출력 사이즈와 비율**을 명시했습니다.

## 0. 사용 가이드

### 권장 도구 (사용자 보유)

| 자산 유형 | 1순위 | 대안 |
|---|---|---|
| 일러스트 / UI 이미지 (래스터) | **gpt-image-2** (OpenAI) | nanobanana 2 (Gemini) |
| **스프라이트 시트 (단일/32+컷)** | **gpt-image-2** | nanobanana 2 |
| 벡터 / SVG 참조 | **Imagen 4** (Google Flow) — SVG 직접 출력은 검토 필요 | gpt-image-2 결과를 vectorizer.ai로 트레이스 |
| 영상 (애니메이션 시퀀스) | **Veo 3.1 Fast** (Google) | — |
| 효과음 SFX | **ElevenLabs Sound Effects** | Bfxr (웹 무료) |
| BGM 루프 | **Suno v4** | Udio |

> **핵심 메모**: gpt-image-2는 32컷 이상 결합된 스프라이트 시트도 매우 잘 만든다. 폭발 애니메이션, 운석 회전 시퀀스 등은 **영상 AI 없이 한 장 시트로 직접 생성** 가능.

### gpt-image-2 / nanobanana 2 지원 사이즈 (참고)

표준 비율:
- `1024 × 1024 px` (1:1, square)
- `1536 × 1024 px` (3:2, landscape)
- `1024 × 1536 px` (2:3, portrait)
- 일부 플랫폼은 `1792 × 1024` / `1024 × 1792` 도 지원 (모델/UI별 — 확인 필요)

**모든 일러스트는 retina 대응을 위해 표시 사이즈의 2~3배로 생성** → UI에서 다운스케일 또는 `next/image` srcset.

### 무료 후처리 도구
- **Piskel** (piskelapp.com) — 픽셀아트, 알파, 영역별 crop
- **Figma** (무료) — 벡터 정리, 색상 보정, SVG export
- **ffmpeg** (CLI) — 영상→프레임, 오디오 정규화
- **Free Texture Packer** (free-tex-packer.com) — atlas + JSON 자동 생성
- **vectorizer.ai** (무료 티어) — PNG → SVG

---

## 1. 스테이지맵 모드 카드 (5개)

각 카드 한 번에 하나씩 생성. **gpt-image-2** 권장 (스타일 일관성).

- **출력 사이즈**: `1024 × 1024 px (1:1 square)`
- **UI 표시 사이즈**: 카드 내 320~480 px (≥ 2× 다운스케일로 retina 대응)
- **파일명**: `stage-zone.png`, `stage-word.png`, `stage-sentence.png`, `stage-longform.png`, `stage-game.png`
- **후처리**: gpt-image-2 결과 → Figma import → 색상 보정(`#ff5b1f` 정확도 확인) → vectorizer.ai로 SVG 트레이스 시도(반응형 자유) → 어려우면 PNG `1024 × 1024` 그대로 + `next/image` lazy

### 1.1 자리연습 (1024 × 1024)

```
Generate a clean isometric editorial illustration at 1024 by 1024 pixel square aspect ratio. Show a single mechanical keyboard floating gently in a soft warm beige void background of color #fafaf8, with one home-row keycap glowing softly with a warm burnt-orange light of color #ff5b1f, a subtle finger-shaped beam of warm light hovering above that key from outside the frame, no hands visible, focus on tactile precision and quiet elegance, flat shading with subtle gradient highlights, warm neutral gray shadows, no harsh outlines, generous negative space around the keyboard, friendly modern editorial illustration style inspired by minimalist Korean design language, single dominant accent color burnt orange used sparingly only on the highlighted key and the light beam, all other elements in warm neutral grays from #444339 to #dcdbd3, no text no letters no Korean characters no Latin alphabet no watermark no signature, high resolution vector-friendly clean shapes, output dimensions 1024 by 1024 pixels exactly
```

### 1.2 낱말연습 (1024 × 1024)

```
Generate a clean isometric editorial illustration at 1024 by 1024 pixel square aspect ratio. Show small floating word balloons made of pastel paper card material drifting upward like dandelion seeds against a soft warm beige sky background of color #fafaf8, balloons rendered as simple geometric paper card shapes with subtle thread tails, one balloon glowing with a warm burnt-orange ribbon and accent of color #ff5b1f tied to it, gentle breeze indicated by soft motion lines, no faces or characters on balloons, flat shading with subtle gradient highlights, warm neutral gray shadows, no harsh outlines, generous negative space, friendly modern editorial illustration style inspired by minimalist Korean design language, single dominant accent color burnt orange used sparingly only on the one ribbon balloon, all other balloons and elements in warm neutral grays from #444339 to #dcdbd3, no text no letters no Korean characters no Latin alphabet no watermark no signature, high resolution vector-friendly clean shapes, output dimensions 1024 by 1024 pixels exactly
```

### 1.3 단문연습 (1024 × 1024)

```
Generate a clean isometric editorial illustration at 1024 by 1024 pixel square aspect ratio. Show a single open notebook resting on a wooden desk surface, with one ruled line on the page glowing softly with warm burnt-orange highlight of color #ff5b1f as if a sentence is currently being written on it, a soft pencil resting beside the notebook angled toward the glowing line, gentle warm light from above, no visible writing or text on the page, focus on the act of writing one elegant line, flat shading with subtle gradient highlights, warm neutral gray shadows, no harsh outlines, soft warm beige background of color #fafaf8 with generous negative space around the desk, friendly modern editorial illustration style inspired by minimalist Korean design language, single dominant accent color burnt orange used sparingly only on the glowing ruled line, all other elements including notebook pages and pencil in warm neutral grays from #444339 to #dcdbd3, no text no letters no Korean characters no Latin alphabet no watermark no signature, high resolution vector-friendly clean shapes, output dimensions 1024 by 1024 pixels exactly
```

### 1.4 장문연습 (1024 × 1024)

```
Generate a clean isometric editorial illustration at 1024 by 1024 pixel square aspect ratio. Show a stack of three open books layered as if forming a small library island, the top book having a warm burnt-orange bookmark ribbon of color #ff5b1f gently draped across one page, a soft reading lamp positioned beside the stack casting a warm gentle glow, serene calm library atmosphere, no visible text or words on any of the book pages, books rendered with simple page edges and softly curved spines, soft warm beige background of color #fafaf8 with generous negative space, flat shading with subtle gradient highlights, warm neutral gray shadows, no harsh outlines, friendly modern editorial illustration style inspired by minimalist Korean design language, single dominant accent color burnt orange used sparingly only on the bookmark ribbon, all other elements including book covers and lamp in warm neutral grays from #444339 to #dcdbd3, no text no letters no Korean characters no Latin alphabet no watermark no signature, high resolution vector-friendly clean shapes, output dimensions 1024 by 1024 pixels exactly
```

### 1.5 게임 — Word Defense (1024 × 1024)

```
Generate a clean isometric editorial illustration at 1024 by 1024 pixel square aspect ratio. Show a night sky scene with a small minimalist spaceship silhouette positioned at the bottom firing a warm burnt-orange laser beam of color #ff5b1f upward into the sky, three softly rendered meteor shapes falling from the top of the frame in varying sizes, dark navy gradient background fading to soft warm beige horizon at the bottom, dynamic energy and motion suggested by the laser trajectory and falling meteors, flat shading with subtle gradient highlights, warm neutral gray shadows for the spaceship and meteors, no harsh outlines, no fire or smoke effects only clean geometric shapes, friendly modern editorial illustration style inspired by minimalist Korean design language, single dominant accent color burnt orange used only on the laser beam, all other elements including spaceship and meteors in warm neutral grays from #444339 to #dcdbd3, no text no letters no Korean characters no Latin alphabet no watermark no signature, high resolution vector-friendly clean shapes, output dimensions 1024 by 1024 pixels exactly
```

---

## 2. 양손 SVG 참조 이미지

손 위치 가이드용. AI 결과를 Figma에서 손가락 10개 path 분리 트레이스. **gpt-image-2** 권장 (대안: nanobanana 2 / Imagen 4 in Google Flow).

- **출력 사이즈**: `1536 × 1024 px (3:2 landscape)` — 양손 가로 펼침
- **UI 표시 사이즈**: 키보드 위 ~720 px 폭에 오버레이
- **파일명**: `hands-reference.png` → 트레이스 후 `hands.svg`
- **후처리**: Figma import → Pen tool로 손가락 10개 path → `id="finger-L1"` ~ `"finger-R5"` → SVG export → `agency-web/public/typing/hands.svg`

```
Generate a top-down view illustration at 1536 by 1024 pixel landscape aspect ratio. Show two relaxed human hands hovering in standard touch-typing position over a transparent area, palms slightly visible, all ten fingers spread naturally with index fingers resting where home-row keys would be, neutral light skin tone with subtle shading, no keyboard visible only the hands, flat 2D illustration style with clean line art, soft warm beige background of color #fafaf8, very subtle drop shadow under each finger, no jewelry no watch no nail polish, palms angled slightly with fingertips lowered as if just about to press keys, geometric simplification of hand anatomy keeping shapes clean and trace-friendly for vector conversion, no harsh outlines, gentle gradient highlights, friendly modern editorial illustration style, no text no letters no Korean characters no Latin alphabet no watermark no signature, high resolution, output dimensions 1536 by 1024 pixels exactly
```

---

## 3. 워드 디펜스 — 게임 정적 스프라이트 시트 (한 장에 모두)

게임의 모든 정적 객체(운석 3종 + 우주선 + 파워업 gem)를 한 시트에. **gpt-image-2** 권장(시트 매우 잘 만듬).

- **출력 사이즈**: `1024 × 1024 px (1:1)` — 4×4 그리드, 각 셀 256 × 256 px
- **시트 레이아웃**: 가로 4칸 × 세로 4칸 = 16 슬롯 (남는 칸은 공백)
  - Row 1: meteor-small (256), meteor-medium (256), meteor-large (256), spaceship (256)
  - Row 2: power-up gem (256), 빈칸 ×3 (확장 여지)
- **각 스프라이트 실제 표시 사이즈** (Phaser 안에서 렌더):
  - meteor-small 64 × 64
  - meteor-medium 96 × 96
  - meteor-large 128 × 128
  - spaceship 64 × 64
  - gem 48 × 48
  → 시트 셀 256은 padding 포함, Phaser에서 텍스처를 setScale로 축소
- **파일명**: 시트 `game-static-sheet.png` → 분리 후 개별 PNG (`meteor-s.png`, `meteor-m.png`, `meteor-l.png`, `ship.png`, `gem.png`)

```
Generate a 2D pixel art sprite sheet at 1024 by 1024 pixel square aspect ratio on a solid magenta chroma-key background of color #ff00ff for easy alpha removal. Arrange a 4 by 4 grid of 256 by 256 pixel cells. Fill the grid as follows: top-left cell shows a small rocky meteor with rough textured surface and warm burnt-orange #ff5b1f glowing edge highlights and neutral gray rocky body color #61605a; top-second cell shows a medium meteor with same style at larger scale; top-third cell shows a large meteor at even larger scale; top-right cell shows a minimalist top-down spaceship with neutral gray hull and warm orange engine accents and clean geometric shape with two small wings; second-row first cell shows a glowing power-up gem with warm orange crystalline facets and subtle inner light; all remaining cells of rows 2 through 4 are empty solid magenta. All sprites must be centered within their respective 256 by 256 cells with consistent pixel art style at the same pixel density, no anti-aliasing on edges, no shadows under sprites, no text no letters no numbers no Korean characters no Latin alphabet no watermark no signature, output dimensions 1024 by 1024 pixels exactly with crisp pixel art aesthetic
```

**후처리**:
1. ffmpeg chromakey로 magenta → alpha:
   ```
   ffmpeg -i game-static-sheet.png -vf "chromakey=0xff00ff:0.1:0.0" -c:v png game-static-sheet_alpha.png
   ```
2. Piskel에서 256 × 256 셀 단위로 영역 crop → 5개 PNG.
3. `agency-web/public/typing/sprites/`에 배치.
4. Phaser preload: `this.load.image('meteor-s', '/typing/sprites/meteor-s.png')` 등.
5. 색 변형: `setTint()` — 빨강(0xff4040) / 보라(0xa855f7) / 금(0xfacc15).

---

## 4. 워드 디펜스 — 폭발 애니메이션 스프라이트 시트 (32컷, gpt-image-2 직접)

> **권장 경로**: gpt-image-2가 32컷 시트도 잘 만들므로 영상 AI 없이 한 장으로 해결.

- **출력 사이즈**: `1024 × 1024 px (1:1)` — 8×4 그리드 = 32 프레임
- **각 프레임 사이즈**: `128 × 128 px`
- **재생 속도**: 30 FPS → 약 1초 애니메이션 (32 frame ≈ 1.07초)
- **파일명**: `explosion.png` + Free Texture Packer로 `explosion.json` atlas

```
Generate a 2D pixel art animation sprite sheet at 1024 by 1024 pixel square aspect ratio on a solid magenta chroma-key background of color #ff00ff for easy alpha removal. Arrange a precise 8 by 4 grid of 128 by 128 pixel cells, total 32 frames showing a complete radial explosion animation sequence in reading order from top-left to bottom-right. Frames 1 through 4 show the initial bright flash forming a small intense core in warm yellow and orange #facc15 and #ff5b1f. Frames 5 through 12 show the explosion expanding rapidly outward with particles bursting in all radial directions in warm orange and yellow tones. Frames 13 through 22 show the explosion at peak size with debris particles scattering and a hollowing center. Frames 23 through 32 show the explosion dissipating with particles fading and dispersing until the final frame is nearly empty. Each frame must be centered within its 128 by 128 cell, the explosion must always remain fully contained within the cell with no clipping, particles only no fire and no smoke trails, classic retro game pixel art aesthetic with crisp pixels and no anti-aliasing, consistent style across all 32 frames, no text no letters no numbers no Korean characters no Latin alphabet no watermark no signature, output dimensions 1024 by 1024 pixels exactly
```

**후처리**:
1. magenta → alpha (위와 동일 ffmpeg chromakey).
2. Free Texture Packer (free-tex-packer.com)에 8×4 그리드 시트 import → atlas + JSON 자동 생성.
   - 또는 수동 JSON 작성:
     ```json
     { "frames": [ {"filename":"f00","frame":{"x":0,"y":0,"w":128,"h":128}}, ... ] }
     ```
3. `agency-web/public/typing/sprites/explosion.{png,json}`로 저장.
4. Phaser preload: `this.load.atlas('explosion', '/typing/sprites/explosion.png', '/typing/sprites/explosion.json')` 후 `this.add.sprite(x,y,'explosion').play({key:'explode', frameRate:30})`.

---

## 5. 워드 디펜스 — 우주 배경 (parallax 3 layer 한 장에)

3 layer를 가로로 나란히 (parallax tile에 적합한 가로 형태). **gpt-image-2** 또는 **nanobanana 2**.

- **출력 사이즈**: `1536 × 1024 px (3:2 landscape)`
- **레이아웃**: 세로 3등분, 각 strip `1536 × 341 px` (가로 seamless tile)
- **파일명**: 분리 후 `space-bg-1.png` (먼 별), `space-bg-2.png` (중간), `space-bg-3.png` (가까운 별)

```
Generate a 2D pixel art space background composition at 1536 by 1024 pixel landscape aspect ratio, divided into three distinct horizontal strips stacked top to bottom. Each strip is exactly 1536 by 341 pixels tall, designed to seamlessly tile horizontally when scrolled left to right for a parallax scrolling effect. Top strip: dense scattered tiny pixel stars on a deep navy background of color #0c0c0e suggesting far galaxy depth. Middle strip: fewer larger pixel stars and a few small distant nebula clouds in muted purple and blue tones on the same deep navy background. Bottom strip: only a few prominent foreground stars and faint diagonal light streaks on the same deep navy background. All three strips share the same deep navy base color for seamless visual continuity. The leftmost edge and rightmost edge of each strip must match perfectly so the strip can tile horizontally without visible seams. No planets no moons no rockets only stars and minimal nebula, no text no letters no Korean characters no Latin alphabet no watermark no signature, crisp pixel art style with no anti-aliasing, output dimensions 1536 by 1024 pixels exactly
```

**후처리**: Piskel/Photoshop으로 3등분 horizontal crop (`y:0~340`, `y:341~681`, `y:682~1023`) → 각 strip의 가로 tile 정합성 확인 → `space-bg-1.png`, `space-bg-2.png`, `space-bg-3.png`. Phaser `tileSprite`로 다른 속도(예: 20/40/80 px/s)로 좌측 무한 스크롤.

---

## 6. UI 보조 — 신기록 리본/메달/별 (한 장)

5개 아이콘을 한 시트에. **gpt-image-2**.

- **출력 사이즈**: `1024 × 1024 px (1:1)` — 5×1 그리드 또는 자유 배치
- **개별 아이콘 표시 사이즈**: 신기록 리본 ~120 × 80 / 메달 ~64 × 96 / 별 32 × 32 / 컨페티 입자 16 × 12
- **파일명**: 분리 후 SVG 트레이스 → `ribbon-best.svg`, `medal.svg`, `star-filled.svg`, `star-outline.svg`, `confetti-piece.svg`

```
Generate a 2D flat icon sprite sheet at 1024 by 1024 pixel square aspect ratio on a solid magenta background of color #ff00ff for easy alpha removal. Arrange five distinct icons in a single horizontal row centered vertically, with even spacing between each icon and generous margins for clean cropping. From left to right: (1) a minimalist medal icon approximately 200 by 280 pixels with a circular center and two ribbon tails hanging below, in warm burnt-orange color #ff5b1f; (2) a flat ribbon banner shape approximately 320 by 200 pixels in warm burnt-orange suitable for placing achievement text on top later; (3) a small glowing five-pointed solid star icon approximately 200 by 200 pixels in warm burnt-orange with subtle inner glow; (4) a five-pointed star outline icon approximately 200 by 200 pixels in warm burnt-orange without fill; (5) a confetti-piece icon approximately 120 by 80 pixels showing a small angled rectangular shape in warm burnt-orange. All icons rendered in clean flat geometric style with no gradients no shadows no outlines except where structurally needed, all icons in the same warm burnt-orange color #ff5b1f without any other colors. No text no letters no numbers no Korean characters no Latin alphabet no watermark no signature, vector-friendly clean shapes, output dimensions 1024 by 1024 pixels exactly
```

**후처리**: magenta → alpha → Piskel로 5개 분리 → vectorizer.ai 무료 티어로 SVG 트레이스 → 개별 SVG로 저장.

---

## 7. (대안) 폭발 애니메이션 영상 — Veo 3.1 Fast

#4의 gpt-image-2 직접 시트가 1순위. 영상 품질이 더 좋으면 Veo 3.1 Fast 사용:

- **출력 사이즈/길이**: `512 × 512 px`, 1.5초, 30 fps (Veo 3.1 Fast 기본 — 확인 필요)
- **파일명**: `explosion-raw.mp4` → 프레임 추출 후 atlas

```
Create a 1.5 second pixel art explosion animation video at 512 by 512 pixel square aspect ratio at 30 frames per second. Show warm orange and yellow particles bursting outward radially from a central point on a solid magenta background of color #ff00ff for chroma key removal. The animation must contain three clear phases: an initial bright flash forming a small intense core, a rapid expansion with particles flying outward in all directions, and a final dissipation as particles fade and disperse. Use crisp pixel art aesthetic with no anti-aliasing, no smoke trails no fire only clean particles, classic retro game explosion style, the explosion must always remain fully contained within the frame with no clipping, no text no letters no Korean characters no Latin alphabet no watermark no signature, output 512 by 512 pixels exactly at 30 fps for 1.5 seconds total duration
```

**후처리** (영상 → 시트):
1. ffmpeg로 chroma key 적용 + 프레임 추출 + 128 × 128 다운스케일:
   ```
   ffmpeg -i explosion-raw.mp4 -vf "chromakey=0xff00ff:0.1:0.0,fps=30,scale=128:128" -c:v png exp_%02d.png
   ```
2. Free Texture Packer에 모든 프레임 drop → atlas + JSON 자동 생성.
3. `agency-web/public/typing/sprites/explosion.{png,json}`.
4. Phaser preload + 재생은 #4와 동일.

---

## 8. 효과음 (ElevenLabs Sound Effects) — 사이즈 N/A, 길이 명시

ElevenLabs 무료 월 10K credits 충분. 출력 형식은 ElevenLabs 기본(`mp3 44.1kHz`) → ffmpeg로 `wav 16-bit 44.1kHz mono`로 정규화.

### 8.1 타건음 — 같은 프롬프트 4번 생성 (4개 파일)

```
A short crisp mechanical keyboard click sound, soft and warm tactile feel, single key press impact, 80 milliseconds total duration, clean sharp attack with quick decay, no reverb no echo no background ambient, dry studio recording quality, suitable for typing app feedback
```

→ `key-1.wav`, `key-2.wav`, `key-3.wav`, `key-4.wav` (재생 시 무작위 선택)

### 8.2 오타 (miss)

```
A short low-pitched soft buzz sound for a typing error notification, 150 milliseconds total duration, gentle and not jarring, like a muted incorrect-answer indicator, with a slight downward pitch slide, dry studio quality with no reverb no echo no background ambient
```
→ `miss.wav`

### 8.3 카운트다운 tick — 3 개별 음높이

```
A clean digital countdown beep tone for a typing app, single short beep at A4 frequency 440 Hz, 100 milliseconds total duration, sharp attack with quick decay, no reverb no echo no background ambient, dry minimal electronic tone with subtle warmth
```
→ `count-tick-1.wav` (A4)

```
A clean digital countdown beep tone for a typing app, single short beep at B4 frequency 494 Hz, 100 milliseconds total duration, sharp attack with quick decay, no reverb no echo no background ambient, dry minimal electronic tone with subtle warmth
```
→ `count-tick-2.wav` (B4)

```
A clean digital countdown beep tone for a typing app, single short beep at C5 frequency 523 Hz, 100 milliseconds total duration, sharp attack with quick decay, no reverb no echo no background ambient, dry minimal electronic tone with subtle warmth
```
→ `count-tick-3.wav` (C5)

### 8.4 카운트다운 시작 (go)

```
A bright optimistic chime signaling start, ascending two-tone bell-like sound from C5 to E5 frequency, 300 milliseconds total duration, warm and inviting tone with a soft attack and gentle decay, no reverb no echo, suitable for a friendly typing app countdown completion
```
→ `count-go.wav`

### 8.5 줄/단락 완료

```
A gentle paper-flip whoosh sound combined with a soft chime, 400 milliseconds total duration, satisfying completion feedback for finishing a sentence or paragraph in a typing app, warm and rewarding tone, light and airy, no reverb no echo no background ambient, dry studio quality
```
→ `complete.wav`

### 8.6 신기록 (tada)

```
A short triumphant 8-bit chiptune fanfare, ascending arpeggio of three to four notes, 800 milliseconds total duration, celebratory but minimal not over-the-top, warm and friendly retro game style, no reverb no echo no background ambient, suitable for a personal best record celebration in a typing app
```
→ `tada.wav`

### 8.7 게임 hit (자모 격파)

```
A crisp pixelated impact sound, 100 milliseconds total duration, classic 8-bit retro game style hit, satisfying small impact like breaking a single block, sharp attack quick decay, dry studio quality with no reverb no echo no background ambient
```
→ `game-hit.wav`

### 8.8 게임 boom (단어 폭파)

```
A deeper 8-bit retro game explosion sound, 400 milliseconds total duration, warm bass-heavy boom with brief debris fizz at the end, satisfying destruction feedback, sharp attack with longer decay than a small hit, dry studio quality with no reverb no echo no background ambient
```
→ `game-boom.wav`

---

## 9. 게임 BGM 루프 (Suno v4) — 길이 30초 seamless loop

Suno 무료 일 50곡. Custom Mode → Lyrics 비움 → Style "8-bit chiptune game music" → 아래 프롬프트.

```
8-bit chiptune background loop for a casual typing defense game, 90 BPM, optimistic minor key, repetitive square wave melody with a simple bass line, no vocals, no drum kit only chip-style noise percussion, warm and friendly retro feel, seamless 30-second loop suitable for continuous playback during gameplay, dynamic enough to support intense moments but not overwhelming, suitable for background ambience during typing focus
```

→ `bgm-loop.mp3`

**후처리**: 출력 파일을 ffmpeg로 128kbps mp3 압축 + 시작/끝 페이드 20ms (끊김 없는 루프):
```
ffmpeg -i raw.mp3 -af "afade=t=in:ss=0:d=0.02,afade=t=out:st=29.98:d=0.02" -b:a 128k bgm-loop.mp3
```

---

## 10. 폰트 (직접 다운로드 — AI 비대상)

| 폰트 | 출처 | 용도 |
|---|---|---|
| Pretendard variable | next/font 또는 cdn.jsdelivr.net/gh/orioncactus/pretendard | UI 본문 |
| 물마루 (mulmaru) | github.com/mushsooni/mulmaru | 게임 픽셀 텍스트 |
| JetBrains Mono | next/font/google | 모노 (타수 카운터) |

`agency-web/public/typing/fonts/mulmaru.woff2`로 저장.

---

## 11. CREDITS.md 템플릿

`agency-web/public/typing/CREDITS.md`로 저장.

```markdown
# /typing 자산 출처

이 페이지의 모든 시각 자산과 음원은 생성형 AI 도구로 제작되었으며,
인간의 큐레이션과 후처리를 거쳤습니다.

## 시각 자산
- 스테이지맵 5개 (`illustrations/stage-*.png`): gpt-image-2 (OpenAI) → Figma 색상 보정.
- 양손 가이드 (`hands.svg`): gpt-image-2 참조 → Figma 수동 path 트레이스.
- 게임 정적 스프라이트 (`sprites/meteor-*.png`, `ship.png`, `gem.png`):
  gpt-image-2 4×4 시트 → Piskel alpha 정리 + 영역 분리.
- 게임 폭발 애니메이션 (`sprites/explosion.png`+`.json`):
  gpt-image-2 8×4=32컷 시트 (또는 Veo 3.1 Fast 영상 → ffmpeg 프레임 추출) → Free Texture Packer atlas.
- 게임 배경 3 layer (`sprites/space-bg-*.png`): gpt-image-2 → Piskel layer 분리.
- 신기록 리본/메달/별 (`illustrations/ribbon-best.svg` 등): gpt-image-2 → vectorizer.ai 트레이스.

## 사운드 자산
- SFX 9종 (`sfx/*.wav`): ElevenLabs Sound Effects → ffmpeg 정규화.
- BGM (`sfx/bgm-loop.mp3`): Suno v4 → ffmpeg 압축 및 루프 처리.

## 폰트
- Pretendard: SIL OFL.
- 물마루 (mulmaru): CC0.
- JetBrains Mono: SIL OFL.

## 라이선스
모든 AI 생성 자산은 각 도구의 상업 사용 약관을 준수해 사용되었습니다.
- OpenAI gpt-image-2: openai.com/terms
- Google nanobanana 2 / Imagen 4 / Veo 3.1 Fast: cloud.google.com/terms
- ElevenLabs: elevenlabs.io/terms
- Suno: suno.com/terms
```
