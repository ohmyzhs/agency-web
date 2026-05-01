import type { Locale } from "./i18n";

export type PostKind =
  | "guide"
  | "it-news"
  | "daily"
  | "tool-note"
  | "experiment"
  | "site-note";

export type PostCategory =
  | "korea-living"
  | "automation"
  | "developer"
  | "ai"
  | "it-news"
  | "daily"
  | "culture"
  | "experiments";

export type PostBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string };

export type SourceLink = { label: string; url: string };

export type LocalizedPostContent = {
  title: string;
  description: string;
  body: PostBlock[];
};

export type Post = {
  slug: string;
  kind: PostKind;
  category: PostCategory;
  locale: "ko" | "en" | "both";
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  tags: string[];
  relatedToolSlugs?: string[];
  sourceLinks?: SourceLink[];
  en: LocalizedPostContent;
  ko?: LocalizedPostContent;
};

export const posts: Post[] = [
  {
    slug: "pyeong-to-square-meter-korea-apartment",
    kind: "guide",
    category: "korea-living",
    locale: "both",
    publishedAt: "2026-05-01",
    readingMinutes: 6,
    tags: ["korea", "real-estate", "pyeong"],
    relatedToolSlugs: ["pyeong-converter", "unit-converter"],
    en: {
      title: "Reading Korean apartment areas: 59㎡, 75㎡, 84㎡, 99㎡",
      description:
        "Why a Korean listing labelled 34평 is registered as 84㎡, and how 전용/공급/계약면적 change the headline number.",
      body: [
        { type: "p", text: "Korean apartment listings still mix pyeong and square meters. The headline number depends on which area definition the listing uses, so the same unit can look bigger or smaller depending on the source." },
        { type: "h2", text: "The four common sizes" },
        { type: "ul", items: [
          "59㎡ — typically marketed as a 24평 unit, common in small two-bedroom apartments.",
          "75㎡ — usually a 30평 class unit, often a compact three-bedroom layout.",
          "84㎡ — the 34평 marketing class. The most common new-build family size.",
          "99㎡ — 39 to 40평 depending on supply area, larger family layout.",
        ] },
        { type: "h2", text: "Why 84㎡ is sold as 34평" },
        { type: "p", text: "Marketing rounds. 84㎡ converts to roughly 25.4평 in pure exclusive area. The 34평 figure that listings advertise typically refers to 공급면적 (supply area), which adds shared space allocations on top of the registered 전용면적." },
        { type: "h2", text: "전용 vs 공급 vs 계약면적" },
        { type: "ul", items: [
          "전용면적 — exclusive area, what is actually inside the unit walls. The number on the registry.",
          "공급면적 — supply area, exclusive plus a share of common space (hallways, lobbies). What marketing usually uses.",
          "계약면적 — contract area, supply plus a share of underground parking and other common facilities.",
        ] },
        { type: "callout", text: "For tax, mortgage, or contract decisions, refer to the m² figure on the official documents — not the rounded marketing pyeong number." },
      ],
    },
    ko: {
      title: "한국 아파트 면적 읽기: 59㎡, 75㎡, 84㎡, 99㎡",
      description:
        "광고에서 84㎡를 34평으로 부르는 이유와 전용·공급·계약면적이 같은 매물의 평수 표기를 어떻게 바꾸는지 정리합니다.",
      body: [
        { type: "p", text: "한국 아파트 매물은 평과 제곱미터가 섞여 표기됩니다. 어떤 면적 기준을 쓰는지에 따라 같은 집이 더 크게도, 더 작게도 보일 수 있습니다." },
        { type: "h2", text: "자주 보이는 네 가지 평형" },
        { type: "ul", items: [
          "59㎡ — 흔히 24평형으로 광고되는 소형 투베이 아파트.",
          "75㎡ — 보통 30평형 전후, 컴팩트 쓰리룸 레이아웃이 많습니다.",
          "84㎡ — 34평형이라는 마케팅 표기로 가장 흔한 신축 패밀리 사이즈.",
          "99㎡ — 공급면적에 따라 39~40평형, 더 넓은 패밀리 평면.",
        ] },
        { type: "h2", text: "왜 84㎡가 “34평”으로 팔릴까" },
        { type: "p", text: "마케팅용 평수는 반올림된 표기입니다. 전용면적 기준 84㎡는 약 25.4평이지만, 광고에서 말하는 34평은 일반적으로 전용면적에 공용부 지분을 더한 공급면적을 평으로 환산한 값입니다." },
        { type: "h2", text: "전용 vs 공급 vs 계약면적" },
        { type: "ul", items: [
          "전용면적 — 세대 내부에 실제로 쓰는 면적. 등기부에 올라가는 숫자.",
          "공급면적 — 전용면적 + 복도·로비 등 주거 공용면적 지분. 광고가 보통 사용하는 값.",
          "계약면적 — 공급면적 + 지하주차장·기계실 등 기타 공용면적 지분. 분양 계약서에 등장.",
        ] },
        { type: "callout", text: "세무·대출·계약 판단은 등기부 등본의 ㎡ 표기를 우선합니다. 광고용 평수는 비교용 참고 숫자로만 사용하세요." },
      ],
    },
  },
  {
    slug: "kst-global-meeting-time",
    kind: "guide",
    category: "korea-living",
    locale: "both",
    publishedAt: "2026-05-01",
    readingMinutes: 5,
    tags: ["korea", "kst", "timezone", "meetings"],
    relatedToolSlugs: ["kst-timezone-converter", "cron-explainer", "timestamp-converter"],
    en: {
      title: "KST and global meeting time without DST surprises",
      description:
        "How Korea's UTC+9 fixed offset interacts with North American and European DST so a 10:00 KST meeting does not slip by an hour in spring.",
      body: [
        { type: "p", text: "Korea Standard Time is UTC+9 year round and does not observe daylight saving. The offset to Korea is fixed, but the offset to your counterparts is not." },
        { type: "h2", text: "Why DST surprises happen" },
        { type: "p", text: "Cities that observe DST shift their wall clock by one hour at the season boundary. A March meeting that worked at KST 10:00 / London 02:00 is not the same UTC moment in April when London is on BST." },
        { type: "h2", text: "Practical rules" },
        { type: "ul", items: [
          "Pick a date when scheduling, not just a wall clock time. Same KST, different UTC, different counterpart hour.",
          "Store automation jobs in UTC and translate to KST and counterparts on display.",
          "Document who lives in which timezone in the meeting invite. KST is unambiguous; “my time” is not.",
        ] },
        { type: "callout", text: "If the partner's city is in DST, the offset to KST is one hour smaller than its standard-time offset. Re-confirm calendar invites near DST transitions." },
      ],
    },
    ko: {
      title: "DST 사고 없이 KST와 해외 회의 시간 맞추는 법",
      description:
        "한국은 연중 UTC+9 고정인데, 상대 도시는 DST로 바뀝니다. 같은 “KST 10:00”도 봄/가을 경계에 1시간 어긋나는 이유를 정리합니다.",
      body: [
        { type: "p", text: "한국 표준시는 연중 UTC+9 고정이며 일광 절약 시간(DST)을 적용하지 않습니다. 한국 쪽 오프셋은 변하지 않지만, 상대 도시 오프셋은 계절에 따라 움직입니다." },
        { type: "h2", text: "DST 사고가 생기는 이유" },
        { type: "p", text: "DST를 적용하는 도시는 봄/가을 경계마다 시계를 1시간 이동시킵니다. 3월에 KST 10:00 / 런던 02:00로 잡혔던 회의가, 4월에는 같은 KST에서 런던이 03:00이 됩니다." },
        { type: "h2", text: "실무 규칙" },
        { type: "ul", items: [
          "벽시계 시간만 잡지 말고, 날짜를 함께 지정하세요. 같은 KST라도 UTC 기준이 달라질 수 있습니다.",
          "자동화 작업은 UTC로 저장하고, 화면에서만 KST·상대 도시 시간으로 변환하세요.",
          "초대장에 각 참여자 기준 시간대를 명시하세요. KST는 일의가 분명하지만, “내 시간”은 그렇지 않습니다.",
        ] },
        { type: "callout", text: "상대 도시가 DST 적용 중이면 KST와의 차이가 표준시보다 1시간 좁아집니다. DST 전환 직전·직후에는 캘린더 초대를 다시 확인하세요." },
      ],
    },
  },
  {
    slug: "krw-exchange-rate-calculator",
    kind: "guide",
    category: "korea-living",
    locale: "both",
    publishedAt: "2026-05-01",
    readingMinutes: 5,
    tags: ["korea", "krw", "fx", "travel"],
    relatedToolSlugs: ["krw-currency-calculator", "unit-converter"],
    en: {
      title: "How to read a KRW exchange rate calculator",
      description:
        "Mid-market rates, card spreads, and travel-money cuts: what the calculated KRW number actually represents.",
      body: [
        { type: "p", text: "Online calculators usually show a mid-market rate. Banks and card networks settle at their own rate, and the gap is where their margin lives." },
        { type: "h2", text: "What the calculator actually shows" },
        { type: "p", text: "A KRW calculator multiplies your input amount by the rate it has, typically the published mid-market rate. That number is a planning estimate, not the figure your bank will charge." },
        { type: "h2", text: "Where the spread comes from" },
        { type: "ul", items: [
          "Card networks add roughly 0.5–2% spread above mid-market on foreign transactions.",
          "Issuing banks may add a foreign-transaction fee on top, often around 1%.",
          "Currency exchange counters and ATMs apply their own retail rate, often less favorable than card spread.",
        ] },
        { type: "h2", text: "Naver-style UX, transparent assumption" },
        { type: "p", text: "Korean users are used to Naver's compact KRW calculator. Replicating that UX is fine, but the data source and timestamp should stay visible so the user understands what they are reading." },
        { type: "callout", text: "Use any online calculator as a budgeting estimate. For settlement amounts, refer to your card statement or bank confirmation." },
      ],
    },
    ko: {
      title: "원화 환율 계산기를 어떻게 읽을까",
      description:
        "매매기준율, 카드 스프레드, 환전소 수수료 — 계산기에서 본 원화 금액이 실제로 무엇을 의미하는지 정리합니다.",
      body: [
        { type: "p", text: "온라인 환율 계산기는 보통 매매기준율(mid-market rate)을 사용합니다. 은행과 카드사는 자체 환율로 정산하며, 그 차이가 그들의 마진입니다." },
        { type: "h2", text: "계산기가 실제로 보여주는 값" },
        { type: "p", text: "원화 계산기는 입력한 금액을 가져온 환율로 단순 곱합니다. 이 결과는 예산 추정값이지, 카드사·은행이 청구할 금액 자체는 아닙니다." },
        { type: "h2", text: "스프레드는 어디서 오나" },
        { type: "ul", items: [
          "카드 네트워크가 매매기준율 위에 약 0.5~2% 스프레드를 더합니다.",
          "발급 은행은 해외이용수수료(약 1% 내외)를 추가할 수 있습니다.",
          "환전소·ATM은 자체 소매 환율을 적용하며, 카드 스프레드보다 불리한 경우가 많습니다.",
        ] },
        { type: "h2", text: "네이버 스타일 UX와 투명한 가정" },
        { type: "p", text: "한국 사용자는 네이버의 간결한 환율 계산기에 익숙합니다. 같은 UX를 따라가는 것은 좋지만, 환율의 출처와 갱신 시각을 함께 표시해 결과의 의미를 분명히 해야 합니다." },
        { type: "callout", text: "어떤 계산기든 결과는 예산 추정값입니다. 정산 금액은 카드 명세서나 은행 거래내역으로 확인하세요." },
      ],
    },
  },
  {
    slug: "json-yaml-xml-formatting",
    kind: "guide",
    category: "developer",
    locale: "both",
    publishedAt: "2026-05-01",
    readingMinutes: 4,
    tags: ["json", "yaml", "xml", "developer"],
    relatedToolSlugs: ["json-yaml-validator", "webhook-payload-formatter"],
    en: {
      title: "Validate, beautify, minify: JSON, YAML, and XML",
      description:
        "Each action solves a different problem. Knowing which one you need keeps config debugging and webhook inspection short.",
      body: [
        { type: "p", text: "“Format my JSON” is three different requests. Validate checks shape. Beautify makes it readable. Minify removes whitespace. Treating them as one action wastes time." },
        { type: "h2", text: "Validate" },
        { type: "p", text: "Use validate when something downstream is failing. The parser tells you the line, the missing comma, the unbalanced bracket. No output transformation, just a yes-or-no with a location." },
        { type: "h2", text: "Beautify" },
        { type: "p", text: "Use beautify when you are reading or diffing. JSON gets indented to two spaces. XML gets per-tag indentation. YAML stays as-is structurally; trim trailing whitespace." },
        { type: "h2", text: "Minify" },
        { type: "p", text: "Use minify when you are sending payloads where bytes matter — inline configs, small webhooks, copy/paste into restricted fields. Strip whitespace, keep semantics identical." },
        { type: "callout", text: "If a tool runs in the browser, none of these actions need a server round-trip. Inputs stay local, which matters for proprietary configs and webhook payloads." },
      ],
    },
    ko: {
      title: "JSON·YAML·XML — 검증·정렬·압축은 다른 작업입니다",
      description:
        "“포맷 좀 해줘”는 세 가지 다른 요청입니다. 어떤 동작이 필요한지 구분하면 설정 디버깅과 웹훅 확인이 훨씬 빨라집니다.",
      body: [
        { type: "p", text: "JSON 포맷팅에는 보통 세 가지 의도가 섞여 있습니다. 검증은 형태를 확인하고, 정렬(beautify)은 읽기 좋게 만들며, 압축(minify)은 공백을 제거합니다. 한 동작으로 묶으면 의도와 결과가 어긋납니다." },
        { type: "h2", text: "검증 (Validate)" },
        { type: "p", text: "다운스트림이 실패할 때 사용합니다. 파서가 몇 번째 줄에서 어떤 콤마/괄호가 어긋났는지를 알려줍니다. 출력 변환은 하지 않고 위치만 잡아 줍니다." },
        { type: "h2", text: "정렬 (Beautify)" },
        { type: "p", text: "읽거나 diff를 볼 때 사용합니다. JSON은 2스페이스 들여쓰기, XML은 태그별 들여쓰기를 추가합니다. YAML은 구조를 바꾸지 않고 후행 공백 정도만 정리합니다." },
        { type: "h2", text: "압축 (Minify)" },
        { type: "p", text: "바이트가 중요한 곳으로 보낼 때 사용합니다. 인라인 설정, 작은 웹훅, 입력 길이가 제한된 필드에 적합합니다. 공백만 제거하고 의미는 그대로 유지합니다." },
        { type: "callout", text: "브라우저에서 동작하는 도구라면 어떤 동작이든 서버 왕복이 필요 없습니다. 사내 설정이나 웹훅 페이로드처럼 외부 전송이 부담스러운 입력을 다룰 때 중요한 차이입니다." },
      ],
    },
  },
  {
    slug: "cron-expression-from-schedule",
    kind: "guide",
    category: "automation",
    locale: "both",
    publishedAt: "2026-05-01",
    readingMinutes: 4,
    tags: ["cron", "automation", "scheduling"],
    relatedToolSlugs: ["cron-explainer", "kst-timezone-converter"],
    en: {
      title: "From schedule to cron: build the expression you actually meant",
      description:
        "Most cron mistakes come from typing the expression directly. Start with the schedule — every N minutes, daily at HH:mm, weekdays at HH:mm — and let the tool emit the cron line.",
      body: [
        { type: "p", text: "Cron is compact, which is also why people misread it. A schedule-first generator removes that ambiguity: pick the pattern, the time, and the cron expression follows." },
        { type: "h2", text: "Common patterns" },
        { type: "ul", items: [
          "Every N minutes — */5 * * * * runs every five minutes.",
          "Hourly at minute — 30 * * * * runs at HH:30 every hour.",
          "Daily at HH:mm — 0 9 * * * runs at 09:00 every day.",
          "Weekdays at HH:mm — 0 9 * * 1-5 runs at 09:00 Monday through Friday.",
          "Weekly — 0 9 * * 1 runs at 09:00 every Monday.",
          "Monthly — 0 9 1 * * runs at 09:00 on the 1st of each month.",
        ] },
        { type: "h2", text: "Timezone caveat" },
        { type: "p", text: "Server cron usually runs in the server's timezone. If the schedule is meant to be local to a user, store the intent and translate it on the server. Use the KST converter to sanity check Korea-facing schedules." },
        { type: "callout", text: "Test the next five fire times before deploying any cron job. Off-by-one bugs at midnight and Sunday-vs-Monday boundaries are the most common production cron mistakes." },
      ],
    },
    ko: {
      title: "스케줄에서 cron 표현식 만들기",
      description:
        "Cron 실수는 대부분 표현식을 직접 타이핑할 때 생깁니다. “N분마다, 매일 HH:mm, 평일 HH:mm” 같은 스케줄에서 출발하면 사고가 줄어듭니다.",
      body: [
        { type: "p", text: "Cron은 압축적이라 잘못 읽기 쉽습니다. 스케줄부터 정하고 도구가 cron 표현식을 출력하면, 의도와 표현식의 일치를 한 번에 확인할 수 있습니다." },
        { type: "h2", text: "자주 쓰이는 패턴" },
        { type: "ul", items: [
          "N분마다 — */5 * * * * 는 5분마다 실행.",
          "매 시 N분 — 30 * * * * 는 매 시 30분에 실행.",
          "매일 HH:mm — 0 9 * * * 는 매일 09:00에 실행.",
          "평일 HH:mm — 0 9 * * 1-5 는 월~금 09:00에 실행.",
          "매주 — 0 9 * * 1 는 매주 월요일 09:00에 실행.",
          "매월 — 0 9 1 * * 는 매월 1일 09:00에 실행.",
        ] },
        { type: "h2", text: "시간대 주의" },
        { type: "p", text: "서버 cron은 보통 서버 자체 시간대를 사용합니다. 사용자 기준 시간을 의도했다면 의도를 별도로 저장하고 서버에서 변환하는 편이 안전합니다. 한국 기준 스케줄은 KST 변환기로 한 번 확인하세요." },
        { type: "callout", text: "배포 전, 다음 다섯 번의 실행 시각을 직접 시뮬레이션해 보세요. 자정·일요일/월요일 경계의 1칸 오류가 운영 cron에서 가장 흔한 사고입니다." },
      ],
    },
  },
];

export function getAllPosts(): Post[] {
  return [...posts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getPostContent(post: Post, locale: Locale): LocalizedPostContent {
  if (locale === "ko" && post.ko) return post.ko;
  return post.en;
}

export function getPostsByKind(kind: PostKind): Post[] {
  return getAllPosts().filter((post) => post.kind === kind);
}

export function getRelatedPosts(post: Post, limit = 3): Post[] {
  return getAllPosts()
    .filter((candidate) => candidate.slug !== post.slug && candidate.category === post.category)
    .slice(0, limit);
}
