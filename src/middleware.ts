import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não definido");
}

const secret = new TextEncoder().encode(JWT_SECRET);

export async function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      { error: "Token não informado" },
      { status: 401 }
    );
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return NextResponse.json(
      { error: "Token mal formatado" },
      { status: 401 }
    );
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    const userId = payload.userId as string;

    if (!userId) {
      return NextResponse.json(
        { error: "Token sem userId" },
        { status: 401 }
      );
    }

    console.log("[AUTH][MIDDLEWARE][JOSE] userId:", userId);

    const headers = new Headers(req.headers);
    headers.set("x-user-id", userId);

    return NextResponse.next({
      request: {
        headers,
      },
    });
  } catch (err) {
    console.error("[AUTH][MIDDLEWARE][JOSE] Erro JWT", err);

    return NextResponse.json(
      { error: "Token inválido ou expirado" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: [
    "/api/characters/:path*",
    "/api/hunt-sessions/:path*",
  ],
};
