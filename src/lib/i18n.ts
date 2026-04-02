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
      title1: "빠르게 출시하는",
      title2: "제품을 만듭니다.",
      description:
        "웹 & 앱 개발, AI 통합, 기술 컨설팅 전문 IT 에이전시. 아이디어에서 프로덕션까지, 몇 달이 아닌 몇 주 만에.",
      cta: "프로젝트 시작",
      services: "서비스 보기",
    },
    servicesSection: {
      title: "우리가 하는 일",
      subtitle: "현대 비즈니스를 위한 엔드투엔드 개발 서비스.",
      web: {
        title: "웹 개발",
        description:
          "Next.js, React, 최신 프레임워크로 구축하는 고성능 웹 애플리케이션. SEO 최적화, 초고속.",
      },
      mobile: {
        title: "모바일 앱",
        description:
          "React Native 크로스플랫폼 모바일 앱. 하나의 코드베이스, iOS와 Android 네이티브 성능.",
      },
      ai: {
        title: "AI 통합",
        description:
          "제품에 최첨단 AI를 통합합니다. LLM, 컴퓨터 비전, 맞춤형 ML 파이프라인.",
      },
      consulting: {
        title: "기술 컨설팅",
        description:
          "아키텍처 리뷰, 기술 스택 가이드, 실무 지원으로 팀의 생산성을 높입니다.",
      },
    },
    cta: {
      title: "함께 만들어 볼까요?",
      description: "프로젝트에 대해 이야기하고 어떻게 도울 수 있는지 알아보세요.",
      button: "문의하기",
    },
    servicesPage: {
      title: "서비스",
      subtitle:
        "아이디어를 현실로 만드는 엔드투엔드 개발 서비스. 모든 프로젝트는 성능, 확장성, 사용자 경험을 핵심으로 구축합니다.",
      web: {
        title: "웹 개발",
        description:
          "최첨단 프레임워크로 구축하는 풀스택 웹 애플리케이션. Next.js, React, Node.js 전문으로 빠르고 확장 가능하며 SEO 친화적인 웹사이트를 제공합니다.",
        features: [
          "서버사이드 렌더링 & 정적 생성",
          "프로그레시브 웹 앱 (PWA)",
          "이커머스 플랫폼",
          "SaaS 애플리케이션",
          "어드민 대시보드 & 내부 도구",
        ],
      },
      mobile: {
        title: "모바일 앱 개발",
        description:
          "네이티브 성능의 크로스플랫폼 모바일 앱. iOS와 Android에서 코드를 공유하면서 플랫폼별 경험을 제공합니다.",
        features: [
          "React Native 개발",
          "iOS & Android 네이티브 기능",
          "푸시 알림 & 실시간 업데이트",
          "오프라인 우선 아키텍처",
          "App Store & Play Store 배포",
        ],
      },
      ai: {
        title: "AI 통합",
        description:
          "제품에 최첨단 AI 기능을 통합합니다. 대화형 AI부터 컴퓨터 비전까지, AI를 접근 가능하고 실용적으로 만듭니다.",
        features: [
          "LLM 통합 (GPT, Claude 등)",
          "맞춤형 챗봇 & 어시스턴트",
          "컴퓨터 비전 & 이미지 처리",
          "추천 엔진",
          "데이터 파이프라인 & ML 인프라",
        ],
      },
      consulting: {
        title: "기술 컨설팅",
        description:
          "팀이 더 나은 결정을 내릴 수 있도록 전략적 기술 가이드. 아키텍처 리뷰, 성능 감사, 실무 구현 지원.",
        features: [
          "아키텍처 설계 & 리뷰",
          "기술 스택 평가",
          "성능 최적화",
          "DevOps & CI/CD 구축",
          "팀 교육 & 멘토링",
        ],
      },
      custom: {
        title: "맞춤형 솔루션이 필요하신가요?",
        description:
          "모든 비즈니스는 고유합니다. 구체적인 요구사항을 논의하고 최적의 솔루션을 찾아보세요.",
        button: "문의하기",
      },
    },
    workPage: {
      title: "포트폴리오",
      subtitle: "우리가 구축한 프로젝트들. 각 프로젝트는 실제 비즈니스 문제를 해결합니다.",
      techStack: "기술 스택",
      categories: {
        web: "웹",
        mobile: "모바일",
        ai: "AI",
      },
      projects: {
        ecommerce: {
          title: "이커머스 플랫폼",
          description:
            "실시간 재고 관리, 결제 시스템, 관리자 대시보드를 갖춘 풀스택 이커머스 솔루션.",
          results: [
            "페이지 로딩 시간 60% 단축",
            "모바일 전환율 35% 향상",
            "월 10만+ 트랜잭션 처리",
          ],
        },
        healthApp: {
          title: "헬스케어 모바일 앱",
          description:
            "건강 데이터 추적, 의사 예약, 원격 진료 기능을 갖춘 크로스플랫폼 헬스케어 앱.",
          results: [
            "앱 스토어 평점 4.8/5",
            "월간 활성 사용자 5만+",
            "HealthKit/Google Fit 연동",
          ],
        },
        aiChat: {
          title: "AI 고객지원 챗봇",
          description:
            "기업 지식 베이스와 통합된 AI 기반 고객지원 자동화 시스템.",
          results: [
            "고객 문의 70% 자동 처리",
            "평균 응답 시간 3초 이내",
            "고객 만족도 92% 달성",
          ],
        },
        dashboard: {
          title: "실시간 분석 대시보드",
          description:
            "비즈니스 KPI를 실시간으로 모니터링하는 데이터 시각화 대시보드.",
          results: [
            "실시간 WebSocket 데이터 스트리밍",
            "50+ 커스텀 차트 위젯",
            "의사결정 시간 40% 단축",
          ],
        },
      },
      cta: {
        title: "비슷한 프로젝트가 필요하신가요?",
        description: "우리의 경험을 바탕으로 최적의 솔루션을 제안해 드립니다.",
        button: "프로젝트 상담",
      },
    },
    aboutPage: {
      title: "기술로 비즈니스를 바꿉니다",
      description:
        "AIT는 스타트업부터 엔터프라이즈까지, 아이디어를 빠르게 현실로 만드는 IT 전문 에이전시입니다. 최신 기술 스택과 검증된 방법론으로 고객의 디지털 전환을 지원합니다.",
      stats: {
        projects: "완료 프로젝트",
        satisfaction: "고객 만족도",
        avgDelivery: "평균 납기",
        responseTime: "응답 시간",
      },
      story: {
        title: "우리의 이야기",
        p1: "빠르게 변화하는 기술 환경에서 비즈니스가 경쟁력을 유지하려면 올바른 기술 파트너가 필요합니다. AIT는 이 간극을 메우기 위해 탄생했습니다.",
        p2: "웹, 모바일, AI에 걸친 폭넓은 기술 역량과 각 분야 전문가로 구성된 팀이 프로젝트의 시작부터 끝까지 함께합니다. 우리는 단순히 코드를 작성하는 것이 아니라, 비즈니스 가치를 만들어냅니다.",
      },
      values: {
        title: "핵심 가치",
        speed: {
          title: "속도",
          description: "빠른 프로토타이핑과 반복 개발로 아이디어를 시장에 먼저 선보입니다.",
        },
        quality: {
          title: "품질",
          description: "깔끔한 코드, 철저한 테스트, 성능 최적화로 오래 유지되는 제품을 만듭니다.",
        },
        communication: {
          title: "소통",
          description: "투명한 진행 공유와 빠른 피드백 반영으로 신뢰를 쌓습니다.",
        },
        innovation: {
          title: "혁신",
          description: "최신 기술 트렌드를 연구하고 실무에 적용하여 차별화된 솔루션을 제공합니다.",
        },
      },
      cta: {
        title: "함께 일해보시겠어요?",
        description: "프로젝트에 대해 이야기하고 최적의 솔루션을 찾아보세요.",
        button: "문의하기",
      },
    },
    contactPage: {
      title: "함께 만들어요",
      description:
        "프로젝트가 있으신가요? 알려주세요. 24시간 내에 답변드리겠습니다.",
      email: "이메일",
      blog: "블로그",
      success: {
        title: "메시지가 전송되었습니다!",
        description: "24시간 내에 답변드리겠습니다. 감사합니다.",
        another: "새 메시지 보내기",
      },
      form: {
        name: "이름",
        namePlaceholder: "성함을 입력하세요",
        email: "이메일",
        emailPlaceholder: "example@email.com",
        projectType: "프로젝트 유형",
        selectService: "서비스 선택",
        web: "웹 개발",
        mobile: "모바일 앱",
        ai: "AI 통합",
        consulting: "기술 컨설팅",
        other: "기타",
        message: "메시지",
        messagePlaceholder: "프로젝트에 대해 알려주세요...",
        submit: "메시지 보내기",
        sending: "전송 중...",
      },
    },
    footer: {
      tagline: "전문 IT 에이전시. 빠르게 만들고, 더 빠르게 출시합니다.",
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
      title1: "We build products",
      title2: "that ship fast.",
      description:
        "Professional IT agency specializing in web & app development, AI integration, and technical consulting. From idea to production in weeks, not months.",
      cta: "Start a Project",
      services: "Our Services",
    },
    servicesSection: {
      title: "What We Do",
      subtitle: "End-to-end development services for modern businesses.",
      web: {
        title: "Web Development",
        description:
          "High-performance web applications built with Next.js, React, and modern frameworks. SEO-optimized and blazing fast.",
      },
      mobile: {
        title: "Mobile Apps",
        description:
          "Cross-platform mobile applications with React Native. One codebase, native performance on iOS and Android.",
      },
      ai: {
        title: "AI Integration",
        description:
          "Integrate cutting-edge AI capabilities into your products. LLMs, computer vision, and custom ML pipelines.",
      },
      consulting: {
        title: "Technical Consulting",
        description:
          "Architecture reviews, tech stack guidance, and hands-on support to help your team ship faster.",
      },
    },
    cta: {
      title: "Ready to build something great?",
      description:
        "Let\u2019s talk about your project and how we can help.",
      button: "Get in Touch",
    },
    servicesPage: {
      title: "Our Services",
      subtitle:
        "We offer end-to-end development services to bring your ideas to life. Every project is built with performance, scalability, and user experience at its core.",
      web: {
        title: "Web Development",
        description:
          "Full-stack web applications built with cutting-edge frameworks. We specialize in Next.js, React, and Node.js to deliver fast, scalable, and SEO-friendly websites.",
        features: [
          "Server-side rendering & static generation",
          "Progressive Web Apps (PWA)",
          "E-commerce platforms",
          "SaaS applications",
          "Admin dashboards & internal tools",
        ],
      },
      mobile: {
        title: "Mobile App Development",
        description:
          "Cross-platform mobile apps with native performance. Share code across iOS and Android while delivering platform-specific experiences.",
        features: [
          "React Native development",
          "iOS & Android native features",
          "Push notifications & real-time updates",
          "Offline-first architecture",
          "App Store & Play Store deployment",
        ],
      },
      ai: {
        title: "AI Integration",
        description:
          "Integrate state-of-the-art AI capabilities into your products. From conversational AI to computer vision, we make AI accessible and practical.",
        features: [
          "LLM integration (GPT, Claude, etc.)",
          "Custom chatbots & assistants",
          "Computer vision & image processing",
          "Recommendation engines",
          "Data pipeline & ML infrastructure",
        ],
      },
      consulting: {
        title: "Technical Consulting",
        description:
          "Strategic technical guidance to help your team make better decisions. Architecture reviews, performance audits, and hands-on implementation support.",
        features: [
          "Architecture design & review",
          "Tech stack evaluation",
          "Performance optimization",
          "DevOps & CI/CD setup",
          "Team training & mentoring",
        ],
      },
      custom: {
        title: "Need something custom?",
        description:
          "Every business is unique. Let\u2019s discuss your specific needs and find the right solution.",
        button: "Contact Us",
      },
    },
    workPage: {
      title: "Our Work",
      subtitle: "Projects we\u2019ve built. Each solves real business problems.",
      techStack: "Tech Stack",
      categories: {
        web: "Web",
        mobile: "Mobile",
        ai: "AI",
      },
      projects: {
        ecommerce: {
          title: "E-Commerce Platform",
          description:
            "Full-stack e-commerce solution with real-time inventory management, payment processing, and admin dashboard.",
          results: [
            "60% faster page load times",
            "35% increase in mobile conversion",
            "100k+ monthly transactions",
          ],
        },
        healthApp: {
          title: "Healthcare Mobile App",
          description:
            "Cross-platform healthcare app with health data tracking, doctor appointments, and telemedicine features.",
          results: [
            "4.8/5 App Store rating",
            "50k+ monthly active users",
            "HealthKit/Google Fit integration",
          ],
        },
        aiChat: {
          title: "AI Customer Support Bot",
          description:
            "AI-powered customer support automation system integrated with enterprise knowledge base.",
          results: [
            "70% of inquiries handled automatically",
            "Under 3s average response time",
            "92% customer satisfaction score",
          ],
        },
        dashboard: {
          title: "Real-time Analytics Dashboard",
          description:
            "Data visualization dashboard for monitoring business KPIs in real time.",
          results: [
            "Real-time WebSocket data streaming",
            "50+ custom chart widgets",
            "40% faster decision making",
          ],
        },
      },
      cta: {
        title: "Need something similar?",
        description: "We\u2019ll recommend the best solution based on our experience.",
        button: "Start a Project",
      },
    },
    aboutPage: {
      title: "We transform businesses with technology",
      description:
        "AIT is a professional IT agency that turns ideas into reality fast \u2014 from startups to enterprises. We support your digital transformation with cutting-edge tech stacks and proven methodologies.",
      stats: {
        projects: "Projects Completed",
        satisfaction: "Client Satisfaction",
        avgDelivery: "Avg. Delivery",
        responseTime: "Response Time",
      },
      story: {
        title: "Our Story",
        p1: "In a rapidly changing tech landscape, businesses need the right technology partner to stay competitive. AIT was born to bridge that gap.",
        p2: "With deep expertise across web, mobile, and AI, our team of specialists works with you from start to finish. We don\u2019t just write code \u2014 we create business value.",
      },
      values: {
        title: "Core Values",
        speed: {
          title: "Speed",
          description: "Rapid prototyping and iterative development to get your idea to market first.",
        },
        quality: {
          title: "Quality",
          description: "Clean code, thorough testing, and performance optimization for products that last.",
        },
        communication: {
          title: "Communication",
          description: "Transparent progress updates and fast feedback cycles build trust.",
        },
        innovation: {
          title: "Innovation",
          description: "We research and apply the latest tech trends to deliver differentiated solutions.",
        },
      },
      cta: {
        title: "Want to work together?",
        description: "Let\u2019s discuss your project and find the right solution.",
        button: "Get in Touch",
      },
    },
    contactPage: {
      title: "Let\u2019s Build Together",
      description:
        "Have a project in mind? We\u2019d love to hear about it. Fill out the form and we\u2019ll get back to you within 24 hours.",
      email: "Email",
      blog: "Blog",
      success: {
        title: "Message sent!",
        description: "We\u2019ll get back to you within 24 hours. Thank you!",
        another: "Send another message",
      },
      form: {
        name: "Name",
        namePlaceholder: "Your name",
        email: "Email",
        emailPlaceholder: "you@example.com",
        projectType: "Project Type",
        selectService: "Select a service",
        web: "Web Development",
        mobile: "Mobile App",
        ai: "AI Integration",
        consulting: "Technical Consulting",
        other: "Other",
        message: "Message",
        messagePlaceholder: "Tell us about your project...",
        submit: "Send Message",
        sending: "Sending...",
      },
    },
    footer: {
      tagline: "Professional IT agency. We build fast, ship faster.",
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
