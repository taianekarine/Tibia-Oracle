import { NextResponse } from "next/server";
import { getCharacterByName } from "@/services/character/getCharacterByName";
import { updateCharacter } from "@/services/character/updateCharacter";
import { deleteCharacter } from "@/services/character/deleteCharacter";

type RouteParams = {
  params: Promise<{ name: string }>;
};

export async function GET(
  _: Request,
  { params }: RouteParams
) {
  const { name } = await params;

  console.log("[API] GET /characters/:name", name);

  if (!name) {
    return NextResponse.json(
      { message: "Nome do character não informado" },
      { status: 400 }
    );
  }

  const character = await getCharacterByName(name);

  if (!character) {
    return NextResponse.json(
      { message: "Character não encontrado" },
      { status: 404 }
    );
  }

  const { id, ...rest } = character;
  return NextResponse.json(rest);
}

export async function PUT(
  _: Request,
  { params }: RouteParams
) {
  const { name } = await params;

  console.log("[API] PUT /characters/:name", name);

  try {
    const character = await updateCharacter(name);
    const { id, ...rest } = character;
    return NextResponse.json(rest);
  } catch {
    return NextResponse.json(
      { message: "Character não localizado" },
      { status: 404 }
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: RouteParams
) {
  const { name } = await params;

  console.log("[API] DELETE /characters/:name", name);

  await deleteCharacter(name);
  return NextResponse.json({ message: "Character deletado" });
}