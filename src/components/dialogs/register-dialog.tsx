"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { apiRequest } from "@/services/api/apiClient";

type RegisterFormState = {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Erro inesperado ao criar conta";
}

export function RegisterDialog() {
  const [open, setOpen] = useState<boolean>(false);
  const [created, setCreated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<RegisterFormState>({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  function updateField<K extends keyof RegisterFormState>(
    field: K,
    value: string
  ): void {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleRegister(): Promise<void> {
    const name = form.name.trim();
    const username = form.username.trim();

    if (!name || !username || !form.password) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("As senhas não conferem");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiRequest<void, {
        name: string;
        username: string;
        password: string;
      }>("POST", "/api/auth/register", {
        body: {
          name,
          username,
          password: form.password,
        },
      });

      console.log("[AUTH][REGISTER] Cadastro realizado");

      setCreated(true);
    } catch (err: unknown) {
      console.error("[AUTH][REGISTER] Erro", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function goToLogin(): void {
    setOpen(false);
    setCreated(false);
    setError(null);

    setForm({
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Criar conta
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar conta</DialogTitle>
        </DialogHeader>

        {!created ? (
          <div className="space-y-3">
            <Input
              placeholder="Nome"
              value={form.name}
              onChange={(e) =>
                updateField("name", e.target.value)
              }
              disabled={loading}
            />

            <Input
              placeholder="Usuário"
              value={form.username}
              onChange={(e) =>
                updateField("username", e.target.value)
              }
              disabled={loading}
            />

            <Input
              type="password"
              placeholder="Senha"
              value={form.password}
              onChange={(e) =>
                updateField("password", e.target.value)
              }
              disabled={loading}
            />

            <Input
              type="password"
              placeholder="Confirmar senha"
              value={form.confirmPassword}
              onChange={(e) =>
                updateField("confirmPassword", e.target.value)
              }
              disabled={loading}
            />

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button
              className="w-full"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Criando..." : "Cadastrar"}
            </Button>
          </div>
        ) : (
          <Button className="w-full" onClick={goToLogin}>
            Seguir para login
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
