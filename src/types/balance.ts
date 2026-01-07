export type BalancePeriod = {
  date: string; // YYYY-MM-DD ou YYYY-MM
  profit: number;
  supplies: number;
};

export type CharacterBalanceSummary = {
  characterName: string;
  level: number;
  vocation: string;
  totalProfit: number;
  totalLoot: number;
  totalSupplies: number;
};


export type BalanceGlobalResponse = {
  totalProfit: number;
  totalLoot: number;
  characters: CharacterBalanceSummary[];
  lastSixMonths: BalancePeriod[];
  lastSevenDays: BalancePeriod[];
};

export type BalanceCharacterResponse = {
  characterName: string;
  level: number;
  vocation: string;
  totalProfit: number;
  totalLoot: number;
  totalSupplies: number;
  lastSixMonths: BalancePeriod[];
  lastSevenDays: BalancePeriod[];
};
