# Benchmark: Korean Tools Sites Distinct Tool Backlog

> 목적: getin.kr, vivoldi.com/tools, googsu.com, itool.co.kr에서 제공하는 도구를 탐색해 중복을 정리하고, ZHS 도구 제작 플랜에 추가한다.  
> 작성일: 2026-05-02  
> 브랜치: `feature/advanced-tools`

## 조사 대상
- `getin.kr`: sitemap에서 비게임 도구 100여 개 확인
- `vivoldi.com/tools`: 도구 18개 확인
- `googsu.com`: 홈 도구 링크 40여 개 확인
- `itool.co.kr`: ko sitemap에서 PDF/이미지/텍스트/양식 다수 확인

## 이미 ZHS 제작 플랜/구현에 반영된 도구
- **아이콘/파비콘 생성기** — implemented; reference: getin
- **이미지 포맷 변환** — implemented; reference: getin, vivoldi, itool
- **PDF Toolkit** — implemented; reference: getin, itool
- **OG 이미지/썸네일 생성기** — implemented; reference: ZHS roadmap
- **QR/Barcode 생성기** — implemented; reference: getin, googsu
- **웹훅 요청 시뮬레이터** — implemented; reference: ZHS roadmap
- **내 IP 확인** — implemented; reference: getin, vivoldi

## Distinct 후보 목록 및 제작 우선순위

### Tier 1 — 반복 출현 + 구현 난이도 대비 효과가 큰 도구
- **JSON/YAML/XML 포매터·검증·뷰어**
  - 참고 출처: getin, googsu, itool, vivoldi
  - ZHS 적용 메모: 기존 JSON/YAML/XML 업그레이드 계획과 합쳐서 XML beautify까지 포함
- **글자수/단어수/줄수 세기**
  - 참고 출처: getin, googsu, itool, vivoldi
  - ZHS 적용 메모: 텍스트 기본 도구. SEO 유입형이지만 thin page가 되지 않도록 SNS/원고/바이트 카운트 포함
- **Base64 인코딩/디코딩**
  - 참고 출처: getin, googsu, itool, vivoldi
  - ZHS 적용 메모: 텍스트 + 이미지 Base64는 별도 탭으로 확장 가능
- **이미지 압축**
  - 참고 출처: getin, vivoldi, itool
  - ZHS 적용 메모: 브라우저 로컬 처리. 포맷 변환기와 통합할지 별도 메뉴로 둘지 구현 전 결정
- **텍스트 비교/diff**
  - 참고 출처: getin, googsu, itool
  - ZHS 적용 메모: 개발자/문서 작업 모두 수요 있음
- **URL 인코딩/디코딩**
  - 참고 출처: getin, googsu, vivoldi
  - ZHS 적용 메모: 가벼운 개발자 도구
- **JWT 디코더**
  - 참고 출처: getin, googsu
  - ZHS 적용 메모: 서명 검증은 optional, 기본은 로컬 decode + 보안 주의
- **색상 선택기 + 이미지 색상 추출**
  - 참고 출처: getin, vivoldi
  - ZHS 적용 메모: 기존 color contrast와 연결. 이미지 팔레트 추출까지 포함

### Tier 2 — 개발자/문서 유틸 확장
- **Markdown 변환/미리보기 + Markdown 표 생성기**
  - 참고 출처: getin, googsu
  - ZHS 적용 메모: 기존 Markdown table preview 계획과 통합
- **Cron 생성기/해석기**
  - 참고 출처: getin, googsu
  - ZHS 적용 메모: 기존 계획대로 schedule → cron을 primary flow로 유지
- **정규식 테스트/예제**
  - 참고 출처: getin, googsu
  - ZHS 적용 메모: 클라이언트 로컬 테스트
- **해시 생성기**
  - 참고 출처: getin, googsu
  - ZHS 적용 메모: MD5/SHA 계열. 보안용 비밀번호 저장과 다름을 명시
- **UUID 생성기**
  - 참고 출처: getin
  - ZHS 적용 메모: v4 우선, batch 생성
- **HTML/CSS/SQL/XML 포매터**
  - 참고 출처: getin
  - ZHS 적용 메모: JSON/YAML/XML 이후 확장
- **YAML ↔ JSON, JSON ↔ XML 변환**
  - 참고 출처: getin, itool
  - ZHS 적용 메모: 포매터 도구 안의 변환 탭으로 묶는 방식 권장
- **cURL 변환기**
  - 참고 출처: googsu
  - ZHS 적용 메모: cURL → fetch/Python requests 등
- **HTTP 상태코드 조회**
  - 참고 출처: getin
  - ZHS 적용 메모: 네트워크 도구에는 넣지 말고 정적 reference tool로만
- **User-Agent 확인**
  - 참고 출처: vivoldi
  - ZHS 적용 메모: 브라우저 정보 확인, 개인정보/핑거프린팅 주의 문구
- **도메인 퓨니코드 변환**
  - 참고 출처: getin, vivoldi
  - ZHS 적용 메모: 한글 도메인/IDN 변환

### Tier 3 — 이미지/디자인 고급 도구
- **이미지 리사이즈/크롭/회전**
  - 참고 출처: getin
  - ZHS 적용 메모: 이미지 포맷 변환과 같은 워크스페이스로 묶을 수 있음
- **EXIF/이미지 메타데이터 보기·제거**
  - 참고 출처: getin
  - ZHS 적용 메모: 개인정보 보호 콘텐츠와 연결
