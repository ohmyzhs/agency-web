---
type: blog-draft
status: published
authoring_harness: zhs-editorial-blog-builder
format: html
created: 2026-06-19
updated: 2026-06-19
title: "GLM-5.2: The Moment Open-Weights Overtook the Frontier in Coding — at One-Sixth the Cost"
slug: glm-5-2-open-weight-frontier-coding-en
kind: news-explainer
category: ai-insight
locale: en
publishedAt: 2026-06-19
sortAt: 2026-06-19T11:00:00+09:00
readingMinutes: 12
description: "GLM-5.2 beats GPT-5.5 on SWE-bench Pro, approaches Claude Opus 4.8 within 1%, and ships under MIT license with 1M context — at roughly one-sixth the cost of closed-weight frontier models."
keyword_primary: GLM-5.2
thumbnail: /infographics/glm-5-2-open-weight-frontier-coding/glm-5-2-open-weight-frontier-coding-en.jpg
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
  <h1>For the first time, an open-weight model has overtaken closed-source frontier models on coding benchmarks. GLM-5.2 marks the crossover.</h1>
  <p class="zhs-html-lead">On June 16, 2026, Z.ai (formerly Zhipu AI) released GLM-5.2, a 753-billion-parameter open-weights model. It scored 62.1 on SWE-bench Pro — beating GPT-5.5 (58.6) — and reached 74.4% on FrontierSWE, within one percent of Claude Opus 4.8 (75.1%). Priced at $1.40/M input and $4.40/M output, it costs roughly one-sixth of Claude or GPT-5. The weights ship under an unrestricted MIT license: no regional limits, no commercial-use caps. A stable 1M-token context window, a new IndexShare sparse-attention architecture, and two selectable reasoning modes (Max and High) complete the package. The question is no longer when open-weights will catch up — but which domains they have begun to lead.</p>
  <blockquote>Open-weights no longer run in the shadow of closed models. In coding and agentic tasks, they have entered the lead group for the first time.</blockquote>
</section>

<div class="zhs-html-divider" role="presentation"></div>

<section aria-labelledby="takeaways">
  <h2 id="takeaways">Key Takeaways</h2>
  <div class="zhs-html-grid">
    <article class="zhs-html-card"><h3><span class="zhs-html-step">1</span>Beats GPT-5.5 on coding benchmarks</h3><p>SWE-bench Pro 62.1, FrontierSWE 74.4%, MCP-Atlas 77.0 — all three surpass GPT-5.5 and come within one percent of Claude Opus 4.8. This is the first open-weight model to cross the closed-source frontier in coding tasks.</p></article>
    <article class="zhs-html-card"><h3><span class="zhs-html-step">2</span>MIT license, no geographic restrictions</h3><p>Weights are published on Hugging Face under MIT license. Commercial use, modification, fine-tuning, and self-hosting are unrestricted. This stands in direct contrast to the US export controls that blocked foreign access to Anthropic's Claude Fable 5.</p></article>
    <article class="zhs-html-card"><h3><span class="zhs-html-step">3</span>One-sixth the cost, Pareto frontier</h3><p>API pricing: $1.40/M input, $4.40/M output. On Artificial Analysis's Intelligence vs Cost per Task chart, GLM-5.2 sits on the Pareto frontier — the lowest cost per task at its intelligence level. At $0.46 per task, it significantly undercuts GPT-5.5.</p></article>
    <article class="zhs-html-card"><h3><span class="zhs-html-step">4</span>Open-weights already won the volume war</h3><p>Chinese open-weight providers now account for over 45% of OpenRouter traffic — up from under 2% a year ago. GLM-5.2 is the latest product of this trajectory and the first to overtake closed models in coding.</p></article>
  </div>
</section>

<figure style="margin: 0 0 2.5rem 0;">
  <img src="/infographics/glm-5-2-open-weight-frontier-coding/glm-5-2-open-weight-frontier-coding-en.jpg" alt="GLM-5.2 Benchmark Crossover: bar chart comparing 5 coding benchmarks across GLM-5.2, GPT-5.5, and Claude Opus 4.8" style="width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);" />
</figure>

