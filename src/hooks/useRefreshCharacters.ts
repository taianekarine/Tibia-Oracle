import { useQueryClient } from "@tanstack/react-query";

export function useRefreshCharacters() {
  const queryClient = useQueryClient();

  function refresh() {
    console.log("[CACHE] Forçando atualização dos personagens");
    queryClient.invalidateQueries({ queryKey: ["characters"] });
  }

  return { refresh };
}
