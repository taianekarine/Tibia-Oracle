"use client";

import React, {
  createContext,
  useContext,
  useState,
} from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { DashboardContextType } from "@/types/dashboard";

const DashboardContext =
  createContext<DashboardContextType | null>(null);

function getCharacterFromPath(
  pathname: string | null
): string | null {
  if (!pathname) return null;

  const parts = pathname.split("/");
  const last = parts.at(-1);

  if (!last || last === "dashboard") return null;

  return decodeURIComponent(last);
}

export function DashboardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ✅ Estado nasce correto, sem useEffect
  const [activeCharacter, setActiveCharacterState] =
    useState<string | null>(() =>
      getCharacterFromPath(pathname)
    );

  // 🔹 Preserva query (?tab=...)
  function getQueryString() {
    const params = searchParams.toString();
    return params ? `?${params}` : "";
  }

  function setActiveCharacter(
    name: string,
    syncUrl = false
  ) {
    const normalized = name.trim();
    if (!normalized) return;

    setActiveCharacterState(normalized);

    if (syncUrl) {
      router.push(
        `/dashboard/${encodeURIComponent(
          normalized
        )}${getQueryString()}`
      );
    }
  }

  function resetCharacter() {
    setActiveCharacterState(null);
    router.push(`/dashboard${getQueryString()}`);
  }

  const isReady =
    typeof activeCharacter === "string" &&
    activeCharacter.length > 0;

  return (
    <DashboardContext.Provider
      value={{
        activeCharacter,
        setActiveCharacter,
        resetCharacter,
        isReady,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);

  if (!ctx) {
    throw new Error(
      "useDashboard deve ser usado dentro de DashboardProvider"
    );
  }

  return ctx;
}
