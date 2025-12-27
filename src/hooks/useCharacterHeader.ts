"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCharacterContext } from "@/contexts/CharacterContext";

export function useCharacterHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const { characterName, setCharacterName, resetCharacter } =
    useCharacterContext();

  // 1. Leitura da URL
  useEffect(() => {
    if (!pathname) return;

    const parts = pathname.split("/");
    const possibleName = parts[parts.length - 1];

    if (!possibleName) return;

    if (!characterName) {
      console.log(
        "[CHARACTER][URL] Definido a partir da rota:",
        possibleName
      );
      setCharacterName(possibleName);
      return;
    }

    if (characterName !== possibleName) {
      console.error(
        "[CHARACTER][CONFLICT] URL vs Estado",
        { url: possibleName, state: characterName }
      );
    }
  }, [pathname, characterName, setCharacterName]);

  // 2. Validação de prontidão
  const isReady = useMemo(() => {
    return typeof characterName === "string" && characterName.length > 0;
  }, [characterName]);

  // 3. Geração de headers
  function getHeaders() {
    if (!isReady) {
      console.error(
        "[CHARACTER][ERROR] Tentativa de gerar header sem personagem ativo"
      );
      throw new Error("Fluxo inválido: personagem não definido");
    }

    return {
      "x-character-name": characterName as string
    };
  }

  // 4. Entrada manual do usuário
  function setCharacterFromInput(input: string, syncUrl = false) {
    const normalized = input;

    if (!normalized) {
      console.error("[CHARACTER][INPUT INVALID]", input);
      return;
    }

    console.log("[CHARACTER][INPUT] Definido manualmente:", normalized);
    setCharacterName(normalized);

    if (syncUrl) {
      router.push(`/characters/${encodeURIComponent(normalized)}`);
    }
  }

  return {
    characterName,
    isReady,
    getHeaders,
    setCharacterFromInput,
    resetCharacter
  };
}
