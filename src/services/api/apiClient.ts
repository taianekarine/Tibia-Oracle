import { getAuthToken } from "@/lib/auth-token"

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

export interface ApiRequestOptions<TBody = unknown> {
  body?: TBody
  characterName?: string
  headers?: Record<string, string>
}

export async function apiRequest<TResponse, TBody = unknown>(
  method: HttpMethod,
  url: string,
  options?: ApiRequestOptions<TBody>
): Promise<TResponse> {
  const token = getAuthToken()

  const headers: Record<string, string> = {
    ...(options?.headers ?? {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  if (options?.characterName) {
    headers["x-character-name"] = options.characterName
  }

  const isFormData = options?.body instanceof FormData

  if (!isFormData) {
    headers["Content-Type"] = "application/json"
  }

  const response = await fetch(url, {
    method,
    headers,
    body: options?.body
      ? isFormData
        ? options.body
        : JSON.stringify(options.body)
      : undefined,
  })

  if (!response.ok) {
    const text = await response.text()
    console.error("[API][ERROR]", method, url, text)
    throw new Error(text || "Erro inesperado")
  }

  if (response.status === 204) {
    return null as TResponse
  }

  return response.json()
}
