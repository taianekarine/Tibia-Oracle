"use client";

/*
  Esse componente é a SIDEBAR.
  Regra de ouro aqui:
  - Ela EXECUTA ações (criar, deletar, importar)
  - Ela NÃO é dona dos dados
  - Ela apenas LÊ os dados via React Query
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

import { useCharacterHeader } from "@/hooks/useCharacterHeader";
import { useCharacterList } from "@/hooks/useCharacterList";
import { useQueryClient } from "@tanstack/react-query";

/*
  Tipo simples apenas para tipagem do front.
  NÃO é modelo do banco.
*/
type Character = {
  id: string;
  name: string;
};

export function AppSidebar() {
  /*
    Hook que controla o header "x-character-name".
    Ele não tem relação direta com React Query.
  */
  const { setCharacterFromInput } = useCharacterHeader();

  /*
    Estados puramente de UI.
    Nada aqui tem relação com dados do backend.
  */
  const [createOpen, setCreateOpen] = React.useState(false);
  const [importOpen, setImportOpen] = React.useState(false);

  const [characterName, setCharacterName] = React.useState("");
  const [selectedCharacter, setSelectedCharacter] = React.useState("");
  const [huntFile, setHuntFile] = React.useState<File | null>(null);

  const [loading, setLoading] = React.useState(false);

  /*
    🔑 LEITURA DOS DADOS
    useCharacterList é a ÚNICA fonte de verdade da lista de personagens.
    - Busca do backend
    - Cache compartilhado
    - Atualização automática após invalidate
  */
  const { data: characters = [], isLoading } = useCharacterList();

  /*
    Acesso ao cache do React Query.
    Usado APENAS para invalidar após ações.
  */
  const queryClient = useQueryClient();

  /*
    =========================
    AÇÕES QUE MUDAM O BANCO
    =========================
    Regra:
    - Executa ação
    - Se deu certo -> invalidate
  */

  async function handleConfirmCreate() {
    console.log("[CHARACTER][CREATE] Confirmando criação");

    if (!characterName.trim()) return;

    setLoading(true);

    await fetch("/api/characters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: characterName }),
    });

    /*
      🔁 Aqui acontece a mágica:
      - avisa que a lista de personagens mudou
      - todos os componentes que usam useCharacterList()
        vão refazer o fetch automaticamente
    */
    queryClient.invalidateQueries({ queryKey: ["characters"] });

    setLoading(false);
    setCreateOpen(false);
    setCharacterName("");
  }

  async function handleDelete(name: string) {
    const ok = confirm(`Deseja realmente excluir o personagem "${name}"?`);
    if (!ok) return;

    console.log("[CHARACTER][DELETE]", name);

    await fetch(`/api/characters/${name}`, { method: "DELETE" });

    /*
      Novamente:
      - backend mudou
      - frontend invalida cache
    */
    queryClient.invalidateQueries({ queryKey: ["characters"] });
  }

  async function handleImportHunt() {
    if (!selectedCharacter || !huntFile) return;

    console.log("[HUNT][IMPORT] Personagem:", selectedCharacter);

    setCharacterFromInput(selectedCharacter, true);

    const formData = new FormData();
    formData.append("file", huntFile);

    setLoading(true);

    await fetch("/api/hunt-sessions", {
      method: "POST",
      headers: {
        "x-character-name": selectedCharacter,
      },
      body: formData,
    });

    /*
      Import altera dados relacionados ao personagem.
      Mesmo que a lista não mude hoje,
      invalidar mantém o fluxo consistente.
    */
    queryClient.invalidateQueries({ queryKey: ["characters"] });

    setLoading(false);
    setImportOpen(false);
    setSelectedCharacter("");
    setHuntFile(null);
  }

  /*
    =========================
    RENDER
    =========================
  */
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

      {/* ===== Dialog Criar Personagem ===== */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar personagem</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Nome do personagem"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
          />

          <DialogFooter>
            <Button disabled={loading} onClick={handleConfirmCreate}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Dialog Importar Hunt ===== */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar Hunt</DialogTitle>
          </DialogHeader>

          <Select
            value={selectedCharacter}
            onValueChange={setSelectedCharacter}
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
