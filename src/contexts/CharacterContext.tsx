"use client";

import React, { createContext, useContext, useState } from "react";

type CharacterContextType = {
  characterName: string | null;
  setCharacterName: (name: string | null) => void;
  resetCharacter: () => void;
};

const CharacterContext = createContext<CharacterContextType | null>(null);

export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const [characterName, setCharacterNameState] = useState<string | null>(null);

  function setCharacterName(name: string | null) {
    console.log("[CHARACTER][SET]", name);
    setCharacterNameState(name);
  }

  function resetCharacter() {
    console.log("[CHARACTER][RESET]");
    setCharacterNameState(null);
  }

  return (
    <CharacterContext.Provider
      value={{ characterName, setCharacterName, resetCharacter }}
    >
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacterContext() {
  const ctx = useContext(CharacterContext);
  if (!ctx) {
    throw new Error(
      "useCharacterContext must be used inside CharacterProvider"
    );
  }
  return ctx;
}
