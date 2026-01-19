import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("[ITEMS][GET] Buscando itens");

    const characters = await prisma.character.findMany({
      include: {
        huntSessions: {
          include: {
            lootedItems: true,
          },
        },
      },
    });

    const itemsByCharacter: Record<string, Record<string, number>> = {};
    const globalItems: Record<string, number> = {};

    for (const character of characters) {
      const charItems: Record<string, number> = {};

      for (const session of character.huntSessions) {
        for (const item of session.lootedItems) {
          charItems[item.name] =
            (charItems[item.name] || 0) + item.count;

          globalItems[item.name] =
            (globalItems[item.name] || 0) + item.count;
        }
      }

      itemsByCharacter[character.name] = charItems;
    }

    console.log("[ITEMS][GET] OK");

    return NextResponse.json({
      characters: itemsByCharacter,
      global: globalItems,
    });
  } catch (error) {
    console.error("[ITEMS][GET][ERROR]", error);
    return NextResponse.json(
      { error: "Failed to load items" },
      { status: 500 }
    );
  }
}
