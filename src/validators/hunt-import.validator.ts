import type { RawHunt } from "@/types/hunt";

const REQUIRED_FIELDS: Array<keyof RawHunt> = [
  "Session start", "Session end", "Session length", "Balance", "Loot",
  "Supplies", "Damage", "Damage/h", "Healing", "Healing/h", "Raw XP Gain",
  "Raw XP/h", "XP Gain", "XP/h", "Killed Monsters", "Looted Items",
];

function validateEntries(
  value: unknown,
  field: "Killed Monsters" | "Looted Items"
): asserts value is Array<{ Name: string; Count: number }> {
  if (!Array.isArray(value)) {
    throw new Error(`${field} deve ser uma lista`);
  }

  value.forEach((entry, index) => {
    if (
      typeof entry !== "object" ||
      entry === null ||
      !("Name" in entry) ||
      !("Count" in entry) ||
      typeof entry.Name !== "string" ||
      !entry.Name.trim() ||
      !Number.isSafeInteger(entry.Count) ||
      Number(entry.Count) <= 0
    ) {
      throw new Error(`${field}[${index}] é inválido`);
    }
  });
}

export function validateRawHunt(value: unknown): RawHunt {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Hunt Analyzer deve ser um objeto JSON");
  }

  const hunt = value as Record<string, unknown>;
  for (const field of REQUIRED_FIELDS) {
    if (!(field in hunt)) {
      throw new Error(`Campo obrigatório ausente: ${field}`);
    }
  }

  validateEntries(hunt["Killed Monsters"], "Killed Monsters");
  validateEntries(hunt["Looted Items"], "Looted Items");
  return hunt as unknown as RawHunt;
}
