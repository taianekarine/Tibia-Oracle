import { PrismaClient } from "../src/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export async function main() {
  await prisma.huntSession.create({
    data: {
      sessionStart: new Date("2025-12-05T09:27:08"),
      sessionEnd: new Date("2025-12-05T14:34:42"),
      sessionLengthSeconds: 18420,

      balance: 813820,
      loot: 1061096,
      supplies: 247276,

      damage: 4200571,
      damagePerHour: 1208840,
      healing: 607251,
      healingPerHour: 154554,

      rawXpGain: 3325811,
      rawXpPerHour: 884159,
      xpGain: 3649938,
      xpPerHour: 884159,

      killedMonsters: {
        create: [
          { name: "assassin", count: 176 },
          { name: "frost giant", count: 136 },
          { name: "sea serpent", count: 136 }
        ]
      },

      lootedItems: {
        create: [
          { name: "a gold coin", count: 164429 },
          { name: "a platinum coin", count: 1086 },
          { name: "a strong mana potion", count: 37 }
        ]
      }
    }
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
