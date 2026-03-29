import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const linkClass = ({ isActive }) =>
  `rounded-full px-3 py-1.5 text-sm transition ${
    isActive
      ? "bg-cyan-500/15 text-cyan-200 shadow-neon"
      : "text-slate-400 hover:text-cyan-100"
  }`;

export function Layout({ children, progressStats }) {
  const { pathname } = useLocation();

  return (
    <div className="relative min-h-screen font-body">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-void/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="group flex items-center gap-2">
            <span className="font-display text-lg font-bold tracking-[0.2em] sm:text-xl">
              <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
                NITEX
              </span>
            </span>
            <span className="hidden rounded border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-slate-500 sm:inline">
              Class 12 · CS
            </span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2" aria-label="Primary">
            <NavLink to="/" end className={linkClass}>
              Modules
            </NavLink>
          </nav>
          {progressStats && pathname === "/" && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-200 md:flex"
            >
              <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_12px_#a78bfa]" />
              Progress {progressStats.pct}%
              <span className="text-slate-500">
                ({progressStats.completed}/{progressStats.total} done)
              </span>
            </motion.div>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">{children}</main>
      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-500">
        Original study material rewritten for clarity. Not affiliated with third-party blogs.
      </footer>
    </div>
  );
}
