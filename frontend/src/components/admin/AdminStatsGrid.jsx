export function AdminStatsGrid({ stats }) {
  const items = [
    { label: "Total notes", value: stats.notes ?? 0 },
    { label: "Messages", value: stats.messages ?? 0 },
    { label: "Users", value: stats.users ?? 0 },
    { label: "Admins", value: stats.admins ?? 0 },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article key={item.label} className="app-card rounded-[24px] p-5">
          <p className="text-sm text-[var(--muted)]">{item.label}</p>
          <p className="mt-4 font-display text-4xl font-semibold text-[var(--text-strong)]">
            {item.value}
          </p>
        </article>
      ))}
    </div>
  );
}
