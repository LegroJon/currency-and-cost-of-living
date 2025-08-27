"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {}
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  // Initialize theme from localStorage or default to light
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme") as Theme;
      if (savedTheme === "dark" || savedTheme === "light") {
        setTheme(savedTheme);
        applyTheme(savedTheme);
      } else {
        // Default to light mode
        setTheme("light");
        applyTheme("light");
        localStorage.setItem("theme", "light");
      }
    } catch (error) {
      console.error("Failed to load theme from localStorage:", error);
      setTheme("light");
      applyTheme("light");
    }
  }, []);

  // Apply theme to DOM
  const applyTheme = (newTheme: Theme) => {
    if (typeof document !== 'undefined') {
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      console.log(`Theme applied: ${newTheme}`);
    }
  };

  // Update theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    applyTheme(newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch (error) {
      console.error("Failed to save theme to localStorage:", error);
    }
    console.log(`Theme toggled to: ${newTheme}`);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
