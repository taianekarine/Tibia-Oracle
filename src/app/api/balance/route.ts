import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { subMonths, subDays, startOfDay } from "date-fns";

export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json(
      { error: "Usuário não autenticado" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const characterName = searchParams.get("character");

  console.log("[BALANCE][API]", { userId, characterName });

  if (characterName) {
    return characterBalance(userId, characterName);
  }

  return globalBalance(userId);
}

/* ===========================
   GLOBAL BALANCE
=========================== */
async function globalBalance(userId: string) {
  const now = new Date();
  const sixMonthsAgo = subMonths(now, 6);
  const sevenDaysAgo = startOfDay(subDays(now, 6));

  const characters = await prisma.character.findMany({
    where: { userId },
  });

  if (!characters.length) {
    return NextResponse.json({
      totalProfit: 0,
      characters: [],
      lastSixMonths: [],
      lastSevenDays: [],
    });
  }

  const characterIds = characters.map((c) => c.id);

  const sessions = await prisma.huntSession.findMany({
    where: {
      characterId: { in: characterIds },
      sessionDate: { gte: sixMonthsAgo },
    },
  });

  const charMap = new Map(
    characters.map((c) => [c.id, c])
  );

  let totalProfit = 0;

  const summary = new Map<
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

  for (const s of sessions) {
    totalProfit += s.balance;

    const char = charMap.get(s.characterId);
    if (!char) continue;

    if (!summary.has(char.name)) {
      summary.set(char.name, {
        characterName: char.name,
        level: char.level ?? 0,
        vocation: char.vocation ?? "Unknown",
        totalProfit: 0,
        totalSupplies: 0,
        totalLoot: 0,
      });
    }

    const entry = summary.get(char.name)!;
    entry.totalProfit += s.balance;
    entry.totalSupplies += s.supplies;
    entry.totalLoot += s.loot;
  }

  return NextResponse.json({
    totalProfit,
    characters: Array.from(summary.values()),
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
async function characterBalance(
  userId: string,
  characterName: string
) {
  const now = new Date();
  const sixMonthsAgo = subMonths(now, 6);
  const sevenDaysAgo = startOfDay(subDays(now, 6));

  const character = await prisma.character.findFirst({
    where: { name: characterName, userId },
  });

  if (!character) {
    return NextResponse.json(
      { error: "Personagem não encontrado" },
      { status: 404 }
    );
  }

  const sessions = await prisma.huntSession.findMany({
    where: {
      characterId: character.id,
      sessionDate: { gte: sixMonthsAgo },
    },
  });

  return NextResponse.json({
    characterName: character.name,
    level: character.level ?? 0,
    vocation: character.vocation ?? "Unknown",
    totalProfit: sum(sessions, "balance"),
    totalSupplies: sum(sessions, "supplies"),
    totalLoot: sum(sessions, "loot"),
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
function sum<T extends Record<string, number>>(
  items: T[],
  key: keyof T
) {
  return items.reduce((acc, i) => acc + i[key], 0);
}

function aggregateByMonth(
  sessions: {
    sessionDate: Date;
    balance: number;
    supplies: number;
  }[]
) {
  const map = new Map<
    string,
    { profit: number; supplies: number }
  >();

  for (const s of sessions) {
    const key = s.sessionDate.toISOString().slice(0, 7);
    if (!map.has(key)) {
      map.set(key, { profit: 0, supplies: 0 });
    }
    map.get(key)!.profit += s.balance;
    map.get(key)!.supplies += s.supplies;
  }

  return Array.from(map.entries()).map(
    ([date, v]) => ({ date, ...v })
  );
}

function aggregateByDay(
  sessions: {
    sessionDate: Date;
    balance: number;
    supplies: number;
  }[]
) {
  const map = new Map<
    string,
    { profit: number; supplies: number }
  >();

  for (const s of sessions) {
    const key = s.sessionDate
      .toISOString()
      .slice(0, 10);
    if (!map.has(key)) {
      map.set(key, { profit: 0, supplies: 0 });
    }
    map.get(key)!.profit += s.balance;
    map.get(key)!.supplies += s.supplies;
  }

  return Array.from(map.entries()).map(
    ([date, v]) => ({ date, ...v })
  );
}
