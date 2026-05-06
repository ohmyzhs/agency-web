"use client";

import { useLocale } from "@/components/providers";

const KO = {
  intro: {
    title: "기록보다 먼저 잡아야 할 것은 손의 흐름입니다",
    body: [
      "타자 속도는 의욕으로 끌어올리는 숫자가 아니라 손이 기억하는 순서에 가깝습니다. 처음에는 어느 손가락이 어느 키를 맡는지 익히고, 그다음 짧은 낱말로 리듬을 만들고, 문장과 긴 글에서 흐름을 유지해야 실제 문서 작성 속도가 올라갑니다.",
      "oh-my-zhs 타자연습은 이 순서를 기준으로 설계했습니다. 자리연습은 키 위치를, 낱말연습은 반응 속도를, 단문연습은 정확도를, 장문/필사는 긴 호흡을 맡습니다. 워드 디펜스는 같은 훈련을 게임처럼 빠르게 반복하게 해줍니다.",
    ],
  },
  metrics: {
    title: "한글 타수는 자모 단위로 계산합니다",
    body: [
      "한글은 영어처럼 글자 하나가 곧 키 한 번이 아닙니다. '가'는 ㄱ과 ㅏ, '간'은 ㄱ과 ㅏ와 ㄴ으로 입력됩니다. 이 서비스는 한컴타자 방식에 맞춰 초성·중성·종성 자모를 기준으로 타수를 계산합니다.",
      "그래서 화면의 타/분은 단순 글자 수가 아니라 실제 손가락이 움직인 양에 가깝습니다. 현재 지문 결과와 이번 연습 결과를 나눠 보여주기 때문에, 방금 친 문장이 좋았는지 오늘 전체 흐름이 좋아졌는지도 따로 볼 수 있습니다.",
    ],
  },
  ime: {
    title: "한글 조합 중에는 성급하게 오타로 몰지 않습니다",
    body: [
      "한글 입력은 초성, 중성, 종성이 합쳐지며 한 음절이 됩니다. 아직 조합 중인 글자를 즉시 빨간색으로 표시하면 사용자는 틀리지 않았는데도 방해를 받습니다.",
      "oh-my-zhs는 조합 중인 글자를 부드럽게 표시하고, 음절이 완성된 뒤에 정오를 판단합니다. 특히 문장과 장문을 오래 칠 때 이 차이가 큽니다. 화면이 사용자를 재촉하지 않고, 입력 흐름을 따라갑니다.",
    ],
  },
  practice: {
    title: "짧게 들어와도 이어서 연습할 수 있게 만들었습니다",
    body: [
      "기록은 이 브라우저에 저장됩니다. 오늘 얼마나 연습했는지, 최근 최고 타수가 얼마인지, 자주 틀리는 자모가 무엇인지 로비에서 바로 확인할 수 있습니다.",
      "로그인이나 공개 랭킹 없이도 매일 쓰는 연습 도구로 충분히 돌아가게 만드는 것이 먼저입니다. 나중에 동기화와 검증 랭킹을 붙이더라도, 지금의 핵심은 개인 연습 경험을 가볍고 빠르게 유지하는 것입니다.",
    ],
  },
  faq: {
    title: "자주 묻는 질문",
    items: [
      {
        q: "처음 오면 어떤 모드부터 하면 좋나요?",
        a: "손 위치가 불안하면 자리연습부터, 이미 키 위치를 안다면 낱말연습으로 시작하세요. 기록을 재고 싶을 때만 단문이나 장문으로 넘어가도 충분합니다.",
      },
      {
        q: "모바일에서도 쓸 수 있나요?",
        a: "단문과 장문은 모바일에서도 사용할 수 있습니다. 다만 자리연습은 두벌식 물리 키보드를 기준으로 설계했기 때문에 노트북이나 데스크톱에서 가장 자연스럽습니다.",
      },
      {
        q: "내 기록이 서버에 올라가나요?",
        a: "현재 기록은 브라우저 안의 IndexedDB에 저장됩니다. 서버 계정이나 공개 랭킹이 없으므로 다른 기기와 자동 동기화되지는 않습니다.",
      },
      {
        q: "워드 디펜스는 그냥 게임인가요?",
        a: "게임처럼 보이지만 자모 반응 속도를 반복 훈련하는 모드입니다. 단어가 떨어지는 압박 속에서 초성·중성·종성을 빠르게 조합하는 감각을 익힐 수 있습니다.",
      },
    ],
  },
  records: {
    title: "기록은 자랑보다 복습을 위해 씁니다",
    body: [
      "대시보드는 최고 점수를 과장해서 보여주기보다 최근 흐름과 약점 키를 확인하는 데 초점을 둡니다. 어떤 자모에서 자주 흔들리는지 알면 다음 연습을 고르기 쉬워집니다.",
    ],
  },
};

