"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

type SidebarCharacter = {
  id: string;
  name: string;
};

type AppSidebarProps = {
  characters: SidebarCharacter[];
  activeCharacter: string | null;
  onSelectCharacter: (name: string) => void;
  onSelectGlobal: () => void; // 👈 agora é obrigatório
};


export function AppSidebar({
  characters,
  activeCharacter,
  onSelectCharacter,
  onSelectGlobal,
}: AppSidebarProps) {
  const isGlobalActive = activeCharacter === null;

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-semibold">Navegação</h2>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="px-2 space-y-3">

          {/* GLOBAL */}
          <div>
            <div className="px-2 py-1 text-xs text-muted-foreground uppercase">
              Global
            </div>

            <button
              onClick={onSelectGlobal}
              className={[
                "w-full rounded-md px-2 py-1 text-left text-sm",
                "hover:bg-muted",
                isGlobalActive ? "bg-muted font-medium" : "",
              ].join(" ")}
            >
              Visão Global
            </button>
          </div>

          {/* PERSONAGENS */}
          <div>
            <div className="px-2 py-1 text-xs text-muted-foreground uppercase">
              Personagens
            </div>

            {characters.map((char) => {
              const isActive = char.name === activeCharacter;

              return (
                <button
                  key={char.name}
                  onClick={() => onSelectCharacter(char.name)}
                  className={[
                    "w-full rounded-md px-2 py-1 text-left text-sm",
                    "hover:bg-muted",
                    isActive ? "bg-muted font-medium" : "",
                  ].join(" ")}
                >
                  {char.name}
                </button>
              );
            })}
          </div>

        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-4 text-xs text-muted-foreground">
        Navegação
      </SidebarFooter>
    </Sidebar>
  );
}
