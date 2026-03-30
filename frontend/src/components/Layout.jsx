import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle.jsx";
import { useAuth } from "../hooks/useAuth.jsx";

const linkClass = ({ isActive }) =>
  `rounded-full px-3 py-1.5 text-sm transition ${
    isActive
      ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
      : "text-[var(--muted)] hover:text-[var(--text-strong)]"
  }`;

export function Layout({ children, progressStats, onAuthOpen }) {
  const { pathname } = useLocation();
  const { user, loading, logout } = useAuth();

  return (
    <div className="relative min-h-screen font-body text-[var(--text)]">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--header-bg)]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="group flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-lg font-semibold text-[var(--accent-strong)]">
              N
            </span>
            <div>
              <span className="font-display text-lg font-semibold tracking-[0.14em] text-[var(--text-strong)] sm:text-xl">
                NITEX
              </span>
              <p className="text-xs text-[var(--muted)]">Class 12 Computer Science Hub</p>
            </div>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2" aria-label="Primary">
            <NavLink to="/" end className={linkClass}>
              Modules
            </NavLink>
          </nav>
          <div className="flex items-center gap-2">
            {progressStats && pathname === "/" && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="hidden items-center gap-2 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs text-[var(--accent-strong)] md:flex"
              >
                <span className="h-2 w-2 rounded-full bg-[var(--accent-strong)]" />
                Progress {progressStats.pct}%
                <span className="text-[var(--muted)]">
                  ({progressStats.completed}/{progressStats.total} done)
                </span>
              </motion.div>
            )}
            <ThemeToggle />
            {user ? (
              <>
                <span className="hidden rounded-full bg-[var(--panel-soft)] px-3 py-2 text-sm text-[var(--text-strong)] sm:inline">
                  {user.name}
                </span>
                <button type="button" className="app-icon-button" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                className="button-secondary"
                onClick={() => onAuthOpen?.("login")}
                disabled={loading}
              >
                {loading ? "Checking..." : "Login / Signup"}
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">{children}</main>
      <footer className="border-t border-[var(--border)] py-8 text-center text-xs text-[var(--muted)]">
        Built as a beginner-friendly MERN learning project with rewritten study material, search,
        auth, and backend forms.
      </footer>
    </div>
  );
}
