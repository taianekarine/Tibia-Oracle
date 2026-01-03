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

  await removeBestiaryManualKills(body.characterName, body.monsterName);
  return NextResponse.json({ ok: true });
}
