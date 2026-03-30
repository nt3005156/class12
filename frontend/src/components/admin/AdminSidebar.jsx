const items = [
  { id: "overview", label: "Overview" },
  { id: "notes", label: "Notes Manager" },
  { id: "messages", label: "Contact Messages" },
];

export function AdminSidebar({ activeTab, onChange }) {
  return (
    <aside className="app-panel rounded-[28px] p-4">
      <p className="eyebrow px-3 pt-2">Admin Panel</p>
      <nav className="mt-4 space-y-2" aria-label="Admin sections">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
              activeTab === item.id
                ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
                : "bg-transparent text-[var(--muted)] hover:bg-[var(--panel-soft)] hover:text-[var(--text-strong)]"
            }`}
            onClick={() => onChange(item.id)}
          >
            <span>{item.label}</span>
            <span aria-hidden>→</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
