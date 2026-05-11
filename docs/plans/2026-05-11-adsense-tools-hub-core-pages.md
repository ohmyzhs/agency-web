# AdSense Tool Hub and Core Tool Page Enrichment Plan

Target repo: `/Users/gabriel.k/Documents/Workspace/ohmyzhs/agency-web`
Current branch: `feat/home-unified-search-about`
Target domain: `oh-my-zhs.com`

## Objective

Continue the AdSense approval hardening work after the homepage unified search and About expansion. This phase focuses on:

1. Strengthening the Tools hub so it reads like an editorially curated public utility library, not only a filterable card list.
2. Adding explicit category/use-flow copy for Korean living tools, developer utilities, file/image/PDF tools, network diagnostics, and micro utilities.
3. Enriching ten core tool pages with longer unique explanations, examples, processing notes, privacy/data handling notes, usage cautions, FAQs, and internal links.
4. Adding a reusable per-tool data handling notice surface to make local/browser/server behavior clear.

## Relevant AdSense quality rationale

Tool websites are approval-friendly only when the pages are not thin utility wrappers. Each public tool should combine:

- usable widget/interface,
- clear explanation of what it does,
- input/output documentation,
- practical examples,
- method/formula/processing description,
- privacy/data-handling statement,
- cautions and limitations,
- FAQ,
- related tools and related guides.

Avoid fake authority. State simplified estimates and limitations clearly.

## Current observations

- `src/lib/tools.ts` already stores localized tool metadata, examples, explanation, FAQ, related tool slugs.
- `src/components/tool-page-shell.tsx` already renders explanation/examples/FAQ/specs/related tools/related guides.
- `src/components/tools-catalog.tsx` has search, filters, favorites, grid/list, but the intro is relatively short and does not explain category workflows or editorial direction deeply.
- Some tool entries are already rich: `pdf-toolkit`, `image-to-ascii-art`, `two-factor-code-generator`, `network-diagnostics`, `icon-favicon-generator`, `image-format-converter`, `pyeong-converter`, `kst-timezone-converter`, `krw-currency-calculator`, `unit-converter`.
- Several high-traffic/core entries are still one-line compact entries: `og-image-generator`, `qr-barcode-generator`, `webhook-request-simulator`, and many developer utilities from `cron-explainer` onward.

## Implementation scope for Claude Code

### A. Tools hub enrichment

Modify `src/components/tools-catalog.tsx`.

Add bilingual copy and sections below the control bar or near the top of the page:

1. Library purpose / editorial direction
   - Korean: ZHS tools are organized as small practical workflows for Korean living, developer automation, file/image/PDF handling, diagnostics, and writing/operations support.
   - English equivalent.
2. Recommended flows / categories
   - Korean living: pyeong, shoe size, cooking measures, currency/timezone.
   - File/Image/PDF: PDF merge/split/render, image compression/resize/metadata, format conversion, QR/barcode, OG images.
   - Developer utilities: JSON/YAML, cron, webhook payloads, text transforms, timestamps, contrast checks.
   - Diagnostics/security-sensitive utilities: network diagnostics, 2FA helper, explain local-vs-server processing and credential caution.
3. Site editing policy / quality direction
   - Tools are kept public, mobile-friendly, and internally linked to guides.
   - When a tool handles files or tokens, data handling notes are written near the tool.
   - Outputs are reference results; users should verify legal/tax/financial/production-sensitive decisions.

Keep it concise enough for UI, but materially richer than current text. Prefer card sections with headings and 2-3 sentences each.

### B. Reusable data handling notice on tool pages

Modify types and renderer:

- `src/lib/tools.ts`
  - Add optional localized field if practical:
    - `dataNotice?: string[]` or structured object, e.g. `{ processing: string; storage: string; caution: string }` inside `LocalizedToolContent`.
  - If adding required fields is too broad, compute a default notice from category and allow optional per-tool overrides.
- `src/components/tool-page-shell.tsx`
  - Render a visible data/privacy/limitations section for every tool, not only category privacy badge.
  - Must state:
    - browser-local 여부 or whether a server/API request is used,
    - server 저장 여부,
    - sensitive data caution,
    - legal/safety/verification caution where relevant.

Do not overclaim. Network tools and webhook simulators may call external URLs/APIs by design. File tools should say browser-local if implementation confirms it.

### C. Core 10 tool page enrichment

Enrich the Korean and English metadata in `src/lib/tools.ts` for these 10 core tools first:

1. `developer-text-toolkit`
2. `image-editing-toolkit`
3. `life-calculator-suite`
4. `pdf-toolkit`
5. `og-image-generator`
6. `qr-barcode-generator`
7. `image-to-ascii-art`
8. `webhook-request-simulator`
9. `network-diagnostics`
10. `pyeong-converter`

For each target tool, ensure:

- `description` is specific and not generic.
- `inputs` has at least 2 useful entries when relevant.
- `outputs` has at least 1-2 entries.
- `examples` has 2-3 entries.
- `explanation` has 4-6 paragraphs/sentences total, enough to reach meaningful page text.
- `faqs` has 3-5 FAQs.
- Korean content is natural Korean, not awkward translation.
- English content remains accurate.
- Include privacy/data behavior and caution either in `dataNotice` or explanation/FAQ.
- Maintain existing related tool slugs and add related post rendering is already handled by `getPostsByRelatedTool`.

Do not generate mass repetitive boilerplate. Each tool needs tool-specific details.

### D. Validation

Run:

```bash
npm run lint
npm run build
```

Then start local server on an available port and verify markers in HTML:

- `/tools` contains new hub section text such as Korean workflow/editorial copy and/or English if default locale renders English.
- `/tools/pdf-toolkit` contains data handling or privacy/processing notice.
- `/tools/qr-barcode-generator` contains expanded FAQ or caution content.
- `/tools/webhook-request-simulator` does not claim all data is local if requests are sent out.

### E. Git

- Keep current branch `feat/home-unified-search-about` unless already changed intentionally.
- Commit focused changes with a message like:
  - `feat: enrich tool hub and core tool pages for adsense`

## Out of scope

- Do not apply to AdSense yet.
- Do not deploy or push unless explicitly asked.
- Do not rewrite all 27 tool pages in this pass.
- Do not add ad placements.
- Do not create unsupported claims that no data ever leaves the browser.
