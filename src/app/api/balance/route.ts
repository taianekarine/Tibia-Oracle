import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfDay, subDays, subMonths } from "date-fns";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const characterName = searchParams.get("character");

  console.log("[BALANCE][API] Request", { characterName });

  if (characterName) {
    return characterBalance(characterName);
  }

  return globalBalance();
}

/* ===========================
   GLOBAL BALANCE
=========================== */
async function globalBalance() {
  const now = new Date();
  const sixMonthsAgo = subMonths(now, 6);
  const sevenDaysAgo = startOfDay(subDays(now, 6));

  const sessions = await prisma.huntSession.findMany({
    where: {
      sessionDate: {
        gte: sixMonthsAgo,
      },
    },
  });

  const characters = await prisma.character.findMany();

  const characterMap = new Map(
    characters.map((c) => [c.id, c])
  );

  let totalProfit = 0;

  const summaryMap = new Map<
    string,
    {
      characterName: string;
      level: number;
      vocation: string;
      totalProfit: number;
      totalSupplies: number;
      totalLoot: number;
    }
  >();

  for (const session of sessions) {
    totalProfit += session.balance;

    const char = characterMap.get(session.characterId);
    if (!char) continue;

    if (!summaryMap.has(char.name)) {
      summaryMap.set(char.name, {
        characterName: char.name,
        level: char.level ?? 0,
        vocation: char.vocation ?? "Unknown",
        totalProfit: 0,
        totalSupplies: 0,
        totalLoot: 0,
      });
    }

    const entry = summaryMap.get(char.name)!;
    entry.totalProfit += session.balance;
    entry.totalSupplies += session.supplies;
    entry.totalLoot += session.loot; 
  }

  return NextResponse.json({
    totalProfit,
    characters: Array.from(summaryMap.values()),
    lastSixMonths: aggregateByMonth(sessions),
    lastSevenDays: aggregateByDay(
      sessions.filter(
        (s) => s.sessionDate >= sevenDaysAgo
      )
    ),
  });
}

/* ===========================
   CHARACTER BALANCE
=========================== */
async function characterBalance(characterName: string) {
  const now = new Date();
  const sixMonthsAgo = subMonths(now, 6);
  const sevenDaysAgo = startOfDay(subDays(now, 6));

  const character = await prisma.character.findUnique({
    where: { name: characterName },
  });

  if (!character) {
    return NextResponse.json({
      characterName,
      level: 0,
      vocation: "Unknown",
      totalProfit: 0,
      totalSupplies: 0,
      lastSixMonths: [],
      lastSevenDays: [],
    });
  }

  const sessions = await prisma.huntSession.findMany({
    where: {
      characterId: character.id,
      sessionDate: {
        gte: sixMonthsAgo,
      },
    },
  });

  const totalProfit = sessions.reduce(
    (acc, s) => acc + s.balance,
    0
  );

  const totalSupplies = sessions.reduce(
    (acc, s) => acc + s.supplies,
    0
  );

  const totalLoot = sessions.reduce(
    (acc, s) => acc + s.loot,
    0
  );


  return NextResponse.json({
    characterName: character.name,
    level: character.level ?? 0,
    vocation: character.vocation ?? "Unknown",
    totalProfit,
    totalSupplies,
    totalLoot,
    lastSixMonths: aggregateByMonth(sessions),
    lastSevenDays: aggregateByDay(
      sessions.filter(
        (s) => s.sessionDate >= sevenDaysAgo
      )
    ),
  });
}

/* ===========================
   HELPERS
=========================== */
function aggregateByMonth(
  sessions: Array<{
    sessionDate: Date;
    balance: number;
    supplies: number;
  }>
) {
  const map = new Map<
    string,
    { profit: number; supplies: number }
  >();

  for (const s of sessions) {
    const key = s.sessionDate
      .toISOString()
      .slice(0, 7); // YYYY-MM

    if (!map.has(key)) {
      map.set(key, { profit: 0, supplies: 0 });
    }

    map.get(key)!.profit += s.balance;
    map.get(key)!.supplies += s.supplies;
  }

  return Array.from(map.entries()).map(
    ([date, values]) => ({
      date,
      ...values,
    })
  );
}

function aggregateByDay(
  sessions: Array<{
    sessionDate: Date;
    balance: number;
    supplies: number;
  }>
) {
  const map = new Map<
    string,
    { profit: number; supplies: number }
  >();

  for (const s of sessions) {
    const key = s.sessionDate
      .toISOString()
      .slice(0, 10); // YYYY-MM-DD

    if (!map.has(key)) {
      map.set(key, { profit: 0, supplies: 0 });
    }

    map.get(key)!.profit += s.balance;
    map.get(key)!.supplies += s.supplies;
  }

  return Array.from(map.entries()).map(
    ([date, values]) => ({
      date,
      ...values,
    })
  );
}
