import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PREFIX = "nitex_scroll_";

export function ScrollRestoration() {
  const location = useLocation();
  const key = `${PREFIX}${location.pathname}${location.search}`;

  useEffect(() => {
    const saved = sessionStorage.getItem(key);
    if (saved != null) {
      window.requestAnimationFrame(() => {
        window.scrollTo(0, Number(saved) || 0);
      });
    }

    const handleScroll = () => {
      sessionStorage.setItem(key, String(window.scrollY));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      handleScroll();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [key]);

  return null;
}
