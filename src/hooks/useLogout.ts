"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { clearAuthToken } from "@/lib/auth-token";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  function logout() {
    console.log("[AUTH][LOGOUT] Logout iniciado");

    // 1. Remove token
    clearAuthToken();

    // 2. Limpa cache de dados sensíveis
    queryClient.clear();

    // 3. Redireciona para login
    router.replace("/");
  }

  return { logout };
}
