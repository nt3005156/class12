export function DashboardStats({ items }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Dashboard statistics">
      {items.map((item) => (
        <article key={item.label} className="app-card rounded-[24px] p-5">
          <p className="text-sm font-medium text-[var(--muted)]">{item.label}</p>
          <div className="mt-4 flex items-end justify-between gap-3">
            <p className="font-display text-3xl font-semibold text-[var(--text-strong)]">
              {item.value}
            </p>
            <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent-strong)]">
              {item.hint}
            </span>
          </div>
        </article>
      ))}
    </section>
  );
}
