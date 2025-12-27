import { prisma } from "@/lib/prisma";
import { getCharacterFromTibia } from "../tibia/getCharacterFromTibia";
import { mapTibiaCharacterToPrisma } from "@/mappers/tibiaCharacterMapper";

export async function updateCharacter(name: string) {
  console.log("[SERVICE] Atualizando character:", name);

  const tibiaCharacter = await getCharacterFromTibia(name);

  if (!tibiaCharacter) {
    throw new Error("CHARACTER_NOT_FOUND");
  }

  const data = mapTibiaCharacterToPrisma(tibiaCharacter);

  return prisma.character.update({
    where: { name },
    data,
  });
}
