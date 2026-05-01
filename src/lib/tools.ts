export type ToolTier = 1 | 2 | 3;

export type ToolCategory =
  | "korea-living"
  | "time-money"
  | "developer-automation"
  | "business-automation"
  | "micro-utility";

export type ToolExample = {
  label: string;
  input: string;
  output: string;
};

export type ToolField = {
  label: string;
  description: string;
};

export type Tool = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  category: ToolCategory;
  tier: ToolTier;
  seoTitle: string;
  seoDescription: string;
  inputs: ToolField[];
  outputs: ToolField[];
  examples: ToolExample[];
  explanation: string[];
  faqs: { question: string; answer: string }[];
  relatedToolSlugs: string[];
};

export const tools: Tool[] = [
  {
    slug: "pyeong-converter",
    title: "Pyeong Converter",
    shortTitle: "Pyeong",
    description: "Convert Korean pyeong and square meters without guessing apartment or office area units.",
    category: "korea-living",
    tier: 1,
    seoTitle: "Pyeong Converter | Convert 평 to m²",
    seoDescription: "Convert Korean pyeong to square meters and back with practical examples for homes and offices.",
    inputs: [{ label: "Area", description: "Enter pyeong or square meters." }],
    outputs: [{ label: "Converted area", description: "Shows the matching value using 1 pyeong = 3.305785 m²." }],
    examples: [
      { label: "Apartment listing", input: "24평", output: "약 79.34 m²" },
      { label: "Office area", input: "100 m²", output: "약 30.25평" },
    ],
    explanation: [
      "Korean real-estate listings often mix pyeong and square meters. The tool uses the standard 1평 = 3.305785㎡ ratio so the result is predictable.",
      "Use the converted value as a reading aid, then check official documents when a contract or tax decision depends on the exact area.",
    ],
    faqs: [
      { question: "Is pyeong still used in Korea?", answer: "Yes. Square meters are official, but pyeong is still common in everyday housing conversations." },
      { question: "Why do listings sometimes differ?", answer: "Listings may refer to exclusive area, supply area, or rounded marketing values." },
    ],
    relatedToolSlugs: ["unit-converter", "krw-currency-calculator"],
  },
  {
    slug: "kst-timezone-converter",
    title: "KST Timezone Converter",
    shortTitle: "KST Time",
    description: "Translate Korea Standard Time into overseas working hours for calls, launches, and handoffs.",
    category: "time-money",
    tier: 1,
    seoTitle: "KST Timezone Converter | Korea Time to Global Time",
    seoDescription: "Convert Korea Standard Time to common global time zones for meetings, launches, and automation schedules.",
    inputs: [{ label: "KST date and time", description: "A Korea Standard Time timestamp." }],
    outputs: [{ label: "Global times", description: "Matching times in selected overseas time zones." }],
    examples: [
      { label: "US handoff", input: "KST 10:00", output: "Previous day evening in US Pacific time during standard offset." },
      { label: "Launch window", input: "KST 09:00", output: "Useful for Korea-first announcements." },
    ],
    explanation: [
      "KST is UTC+9 and does not use daylight saving time. Overseas regions may shift with daylight saving, so date-aware conversion matters.",
    ],
    faqs: [
      { question: "Does Korea use daylight saving time?", answer: "No. KST stays UTC+9 throughout the year." },
    ],
    relatedToolSlugs: ["cron-explainer", "timestamp-converter"],
  },
  {
    slug: "korean-shoe-size-converter",
    title: "Korean Shoe Size Converter",
    shortTitle: "Shoe Size",
    description: "Compare Korean millimeter shoe sizes with US, UK, EU, and Japan size conventions.",
    category: "korea-living",
    tier: 1,
    seoTitle: "Korean Shoe Size Converter | KR mm to US UK EU",
    seoDescription: "Convert Korean shoe sizes in millimeters to US, UK, EU, and JP references with practical caveats.",
    inputs: [{ label: "Korean size", description: "Footwear size in millimeters, such as 250 or 270." }],
    outputs: [{ label: "International references", description: "Approximate US, UK, EU, and JP size matches." }],
    examples: [
      { label: "Common women size", input: "240 mm", output: "Approx. US women 7, EU 38" },
      { label: "Common men size", input: "270 mm", output: "Approx. US men 9, EU 42" },
    ],
    explanation: [
      "Korean shoe sizing usually tracks foot length in millimeters. International conversions vary by brand, so treat the result as a shopping reference rather than a guarantee.",
    ],
    faqs: [{ question: "Why do brands differ?", answer: "Last shape, gender scale, and brand-specific fit can shift the recommended size." }],
    relatedToolSlugs: ["unit-converter"],
  },
  {
    slug: "krw-currency-calculator",
    title: "KRW Currency Calculator",
    shortTitle: "KRW",
    description: "Estimate Korean won amounts with transparent exchange-rate assumptions and manual rate entry.",
    category: "time-money",
    tier: 1,
    seoTitle: "KRW Currency Calculator | Korean Won Estimates",
    seoDescription: "Calculate Korean won exchange estimates with manual rates and clear assumptions for travel or budgeting.",
    inputs: [
      { label: "Amount", description: "Original amount to convert." },
      { label: "Exchange rate", description: "Manual rate used for the estimate." },
    ],
    outputs: [{ label: "Estimated value", description: "Converted amount before bank fees or spread." }],
    examples: [{ label: "Budget estimate", input: "USD 100 at 1,350 KRW", output: "135,000 KRW before fees" }],
    explanation: ["This calculator makes the exchange-rate assumption explicit instead of pretending to provide a live quote."],
    faqs: [{ question: "Is this a live FX quote?", answer: "No. It is an estimate based on the rate you enter." }],
    relatedToolSlugs: ["automation-roi-calculator", "unit-converter"],
  },
  {
    slug: "cooking-measurement-converter",
    title: "Cooking Measurement Converter",
    shortTitle: "Cooking Units",
    description: "Convert cups, tablespoons, teaspoons, milliliters, and grams for everyday recipe adaptation.",
    category: "korea-living",
    tier: 1,
    seoTitle: "Cooking Measurement Converter | Cups Spoons Grams ml",
    seoDescription: "Convert common cooking measurements with notes about ingredient density and recipe uncertainty.",
    inputs: [{ label: "Measurement", description: "A cooking amount and unit." }],
    outputs: [{ label: "Converted amount", description: "Equivalent volume or approximate weight when density is known." }],
    examples: [
      { label: "Volume", input: "1 cup", output: "240 ml" },
      { label: "Spoons", input: "1 tbsp", output: "3 tsp or 15 ml" },
    ],
    explanation: ["Volume conversions are consistent; gram conversions depend on the ingredient density."],
    faqs: [{ question: "Why is flour different from sugar?", answer: "The same volume can weigh differently depending on ingredient density and packing." }],
    relatedToolSlugs: ["unit-converter"],
  },
  {
    slug: "unit-converter",
    title: "Unit Converter",
    shortTitle: "Units",
    description: "Convert everyday length, weight, temperature, and area units in one practical workspace.",
    category: "time-money",
    tier: 1,
    seoTitle: "Unit Converter | Practical Everyday Conversions",
    seoDescription: "Convert common units for area, length, weight, temperature, and volume with clear formulas.",
    inputs: [{ label: "Value and unit", description: "Choose a source unit and enter the value." }],
    outputs: [{ label: "Target unit", description: "Converted value and formula note." }],
    examples: [
      { label: "Temperature", input: "20°C", output: "68°F" },
      { label: "Length", input: "10 miles", output: "16.09 km" },
    ],
    explanation: ["A general converter supports the specialized Korea-friendly tools without replacing their local explanations."],
    faqs: [{ question: "Why keep separate pyeong and cooking converters?", answer: "Specialized tools can explain local context and common mistakes better than a generic converter." }],
    relatedToolSlugs: ["pyeong-converter", "cooking-measurement-converter"],
  },
  {
    slug: "llm-cost-calculator",
    title: "LLM Cost Calculator",
    shortTitle: "LLM Cost",
    description: "Estimate language-model API cost from input tokens, output tokens, request volume, and pricing assumptions.",
    category: "business-automation",
    tier: 2,
    seoTitle: "LLM Cost Calculator | Estimate AI API Spend",
    seoDescription: "Estimate AI API costs by token usage and request volume with transparent pricing assumptions.",
    inputs: [{ label: "Token and price assumptions", description: "Input/output tokens, requests, and rates." }],
    outputs: [{ label: "Estimated spend", description: "Projected cost per run, day, or month." }],
    examples: [{ label: "Daily automation", input: "1,000 runs/day", output: "Monthly estimate from token assumptions" }],
    explanation: ["LLM cost planning should separate input and output tokens because providers often price them differently."],
    faqs: [{ question: "Does this fetch provider prices?", answer: "No. Use explicit manual assumptions so the estimate remains auditable." }],
    relatedToolSlugs: ["automation-roi-calculator"],
  },
  {
    slug: "cron-explainer",
    title: "Cron Explainer",
    shortTitle: "Cron",
    description: "Turn cron expressions into human-readable schedules and common automation timing notes.",
    category: "developer-automation",
    tier: 2,
    seoTitle: "Cron Explainer | Human-readable Cron Schedules",
    seoDescription: "Explain cron expressions in plain language with automation scheduling caveats.",
    inputs: [{ label: "Cron expression", description: "Five-field cron string." }],
    outputs: [{ label: "Schedule explanation", description: "Plain-language timing summary." }],
    examples: [{ label: "Daily morning", input: "0 9 * * *", output: "Every day at 09:00" }],
    explanation: ["Cron is compact but easy to misread. A readable explanation helps prevent scheduling mistakes."],
    faqs: [{ question: "Does cron include seconds?", answer: "Traditional cron uses five fields; some systems add a seconds field." }],
    relatedToolSlugs: ["kst-timezone-converter", "timestamp-converter"],
  },
  {
    slug: "json-yaml-validator",
    title: "JSON/YAML Validator",
    shortTitle: "JSON/YAML",
    description: "Validate and format JSON or YAML snippets while keeping errors visible and recoverable.",
    category: "developer-automation",
    tier: 2,
    seoTitle: "JSON YAML Validator | Check Config Syntax",
    seoDescription: "Validate JSON and YAML configuration snippets with clear errors and safe formatting behavior.",
    inputs: [{ label: "Config text", description: "JSON or YAML snippet." }],
    outputs: [{ label: "Validation result", description: "Parsed status, formatted output, or error location." }],
    examples: [{ label: "JSON object", input: "{\"enabled\":true}", output: "Valid JSON" }],
    explanation: ["Config validation should not hide the original input. Users need to see exactly what changed."],
    faqs: [{ question: "Will this upload my config?", answer: "This tool runs locally in the browser." }],
    relatedToolSlugs: ["webhook-payload-formatter"],
  },
  {
    slug: "webhook-payload-formatter",
    title: "Webhook Payload Formatter",
    shortTitle: "Webhook",
    description: "Format webhook payloads, inspect fields, and prepare debugging notes without leaving the browser.",
    category: "developer-automation",
    tier: 2,
    seoTitle: "Webhook Payload Formatter | Debug JSON Webhooks",
    seoDescription: "Format and inspect webhook JSON payloads with practical debugging guidance.",
    inputs: [{ label: "Payload", description: "Webhook body text." }],
    outputs: [{ label: "Formatted payload", description: "Readable JSON and key debugging fields." }],
    examples: [{ label: "Event payload", input: "{\"event\":\"payment.success\"}", output: "Formatted event field" }],
    explanation: ["Webhook debugging is faster when the event name, IDs, timestamps, and signature-related fields are easy to spot."],
    faqs: [{ question: "Does this verify signatures?", answer: "The first version focuses on formatting and inspection; signature verification depends on provider secrets." }],
    relatedToolSlugs: ["json-yaml-validator", "timestamp-converter"],
  },
  {
    slug: "automation-roi-calculator",
    title: "Automation ROI Calculator",
    shortTitle: "ROI",
    description: "Estimate whether an automation saves enough time or money to justify building and maintaining it.",
    category: "business-automation",
    tier: 2,
    seoTitle: "Automation ROI Calculator | Estimate Automation Payback",
    seoDescription: "Calculate automation payback using time saved, run frequency, labor cost, build cost, and maintenance assumptions.",
    inputs: [{ label: "Automation assumptions", description: "Time saved, frequency, hourly value, build and maintenance cost." }],
    outputs: [{ label: "ROI estimate", description: "Payback period and monthly net value." }],
    examples: [{ label: "Weekly report", input: "2 hours saved weekly", output: "Monthly value estimate" }],
    explanation: ["Automation ROI should include maintenance and failure handling, not just the first build."],
    faqs: [{ question: "Should every task be automated?", answer: "No. Low-frequency tasks often do not justify automation unless quality or risk reduction matters." }],
    relatedToolSlugs: ["llm-cost-calculator"],
  },
  {
    slug: "text-case-converter",
    title: "Text Case Converter",
    shortTitle: "Text Case",
    description: "Convert text between title case, sentence case, uppercase, lowercase, camelCase, and kebab-case.",
    category: "micro-utility",
    tier: 3,
    seoTitle: "Text Case Converter | Change Text Capitalization",
    seoDescription: "Convert text between common capitalization and developer naming formats.",
    inputs: [{ label: "Text", description: "Text to transform." }],
    outputs: [{ label: "Converted text", description: "Selected case format." }],
    examples: [{ label: "Slug prep", input: "Practical Tools Studio", output: "practical-tools-studio" }],
    explanation: ["Small formatting tasks are useful when they are fast, local, and predictable."],
    faqs: [{ question: "Will acronyms be perfect?", answer: "Acronyms may need manual review depending on house style." }],
    relatedToolSlugs: ["slug-generator", "markdown-table-generator"],
  },
  {
    slug: "slug-generator",
    title: "Slug Generator",
    shortTitle: "Slug",
    description: "Create URL-safe slugs for pages, campaigns, guides, and tool names.",
    category: "micro-utility",
    tier: 3,
    seoTitle: "Slug Generator | URL-safe Text Slugs",
    seoDescription: "Generate readable URL slugs from text for pages, guides, and campaigns.",
    inputs: [{ label: "Title", description: "Source text." }],
    outputs: [{ label: "Slug", description: "URL-safe lowercase slug." }],
    examples: [{ label: "Guide title", input: "KST Timezone Guide", output: "kst-timezone-guide" }],
    explanation: ["Stable slugs make internal links and search snippets easier to manage."],
    faqs: [{ question: "Can I change a slug later?", answer: "Yes, but published pages should use redirects to avoid broken links." }],
    relatedToolSlugs: ["text-case-converter", "utm-builder"],
  },
  {
    slug: "utm-builder",
    title: "UTM Builder",
    shortTitle: "UTM",
    description: "Build campaign URLs with clean UTM source, medium, campaign, term, and content parameters.",
    category: "micro-utility",
    tier: 3,
    seoTitle: "UTM Builder | Campaign URL Generator",
    seoDescription: "Create clean UTM campaign URLs and keep naming consistent.",
    inputs: [{ label: "Base URL and UTM fields", description: "Campaign tracking parameters." }],
    outputs: [{ label: "Campaign URL", description: "URL with encoded UTM parameters." }],
    examples: [{ label: "Newsletter", input: "source=newsletter, medium=email", output: "URL with utm_source and utm_medium" }],
    explanation: ["UTM consistency matters more than adding every possible parameter."],
    faqs: [{ question: "Are UTMs case-sensitive?", answer: "Analytics tools may treat differently cased values as separate labels, so consistent lowercase naming is safer." }],
    relatedToolSlugs: ["slug-generator"],
  },
  {
    slug: "markdown-table-generator",
    title: "Markdown Table Generator",
    shortTitle: "Markdown Table",
    description: "Create and clean Markdown tables for docs, README files, and lightweight content systems.",
    category: "micro-utility",
    tier: 3,
    seoTitle: "Markdown Table Generator | Create Markdown Tables",
    seoDescription: "Generate readable Markdown tables for documentation and content workflows.",
    inputs: [{ label: "Rows and columns", description: "Table data or pasted delimited text." }],
    outputs: [{ label: "Markdown table", description: "Formatted Markdown table text." }],
    examples: [{ label: "Two columns", input: "Tool, Status", output: "A Markdown table with header separator" }],
    explanation: ["Markdown tables break easily when spacing and separators are inconsistent."],
    faqs: [{ question: "Does spacing matter?", answer: "Markdown parsers mostly care about pipes and separators, but aligned spacing is easier to review." }],
    relatedToolSlugs: ["text-case-converter"],
  },
  {
    slug: "timestamp-converter",
    title: "Timestamp Converter",
    shortTitle: "Timestamp",
    description: "Convert Unix timestamps and readable dates for logs, automations, and webhook debugging.",
    category: "micro-utility",
    tier: 3,
    seoTitle: "Timestamp Converter | Unix Time and Readable Dates",
    seoDescription: "Convert Unix timestamps to readable dates and compare automation event times.",
    inputs: [{ label: "Timestamp or date", description: "Unix seconds, milliseconds, or readable date." }],
    outputs: [{ label: "Converted time", description: "Readable local/UTC/KST time." }],
    examples: [{ label: "Unix seconds", input: "1735689600", output: "2025-01-01 00:00:00 UTC" }],
    explanation: ["Webhook and automation logs often mix seconds, milliseconds, UTC, and local time."],
    faqs: [{ question: "Seconds or milliseconds?", answer: "Ten-digit Unix values are usually seconds; thirteen-digit values are usually milliseconds." }],
    relatedToolSlugs: ["kst-timezone-converter", "cron-explainer"],
  },
  {
    slug: "color-contrast-checker",
    title: "Color Contrast Checker",
    shortTitle: "Contrast",
    description: "Check foreground and background color contrast before shipping UI text and controls.",
    category: "micro-utility",
    tier: 3,
    seoTitle: "Color Contrast Checker | WCAG Contrast Ratio",
    seoDescription: "Check text and background contrast ratios for readable UI design.",
    inputs: [{ label: "Foreground and background", description: "Two color values." }],
    outputs: [{ label: "Contrast ratio", description: "Ratio and practical pass/fail guidance." }],
    examples: [{ label: "Dark text", input: "#181514 on #f3efe7", output: "Readable high-contrast pairing" }],
    explanation: ["Contrast checking prevents beautiful but unreadable design decisions, especially on mobile screens."],
    faqs: [{ question: "Is contrast the only accessibility requirement?", answer: "No. It is one important baseline along with size, focus states, semantics, and interaction design." }],
    relatedToolSlugs: ["text-case-converter"],
  },
];

export function getAllTools(): Tool[] {
  return tools;
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByTier(tier: ToolTier): Tool[] {
  return tools.filter((tool) => tool.tier === tier);
}

export function getRelatedTools(tool: Tool, limit = 3): Tool[] {
  const related = tool.relatedToolSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((item): item is Tool => Boolean(item));

  if (related.length >= limit) {
    return related.slice(0, limit);
  }

  const sameCategory = tools.filter(
    (candidate) =>
      candidate.slug !== tool.slug &&
      candidate.category === tool.category &&
      !related.some((item) => item.slug === candidate.slug),
  );

  return [...related, ...sameCategory].slice(0, limit);
}