<section aria-labelledby="what-is-glm52">
  <h2 id="what-is-glm52">What Is GLM-5.2?</h2>
  <p>Z.ai has been building the GLM series as one of the pillars of China's open-model ecosystem throughout 2026. GLM-5.1 approached Claude Opus-level performance on coding benchmarks; GLM-5.2 takes a step further by making "long-horizon tasks" — work that spans hours, not minutes — its core design target. The parameter count is 753B (744B total, 40B active in a mixture-of-experts design), identical to GLM-5.1, but the context window has expanded from 200K to 1M tokens, and reasoning and coding capabilities have improved broadly.</p>
  <p>The technical centerpiece is an architectural innovation called IndexShare. In large language models, recomputing attention across long documents is computationally exorbitant. IndexShare reuses the same indexer across every four sparse attention layers, cutting per-token compute FLOPs by 2.9× at 1M context. An upgraded Multi-Token Prediction (MTP) layer boosts accepted token length by up to 20% during inference. Users toggle between two reasoning modes — "Max" for maximum problem-solving, "High" for a performance-latency balance.</p>
  <div class="zhs-html-callout"><p>IndexShare is not just a speed optimization. Claiming a 1M context window and maintaining quality under real engineering pressure are different problems. Z.ai reports conducting large-scale 1M-context training specifically for coding-agent scenarios — large-scale implementation, automated research, performance optimization, and complex debugging — which is what makes the long-context system stable rather than merely wide.</p></div>

<figure style="margin: 0 0 2.5rem 0;">
  <img src="/infographics/glm-5-2-open-weight-frontier-coding/card-news/04-indexshare-context.jpg" alt="1M context window and IndexShare 2.9× efficiency improvement hand-drawn card" style="width: 100%; max-width: 600px; height: auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin: 0 auto; display: block;" />
</figure>
</section>

<section aria-labelledby="benchmarks">
  <h2 id="benchmarks">What the Benchmarks Say: Where It Wins, Where It Loses</h2>
  <p>On Artificial Analysis's Intelligence Index v4.1, GLM-5.2 scores 51 — the highest among open-weight models. On the same metric, MiniMax-M3 scores 44, DeepSeek V4 Pro (max) 44, and Kimi K2.6 43. The gap to closed-source leaders has narrowed considerably. On GDPval-AA v2, a measure of real-world agentic performance, GLM-5.2 scores 1524 — effectively level with GPT-5.5 (xhigh reasoning, 1514) and ahead of MiniMax-M3 (1418) and DeepSeek V4 Pro (1328).</p>
  <p>The coding and agentic results are concrete. SWE-bench Pro: 62.1, surpassing both GPT-5.5 (58.6) and GLM-5.1 (58.4). FrontierSWE (Dominance): 74.4%, beating GPT-5.5 (72.6%) and trailing Claude Opus 4.8 (75.1%) by 0.7 points. MCP-Atlas (tool usage): 77.0, ahead of GPT-5.5 (75.3) and just 0.8 points behind Claude Opus 4.8 (77.8). Humanity's Last Exam (with tools): 54.7, again beating GPT-5.5 (52.2). On PostTrainBench — an extended engineering workload — GLM-5.2 scores 34.3% versus GPT-5.5's 25.0%.</p>

<figure style="margin: 0 0 2.5rem 0;">
  <img src="/infographics/glm-5-2-open-weight-frontier-coding/card-news/01-swe-bench-crossover.jpg" alt="SWE-bench Pro where GLM-5.2 62.1 overtakes GPT-5.5 58.6 — hand-drawn bar chart crossover card" style="width: 100%; max-width: 600px; height: auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin: 0 auto; display: block;" />
</figure>
  <p>However, GLM-5.2 does not lead across the board. On Terminal-Bench 2.1, it scores 81.0, trailing Claude Opus 4.8 (85.0) and GPT-5.5 (84.0), though ahead of Gemini 3.1 Pro (74.0). On SWE-Marathon, an ultra-long-horizon software engineering benchmark, it trails Opus 4.8 by 13%. In reasoning broadly, closed-source models retain a 3-to-8-point lead. GLM-5.2's significance is not "first place everywhere" but "the first open-weight to cross over in coding and agentic tasks."</p>
  <div class="zhs-html-step">
    <h3>GLM-5.1 → GLM-5.2 Key Improvements</h3>
    <ol>
      <li>Terminal-Bench 2.1: 63.5 → 81.0 (+17.5)</li>
      <li>Intelligence Index: 40 → 51 (+11)</li>
      <li>HLE (with tools): +12 points → 40%</li>
      <li>CritPt (scientific reasoning): +16 points → 21%</li>
      <li>Context window: 200K → 1M (5× expansion)</li>
    </ol>
  </div>
</section>

