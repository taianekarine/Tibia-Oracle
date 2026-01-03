import { prisma } from "@/lib/prisma";

export async function removeBestiaryManualKills(
  characterName: string,
  monsterName: string,
  manualKills: number // DELTA
) {
  console.log("[BESTIARY][MANUAL_KILLS][REMOVE]", {
    characterName,
    monsterName,
    manualKills,
  });

  if (!characterName || !monsterName) {
    throw new Error("Dados obrigatórios ausentes");
  }

  if (manualKills <= 0) {
    throw new Error("manualKills inválido");
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
    console.warn("[BESTIARY][REMOVE] Registro inexistente, ignorando");
    return;
  }

  const remaining = current.manualKills - manualKills;

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
