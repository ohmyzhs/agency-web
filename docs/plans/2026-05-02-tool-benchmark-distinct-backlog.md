# Benchmark: Korean Tools Sites Comprehensive Tool Inventory

> 목적: getin.kr, vivoldi.com/tools, googsu.com, itool.co.kr의 도구를 sitemap/카테고리/내부 링크 기준으로 재조사해 전체 후보군을 정리한다.  
> 작성일: 2026-05-02  
> 브랜치: `feature/advanced-tools`

## 재조사 방식과 수집량
- getin.kr: `/sitemap.xml`에서 `/tools/**` 전체 수집. 게임 포함 135개 도구 URL.
- vivoldi.com: sitemap index를 따라 `/tools/**` 19개 수집.
- googsu.com: sitemap이 HTML로 반환되어 홈/카테고리 내부 링크를 크롤링해 28개 도구 URL 수집.
- itool.co.kr: sitemap index와 RSS를 확인해 PDF/이미지/텍스트 도구, 양식, 샘플 파일 페이지까지 수집. 중복 제거 후 도구 28개, 양식 30개, 샘플 38개 수준으로 분리.

- 원시 sitemap/link 카운트: `{'getin_locs': 252, 'vivoldi_locs': 338, 'googsu_urls': 34, 'itool_locs': 1030}`
- 정규화 후 공개 도구 후보 distinct: **173개**

## 출처별 도구 목록

### getin.kr 도구/게임
- 텍스트 정렬
- 대소문자 변환
- 글자수 세기
- 텍스트 비교
- 중복 줄 제거
- 텍스트 인코딩/디코딩
- 텍스트 추출
- 인스타그램 글자수/줄바꿈
- 줄 번호 추가
- 텍스트 뒤집기
- 슬러그 생성기
- 텍스트 템플릿
- X/Twitter 글자수
- 색상 선택기
- Cron 생성기/해석기
- CSS 포매터
- CSS 단위 변환
- 디자인 분석기
- 디자인 to JSON
- Git 명령어 치트시트
- HTML 엔티티 변환
- HTML 포매터
- HTTP 상태코드 조회
- JSON 포매터/검증
- JWT 디코더
- Markdown 표 생성기
- 코드 압축/Minifier
- 정규식 테스트
- SQL 포매터
- Tailwind CSS 도우미
- XML 포매터
- Base64 인코딩/디코딩
- 색상 코드 변환
- 환율 계산기
- 파일 크기 변환
- Markdown 변환/미리보기
- 진법 변환
- 타임스탬프 변환
- Unicode 변환
- 단위 변환
- URL 인코딩/디코딩
- YAML ↔ JSON 변환
- 바코드 생성기
- 더미 이미지 생성기
- 그라디언트 생성기
- 해시 생성기
- 해시태그 생성기
- 인보이스 생성기
- 한국 이름 생성기
- Lorem Ipsum 생성기
- 비밀번호 생성기
- QR 코드 생성기
- 랜덤 숫자 생성기
- CSS 그림자 생성기
- UUID 생성기
- 이미지 ASCII 변환
- 카드/이미지 카드 생성기
- 이미지 콜라주
- 이미지 비교
- 이미지 압축
- 이미지 포맷 변환
- 이미지 자르기
- 이미지 오려내기
- EXIF 보기/제거
- 파비콘 생성기
- 이미지 필터
- GIF 생성/편집
- 일러스트레이터 유틸
- 이미지맵 생성기
- 밈 생성기
- 이미지 병합
- 이미지 메타데이터
- 목업 생성기
- 모자이크 처리
- 이미지 팔레트 추출
- 포토샵 유틸
- 배경 제거
- 이미지 리사이즈
- 이미지 회전
- 이미지 분할/슬라이스
- 썸네일 생성기
- 이미지 업스케일
- 워터마크 추가
- 만 나이 계산기
- 연차 계산기
- 비율 계산기
- BMI 계산기
- 일반 계산기
- 카운트다운
- 날짜 계산기
- D-Day 계산기
- 내 IP 확인
- JSON 뷰어
- 대출 계산기
- 온라인 메모장
- 퍼센트 계산기
- 포모도로 타이머
- QR 스캐너
- 급여 계산기
- 화면 녹화기
- 퇴직금 계산기
- 스톱워치
- 팁 계산기
- 부가세 계산기
- 2048 게임
- AI 사주/운세
- 숫자야구
- 벽돌깨기
- 동전 던지기
- 주사위 굴리기
- 두들점프
- Flappy Bird
- 오늘의 운세
- 무한의 계단
- 사다리타기
- 수학 퀴즈
- 메모리 게임
- 지뢰찾기
- 숫자 패턴 게임
- 프리미엄 AI 사주 분석
- 15 퍼즐
- 반응속도 테스트
- 룰렛
- 가위바위보
- 횡스크롤 슈팅
- 스카이 슈터
- 스네이크
- 솔리테어
- 테트리스
- 틱택토
- 타자연습
- 이상형 월드컵
- 띠별 운세

