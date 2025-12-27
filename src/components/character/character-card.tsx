"use client";

/*
  Este componente é APENAS de exibição.
  Ele NÃO controla fetch, loading manual nem estado de dados.
  Tudo isso é responsabilidade do React Query.
*/

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

import { useCharacterDetails } from "@/hooks/useCharacterDetails";

/*
  Mapeia vocações completas para siglas.
  Isso é lógica de apresentação, então fica no componente.
*/
function getVocationAbbreviation(vocation?: string) {
  if (!vocation) return "?";

  const map: Record<string, string> = {
    "Elite Knight": "EK",
    "Elder Druid": "ED",
    "Exalted Monk": "EM",
    "Master Sorcerer": "MS",
    "Royal Paladin": "RP",
  };

  return map[vocation] ?? vocation;
}

type CharacterCardProps = {
  characterName: string;
};

/*
  Card responsável por exibir UM personagem específico.
  Ele recebe apenas o nome e delega toda a busca ao hook.
*/
export function CharacterCard({ characterName }: CharacterCardProps) {
  /*
    🔑 Leitura dos detalhes do personagem via React Query

    O hook:
    - busca no backend
    - controla loading
    - controla erro
    - participa do cache global
    - atualiza automaticamente após invalidate
  */
  const {
    data: character,
    isLoading,
    isError,
  } = useCharacterDetails(characterName);

  /*
    Estado de carregamento.
    Não usamos useState nem useEffect.
  */
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando personagem…</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  /*
    Erro ou personagem inexistente.
    Ex: deletado pela sidebar.
  */
  if (isError || !character) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Personagem não encontrado</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  /*
    A partir daqui, os dados são confiáveis.
  */
  const vocationAbbr = getVocationAbbreviation(character.vocation);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {character.name} {vocationAbbr} {character.level ?? "?"}
        </CardTitle>

        <CardDescription>
          Personagem cadastrado no sistema
        </CardDescription>
      </CardHeader>

      <CardFooter className="flex flex-col items-start gap-2 text-sm">
        {/* FUTURO: dados agregados de hunt */}
        <div>
          Supplies: <span className="text-muted-foreground">--</span>
        </div>

        <div>
          Loot: <span className="text-muted-foreground">--</span>
        </div>

        <div>
          Balance: <span className="text-muted-foreground">--</span>
        </div>
      </CardFooter>
    </Card>
  );
}
