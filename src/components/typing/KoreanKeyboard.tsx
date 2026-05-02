"use client";

import { topRow, homeRow, bottomRow, type KeyDef, type ZoneId } from "@/lib/typing/korean-keyboard";

type KoreanKeyboardProps = {
  expectedKey?: KeyDef;
  highlightZone?: ZoneId;
  showHangul?: boolean;
};

const fingerColor: Record<string, string> = {
  L5: "border-pink-300/60",
  L4: "border-violet-300/60",
  L3: "border-sky-300/60",
  L2: "border-emerald-300/60",
  L1: "border-amber-300/60",
  R1: "border-amber-300/60",
  R2: "border-emerald-300/60",
  R3: "border-sky-300/60",
  R4: "border-violet-300/60",
  R5: "border-pink-300/60",
};

function Key({
  def,
  expectedCode,
  highlightZone,
  showHangul,
  offsetClass,
}: {
  def: KeyDef;
  expectedCode?: string;
  highlightZone?: ZoneId;
  showHangul: boolean;
  offsetClass?: string;
}) {
  const isExpected = expectedCode === def.code;
  const isInZone = highlightZone && def.zone === highlightZone;
  const fingerBorder = fingerColor[def.finger] ?? "border-border";

  return (
    <div
      className={[
        "relative h-12 w-12 shrink-0 rounded-md border bg-background text-center text-xs font-mono leading-none transition-colors",
        fingerBorder,
        isExpected
          ? "ring-2 ring-primary border-primary bg-accent text-foreground"
          : isInZone
            ? "bg-accent/40"
            : "text-muted",
        offsetClass,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="absolute left-1.5 top-1 text-[10px] uppercase">{def.base}</span>
      {showHangul && def.hangul ? (
        <span className="absolute bottom-1 right-1.5 text-sm font-semibold text-foreground">
          {def.hangul}
        </span>
      ) : null}
    </div>
  );
}

export default function KoreanKeyboard({
  expectedKey,
  highlightZone,
  showHangul = true,
}: KoreanKeyboardProps) {
  const expectedCode = expectedKey?.code;

  return (
    <div className="space-y-1.5 overflow-x-auto rounded-lg border border-border bg-card p-3">
      <Row keys={topRow} expectedCode={expectedCode} highlightZone={highlightZone} showHangul={showHangul} indent="" />
      <Row keys={homeRow} expectedCode={expectedCode} highlightZone={highlightZone} showHangul={showHangul} indent="ml-3" />
      <Row keys={bottomRow} expectedCode={expectedCode} highlightZone={highlightZone} showHangul={showHangul} indent="ml-7" />
      <div className="mt-2 flex items-center justify-center">
        <div className="h-9 w-64 rounded-md border border-border bg-background text-center text-xs leading-9 text-muted">
          space
        </div>
      </div>
    </div>
  );
}

function Row({
  keys,
  expectedCode,
  highlightZone,
  showHangul,
  indent,
}: {
  keys: KeyDef[];
  expectedCode?: string;
  highlightZone?: ZoneId;
  showHangul: boolean;
  indent: string;
}) {
  return (
    <div className={`flex gap-1.5 ${indent}`}>
      {keys.map((k) => (
        <Key
          key={k.code}
          def={k}
          expectedCode={expectedCode}
          highlightZone={highlightZone}
          showHangul={showHangul}
        />
      ))}
    </div>
  );
}
