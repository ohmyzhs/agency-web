export type HousingPensionHomeType = "general" | "senior" | "officetel";

export type HousingPensionPaymentType =
  | "lifetime-fixed"
  | "lifetime-increase"
  | "lifetime-frontloaded-3"
  | "lifetime-frontloaded-5"
  | "lifetime-frontloaded-7"
  | "lifetime-frontloaded-10"
  | "mixed"
  | "term-fixed"
  | "loan-repayment"
  | "preferential-fixed"
  | "preferential-mixed";

export type HousingPensionResult = {
  eligible: boolean;
  errors: string[];
  ownerAge: number;
  spouseAge: number | null;
  youngestAge: number;
  payoutMonthly: number;
  upfrontWithdrawalLimit: number;
  payoutYearsLabel: string;
  baseMonthly: number;
  monthlyMultiplier: number;
  notes: string[];
};

export type HousingPensionInput = {
  homeType: HousingPensionHomeType;
  homeValueManwon: number;
  ownerBirthDate: string;
  spouseEnabled: boolean;
  spouseBirthDate: string | null;
  paymentType: HousingPensionPaymentType;
  termYears: 10 | 15 | 20 | null;
  outstandingLoanManwon: number;
};

const HOME_TYPE_MULTIPLIER: Record<HousingPensionHomeType, number> = {
  general: 1,
  senior: 0.97,
  officetel: 0.95,
};

const PAYMENT_TYPE_MULTIPLIER: Record<HousingPensionPaymentType, number> = {
  "lifetime-fixed": 1,
  "lifetime-increase": 0.83,
  "lifetime-frontloaded-3": 1.11,
  "lifetime-frontloaded-5": 1.09,
  "lifetime-frontloaded-7": 1.07,
  "lifetime-frontloaded-10": 1.05,
  mixed: 0.86,
  "term-fixed": 1.18,
  "loan-repayment": 0.72,
  "preferential-fixed": 1.18,
  "preferential-mixed": 1.08,
};

const TERM_YEARS_MULTIPLIER: Record<10 | 15 | 20, number> = {
  10: 1.36,
  15: 1.22,
  20: 1.1,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getFullAge(birthDate: string, today = new Date()): number {
  const birth = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return NaN;
  let age = today.getFullYear() - birth.getFullYear();
  const birthdayPassed =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!birthdayPassed) age -= 1;
  return age;
}

export function calculateHousingPension(input: HousingPensionInput): HousingPensionResult {
  const errors: string[] = [];
  const notes: string[] = [];
  const ownerAge = getFullAge(input.ownerBirthDate);
  const spouseAge = input.spouseEnabled && input.spouseBirthDate ? getFullAge(input.spouseBirthDate) : null;

  if (!Number.isFinite(ownerAge)) {
    errors.push("주택소유자 생년월일을 확인해 주세요.");
  }
  if (input.spouseEnabled && spouseAge !== null && !Number.isFinite(spouseAge)) {
    errors.push("배우자 생년월일을 확인해 주세요.");
  }

  const youngestAge = spouseAge === null ? ownerAge : Math.min(ownerAge, spouseAge);

  if (input.homeValueManwon <= 0) {
    errors.push("주택 가격은 0보다 커야 합니다.");
  }
  if (input.homeValueManwon > 120_000) {
    errors.push("주택연금 가입 한도는 공시가격 기준 12억 원 이하를 기준으로 계산합니다.");
  }
  if (ownerAge < 55 || (spouseAge !== null && spouseAge < 55)) {
    errors.push("주택연금은 만 55세 이상을 기준으로 합니다.");
  }
  if (input.paymentType === "term-fixed" && (youngestAge < 55 || youngestAge > 74)) {
    errors.push("확정기간형은 부부 중 연소자가 만 55세~74세인 경우에만 선택할 수 있습니다.");
  }
  if ((input.paymentType === "mixed" || input.paymentType === "preferential-mixed") && !input.spouseEnabled) {
    notes.push("혼합형은 배우자와 함께 설계할 때 의미가 큰 방식입니다. 단독 기준 참고값으로 표시합니다.");
  }
  if (input.paymentType === "loan-repayment" && input.outstandingLoanManwon <= 0) {
    notes.push("대출상환형은 상환할 주택담보대출이 있을 때 의미가 큽니다. 현재 입력값은 대출이 없는 상태 기준입니다.");
  }

  const cappedHomeValue = clamp(input.homeValueManwon, 0, 120_000);
  const protectedRatio = clamp(0.23 + (youngestAge - 55) * 0.011, 0.23, 0.58);
  let baseMonthly = cappedHomeValue * protectedRatio / 12;
  baseMonthly *= HOME_TYPE_MULTIPLIER[input.homeType];

  let monthlyMultiplier = PAYMENT_TYPE_MULTIPLIER[input.paymentType];
  if (input.paymentType === "term-fixed" && input.termYears) {
    monthlyMultiplier *= TERM_YEARS_MULTIPLIER[input.termYears];
  }
  if (input.paymentType === "loan-repayment") {
    const repaymentPenalty = clamp(input.outstandingLoanManwon / Math.max(cappedHomeValue, 1), 0, 0.9);
    monthlyMultiplier *= 1 - repaymentPenalty * 0.35;
  }

  const payoutMonthly = Math.max(0, Math.round(baseMonthly * monthlyMultiplier));

  let withdrawalRatio = 0;
  if (input.paymentType === "mixed") withdrawalRatio = 0.5;
  if (input.paymentType === "term-fixed") withdrawalRatio = 0.5;
  if (input.paymentType === "loan-repayment") withdrawalRatio = 0.9;
  if (input.paymentType === "preferential-mixed") withdrawalRatio = 0.45;

  const upfrontWithdrawalLimit = Math.round(cappedHomeValue * withdrawalRatio);

  let payoutYearsLabel = "종신";
  if (input.paymentType === "term-fixed" && input.termYears) payoutYearsLabel = `${input.termYears}년`;

  if (input.paymentType === "preferential-fixed" || input.paymentType === "preferential-mixed") {
    notes.push("우대형은 실제로는 기초연금 수급권과 2억 원 미만 1주택 여부 등 별도 자격 확인이 필요합니다.");
  }
  notes.push("계산 결과는 공개 설명용 추정치입니다. 실제 월지급금은 한국주택금융공사 조건, 금리, 주택가격 평가, 보증료, 선택 방식에 따라 달라질 수 있습니다.");

  return {
    eligible: errors.length === 0,
    errors,
    ownerAge: Number.isFinite(ownerAge) ? ownerAge : 0,
    spouseAge: spouseAge !== null && Number.isFinite(spouseAge) ? spouseAge : null,
    youngestAge: Number.isFinite(youngestAge) ? youngestAge : 0,
    payoutMonthly,
    upfrontWithdrawalLimit,
    payoutYearsLabel,
    baseMonthly: Math.round(baseMonthly),
    monthlyMultiplier,
    notes,
  };
}
