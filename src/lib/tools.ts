import type { Locale } from "./i18n";

export type ToolTier = 1 | 2 | 3;

export type ToolCategory =
  | "korea-living"
  | "time-money"
  | "file-media"
  | "network-diagnostics"
  | "developer-automation"
  | "business-automation"
  | "micro-utility";

export type ToolExample = {
  label: string;
  input: string;
  output: string;
};

export type ToolField = {
  label: string;
  description: string;
};

export type ToolFaq = { question: string; answer: string };

export type ToolDataNotice = {
  processing: string;
  storage: string;
  caution: string;
};

export type LocalizedToolContent = {
  title: string;
  shortTitle: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  inputs: ToolField[];
  outputs: ToolField[];
  examples: ToolExample[];
  explanation: string[];
  faqs: ToolFaq[];
  dataNotice?: ToolDataNotice;
};

export type Tool = LocalizedToolContent & {
  slug: string;
  category: ToolCategory;
  tier: ToolTier;
  ko?: LocalizedToolContent;
  relatedToolSlugs: string[];
};

export const tools: Tool[] = [


  {
    slug: "developer-text-toolkit",
    title: "Developer Text Toolkit",
    shortTitle: "Dev Text",
    description: "Count text, encode/decode Base64 and URLs, compare text, decode JWTs, generate hashes and UUIDs, and test regex locally.",
    category: "developer-automation",
    tier: 1,
    seoTitle: "Developer Text Toolkit | Base64 URL JWT Hash UUID Regex Diff",
    seoDescription: "A browser-local toolkit for text counters, Base64 and URL encoding, text diff, JWT decoding, hash generation, UUID generation, and regex testing.",
    inputs: [
      { label: "Text, token, or pattern", description: "Paste plain text, encoded strings, JWTs, regular expressions, or comparison samples." },
      { label: "Mode options", description: "Choose counting, Base64/URL encode-decode, diff, JWT decode, hash, UUID, or regex testing." },
    ],
    outputs: [
      { label: "Transformed result", description: "Counts, decoded text, diff rows, JWT payload, hashes, UUIDs, or regex matches." },
      { label: "Copy-ready artifacts", description: "Use the generated value as a debugging aid, documentation snippet, or temporary test fixture." },
    ],
    examples: [
      { label: "JWT inspection", input: "header.payload.signature", output: "Decoded header and payload JSON" },
      { label: "Release note diff", input: "Two text versions", output: "Changed lines highlighted" },
      { label: "API payload helper", input: "Text with spaces and symbols", output: "URL-encoded or Base64 value" },
    ],
    explanation: [
      "Developer text work often starts with a tiny task: count bytes, decode a value, compare two snippets, generate a UUID, or check whether a regular expression really matches. Keeping those tasks in one workspace reduces context switching.",
      "The toolkit is designed for inspection and transformation, not for production authentication. JWT decoding only reads the header and payload; it does not prove that a token is valid or trusted.",
      "Hash and UUID outputs are convenient for fixtures, cache keys, examples, and debugging notes. They should not replace a reviewed security library for password storage, signing, or cryptographic protocols.",
      "All normal transformations run in the browser. Even so, production secrets, private keys, access tokens, and customer data should stay out of public web tools unless you have a deliberate internal policy for that workflow.",
    ],
    faqs: [
      { question: "Does this validate JWT signatures?", answer: "No. It decodes header and payload only. Signature verification needs the issuer secret or public key and must happen in a trusted environment." },
      { question: "Can I paste production API keys here?", answer: "Avoid doing that. The tool is browser-local for normal operations, but secret handling should remain inside approved internal tooling." },
      { question: "Are generated hashes suitable for passwords?", answer: "No. Password storage needs salted, slow password hashing such as bcrypt, scrypt, or Argon2." },
    ],
    relatedToolSlugs: ["json-yaml-validator", "webhook-payload-formatter", "cron-explainer"],
    ko: {
      title: "개발자 텍스트 도구 모음",
      shortTitle: "개발자 텍스트",
      description: "글자수, Base64, URL 인코딩, 텍스트 diff, JWT 디코더, 해시, UUID, 정규식 테스트를 로컬에서 처리합니다.",
      seoTitle: "개발자 텍스트 도구 | Base64 URL JWT 해시 UUID 정규식 diff",
      seoDescription: "글자수/단어수/바이트 카운터, Base64·URL 인코딩/디코딩, 텍스트 비교, JWT 디코더, 해시/UUID 생성, 정규식 테스트를 브라우저에서 제공합니다.",
      inputs: [
        { label: "텍스트, 토큰, 패턴", description: "일반 텍스트, 인코딩 문자열, JWT, 정규식, 비교할 두 텍스트를 입력합니다." },
        { label: "작업 모드", description: "글자수/바이트, Base64·URL 인코딩, diff, JWT 디코딩, 해시, UUID, 정규식 테스트 중 선택합니다." },
      ],
      outputs: [
        { label: "처리 결과", description: "카운트, 디코딩 결과, diff, JWT payload, 해시, UUID, 정규식 매칭 결과를 표시합니다." },
        { label: "복사용 결과", description: "디버깅 메모, 문서 예시, 임시 테스트 데이터로 바로 복사할 수 있는 값을 제공합니다." },
      ],
      examples: [
        { label: "JWT 확인", input: "header.payload.signature", output: "헤더와 payload JSON 디코딩" },
        { label: "릴리즈 노트 비교", input: "두 버전의 문장", output: "달라진 줄 하이라이트" },
        { label: "API payload 보조", input: "공백과 기호가 포함된 텍스트", output: "URL 인코딩 또는 Base64 값" },
      ],
      explanation: [
        "개발 중 텍스트 작업은 대개 아주 작은 확인에서 시작됩니다. 바이트 수를 세고, 값을 디코딩하고, 두 스니펫을 비교하고, UUID를 만들고, 정규식이 실제로 맞는지 보는 작업을 한 화면에 모았습니다.",
        "이 도구는 점검과 변환을 위한 것이며 운영 인증을 대신하지 않습니다. JWT 디코딩은 헤더와 payload를 읽는 기능일 뿐, 토큰이 유효하거나 신뢰할 수 있다는 뜻은 아닙니다.",
        "해시와 UUID 결과는 fixture, 캐시 키, 문서 예시, 디버깅 노트에는 편리하지만 비밀번호 저장, 서명, 암호 프로토콜에는 검토된 보안 라이브러리를 사용해야 합니다.",
        "일반 변환은 브라우저에서 실행됩니다. 그래도 운영 secret, 개인키, access token, 고객 원본 데이터는 승인된 내부 도구가 아니라면 공개 웹 도구에 붙여넣지 않는 것이 안전합니다.",
      ],
      faqs: [
        { question: "JWT 서명 검증도 하나요?", answer: "아닙니다. 헤더와 payload 디코딩만 수행합니다. 서명 검증은 발급자 secret 또는 공개키가 있는 신뢰 환경에서 해야 합니다." },
        { question: "운영 API 키를 붙여넣어도 되나요?", answer: "권장하지 않습니다. 일반 처리는 브라우저 로컬이지만 secret 관리는 승인된 내부 도구에서만 하는 것이 안전합니다." },
        { question: "생성한 해시를 비밀번호 저장에 써도 되나요?", answer: "아닙니다. 비밀번호 저장에는 salt와 느린 해시가 적용된 bcrypt, scrypt, Argon2 같은 전용 방식이 필요합니다." },
      ],
    },
  },
  {
    slug: "image-editing-toolkit",
    title: "Image Editing Toolkit",
    shortTitle: "Image Toolkit",
    description: "Compress, resize, crop, rotate, strip metadata, watermark, mosaic, and extract color palettes locally in the browser.",
    category: "file-media",
    tier: 1,
    seoTitle: "Image Editing Toolkit | Compress Resize Crop Watermark Mosaic Palette",
    seoDescription: "Browser-local image compression, resize, crop, rotate, EXIF stripping by re-export, watermarking, mosaic blur, and color palette extraction.",
    inputs: [
      { label: "Image file", description: "Upload a browser-readable image up to 20MB for compression, resizing, cropping, rotation, watermarking, mosaic, or palette extraction." },
      { label: "Editing options", description: "Choose output size, quality, crop area, rotation, watermark text, mosaic strength, or palette count." },
    ],
    outputs: [
      { label: "Processed image", description: "Download a re-exported image optimized for sharing, upload, documentation, or privacy cleanup." },
      { label: "Palette or preview", description: "Copy extracted colors and inspect the result before downloading." },
    ],
    examples: [
      { label: "Privacy resize", input: "Phone photo", output: "Smaller JPG with most metadata stripped" },
      { label: "Blog image prep", input: "Large screenshot", output: "Compressed Web image with controlled width" },
      { label: "Sensitive area blur", input: "Screenshot with account name", output: "Mosaic applied before sharing" },
    ],
    explanation: [
      "Image work is rarely a single action. A user may resize a screenshot, strip metadata, add a watermark, blur a private area, and copy colors for a post thumbnail in the same session.",
      "The workspace uses browser image decoding and Canvas-style re-export for the supported operations. That keeps normal image processing local and avoids uploading private drafts to a server.",
      "Canvas re-export removes most EXIF metadata, but browser support varies by source format and some metadata may behave differently across PNG, JPEG, WebP, and mobile photo formats.",
      "Very large files can exhaust browser memory, especially on mobile. For archival originals, keep a separate backup before destructive edits such as cropping or heavy compression.",
    ],
    faqs: [
      { question: "Does this support HEIC?", answer: "Only if the browser can decode it. HEIC conversion may need a separate library or server flow later." },
      { question: "Are uploaded images stored by ZHS?", answer: "No. The editing workflow is designed around browser-local processing and download from the client." },
      { question: "Does metadata stripping guarantee complete privacy?", answer: "No. Re-export removes most common EXIF data, but you should still visually inspect images for visible addresses, names, account IDs, or screenshots of private content." },
    ],
    relatedToolSlugs: ["image-format-converter", "icon-favicon-generator", "og-image-generator"],
    ko: {
      title: "이미지 편집 도구 모음",
      shortTitle: "이미지 편집",
      description: "이미지 압축, 리사이즈, 크롭, 회전, 메타데이터 제거용 재저장, 워터마크, 모자이크, 색상 추출을 처리합니다.",
      seoTitle: "이미지 편집 도구 | 압축 리사이즈 크롭 워터마크 모자이크 색상 추출",
      seoDescription: "이미지 압축, 리사이즈/크롭/회전, EXIF 제거용 재저장, 워터마크, 모자이크/블러, 이미지 색상 팔레트를 브라우저에서 처리합니다.",
      inputs: [
        { label: "이미지 파일", description: "압축, 리사이즈, 크롭, 회전, 워터마크, 모자이크, 색상 추출에 사용할 20MB 이하 이미지를 업로드합니다." },
        { label: "편집 옵션", description: "출력 크기, 품질, 크롭 영역, 회전, 워터마크 문구, 모자이크 강도, 팔레트 개수를 조정합니다." },
      ],
      outputs: [
        { label: "처리 이미지", description: "공유, 업로드, 문서 삽입, 개인정보 정리에 맞게 재저장된 이미지를 다운로드합니다." },
        { label: "팔레트 또는 미리보기", description: "추출 색상을 복사하고 결과를 확인한 뒤 다운로드합니다." },
      ],
      examples: [
        { label: "개인정보 보호 리사이즈", input: "휴대폰 사진", output: "대부분의 메타데이터가 제거된 작은 JPG" },
        { label: "블로그 이미지 준비", input: "큰 스크린샷", output: "폭과 용량을 줄인 웹용 이미지" },
        { label: "민감 영역 흐림", input: "계정명이 보이는 화면", output: "공유 전 모자이크 적용" },
      ],
      explanation: [
        "이미지 작업은 한 번에 끝나지 않는 경우가 많습니다. 스크린샷을 줄이고, 메타데이터를 제거하고, 워터마크를 넣고, 민감한 영역을 흐리고, 썸네일 색상을 뽑는 흐름을 한 페이지에 모았습니다.",
        "지원되는 작업은 브라우저 이미지 디코딩과 Canvas 기반 재저장을 활용합니다. 일반적인 이미지 처리를 로컬에서 끝내므로 비공개 초안을 서버에 올릴 필요가 없습니다.",
        "Canvas 재저장은 대부분의 EXIF 메타데이터를 제거하지만 PNG, JPEG, WebP, 모바일 사진 포맷마다 브라우저 지원과 처리 방식에는 차이가 있습니다.",
        "매우 큰 파일은 특히 모바일에서 브라우저 메모리 한계에 걸릴 수 있습니다. 크롭이나 강한 압축처럼 되돌리기 어려운 작업 전에는 원본 백업을 따로 보관하세요.",
      ],
      faqs: [
        { question: "HEIC도 지원하나요?", answer: "브라우저가 직접 디코딩할 수 있는 경우에만 가능합니다. HEIC 변환은 이후 별도 라이브러리나 서버 흐름 검증이 필요합니다." },
        { question: "업로드한 이미지가 ZHS 서버에 저장되나요?", answer: "아닙니다. 편집 흐름은 브라우저 로컬 처리와 클라이언트 다운로드를 기준으로 설계했습니다." },
        { question: "메타데이터 제거만 하면 개인정보가 완전히 안전한가요?", answer: "아닙니다. EXIF는 대부분 제거되지만 이미지 안에 보이는 주소, 이름, 계정 ID, 사적인 화면 내용은 직접 확인해야 합니다." },
      ],
    },
  },
  {
    slug: "life-calculator-suite",
    title: "Life Calculator Suite",
    shortTitle: "Life Calc",
    description: "Date, D-Day, stopwatch, pomodoro, percent, VAT, tip, loan, salary, severance, and annual leave calculators.",
    category: "time-money",
    tier: 1,
    seoTitle: "Life Calculator Suite | Date D-Day Loan Salary VAT Tip Pomodoro",
    seoDescription: "Practical date, D-Day, stopwatch, pomodoro, percent, VAT, tip, loan, salary, severance, and annual leave calculators in one page.",
    inputs: [
      { label: "Amounts, dates, rates", description: "Enter dates, money amounts, percentages, periods, work days, or timer lengths depending on the selected calculator." },
      { label: "Assumptions", description: "Use interest rates, tax rates, salary periods, or leave rules as simplified inputs for quick estimates." },
    ],
    outputs: [
      { label: "Estimated result", description: "Shows calculated dates, payments, totals, timer state, or estimated work benefits." },
      { label: "Context note", description: "Displays the simplified basis so the result is easier to verify before relying on it." },
    ],
    examples: [
      { label: "Loan estimate", input: "10,000,000 at 5% for 36 months", output: "Estimated monthly payment" },
      { label: "D-Day check", input: "Project due date", output: "Days remaining" },
      { label: "VAT split", input: "Total price including tax", output: "Supply amount and VAT" },
    ],
    explanation: [
      "Daily calculators are grouped because people often move between date math, percentages, VAT, loans, salary estimates, and timers while planning work or household decisions.",
      "The results are intentionally fast reference values. They help with mental checks, planning, and comparison, but they are not a substitute for payroll software, tax rules, bank quotations, or labor-law review.",
      "Financial and work-related calculators use simplified assumptions that may not match every Korean regulation, company policy, bank product, or local interpretation.",
      "When a number matters legally or financially, treat this page as the first calculation pass and verify with current official sources or a qualified expert before making a decision.",
    ],
    faqs: [
      { question: "Are salary and severance authoritative?", answer: "No. They are quick estimates with simplified assumptions, not legal/tax advice." },
      { question: "Why are timers and money calculators together?", answer: "They support everyday planning: time blocks, deadlines, percentages, VAT, loans, salary, and leave are often checked in the same workflow." },
      { question: "Can I use the result in contracts or filings?", answer: "Use it only as a reference. Official filings, payroll, contracts, and tax decisions require current official rules and professional confirmation." },
    ],
    relatedToolSlugs: ["krw-currency-calculator", "unit-converter", "kst-timezone-converter"],
    ko: {
      title: "생활 계산기 모음",
      shortTitle: "생활 계산기",
      description: "날짜, D-Day, 스톱워치, 포모도로, 퍼센트, 부가세, 팁, 대출, 급여, 퇴직금, 연차 계산을 한 페이지에서 제공합니다.",
      seoTitle: "생활 계산기 모음 | 날짜 D-Day 대출 급여 부가세 팁 포모도로",
      seoDescription: "날짜 계산기, D-Day, 스톱워치, 포모도로, 퍼센트, 부가세, 팁, 대출, 급여, 퇴직금, 연차 계산기를 한 페이지에서 사용합니다.",
      inputs: [
        { label: "금액, 날짜, 비율", description: "선택한 계산기에 따라 날짜, 금액, 퍼센트, 기간, 근무일, 타이머 길이를 입력합니다." },
        { label: "계산 가정", description: "이자율, 세율, 급여 기간, 연차 기준처럼 빠른 추정에 필요한 단순 가정을 넣습니다." },
      ],
      outputs: [
        { label: "계산 결과", description: "날짜 차이, 납입액, 합계, 타이머 상태, 근로 관련 추정값을 표시합니다." },
        { label: "참고 기준", description: "결과를 다시 검증하기 쉽도록 단순화된 계산 기준을 함께 안내합니다." },
      ],
      examples: [
        { label: "대출 추정", input: "1천만원, 연 5%, 36개월", output: "예상 월 납입액" },
        { label: "D-Day 확인", input: "프로젝트 마감일", output: "남은 일수" },
        { label: "부가세 분리", input: "부가세 포함 총액", output: "공급가액과 부가세" },
      ],
      explanation: [
        "생활 계산기는 날짜, 퍼센트, 부가세, 대출, 급여 추정, 타이머를 계획 중 자주 오가기 때문에 한 페이지에 묶었습니다.",
        "결과는 빠른 참고값입니다. 머릿속 계산을 확인하고 계획을 비교하는 데 유용하지만 급여 프로그램, 세법, 은행 견적, 노동법 검토를 대체하지 않습니다.",
        "재정·근로 관련 계산은 한국의 모든 규정, 회사 정책, 은행 상품, 지역별 해석을 반영하지 못하는 단순 가정 기반입니다.",
        "숫자가 법적·금전적으로 중요하다면 이 페이지를 1차 계산으로만 사용하고 최신 공식 자료나 전문가 확인을 거쳐야 합니다.",
      ],
      faqs: [
        { question: "급여/퇴직금 계산이 법적으로 정확한가요?", answer: "아닙니다. 단순 가정 기반 빠른 추정이며 법률·세무 조언이 아닙니다." },
        { question: "타이머와 금액 계산기를 왜 같이 두었나요?", answer: "일상 계획에서는 시간 블록, 마감일, 퍼센트, 부가세, 대출, 급여, 연차를 같은 흐름에서 확인하는 경우가 많기 때문입니다." },
        { question: "계약서나 신고에 바로 써도 되나요?", answer: "참고용으로만 사용하세요. 공식 신고, 급여, 계약, 세무 판단에는 최신 공식 기준과 전문가 검토가 필요합니다." },
      ],
    },
  },
  {
    slug: "pdf-toolkit",
    title: "PDF Toolkit",
    shortTitle: "PDF Toolkit",
    description: "Merge, split, reorder PDFs, render PDF pages to images, and combine images into a PDF from one local browser workspace.",
    category: "file-media",
    tier: 1,
    seoTitle: "PDF Toolkit | Merge Split Reorder PDF, PDF to Image, Image to PDF",
    seoDescription: "A browser-local PDF toolkit for merging and splitting PDFs, reordering page ranges, converting PDF pages to PNG/JPG, and creating PDFs from images.",
    inputs: [
      { label: "PDF or image files", description: "Upload PDFs for merge/split or page rendering, or PNG/JPG images for image-to-PDF creation." },
      { label: "Mode-specific options", description: "Choose page ranges, output image format, render scale, page size, margins, and file order." },
    ],
    outputs: [
      { label: "PDF or images", description: "Download a new PDF, individual page images, or a ZIP package depending on the selected tab." },
    ],
    examples: [
      { label: "Merge reports", input: "Three PDFs, all pages", output: "One combined PDF" },
      { label: "Extract page images", input: "PDF pages 1-3", output: "PNG or JPG images" },
      { label: "Receipt PDF", input: "Several JPG/PNG photos", output: "Single upload-ready PDF" },
    ],
    explanation: [
      "The PDF Toolkit groups the PDF workflows that users usually need together: combine documents, pick page ranges, render pages as images, and turn image files into a PDF.",
      "The core file processing is browser-local with pdf-lib, pdf.js, Canvas, and ZIP packaging. Files are not uploaded for the merge/render/create operations.",
      "Encrypted, damaged, or very large PDFs may fail because browser memory and client-side PDF libraries have practical limits. For sensitive files, local browser processing avoids unnecessary server upload risk.",
    ],
    faqs: [
      { question: "Are files uploaded to a server?", answer: "No. The PDF and image processing tabs run in your browser. Network diagnostics elsewhere may call APIs, but this PDF toolkit does not upload your files." },
      { question: "Why combine PDF tools into one page?", answer: "Users who work with PDFs often need several adjacent operations in one session. Tabs keep the tools discoverable without creating separate menu items for every PDF action." },
      { question: "Does PDF to image perform OCR?", answer: "No. It renders pages as images. Scanned documents remain images unless a separate OCR feature is added later." },
    ],
    relatedToolSlugs: ["image-format-converter", "og-image-generator", "qr-barcode-generator"],
    ko: {
      title: "PDF 도구 모음",
      shortTitle: "PDF 도구",
      description: "PDF 병합·분할·재정렬, PDF 페이지 이미지 변환, 이미지 여러 장 PDF 생성, 텍스트 추출, 페이지 삭제, 2-up 병합, 여백 자르기를 한 메뉴에서 처리합니다.",
      seoTitle: "PDF 도구 모음 | PDF 병합 분할 재정렬, 텍스트 추출, 여백 자르기",
      seoDescription: "PDF 병합/분할/재정렬, PDF 페이지 PNG/JPG 변환, 이미지 PDF 생성, 텍스트 추출, 페이지 삭제, 2-up 병합, 여백 자르기를 브라우저 로컬 처리로 제공합니다.",
      inputs: [
        { label: "PDF 또는 이미지 파일", description: "병합/분할/페이지 이미지 변환에는 PDF를, 이미지 PDF 생성에는 PNG/JPG 이미지를 업로드합니다." },
        { label: "작업별 옵션", description: "페이지 범위, 출력 이미지 포맷, 렌더 배율, 페이지 크기, 여백, 파일 순서를 조정합니다." },
      ],
      outputs: [
        { label: "PDF 또는 이미지", description: "선택한 탭에 따라 새 PDF, 페이지별 이미지, ZIP 패키지를 다운로드합니다." },
      ],
      examples: [
        { label: "보고서 병합", input: "PDF 3개, 전체 페이지", output: "하나의 통합 PDF" },
        { label: "페이지 이미지 추출", input: "PDF 1-3 페이지", output: "PNG 또는 JPG 이미지" },
        { label: "영수증 PDF", input: "JPG/PNG 사진 여러 장", output: "업로드용 단일 PDF" },
      ],
      explanation: [
        "PDF 도구 모음은 실제 사용자가 한 세션에서 자주 이어서 쓰는 작업을 한 페이지에 묶었습니다. 문서 합치기, 페이지 범위 선택, 페이지 이미지 변환, 이미지 파일 PDF 묶기를 탭으로 전환합니다.",
        "핵심 파일 처리는 pdf-lib, pdf.js, Canvas, ZIP 패키징을 이용해 브라우저 안에서 수행됩니다. 병합/렌더링/생성 과정에서 파일을 서버로 업로드하지 않습니다.",
        "암호화되었거나 손상된 PDF, 지나치게 큰 PDF는 브라우저 메모리와 클라이언트 PDF 라이브러리 한계로 실패할 수 있습니다. 민감한 파일은 로컬 처리 방식이 불필요한 서버 업로드 위험을 줄입니다.",
      ],
      faqs: [
        { question: "파일이 서버로 업로드되나요?", answer: "아닙니다. PDF/이미지 처리 탭은 브라우저에서 실행됩니다. 다른 네트워크 진단 도구와 달리 이 PDF 도구 모음은 파일을 업로드하지 않습니다." },
        { question: "PDF 도구를 왜 한 메뉴로 합쳤나요?", answer: "PDF 작업은 병합, 분할, 이미지 변환, 이미지 PDF 생성이 한 흐름에서 자주 이어집니다. 탭 구조가 메뉴를 늘리지 않으면서 기능을 찾기 쉽게 만듭니다." },
        { question: "PDF 이미지 변환은 OCR도 하나요?", answer: "아닙니다. 페이지를 이미지로 렌더링합니다. 스캔 문서는 별도 OCR 기능이 추가되기 전까지 이미지 상태로 유지됩니다." },
      ],
    },
  },
  {
    slug: "og-image-generator",
    title: "OG Image & Thumbnail Generator",
    shortTitle: "OG Image",
    description: "Create 1200×630 social preview images for blogs, X, Kakao, newsletters, and documentation thumbnails from browser templates.",
    category: "file-media",
    tier: 1,
    seoTitle: "OG Image Generator | 1200x630 Social Thumbnail Maker",
    seoDescription: "Generate OpenGraph, Twitter, Kakao, and blog thumbnail PNG images with browser templates, Korean text wrapping, and copy-ready social preview sizing.",
    inputs: [
      { label: "Title and subtitle", description: "Enter the visible copy for the thumbnail and choose a template style." },
      { label: "Visual options", description: "Adjust colors, layout, and preview text before exporting the image." },
    ],
    outputs: [
      { label: "1200×630 PNG", description: "Download a social preview image suitable for OpenGraph and blog cards." },
      { label: "Preview check", description: "Inspect Korean line breaks and contrast before publishing." },
    ],
    examples: [
      { label: "Blog thumbnail", input: "Post title and short summary", output: "OG PNG for a post card" },
      { label: "Launch note", input: "Tool name and one-line benefit", output: "Share image for social channels" },
      { label: "Documentation cover", input: "Guide headline", output: "Consistent 1200×630 cover" },
    ],
    explanation: [
      "Social cards often decide whether a useful post is noticed. This generator focuses on a standard 1200×630 canvas so the same image works across common OpenGraph, Twitter/X, Kakao, and blog preview contexts.",
      "The tool is meant for fast, repeatable editorial production: pick a template, write a concise title, verify line breaks, then export a PNG without opening a full design application.",
      "Korean text can wrap differently depending on font, length, and punctuation. Always preview the exported layout, especially for mixed Korean-English titles and numbers.",
      "The generator uses browser rendering, so final visual fidelity depends on available fonts and canvas behavior. For brand-critical campaigns, treat the result as a draft and run a manual design review.",
    ],
    faqs: [
      { question: "Can I upload a logo?", answer: "This MVP uses built-in templates. Logo upload can be added later after validating safe image handling and layout controls." },
      { question: "Is 1200×630 always the right size?", answer: "It is the common OpenGraph baseline, but some platforms crop differently. Keep important text away from edges." },
      { question: "Are titles sent to the server?", answer: "No. The preview and PNG export are generated in the browser." },
    ],
    relatedToolSlugs: ["icon-favicon-generator", "image-format-converter", "color-contrast-checker"],
    ko: {
      title: "OG이미지 / 썸네일 생성기",
      shortTitle: "OG 이미지",
      description: "블로그, X, 카카오, 뉴스레터, 문서 커버에 쓸 1200×630 공유 썸네일을 브라우저 템플릿으로 만듭니다.",
      seoTitle: "OG이미지 생성기 | 1200x630 썸네일 만들기",
      seoDescription: "OpenGraph, Twitter, 카카오, 블로그 공유용 1200×630 PNG 이미지를 템플릿과 한국어 줄바꿈 확인으로 생성합니다.",
      inputs: [
        { label: "제목과 부제목", description: "썸네일에 표시할 문구를 입력하고 템플릿 스타일을 선택합니다." },
        { label: "시각 옵션", description: "색상, 레이아웃, 미리보기 문구를 조정한 뒤 내보냅니다." },
      ],
      outputs: [
        { label: "1200×630 PNG", description: "OpenGraph와 블로그 카드에 쓰기 좋은 공유 미리보기 이미지를 다운로드합니다." },
        { label: "미리보기 확인", description: "게시 전에 한국어 줄바꿈과 대비를 확인합니다." },
      ],
      examples: [
        { label: "블로그 썸네일", input: "글 제목과 짧은 요약", output: "게시글 카드용 OG PNG" },
        { label: "런칭 안내", input: "도구명과 한 줄 장점", output: "소셜 공유 이미지" },
        { label: "문서 커버", input: "가이드 제목", output: "일관된 1200×630 커버" },
      ],
      explanation: [
        "소셜 카드 이미지는 좋은 글이 클릭되는지에 큰 영향을 줍니다. 이 도구는 1200×630 표준 캔버스에 맞춰 OpenGraph, Twitter/X, 카카오, 블로그 미리보기에 함께 쓰기 좋은 이미지를 빠르게 만듭니다.",
        "전체 디자인 툴을 열지 않고 템플릿 선택, 짧은 제목 작성, 줄바꿈 확인, PNG 다운로드까지 이어지는 반복 편집 흐름을 목표로 합니다.",
        "한국어는 글꼴, 문장 길이, 문장부호, 영문 혼용 여부에 따라 줄바꿈이 어색해질 수 있으므로 게시 전 반드시 미리보기를 확인해야 합니다.",
        "브라우저 렌더링을 사용하므로 최종 품질은 사용 가능한 글꼴과 Canvas 동작에 영향을 받습니다. 브랜드 캠페인용 이미지는 초안으로 보고 별도 디자인 검수를 권장합니다.",
      ],
      faqs: [
        { question: "로고 업로드도 되나요?", answer: "MVP는 내장 템플릿 중심입니다. 안전한 이미지 처리와 레이아웃 제어를 검증한 뒤 추가할 수 있습니다." },
        { question: "1200×630이면 모든 플랫폼에서 맞나요?", answer: "일반적인 OpenGraph 기준이지만 플랫폼마다 일부 크롭이 다를 수 있습니다. 중요한 문구는 가장자리에서 떨어뜨려 배치하세요." },
        { question: "입력한 제목이 서버로 전송되나요?", answer: "아닙니다. 미리보기와 PNG 내보내기는 브라우저에서 생성됩니다." },
      ],
    },
  },
  {
    slug: "qr-barcode-generator",
    title: "QR & Barcode Generator",
    shortTitle: "QR/Barcode",
    description: "Generate QR codes for URLs, text, Wi-Fi, and contact cards plus common barcodes locally in the browser.",
    category: "file-media",
    tier: 1,
    seoTitle: "QR Code and Barcode Generator | SVG PNG Download",
    seoDescription: "Create URL, text, Wi-Fi, vCard QR codes and Code128/EAN/UPC barcodes locally with SVG or PNG download, scanner verification guidance, and privacy notes.",
    inputs: [
      { label: "QR content", description: "Choose URL, text, Wi-Fi, vCard, or another QR content pattern and enter the value." },
      { label: "Barcode value", description: "Enter a supported barcode value such as Code128, EAN, or UPC depending on the selected format." },
    ],
    outputs: [
      { label: "QR SVG/PNG", description: "Download a scannable QR image for print, signage, packaging, or internal documents." },
      { label: "Barcode PNG", description: "Generate a barcode image and verify it with a physical scanner before operational use." },
    ],
    examples: [
      { label: "Wi-Fi QR", input: "SSID and password", output: "Scannable QR code" },
      { label: "Event link", input: "Landing page URL", output: "QR code for posters" },
      { label: "Inventory label", input: "Internal item code", output: "Code128-style barcode" },
    ],
    explanation: [
      "QR codes are useful when a user must move from offline material to a URL, Wi-Fi profile, contact card, or text payload without retyping. Barcodes are useful for labels, inventory, and scan-first workflows.",
      "The generator produces codes in the browser and lets you download image assets for print or digital use. It does not shorten URLs, track scans, or create analytics links by itself.",
      "Barcode formats have strict length and character rules. A value that renders visually may still be invalid for a retailer, payment provider, or scanner workflow if the format assumptions are wrong.",
      "Always test with the real devices and apps that will scan the code. Printing size, contrast, quiet zone, paper finish, and camera quality can all affect scan reliability.",
    ],
    faqs: [
      { question: "Are values uploaded?", answer: "No. Generation is local in the browser." },
      { question: "Can I use this for payments or product labels?", answer: "Only after testing with the real payment app, POS system, or scanner. This tool creates the visual code, not a certified payment or retail workflow." },
      { question: "Does this track QR scans?", answer: "No. To track scans you would need a separate redirect or analytics service, which changes the privacy model." },
    ],
    relatedToolSlugs: ["og-image-generator", "icon-favicon-generator", "image-format-converter"],
    ko: {
      title: "QR / Barcode 생성기",
      shortTitle: "QR/Barcode",
      description: "URL, 텍스트, Wi-Fi, vCard QR과 주요 바코드를 브라우저에서 생성하고 인쇄·문서용 이미지로 내려받습니다.",
      seoTitle: "QR코드 바코드 생성기 | SVG PNG 다운로드",
      seoDescription: "URL, 텍스트, Wi-Fi, vCard QR 코드와 Code128/EAN/UPC 바코드를 로컬에서 생성하고 스캐너 검증 안내와 개인정보 주의사항을 제공합니다.",
      inputs: [
        { label: "QR 내용", description: "URL, 텍스트, Wi-Fi, vCard 등 QR 유형을 고르고 값을 입력합니다." },
        { label: "바코드 값", description: "선택한 포맷에 맞는 Code128, EAN, UPC 등의 값을 입력합니다." },
      ],
      outputs: [
        { label: "QR SVG/PNG", description: "인쇄물, 안내문, 패키지, 내부 문서에 쓸 QR 이미지를 다운로드합니다." },
        { label: "바코드 PNG", description: "바코드 이미지를 생성하고 운영 전 실제 스캐너로 검증합니다." },
      ],
      examples: [
        { label: "Wi-Fi QR", input: "SSID와 비밀번호", output: "스캔 가능한 QR 코드" },
        { label: "행사 링크", input: "랜딩 페이지 URL", output: "포스터용 QR 코드" },
        { label: "재고 라벨", input: "내부 상품 코드", output: "Code128 형태 바코드" },
      ],
      explanation: [
        "QR 코드는 오프라인 안내물에서 URL, Wi-Fi, 연락처, 텍스트로 이동할 때 재입력을 줄여줍니다. 바코드는 라벨, 재고, 스캔 우선 업무 흐름에 유용합니다.",
        "생성은 브라우저에서 이루어지며 인쇄나 디지털 사용을 위한 이미지를 내려받을 수 있습니다. 이 도구 자체는 URL 단축, 스캔 추적, 분석 링크를 만들지 않습니다.",
        "바코드 포맷은 길이와 문자 규칙이 엄격합니다. 화면에 그려졌더라도 소매, 결제, 스캐너 시스템의 포맷 가정과 맞지 않으면 운영에 사용할 수 없습니다.",
        "실제 사용할 기기와 앱으로 반드시 테스트하세요. 인쇄 크기, 대비, 여백, 종이 재질, 카메라 품질이 스캔 성공률에 영향을 줍니다.",
      ],
      faqs: [
        { question: "입력값이 업로드되나요?", answer: "아닙니다. 생성은 브라우저 로컬에서 수행됩니다." },
        { question: "결제나 상품 라벨에 바로 써도 되나요?", answer: "실제 결제 앱, POS, 스캐너에서 검증한 뒤 사용해야 합니다. 이 도구는 시각 코드를 만들 뿐 인증된 결제·유통 흐름을 제공하지 않습니다." },
        { question: "QR 스캔 횟수를 추적하나요?", answer: "아닙니다. 추적이 필요하면 별도 리다이렉트나 분석 서비스를 써야 하며, 그 경우 개인정보 처리 방식도 달라집니다." },
      ],
    },
  },
  {
    slug: "image-to-ascii-art",
    title: "Image to ASCII Art Converter",
    shortTitle: "Image ASCII",
    description: "Convert photos, logos, and small images into copyable plain-text ASCII art locally in the browser.",
    category: "file-media",
    tier: 1,
    seoTitle: "Image to ASCII Art Converter | Photo to Text Art",
    seoDescription: "Upload an image and convert it to copyable ASCII text art with adjustable width, character palettes, inversion, and TXT download. Browser-local processing.",
    inputs: [
      { label: "Image file", description: "Upload a browser-readable PNG, JPG, WebP, GIF, SVG, or similar image up to 12MB." },
      { label: "ASCII settings", description: "Choose output width, character palette, tone adjustment, and brightness inversion." },
    ],
    outputs: [
      { label: "ASCII text", description: "Copy the generated text art or download it as a .txt file." },
    ],
    examples: [
      { label: "Profile photo", input: "Small portrait image", output: "Monospace ASCII portrait for README or chat" },
      { label: "Logo sketch", input: "High-contrast logo", output: "Text-only logo approximation" },
    ],
    explanation: [
      "The converter follows the same basic idea as CLI tools such as ascii-image-converter: resize the source image, calculate pixel brightness, then map tones to characters.",
      "Processing runs in the browser with Canvas, so uploaded images are not sent to a server. Very large photos are intentionally capped to avoid mobile memory issues.",
      "ASCII art looks best in a monospace font. Narrow widths paste well into messengers; wider widths preserve more image detail for documents and text files.",
    ],
    faqs: [
      { question: "Are images uploaded?", answer: "No. The file is decoded and converted locally in your browser." },
      { question: "Why does the result look stretched?", answer: "Text characters are taller than they are wide, so the tool compensates with an aspect-ratio adjustment. Some fonts may still render slightly differently." },
      { question: "Does it generate colored ANSI ASCII?", answer: "This browser tool outputs plain text first for copy/paste reliability. Colored terminal output can be added later as a separate mode." },
    ],
    relatedToolSlugs: ["image-format-converter", "image-editing-toolkit", "og-image-generator"],
    ko: {
      title: "이미지 → ASCII 아트 변환기",
      shortTitle: "이미지 ASCII",
      description: "사진, 로고, 작은 이미지를 복사 가능한 ASCII 텍스트 아트로 브라우저에서 변환합니다.",
      seoTitle: "이미지 ASCII 아트 변환기 | 사진을 텍스트 아트로",
      seoDescription: "이미지를 업로드해 문자 너비, 팔레트, 밝기 반전, 명암 보정을 조정하고 복사 가능한 ASCII 텍스트 또는 TXT 파일로 변환합니다.",
      inputs: [
        { label: "이미지 파일", description: "12MB 이하의 PNG, JPG, WebP, GIF, SVG 등 브라우저가 읽을 수 있는 이미지를 업로드합니다." },
        { label: "ASCII 설정", description: "출력 너비, 문자 팔레트, 명암 보정, 밝기 반전을 조정합니다." },
      ],
      outputs: [
        { label: "ASCII 텍스트", description: "생성된 텍스트 아트를 복사하거나 .txt 파일로 다운로드합니다." },
      ],
      examples: [
        { label: "프로필 사진", input: "작은 인물 이미지", output: "README나 메신저에 붙여넣기 좋은 모노스페이스 ASCII 초상" },
        { label: "로고 스케치", input: "대비가 강한 로고", output: "텍스트만으로 근사한 로고 형태" },
      ],
      explanation: [
        "이 도구는 ascii-image-converter 같은 CLI 도구와 유사한 원리로 동작합니다. 이미지를 작게 리사이즈하고 픽셀 밝기를 계산한 뒤 문자 팔레트에 매핑합니다.",
        "변환은 브라우저 Canvas에서 실행되며 이미지는 서버로 업로드되지 않습니다. 모바일 메모리 문제를 줄이기 위해 큰 사진은 크기 제한을 둡니다.",
        "ASCII 아트는 모노스페이스 글꼴에서 가장 잘 보입니다. 좁은 폭은 메신저에 붙여넣기 좋고, 넓은 폭은 문서나 텍스트 파일에서 디테일이 살아납니다.",
      ],
      faqs: [
        { question: "이미지가 서버로 업로드되나요?", answer: "아닙니다. 파일은 브라우저 안에서 디코딩되고 변환됩니다." },
        { question: "결과가 조금 늘어나 보이는 이유는?", answer: "문자는 보통 세로가 가로보다 길어 보이므로 도구에서 비율을 보정합니다. 다만 사용하는 글꼴에 따라 약간 다르게 보일 수 있습니다." },
        { question: "컬러 ANSI ASCII도 만들 수 있나요?", answer: "현재는 복사/붙여넣기 안정성을 위해 일반 텍스트를 우선 제공합니다. 컬러 터미널 출력은 이후 별도 모드로 추가할 수 있습니다." },
      ],
    },
  },
  {
    slug: "two-factor-code-generator",
    title: "2FA Verification Code Generator",
    shortTitle: "2FA Code",
    description: "Generate 6-digit TOTP verification codes from a 2FA secret locally in the browser.",
    category: "developer-automation",
    tier: 1,
    seoTitle: "2FA Verification Code Generator | TOTP 6 Digit Authenticator Code",
    seoDescription: "Generate 6-digit TOTP authenticator verification codes from a 2FA secret in your browser. Supports Base32 secrets and otpauth URLs with local-only processing.",
    inputs: [
      { label: "2FA secret", description: "Paste a Base32 authenticator secret or an otpauth://totp URL." },
      { label: "TOTP options", description: "Use the standard 30-second period, 6 digits, and SHA-1 unless your service specifies otherwise." },
    ],
    outputs: [
      { label: "Verification code", description: "Shows the current 6-digit TOTP code and seconds remaining before it rotates." },
    ],
    examples: [
      { label: "Authenticator secret", input: "JBSWY3DPEHPK3PXP", output: "6-digit code that refreshes every 30 seconds" },
      { label: "otpauth URL", input: "otpauth://totp/Example:user?secret=...", output: "Parsed issuer/account and current code" },
    ],
    explanation: [
      "This tool implements the standard TOTP flow used by authenticator apps: decode the Base32 secret, combine it with the current 30-second time counter, sign with HMAC, then truncate the result into a short numeric code.",
      "Generation runs in your browser with the Web Crypto API. The secret is not sent to this site, but a 2FA secret is still highly sensitive. Use this only on a device and network you trust.",
      "Most services use 6 digits, SHA-1, and a 30-second period. If a service uses different settings, change the options before copying the code.",
    ],
    faqs: [
      { question: "Is the 2FA secret uploaded?", answer: "No. The code is generated in your browser. Avoid pasting real production secrets on shared or untrusted devices." },
      { question: "Why does the code keep changing?", answer: "TOTP codes are time-based. A new code is calculated each period, commonly every 30 seconds." },
      { question: "Can this replace an authenticator app?", answer: "It can calculate the same style of code, but a dedicated authenticator app or password manager is safer for daily storage." },
    ],
    relatedToolSlugs: ["developer-text-toolkit", "json-yaml-validator", "timestamp-converter"],
    ko: {
      title: "2FA 인증 코드 생성기",
      shortTitle: "2FA 코드",
      description: "2FA 인증 시크릿값으로 6자리 TOTP verification code를 브라우저에서 생성합니다.",
      seoTitle: "2FA 인증 코드 생성기 | TOTP 6자리 verification code",
      seoDescription: "Base32 2FA 시크릿 또는 otpauth URL을 입력해 6자리 TOTP 인증 코드를 브라우저 로컬에서 생성합니다.",
      inputs: [
        { label: "2FA 시크릿", description: "Authenticator 앱에 등록하는 Base32 secret 또는 otpauth://totp URL을 붙여넣습니다." },
        { label: "TOTP 옵션", description: "서비스가 별도로 안내하지 않으면 표준값인 30초, 6자리, SHA-1을 사용합니다." },
      ],
      outputs: [
        { label: "인증 코드", description: "현재 6자리 verification code와 다음 코드까지 남은 시간을 표시합니다." },
      ],
      examples: [
        { label: "Authenticator secret", input: "JBSWY3DPEHPK3PXP", output: "30초마다 갱신되는 6자리 코드" },
        { label: "otpauth URL", input: "otpauth://totp/Example:user?secret=...", output: "issuer/account 파싱 및 현재 코드" },
      ],
      explanation: [
        "이 도구는 인증 앱에서 쓰는 표준 TOTP 흐름을 따릅니다. Base32 시크릿을 디코딩하고, 현재 30초 단위 시간 counter와 HMAC을 계산한 뒤 짧은 숫자 코드로 변환합니다.",
        "코드 생성은 Web Crypto API로 브라우저에서 실행됩니다. 시크릿은 이 사이트로 전송하지 않지만, 2FA 시크릿 자체는 매우 민감하므로 신뢰할 수 있는 기기에서만 사용하세요.",
        "대부분의 서비스는 6자리, SHA-1, 30초 주기를 씁니다. 다른 설정을 안내받은 경우 옵션을 바꾼 뒤 코드를 복사하세요.",
      ],
      faqs: [
        { question: "2FA 시크릿이 서버로 전송되나요?", answer: "아닙니다. 코드는 브라우저에서 생성됩니다. 다만 실제 운영 계정의 시크릿은 공용/불신 기기에서 붙여넣지 마세요." },
        { question: "코드가 계속 바뀌는 이유는?", answer: "TOTP는 시간 기반 코드입니다. 보통 30초마다 새 코드가 계산됩니다." },
        { question: "인증 앱 대신 써도 되나요?", answer: "같은 방식의 코드를 계산할 수는 있지만, 일상적인 보관 용도로는 인증 앱이나 비밀번호 관리자가 더 안전합니다." },
      ],
    },
  },
  {
    slug: "webhook-request-simulator",
    title: "Webhook Request Simulator",
    shortTitle: "Webhook Tester",
    description: "Send controlled test HTTP requests to webhook endpoints and inspect status, headers, timing, and response body before connecting automation.",
    category: "developer-automation",
    tier: 1,
    seoTitle: "Webhook Request Simulator | Browser HTTP Tester",
    seoDescription: "Test webhook URLs with GET, POST, PUT, PATCH, DELETE, custom headers, JSON bodies, response inspection, and safe endpoint-use warnings.",
    inputs: [
      { label: "Request target", description: "Enter a URL you own or are authorized to test and choose the HTTP method." },
      { label: "Headers and body", description: "Add JSON payloads and non-secret headers for realistic webhook receiver testing." },
    ],
    outputs: [
      { label: "Response summary", description: "Shows status code, response time, headers, and body preview where the browser allows access." },
      { label: "Debug context", description: "Use the output to check receiver availability, payload shape, and basic automation wiring." },
    ],
    examples: [
      { label: "Slack-style webhook", input: "POST JSON", output: "200 OK preview" },
      { label: "Local receiver", input: "POST to test endpoint", output: "Inspect accepted payload" },
      { label: "Method check", input: "GET vs POST", output: "Confirm allowed methods" },
    ],
    explanation: [
      "Webhook failures are often caused by small mismatches: wrong method, invalid JSON, missing headers, unavailable receiver, or an unexpected response code. This simulator gives a quick manual check before wiring a scheduler, bot, or third-party automation.",
      "Requests are real network requests. Unlike purely local text tools, the target server, browser, network path, and CORS policy all affect what you can send and inspect.",
      "Do not use this tool for scanning, load testing, bypassing authentication, or probing endpoints you do not control. It is a debugging aid for your own receivers and test services.",
      "Avoid production secrets in public test requests. If a receiver requires authorization, use a temporary token with narrow scope and revoke it after testing.",
    ],
    faqs: [
      { question: "Can this bypass CORS?", answer: "No. Browser restrictions apply. If a server does not allow the browser to read the response, the tool cannot safely bypass that." },
      { question: "Are requests sent to the target server?", answer: "Yes. This is the point of the simulator, so target logs may record the request." },
      { question: "Can I use production webhook secrets?", answer: "Avoid it. Use a temporary test endpoint or token whenever possible." },
    ],
    relatedToolSlugs: ["json-yaml-validator", "cron-explainer", "network-diagnostics"],
    ko: {
      title: "웹훅 요청 시뮬레이터",
      shortTitle: "Webhook 테스트",
      description: "자동화 연결 전에 webhook endpoint로 제어된 HTTP 테스트 요청을 보내고 상태, 헤더, 시간, 응답 본문을 확인합니다.",
      seoTitle: "웹훅 요청 시뮬레이터 | 브라우저 HTTP 테스트",
      seoDescription: "GET/POST/PUT/PATCH/DELETE, 커스텀 헤더, JSON 본문, 응답 확인, 안전한 endpoint 사용 안내로 webhook URL을 테스트합니다.",
      inputs: [
        { label: "요청 대상", description: "본인 소유이거나 테스트 허가를 받은 URL과 HTTP 메서드를 입력합니다." },
        { label: "헤더와 본문", description: "JSON payload와 비밀값이 아닌 헤더를 넣어 실제 webhook 수신 상황을 점검합니다." },
      ],
      outputs: [
        { label: "응답 요약", description: "브라우저가 허용하는 범위에서 상태 코드, 응답 시간, 헤더, 본문 미리보기를 표시합니다." },
        { label: "디버깅 맥락", description: "수신기 동작 여부, payload 형태, 기본 자동화 연결 상태를 확인합니다." },
      ],
      examples: [
        { label: "Slack 스타일 webhook", input: "POST JSON", output: "200 OK 미리보기" },
        { label: "로컬 수신기", input: "테스트 endpoint로 POST", output: "payload 수신 확인" },
        { label: "메서드 확인", input: "GET과 POST 비교", output: "허용 메서드 확인" },
      ],
      explanation: [
        "Webhook 오류는 잘못된 메서드, 깨진 JSON, 누락된 헤더, 수신기 중단, 예상과 다른 응답 코드처럼 작은 불일치에서 자주 발생합니다. 이 도구는 스케줄러, 봇, 외부 자동화에 연결하기 전 수동 점검을 돕습니다.",
        "요청은 실제 네트워크 요청입니다. 순수 로컬 텍스트 도구와 달리 대상 서버, 브라우저, 네트워크 경로, CORS 정책이 전송과 응답 확인 범위에 영향을 줍니다.",
        "스캔, 부하 테스트, 인증 우회, 본인 소유가 아닌 endpoint 탐색 용도로 사용하지 마세요. 이 도구는 본인 수신기와 테스트 서비스 디버깅을 위한 보조 도구입니다.",
        "공개 테스트 요청에 운영 secret을 넣지 않는 것이 안전합니다. 인증이 필요하다면 범위가 좁은 임시 토큰을 쓰고 테스트 후 폐기하세요.",
      ],
      faqs: [
        { question: "CORS를 우회하나요?", answer: "아닙니다. 브라우저 제한이 적용됩니다. 서버가 응답 읽기를 허용하지 않으면 안전하게 우회할 수 없습니다." },
        { question: "요청이 실제 대상 서버로 전송되나요?", answer: "네. 시뮬레이터의 목적이 실제 요청 점검이므로 대상 서버 로그에 요청 흔적이 남을 수 있습니다." },
        { question: "운영 webhook secret을 써도 되나요?", answer: "권장하지 않습니다. 가능하면 임시 테스트 endpoint나 제한된 토큰을 사용하세요." },
      ],
    },
  },
  {
    slug: "network-diagnostics",
    title: "Check My IP",
    shortTitle: "My IP",
    description: "Check the public IP address for your current connection.",
    category: "network-diagnostics",
    tier: 1,
    seoTitle: "Check My IP | Public IP Address Lookup",
    seoDescription: "Check your current public IP address quickly from the browser.",
    inputs: [{ label: "Connection", description: "Uses your current browser connection to request the public IP lookup endpoint." }],
    outputs: [{ label: "Public IP", description: "Shows the public IP address detected for the current connection." }],
    examples: [{ label: "Current connection", input: "Open the page and click check", output: "Your public IP address" }],
    explanation: [
      "This tool shows the public IP address seen from your current connection.",
      "It is useful when you need to confirm the IP used by your home, office, VPN, proxy, mobile hotspot, or cloud browser session.",
    ],
    faqs: [
      { question: "Is this my private local IP?", answer: "No. It shows the public IP address visible to external services, not your local LAN address such as 192.168.x.x." },
      { question: "Why does it change?", answer: "Your public IP can change when you switch networks, enable a VPN/proxy, reconnect mobile data, or when your ISP rotates addresses." },
    ],
    relatedToolSlugs: ["webhook-request-simulator", "json-yaml-validator", "timestamp-converter"],
    ko: {
      title: "내 IP 확인",
      shortTitle: "내 IP",
      description: "현재 접속 환경의 공인 IP 주소를 확인합니다.",
      seoTitle: "내 IP 확인 | 공인 IP 주소 조회",
      seoDescription: "현재 브라우저 접속 환경에서 보이는 공인 IP 주소를 빠르게 확인합니다.",
      inputs: [{ label: "접속 환경", description: "현재 브라우저 연결로 공인 IP 조회 엔드포인트를 호출합니다." }],
      outputs: [{ label: "공인 IP", description: "현재 접속에서 외부에 보이는 공인 IP 주소를 표시합니다." }],
      examples: [{ label: "현재 연결", input: "페이지를 열고 확인 버튼 클릭", output: "현재 공인 IP 주소" }],
      explanation: [
        "이 도구는 현재 접속 환경에서 외부 서비스에 보이는 공인 IP 주소를 보여줍니다.",
        "집, 사무실, VPN, 프록시, 모바일 핫스팟, 클라우드 브라우저 세션에서 어떤 IP로 접속되는지 확인할 때 사용할 수 있습니다.",
      ],
      faqs: [
        { question: "사설 내부 IP도 보여주나요?", answer: "아닙니다. 192.168.x.x 같은 내부 LAN 주소가 아니라 외부 서비스에 보이는 공인 IP 주소를 보여줍니다." },
        { question: "IP가 바뀌는 이유는 무엇인가요?", answer: "네트워크 전환, VPN/프록시 사용, 모바일 데이터 재연결, ISP 주소 갱신 등에 따라 공인 IP가 달라질 수 있습니다." },
      ],
    },
  },
  {
    slug: "icon-favicon-generator",
    title: "Icon Converter & Favicon Generator",
    shortTitle: "Icon Generator",
    description: "Generate favicon, Apple touch icon, and PWA icon PNG sets from one source image in the browser.",
    category: "file-media",
    tier: 1,
    seoTitle: "Icon Converter & Favicon Generator | PNG, SVG to Favicon Set",
    seoDescription: "Create favicon, Apple touch icon, PWA icon sizes, manifest JSON, and HTML tags from a PNG, JPG, SVG, or WebP image locally in your browser.",
    inputs: [
      { label: "Source image", description: "Upload a PNG, JPG, SVG, or WebP image up to 10MB." },
      { label: "Icon options", description: "Choose transparent or colored background, padding, corner radius, and file prefix." },
    ],
    outputs: [
      { label: "PNG icon set", description: "Downloads 16, 32, 48, 180, 192, and 512 pixel icons as individual files or one ZIP." },
      { label: "Manifest snippets", description: "Generates manifest.json icon entries and HTML link tags for site headers." },
    ],
    examples: [
      { label: "Website favicon", input: "Square logo PNG", output: "16×16, 32×32, 48×48 favicon PNG files" },
      { label: "iOS home icon", input: "Brand mark with solid background", output: "180×180 apple-touch-icon PNG" },
      { label: "PWA icon set", input: "App logo SVG", output: "192×192 and 512×512 manifest icons" },
    ],
    explanation: [
      "A modern site usually needs more than one icon. Browsers, iOS home-screen shortcuts, Android/PWA installs, and search previews all use different preferred sizes.",
      "This tool rasterizes one source image into practical favicon and app-icon PNG sizes, then creates a manifest.json starter and HTML link tags. The first version focuses on PNG output because it is broadly supported and predictable.",
      "Files are processed locally in the browser. Avoid uploading private unreleased brand assets to tools that send files to a server; this page is designed to avoid that workflow.",
    ],
    faqs: [
      { question: "Does it create a real .ico file?", answer: "The MVP creates PNG favicon sizes and HTML tags. Most modern browsers accept PNG favicons. ICO export can be added later if legacy compatibility becomes important." },
      { question: "What source image works best?", answer: "Use a square 512×512 or larger PNG/SVG with enough padding. Very thin text or tiny details can disappear at 16×16." },
      { question: "Are files uploaded?", answer: "No. Generation happens in the browser using Canvas and ZIP packaging." },
    ],
    relatedToolSlugs: ["image-format-converter", "color-contrast-checker", "slug-generator"],
    ko: {
      title: "아이콘 컨버터 / 파비콘 생성기",
      shortTitle: "아이콘 생성기",
      description: "이미지 하나로 favicon, Apple touch icon, PWA 아이콘 PNG 세트와 manifest 예시를 브라우저에서 생성합니다.",
      seoTitle: "아이콘 컨버터 / 파비콘 생성기 | PNG·SVG로 favicon 세트 만들기",
      seoDescription: "PNG, JPG, SVG, WebP 이미지를 favicon, Apple touch icon, PWA 아이콘 크기로 변환하고 manifest.json 및 HTML 태그를 생성합니다.",
      inputs: [
        { label: "원본 이미지", description: "10MB 이하의 PNG, JPG, SVG, WebP 이미지를 업로드합니다." },
        { label: "아이콘 옵션", description: "투명/색상 배경, 패딩, 둥근 모서리, 파일 이름 접두어를 조절합니다." },
      ],
      outputs: [
        { label: "PNG 아이콘 세트", description: "16, 32, 48, 180, 192, 512px 아이콘을 개별 파일 또는 ZIP으로 내려받습니다." },
        { label: "manifest 예시", description: "사이트 헤더에 넣을 HTML link 태그와 manifest.json 아이콘 항목을 생성합니다." },
      ],
      examples: [
        { label: "웹사이트 파비콘", input: "정사각형 로고 PNG", output: "16×16, 32×32, 48×48 favicon PNG" },
        { label: "iOS 홈 화면 아이콘", input: "배경이 있는 브랜드 마크", output: "180×180 apple-touch-icon PNG" },
        { label: "PWA 아이콘", input: "앱 로고 SVG", output: "192×192, 512×512 manifest 아이콘" },
      ],
      explanation: [
        "현대 웹사이트는 아이콘 하나만으로 충분하지 않습니다. 브라우저 탭, iOS 홈 화면, Android/PWA 설치, 검색 미리보기에서 선호하는 크기가 다릅니다.",
        "이 도구는 원본 이미지를 실무에서 자주 쓰는 favicon/app icon PNG 크기로 변환하고, manifest.json 시작 예시와 HTML link 태그를 함께 만듭니다. 첫 버전은 호환성이 좋은 PNG 출력에 집중합니다.",
        "파일은 브라우저 안에서 처리됩니다. 공개 전 브랜드 자산을 서버 업로드형 도구에 넣는 것이 걱정될 때 안전한 로컬 처리 흐름으로 사용할 수 있습니다.",
      ],
      faqs: [
        { question: "진짜 .ico 파일도 생성하나요?", answer: "MVP는 PNG favicon 크기와 HTML 태그를 생성합니다. 최신 브라우저는 PNG favicon을 잘 지원합니다. 레거시 호환이 필요하면 이후 .ico 내보내기를 추가할 수 있습니다." },
        { question: "어떤 원본 이미지가 가장 좋나요?", answer: "512×512 이상의 정사각형 PNG/SVG가 좋습니다. 너무 얇은 글자나 세밀한 요소는 16×16에서 사라질 수 있습니다." },
        { question: "파일이 서버로 업로드되나요?", answer: "아닙니다. Canvas 변환과 ZIP 생성은 브라우저 안에서 처리됩니다." },
      ],
    },
  },
  {
    slug: "image-format-converter",
    title: "Image Format Converter",
    shortTitle: "Image Converter",
    description: "Convert, resize, and compress images to PNG, JPG, WebP, or AVIF locally in the browser.",
    category: "file-media",
    tier: 1,
    seoTitle: "Image Format Converter | PNG JPG WebP AVIF Resize",
    seoDescription: "Convert images between PNG, JPG, WebP, and AVIF, resize dimensions, adjust quality, and download single files or ZIP locally in your browser.",
    inputs: [
      { label: "Images", description: "Upload up to 20 browser-readable images, 20MB each." },
      { label: "Conversion settings", description: "Choose output format, quality, max width/height, and JPG background color." },
    ],
    outputs: [
      { label: "Converted images", description: "Preview and download resized PNG, JPG, WebP, or AVIF files." },
      { label: "ZIP package", description: "Download all converted images as a single ZIP for batch workflows." },
    ],
    examples: [
      { label: "Blog images", input: "Large PNG screenshots", output: "WebP files capped at 1920×1080" },
      { label: "Transparent image to JPG", input: "PNG with alpha", output: "JPG with selected background color" },
      { label: "Modern image test", input: "JPG photo", output: "AVIF or WebP copy for comparison" },
    ],
    explanation: [
      "WebP and AVIF can reduce file size for web pages, but browser and CMS support still matters. Keep original assets when quality is important.",
      "PNG preserves transparency and sharp UI graphics. JPG is useful for photos but cannot keep transparent pixels, so this tool fills alpha with the selected background color before exporting JPG.",
      "The converter runs in the browser with Canvas. Very large images may use a lot of memory on mobile devices, so batch size and file size are intentionally limited.",
    ],
    faqs: [
      { question: "Are images uploaded to a server?", answer: "No. The conversion uses the browser Canvas API and JSZip for local packaging." },
      { question: "Why is PNG quality disabled?", answer: "Canvas PNG export is lossless; browser APIs do not expose the same quality slider used by JPG/WebP/AVIF." },
      { question: "Does AVIF always work?", answer: "Only if the current browser supports AVIF Canvas export. If it fails, choose WebP or PNG." },
    ],
    relatedToolSlugs: ["icon-favicon-generator", "color-contrast-checker", "slug-generator"],
    ko: {
      title: "이미지 포맷 컨버터",
      shortTitle: "이미지 변환",
      description: "이미지를 PNG, JPG, WebP, AVIF로 변환하고 리사이즈·품질 조절 후 브라우저에서 다운로드합니다.",
      seoTitle: "이미지 포맷 컨버터 | PNG JPG WebP AVIF 변환·리사이즈",
      seoDescription: "이미지를 PNG, JPG, WebP, AVIF로 변환하고 크기 제한, 품질 조절, ZIP 다운로드를 브라우저 로컬 처리로 제공합니다.",
      inputs: [
        { label: "이미지", description: "브라우저가 읽을 수 있는 이미지를 최대 20개, 각 20MB 이하로 업로드합니다." },
        { label: "변환 옵션", description: "출력 포맷, 품질, 최대 너비/높이, JPG 배경색을 선택합니다." },
      ],
      outputs: [
        { label: "변환된 이미지", description: "리사이즈된 PNG, JPG, WebP, AVIF 파일을 미리보고 다운로드합니다." },
        { label: "ZIP 패키지", description: "일괄 작업을 위해 변환 결과 전체를 ZIP으로 다운로드합니다." },
      ],
      examples: [
        { label: "블로그 이미지", input: "큰 PNG 스크린샷", output: "1920×1080 이하 WebP 파일" },
        { label: "투명 PNG를 JPG로", input: "알파 채널이 있는 PNG", output: "선택한 배경색으로 채워진 JPG" },
        { label: "최신 포맷 비교", input: "JPG 사진", output: "AVIF 또는 WebP 변환본" },
      ],
      explanation: [
        "WebP와 AVIF는 웹페이지 이미지 용량을 줄이는 데 유용하지만, 브라우저와 CMS 지원 여부를 함께 확인해야 합니다. 중요한 원본은 따로 보관하세요.",
        "PNG는 투명 배경과 선명한 UI 그래픽에 적합합니다. JPG는 사진에 유리하지만 투명 픽셀을 보존하지 못하므로, 이 도구는 JPG 출력 시 선택한 배경색으로 알파 영역을 채웁니다.",
        "변환은 브라우저 Canvas에서 수행됩니다. 매우 큰 이미지는 모바일에서 메모리를 많이 사용할 수 있어 파일 크기와 일괄 처리 개수를 제한했습니다.",
      ],
      faqs: [
        { question: "이미지가 서버로 업로드되나요?", answer: "아닙니다. 변환은 브라우저 Canvas API와 JSZip을 이용해 로컬에서 처리됩니다." },
        { question: "PNG 품질 조절이 없는 이유는?", answer: "Canvas의 PNG 출력은 무손실 방식이며, JPG/WebP/AVIF처럼 품질 슬라이더를 적용하는 API가 아닙니다." },
        { question: "AVIF는 항상 동작하나요?", answer: "현재 브라우저가 AVIF Canvas 출력을 지원해야 합니다. 실패하면 WebP 또는 PNG를 선택하세요." },
      ],
    },
  },
  {
    slug: "pyeong-converter",
    title: "Pyeong Converter",
    shortTitle: "Pyeong",
    description: "Convert Korean pyeong and square meters without guessing apartment or office area units.",
    category: "korea-living",
    tier: 1,
    seoTitle: "Pyeong Converter | Convert 평 to m²",
    seoDescription: "Convert Korean pyeong to square meters and back with practical examples for homes and offices.",
    inputs: [{ label: "Area", description: "Enter pyeong or square meters." }],
    outputs: [{ label: "Converted area", description: "Shows the matching value using 1 pyeong = 3.305785 m²." }],
    examples: [
      { label: "Apartment 84㎡ listing", input: "84 m²", output: "≈ 25.41 pyeong (commonly marketed as 34평)" },
      { label: "Studio 24평", input: "24평", output: "≈ 79.34 m²" },
      { label: "Mid-size 114㎡", input: "114 m²", output: "≈ 34.49 pyeong" },
      { label: "Office area", input: "100 m²", output: "≈ 30.25 pyeong" },
    ],
    explanation: [
      "Korean real-estate listings often mix pyeong and square meters. The tool uses the standard 1평 = 3.305785㎡ ratio so the result is predictable.",
      "Apartment marketing usually rounds: a unit advertised as 34평 is typically registered as 84㎡ exclusive area. The legal area on the contract is what counts, not the rounded marketing number.",
      "Use the converted value as a quick reading aid. For tax, contract, or registration decisions, refer to 전용면적 (exclusive), 공급면적 (supply), or 계약면적 (contract) on the official documents.",
    ],
    faqs: [
      { question: "Is pyeong still used in Korea?", answer: "Yes. Square meters are the official unit, but pyeong is still common in everyday housing conversation, especially for apartments and offices." },
      { question: "Why do listings sometimes differ?", answer: "Listings may refer to exclusive area (전용), supply area (공급), or rounded marketing values. Always check which area the number describes before comparing." },
      { question: "What is the exact ratio?", answer: "1 pyeong = 3.305785 m². The tool keeps that ratio, but contracts use the registered square-meter figure as the legal area." },
    ],
    relatedToolSlugs: ["unit-converter", "krw-currency-calculator"],
    ko: {
      title: "평수 변환기",
      shortTitle: "평수",
      description: "평과 제곱미터를 빠르게 변환합니다. 아파트·오피스 면적 표기에서 헷갈리는 단위를 정리합니다.",
      seoTitle: "평수 변환기 | 평 ↔ ㎡ 계산",
      seoDescription: "한국 평수를 제곱미터로, 또는 제곱미터를 평으로 변환합니다. 아파트·오피스 면적 예시와 한계를 함께 제공합니다.",
      inputs: [{ label: "면적", description: "평 또는 제곱미터로 입력합니다." }],
      outputs: [{ label: "변환된 면적", description: "1평 = 3.305785㎡ 비율로 환산한 값을 보여줍니다." }],
      examples: [
        { label: "84㎡ 아파트", input: "84㎡", output: "약 25.41평 (광고에서는 보통 34평)" },
        { label: "24평 원룸", input: "24평", output: "약 79.34㎡" },
        { label: "114㎡ 중형", input: "114㎡", output: "약 34.49평" },
        { label: "사무실 면적", input: "100㎡", output: "약 30.25평" },
      ],
      explanation: [
        "한국 부동산 매물은 평과 제곱미터가 섞여 표기됩니다. 본 도구는 1평 = 3.305785㎡의 표준 비율을 그대로 적용해 결과를 일관되게 보여줍니다.",
        "아파트 광고에서 흔히 “34평”이라고 부르는 단위는 등기부상 보통 전용면적 84㎡에 해당합니다. 광고용 평수는 반올림된 표기이며, 실제 계약·세무 판단의 기준은 등기부와 분양 계약서의 제곱미터 수치입니다.",
        "실제 계약·재산세·중개수수료 산정에는 전용면적·공급면적·계약면적 중 어느 면적을 의미하는지가 중요합니다. 변환 결과는 참고용이며, 공식 서류의 면적 표기를 우선 확인해야 합니다.",
      ],
      faqs: [
        { question: "한국에서 평은 아직 쓰이나요?", answer: "공식 단위는 제곱미터지만, 아파트·오피스 같은 일상 대화에서는 여전히 평이 자주 쓰입니다." },
        { question: "같은 집인데 평수가 다르게 표기되는 이유는?", answer: "전용면적, 공급면적, 계약면적 중 어떤 면적을 기준으로 했는지에 따라 같은 매물이라도 평수가 달라집니다. 비교 전에 기준 면적을 반드시 확인하세요." },
        { question: "정확한 환산 비율은?", answer: "1평 = 3.305785㎡입니다. 본 도구는 이 비율을 사용하지만, 계약상 법적 면적은 등기부에 등재된 ㎡ 값을 따릅니다." },
      ],
    },
  },
  {
    slug: "kst-timezone-converter",
    title: "KST Timezone Converter",
    shortTitle: "KST Time",
    description: "Translate Korea Standard Time into overseas working hours for calls, launches, and handoffs.",
    category: "time-money",
    tier: 1,
    seoTitle: "KST Timezone Converter | Korea Time to Global Time",
    seoDescription: "Convert Korea Standard Time to common global time zones for meetings, launches, and automation schedules.",
    inputs: [{ label: "KST date and time", description: "A Korea Standard Time timestamp." }],
    outputs: [{ label: "Global times", description: "Matching times in selected overseas time zones." }],
    examples: [
      { label: "US Pacific handoff", input: "KST Mon 10:00", output: "Sun 17:00 PST or 18:00 PDT" },
      { label: "US Eastern call", input: "KST Mon 10:00", output: "Sun 20:00 EST or 21:00 EDT" },
      { label: "London standup", input: "KST 18:00", output: "09:00 GMT or 10:00 BST" },
      { label: "Tokyo overlap", input: "KST 09:00", output: "09:00 JST (no DST)" },
    ],
    explanation: [
      "KST is UTC+9 and does not observe daylight saving. The offset to Korea is fixed year-round.",
      "Counterpart cities that observe DST shift by an hour at the season boundary. Date matters: a March meeting between Seoul and London is not the same offset as a January meeting.",
      "For automation schedules and launch windows, store the source time in UTC and translate to KST and counterparts on display. That avoids off-by-one-hour bugs at DST transitions.",
    ],
    faqs: [
      { question: "Does Korea use daylight saving?", answer: "No. KST is UTC+9 throughout the year, so offsets to Seoul never shift on the Korean side." },
      { question: "How do I avoid DST surprises?", answer: "Pick a specific date when scheduling. Same wall-clock times in Seoul map to different UTC moments depending on whether the counterpart is in standard or daylight time." },
    ],
    relatedToolSlugs: ["cron-explainer", "timestamp-converter"],
    ko: {
      title: "KST 시간 변환기",
      shortTitle: "KST 시간",
      description: "한국 표준시(KST)를 미국·유럽·일본 등 해외 표준시로 환산합니다. 미팅, 런칭, 인수인계 시간을 정리할 때 쓰세요.",
      seoTitle: "KST 시간 변환기 | 한국 시간 ↔ 해외 시간",
      seoDescription: "KST를 미국 PT/ET, 영국, UTC, 도쿄 시간으로 변환합니다. 일광 절약 시간(DST) 영향을 같이 표시합니다.",
      inputs: [{ label: "KST 날짜 및 시간", description: "한국 표준시 기준 일시를 입력합니다." }],
      outputs: [{ label: "해외 시간", description: "선택한 해외 표준시로 환산된 시간을 표시합니다." }],
      examples: [
        { label: "미국 서부 인수인계", input: "KST 월 10:00", output: "일 17:00 PST 또는 18:00 PDT" },
        { label: "미국 동부 미팅", input: "KST 월 10:00", output: "일 20:00 EST 또는 21:00 EDT" },
        { label: "런던 스탠드업", input: "KST 18:00", output: "09:00 GMT 또는 10:00 BST" },
        { label: "도쿄 동시간", input: "KST 09:00", output: "09:00 JST (DST 없음)" },
      ],
      explanation: [
        "KST는 UTC+9이며 일광 절약 시간을 적용하지 않습니다. 한국 쪽 오프셋은 연중 고정입니다.",
        "DST를 적용하는 미국·유럽 도시는 봄/가을 전환 시점마다 1시간씩 차이가 움직입니다. 1월에 잡은 회의와 4월에 잡은 회의가 같은 “KST 10:00”이어도 상대 도시 시간은 달라질 수 있습니다.",
        "자동화 스케줄에는 UTC를 원본으로 저장하고, 표시할 때만 KST와 상대 시간으로 변환하는 방식이 안전합니다. DST 전환 시 1시간 어긋나는 오류를 줄여줍니다.",
      ],
      faqs: [
        { question: "한국은 서머타임을 쓰나요?", answer: "쓰지 않습니다. KST는 연중 UTC+9로 고정되며, 한국 쪽 시간 오프셋은 변하지 않습니다." },
        { question: "DST 때문에 1시간 차이 나는 일을 어떻게 줄이나요?", answer: "회의나 런칭 시간을 정할 때 구체적인 날짜를 함께 지정하세요. 같은 KST라도 상대 도시가 표준시인지 서머타임인지에 따라 UTC 기준 시간이 달라집니다." },
      ],
    },
  },
  {
    slug: "korean-shoe-size-converter",
    title: "Korean Shoe Size Converter",
    shortTitle: "Shoe Size",
    description: "Compare Korean millimeter shoe sizes with US, UK, EU, and Japan size conventions.",
    category: "korea-living",
    tier: 1,
    seoTitle: "Korean Shoe Size Converter | KR mm to US UK EU",
    seoDescription: "Convert Korean shoe sizes in millimeters to US, UK, EU, and JP references with practical caveats.",
    inputs: [{ label: "Korean size", description: "Footwear size in millimeters, such as 250 or 270." }],
    outputs: [{ label: "International references", description: "Approximate US, UK, EU, and JP size matches." }],
    examples: [
      { label: "Common women size", input: "240 mm", output: "≈ US W 7, UK 5, EU 38" },
      { label: "Common men size", input: "270 mm", output: "≈ US M 9, UK 8.5, EU 42" },
      { label: "Kids reference", input: "180 mm", output: "≈ US K 12 (varies by brand)" },
    ],
    explanation: [
      "Korean shoe sizing uses foot length in millimeters as the base unit. International conversion tables use that millimeter length as the anchor.",
      "Brand-specific lasts and gender scales shift the recommended size by roughly ±1, especially for athletic and dress shoes. Treat the converted value as a starting reference, not a guarantee.",
    ],
    faqs: [
      { question: "Why do brands differ?", answer: "Last shape, toe-box volume, gender-specific scaling, and country-specific conventions can shift the recommended size by half to a full size." },
      { question: "Are men, women, and kids the same?", answer: "No. US sizes split by gender and kids use a separate scale, so the same Korean millimeter value maps to different US numbers depending on the category." },
    ],
    relatedToolSlugs: ["unit-converter"],
    ko: {
      title: "한국 신발 사이즈 변환기",
      shortTitle: "신발 사이즈",
      description: "한국 밀리미터 사이즈를 미국·영국·유럽·일본 사이즈와 비교합니다. 해외 직구·여행 쇼핑에 참고용으로 쓰세요.",
      seoTitle: "한국 신발 사이즈 변환기 | mm ↔ US/UK/EU/JP",
      seoDescription: "한국 신발 사이즈(mm)를 미국·영국·유럽·일본 사이즈로 환산합니다. 브랜드별 편차 안내 포함.",
      inputs: [{ label: "한국 사이즈", description: "250, 270처럼 밀리미터 단위로 입력합니다." }],
      outputs: [{ label: "해외 사이즈", description: "미국·영국·유럽·일본 사이즈에 해당하는 근삿값을 보여줍니다." }],
      examples: [
        { label: "여성 평균", input: "240mm", output: "약 US W 7, UK 5, EU 38" },
        { label: "남성 평균", input: "270mm", output: "약 US M 9, UK 8.5, EU 42" },
        { label: "아동 참고", input: "180mm", output: "약 US K 12 (브랜드별 차이 큼)" },
      ],
      explanation: [
        "한국 신발 사이즈는 발 길이를 밀리미터로 나타낸 값을 그대로 씁니다. 국제 사이즈 표는 이 mm 길이를 기준으로 환산됩니다.",
        "브랜드별 라스트 모양, 토 박스 여유, 성별 스케일, 국가별 표기 관행에 따라 같은 mm라도 ±0.5~1 사이즈 차이가 흔하게 발생합니다. 결과는 참고 시작점으로 사용하세요.",
      ],
      faqs: [
        { question: "브랜드마다 사이즈가 다른 이유는?", answer: "라스트(신발 본) 모양, 발등 볼륨, 성별 스케일, 국가별 표기 관행 차이로 같은 발 길이라도 추천 사이즈가 달라집니다." },
        { question: "남성·여성·아동 사이즈는 같은가요?", answer: "다릅니다. 특히 미국 사이즈는 남성/여성/아동이 별도 체계라 같은 한국 mm 값이라도 카테고리별로 다른 숫자가 나옵니다." },
      ],
    },
  },
  {
    slug: "krw-currency-calculator",
    title: "KRW Currency Calculator",
    shortTitle: "KRW",
    description: "Estimate Korean won amounts with transparent exchange-rate assumptions and manual rate entry.",
    category: "time-money",
    tier: 1,
    seoTitle: "KRW Currency Calculator | Korean Won Estimates",
    seoDescription: "Calculate Korean won exchange estimates with manual rates and clear assumptions for travel or budgeting.",
    inputs: [
      { label: "Amount", description: "Original amount to convert." },
      { label: "Exchange rate", description: "Manual rate used for the estimate." },
    ],
    outputs: [{ label: "Estimated value", description: "Converted amount before bank fees or spread." }],
    examples: [
      { label: "Travel budget", input: "USD 100 at 1,350 KRW/USD", output: "135,000 KRW (before card fees)" },
      { label: "JPY purchase", input: "JPY 10,000 at 9.0 KRW/JPY", output: "90,000 KRW (before fees)" },
    ],
    explanation: [
      "This calculator multiplies the amount by the exchange rate you enter. It does not pull a live market quote, so the assumption is visible and auditable.",
      "Real card and bank conversions add a spread (often 0.5–2%) and fees. Travel-money rates and ATM withdrawals can add more. Use the result as a budgeting estimate, not a final settlement number.",
    ],
    faqs: [
      { question: "Is this a live FX quote?", answer: "No. It is an estimate based on the rate you provide. Card statements and bank settlements use their own rate at the time of the transaction." },
      { question: "Why does my card show a different KRW amount?", answer: "Card networks apply a spread above the mid-market rate, plus possible foreign-transaction fees. The settled amount can move by 1–3% relative to a clean estimate." },
    ],
    relatedToolSlugs: ["unit-converter", "timestamp-converter"],
    ko: {
      title: "원화 환율 계산기",
      shortTitle: "원화 계산기",
      description: "직접 입력한 환율로 원화 금액을 추정합니다. 카드사·은행 적용 환율과 차이가 발생할 수 있는 부분을 함께 안내합니다.",
      seoTitle: "원화 환율 계산기 | 수동 환율 기반 추정",
      seoDescription: "USD·JPY·EUR 같은 외화를 원화로 환산하는 도구입니다. 환율 가정과 카드·은행 수수료 한계를 분명히 표시합니다.",
      inputs: [
        { label: "금액", description: "변환할 원래 금액을 입력합니다." },
        { label: "적용 환율", description: "추정에 사용할 환율을 직접 입력합니다." },
      ],
      outputs: [{ label: "추정 원화 금액", description: "은행·카드 수수료 적용 전 단순 환산 값을 표시합니다." }],
      examples: [
        { label: "여행 예산", input: "USD 100, 환율 1,350원", output: "135,000원 (카드 수수료 미반영)" },
        { label: "엔화 결제", input: "JPY 10,000, 환율 9.0원", output: "90,000원 (수수료 미반영)" },
      ],
      explanation: [
        "본 계산기는 입력한 환율을 그대로 곱합니다. 실시간 시세를 가져오지 않으므로 어떤 환율로 계산했는지가 명확히 보입니다.",
        "실제 카드사·은행 환전에는 환전 스프레드(보통 0.5~2%)와 해외이용수수료가 더해집니다. 환전소·ATM 환율은 그보다 더 큰 차이가 날 수 있습니다. 결과는 예산 추정용으로 사용하고, 정산 금액은 카드 명세서·은행 거래 내역으로 확인하세요.",
      ],
      faqs: [
        { question: "실시간 환율인가요?", answer: "아닙니다. 입력한 환율 기준의 추정값입니다. 카드사·은행은 결제 시점 자체 환율을 사용합니다." },
        { question: "카드 명세서 금액과 다른 이유는?", answer: "카드사가 매매기준율 위에 스프레드를 붙이고, 해외이용수수료(약 1% 내외)를 추가하기 때문입니다. 보통 본 추정값과 1~3% 정도 차이가 납니다." },
      ],
    },
  },
  {
    slug: "cooking-measurement-converter",
    title: "Cooking Measurement Converter",
    shortTitle: "Cooking Units",
    description: "Convert cups, tablespoons, teaspoons, milliliters, and grams for everyday recipe adaptation.",
    category: "korea-living",
    tier: 1,
    seoTitle: "Cooking Measurement Converter | Cups Spoons Grams ml",
    seoDescription: "Convert common cooking measurements with notes about ingredient density and recipe uncertainty.",
    inputs: [{ label: "Measurement", description: "A cooking amount and unit." }],
    outputs: [{ label: "Converted amount", description: "Equivalent volume or approximate weight when density is known." }],
    examples: [
      { label: "US cup", input: "1 cup", output: "240 ml" },
      { label: "Korean cup (계량컵)", input: "1 컵", output: "200 ml (Korean recipe convention)" },
      { label: "Spoons", input: "1 tbsp", output: "3 tsp or 15 ml" },
      { label: "Flour by weight", input: "1 cup flour", output: "≈ 120 g (varies by sift and packing)" },
    ],
    explanation: [
      "Volume conversions are consistent: 1 tbsp = 3 tsp, 1 US cup = 240 ml, 1 fl oz ≈ 30 ml. The tool uses these standard equivalences.",
      "Korean recipes often assume the 200 ml 계량컵 cup, while US recipes assume 240 ml. Translating cups between the two without noting which standard is in use can shift quantities by 20%.",
      "Volume-to-weight conversions depend on ingredient density and packing: a cup of sifted flour, packed flour, sugar, and rice all weigh differently. Treat gram values as estimates and trust a kitchen scale for baking ratios that matter.",
    ],
    faqs: [
      { question: "Why does flour weigh differently than sugar at the same volume?", answer: "Density and packing differ. Sifted flour traps air, packed brown sugar compresses, and grains pack tightly. Same volume, different mass." },
      { question: "Korean cup or US cup?", answer: "If the recipe is Korean, assume 200 ml per cup. If the recipe is US, assume 240 ml. The tool exposes both so the conversion is explicit." },
    ],
    relatedToolSlugs: ["unit-converter"],
    ko: {
      title: "요리 계량 변환기",
      shortTitle: "요리 단위",
      description: "컵·큰술·작은술·ml·g 단위를 변환합니다. 한국식 200ml 계량컵과 미국식 240ml 컵 차이도 함께 정리합니다.",
      seoTitle: "요리 계량 변환기 | 컵·큰술·작은술·ml·g",
      seoDescription: "한국·미국 레시피의 계량 단위를 변환합니다. 200ml/240ml 컵 차이와 재료별 무게 편차를 함께 안내합니다.",
      inputs: [{ label: "계량값", description: "수량과 단위를 함께 입력합니다." }],
      outputs: [{ label: "변환 결과", description: "부피, 또는 밀도가 알려진 경우 대략적인 무게 값을 보여줍니다." }],
      examples: [
        { label: "미국 컵", input: "1 cup", output: "240ml" },
        { label: "한국 계량컵", input: "1컵", output: "200ml (한국 레시피 기준)" },
        { label: "큰술/작은술", input: "1 큰술", output: "3 작은술 또는 15ml" },
        { label: "밀가루 무게", input: "1 cup 밀가루", output: "약 120g (체질·다짐 정도에 따라 다름)" },
      ],
      explanation: [
        "부피 환산은 일정합니다: 1 큰술 = 3 작은술, 미국 컵 = 240ml, 1 fl oz ≈ 30ml. 본 도구는 이 표준 환산을 그대로 사용합니다.",
        "한국 레시피는 보통 200ml 계량컵, 미국 레시피는 240ml 컵을 가정합니다. 어느 컵 기준인지 표시하지 않고 환산하면 분량이 약 20% 어긋납니다.",
        "부피→무게 환산은 재료의 밀도와 다짐 정도에 따라 달라집니다. 밀가루(체친/다진), 설탕, 쌀은 같은 컵이라도 무게가 다릅니다. 베이킹처럼 비율이 중요한 작업은 결과를 참고만 하고 저울을 쓰는 것이 안전합니다.",
      ],
      faqs: [
        { question: "같은 컵인데 밀가루와 설탕 무게가 다른 이유는?", answer: "재료마다 밀도가 다르고 다짐 정도가 다르기 때문입니다. 같은 부피여도 무게는 달라집니다." },
        { question: "한국 컵과 미국 컵 어느 쪽을 써야 하나요?", answer: "레시피가 한국에서 작성된 것이면 200ml 계량컵, 미국 레시피는 240ml 컵으로 가정하세요. 본 도구는 둘을 분리해 표시하므로 환산 기준이 명확합니다." },
      ],
    },
  },
  {
    slug: "unit-converter",
    title: "Unit Converter",
    shortTitle: "Units",
    description: "Convert everyday length, weight, temperature, and area units in one practical workspace.",
    category: "time-money",
    tier: 1,
    seoTitle: "Unit Converter | Practical Everyday Conversions",
    seoDescription: "Convert common units for area, length, weight, temperature, and volume with clear formulas.",
    inputs: [{ label: "Value and unit", description: "Choose a source unit and enter the value." }],
    outputs: [{ label: "Target unit", description: "Converted value and formula note." }],
    examples: [
      { label: "Temperature", input: "20°C", output: "68°F (°C × 9/5 + 32)" },
      { label: "Length", input: "10 miles", output: "16.09 km" },
      { label: "Weight", input: "70 kg", output: "≈ 154.32 lb" },
      { label: "Area", input: "1 acre", output: "≈ 4,046.86 m² (≈ 1,224 pyeong)" },
    ],
    explanation: [
      "A general unit converter covers length, weight, temperature, area, and volume with their standard formulas.",
      "Specialized Korea-aware tools — pyeong, shoe size, cooking — stay separate because they need local context (전용/공급 면적, 한국 mm 표기, 200ml 계량컵) that a generic converter cannot capture.",
    ],
    faqs: [
      { question: "Why keep separate pyeong and cooking converters?", answer: "Specialized tools can explain local conventions and common mistakes that a generic converter glosses over." },
      { question: "Are temperature conversions exact?", answer: "Yes for the formula. The displayed value rounds for readability, so very high precision use cases should treat it as a near-exact estimate." },
    ],
    relatedToolSlugs: ["pyeong-converter", "cooking-measurement-converter"],
    ko: {
      title: "단위 변환기",
      shortTitle: "단위 변환",
      description: "길이·무게·온도·면적·부피 같은 기본 단위를 한 화면에서 변환합니다.",
      seoTitle: "단위 변환기 | 길이·무게·온도·면적",
      seoDescription: "일상에서 자주 쓰는 단위 변환을 한 곳에서 처리합니다. 공식과 한계도 함께 표시합니다.",
      inputs: [{ label: "값과 단위", description: "원본 단위를 선택하고 값을 입력합니다." }],
      outputs: [{ label: "변환 결과", description: "선택한 목표 단위로 환산된 값을 보여줍니다." }],
      examples: [
        { label: "온도", input: "20°C", output: "68°F (°C × 9/5 + 32)" },
        { label: "길이", input: "10마일", output: "16.09km" },
        { label: "무게", input: "70kg", output: "약 154.32lb" },
        { label: "면적", input: "1 에이커", output: "약 4,046.86㎡ (약 1,224평)" },
      ],
      explanation: [
        "길이·무게·온도·면적·부피 등 일반 단위 변환을 표준 공식으로 처리합니다.",
        "평수·신발·요리 같은 한국 특화 도구는 별도 페이지로 분리되어 있습니다. 전용/공급 면적, 한국 mm 표기, 200ml 계량컵처럼 일반 단위 변환기가 다루기 어려운 맥락이 따로 필요하기 때문입니다.",
      ],
      faqs: [
        { question: "왜 평수·요리 변환기는 분리되어 있나요?", answer: "한국 부동산 면적 표기, 한국 mm 신발 사이즈, 한국 계량컵처럼 일반 단위 변환기가 설명하기 어려운 맥락을 따로 다루기 위해서입니다." },
        { question: "온도 변환은 정확한가요?", answer: "공식 자체는 정확하며, 표시값은 읽기 좋게 반올림됩니다. 정밀한 용도라면 결과를 거의 정확한 추정값으로 다뤄 주세요." },
      ],
    },
  },
  {
    slug: "cron-explainer",
    title: "Cron Explainer",
    shortTitle: "Cron",
    description: "Turn cron expressions into human-readable schedules and common automation timing notes.",
    category: "developer-automation",
    tier: 2,
    seoTitle: "Cron Explainer | Human-readable Cron Schedules",
    seoDescription: "Explain cron expressions in plain language with automation scheduling caveats.",
    inputs: [{ label: "Cron expression", description: "Five-field cron string." }],
    outputs: [{ label: "Schedule explanation", description: "Plain-language timing summary." }],
    examples: [{ label: "Daily morning", input: "0 9 * * *", output: "Every day at 09:00" }],
    explanation: ["Cron is compact but easy to misread. A readable explanation helps prevent scheduling mistakes."],
    faqs: [{ question: "Does cron include seconds?", answer: "Traditional cron uses five fields; some systems add a seconds field." }],
    relatedToolSlugs: ["kst-timezone-converter", "timestamp-converter"],
    ko: {
      title: "크론 해설",
      shortTitle: "크론",
      description: "cron 표현식을 사람이 읽을 수 있는 스케줄 설명으로 변환합니다.",
      seoTitle: "크론 해설 | cron 표현식 읽기",
      seoDescription: "cron 표현식을 일상 언어로 풀어 자동화 스케줄을 검증합니다.",
      inputs: [{ label: "cron 표현식", description: "다섯 필드로 된 cron 문자열을 입력합니다." }],
      outputs: [{ label: "스케줄 설명", description: "사람이 읽기 쉬운 시간 설명을 보여줍니다." }],
      examples: [{ label: "매일 아침", input: "0 9 * * *", output: "매일 오전 9시" }],
      explanation: ["cron은 압축적이라 읽기 어렵습니다. 일상 언어 설명을 같이 보면 잘못된 스케줄을 줄일 수 있습니다."],
      faqs: [{ question: "초 단위도 들어가나요?", answer: "전통적인 cron은 다섯 필드입니다. 일부 시스템은 초 필드를 추가로 사용합니다." }],
    },
  },
  {
    slug: "json-yaml-validator",
    title: "JSON/YAML Validator",
    shortTitle: "JSON/YAML",
    description: "Validate and format JSON or YAML snippets while keeping errors visible and recoverable.",
    category: "developer-automation",
    tier: 2,
    seoTitle: "JSON YAML Validator | Check Config Syntax",
    seoDescription: "Validate JSON and YAML configuration snippets with clear errors and safe formatting behavior.",
    inputs: [{ label: "Config text", description: "JSON or YAML snippet." }],
    outputs: [{ label: "Validation result", description: "Parsed status, formatted output, or error location." }],
    examples: [{ label: "JSON object", input: "{\"enabled\":true}", output: "Valid JSON" }],
    explanation: ["Config validation should not hide the original input. Users need to see exactly what changed."],
    faqs: [{ question: "Will this upload my config?", answer: "This tool runs locally in the browser." }],
    relatedToolSlugs: ["webhook-payload-formatter"],
    ko: {
      title: "JSON·YAML 검증기",
      shortTitle: "JSON/YAML",
      description: "JSON·YAML 조각을 검증하고 정렬합니다. 에러 위치와 변경 사항이 그대로 보이도록 동작합니다.",
      seoTitle: "JSON·YAML 검증기 | 설정 문법 점검",
      seoDescription: "JSON·YAML 설정을 브라우저에서 안전하게 검증·정렬합니다. 입력은 외부로 전송되지 않습니다.",
      inputs: [{ label: "설정 문자열", description: "JSON 또는 YAML 텍스트를 입력합니다." }],
      outputs: [{ label: "검증 결과", description: "파싱 상태, 정렬된 출력, 에러 위치를 표시합니다." }],
      examples: [{ label: "JSON 객체", input: "{\"enabled\":true}", output: "유효한 JSON" }],
      explanation: ["설정 검증 도구는 원본을 가려서는 안 됩니다. 사용자는 어떤 부분이 어떻게 바뀌었는지 그대로 볼 수 있어야 합니다."],
      faqs: [{ question: "입력값이 서버로 전송되나요?", answer: "전송되지 않습니다. 본 도구는 브라우저 안에서만 동작합니다." }],
    },
  },
  {
    slug: "webhook-payload-formatter",
    title: "Webhook Payload Formatter",
    shortTitle: "Webhook",
    description: "Format webhook payloads, inspect fields, and prepare debugging notes without leaving the browser.",
    category: "developer-automation",
    tier: 2,
    seoTitle: "Webhook Payload Formatter | Debug JSON Webhooks",
    seoDescription: "Format and inspect webhook JSON payloads with practical debugging guidance.",
    inputs: [{ label: "Payload", description: "Webhook body text." }],
    outputs: [{ label: "Formatted payload", description: "Readable JSON and key debugging fields." }],
    examples: [{ label: "Event payload", input: "{\"event\":\"payment.success\"}", output: "Formatted event field" }],
    explanation: ["Webhook debugging is faster when the event name, IDs, timestamps, and signature-related fields are easy to spot."],
    faqs: [{ question: "Does this verify signatures?", answer: "The first version focuses on formatting and inspection; signature verification depends on provider secrets." }],
    relatedToolSlugs: ["json-yaml-validator", "timestamp-converter"],
    ko: {
      title: "웹훅 페이로드 포맷터",
      shortTitle: "웹훅",
      description: "웹훅 페이로드를 정렬·확인합니다. 입력은 브라우저 밖으로 나가지 않습니다.",
      seoTitle: "웹훅 페이로드 포맷터 | JSON 페이로드 디버깅",
      seoDescription: "웹훅 JSON 페이로드를 정렬해 이벤트·ID·타임스탬프 같은 핵심 필드를 빠르게 확인합니다.",
      inputs: [{ label: "페이로드", description: "웹훅 본문 텍스트를 입력합니다." }],
      outputs: [{ label: "정렬된 페이로드", description: "읽기 쉬운 JSON과 디버깅에 유용한 필드를 표시합니다." }],
      examples: [{ label: "이벤트 페이로드", input: "{\"event\":\"payment.success\"}", output: "이벤트 필드가 정렬된 결과" }],
      explanation: ["이벤트 이름, ID, 타임스탬프, 서명 관련 필드가 한 눈에 보이도록 정렬되면 웹훅 디버깅이 빨라집니다."],
      faqs: [{ question: "서명 검증도 해주나요?", answer: "초기 버전은 정렬과 확인 중심입니다. 서명 검증은 공급자 시크릿이 필요해 별도 단계입니다." }],
    },
  },
  {
    slug: "loan-interest-calculator",
    title: "Loan Interest Calculator",
    shortTitle: "Loan Interest",
    description: "Estimate monthly loan payments, total interest, and early amortization rows across equal-payment, equal-principal, and bullet repayment structures.",
    category: "time-money",
    tier: 1,
    seoTitle: "Loan Interest Calculator | Monthly Payment and Total Interest Estimate",
    seoDescription: "Compare equal-payment, equal-principal, and bullet loan repayment estimates with principal, annual rate, term, grace period, and total interest outputs.",
    inputs: [
      { label: "Loan amount and annual rate", description: "Enter the principal and the nominal annual rate used for a quick repayment estimate." },
      { label: "Term and grace period", description: "Set the repayment months and any interest-only grace period before amortization begins." },
      { label: "Repayment method", description: "Compare equal-payment, equal-principal, and bullet repayment cash flow structures." },
    ],
    outputs: [
      { label: "Typical monthly payment", description: "Shows the representative monthly repayment amount after any grace period." },
      { label: "Total interest and schedule", description: "Summarizes total interest and early monthly principal-interest breakdown rows." },
    ],
    examples: [
      { label: "Home appliance loan", input: "1,000만 원, 연 4.7%, 36개월", output: "월 상환액과 총 이자 비교" },
      { label: "Grace-period business loan", input: "5,000만 원, 12개월 거치, 총 60개월", output: "거치 후 대표 상환액" },
      { label: "Bullet repayment review", input: "3,000만 원, 만기일시상환", output: "월 이자와 만기 원금 부담" },
    ],
    explanation: [
      "Loan comparisons are rarely about one interest rate alone. The repayment method, grace period, and term shape the monthly cash burden as much as the APR does.",
      "This calculator is meant for first-pass scenario testing. It helps compare installment structures before checking the exact lender product sheet, fees, and approval conditions.",
      "Real execution amounts may differ because lenders apply day-count conventions, fees, mid-term prepayment rules, insurance, and product-specific rounding standards.",
    ],
    faqs: [
      { question: "Is this an official lender quote?", answer: "No. It is a directional estimate for planning and comparison only." },
      { question: "Why does equal-principal start higher?", answer: "Because the principal portion is fixed while interest is highest at the beginning when the balance is largest." },
      { question: "Can I rely on this for a contract decision?", answer: "Use it as a comparison tool, then confirm the final repayment schedule with the actual lender before signing." },
    ],
    relatedToolSlugs: ["deposit-interest-calculator", "savings-interest-calculator", "housing-pension-calculator"],
    ko: {
      title: "대출 이자 계산기",
      shortTitle: "대출 이자",
      description: "원리금균등, 원금균등, 만기일시상환 기준으로 월 상환액, 총 이자, 초기 상환 스케줄을 빠르게 추정합니다.",
      seoTitle: "대출 이자 계산기 | 월 상환액·총 이자 빠른 추정",
      seoDescription: "대출금액, 금리, 기간, 거치기간, 상환방식에 따라 월 상환액과 총 이자를 비교하는 대출 계산기입니다.",
      inputs: [
        { label: "대출금액과 연이율", description: "원금과 연 금리를 입력해 기본 상환 구조를 계산합니다." },
        { label: "대출기간과 거치기간", description: "총 상환 개월수와 이자만 내는 거치기간을 입력합니다." },
        { label: "상환방식", description: "원리금균등, 원금균등, 만기일시상환 구조를 비교합니다." },
      ],
      outputs: [
        { label: "대표 월 상환액", description: "거치기간 이후 기준의 대표 월 상환액을 보여줍니다." },
        { label: "총 이자와 초기 스케줄", description: "총 이자와 초기 12개월 원금·이자 흐름을 함께 확인합니다." },
      ],
      examples: [
        { label: "가전 구입 대출", input: "1,000만 원, 연 4.7%, 36개월", output: "월 상환액과 총 이자 비교" },
        { label: "거치식 사업자금", input: "5,000만 원, 12개월 거치, 총 60개월", output: "거치 후 대표 상환액" },
        { label: "만기일시 검토", input: "3,000만 원, 만기일시상환", output: "월 이자와 만기 원금 부담" },
      ],
      explanation: [
        "대출 비교는 금리 숫자 하나로 끝나지 않습니다. 상환방식, 거치기간, 총 기간에 따라 매달 체감하는 현금흐름이 크게 달라집니다.",
        "이 계산기는 상품 비교 전 1차 검토용입니다. 여러 시나리오를 빠르게 비교해 본 뒤 실제 금융사 조건표와 수수료를 다시 확인하는 데 초점을 둡니다.",
        "실제 실행 상환표는 일수 계산 방식, 인지세, 중도상환수수료, 보험, 금융사 반올림 기준 등에 따라 차이가 날 수 있습니다.",
      ],
      faqs: [
        { question: "공식 금융사 견적과 완전히 같은가요?", answer: "아닙니다. 비교와 계획을 위한 방향성 추정치입니다." },
        { question: "원금균등은 왜 초반 부담이 큰가요?", answer: "원금 상환액이 일정하고 잔액이 가장 큰 초기에 이자가 많이 붙기 때문입니다." },
        { question: "계약 전에 이 값만 보면 되나요?", answer: "아니요. 실제 약정 전에는 금융사가 제공하는 최종 상환표를 반드시 다시 확인해야 합니다." },
      ],
    },
  },
  {
    slug: "deposit-interest-calculator",
    title: "Deposit Interest Calculator",
    shortTitle: "Deposit Interest",
    description: "Estimate deposit maturity amount and interest using simple, monthly compound, or yearly compound assumptions.",
    category: "time-money",
    tier: 1,
    seoTitle: "Deposit Interest Calculator | Simple and Compound Deposit Estimate",
    seoDescription: "Estimate deposit maturity value, total interest, and period-by-period balances with simple, monthly compound, and yearly compound settings.",
    inputs: [
      { label: "Deposit amount", description: "Enter the principal amount you plan to place in the deposit product." },
      { label: "Rate and term", description: "Set the annual rate and the deposit term in months." },
      { label: "Interest mode", description: "Compare simple interest against monthly or yearly compounding assumptions." },
    ],
    outputs: [
      { label: "Estimated maturity amount", description: "Shows the projected maturity value before tax and product-specific adjustments." },
      { label: "Interest projection", description: "Displays total interest and period-by-period balance growth." },
    ],
    examples: [
      { label: "One-year term deposit", input: "1,000만 원, 연 3.2%, 12개월", output: "단리 기준 만기 예상액" },
      { label: "Longer compound scenario", input: "5,000만 원, 연 4%, 36개월", output: "복리 가정 만기 비교" },
      { label: "Tax planning rough check", input: "거치식 예금 시나리오", output: "세전 기준 예상 이자" },
    ],
    explanation: [
      "Even for plain deposits, the compounding assumption changes outcomes once the term gets longer. Monthly compounding and yearly compounding do not produce the same maturity amount.",
      "This tool is for comparison and planning, not for bank disclosure replacement. Real products can differ because of preferential rate conditions, mid-term breakage rules, and tax treatment.",
      "Use the result to compare rough options first, then verify the final yield sheet from the bank or savings institution.",
    ],
    faqs: [
      { question: "Is tax included?", answer: "No. This calculator shows simplified pre-tax estimates unless you separately adjust for tax." },
      { question: "Why are monthly and yearly compound results different?", answer: "Because the compounding frequency changes how often interest is added back to the balance." },
      { question: "Does this include preferential rates?", answer: "No. Apply the rate you expect, then verify final preferential conditions with the product terms." },
    ],
    relatedToolSlugs: ["savings-interest-calculator", "loan-interest-calculator", "krw-currency-calculator"],
    ko: {
      title: "예금 이자 계산기",
      shortTitle: "예금 이자",
      description: "단리, 월 복리, 연 복리 기준으로 예금 만기 예상액과 총 이자를 빠르게 계산합니다.",
      seoTitle: "예금 이자 계산기 | 단리 복리 만기 예상액 계산",
      seoDescription: "예금액, 금리, 기간을 입력해 단리·월 복리·연 복리 기준의 만기 예상액과 총 이자를 비교합니다.",
      inputs: [
        { label: "예금액", description: "예금할 원금을 입력합니다." },
        { label: "금리와 기간", description: "연 이율과 예금 기간(개월)을 설정합니다." },
        { label: "이자 방식", description: "단리, 월 복리, 연 복리 가정을 비교합니다." },
      ],
      outputs: [
        { label: "만기 예상액", description: "세전 기준의 예상 만기 금액을 보여줍니다." },
        { label: "이자 추이", description: "총 이자와 기간별 잔액 증가 흐름을 표시합니다." },
      ],
      examples: [
        { label: "1년 정기예금", input: "1,000만 원, 연 3.2%, 12개월", output: "단리 기준 만기 예상액" },
        { label: "장기 복리 시나리오", input: "5,000만 원, 연 4%, 36개월", output: "복리 가정 만기 비교" },
        { label: "세전 이자 확인", input: "거치식 예금 시나리오", output: "세전 기준 예상 이자" },
      ],
      explanation: [
        "같은 예금이라도 복리 가정에 따라 결과가 달라집니다. 특히 기간이 길어질수록 월 복리와 연 복리 차이가 누적됩니다.",
        "이 도구는 비교와 계획을 위한 빠른 계산기입니다. 실제 상품은 우대금리, 중도해지 조건, 세금 처리에 따라 다르게 보일 수 있습니다.",
        "먼저 거친 비교를 하고, 최종 판단은 금융기관의 실제 상품설명서와 수익률 안내표를 다시 확인하는 것이 좋습니다.",
      ],
      faqs: [
        { question: "세후 기준인가요?", answer: "아닙니다. 별도 세후 조정을 하지 않은 단순 세전 추정치입니다." },
        { question: "월 복리와 연 복리가 왜 다르죠?", answer: "이자가 원금에 다시 합산되는 빈도가 다르기 때문입니다." },
        { question: "우대금리도 자동 반영되나요?", answer: "아니요. 예상 금리를 직접 반영해 비교한 뒤 상품 조건을 다시 확인해야 합니다." },
      ],
    },
  },
  {
    slug: "savings-interest-calculator",
    title: "Savings Interest Calculator",
    shortTitle: "Savings Interest",
    description: "Estimate recurring savings maturity value, total contribution, and interest under simple or compound assumptions.",
    category: "time-money",
    tier: 1,
    seoTitle: "Savings Interest Calculator | Monthly Installment Savings Estimate",
    seoDescription: "Estimate installment savings maturity amount, total contributions, and interest with monthly deposit, rate, term, and simple vs compound assumptions.",
    inputs: [
      { label: "Monthly deposit", description: "Enter how much you plan to deposit each month." },
      { label: "Rate and term", description: "Set the annual rate and the number of contribution months." },
      { label: "Interest mode", description: "Compare simple and compound-style recurring savings scenarios." },
    ],
    outputs: [
      { label: "Estimated maturity amount", description: "Shows the projected total at maturity from contributions plus interest." },
      { label: "Monthly accumulation", description: "Displays running contribution, interest, and balance growth by month." },
    ],
    examples: [
      { label: "Starter savings plan", input: "월 10만 원, 연 4%, 12개월", output: "만기 예상액과 누적 이자" },
      { label: "Wedding fund", input: "월 50만 원, 24개월", output: "총 납입원금과 목표 자금 차이 확인" },
      { label: "Compound comparison", input: "단리 vs 복리 적금", output: "장기 누적 차이 비교" },
    ],
    explanation: [
      "Recurring savings products are contribution-timing products as much as interest-rate products. When you deposit each month, the earlier installments earn longer than the later ones.",
      "This tool gives a first-pass estimate of maturity value and accumulated interest, helping compare scenarios before checking a specific bank product or campaign conditions.",
      "Real installment savings outcomes depend on exact accrual rules, taxation, preferential conditions, and whether deposits are truly fixed or flexible.",
    ],
    faqs: [
      { question: "Why is the interest smaller than a deposit of the same total amount?", answer: "Because recurring savings principal arrives gradually over time rather than being invested in full from day one." },
      { question: "Is this fixed-installment or free-installment?", answer: "It is a simplified recurring monthly savings estimate, not a full product-rule simulator." },
      { question: "Can I use this for official subscription decisions?", answer: "Use it for comparison first, then verify the exact bank product terms before enrolling." },
    ],
    relatedToolSlugs: ["deposit-interest-calculator", "military-savings-calculator", "youth-account-calculator"],
    ko: {
      title: "적금 이자 계산기",
      shortTitle: "적금 이자",
      description: "월 납입액, 금리, 기간 기준으로 적금 만기 예상액과 총 이자를 단리·복리 가정으로 비교합니다.",
      seoTitle: "적금 이자 계산기 | 월납입 적금 만기 예상액 계산",
      seoDescription: "월 납입액, 금리, 적금 기간을 입력해 만기 예상액, 총 납입원금, 총 이자를 빠르게 계산합니다.",
      inputs: [
        { label: "월 납입액", description: "매달 납입할 금액을 입력합니다." },
        { label: "금리와 기간", description: "연 이율과 총 납입 개월수를 설정합니다." },
        { label: "이자 방식", description: "단리와 복리 가정을 비교합니다." },
      ],
      outputs: [
        { label: "만기 예상액", description: "납입원금과 이자를 합친 예상 만기 금액을 보여줍니다." },
        { label: "월별 누적 흐름", description: "월별 누적 납입액, 이자, 예상 잔액을 표시합니다." },
      ],
      examples: [
        { label: "기본 적금", input: "월 10만 원, 연 4%, 12개월", output: "만기 예상액과 누적 이자" },
        { label: "결혼자금 적금", input: "월 50만 원, 24개월", output: "총 납입원금과 목표 자금 비교" },
        { label: "단리 vs 복리", input: "동일 조건 적금 비교", output: "장기 누적 차이 확인" },
      ],
      explanation: [
        "적금은 금리 상품이면서 동시에 납입 시점 상품입니다. 매달 나눠 넣기 때문에 먼저 넣은 돈과 나중에 넣은 돈의 이자 발생 기간이 서로 다릅니다.",
        "이 계산기는 은행별 실제 상품 조건을 보기 전 1차 비교용입니다. 어떤 기간과 납입액 조합이 목표 자금에 더 가까운지 빠르게 확인할 수 있습니다.",
        "실제 적금 결과는 세금, 우대금리, 자유적립 여부, 세부 이자 계산 방식에 따라 달라질 수 있습니다.",
      ],
      faqs: [
        { question: "왜 같은 총액 예금보다 이자가 적게 나오나요?", answer: "적금은 원금 전체가 처음부터 예치되는 것이 아니라 매달 나눠 들어가기 때문입니다." },
        { question: "정액적립식과 자유적립식을 구분하나요?", answer: "아니요. 이 도구는 월 단위 반복 납입을 단순화한 비교용 계산기입니다." },
        { question: "가입 판단에 바로 써도 되나요?", answer: "먼저 비교용으로 사용하고, 실제 상품 가입 전에는 은행 조건을 다시 확인해야 합니다." },
      ],
    },
  },

  {
    slug: "housing-pension-calculator",
    title: "Housing Pension Calculator",
    shortTitle: "Housing Pension",
    description: "Estimate monthly housing pension payouts, upfront withdrawal capacity, and eligibility ranges from home value, ages, and payout type.",
    category: "time-money",
    tier: 1,
    seoTitle: "Housing Pension Calculator | Estimate Monthly Reverse Mortgage Payouts in Korea",
    seoDescription: "Estimate Korean housing pension monthly payouts, mixed-plan withdrawal limits, fixed-term ranges, and loan-repayment scenarios from age, home value, and payout method.",
    inputs: [
      { label: "Home type and official value", description: "Select the housing type and enter the official home value used for a quick eligibility and payout estimate." },
      { label: "Owner and spouse birth dates", description: "The younger eligible age affects the payout level and whether fixed-term options are allowed." },
      { label: "Payout method", description: "Choose lifetime, mixed, fixed-term, loan-repayment, or preferential-style estimation logic." },
    ],
    outputs: [
      { label: "Estimated monthly payout", description: "A quick monthly estimate expressed in 만 원 so it is easy to compare plan structures." },
      { label: "Withdrawal limit and notes", description: "Shows a rough upfront withdrawal capacity for mixed or loan-repayment plans plus eligibility caveats." },
    ],
    examples: [
      { label: "Lifetime fixed", input: "3억 home, owner age 67, spouse age 66", output: "Estimated lifelong monthly payout" },
      { label: "Fixed term", input: "4.5억 home, younger spouse age 62, 20-year term", output: "Higher monthly estimate for a limited payout period" },
      { label: "Loan repayment", input: "6억 home with 1.5억 mortgage balance", output: "Lower monthly estimate with a larger upfront repayment allowance" },
    ],
    explanation: [
      "Housing pension planning is not just about one monthly number. The effective age base, home type, payout structure, and whether you need a mixed withdrawal or loan repayment option all change the shape of the result.",
      "This calculator is designed as a fast screening tool. It helps compare lifetime, fixed-term, mixed, and repayment-oriented structures before moving to a formal consultation or official HF review.",
      "Real monthly payouts depend on official valuation rules, guarantee fees, current rate assumptions, product revisions, and detailed eligibility checks. Use this page to narrow options, not to finalize a retirement contract.",
    ],
    faqs: [
      { question: "Is this the same as the official HF calculator?", answer: "No. This page gives a directional estimate for comparison and planning. Final enrollment and payout figures must be confirmed through the official process." },
      { question: "Why does the younger spouse age matter?", answer: "Housing pension products often use the younger eligible age in the household because the payout period expectation becomes longer when the younger spouse is included." },
      { question: "Can I use this result for a contract decision?", answer: "Treat it as a first-pass estimate only. For legal, tax, mortgage, and retirement decisions, verify with the latest official standards and a qualified advisor." },
    ],
    relatedToolSlugs: ["life-calculator-suite", "krw-currency-calculator", "pyeong-converter"],
    ko: {
      title: "주택연금 계산기",
      shortTitle: "주택연금",
      description: "주택 공시가격, 소유자·배우자 연령, 지급방식을 바탕으로 주택연금 예상 월지급금과 초기 인출한도를 빠르게 추정합니다.",
      seoTitle: "주택연금 계산기 | 월지급금·인출한도 빠른 추정",
      seoDescription: "한국 주택연금의 종신형, 혼합형, 확정기간형, 대출상환형, 우대형 시나리오를 주택가격과 연령 기준으로 빠르게 비교합니다.",
      inputs: [
        { label: "주택 종류와 공시가격", description: "주택 유형을 고르고 가입 한도 기준에 맞는 공시가격을 입력합니다." },
        { label: "소유자·배우자 생년월일", description: "부부 중 연소자의 연령이 월지급금 수준과 확정기간형 가능 여부에 영향을 줍니다." },
        { label: "지급방식", description: "종신형, 혼합형, 확정기간형, 대출상환형, 우대형 기준으로 추정 방식을 바꿉니다." },
      ],
      outputs: [
        { label: "예상 월지급금", description: "비교가 쉬운 만 원 단위 기준의 월지급 추정값을 보여줍니다." },
        { label: "인출한도와 해석 노트", description: "혼합형·대출상환형에서 활용 가능한 초기 인출 여지와 자격 주의사항을 함께 표시합니다." },
      ],
      examples: [
        { label: "종신 정액형", input: "3억 주택, 소유자 만 67세, 배우자 만 66세", output: "평생형 예상 월지급금" },
        { label: "확정기간형", input: "4.5억 주택, 연소자 만 62세, 20년 지급", output: "지급기간이 짧은 대신 더 높은 월지급 추정" },
        { label: "대출상환형", input: "6억 주택, 1.5억 담보대출 상환", output: "초기 상환 여지가 큰 대신 낮아진 월지급 추정" },
      ],
      explanation: [
        "주택연금은 월지급금 숫자 하나만 보는 상품이 아닙니다. 주택 종류, 부부 중 연소자 연령, 종신/확정기간 여부, 혼합 인출 필요성, 기존 대출 상환 필요성이 모두 결과 구조를 바꿉니다.",
        "이 계산기는 상담 전 1차 비교용입니다. 종신형, 확정기간형, 혼합형, 대출상환형을 빠르게 비교해 보고 어떤 구조가 본인 상황에 더 가까운지 가늠하는 데 초점을 둡니다.",
        "실제 월지급금은 한국주택금융공사의 평가 규정, 보증료, 금리 가정, 상품 개정, 세부 자격 요건에 따라 달라집니다. 계약 판단 전에는 반드시 최신 공식 기준을 다시 확인해야 합니다.",
      ],
      faqs: [
        { question: "공식 계산기와 완전히 같은 값이 나오나요?", answer: "아닙니다. 이 페이지는 비교와 계획을 위한 방향성 추정치입니다. 최종 가입 가능 여부와 월지급금은 공식 심사 기준으로 확정됩니다." },
        { question: "왜 배우자 중 더 어린 나이가 중요하나요?", answer: "주택연금은 더 오래 지급될 가능성을 반영하기 때문에 부부 중 연소자 기준이 월지급금과 선택 가능 방식에 영향을 줄 수 있습니다." },
        { question: "이 결과만 보고 계약 결정을 해도 되나요?", answer: "아니요. 부동산, 세무, 대출, 노후 계획 판단에는 최신 공식 자료와 전문가 상담을 함께 확인해야 합니다." },
      ],
    },
  },
  {
    slug: "military-savings-calculator",
    title: "Military Savings Calculator",
    shortTitle: "Military Savings",
    description: "Estimate Korea military savings maturity, bank-rate scenarios, and government matching support for 장병내일준비적금-style planning.",
    category: "time-money",
    tier: 1,
    seoTitle: "Military Savings Calculator | Korea Service Savings Maturity Estimate",
    seoDescription: "Estimate Korean military savings maturity amount, deposit total, expected interest, and government matching support by bank, rate type, and service months.",
    inputs: [
      { label: "Bank and rate type", description: "Select a bank and compare base versus preferential rate assumptions." },
      { label: "Monthly deposit and months", description: "Set the recurring contribution amount and contribution months within service limits." },
    ],
    outputs: [
      { label: "Estimated maturity amount", description: "Shows the rough total including deposits, expected interest, and government matching support." },
      { label: "Rate summary", description: "Displays the assumed annual rate band for the selected bank and service length." },
    ],
    examples: [
      { label: "Army-style 18 months", input: "월 20만 원, 18개월, 기본금리", output: "총 납입액·이자·매칭지원금 추정" },
      { label: "Preferential rate check", input: "우대금리 기준 은행 비교", output: "은행별 수령액 차이 확인" },
      { label: "Lower deposit scenario", input: "월 10만 원", output: "예상 만기 수령액 축소 비교" },
    ],
    explanation: [
      "Military savings planning depends on both the bank rate ladder and the government matching structure, not just the headline annual rate.",
      "This calculator is meant for rough planning so service members can compare deposit amounts, banks, and expected maturity size before acting on the official product notice.",
      "Actual eligibility, contribution ceilings, and matching rules may change by year and program revision, so important decisions should be checked against the latest official guidance.",
    ],
    faqs: [
      { question: "Does this use live bank rates?", answer: "No. It uses fixed comparison assumptions based on observed rate bands for quick planning." },
      { question: "Is the government match guaranteed exactly like this?", answer: "Treat it as an estimate. The exact support structure should be verified from the current official notice." },
      { question: "Can I exceed the monthly cap here?", answer: "The calculator caps the monthly deposit at the common per-bank ceiling for a practical estimate." },
    ],
    relatedToolSlugs: ["savings-interest-calculator", "youth-account-calculator", "deposit-interest-calculator"],
    ko: {
      title: "군적금 계산기",
      shortTitle: "군적금",
      description: "장병내일준비적금 기준으로 월납입액, 은행별 금리, 정부 매칭지원금을 반영한 만기 예상 수령액을 빠르게 추정합니다.",
      seoTitle: "군적금 계산기 | 장병내일준비적금 만기 예상액 계산",
      seoDescription: "군적금 월납입액, 납입개월수, 가입은행, 기본·우대금리에 따라 총 납입액, 예상 이자, 정부 매칭지원금을 계산합니다.",
      inputs: [
        { label: "가입은행과 금리종류", description: "은행을 선택하고 기본금리/우대금리 가정을 비교합니다." },
        { label: "월납입액과 납입개월수", description: "복무기간 안에서 월 납입액과 납입 개월수를 설정합니다." },
      ],
      outputs: [
        { label: "만기 예상 수령액", description: "총 납입액, 예상 이자, 정부 매칭지원금을 합친 거친 추정치를 보여줍니다." },
        { label: "적용 금리 요약", description: "선택한 은행과 복무기간 구간에 맞는 가정 연이율을 표시합니다." },
      ],
      examples: [
        { label: "18개월 육군 시나리오", input: "월 20만 원, 18개월, 기본금리", output: "총 납입액·이자·매칭지원금 추정" },
        { label: "우대금리 비교", input: "우대금리 기준 은행 변경", output: "은행별 예상 수령액 차이" },
        { label: "축소 납입", input: "월 10만 원", output: "낮은 납입액 기준 만기 비교" },
      ],
      explanation: [
        "군적금은 표면 금리만이 아니라 은행별 금리 구간과 정부 매칭지원 구조를 함께 봐야 실제 체감 결과를 이해할 수 있습니다.",
        "이 계산기는 공식 가입 전 비교용입니다. 월 납입액, 복무기간, 은행 선택에 따라 대략적인 만기 규모를 빠르게 가늠하는 데 초점을 둡니다.",
        "실제 자격, 납입한도, 매칭지원 방식은 연도별 제도 변경에 따라 달라질 수 있으므로 중요한 판단 전에는 최신 공식 안내를 다시 확인해야 합니다.",
      ],
      faqs: [
        { question: "실시간 은행 금리를 반영하나요?", answer: "아닙니다. 빠른 비교를 위한 고정 가정값을 사용합니다." },
        { question: "정부 매칭지원금이 정확히 이렇게 지급되나요?", answer: "방향성 추정치로 보셔야 하며, 정확한 기준은 최신 공식 공고를 확인해야 합니다." },
        { question: "월 납입 한도를 넘겨도 계산되나요?", answer: "실용적인 추정을 위해 일반적인 은행별 한도 수준에서 계산을 제한합니다." },
      ],
    },
  },
  {
    slug: "youth-account-calculator",
    title: "Youth Account Calculator",
    shortTitle: "Youth Account",
    description: "Estimate youth savings maturity, bank-rate scenarios, and income-bracket government contribution effects for Korean youth account planning.",
    category: "time-money",
    tier: 1,
    seoTitle: "Youth Account Calculator | Korean Youth Savings Maturity Estimate",
    seoDescription: "Estimate Korean youth account maturity amount, total contributions, expected interest, and government support by bank, income bracket, and monthly deposit.",
    inputs: [
      { label: "Bank and rate type", description: "Choose a bank and compare base versus preferential rate assumptions." },
      { label: "Income bracket and monthly deposit", description: "Select the income bracket that governs monthly contribution and government support caps." },
    ],
    outputs: [
      { label: "Estimated 5-year maturity", description: "Shows projected total contributions, estimated interest, and government contribution effect." },
      { label: "Support summary", description: "Highlights the applicable income-bracket cap and government contribution assumption." },
    ],
    examples: [
      { label: "Mid bracket saver", input: "월 50만 원, 연 3,600만 원 이하", output: "5년 만기 예상액" },
      { label: "Preferential rate scenario", input: "우대금리 적용", output: "이자 차이 비교" },
      { label: "Income-cap check", input: "높은 납입액 입력", output: "구간별 반영 한도 확인" },
    ],
    explanation: [
      "Youth account outcomes depend on more than the nominal bank rate. Income bracket rules change how much of the monthly deposit actually qualifies for government support.",
      "This tool is a planning estimator for comparing banks, rate assumptions, and contribution sizes before diving into the exact eligibility review and official enrollment details.",
      "Because program rules, income definitions, and contribution caps can change, use this page as a quick comparison aid rather than a binding official calculation.",
    ],
    faqs: [
      { question: "Does this guarantee I qualify?", answer: "No. Eligibility depends on official age, income, household, and tax conditions that must be checked separately." },
      { question: "Why is my full deposit not always counted for support?", answer: "Government contribution is capped by income bracket, so only part of the monthly deposit may qualify." },
      { question: "Is this a live bank product feed?", answer: "No. It uses planning assumptions, not a live official product API." },
    ],
    relatedToolSlugs: ["military-savings-calculator", "savings-interest-calculator", "deposit-interest-calculator"],
    ko: {
      title: "청년도약계좌 계산기",
      shortTitle: "청년도약계좌",
      description: "가입은행, 금리종류, 개인소득 구간, 월 납입액 기준으로 청년도약계좌의 5년 만기 예상액과 정부기여금을 빠르게 추정합니다.",
      seoTitle: "청년도약계좌 계산기 | 5년 만기 예상액·정부기여금 계산",
      seoDescription: "청년도약계좌 월 납입액, 은행별 금리, 개인소득 구간에 따라 만기 예상액, 총 납입원금, 이자, 정부기여금을 계산합니다.",
      inputs: [
        { label: "가입은행과 금리종류", description: "은행을 선택하고 기본금리/우대금리 가정을 비교합니다." },
        { label: "개인소득 구간과 월 납입액", description: "정부기여금 한도에 영향을 주는 소득구간과 월 납입액을 설정합니다." },
      ],
      outputs: [
        { label: "5년 만기 예상액", description: "총 납입원금, 예상 이자, 정부기여금을 합친 추정치를 보여줍니다." },
        { label: "지원 조건 요약", description: "선택한 소득구간 기준 반영 한도와 정부기여금 가정을 표시합니다." },
      ],
      examples: [
        { label: "중간 소득구간", input: "월 50만 원, 연 3,600만 원 이하", output: "5년 만기 예상액" },
        { label: "우대금리 시나리오", input: "우대금리 적용", output: "이자 차이 비교" },
        { label: "한도 확인", input: "높은 납입액 입력", output: "구간별 반영 한도 확인" },
      ],
      explanation: [
        "청년도약계좌는 단순 금리 상품이 아닙니다. 개인소득 구간에 따라 정부기여금 한도와 반영 범위가 달라지므로 실제 체감 효과가 달라집니다.",
        "이 계산기는 가입 전 비교용 추정기입니다. 은행별 금리 가정, 월 납입액, 소득구간에 따라 대략적인 5년 만기 결과를 빠르게 비교할 수 있습니다.",
        "실제 자격, 소득 판정, 가구 기준, 비과세 조건, 정부기여금 정책은 변동될 수 있으므로 최종 판단 전에는 공식 안내를 반드시 다시 확인해야 합니다.",
      ],
      faqs: [
        { question: "이 계산기로 가입 자격까지 확정되나요?", answer: "아닙니다. 연령, 소득, 가구, 세제 조건 등 공식 자격은 별도로 확인해야 합니다." },
        { question: "왜 월 납입액 전부가 항상 지원 반영되지 않나요?", answer: "정부기여금은 소득구간별 한도가 있어 일부만 반영될 수 있기 때문입니다." },
        { question: "실시간 은행 상품 데이터를 쓰나요?", answer: "아닙니다. 비교용 가정값을 사용합니다." },
      ],
    },
  },
  {
    slug: "dollar-exchange-calculator",
    title: "Dollar Exchange Calculator",
    shortTitle: "Dollar Exchange",
    description: "Compare USD↔KRW conversion outcomes across base, buy, sell, receive-wire, and send-wire exchange-rate scenarios.",
    category: "time-money",
    tier: 1,
    seoTitle: "Dollar Exchange Calculator | USD KRW Buy Sell Wire Comparison",
    seoDescription: "Compare USD to KRW and KRW to USD conversion results across base, buy, sell, receive-wire, and send-wire rate modes with optional manual rate input.",
    inputs: [
      { label: "Conversion direction and amount", description: "Choose USD→KRW or KRW→USD and enter the amount to convert." },
      { label: "Rate mode or manual rate", description: "Compare base, buy, sell, receive-wire, and send-wire assumptions or override with your own rate." },
    ],
    outputs: [
      { label: "Estimated exchanged amount", description: "Shows the rough converted amount under the selected exchange-rate assumption." },
      { label: "Applied rate summary", description: "Displays which exchange-rate mode was used so the result is easier to audit." },
    ],
    examples: [
      { label: "Buying USD", input: "100 USD, buy rate", output: "예상 원화 필요 금액" },
      { label: "Wire receipt", input: "1,000 USD, receive-wire rate", output: "원화 수령액 비교" },
      { label: "Manual custom quote", input: "사용자 환율 입력", output: "맞춤 환율 기준 계산" },
    ],
    explanation: [
      "FX conversion is not one number. The base rate, bank spread, buy/sell distinction, and wire context all change what you actually receive or pay.",
      "This tool helps compare exchange scenarios quickly when planning transfers, card settlement, overseas purchases, or rough quote sanity checks.",
      "Because spreads, discounts, and fees vary by bank and product, the final real-world amount should always be verified before executing the transaction.",
    ],
    faqs: [
      { question: "Is this a live rate feed?", answer: "No. It is a comparison calculator using fixed preset assumptions unless you enter your own rate." },
      { question: "Why is the buy rate worse than the base rate?", answer: "Banks usually add spread when you buy foreign currency and subtract spread when you sell it back." },
      { question: "Does this include transfer fees?", answer: "No. Separate sending, receiving, or intermediary fees must be checked with the actual provider." },
    ],
    relatedToolSlugs: ["krw-currency-calculator", "deposit-interest-calculator", "loan-interest-calculator"],
    ko: {
      title: "달러 환율 계산기",
      shortTitle: "달러 환율",
      description: "달러↔원화 환전 시 매매기준율, 살때, 팔때, 송금받을때, 송금보낼때 기준 결과를 빠르게 비교합니다.",
      seoTitle: "달러 환율 계산기 | 달러 살때 팔때 송금 비교",
      seoDescription: "달러를 원화로, 원화를 달러로 계산하면서 매매기준율·살때·팔때·송금받을때·송금보낼때 기준을 비교합니다.",
      inputs: [
        { label: "환전 방향과 금액", description: "USD→KRW 또는 KRW→USD 방향을 고르고 금액을 입력합니다." },
        { label: "환율 기준 또는 직접 입력 환율", description: "매매기준율, 살때, 팔때, 송금받을때, 송금보낼때 가정을 비교하거나 직접 환율을 입력합니다." },
      ],
      outputs: [
        { label: "예상 환전 결과", description: "선택한 환율 기준으로 계산한 환전 금액을 보여줍니다." },
        { label: "적용 환율 요약", description: "어떤 기준 환율을 사용했는지 함께 표시해 결과를 확인하기 쉽게 합니다." },
      ],
      examples: [
        { label: "달러 매수", input: "100달러, 살때 환율", output: "예상 원화 필요 금액" },
        { label: "송금 수취", input: "1,000달러, 송금받을때 환율", output: "원화 수령액 비교" },
        { label: "직접 환율 입력", input: "사용자 환율 입력", output: "맞춤 환율 기준 계산" },
      ],
      explanation: [
        "환전은 숫자 하나로 끝나지 않습니다. 매매기준율, 은행 스프레드, 달러 매수·매도 구분, 송금 상황에 따라 실제 체감 금액이 달라집니다.",
        "이 도구는 해외 결제, 송금, 환전 계획 전에 여러 시나리오를 빠르게 비교하는 용도입니다.",
        "실제 적용 금액은 은행별 우대환율, 수수료, 송금 경로, 외화계좌 조건에 따라 달라질 수 있으므로 실행 전 최종 견적을 다시 확인해야 합니다.",
      ],
      faqs: [
        { question: "실시간 환율을 가져오나요?", answer: "아닙니다. 기본 프리셋 가정값 또는 사용자가 직접 입력한 환율을 사용합니다." },
        { question: "왜 살때 환율이 매매기준율보다 불리한가요?", answer: "일반적으로 은행은 외화를 팔 때 스프레드를 더하고, 살 때는 스프레드를 차감하기 때문입니다." },
        { question: "송금수수료도 포함되나요?", answer: "아니요. 실제 송금수수료와 중개수수료는 별도로 확인해야 합니다." },
      ],
    },
  },

  {
    slug: "text-case-converter",
    title: "Text Case Converter",
    shortTitle: "Text Case",
    description: "Convert text between title case, sentence case, uppercase, lowercase, camelCase, and kebab-case.",
    category: "micro-utility",
    tier: 3,
    seoTitle: "Text Case Converter | Change Text Capitalization",
    seoDescription: "Convert text between common capitalization and developer naming formats.",
    inputs: [{ label: "Text", description: "Text to transform." }],
    outputs: [{ label: "Converted text", description: "Selected case format." }],
    examples: [{ label: "Slug prep", input: "Practical Tools Studio", output: "practical-tools-studio" }],
    explanation: ["Small formatting tasks are useful when they are fast, local, and predictable."],
    faqs: [{ question: "Will acronyms be perfect?", answer: "Acronyms may need manual review depending on house style." }],
    relatedToolSlugs: ["slug-generator", "markdown-table-generator"],
    ko: {
      title: "텍스트 케이스 변환",
      shortTitle: "케이스 변환",
      description: "타이틀 케이스, 문장형, 대/소문자, camelCase, kebab-case 등 일반적인 표기 방식 사이에서 텍스트를 변환합니다.",
      seoTitle: "텍스트 케이스 변환기 | 표기 방식 통일",
      seoDescription: "텍스트를 자주 쓰이는 표기 방식과 개발자용 네이밍 포맷으로 변환합니다.",
      inputs: [{ label: "텍스트", description: "변환할 텍스트를 입력합니다." }],
      outputs: [{ label: "변환된 텍스트", description: "선택한 표기 방식으로 결과를 표시합니다." }],
      examples: [{ label: "슬러그 만들기", input: "Practical Tools Studio", output: "practical-tools-studio" }],
      explanation: ["작은 포맷팅 작업은 빠르고 로컬에서 동작하며 결과가 일관적일 때 가장 쓸모가 있습니다."],
      faqs: [{ question: "약어 표기는 완벽하게 처리되나요?", answer: "약어는 작성 규칙에 따라 다르므로, 자동 변환 결과를 한 번 검토하는 것이 좋습니다." }],
    },
  },
  {
    slug: "slug-generator",
    title: "Slug Generator",
    shortTitle: "Slug",
    description: "Create URL-safe slugs for pages, campaigns, guides, and tool names.",
    category: "micro-utility",
    tier: 3,
    seoTitle: "Slug Generator | URL-safe Text Slugs",
    seoDescription: "Generate readable URL slugs from text for pages, guides, and campaigns.",
    inputs: [{ label: "Title", description: "Source text." }],
    outputs: [{ label: "Slug", description: "URL-safe lowercase slug." }],
    examples: [{ label: "Guide title", input: "KST Timezone Guide", output: "kst-timezone-guide" }],
    explanation: ["Stable slugs make internal links and search snippets easier to manage."],
    faqs: [{ question: "Can I change a slug later?", answer: "Yes, but published pages should use redirects to avoid broken links." }],
    relatedToolSlugs: ["text-case-converter", "utm-builder"],
    ko: {
      title: "슬러그 생성기",
      shortTitle: "슬러그",
      description: "페이지·가이드·캠페인·도구 이름용 URL 슬러그를 생성합니다.",
      seoTitle: "슬러그 생성기 | URL 친화 슬러그",
      seoDescription: "제목에서 읽기 좋은 URL 슬러그를 만듭니다. 내부 링크와 SEO에 유리한 형식입니다.",
      inputs: [{ label: "제목", description: "원본 텍스트를 입력합니다." }],
      outputs: [{ label: "슬러그", description: "URL에 안전한 소문자 슬러그를 보여줍니다." }],
      examples: [{ label: "가이드 제목", input: "KST Timezone Guide", output: "kst-timezone-guide" }],
      explanation: ["슬러그가 안정적이어야 내부 링크와 검색 결과 노출이 깨지지 않습니다."],
      faqs: [{ question: "슬러그를 나중에 바꿀 수 있나요?", answer: "바꿀 수 있지만, 이미 게시된 페이지는 리다이렉트를 함께 설정해 깨진 링크를 방지하는 것이 좋습니다." }],
    },
  },
  {
    slug: "utm-builder",
    title: "UTM Builder",
    shortTitle: "UTM",
    description: "Build campaign URLs with clean UTM source, medium, campaign, term, and content parameters.",
    category: "micro-utility",
    tier: 3,
    seoTitle: "UTM Builder | Campaign URL Generator",
    seoDescription: "Create clean UTM campaign URLs and keep naming consistent.",
    inputs: [{ label: "Base URL and UTM fields", description: "Campaign tracking parameters." }],
    outputs: [{ label: "Campaign URL", description: "URL with encoded UTM parameters." }],
    examples: [{ label: "Newsletter", input: "source=newsletter, medium=email", output: "URL with utm_source and utm_medium" }],
    explanation: ["UTM consistency matters more than adding every possible parameter."],
    faqs: [{ question: "Are UTMs case-sensitive?", answer: "Analytics tools may treat differently cased values as separate labels, so consistent lowercase naming is safer." }],
    relatedToolSlugs: ["slug-generator"],
    ko: {
      title: "UTM 빌더",
      shortTitle: "UTM",
      description: "UTM 소스·매체·캠페인·키워드·콘텐츠 파라미터가 정리된 캠페인 URL을 생성합니다.",
      seoTitle: "UTM 빌더 | 캠페인 URL 생성",
      seoDescription: "분석 도구에서 깔끔하게 잡히는 UTM 캠페인 URL을 만듭니다.",
      inputs: [{ label: "기본 URL과 UTM 필드", description: "추적 파라미터 값을 입력합니다." }],
      outputs: [{ label: "캠페인 URL", description: "UTM 파라미터가 적용된 URL을 보여줍니다." }],
      examples: [{ label: "뉴스레터", input: "source=newsletter, medium=email", output: "utm_source·utm_medium이 적용된 URL" }],
      explanation: ["UTM은 모든 파라미터를 채우는 것보다, 이름 규칙을 일관되게 유지하는 것이 더 중요합니다."],
      faqs: [{ question: "UTM은 대소문자를 구분하나요?", answer: "분석 도구가 대소문자를 다른 값으로 처리할 수 있어, 소문자 일관 표기를 권장합니다." }],
    },
  },
  {
    slug: "markdown-table-generator",
    title: "Markdown Table Generator",
    shortTitle: "Markdown Table",
    description: "Create and clean Markdown tables for docs, README files, and lightweight content systems.",
    category: "micro-utility",
    tier: 3,
    seoTitle: "Markdown Table Generator | Create Markdown Tables",
    seoDescription: "Generate readable Markdown tables for documentation and content workflows.",
    inputs: [{ label: "Rows and columns", description: "Table data or pasted delimited text." }],
    outputs: [{ label: "Markdown table", description: "Formatted Markdown table text." }],
    examples: [{ label: "Two columns", input: "Tool, Status", output: "A Markdown table with header separator" }],
    explanation: ["Markdown tables break easily when spacing and separators are inconsistent."],
    faqs: [{ question: "Does spacing matter?", answer: "Markdown parsers mostly care about pipes and separators, but aligned spacing is easier to review." }],
    relatedToolSlugs: ["text-case-converter"],
    ko: {
      title: "마크다운 표 생성기",
      shortTitle: "마크다운 표",
      description: "문서·README·경량 CMS용 마크다운 표를 만들거나 정리합니다.",
      seoTitle: "마크다운 표 생성기 | Markdown Tables",
      seoDescription: "문서 작업에 쓰기 좋은 마크다운 표를 빠르게 생성합니다.",
      inputs: [{ label: "행과 열", description: "표 데이터 또는 구분자 포함 텍스트를 입력합니다." }],
      outputs: [{ label: "마크다운 표", description: "정렬된 마크다운 표 텍스트를 보여줍니다." }],
      examples: [{ label: "두 컬럼", input: "Tool, Status", output: "헤더 구분선이 포함된 마크다운 표" }],
      explanation: ["마크다운 표는 파이프와 구분선이 어긋나면 쉽게 깨집니다. 정렬된 형태로 출력하면 검토가 편해집니다."],
      faqs: [{ question: "공백도 중요한가요?", answer: "대부분의 파서는 파이프와 구분선만 중시하지만, 정렬된 공백은 사람의 검토 편의에 도움이 됩니다." }],
    },
  },
  {
    slug: "timestamp-converter",
    title: "Timestamp Converter",
    shortTitle: "Timestamp",
    description: "Convert Unix timestamps and readable dates for logs, automations, and webhook debugging.",
    category: "micro-utility",
    tier: 3,
    seoTitle: "Timestamp Converter | Unix Time and Readable Dates",
    seoDescription: "Convert Unix timestamps to readable dates and compare automation event times.",
    inputs: [{ label: "Timestamp or date", description: "Unix seconds, milliseconds, or readable date." }],
    outputs: [{ label: "Converted time", description: "Readable local/UTC/KST time." }],
    examples: [{ label: "Unix seconds", input: "1735689600", output: "2025-01-01 00:00:00 UTC" }],
    explanation: ["Webhook and automation logs often mix seconds, milliseconds, UTC, and local time."],
    faqs: [{ question: "Seconds or milliseconds?", answer: "Ten-digit Unix values are usually seconds; thirteen-digit values are usually milliseconds." }],
    relatedToolSlugs: ["kst-timezone-converter", "cron-explainer"],
    ko: {
      title: "타임스탬프 변환기",
      shortTitle: "타임스탬프",
      description: "Unix 타임스탬프와 읽기 쉬운 날짜를 변환합니다. 로그·자동화·웹훅 디버깅에 사용하세요.",
      seoTitle: "타임스탬프 변환기 | Unix ↔ 사람 친화 날짜",
      seoDescription: "Unix 초·밀리초 타임스탬프와 일반 날짜 사이를 변환합니다. KST/UTC 표시 포함.",
      inputs: [{ label: "타임스탬프 또는 날짜", description: "Unix 초·밀리초 또는 일반 날짜를 입력합니다." }],
      outputs: [{ label: "변환된 시간", description: "현지·UTC·KST 시간을 함께 보여줍니다." }],
      examples: [{ label: "Unix 초", input: "1735689600", output: "2025-01-01 00:00:00 UTC" }],
      explanation: ["웹훅·자동화 로그는 초·밀리초·UTC·현지 시간이 섞여 있는 경우가 많습니다. 변환 시 단위를 분명히 확인해야 합니다."],
      faqs: [{ question: "초인지 밀리초인지 어떻게 구분하나요?", answer: "10자리 Unix 값은 보통 초, 13자리 값은 보통 밀리초입니다." }],
    },
  },
  {
    slug: "color-contrast-checker",
    title: "Color Contrast Checker",
    shortTitle: "Contrast",
    description: "Check foreground and background color contrast before shipping UI text and controls.",
    category: "micro-utility",
    tier: 3,
    seoTitle: "Color Contrast Checker | WCAG Contrast Ratio",
    seoDescription: "Check text and background contrast ratios for readable UI design.",
    inputs: [{ label: "Foreground and background", description: "Two color values." }],
    outputs: [{ label: "Contrast ratio", description: "Ratio and practical pass/fail guidance." }],
    examples: [{ label: "Dark text", input: "#181514 on #f3efe7", output: "Readable high-contrast pairing" }],
    explanation: ["Contrast checking prevents beautiful but unreadable design decisions, especially on mobile screens."],
    faqs: [{ question: "Is contrast the only accessibility requirement?", answer: "No. It is one important baseline along with size, focus states, semantics, and interaction design." }],
    relatedToolSlugs: ["text-case-converter"],
    ko: {
      title: "색상 대비 검사기",
      shortTitle: "대비",
      description: "전경색·배경색의 대비를 확인합니다. UI 텍스트·컨트롤이 읽히는지 점검할 때 사용하세요.",
      seoTitle: "색상 대비 검사기 | WCAG 대비 비율",
      seoDescription: "텍스트와 배경의 대비 비율을 계산해 읽기 좋은 UI를 만드는 데 도움을 줍니다.",
      inputs: [{ label: "전경/배경 색상", description: "두 색상 값을 입력합니다." }],
      outputs: [{ label: "대비 비율", description: "비율과 함께 실무에서 쓸 만한 합격/주의 안내를 표시합니다." }],
      examples: [{ label: "어두운 텍스트", input: "#181514 / #f3efe7", output: "충분한 대비, 본문 사용 가능" }],
      explanation: ["대비 검사는 보기엔 멋지지만 읽기 어려운 디자인을 막아 줍니다. 특히 모바일 화면에서 중요합니다."],
      faqs: [{ question: "대비만 맞으면 접근성 OK인가요?", answer: "아닙니다. 글자 크기, 포커스 상태, 시멘틱, 인터랙션 디자인 등 다른 요소도 함께 챙겨야 합니다." }],
    },
  },
];

export function getAllTools(): Tool[] {
  return tools;
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByTier(tier: ToolTier): Tool[] {
  return tools.filter((tool) => tool.tier === tier);
}

export function getRelatedTools(tool: Tool, limit = 3): Tool[] {
  const related = tool.relatedToolSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((item): item is Tool => Boolean(item));

  if (related.length >= limit) {
    return related.slice(0, limit);
  }

  const sameCategory = tools.filter(
    (candidate) =>
      candidate.slug !== tool.slug &&
      candidate.category === tool.category &&
      !related.some((item) => item.slug === candidate.slug),
  );

  return [...related, ...sameCategory].slice(0, limit);
}

export function getToolContent(tool: Tool, locale: Locale): LocalizedToolContent {
  if (locale === "ko" && tool.ko) return tool.ko;
  return {
    title: tool.title,
    shortTitle: tool.shortTitle,
    description: tool.description,
    seoTitle: tool.seoTitle,
    seoDescription: tool.seoDescription,
    inputs: tool.inputs,
    outputs: tool.outputs,
    examples: tool.examples,
    explanation: tool.explanation,
    faqs: tool.faqs,
  };
}
