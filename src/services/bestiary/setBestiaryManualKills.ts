import { prisma } from "@/lib/prisma";

type Input = {
  characterName: string;
  monsterName: string;
  manualKills: number;
};

export async function setBestiaryManualKills({
  characterName,
  monsterName,
  manualKills,
}: Input) {
  console.log("[BESTIARY][MANUAL_KILLS]", {
    characterName,
    monsterName,
    manualKills,
  });

  if (!characterName) throw new Error("characterName obrigatório");
  if (!monsterName) throw new Error("monsterName obrigatório");
  if (manualKills < 0) throw new Error("manualKills inválido");

  const character = await prisma.character.findUnique({
    where: { name: characterName },
    select: { id: true },
  });

  if (!character) throw new Error("Personagem não encontrado");

  const normalizedMonster = monsterName.trim().toLowerCase();

  return prisma.characterBestiaryOverride.upsert({
    where: {
      characterId_monsterName: {
        characterId: character.id,
        monsterName: normalizedMonster,
      },
    },
    update: {
      manualKills,
    },
    create: {
      characterId: character.id,
      monsterName: normalizedMonster,
      manualKills,
      source: "manual",
    },
  });
}
