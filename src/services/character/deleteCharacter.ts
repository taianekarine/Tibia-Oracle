import { prisma } from "@/lib/prisma";

type DeleteCharacterInput = {
  userId: string;
  name: string;
};

export async function deleteCharacter({ userId, name }: DeleteCharacterInput) {
  console.log("[SERVICE] Deletando character:", name, "user:", userId);

  await prisma.character.deleteMany({
    where: { userId, name },
  });
}
