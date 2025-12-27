import { prisma } from "@/lib/prisma";
import { getCharacterFromTibia } from "../tibia/getCharacterFromTibia";
import { mapTibiaCharacterToPrisma } from "@/mappers/tibiaCharacterMapper";

export async function createCharacter(name: string) {
  console.log("[SERVICE] Criando character:", name);

  const tibiaCharacter = await getCharacterFromTibia(name);

  if (!tibiaCharacter) {
    throw new Error("CHARACTER_NOT_FOUND");
  }

  const data = mapTibiaCharacterToPrisma(tibiaCharacter);

  const character = await prisma.character.create({
    data,
  });

  console.log("[SERVICE] Character salvo no banco");
  return character;
}
