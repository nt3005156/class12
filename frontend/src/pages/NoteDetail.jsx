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

  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center text-slate-400">Loading signal…</div>
    );
  }
  if (error || !note) {
    return (
      <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-8 text-red-200">
        {error || "Not found"}
        <div className="mt-4">
          <Link to="/" className="text-cyan-300 underline">
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
        className="glass-panel neon-border relative overflow-hidden rounded-3xl p-6 sm:p-10"
      >
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">{note.category}</p>
            <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">{note.title}</h1>
            <p className="mt-3 max-w-2xl text-slate-400">{note.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(note.tags || []).map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-white/10 bg-black/30 px-2 py-0.5 text-xs text-slate-400"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:items-end">
            <button
              type="button"
              onClick={() => toggle(slug)}
              className="rounded-xl border border-white/10 bg-black/25 px-4 py-2 text-sm text-slate-200 hover:border-cyan-400/40"
            >
              {has(slug) ? "Bookmarked ★" : "Bookmark ☆"}
            </button>
            <button
              type="button"
              onClick={() => {
                toggleCompleted(slug);
              }}
              className={`rounded-xl border px-4 py-2 text-sm ${
                completed
                  ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-100"
                  : "border-white/10 bg-black/25 text-slate-200 hover:border-emerald-400/30"
              }`}
            >
              {completed ? "Marked as studied" : "Mark as studied"}
            </button>
            <p className="text-xs text-slate-500">~{note.readMinutes} min read</p>
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
            className="mb-10 rounded-2xl border border-white/5 bg-white/[0.02] p-5 sm:p-8"
          >
            <h2 className="font-display text-xl text-cyan-100">{sec.heading}</h2>
            <div className="mt-4">{formatRichText(sec.body)}</div>
            {sec.highlights?.length > 0 && (
              <div className="mt-6 border-t border-cyan-500/15 pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-violet-300/90">
                  Key definitions
                </p>
                <ul className="space-y-2">
                  {sec.highlights.map((h, j) => (
                    <li
                      key={j}
                      className="relative rounded-lg border border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-transparent px-3 py-2 text-sm text-slate-200"
                    >
                      <span className="absolute left-0 top-1/2 h-[60%] w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-cyan-400 to-violet-500" />
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
          className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-6 py-2 text-sm text-cyan-100 hover:bg-cyan-500/20"
        >
          ← Return to dashboard
        </Link>
      </div>
    </article>
  );
}
