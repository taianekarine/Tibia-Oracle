"use client";

import { useEffect, useState } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardTabs } from "@/components/tabs/dashboard-tab";

import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";

import { useCharactersQuery } from "@/hooks/queries/useCharactersQuery";
import { useDashboard } from "@/contexts/DashboardContext";

type DashboardShellProps = {
  mode: "global" | "character";
  characterName?: string;
};

const DEFAULT_TAB = "overview";

export function DashboardShell({
  mode,
  characterName,
}: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: characters = [] } =
    useCharactersQuery();

  const {
    activeCharacter,
    setActiveCharacter,
    resetCharacter,
  } = useDashboard();

  const tabFromUrl =
    searchParams.get("tab") ?? DEFAULT_TAB;

  const [activeTab, setActiveTab] =
    useState(tabFromUrl);

  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  function handleTabChange(tab: string) {
    const params = new URLSearchParams(
      searchParams.toString()
    );
    params.set("tab", tab);

    router.replace(
      `${pathname}?${params.toString()}`,
      { scroll: false }
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar
        characters={characters}
        activeCharacter={activeCharacter}
        onSelectCharacter={(name) =>
          setActiveCharacter(name, true)
        }
        onSelectGlobal={() => resetCharacter()}
      />

      <SidebarInset>
        <DashboardHeader />

        <main className="flex-1 p-4">
          <DashboardTabs
            mode={mode}
            characterName={characterName}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
