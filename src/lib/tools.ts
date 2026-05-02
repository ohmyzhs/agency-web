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
    inputs: [{ label: "Text or token", description: "Paste text, encoded values, JWTs, or regex test samples." }],
    outputs: [{ label: "Transformed result", description: "Counts, decoded text, diff rows, JWT payload, hashes, UUIDs, or regex matches." }],
    examples: [{ label: "JWT inspection", input: "header.payload.signature", output: "Decoded header and payload JSON" }],
    explanation: ["Batch 1 developer utilities are grouped into one workspace to avoid thin duplicate pages while still covering frequent search/use cases.", "All processing runs in the browser. Do not paste production secrets into public tools even when processing is local."],
    faqs: [{ question: "Does this validate JWT signatures?", answer: "No. It decodes header and payload only. Signature verification needs the issuer secret or public key." }],
    relatedToolSlugs: ["json-yaml-validator", "webhook-payload-formatter", "cron-explainer"],
    ko: {
      title: "개발자 텍스트 도구 모음",
      shortTitle: "개발자 텍스트",
      description: "글자수, Base64, URL 인코딩, 텍스트 diff, JWT 디코더, 해시, UUID, 정규식 테스트를 로컬에서 처리합니다.",
      seoTitle: "개발자 텍스트 도구 | Base64 URL JWT 해시 UUID 정규식 diff",
      seoDescription: "글자수/단어수/바이트 카운터, Base64·URL 인코딩/디코딩, 텍스트 비교, JWT 디코더, 해시/UUID 생성, 정규식 테스트를 브라우저에서 제공합니다.",
      inputs: [{ label: "텍스트 또는 토큰", description: "텍스트, 인코딩 문자열, JWT, 정규식 테스트 샘플을 입력합니다." }],
      outputs: [{ label: "처리 결과", description: "카운트, 디코딩 결과, diff, JWT payload, 해시, UUID, 정규식 매칭 결과를 표시합니다." }],
      examples: [{ label: "JWT 확인", input: "header.payload.signature", output: "헤더와 payload JSON 디코딩" }],
      explanation: ["Batch 1 개발자 유틸리티는 얇은 중복 페이지를 늘리지 않기 위해 하나의 워크스페이스로 묶었습니다.", "모든 처리는 브라우저에서 실행됩니다. 로컬 처리라도 운영 비밀값은 공개 도구에 붙여넣지 않는 것이 안전합니다."],
      faqs: [{ question: "JWT 서명 검증도 하나요?", answer: "아닙니다. 헤더와 payload 디코딩만 수행합니다. 서명 검증은 발급자 secret 또는 공개키가 필요합니다." }],
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
    inputs: [{ label: "Image file", description: "Upload a browser-readable image up to 20MB." }],
    outputs: [{ label: "Processed image or palette", description: "Download a re-exported JPG or copy extracted palette colors." }],
    examples: [{ label: "Privacy resize", input: "Phone photo", output: "Smaller JPG with most metadata stripped" }],
    explanation: ["Batch 2 image operations are grouped as an image workspace because users often compress, resize, watermark, and strip metadata in one session.", "Canvas re-export removes most EXIF metadata, but browser support varies by input format."],
    faqs: [{ question: "Does this support HEIC?", answer: "Only if the browser can decode it. HEIC conversion may need a separate library or server flow later." }],
    relatedToolSlugs: ["image-format-converter", "icon-favicon-generator", "og-image-generator"],
    ko: {
      title: "이미지 편집 도구 모음",
      shortTitle: "이미지 편집",
      description: "이미지 압축, 리사이즈, 크롭, 회전, 메타데이터 제거용 재저장, 워터마크, 모자이크, 색상 추출을 처리합니다.",
      seoTitle: "이미지 편집 도구 | 압축 리사이즈 크롭 워터마크 모자이크 색상 추출",
      seoDescription: "이미지 압축, 리사이즈/크롭/회전, EXIF 제거용 재저장, 워터마크, 모자이크/블러, 이미지 색상 팔레트를 브라우저에서 처리합니다.",
      inputs: [{ label: "이미지 파일", description: "20MB 이하의 브라우저가 읽을 수 있는 이미지를 업로드합니다." }],
      outputs: [{ label: "처리 이미지 또는 팔레트", description: "재저장된 JPG를 다운로드하거나 추출된 색상 팔레트를 확인합니다." }],
      examples: [{ label: "개인정보 보호 리사이즈", input: "휴대폰 사진", output: "대부분의 메타데이터가 제거된 작은 JPG" }],
      explanation: ["Batch 2 이미지 작업은 압축, 리사이즈, 워터마크, 메타데이터 제거가 한 세션에서 자주 이어지므로 하나의 워크스페이스로 묶었습니다.", "Canvas 재저장은 대부분의 EXIF 메타데이터를 제거하지만 입력 포맷별 브라우저 지원에는 차이가 있습니다."],
      faqs: [{ question: "HEIC도 지원하나요?", answer: "브라우저가 직접 디코딩할 수 있는 경우에만 가능합니다. HEIC 변환은 이후 별도 라이브러리나 서버 흐름 검증이 필요합니다." }],
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
    inputs: [{ label: "Amounts, dates, rates", description: "Enter dates, money amounts, percentages, periods, or timer lengths." }],
    outputs: [{ label: "Estimated result", description: "Shows calculated dates, payments, totals, timer state, or estimated work benefits." }],
    examples: [{ label: "Loan estimate", input: "10,000,000 at 5% for 36 months", output: "Estimated monthly payment" }],
    explanation: ["Batch 4 calculators are grouped to keep practical daily calculations discoverable without creating many thin pages.", "Payroll, severance, tax, and leave calculations are simplified estimates and should be checked against current rules."],
    faqs: [{ question: "Are salary and severance authoritative?", answer: "No. They are quick estimates with simplified assumptions, not legal/tax advice." }],
    relatedToolSlugs: ["krw-currency-calculator", "unit-converter", "kst-timezone-converter"],
    ko: {
      title: "생활 계산기 모음",
      shortTitle: "생활 계산기",
      description: "날짜, D-Day, 스톱워치, 포모도로, 퍼센트, 부가세, 팁, 대출, 급여, 퇴직금, 연차 계산을 한 페이지에서 제공합니다.",
      seoTitle: "생활 계산기 모음 | 날짜 D-Day 대출 급여 부가세 팁 포모도로",
      seoDescription: "날짜 계산기, D-Day, 스톱워치, 포모도로, 퍼센트, 부가세, 팁, 대출, 급여, 퇴직금, 연차 계산기를 한 페이지에서 사용합니다.",
      inputs: [{ label: "금액, 날짜, 비율", description: "날짜, 금액, 퍼센트, 기간, 타이머 길이를 입력합니다." }],
      outputs: [{ label: "계산 결과", description: "날짜 차이, 납입액, 합계, 타이머 상태, 근로 관련 추정값을 표시합니다." }],
      examples: [{ label: "대출 추정", input: "1천만원, 연 5%, 36개월", output: "예상 월 납입액" }],
      explanation: ["Batch 4 생활 계산기는 얇은 페이지를 많이 만들지 않도록 하나의 실용 계산기 모음으로 구성했습니다.", "급여, 퇴직금, 세금, 연차 결과는 단순 추정이며 실제 최신 법규와 회사 정책을 확인해야 합니다."],
      faqs: [{ question: "급여/퇴직금 계산이 법적으로 정확한가요?", answer: "아닙니다. 단순 가정 기반 빠른 추정이며 법률·세무 조언이 아닙니다." }],
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
      description: "PDF 병합·분할·재정렬, PDF 페이지 이미지 변환, 이미지 여러 장 PDF 생성을 한 메뉴에서 처리합니다.",
      seoTitle: "PDF 도구 모음 | PDF 병합 분할 재정렬, PDF 이미지 변환, 이미지 PDF 만들기",
      seoDescription: "PDF 병합/분할/재정렬, PDF 페이지 PNG/JPG 변환, PNG/JPG 이미지 여러 장 PDF 생성을 브라우저 로컬 처리로 제공합니다.",
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
    slug: "og-image-generator", title: "OG Image & Thumbnail Generator", shortTitle: "OG Image", description: "Create 1200×630 social preview images from templates in the browser.", category: "file-media", tier: 1, seoTitle: "OG Image Generator | 1200x630 Social Thumbnail Maker", seoDescription: "Generate OpenGraph, Twitter, Kakao, and blog thumbnail PNG images with templates and Korean text wrapping.", inputs: [{ label: "Title and subtitle", description: "Enter the copy and choose a visual template." }], outputs: [{ label: "1200×630 PNG", description: "Download a social preview image." }], examples: [{ label: "Blog thumbnail", input: "Post title", output: "OG PNG" }], explanation: ["The generator uses Canvas templates sized for common social previews.", "Always preview important Korean line breaks before publishing."], faqs: [{ question: "Can I upload a logo?", answer: "This MVP uses built-in templates. Logo upload can be added later." }], relatedToolSlugs: ["icon-favicon-generator", "image-format-converter", "color-contrast-checker"], ko: { title: "OG이미지 / 썸네일 생성기", shortTitle: "OG 이미지", description: "블로그·SNS 공유용 1200×630 썸네일을 브라우저에서 생성합니다.", seoTitle: "OG이미지 생성기 | 1200x630 썸네일 만들기", seoDescription: "OpenGraph, Twitter, 카카오, 블로그 공유용 1200×630 PNG 이미지를 템플릿과 한국어 줄바꿈으로 생성합니다.", inputs: [{ label: "제목과 부제목", description: "문구를 입력하고 템플릿을 선택합니다." }], outputs: [{ label: "1200×630 PNG", description: "공유 미리보기 이미지를 다운로드합니다." }], examples: [{ label: "블로그 썸네일", input: "글 제목", output: "OG PNG" }], explanation: ["일반적인 SNS 미리보기 크기에 맞춘 Canvas 템플릿을 사용합니다.", "중요한 한국어 줄바꿈은 게시 전 미리보기로 확인하세요."], faqs: [{ question: "로고 업로드도 되나요?", answer: "MVP는 내장 템플릿 중심입니다. 로고 업로드는 이후 추가할 수 있습니다." }] },
  },
  {
    slug: "qr-barcode-generator", title: "QR & Barcode Generator", shortTitle: "QR/Barcode", description: "Generate QR codes and common barcodes locally in the browser.", category: "file-media", tier: 1, seoTitle: "QR Code and Barcode Generator | SVG PNG Download", seoDescription: "Create URL, text, Wi-Fi, vCard QR codes and Code128/EAN/UPC barcodes locally with SVG or PNG download.", inputs: [{ label: "Content", description: "Choose QR content type and barcode value." }], outputs: [{ label: "QR SVG and barcode PNG", description: "Download generated codes." }], examples: [{ label: "Wi-Fi QR", input: "SSID and password", output: "Scannable QR code" }], explanation: ["QR codes are generated as SVG and barcodes as PNG in the browser.", "For product labels or payments, verify the result with a real scanner."], faqs: [{ question: "Are values uploaded?", answer: "No. Generation is local." }], relatedToolSlugs: ["og-image-generator", "icon-favicon-generator", "image-format-converter"], ko: { title: "QR / Barcode 생성기", shortTitle: "QR/Barcode", description: "URL, 텍스트, Wi-Fi, vCard QR과 주요 바코드를 브라우저에서 생성합니다.", seoTitle: "QR코드 바코드 생성기 | SVG PNG 다운로드", seoDescription: "URL, 텍스트, Wi-Fi, vCard QR 코드와 Code128/EAN/UPC 바코드를 로컬에서 생성합니다.", inputs: [{ label: "내용", description: "QR 유형과 바코드 값을 입력합니다." }], outputs: [{ label: "QR SVG와 바코드 PNG", description: "생성된 코드를 다운로드합니다." }], examples: [{ label: "Wi-Fi QR", input: "SSID와 비밀번호", output: "스캔 가능한 QR 코드" }], explanation: ["QR은 SVG, 바코드는 PNG로 브라우저에서 생성합니다.", "상품 라벨이나 결제 용도는 실제 스캐너로 검증하세요."], faqs: [{ question: "입력값이 업로드되나요?", answer: "아닙니다. 생성은 로컬에서 수행됩니다." }] },
  },
  {
    slug: "webhook-request-simulator", title: "Webhook Request Simulator", shortTitle: "Webhook Tester", description: "Send test HTTP requests from the browser and inspect status, headers, and body.", category: "developer-automation", tier: 1, seoTitle: "Webhook Request Simulator | Browser HTTP Tester", seoDescription: "Test webhook URLs with GET, POST, PUT, PATCH, DELETE, custom headers, JSON bodies, and response inspection.", inputs: [{ label: "Request", description: "URL, method, headers, and body." }], outputs: [{ label: "Response", description: "Status, timing, response headers, and body." }], examples: [{ label: "POST test", input: "JSON payload", output: "Webhook response" }], explanation: ["The request is sent with browser fetch, so CORS policies apply.", "Do not paste production secrets into a public browser tool."], faqs: [{ question: "Why did my webhook fail?", answer: "The most common reason is CORS. Server-side webhook testing can be added later." }], relatedToolSlugs: ["json-yaml-validator", "cron-explainer", "network-diagnostics"], ko: { title: "웹훅 요청 시뮬레이터", shortTitle: "Webhook 테스트", description: "GET/POST 등 HTTP 요청을 보내고 상태, 헤더, 본문을 확인합니다.", seoTitle: "웹훅 요청 시뮬레이터 | 브라우저 HTTP 테스트", seoDescription: "Webhook URL에 GET, POST, PUT, PATCH, DELETE 요청과 커스텀 헤더/JSON 본문을 보내고 응답을 확인합니다.", inputs: [{ label: "요청", description: "URL, method, headers, body를 입력합니다." }], outputs: [{ label: "응답", description: "상태, 시간, 응답 헤더와 본문을 확인합니다." }], examples: [{ label: "POST 테스트", input: "JSON payload", output: "Webhook 응답" }], explanation: ["브라우저 fetch로 요청하므로 대상 서버의 CORS 정책이 적용됩니다.", "공개 브라우저 도구에 운영 비밀 토큰을 붙여넣지 마세요."], faqs: [{ question: "웹훅 요청이 실패하는 이유는?", answer: "가장 흔한 원인은 CORS입니다. 서버 측 웹훅 테스트는 이후 추가할 수 있습니다." }] },
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
