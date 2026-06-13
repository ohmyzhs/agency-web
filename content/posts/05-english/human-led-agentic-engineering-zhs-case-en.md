---
type: blog-draft
status: published
authoring_harness: zhs-editorial-blog-builder
format: html
created: 2026-06-12
updated: 2026-06-12
title: AI Will Not Replace Engineers: What Our AI-Built Site Reveals About Human-Led Agentic Engineering
slug: human-led-agentic-engineering-zhs-case-en
kind: retrospective
category: ai-insight
locale: en
publishedAt: 2026-06-12
sortAt: 2026-06-12T09:40:00+09:00
readingMinutes: 24
description: AI does not simply replace software engineers. Zero Human Studio’s AI-built site shows how execution can be automated while product direction, verification, and responsibility remain human-led.
keyword_primary: human-led agentic engineering
tags:
  - ai-agents
  - software-engineering
  - agentic-engineering
  - product-building
  - zero-human-studio
  - developer-productivity
related_tools:
  - developer-text-toolkit
  - json-yaml-validator
  - webhook-payload-formatter
sourceLinks:
  - label: GeekNews - Why AI has not replaced software engineers
    url: https://news.hada.io/topic?id=30421
  - label: Federal Reserve - AI and Coder Employment: Compiling the Evidence
    url: https://www.federalreserve.gov/econres/feds/ai-and-coder-employment-compiling-the-evidence.htm
  - label: GitHub Blog - Quantifying GitHub Copilot’s impact
    url: https://github.blog/ai-and-ml/generative-ai/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/
  - label: METR - Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity
    url: https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/
quality_gate: reviewed
share_url:
telegram_handoff: false
---
<section class="zhs-html-hero" aria-labelledby="agentic-engineering-summary">
  <p class="zhs-html-eyebrow">Agentic Engineering · Human Direction · Product Operations</p>
  <h2 id="agentic-engineering-summary">AI does not fail to replace engineers because it cannot write code. It fails because deciding what to build and accepting responsibility for what ships are still human work.</h2>
  <p class="zhs-html-lead">Zero Human Studio and oh-my-zhs.com are close to an AI-built and AI-operated web service. AI agents write posts, edit code, adjust UI, run builds, inspect errors, and help structure content. But the direction is still led by a human engineer. A person decides what should be built, what quality is acceptable, what should not be published, and when a change is safe enough to ship. That experience reveals a more accurate story than “AI replaces engineers.” AI compresses the execution layer, but the decision and delivery layers become more important.</p>
  <blockquote>In the AI era, engineers may write less code by hand. They cannot take less responsibility for the product.</blockquote>
</section>

<div class="zhs-html-divider" role="presentation"></div>

<section aria-labelledby="core-thesis">
  <h2 id="core-thesis">The core thesis: software work is being rearranged, not erased</h2>
  <p>The article discussed on GeekNews frames software development as a <strong>decide—execute—deliver sandwich</strong>. That model matches our own experience operating an AI-built site. AI is strongest in the execution layer: drafting code, editing components, generating article structures, interpreting build logs, and applying repetitive changes. But the layers above and below execution remain stubbornly human.</p>
  <p>The decision layer asks what should be built, what should be postponed, what user problem matters most, and what belongs on the site at all. The delivery layer asks whether the result actually works, whether the public copy is responsible, whether the route renders, whether the build passes, and whether the change can be maintained. AI can help with both layers, but it does not remove accountability from them.</p>
  <div class="zhs-html-grid">
    <article class="zhs-html-card"><h3><span class="zhs-html-step">1</span>Decide</h3><p>Define the product direction, user problem, scope, and tradeoffs. AI can advise, but responsible prioritization remains human.</p></article>
    <article class="zhs-html-card"><h3><span class="zhs-html-step">2</span>Execute</h3><p>Generate code, drafts, refactors, markup, tests, and repeated edits. This is the layer agents compress most aggressively.</p></article>
    <article class="zhs-html-card"><h3><span class="zhs-html-step">3</span>Deliver</h3><p>Verify that the result is safe, useful, maintainable, and publishable. This layer becomes more important as execution accelerates.</p></article>
  </div>
