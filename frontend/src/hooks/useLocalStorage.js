import { useState, useEffect, useCallback } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return initialValue;
      return JSON.parse(raw);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore quota */
    }
  }, [key, value]);

  const update = useCallback((updater) => {
    setValue((prev) => (typeof updater === "function" ? updater(prev) : updater));
  }, []);

  return [value, update];
}
