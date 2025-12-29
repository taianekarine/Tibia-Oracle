import { getAuthToken } from "@/lib/auth-token";

type ApiOptions = {
  body?: any;
  characterName?: string;
};

export function useApi() {
  function getHeaders(characterName?: string) {
    const token = getAuthToken();

    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (characterName) {
      headers["x-character-name"] = characterName;
    }

    return headers;
  }

  async function request(
    method: "GET" | "POST" | "DELETE" | "PUT",
    url: string,
    options?: ApiOptions
  ) {
    const isFormData = options?.body instanceof FormData;
    const headers = getHeaders(options?.characterName);

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
      method,
      headers,
      body: options?.body
        ? isFormData
          ? options.body
          : JSON.stringify(options.body)
        : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[API][ERROR]", error);
      throw new Error(error);
    }

    if (response.status === 204) return null;

    return response.json();
  }

  return {
    get: (url: string) => request("GET", url),
    post: (url: string, options?: ApiOptions) =>
      request("POST", url, options),
    delete: (url: string, options?: ApiOptions) =>
      request("DELETE", url, options),
    put: (url: string, options?: ApiOptions) =>
      request("PUT", url, options),
  };
}
