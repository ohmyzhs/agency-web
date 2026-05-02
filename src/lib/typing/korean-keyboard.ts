export type KeyDef = {
  code: string;
  base: string;
  shift?: string;
  hangul?: string;
  hangulShift?: string;
  finger: "L5" | "L4" | "L3" | "L2" | "L1" | "R1" | "R2" | "R3" | "R4" | "R5";
  zone: ZoneId;
};

export type ZoneId =
  | "home"
  | "left-top"
  | "left-bottom"
  | "middle"
  | "right-top"
  | "right-bottom"
  | "number";

export type RowDef = KeyDef[];

// Korean 2-set (두벌식) keyboard layout mapped to QWERTY positions.
export const numberRow: RowDef = [
  { code: "Digit1", base: "1", shift: "!", finger: "L5", zone: "number" },
  { code: "Digit2", base: "2", shift: "@", finger: "L4", zone: "number" },
  { code: "Digit3", base: "3", shift: "#", finger: "L3", zone: "number" },
  { code: "Digit4", base: "4", shift: "$", finger: "L2", zone: "number" },
  { code: "Digit5", base: "5", shift: "%", finger: "L2", zone: "number" },
  { code: "Digit6", base: "6", shift: "^", finger: "R2", zone: "number" },
  { code: "Digit7", base: "7", shift: "&", finger: "R2", zone: "number" },
  { code: "Digit8", base: "8", shift: "*", finger: "R3", zone: "number" },
  { code: "Digit9", base: "9", shift: "(", finger: "R4", zone: "number" },
  { code: "Digit0", base: "0", shift: ")", finger: "R5", zone: "number" },
  { code: "Minus", base: "-", shift: "_", finger: "R5", zone: "number" },
  { code: "Equal", base: "=", shift: "+", finger: "R5", zone: "number" },
];

export const topRow: RowDef = [
  { code: "KeyQ", base: "q", shift: "Q", hangul: "ㅂ", hangulShift: "ㅃ", finger: "L5", zone: "left-top" },
  { code: "KeyW", base: "w", shift: "W", hangul: "ㅈ", hangulShift: "ㅉ", finger: "L4", zone: "left-top" },
  { code: "KeyE", base: "e", shift: "E", hangul: "ㄷ", hangulShift: "ㄸ", finger: "L3", zone: "left-top" },
  { code: "KeyR", base: "r", shift: "R", hangul: "ㄱ", hangulShift: "ㄲ", finger: "L2", zone: "left-top" },
  { code: "KeyT", base: "t", shift: "T", hangul: "ㅅ", hangulShift: "ㅆ", finger: "L2", zone: "left-top" },
  { code: "KeyY", base: "y", shift: "Y", hangul: "ㅛ", finger: "R2", zone: "right-top" },
  { code: "KeyU", base: "u", shift: "U", hangul: "ㅕ", finger: "R2", zone: "right-top" },
  { code: "KeyI", base: "i", shift: "I", hangul: "ㅑ", finger: "R3", zone: "right-top" },
  { code: "KeyO", base: "o", shift: "O", hangul: "ㅐ", hangulShift: "ㅒ", finger: "R4", zone: "right-top" },
  { code: "KeyP", base: "p", shift: "P", hangul: "ㅔ", hangulShift: "ㅖ", finger: "R5", zone: "right-top" },
];

export const homeRow: RowDef = [
  { code: "KeyA", base: "a", shift: "A", hangul: "ㅁ", finger: "L5", zone: "home" },
  { code: "KeyS", base: "s", shift: "S", hangul: "ㄴ", finger: "L4", zone: "home" },
  { code: "KeyD", base: "d", shift: "D", hangul: "ㅇ", finger: "L3", zone: "home" },
  { code: "KeyF", base: "f", shift: "F", hangul: "ㄹ", finger: "L2", zone: "home" },
  { code: "KeyG", base: "g", shift: "G", hangul: "ㅎ", finger: "L2", zone: "middle" },
  { code: "KeyH", base: "h", shift: "H", hangul: "ㅗ", finger: "R2", zone: "middle" },
  { code: "KeyJ", base: "j", shift: "J", hangul: "ㅓ", finger: "R2", zone: "home" },
  { code: "KeyK", base: "k", shift: "K", hangul: "ㅏ", finger: "R3", zone: "home" },
  { code: "KeyL", base: "l", shift: "L", hangul: "ㅣ", finger: "R4", zone: "home" },
  { code: "Semicolon", base: ";", shift: ":", finger: "R5", zone: "home" },
];

