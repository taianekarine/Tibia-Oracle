import { prisma } from "@/lib/prisma";
import { getCharacterFromTibia } from "../tibia/getCharacterFromTibia";
import { mapTibiaCharacterToPrisma } from "@/mappers/tibiaCharacterMapper";

type UpdateCharacterInput = {
  userId: string;
  name: string;
};

export async function updateCharacter({ userId, name }: UpdateCharacterInput) {
  console.log("[SERVICE] Atualizando character:", name, "user:", userId);

  const existing = await prisma.character.findFirst({
    where: { userId, name },
  });

  if (!existing) {
    throw new Error("CHARACTER_NOT_FOUND");
  }

  const tibiaCharacter = await getCharacterFromTibia(name);

  if (!tibiaCharacter) {
    throw new Error("CHARACTER_NOT_FOUND");
  }

  const data = mapTibiaCharacterToPrisma(tibiaCharacter);

  await prisma.character.updateMany({
    where: { userId, name },
    data,
  });

  return prisma.character.findFirst({
    where: { userId, name },
  });
}
