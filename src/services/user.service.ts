import { prisma } from "@/lib/prisma";
import { hashPassword } from "./password.service";

type CreateUserInput = {
  name: string;
  username: string;
  password: string;
};

function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

export async function createUser(input: CreateUserInput) {
  console.log("[USER][CREATE] Payload recebido", input);

  const name = input.name.trim();
  const username = normalizeUsername(input.username);
  const password = input.password;

  if (!name || !username || !password) {
    throw new Error("Campos obrigatórios não informados");
  }

  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    throw new Error("Username já em uso");
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      username,
      passwordHash,
    },
  });

  console.log("[USER][CREATE] Usuário criado", user.id);

  return {
    id: user.id,
    name: user.name,
    username: user.username,
  };
}

export async function getUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: {
      username: username.trim().toLowerCase(),
    },
  });
}
