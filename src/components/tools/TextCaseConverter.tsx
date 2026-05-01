"use client";

import { useMemo, useState } from "react";

function wordsFromText(text: string) {
  return text
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^\p{L}\p{N}]+/u)
    .map((word) => word.trim())
    .filter(Boolean);
}

function capitalize(word: string) {
  if (!word) return word;
  return word.charAt(0).toLocaleUpperCase() + word.slice(1).toLocaleLowerCase();
}

function sentenceCase(text: string) {
  const lower = text.toLocaleLowerCase();
  return lower.replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu, (match) => match.toLocaleUpperCase());
}

export default function TextCaseConverter() {
  const [text, setText] = useState("Practical tools studio by Oh My ZHS");

  const converted = useMemo(() => {
    const words = wordsFromText(text);
    const title = words.map(capitalize).join(" ");
    const pascal = words.map(capitalize).join("");
    const camel = pascal ? pascal.charAt(0).toLocaleLowerCase() + pascal.slice(1) : "";
    return [
      { label: "Uppercase", value: text.toLocaleUpperCase() },
      { label: "Lowercase", value: text.toLocaleLowerCase() },
      { label: "Title Case", value: title },
      { label: "Sentence case", value: sentenceCase(text) },
      { label: "camelCase", value: camel },
      { label: "PascalCase", value: pascal },
      { label: "kebab-case", value: words.map((word) => word.toLocaleLowerCase()).join("-") },
      { label: "snake_case", value: words.map((word) => word.toLocaleLowerCase()).join("_") },
    ];
  }, [text]);

  return (
    <div className="space-y-4">
      <textarea
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
      />

      <div className="space-y-1.5">
        {converted.map((item) => (
          <div key={item.label} className="flex flex-col gap-0.5 rounded-lg border border-border px-4 py-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-muted">{item.label}</span>
            <code className="text-sm break-all">{item.value || "—"}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
