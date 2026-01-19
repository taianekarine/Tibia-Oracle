import { NextResponse } from "next/server";
import { createHuntSession } from "@/services/hunt-session/createHuntSession";

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

  /**
   * 🔐 Aqui é o ponto-chave:
   * File.text() SEMPRE retorna string.
   * A partir daqui, rawData é oficialmente string.
   */
  const rawData: string = await file.text();

  if (!rawData.trim()) {
    return NextResponse.json(
      { error: "Arquivo de hunt vazio" },
      { status: 400 }
    );
  }

  try {
    const huntSession = await createHuntSession({
      userId,
      characterName,
      rawData, // agora é string, não unknown
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
