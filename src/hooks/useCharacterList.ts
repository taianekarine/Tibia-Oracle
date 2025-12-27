import { useQuery } from "@tanstack/react-query";

/*
  Tipo usado no frontend.
  Representa um personagem resumido para listas.
*/
export type CharacterListItem = {
  id: string;
  name: string;
};

/*
  Função responsável APENAS por buscar a LISTA de personagens.
  Não é hook. Só fetch.
*/
async function fetchCharacterList(): Promise<CharacterListItem[]> {
  console.log("[QUERY] Buscando lista de personagens");

  const res = await fetch("/api/characters");

  if (!res.ok) {
    throw new Error("Erro ao buscar lista de personagens");
  }

  return res.json();
}

/*
  Hook para LISTA de personagens.
  Usado em:
  - Sidebar
  - Selects
  - Dashboard geral
*/
export function useCharacterList() {
  return useQuery({
    queryKey: ["characters"], // cache da LISTA
    queryFn: fetchCharacterList,
  });
}
