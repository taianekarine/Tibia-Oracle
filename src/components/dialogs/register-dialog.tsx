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
import { apiFetch } from "@/lib/api";

export function RegisterDialog() {
  const [open, setOpen] = useState(false);
  const [created, setCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleRegister() {
    if (
      !form.name.trim() ||
      !form.username.trim() ||
      !form.password
    ) {
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
      await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          username: form.username.trim(),
          password: form.password,
        }),
      });

      console.log("[AUTH] Cadastro realizado");

      setCreated(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function goToLogin() {
    setOpen(false);
    setCreated(false);
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
              onChange={(e) => updateField("name", e.target.value)}
            />
            <Input
              placeholder="Usuário"
              value={form.username}
              onChange={(e) =>
                updateField("username", e.target.value)
              }
            />
            <Input
              type="password"
              placeholder="Senha"
              value={form.password}
              onChange={(e) =>
                updateField("password", e.target.value)
              }
            />
            <Input
              type="password"
              placeholder="Confirmar senha"
              value={form.confirmPassword}
              onChange={(e) =>
                updateField("confirmPassword", e.target.value)
              }
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
