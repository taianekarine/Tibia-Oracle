import { prisma } from "@/lib/prisma";
import monstersData from "@/data/monsters_data.json";

type BestiaryMonster = {
  name: string;
  type: string;
  charms: number;
  killComplete: number;
  image: string;
  totalKilled: number;
  manualKilled: number;
  completed: boolean;
};

export type BestiaryByType = Record<string, BestiaryMonster[]>;

export async function getConsolidatedBestiary(characterName: string): Promise<BestiaryByType> {
  console.log("[BESTIARY] Carregando bestiário", characterName);

  if (!characterName) {
    throw new Error("characterName é obrigatório");
  }

  // 1️⃣ Resolver characterId
  const character = await prisma.character.findUnique({
    where: { name: characterName },
    select: { id: true },
  });

  if (!character) {
    throw new Error("Personagem não encontrado");
  }

  const characterId = character.id;

  // 2️⃣ Kills automáticos (hunt analyser)
  const killedFromHunts = await prisma.huntKilledMonster.findMany({
    where: {
      huntSession: {
        characterId,
      },
    },
    select: {
      name: true,
      count: true,
    },
  });

  const huntKillsMap = new Map<string, number>();

  for (const entry of killedFromHunts) {
    const name = entry.name.trim().toLowerCase();
    huntKillsMap.set(name, (huntKillsMap.get(name) ?? 0) + entry.count);
  }

  // 3️⃣ Kills manuais (override)
  const manualOverrides = await prisma.characterBestiaryOverride.findMany({
    where: { characterId },
    select: {
      monsterName: true,
      manualKills: true,
    },
  });

  const manualKillsMap = new Map<string, number>();

  for (const override of manualOverrides) {
    const name = override.monsterName.trim().toLowerCase();
    manualKillsMap.set(name, override.manualKills);
  }

  // 4️⃣ Consolidar com catálogo
  const bestiaryByType: BestiaryByType = {};

  for (const monster of monstersData) {
    const normalizedName = monster.name.trim().toLowerCase();

    const huntKills = huntKillsMap.get(normalizedName) ?? 0;
    const manualKills = manualKillsMap.get(normalizedName) ?? 0;

    const totalKilled = huntKills + manualKills;
    const completed = totalKilled >= monster.kill_complete_bestiary;

    const entry: BestiaryMonster = {
      name: monster.name,
      type: monster.type,
      charms: monster.charms,
      killComplete: monster.kill_complete_bestiary,
      image:
        monster.image ??
        `https://tibiadraptor.com/images/monsters/${monster.name.replace(/ /g, "_")}.png`,
      totalKilled,
      manualKilled: manualKills,
      completed,
    };

    if (!bestiaryByType[monster.type]) {
      bestiaryByType[monster.type] = [];
    }

    bestiaryByType[monster.type].push(entry);
  }

  console.log("[BESTIARY] Bestiário consolidado pronto");

  return bestiaryByType;
}