### vivoldi.com/tools
- pricing
- IP 주소 및 위치 확인
- 검색엔진 봇 IP 검사
- User Agent 확인
- 도메인 퓨니코드 변환
- HEX 색상 선택기
- 이미지 색상 추출
- 이미지 용량 압축
- WebP 변환기
- 이미지 에디터
- 웹사이트 화면 캡처
- URL 인코딩/디코딩
- Base64 인코딩/디코딩
- 유튜브 썸네일 다운로드
- 웹사이트 이미지 추출기
- 텍스트/IP 정렬기
- 글자 수 세기
- 특수 문자/기호
- JSON 포맷터/정렬

### googsu.com
- 공학용 계산기
- Base64 인코더/디코더
- 텍스트 비교
- 글자수 세기
- 해시 생성기
- JSON 포맷터/뷰어
- jwt
- translate
- URL 인코더/디코더
- XML 검증기
- Cron 예제/생성기
- cURL 변환기
- HEX 이미지 변환기
- Markdown 변환기
- QR 코드 생성기
- 정규식 예제/테스터
- 타임스탬프 변환기
- 색상 팔레트 생성기
- RGB 코드 피커
- CIDR 계산기
- DNS Lookup
- 방화벽 체크
- IP 정보 확인
- TLS 버전 체크
- 면적 변환
- 길이 변환
- 온도 변환
- 무게 변환

### itool.co.kr PDF/이미지/텍스트 도구
- image
- 이미지 압축
- 이미지 JPG 변환
- 이미지 PNG 변환
- 이미지 WebP 변환
- HEIC 뷰어
- 이미지 Base64 변환
- SVG 자르기
- pdf
- PDF 자르기
- PDF 페이지 삭제
- PDF 서명/주석 편집
- PDF 텍스트 추출
- 이미지 to PDF
- PDF 2쪽을 1쪽으로 병합
- PDF 합치기
- PDF to JPG
- PDF to PNG
- PDF 반으로 나누기
- PDF 나누기
- text
- Base64 인코딩/디코딩
- 글자수 세기
- 텍스트 비교
- EPUB to TXT
- JSON 파서/포매터
- JSON ↔ XML 변환
- 텍스트 읽어주기
- XML 파서/포매터
- YAML 변환기
- samples
- audio
- aac
- flac
- mp3
- ogg
- wav
- code
- bat
- html
- json
- markdown
- xml
- yaml
- data
- log
- document
- csv
- doc
- docx
- epub
- ppt
- pptx
- srt
- txt
- xls
- xlsx
- avif
- bmp
- gif
- heic
- ico
- jpg
- png
- qr
- svg
- tiff
- webp
- video
- avi
- mov
- mp4
- webm
- 엑셀 병합

### itool.co.kr 문서 양식
- 자동차 매매계약서 양식 - 매매업자 거래
- 자동차 매매계약서 양식 - 개인 직거래
- 경력증명서 양식
- 자녀 양육 협의서 양식
- 형사합의서 양식
- 협의이혼의사확인신청서 - 미성년 자녀 없음
- 협의이혼의사확인신청서 - 미성년 자녀 있음
- 영문 재직증명서 양식
- 재직증명서 양식
- 표준근로계약서 양식
- 무상 임대차 계약서 양식
- 주택임대차 표준계약서 양식
- 시말서 양식
- 차용증 양식
- 가족간 무이자 차용증 양식
- 보증인 포함 차용증 양식
- 처벌불원서 양식
- 동업계약서 양식
- 동업해지계약서 양식
- 탄원서 양식
- 위임장 양식
- 구매안전서비스 비적용 대상 확인서
- 견적서 양식
- 사직서 양식
- 이력서 기본 양식
- 이력서+자기소개서 양식
- 합의서 양식
- 해촉증명서 양식
- 거래명세서 양식 1
- 거래명세서 양식 2

