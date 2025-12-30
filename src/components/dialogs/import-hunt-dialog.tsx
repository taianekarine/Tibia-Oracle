"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useCharactersQuery } from "@/hooks/queries/useCharactersQuery";
import { useApi } from "@/hooks/useApi";

type Props = {
  children: React.ReactNode;
};

export function ImportHuntDialog({ children }: Props) {
  const api = useApi();
  const { data: characters = [] } = useCharactersQuery();

  const [open, setOpen] = useState(false);
  const [characterName, setCharacterName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleImport() {
    if (!characterName || !file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      await api.post("/api/hunt-sessions", {
        body: formData,
        characterName,
      });

      console.log("[HUNT][IMPORT] OK", characterName);

      setOpen(false);
      setCharacterName("");
      setFile(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar Hunt</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Select
            value={characterName}
            onValueChange={setCharacterName}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o personagem" />
            </SelectTrigger>

            <SelectContent>
              {characters.map((char) => (
                <SelectItem key={char.id} value={char.name}>
                  {char.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="file"
            accept=".json"
            onChange={(e) =>
              setFile(e.target.files?.[0] ?? null)
            }
          />
        </div>

        <DialogFooter>
          <Button
            disabled={!characterName || !file || loading}
            onClick={handleImport}
          >
            {loading ? "Importando..." : "Importar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
