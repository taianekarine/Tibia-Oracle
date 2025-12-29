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

function parseRawInput(raw: unknown): Record<string, any> {
  // Caso já seja objeto (ex: testes)
  if (typeof raw === "object" && raw !== null) {
    return raw as Record<string, any>;
  }

  // Caso venha como string (arquivo)
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch (err) {
      console.error("[HUNT][NORMALIZE] JSON inválido", err);
      throw new Error("Arquivo de hunt não é um JSON válido");
    }
  }

  throw new Error("Formato de hunt inválido");
}

export function normalizeHunt(raw: unknown) {
  console.log("[HUNT][NORMALIZE] Normalizando dados");

  const data = parseRawInput(raw);

  const toInt = (value: string | number | undefined) => {
    if (value === undefined) return 0;
    return Number(String(value).replace(/,/g, ""));
  };

  const sessionStart = parseDate(data["Session start"]);
  const sessionEnd = parseDate(data["Session end"]);

  return {
    sessionStart,
    sessionEnd,
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

    killedMonsters: data["Killed Monsters"] ?? [],
    lootedItems: data["Looted Items"] ?? [],
  };
}

export function normalizeCharacterName(name: string): string {
  return name.trim();
}
