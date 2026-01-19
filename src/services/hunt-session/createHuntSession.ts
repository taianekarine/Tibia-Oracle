import { normalizeHunt } from "@/lib/hunt/normalize";
import { validateHunt } from "@/lib/hunt/validate";
import { persistHunt } from "@/lib/hunt/persistHunt";
import { getCharacterByName } from "@/services/character/getCharacterByName";

type CreateHuntSessionInput = {
  userId: string;
  characterName: string;
  rawData: string;
};


/**
 * Cria uma Hunt Session a partir de um Hunt Analyser do Tibia.
 *
 * Fluxo:
 * 1. Garantir que o personagem pertence ao usuário
 * 2. Normalizar os dados do Hunt Analyser
 * 3. Validar duplicidade e integridade
 * 4. Persistir no banco de dados
 */
export async function createHuntSession({
  userId,
  characterName,
  rawData,
}: CreateHuntSessionInput) {
  console.log(
    "[HUNT][SERVICE] Iniciando criação de hunt-session",
    { userId, characterName }
  );

  /**
   * 1️⃣ Garantir que o personagem pertence ao usuário
   */
  const character = await getCharacterByName({
    userId,
    name: characterName,
  });

  if (!character) {
    throw new Error("CHARACTER_NOT_FOUND");
  }

  /**
   * 2️⃣ Normalizar dados do Hunt Analyser
   * Aqui transformamos o JSON bruto do Tibia
   * em uma estrutura previsível e segura.
   */
  const normalizedHunt = normalizeHunt(rawData);

  console.log("[HUNT][NORMALIZED]", normalizedHunt);

  /**
   * 3️⃣ Validar dados do Hunt
   * - evita duplicidade
   * - garante integridade dos dados
   */
  await validateHunt({
    characterName,
    data: normalizedHunt,
  });

  /**
   * 4️⃣ Persistir Hunt no banco
   * Salva:
   * - sessão
   * - monstros mortos
   * - itens lootados
   */
  const huntSession = await persistHunt(
    character.id,
    normalizedHunt
  );

  console.log(
    "[HUNT][SERVICE] Hunt-session criada com sucesso",
    huntSession.id
  );

  return huntSession;
}
