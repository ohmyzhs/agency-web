"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/providers";
import SegmentedTabs from "@/components/tools/shared/SegmentedTabs";

type Mode = "auto" | "json" | "yaml" | "xml";
type DetectedKind = "json" | "yaml" | "xml";
type Action = "validate" | "beautify" | "minify";

type ValidationResult = {
  ok: boolean;
  title: string;
  message: string;
  formatted?: string;
  details: string[];
  kind: DetectedKind;
};

const sampleJson = `{
  "event": "customer.created",
  "enabled": true,
  "retries": 3,
  "tags": ["billing", "production"]
}`;

const sampleYaml = `event: customer.created
enabled: true
retries: 3
tags:
  - billing
  - production`;

const sampleXml = `<event name="customer.created">
  <enabled>true</enabled>
  <retries>3</retries>
  <tags>
    <tag>billing</tag>
    <tag>production</tag>
  </tags>
</event>`;

function detectKind(input: string): DetectedKind {
  const trimmed = input.trim();
  if (trimmed.startsWith("<")) return "xml";
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) return "json";
  return "yaml";
}

function validateJson(input: string, action: Action): ValidationResult {
  try {
    const parsed = JSON.parse(input);
    let formatted: string | undefined;
    if (action === "beautify") formatted = JSON.stringify(parsed, null, 2);
    else if (action === "minify") formatted = JSON.stringify(parsed);
    else formatted = JSON.stringify(parsed, null, 2);
    return {
      ok: true,
      kind: "json",
      title: "Valid JSON",
      message: action === "minify" ? "Minified output." : "Beautified output.",
      formatted,
      details: [
        `Top-level type: ${Array.isArray(parsed) ? "array" : typeof parsed}`,
        `Characters: ${input.length.toLocaleString()}`,
      ],
    };
  } catch (error) {
    return {
      ok: false,
      kind: "json",
      title: "Invalid JSON",
      message: error instanceof Error ? error.message : "The JSON parser reported an unknown error.",
      details: ["Check missing commas, unquoted keys, trailing commas, and mismatched brackets."],
    };
  }
}

function validateYamlLight(input: string): ValidationResult {
  const lines = input.split(/\r?\n/);
  const details: string[] = [];
  const stack: number[] = [];
  let hasContent = false;

  for (let index = 0; index < lines.length; index += 1) {
    const raw = lines[index];
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    hasContent = true;

    const indent = raw.match(/^\s*/)?.[0].length ?? 0;
    if (indent % 2 !== 0) {
      return {
        ok: false,
        kind: "yaml",
        title: "YAML needs review",
        message: `Line ${index + 1} uses an odd indentation width. Use consistent 2-space indentation for this browser check.`,
        details: [raw],
      };
    }

    while (stack.length && indent < stack[stack.length - 1]) stack.pop();
    if (!stack.length || indent > stack[stack.length - 1]) stack.push(indent);

    const isListItem = trimmed.startsWith("- ");
    const keyValue = isListItem ? trimmed.slice(2) : trimmed;
    if (keyValue.includes(":")) {
      const [key] = keyValue.split(":");
      if (!key.trim()) {
        return {
          ok: false,
          kind: "yaml",
          title: "YAML needs review",
          message: `Line ${index + 1} has a colon but no key before it.`,
          details: [raw],
        };
      }
    } else if (!isListItem) {
      return {
        ok: false,
        kind: "yaml",
        title: "YAML needs review",
        message: `Line ${index + 1} does not look like a key/value pair or list item.`,
        details: [raw],
      };
    }
  }

  if (!hasContent) {
    return {
      ok: false,
      kind: "yaml",
      title: "No YAML content",
      message: "Paste a YAML snippet to validate indentation and key/value structure.",
      details: [],
    };
  }

  details.push(`Lines checked: ${lines.length.toLocaleString()}`);
  details.push("Lightweight YAML check: indentation, list items, and key/value shape.");

  return {
    ok: true,
    kind: "yaml",
    title: "YAML shape looks valid",
    message: "The snippet passed the local browser checks used by this tool.",
    formatted: lines.map((line) => line.trimEnd()).join("\n"),
    details,
  };
}

function formatXml(input: string, minify: boolean): string {
  if (minify) {
    return input.replace(/>\s+</g, "><").trim();
  }
  // Insert newlines between tags, then indent.
  const collapsed = input.replace(/>\s+</g, "><").trim();
  const tokens = collapsed
    .replace(/></g, ">\n<")
    .split(/\r?\n/);
  let depth = 0;
  const out: string[] = [];
  for (const tokenRaw of tokens) {
    const token = tokenRaw.trim();
    if (!token) continue;
    const isClosing = /^<\//.test(token);
    const isSelfClosing = /\/>$/.test(token) || /^<\?/.test(token) || /^<!/.test(token);
    const isOpening = !isClosing && !isSelfClosing && /^<[^!?]/.test(token);
    if (isClosing) depth = Math.max(0, depth - 1);
    out.push(`${"  ".repeat(depth)}${token}`);
    if (isOpening) {
      // Only push depth if it does not contain an inline closing tag like <a>x</a>
      const inlineClosing = new RegExp(`^<([a-zA-Z_][\\w:.-]*)[^>]*>.*</\\1>$`).test(token);
      if (!inlineClosing) depth += 1;
    }
  }
  return out.join("\n");
}

