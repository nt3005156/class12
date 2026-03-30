import { useMemo, useState } from "react";
import { sendContactMessage } from "../services/api.js";

const initialForm = {
  name: "",
  email: "",
  category: "Question",
  subject: "",
  message: "",
};

export function ContactForm({ user }) {
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState({ loading: false, error: "", success: "" });

  const defaults = useMemo(
    () => ({
      name: user?.name || "",
      email: user?.email || "",
    }),
    [user]
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setState({ loading: true, error: "", success: "" });
    try {
      const payload = {
        ...form,
        name: form.name || defaults.name,
        email: form.email || defaults.email,
      };
      const data = await sendContactMessage(payload);
      setForm(initialForm);
      setState({ loading: false, error: "", success: data.message });
    } catch (error) {
      setState({ loading: false, error: error.message, success: "" });
    }
  }

  return (
    <section id="contact" className="app-panel rounded-[32px] p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow">Contact</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-[var(--text-strong)]">
            Ask a question or share project feedback
          </h2>
          <p className="mt-4 max-w-xl text-[var(--muted)]">
            This form now connects to the backend and stores messages in MongoDB. It turns the
            project into a proper full-stack example instead of a static page.
          </p>
          <div className="mt-6 grid gap-3">
            <div className="app-subtle-card rounded-2xl p-4">
              <p className="font-medium text-[var(--text-strong)]">For students</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Ask for help on topics, request notes, or report confusing explanations.
              </p>
            </div>
            <div className="app-subtle-card rounded-2xl p-4">
              <p className="font-medium text-[var(--text-strong)]">For teachers</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Collect suggestions for new chapters, corrections, or classroom improvements.
              </p>
            </div>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="form-label">Name</span>
              <input
                className="app-input mt-2"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder={defaults.name || "Your name"}
                required={!defaults.name}
              />
            </label>
            <label className="block">
              <span className="form-label">Email</span>
              <input
                className="app-input mt-2"
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                placeholder={defaults.email || "you@example.com"}
                required={!defaults.email}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
            <label className="block">
              <span className="form-label">Type</span>
              <select
                className="app-input mt-2"
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({ ...current, category: event.target.value }))
                }
              >
                <option>Question</option>
                <option>Feedback</option>
                <option>Collaboration</option>
              </select>
            </label>
            <label className="block">
              <span className="form-label">Subject</span>
              <input
                className="app-input mt-2"
                value={form.subject}
                onChange={(event) =>
                  setForm((current) => ({ ...current, subject: event.target.value }))
                }
                placeholder="Need notes on recursion"
                required
              />
            </label>
          </div>

          <label className="block">
            <span className="form-label">Message</span>
            <textarea
              className="app-input mt-2 min-h-36 resize-y"
              value={form.message}
              onChange={(event) =>
                setForm((current) => ({ ...current, message: event.target.value }))
              }
              placeholder="Write your question, suggestion, or feedback here."
              required
            />
          </label>

          {state.error && (
            <p className="rounded-2xl bg-rose-500/12 px-4 py-3 text-sm text-rose-300">{state.error}</p>
          )}
          {state.success && (
            <p className="rounded-2xl bg-emerald-500/12 px-4 py-3 text-sm text-emerald-300">
              {state.success}
            </p>
          )}

          <button type="submit" className="button-primary" disabled={state.loading}>
            {state.loading ? "Sending..." : "Send message"}
          </button>
        </form>
      </div>
    </section>
  );
}
