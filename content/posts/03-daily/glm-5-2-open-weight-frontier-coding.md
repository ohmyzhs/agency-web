---
type: blog-draft
status: published
authoring_harness: zhs-editorial-blog-builder
format: html
created: 2026-06-19
updated: 2026-06-19
title: "GLM-5.2: 6분의 1 비용으로 GPT-5.5를 넘어선 순간, 오픈웨이트가 프론티어를 주도하기 시작했다"
slug: glm-5-2-open-weight-frontier-coding
kind: news-explainer
category: ai-insight
locale: ko
publishedAt: 2026-06-19
sortAt: 2026-06-19T11:00:00+09:00
readingMinutes: 15
description: "GLM-5.2가 SWE-bench Pro에서 GPT-5.5를 제치고 Claude Opus 4.8에 근접한 성능을 6분의 1 비용으로 달성했다. MIT 라이선스, 1M 컨텍스트, IndexShare 구조가 오픈웨이트 모델의 프론티어 주도를 알리는 신호다."
keyword_primary: GLM-5.2
thumbnail: /infographics/glm-5-2-open-weight-frontier-coding/glm-5-2-open-weight-frontier-coding-ko.jpg
tags:
  - glm-5.2
  - zai
  - open-weight
  - coding-model
  - frontier-model
  - model-pricing
related_tools:
  - developer-text-toolkit
  - json-yaml-validator
sourceLinks:
  - label: Z.AI - GLM-5.2 Blog (Hugging Face)
    url: https://huggingface.co/blog/zai-org/glm-52-blog
  - label: VentureBeat - GLM-5.2 beats GPT-5.5 on coding benchmarks
    url: https://venturebeat.com/technology/z-ais-open-weights-glm-5-2-beats-gpt-5-5-on-multiple-long-horizon-coding-benchmarks-for-1-6th-the-cost
  - label: Artificial Analysis - GLM-5.2 Leading Open Weights Model
    url: https://artificialanalysis.ai/articles/glm-5-2-is-the-new-leading-open-weights-model-on-the-artificial-analysis-intelligence-index
  - label: OpenRouter - GLM 5.2 Pricing
    url: https://openrouter.ai/z-ai/glm-5.2
  - label: Digital Applied - Open-Weight vs Closed-Source Gap Analysis Q2 2026
    url: https://www.digitalapplied.com/blog/open-weight-vs-closed-source-ai-models-q2-2026

quality_gate: reviewed
share_url:
telegram_handoff: false
---
<section class="zhs-html-hero">
  <p class="zhs-html-eyebrow">Frontier Models · Open-Weight · Coding Performance</p>
  <h1>오픈웨이트 모델이 폐쇄형 프론티어를 코딩 벤치마크에서 처음으로 넘어섰다. GLM-5.2가 그 교차점을 만든다.</h1>
  <p class="zhs-html-lead">2026년 6월 16일, Z.ai(전 Zhipu AI)가 753B 매개변수 오픈웨이트 모델 GLM-5.2를 공개했다. SWE-bench Pro에서 62.1점을 기록하며 GPT-5.5(58.6)를 제쳤고, FrontierSWE에서 Claude Opus 4.8(75.1%)에 1% 차이로 근접했다. 가격은 입력 백만 토큰당 $1.40, 출력 $4.40로 Claude나 GPT-5 대비 약 6분의 1 수준이다. MIT 라이선스로 가중치를 공개해 지역 제한 없이 누구나 다운로드·상업적 사용·파인튜닝할 수 있다. 1백만 토큰 컨텍스트, IndexShare라는 새 희소 어텐션 구조, 그리고 두 단계의 추론 모드(Max / High)를 갖췄다. 이 모델이 던지는 질문은 "오픈웨이트가 언제 폐쇄형을 따라잡는가"가 아니라 "어느 영역에서 이미 앞서나가기 시작했는가"다.</p>
  <blockquote>오픈웨이트가 더 이상 폐쇄 모델의 그림자 속에서 달리지 않는다. 코딩·에이전트 영역에서 처음으로 선두 그룹 안으로 들어왔다.</blockquote>
