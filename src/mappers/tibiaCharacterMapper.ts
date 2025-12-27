export function mapTibiaCharacterToPrisma(character: any) {
  console.log("[MAPPER] Convertendo dados da API");

  return {
    name: character.name,
    world: character.world ?? null,
    vocation: character.vocation ?? null,
    level: character.level ?? null,
    experience: character.experience
      ? BigInt(character.experience)
      : null,
    residence: character.residence ?? null,
    sex: character.sex ?? null,
    accountStatus: character.account_status ?? null,
    achievementPoints: character.achievement_points ?? null,
    guild: character.guild?.name ?? null,
    lastSyncedAt: new Date(),
  };
}
