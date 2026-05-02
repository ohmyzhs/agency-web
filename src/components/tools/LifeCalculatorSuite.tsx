"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/components/providers";

type Mode = "dates" | "dday" | "stopwatch" | "pomodoro" | "percent" | "vat" | "tip" | "loan" | "salary" | "retire" | "annual";
const modes: Mode[] = ["dates", "dday", "stopwatch", "pomodoro", "percent", "vat", "tip", "loan", "salary", "retire", "annual"];
const inputClass = "rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";
function daysBetween(a: string, b: string) { const d1 = new Date(`${a}T00:00:00`), d2 = new Date(`${b}T00:00:00`); return Math.round((d2.getTime() - d1.getTime()) / 86400000); }
function money(v: number) { return Math.round(v).toLocaleString(); }

export default function LifeCalculatorSuite() {
  const { locale } = useLocale();
  const [mode, setMode] = useState<Mode>("dates");
  const today = new Date().toISOString().slice(0,10);
  const [aDate, setADate] = useState(today); const [bDate, setBDate] = useState(today);
  const [amount, setAmount] = useState(100000); const [rate, setRate] = useState(10); const [months, setMonths] = useState(12);
  const [elapsed, setElapsed] = useState(0); const [running, setRunning] = useState(false); const timer = useRef<number | null>(null);
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25); const [remaining, setRemaining] = useState(25 * 60); const [pomodoroOn, setPomodoroOn] = useState(false);

  const t = locale === "ko" ? {
    intro: "날짜/D-Day, 스톱워치/포모도로, 퍼센트·부가세·팁·대출·급여·퇴직금·연차 계산을 한 생활 계산기 묶음으로 제공합니다. 세무/노무 결과는 참고용입니다.",
    labels: { dates: "날짜", dday: "D-Day", stopwatch: "스톱워치", pomodoro: "포모도로", percent: "퍼센트", vat: "부가세", tip: "팁", loan: "대출", salary: "급여", retire: "퇴직금", annual: "연차" } as Record<Mode,string>,
  } : {
    intro: "Date/D-Day, stopwatch/pomodoro, percent, VAT, tip, loan, salary, severance, and annual-leave calculators in one lifestyle suite. Payroll/legal outputs are estimates.",
    labels: { dates: "Dates", dday: "D-Day", stopwatch: "Stopwatch", pomodoro: "Pomodoro", percent: "Percent", vat: "VAT", tip: "Tip", loan: "Loan", salary: "Salary", retire: "Severance", annual: "Annual leave" } as Record<Mode,string>,
  };
  useEffect(() => { if (!running) return; timer.current = window.setInterval(() => setElapsed((v) => v + 1), 1000); return () => { if (timer.current) window.clearInterval(timer.current); }; }, [running]);
  useEffect(() => { if (!pomodoroOn) return; const id = window.setInterval(() => setRemaining((v) => Math.max(0, v - 1)), 1000); return () => window.clearInterval(id); }, [pomodoroOn]);
  useEffect(() => { setRemaining(pomodoroMinutes * 60); }, [pomodoroMinutes]);
  const calc = useMemo(() => {
    const monthlyRate = rate / 100 / 12; const n = Math.max(1, months);
    const loanPay = monthlyRate === 0 ? amount / n : amount * monthlyRate * (1 + monthlyRate) ** n / ((1 + monthlyRate) ** n - 1);
    const gross = amount; const estimatedDeductions = gross * 0.091 + Math.max(0, gross - 2_000_000) * 0.02;
    return { diff: daysBetween(aDate, bDate), percent: amount * rate / 100, vat: amount / 11, vatIncluded: amount * 1.1, tip: amount * rate / 100, totalTip: amount * (1 + rate / 100), loanPay, loanTotal: loanPay * n, netSalary: gross - estimatedDeductions, retire: gross * months / 12, annual: months < 12 ? Math.max(0, Math.floor(months)) : 15 + Math.floor((months - 12) / 24) };
  }, [aDate, amount, bDate, months, rate]);
  const time = (s: number) => `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor(s/60)%60).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return <div className="space-y-5"><div className="rounded-xl border border-border bg-accent p-4 text-sm text-muted">{t.intro}</div><div className="flex flex-wrap gap-2">{modes.map((m) => <button key={m} onClick={() => setMode(m)} className={`rounded-full border px-3 py-2 text-sm ${mode===m ? "border-primary bg-primary text-white" : "border-border"}`}>{t.labels[m]}</button>)}</div>
    {(mode === "dates" || mode === "dday") && <Panel><div className="grid gap-3 sm:grid-cols-2"><input type="date" className={inputClass} value={aDate} onChange={(e) => setADate(e.target.value)} /><input type="date" className={inputClass} value={bDate} onChange={(e) => setBDate(e.target.value)} /></div><Result text={mode === "dday" ? `D${calc.diff >= 0 ? "-" : "+"}${Math.abs(calc.diff)}` : `${calc.diff.toLocaleString()} days`} /></Panel>}
    {mode === "stopwatch" && <Panel><div className="text-5xl font-semibold tabular-nums">{time(elapsed)}</div><div className="flex gap-2"><button onClick={() => setRunning(!running)} className="rounded bg-primary px-4 py-2 text-white">{running ? "Pause" : "Start"}</button><button onClick={() => { setElapsed(0); setRunning(false); }} className="rounded border border-border px-4 py-2">Reset</button></div></Panel>}
    {mode === "pomodoro" && <Panel><input type="number" className={inputClass} value={pomodoroMinutes} onChange={(e) => setPomodoroMinutes(Number(e.target.value))} /><div className="text-5xl font-semibold tabular-nums">{time(remaining)}</div><div className="flex gap-2"><button onClick={() => setPomodoroOn(!pomodoroOn)} className="rounded bg-primary px-4 py-2 text-white">{pomodoroOn ? "Pause" : "Start"}</button><button onClick={() => { setPomodoroOn(false); setRemaining(pomodoroMinutes * 60); }} className="rounded border border-border px-4 py-2">Reset</button></div></Panel>}
    {!["dates","dday","stopwatch","pomodoro"].includes(mode) && <Panel><div className="grid gap-3 sm:grid-cols-3"><label className="grid gap-1 text-sm">Amount<input type="number" className={inputClass} value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></label><label className="grid gap-1 text-sm">Rate %<input type="number" className={inputClass} value={rate} onChange={(e) => setRate(Number(e.target.value))} /></label><label className="grid gap-1 text-sm">Months/years<input type="number" className={inputClass} value={months} onChange={(e) => setMonths(Number(e.target.value))} /></label></div>{mode === "percent" && <Result text={`${money(calc.percent)} (${rate}% of ${money(amount)})`} />}{mode === "vat" && <Result text={`VAT: ${money(calc.vat)} · add VAT: ${money(calc.vatIncluded)}`} />}{mode === "tip" && <Result text={`Tip: ${money(calc.tip)} · Total: ${money(calc.totalTip)}`} />}{mode === "loan" && <Result text={`Monthly: ${money(calc.loanPay)} · Total: ${money(calc.loanTotal)}`} />}{mode === "salary" && <Result text={`Estimated net: ${money(calc.netSalary)}`} />}{mode === "retire" && <Result text={`Estimated severance: ${money(calc.retire)}`} />}{mode === "annual" && <Result text={`Estimated annual leave: ${calc.annual} days`} />}</Panel>}
  </div>;
}
function Panel({ children }: { children: React.ReactNode }) { return <div className="space-y-4 rounded-xl border border-border p-4">{children}</div>; }
function Result({ text }: { text: string }) { return <output className="block rounded-lg bg-card p-4 text-2xl font-semibold">{text}</output>; }