</section>

<section aria-labelledby="zhs-case">
  <h2 id="zhs-case">Our case: AI builds the site, but a human operates the product</h2>
  <p>The way oh-my-zhs.com is operated goes beyond ordinary autocomplete. Agents create files, write long posts, modify components, run lint and builds, and verify generated routes. Recent work included a floating category quick menu for the posts page, a mobile quick-menu interaction, stronger explanatory text for tool pages, and fallback content for pages where JavaScript rendering may lag. These tasks would have taken longer if every line had been written manually.</p>
  <p>But none of those changes happened because AI independently understood the product. A human engineer gave direction: the quick menu should float outside the content width, mobile should use a button-and-popover pattern rather than a horizontal bar, tool pages need enough explanatory context for users and crawlers, and public pages should not expose internal operational motives. AI turned those decisions into implementation.</p>
  <p>This is the real shift. The human did not disappear. The human moved upward—from line-by-line implementation toward product direction, quality definition, risk judgment, and operating-system design for agents. That is the difference between vibe coding and agentic engineering. Vibe coding broadly delegates and accepts what looks plausible. Agentic engineering delegates execution while the human remains the product owner, reviewer, and accountable operator.</p>
</section>

<section aria-labelledby="floating-menu-case">
  <h2 id="floating-menu-case">Case 1: the floating menu was implemented by AI, but the UX judgment was human</h2>
  <p>Adding a category quick menu to a post archive sounds straightforward. Count posts by category, mark recently updated categories with a new badge, and make the filters clickable. AI agents can implement this quickly. They can compute the data, connect React state, style the component, and verify the build.</p>
  <p>The first implementation, however, placed the menu inside the content layout. It worked, but it was not the intended experience. The desired behavior was an external floating menu that sits outside the main page width and follows the user while scrolling. On mobile, the better experience was not a horizontal sticky bar, but a small floating button that opens a quick-menu popover.</p>
  <p>This was not a code-generation failure. It was a product-context failure. The agent interpreted “sidebar” as a common layout pattern. The human looked at the page, the reference image, the available horizontal space, future promotional slots, and mobile thumb reach, then corrected the direction. The good result came from AI execution plus human product correction.</p>
</section>

<section aria-labelledby="content-case">
  <h2 id="content-case">Case 2: AI can strengthen content, but humans define what should be public</h2>
  <p>Tool pages also show the distinction. AI can generate useful explanatory sections from each tool’s inputs, outputs, examples, and FAQ. A structure like “when this helps,” “suggested workflow,” and “how to verify results” gives both users and crawlers more context. Adding noscript fallback content also helps ensure that important explanatory text exists in the HTML even when JavaScript rendering is delayed.</p>
  <p>But the editorial boundary matters. Some internal reasons for a change should never appear in public copy. A site can be improved for review, discoverability, or business readiness, but users should see the value of the tool—not the internal reason the page was expanded. AI may blend internal motives with public-facing text unless the human operator draws a line.</p>
  <p>A public website is not just an output. It is a promise. AI can write the words, but the operator decides what the promise is allowed to be.</p>
</section>

