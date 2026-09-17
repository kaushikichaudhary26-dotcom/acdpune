import * as React from "react";

export type Theme = "light" | "dark" | "system";
const THEME_KEY = "theme";

type ThemeContextType = {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (t: Theme) => void;
  cycleTheme: () => void;
};

const ThemeContext = React.createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = React.useState<Theme>("dark");
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">("dark");

  // initialize from localStorage (client-only)
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY) as Theme | null;
      if (stored) {
        setThemeState(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  // apply theme and listen for system changes when needed
  React.useEffect(() => {
    const apply = (t: Theme) => {
      if (t === "system") {
        const isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.classList.toggle("dark", !!isDark);
        setResolvedTheme(isDark ? "dark" : "light");
      } else {
        document.documentElement.classList.toggle("dark", t === "dark");
        setResolvedTheme(t === "dark" ? "dark" : "light");
      }
    };

    apply(theme);

    const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") apply("system");
    };

    try {
      if (mql?.addEventListener) mql.addEventListener("change", handler);
      else mql?.addListener?.(handler);
    } catch { }

    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch { }

    return () => {
      try {
        if (mql?.removeEventListener) mql.removeEventListener("change", handler);
        else mql?.removeListener?.(handler);
      } catch { }
    };
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch { }
  };

  const cycleTheme = React.useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === "light" ? "dark" : prev === "dark" ? "system" : "light";
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch { }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}