</section>

<div class="zhs-html-divider" role="presentation"></div>

<section aria-labelledby="takeaways">
  <h2 id="takeaways">핵심 요약</h2>
  <div class="zhs-html-grid">
    <article class="zhs-html-card"><h3><span class="zhs-html-step">1</span>코딩 벤치마크에서 GPT-5.5를 넘어섰다</h3><p>SWE-bench Pro 62.1, FrontierSWE 74.4%, MCP-Atlas 77.0 — 세 영역 모두 GPT-5.5를 상회하며 Claude Opus 4.8에 1% 이내로 근접했다. 오픈웨이트 모델이 폐쇄형 프론티어를 코딩 과제에서 제친 첫 사례다.</p></article>
    <article class="zhs-html-card"><h3><span class="zhs-html-step">2</span>MIT 라이선스, 지역 제한 없음</h3><p>가중치를 Hugging Face에 MIT 라이선스로 공개했다. 상업적 사용, 수정, 파인튜닝, 자체 호스팅이 제한 없이 가능하다. 미국 수출 통제로 접근이 막히는 Claude Fable 5와 정확히 대조되는 지점이다.</p></article>
    <article class="zhs-html-card"><h3><span class="zhs-html-step">3</span>비용은 약 6분의 1, Pareto 최전선</h3><p>API 단가는 입력 $1.40/M, 출력 $4.40/M. Artificial Analysis의 Intelligence vs Cost per Task 차트에서 Pareto 최전선에 위치하며, 동일 지능 수준에서 가장 낮은 비용이다. 과제당 $0.46으로 GPT-5.5 대비 현저히 낮다.</p></article>
    <article class="zhs-html-card"><h3><span class="zhs-html-step">4</span>오픈웨이트가 볼륨 전쟁에서 이미 이겼다</h3><p>OpenRouter 트래픽에서 중국 오픈웨이트 제공자 합산이 45%를 넘었다. 1년 전 2% 미만에서의 상승이다. GLM-5.2는 이 흐름의 최신 결정체이자, 코딩 영역에서 처음으로 폐쇄형을 추월한 오픈웨이트 모델이다.</p></article>
  </div>
</section>

<section aria-labelledby="what-is-glm52">
  <h2 id="what-is-glm52">GLM-5.2는 어떤 모델인가</h2>
  <p>Z.ai는 2026년 들어 GLM 시리즈로 중국 오픈 모델의 한 축을 담당해왔다. GLM-5.1이 코딩 벤치마크에서 Claude Opus 수준에 근접한 성과를 보였다면, GLM-5.2는 한 단계 더 나아가 "장시간 지속되는 과제(long-horizon task)"를 설계 목표로 삼았다. 매개변수 규모는 753B(총 744B, 활성 40B의 MoE 구조)로 GLM-5.1과 동일하지만, 컨텍스트 창을 200K에서 1M으로 확대하고, 추론·코딩 능력을 폭넓게 끌어올렸다.</p>
  <p>이 모델의 기술적 핵심은 IndexShare라는 구조적 혁신이다. 대규모 언어 모델에서 긴 문서의 어텐션을 다시 계산하는 비용은 기하급수적으로 늘어난다. IndexShare는 4개의 희소 어텐션 계층마다 동일한 인덱서를 재사용해, 1M 컨텍스트에서 토큰당 연산량을 2.9배 줄인다. 여기에 Multi-Token Prediction(MTP) 계층을 개선해 추론 시 수용 토큰 길이를 최대 20% 늘렸다. 사용자는 "Max"와 "High" 두 추론 모드를 전환하며 성능과 지연 시간 사이에서 균형을 선택할 수 있다.</p>
  <div class="zhs-html-callout"><p>IndexShare의 의미는 단순한 속도 향상이 아니다. 1M 컨텍스트를 "선언"하는 것과 "안정적으로 유지"하는 것은 다른 차원의 문제다. Z.ai는 코딩 에이전트 시나리오에 맞춘 대규모 1M 컨텍스트 훈련을 수행했다고 밝히며, 이것이 장시간 과제에서 품질이 떨어지지 않는 배경이라고 설명한다.</p></div>