### itool.co.kr 샘플 파일 페이지
- 샘플 파일 모음
- AAC 샘플 파일
- FLAC 샘플 파일
- MP3 샘플 파일
- OGG 샘플 파일
- WAV 샘플 파일
- BAT 샘플 파일
- HTML 샘플 파일
- JSON 샘플 파일
- MARKDOWN 샘플 파일
- XML 샘플 파일
- YAML 샘플 파일
- LOG 샘플 파일
- CSV 샘플 파일
- DOC 샘플 파일
- DOCX 샘플 파일
- EPUB 샘플 파일
- PDF 샘플 파일
- PPT 샘플 파일
- PPTX 샘플 파일
- SRT 샘플 파일
- TXT 샘플 파일
- XLS 샘플 파일
- XLSX 샘플 파일
- AVIF 샘플 파일
- BMP 샘플 파일
- GIF 샘플 파일
- HEIC 샘플 파일
- ICO 샘플 파일
- JPG 샘플 파일
- PNG 샘플 파일
- QR 샘플 파일
- SVG 샘플 파일
- TIFF 샘플 파일
- WEBP 샘플 파일
- AVI 샘플 파일
- MOV 샘플 파일
- MP4 샘플 파일
- WEBM 샘플 파일

## Distinct 도구 후보 전체 목록

### 개발자
- **Base64 인코딩/디코딩** — 출처: getin, googsu, itool, vivoldi; 예: Base64 인코더/디코더, Base64 인코딩/디코딩, 이미지 Base64 변환
- **JSON 도구** — 출처: getin, googsu, itool, vivoldi; 예: JSON ↔ XML 변환, JSON 뷰어, JSON 파서/포매터, JSON 포매터/검증
- **URL 인코딩/디코딩** — 출처: getin, googsu, vivoldi; 예: URL 인코더/디코더, URL 인코딩/디코딩
- **XML 도구** — 출처: getin, googsu, itool; 예: XML 검증기, XML 파서/포매터, XML 포매터
- **Cron 생성기/해석기** — 출처: getin, googsu; 예: Cron 생성기/해석기, Cron 예제/생성기
- **YAML 도구** — 출처: getin, itool; 예: YAML ↔ JSON 변환, YAML 변환기
- **정규식 테스트/예제** — 출처: getin, googsu; 예: 정규식 예제/테스터, 정규식 테스트
- **해시 생성기** — 출처: getin, googsu; 예: 해시 생성기, 해시태그 생성기
- **CIDR 계산기** — 출처: googsu; 예: CIDR 계산기
- **CSS 그림자 생성기** — 출처: getin; 예: CSS 그림자 생성기
- **CSS 포매터** — 출처: getin; 예: CSS 포매터
- **DNS Lookup** — 출처: googsu; 예: DNS Lookup
- **Git 명령어 치트시트** — 출처: getin; 예: Git 명령어 치트시트
- **HTML 엔티티 변환** — 출처: getin; 예: HTML 엔티티 변환
- **HTML 포매터** — 출처: getin; 예: HTML 포매터
- **HTTP 상태코드 조회** — 출처: getin; 예: HTTP 상태코드 조회
- **JWT 디코더** — 출처: getin; 예: JWT 디코더
- **Markdown 변환/미리보기** — 출처: getin; 예: Markdown 변환/미리보기
- **Markdown 변환기** — 출처: googsu; 예: Markdown 변환기
- **Markdown 표 생성기** — 출처: getin; 예: Markdown 표 생성기
- **SQL 포매터** — 출처: getin; 예: SQL 포매터
- **TLS 버전 체크** — 출처: googsu; 예: TLS 버전 체크
- **Tailwind CSS 도우미** — 출처: getin; 예: Tailwind CSS 도우미
- **UUID 생성기** — 출처: getin; 예: UUID 생성기
- **User Agent 확인** — 출처: vivoldi; 예: User Agent 확인
- **cURL 변환기** — 출처: googsu; 예: cURL 변환기
- **도메인 퓨니코드 변환** — 출처: vivoldi; 예: 도메인 퓨니코드 변환
- **디자인 to JSON** — 출처: getin; 예: 디자인 to JSON

