"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/contexts/DashboardContext";

type CharacterCardProps = {
  characterName: string;
};

export function CharacterCard({
  characterName,
}: CharacterCardProps) {
  const { setActiveCharacter } = useDashboard();

  function handleSelect(): void {
    console.log("[CHARACTER][SELECT]", characterName);
    setActiveCharacter(characterName, true);
  }

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSelect();
        }
      }}
      className="cursor-pointer hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
    >
      <CardHeader>
        <CardTitle>{characterName}</CardTitle>
      </CardHeader>
    </Card>
  );
}
