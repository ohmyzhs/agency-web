type Props = {
  stage: number;
  passed?: boolean;
  size?: 'sm' | 'md';
};

export function StageBadge({ stage, passed, size = 'md' }: Props) {
  const base = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
  const color =
    passed === true
      ? 'bg-green-500/15 text-green-600 dark:text-green-400'
      : passed === false
      ? 'bg-red-500/15 text-red-500'
      : 'bg-card border border-border text-muted';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${base} ${color}`}>
      <span className="font-mono">{stage}</span>
      <span className="text-[0.65em] opacity-70">타</span>
    </span>
  );
}
