export const queryKeys = {
  characters: ["characters"] as const,
  character: (name: string) => ["character", name] as const,
  huntSessions: (name: string) => ["hunt-sessions", name] as const,
  dashboard: ["dashboard"] as const,
};
