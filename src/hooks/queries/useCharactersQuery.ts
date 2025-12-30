import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";
import { getAuthToken } from "@/lib/auth-token";

type Character = {
  id: string;
  name: string;
};

export function useCharactersQuery() {
  const api = useApi();
  const token = getAuthToken();

  return useQuery<Character[]>({
    queryKey: ["characters"],
    enabled: !!token, // 🔑 ISSO RESOLVE TUDO
    queryFn: async () => {
      console.log("[API] GET /characters");
      return api.get("/api/characters");
    },
  });
}
