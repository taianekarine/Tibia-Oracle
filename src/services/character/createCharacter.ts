import { prisma } from "@/lib/prisma";
import { getCharacterFromTibia } from "../tibia/getCharacterFromTibia";
import { mapTibiaCharacterToPrisma } from "@/mappers/tibiaCharacterMapper";

type CreateCharacterInput = {
  userId: string;
  name: string;
};

export async function createCharacter({ userId, name }: CreateCharacterInput) {
  console.log("[SERVICE] Criando character:", name, "para user:", userId);

  const tibiaCharacter = await getCharacterFromTibia(name);

  if (!tibiaCharacter) {
    throw new Error("CHARACTER_NOT_FOUND");
  }

  const data = mapTibiaCharacterToPrisma(tibiaCharacter);

  const character = await prisma.character.create({
    data: {
      ...data,
      userId,
    },
  });

  console.log("[SERVICE] Character salvo no banco com userId");
  return character;
}
