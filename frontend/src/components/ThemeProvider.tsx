"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";
import { useEffect } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const preset = localStorage.getItem("glassPreset") || "vivid";
    document.documentElement.setAttribute("data-glass", preset);
  }, []);

  return (
    <NextThemesProvider attribute="data-theme" defaultTheme="dark" enableSystem={true}>
      {children}
    </NextThemesProvider>
  );
}
