import { apiRequest } from "./apiClient"
import { Character } from "@/types/character"

export function listCharacters(): Promise<Character[]> {
  return apiRequest("GET", "/api/characters")
}

export function createCharacter(name: string): Promise<Character> {
  return apiRequest("POST", "/api/characters", {
    body: { name },
  })
}

export function deleteCharacter(name: string): Promise<void> {
  return apiRequest("DELETE", `/api/characters/${name}`)
}
