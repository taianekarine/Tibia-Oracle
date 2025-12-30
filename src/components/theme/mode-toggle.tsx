"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import ThemeColorDropdown from "@/components/theme/theme-color-dropdown"

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"
  const handleClick = () => setTheme(isDark ? "light" : "dark")

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" aria-label="Alternar tema" disabled>
        <Sun className="h-3 w-3" />
        <span className="sr-only">Alternar tema</span>
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <ThemeColorDropdown />

      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        aria-label={isDark ? "Usar tema claro" : "Usar tema escuro"}
      >
        {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </Button>
    </div>
  )
}