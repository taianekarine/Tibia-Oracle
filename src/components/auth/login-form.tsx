"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/useLogin";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Erro inesperado ao realizar login";
}

export function LoginForm() {
  const router = useRouter();
  const { login } = useLogin();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(): Promise<void> {
    const normalizedUsername = username.trim();

    if (!normalizedUsername || !password) {
      setError("Usuário e senha são obrigatórios");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(normalizedUsername, password);

      console.log("[AUTH][LOGIN] Sucesso");

      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("[AUTH][LOGIN] Erro", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <Input
        placeholder="Usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
      />

      <Input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <Button
        className="w-full"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Entrando..." : "Fazer login"}
      </Button>
    </div>
  );
}