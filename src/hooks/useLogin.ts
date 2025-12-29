import { setAuthToken } from "@/lib/auth-token";

export function useLogin() {
  async function login(username: string, password: string) {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[AUTH][LOGIN_ERROR]", error);
      throw new Error("Usuário ou senha inválidos");
    }

    const data = await response.json();

    console.log("[AUTH] Token recebido");

    setAuthToken(data.token);
  }

  return { login };
}
