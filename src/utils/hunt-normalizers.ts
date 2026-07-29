const NUMERIC_VALUE = /^-?\d{1,3}(,\d{3})*$|^-?\d+$/;
const SESSION_LENGTH = /^(\d{1,3}):([0-5]\d)h$/;

export function parseHuntNumber(value: string | number, field: string): number {
  if (typeof value === "number") {
    if (!Number.isSafeInteger(value)) {
      throw new Error(`${field} deve ser um número inteiro válido`);
    }
    return value;
  }

  if (typeof value !== "string" || !NUMERIC_VALUE.test(value.trim())) {
    throw new Error(`${field} possui formato numérico inválido`);
  }

  const parsed = Number(value.replaceAll(",", ""));
  if (!Number.isSafeInteger(parsed)) {
    throw new Error(`${field} excede o limite numérico suportado`);
  }
  return parsed;
}

export function parseHuntDate(value: string, field: string): Date {
  if (typeof value !== "string") {
    throw new Error(`${field} deve ser uma data`);
  }

  const match = /^(\d{4})-(\d{2})-(\d{2}), (\d{2}):(\d{2}):(\d{2})$/.exec(value);
  if (!match) {
    throw new Error(`${field} possui formato inválido`);
  }

  const [, year, month, day, hour, minute, second] = match.map(Number);
  const date = new Date(year, month - 1, day, hour, minute, second);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute ||
    date.getSeconds() !== second
  ) {
    throw new Error(`${field} é uma data inválida`);
  }
  return date;
}

export function parseDurationSeconds(value: string): number {
  const match = SESSION_LENGTH.exec(value);
  if (!match) {
    throw new Error("Session length deve usar o formato HH:MMh");
  }
  return Number(match[1]) * 3600 + Number(match[2]) * 60;
}

export function normalizeEntityName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}
