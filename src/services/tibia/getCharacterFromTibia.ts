export async function getCharacterFromTibia(name: string) {
  console.log("[TIBIA API] Buscando personagem:", name);


  const response = await fetch(
    `https://api.tibiadata.com/v4/character/${encodeURIComponent(name)}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    console.log("[TIBIA API] Erro HTTP:", response.status);
    return null;
  }

  const data = await response.json();

  if (!data.character || data.character.character?.name !== name) {
    console.log("[TIBIA API] Character não encontrado");
    return null;
  }

  console.log("[TIBIA API] Character encontrado");
  return data.character.character;
}
