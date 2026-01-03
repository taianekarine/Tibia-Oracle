import { prisma } from "@/lib/prisma";

export async function removeBestiaryManualKills(
  characterName: string,
  monsterName: string,
  manualKills: number
) {
  console.log("[BESTIARY][MANUAL_KILLS][REMOVE]", {
    characterName,
    monsterName,
    manualKills,
  });

  if (!characterName || !monsterName || manualKills <= 0) {
    throw new Error("Dados inválidos para remoção");
  }

  const character = await prisma.character.findUnique({
    where: { name: characterName },
    select: { id: true },
  });

  if (!character) {
    throw new Error("Personagem não encontrado");
  }

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
    throw new Error("Bestiário manual não encontrado");
  }

  const remaining = current.manualKills - manualKills;

  // Se zerar ou ficar negativo, apaga
  if (remaining <= 0) {
    return prisma.characterBestiaryOverride.delete({
      where: {
        characterId_monsterName: {
          characterId: character.id,
          monsterName: normalizedMonster,
        },
      },
    });
  }

  // Caso contrário, atualiza
  return prisma.characterBestiaryOverride.update({
    where: {
      characterId_monsterName: {
        characterId: character.id,
        monsterName: normalizedMonster,
      },
    },
    data: {
      manualKills: remaining,
    },
  });
}
