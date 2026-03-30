import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

export function RequireAdmin({ children, fallback = null }) {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div className="app-panel rounded-[28px] p-10 text-center">Checking admin access...</div>;
  }

  if (!user) {
    return fallback;
  }

  if (user.role !== "admin") {
    return (
      <section className="app-panel rounded-[32px] p-8 text-center">
        <p className="eyebrow">Restricted area</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-[var(--text-strong)]">
          Admin access required
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[var(--muted)]">
          You are logged in as a student account. Ask the project owner to add your email to
          `ADMIN_EMAILS` or update your role in MongoDB.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/" className="button-secondary">
            Back to home
          </Link>
          <button type="button" className="button-primary" onClick={logout}>
            Logout
          </button>
        </div>
      </section>
    );
  }

  return children;
}