### 텍스트
- **글자수/단어수/줄수 세기** — 출처: getin, googsu, itool, vivoldi; 예: X/Twitter 글자수, 글자 수 세기, 글자수 세기, 인스타그램 글자수/줄바꿈
- **텍스트 비교/diff** — 출처: getin, googsu, itool; 예: 텍스트 비교
- **대소문자 변환** — 출처: getin; 예: 대소문자 변환
- **슬러그 생성기** — 출처: getin; 예: 슬러그 생성기
- **줄 번호 추가** — 출처: getin; 예: 줄 번호 추가
- **중복 줄 제거** — 출처: getin; 예: 중복 줄 제거
- **텍스트 뒤집기** — 출처: getin; 예: 텍스트 뒤집기
- **텍스트 인코딩/디코딩** — 출처: getin; 예: 텍스트 인코딩/디코딩
- **텍스트 읽어주기** — 출처: itool; 예: 텍스트 읽어주기
- **텍스트 정렬** — 출처: getin; 예: 텍스트 정렬
- **텍스트 추출** — 출처: getin; 예: 텍스트 추출
- **텍스트 템플릿** — 출처: getin; 예: 텍스트 템플릿
- **텍스트/IP 정렬기** — 출처: vivoldi; 예: 텍스트/IP 정렬기
- **특수 문자/기호** — 출처: vivoldi; 예: 특수 문자/기호

### 이미지/디자인
- **색상 선택기** — 출처: getin, googsu, vivoldi; 예: HEX 색상 선택기, RGB 코드 피커, 색상 선택기
- **이미지 압축** — 출처: getin, itool, vivoldi; 예: 이미지 압축, 이미지 용량 압축
- **이미지 포맷 변환** — 출처: getin, itool, vivoldi; 예: WebP 변환기, 이미지 JPG 변환, 이미지 PNG 변환, 이미지 WebP 변환
- **색상 추출/팔레트** — 출처: googsu, vivoldi; 예: 색상 팔레트 생성기, 이미지 색상 추출
- **EXIF 보기/제거** — 출처: getin; 예: EXIF 보기/제거
- **GIF 생성/편집** — 출처: getin; 예: GIF 생성/편집
- **HEIC 뷰어** — 출처: itool; 예: HEIC 뷰어
- **HEX 이미지 변환기** — 출처: googsu; 예: HEX 이미지 변환기
- **SVG 자르기** — 출처: itool; 예: SVG 자르기
- **더미 이미지 생성기** — 출처: getin; 예: 더미 이미지 생성기
- **모자이크 처리** — 출처: getin; 예: 모자이크 처리
- **색상 코드 변환** — 출처: getin; 예: 색상 코드 변환
- **썸네일 생성기** — 출처: getin; 예: 썸네일 생성기
- **워터마크 추가** — 출처: getin; 예: 워터마크 추가
- **웹사이트 이미지 추출기** — 출처: vivoldi; 예: 웹사이트 이미지 추출기
- **유튜브 썸네일 다운로드** — 출처: vivoldi; 예: 유튜브 썸네일 다운로드
- **이미지 ASCII 변환** — 출처: getin; 예: 이미지 ASCII 변환
- **이미지 리사이즈** — 출처: getin; 예: 이미지 리사이즈
- **이미지 메타데이터** — 출처: getin; 예: 이미지 메타데이터
- **이미지 병합** — 출처: getin; 예: 이미지 병합
- **이미지 분할/슬라이스** — 출처: getin; 예: 이미지 분할/슬라이스
- **이미지 비교** — 출처: getin; 예: 이미지 비교
- **이미지 업스케일** — 출처: getin; 예: 이미지 업스케일
- **이미지 에디터** — 출처: vivoldi; 예: 이미지 에디터
- **이미지 오려내기** — 출처: getin; 예: 이미지 오려내기
- **이미지 자르기** — 출처: getin; 예: 이미지 자르기
- **이미지 콜라주** — 출처: getin; 예: 이미지 콜라주
- **이미지 팔레트 추출** — 출처: getin; 예: 이미지 팔레트 추출
- **이미지 필터** — 출처: getin; 예: 이미지 필터
- **이미지 회전** — 출처: getin; 예: 이미지 회전
- **이미지맵 생성기** — 출처: getin; 예: 이미지맵 생성기
- **카드/이미지 카드 생성기** — 출처: getin; 예: 카드/이미지 카드 생성기
- **파비콘 생성기** — 출처: getin; 예: 파비콘 생성기

### PDF/문서
- **EPUB to TXT** — 출처: itool; 예: EPUB to TXT
- **PDF Toolkit** — 출처: itool; 예: PDF 2쪽을 1쪽으로 병합, PDF to JPG, PDF to PNG, PDF 나누기
- **엑셀 병합** — 출처: itool; 예: 엑셀 병합