export const bottomRow: RowDef = [
  { code: "KeyZ", base: "z", shift: "Z", hangul: "ㅋ", finger: "L5", zone: "left-bottom" },
  { code: "KeyX", base: "x", shift: "X", hangul: "ㅌ", finger: "L4", zone: "left-bottom" },
  { code: "KeyC", base: "c", shift: "C", hangul: "ㅊ", finger: "L3", zone: "left-bottom" },
  { code: "KeyV", base: "v", shift: "V", hangul: "ㅍ", finger: "L2", zone: "left-bottom" },
  { code: "KeyB", base: "b", shift: "B", hangul: "ㅠ", finger: "L2", zone: "left-bottom" },
  { code: "KeyN", base: "n", shift: "N", hangul: "ㅜ", finger: "R2", zone: "right-bottom" },
  { code: "KeyM", base: "m", shift: "M", hangul: "ㅡ", finger: "R2", zone: "right-bottom" },
  { code: "Comma", base: ",", shift: "<", finger: "R3", zone: "right-bottom" },
  { code: "Period", base: ".", shift: ">", finger: "R4", zone: "right-bottom" },
  { code: "Slash", base: "/", shift: "?", finger: "R5", zone: "right-bottom" },
];

export const allRows: RowDef[] = [topRow, homeRow, bottomRow];

export const allKeys: KeyDef[] = [...numberRow, ...topRow, ...homeRow, ...bottomRow];

const codeToHangul: Record<string, string> = {};
const hangulToCode: Record<string, string> = {};
for (const k of allKeys) {
  if (k.shift) {
    hangulToCode[k.shift] = k.code;
  }
  if (k.hangul) {
    codeToHangul[k.code] = k.hangul;
    hangulToCode[k.hangul] = k.code;
  }
  if (k.hangulShift) {
    hangulToCode[k.hangulShift] = k.code;
  }
}

export function codeForHangul(jamo: string): string | undefined {
  if (jamo.length === 1 && /[0-9\-_=+!@#$%^&*(),.<>/?;:]/.test(jamo)) {
    return allKeys.find((k) => k.base === jamo || k.shift === jamo)?.code;
  }
  return hangulToCode[jamo];
}

export function hangulForCode(code: string): string | undefined {
  return codeToHangul[code];
}

export function strokeForCode(code: string, shiftKey = false): string | undefined {
  const key = allKeys.find((k) => k.code === code);
  if (!key) return undefined;
  if (key.hangul || key.hangulShift) {
    return shiftKey ? (key.hangulShift ?? key.hangul) : key.hangul;
  }
  return shiftKey ? (key.shift ?? key.base) : key.base;
}

export function getKeyByCode(code: string): KeyDef | undefined {
  return allKeys.find((k) => k.code === code);
}

// 두벌식 jamo decomposition tables.
const CHO = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
  "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
];
const JUNG = [
  "ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ",
  "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ",
];
const JONG = [
  "", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ",
  "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ",
  "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
];

// Compound jamo that decompose into two simple jamos for 두벌식 input.
const COMPOUND_VOWEL: Record<string, string[]> = {
  "ㅘ": ["ㅗ", "ㅏ"],
  "ㅙ": ["ㅗ", "ㅐ"],
  "ㅚ": ["ㅗ", "ㅣ"],
  "ㅝ": ["ㅜ", "ㅓ"],
  "ㅞ": ["ㅜ", "ㅔ"],
  "ㅟ": ["ㅜ", "ㅣ"],
  "ㅢ": ["ㅡ", "ㅣ"],
};

const COMPOUND_FINAL: Record<string, string[]> = {
  "ㄳ": ["ㄱ", "ㅅ"],
  "ㄵ": ["ㄴ", "ㅈ"],
  "ㄶ": ["ㄴ", "ㅎ"],
  "ㄺ": ["ㄹ", "ㄱ"],
  "ㄻ": ["ㄹ", "ㅁ"],
  "ㄼ": ["ㄹ", "ㅂ"],
  "ㄽ": ["ㄹ", "ㅅ"],
  "ㄾ": ["ㄹ", "ㅌ"],
  "ㄿ": ["ㄹ", "ㅍ"],
  "ㅀ": ["ㄹ", "ㅎ"],
  "ㅄ": ["ㅂ", "ㅅ"],
};

function expandVowel(v: string): string[] {
  return COMPOUND_VOWEL[v] ?? [v];
}

function expandFinal(f: string): string[] {
  if (!f) return [];
  return COMPOUND_FINAL[f] ?? [f];
}

// Decompose any string (Korean or English) into a sequence of expected jamo/letter strokes
// for stat attribution purposes.
export function decomposeForKeystrokes(text: string): string[] {
  const out: string[] = [];
  for (const ch of text) {
    const code = ch.codePointAt(0);
    if (code === undefined) continue;
    if (code >= 0xac00 && code <= 0xd7a3) {
      const offset = code - 0xac00;
      const ji = offset % 28;
      const ju = ((offset - ji) / 28) % 21;
      const ch_ = Math.floor(((offset - ji) / 28) / 21);
      out.push(CHO[ch_]);
      out.push(...expandVowel(JUNG[ju]));
      if (ji > 0) out.push(...expandFinal(JONG[ji]));
    } else if (ch === " ") {
      out.push(" ");
    } else {
      out.push(ch);
    }
  }
  return out;
}
