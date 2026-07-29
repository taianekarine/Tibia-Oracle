import { NextResponse } from "next/server";
import { createHuntSession } from "@/services/hunt-session/createHuntSession";

async function readPayload(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File) || !file.name.toLowerCase().endsWith(".json")) {
      throw new Error("Envie um arquivo .json válido");
    }
    return JSON.parse(await file.text());
  }

  if (contentType.includes("application/json")) {
    return request.json();
  }

  const text = await request.text();
  if (!text.trim()) {
    throw new Error("Hunt Analyzer não informado");
  }
  return JSON.parse(text);
}

export async function importHuntController(request: Request) {
  console.log("[IMPORT] JSON recebido");

  try {
    const userId = request.headers.get("x-user-id");
    const characterName = request.headers.get("x-character-name");
    if (!userId) {
      return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
    }
    if (!characterName?.trim()) {
      return NextResponse.json({ error: "Personagem não informado" }, { status: 400 });
    }

    const payload = await readPayload(request);
    const hunt = await createHuntSession({ userId, characterName, payload });
    return NextResponse.json(hunt, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    console.error("[IMPORT][ERROR]", message);
    const status =
      message === "CHARACTER_NOT_FOUND" ? 403 :
      error instanceof SyntaxError ? 400 : 422;
    return NextResponse.json({ error: message }, { status });
  }
}
