function formatDate(value) {
  return new Date(value).toLocaleString();
}

export function MessagesPanel({ messages }) {
  return (
    <section className="app-panel rounded-[28px] p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Contact messages</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-[var(--text-strong)]">
            Student and visitor feedback
          </h2>
        </div>
        <span className="app-chip">{messages.length} messages</span>
      </div>

      <div className="mt-6 space-y-4">
        {messages.map((message) => (
          <article key={message._id} className="app-subtle-card rounded-[24px] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[var(--text-strong)]">{message.subject}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {message.name} · {message.email}
                </p>
              </div>
              <div className="text-right">
                <span className="app-subtle-chip">{message.category}</span>
                <p className="mt-2 text-xs text-[var(--muted)]">{formatDate(message.createdAt)}</p>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm text-[var(--text)]">{message.message}</p>
          </article>
        ))}

        {messages.length === 0 && (
          <p className="text-sm text-[var(--muted)]">No contact messages have been submitted yet.</p>
        )}
      </div>
    </section>
  );
}
