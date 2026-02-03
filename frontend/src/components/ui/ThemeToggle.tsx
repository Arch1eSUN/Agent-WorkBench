"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const t = theme === "system" ? resolvedTheme : theme;
  const isDark = t !== "light";

  return (
    <button
      className="pressable inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 ui-micro"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {isDark ? <Moon size={14} /> : <Sun size={14} />}
      <span className="ui-micro">{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}
