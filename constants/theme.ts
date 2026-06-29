import type { Theme } from "@/types/theme";

/** localStorage key used to persist the user's theme preference. */
export const THEME_STORAGE_KEY = "finterminal-theme";

export const DEFAULT_THEME: Theme = "system";

/**
 * Blocking script injected before hydration to set the correct theme class
 * and avoid a flash of incorrect theme (FOUC). Kept dependency-free on purpose.
 */
export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var key = "${THEME_STORAGE_KEY}";
    var stored = localStorage.getItem(key);
    var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var resolved = stored === "light" || stored === "dark"
      ? stored
      : (systemDark ? "dark" : "light");
    var root = document.documentElement;
    root.classList.toggle("dark", resolved === "dark");
    root.style.colorScheme = resolved;
  } catch (e) {}
})();
`;