<section aria-labelledby="pricing">
  <h2 id="pricing">Pricing: What One-Sixth Actually Means</h2>
  <p>GLM-5.2's API is priced at $1.40/M input, $4.40/M output, $0.26/M cache-hit — roughly one-sixth of Claude Opus 4.8 or GPT-5.5. Z.ai also offers a GLM Coding Plan subscription (Lite ~$3, Pro ~$15, Max ~$80/month) integrated with 20+ coding environments. Nine or more inference providers — DeepInfra, Novita, Nebius, Fireworks — host the model.</p>
  <p>The cost story is not simply "cheaper." On Artificial Analysis's Intelligence vs Cost per Task chart, GLM-5.2 sits on the Pareto frontier — the lowest cost per task among models at its intelligence level. At $0.46 per task, it is more expensive than MiniMax-M3 ($0.18) or DeepSeek V4 Pro ($0.05), but those two models score 44 on the Intelligence Index — seven points lower than GLM-5.2's 51. Compared within the same performance tier, GLM-5.2 is the most efficient.</p>
  <p>One caveat deserves attention. GLM-5.2 consumes an average of 43K output tokens per task — a 65% increase from GLM-5.1 (26K) and nearly double MiniMax-M3 (24K). The model tends to generate more tokens during reasoning, which means actual billing can exceed what benchmark numbers suggest. "Low per-token price" and "low total cost" are not the same statement.</p>

<figure style="margin: 0 0 2.5rem 0;">
  <img src="/infographics/glm-5-2-open-weight-frontier-coding/card-news/03-cost-comparison.jpg" alt="1/6 cost comparison: GLM-5.2 $1.40 vs GPT-5.5 $8.40 on a hand-drawn balance scale" style="width: 100%; max-width: 600px; height: auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin: 0 auto; display: block;" />
</figure>
</section>

<section aria-labelledby="open-weight-rise">
  <h2 id="open-weight-rise">How Open-Weights Reached the Frontier</h2>
  <p>GLM-5.2 is not a singular event but a point on the trajectory that open-weight models have traced through the first half of 2026. According to Digital Applied's Q2 2026 analysis, Chinese open-weight providers collectively account for over 45% of OpenRouter traffic — up from under 2% a year ago. Xiaomi's MiMo V2 Pro alone holds 21% — roughly three times OpenAI's 7.5%. The assumption that "only closed-source is serious for production" has already broken.</p>
  <p>Three factors explain the surge. First, US chip and equipment export controls forced Chinese developers to train and infer as efficiently as possible — IndexShare, Lightning Attention, and DeepSeek's inference optimizations are products of that pressure. Second, Chinese AI companies view global developer reach as their growth engine; releasing weights pulls developers worldwide into their ecosystem. Third, MiniMax, Qwen, DeepSeek, Z.ai, and Moonshot each brought different strengths to a diversifying ecosystem — five frontier-class open-weights shipped in a single 30-day window. It is also the moment when Yann LeCun's long-standing advocacy for open AI research — he left Meta to pursue independent world-model work — transitions from theory to measurable reality.</p>
  <p>The gap structure varies by domain. In coding, the gap has effectively closed. In reasoning (GPQA Diamond, HLE, frontier math), closed-source models still lead by 3–8 points. In multimodal workloads (video, audio, image integration), GPT-5.4 and Gemini 3.1 Pro dominate, with open-weight trailing a step behind. "Open-weight equals catching up" is no longer a universal frame. In coding, the lines have crossed; in reasoning, they are close; in multimodal, the gap persists.</p>
  <div class="zhs-html-callout"><p>The relationship between GLM-5.2 and MiniMax M3 — covered in our earlier analysis — is complementary rather than competitive. Per CodingFleet's comparison, GLM-5.2 leads on SWE-bench Pro (+3.1), Terminal-Bench 2.1 (+15.0), and MCP-Atlas (+2.8). M3, meanwhile, is 3.7× cheaper, offers multimodal capabilities (video, image, desktop recognition), and leads BrowseComp (83.5%). It is a text powerhouse versus a Swiss Army knife. For operators, the realistic strategy is not picking one but routing by task type.</p></div>

<figure style="margin: 0 0 2.5rem 0;">
  <img src="/infographics/glm-5-2-open-weight-frontier-coding/card-news/02-mit-license.jpg" alt="MIT license open treasure chest: commercial use, modification, download unrestricted — hand-drawn card" style="width: 100%; max-width: 600px; height: auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin: 0 auto; display: block;" />
</figure>
</section>

