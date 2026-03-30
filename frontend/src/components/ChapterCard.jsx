import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const categoryTone = {
  Data: "from-cyan-500/18 to-sky-500/8",
  Systems: "from-violet-500/18 to-fuchsia-500/8",
  Applied: "from-emerald-500/18 to-teal-500/8",
  Programming: "from-amber-500/18 to-orange-500/8",
  Engineering: "from-blue-500/18 to-indigo-500/8",
  Trends: "from-rose-500/18 to-pink-500/8",
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
    "from-slate-500/15 to-slate-700/10";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, type: "spring", stiffness: 320, damping: 26 }}
      className={`app-card group relative overflow-hidden rounded-[26px] bg-gradient-to-br ${tone}`}
    >
      <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-[var(--accent-soft)] blur-3xl transition duration-500 group-hover:scale-110" />
      <div className="relative flex h-full flex-col p-5 sm:p-6">
        <div className="mb-3 flex items-start justify-between gap-2">
          <span className="app-chip">
            {chapter.category}
          </span>
          <div className="flex items-center gap-1">
            {completed && (
              <span className="rounded-full bg-emerald-500/12 px-2 py-0.5 text-[10px] font-medium text-[var(--text-strong)]">
                Done
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onToggleBookmark?.();
              }}
              className="app-icon-button px-2 py-1 text-xs"
              aria-pressed={bookmarked}
              aria-label={bookmarked ? "Remove bookmark" : "Bookmark chapter"}
            >
              {bookmarked ? "★" : "☆"}
            </button>
          </div>
        </div>
        <Link to={`/notes/${chapter.slug}`} className="flex flex-1 flex-col">
          <h2 className="font-display text-lg text-[var(--text-strong)] transition group-hover:text-[var(--accent-strong)] sm:text-xl">
            {chapter.title}
          </h2>
          <p className="mt-2 line-clamp-3 flex-1 text-sm text-[var(--muted)]">
            {chapter.summary}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(chapter.tags || []).slice(0, 4).map((t) => (
              <span key={t} className="app-subtle-chip">
                {t}
              </span>
            ))}
          </div>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-strong)]">
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