<section aria-labelledby="broader-evidence">
  <h2 id="broader-evidence">Broader evidence: more code does not automatically mean more shipped product</h2>
  <p>This pattern appears beyond our site. GitHub’s Copilot research shows that AI assistance can improve the experience of writing code and reduce friction in many tasks. But writing more code is not the same as shipping a better product. The original article summarized on GeekNews warns against treating the percentage of AI-written code as a direct measure of labor replacement. Code is material; the product is the system that reaches users.</p>
  <p>METR’s study of experienced open-source developers offers a useful counterweight. In that experiment, developers working in their own repositories took longer with early-2025 AI tools than without them. This does not mean AI always slows developers down. It means productivity depends on task type, codebase familiarity, verification cost, and the gap between developer expectations and model capability.</p>
  <p>The Federal Reserve’s work on AI and coder employment also supports a more cautious view. AI may influence hiring growth and job composition, but the evidence does not cleanly support a simple mass-replacement story. In many companies, “AI” becomes a convenient explanation for restructuring that is also driven by cost pressure, investor expectations, management-layer reduction, or product demand shifts. Sometimes AI is not the cause; it is the story attached to the cause.</p>
</section>

<section aria-labelledby="why-engineers-remain">
  <h2 id="why-engineers-remain">Why engineers remain: tacit knowledge, accountability, and system understanding</h2>
  <p>Software engineers remain valuable not because they type faster than AI. They remain valuable because they carry tacit system knowledge. A codebase contains history: old mistakes, strange conventions, user complaints, risky paths, deployment constraints, and decisions that were never fully written down.</p>
  <p>oh-my-zhs.com has that kind of context. Which tool strengthens the site’s identity? Which post actually helps users? Which feature is too early? Which public sentence feels too defensive? AI can infer many signals from files and instructions, but the final judgment comes from the operator who understands the product’s direction.</p>
  <p>Accountability is the other reason. If AI-generated code breaks the build, shows a wrong calculation, or publishes irresponsible copy, the user does not hold the model accountable. The site operator is accountable. That is why the delivery layer remains human. “It appears to work” and “it is safe to publish” are different standards.</p>
</section>

<section aria-labelledby="operating-pattern">
  <h2 id="operating-pattern">The agentic engineering pattern we actually use</h2>
  <p>An AI-operated site does not mean the human does nothing. In practice, the human makes fewer hand movements but more explicit decisions. A reliable agentic workflow has several rules.</p>
  <ul>
    <li><strong>Break work into small tasks.</strong> Do not ask an agent to “make the site better.” Specify the desired artifact and interaction.</li>
    <li><strong>Define verification commands.</strong> Lint, build, route checks, and rendered HTML checks are part of the task, not optional cleanup.</li>
    <li><strong>Separate public copy from internal motives.</strong> Operational goals may guide the work, but user-facing pages should describe user value.</li>
    <li><strong>Keep Git scope narrow.</strong> A commit should have one purpose. Mixed changes make rollback and review harder.</li>
    <li><strong>Let humans make the final product call.</strong> A successful build is not the same as a good user experience.</li>
  </ul>
  <div class="zhs-html-callout"><p><strong>Operating principle:</strong> the more execution we delegate to AI, the more explicit our standards and verification loops must become. Automation does not remove responsibility. It clarifies where responsibility lives.</p></div>
</section>

<section aria-labelledby="demand-expansion">
  <h2 id="demand-expansion">Lower production cost can expand demand instead of eliminating it</h2>
  <p>Replacement narratives often ignore demand expansion. When software becomes cheaper to produce, smaller tools become economically reasonable. Many oh-my-zhs.com utilities fit this pattern: pyeong conversion, KST time conversion, developer text tools, image editing, PDF utilities, and webhook formatting. These may not justify a large traditional team, but when agents reduce execution cost, they become possible as part of a living tool hub.</p>
  <p>This does not guarantee career stability for every individual developer. Roles centered only on repetitive execution will face pressure. But engineers who can define user problems, shape product direction, verify agent output, and own delivery may become more valuable across a wider range of small software opportunities.</p>
</section>

