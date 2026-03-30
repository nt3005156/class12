import { useEffect, useState } from "react";

function blankSection() {
  return { heading: "", body: "", highlightsText: "" };
}

function blankForm() {
  return {
    title: "",
    slug: "",
    summary: "",
    order: 0,
    category: "Core",
    tagsText: "",
    readMinutes: 8,
    sections: [blankSection()],
  };
}

function toFormState(note) {
  if (!note) return blankForm();
  return {
    title: note.title || "",
    slug: note.slug || "",
    summary: note.summary || "",
    order: note.order || 0,
    category: note.category || "Core",
    tagsText: Array.isArray(note.tags) ? note.tags.join(", ") : "",
    readMinutes: note.readMinutes || 8,
    sections:
      note.sections?.length > 0
        ? note.sections.map((section) => ({
            heading: section.heading || "",
            body: section.body || "",
            highlightsText: Array.isArray(section.highlights)
              ? section.highlights.join(", ")
              : "",
          }))
        : [blankSection()],
  };
}

export function NoteEditor({ initialNote, onCancel, onSubmit, saving }) {
  const [form, setForm] = useState(blankForm());

  useEffect(() => {
    setForm(toFormState(initialNote));
  }, [initialNote]);

  function updateSection(index, key, value) {
    setForm((current) => ({
      ...current,
      sections: current.sections.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, [key]: value } : section
      ),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // Convert helper text fields into the real API payload shape before sending it to Express.
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim().toLowerCase(),
      summary: form.summary.trim(),
      order: Number(form.order) || 0,
      category: form.category.trim() || "Core",
      readMinutes: Number(form.readMinutes) || 8,
      tags: form.tagsText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      sections: form.sections.map((section) => ({
        heading: section.heading.trim(),
        body: section.body.trim(),
        highlights: section.highlightsText
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      })),
    };

    await onSubmit(payload);
    if (!initialNote) {
      setForm(blankForm());
    }
  }

  return (
    <form className="app-panel rounded-[28px] p-6 space-y-5" onSubmit={handleSubmit}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">{initialNote ? "Edit note" : "Create note"}</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-[var(--text-strong)]">
            {initialNote ? initialNote.title : "New chapter"}
          </h2>
        </div>
        {initialNote && (
          <button type="button" className="button-secondary" onClick={onCancel}>
            Cancel edit
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="form-label">Title</span>
          <input
            className="app-input mt-2"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            required
          />
        </label>
        <label className="block">
          <span className="form-label">Slug</span>
          <input
            className="app-input mt-2"
            value={form.slug}
            onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
            required
          />
        </label>
      </div>

      <label className="block">
        <span className="form-label">Summary</span>
        <textarea
          className="app-input mt-2 min-h-24 resize-y"
          value={form.summary}
          onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
          required
        />
      </label>

      <div className="grid gap-4 md:grid-cols-4">
        <label className="block">
          <span className="form-label">Category</span>
          <input
            className="app-input mt-2"
            value={form.category}
            onChange={(event) =>
              setForm((current) => ({ ...current, category: event.target.value }))
            }
          />
        </label>
        <label className="block">
          <span className="form-label">Order</span>
          <input
            className="app-input mt-2"
            type="number"
            value={form.order}
            onChange={(event) => setForm((current) => ({ ...current, order: event.target.value }))}
          />
        </label>
        <label className="block">
          <span className="form-label">Read minutes</span>
          <input
            className="app-input mt-2"
            type="number"
            value={form.readMinutes}
            onChange={(event) =>
              setForm((current) => ({ ...current, readMinutes: event.target.value }))
            }
          />
        </label>
        <label className="block">
          <span className="form-label">Tags</span>
          <input
            className="app-input mt-2"
            value={form.tagsText}
            onChange={(event) =>
              setForm((current) => ({ ...current, tagsText: event.target.value }))
            }
            placeholder="DBMS, SQL, normalization"
          />
        </label>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-xl text-[var(--text-strong)]">Sections</h3>
          <button
            type="button"
            className="button-secondary"
            onClick={() =>
              setForm((current) => ({
                ...current,
                sections: [...current.sections, blankSection()],
              }))
            }
          >
            Add section
          </button>
        </div>

        {form.sections.map((section, index) => (
          <div key={index} className="app-subtle-card rounded-[24px] p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-[var(--text-strong)]">Section {index + 1}</p>
              {form.sections.length > 1 && (
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      sections: current.sections.filter((_, sectionIndex) => sectionIndex !== index),
                    }))
                  }
                >
                  Remove
                </button>
              )}
            </div>
            <input
              className="app-input"
              value={section.heading}
              onChange={(event) => updateSection(index, "heading", event.target.value)}
              placeholder="Section heading"
              required
            />
            <textarea
              className="app-input min-h-28 resize-y"
              value={section.body}
              onChange={(event) => updateSection(index, "body", event.target.value)}
              placeholder="Section body"
              required
            />
            <input
              className="app-input"
              value={section.highlightsText}
              onChange={(event) => updateSection(index, "highlightsText", event.target.value)}
              placeholder="Highlights separated by commas"
            />
          </div>
        ))}
      </div>

      <button type="submit" className="button-primary" disabled={saving}>
        {saving ? "Saving..." : initialNote ? "Update note" : "Create note"}
      </button>
    </form>
  );
}
