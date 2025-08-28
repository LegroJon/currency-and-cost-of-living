// Alternative: Dark Mode Only Version
// Replace ThemeProvider.tsx with this if you prefer dark mode only

"use client";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Force dark mode always
  if (typeof document !== 'undefined') {
    document.documentElement.classList.add("dark");
  }

  return <>{children}</>;
}

// No theme context needed for static dark mode