<section aria-labelledby="danger">
  <h2 id="danger">The dangerous version: removing the decision and delivery layers</h2>
  <p>The risk is not that teams use AI for execution. The risk is that teams empty out the decision and delivery layers too. They skip requirements, ignore users, avoid tests, publish vague promises, and call the result fast because AI produced it quickly.</p>
  <p>That can look impressive at demo time. Screens appear, code volume rises, and prototypes arrive quickly. The damage appears later: the workflow does not match user needs, edge cases break, copy over-promises, and multiple agents modify the same system in conflicting directions. AI accelerates both good and bad decisions.</p>
  <p>Human-led agentic engineering is therefore not “let AI handle it.” It is “build rails so AI can move fast without turning speed into risk.”</p>
</section>

<section aria-labelledby="metrics">
  <h2 id="metrics">What to measure instead of AI-written code percentage</h2>
  <p>The percentage of AI-written code is visible, but it is not the right product metric. The better questions are about delivery and responsibility.</p>
  <ul>
    <li><strong>Time to released feature:</strong> measure what reaches users, not draft code.</li>
    <li><strong>Review and repair cost:</strong> include the human time spent correcting AI output.</li>
    <li><strong>Regression rate:</strong> check whether changes preserve existing behavior.</li>
    <li><strong>Response to changed requirements:</strong> see how safely the system can be redirected.</li>
    <li><strong>Operational traceability:</strong> verify whether failures can be understood and rolled back.</li>
  </ul>
  <p>In our site operations, the most important signal is not how much AI wrote. It is whether the build passed, routes were generated, the article order was correct, the UI felt natural, and commits stayed small enough to trust.</p>
</section>

<section aria-labelledby="future-engineer">
  <h2 id="future-engineer">The future engineer looks more like a crane operator</h2>
  <p>The original article compares future software engineers to crane operators. They do not lift heavy objects by hand. They decide where the load goes, how it moves, and whether the surroundings are safe. That is a strong metaphor for agentic engineering.</p>
  <p>AI agents lift the cognitive weight: boilerplate, API wiring, style changes, test drafts, long-form structure, and repetitive edits. But a stronger crane does not reduce the operator’s responsibility. If anything, the consequences of a wrong move become larger. The same is true for agents.</p>
  <p>This is both a threat and an opportunity. Engineers who rely only on manual implementation will feel pressure. Engineers who can define problems, direct agents, verify systems, and own delivery will move up the stack of responsibility.</p>
</section>

<section aria-labelledby="faq">
  <h2 id="faq">FAQ</h2>
  <h3>Is it too optimistic to say AI will not replace software engineers?</h3>
  <p>Individual roles will change, and some careers will be disrupted. But the full engineering function—product judgment, system understanding, verification, and accountability—is not explained well by a simple replacement story.</p>
  <h3>If a site is built by AI, what does the human engineer do?</h3>
  <p>The human decides what to build, defines quality, constrains public messaging, verifies results, manages commits, and accepts responsibility for what ships.</p>
  <h3>What is the difference between vibe coding and agentic engineering?</h3>
  <p>Vibe coding delegates broadly and accepts plausible output. Agentic engineering defines scope, verification, commit boundaries, and delivery responsibility before delegating execution.</p>
  <h3>How should AI development productivity be measured?</h3>
  <p>Measure release speed, review cost, regression rate, user value, and operational accountability—not just how much code AI generated.</p>
</section>

<section aria-labelledby="conclusion">
  <h2 id="conclusion">Conclusion: AI does not erase engineers. It reveals what engineering responsibility really is.</h2>
  <p>AI is changing software development. The execution layer is being compressed, and it will continue to shrink. But that does not mean engineers disappear. It means their source of value becomes clearer. The engineer who remains is not merely the person who writes code, but the person who knows what should be built, structures the work for agents, verifies the result, and takes responsibility for the product.</p>
  <p>Zero Human Studio shows this transition at a small but concrete scale. The site is built quickly with AI agents. But a human operator still decides the direction, corrects the experience, protects the public voice, verifies the build, and chooses what is safe to ship. An AI-built site does not prove the end of human engineering. It proves the beginning of engineering at a higher layer.</p>
</section>
