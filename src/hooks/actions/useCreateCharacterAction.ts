import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { createCharacter } from "@/services/api/character.service"

export function useCreateCharacterAction() {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)

  async function execute(name: string) {
    if (!name.trim()) {
      throw new Error("Nome do personagem é obrigatório")
    }

    setLoading(true)

    try {
      await createCharacter(name.trim())
      queryClient.invalidateQueries({ queryKey: ["characters"] })
    } finally {
      setLoading(false)
    }
  }

  return { execute, loading }
}
