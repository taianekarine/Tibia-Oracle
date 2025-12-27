import { prisma } from "@/lib/prisma";

export async function deleteCharacter(name: string) {
  console.log("[SERVICE] Deletando character:", name);

  return prisma.character.delete({
    where: { name },
  });
}
