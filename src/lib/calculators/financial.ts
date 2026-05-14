export type LoanRepaymentMode = "equal-payment" | "equal-principal" | "bullet";
export type DepositInterestMode = "simple" | "compound-monthly" | "compound-yearly";
export type SavingsInterestMode = "simple" | "compound-monthly";
export type DollarDirection = "usd-to-krw" | "krw-to-usd";
export type DollarRateMode = "base" | "buy" | "sell" | "receive" | "send";
export type MilitaryRateType = "base" | "preferential";
export type YouthRateType = "base" | "preferential";

export type LoanScheduleRow = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
};

export type DepositProjectionRow = {
  period: number;
  interest: number;
  balance: number;
};

export type SavingsProjectionRow = {
  period: number;
  contribution: number;
  interest: number;
  balance: number;
};

export type MilitaryBank = {
  id: string;
  name: string;
  rates: {
    short: number;
    mid: number;
    long: number;
  };
  preferentialBonus: number;
};

export type YouthBank = {
  id: string;
  name: string;
  baseRate: number;
  preferentialBonus: number;
};

export type YouthIncomeBracket = {
  id: string;
  label: string;
  annualIncomeLimitManwon: number;
  monthlyContributionCapManwon: number;
  governmentMatchRate: number;
  governmentMatchCapManwon: number;
};

export const MILITARY_BANKS: MilitaryBank[] = [
  { id: "woori", name: "우리은행", rates: { short: 4, mid: 4.3, long: 5 }, preferentialBonus: 1 },
  { id: "shinhan", name: "신한은행", rates: { short: 4, mid: 4.5, long: 5 }, preferentialBonus: 1 },
  { id: "hana", name: "하나은행", rates: { short: 3.5, mid: 4, long: 5 }, preferentialBonus: 1 },
  { id: "kb", name: "KB국민은행", rates: { short: 3.5, mid: 4, long: 5 }, preferentialBonus: 1 },
  { id: "nh", name: "NH농협은행", rates: { short: 3.5, mid: 4, long: 5 }, preferentialBonus: 1 },
  { id: "ibk", name: "IBK기업은행", rates: { short: 4, mid: 4.5, long: 5 }, preferentialBonus: 1 },
  { id: "busan", name: "BNK부산은행", rates: { short: 3.8, mid: 4.4, long: 5.2 }, preferentialBonus: 1 },
  { id: "daegu", name: "DGB대구은행", rates: { short: 3.8, mid: 4.3, long: 5 }, preferentialBonus: 1 },
];

export const YOUTH_BANKS: YouthBank[] = [
  { id: "kb", name: "KB국민은행", baseRate: 4.5, preferentialBonus: 1 },
  { id: "shinhan", name: "신한은행", baseRate: 4.5, preferentialBonus: 1 },
  { id: "hana", name: "하나은행", baseRate: 4.5, preferentialBonus: 1 },
  { id: "woori", name: "우리은행", baseRate: 4.5, preferentialBonus: 1 },
  { id: "ibk", name: "IBK기업은행", baseRate: 4.5, preferentialBonus: 1 },
  { id: "nh", name: "NH농협은행", baseRate: 4.5, preferentialBonus: 1 },
  { id: "busan", name: "BNK부산은행", baseRate: 4.2, preferentialBonus: 1.1 },
  { id: "gwangju", name: "광주은행", baseRate: 4.0, preferentialBonus: 1.5 },
];

export const YOUTH_INCOME_BRACKETS: YouthIncomeBracket[] = [
  {
    id: "under-2400",
    label: "연 2,400만 원 이하",
    annualIncomeLimitManwon: 2400,
    monthlyContributionCapManwon: 40,
    governmentMatchRate: 0.06,
    governmentMatchCapManwon: 2.4,
  },
  {
    id: "under-3600",
    label: "연 3,600만 원 이하",
    annualIncomeLimitManwon: 3600,
    monthlyContributionCapManwon: 50,
    governmentMatchRate: 0.046,
    governmentMatchCapManwon: 2.3,
  },
  {
    id: "under-4800",
    label: "연 4,800만 원 이하",
    annualIncomeLimitManwon: 4800,
    monthlyContributionCapManwon: 60,
    governmentMatchRate: 0.037,
    governmentMatchCapManwon: 2.2,
  },
  {
    id: "under-6000",
    label: "연 6,000만 원 이하",
    annualIncomeLimitManwon: 6000,
    monthlyContributionCapManwon: 70,
    governmentMatchRate: 0.03,
    governmentMatchCapManwon: 2.1,
  },
];

