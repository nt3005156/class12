import { useVisitorCount } from "../hooks/useVisitorCount.jsx";

export function VisitorCounter() {
  const { count, loading } = useVisitorCount();

  return (
    <div className="fixed bottom-5 left-5 z-30 sm:bottom-8 sm:left-8">
      <div className="app-panel flex items-center gap-3 rounded-2xl px-4 py-3 shadow-[var(--shadow-soft)]">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-lg text-[var(--accent-strong)]"
          aria-hidden
        >
          👁
        </span>
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--muted)]">Visitors</p>
          <p className="font-display text-lg text-[var(--text-strong)]">
            {loading ? "..." : count.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
