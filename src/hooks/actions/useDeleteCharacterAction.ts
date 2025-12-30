import { useQueryClient } from "@tanstack/react-query"
import { deleteCharacter } from "@/services/api/character.service"

export function useDeleteCharacterAction() {
  const queryClient = useQueryClient()

  async function execute(name: string) {
    if (!name) return
    await deleteCharacter(name)
    queryClient.invalidateQueries({ queryKey: ["characters"] })
  }

  return { execute }
}
