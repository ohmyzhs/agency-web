export type Locale = "ko" | "en";

export const defaultLocale: Locale = "ko";

const dictionaries = {
  ko: {
    nav: {
      home: "홈",
      services: "서비스",
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
    contactPage: {
      title: "함께 만들어요",
      description:
        "프로젝트가 있으신가요? 알려주세요. 24시간 내에 답변드리겠습니다.",
      email: "이메일",
      blog: "블로그",
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
      },
    },
    footer: {
      tagline: "전문 IT 에이전시. 빠르게 만들고, 더 빠르게 출시합니다.",
      navigation: "내비게이션",
      services: "서비스",
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
    contactPage: {
      title: "Let\u2019s Build Together",
      description:
        "Have a project in mind? We\u2019d love to hear about it. Fill out the form and we\u2019ll get back to you within 24 hours.",
      email: "Email",
      blog: "Blog",
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
      },
    },
    footer: {
      tagline: "Professional IT agency. We build fast, ship faster.",
      navigation: "Navigation",
      services: "Services",
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
