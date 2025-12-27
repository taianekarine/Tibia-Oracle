import { NextRequest, NextResponse } from "next/server";
import { parseTextToJson } from "@/lib/hunt/parseTextToJson";
import { normalizeHuntJson } from "@/lib/hunt/normalize";
import { validateHunt } from "@/lib/hunt/validateHunt";
import { persistHunt } from "@/lib/hunt/persistHunt";

export async function POST(req: NextRequest) {
  console.log("[API] POST /hunt-sessions");

    const characterName = req.headers.get("x-character-name");

     console.log("[API] x-character-name:", characterName);

    if (!characterName || characterName.trim() === "") {
      return NextResponse.json(
        { error: "Header x-character-name é obrigatório" },
        { status: 400 }
      );
    }

  try {
    const characterName = req.headers.get("x-character-name");

    if (!characterName) {
      return NextResponse.json(
        { error: "Header x-character-name é obrigatório" },
        { status: 400 }
      );
    }

    const contentType = req.headers.get("content-type") || "";
    let payload: any;

    // 1️⃣ MULTIPART (UPLOAD DE ARQUIVO)
    if (contentType.includes("multipart/form-data")) {
      console.log("[API] Payload recebido como MULTIPART");

      const formData = await req.formData();
      const file = formData.get("file");

      if (!file || !(file instanceof File)) {
        throw new Error("Arquivo .json não encontrado no form-data");
      }

      if (!file.name.endsWith(".json")) {
        throw new Error("Apenas arquivos .json são permitidos");
      }

      const text = await file.text();
      payload = JSON.parse(text);
    }

    // 2️⃣ JSON PURO
    else if (contentType.includes("application/json")) {
      console.log("[API] Payload recebido como JSON");
      payload = await req.json();
    }

    // 3️⃣ TEXTO CRU
    else {
      console.log("[API] Payload recebido como TEXTO");
      const text = await req.text();
      payload = parseTextToJson(text);
    }

    const normalized = normalizeHuntJson(payload);

    const character = await validateHunt({
      characterName,
      data: {
        sessionStart: normalized.sessionStart,
        sessionEnd: normalized.sessionEnd,
        sessionLength: normalized.sessionLength,
        xpGain: normalized.xpGain,
        rawXpGain: normalized.rawXpGain,
        loot: normalized.loot,
        supplies: normalized.supplies,
        balance: normalized.balance,
      },
    });


    const hunt = await persistHunt(character.id, normalized);

    return NextResponse.json({ success: true, hunt });
  } catch (error: any) {
    console.error("[API][ERROR]", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
