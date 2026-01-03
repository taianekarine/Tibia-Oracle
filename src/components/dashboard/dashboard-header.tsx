"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { CreateCharacterDialog } from "@/components/dialogs/create-character-dialog";
import { ImportHuntDialog } from "@/components/dialogs/import-hunt-dialog";

import { ModeToggle } from "@/components/theme/mode-toggle";
import { LogoutButton } from "@/components/auth/logout-button";

export function DashboardHeader() {
  return (
    <header className="flex h-14 items-center gap-3 border-b px-4">
      {/* ESQUERDA */}
      <div className="flex items-center gap-2">
        <SidebarTrigger />

        <Separator orientation="vertical" className="h-4 mx-1" />

        <CreateCharacterDialog>
          <Button size="sm" variant="outline">
            Criar personagem
          </Button>
        </CreateCharacterDialog>

        <ImportHuntDialog>
          <Button size="sm">
            Importar hunt
          </Button>
        </ImportHuntDialog>
      </div>

      {/* CENTRO (reservado p/ título, abas, status) */}
      <div className="flex-1" />

      {/* DIREITA */}
      <div className="flex items-center gap-2">
        <ModeToggle />
        <LogoutButton />
      </div>
    </header>
  );
}
