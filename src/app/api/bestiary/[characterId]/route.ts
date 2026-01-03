import { NextResponse } from "next/server";
import { getConsolidatedBestiary } from "@/services/bestiary/getConsolidatedBestiary";

export async function GET(
  _req: Request,
  context: { params: Promise<{ characterId: string }> }
) {
  const { characterId } = await context.params;

  console.log("[API] GET /bestiary", characterId);

  const data = await getConsolidatedBestiary(characterId);

  return NextResponse.json(data);
}
