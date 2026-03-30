import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getChapter } from "../services/api.js";
import { formatRichText } from "../utils/formatRichText.jsx";
import { useBookmarks } from "../hooks/useBookmarks.js";
import { useProgress } from "../hooks/useProgress.js";

export default function NoteDetail() {
  const { slug } = useParams();
  const [note, setNote] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toggle, has } = useBookmarks();
  const { markVisited, toggleCompleted, map } = useProgress();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getChapter(slug);
        if (!cancelled) {
          setNote(data);
          markVisited(slug);
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, markVisited]);

  useEffect(() => {
    if (note?.title) {
      document.title = `${note.title} | NITEX`;
    }
  }, [note]);

  if (loading) {
    return (
      <div className="app-panel rounded-2xl p-10 text-center text-[var(--muted)]">Loading module…</div>
    );
  }
  if (error || !note) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-8 text-rose-300">
        {error || "Not found"}
        <div className="mt-4">
          <Link to="/" className="text-[var(--accent-strong)] underline">
            ← Back to modules
          </Link>
        </div>
      </div>
    );
  }

  const completed = !!map[slug]?.completed;

  return (
    <article>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-panel relative overflow-hidden rounded-[36px] p-6 sm:p-10"
      >
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-[var(--orb-two)] blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="eyebrow">{note.category}</p>
            <h1 className="mt-2 font-display text-2xl font-bold text-[var(--text-strong)] sm:text-4xl">
              {note.title}
            </h1>
            <p className="mt-3 max-w-2xl text-[var(--muted)]">{note.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(note.tags || []).map((t) => (
                <span key={t} className="app-subtle-chip">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:items-end">
            <button
              type="button"
              onClick={() => toggle(slug)}
              className="button-secondary"
            >
              {has(slug) ? "Bookmarked ★" : "Bookmark ☆"}
            </button>
            <button
              type="button"
              onClick={() => {
                toggleCompleted(slug);
              }}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                completed
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
              }`}
            >
              {completed ? "Marked as studied" : "Mark as studied"}
            </button>
            <p className="text-xs text-[var(--muted)]">~{note.readMinutes} min read</p>
          </div>
        </div>
      </motion.div>

      <div className="prose-note mx-auto mt-10 max-w-3xl">
        {(note.sections || []).map((sec, i) => (
          <motion.section
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ delay: i * 0.03 }}
            className="app-card mb-10 rounded-2xl p-5 sm:p-8"
          >
            <h2 className="font-display text-xl text-[var(--text-strong)]">{sec.heading}</h2>
            <div className="mt-4">{formatRichText(sec.body)}</div>
            {sec.highlights?.length > 0 && (
              <div className="mt-6 border-t border-[var(--border)] pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--accent-strong)]">
                  Key definitions
                </p>
                <ul className="space-y-2">
                  {sec.highlights.map((h, j) => (
                    <li
                      key={j}
                      className="relative rounded-lg bg-[var(--panel-soft)] px-3 py-2 text-sm text-[var(--text)]"
                    >
                      <span className="absolute left-0 top-1/2 h-[60%] w-0.5 -translate-y-1/2 rounded-full bg-[var(--accent-strong)]" />
                      <span className="pl-3">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.section>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Link
          to="/"
          className="button-secondary"
        >
          ← Return to dashboard
        </Link>
      </div>
    </article>
  );
}