### 계산/변환
- **단위 변환** — 출처: getin, googsu; 예: CSS 단위 변환, 길이 변환, 단위 변환, 면적 변환
- **BMI 계산기** — 출처: getin; 예: BMI 계산기
- **D-Day 계산기** — 출처: getin; 예: D-Day 계산기
- **Unicode 변환** — 출처: getin; 예: Unicode 변환
- **공학용 계산기** — 출처: googsu; 예: 공학용 계산기
- **급여 계산기** — 출처: getin; 예: 급여 계산기
- **날짜 계산기** — 출처: getin; 예: 날짜 계산기
- **대출 계산기** — 출처: getin; 예: 대출 계산기
- **만 나이 계산기** — 출처: getin; 예: 만 나이 계산기
- **부가세 계산기** — 출처: getin; 예: 부가세 계산기
- **비율 계산기** — 출처: getin; 예: 비율 계산기
- **연차 계산기** — 출처: getin; 예: 연차 계산기
- **일반 계산기** — 출처: getin; 예: 일반 계산기
- **진법 변환** — 출처: getin; 예: 진법 변환
- **타임스탬프 변환** — 출처: getin; 예: 타임스탬프 변환
- **타임스탬프 변환기** — 출처: googsu; 예: 타임스탬프 변환기
- **퇴직금 계산기** — 출처: getin; 예: 퇴직금 계산기
- **팁 계산기** — 출처: getin; 예: 팁 계산기
- **파일 크기 변환** — 출처: getin; 예: 파일 크기 변환
- **퍼센트 계산기** — 출처: getin; 예: 퍼센트 계산기
- **환율 계산기** — 출처: getin; 예: 환율 계산기

### 생성기
- **QR/Barcode 생성기** — 출처: getin, googsu; 예: QR 코드 생성기, 바코드 생성기
- **Lorem Ipsum 생성기** — 출처: getin; 예: Lorem Ipsum 생성기
- **그라디언트 생성기** — 출처: getin; 예: 그라디언트 생성기
- **랜덤 숫자 생성기** — 출처: getin; 예: 랜덤 숫자 생성기
- **목업 생성기** — 출처: getin; 예: 목업 생성기
- **밈 생성기** — 출처: getin; 예: 밈 생성기
- **비밀번호 생성기** — 출처: getin; 예: 비밀번호 생성기
- **인보이스 생성기** — 출처: getin; 예: 인보이스 생성기
- **한국 이름 생성기** — 출처: getin; 예: 한국 이름 생성기

### 유틸리티
- **내 IP 확인** — 출처: getin, vivoldi; 예: IP 주소 및 위치 확인, 내 IP 확인
- **IP 정보 확인** — 출처: googsu; 예: IP 정보 확인
- **QR 스캐너** — 출처: getin; 예: QR 스캐너
- **aac** — 출처: itool; 예: aac
- **audio** — 출처: itool; 예: audio
- **avi** — 출처: itool; 예: avi
- **avif** — 출처: itool; 예: avif
- **bat** — 출처: itool; 예: bat
- **bmp** — 출처: itool; 예: bmp
- **code** — 출처: itool; 예: code
- **csv** — 출처: itool; 예: csv
- **data** — 출처: itool; 예: data
- **doc** — 출처: itool; 예: doc
- **document** — 출처: itool; 예: document
- **docx** — 출처: itool; 예: docx
- **epub** — 출처: itool; 예: epub
- **flac** — 출처: itool; 예: flac
- **gif** — 출처: itool; 예: gif
- **heic** — 출처: itool; 예: heic
- **html** — 출처: itool; 예: html
- **ico** — 출처: itool; 예: ico
- **image** — 출처: itool; 예: image
- **jpg** — 출처: itool; 예: jpg
- **json** — 출처: itool; 예: json
- **jwt** — 출처: googsu; 예: jwt
- **log** — 출처: itool; 예: log
- **markdown** — 출처: itool; 예: markdown
- **mov** — 출처: itool; 예: mov
- **mp3** — 출처: itool; 예: mp3
- **mp4** — 출처: itool; 예: mp4
- **ogg** — 출처: itool; 예: ogg
- **pdf** — 출처: itool; 예: pdf
- **png** — 출처: itool; 예: png
- **ppt** — 출처: itool; 예: ppt
- **pptx** — 출처: itool; 예: pptx
- **pricing** — 출처: vivoldi; 예: pricing
- **qr** — 출처: itool; 예: qr
- **samples** — 출처: itool; 예: samples
- **srt** — 출처: itool; 예: srt
- **svg** — 출처: itool; 예: svg
- **text** — 출처: itool; 예: text
- **tiff** — 출처: itool; 예: tiff
- **translate** — 출처: googsu; 예: translate
- **txt** — 출처: itool; 예: txt
- **video** — 출처: itool; 예: video
- **wav** — 출처: itool; 예: wav
- **webm** — 출처: itool; 예: webm
- **webp** — 출처: itool; 예: webp
- **xls** — 출처: itool; 예: xls
- **xlsx** — 출처: itool; 예: xlsx
- **xml** — 출처: itool; 예: xml
- **yaml** — 출처: itool; 예: yaml
- **검색엔진 봇 IP 검사** — 출처: vivoldi; 예: 검색엔진 봇 IP 검사
- **디자인 분석기** — 출처: getin; 예: 디자인 분석기
- **방화벽 체크** — 출처: googsu; 예: 방화벽 체크
- **배경 제거** — 출처: getin; 예: 배경 제거
- **스톱워치** — 출처: getin; 예: 스톱워치
- **온라인 메모장** — 출처: getin; 예: 온라인 메모장
- **웹사이트 화면 캡처** — 출처: vivoldi; 예: 웹사이트 화면 캡처
- **일러스트레이터 유틸** — 출처: getin; 예: 일러스트레이터 유틸
- **카운트다운** — 출처: getin; 예: 카운트다운
- **코드 압축/Minifier** — 출처: getin; 예: 코드 압축/Minifier
- **포모도로 타이머** — 출처: getin; 예: 포모도로 타이머
- **포토샵 유틸** — 출처: getin; 예: 포토샵 유틸
- **화면 녹화기** — 출처: getin; 예: 화면 녹화기

