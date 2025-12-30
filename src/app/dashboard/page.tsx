"use client";

import { CharacterCard } from "@/components/character/character-card";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { CharacterCardSkeleton } from "@/components/character/character-card-skeleton";
import { ClientOnly } from "@/components/layout/client-only";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { useCharactersQuery } from "@/hooks/queries/useCharactersQuery";
import { useDashboard } from "@/contexts/DashboardContext";

export default function Page() {
  const { data: characters = [], isLoading } = useCharactersQuery();
  const { activeCharacter, setActiveCharacter } = useDashboard();

  return (
    <SidebarProvider>
      <AppSidebar
        characters={characters}
        activeCharacter={activeCharacter}
        onSelectCharacter={(name) =>
          setActiveCharacter(name, true)
        }
      />

      <SidebarInset>
        <DashboardHeader />

          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            {/* <ClientOnly>
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <CharacterCardSkeleton key={i} />
                  ))
                : characters.map((character) => (
                    <CharacterCard
                      key={character.name}
                      characterName={character.name}
                    />
                  ))}
            </ClientOnly> */}
          </div>

          <div className="min-h-screen flex-1 rounded-xl md:min-h-min">
            {/* Conteúdo principal futuro */}
          </div>

      </SidebarInset>
    </SidebarProvider>
  );
}