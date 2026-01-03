import { NextResponse } from "next/server";
import { setBestiaryManualKills } from "@/services/bestiary/setBestiaryManualKills";
import { removeBestiaryManualKills } from "@/services/bestiary/removeBestiaryManualKills";

export async function POST(req: Request) {
  const body = await req.json();

  console.log("[API] POST /bestiary/manual", body);

  const result = await setBestiaryManualKills(body);
  return NextResponse.json(result);
}

export async function DELETE(req: Request) {
  const body = await req.json();

  console.log("[API] DELETE /bestiary/manual", body);

  const { characterName, monsterName, manualKills } = body;

  if (
    typeof characterName !== "string" ||
    typeof monsterName !== "string" ||
    typeof manualKills !== "number"
  ) {
    return new Response("Payload inválido", { status: 400 });
  }

  await removeBestiaryManualKills(
    characterName,
    monsterName,
    manualKills
  );

  return new Response(null, { status: 204 });
}
