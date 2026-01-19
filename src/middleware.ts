import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não definido");
}

const secret = new TextEncoder().encode(JWT_SECRET);

export async function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  /**
   * 🔹 REGRA 1
   * Se NÃO existe Authorization, o middleware NÃO BLOQUEIA.
   * Ele simplesmente deixa a request passar.
   */
  if (!authHeader) {
    return NextResponse.next();
  }

  const [type, token] = authHeader.split(" ");

  /**
   * 🔹 REGRA 2
   * Se o header existe mas está mal formatado,
   * também NÃO bloqueia aqui.
   * A API decide se isso é erro ou não.
   */
  if (type !== "Bearer" || !token) {
    return NextResponse.next();
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    const userId =
      (payload.userId as string) ||
      (payload.sub as string);

    if (!userId) {
      return NextResponse.next();
    }

    console.log("[AUTH][MIDDLEWARE] userId:", userId);

    /**
     * 🔹 REGRA 3
     * Middleware apenas injeta contexto.
     * NÃO faz regra de negócio.
     */
    const headers = new Headers(req.headers);
    headers.set("x-user-id", userId);

    return NextResponse.next({
      request: { headers },
    });
  } catch (err) {
    /**
     * 🔹 REGRA 4
     * Token inválido NÃO quebra a app inteira.
     * A API decide se isso é problema.
     */
    console.error("[AUTH][MIDDLEWARE] JWT inválido");
    return NextResponse.next();
  }
}

/**
 * 🔹 REGRA 5
 * Middleware só roda onde FAZ SENTIDO.
 * Não intercepta auth, nem rotas públicas.
 */
export const config = {
  matcher: [
    "/api/:path*",
    "/dashboard/:path*",
  ],
};
