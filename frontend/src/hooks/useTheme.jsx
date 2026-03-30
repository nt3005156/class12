import { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage.js";

const ThemeContext = createContext(null);
const KEY = "class12_theme_v2";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage(KEY, "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme: () => setTheme((value) => (value === "dark" ? "light" : "dark")),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}
