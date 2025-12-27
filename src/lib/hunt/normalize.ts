function parseDate(value: string): Date {
  if (!value) {
    throw new Error("Data ausente no payload");
  }

  // Converte "2025-12-05, 09:27:08" → "2025-12-05T09:27:08"
  const isoLike = value.replace(", ", "T");
  const date = new Date(isoLike);

  if (isNaN(date.getTime())) {
    console.error("[HUNT][DATE_PARSE_ERROR]", value);
    throw new Error(`Data inválida recebida: ${value}`);
  }

  return date;
}

export function normalizeHuntJson(raw: any) {
  console.log("[HUNT][NORMALIZE] Normalizando dados");

  const toInt = (value: string | number | undefined) => {
    if (value === undefined) return 0;
    return Number(String(value).replace(/,/g, ""));
  };

  const sessionStart = parseDate(raw["Session start"]);
  const sessionEnd = parseDate(raw["Session end"]);

  return {
    sessionStart,
    sessionEnd,
    sessionLength: raw["Session length"],

    balance: toInt(raw["Balance"]),
    loot: toInt(raw["Loot"]),
    supplies: toInt(raw["Supplies"]),

    damage: toInt(raw["Damage"]),
    damagePerHour: toInt(raw["Damage/h"]),
    healing: toInt(raw["Healing"]),
    healingPerHour: toInt(raw["Healing/h"]),

    rawXpGain: toInt(raw["Raw XP Gain"]),
    rawXpPerHour: toInt(raw["Raw XP/h"]),
    xpGain: toInt(raw["XP Gain"]),
    xpPerHour: toInt(raw["XP/h"]),

    killedMonsters: raw["Killed Monsters"] ?? [],
    lootedItems: raw["Looted Items"] ?? [],
  };
}

export function normalizeCharacterName(name: string): string {
  return name.trim();
}
