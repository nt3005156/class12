import { useLocalStorage } from "./useLocalStorage.js";

const KEY = "nitex_bookmarks_v1";

export function useBookmarks() {
  const [slugs, setSlugs] = useLocalStorage(KEY, []);

  const toggle = (slug) => {
    setSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const has = (slug) => slugs.includes(slug);

  return { slugs, toggle, has };
}
