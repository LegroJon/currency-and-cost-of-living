"use client";
import { useTheme } from "./ThemeProvider";

export default function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();

  const handleClick = () => {
    console.log(`Toggle clicked, current theme: ${theme}`);
    toggleTheme();
  };

  const resetTheme = () => {
    localStorage.removeItem("theme");
    window.location.reload();
  };

  return (
    <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
      <button
        onClick={handleClick}
        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </button>
      <button
        onClick={resetTheme}
        className="text-xs px-2 py-1 rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
        title="Reset theme preference"
      >
        Reset
      </button>
    </div>
  );
}