</section>

<section aria-labelledby="benchmarks">
  <h2 id="benchmarks">벤치마크가 말하는 것: 어디서 이기고, 어디서 지는가</h2>
  <p>독립 평가 기관 Artificial Analysis의 Intelligence Index v4.1에서 GLM-5.2는 51점으로 오픈웨이트 1위를 기록했다. 같은 지표에서 MiniMax-M3는 44점, DeepSeek V4 Pro(max) 44점, Kimi K2.6 43점이다. 폐쇄형 상위 모델과의 격차도 좁혔다. GDPval-AA v2(실제 에이전트 성능 측정)에서 1524점으로 GPT-5.5(xhigh, 1514)와 사실상 동급이 됐다.</p>
  <p>코딩·에이전트 영역에서 GLM-5.2의 성과는 구체적이다. SWE-bench Pro 62.1은 GPT-5.5(58.6)와 GLM-5.1(58.4)을 모두 넘어선다. FrontierSWE(Dominance) 74.4%는 GPT-5.5(72.6%)를 상회하며 Claude Opus 4.8(75.1%)에 0.7% 차이로 뒤진다. MCP-Atlas(도구 사용 평가) 77.0은 GPT-5.5(75.3)를 앞지르고 Claude Opus 4.8(77.8)에 0.8점 뒤진다. Humanity's Last Exam(도구 사용) 54.7 역시 GPT-5.5(52.2)를 넘는다. 장시간 엔지니어링 과제인 PostTrainBench에서는 GPT-5.5(25.0%) 대비 34.3%로 큰 격차를 보인다.</p>
  <p>그러나 GLM-5.2가 모든 영역에서 앞서는 것은 아니다. Terminal-Bench 2.1에서 81.0점으로 Claude Opus 4.8(85.0)과 GPT-5.5(84.0)에 뒤지며, Gemini 3.1 Pro(74.0)를 앞서는 데 그친다. SWE-Marathon(초장시간 소프트웨어 엔지니어링)에서도 Opus 4.8에 13% 뒤진다. 추론 영역 전반에서는 폐쇄형 상위 모델이 여전히 3~8포인트 앞서는 구조가 유지된다. GLM-5.2의 성과는 "모든 과제에서 1등"이 아니라 "코딩·에이전트에서 처음으로 교차한 오픈웨이트"라는 점에서 의미가 있다.</p>
  <div class="zhs-html-step">
    <h3>GLM-5.1 → GLM-5.2 주요 개선</h3>
    <ol>
      <li>Terminal-Bench 2.1: 63.5 → 81.0 (+17.5)</li>
      <li>Intelligence Index: 40 → 51 (+11)</li>
      <li>HLE(도구 사용): +12포인트 → 40%</li>
      <li>CritPt(과학 추론): +16포인트 → 21%</li>
      <li>컨텍스트 창: 200K → 1M (5배 확대)</li>
    </ol>
  </div>
</section>

<section aria-labelledby="pricing">
  <h2 id="pricing">가격 구조: 6분의 1의 의미</h2>
  <p>GLM-5.2의 API 단가는 입력 백만 토큰당 $1.40, 출력 $4.40, 캐시 적중 $0.26이다. Claude Opus 4.8이나 GPT-5.5와 비교하면 대략 6분의 1 수준이다. Z.ai는 별도로 GLM Coding Plan이라는 구독 제품을 운영하며, Lite 약 $3, Pro 약 $15, Max 약 $80의 월정액으로 코딩 환경에서 사용할 수 있도록 했다. 20개 이상의 서드파티 코딩 환경과 통합됐고, DeepInfra·Novita·Nebius·Fireworks 등 9개 이상의 추론 제공자에서 선택 가능하다.</p>
  <p>비용의 의미는 단순한 "저렴함"이 아니다. Artificial Analysis의 Intelligence vs Cost per Task 차트에서 GLM-5.2는 Pareto 최전선에 위치한다. 동일한 지능 수준에서 과제당 비용이 가장 낮다는 뜻이다. 과제당 $0.46은 MiniMax-M3($0.18)나 DeepSeek V4 Pro($0.05)보다 높지만, 이 두 모델은 Intelligence Index에서 각각 44점으로 GLM-5.2(51)보다 7점 낮다. 같은 성능급에서 비교하면 GLM-5.2가 가장 효율적이다.</p>
  <p>다만 주의할 점이 있다. GLM-5.2는 과제당 평균 43K 출력 토큰을 소비한다. 이는 GLM-5.1(26K) 대비 65% 증가이고, MiniMax-M3(24K)의 거의 두 배다. 추론 과정에서 더 많은 토큰을 생성하는 경향이 있어, 실제 청구 비용은 벤치마크 수치 이상으로 늘어날 수 있다. "저렴한 단가"와 "낮은 총비용"은 같은 말이 아니다.</p>
