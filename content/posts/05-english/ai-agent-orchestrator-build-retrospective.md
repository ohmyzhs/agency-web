---
type: blog-draft
status: published
authoring_harness: zhs-english-retrospective
created: 2026-06-11
updated: 2026-06-11
title: How One Human Orchestrator and AI Agents Built a Working Website
slug: ai-agent-orchestrator-build-retrospective
kind: retrospective
category: digital-trends
locale: en
publishedAt: 2026-06-11
readingMinutes: 7
keyword_primary: AI agent website development
thumbnail:
tags:
  - ai-agent
  - build-log
  - retrospective
  - automation
related_tools: []
sourceLinks: []
quality_gate: reviewed
share_url:
telegram_handoff: false
---
# How One Human Orchestrator and AI Agents Built a Working Website

Zero Human Studio was not built like a traditional team project. It was closer to a small operating system: one human made product decisions, several AI agents handled research and implementation, and the site improved through repeated review cycles. The interesting part was not that AI wrote code. The interesting part was how much orchestration was needed to turn agent output into something public, coherent, and useful.

This is not a story about letting AI do everything. It is the opposite. AI agents can move fast, but speed only helps when someone keeps the direction clear. A site needs taste, constraints, publishing standards, product judgment, and a sense of what should not be said. The human role did not disappear. It moved upward from direct execution to editorial control, product ownership, and quality judgment.

## The human role changed

When people talk about AI development, they often focus on how many lines of code an agent can generate. That is the least interesting metric. In practice, the human work shifted from typing every line to deciding what kind of result deserved to exist.

For this site, the human role included:

- Deciding what Zero Human Studio should be: a practical tools hub, not a vague AI landing page.
- Separating thin utility pages from tools that were actually useful.
- Checking whether a design looked trustworthy, not only whether it looked modern.
- Rejecting inflated claims, fake metrics, and over-polished marketing language.
- Reviewing user experience details that automated checks could not feel.
- Turning broad goals into small tasks that agents could finish and verify.

That last point mattered most. "Improve the site" is too large. "Fix the typing practice flow so the input does not lose focus after a prompt is completed" is small enough to inspect, implement, and test.

## What AI agents were good at

The agents were strongest when the work had a wide surface area but clear verification. They could read the repository, trace components, find where markdown posts were loaded, update UI structure, run lint and build commands, and inspect rendered output. That saved a lot of context switching.

Some of the useful agent tasks included:

- Mapping a Next.js App Router project.
- Connecting tool registry data to dynamic tool pages.
- Fixing markdown rendering for posts.
- Checking metadata, sitemap, and canonical paths.
- Expanding post templates and internal links.
- Debugging build and type errors after edits.
- Comparing the intended UX against what the browser actually showed.

These are not glamorous tasks. They are exactly the tasks that make a small site durable. Without them, a project becomes a pile of prototypes.

## Where agents were not enough

The biggest gaps appeared in product feel. A typing practice tool can technically work while still feeling wrong. If completing a sentence causes a page transition, if focus drops from the input box, or if the on-screen keyboard does not match the user's physical rhythm, the product feels broken even when the code passes tests.

That kind of problem needed human feedback. A user had to say: do not move the screen, do not disable the text area, keep the flow continuous. Once the problem was named clearly, the agent could trace state transitions and fix the implementation. But the quality signal came from usage, not from code alone.

This became the main lesson: agents are excellent at execution after the target is concrete. They are weaker at deciding whether the experience feels right.

## The useful workflow

The workflow that worked best had four steps.

1. Define the product goal in plain language.
2. Break it into implementation units that can be verified.
3. Let agents inspect, edit, and run checks.
4. Review the result as a user, then tighten the next task.

This loop is slower than asking for a magical one-shot build, but it produces better software. The agent gets enough structure to act. The human keeps enough control to protect the product.

## What this means for small web projects

Small web projects often fail because they are either over-planned or under-reviewed. AI agents change that tradeoff. They make it cheap to explore, rewrite, and connect pieces of a site. But they also make it easier to generate a lot of mediocre output quickly.

The solution is not less AI. The solution is stronger orchestration. A good human operator needs to define taste, scope, and rejection criteria. A good agent setup needs to inspect the real repository, make narrow changes, and verify the result with actual tooling.

Zero Human Studio is built around that operating model. The site is not a monument to automation. It is a testbed for a practical question: how far can a small, AI-operated studio go when the human acts as product owner instead of manual labor?

The answer so far is simple. AI agents can build a lot. But the orchestrator still decides what is worth building.
