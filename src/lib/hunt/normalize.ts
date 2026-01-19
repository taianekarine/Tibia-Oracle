import {
  NormalizedHunt,
  HuntMonster,
  HuntLootItem,
} from "@/types/hunt";

/**
 * Estrutura mínima esperada do Hunt Analyser do Tibia.
 * Aqui NÃO validamos negócio, apenas formato.
 */
type RawHuntData = {
  ["Session start"]: string;
  ["Session end"]: string;
  ["Session length"]: string;

  ["Balance"]: string | number;
  ["Loot"]: string | number;
  ["Supplies"]: string | number;

  ["Damage"]: string | number;
  ["Damage/h"]: string | number;
  ["Healing"]: string | number;
  ["Healing/h"]: string | number;

  ["Raw XP Gain"]: string | number;
  ["Raw XP/h"]: string | number;
  ["XP Gain"]: string | number;
  ["XP/h"]: string | number;

  ["Killed Monsters"]: {
    Name: string;
    Count: number;
  }[];

  ["Looted Items"]: {
    Name: string;
    Count: number;
  }[];
};

/* ======================================================
   PARSE DE ENTRADA (único ponto flexível)
====================================================== */

/**
 * Recebe string ou objeto e garante que temos um objeto válido.
 * NÃO decide se o Hunt faz sentido.
 * Apenas garante formato mínimo.
 */
function parseRawInput(raw: string | object): RawHuntData {
  const parsed =
    typeof raw === "string" ? JSON.parse(raw) : raw;

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Hunt analyser inválido");
  }

  return parsed as RawHuntData;
}

/* ======================================================
   CONVERSORES BÁSICOS (determinísticos)
====================================================== */

/**
 * Converte datas do formato do Tibia para Date.
 */
function parseDate(value: string): Date {
  const isoLike = value.replace(", ", "T");
  const date = new Date(isoLike);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Data inválida: ${value}`);
  }

  return date;
}

/**
 * Converte números que vêm como string (com vírgula) ou number.
 */
function toNumber(value: string | number): number {
  if (typeof value === "number") return value;
  return Number(value.replace(/,/g, ""));
}

/* ======================================================
   NORMALIZAÇÃO PRINCIPAL
====================================================== */

/**
 * Normaliza um Hunt Analyser do Tibia.
 *
 * Responsabilidades:
 * - organizar estrutura
 * - converter tipos (string → number / Date)
 * - manter fidelidade ao dado original
 *
 * NÃO salva nada.
 * NÃO valida duplicidade.
 */
export function normalizeHunt(
  raw: string | object
): NormalizedHunt {
  console.log("[HUNT][NORMALIZE] Normalizando dados");

  const data = parseRawInput(raw);

  return {
    sessionStart: parseDate(data["Session start"]),
    sessionEnd: parseDate(data["Session end"]),
    sessionLength: data["Session length"],

    balance: toNumber(data["Balance"]),
    loot: toNumber(data["Loot"]),
    supplies: toNumber(data["Supplies"]),

    damage: toNumber(data["Damage"]),
    damagePerHour: toNumber(data["Damage/h"]),
    healing: toNumber(data["Healing"]),
    healingPerHour: toNumber(data["Healing/h"]),

    rawXpGain: toNumber(data["Raw XP Gain"]),
    rawXpPerHour: toNumber(data["Raw XP/h"]),
    xpGain: toNumber(data["XP Gain"]),
    xpPerHour: toNumber(data["XP/h"]),

    killedMonsters: data["Killed Monsters"].map(
      (monster): HuntMonster => ({
        name: monster.Name,
        count: monster.Count,
      })
    ),

    lootedItems: data["Looted Items"].map(
      (item): HuntLootItem => ({
        name: item.Name,
        count: item.Count,
      })
    ),
  };
}

/* ======================================================
   NORMALIZAÇÕES AUXILIARES (reutilizáveis)
====================================================== */

/**
 * Normaliza nomes de personagens para comparações.
 * NÃO é usado para UI.
 */
export function normalizeCharacterName(
  name: string
): string {
  return name.trim();
}