- **워터마크 추가**
  - 참고 출처: getin
  - ZHS 적용 메모: 블로그/쇼핑몰 이미지에 실용적
- **모자이크/블러 처리**
  - 참고 출처: getin
  - ZHS 적용 메모: 개인정보 가림 도구
- **이미지 콜라주/병합**
  - 참고 출처: getin
  - ZHS 적용 메모: 다운로드 중심
- **GIF 생성/편집**
  - 참고 출처: getin
  - ZHS 적용 메모: 난이도 높음. 후순위
- **HEIC 뷰어/변환**
  - 참고 출처: itool
  - ZHS 적용 메모: 브라우저 지원/라이브러리 검증 필요
- **SVG 자르기/최적화**
  - 참고 출처: itool
  - ZHS 적용 메모: SVG 텍스트 처리 + 미리보기
- **웹사이트 화면 캡처**
  - 참고 출처: vivoldi
  - ZHS 적용 메모: 서버/헤드리스 브라우저 필요 가능성이 높아 후순위
- **유튜브 썸네일 다운로드**
  - 참고 출처: vivoldi
  - ZHS 적용 메모: 약관/저작권 안내 필요
- **웹사이트 이미지 추출**
  - 참고 출처: vivoldi
  - ZHS 적용 메모: CORS/저작권/서버 처리 이슈로 후순위

### Tier 4 — 계산/생활형 도구
- **단위 변환 통합: 길이/무게/온도/면적/파일크기/진법**
  - 참고 출처: getin, googsu
  - ZHS 적용 메모: 기존 unit converter 개선 계획과 통합
- **환율 계산기**
  - 참고 출처: getin
  - ZHS 적용 메모: 기존 KRW live-rate 계획과 통합
- **날짜 계산기/D-Day/카운트다운/스톱워치/포모도로**
  - 참고 출처: getin
  - ZHS 적용 메모: 체류시간형 도구. 품질 있게 묶어서 출시
- **퍼센트/부가세/팁/대출/급여/퇴직금/연차 계산기**
  - 참고 출처: getin
  - ZHS 적용 메모: 한국 법/세금 관련은 고지와 업데이트 책임 필요
- **BMI/만 나이/비율 계산기**
  - 참고 출처: getin
  - ZHS 적용 메모: 가벼운 도구. thin-content 방지 필요

### Tier 5 — 보류 또는 별도 제품/실험 레이어
- **검색엔진 봇 IP 검사, DNS Lookup, CIDR, TLS, 방화벽 체크**
  - 참고 출처: vivoldi, googsu
  - ZHS 적용 메모: 현재 네트워크 도구는 “내 IP 확인” 단일 기능 유지 결정. 서버성/보안성 도구는 명시 요청 전 보류
- **텍스트 읽어주기**
  - 참고 출처: itool
  - ZHS 적용 메모: TTS 비용/브라우저 Speech API 품질 확인 필요
- **엑셀 병합, EPUB to TXT**
  - 참고 출처: itool
  - ZHS 적용 메모: 문서 파일 처리 도구로 후순위
- **미니게임/운세/사주/타로**
  - 참고 출처: getin
  - ZHS 적용 메모: ZHS 메인 도구 신뢰도와 분리. experiments/product layer로만 검토
- **계약서/문서양식 다운로드**
  - 참고 출처: itool
  - ZHS 적용 메모: 법적 책임/콘텐츠 운영 부담이 커서 현재 도구 허브에는 보류

## 구현 원칙
- **한 페이지 한 기능 원칙보다 워크스페이스 묶기 우선:** PDF처럼 기능이 강하게 인접하면 단일 toolkit route + 내부 탭으로 묶는다.
- **브라우저 로컬 처리 우선:** 이미지/PDF/텍스트/인코딩 계열은 서버 업로드 없이 처리하고 개인정보 안내를 명시한다.
- **thin page 방지:** 단순 폼만 만들지 않고 예시, 사용처, FAQ, 제한사항, 관련 글/도구 링크를 포함한다.
- **네트워크 도구 제한 유지:** 현재 사용자 결정에 따라 `내 IP 확인 / Check My IP` 단일 기능만 공개한다. DNS/ping/TLS/header checker류는 별도 명시 요청 전 추가하지 않는다.
- **법률/세금/의료/운세성 도구 주의:** 계산 전제·면책·업데이트 날짜가 없으면 공개하지 않는다.

## 다음 실행 배치 제안
1. **Batch 1: 텍스트/개발자 기본 도구** — 글자수, Base64, URL encode/decode, JWT, hash, UUID, text diff.
2. **Batch 2: JSON/YAML/XML 통합 포매터** — 기존 계획의 beautify/validate/minify/convert를 하나의 developer workspace로 구현.
3. **Batch 3: 이미지 압축 + resize/crop/rotate + EXIF 제거** — 기존 이미지 포맷 변환과 UX를 맞춘 browser-local image workspace 검토.
4. **Batch 4: 생활 계산/시간 도구** — 날짜/D-Day/포모도로/스톱워치 및 환율·단위 변환 고도화.
5. **Batch 5: 후순위 고급 도구** — HEIC/SVG/GIF/웹사이트 캡처 등은 기술·법적 제약 검토 후 진행.

## 원자료
- Distinct 추출 JSON: `/tmp/tool-benchmark-distinct.json` (세션 임시 파일)
