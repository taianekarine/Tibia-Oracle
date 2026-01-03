"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";

import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";

import { useCharactersQuery } from "@/hooks/queries/useCharactersQuery";
import { useDashboard } from "@/contexts/DashboardContext";

interface DashboardShellProps {
  mode: "global" | "character";
  characterName?: string;
}

export function DashboardShell({
  mode,
  characterName,
}: DashboardShellProps) {
  console.log("[DASHBOARD][SHELL]", { mode, characterName });
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

        <main className="flex-1 p-4">
          <DashboardTabs
            mode={mode}
            characterName={characterName}
          />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
