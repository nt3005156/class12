import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage.js";

const KEY = "nitex_progress_v1";

/** { [slug]: { visited: boolean, completed?: boolean, at?: string } } */

export function useProgress() {
  const [map, setMap] = useLocalStorage(KEY, {});

  const markVisited = useCallback((slug) => {
    setMap((prev) => ({
      ...prev,
      [slug]: {
        ...prev[slug],
        visited: true,
        at: new Date().toISOString(),
      },
    }));
  }, [setMap]);

  const toggleCompleted = useCallback((slug) => {
    setMap((prev) => {
      const cur = prev[slug] || {};
      return {
        ...prev,
        [slug]: {
          ...cur,
          completed: !cur.completed,
          visited: true,
          at: new Date().toISOString(),
        },
      };
    });
  }, [setMap]);

  const stats = useMemo(
    () => (total) => {
      const completed = Object.values(map).filter((x) => x?.completed).length;
      const visited = Object.values(map).filter((x) => x?.visited).length;
      return {
        completed,
        visited,
        total,
        pct: total ? Math.round((completed / total) * 100) : 0,
      };
    },
    [map]
  );

  return { map, markVisited, toggleCompleted, stats };
}
