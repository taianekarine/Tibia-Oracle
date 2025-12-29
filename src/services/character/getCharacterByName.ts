import { prisma } from "@/lib/prisma";

type GetCharacterByNameInput = {
  userId: string;
  name: string;
};

export async function getCharacterByName({
  userId,
  name,
}: GetCharacterByNameInput) {
  console.log("[SERVICE] Buscando character:", name, "user:", userId);

  return prisma.character.findFirst({
    where: {
      userId,
      name,
    },
  });
}
