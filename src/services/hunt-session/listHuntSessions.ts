import { prisma } from "@/lib/prisma";

type ListHuntSessionsInput = {
  userId: string;
  characterName: string;
};

export async function listHuntSessions({
  userId,
  characterName,
}: ListHuntSessionsInput) {
  console.log(
    "[SERVICE][HUNT] Listando hunt-sessions para",
    characterName,
    "user:",
    userId
  );

  const character = await prisma.character.findFirst({
    where: {
      userId,
      name: characterName,
    },
  });

  if (!character) {
    throw new Error("CHARACTER_NOT_FOUND");
  }

  return prisma.huntSession.findMany({
    where: {
      characterId: character.id,
    },
    orderBy: {
      sessionStart: "desc",
    },
    include: {
      killedMonsters: true,
      lootedItems: true,
    },
  });
}
