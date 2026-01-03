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
};

export function AppSidebar({
  characters,
  activeCharacter,
  onSelectCharacter,
}: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-semibold">Personagens</h2>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="px-2">
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
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-4 text-xs text-muted-foreground">
        Navegação
      </SidebarFooter>
    </Sidebar>
  );
}
