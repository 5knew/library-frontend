// src/ModeToggle.jsx
import React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "./ThemeProvider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center space-x-2">
      <button onClick={() => setTheme("light")} className="p-2">
        <Sun className={`transition ${theme === "light" ? "text-yellow-500" : ""}`} />
        <span className="sr-only">Light Mode</span>
      </button>
      <button onClick={() => setTheme("dark")} className="p-2">
        <Moon className={`transition ${theme === "dark" ? "text-purple-500" : ""}`} />
        <span className="sr-only">Dark Mode</span>
      </button>
      <button onClick={() => setTheme("system")} className="p-2">
        System
        <span className="sr-only">System Mode</span>
      </button>
    </div>
  )
}
