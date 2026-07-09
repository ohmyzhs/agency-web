---
type: blog-draft
status: published
authoring_harness: zhs-daily-issue-builder
format: html
created: 2026-07-08
updated: 2026-07-08
title: "AWS, AI 에이전트에 데스크톱을 줬다 — 레거시 ERP·메인프레임 자동화의 새 시대"
slug: daily-issue-2026-07-08
kind: daily
category: news-ai-insight
locale: ko
publishedAt: 2026-07-08
sortAt: 2026-07-08T13:00:00+09:00
readingMinutes: 4
description: "AWS가 Amazon WorkSpaces for AI Agents를 정식 출시했다. API 없는 레거시 데스크톱 앱도 AI 에이전트가 자동화할 수 있는 길이 열렸다. ZHS가 Hermes Agent 운영 경험으로 분석한 이번 발표의 의미와 한국 기업 AX 전략에 미치는 영향."
keyword_primary: "AWS 데스크톱 AI 에이전트"
thumbnail:
tags:
  - daily-issue
  - daily
  - aws
  - agentic-ai
  - enterprise-automation
related_tools: []
sourceLinks:
  - label: ZDNet Korea - AWS, 데스크톱 앱도 AI 에이전트로 자동화
    url: https://zdnet.co.kr/view/?no=20260707112334
  - label: CNET Korea - AWS, 데스크톱 앱 자동화 기능 공개
    url: https://www.cnet.co.kr/view/?no=20260707155206
  - label: AWS 공식 - WorkSpaces for AI Agents
    url: https://aws.amazon.com/workspaces/ai-agents/
quality_gate: reviewed
share_url:
telegram_handoff: false
---

<section class="zhs-html-hero">
<p class="zhs-html-eyebrow">DAILY ISSUE · 2026-07-08 · AWS · AGENTIC AI</p>
<h1>AWS, AI 에이전트에 데스크톱을 줬다 — 레거시 ERP·메인프레임 자동화의 새 시대</h1>
<p class="zhs-html-lead">아마존웹서비스(AWS)가 7일 Amazon WorkSpaces Applications 기능을 정식 출시하며 AI 에이전트가 데스크톱 애플리케이션에 안전하게 접근하고 작업을 수행할 수 있는 길을 열었다. API가 없는 ERP, 메인프레임, 레거시 시스템까지 AI 자동화 대상이 된 것이다. 이는 단순한 기능 추가가 아니라, 기업 AI 전환(AX)의 마지막 장벽이 사라지는 신호다.</p>
</section>
<div class="zhs-html-divider"></div>

<h2>무슨 일이 일어났나</h2>
<p>AWS는 2026년 5월 프리뷰로 공개했던 Amazon WorkSpaces for AI Agents를 6월 30일 정식 출시(GA)하고, 7일 국내 언론에 그 내용을 공식 발표했다. ZDNet Korea, CNET Korea, 바이라인네트워크, 테크데일리 등 주요 매체가 일제히 보도했다.</p>
<p>핵심은 이렇다: AI 에이전트가 Amazon WorkSpaces(관리형 클라우드 데스크톱) 환경을 통해 기존 데스크톱 애플리케이션에 접근할 수 있게 됐다. 에이전트는 사람처럼 포인트-클릭-네비게이트 방식으로 애플리케이션 UI를 조작한다. MCP(Model Context Protocol) 엔드포인트를 통해 연결되며, IAM 인증과 기존 엔터프라이즈 거버넌스 체계를 그대로 사용한다.</p>
<p>AWS의 공식 설명에 따르면, 이 기능은 "AI 에이전트가 API 접근 권한이 없는 레거시 데스크톱 애플리케이션(ERP, CRM, 메인프레임, 독점 도구)을 애플리케이션 현대화 없이 안전하게 운영할 수 있게 한다." 즉, 수십 년 된 COBOL 기반 메인프레임 화면도, API가 없는 구형 ERP도, AI 에이전트가 직접 조작할 수 있다는 뜻이다.</p>

<h2>왜 지금 중요한가</h2>
<p>이 발표의 의미는 세 가지 층위로 나눠 볼 수 있다.</p>
<p><strong>첫째, AI 에이전트 자동화의 '라스트마일'이 해결됐다.</strong> 지금까지 AI 에이전트가 자동화할 수 있는 작업은 API가 있는 현대적인 SaaS 도구나 웹 서비스에 국한되어 있었다. 기업의 핵심 업무를 처리하는 레거시 시스템(메인프레임, ERP, SAP GUI, 내부 관리 도구)은 API가 없거나 접근이 제한되어 AI 자동화의 사각지대였다. AWS는 이 문제를 데스크톱 UI 조작이라는 방식으로 해결했다. 컴퓨터 비전과 MCP를 결합해 에이전트가 화면을 '보고' 조작하게 만든 것이다.</p>
<p><strong>둘째, 기업 AI 전환(AX)의 속도가 바뀐다.</strong> 기업이 AI 에이전트를 도입할 때 가장 큰 걸림돌 중 하나는 "기존 시스템을 AI가 쓸 수 있게 만드는 데 드는 비용"이었다. 레거시 시스템에 API를 붙이거나 현대화하는 데 수개월, 수억 원이 들었다. AWS WorkSpaces for AI Agents는 이 비용을 사실상 0으로 만든다. 에이전트가 UI를 직접 조작하므로, 시스템을 전혀 고치지 않아도 된다. 업무 자동화의 ROI가 급격히 개선될 수 있다.</p>
<p><strong>셋째, AI 에이전트의 작업 범위가 확장된다.</strong> 기존 AI 에이전트는 텍스트 기반 작업(문서 요약, 이메일 초안)에 머물렀다. 이제는 GUI 기반의 복잡한 업무 프로세스 — ERP에서 발주서 입력, CRM에서 고객 정보 갱신, 메인프레임에서 데이터 조회 — 를 에이전트가 대신 수행할 수 있다. 업무 자동화의 패러다임이 '텍스트 처리'에서 '데스크톱 조작'으로 확장된 것이다.</p>

