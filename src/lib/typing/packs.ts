import type { TypingLanguage } from "./types";

// All content below is original / self-authored. No copyrighted text.

export type ZoneLessonId =
  | "home"
  | "left-top"
  | "left-bottom"
  | "right-top"
  | "right-bottom"
  | "middle"
  | "all";

export type ZoneLesson = {
  id: ZoneLessonId;
  titleKo: string;
  titleEn: string;
  // 두벌식 jamo sequence for the drill. Repeats a small set so muscle memory builds.
  drill: string;
};

export const zoneLessons: ZoneLesson[] = [
  {
    id: "home",
    titleKo: "기본자리 (ㅁㄴㅇㄹ ㅓㅏㅣ)",
    titleEn: "Home row (ㅁㄴㅇㄹ ㅓㅏㅣ)",
    drill:
      "ㅁ ㄴ ㅇ ㄹ ㅓ ㅏ ㅣ ㅁㄴ ㅇㄹ ㅓㅏ ㅣㅁ ㄴㅇ ㄹㅓ ㅏㅣ ㅁㅇ ㄴㄹ ㅓㅣ ㅏㄴ ㅇㄹ ㅓㅁ",
  },
  {
    id: "left-top",
    titleKo: "왼손 윗자리 (ㅂㅈㄷㄱㅅ)",
    titleEn: "Left top (ㅂㅈㄷㄱㅅ)",
    drill:
      "ㅂ ㅈ ㄷ ㄱ ㅅ ㅂㅈ ㄷㄱ ㅅㅂ ㅈㄷ ㄱㅅ ㅂㄷ ㅈㄱ ㄷㅅ ㅂㄱ ㅈㅅ ㄷㅂ ㄱㅈ ㅅㄷ",
  },
  {
    id: "left-bottom",
    titleKo: "왼손 아랫자리 (ㅋㅌㅊㅍㅠ)",
    titleEn: "Left bottom (ㅋㅌㅊㅍㅠ)",
    drill:
      "ㅋ ㅌ ㅊ ㅍ ㅠ ㅋㅌ ㅊㅍ ㅠㅋ ㅌㅊ ㅍㅠ ㅋㅊ ㅌㅍ ㅊㅠ ㅋㅍ ㅌㅠ ㅊㅋ ㅍㅌ ㅠㅊ",
  },
  {
    id: "right-top",
    titleKo: "오른손 윗자리 (ㅛㅕㅑㅐㅔ)",
    titleEn: "Right top (ㅛㅕㅑㅐㅔ)",
    drill:
      "ㅛ ㅕ ㅑ ㅐ ㅔ ㅛㅕ ㅑㅐ ㅔㅛ ㅕㅑ ㅐㅔ ㅛㅑ ㅕㅐ ㅑㅔ ㅛㅐ ㅕㅔ ㅑㅛ ㅐㅕ ㅔㅑ",
  },
  {
    id: "right-bottom",
    titleKo: "오른손 아랫자리 (ㅜㅡ)",
    titleEn: "Right bottom (ㅜㅡ)",
    drill:
      "ㅜ ㅡ ㅜㅡ ㅡㅜ ㅜㅜ ㅡㅡ ㅜㅡㅜ ㅡㅜㅡ ㅜㅡ ㅡㅜ",
  },
  {
    id: "middle",
    titleKo: "가운데자리 (ㅎㅗ)",
    titleEn: "Middle (ㅎㅗ)",
    drill:
      "ㅎ ㅗ ㅎㅗ ㅗㅎ ㅎㅎ ㅗㅗ ㅎㅗㅎ ㅗㅎㅗ ㅎㅗ ㅗㅎ",
  },
  {
    id: "all",
    titleKo: "전체자리 (자모 통합)",
    titleEn: "All keys (mixed jamo)",
    drill:
      "ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ ㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ ㅂㅈㄷㄱㅅㅁㄴㅇㄹㅓㅏㅣㅋㅌㅊㅍㅠㅜㅡ",
  },
];

// Word packs are short, common, and original.
export const koreanWords = [
  "사랑", "친구", "가족", "행복", "오늘", "내일", "어제", "시간", "마음", "이야기",
  "도시", "여행", "음식", "커피", "물건", "시장", "회사", "학교", "책상", "의자",
  "공부", "운동", "습관", "기록", "목표", "계획", "약속", "준비", "시작", "마무리",
  "한국", "서울", "부산", "지하철", "버스", "택시", "공항", "기차", "자전거", "도로",
  "비빔밥", "김치", "라면", "떡볶이", "된장", "삼겹살", "냉면", "치킨", "만두", "과일",
  "빠르게", "정확하게", "자연스럽게", "조용하게", "꾸준히", "부드럽게", "신중하게", "천천히",
  "검색", "정리", "확인", "공유", "저장", "복사", "삭제", "수정", "전송", "다운로드",
];

