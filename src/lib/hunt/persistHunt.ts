import { prisma } from "@/lib/prisma";
import { NormalizedHunt } from "@/types/hunt";

type CountableItem = {
  name: string;
  count: number;
};

export async function persistHunt(
  characterId: string,
  data: NormalizedHunt
) {
  console.log("[HUNT][PERSIST] Salvando hunt session");

  return prisma.$transaction(async (tx) => {
    const hunt = await tx.huntSession.create({
      data: {
        characterId,
        sessionDate: data.sessionStart,

        sessionStart: data.sessionStart,
        sessionEnd: data.sessionEnd,
        sessionLength: data.sessionLength,

        balance: data.balance,
        loot: data.loot,
        supplies: data.supplies,

        damage: data.damage,
        damagePerHour: data.damagePerHour,
        healing: data.healing,
        healingPerHour: data.healingPerHour,

        rawXpGain: data.rawXpGain,
        rawXpPerHour: data.rawXpPerHour,
        xpGain: data.xpGain,
        xpPerHour: data.xpPerHour,
      },
    });

    function aggregate(items: CountableItem[]): CountableItem[] {
      const map = new Map<string, number>();

      for (const item of items) {
        if (!item.name || item.count <= 0) continue;

        map.set(
          item.name,
          (map.get(item.name) ?? 0) + item.count
        );
      }

      return Array.from(map.entries()).map(
        ([name, count]) => ({ name, count })
      );
    }

    const monsters = aggregate(data.killedMonsters);
    for (const monster of monsters) {
      await tx.huntKilledMonster.create({
        data: {
          huntSessionId: hunt.id,
          name: monster.name,
          count: monster.count,
        },
      });
    }

    const items = aggregate(data.lootedItems);
    for (const item of items) {
      await tx.huntLootedItem.create({
        data: {
          huntSessionId: hunt.id,
          name: item.name,
          count: item.count,
        },
      });
    }

    return hunt;
  });
}
