import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getChapters, getDashboardMeta } from "../services/api.js";
import { ChapterCard } from "../components/ChapterCard.jsx";
import { SearchBar } from "../components/SearchBar.jsx";
import { useBookmarks } from "../hooks/useBookmarks.js";
import { useProgress } from "../hooks/useProgress.js";
import { DashboardStats } from "../components/DashboardStats.jsx";
import { ContactForm } from "../components/ContactForm.jsx";
import { useAuth } from "../hooks/useAuth.jsx";

export default function Dashboard() {
  const [list, setList] = useState([]);
  const [meta, setMeta] = useState({ total: 0, categories: [], topTags: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");
  const deferredQuery = useDeferredValue(query);
  const { slugs, toggle, has } = useBookmarks();
  const { map, stats } = useProgress();
  const { user } = useAuth();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [notes, nextMeta] = await Promise.all([
          getChapters({ q: deferredQuery || undefined, category: category || undefined }),
          getDashboardMeta(),
        ]);
        if (!cancelled) {
          setList(notes);
          setMeta(nextMeta);
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
  }, [deferredQuery, category]);

  const categories = useMemo(() => {
    return meta.categories.map((item) => item.name);
  }, [meta.categories]);

  const visibleList = useMemo(() => {
    const filtered = list.filter((chapter) => {
      if (statusFilter === "bookmarked") return has(chapter.slug);
      if (statusFilter === "completed") return Boolean(map[chapter.slug]?.completed);
      if (statusFilter === "in-progress") {
        return Boolean(map[chapter.slug]?.visited) && !map[chapter.slug]?.completed;
      }
      return true;
    });

    const sorted = [...filtered];
    if (sortBy === "title") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "time") {
      sorted.sort((a, b) => (a.readMinutes || 0) - (b.readMinutes || 0));
    } else if (sortBy === "bookmarks") {
      sorted.sort((a, b) => Number(has(b.slug)) - Number(has(a.slug)));
    } else {
      sorted.sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    return sorted;
  }, [has, list, map, sortBy, statusFilter]);

  const s = stats(meta.total || list.length);
  const statItems = [
    { label: "Total modules", value: meta.total || list.length, hint: "API powered" },
    { label: "Completed", value: s.completed, hint: `${s.pct}% progress` },
    { label: "Bookmarks", value: slugs.length, hint: "Quick revision" },
    { label: "Top category", value: meta.categories[0]?.name || "Core", hint: "Most content" },
  ];
  const statusOptions = [
    { value: "all", label: "All modules" },
    { value: "bookmarked", label: "Bookmarked" },
    { value: "completed", label: "Completed" },
    { value: "in-progress", label: "In progress" },
  ];

  useEffect(() => {
    document.title = "NITEX | Class 12 Computer Science Dashboard";
  }, []);

  return (
    <div className="space-y-8 sm:space-y-10">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-panel relative overflow-hidden rounded-[36px] p-6 sm:p-10"
      >
        <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-[var(--orb-three)] blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-40 w-40 rounded-full bg-[var(--orb-one)] blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <p className="eyebrow">Modern student dashboard</p>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-[var(--text-strong)] sm:text-5xl">
              Study smarter with a clean Class 12 CS portal
            </h1>
            <p className="mt-4 max-w-2xl text-base text-[var(--muted)] sm:text-lg">
              Search notes, track your progress, bookmark difficult chapters, switch themes, log in
              with a real account, and send feedback through the backend.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {(meta.topTags.length ? meta.topTags : [{ name: "DBMS" }, { name: "Networking" }, { name: "OOP" }]).map((tag) => (
                <span key={tag.name} className="app-chip">
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="app-subtle-card rounded-[28px] p-5">
              <p className="text-sm font-medium text-[var(--muted)]">
                {user ? `Welcome back, ${user.name.split(" ")[0]}` : "Guest mode"}
              </p>
              <p className="mt-2 text-2xl font-semibold text-[var(--text-strong)]">
                {s.completed === 0 ? "Start with DBMS" : `${s.completed} chapter${s.completed > 1 ? "s" : ""} completed`}
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                {user
                  ? "Your account is active. Progress stays on your device and your profile is stored in the database."
                  : "Create an account to make the project feel like a complete real-world app."}
              </p>
            </div>
            <div className="app-subtle-card rounded-[28px] p-5">
              <p className="text-sm font-medium text-[var(--muted)]">Available categories</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((item) => (
                  <span key={item} className="app-subtle-chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <DashboardStats items={statItems} />

      <section className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search modules, tags, summaries…"
            />
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="app-input"
              aria-label="Filter by category"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="app-input"
              aria-label="Sort modules"
            >
              <option value="recommended">Recommended order</option>
              <option value="title">Alphabetical</option>
              <option value="time">Shortest read first</option>
              <option value="bookmarks">Bookmarked first</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={statusFilter === option.value ? "button-primary" : "button-secondary"}
                onClick={() => setStatusFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <aside className="app-panel rounded-[28px] p-5">
          <p className="eyebrow">Study snapshot</p>
          <div className="mt-4 space-y-4">
            <div className="app-subtle-card rounded-2xl p-4">
              <p className="text-sm font-medium text-[var(--muted)]">Progress</p>
              <p className="mt-1 text-2xl font-semibold text-[var(--text-strong)]">{s.pct}%</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {s.completed} of {s.total || meta.total} modules marked as studied.
              </p>
            </div>
            <div className="app-subtle-card rounded-2xl p-4">
              <p className="text-sm font-medium text-[var(--muted)]">Revision list</p>
              <p className="mt-1 text-2xl font-semibold text-[var(--text-strong)]">{slugs.length}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Bookmarks help you build a quick exam revision queue.
              </p>
            </div>
            <div className="app-subtle-card rounded-2xl p-4">
              <p className="text-sm font-medium text-[var(--muted)]">Recommended next step</p>
              <p className="mt-1 text-base font-semibold text-[var(--text-strong)]">
                {visibleList[0]?.title || "Clear filters to see modules"}
              </p>
            </div>
          </div>
        </aside>
      </section>

      <div className="mb-2 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
        <span>{loading ? "Loading modules..." : `${visibleList.length} modules shown`}</span>
        {slugs.length > 0 && (
          <span className="rounded-full bg-amber-500/12 px-3 py-1 text-[var(--text-strong)]">
            {slugs.length} bookmarked
          </span>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error} — Make sure MongoDB and the backend server are running.
        </div>
      )}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleList.map((chapter, index) => (
          <ChapterCard
            key={chapter.slug}
            chapter={chapter}
            index={index}
            bookmarked={has(chapter.slug)}
            onToggleBookmark={() => toggle(chapter.slug)}
            completed={!!map[chapter.slug]?.completed}
          />
        ))}
      </section>

      {!loading && visibleList.length === 0 && (
        <section className="app-panel rounded-[28px] p-10 text-center">
          <h2 className="font-display text-2xl font-semibold text-[var(--text-strong)]">
            No modules matched these filters
          </h2>
          <p className="mt-3 text-[var(--muted)]">
            Try removing a filter, changing the keyword, or switching back to the recommended order.
          </p>
        </section>
      )}

      <ContactForm user={user} />
    </div>
  );
}
