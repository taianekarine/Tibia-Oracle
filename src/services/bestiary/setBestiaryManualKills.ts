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

  const current = await prisma.characterBestiaryOverride.findUnique({
    where: {
      characterId_monsterName: {
        characterId: character.id,
        monsterName: normalizedMonster,
      },
    },
  });

  if (!current) {
    return prisma.characterBestiaryOverride.create({
      data: {
        characterId: character.id,
        monsterName: normalizedMonster,
        manualKills,
        source: "manual",
      },
    });
  }

  return prisma.characterBestiaryOverride.update({
    where: {
      characterId_monsterName: {
        characterId: character.id,
        monsterName: normalizedMonster,
      },
    },
    data: {
      manualKills: current.manualKills + manualKills, // ← ISSO
    },
  });
}
