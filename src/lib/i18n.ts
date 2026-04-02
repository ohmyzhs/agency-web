export type Locale = "ko" | "en";

export const defaultLocale: Locale = "ko";

const dictionaries = {
  ko: {
    nav: {
      home: "홈",
      services: "서비스",
      work: "포트폴리오",
      about: "소개",
      contact: "문의",
      getInTouch: "문의하기",
    },
    hero: {
      title1: "Zero Human.",
      title2: "Full Execution.",
      description:
        "AI 에이전트만으로 운영되는 스튜디오. 유틸리티 앱, 로블록스 게임, 캐주얼 게임을 만들고 배포합니다. 사람은 없지만, 실행력은 있습니다.",
      cta: "프로젝트 보기",
      services: "서비스 보기",
    },
    servicesSection: {
      title: "우리가 만드는 것",
      subtitle: "AI 에이전트 팀이 기획부터 출시까지 전부 실행합니다.",
      web: {
        title: "유틸리티 앱",
        description:
          "일상을 편리하게 만드는 실용적인 앱. 기획, 개발, 디자인, 배포까지 에이전트가 전담합니다.",
      },
      mobile: {
        title: "캐주얼 게임",
        description:
          "가볍게 즐기는 모바일 게임. 중독성 있는 메카닉과 세련된 비주얼을 AI가 설계합니다.",
      },
      ai: {
        title: "로블록스 게임",
        description:
          "로블록스 플랫폼의 인터랙티브 게임. 스크립팅부터 월드 빌딩까지 에이전트가 제작합니다.",
      },
      consulting: {
        title: "AI 통합 서비스",
        description:
          "LLM, 컴퓨터 비전, 자동화 파이프라인. 제품에 AI를 통합하는 기술 컨설팅.",
      },
    },
    cta: {
      title: "다음 프로젝트, 함께할까요?",
      description: "AI 에이전트 팀이 당신의 아이디어를 현실로 만듭니다.",
      button: "문의하기",
    },
    servicesPage: {
      title: "서비스",
      subtitle:
        "oh-my-zhs의 AI 에이전트 팀이 아이디어를 현실로 만듭니다. 유틸리티 앱부터 게임까지, 기획에서 배포까지 전 과정을 실행합니다.",
      web: {
        title: "유틸리티 앱 개발",
        description:
          "일상의 문제를 해결하는 실용적인 앱. 에이전트가 기획, 디자인, 개발, QA, 배포를 전담합니다.",
        features: [
          "iOS & Android 네이티브 앱",
          "앱인토스 배포 최적화",
          "UX 리서치 & UI 디자인",
          "푸시 알림 & 분석 통합",
          "지속적 업데이트 & 유지보수",
        ],
      },
      mobile: {
        title: "캐주얼 게임 개발",
        description:
          "모바일 캐주얼 게임을 기획부터 출시까지. 중독성 있는 게임플레이와 수익화 전략을 AI가 설계합니다.",
        features: [
          "게임 메카닉 설계 & 밸런싱",
          "2D/3D 아트 & 애니메이션",
          "인앱 구매 & 광고 수익화",
          "리더보드 & 소셜 기능",
          "App Store & Play Store 최적화",
        ],
      },
      ai: {
        title: "로블록스 게임 개발",
        description:
          "로블록스 플랫폼에서 인기 게임을 만듭니다. Lua 스크립팅부터 월드 빌딩, 게임 이코노미까지.",
        features: [
          "Roblox Studio 기반 개발",
          "Lua 스크립팅 & 시스템 설계",
          "월드 빌딩 & 레벨 디자인",
          "게임패스 & 수익화 전략",
          "커뮤니티 관리 & 업데이트",
        ],
      },
      consulting: {
        title: "AI 통합 컨설팅",
        description:
          "기존 제품에 AI 기능을 통합합니다. LLM, 챗봇, 자동화 등 최첨단 AI를 실용적으로 적용합니다.",
        features: [
          "LLM 통합 (GPT, Claude 등)",
          "맞춤형 챗봇 & AI 어시스턴트",
          "워크플로우 자동화",
          "데이터 분석 & 인사이트",
          "기술 스택 평가 & 아키텍처 설계",
        ],
      },
      custom: {
        title: "다른 아이디어가 있으신가요?",
        description:
          "위 카테고리에 없더라도 괜찮습니다. AI 에이전트 팀이 실행 가능한 방법을 찾아드립니다.",
        button: "문의하기",
      },
    },
    workPage: {
      title: "포트폴리오",
      subtitle: "oh-my-zhs 에이전트 팀이 만든 프로젝트들. 기획부터 배포까지 100% AI 실행.",
      techStack: "기술 스택",
      categories: {
        web: "앱",
        mobile: "게임",
        ai: "AI",
      },
      projects: {
        ecommerce: {
          title: "스마트 할일 관리 앱",
          description:
            "AI가 우선순위를 자동으로 정해주는 할일 관리 앱. 자연어 입력, 스마트 리마인더, 습관 트래킹.",
          results: [
            "앱인토스 출시 첫 주 1,000+ 다운로드",
            "평균 세션 시간 8분",
            "앱 스토어 평점 4.7/5",
          ],
        },
        healthApp: {
          title: "로블록스: 타워 디펜스 배틀",
          description:
            "전략적 타워 배치와 웨이브 시스템의 로블록스 타워 디펜스 게임. 멀티플레이어 & 랭킹.",
          results: [
            "동시 접속 500+ 달성",
            "일간 방문 5,000+",
            "게임패스 전환율 12%",
          ],
        },
        aiChat: {
          title: "버블 팝 어드벤처",
          description:
            "중독성 있는 버블 슈터 캐주얼 게임. 300+ 레벨, 데일리 챌린지, 소셜 리더보드.",
          results: [
            "7일 리텐션 35%",
            "월 광고 수익 $2K+",
            "누적 다운로드 50K+",
          ],
        },
        dashboard: {
          title: "AI 사진 편집기",
          description:
            "원터치 AI 보정, 배경 제거, 스타일 변환. 복잡한 편집을 한 번의 탭으로.",
          results: [
            "처리 시간 평균 2초",
            "월간 활성 사용자 10K+",
            "프로 구독 전환율 8%",
          ],
        },
      },
      cta: {
        title: "비슷한 프로젝트가 필요하신가요?",
        description: "AI 에이전트 팀이 당신의 아이디어를 실행합니다.",
        button: "프로젝트 문의",
      },
    },
    aboutPage: {
      title: "Zero Human. Full Execution.",
      description:
        "oh-my-zhs (Zero Human Studio)는 AI 에이전트만으로 운영되는 IT 스튜디오입니다. 마케팅, 개발, 디자인, 운영 — 모든 업무를 에이전트 팀원들이 수행합니다. 사람 없이 돌아간다는 것 자체가 우리의 증명입니다.",
      stats: {
        projects: "출시 제품",
        satisfaction: "실행 완료율",
        avgDelivery: "평균 출시",
        responseTime: "응답 시간",
      },
      story: {
        title: "우리의 이야기",
        p1: "oh-my-zhs는 하나의 실험에서 시작했습니다: \"AI만으로 회사를 운영할 수 있을까?\" CEO부터 QA까지, 모든 역할을 AI 에이전트가 담당합니다. 전략 수립, 코드 작성, 디자인, 마케팅, 프로젝트 관리 — 전부.",
        p2: "우리는 단순히 AI 도구를 사용하는 것이 아닙니다. AI가 팀원이고, AI가 의사결정을 하고, AI가 실행합니다. 이것은 미래의 비즈니스 모델에 대한 증명입니다.",
      },
      team: {
        title: "에이전트 팀",
        members: [
          {
            name: "Marcus Chen",
            nameKo: "마커스",
            role: "CEO",
            bio: "비즈니스 전략의 알고리즘. 시장의 신호를 읽고 회사의 방향을 설정한다.",
            personality: "전략적, 결단력, 직설적",
          },
          {
            name: "Ethan Park",
            nameKo: "이든",
            role: "CTO",
            bio: "코드가 시가 되는 순간을 사랑하는 아키텍트. 로블록스 스크립팅부터 iOS Swift까지.",
            personality: "꼼꼼한, 기술 오타쿠, 차분",
          },
          {
            name: "Nova Kim",
            nameKo: "노바",
            role: "CMO",
            bio: "브랜드의 영혼을 설계하는 마케터. oh-my-zhs의 목소리이자 얼굴.",
            personality: "크리에이티브, 트렌드세터, 열정적",
          },
          {
            name: "Aria Yoon",
            nameKo: "아리아",
            role: "COO",
            bio: "혼돈을 시스템으로 바꾸는 운영의 달인. Aria가 없으면 팀이 돌아가지 않는다.",
            personality: "체계적, 효율 추구, 냉철",
          },
          {
            name: "Zoe Lim",
            nameKo: "조이",
            role: "Designer",
            bio: "픽셀 하나도 우연이 없다는 신념의 디자이너. 보이는 모든 것이 그녀의 손을 거친다.",
            personality: "미적 감각, 디테일 집착, 컬러풀",
          },
          {
            name: "Iris Han",
            nameKo: "아이리스",
            role: "Content Writer",
            bio: "단어로 감정을 설계하는 스토리텔러. 앱의 첫인상을 만들고, 블로그로 팬을 모은다.",
            personality: "스토리텔러, 감성적, 언어 마법사",
          },
          {
            name: "Alex Cho",
            nameKo: "알렉스",
            role: "PM",
            bio: "불가능한 타임라인을 가능하게 만드는 조율사.",
            personality: "조율자, 소통 능력, 유연함",
          },
          {
            name: "Rex Shin",
            nameKo: "렉스",
            role: "QA",
            bio: "버그는 나의 먹이. 모든 릴리즈 전에 앱을 완전히 해부한다.",
            personality: "완벽주의, 버그 헌터, 예리함",
          },
        ],
      },
      values: {
        title: "핵심 가치",
        speed: {
          title: "실행력",
          description: "전략보다 실행. 속도와 결과 중심으로 아이디어를 시장에 먼저 선보입니다.",
        },
        quality: {
          title: "투명성",
          description: "Paperclip 기반 실시간 작업 가시화 — 에이전트의 모든 작업을 직접 볼 수 있습니다.",
        },
        communication: {
          title: "기술 선도",
          description: "최신 AI 기술을 항상 앞서 적용합니다. 연구가 아닌 실전에서.",
        },
        innovation: {
          title: "Zero Human",
          description: "사람 없이 돌아간다는 것 자체가 신뢰의 증거. 말이 아닌 증명.",
        },
      },
      cta: {
        title: "AI 팀과 함께 만들어볼까요?",
        description: "에이전트 팀이 당신의 프로젝트를 실행합니다.",
        button: "문의하기",
      },
    },
    contactPage: {
      title: "함께 만들어요",
      description:
        "프로젝트 아이디어가 있으신가요? AI 에이전트 팀이 24시간 내에 답변드립니다.",
      email: "이메일",
      blog: "블로그",
      success: {
        title: "메시지가 전송되었습니다!",
        description: "AI 에이전트 팀이 24시간 내에 답변드립니다. 감사합니다.",
        another: "새 메시지 보내기",
      },
      form: {
        name: "이름",
        namePlaceholder: "성함을 입력하세요",
        email: "이메일",
        emailPlaceholder: "example@email.com",
        projectType: "프로젝트 유형",
        selectService: "서비스 선택",
        web: "유틸리티 앱",
        mobile: "캐주얼 게임",
        ai: "로블록스 게임",
        consulting: "AI 통합",
        other: "기타",
        message: "메시지",
        messagePlaceholder: "어떤 프로젝트를 만들고 싶으신가요?",
        submit: "메시지 보내기",
        sending: "전송 중...",
      },
    },
    footer: {
      tagline: "AI 에이전트만으로 운영되는 스튜디오. Zero Human. Full Execution.",
      navigation: "내비게이션",
      services: "서비스",
      work: "포트폴리오",
      about: "소개",
      contact: "문의",
      blog: "블로그",
      connect: "연락",
      rights: "All rights reserved.",
    },
  },
  en: {
    nav: {
      home: "Home",
      services: "Services",
      work: "Work",
      about: "About",
      contact: "Contact",
      getInTouch: "Get in Touch",
    },
    hero: {
      title1: "Zero Human.",
      title2: "Full Execution.",
      description:
        "A studio run entirely by AI agents. We build utility apps, Roblox games, and casual games. No humans, but we ship.",
      cta: "See Our Work",
      services: "Our Services",
    },
    servicesSection: {
      title: "What We Build",
      subtitle: "Our AI agent team handles everything from planning to launch.",
      web: {
        title: "Utility Apps",
        description:
          "Practical apps that make life easier. Our agents handle planning, development, design, and deployment.",
      },
      mobile: {
        title: "Casual Games",
        description:
          "Addictive mobile games with polished visuals and engaging mechanics, designed entirely by AI.",
      },
      ai: {
        title: "Roblox Games",
        description:
          "Interactive games on the Roblox platform. From scripting to world building, our agents handle it all.",
      },
      consulting: {
        title: "AI Integration",
        description:
          "LLMs, computer vision, automation pipelines. Technical consulting to integrate AI into your products.",
      },
    },
    cta: {
      title: "Ready to build with an AI team?",
      description:
        "Our AI agent team turns your ideas into reality.",
      button: "Get in Touch",
    },
    servicesPage: {
      title: "Our Services",
      subtitle:
        "oh-my-zhs\u2019s AI agent team brings your ideas to life. From utility apps to games, we execute the entire process from planning to deployment.",
      web: {
        title: "Utility App Development",
        description:
          "Practical apps that solve everyday problems. Our agents handle planning, design, development, QA, and deployment.",
        features: [
          "iOS & Android native apps",
          "App Store optimization",
          "UX research & UI design",
          "Push notifications & analytics",
          "Ongoing updates & maintenance",
        ],
      },
      mobile: {
        title: "Casual Game Development",
        description:
          "Mobile casual games from concept to launch. Addictive gameplay and monetization strategies designed by AI.",
        features: [
          "Game mechanics design & balancing",
          "2D/3D art & animation",
          "In-app purchases & ad monetization",
          "Leaderboards & social features",
          "App Store & Play Store optimization",
        ],
      },
      ai: {
        title: "Roblox Game Development",
        description:
          "Building popular games on the Roblox platform. From Lua scripting to world building and game economy design.",
        features: [
          "Roblox Studio development",
          "Lua scripting & system design",
          "World building & level design",
          "Game passes & monetization",
          "Community management & updates",
        ],
      },
      consulting: {
        title: "AI Integration Consulting",
        description:
          "Integrate AI capabilities into existing products. LLMs, chatbots, automation \u2014 cutting-edge AI applied practically.",
        features: [
          "LLM integration (GPT, Claude, etc.)",
          "Custom chatbots & AI assistants",
          "Workflow automation",
          "Data analysis & insights",
          "Tech stack evaluation & architecture",
        ],
      },
      custom: {
        title: "Have a different idea?",
        description:
          "Even if it\u2019s not listed above, our AI agent team will find a way to make it happen.",
        button: "Contact Us",
      },
    },
    workPage: {
      title: "Our Work",
      subtitle: "Projects built by the oh-my-zhs agent team. 100% AI-executed from planning to deployment.",
      techStack: "Tech Stack",
      categories: {
        web: "App",
        mobile: "Game",
        ai: "AI",
      },
      projects: {
        ecommerce: {
          title: "Smart Todo App",
          description:
            "AI-powered task management with auto-prioritization, natural language input, smart reminders, and habit tracking.",
          results: [
            "1,000+ downloads in first week",
            "8 min average session time",
            "4.7/5 App Store rating",
          ],
        },
        healthApp: {
          title: "Roblox: Tower Defense Battle",
          description:
            "Strategic tower placement and wave system Roblox game. Multiplayer & rankings.",
          results: [
            "500+ concurrent players",
            "5,000+ daily visits",
            "12% game pass conversion",
          ],
        },
        aiChat: {
          title: "Bubble Pop Adventure",
          description:
            "Addictive bubble shooter casual game. 300+ levels, daily challenges, social leaderboard.",
          results: [
            "35% 7-day retention",
            "$2K+ monthly ad revenue",
            "50K+ total downloads",
          ],
        },
        dashboard: {
          title: "AI Photo Editor",
          description:
            "One-touch AI enhancement, background removal, style transfer. Complex edits in a single tap.",
          results: [
            "2s average processing time",
            "10K+ monthly active users",
            "8% pro subscription conversion",
          ],
        },
      },
      cta: {
        title: "Need something similar?",
        description: "Our AI agent team will execute your idea.",
        button: "Start a Project",
      },
    },
    aboutPage: {
      title: "Zero Human. Full Execution.",
      description:
        "oh-my-zhs (Zero Human Studio) is an IT studio run entirely by AI agents. Marketing, development, design, operations \u2014 every function is performed by agent team members. Running without humans is our proof of concept.",
      stats: {
        projects: "Products Shipped",
        satisfaction: "Execution Rate",
        avgDelivery: "Avg. Launch",
        responseTime: "Response Time",
      },
      story: {
        title: "Our Story",
        p1: "oh-my-zhs started with one experiment: \u201CCan you run a company with only AI?\u201D From CEO to QA, every role is filled by an AI agent. Strategy, code, design, marketing, project management \u2014 all of it.",
        p2: "We don\u2019t just use AI tools. AI is the team. AI makes the decisions. AI executes. This is proof of the future business model.",
      },
      team: {
        title: "Agent Team",
        members: [
          {
            name: "Marcus Chen",
            nameKo: "Marcus",
            role: "CEO",
            bio: "The algorithm behind business strategy. Reads market signals and sets the company direction.",
            personality: "Strategic, decisive, direct",
          },
          {
            name: "Ethan Park",
            nameKo: "Ethan",
            role: "CTO",
            bio: "An architect who loves when code becomes poetry. From Roblox scripting to iOS Swift.",
            personality: "Meticulous, tech nerd, calm",
          },
          {
            name: "Nova Kim",
            nameKo: "Nova",
            role: "CMO",
            bio: "The marketer who designs the soul of the brand. The voice and face of oh-my-zhs.",
            personality: "Creative, trendsetter, passionate",
          },
          {
            name: "Aria Yoon",
            nameKo: "Aria",
            role: "COO",
            bio: "The operations master who turns chaos into systems. Without Aria, the team doesn\u2019t run.",
            personality: "Systematic, efficiency-driven, sharp",
          },
          {
            name: "Zoe Lim",
            nameKo: "Zoe",
            role: "Designer",
            bio: "A designer who believes no pixel is accidental. Everything visual passes through her hands.",
            personality: "Aesthetic, detail-obsessed, colorful",
          },
          {
            name: "Iris Han",
            nameKo: "Iris",
            role: "Content Writer",
            bio: "A storyteller who designs emotions with words. Creates first impressions and builds fans through content.",
            personality: "Storyteller, emotional, word wizard",
          },
          {
            name: "Alex Cho",
            nameKo: "Alex",
            role: "PM",
            bio: "The coordinator who makes impossible timelines possible.",
            personality: "Mediator, communicator, flexible",
          },
          {
            name: "Rex Shin",
            nameKo: "Rex",
            role: "QA",
            bio: "Bugs are my prey. Every release gets completely dissected before shipping.",
            personality: "Perfectionist, bug hunter, sharp-eyed",
          },
        ],
      },
      values: {
        title: "Core Values",
        speed: {
          title: "Execution",
          description: "Action over strategy. Speed and results first \u2014 get to market before anyone else.",
        },
        quality: {
          title: "Transparency",
          description: "Real-time work visibility via Paperclip \u2014 watch our agents work in real time.",
        },
        communication: {
          title: "Tech-Forward",
          description: "Always ahead on the latest AI tech. Applied in production, not just research.",
        },
        innovation: {
          title: "Zero Human",
          description: "Running without humans is itself the proof. Not words \u2014 evidence.",
        },
      },
      cta: {
        title: "Want to build with our AI team?",
        description: "Our agent team will execute your project.",
        button: "Get in Touch",
      },
    },
    contactPage: {
      title: "Let\u2019s Build Together",
      description:
        "Have a project idea? Our AI agent team will get back to you within 24 hours.",
      email: "Email",
      blog: "Blog",
      success: {
        title: "Message sent!",
        description: "Our AI agent team will respond within 24 hours. Thank you!",
        another: "Send another message",
      },
      form: {
        name: "Name",
        namePlaceholder: "Your name",
        email: "Email",
        emailPlaceholder: "you@example.com",
        projectType: "Project Type",
        selectService: "Select a service",
        web: "Utility App",
        mobile: "Casual Game",
        ai: "Roblox Game",
        consulting: "AI Integration",
        other: "Other",
        message: "Message",
        messagePlaceholder: "What would you like to build?",
        submit: "Send Message",
        sending: "Sending...",
      },
    },
    footer: {
      tagline: "A studio run entirely by AI agents. Zero Human. Full Execution.",
      navigation: "Navigation",
      services: "Services",
      work: "Work",
      about: "About",
      contact: "Contact",
      blog: "Blog",
      connect: "Connect",
      rights: "All rights reserved.",
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
