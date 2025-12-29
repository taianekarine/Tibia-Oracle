import { NextResponse } from "next/server";
import { loginUser } from "@/services/auth.service";

export async function POST(req: Request) {
  console.log("[API] POST /auth/login");

  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 400 }
      );
    }

    const result = await loginUser({ username, password });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("[API][ERROR] /auth/login", error.message);

    return NextResponse.json(
      { error: "Credenciais inválidas" },
      { status: 401 }
    );
  }
}
