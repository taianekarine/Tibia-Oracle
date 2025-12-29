import { NextResponse } from "next/server";
import { getCharacterByName } from "@/services/character/getCharacterByName";
import { createCharacter } from "@/services/character/createCharacter";
import { listCharacters } from "@/services/character/listCharacters";

export async function GET(req: Request) {
  console.log("[API] GET /characters");

  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json(
      { error: "Usuário não autenticado" },
      { status: 401 }
    );
  }

  const characters = await listCharacters(userId);

  const sanitized = characters.map(({ id: _id, ...rest }) => rest);
  return NextResponse.json(sanitized);
}

export async function POST(req: Request) {
  const userId = req.headers.get("x-user-id");
  const body = await req.json();
  const name = body?.name as string | undefined;

  console.log("[API] POST /characters:", name, "user:", userId);

  if (!userId) {
    return NextResponse.json(
      { error: "Usuário não autenticado" },
      { status: 401 }
    );
  }

  if (!name) {
    return NextResponse.json(
      { message: "Name is required" },
      { status: 400 }
    );
  }

  const existing = await getCharacterByName({ userId, name });

  if (existing) {
    const { id: _id, ...rest } = existing;
    return NextResponse.json({
      message: "Character já cadastrado",
      character: rest,
    });
  }

  try {
    const character = await createCharacter({ userId, name });
    const { id: _id, ...rest } = character;
    return NextResponse.json(rest, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "CHARACTER_NOT_FOUND") {
      return NextResponse.json(
        { message: "Character não localizado" },
        { status: 404 }
      );
    }

    throw err;
  }
}
