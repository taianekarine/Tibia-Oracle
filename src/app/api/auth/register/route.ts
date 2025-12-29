import { NextResponse } from "next/server";
import { createUser } from "@/services/user.service";

export async function POST(req: Request) {
  console.log("[API] POST /auth/register");

  try {
    const body = await req.json();

    const { name, username, password } = body;

    if (!name || !username || !password) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes" },
        { status: 400 }
      );
    }

    const user = await createUser({ name, username, password });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error("[API][ERROR] /auth/register", error.message);

    return NextResponse.json(
      { error: error.message ?? "Erro ao criar usuário" },
      { status: 400 }
    );
  }
}
