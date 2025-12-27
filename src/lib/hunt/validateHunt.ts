import { prisma } from "@/lib/prisma";
import { normalizeCharacterName } from "./normalize";

interface ValidateHuntParams {
  characterName: string;
  data: {
    sessionStart: Date;
    sessionEnd: Date;
    sessionLength: string;
    xpGain: number;
    rawXpGain: number;
    loot: number;
    supplies: number;
    balance: number;
  };
}

export async function validateHunt({
  characterName,
  data,
}: ValidateHuntParams) {
  console.log("[HUNT][VALIDATE] Validando duplicidade global");

  const normalizedName = normalizeCharacterName(characterName)

  const duplicate = await prisma.huntSession.findFirst({
    where: {
      sessionStart: data.sessionStart,
      sessionEnd: data.sessionEnd,
      xpGain: data.xpGain,
      rawXpGain: data.rawXpGain,
      loot: data.loot,
      supplies: data.supplies,
      balance: data.balance,
    },
    include: {
      character: true,
    },
  });

  if (duplicate) {
    throw new Error(
      `Este Hunt Analyser já está vinculado ao personagem ${duplicate.character.name}`
    );
  }

  console.log("[HUNT][VALIDATE] Nenhuma duplicidade global encontrada");

  // ⚠️ VALIDAÇÃO DO HEADER (BUG 2)
  if (!characterName) {
    throw new Error("Header x-character-name não informado");
  }

  const character = await prisma.character.findFirst({
    where: {
      name: {
        equals: normalizedName,
        mode: "insensitive",
      },
    },
  });

  if (!character) {
    throw new Error("Personagem não encontrado");
  }

  
  return character;
}
