import { useQueryClient } from "@tanstack/react-query";

export function useInvalidateCharacters() {
  const queryClient = useQueryClient();

  function invalidate() {
    console.log("[QUERY] Invalidando cache de characters");
    queryClient.invalidateQueries({ queryKey: ["characters"] });
  }

  return { invalidate };
}
