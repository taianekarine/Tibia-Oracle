import { useQuery } from "@tanstack/react-query";

/*
  Tipo completo do personagem.
  Usado em cards e telas de detalhe.
*/
export type CharacterDetails = {
  id: string;
  name: string;
  vocation?: string;
  level?: number;
};

/*
  Função responsável por buscar UM personagem pelo nome.
*/
async function fetchCharacterDetails(
  name: string
): Promise<CharacterDetails> {
  console.log("[QUERY] Buscando detalhes do personagem:", name);

  const res = await fetch(
    `/api/characters/${encodeURIComponent(name)}`,
    {
      headers: {
        "x-character-name": name,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Erro ao buscar detalhes do personagem");
  }

  return res.json();
}

/*
  Hook para DETALHES de um personagem específico.
  Usado em:
  - CharacterCard
  - Páginas de detalhe
*/
export function useCharacterDetails(name: string) {
  return useQuery({
    queryKey: ["character", name], // cache do PERSONAGEM
    queryFn: () => fetchCharacterDetails(name),
    enabled: Boolean(name?.trim()), // só executa se o nome for válido
  });
}
