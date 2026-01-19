import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";

export type ItemsResponse = {
  characters: Record<string, Record<string, number>>;
  global: Record<string, number>;
};

export function useItemsQuery() {
  const api = useApi();

  return useQuery<ItemsResponse>({
    queryKey: ["items"],
    queryFn: async () => {
      console.log("[API] GET /api/items");

      // ⬇️ useApi já retorna o JSON
      const data = await api.get("/api/items");

      // Segurança extra pra debug
      if (!data) {
        throw new Error("Items API retornou vazio");
      }

      return data as ItemsResponse;
    },
  });
}
