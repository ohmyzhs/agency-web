export type Locale = "ko" | "en";

export const defaultLocale: Locale = "ko";

const dictionaries = {
  ko: {
    nav: {
      home: "홈",
      typing: "타자",
      tools: "도구",
      posts: "글",
      guides: "가이드",
      about: "소개",
      contact: "연락",
      cta: "도구 요청 / 오류 제보",
    },
    home: {
      eyebrow: "est. 2025 · seoul / global",
      headline: "조용히 작동하는 작은 도구들.",
      lead:
        "평 변환, KST 시간, 원화 계산, JSON 검증, 크론 해설까지. 바로 쓰고, 근거를 확인하고, 다음 일로 넘어갑니다.",
      ctaPrimary: "도구 보기",
      ctaSecondary: "스튜디오 소개",
      catalog: {
        title: "지금 사용할 수 있는 도구",
        subtitleTemplate:
          "현재 {count}개의 도구가 공개되어 있습니다. 한국 생활 도구, AI · 자동화 유틸리티, 마이크로 도구로 나뉩니다.",
        tier1: "한국 생활 도구",
        tier2: "AI · 자동화 유틸리티",
        tier3: "마이크로 도구",
      },
      trust: {
        title: "도구가 약속하는 것",
        items: [
          {
            title: "브라우저 안에서 처리",
            description:
              "JSON · YAML 검증, 텍스트 변환, 슬러그 생성, UTM 빌더 등 텍스트 도구는 입력값을 외부 서버로 보내지 않습니다.",
          },
          {
            title: "가정과 근거 표시",
            description:
              "환율, 면적, 신발 사이즈 같은 추정값에는 사용한 비율과 한계를 함께 적습니다. 결과는 참고용입니다.",
          },
          {
            title: "허위 지표 없음",
            description:
              "다운로드 수, 사용자 수, 매출 같은 지표는 사실일 때만 적습니다. 없는 숫자는 적지 않습니다.",
          },
        ],
      },
      finalCta: {
        title: "도구를 열어 바로 사용해 보세요.",
        button: "도구 열기",
      },
    },
    aboutPage: {
      title: "Zero Human Studio 소개",
      lead:
        "Zero Human Studio(ZHS)는 한국 생활에 필요한 작은 유틸리티와 자동화 도구를 조용히 쌓아가는 AI-built tools studio입니다. 화려한 마케팅 페이지 대신, 직접 쓸 수 있는 도구를 먼저 공개합니다.",
      sections: [
        {
          title: "지금 무엇을 만들고 있나",
          body: [
            "평수 변환, KST 시간 환산, 원화 추정 계산, JSON · YAML 검증, 크론 해설 같은 실제로 쓰이는 계산기와 변환기를 운영합니다.",
            "필요할 때 새로운 도구를 추가하고, 사용 중에 발견된 문제는 도구 페이지에 가정과 한계로 명시합니다.",
          ],
        },
        {
          title: "어떻게 만들어지나",
          body: [
            "AI 에이전트가 기획, 코드 작성, 문서화, 디자인 검토를 진행합니다. 사람의 검토는 최소 단위로 들어가지만, 모든 도구의 책임 주체는 ZHS입니다.",
            "각 도구는 별도의 페이지로 공개되어 작동 방식, 가정, 자주 묻는 질문, 관련 도구를 함께 제공합니다.",
          ],
        },
        {
          title: "데이터를 어떻게 다루나",
          body: [
            "텍스트 · 설정 검증 도구는 브라우저 안에서 처리되며 입력값을 서버로 전송하지 않습니다.",
            "연락 양식이나 향후 추가될 기능에서 데이터를 처리하게 되면, 해당 페이지에 그 사실을 분명히 적습니다. 자세한 내용은 개인정보 처리방침을 확인해 주세요.",
          ],
        },
        {
          title: "허위 지표를 두지 않는 이유",
          body: [
            "다운로드 수, 만족도, 사용자 수, 매출 같은 지표는 출처가 분명할 때만 표시합니다. 그렇지 않은 숫자는 비워둡니다.",
            "법률 · 의료 · 금융 자문을 대체하는 도구가 아니며, 모든 결과는 참고용입니다. 공식 문서나 전문가의 판단이 우선합니다.",
          ],
        },
      ],
      contactBlurb: {
        title: "잘못된 결과를 보셨나요?",
        body: "도구 동작이 이상하거나, 숫자가 틀렸거나, 새로운 도구가 필요하면 연락 페이지로 알려주세요.",
        button: "연락 페이지 열기",
      },
    },
    guidesPage: {
      title: "가이드 · 자료",
      lead:
        "ZHS 도구를 어떻게 쓰면 좋은지, 어떤 가정으로 동작하는지 정리한 페이지입니다. 별도의 블로그가 아니라, 도구 사용을 돕는 짧은 자료입니다.",
      sections: [
        {
          title: "한국 생활 도구를 어떻게 읽을까",
          body: [
            "평수 변환은 1평 = 3.305785㎡ 비율을 기본값으로 씁니다. 단, 부동산 매물에서 말하는 평수는 전용 · 공급 · 계약 면적 중 어느 것을 가리키는지에 따라 달라집니다.",
            "신발 사이즈 변환은 한국 mm 표기를 기준으로 미국 · 유럽 · 일본 사이즈에 매핑합니다. 브랜드별 라스트 차이로 한 사이즈 정도의 오차는 일반적입니다.",
          ],
          links: [
            { label: "평수 변환기", slug: "pyeong-converter" },
            { label: "신발 사이즈 변환기", slug: "korean-shoe-size-converter" },
          ],
        },
        {
          title: "환율과 시간은 추정값입니다",
          body: [
            "원화 계산기는 입력한 환율을 그대로 사용합니다. 카드사 · 은행의 실제 적용 환율, 스프레드, 수수료에 따라 결과는 달라집니다.",
            "KST 시간 변환기는 UTC+9 고정 기준입니다. 미국 · 유럽 등 일광 절약 시간을 쓰는 지역으로 변환할 때는 날짜에 따라 ±1시간이 움직일 수 있습니다.",
          ],
          links: [
            { label: "KRW 계산기", slug: "krw-currency-calculator" },
            { label: "KST 시간 변환기", slug: "kst-timezone-converter" },
          ],
        },
        {
          title: "개발자 · 자동화 도구",
          body: [
            "JSON · YAML 검증, 웹훅 페이로드 포맷터, 크론 해설, 타임스탬프 변환은 디버깅과 자동화 작업을 위한 보조 도구입니다.",
            "텍스트 도구는 브라우저에서만 동작합니다. 입력값은 어떤 서버로도 전송되지 않습니다.",
          ],
          links: [
            { label: "JSON / YAML Validator", slug: "json-yaml-validator" },
            { label: "Cron Explainer", slug: "cron-explainer" },
            { label: "타임스탬프 변환기", slug: "timestamp-converter" },
          ],
        },
        {
          title: "결과를 신뢰하기 전에",
          body: [
            "모든 도구는 추정과 보조용입니다. 계약, 의료, 세무, 금융 결정은 공식 문서와 전문가의 판단을 기준으로 진행해 주세요.",
            "도구 결과가 실제와 어긋난다면 연락 페이지로 알려 주세요. 가정 · 비율 · 예시를 빠르게 수정합니다.",
          ],
          links: [
            { label: "면책 고지", slug: "_disclaimer" },
          ],
        },
      ],
    },
    experimentsPage: {
      title: "실험실",
      lead:
        "공개 가능한 실험과 작은 시도를 모아두는 곳입니다. 검증되지 않은 결과나 임시 도구가 올라옵니다.",
      empty: {
        title: "아직 공개된 실험이 없습니다.",
        body: "준비가 되면 이 페이지에 실험 노트와 결과가 올라옵니다. 그 동안은 실제로 쓸 수 있는 도구 페이지를 둘러봐 주세요.",
        button: "도구 보기",
      },
    },
    termsPage: {
      title: "이용약관",
      updated: "최종 수정일: 2026-05-01",
      sections: [
        {
          title: "1. 사이트 개요",
          body: [
            "oh-my-zhs.com은 Zero Human Studio(이하 “ZHS”)가 운영하는 실용 도구 모음 사이트입니다. 본 약관은 사이트 이용 조건을 정합니다.",
          ],
        },
        {
          title: "2. 이용 조건",
          body: [
            "본 사이트의 도구는 “있는 그대로” 제공됩니다. 결과의 정확성, 적합성, 특정 목적에의 부합성을 보장하지 않습니다.",
            "정상적인 사용 범위에서만 도구를 이용해 주세요. 자동화된 대량 호출, 비정상적인 스크래핑, 사이트 안정성을 해치는 행위, 위법한 목적의 이용은 금지됩니다.",
          ],
        },
        {
          title: "3. 결과의 성격",
          body: [
            "환율, 면적, 사이즈, 비용 등 본 사이트의 모든 계산 결과는 추정값과 참고 자료입니다. 법률·세무·금융·의료적 판단을 대체하지 않습니다.",
            "공식 문서, 거래 명세서, 공급사 인보이스가 본 사이트의 추정값과 다르면 해당 공식 자료가 우선합니다.",
          ],
        },
        {
          title: "4. 지적재산권",
          body: [
            "사이트의 코드, 디자인, 텍스트, 로고는 ZHS에 권리가 있거나 사용 허락을 받아 게시된 자료입니다. 사전 허락 없이 무단 복제·재배포할 수 없습니다.",
            "이용자가 도구에 입력한 데이터는 이용자에게 귀속됩니다. ZHS는 이를 영업 목적으로 수집·보관하지 않습니다.",
          ],
        },
        {
          title: "5. 책임의 한계",
          body: [
            "사이트 이용으로 발생한 직접·간접 손해에 대해 ZHS는 관계 법령이 허용하는 범위 내에서 책임을 지지 않습니다.",
            "사이트는 사전 공지 없이 일부 도구가 변경, 개선, 중단될 수 있습니다.",
          ],
        },
        {
          title: "6. 약관 변경 및 문의",
          body: [
            "본 약관은 사이트 운영 변경에 따라 갱신될 수 있으며, 변경 시 본 페이지에 갱신일과 함께 표시됩니다.",
            "약관 관련 문의와 도구 요청은 사이트의 요청/오류 제보 페이지 또는 공개 GitHub Issue를 통해 보내주세요.",
          ],
        },
      ],
    },
    disclaimerPage: {
      title: "면책 고지",
      updated: "최종 수정일: 2026-05-01",
      sections: [
        {
          title: "도구 결과의 성격",
          body: [
            "oh-my-zhs.com의 도구는 일상적인 계산과 변환을 빠르게 도와주는 추정 도구입니다. 모든 결과는 정보 제공·참고 목적이며, 법률·세무·금융·의료 자문을 제공하지 않습니다.",
          ],
        },
        {
          title: "환율·면적·사이즈·비용 추정",
          body: [
            "환율 계산은 사용자가 입력한 환율을 기반으로 한 단순 추정값입니다. 실제 카드사·은행 적용 환율과 수수료에 따라 달라집니다.",
            "평수·면적 변환은 1평 = 3.305785㎡ 비율을 사용합니다. 부동산 계약·세무·등기 절차에서는 등기부와 분양 계약서의 ㎡ 표기가 우선합니다.",
            "신발 사이즈, 요리 계량, 단위 변환 결과는 브랜드·재료·기준에 따라 ±오차가 발생할 수 있습니다. 결과는 시작 참고값으로만 사용해 주세요.",
          ],
        },
        {
          title: "공식 자료가 우선합니다",
          body: [
            "공식 문서, 정부 고시, 공급사 청구서, 의사·세무사·변호사·재무 전문가의 판단이 본 사이트의 추정값보다 우선합니다.",
            "결과가 실제와 명백히 어긋난다면 사이트 내 연락 페이지로 알려주세요. 가정·비율·예시를 빠르게 정정합니다.",
          ],
        },
      ],
    },
    contactPage: {
      title: "연락",
      description:
        "오류 제보, 도구 요청, 정정 요청, 개인정보 관련 문의를 받습니다. 영업 · 프로젝트 의뢰는 받지 않습니다.",
      email: "이메일",
      success: {
        title: "메시지가 전송되었습니다.",
        description:
          "내용을 확인하고 필요한 경우 회신드립니다. 오류 제보의 경우, 도구 페이지에 직접 반영될 수 있습니다.",
        another: "다른 메시지 보내기",
      },
      form: {
        name: "이름",
        namePlaceholder: "성함 또는 닉네임",
        email: "이메일",
        emailPlaceholder: "example@email.com",
        topic: "문의 유형",
        selectTopic: "유형을 선택하세요",
        topicBug: "오류 제보",
        topicTool: "도구 요청",
        topicCorrection: "내용 정정",
        topicPrivacy: "개인정보 문의",
        topicOther: "기타",
        message: "메시지",
        messagePlaceholder: "어떤 도구의 어떤 부분이 문제인지, 또는 어떤 도구가 필요한지 적어 주세요.",
        submit: "메시지 보내기",
        sending: "전송 중...",
      },
    },
    footer: {
      tagline: "Zero Human Studio — 조용히 작동하는 작은 도구들.",
      site: "사이트",
      typing: "타자연습",
      tools: "도구",
      posts: "글",
      guides: "가이드",
      about: "소개",
      contact: "연락",
      legal: "정책",
      privacy: "개인정보 처리방침",
      terms: "이용약관",
      disclaimer: "면책 고지",
      contactSection: "연락",
      rights: "All rights reserved.",
    },
    tools: {
      indexEyebrow: "도구 카탈로그",
      indexTitle: "실용 계산기와 작업 유틸리티.",
      indexLead:
        "한국 생활 단위, 시간, 환율, 설정 검증, 크론 같은 실제 작업을 도와주는 작은 도구 모음입니다.",
      tierLabel: "티어 {tier}",
      tier1Heading: "한국 생활 도구",
      tier2Heading: "AI · 자동화 유틸리티",
      tier3Heading: "마이크로 도구",
      countSummary: "현재 공개된 도구 {count}개",
      openTool: "도구 열기 →",
      backToTools: "← 전체 도구",
      workspaceLabel: "도구 워크스페이스",
      inputs: "입력",
      outputs: "출력",
      examples: "예시",
      howToRead: "결과를 읽는 법",
      faqs: "자주 묻는 질문",
      relatedTools: "관련 도구",
      moreSuffix: "외 {count}개 더",
      privacyNote:
        "이 도구는 브라우저 안에서 동작합니다. 입력한 값은 외부 서버로 전송되지 않습니다.",
      placeholderTitle: "도구 워크스페이스",
      placeholderHeading: "{tool} 인터랙티브 도구",
      placeholderBody: "계산 모델과 페이지 컨텍스트가 준비되어 있습니다.",
    },
    categories: {
      "korea-living": "한국 생활",
      "time-money": "시간 · 환율",
      "file-media": "파일 · 이미지",
      "network-diagnostics": "네트워크",
      "developer-automation": "개발자",
      "business-automation": "비즈니스",
      "micro-utility": "마이크로",
    },
  },
  en: {
    nav: {
      home: "Home",
      typing: "Typing",
      tools: "Tools",
      posts: "Posts",
      guides: "Guides",
      about: "About",
      contact: "Contact",
      cta: "Suggest a tool / report an issue",
    },
    home: {
      eyebrow: "est. 2025 · seoul / global",
      headline: "Small tools that quietly work.",
      lead:
        "Pyeong conversion, KST time, KRW estimates, JSON validation, cron explanations. Use the tool, check the assumptions, move on.",
      ctaPrimary: "Browse tools",
      ctaSecondary: "About the studio",
      catalog: {
        title: "Tools available now",
        subtitleTemplate:
          "{count} tools are public today, grouped into Korea-aware utilities, AI/automation helpers, and small developer tools.",
        tier1: "Korea-aware utilities",
        tier2: "AI / automation helpers",
        tier3: "Micro tools",
      },
      trust: {
        title: "What these tools promise",
        items: [
          {
            title: "Browser-local where possible",
            description:
              "JSON / YAML validation, text case, slug, UTM, and similar text tools process your input in the browser and never send it to a server.",
            },
          {
            title: "Assumptions are written down",
            description:
              "FX rates, area ratios, and shoe-size mappings list the values they use. Results are reference points, not guarantees.",
            },
          {
            title: "No fake metrics",
            description:
              "User counts, revenue, downloads, and satisfaction numbers appear only when they are real. Empty is honest.",
            },
        ],
      },
      finalCta: {
        title: "Open the tools when you need them.",
        button: "Open the tools",
      },
    },
    aboutPage: {
      title: "About Zero Human Studio",
      lead:
        "Zero Human Studio (ZHS) is an AI-built tools studio for Korea-aware utilities, automation helpers, and small tools that quietly work. Instead of marketing pages, the studio publishes usable tools first.",
      sections: [
        {
          title: "What the studio is building right now",
          body: [
            "Calculators and converters that real users actually open: pyeong conversion, KST time, KRW estimates, JSON / YAML validation, and cron explanations.",
            "New tools are added when they solve a real problem. Discovered limits and assumptions are documented inside each tool's page.",
          ],
        },
        {
          title: "How tools are built",
          body: [
            "AI agents handle product decisions, code, documentation, and design review. Human review touches the system in narrow steps, but ZHS is the responsible owner of every tool.",
            "Each tool ships as its own page with the workspace, the assumptions, examples, FAQ, and links to related tools.",
          ],
        },
        {
          title: "How tools handle data",
          body: [
            "Text and configuration utilities run in the browser. Input is not sent to any server.",
            "If a future feature processes your data on a server, that page will say so explicitly. Details live in the privacy policy.",
          ],
        },
        {
          title: "Why metrics are kept honest",
          body: [
            "Downloads, satisfaction scores, user counts, and revenue numbers appear only when they have a real source. The rest is intentionally absent.",
            "These tools are not legal, medical, or financial advice. Official documents and qualified professionals always take precedence.",
          ],
        },
      ],
      contactBlurb: {
        title: "Found a wrong result?",
        body: "If a tool behaves incorrectly, a number is off, or a new tool would help, send a note through the contact page.",
        button: "Open contact page",
      },
    },
    guidesPage: {
      title: "Guides & resources",
      lead:
        "Short notes on how the ZHS tools work and what assumptions they use. This is not a blog — it is reading material that supports the tools.",
      sections: [
        {
          title: "How to read the Korea-aware tools",
          body: [
            "Pyeong conversion uses 1 pyeong = 3.305785 m² as the base ratio. Real-estate listings, however, may refer to exclusive area, supply area, or contract area, so the headline number changes meaning depending on the source.",
            "Korean shoe sizing is millimeter-first. International size mappings carry a typical ±1 size variance because of brand-specific lasts and gender scales.",
          ],
          links: [
            { label: "Pyeong converter", slug: "pyeong-converter" },
            { label: "Korean shoe size converter", slug: "korean-shoe-size-converter" },
          ],
        },
        {
          title: "FX and time are estimates",
          body: [
            "The KRW calculator uses the rate you provide. Bank, card, and travel-money rates apply their own spread and fees, so the displayed number is a planning estimate.",
            "The KST converter is UTC+9 with no daylight saving. Counterpart cities that observe DST will shift by an hour at the season boundary.",
          ],
          links: [
            { label: "KRW calculator", slug: "krw-currency-calculator" },
            { label: "KST timezone converter", slug: "kst-timezone-converter" },
          ],
        },
        {
          title: "Developer & automation utilities",
          body: [
            "JSON / YAML validation, webhook payload formatting, cron explanation, and timestamp conversion exist as small companions to debugging and automation work.",
            "Text utilities run in the browser. Input is never uploaded.",
          ],
          links: [
            { label: "JSON / YAML validator", slug: "json-yaml-validator" },
            { label: "Cron explainer", slug: "cron-explainer" },
            { label: "Timestamp converter", slug: "timestamp-converter" },
          ],
        },
        {
          title: "Before trusting the result",
          body: [
            "Every tool is a reference, not a guarantee. Contracts, medical, tax, and financial decisions should rely on official documents and qualified professionals.",
            "If a result conflicts with the source of truth, please send a note through the contact page so assumptions and examples can be corrected.",
          ],
          links: [
            { label: "Disclaimer", slug: "_disclaimer" },
          ],
        },
      ],
    },
    experimentsPage: {
      title: "Experiments",
      lead:
        "Public experiments and small probes live here. Anything on this page is unverified or temporary by definition.",
      empty: {
        title: "No experiments are public yet.",
        body: "When something is ready to share, it will appear here with notes. Until then, the tools index has the things that already work.",
        button: "Browse tools",
      },
    },
    termsPage: {
      title: "Terms of Use",
      updated: "Last updated: 2026-05-01",
      sections: [
        {
          title: "1. About this site",
          body: [
            "oh-my-zhs.com is a practical tools site operated by Zero Human Studio (\"ZHS\"). These terms describe the conditions for using the site.",
          ],
        },
        {
          title: "2. Acceptable use",
          body: [
            "The tools are provided as-is. ZHS does not guarantee accuracy, suitability, or fitness for a particular purpose.",
            "Use the tools within normal browsing patterns. Automated mass requests, scraping abuse, behavior that harms site stability, and any unlawful use are not permitted.",
          ],
        },
        {
          title: "3. Nature of the results",
          body: [
            "Currency, area, size, cost, and similar outputs are estimates and reference values. They do not replace legal, tax, medical, or financial advice.",
            "When official documents, transaction statements, or vendor invoices conflict with the estimate shown here, the official source takes precedence.",
          ],
        },
        {
          title: "4. Intellectual property",
          body: [
            "Site code, design, copy, and logos are owned by ZHS or used with permission. Reproduction or redistribution without prior consent is not allowed.",
            "Inputs that you type into the tools belong to you. ZHS does not collect or retain those inputs for commercial purposes.",
          ],
        },
        {
          title: "5. Limitation of liability",
          body: [
            "To the extent allowed by law, ZHS is not liable for direct or indirect damages arising from use of the site.",
            "Tools may change, improve, or be retired without prior notice as the studio iterates.",
          ],
        },
        {
          title: "6. Changes and contact",
          body: [
            "These terms may be updated as the site evolves. Updates appear on this page with a new \"last updated\" date.",
            "Questions about these terms can be sent through the request / bug report page or the public GitHub Issues tracker.",
          ],
        },
      ],
    },
    disclaimerPage: {
      title: "Disclaimer",
      updated: "Last updated: 2026-05-01",
      sections: [
        {
          title: "Nature of the results",
          body: [
            "The tools on oh-my-zhs.com are estimation aids for everyday calculations and conversions. All output is informational and does not constitute legal, tax, financial, or medical advice.",
          ],
        },
        {
          title: "Currency, area, size, and cost estimates",
          body: [
            "Currency calculators apply the rate that you enter. Real card and bank settlement rates, plus their fees, will differ.",
            "Pyeong and area conversions use the standard 1 pyeong = 3.305785 m² ratio. Real-estate contracts, taxes, and registry filings rely on the m² figures recorded on official documents.",
            "Shoe size, cooking measurement, and unit conversions can shift by a margin depending on brand, ingredient density, and baseline assumptions. Treat the results as a starting reference, not a guarantee.",
          ],
        },
        {
          title: "Official sources take precedence",
          body: [
            "Official documents, government notices, vendor invoices, and qualified professionals (doctor, accountant, lawyer, financial advisor) override the site's estimates.",
            "If a result clearly contradicts a real-world source, please use the contact page to report it. Assumptions, ratios, and examples will be corrected.",
          ],
        },
      ],
    },
    contactPage: {
      title: "Contact",
      description:
        "Use this page to report a bug, request a tool, ask for a correction, or send a privacy question. This site does not take project or sales inquiries.",
      email: "Email",
      success: {
        title: "Message sent.",
        description:
          "We will read it and reply when needed. For bug reports, the relevant tool page is the most likely place to see the fix.",
        another: "Send another message",
      },
      form: {
        name: "Name",
        namePlaceholder: "Your name or handle",
        email: "Email",
        emailPlaceholder: "you@example.com",
        topic: "Topic",
        selectTopic: "Select a topic",
        topicBug: "Report a bug",
        topicTool: "Request a tool",
        topicCorrection: "Suggest a correction",
        topicPrivacy: "Privacy question",
        topicOther: "Other",
        message: "Message",
        messagePlaceholder: "Tell us which tool, what looked wrong, or what you wish existed.",
        submit: "Send message",
        sending: "Sending...",
      },
    },
    footer: {
      tagline: "Zero Human Studio — small tools that quietly work.",
      site: "Site",
      typing: "Typing practice",
      tools: "Tools",
      posts: "Posts",
      guides: "Guides",
      about: "About",
      contact: "Contact",
      legal: "Legal",
      privacy: "Privacy policy",
      terms: "Terms",
      disclaimer: "Disclaimer",
      contactSection: "Contact",
      rights: "All rights reserved.",
    },
    tools: {
      indexEyebrow: "Tools catalog",
      indexTitle: "Useful calculators and utilities for everyday work.",
      indexLead:
        "Korea-friendly conversions, time and currency estimates, config validators, cron, and small text utilities. Each tool ships with assumptions and examples.",
      tierLabel: "Tier {tier}",
      tier1Heading: "Korea-aware utilities",
      tier2Heading: "AI / automation helpers",
      tier3Heading: "Micro tools",
      countSummary: "{count} tools available",
      openTool: "Open tool →",
      backToTools: "← All tools",
      workspaceLabel: "Tool workspace",
      inputs: "Inputs",
      outputs: "Outputs",
      examples: "Examples",
      howToRead: "How to use this result",
      faqs: "Common questions",
      relatedTools: "Related tools",
      moreSuffix: "+{count} more",
      privacyNote:
        "This tool runs in your browser. Inputs stay local and are not sent to any server.",
      placeholderTitle: "Tool workspace",
      placeholderHeading: "{tool} interactive tool",
      placeholderBody: "The calculation model and page context are in place.",
    },
    categories: {
      "korea-living": "Korea Living",
      "time-money": "Time & Money",
      "file-media": "Files & Images",
      "network-diagnostics": "Network",
      "developer-automation": "Developer",
      "business-automation": "Business",
      "micro-utility": "Utility",
    },
  },
};

type DeepStringify<T> = T extends readonly (infer U)[]
  ? DeepStringify<U>[]
  : T extends Record<string, unknown>
    ? { [K in keyof T]: DeepStringify<T[K]> }
    : T extends string
      ? string
      : T;

export type Dictionary = DeepStringify<typeof dictionaries["en"]>;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
