import { useState } from "react";
import { useAuth } from "../hooks/useAuth.jsx";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form);
    } catch (submitError) {
      setError(submitError.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-xl">
      <div className="hero-panel rounded-[36px] p-8 sm:p-10">
        <p className="eyebrow">Admin Login</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-[var(--text-strong)]">
          Sign in to manage notes and messages
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          Use an account whose email is listed in the backend `ADMIN_EMAILS` environment variable.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="form-label">Admin email</span>
            <input
              className="app-input mt-2"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
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
              required
            />
          </label>

          {error && <p className="rounded-2xl bg-rose-500/12 px-4 py-3 text-sm text-rose-300">{error}</p>}

          <button type="submit" className="button-primary" disabled={loading}>
            {loading ? "Signing in..." : "Login as admin"}
          </button>
        </form>
      </div>
    </section>
  );
}
