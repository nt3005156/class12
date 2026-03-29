import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getChapters } from "../services/api.js";
import { ChapterCard } from "../components/ChapterCard.jsx";
import { SearchBar } from "../components/SearchBar.jsx";
import { useBookmarks } from "../hooks/useBookmarks.js";
import { useProgress } from "../hooks/useProgress.js";

function useDebounced(value, ms) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export default function Dashboard() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const debounced = useDebounced(query, 220);
  const { slugs, toggle, has } = useBookmarks();
  const { map, stats } = useProgress();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getChapters({ q: debounced || undefined, category: category || undefined });
        if (!cancelled) setList(data);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [debounced, category]);

  const categories = useMemo(() => {
    const s = new Set(list.map((c) => c.category).filter(Boolean));
    return Array.from(s).sort();
  }, [list]);

  const s = stats(list.length);

  return (
    <div>
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel neon-border relative overflow-hidden rounded-3xl p-6 sm:p-10"
      >
        <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl" />
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-cyan-300/90">Mission briefing</p>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
          Class 12 Computer Science
          <span className="block bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-400 bg-clip-text text-transparent">
            Structured for deep focus
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-slate-400">
          Neon-clear summaries, exam-ready definitions, and modules you can actually browse on a phone.
          Content is rewritten in our own words for learning—not a mirror of any single legacy page.
        </p>
        <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">DBMS</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Networks</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Web</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">C &amp; OOP</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">SDLC</span>
        </div>
      </motion.section>

      <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_280px]">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search modules, tags, summaries…"
        />
        <div className="glass-panel flex flex-wrap items-center gap-2 rounded-2xl px-3 py-2">
          <span className="px-1 text-xs uppercase tracking-wider text-slate-500">Filter</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 min-w-[8rem] rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100 outline-none"
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 mb-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span>
          {loading ? "Scanning archive…" : `${list.length} modules`}
        </span>
        {slugs.length > 0 && (
          <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-amber-200/90">
            {slugs.length} bookmarked
          </span>
        )}
        <span className="hidden sm:inline">
          Progress: {s.completed}/{s.total} marked done ({s.pct}%)
        </span>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error} — Are MongoDB and the API running? Try{" "}
          <code className="rounded bg-black/30 px-1">npm run dev</code> in <code className="rounded bg-black/30 px-1">backend</code>.
        </div>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {list.map((chapter, index) => (
          <ChapterCard
            key={chapter.slug}
            chapter={chapter}
            index={index}
            bookmarked={has(chapter.slug)}
            onToggleBookmark={() => toggle(chapter.slug)}
            completed={!!map[chapter.slug]?.completed}
          />
        ))}
      </div>

      {!loading && list.length === 0 && (
        <p className="mt-10 text-center text-slate-500">No modules match that query.</p>
      )}
    </div>
  );
}
