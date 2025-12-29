import { normalizeHunt } from "@/lib/hunt/normalize";
import { validateHunt } from "@/lib/hunt/validate";
import { persistHunt } from "@/lib/hunt/persistHunt";
import { getCharacterByName } from "@/services/character/getCharacterByName";

type CreateHuntSessionInput = {
  userId: string;
  characterName: string;
  rawData: unknown;
};

export async function createHuntSession({
  userId,
  characterName,
  rawData,
}: CreateHuntSessionInput) {
  console.log(
    "[SERVICE][HUNT] Criando hunt-session para",
    characterName,
    "user:",
    userId
  );

  // 1. Garantir que o character pertence ao user
  const character = await getCharacterByName({
    userId,
    name: characterName,
  });

  if (!character) {
    throw new Error("CHARACTER_NOT_FOUND");
  }

  // 2. Normalizar dados do analyser
  const normalized = normalizeHunt(rawData);
  console.log("[HUNT][NORMALIZE] Payload bruto:", rawData);
  console.log("[HUNT][NORMALIZE] Payload bruto:", rawData);


  // 3. Validar dados (contrato ORIGINAL)
  validateHunt({
    characterName,
    data: normalized,
  });

  // 4. Persistir hunt usando contrato ORIGINAL
  const huntSession = await persistHunt(character.id, normalized);

  console.log("[SERVICE][HUNT] Hunt-session salva");

  return huntSession;
}