</section>

<section aria-labelledby="open-weight-rise">
  <h2 id="open-weight-rise">오픈웨이트가 프론티어에 도달한 경로</h2>
  <p>GLM-5.2는 단일 이벤트가 아니라, 2026년 상반기 오픈웨이트 모델이 만든 궤적의 한 점이다. Digital Applied의 Q2 2026 분석에 따르면, OpenRouter 트래픽에서 중국 오픈웨이트 제공자 합산 점유율이 45%를 넘었다. 1년 전 2% 미만이었다. Xiaomi의 MiMo V2 Pro만 단독 21%로 OpenAI(7.5%)의 3배 규모다. "폐쇄형만이 진지한 프로덕션 옵션"이라는 전제가 이미 깨진 상태다.</p>
  <p>이 약진의 배경은 세 가지로 정리된다. 첫째, 미국의 칩·장비 통제로 인해 중국 모델은 "가능한 한 효율적으로" 학습·추론해야 하는 압력을 받았다. IndexShare, Lightning Attention, DeepSeek의 추론 효율화 같은 구조적 혁신이 이 압력의 산물이다. 둘째, 중국 AI 회사들은 글로벌 개발자 도달을 성장 동력으로 본다. 가중치를 공개하면 전 세계 개발자가 자사 생태계로 들어온다. 셋째, MiniMax·Qwen·DeepSeek·Z.ai·Moonshot이 각기 다른 강점으로 생태계를 다변화하며, 한 달 사이에 5개의 프론티어급 오픈웨이트가 출시되는 밀도를 만들었다. Yann LeCun이 메타를 떠나 독자적 세계 모델 연구에 나서며 지속적으로 옹호해온 "개방형 AI 접근"이 이론에서 현실로 전환되는 지점이기도 하다.</p>
  <p>흥미로운 것은 영역별 격차의 구조다. 코딩 격차는 사실상 닫혔다. 추론(GPQA Diamond, HLE, 수학)에서는 폐쇄형이 여전히 3~8포인트 앞선다. 멀티모달(비디오·오디오·이미지 통합)은 GPT-5.4와 Gemini 3.1 Pro가 주도하며, 오픈웨이트의 추격이 한 단계 뒤에 있다. 즉 "오픈웨이트 = 따라잡기"라는 프레임은 영역에 따라 이미 성립하지 않는다. 코딩에서는 교차했고, 추론에서는 근접했으며, 멀티모달에서는 여전히 뒤에 있다.</p>
  <div class="zhs-html-callout"><p>GLM-5.2와 이전 포스트에서 다룬 MiniMax M3의 관계는 상호 보완적이다. CodingFleet의 비교에 따르면, GLM-5.2는 SWE-bench Pro(+3.1), Terminal-Bench 2.1(+15.0), MCP-Atlas(+2.8)에서 M3를 앞선다. 반면 M3는 3.7배 저렴하고, 비디오·이미지·데스크톱 인식을 포함한 멀티모달 능력과 BrowseComp(83.5%) 1위를 갖는다. "텍스트 전문 파워하우스 vs 만능 칼"이라는 구도다. 운영자 입장에서 둘 중 하나를 고르는 것이 아니라, 과제 유형에 따라 라우팅하는 것이 현실적인 전략이다.</p></div>
