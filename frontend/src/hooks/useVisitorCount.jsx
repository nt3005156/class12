import { useEffect, useState } from "react";
import { getVisitorCount, registerVisitor } from "../services/api.js";

const KEY = "nitex_visitor_registered_v1";

export function useVisitorCount() {
  const [count, setCount] = useState(1000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function syncVisitorCount() {
      setLoading(true);
      try {
        const hasRegistered = localStorage.getItem(KEY) === "true";
        const data = hasRegistered ? await getVisitorCount() : await registerVisitor();

        if (!hasRegistered) {
          localStorage.setItem(KEY, "true");
        }

        if (!cancelled) {
          setCount(data.count);
        }
      } catch (_error) {
        if (!cancelled) {
          setCount(1000);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    syncVisitorCount();
    return () => {
      cancelled = true;
    };
  }, []);

  return { count, loading };
}
