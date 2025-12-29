"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/useLogin";

export function LoginForm() {
  const router = useRouter();
  const { login } = useLogin();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    if (!username.trim() || !password) {
      setError("Usuário e senha são obrigatórios");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(username.trim(), password);

      console.log("[AUTH] Login OK");

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
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
      />

      <Input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

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
