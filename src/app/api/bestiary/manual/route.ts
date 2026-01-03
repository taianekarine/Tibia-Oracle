import { NextRequest, NextResponse } from "next/server";
import { removeBestiaryManualKills } from "@/services/bestiary/removeBestiaryManualKills";

export async function DELETE(req: NextRequest) {
  const body = await req.json();

  const {
    characterName,
    monsterName,
    manualKills,
  }: {
    characterName?: string;
    monsterName?: string;
    manualKills?: number;
  } = body;

  console.log("[API] DELETE /bestiary/manual", body);

  if (
    !characterName ||
    !monsterName ||
    typeof manualKills !== "number"
  ) {
    return NextResponse.json(
      { error: "Payload inválido" },
      { status: 400 }
    );
  }

  await removeBestiaryManualKills(
    characterName,
    monsterName,
    manualKills
  );

  return NextResponse.json({ success: true });
}
