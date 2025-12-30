import {
  NormalizedHunt,
  HuntMonster,
  HuntLootItem,
} from "@/types/hunt";

/**
 * Estrutura mínima esperada do analyser.
 * Tudo é string ou número porque é isso que o Tibia gera.
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

/* -------------------------------------------------- */
/* Parse externo (único lugar flexível)               */
/* -------------------------------------------------- */

function parseRawInput(raw: string | object): RawHuntData {
  const parsed =
    typeof raw === "string" ? JSON.parse(raw) : raw;

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Hunt analyser inválido");
  }

  return parsed as RawHuntData;
}

/* -------------------------------------------------- */
/* Utils determinísticos                              */
/* -------------------------------------------------- */

function parseDate(value: string): Date {
  const isoLike = value.replace(", ", "T");
  const date = new Date(isoLike);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Data inválida: ${value}`);
  }

  return date;
}

function toInt(value: string | number): number {
  if (typeof value === "number") return value;
  return Number(value.replace(/,/g, ""));
}

/* -------------------------------------------------- */
/* Normalização principal                             */
/* -------------------------------------------------- */

export function normalizeHunt(
  raw: string | object
): NormalizedHunt {
  console.log("[HUNT][NORMALIZE] Normalizando dados");

  const data = parseRawInput(raw);

  return {
    sessionStart: parseDate(data["Session start"]),
    sessionEnd: parseDate(data["Session end"]),
    sessionLength: data["Session length"],

    balance: toInt(data["Balance"]),
    loot: toInt(data["Loot"]),
    supplies: toInt(data["Supplies"]),

    damage: toInt(data["Damage"]),
    damagePerHour: toInt(data["Damage/h"]),
    healing: toInt(data["Healing"]),
    healingPerHour: toInt(data["Healing/h"]),

    rawXpGain: toInt(data["Raw XP Gain"]),
    rawXpPerHour: toInt(data["Raw XP/h"]),
    xpGain: toInt(data["XP Gain"]),
    xpPerHour: toInt(data["XP/h"]),

    killedMonsters: data["Killed Monsters"].map(
      (m): HuntMonster => ({
        name: m.Name,
        count: m.Count,
      })
    ),

    lootedItems: data["Looted Items"].map(
      (i): HuntLootItem => ({
        name: i.Name,
        count: i.Count,
      })
    ),
  };
}

/* -------------------------------------------------- */
/* Normalização de nome                               */
/* -------------------------------------------------- */

export function normalizeCharacterName(
  name: string
): string {
  return name.trim();
}