<section aria-labelledby="caveat">
  <h2 id="caveat">The Other Side: Limitations Beyond the Benchmarks</h2>
  <p>GLM-5.2's achievements are clear, and so are its limitations. First, Z.ai shipped the model without publishing official benchmark tables alongside the release. BuildFastWithAI's review called this "a marketing-first move" — a 5× context expansion announced with zero accompanying benchmark data. Most performance numbers come from third-party measurements (Artificial Analysis, Proximal), not the release company's own validation.</p>
  <p>Second, independent verification of the 1M context window's retrieval quality is still lacking. AIMadeTools notes that "no third-party testing exists confirming GLM-5.2's actual retrieval quality across the full 1M window" and advises treating the "usable" claim — especially above 500K tokens — with healthy skepticism.</p>
  <p>Third, real-world build tests show mixed results. One developer built three projects with GLM-5.2 — a horror game, a 3D stealth game, and a marketing video — and reported broken game logic ("collected all three keys, door still won't open") and lower-than-expected completion quality. The gap between benchmark scores and actual output quality remains. Artificial Analysis also notes that GLM-5.2's 43K output tokens per task place it off the most attractive quadrant on the Intelligence vs Output Tokens chart — the more it "thinks," the more it costs.</p>
</section>

<section aria-labelledby="for-individual">
  <h2 id="for-individual">What Individual Users Should Check Now</h2>
  <p>GLM-5.2 is powerful, but not the answer for every user. Six criteria for evaluating it against your workflow:</p>
  <ol>
    <li><strong>Task type</strong>: For coding agents, long-horizon refactoring, or multi-file work, GLM-5.2 is the strongest open-weight. For translation, summarization, or casual use, a lighter model suffices.</li>
    <li><strong>Context requirements</strong>: A 1M window matters for project-scale contexts above 100K. Stability above 500K is not yet independently verified — introduce gradually.</li>
    <li><strong>Cost structure</strong>: Low per-token pricing still produces higher totals when 43K output tokens are consumed per task. Track actual cost per task.</li>
    <li><strong>Multimodal needs</strong>: GLM-5.2 is text-only. Pair with MiniMax M3 or Qwen 3.5-Omni for video, image, or desktop recognition.</li>
    <li><strong>Data sovereignty</strong>: MIT license enables self-hosting, but 753B in BF16 requires ~1.5TB GPU memory. Practical minimum: eight H100 80GB with quantization. Otherwise, verify API routing and data region.</li>
    <li><strong>Access risk</strong>: Closed models can be shut off by policy anytime. GLM-5.2's MIT license is a structural buffer. But licenses vary across Chinese models — do not assume identical terms.</li>
  </ol>
</section>

<section aria-labelledby="faq">
  <h2 id="faq">FAQ</h2>
  <h3>Is GLM-5.2 better than GPT-5.5?</h3>
  <p>It depends on the task. GLM-5.2 surpasses GPT-5.5 on SWE-bench Pro, FrontierSWE, MCP-Atlas, HLE (with tools), and PostTrainBench. GPT-5.5 leads on Terminal-Bench 2.1, SWE-Marathon, and reasoning broadly. The key point is not universal superiority but that an open-weight model has crossed over in coding and agentic tasks for the first time.</p>
  <h3>Is the 1M context window actually usable?</h3>
  <p>Z.ai reports conducting large-scale 1M-context training for coding-agent scenarios. However, no independent testing has yet confirmed retrieval quality across the full 1M window. Treat the "usable" claim — especially above 500K tokens — with healthy skepticism and validate it in your own tasks.</p>
  <h3>GLM-5.2 or MiniMax M3 — which should I use?</h3>
  <p>If your primary work is coding and agentic tasks, GLM-5.2 leads in performance. If cost sensitivity is high or you need multimodal capabilities (video, image, desktop), M3 is more advantageous. Rather than picking one, routing by task type is the practical approach.</p>
  <h3>Can I self-host GLM-5.2?</h3>
  <p>Yes, under the MIT license. However, running 753B parameters in BF16 requires approximately 1.5TB of GPU memory. A practical minimum is eight H100 80GB GPUs with quantization. Below that, running at acceptable quality is difficult.</p>
</section>

<section aria-labelledby="conclusion">
  <h2 id="conclusion">Conclusion: Who Builds Walls, Who Opens Doors</h2>
  <p>What GLM-5.2 demonstrates is not a single model's benchmark numbers — it is a structural turning point. Open-weights have overtaken closed-source frontier models in coding for the first time. The more the United States moves toward controlling model access, the more valuable a model that declares "no borders on technical access" under MIT license becomes. The two trends reinforce each other: as control tightens, openness becomes strategy.</p>
  <p>What individual users should focus on is not "which model is number one" but designing a model stack that fits their work, data, and cost structure. Route coding to GLM-5.2, multimodal to M3, reasoning to closed models. The decision is building a routing architecture where one model's disappearance does not break the workflow. Open-weights have begun leading the frontier — the user's advantage now comes from routing design, not single-model selection.</p>
</section>
