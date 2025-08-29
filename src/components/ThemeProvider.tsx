"use client";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Force dark mode always - simple and reliable
  if (typeof document !== 'undefined') {
    document.documentElement.classList.add("dark");
  }

  return <>{children}</>;
}