export const englishWords = [
  "the", "and", "for", "are", "but", "not", "you", "all", "can", "had",
  "her", "was", "one", "our", "out", "day", "get", "has", "him", "his",
  "how", "man", "new", "now", "old", "see", "two", "way", "who", "boy",
  "did", "its", "let", "put", "say", "she", "too", "use", "code", "test",
  "tool", "build", "input", "value", "output", "result", "label", "field",
  "north", "korea", "south", "small", "world", "study", "smart", "logic",
  "review", "system", "create", "design", "memory", "kernel", "format",
  "deploy", "server", "client", "future", "global", "module", "router",
];

// Short sentences — original.
export const koreanSentences = [
  "오늘 아침에는 따뜻한 커피 한 잔으로 하루를 시작했다.",
  "한글 자판이 익숙해지면 손가락이 글자를 먼저 기억한다.",
  "JSON과 YAML은 비슷해 보여도 들여쓰기 규칙이 다르다.",
  "약속 시간 한 시간 전에 미리 도착해서 메모를 정리했다.",
  "오타를 줄이려면 키보드보다 화면을 먼저 보는 습관이 도움이 된다.",
  "자동화는 반복을 없애기 위한 것이지, 일을 늘리기 위한 것이 아니다.",
  "조용한 도구가 좋은 도구다. 사용자가 도구를 잊을 수 있다면 성공이다.",
  "한국 표준시는 일광 절약 시간을 사용하지 않아서 계산이 단순하다.",
  "평수 변환은 1평이 약 3.305785제곱미터라는 비율을 기억하면 쉽다.",
  "타자 연습은 짧고 자주 해야 손가락이 자연스럽게 길을 찾는다.",
];

export const englishSentences = [
  "Small tools that work quietly are easier to keep around than loud ones.",
  "JSON and YAML look similar but indentation rules are not the same.",
  "A deploy script that nobody understands is a deploy script waiting to break.",
  "Practice short and often, not long and rare. Muscle memory wants repetition.",
  "Korea Standard Time stays at UTC plus nine all year, with no daylight shift.",
  "Cron expressions are compact, but a small typo can shift a job by hours.",
  "The best result screen is the one you actually read before clicking next.",
  "A converter that explains its assumptions is more useful than a black box.",
];

// Long-form passages — original.
export const koreanPassages = [
  // beginner
  "타자 연습은 거창한 결심보다 매일 5분의 반복이 더 큰 차이를 만든다. 손가락이 자판의 위치를 외우면, 머리는 글의 내용에 집중할 수 있다. 천천히 정확하게 시작하고, 익숙해지면 속도가 따라온다. 오타는 줄이려고 노력하되, 두려워하지는 말자. 가장 좋은 연습은 오늘 한 줄을 끝까지 마치는 것이다.",
  // intermediate
  "한국어 입력은 자모가 음절로 합쳐지는 과정을 갖기 때문에, 단순한 알파벳 타자와는 다른 리듬이 필요하다. 초성, 중성, 종성이 한 글자에 모이는 동안 화면에는 미완성된 음절이 잠시 머문다. 좋은 타자 도구는 이 조합 중인 글자를 성급하게 오류로 표시하지 않는다. 사용자는 음절이 완성되었을 때 비로소 결과를 확인하고, 자연스럽게 다음 글자로 넘어간다. 이런 작은 배려가 한글 입력의 피로를 크게 줄인다.",
  // advanced
  "자동화 도구를 만들 때 가장 흔히 빠지는 함정은, 처음 만든 사람만 이해할 수 있는 구조로 시스템이 자라는 것이다. 동작하는 프로토타입과 운영 가능한 시스템 사이에는 문서, 모니터링, 실패 복구, 비용 모니터링이라는 큰 거리가 존재한다. 좋은 자동화는 화려한 기능보다도, 누가 운영하든 같은 결과가 나오는 단순함에서 출발한다. 우리는 새 기능을 추가하기 전에, 지금 동작하는 부분이 정말로 단순한지 한 번 더 확인할 책임이 있다. 그 점검이 없는 자동화는 시간이 갈수록 무거워진다.",
];

export const englishPassages = [
  "Typing practice rewards consistency more than ambition. A few minutes a day will outperform a long session once a month. Start slow and accurate. Speed will follow once your fingers stop hesitating about where each letter lives. The best practice session is the one you actually finish today.",
  "Korean input is different from plain alphabetic typing because individual jamos combine into a single syllable on screen. While the syllable is being composed, a good editor avoids flashing a red error on the partial result. Only after the syllable is finalized should correctness be judged. This small consideration makes long Korean writing feel much less tiring than it would otherwise.",
];

// Quick-pick word stream for speed test mode.
export function buildWordStream(language: TypingLanguage, length: number): string {
  const source = language === "ko" ? koreanWords : englishWords;
  const out: string[] = [];
  for (let i = 0; i < length; i += 1) {
    out.push(source[Math.floor(Math.random() * source.length)]);
  }
  return out.join(" ");
}

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