</section>

<section aria-labelledby="caveat">
  <h2 id="caveat">반대편 시선: 벤치마크 너머의 한계</h2>
  <p>GLM-5.2의 성과가 분명한 만큼, 한계도 분명히 짚어야 한다. 첫째, Z.ai는 출시 시점에 공식 벤치마크 테이블을 동반하지 않았다. BuildFastWithAI의 리뷰는 "5배 컨텍스트 확장이라는 헤드라인과 함께 벤치마크 표가 하나도 없는 출시는 마케팅 우선의 움직임"이라고 지적한다. 벤치마크 수치는 대부분 서드파티(Aritificial Analysis, Proximal)가 독립적으로 측정한 결과로, 출시사 자체의 검증 데이터는 제한적이다.</p>
  <p>둘째, 1M 컨텍스트의 "사용 가능성"에 대한 독립 검증이 아직 부족하다. AIMadeTools의 분석은 "현재 GLM-5.2의 전체 1M 윈도우에서 실제 검색 품질을 확인하는 서드파티 테스트가 존재하지 않는다"며, 특히 500K 토큰 이상에서는 "사용 가능하다"는 주장을 건강한 회의로 받아들여야 한다고 경고한다.</p>
  <p>셋째, 실제 빌드 테스트에서 엇갈린 결과가 나온다. 한 개발자가 GLM-5.2로 공포 게임, 3D 스텔스 게임, 마케팅 비디오 세 가지를 빌드해본 결과, 게임 로직이 깨지고("열쇠 세 개를 다 모았는데 문이 열리지 않는다") 예상보다 낮은 완성도를 보였다고 보고했다. 벤치마크 점수와 실제 산출물의 품질 사이에는 여전히 간극이 있다. Artificial Analysis도 GLM-5.2가 과제당 43K 토큰을 소비하며, Intelligence vs Output Tokens 차트에서 가장 매력적인 사분면에 있지 않다고 지적한다. 더 많이 "생각"할수록 더 비싸지는 구조다.</p>
</section>

<section aria-labelledby="for-individual">
  <h2 id="for-individual">개인 사용자가 지금 확인해야 할 것</h2>
  <p>GLM-5.2가 강력하지만, 모든 사용자에게 정답이 되지는 않는다. 다음 여섯 기준으로 자신의 작업을 평가하고 모델 스택을 점검할 시점이다.</p>
  <ol>
    <li><strong>작업 유형</strong>: 코딩 에이전트, 장시간 리팩터링, 다중 파일 수정이 주 작업이라면 GLM-5.2는 현재 오픈웨이트 중 가장 강력한 선택지다. 번역·요약·일상 대화라면 더 가볍고 빠른 모델로 충분하다.</li>
    <li><strong>컨텍스트 요구</strong>: 100K 이상의 프로젝트 단위 컨텍스트를 다뤄야 한다면 1M 창이 의미가 있다. 다만 500K 이상에서의 안정성은 아직 독립 검증이 부족하므로, 실제 작업에서 검증하면서 도입하는 편이 안전하다.</li>
    <li><strong>비용 구조</strong>: 토큰 단가가 저렴해도 43K 출력 토큰을 소비하면 총비용이 예상보다 커진다. 월 사용량을 추적하며 과제당 실제 비용을 측정해야 한다.</li>
    <li><strong>멀티모달 필요</strong>: 비디오, 이미지, 데스크톱 인식이 필요하다면 GLM-5.2는 텍스트 전용이다. MiniMax M3나 Qwen 3.5-Omni 같은 멀티모달 오픈웨이트를 병행해야 한다.</li>
    <li><strong>데이터 주권</strong>: MIT 라이선스로 자체 호스팅이 가능하지만, 753B 매개변수를 BF16으로 올리려면 약 1.5TB의 GPU 메모리가 필요하다. 현실적인 최소 구성은 H100 80GB 8대(640GB)에 양자화를 얹는 것이다. 자체 호스팅이 아니라면 API 라우팅 경로와 데이터 저장 리전을 확인해야 한다.</li>
    <li><strong>접근권 리스크</strong>: 미국 수출 통제로 Claude Fable 5가 외국인 접근 차단된 사례에서 보듯, 폐쇄형 모델은 정책 변화로 언제든 닫힐 수 있다. GLM-5.2의 MIT 라이선스는 이 리스크에 대한 구조적 완충이 된다. 다만 중국 모델 자체의 라이선스(DeepSeek, Qwen 등은 개별 라이선스)는 제각각이므로, "오픈웨이트 = 동일 조건"으로 가정하면 안 된다.</li>
  </ol>
