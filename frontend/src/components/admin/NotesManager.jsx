export function NotesManager({ notes, onEdit, onDelete }) {
  return (
    <section className="app-panel rounded-[28px] p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Notes manager</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-[var(--text-strong)]">
            Existing chapters
          </h2>
        </div>
        <span className="app-chip">{notes.length} notes</span>
      </div>

      <div className="mt-6 space-y-3">
        {notes.map((note) => (
          <article
            key={note.slug}
            className="app-subtle-card flex flex-wrap items-start justify-between gap-4 rounded-[24px] p-4"
          >
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent-strong)]">
                {note.category}
              </p>
              <h3 className="mt-2 font-display text-xl text-[var(--text-strong)]">
                {note.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{note.summary}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="button-secondary" onClick={() => onEdit(note)}>
                Edit
              </button>
              <button type="button" className="button-primary" onClick={() => onDelete(note.slug)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
