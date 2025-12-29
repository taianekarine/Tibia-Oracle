import { prisma } from "@/lib/prisma";

export async function listCharacters(userId: string) {
  console.log("[SERVICE] Listando characters do user:", userId);

  return prisma.character.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
