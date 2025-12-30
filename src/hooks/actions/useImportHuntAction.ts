import { useState } from "react"
import { importHunt } from "@/services/api/hunt.service"

export function useImportHuntAction() {
  const [loading, setLoading] = useState(false)

  async function execute(characterName: string, file: File) {
    if (!characterName || !file) {
      throw new Error("Character e arquivo são obrigatórios")
    }

    setLoading(true)

    try {
      await importHunt(characterName, file)
    } finally {
      setLoading(false)
    }
  }

  return { execute, loading }
}
