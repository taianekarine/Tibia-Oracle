import { prisma } from "@/lib/prisma";

export async function getCharacterByName(name: string) {
  console.log("[DB] Buscando character no banco:", name);

  return prisma.character.findUnique({
    where: { name },
  });
}