## ZHS 제작 플랜 반영 우선순위

### 이미 구현/반영됨
- 아이콘/파비콘 생성기
- 이미지 포맷 변환
- PDF Toolkit
- OG 이미지/썸네일 생성기
- QR/Barcode 생성기
- 웹훅 요청 시뮬레이터
- 내 IP 확인

### Batch 1 — 가장 먼저 추가할 기본 유입/실사용 도구
1. JSON/YAML/XML 통합 포매터·검증·뷰어
2. 글자수/단어수/줄수/바이트 카운터
3. Base64 인코딩/디코딩
4. URL 인코딩/디코딩
5. 텍스트 비교/diff
6. JWT 디코더
7. 해시 생성기
8. UUID 생성기
9. 정규식 테스트/예제

### Batch 2 — 이미지/디자인 워크스페이스 확장
1. 이미지 압축
2. 이미지 리사이즈/크롭/회전
3. EXIF/이미지 메타데이터 보기·제거
4. 워터마크 추가
5. 모자이크/블러 처리
6. 색상 선택기 + 이미지 색상 추출/팔레트
7. HEIC 뷰어/변환, SVG 자르기/최적화는 기술 검증 후

### Batch 3 — 문서/PDF 확장
1. PDF 텍스트 추출
2. PDF 자르기/페이지 삭제/2쪽을 1쪽으로 병합 등은 기존 PDF Toolkit 내부 탭으로 확장
3. EPUB to TXT, 엑셀 병합은 후순위

### Batch 4 — 생활/계산/시간 도구
1. 단위 변환 통합 고도화
2. 환율 계산기 live-rate 고도화
3. 날짜 계산기/D-Day/카운트다운/스톱워치/포모도로
4. 퍼센트/부가세/팁/대출/급여/퇴직금/연차 계산기

### 보류/분리
- DNS Lookup, CIDR, TLS, 방화벽 체크, 검색엔진 봇 IP 검사는 현재 네트워크 도구 정책과 충돌하므로 별도 요청 전 보류.
- 미니게임/운세/사주/타로는 메인 도구 허브가 아니라 experiments/product layer로 분리 검토.
- 법률 문서양식은 책임/업데이트 부담이 커서 현재는 직접 제공보다 “체크리스트/작성 가이드” 형태가 안전.
- 웹사이트 화면 캡처/이미지 추출/유튜브 썸네일 다운로드는 서버·CORS·저작권 이슈 검토 후 진행.

## 원자료
- `/tmp/zhs-tool-benchmark-raw.json`
- `/tmp/zhs-tool-benchmark-processed.json`
