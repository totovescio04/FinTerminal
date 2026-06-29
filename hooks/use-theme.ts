"use client";

import { useContext } from "react";
import { ThemeContext } from "@/providers/theme-provider";
import type { ThemeContextValue } from "@/types/theme";

/** Access the theme context. Must be used within <ThemeProvider>. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