function validateXml(input: string, action: Action): ValidationResult {
  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return {
      ok: false,
      kind: "xml",
      title: "XML check unavailable",
      message: "DOMParser is not available in this environment.",
      details: [],
    };
  }
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, "application/xml");
    const errorNode = doc.querySelector("parsererror");
    if (errorNode) {
      return {
        ok: false,
        kind: "xml",
        title: "Invalid XML",
        message: errorNode.textContent?.replace(/\s+/g, " ").trim() || "XML parser reported an error.",
        details: ["Check tag matching, attribute quoting, and a single root element."],
      };
    }
    let formatted: string | undefined;
    if (action === "minify") formatted = formatXml(input, true);
    else formatted = formatXml(input, false);
    return {
      ok: true,
      kind: "xml",
      title: "Valid XML",
      message: action === "minify" ? "Minified output." : "Beautified output.",
      formatted,
      details: [`Characters: ${input.length.toLocaleString()}`],
    };
  } catch (error) {
    return {
      ok: false,
      kind: "xml",
      title: "Invalid XML",
      message: error instanceof Error ? error.message : "Unknown XML error.",
      details: [],
    };
  }
}

export default function JsonYamlValidator() {
  const { locale } = useLocale();
  const [mode, setMode] = useState<Mode>("auto");
  const [action, setAction] = useState<Action>("beautify");
  const [input, setInput] = useState(sampleJson);

  const result = useMemo<ValidationResult>(() => {
    if (!input.trim()) {
      return {
        ok: false,
        kind: "json",
        title: "Waiting for input",
        message: "Paste JSON, YAML, or XML to check it in your browser.",
        details: [],
      };
    }
    const kind: DetectedKind = mode === "auto" ? detectKind(input) : mode;
    if (kind === "json") return validateJson(input, action);
    if (kind === "yaml") return validateYamlLight(input);
    return validateXml(input, action);
  }, [input, mode, action]);

  const setSample = (next: Mode) => {
    setMode(next);
    if (next === "json") setInput(sampleJson);
    else if (next === "yaml") setInput(sampleYaml);
    else if (next === "xml") setInput(sampleXml);
  };

  const t = locale === "ko"
    ? { mode: "포맷", action: "동작", validate: "검증", beautify: "정렬", minify: "압축", formatted: "결과" }
    : { mode: "Format", action: "Action", validate: "Validate", beautify: "Beautify", minify: "Minify", formatted: "Formatted output" };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">{t.mode}</p>
          <div className="mt-1">
            <SegmentedTabs<Mode>
              ariaLabel={t.mode}
              value={mode}
              onChange={(next) => (next === "auto" ? setMode("auto") : setSample(next))}
              options={[
                { value: "auto", label: "Auto" },
                { value: "json", label: "JSON" },
                { value: "yaml", label: "YAML" },
                { value: "xml", label: "XML" },
              ]}
              size="sm"
            />
          </div>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">{t.action}</p>
          <div className="mt-1">
            <SegmentedTabs<Action>
              ariaLabel={t.action}
              value={action}
              onChange={setAction}
              options={[
                { value: "validate", label: t.validate },
                { value: "beautify", label: t.beautify },
                { value: "minify", label: t.minify },
              ]}
              size="sm"
            />
          </div>
        </div>
      </div>

      <textarea
        rows={12}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        spellCheck={false}
        className="block w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm focus:border-primary focus:outline-none"
      />

      <div className={`rounded-lg p-4 ${result.ok ? "bg-accent" : "bg-yellow-50 dark:bg-yellow-950/30"}`}>
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          {result.ok ? "valid" : "check"} · {result.kind.toUpperCase()}
        </p>
        <strong className="mt-1 block">{result.title}</strong>
        <p className="mt-1 text-sm text-muted">{result.message}</p>
        {result.details.length > 0 && (
          <ul className="mt-2 space-y-0.5 text-sm text-muted">
            {result.details.map((detail) => (<li key={detail}>{detail}</li>))}
          </ul>
        )}
      </div>

      {result.ok && action !== "validate" && result.formatted && (
        <div className="rounded-lg border border-border">
          <div className="flex items-center justify-between border-b border-border px-4 py-2 text-sm">
            <span>{t.formatted}</span>
            <span className="text-muted">{result.kind.toUpperCase()}</span>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-sm">{result.formatted}</pre>
        </div>
      )}
    </div>
  );
}
