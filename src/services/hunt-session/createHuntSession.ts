import { normalizeHunt } from "@/lib/hunt/normalize";
import { createHunt } from "@/repositories/hunt.repository";
import { getCharacterByName } from "@/services/character/getCharacterByName";
import { validateRawHunt } from "@/validators/hunt-import.validator";

type CreateHuntSessionInput = {
  userId: string;
  characterName: string;
  payload: unknown;
};

export async function createHuntSession({
  userId,
  characterName,
  payload,
}: CreateHuntSessionInput) {
  const character = await getCharacterByName({ userId, name: characterName });
  if (!character) {
    throw new Error("CHARACTER_NOT_FOUND");
  }

  const rawHunt = validateRawHunt(payload);
  console.log("[IMPORT] Sessão validada");
  const normalizedHunt = normalizeHunt(rawHunt);

  console.log("[IMPORT] Monstros processados");
  console.log("[IMPORT] Itens processados");
  const huntSession = await createHunt(character.id, normalizedHunt);
  console.log("[IMPORT] Sessão salva", huntSession.id);
  return huntSession;
}
