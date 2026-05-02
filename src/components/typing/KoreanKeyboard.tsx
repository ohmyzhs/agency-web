"use client";

import { numberRow, topRow, homeRow, bottomRow, type KeyDef, type ZoneId } from "@/lib/typing/korean-keyboard";

type KoreanKeyboardProps = {
  expectedKey?: KeyDef;
  highlightZone?: ZoneId;
  showHangul?: boolean;
  showNumberRow?: boolean;
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
}: {
  def: KeyDef;
  expectedCode?: string;
  highlightZone?: ZoneId;
  showHangul: boolean;
}) {
  const isExpected = expectedCode === def.code;
  const isInZone = highlightZone && def.zone === highlightZone;
  const fingerBorder = fingerColor[def.finger] ?? "border-border";

  return (
    <div
      className={[
        "relative h-11 w-11 shrink-0 rounded-md border bg-background text-center text-xs font-mono leading-none transition-colors sm:h-12 sm:w-12",
        fingerBorder,
        isExpected
          ? "ring-2 ring-primary border-primary bg-accent text-foreground"
          : isInZone
            ? "bg-accent/40"
            : "text-muted",
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
  showNumberRow = true,
}: KoreanKeyboardProps) {
  const expectedCode = expectedKey?.code;

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card p-3">
      <div className="mx-auto inline-flex flex-col items-stretch gap-1.5">
        {showNumberRow && (
          <Row keys={numberRow} expectedCode={expectedCode} highlightZone={highlightZone} showHangul={showHangul} indentClass="" />
        )}
        <Row
          keys={topRow}
          expectedCode={expectedCode}
          highlightZone={highlightZone}
          showHangul={showHangul}
          indentClass="pl-[24px] sm:pl-[28px]"
        />
        <Row
          keys={homeRow}
          expectedCode={expectedCode}
          highlightZone={highlightZone}
          showHangul={showHangul}
          indentClass="pl-[36px] sm:pl-[42px]"
        />
        <Row
          keys={bottomRow}
          expectedCode={expectedCode}
          highlightZone={highlightZone}
          showHangul={showHangul}
          indentClass="pl-[60px] sm:pl-[70px]"
        />
        <div className="mt-1 flex justify-center">
          <div className="h-9 w-72 rounded-md border border-border bg-background text-center text-xs leading-9 text-muted sm:w-80">
            space
          </div>
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
  indentClass,
}: {
  keys: KeyDef[];
  expectedCode?: string;
  highlightZone?: ZoneId;
  showHangul: boolean;
  indentClass: string;
}) {
  return (
    <div className={`flex gap-1.5 ${indentClass}`}>
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
