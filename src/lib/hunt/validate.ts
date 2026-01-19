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

/**
 * Valida um Hunt antes de ser persistido.
 *
 * Responsabilidades:
 * 1. Impedir duplicidade global de hunt
 * 2. Garantir que o personagem existe
 *
 * NÃO salva nada.
 * NÃO normaliza dados.
 */
export async function validateHunt({
  characterName,
  data,
}: ValidateHuntParams) {
  console.log("[HUNT][VALIDATE] Iniciando validação do hunt");

  /**
   * 1️⃣ Garantir que o nome do personagem foi informado
   * Defesa básica de contrato.
   */
  if (!characterName?.trim()) {
    throw new Error("Header x-character-name não informado");
  }

  const normalizedName = normalizeCharacterName(characterName);

  /**
   * 2️⃣ Verificar duplicidade global
   * Evita importar o mesmo Hunt Analyser mais de uma vez,
   * mesmo que seja para outro personagem.
   */
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

  console.log("[HUNT][VALIDATE] Nenhuma duplicidade encontrada");

  /**
   * 3️⃣ Garantir que o personagem existe
   * (defesa extra, mesmo já validado no service)
   */
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

  console.log(
    "[HUNT][VALIDATE] Validação concluída com sucesso para",
    normalizedName
  );

  /**
   * Retornar o personagem validado pode ser útil
   * no futuro, mas por enquanto apenas confirma sucesso.
   */
  return character;
}
