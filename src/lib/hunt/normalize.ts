import type { HuntLootItem, HuntMonster, NormalizedHunt, RawHunt } from "@/types/hunt";
import {
  normalizeEntityName,
  parseDurationSeconds,
  parseHuntDate,
  parseHuntNumber,
} from "@/utils/hunt-normalizers";

function aggregateEntries(
  entries: Array<{ Name: string; Count: number }>
): Array<{ name: string; count: number }> {
  const totals = new Map<string, number>();
  for (const entry of entries) {
    const name = normalizeEntityName(entry.Name);
    totals.set(name, (totals.get(name) ?? 0) + entry.Count);
  }
  return Array.from(totals, ([name, count]) => ({ name, count }));
}

export function normalizeHunt(data: RawHunt): NormalizedHunt {
  console.log("[IMPORT] Normalizando Hunt Analyzer");

  const sessionStart = parseHuntDate(data["Session start"], "Session start");
  const sessionEnd = parseHuntDate(data["Session end"], "Session end");
  if (sessionEnd <= sessionStart) {
    throw new Error("Session end deve ser posterior a Session start");
  }

  return {
    sessionStart,
    sessionEnd,
    sessionLengthSeconds: parseDurationSeconds(data["Session length"]),
    balance: parseHuntNumber(data.Balance, "Balance"),
    loot: parseHuntNumber(data.Loot, "Loot"),
    supplies: parseHuntNumber(data.Supplies, "Supplies"),
    damage: parseHuntNumber(data.Damage, "Damage"),
    damagePerHour: parseHuntNumber(data["Damage/h"], "Damage/h"),
    healing: parseHuntNumber(data.Healing, "Healing"),
    healingPerHour: parseHuntNumber(data["Healing/h"], "Healing/h"),
    rawXpGain: parseHuntNumber(data["Raw XP Gain"], "Raw XP Gain"),
    rawXpPerHour: parseHuntNumber(data["Raw XP/h"], "Raw XP/h"),
    xpGain: parseHuntNumber(data["XP Gain"], "XP Gain"),
    xpPerHour: parseHuntNumber(data["XP/h"], "XP/h"),
    killedMonsters: aggregateEntries(data["Killed Monsters"]) as HuntMonster[],
    lootedItems: aggregateEntries(data["Looted Items"]) as HuntLootItem[],
  };
}

export function normalizeCharacterName(name: string): string {
  return name.trim();
}
