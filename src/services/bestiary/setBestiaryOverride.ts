import { prisma } from "@/lib/prisma";

type Input = {
  characterName: string;
  monsterName: string;
  completed: boolean;
};

export async function setBestiaryOverride({
  characterName,
  monsterName,
  completed,
}: Input) {
  console.log("[BESTIARY][OVERRIDE] set", {
    characterName,
    monsterName,
    completed,
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

  return prisma.characterBestiaryOverride.upsert({
    where: {
      characterId_monsterName: {
        characterId: character.id,
        monsterName: normalizedMonster,
      },
    },
    update: {
      completed,
    },
    create: {
      characterId: character.id,
      monsterName: normalizedMonster,
      completed,
      source: "manual",
    },
  });
}
