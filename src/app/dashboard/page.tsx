"use client";

import { CharacterCard } from "@/components/character/character-card";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { useCharacterList } from "@/hooks/queries/useCharactersQuery";

export default function Page() {
  const { data: characters = [], isLoading } = useCharacterList();

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <DashboardHeader />

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            {isLoading && <p>Carregando personagens…</p>}

            {characters.map((character) => (
              <CharacterCard
                key={character.id}
                characterName={character.name}
              />
            ))}
          </div>

          <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
            {/* Conteúdo principal futuro */}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
