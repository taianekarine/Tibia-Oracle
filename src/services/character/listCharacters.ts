import { prisma } from "@/lib/prisma";

export async function listCharacters() {
  console.log("[DB] Listando todos os characters");

  return prisma.character.findMany({
    orderBy: {
      name: "asc",
    },
  });
}
