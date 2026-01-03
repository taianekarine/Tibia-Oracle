import { prisma } from "@/lib/prisma";

export async function removeBestiaryManualKills(
  characterName: string,
  monsterName: string
) {
  console.log("[BESTIARY][MANUAL_KILLS][REMOVE]", {
    characterName,
    monsterName,
  });

  if (!characterName || !monsterName) {
    throw new Error("Dados obrigatórios ausentes");
  }

  const character = await prisma.character.findUnique({
    where: { name: characterName },
    select: { id: true },
  });

  if (!character) {
    throw new Error("Personagem não encontrado");
  }

  const normalizedMonster = monsterName.trim().toLowerCase();

  return prisma.characterBestiaryOverride.delete({
    where: {
      characterId_monsterName: {
        characterId: character.id,
        monsterName: normalizedMonster,
      },
    },
  });
}
