"use client";

import { useLocale } from "@/components/providers";

const KO = {
  intro: {
    title: "한국어 타자, 어떻게 빠르게 만드나요?",
    body: [
      "타자 속도는 거창한 결심보다 매일 짧게 반복하는 습관에서 만들어집니다. ohmyzhs 타자연습은 자리연습 → 낱말 → 단문 → 장문 → 60초 속도 측정의 다섯 단계를 로비에서 고르고, 실제 연습은 각 전용 화면에서 집중해서 진행하도록 구성했습니다.",
      "처음부터 60초 측정을 반복하기보다는, 자리연습으로 손가락 위치를 교정하고, 낱말과 단문으로 리듬을 맞춘 뒤에 속도 측정을 하는 흐름을 추천합니다.",
    ],
  },
  metrics: {
    title: "\"타/분\"은 어떻게 계산되나요?",
    body: [
      "한컴타자 2024년 기준을 따릅니다. \"타\"는 자모(자소) 단위로 셉니다. 받침 없는 글자(가)는 초성+중성 = 2타, 받침 있는 글자(간)는 초성+중성+종성 = 3타입니다.",
      "정확도는 정타 자모 수를 전체 입력 자모 수로 나눈 비율입니다. 결과 화면에서 이번 타수 · 직전 타수 · 최고 타수 · 목표 타수를 한눈에 비교할 수 있습니다.",
    ],
  },
  ime: {
    title: "한글 IME 조합 중에 빨간 줄이 깜빡이지 않는 이유",
    body: [
      "한글은 자모(초성·중성·종성)가 합쳐지면서 한 글자가 만들어집니다. 음절이 완성되기 전 마지막 글자는 “조합 중”인 상태이므로, 즉시 오타로 표시하면 사용자에게 불필요한 시각적 피로를 줍니다.",
      "본 도구는 조합 중인 글자를 빨간색이 아닌 노란색으로 잠시 표시합니다. 음절이 끝나면 그제서야 정답·오답을 판정합니다. 이렇게 하면 입력의 흐름이 끊기지 않습니다.",
    ],
  },
  privacy: {
    title: "기록은 어디에 저장되나요?",
    body: [
      "최고 기록, 약점 키 통계, 오늘의 연습 시간은 모두 브라우저 내 IndexedDB에만 저장됩니다. 외부 서버로 전송되지 않습니다.",
      "다른 브라우저나 다른 기기에서 접속하면 기록이 동기화되지 않습니다. 향후 선택 로그인 기능이 추가되면 그때부터 동기화 옵션을 제공할 예정입니다.",
    ],
  },
  faq: {
    title: "자주 묻는 질문",
    items: [
      {
        q: "모바일에서도 사용할 수 있나요?",
        a: "사용은 가능하지만, 자리연습 모드는 물리 키보드에서 가장 잘 동작합니다. 모바일은 단문/장문 모드 위주로 활용하는 것을 추천합니다.",
      },
      {
        q: "엄격 모드와 완화 모드의 차이가 있나요?",
        a: "현재 MVP는 완화 모드만 제공합니다. 한 번 입력한 글자는 백스페이스로 수정해 진행할 수 있고, 오타는 정확도에만 반영됩니다.",
      },
      {
        q: "공개 랭킹은 언제 추가되나요?",
        a: "현재는 로그인과 공개 랭킹이 없습니다. 로컬 기록만 제공합니다. 추후 선택 로그인과 검증 기반 랭킹을 별도 페이즈로 추가할 예정입니다.",
      },
      {
        q: "한글이 아닌 글이 더 자연스러운데요?",
        a: "언어 토글에서 영어를 선택하면 같은 모드에서 영어 단어/문장 팩으로 연습할 수 있습니다.",
      },
    ],
  },
  ad: {
    title: "기록과 랭킹은 어떻게 제공되나요?",
    body: [
      "현재 대시보드는 이 브라우저에 저장된 개인 기록, 최근 세션, 약점 키를 보여줍니다. 공개 랭킹은 로그인과 검증 흐름이 준비된 뒤 별도 기능으로 추가할 예정입니다.",
    ],
  },
};

