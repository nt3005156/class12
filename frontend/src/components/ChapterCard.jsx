import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const categoryTone = {
  Data: "from-cyan-500/20 to-blue-600/10 border-cyan-400/25",
  Systems: "from-violet-500/20 to-fuchsia-600/10 border-violet-400/25",
  Applied: "from-emerald-500/15 to-teal-600/10 border-emerald-400/20",
  Programming: "from-amber-500/15 to-orange-600/10 border-amber-400/20",
  Engineering: "from-sky-500/15 to-indigo-600/10 border-sky-400/20",
  Trends: "from-pink-500/15 to-rose-600/10 border-pink-400/20",
};

export function ChapterCard({
  chapter,
  index,
  bookmarked,
  onToggleBookmark,
  completed,
}) {
  const tone =
    categoryTone[chapter.category] ||
    "from-slate-500/15 to-slate-700/10 border-white/10";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, type: "spring", stiffness: 320, damping: 26 }}
      className={`glass-card neon-border group relative overflow-hidden rounded-2xl bg-gradient-to-br ${tone}`}
    >
      <div className="pointer-events-none absolute -right-6 -top-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl transition group-hover:bg-cyan-400/20" />
      <div className="relative flex h-full flex-col p-5 sm:p-6">
        <div className="mb-3 flex items-start justify-between gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] uppercase tracking-wider text-slate-400">
            {chapter.category}
          </span>
          <div className="flex items-center gap-1">
            {completed && (
              <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-medium text-emerald-200">
                Done
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onToggleBookmark?.();
              }}
              className="rounded-lg border border-white/10 bg-black/20 px-2 py-1 text-xs text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-100"
              aria-pressed={bookmarked}
              aria-label={bookmarked ? "Remove bookmark" : "Bookmark chapter"}
            >
              {bookmarked ? "★" : "☆"}
            </button>
          </div>
        </div>
        <Link to={`/notes/${chapter.slug}`} className="flex flex-1 flex-col">
          <h2 className="font-display text-lg text-white transition group-hover:text-cyan-100 sm:text-xl">
            {chapter.title}
          </h2>
          <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-400">
            {chapter.summary}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(chapter.tags || []).slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-md border border-white/5 bg-black/25 px-2 py-0.5 text-[11px] text-slate-400"
              >
                {t}
              </span>
            ))}
          </div>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-300">
            Open module
            <span aria-hidden className="transition group-hover:translate-x-1">
              →
            </span>
          </span>
        </Link>
      </div>
    </motion.article>
  );
}
