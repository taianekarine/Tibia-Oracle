import { prisma } from "@/lib/prisma";
import type { NormalizedHunt } from "@/types/hunt";

export async function createHunt(characterId: string, data: NormalizedHunt) {
  return prisma.$transaction(async (tx) => {
    const hunt = await tx.huntSession.create({
      data: {
        characterId,
        sessionDate: data.sessionStart,
        sessionStart: data.sessionStart,
        sessionEnd: data.sessionEnd,
        sessionLengthSeconds: data.sessionLengthSeconds,
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

    if (data.killedMonsters.length) {
      await tx.huntKilledMonster.createMany({
        data: data.killedMonsters.map((monster) => ({
          huntSessionId: hunt.id,
          ...monster,
        })),
      });
    }

    if (data.lootedItems.length) {
      await tx.huntLootedItem.createMany({
        data: data.lootedItems.map((item) => ({
          huntSessionId: hunt.id,
          ...item,
        })),
      });
    }

    return hunt;
  });
}
