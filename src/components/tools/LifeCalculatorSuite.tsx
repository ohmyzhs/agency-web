"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/components/providers";

type Mode = "dates" | "dday" | "stopwatch" | "pomodoro" | "percent" | "vat" | "tip" | "loan" | "salary" | "retire" | "annual";
const modes: Mode[] = ["dates", "dday", "stopwatch", "pomodoro", "percent", "vat", "tip", "loan", "salary", "retire", "annual"];
const inputClass = "rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

function daysBetween(a: string, b: string) {
  const d1 = new Date(`${a}T00:00:00`);
  const d2 = new Date(`${b}T00:00:00`);
  return Math.round((d2.getTime() - d1.getTime()) / 86400000);
}
function addDays(date: string, days: number) {
  const d = new Date(`${date}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
function money(value: number) {
  return Math.round(Number.isFinite(value) ? value : 0).toLocaleString();
}
function time(seconds: number) {
  const positive = Math.max(0, seconds);
  return `${String(Math.floor(positive / 3600)).padStart(2, "0")}:${String(Math.floor(positive / 60) % 60).padStart(2, "0")}:${String(positive % 60).padStart(2, "0")}`;
}
function monthlyPayment(principal: number, annualRate: number, months: number) {
  const n = Math.max(1, months);
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / n;
  return principal * monthlyRate * (1 + monthlyRate) ** n / ((1 + monthlyRate) ** n - 1);
}
function annualLeave(monthsWorked: number, weeklyHours: number) {
  if (weeklyHours < 15) return 0;
  if (monthsWorked < 12) return Math.max(0, Math.floor(monthsWorked));
  return Math.min(25, 15 + Math.floor((monthsWorked - 12) / 24));
}

export default function LifeCalculatorSuite() {
  const { locale } = useLocale();
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [mode, setMode] = useState<Mode>("dates");
  const [aDate, setADate] = useState(today);
  const [bDate, setBDate] = useState(addDays(today, 30));
  const [offsetDays, setOffsetDays] = useState(100);
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(10);
  const [months, setMonths] = useState(12);
  const [salary, setSalary] = useState(3_000_000);
  const [bonus, setBonus] = useState(0);
  const [weeklyHours, setWeeklyHours] = useState(40);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [remaining, setRemaining] = useState(25 * 60);
  const [pomodoroOn, setPomodoroOn] = useState(false);
  const [phase, setPhase] = useState<"focus" | "break">("focus");
  const timer = useRef<number | null>(null);

  const t = locale === "ko" ? {
    intro: "날짜/D-Day, 스톱워치/포모도로, 퍼센트·부가세·팁·대출·급여·퇴직금·연차 계산을 한 생활 계산기 묶음으로 제공합니다. 세무/노무 결과는 단순 추정이며 실제 신고·계약·정산에는 최신 규정 확인이 필요합니다.",
    labels: { dates: "날짜", dday: "D-Day", stopwatch: "스톱워치", pomodoro: "포모도로", percent: "퍼센트", vat: "부가세", tip: "팁", loan: "대출", salary: "급여", retire: "퇴직금", annual: "연차" } as Record<Mode, string>,
    amount: "금액", rate: "비율/연이율(%)", months: "기간(개월)", salary: "월 급여", bonus: "연간 상여", weekly: "주 근로시간", start: "시작", end: "종료", offset: "더할 일수", assumptions: "가정", result: "결과", focus: "집중", rest: "휴식", disclaimer: "참고용 계산입니다.",
  } : {
    intro: "Date/D-Day, stopwatch/pomodoro, percent, VAT, tip, loan, salary, severance, and annual-leave calculators in one lifestyle suite. Payroll/legal outputs are simplified estimates.",
    labels: { dates: "Dates", dday: "D-Day", stopwatch: "Stopwatch", pomodoro: "Pomodoro", percent: "Percent", vat: "VAT", tip: "Tip", loan: "Loan", salary: "Salary", retire: "Severance", annual: "Annual leave" } as Record<Mode, string>,
    amount: "Amount", rate: "Rate/APR (%)", months: "Period (months)", salary: "Monthly salary", bonus: "Annual bonus", weekly: "Weekly hours", start: "Start", end: "End", offset: "Days to add", assumptions: "Assumptions", result: "Result", focus: "Focus", rest: "Break", disclaimer: "Estimate only.",
  };

  useEffect(() => {
    if (!running) return;
    timer.current = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => { if (timer.current) window.clearInterval(timer.current); };
  }, [running]);

  useEffect(() => {
    if (!pomodoroOn) return;
    const id = window.setInterval(() => {
      setRemaining((value) => {
        if (value > 1) return value - 1;
        const nextPhase = phase === "focus" ? "break" : "focus";
        setPhase(nextPhase);
        return (nextPhase === "focus" ? pomodoroMinutes : breakMinutes) * 60;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [breakMinutes, phase, pomodoroMinutes, pomodoroOn]);

  function resetPomodoro(nextPhase: "focus" | "break" = "focus") {
    setPomodoroOn(false);
    setPhase(nextPhase);
    setRemaining((nextPhase === "focus" ? pomodoroMinutes : breakMinutes) * 60);
  }

  const calc = useMemo(() => {
    const diff = daysBetween(aDate, bDate);
    const payment = monthlyPayment(amount, rate, months);
    const grossMonthly = salary;
    const nationalPension = Math.min(grossMonthly, 6_170_000) * 0.045;
    const health = grossMonthly * 0.03545;
    const care = health * 0.1295;
    const employment = grossMonthly * 0.009;
    const simplifiedTax = Math.max(0, grossMonthly - 1_500_000) * 0.035;
    const localTax = simplifiedTax * 0.1;
    const deductions = nationalPension + health + care + employment + simplifiedTax + localTax;
    const averageWage = salary + bonus / 12;
    return {
      diff,
      addedDate: addDays(aDate, offsetDays),
      percent: amount * rate / 100,
      percentIncrease: amount * (1 + rate / 100),
      percentDecrease: amount * (1 - rate / 100),
      vatFromIncluded: amount / 11,
      priceWithoutVat: amount / 1.1,
      vatAdded: amount * 1.1,
      tip: amount * rate / 100,
      totalTip: amount * (1 + rate / 100),
      loanPay: payment,
      loanTotal: payment * Math.max(1, months),
      loanInterest: payment * Math.max(1, months) - amount,
      deductions,
      netSalary: grossMonthly - deductions,
      retire: averageWage * Math.max(0, months) / 12,
      annual: annualLeave(months, weeklyHours),
    };
  }, [aDate, amount, bDate, bonus, months, offsetDays, rate, salary, weeklyHours]);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-accent p-4 text-sm text-muted">{t.intro}</div>
      <div className="flex flex-wrap gap-2">{modes.map((item) => <button key={item} type="button" onClick={() => setMode(item)} className={`rounded-full border px-3 py-2 text-sm ${mode === item ? "border-primary bg-primary text-white" : "border-border hover:bg-accent"}`}>{t.labels[item]}</button>)}</div>

      {(mode === "dates" || mode === "dday") && <Panel><div className="grid gap-3 sm:grid-cols-3"><Field label={t.start}><input type="date" className={inputClass} value={aDate} onChange={(e) => setADate(e.target.value)} /></Field><Field label={t.end}><input type="date" className={inputClass} value={bDate} onChange={(e) => setBDate(e.target.value)} /></Field><Field label={t.offset}><input type="number" className={inputClass} value={offsetDays} onChange={(e) => setOffsetDays(Number(e.target.value))} /></Field></div><div className="grid gap-3 sm:grid-cols-2"><Result label={mode === "dday" ? "D-Day" : t.result} text={mode === "dday" ? `D${calc.diff >= 0 ? "-" : "+"}${Math.abs(calc.diff)}` : `${calc.diff.toLocaleString()} days`} /><Result label="Date + offset" text={calc.addedDate} /></div></Panel>}

      {mode === "stopwatch" && <Panel><div className="text-5xl font-semibold tabular-nums">{time(elapsed)}</div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setRunning(!running)} className="rounded bg-primary px-4 py-2 text-white">{running ? "Pause" : "Start"}</button><button type="button" onClick={() => { setElapsed(0); setRunning(false); }} className="rounded border border-border px-4 py-2">Reset</button></div></Panel>}

      {mode === "pomodoro" && <Panel><div className="grid gap-3 sm:grid-cols-2"><Field label="Focus minutes"><input type="number" className={inputClass} value={pomodoroMinutes} onChange={(e) => setPomodoroMinutes(Number(e.target.value))} /></Field><Field label="Break minutes"><input type="number" className={inputClass} value={breakMinutes} onChange={(e) => setBreakMinutes(Number(e.target.value))} /></Field></div><div className="rounded-lg bg-card p-4"><p className="text-sm text-muted">{phase === "focus" ? t.focus : t.rest}</p><div className="text-5xl font-semibold tabular-nums">{time(remaining)}</div></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setPomodoroOn(!pomodoroOn)} className="rounded bg-primary px-4 py-2 text-white">{pomodoroOn ? "Pause" : "Start"}</button><button type="button" onClick={() => resetPomodoro("focus")} className="rounded border border-border px-4 py-2">Reset</button><button type="button" onClick={() => resetPomodoro(phase === "focus" ? "break" : "focus")} className="rounded border border-border px-4 py-2">Switch</button></div></Panel>}

      {!["dates", "dday", "stopwatch", "pomodoro"].includes(mode) && <Panel><CalculatorInputs mode={mode} t={t} amount={amount} setAmount={setAmount} rate={rate} setRate={setRate} months={months} setMonths={setMonths} salary={salary} setSalary={setSalary} bonus={bonus} setBonus={setBonus} weeklyHours={weeklyHours} setWeeklyHours={setWeeklyHours} />{mode === "percent" && <ResultGrid rows={[[`${rate}%`, money(calc.percent)], ["increase", money(calc.percentIncrease)], ["decrease", money(calc.percentDecrease)]]} />}{mode === "vat" && <ResultGrid rows={[["VAT included", money(calc.vatFromIncluded)], ["net price", money(calc.priceWithoutVat)], ["add VAT", money(calc.vatAdded)]]} />}{mode === "tip" && <ResultGrid rows={[["tip", money(calc.tip)], ["total", money(calc.totalTip)], ["per 4 people", money(calc.totalTip / 4)]]} />}{mode === "loan" && <ResultGrid rows={[["monthly", money(calc.loanPay)], ["total", money(calc.loanTotal)], ["interest", money(calc.loanInterest)]]} />}{mode === "salary" && <ResultGrid rows={[["gross", money(salary)], ["deductions", money(calc.deductions)], ["estimated net", money(calc.netSalary)]]} />}{mode === "retire" && <ResultGrid rows={[["average wage", money(salary + bonus / 12)], ["worked months", String(months)], ["estimated severance", money(calc.retire)]]} />}{mode === "annual" && <ResultGrid rows={[["worked months", String(months)], ["weekly hours", String(weeklyHours)], ["estimated leave", `${calc.annual} days`]]} />}<p className="text-xs text-muted">{t.disclaimer}</p></Panel>}
    </div>
  );
}

function CalculatorInputs(props: { mode: Mode; t: { amount: string; rate: string; months: string; salary: string; bonus: string; weekly: string }; amount: number; setAmount: (v: number) => void; rate: number; setRate: (v: number) => void; months: number; setMonths: (v: number) => void; salary: number; setSalary: (v: number) => void; bonus: number; setBonus: (v: number) => void; weeklyHours: number; setWeeklyHours: (v: number) => void }) {
  const salaryMode = props.mode === "salary" || props.mode === "retire" || props.mode === "annual";
  return <div className="grid gap-3 sm:grid-cols-3">{!salaryMode && <Field label={props.t.amount}><input type="number" className={inputClass} value={props.amount} onChange={(e) => props.setAmount(Number(e.target.value))} /></Field>}{!salaryMode && <Field label={props.t.rate}><input type="number" className={inputClass} value={props.rate} onChange={(e) => props.setRate(Number(e.target.value))} /></Field>}{(props.mode === "loan" || props.mode === "retire" || props.mode === "annual") && <Field label={props.t.months}><input type="number" className={inputClass} value={props.months} onChange={(e) => props.setMonths(Number(e.target.value))} /></Field>}{salaryMode && <Field label={props.t.salary}><input type="number" className={inputClass} value={props.salary} onChange={(e) => props.setSalary(Number(e.target.value))} /></Field>}{props.mode === "retire" && <Field label={props.t.bonus}><input type="number" className={inputClass} value={props.bonus} onChange={(e) => props.setBonus(Number(e.target.value))} /></Field>}{props.mode === "annual" && <Field label={props.t.weekly}><input type="number" className={inputClass} value={props.weeklyHours} onChange={(e) => props.setWeeklyHours(Number(e.target.value))} /></Field>}</div>;
}
function Panel({ children }: { children: React.ReactNode }) { return <div className="space-y-4 rounded-xl border border-border p-4">{children}</div>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-1 text-sm"><span className="font-medium">{label}</span>{children}</label>; }
function Result({ label, text }: { label: string; text: string }) { return <output className="block rounded-lg bg-card p-4"><span className="block text-xs text-muted">{label}</span><strong className="block text-2xl">{text}</strong></output>; }
function ResultGrid({ rows }: { rows: [string, string][] }) { return <div className="grid gap-3 sm:grid-cols-3">{rows.map(([label, value]) => <Result key={label} label={label} text={value} />)}</div>; }