</section>

<section aria-labelledby="faq">
  <h2 id="faq">자주 묻는 질문</h2>
  <h3>GLM-5.2는 GPT-5.5보다 뛰어난가?</h3>
  <p>과제별로 다르다. SWE-bench Pro, FrontierSWE, MCP-Atlas, HLE(도구 사용), PostTrainBench에서 GPT-5.5를 넘어선다. 반면 Terminal-Bench 2.1, SWE-Marathon, 그리고 추론 전반에서는 GPT-5.5가 앞선다. 코딩·에이전트 영역에서 처음으로 교차한 오픈웨이트라는 점이 핵심이지, 전면적 우위가 아니다.</p>
  <h3>1M 컨텍스트를 실제로 쓸 만한가?</h3>
  <p>Z.ai는 코딩 에이전트 시나리오에 맞춘 대규모 1M 컨텍스트 훈련을 수행했다고 밝혔다. 다만 출시 시점에 전체 1M 윈도우의 검색 품질을 확인하는 독립 테스트가 부족하다. 500K 이상에서는 건강한 회의를 유지하며 실제 작업으로 검증하는 편이 안전하다.</p>
  <h3>GLM-5.2와 MiniMax M3 중 어떤 것을 써야 하나?</h3>
  <p>코딩·에이전트가 주 작업이면 GLM-5.2가 성능에서 앞선다. 비용 민감도가 높거나 멀티모달(비디오·이미지·데스크톱)이 필요하면 M3가 유리하다. 둘 중 하나를 고르기보다 과제 유형에 따라 라우팅하는 것이 현실적이다.</p>
  <h3>자체 호스팅이 가능한가?</h3>
  <p>MIT 라이선스로 가능하다. 다만 753B 매개변수를 BF16으로 실행하려면 약 1.5TB GPU 메모리가 필요하다. H100 80GB 8대에 양자화를 얹는 것이 현실적 최소 구성이며, 그 아래에서는 품질 손실 없이 실행하기 어렵다.</p>
</section>

<section aria-labelledby="conclusion">
  <h2 id="conclusion">결론: 누가 벽을 쌓고, 누가 문을 여는가</h2>
  <p>GLM-5.2가 보여주는 것은 단일 모델의 성능 수치가 아니다. 오픈웨이트가 코딩 벤치마크에서 처음으로 폐쇄형 프론티어를 넘어섰다는 구조적 전환점이다. 미국이 모델 접근권까지 통제하는 방향으로 움직일수록, MIT 라이선스로 "기술적 접근에 국경이 없다"고 선언하는 모델의 가치는 커진다. 두 흐름은 서로를 강화한다. 통제가 강해질수록 개방이 전략이 되고, 개방이 강해질수록 통제의 의미가 재정의된다.</p>
  <p>개인 사용자가 주목해야 할 것은 "어떤 모델이 1등이냐"가 아니라, 자신의 작업·데이터·비용 구조에 맞춰 모델 스택을 설계하는 것이다. GLM-5.2가 코딩 에이전트에서 강하다면, 멀티모달은 M3로, 추론은 폐쇄형으로 라우팅하는 형태다. 한 모델이 사라져도 작업이 이어지도록, 비용 구조가 흔들려도 대체 경로가 있는 설계가 결정이다. 오픈웨이트가 프론티어를 주도하기 시작한 시점에서, 사용자의 경쟁력은 단일 모델 선택이 아니라 라우팅 설계에서 나온다.</p>
</section>
