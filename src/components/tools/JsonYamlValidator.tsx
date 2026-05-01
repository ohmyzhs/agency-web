"use client";

import { useMemo, useState } from "react";

type Mode = "json" | "yaml";

type ValidationResult = {
  ok: boolean;
  title: string;
  message: string;
  formatted?: string;
  details: string[];
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

function validateJson(input: string): ValidationResult {
  try {
    const parsed = JSON.parse(input);
    return {
      ok: true,
      title: "Valid JSON",
      message: "The snippet parsed successfully and can be formatted safely.",
      formatted: JSON.stringify(parsed, null, 2),
      details: [
        `Top-level type: ${Array.isArray(parsed) ? "array" : typeof parsed}`,
        `Characters: ${input.length.toLocaleString()}`,
      ],
    };
  } catch (error) {
    return {
      ok: false,
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
          title: "YAML needs review",
          message: `Line ${index + 1} has a colon but no key before it.`,
          details: [raw],
        };
      }
    } else if (!isListItem) {
      return {
        ok: false,
        title: "YAML needs review",
        message: `Line ${index + 1} does not look like a key/value pair or list item.`,
        details: [raw],
      };
    }
  }

  if (!hasContent) {
    return {
      ok: false,
      title: "No YAML content",
      message: "Paste a YAML snippet to validate indentation and key/value structure.",
      details: [],
    };
  }

  details.push(`Lines checked: ${lines.length.toLocaleString()}`);
  details.push("Lightweight YAML check: indentation, list items, and key/value shape.");

  return {
    ok: true,
    title: "YAML shape looks valid",
    message: "The snippet passed the local browser checks used by this tool.",
    formatted: lines.map((line) => line.trimEnd()).join("\n"),
    details,
  };
}

export default function JsonYamlValidator() {
  const [mode, setMode] = useState<Mode>("json");
  const [input, setInput] = useState(sampleJson);

  const result = useMemo(() => {
    if (!input.trim()) {
      return { ok: false, title: "Waiting for input", message: "Paste JSON or YAML to check it in your browser.", details: [] } satisfies ValidationResult;
    }
    return mode === "json" ? validateJson(input) : validateYamlLight(input);
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-lg border border-border" role="group">
        <button
          type="button"
          className={`rounded-l-lg px-4 py-2 text-sm font-medium transition-colors ${mode === "json" ? "bg-primary text-white" : "hover:bg-card"}`}
          onClick={() => { setMode("json"); setInput(sampleJson); }}
        >
          JSON
        </button>
        <button
          type="button"
          className={`rounded-r-lg px-4 py-2 text-sm font-medium transition-colors ${mode === "yaml" ? "bg-primary text-white" : "hover:bg-card"}`}
          onClick={() => { setMode("yaml"); setInput(sampleYaml); }}
        >
          YAML
        </button>
      </div>

      <textarea
        rows={12}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        spellCheck={false}
        className="block w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm focus:border-primary focus:outline-none"
      />

      <div className={`rounded-lg p-4 ${result.ok ? "bg-accent" : "bg-yellow-50 dark:bg-yellow-950/30"}`}>
        <p className="text-xs font-medium uppercase tracking-wider text-muted">{result.ok ? "valid" : "check"}</p>
        <strong className="mt-1 block">{result.title}</strong>
        <p className="mt-1 text-sm text-muted">{result.message}</p>
        {result.details.length > 0 && (
          <ul className="mt-2 space-y-0.5 text-sm text-muted">
            {result.details.map((detail) => (<li key={detail}>{detail}</li>))}
          </ul>
        )}
      </div>

      {result.formatted && (
        <div className="rounded-lg border border-border">
          <div className="flex items-center justify-between border-b border-border px-4 py-2 text-sm">
            <span>Formatted output</span>
            <span className="text-muted">{mode.toUpperCase()}</span>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-sm">{result.formatted}</pre>
        </div>
      )}
    </div>
  );
}
