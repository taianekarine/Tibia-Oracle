"use client";

import { CharacterCard } from "@/components/character/character-card";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { useCharacterList } from "@/hooks/useCharacterList";

export default function Page() {
  /*
    🔑 AQUI está a correção real:
    A lista de personagens vem do React Query,
    não de um fetch isolado.
  */
  const { data: characters = [], isLoading } = useCharacterList();

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />

            <Separator orientation="vertical" className="mr-2 h-4" />

            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

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
