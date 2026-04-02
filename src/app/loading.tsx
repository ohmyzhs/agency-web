export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <div className="animate-pulse space-y-8">
        <div className="h-10 w-2/3 rounded-lg bg-card" />
        <div className="h-5 w-1/2 rounded-lg bg-card" />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 rounded-xl border border-border bg-card" />
          ))}
        </div>
      </div>
    </div>
  );
}