<h2>한국 시장 맥락</h2>
<p>한국 기업 환경에서 이 발표의 의미는 더 크다. 국내 기업들은 여전히 IE 기반 ActiveX, 구형 ERP, COBOL 메인프레임 시스템을 운영하는 곳이 많다. 금융권, 공공기관, 제조 대기업은 현대화가 어려운 레거시 시스템의 보고다.</p>
<p>ZDNet Korea와 CNET Korea가 이 소식을 주요 뉴스로 다룬 배경도 여기에 있다. 한국 기업의 AX 수요는 폭발적이지만, '레거시 시스템과의 호환성'이 항상 병목이었다. AWS의 이번 발표는 그 병목을 제거하는 기술적 해법을 제시한다.</p>
<p>다만 주의할 점이 있다. 한국 기업의 보안 규정(금융보안원, ISMS-P 등)은 외부 에이전트가 데스크톱을 조작하는 방식에 대한 명확한 가이드라인이 아직 없다. AWS WorkSpaces는 IAM 기반 접근 통제와 감사 로깅을 제공하지만, 국내 규제 환경에 맞는 거버넌스 체계는 각 기업이 자체적으로 구축해야 한다. 이 부분은 ZHS가 차후 심층 분석할 예정이다.</p>

<h2>ZHS 각도 — Hermes Agent가 이미 하고 있는 일</h2>
<p>흥미롭게도, ZHS가 운영 중인 Hermes Agent는 이미 이 방향과 유사한 작업을 수행하고 있다. Hermes Agent는 터미널 환경에서 34개 이상의 실용 도구를 조작하며 파일 관리, 코드 실행, 데이터 처리, 웹 검색 등을 자동화한다. AWS WorkSpaces for AI Agents가 '데스크톱 GUI 자동화'를 표준화했다면, Hermes Agent는 'CLI/터미널 자동화'를 표준화한 셈이다.</p>
<p>두 접근법의 차이는 명확하다. AWS는 관리형 클라우드 데스크톱을 제공해 기업이 보안과 거버넌스를 유지하면서 에이전트를 운영할 수 있게 한다. Hermes Agent는 오픈소스로 개인 개발자부터 스타트업까지 누구나 자유롭게 설치하고 커스터마이즈할 수 있다. 전자가 '엔터프라이즈 보안'을 내세운다면, 후자는 '자유도와 확장성'을 강점으로 한다.</p>
<p>ZHS의 관점에서, AWS의 이번 발표는 AI 에이전트가 '사람의 도구를 쓰는 방식'이 산업 표준으로 자리잡는 신호다. MCP 프로토콜을 통해 에이전트-데스크톱 연결을 표준화한 점은, Hermes Agent가 이미 CLI 환경에서 툴을 연결하는 방식과 개념적으로 일치한다. CLI 기반 자동화와 GUI 기반 자동화가 MCP라는 하나의 표준으로 수렴하는 중이다.</p>

<h2>경쟁사/대안 비교</h2>
<p>AWS가 이 시장에 진입하면서 경쟁 구도는 더 복잡해졌다.</p>
<p><strong>Microsoft</strong>는 Copilot을 통해 Windows 환경과 오피스 도구를 에이전트가 조작할 수 있는 생태계를 이미 구축했다. 하지만 Microsoft의 접근법은 자사 제품군(M365, Windows)에 최적화되어 있어, 타사 ERP나 메인프레임까지 자동화 범위가 확장되지는 않는다.</p>
<p><strong>Google Cloud</strong>는 Vertex AI Agent Builder를 통해 에이전트 구축 플랫폼을 제공하지만, 데스크톱 UI 자동화는 AWS WorkSpaces만큼 구체화되지 않았다.</p>
<p><strong>오픈소스 진영</strong>에서는 OpenClaw, Computer Use API(Anthropic), Playwright/Puppeteer 등이 부분적으로 유사한 기능을 제공한다. 하지만 이들은 개별 데스크톱 조작에 초점이 맞춰져 있고, 엔터프라이즈 거버넌스(중앙 관리, 감사 로깅, IAM 통합)는 AWS 수준에 미치지 못한다.</p>
<p>AWS의 가장 큰 차별점은 '기업이 이미 쓰고 있는 인프라 위에서 작동한다'는 점이다. 별도의 에이전트 인프라를 구축할 필요 없이, 기존 WorkSpaces 환경과 IAM 정책을 그대로 활용할 수 있다. 이는 엔터프라이즈 시장에서 결정적인 장점이다.</p>

<section class="zhs-html-conclusion">
<p>AWS의 이번 발표는 AI 에이전트가 '할 수 있는 일'의 범위를 근본적으로 확장했다. API 의존도에서 벗어나 데스크톱 UI 자체를 조작 인터페이스로 삼는 접근법은, 레거시 시스템이 넘쳐나는 한국 기업 환경에서 특히 강력한 무기가 될 수 있다.</p>
<p>ZHS는 이 변화를 주시하며, Hermes Agent 운영 경험을 바탕으로 AWS WorkSpaces for AI Agents와 오픈소스 에이전트의 실전 비교 가이드를 준비할 예정이다. AI 에이전트가 '사람의 도구'를 쓰는 시대 — 그 첫걸음이 오늘 시작됐다.</p>
</section>