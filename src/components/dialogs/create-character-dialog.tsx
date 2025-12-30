"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks/useApi";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  children: React.ReactNode;
};

export function CreateCharacterDialog({ children }: Props) {
  const api = useApi();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!name.trim()) return;

    setLoading(true);

    try {
      await api.post("/api/characters", {
        body: { name: name.trim() },
      });

      console.log("[CHARACTER][CREATE]", name);

      queryClient.invalidateQueries({ queryKey: ["characters"] });

      setOpen(false);
      setName("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar personagem</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Nome do personagem"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <DialogFooter>
          <Button
            disabled={!name.trim() || loading}
            onClick={handleCreate}
          >
            {loading ? "Criando..." : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
