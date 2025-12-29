import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      { error: "Token não informado" },
      { status: 401 }
    );
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return NextResponse.json(
      { error: "Token inválido" },
      { status: 401 }
    );
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    console.log("[AUTH][MIDDLEWARE] Token válido", payload);

    return NextResponse.next();
  } catch {
    return NextResponse.json(
      { error: "Token inválido ou expirado" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/api/protected/:path*"],
};
