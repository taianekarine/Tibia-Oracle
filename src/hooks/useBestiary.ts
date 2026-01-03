import { useQuery } from "@tanstack/react-query";
import { BestiaryByType } from "@/types/bestiary";

export function useBestiary(characterId: string | null) {
  return useQuery<BestiaryByType>({
    queryKey: ["bestiary", characterId],
    enabled: !!characterId,
    queryFn: async () => {
      const res = await fetch(`/api/bestiary/${characterId}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Erro ao carregar bestiário");
      }

      return res.json();
    },
  });
}
