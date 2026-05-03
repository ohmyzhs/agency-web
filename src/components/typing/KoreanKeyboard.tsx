"use client";

import {
  numberRow,
  topRow,
  homeRow,
  bottomRow,
  type KeyDef,
  type KeyHint,
  type ShiftSide,
  type ZoneId,
} from "@/lib/typing/korean-keyboard";

type KoreanKeyboardProps = {
  expectedKey?: KeyHint;
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

const KEY_UNIT = "clamp(1.65rem, 4vw, 2.35rem)";

type LegendDef = {
  id: string;
  label?: string;
  secondary?: string;
  def?: KeyDef;
  kind?: "key" | "control" | "shift" | "space";
  shiftSide?: ShiftSide;
  span?: number;
  colStart?: number;
};

function control(id: string, label: string, span = 1, kind: LegendDef["kind"] = "control", shiftSide?: ShiftSide): LegendDef {
  return { id, label, span, kind, shiftSide };
}

const keyboardRows: LegendDef[][] = [
  [
    control("Backquote", "`", 1),
    ...numberRow.map((def) => ({ id: def.code, def, kind: "key" as const })),
    control("Backspace", "Backspace", 2),
  ],
  [
    control("Tab", "Tab", 2),
    ...topRow.map((def) => ({ id: def.code, def, kind: "key" as const })),
    control("BracketLeft", "["),
    control("BracketRight", "]"),
    control("Backslash", "\\"),
  ],
  [
    control("CapsLock", "Caps Lock", 2),
    ...homeRow.map((def) => ({ id: def.code, def, kind: "key" as const })),
    control("Quote", "'", 1),
    control("Enter", "Enter", 2),
  ],
  [
    control("ShiftLeft", "Shift", 3, "shift", "left"),
    ...bottomRow.map((def) => ({ id: def.code, def, kind: "key" as const })),
    control("ShiftRight", "Shift", 2, "shift", "right"),
  ],
  [{ ...control("Space", "Space", 7, "space"), colStart: 5 }],
];

function KeyCap({
  item,
  expected,
  highlightZone,
  showHangul,
}: {
  item: LegendDef;
  expected?: KeyHint;
  highlightZone?: ZoneId;
  showHangul: boolean;
}) {
  const def = item.def;
  const isExpected = def && expected?.code === def.code;
  const isExpectedControl = !def && expected?.code === item.id;
  const isRequiredShift = item.kind === "shift" && expected?.shiftSide === item.shiftSide;
  const isInZone = def && highlightZone && def.zone === highlightZone;
  const fingerBorder = def ? (fingerColor[def.finger] ?? "border-border") : "border-border";
  const shiftLabel = def?.hangulShift ?? (def && !/^[a-z]$/.test(def.base) ? def.shift : undefined);

  return (
    <div
      className={[
        "relative flex h-10 min-w-0 shrink-0 items-center justify-center rounded-[4px] border bg-background text-center font-mono text-[10px] leading-none shadow-sm transition-colors sm:h-12",
        item.kind === "control" || item.kind === "shift" || item.kind === "space" ? "px-1 text-muted" : fingerBorder,
        isExpected || isExpectedControl || isRequiredShift
          ? "border-primary bg-accent text-foreground ring-2 ring-primary"
          : isInZone
            ? "bg-accent/40 text-foreground"
            : "text-muted",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        gridColumn: item.colStart
          ? `${item.colStart} / span ${item.span ?? 1}`
          : `span ${item.span ?? 1} / span ${item.span ?? 1}`,
      }}
      aria-label={def ? `${def.base}${def.hangul ? ` ${def.hangul}` : ""}` : item.label}
    >
      {def ? (
        <>
          <span className="absolute left-1 top-1 text-[9px] uppercase text-muted-foreground/80">{def.base}</span>
          {shiftLabel ? (
            <span className="absolute right-1 top-1 rounded-sm bg-muted/60 px-1 text-[9px] font-semibold text-muted-foreground">
              ⇧{shiftLabel}
            </span>
          ) : null}
          {showHangul && def.hangul ? (
            <span className="absolute bottom-1 right-1.5 text-base font-semibold text-foreground sm:text-lg">
              {def.hangul}
            </span>
          ) : null}
        </>
      ) : (
        <span className={item.kind === "space" ? "text-xs" : "text-[10px]"}>{item.label}</span>
      )}
    </div>
  );
}

export default function KoreanKeyboard({
  expectedKey,
  highlightZone,
  showHangul = true,
  showNumberRow = true,
}: KoreanKeyboardProps) {
  const rows = showNumberRow ? keyboardRows : keyboardRows.slice(1);

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card px-3 py-4">
      <div
        className="mx-auto grid w-max gap-1.5"
        style={{ gridTemplateColumns: `repeat(15, ${KEY_UNIT})` }}
      >
        {rows.flatMap((row, rowIndex) =>
          row.map((item) => (
            <KeyCap
              key={`${rowIndex}-${item.id}`}
              item={item}
              expected={expectedKey}
              highlightZone={highlightZone}
              showHangul={showHangul}
            />
          )),
        )}
      </div>
      <p className="mt-3 text-center text-[11px] text-muted">
        Shift 조합은 표준 터치타이핑 기준으로 반대손 Shift를 강조합니다. 예: ㅃ = 오른쪽 Shift + ㅂ, ㅒ = 왼쪽 Shift + ㅐ.
      </p>
    </div>
  );
}
