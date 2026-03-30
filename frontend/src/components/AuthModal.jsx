import { useEffect, useState } from "react";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

export function AuthModal({ open, mode, onClose, onModeChange, onSubmit, loading }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setForm(initialForm);
      setError("");
    }
  }, [open, mode]);

  if (!open) return null;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      await onSubmit(form);
      onClose();
    } catch (submitError) {
      setError(submitError.message || "Something went wrong");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-8">
      <div className="app-panel w-full max-w-md rounded-[28px] p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Student Portal</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-[var(--text-strong)]">
              {mode === "login" ? "Welcome back" : "Create an account"}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Your details are stored in MongoDB so the project includes a real beginner-friendly
              authentication flow.
            </p>
          </div>
          <button type="button" className="app-icon-button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <label className="block">
              <span className="form-label">Full name</span>
              <input
                className="app-input mt-2"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Sanjana Sharma"
                required
              />
            </label>
          )}
          <label className="block">
            <span className="form-label">Email address</span>
            <input
              className="app-input mt-2"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="student@example.com"
              required
            />
          </label>
          <label className="block">
            <span className="form-label">Password</span>
            <input
              className="app-input mt-2"
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
              placeholder="At least 6 characters"
              required
            />
          </label>

          {error && <p className="rounded-2xl bg-rose-500/12 px-4 py-3 text-sm text-rose-300">{error}</p>}

          <button type="submit" className="button-primary w-full justify-center" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}
          </button>
        </form>

        <div className="mt-4 text-sm text-[var(--muted)]">
          {mode === "login" ? "New here?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="font-semibold text-[var(--text-strong)] underline decoration-[var(--accent)] underline-offset-4"
            onClick={() => onModeChange(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Create one" : "Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}
