"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"

const ACCENTS = [
  "default",
  "red",
  "rose",
  "orange",
  "green",
  "blue",
  "yellow",
  "violet",
] as const

type Accent = (typeof ACCENTS)[number]

// Swatches só para pré-visualização do item no menu
const SWATCH: Record<Accent, string> = {
  default: "bg-zinc-900 dark:bg-zinc-100",
  red: "bg-red-500",
  rose: "bg-rose-500",
  orange: "bg-orange-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-400",
  violet: "bg-violet-500",
}

export default function ThemeColorDropdown() {
  const [accent, setAccent] = useState<Accent>("default")

  useEffect(() => {
    const saved = (typeof window !== "undefined"
      ? (localStorage.getItem("accent") as Accent | null)
      : null) ?? "default"
    if (ACCENTS.includes(saved)) {
      setAccent(saved)
      document.documentElement.setAttribute("data-accent", saved)
    } else {
      document.documentElement.setAttribute("data-accent", "default")
    }
  }, [])

  const onChange = (value: string) => {
    const next = value as Accent
    setAccent(next)
    document.documentElement.setAttribute("data-accent", next)
    localStorage.setItem("accent", next)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2" aria-label="Cor do tema">
          <span className="h-3 w-3 rounded-full" style={{ background: "var(--primary)" }}/>
          <span className="hidden sm:inline">Tema</span>
          {/* <Paintbrush className="h-4 w-4" /> */}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Cor do tema</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={accent} onValueChange={onChange}>
          {ACCENTS.map((opt) => (
            <DropdownMenuRadioItem key={opt} value={opt} className="capitalize">
              <span className={`mr-2 inline-block h-3 w-3 rounded-full align-middle ${SWATCH[opt]}`} />
              {opt}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}