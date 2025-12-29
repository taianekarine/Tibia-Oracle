import jwt from "jsonwebtoken";
import { getUserByUsername } from "./user.service";
import { comparePassword } from "./password.service";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não definido no ambiente");
}

type LoginInput = {
  username: string;
  password: string;
};

export async function loginUser(input: LoginInput) {
  console.log("[AUTH][LOGIN] Tentativa de login");

  const username = input.username.trim().toLowerCase();
  const password = input.password;

  if (!username || !password) {
    throw new Error("Credenciais inválidas");
  }

  const user = await getUserByUsername(username);

  if (!user) {
    throw new Error("Credenciais inválidas");
  }

  const passwordValid = await comparePassword(
    password,
    user.passwordHash
  );

  if (!passwordValid) {
    throw new Error("Credenciais inválidas");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  console.log("[AUTH][LOGIN] Login realizado com sucesso", user.id);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
    },
  };
}
