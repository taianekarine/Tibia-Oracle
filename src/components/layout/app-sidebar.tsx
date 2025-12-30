"use client";

/*
  SIDEBAR
  - UI pura
  - Executa ações
  - NÃO conhece regras de auth
*/

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Trash2, UserPlus, Upload } from "lucide-react";

import { useCharacterHeader } from "@/hooks/state/useActiveCharacter";
import { useCharacterList } from "@/hooks/queries/useCharactersQuery";
import { useApi } from "@/hooks/useApi"; // 🔑 NOVO
import { useQueryClient } from "@tanstack/react-query";

type Character = {
  id: string;
  name: string;
};

export function AppSidebar() {
  const api = useApi(); // 🔑 API já autenticada
  const { setCharacterFromInput } = useCharacterHeader();

  const [createOpen, setCreateOpen] = React.useState(false);
  const [importOpen, setImportOpen] = React.useState(false);

  const [characterName, setCharacterName] = React.useState("");
  const [selectedCharacter, setSelectedCharacter] = React.useState("");
  const [huntFile, setHuntFile] = React.useState<File | null>(null);

  const [loading, setLoading] = React.useState(false);

  const { data: characters = [], isLoading } = useCharacterList();
  const queryClient = useQueryClient();

  async function handleConfirmCreate() {
    if (!characterName.trim()) return;

    console.log("[CHARACTER][CREATE]", characterName);

    setLoading(true);

    await api.post("/api/characters", {
      body: { name: characterName },
    });

    queryClient.invalidateQueries({ queryKey: ["characters"] });

    setLoading(false);
    setCreateOpen(false);
    setCharacterName("");
  }

  async function handleDelete(name: string) {
    const ok = confirm(`Excluir personagem "${name}"?`);
    if (!ok) return;

    console.log("[CHARACTER][DELETE]", name);

    await api.delete(`/api/characters/${name}`);

    queryClient.invalidateQueries({ queryKey: ["characters"] });
  }

  async function handleImportHunt() {
  if (!selectedCharacter || !huntFile) return;

  console.log("[HUNT][IMPORT]", selectedCharacter);

  setCharacterFromInput(selectedCharacter, false);

  const formData = new FormData();
  formData.append("file", huntFile);

  setLoading(true);

  await api.post("/api/hunt-sessions", {
    body: formData,
    characterName: selectedCharacter,
  });

  queryClient.invalidateQueries({ queryKey: ["characters"] });

  setLoading(false);
  setImportOpen(false);
  setSelectedCharacter("");
  setHuntFile(null);
}

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-semibold">Tibia Oracle</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setCreateOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Criar personagem
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setImportOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Importar hunt
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <ScrollArea className="mt-4 px-2">
          {isLoading && <p className="text-xs text-muted">Carregando...</p>}

          {characters.map((char) => (
            <div
              key={char.id}
              className="flex items-center justify-between rounded-md px-2 py-1 hover:bg-muted"
            >
              <span className="text-sm">{char.name}</span>

              <button onClick={() => handleDelete(char.name)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </button>
            </div>
          ))}
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-4 text-xs text-muted-foreground">
        Backend manda, frontend obedece.
      </SidebarFooter>

      {/* Dialog Criar */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar personagem</DialogTitle>
          </DialogHeader>

          <Input
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder="Nome do personagem"
          />

          <DialogFooter>
            <Button disabled={loading} onClick={handleConfirmCreate}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Importar */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar Hunt</DialogTitle>
          </DialogHeader>

          <Select value={selectedCharacter} onValueChange={setSelectedCharacter}>
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
            onChange={(e) => setHuntFile(e.target.files?.[0] || null)}
          />

          <DialogFooter>
            <Button
              disabled={!selectedCharacter || !huntFile || loading}
              onClick={handleImportHunt}
            >
              Importar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
