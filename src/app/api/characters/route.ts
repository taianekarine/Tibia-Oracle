import { NextResponse } from "next/server";
import { getCharacterByName } from "@/services/character/getCharacterByName";
import { createCharacter } from "@/services/character/createCharacter";
import { listCharacters } from "@/services/character/listCharacters";


export async function GET() {
  console.log("[API] GET /characters");

  const characters = await listCharacters();

  const sanitized = characters.map(({ id, ...rest }) => rest);

  return NextResponse.json(sanitized);
}

export async function POST(req: Request) {
  const { name } = await req.json();

  console.log("[API] POST /characters:", name);
  const userId = req.headers.get("x-user-id");

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

  const existing = await getCharacterByName(name);

  if (existing) {
    const { id, ...rest } = existing;
    console.log("[API] Character já cadastrado");
    return NextResponse.json({
      message: "Character já cadastrado",
      character: rest,
    });
  }

  try {
    const character = await createCharacter(name);
    const { id, ...rest } = character;

    return NextResponse.json(rest, { status: 201 });
  } catch (err: any) {
    if (err.message === "CHARACTER_NOT_FOUND") {
      return NextResponse.json(
        { message: "Character não localizado" },
        { status: 404 }
      );
    }

    throw err;
  }
}


