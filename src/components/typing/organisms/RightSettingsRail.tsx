'use client';
/**
 * Right rail — sound volumes, keyboard/hand toggles, countdown, auto-next, keymap, data IO.
 * All toggles dispatch to useTypingSettings; useTypingDBSync writes them to settings table.
 */
import { useRef, useState } from 'react';
import { useTypingSettings } from '@/stores/useTypingSettings';
import { useDB } from '@/lib/typing/db/provider';

export function RightSettingsRail() {
  const s = useTypingSettings();
  const db = useDB();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [ioStatus, setIoStatus] = useState<string | null>(null);

  async function handleExport() {
    if (!db) return;
    setIoStatus('내보내는 중…');
    try {
      const data = await db.exportAll();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
      a.href = url;
      a.download = `typing-backup-${ts}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setIoStatus('내보내기 완료');
      setTimeout(() => setIoStatus(null), 2000);
    } catch {
      setIoStatus('내보내기 실패');
      setTimeout(() => setIoStatus(null), 2500);
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    if (!db) return;
    const file = e.target.files?.[0];
    if (!file) return;
    setIoStatus('불러오는 중…');
    try {
      const text = await file.text();
      const data = JSON.parse(text) as Record<string, Array<Record<string, unknown>>>;
      // Replay each table via the existing API.
      for (const row of data.settings ?? []) {
        await db.setSetting(String(row.key), String(row.value));
      }
      for (const row of data.streak_days ?? []) {
        await db.recordStreak(String(row.date), Number(row.practice_seconds));
      }
      // Sessions and best_scores are not re-keyed (autoincrement), so we
      // import them as new rows. Imported best_scores get the imported tpm.
      for (const row of data.sessions ?? []) {
        await db.insertSession({
          started_at: Number(row.started_at), finished_at: Number(row.finished_at),
          mode: String(row.mode), language: String(row.language), stage: Number(row.stage),
          lesson_id: row.lesson_id ? String(row.lesson_id) : null,
          content_seed: String(row.content_seed),
          jamo_typed: Number(row.jamo_typed), jamo_correct: Number(row.jamo_correct),
          tpm: Number(row.tpm), tpm_raw: Number(row.tpm_raw),
          accuracy: Number(row.accuracy), duration_seconds: Number(row.duration_seconds),
        });
      }
      for (const row of data.key_stats ?? []) {
        await db.upsertKeyStats(
          String(row.jamo), Number(row.attempts), Number(row.correct),
          Number(row.total_latency_ms),
        );
      }
      setIoStatus('가져오기 완료. 새로고침 권장.');
      setTimeout(() => setIoStatus(null), 3500);
    } catch {
      setIoStatus('JSON 파싱 실패');
      setTimeout(() => setIoStatus(null), 2500);
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <aside className="hidden w-56 shrink-0 space-y-4 lg:block">
      <Section title="음량">
        <SliderRow
          label="타건음"
          value={s.volumeKeySound}
          onChange={s.setVolumeKeySound}
        />
        <SliderRow
          label="효과음"
          value={s.volumeEffect}
          onChange={s.setVolumeEffect}
        />
        <SliderRow
          label="배경음"
          value={s.volumeBgm}
          onChange={s.setVolumeBgm}
        />
      </Section>

      <Section title="화면 표시">
        <ToggleRow
          label="가상 키보드"
          checked={s.showKeyboard}
          onChange={s.setShowKeyboard}
        />
        <ToggleRow
          label="손 가이드"
          checked={s.showHands}
          onChange={s.setShowHands}
        />
      </Section>

      <Section title="진행">
        <ToggleRow
          label="시작 전 카운트다운"
          checked={s.countdownEnabled}
          onChange={s.setCountdownEnabled}
        />
        <ToggleRow
          label="자동 다음 지문"
          checked={s.autoNextContent}
          onChange={s.setAutoNextContent}
        />
      </Section>

      <Section title="데이터">
        <button
          type="button"
          onClick={handleExport}
          className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs font-medium hover:border-primary/50"
        >
          JSON 내보내기
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs font-medium hover:border-primary/50"
        >
          JSON 가져오기
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          onChange={handleImport}
          className="hidden"
        />
        {ioStatus && <p className="text-[10px] text-muted">{ioStatus}</p>}
      </Section>

      <Section title="자판">
        <div className="flex gap-1">
          {(['dubeolsik', 'sebeolsik-final'] as const).map(km => (
            <button
              key={km}
              type="button"
              onClick={() => s.setKeymap(km)}
              disabled={km === 'sebeolsik-final'}
              className={`flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors ${
                s.keymap === km
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-background text-muted hover:border-primary/50'
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {km === 'dubeolsik' ? '두벌식' : '세벌식 (예정)'}
            </button>
          ))}
        </div>
      </Section>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function SliderRow({
  label, value, onChange,
}: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex items-center justify-between gap-2 text-xs">
      <span className="text-muted">{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="w-20 accent-[var(--color-primary,#ff5b1f)]"
        />
        <span className="w-6 text-right tabular-nums">{Math.round(value * 100)}</span>
      </span>
    </label>
  );
}

function ToggleRow({
  label, checked, onChange,
}: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between text-xs">
      <span className="text-muted">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-4 w-7 rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-border'
        }`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-3.5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </label>
  );
}