export const DOLLAR_RATE_PRESETS: Record<DollarRateMode, number> = {
  base: 1473.94,
  buy: 1516.88,
  sell: 1464.72,
  receive: 1476.2,
  send: 1505.4,
};

function round(value: number) {
  return Math.round(Number.isFinite(value) ? value : 0);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function calculateLoanSchedule(input: {
  principalManwon: number;
  annualRate: number;
  months: number;
  graceMonths: number;
  repaymentMode: LoanRepaymentMode;
}) {
  const principal = Math.max(0, input.principalManwon);
  const annualRate = Math.max(0, input.annualRate);
  const months = Math.max(1, Math.floor(input.months));
  const graceMonths = clamp(Math.floor(input.graceMonths), 0, months - 1);
  const monthlyRate = annualRate / 100 / 12;
  const amortizationMonths = Math.max(1, months - graceMonths);

  let balance = principal;
  const rows: LoanScheduleRow[] = [];
  let totalInterest = 0;
  let totalPayment = 0;

  const equalPaymentAmount =
    monthlyRate === 0
      ? balance / amortizationMonths
      : (balance * monthlyRate * (1 + monthlyRate) ** amortizationMonths) / ((1 + monthlyRate) ** amortizationMonths - 1);

  const equalPrincipalAmount = amortizationMonths > 0 ? balance / amortizationMonths : balance;

  for (let month = 1; month <= months; month += 1) {
    const interest = balance * monthlyRate;
    let principalPayment = 0;
    let payment = 0;

    if (month <= graceMonths) {
      payment = interest;
    } else if (input.repaymentMode === "bullet") {
      principalPayment = month === months ? balance : 0;
      payment = interest + principalPayment;
    } else if (input.repaymentMode === "equal-principal") {
      principalPayment = Math.min(balance, equalPrincipalAmount);
      payment = interest + principalPayment;
    } else {
      payment = equalPaymentAmount;
      principalPayment = Math.min(balance, payment - interest);
    }

    balance = Math.max(0, balance - principalPayment);
    totalInterest += interest;
    totalPayment += payment;

    rows.push({
      month,
      payment: round(payment),
      principal: round(principalPayment),
      interest: round(interest),
      balance: round(balance),
    });
  }

  return {
    rows,
    monthlyPaymentManwon: rows[graceMonths]?.payment ?? 0,
    totalInterestManwon: round(totalInterest),
    totalPaymentManwon: round(totalPayment),
  };
}

export function calculateDepositMaturity(input: {
  principalManwon: number;
  annualRate: number;
  months: number;
  interestMode: DepositInterestMode;
}) {
  const principal = Math.max(0, input.principalManwon);
  const annualRate = Math.max(0, input.annualRate) / 100;
  const months = Math.max(1, Math.floor(input.months));
  const years = months / 12;
  const rows: DepositProjectionRow[] = [];

  if (input.interestMode === "simple") {
    const yearlyInterest = principal * annualRate;
    const wholeYears = Math.max(1, Math.ceil(years));
    for (let year = 1; year <= wholeYears; year += 1) {
      const elapsedYears = Math.min(year, years);
      const interest = yearlyInterest * elapsedYears;
      rows.push({ period: year, interest: round(interest), balance: round(principal + interest) });
    }
    return {
      maturityAmountManwon: round(principal + principal * annualRate * years),
      totalInterestManwon: round(principal * annualRate * years),
      rows,
    };
  }

  const compoundsPerYear = input.interestMode === "compound-monthly" ? 12 : 1;
  const periods = input.interestMode === "compound-monthly" ? months : Math.max(1, Math.ceil(years));
  const ratePerPeriod = annualRate / compoundsPerYear;
  let balance = principal;

  for (let period = 1; period <= periods; period += 1) {
    balance *= 1 + ratePerPeriod;
    rows.push({ period, interest: round(balance - principal), balance: round(balance) });
  }

  return {
    maturityAmountManwon: round(balance),
    totalInterestManwon: round(balance - principal),
    rows,
  };
}

export function calculateSavingsMaturity(input: {
  monthlyDepositManwon: number;
  annualRate: number;
  months: number;
  interestMode: SavingsInterestMode;
}) {
  const monthlyDeposit = Math.max(0, input.monthlyDepositManwon);
  const annualRate = Math.max(0, input.annualRate) / 100;
  const months = Math.max(1, Math.floor(input.months));
  const monthlyRate = annualRate / 12;
  const rows: SavingsProjectionRow[] = [];

  let balance = 0;
  let totalContributed = 0;
  let totalInterest = 0;

  for (let month = 1; month <= months; month += 1) {
    totalContributed += monthlyDeposit;
    balance += monthlyDeposit;
    const remainingMonths = months - month + 1;
    let interest = 0;
    if (input.interestMode === "simple") {
      interest = monthlyDeposit * annualRate * (remainingMonths / 12);
      totalInterest += interest;
      balance += interest;
    } else {
      const earned = balance * monthlyRate;
      interest = earned;
      totalInterest += earned;
      balance += earned;
    }
    rows.push({ period: month, contribution: round(totalContributed), interest: round(totalInterest), balance: round(balance) });
  }

  return {
    maturityAmountManwon: round(balance),
    totalContributionManwon: round(totalContributed),
    totalInterestManwon: round(totalInterest),
    rows,
  };
}

export function getMilitaryBankById(id: string) {
  return MILITARY_BANKS.find((bank) => bank.id === id) ?? MILITARY_BANKS[0];
}

export function calculateMilitarySavings(input: {
  bankId: string;
  rateType: MilitaryRateType;
  monthlyDepositManwon: number;
  months: number;
}) {
  const bank = getMilitaryBankById(input.bankId);
  const monthlyDeposit = clamp(input.monthlyDepositManwon, 0, 20);
  const months = clamp(Math.floor(input.months), 6, 24);
  const baseRate = months < 12 ? bank.rates.short : months < 15 ? bank.rates.mid : bank.rates.long;
  const annualRate = baseRate + (input.rateType === "preferential" ? bank.preferentialBonus : 0);
  const savings = calculateSavingsMaturity({
    monthlyDepositManwon: monthlyDeposit,
    annualRate,
    months,
    interestMode: "simple",
  });
  const governmentMatchManwon = monthlyDeposit * months;

  return {
    bank,
    annualRate,
    totalDepositManwon: savings.totalContributionManwon,
    totalInterestManwon: savings.totalInterestManwon,
    governmentMatchManwon: round(governmentMatchManwon),
    maturityAmountManwon: round(savings.maturityAmountManwon + governmentMatchManwon),
  };
}

export function getYouthBankById(id: string) {
  return YOUTH_BANKS.find((bank) => bank.id === id) ?? YOUTH_BANKS[0];
}

export function getYouthIncomeBracketById(id: string) {
  return YOUTH_INCOME_BRACKETS.find((bracket) => bracket.id === id) ?? YOUTH_INCOME_BRACKETS[1];
}

export function calculateYouthAccount(input: {
  bankId: string;
  rateType: YouthRateType;
  incomeBracketId: string;
  monthlyDepositManwon: number;
  months?: number;
}) {
  const bank = getYouthBankById(input.bankId);
  const bracket = getYouthIncomeBracketById(input.incomeBracketId);
  const months = Math.max(1, Math.floor(input.months ?? 60));
  const annualRate = bank.baseRate + (input.rateType === "preferential" ? bank.preferentialBonus : 0);
  const monthlyDeposit = clamp(input.monthlyDepositManwon, 0, bracket.monthlyContributionCapManwon);
  const savings = calculateSavingsMaturity({
    monthlyDepositManwon: monthlyDeposit,
    annualRate,
    months,
    interestMode: "compound-monthly",
  });
  const governmentContributionMonthly = Math.min(
    bracket.governmentMatchCapManwon,
    monthlyDeposit * bracket.governmentMatchRate,
  );
  const governmentContributionManwon = round(governmentContributionMonthly * months);

  return {
    bank,
    bracket,
    annualRate,
    monthlyDepositManwon: monthlyDeposit,
    totalContributionManwon: savings.totalContributionManwon,
    totalInterestManwon: savings.totalInterestManwon,
    governmentContributionManwon,
    maturityAmountManwon: round(savings.maturityAmountManwon + governmentContributionManwon),
  };
}

export function calculateDollarExchange(input: {
  direction: DollarDirection;
  amount: number;
  rateMode: DollarRateMode;
  manualRate?: number | null;
}) {
  const amount = Math.max(0, input.amount);
  const rate = input.manualRate && input.manualRate > 0 ? input.manualRate : DOLLAR_RATE_PRESETS[input.rateMode];
  if (input.direction === "usd-to-krw") {
    return {
      appliedRate: rate,
      krwAmount: round(amount * rate),
      usdAmount: amount,
    };
  }
  return {
    appliedRate: rate,
    krwAmount: amount,
    usdAmount: Number((amount / rate).toFixed(2)),
  };
}
