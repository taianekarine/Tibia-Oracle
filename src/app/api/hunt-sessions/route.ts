import { NextResponse } from "next/server";
import { createHuntSession } from "@/services/hunt-session/createHuntSession";
import { listHuntSessions } from "@/services/hunt-session/listHuntSessions";


export async function POST(req: Request) {
  console.log("[API] POST /hunt-sessions");

  const userId = req.headers.get("x-user-id");
  const characterName = req.headers.get("x-character-name");

  if (!userId) {
    return NextResponse.json(
      { error: "Usuário não autenticado" },
      { status: 401 }
    );
  }

  if (!characterName) {
    return NextResponse.json(
      { error: "Character não informado" },
      { status: 400 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Arquivo de hunt não enviado" },
      { status: 400 }
    );
  }

  const rawText = await file.text();

  try {
    const huntSession = await createHuntSession({
      userId,
      characterName,
      rawData: rawText,
    });

    return NextResponse.json(huntSession, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message === "CHARACTER_NOT_FOUND") {
        return NextResponse.json(
          { error: "Character não pertence ao usuário" },
          { status: 403 }
        );
      }

      if (err.name === "SyntaxError") {
        return NextResponse.json(
          { error: "Arquivo de hunt inválido ou corrompido" },
          { status: 400 }
        );
      }
    }

    throw err;
  }
}

export async function GET(req: Request) {
  console.log("[API] GET /hunt-sessions");

  const userId = req.headers.get("x-user-id");
  const characterName = req.headers.get("x-character-name");

  if (!userId) {
    return NextResponse.json(
      { error: "Usuário não autenticado" },
      { status: 401 }
    );
  }

  if (!characterName) {
    return NextResponse.json(
      { error: "Character não informado" },
      { status: 400 }
    );
  }

  try {
    const hunts = await listHuntSessions({
      userId,
      characterName,
    });

    return NextResponse.json(hunts);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "CHARACTER_NOT_FOUND") {
      return NextResponse.json(
        { error: "Character não pertence ao usuário" },
        { status: 403 }
      );
    }

    throw err;
  }
}