const EN = {
  intro: {
    title: "How to actually get faster at Korean typing",
    body: [
      "Speed comes from short, daily repetition more than ambitious one-off sessions. The typing lobby lets you choose between keyboard zones, words, sentences, long-form passages, and a 60-second test, while each dedicated practice page keeps the actual typing surface focused.",
      "Don't grind the 60-second test from day one. Use zone drills to put your fingers in the right places, settle into a rhythm with words and sentences, then run the test.",
    ],
  },
  metrics: {
    title: "How is \"타/분\" (keystrokes per minute) calculated?",
    body: [
      "We follow the Hancom Taja 2024 standard. One \"타\" (타수) equals one jamo unit: a syllable without a final consonant (e.g. 가) counts as 2, with a final consonant (e.g. 간) counts as 3.",
      "Accuracy is correct jamo over total typed jamo. The result screen shows this session, previous, personal best, and stage target side by side.",
    ],
  },
  ime: {
    title: "Why no red flicker while the Korean IME is composing",
    body: [
      "Korean syllables are built by combining initial, vowel, and final jamo. While the syllable is mid-composition, marking it as an error creates noisy visual feedback.",
      "This tool shows the composing syllable in soft yellow until composition ends. Only then is correctness judged. The result feels far less punishing for long Korean writing.",
    ],
  },
  privacy: {
    title: "Where are my records stored?",
    body: [
      "Best scores, weak-key stats, and daily practice time are kept in your browser's IndexedDB. Nothing is sent to a server.",
      "Records do not sync across devices or browsers. An optional login with sync will be added in a later phase.",
    ],
  },
  faq: {
    title: "Frequently asked",
    items: [
      {
        q: "Does it work on mobile?",
        a: "Yes, but zone drills assume a physical keyboard. On mobile, prefer the sentence and long-form modes.",
      },
      {
        q: "Is there a strict mode?",
        a: "The MVP runs in relaxed mode only — backspace works, and mistakes affect only accuracy. A strict mode will arrive later.",
      },
      {
        q: "When will public leaderboards land?",
        a: "Login and public leaderboards are not part of the MVP. Local records only for now. A separate phase will add optional login and verified rankings.",
      },
      {
        q: "I prefer English text.",
        a: "Use the language toggle to switch any mode to English word, sentence, or passage packs.",
      },
    ],
  },
  ad: {
    title: "Records and ranking dashboard",
    body: [
      "The dashboard currently shows personal records, recent sessions, and weak-key hints stored in this browser. Public leaderboards will be added later with optional login and verified submissions.",
    ],
  },
};

export default function TypingContent() {
  const { locale } = useLocale();
  const c = locale === "ko" ? KO : EN;

  const sections = [
    { ...c.intro, id: "guide" },
    { ...c.metrics, id: "metrics" },
    { ...c.ime, id: "ime" },
    { ...c.privacy, id: "privacy" },
  ];

  return (
    <div className="space-y-10">
      {sections.map((s) => (
        <section key={s.title} id={s.id}>
          <h2 className="text-xl font-semibold tracking-tight">{s.title}</h2>
          {s.body.map((p) => (
            <p key={p} className="mt-3 text-sm leading-relaxed text-muted">
              {p}
            </p>
          ))}
        </section>
      ))}

      <section>
        <h2 className="text-xl font-semibold tracking-tight">{c.faq.title}</h2>
        <div className="mt-4 space-y-4">
          {c.faq.items.map((item) => (
            <div key={item.q}>
              <h3 className="font-medium">{item.q}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold tracking-tight">{c.ad.title}</h2>
        {c.ad.body.map((p) => (
          <p key={p} className="mt-3 text-sm leading-relaxed text-muted">
            {p}
          </p>
        ))}
      </section>
    </div>
  );
}
