import { NextResponse } from "next/server";
import { getCharacterByName } from "@/services/character/getCharacterByName";
import { updateCharacter } from "@/services/character/updateCharacter";
import { deleteCharacter } from "@/services/character/deleteCharacter";

type RouteParams = {
  params: Promise<{ name: string }>;
};

export async function GET(
  req: Request,
  { params }: RouteParams
) {
  const { name } = await params;
  const userId = req.headers.get("x-user-id");

  console.log("[API] GET /characters/:name", name, "user:", userId);

  if (!userId) {
    return NextResponse.json(
      { error: "Usuário não autenticado" },
      { status: 401 }
    );
  }

  if (!name) {
    return NextResponse.json(
      { message: "Nome do character não informado" },
      { status: 400 }
    );
  }

  const character = await getCharacterByName({
    userId,
    name,
  });

  if (!character) {
    return NextResponse.json(
      { message: "Character não encontrado" },
      { status: 404 }
    );
  }

  const { id: _id, ...rest } = character;

  return NextResponse.json(rest);
}

export async function PUT(
  req: Request,
  { params }: RouteParams
) {
  const { name } = await params;
  const userId = req.headers.get("x-user-id");

  console.log("[API] PUT /characters/:name", name, "user:", userId);

  if (!userId) {
    return NextResponse.json(
      { error: "Usuário não autenticado" },
      { status: 401 }
    );
  }

  try {
    const character = await updateCharacter({
      userId,
      name,
    });
    const {...rest } = character;

    return NextResponse.json(rest);
  } catch {
    return NextResponse.json(
      { message: "Character não localizado" },
      { status: 404 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: RouteParams
) {
  const { name } = await params;
  const userId = req.headers.get("x-user-id");

  console.log("[API] DELETE /characters/:name", name, "user:", userId);

  if (!userId) {
    return NextResponse.json(
      { error: "Usuário não autenticado" },
      { status: 401 }
    );
  }

  await deleteCharacter({
    userId,
    name,
  });

  return NextResponse.json({ message: "Character deletado" });
}
