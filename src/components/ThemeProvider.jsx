// src/ThemeProvider.jsx
import React, { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext()

export default function ThemeProvider({ children, defaultTheme = "system", storageKey = "vite-ui-theme" }) {
  const [theme, setTheme] = useState(() => localStorage.getItem(storageKey) || defaultTheme)

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
  
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  
    // Обновление цвета фона
    document.body.style.backgroundColor = getComputedStyle(root).getPropertyValue('--background');
    document.body.style.color = getComputedStyle(root).getPropertyValue('--foreground');
  
  }, [theme]);
  

  const value = {
    theme,
    setTheme: (newTheme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
