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