const EN = {
  intro: {
    title: "Build the flow before chasing the score",
    body: [
      "Typing speed is less about forcing a number up and more about letting your hands learn the route. Start with key positions, build rhythm with short words, then keep that rhythm through sentences and longer passages.",
      "oh-my-zhs Typing follows that path: zone drills for placement, word drills for reaction, sentence practice for accuracy, long-form typing for endurance, and Word Defense for fast jamo-level response under pressure.",
    ],
  },
  metrics: {
    title: "Korean speed is measured by jamo, not visible characters",
    body: [
      "A Korean syllable is built from multiple keystrokes. '가' uses ㄱ and ㅏ; '간' adds ㄴ. This service counts typing speed by Korean jamo units, following the same idea used by Hancom-style Korean typing scores.",
      "That makes 타/분 closer to actual finger work than a simple character count. Current-passage results and session results are separated so you can see both the last prompt and the overall practice flow.",
    ],
  },
  ime: {
    title: "The interface respects Korean IME composition",
    body: [
      "Korean input is assembled while you type. Marking a syllable red before composition finishes makes the screen noisy even when you have not made a mistake.",
      "oh-my-zhs waits for the composed syllable before judging it. During sentence and long-form practice, that small detail makes the screen feel calmer and more faithful to real Korean typing.",
    ],
  },
  practice: {
    title: "Designed for short daily sessions",
    body: [
      "Your records stay in this browser. The lobby shows today’s practice time, recent best speed, and weak jamo so you can decide what to train next without opening a separate dashboard first.",
      "There is no login or public leaderboard yet. The priority is a fast, useful personal practice tool. Sync and verified rankings can come later without weakening the daily flow.",
    ],
  },
  faq: {
    title: "Frequently asked",
    items: [
      {
        q: "Where should I start?",
        a: "If your finger placement feels shaky, start with zone drills. If you already know the keyboard, start with word practice and move to sentences when you want accuracy work.",
      },
      {
        q: "Does it work on mobile?",
        a: "Sentence and long-form modes work on mobile. Zone drills are designed around a physical two-set Korean keyboard, so they feel best on a laptop or desktop.",
      },
      {
        q: "Are my records uploaded?",
        a: "No. Records are stored in this browser’s IndexedDB for now, so they do not sync automatically across devices.",
      },
      {
        q: "Is Word Defense just a game?",
        a: "It is a game layer on top of typing practice. The falling words train quick jamo-level recognition and composition under time pressure.",
      },
    ],
  },
  records: {
    title: "Records are for choosing the next drill",
    body: [
      "The dashboard is less about showing off a high score and more about showing your recent rhythm and weak keys. Once you know where your hands slip, the next practice choice becomes obvious.",
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
    { ...c.practice, id: "privacy" },
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
        <h2 className="text-xl font-semibold tracking-tight">{c.records.title}</h2>
        {c.records.body.map((p) => (
          <p key={p} className="mt-3 text-sm leading-relaxed text-muted">
            {p}
          </p>
        ))}
      </section>
    </div>
  );
}
