"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { usePathname, useRouter } from "next/navigation"

type DashboardContextType = {
  activeCharacter: string | null
  setActiveCharacter: (name: string, syncUrl?: boolean) => void
  resetCharacter: () => void
  isReady: boolean
}

const DashboardContext =
  createContext<DashboardContextType | null>(null)

export function DashboardProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const [activeCharacter, setActiveCharacterState] =
    useState<string | null>(null)

  // 🔁 Sincronização inicial pela URL (apenas uma vez)
  useEffect(() => {
    if (!pathname || activeCharacter) return

    const parts = pathname.split("/")
    const possibleName = parts.at(-1)

    if (possibleName && possibleName !== "dashboard") {
      console.log(
        "[DASHBOARD][URL] Inicializando personagem:",
        possibleName
      )
      setActiveCharacterState(possibleName)
    }
  }, [pathname, activeCharacter])

  function setActiveCharacter(
    name: string,
    syncUrl = false
  ) {
    const normalized = name.trim()

    if (!normalized) {
      console.error("[DASHBOARD] Nome inválido:", name)
      return
    }

    console.log("[DASHBOARD] Personagem ativo:", normalized)
    setActiveCharacterState(normalized)

    if (syncUrl) {
      router.push(
        `/dashboard/${encodeURIComponent(normalized)}`
      )
    }
  }

  function resetCharacter() {
    console.log("[DASHBOARD] Reset personagem ativo")
    setActiveCharacterState(null)
  }

  const isReady =
    typeof activeCharacter === "string" &&
    activeCharacter.length > 0

  return (
    <DashboardContext.Provider
      value={{
        activeCharacter,
        setActiveCharacter,
        resetCharacter,
        isReady,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)

  if (!ctx) {
    throw new Error(
      "useDashboard deve ser usado dentro de DashboardProvider"
    )
  }

  return ctx
}
