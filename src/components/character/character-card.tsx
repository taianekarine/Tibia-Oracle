"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useCharacterHeader } from "@/hooks/state/useActiveCharacter";

type Props = {
  characterName: string;
};

export function CharacterCard({ characterName }: Props) {
  const { setCharacterFromInput } = useCharacterHeader();

  function handleSelect() {
    console.log("[CHARACTER][SELECT]", characterName);
    setCharacterFromInput(characterName, true); // aqui SIM sincroniza URL
  }

  return (
    <Card
      onClick={handleSelect}
      className="cursor-pointer hover:bg-muted"
    >
      <CardHeader>
        <CardTitle>{characterName}</CardTitle>
      </CardHeader>
    </Card>
  );
}
