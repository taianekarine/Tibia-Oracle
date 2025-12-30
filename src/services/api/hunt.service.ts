import { apiRequest } from "./apiClient"

export function importHunt(
  characterName: string,
  file: File
): Promise<void> {
  const formData = new FormData()
  formData.append("file", file)

  return apiRequest("POST", "/api/hunt-sessions", {
    body: formData,
    characterName,
  })
}
